
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type InsurancePlan = Database['public']['Tables']['insurance_plans']['Row'];

export function useInsurancePlans() {
  return useLocationAwareData('insurance_plans', {
    searchFields: ['plan_name', 'insurer_name', 'description']
  });
}

export function useInsurancePlanMutation() {
  return useSupabaseMutation<InsurancePlan>({
    table: 'insurance_plans'
  });
}
