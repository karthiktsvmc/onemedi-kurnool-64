
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type InsurancePlan = Database['public']['Tables']['insurance_plans']['Row'];

export function useInsurancePlans() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for insurance plans
      console.log('Location changed for insurance plans:', location);
    }
  });
}

export function useInsurancePlanMutation() {
  return useSupabaseMutation<InsurancePlan>({
    table: 'insurance_plans'
  });
}
