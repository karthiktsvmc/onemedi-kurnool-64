import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import { useNearbyServices } from '@/shared/hooks/useNearbyServices';
import { supabaseClient } from '@/shared/lib/supabase-client';
import type { Medicine, MedicineInsert, MedicineUpdate, QueryOptions } from '@/shared/types/database';

export function useMedicines(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Use nearby services for location-aware medicines
  const {
    data: nearbyMedicines,
    loading: nearbyLoading,
    fetchNearbyServices: fetchNearbyMedicines,
  } = useNearbyServices({
    tableName: 'medicines',
    radiusKm: 25,
  });

  // Fallback to regular query for non-location specific queries
  const {
    data: allMedicines,
    loading: allLoading,
    error,
    refetch: refetchAll,
  } = useSupabaseQuery<Medicine>({
    table: 'medicines',
    select: `
      *,
      category:medicine_categories(id, name, image_url),
      brand:medicine_brands(id, name, logo_url)
    `,
    autoFetch: !currentLocation, // Only auto-fetch if no location available
    onSuccess: (data) => {
      if (!currentLocation) {
        setMedicines(data);
      }
    },
    ...options,
  });

  // Update medicines when location changes
  useState(() => {
    if (currentLocation && nearbyMedicines) {
      setMedicines(nearbyMedicines);
    } else if (!currentLocation && allMedicines) {
      setMedicines(allMedicines);
    }
  });

  const mutation = useSupabaseMutation<Medicine>({
    table: 'medicines',
    onSuccess: () => {
      if (currentLocation) {
        fetchNearbyMedicines();
      } else {
        refetchAll();
      }
    },
  });

  // Realtime subscription
  useRealtimeSubscription<Medicine>({
    table: 'medicines',
    onInsert: (payload) => {
      setMedicines(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setMedicines(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setMedicines(prev => prev.filter(item => item.id !== payload.old.id));
    },
  });

  const searchMedicines = useCallback(async (query: string) => {
    let baseQuery = supabaseClient
      .from('medicines')
      .select(`
        *,
        category:medicine_categories(id, name, image_url),
        brand:medicine_brands(id, name, logo_url)
      `)
      .ilike('name', `%${query}%`)
      .limit(20);

    // Add location filter if available
    if (currentLocation) {
      baseQuery = baseQuery.or(`location_restricted.eq.false,city.eq.${currentLocation.city}`);
    }

    const { data } = await baseQuery;
    return data || [];
  }, [currentLocation]);

  const getMedicinesByCategory = useCallback(async (categoryId: string) => {
    let baseQuery = supabaseClient
      .from('medicines')
      .select(`
        *,
        category:medicine_categories(id, name, image_url),
        brand:medicine_brands(id, name, logo_url)
      `)
      .eq('category_id', categoryId);

    // Add location filter if available
    if (currentLocation) {
      baseQuery = baseQuery.or(`location_restricted.eq.false,city.eq.${currentLocation.city}`);
    }

    const { data } = await baseQuery;
    return data || [];
  }, [currentLocation]);

  const refetch = useCallback(() => {
    if (currentLocation) {
      fetchNearbyMedicines();
    } else {
      refetchAll();
    }
  }, [currentLocation, fetchNearbyMedicines, refetchAll]);

  return {
    medicines,
    loading: currentLocation ? nearbyLoading : allLoading,
    error,
    refetch,
    searchMedicines,
    getMedicinesByCategory,
    createMedicine: mutation.create,
    updateMedicine: mutation.update,
    deleteMedicine: mutation.remove,
    mutationLoading: mutation.loading,
    mutationError: mutation.error,
  };
}

export function useMedicineCategories() {
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useSupabaseQuery({
    table: 'medicine_categories',
    select: '*',
  });

  return {
    categories,
    loading,
    error,
    refetch,
  };
}
