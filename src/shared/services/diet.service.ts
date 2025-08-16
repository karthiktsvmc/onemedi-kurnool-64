
import { useSupabaseQuery } from '@/shared/hooks/useSupabaseQuery';
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useRealtimeSubscription } from '@/shared/hooks/useRealtimeSubscription';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type DietGuide = Database['public']['Tables']['diet_guides']['Row'];

export function useDietGuides() {
  return useLocationAwareData<DietGuide>('diet_guides', {
    searchFields: ['title', 'description', 'category']
  });
}

export function useDietGuideMutation() {
  return useSupabaseMutation<DietGuide>({
    table: 'diet_guides'
  });
}
