
import { useState, useCallback } from 'react';
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocation } from '@/shared/contexts/LocationContext';
import { supabaseClient } from '@/shared/lib/supabase-client';
import type { LabTest, LabTestInsert, LabTestUpdate, QueryOptions } from '@/shared/types/database';

export function useLabTests(options: QueryOptions = {}) {
  const { currentLocation } = useLocation();
  const [labTests, setLabTests] = useState<LabTest[]>([]);

  const {
    data,
    loading,
    error,
    refetch,
  } = useSupabaseQuery<LabTest>({
    table: 'lab_tests',
    select: `
      *,
      category:lab_categories(id, name, image_url),
      variants:lab_test_variants(
        id,
        price,
        diagnostic_centre:diagnostics_centres(id, name, address, city)
      )
    `,
    locationFilter: currentLocation ? { 
      city: currentLocation.city,
      state: currentLocation.state,
      pincode: currentLocation.pincode 
    } : undefined,
    onSuccess: (data) => setLabTests(data),
    ...options,
  });

  const mutation = useSupabaseMutation<LabTest>({
    table: 'lab_tests',
    onSuccess: () => refetch(),
  });

  // Realtime subscription
  useRealtimeSubscription<LabTest>({
    table: 'lab_tests',
    onInsert: (payload) => {
      setLabTests(prev => [payload.new, ...prev]);
    },
    onUpdate: (payload) => {
      setLabTests(prev => prev.map(item => 
        item.id === payload.new.id ? payload.new : item
      ));
    },
    onDelete: (payload) => {
      setLabTests(prev => prev.filter(item => item.id !== payload.old.id));
    },
  });

  const searchLabTests = useCallback(async (query: string) => {
    const { data } = await supabaseClient
      .from('lab_tests')
      .select(`
        *,
        category:lab_categories(id, name, image_url)
      `)
      .ilike('name', `%${query}%`)
      .limit(20);
    
    return data || [];
  }, []);

  const getLabTestsByCategory = useCallback(async (categoryId: string) => {
    const { data } = await supabaseClient
      .from('lab_tests')
      .select(`
        *,
        category:lab_categories(id, name, image_url)
      `)
      .eq('category_id', categoryId);
    
    return data || [];
  }, []);

  const getFeaturedLabTests = useCallback(async () => {
    const { data } = await supabaseClient
      .from('lab_tests')
      .select(`
        *,
        category:lab_categories(id, name, image_url)
      `)
      .eq('featured', true)
      .limit(10);
    
    return data || [];
  }, []);

  return {
    labTests: data,
    loading,
    error,
    refetch,
    searchLabTests,
    getLabTestsByCategory,
    getFeaturedLabTests,
    createLabTest: mutation.create,
    updateLabTest: mutation.update,
    deleteLabTest: mutation.remove,
    mutationLoading: mutation.loading,
    mutationError: mutation.error,
  };
}

export function useLabCategories() {
  const {
    data: categories,
    loading,
    error,
    refetch,
  } = useSupabaseQuery({
    table: 'lab_categories',
    select: '*',
  });

  return {
    categories,
    loading,
    error,
    refetch,
  };
}

