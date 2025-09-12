import { useState, useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type AdminPermission = 
  | 'users_read' | 'users_write' | 'users_delete'
  | 'orders_read' | 'orders_write' | 'orders_cancel' | 'orders_refund'
  | 'inventory_read' | 'inventory_write' | 'inventory_delete'
  | 'analytics_read' | 'analytics_export'
  | 'settings_read' | 'settings_write'
  | 'security_read' | 'security_write'
  | 'vendors_read' | 'vendors_write' | 'vendors_approve'
  | 'payments_read' | 'payments_process' | 'payments_refund'
  | 'marketing_read' | 'marketing_write' | 'marketing_send'
  | 'reports_read' | 'reports_generate' | 'reports_export'
  | 'system_admin' | 'audit_logs_read';

interface UserPermissions {
  permissions: AdminPermission[];
  roles: string[];
  loading: boolean;
}

export const useAdminPermissions = (): UserPermissions => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        // Get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (rolesError) throw rolesError;

        const userRolesList = userRoles.map(r => r.role);
        setRoles(userRolesList);

        // Define permissions based on roles
        let allPermissions: AdminPermission[] = [];

        if (userRolesList.includes('super_admin')) {
          allPermissions = [
            'users_read', 'users_write', 'users_delete',
            'orders_read', 'orders_write', 'orders_cancel', 'orders_refund',
            'inventory_read', 'inventory_write', 'inventory_delete',
            'analytics_read', 'analytics_export',
            'settings_read', 'settings_write',
            'security_read', 'security_write',
            'vendors_read', 'vendors_write', 'vendors_approve',
            'payments_read', 'payments_process', 'payments_refund',
            'marketing_read', 'marketing_write', 'marketing_send',
            'reports_read', 'reports_generate', 'reports_export',
            'system_admin', 'audit_logs_read'
          ];
        } else if (userRolesList.includes('admin')) {
          allPermissions = [
            'users_read', 'users_write',
            'orders_read', 'orders_write', 'orders_cancel', 'orders_refund',
            'inventory_read', 'inventory_write', 'inventory_delete',
            'analytics_read', 'analytics_export',
            'settings_read', 'settings_write',
            'vendors_read', 'vendors_write', 'vendors_approve',
            'payments_read', 'payments_process', 'payments_refund',
            'marketing_read', 'marketing_write', 'marketing_send',
            'reports_read', 'reports_generate', 'reports_export'
          ];
        } else if (userRolesList.includes('vendor')) {
          allPermissions = [
            'orders_read', 'inventory_read', 'analytics_read'
          ];
        } else {
          allPermissions = ['orders_read'];
        }

        setPermissions(allPermissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  return { permissions, roles, loading };
};

export const useHasPermission = (permission: AdminPermission): boolean => {
  const { permissions } = useAdminPermissions();
  return permissions.includes(permission) || permissions.includes('system_admin');
};

export const useHasAnyPermission = (requiredPermissions: AdminPermission[]): boolean => {
  const { permissions } = useAdminPermissions();
  return requiredPermissions.some(perm => 
    permissions.includes(perm) || permissions.includes('system_admin')
  );
};