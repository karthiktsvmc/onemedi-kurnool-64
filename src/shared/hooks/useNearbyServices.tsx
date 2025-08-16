
import { useState, useCallback } from 'react';
import { supabaseClient } from '@/shared/lib/supabase-client';
import { useLocation } from '@/shared/contexts/LocationContext';
import { useToast } from '@/shared/hooks/use-toast';

interface NearbyServiceOptions {
  tableName: string;
  radiusKm?: number;
}

export function useNearbyServices({ tableName, radiusKm = 25 }: NearbyServiceOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentLocation } = useLocation();
  const { toast } = useToast();

  const fetchNearbyServices = useCallback(async () => {
    if (!currentLocation) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: result, error } = await supabaseClient.rpc('get_nearby_services', {
        table_name: tableName,
        user_lat: currentLocation.latitude,
        user_lng: currentLocation.longitude,
        radius_km: radiusKm,
      });

      if (error) {
        throw new Error(error.message);
      }

      // Extract service data and add distance
      const services = result?.map((item: any) => ({
        ...item.service_data,
        distance_km: item.distance_km,
      })) || [];

      setData(services);
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to fetch nearby services');
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentLocation, tableName, radiusKm, toast]);

  return {
    data,
    loading,
    error,
    fetchNearbyServices,
    refetch: fetchNearbyServices,
  };
}
