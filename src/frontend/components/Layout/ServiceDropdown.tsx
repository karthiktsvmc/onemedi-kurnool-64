import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { ArrowRight, Star } from 'lucide-react';

interface Category {
  name: string;
  href: string;
  badge?: string;
}

interface ServiceDropdownProps {
  isVisible: boolean;
  title: string;
  href: string;
  categories: Category[];
  promoText?: string;
  onClose: () => void;
}

export const ServiceDropdown: React.FC<ServiceDropdownProps> = ({ 
  isVisible, 
  title, 
  href, 
  categories, 
  promoText,
  onClose 
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary/5 p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
        {promoText && (
          <p className="text-xs text-muted-foreground">{promoText}</p>
        )}
      </div>

      {/* Categories */}
      <div className="p-2 max-h-80 overflow-y-auto">
        {categories.map((category, index) => (
          <Link
            key={index}
            to={category.href}
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 transition-colors group"
          >
            <span className="text-sm text-foreground group-hover:text-primary">
              {category.name}
            </span>
            <div className="flex items-center space-x-2">
              {category.badge && (
                <Badge variant="secondary" className="text-xs">
                  {category.badge}
                </Badge>
              )}
              <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-muted/50 p-3 border-t border-border">
        <Link
          to={href}
          onClick={onClose}
          className="flex items-center justify-between text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <span>View All {title}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};