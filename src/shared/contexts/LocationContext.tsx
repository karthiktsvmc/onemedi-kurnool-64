import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  pincode: string;
  address: string;
  accuracy?: number;
}

interface LocationContextType {
  currentLocation: LocationData | null;
  isLocationLoading: boolean;
  locationError: string | null;
  isLocationSet: boolean;
  getCurrentLocation: () => Promise<void>;
  setManualLocation: (location: LocationData) => void;
  searchLocations: (query: string) => Promise<LocationData[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// OpenStreetMap Nominatim API functions
const reverseGeocode = async (lat: number, lng: number): Promise<LocationData> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    return {
      latitude: lat,
      longitude: lng,
      city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
      state: data.address?.state || data.address?.province || 'Unknown State',
      pincode: data.address?.postcode || '',
      address: data.display_name || '',
    };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    throw new Error('Failed to get location details');
  }
};

const searchGeocoding = async (query: string): Promise<LocationData[]> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`
    );
    
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    
    const data = await response.json();
    
    return data.map((item: any) => ({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      city: item.address?.city || item.address?.town || item.address?.village || 'Unknown City',
      state: item.address?.state || item.address?.province || 'Unknown State',
      pincode: item.address?.postcode || '',
      address: item.display_name || '',
    }));
  } catch (error) {
    console.error('Location search failed:', error);
    throw new Error('Failed to search locations');
  }
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('currentLocation');
    if (savedLocation) {
      try {
        const parsed = JSON.parse(savedLocation);
        setCurrentLocation(parsed);
      } catch (error) {
        console.error('Failed to parse saved location:', error);
        localStorage.removeItem('currentLocation');
      }
    }
    
    // Auto-detect location on app load
    getCurrentLocation();
  }, []);

  const getCurrentLocation = useCallback(async () => {
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
            maximumAge: 300000, // 5 minutes
          }
        );
      });

      const { latitude, longitude, accuracy } = position.coords;
      
      // Get human-readable location using reverse geocoding
      const locationData = await reverseGeocode(latitude, longitude);
      locationData.accuracy = accuracy;

      setCurrentLocation(locationData);
      localStorage.setItem('currentLocation', JSON.stringify(locationData));
      
    } catch (error) {
      console.error('Failed to get current location:', error);
      
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services and refresh the page.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
            break;
        }
      } else {
        setLocationError('Failed to get location details');
      }
    } finally {
      setIsLocationLoading(false);
    }
  }, []);

  const setManualLocation = useCallback((location: LocationData) => {
    setCurrentLocation(location);
    localStorage.setItem('currentLocation', JSON.stringify(location));
    setLocationError(null);
  }, []);

  const searchLocations = useCallback(async (query: string): Promise<LocationData[]> => {
    if (!query.trim()) return [];
    
    try {
      return await searchGeocoding(query);
    } catch (error) {
      console.error('Location search failed:', error);
      return [];
    }
  }, []);

  const isLocationSet = currentLocation !== null;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        isLocationLoading,
        locationError,
        isLocationSet,
        getCurrentLocation,
        setManualLocation,
        searchLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    console.error("useLocation called outside of LocationProvider. Falling back to no-op context.");
    return {
      currentLocation: null,
      isLocationLoading: false,
      locationError: 'LocationProvider is missing',
      isLocationSet: false,
      getCurrentLocation: async () => {},
      setManualLocation: () => {},
      searchLocations: async () => [],
    } as LocationContextType;
  }
  return context;
};
