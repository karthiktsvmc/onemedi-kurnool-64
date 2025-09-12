import React from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ShieldCheck, User, ShoppingCart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface GuestAccessGuardProps {
  children: React.ReactNode;
  showLoginPrompt?: boolean;
  promptTitle?: string;
  promptDescription?: string;
}

export const GuestAccessGuard: React.FC<GuestAccessGuardProps> = ({
  children,
  showLoginPrompt = true,
  promptTitle = "Sign in for Better Experience",
  promptDescription = "Get personalized recommendations, save items, and track your orders."
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    navigate('/auth', { 
      state: { returnUrl: location.pathname + location.search }
    });
  };

  if (user) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {children}
      
      {showLoginPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <Card className="border-primary/20 bg-card/95 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{promptTitle}</CardTitle>
              </div>
              <CardDescription className="text-sm">
                {promptDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button 
                  onClick={handleSignIn}
                  size="sm"
                  className="flex-1"
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const card = document.querySelector('[data-guest-prompt]');
                    if (card) card.remove();
                  }}
                  className="px-3"
                >
                  ×
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Specific guard for cart-related features that need authentication
export const CartAccessGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <ShoppingCart className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to access your cart and manage your orders.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Your cart items will be saved securely after signing in.
                </AlertDescription>
              </Alert>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate('/auth', { 
                    state: { returnUrl: location.pathname + location.search }
                  })}
                  className="flex-1"
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};