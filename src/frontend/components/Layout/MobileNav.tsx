
import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, Pill, TestTube, Stethoscope, Heart } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface MobileNavProps {
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onClose }) => {
  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Pill, label: 'Medicines', path: '/medicines' },
    { icon: TestTube, label: 'Lab Tests', path: '/lab-tests' },
    { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
    { icon: Heart, label: 'Blood Bank', path: '/blood-bank' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">OM</span>
          </div>
          <span className="font-bold">ONE MEDI</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
