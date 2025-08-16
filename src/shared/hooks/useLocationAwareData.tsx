
import { useEffect } from 'react';
import { useLocation, LocationData } from '@/shared/contexts/LocationContext';

interface UseLocationAwareDataOptions {
  onLocationChange?: (location: LocationData | null) => void;
  refetchOnLocationChange?: boolean;
}

export function useLocationAwareData({
  onLocationChange,
  refetchOnLocationChange = true,
}: UseLocationAwareDataOptions = {}) {
  const { currentLocation, isLocationSet, isLocationLoading } = useLocation();

  useEffect(() => {
    if (refetchOnLocationChange && onLocationChange) {
      onLocationChange(currentLocation);
    }
  }, [currentLocation, onLocationChange, refetchOnLocationChange]);

  return {
    currentLocation,
    isLocationSet,
    isLocationLoading,
  };
}
