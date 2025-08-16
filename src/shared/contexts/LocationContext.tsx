
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LocationContextType {
  currentLocation: string | null;
  setCurrentLocation: (location: string) => void;
  isLocationSet: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocationState] = useState<string | null>(
    localStorage.getItem('currentLocation')
  );

  const setCurrentLocation = (location: string) => {
    setCurrentLocationState(location);
    localStorage.setItem('currentLocation', location);
  };

  const isLocationSet = currentLocation !== null;

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
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
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
