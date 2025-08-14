import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';

interface BackButtonProps {
  href?: string;
  className?: string;
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'lg';
  children?: React.ReactNode;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  href, 
  className = '',
  variant = 'ghost',
  size = 'sm',
  children 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (href) {
      navigate(href);
    } else {
      window.history.back();
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {children || 'Back'}
    </Button>
  );
};