
import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { useLocation, LocationData } from '@/shared/contexts/LocationContext';

export const EnhancedLocationPicker: React.FC = () => {
  const {
    currentLocation,
    isLocationLoading,
    locationError,
    setLocation,
    requestLocation,
    searchLocations,
    clearLocationError,
  } = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchLocations]);

  const handleLocationSelect = (location: LocationData) => {
    setLocation(location);
    setIsModalOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleRequestLocation = async () => {
    clearLocationError();
    await requestLocation();
  };

  const displayLocation = currentLocation 
    ? `${currentLocation.city}, ${currentLocation.state}`
    : 'Select Location';

  return (
    <>
      {/* Location Display Button */}
      <div 
        className="flex items-center gap-2 cursor-pointer hover:bg-accent/10 rounded-md px-2 py-1 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <MapPin className="w-4 h-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground truncate max-w-32 md:max-w-48">
            {isLocationLoading ? 'Getting location...' : displayLocation}
          </span>
          {currentLocation && (
            <span className="text-xs text-muted-foreground">
              {currentLocation.pincode}
            </span>
          )}
        </div>
      </div>

      {/* Location Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Select Your Location
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 flex-1 overflow-hidden">
            {/* Error Alert */}
            {locationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}

            {/* Current Location Display */}
            {currentLocation && (
              <Card className="border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current Location</p>
                      <p className="text-xs text-muted-foreground">
                        {currentLocation.address}
                      </p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span>{currentLocation.city}</span>
                        <span>•</span>
                        <span>{currentLocation.state}</span>
                        {currentLocation.pincode && (
                          <>
                            <span>•</span>
                            <span>{currentLocation.pincode}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* GPS Location Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleRequestLocation}
              disabled={isLocationLoading}
            >
              <Navigation className={`w-4 h-4 ${isLocationLoading ? 'animate-spin' : ''}`} />
              {isLocationLoading ? 'Getting your location...' : 'Use Current Location'}
            </Button>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for city, area, or pincode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto">
              {isSearching && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Searching locations...
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Search Results</p>
                  {searchResults.map((result, index) => (
                    <Card key={index} className="cursor-pointer hover:bg-accent/50 transition-colors">
                      <CardContent className="p-3">
                        <div
                          onClick={() => handleLocationSelect(result)}
                          className="flex items-start gap-2"
                        >
                          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {result.city}, {result.state}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {result.address}
                            </p>
                            {result.pincode && (
                              <p className="text-xs text-muted-foreground mt-1">
                                PIN: {result.pincode}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchQuery.length >= 3 && !isSearching && searchResults.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No locations found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
