import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, X, Plus, Home, Briefcase, MapPinned } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Card, CardContent } from '@/shared/components/ui/card';

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  coordinates: { lat: number; lng: number };
  type: 'home' | 'work' | 'other';
}

interface LocationPickerProps {
  onLocationSelect: (location: { address: string; coordinates: { lat: number; lng: number } }) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect }) => {
  const [currentLocation, setCurrentLocation] = useState<string>('Detecting location...');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isDetecting, setIsDetecting] = useState(false);

  // Mock address suggestions
  const mockSearchResults = [
    { id: 1, address: 'Kurnool Medical College, Kurnool, Andhra Pradesh', coordinates: { lat: 15.8281, lng: 78.0373 } },
    { id: 2, address: 'Government General Hospital, Kurnool', coordinates: { lat: 15.8315, lng: 78.0367 } },
    { id: 3, address: 'Apollo Pharmacy, Station Road, Kurnool', coordinates: { lat: 15.8298, lng: 78.0419 } },
    { id: 4, address: 'Max Lab, Collectorate Road, Kurnool', coordinates: { lat: 15.8267, lng: 78.0401 } },
    { id: 5, address: 'Kurnool Bus Station, Kurnool', coordinates: { lat: 15.8311, lng: 78.0348 } },
  ];

  // Load saved addresses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
    
    // Auto-detect location on component mount
    detectCurrentLocation();
  }, []);

  // Auto GPS detection
  const detectCurrentLocation = () => {
    setIsDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding
          const mockAddress = `Near Kurnool Medical College, Kurnool, AP ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setCurrentLocation(mockAddress);
          onLocationSelect({ address: mockAddress, coordinates: { lat: latitude, lng: longitude } });
          setIsDetecting(false);
        },
        (error) => {
          console.error('Location detection failed:', error);
          setCurrentLocation('Kurnool, Andhra Pradesh (Default)');
          setIsDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    } else {
      setCurrentLocation('Location not supported');
      setIsDetecting(false);
    }
  };

  // Search addresses
  useEffect(() => {
    if (searchQuery.length > 2) {
      const filtered = mockSearchResults.filter(result =>
        result.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Save address
  const saveAddress = (address: string, coordinates: { lat: number; lng: number }, type: 'home' | 'work' | 'other') => {
    const newAddress: SavedAddress = {
      id: Date.now().toString(),
      label: type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other',
      address,
      coordinates,
      type
    };
    
    const updated = [...savedAddresses, newAddress];
    setSavedAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
  };

  // Delete saved address
  const deleteAddress = (id: string) => {
    const updated = savedAddresses.filter(addr => addr.id !== id);
    setSavedAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
  };

  // Select location
  const selectLocation = (address: string, coordinates: { lat: number; lng: number }) => {
    setCurrentLocation(address);
    onLocationSelect({ address, coordinates });
    setIsModalOpen(false);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home': return <Home className="w-4 h-4" />;
      case 'work': return <Briefcase className="w-4 h-4" />;
      default: return <MapPinned className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Floating Location Bar */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground truncate max-w-32 md:max-w-48">
          {isDetecting ? 'Detecting...' : currentLocation}
        </span>
      </div>

      {/* Location Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Select Location
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Auto-detect Button */}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={detectCurrentLocation}
              disabled={isDetecting}
            >
              <Navigation className="w-4 h-4" />
              {isDetecting ? 'Detecting...' : 'Use Current Location'}
            </Button>

            {/* Search Bar */}
            <div className="relative">
              <Input
                placeholder="Search for area, street name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2">
                {searchResults.map((result) => (
                  <Card key={result.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-3">
                      <div
                        className="flex items-start justify-between gap-2"
                        onClick={() => selectLocation(result.address, result.coordinates)}
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{result.address}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            saveAddress(result.address, result.coordinates, 'other');
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Saved Addresses</h4>
                {savedAddresses.map((address) => (
                  <Card key={address.id} className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <CardContent className="p-3">
                      <div
                        className="flex items-start justify-between gap-2"
                        onClick={() => selectLocation(address.address, address.coordinates)}
                      >
                        <div className="flex items-start gap-2 flex-1">
                          {getAddressIcon(address.type)}
                          <div>
                            <p className="text-sm font-medium">{address.label}</p>
                            <p className="text-xs text-muted-foreground">{address.address}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAddress(address.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};