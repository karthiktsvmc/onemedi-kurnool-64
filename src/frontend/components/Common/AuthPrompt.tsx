import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Shield, Heart, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthPromptProps {
  title?: string;
  description?: string;
  action?: string;
  returnUrl?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  title = "Sign in required",
  description = "Please sign in to continue with your healthcare journey",
  action = "accessing this feature",
  returnUrl
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth', {
      state: { returnUrl: returnUrl || window.location.pathname }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-muted/50 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Secure healthcare data protection</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Lock className="w-4 h-4 text-green-500" />
              <span>Encrypted personal information</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Verified healthcare providers</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleSignIn} className="w-full">
              Sign In to Continue
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Browse as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};