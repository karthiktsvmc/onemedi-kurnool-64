import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { PageLoader } from '@/frontend/components/Common/PageLoader';
import { useToast } from '@/shared/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ 
  children, 
  requiredRole = ['admin', 'super_admin'] 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!loading && user) {
        try {
          const { data: userRoles, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id);

          if (error || !userRoles || userRoles.length === 0) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin panel.",
              variant: "destructive",
            });
            navigate('/', { replace: true });
            return;
          }

          const hasRequiredRole = userRoles.some(roleData => 
            requiredRole.includes(roleData.role)
          );

          if (!hasRequiredRole) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to access the admin panel.",
              variant: "destructive",
            });
            navigate('/', { replace: true });
            return;
          }
        } catch (error) {
          console.error('Error checking admin access:', error);
          navigate('/', { replace: true });
        }
      } else if (!loading && !user) {
        navigate('/auth', { 
          state: { returnUrl: location.pathname + location.search },
          replace: true 
        });
      }
    };

    checkAdminAccess();
  }, [user, loading, navigate, location, requiredRole, toast]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return <PageLoader />;
  }

  return <>{children}</>;
};