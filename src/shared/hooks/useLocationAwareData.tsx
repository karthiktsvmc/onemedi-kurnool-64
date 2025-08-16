
import { useEffect } from 'react';
import { useLocation } from '@/shared/contexts/LocationContext';

interface UseLocationAwareDataOptions {
  onLocationChange?: (location: string | null) => void;
  refetchOnLocationChange?: boolean;
}

export function useLocationAwareData({
  onLocationChange,
  refetchOnLocationChange = true,
}: UseLocationAwareDataOptions = {}) {
  const { currentLocation, isLocationSet } = useLocation();

  useEffect(() => {
    if (refetchOnLocationChange && onLocationChange) {
      onLocationChange(currentLocation);
    }
  }, [currentLocation, onLocationChange, refetchOnLocationChange]);

  return {
    currentLocation,
    isLocationSet,
  };
}
