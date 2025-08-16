
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import { supabaseClient } from '@/shared/lib/supabase-client';
import type { BloodBank, BloodBankInsert, BloodBankUpdate, QueryOptions } from '@/shared/types/database';

export function useBloodBanks(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<BloodBank>({
    table: 'blood_banks',
    select: '*',
    locationFilter: currentLocation ? { 
      city: currentLocation.city,
      state: currentLocation.state,
      pincode: currentLocation.pincode 
    } : undefined,
    onSuccess: (data) => setBloodBanks(data),
    ...options,
  });

  const mutation = useSupabaseMutation<BloodBank>({
    table: 'blood_banks',
    onSuccess: () => refetch(),
  });

  // Realtime subscription
  useRealtimeSubscription<BloodBank>({
    table: 'blood_banks',
    onInsert: (payload) => {
      setBloodBanks(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setBloodBanks(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setBloodBanks(prev => prev.filter(item => item.id !== payload.old.id));
    },
  });

  const searchByBloodGroup = useCallback(async (bloodGroup: string) => {
    const { data } = await supabaseClient
      .from('blood_banks')
      .select('*')
      .contains('available_blood_groups', [bloodGroup]);
    
    return data || [];
  }, []);

  return {
    bloodBanks: data,
    loading,
    error,
    refetch,
    searchByBloodGroup,
    createBloodBank: mutation.create,
    updateBloodBank: mutation.update,
    deleteBloodBank: mutation.remove,
    mutationLoading: mutation.loading,
    mutationError: mutation.error,
  };
}

