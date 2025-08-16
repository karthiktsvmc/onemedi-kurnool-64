
import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useLocation } from '@/shared/contexts/LocationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';

interface LocationMapProps {
  services?: any[];
  serviceType?: string;
  className?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({
  services = [],
  serviceType = 'Services',
  className = '',
}) => {
  const { currentLocation, requestLocation, isLocationLoading } = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);

  // Simple map placeholder - in a real implementation, you'd use Leaflet or similar
  const handleOpenInMaps = (lat: number, lng: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Nearby {serviceType}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!currentLocation ? (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Enable location to see nearby services
            </p>
            <Button onClick={requestLocation} disabled={isLocationLoading}>
              <Navigation className="w-4 h-4 mr-2" />
              {isLocationLoading ? 'Getting Location...' : 'Get My Location'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current Location */}
            <div className="p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Your Location</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentLocation.city}, {currentLocation.state}
              </p>
            </div>

            {/* Services List */}
            {services.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {services.slice(0, 10).map((service, index) => (
                  <div
                    key={service.id || index}
                    className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {service.city || service.address}
                      </p>
                      {service.distance_km && (
                        <p className="text-xs text-primary">
                          ~{service.distance_km.toFixed(1)} km away
                        </p>
                      )}
                    </div>
                    {service.latitude && service.longitude && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenInMaps(
                          service.latitude || service.lat,
                          service.longitude || service.lng,
                          service.name
                        )}
                      >
                        <MapPin className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">
                  No {serviceType.toLowerCase()} found nearby
                </p>
              </div>
            )}

            {/* View All in Maps */}
            {currentLocation && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleOpenInMaps(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  `${serviceType} near me`
                )}
              >
                <MapPin className="w-4 h-4 mr-2" />
                View All in Maps
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
