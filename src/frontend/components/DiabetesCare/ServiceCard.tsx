import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { DiabetesService } from '@/frontend/data/mockDiabetesCareData';

interface ServiceCardProps {
  service: DiabetesService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Header with Icon and Badge */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-primary/10 rounded-full p-3">
            <span className="text-2xl">{service.icon}</span>
          </div>
          {service.badge && (
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {service.badge}
            </Badge>
          )}
        </div>
        
        <h3 className="font-semibold text-foreground text-lg mb-2">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {service.description}
        </p>
      </div>

      {/* Service Details */}
      <div className="p-4">
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{service.expert}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              ₹{service.price.toLocaleString()}
            </span>
            {service.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{service.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {service.originalPrice && (
            <span className="text-sm text-green-600 font-medium">
              Save ₹{(service.originalPrice - service.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {service.redirectTo ? (
            <Button asChild className="flex-1">
              <Link to={service.redirectTo}>
                Book Now
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button className="flex-1">
              Book Now
            </Button>
          )}
          <Button variant="outline" size="default">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};