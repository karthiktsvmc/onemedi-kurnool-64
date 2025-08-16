
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import type { Medicine, MedicineInsert, MedicineUpdate, QueryOptions } from '@/shared/types/database';

export function useMedicines(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<Medicine>({
    table: 'medicines',
    select: `
      *,
      category:medicine_categories(id, name, image_url),
      brand:medicine_brands(id, name, logo_url)
    `,
    locationFilter: currentLocation ? { city: currentLocation } : undefined,
    onSuccess: (data) => setMedicines(data),
    ...options,
  });

  const mutation = useSupabaseMutation<Medicine>({
    table: 'medicines',
    onSuccess: () => refetch(),
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
    const { data } = await supabaseClient
      .from('medicines')
      .select(`
        *,
        category:medicine_categories(id, name, image_url),
        brand:medicine_brands(id, name, logo_url)
      `)
      .ilike('name', `%${query}%`)
      .limit(20);
    
    return data || [];
  }, []);

  const getMedicinesByCategory = useCallback(async (categoryId: string) => {
    const { data } = await supabaseClient
      .from('medicines')
      .select(`
        *,
        category:medicine_categories(id, name, image_url),
        brand:medicine_brands(id, name, logo_url)
      `)
      .eq('category_id', categoryId);
    
    return data || [];
  }, []);

  return {
    medicines: data,
    loading,
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
