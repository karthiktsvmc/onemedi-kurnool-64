import React, { useState, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useLocation, type LocationData } from '@/shared/contexts/LocationContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import { useToast } from '@/shared/hooks/use-toast';

interface LocationPickerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ isOpen = false, onClose = () => {} }) => {
  const {
    currentLocation,
    isLocationLoading,
    locationError,
    getCurrentLocation,
    setManualLocation,
    searchLocations,
  } = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  // Search locations when query changes
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length > 2) {
        setIsSearching(true);
        try {
          const results = await searchLocations(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error('Search failed:', error);
          toast({
            title: "Search Failed",
            description: "Unable to search locations. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, searchLocations, toast]);

  const handleLocationSelect = (location: LocationData) => {
    setManualLocation(location);
    onClose();
    toast({
      title: "Location Updated",
      description: `Your location has been set to ${location.city}, ${location.state}`,
    });
  };

  const handleUseCurrentLocation = async () => {
    try {
      await getCurrentLocation();
      onClose();
      toast({
        title: "Location Updated",
        description: "Your current location has been detected successfully.",
      });
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Your Location
          </DialogTitle>
          <DialogDescription>
            Choose your location to see nearby services and accurate delivery options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Location Section */}
          <div className="space-y-2">
            <Button
              onClick={handleUseCurrentLocation}
              disabled={isLocationLoading}
              className="w-full"
              variant="outline"
            >
              {isLocationLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Navigation className="h-4 w-4 mr-2" />
              )}
              Use Current Location
            </Button>

            {locationError && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {locationError}
              </p>
            )}

            {currentLocation && (
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                <div className="font-medium">Current Location:</div>
                <div>{currentLocation.city}, {currentLocation.state}</div>
                {currentLocation.pincode && (
                  <div>PIN: {currentLocation.pincode}</div>
                )}
              </div>
            )}
          </div>

          {/* Search Section */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for area, city or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Search Results */}
            {(searchResults.length > 0 || isSearching) && (
              <Command className="border rounded-md">
                <CommandList className="max-h-48">
                  {isSearching ? (
                    <CommandEmpty>
                      <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                    </CommandEmpty>
                  ) : searchResults.length > 0 ? (
                    <CommandGroup>
                      {searchResults.map((location, index) => (
                        <CommandItem
                          key={index}
                          onSelect={() => handleLocationSelect(location)}
                          className="cursor-pointer"
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {location.city}, {location.state}
                            </div>
                            {location.pincode && (
                              <div className="text-sm text-muted-foreground">
                                PIN: {location.pincode}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>No locations found.</CommandEmpty>
                  )}
                </CommandList>
              </Command>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};