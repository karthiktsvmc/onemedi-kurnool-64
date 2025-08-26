import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthPromptProps {
  title?: string;
  description?: string;
  action?: string;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  title = "Sign In Required",
  description = "Please sign in to continue with your order and access personalized features.",
  action = "Continue"
}) => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/auth', { state: { from: location } });
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSignIn}
            className="w-full"
            size="lg"
          >
            <LogIn className="h-5 w-5 mr-2" />
            {action}
          </Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account? You can sign up from the sign in page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};