import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';

/**
 * Hook to redirect unauthenticated users to login page when accessing protected routes
 */
export const useAuthRedirect = (requireAuth: boolean = false) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      // Save the current location they were trying to go to
      navigate('/auth', { 
        state: { from: location },
        replace: true 
      });
    }
  }, [user, loading, requireAuth, navigate, location]);

  return { user, loading, isAuthenticated: !!user };
};