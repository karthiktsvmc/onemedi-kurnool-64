import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { PageLoader } from '@/frontend/components/Common/PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        // Redirect to auth page with current location as return URL
        navigate(redirectTo, { 
          state: { returnUrl: location.pathname + location.search },
          replace: true 
        });
      } else if (!requireAuth && user) {
        // User is logged in but accessing a public-only route (like auth page)
        const returnUrl = location.state?.returnUrl || '/';
        navigate(returnUrl, { replace: true });
      }
    }
  }, [user, loading, requireAuth, navigate, redirectTo, location]);

  if (loading) {
    return <PageLoader />;
  }

  if (requireAuth && !user) {
    return <PageLoader />;
  }

  if (!requireAuth && user) {
    return <PageLoader />;
  }

  return <>{children}</>;
};