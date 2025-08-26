import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { useAuth } from '@/shared/contexts/AuthContext';
import { User, LogIn } from 'lucide-react';

export const AuthStatusButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/profile')}
        className="flex items-center gap-2"
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src="" alt={user.email} />
          <AvatarFallback className="text-xs">
            {user.email?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline">Profile</span>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={() => navigate('/auth')}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      Sign In
    </Button>
  );
};