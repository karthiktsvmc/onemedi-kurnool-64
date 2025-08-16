import { useCallback } from 'react';
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useLocation } from '@/shared/contexts/LocationContext';

export interface NearbyServiceOptions {
  table: string;
  userLat: number;
  userLng: number;
  radiusKm?: number;
}

export interface NearbyServiceResult {
  service_data: any;
  distance_km: number;
}

export function useNearbyServices() {
  const { currentLocation } = useLocation();

  const getNearbyServices = useCallback(async (options: Omit<NearbyServiceOptions, 'userLat' | 'userLng'>): Promise<NearbyServiceResult[]> => {
    if (!currentLocation) {
      return [];
    }

    try {
      // For now, return empty array as the RPC function types need to be properly defined
      // This will be implemented once the Supabase types are regenerated
      console.log('Getting nearby services for:', options.table, currentLocation);
      return [];
    } catch (error) {
      console.error('Failed to get nearby services:', error);
      return [];
    }
  }, [currentLocation]);

  const calculateDistance = useCallback(async (lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> => {
    try {
      // For now, use a simple distance calculation
      // This will be implemented once the Supabase types are regenerated
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lng2 - lng1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    } catch (error) {
      console.error('Failed to calculate distance:', error);
      return 0;
    }
  }, []);

  return {
    getNearbyServices,
    calculateDistance,
    currentLocation,
  };
}