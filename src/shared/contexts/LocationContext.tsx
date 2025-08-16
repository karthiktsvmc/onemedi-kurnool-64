
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  pincode: string;
  address: string;
  accuracy?: number;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  isLocationLoading: boolean;
  locationError: string | null;
  isLocationSet: boolean;
  setLocation: (location: LocationData) => void;
  requestLocation: () => Promise<void>;
  searchLocations: (query: string) => Promise<LocationData[]>;
  clearLocationError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await response.json();
      const address = data.address || {};

      return {
        latitude: lat,
        longitude: lng,
        city: address.city || address.town || address.village || address.municipality || 'Unknown City',
        state: address.state || address.region || 'Unknown State',
        country: address.country || 'Unknown Country',
        pincode: address.postcode || '',
        address: data.display_name || `${lat}, ${lng}`,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback with coordinates
      return {
        latitude: lat,
        longitude: lng,
        city: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country',
        pincode: '',
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      };
    }
  };

  // Search locations using Nominatim
  const searchLocations = useCallback(async (query: string): Promise<LocationData[]> => {
    if (!query || query.length < 3) return [];

    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=10&countrycodes=IN`
      );

      if (!response.ok) {
        throw new Error('Location search failed');
      }

      const data = await response.json();
      
      return data.map((item: any) => {
        const address = item.address || {};
        return {
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          city: address.city || address.town || address.village || address.municipality || 'Unknown City',
          state: address.state || address.region || 'Unknown State',
          country: address.country || 'India',
          pincode: address.postcode || '',
          address: item.display_name || `${item.lat}, ${item.lon}`,
        };
      });
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }, []);

  // Request GPS location
  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocationLoading(true);
    setLocationError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5 * 60 * 1000, // 5 minutes
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Reverse geocode to get address details
      const locationData = await reverseGeocode(latitude, longitude);
      locationData.accuracy = accuracy;

      setCurrentLocation(locationData);
      localStorage.setItem('userLocation', JSON.stringify(locationData));
      
    } catch (error: any) {
      let errorMessage = 'Failed to get your location';
      
      if (error.code === error.PERMISSION_DENIED) {
        errorMessage = 'Location access was denied. Please enable location permissions.';
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = 'Location information is unavailable.';
      } else if (error.code === error.TIMEOUT) {
        errorMessage = 'Location request timed out.';
      }
      
      setLocationError(errorMessage);
      console.error('Location error:', error);
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  // Set location manually
  const setLocation = useCallback((location: LocationData) => {
    setCurrentLocation(location);
    localStorage.setItem('userLocation', JSON.stringify(location));
    setLocationError(null);
  }, []);

  // Clear location error
  const clearLocationError = useCallback(() => {
    setLocationError(null);
  }, []);

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setCurrentLocation(parsedLocation);
      } catch (error) {
        console.error('Failed to parse saved location:', error);
        localStorage.removeItem('userLocation');
      }
    }

    // Auto-request location if not available
    if (!currentLocation && !savedLocation) {
      requestLocation();
    }
  }, [requestLocation]);

  const isLocationSet = currentLocation !== null;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationLoading,
        locationError,
        isLocationSet,
        setLocation,
        requestLocation,
        searchLocations,
        clearLocationError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
