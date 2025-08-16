import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  currentLocation: GeolocationPosition | null;
  setManualLocation: (location: GeolocationPosition) => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      // Watch the position continuously
      const watcher = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation(position);
          // Save to localStorage if needed (optional)
          localStorage.setItem("currentLocation", JSON.stringify(position.coords));
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

  // Allow manual override (optional for testing / fallback)
  const setManualLocation = (location: GeolocationPosition) => {
    setCurrentLocation(location);
    localStorage.setItem("currentLocation", JSON.stringify(location.coords));
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
