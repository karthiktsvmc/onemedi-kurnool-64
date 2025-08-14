
import React from 'react';
import { Phone, Clock, MapPin, Star, Shield, Zap } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AmbulanceService } from '@/frontend/data/mockAmbulanceData';

interface AmbulanceCardProps {
  service: AmbulanceService;
  distance?: number;
  onBook: (serviceId: string) => void;
  onCall: (phoneNumber: string) => void;
}

export const AmbulanceCard: React.FC<AmbulanceCardProps> = ({
  service,
  distance = 5,
  onBook,
  onCall
}) => {
  const estimatedPrice = service.basePrice + (service.pricePerKm * distance);
  
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-500';
      case 'Busy': return 'bg-yellow-500';
      default: return 'bg-red-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ICU':
      case 'Advanced':
        return <Shield className="h-4 w-4" />;
      case 'Neonatal':
        return <Zap className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Service Image */}
          <div className="relative">
            <img
              src={service.image}
              alt={service.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${getAvailabilityColor(service.availability)} border-2 border-white`} />
          </div>

          {/* Service Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-foreground text-sm line-clamp-1">
                  {service.name}
                </h3>
                {service.badge && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {service.badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-muted-foreground">({service.reviewCount})</span>
              </div>
            </div>

            {/* Type and ETA */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-1">
                {getTypeIcon(service.type)}
                <span className="text-xs font-medium text-primary">{service.type}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{service.eta} min ETA</span>
              </div>
            </div>

            {/* Coverage Area */}
            <p className="text-xs text-muted-foreground mb-2">{service.coverageArea}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-1 mb-3">
              {service.features.slice(0, 2).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {service.features.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{service.features.length - 2} more
                </Badge>
              )}
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-primary">₹{estimatedPrice}</span>
                <span className="text-xs text-muted-foreground ml-1">est.</span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCall(service.contactNumber)}
                  className="px-3"
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onBook(service.id)}
                  disabled={service.availability === 'Offline'}
                  className="px-4"
                >
                  {service.availability === 'Available' ? 'Book Now' : 'Busy'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
