import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useLocation } from '@/shared/contexts/LocationContext';
import { LocationPicker } from './LocationPicker';

export const LocationDisplay: React.FC = () => {
  const { currentLocation, isLocationSet } = useLocation();
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleLocationClick = () => {
    setIsPickerOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={handleLocationClick}
        className="flex items-center gap-1 text-sm font-normal h-auto p-1"
      >
        <MapPin className="h-4 w-4 text-primary" />
        <div className="flex flex-col items-start">
          {isLocationSet && currentLocation ? (
            <>
              <span className="text-xs text-muted-foreground">Deliver to</span>
              <span className="font-medium truncate max-w-32">
                {currentLocation.city}
              </span>
            </>
          ) : (
            <span className="text-primary">Select Location</span>
          )}
        </div>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </Button>

      <LocationPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
      />
    </>
  );
};