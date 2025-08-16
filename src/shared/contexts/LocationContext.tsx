
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  currentLocation: string | null;
  setManualLocation: (location: string) => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Watch the position continuously
      const watcher = navigator.geolocation.watchPosition(
        async (position) => {
          // For now, we'll use a placeholder city name
          // In a real app, you would reverse geocode the coordinates to get the city name
          const cityName = "Current Location"; // This should be replaced with actual reverse geocoding
          setCurrentLocation(cityName);
          // Save to localStorage if needed (optional)
          localStorage.setItem("currentLocation", cityName);
        },
        (error) => {
          console.error("Error fetching location:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // reuse location if cached < 10s
          timeout: 20000,
        }
      );

      // Cleanup watcher on unmount
      return () => navigator.geolocation.clearWatch(watcher);
    } else {
      console.error("Geolocation not supported in this browser.");
    }
  }, []);

  // Allow manual override (for user-selected cities)
  const setManualLocation = (location: string) => {
    setCurrentLocation(location);
    localStorage.setItem("currentLocation", location);
  };

  const isLocationSet = currentLocation !== null;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setManualLocation,
        isLocationSet,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
