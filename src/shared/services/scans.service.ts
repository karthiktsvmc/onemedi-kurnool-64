
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type Scan = Database['public']['Tables']['scans']['Row'];

export function useScans() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for scans
      console.log('Location changed for scans:', location);
    }
  });
}

export function useScanMutation() {
  return useSupabaseMutation({
    table: 'scans'
  });
}
