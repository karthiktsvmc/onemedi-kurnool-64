
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import type { AmbulanceService, AmbulanceServiceInsert, AmbulanceServiceUpdate, QueryOptions } from '@/shared/types/database';

export function useAmbulanceServices(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [ambulanceServices, setAmbulanceServices] = useState<AmbulanceService[]>([]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<AmbulanceService>({
    table: 'ambulance_services',
    select: '*',
    locationFilter: currentLocation ? { city: currentLocation } : undefined,
    onSuccess: (data) => setAmbulanceServices(data),
    ...options,
  });

  const mutation = useSupabaseMutation<AmbulanceService>({
    table: 'ambulance_services',
    onSuccess: () => refetch(),
  });

  // Realtime subscription
  useRealtimeSubscription<AmbulanceService>({
    table: 'ambulance_services',
    onInsert: (payload) => {
      setAmbulanceServices(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setAmbulanceServices(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setAmbulanceServices(prev => prev.filter(item => item.id !== payload.old.id));
    },
  });

  const get24x7Services = useCallback(async () => {
    const { data } = await supabaseClient
      .from('ambulance_services')
      .select('*')
      .eq('available_24x7', true);
    
    return data || [];
  }, []);

  return {
    ambulanceServices: data,
    loading,
    error,
    refetch,
    get24x7Services,
    createAmbulanceService: mutation.create,
    updateAmbulanceService: mutation.update,
    deleteAmbulanceService: mutation.remove,
    mutationLoading: mutation.loading,
    mutationError: mutation.error,
  };
}
