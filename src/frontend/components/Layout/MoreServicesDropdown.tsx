import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/ui/badge';
import { 
  Heart, 
  Building, 
  Ambulance, 
  Droplets, 
  Shield, 
  Utensils, 
  BookOpen, 
  Tag,
  Stethoscope,
  Sparkles,
  Activity
} from 'lucide-react';

interface MoreServicesDropdownProps {
  isVisible: boolean;
  onClose: () => void;
}

export const MoreServicesDropdown: React.FC<MoreServicesDropdownProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const moreServices = [
    {
      name: 'Physiotherapy',
      icon: Heart,
      href: '/physiotherapy',
      description: 'Physical therapy at home',
      badge: 'Popular'
    },
    {
      name: 'Best Hospitals',
      icon: Building,
      href: '/hospitals',
      description: 'Top-rated hospitals nearby',
      badge: 'Verified'
    },
    {
      name: 'Surgery Opinion',
      icon: Stethoscope,
      href: '/surgery-opinion',
      description: 'Second opinion from experts',
      badge: 'Expert'
    },
    {
      name: 'Ambulance Services',
      icon: Ambulance,
      href: '/ambulance',
      description: 'Emergency ambulance booking',
      badge: '24/7'
    },
    {
      name: 'Blood Banks',
      icon: Droplets,
      href: '/blood-banks',
      description: 'Find blood donors nearby',
      badge: 'Urgent'
    },
    {
      name: 'Insurance Plans',
      icon: Shield,
      href: '/insurance',
      description: 'Health insurance options',
      badge: 'Save Money'
    },
    {
      name: 'Diet Guide',
      icon: Utensils,
      href: '/diet-guide',
      description: 'Personalized diet plans',
      badge: 'New'
    },
    {
      name: 'Wellness',
      icon: Sparkles,
      href: '/wellness',
      description: 'Complete wellness solutions',
      badge: 'Trending'
    },
    {
      name: 'Health Blogs',
      icon: BookOpen,
      href: '/health-blogs',
      description: 'Latest health articles',
      badge: 'Free'
    },
    {
      name: 'Offers & Coupons',
      icon: Tag,
      href: '/offers',
      description: 'Exclusive deals & discounts',
      badge: 'Hot Deals'
    }
  ];

  return (
    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-health-green/10 p-4 border-b border-border">
        <h3 className="font-semibold text-foreground mb-1">More Health Services</h3>
        <p className="text-xs text-muted-foreground">Comprehensive healthcare at your fingertips</p>
      </div>

      {/* Services Grid */}
      <div className="p-3 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 gap-1">
          {moreServices.map((service) => (
            <Link
              key={service.name}
              to={service.href}
              onClick={onClose}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary/5 transition-colors group"
            >
              <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                    {service.name}
                  </p>
                  {service.badge && (
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {service.badge}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-muted/50 p-3 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          <Activity className="h-3 w-3 inline mr-1" />
          Complete healthcare ecosystem
        </p>
      </div>
    </div>
  );
};