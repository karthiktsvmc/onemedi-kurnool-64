
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type HomecareService = Database['public']['Tables']['homecare_services']['Row'];

export function useHomecareServices() {
  return useLocationAwareData('homecare_services', {
    searchFields: ['name', 'description', 'service_type']
  });
}

export function useHomecareServiceMutation() {
  return useSupabaseMutation<HomecareService>({
    table: 'homecare_services'
  });
}
