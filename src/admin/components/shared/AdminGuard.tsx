import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PageLoader } from '@/frontend/components/Common/PageLoader';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Shield } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { user, loading: authLoading } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkPermissions = async () => {
      if (!user) {
        setHasAccess(false);
        return;
      }

      try {
        // Check user role
        const { data: roleData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error || !roleData) {
          setHasAccess(false);
          return;
        }

        setUserRole(roleData.role);

        // Check if user has admin access
        const adminRoles = ['admin', 'super_admin'];
        const hasAdminRole = adminRoles.includes(roleData.role);

        if (!hasAdminRole) {
          setHasAccess(false);
          return;
        }

        // Check specific permissions if required
        if (requiredPermissions.length > 0) {
          // Here you can add more granular permission checking
          // For now, admin and super_admin have all permissions
          const hasSuperAdmin = roleData.role === 'super_admin';
          setHasAccess(hasSuperAdmin || requiredPermissions.every(perm => 
            perm === 'read' || (perm === 'write' && roleData.role === 'admin')
          ));
        } else {
          setHasAccess(true);
        }

      } catch (error) {
        console.error('Error checking permissions:', error);
        setHasAccess(false);
      }
    };

    if (!authLoading) {
      checkPermissions();
    }
  }, [user, authLoading, requiredPermissions]);

  if (authLoading || hasAccess === null) {
    return <PageLoader />;
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertDescription className="mt-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Access Denied</h3>
                <p>You don't have permission to access the admin panel.</p>
                {userRole && (
                  <p className="text-sm">Current role: <span className="font-mono">{userRole}</span></p>
                )}
                <p className="text-sm">Please contact your administrator for access.</p>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};