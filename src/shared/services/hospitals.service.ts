
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import { supabaseClient } from '@/shared/lib/supabase-client';
import type { Hospital, HospitalInsert, HospitalUpdate, QueryOptions } from '@/shared/types/database';

export function useHospitals(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<Hospital>({
    table: 'hospitals',
    select: '*',
    locationFilter: currentLocation ? { city: currentLocation } : undefined,
    onSuccess: (data) => setHospitals(data),
    ...options,
  });

  const mutation = useSupabaseMutation<Hospital>({
    table: 'hospitals',
    onSuccess: () => refetch(),
  });

  // Realtime subscription
  useRealtimeSubscription<Hospital>({
    table: 'hospitals',
    onInsert: (payload) => {
      setHospitals(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setHospitals(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setHospitals(prev => prev.filter(item => item.id !== payload.old.id));
    },
  });

  const searchHospitals = useCallback(async (query: string) => {
    const { data } = await supabaseClient
      .from('hospitals')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);
    
    return data || [];
  }, []);

  const getHospitalsBySpeciality = useCallback(async (speciality: string) => {
    const { data } = await supabaseClient
      .from('hospitals')
      .select('*')
      .contains('specialities', [speciality]);
    
    return data || [];
  }, []);

  const getEmergencyHospitals = useCallback(async () => {
    const { data } = await supabaseClient
      .from('hospitals')
      .select('*')
      .eq('emergency_services', true);
    
    return data || [];
  }, []);

  return {
    hospitals: data,
    loading,
    error,
    refetch,
    searchHospitals,
    getHospitalsBySpeciality,
    getEmergencyHospitals,
    createHospital: mutation.create,
    updateHospital: mutation.update,
    deleteHospital: mutation.remove,
    mutationLoading: mutation.loading,
    mutationError: mutation.error,
  };
}

