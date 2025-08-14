import React from 'react';
import { Badge } from '@/shared/components/ui/badge';
import { TrustBadge } from '@/frontend/data/mockCartData';
import { 
  Shield, 
  Truck, 
  Award, 
  CreditCard, 
  Star,
  CheckCircle,
  Users,
  Clock
} from 'lucide-react';

interface TrustBadgeRowProps {
  badges: TrustBadge[];
  variant?: 'horizontal' | 'grid';
}

export const TrustBadgeRow: React.FC<TrustBadgeRowProps> = ({ 
  badges, 
  variant = 'horizontal' 
}) => {
  const getIcon = (iconName: string) => {
    const iconProps = { className: "h-4 w-4" };
    
    switch (iconName) {
      case 'Shield': return <Shield {...iconProps} />;
      case 'Truck': return <Truck {...iconProps} />;
      case 'Award': return <Award {...iconProps} />;
      case 'CreditCard': return <CreditCard {...iconProps} />;
      case 'Star': return <Star {...iconProps} />;
      case 'CheckCircle': return <CheckCircle {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'Clock': return <Clock {...iconProps} />;
      default: return <Shield {...iconProps} />;
    }
  };

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
            <div className={`flex-shrink-0 ${badge.verified ? 'text-green-600' : 'text-primary'}`}>
              {getIcon(badge.icon)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {badge.text}
              </p>
              {badge.subtext && (
                <p className="text-xs text-muted-foreground">
                  {badge.subtext}
                </p>
              )}
            </div>
            {badge.verified && (
              <CheckCircle className="h-3 w-3 text-green-600 ml-auto" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground text-sm">Why choose ONE MEDI?</h3>
      
      <div className="space-y-2">
        {badges.map((badge, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className={`flex-shrink-0 ${badge.verified ? 'text-green-600' : 'text-primary'}`}>
              {getIcon(badge.icon)}
            </div>
            <div className="flex-1">
              <span className="text-foreground font-medium">{badge.text}</span>
              {badge.subtext && (
                <span className="text-muted-foreground text-xs ml-2">
                  • {badge.subtext}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Customer Stats */}
      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-300">
              50,000+ Happy Customers
            </span>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
            4.8★ Rating
          </Badge>
        </div>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Trusted healthcare partner across India
        </p>
      </div>
    </div>
  );
};