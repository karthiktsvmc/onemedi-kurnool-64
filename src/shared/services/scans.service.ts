
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type Scan = Database['public']['Tables']['scans']['Row'];

export function useScans() {
  return useLocationAwareData('scans', {
    searchFields: ['name', 'description', 'body_part']
  });
}

export function useScanMutation() {
  return useSupabaseMutation<Scan>({
    table: 'scans'
  });
}
