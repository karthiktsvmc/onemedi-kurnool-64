
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type DietGuide = Database['public']['Tables']['diet_guides']['Row'];

export function useDietGuides() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for diet guides
      console.log('Location changed for diet guides:', location);
    }
  });
}

export function useDietGuideMutation() {
  return useSupabaseMutation({
    table: 'diet_guides'
  });
}
