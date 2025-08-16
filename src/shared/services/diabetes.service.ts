
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type DiabetesProduct = Database['public']['Tables']['diabetes_products']['Row'];
type DiabetesService = Database['public']['Tables']['diabetes_services']['Row'];
type DiabetesExpert = Database['public']['Tables']['diabetes_experts']['Row'];

export function useDiabetesProducts() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for diabetes products
      console.log('Location changed for diabetes products:', location);
    }
  });
}

export function useDiabetesServices() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for diabetes services
      console.log('Location changed for diabetes services:', location);
    }
  });
}

export function useDiabetesExperts() {
  return useLocationAwareData({
    onLocationChange: (location) => {
      // Handle location changes for diabetes experts
      console.log('Location changed for diabetes experts:', location);
    }
  });
}

export function useDiabetesProductMutation() {
  return useSupabaseMutation<DiabetesProduct>({
    table: 'diabetes_products'
  });
}

export function useDiabetesServiceMutation() {
  return useSupabaseMutation<DiabetesService>({
    table: 'diabetes_services'
  });
}

export function useDiabetesExpertMutation() {
  return useSupabaseMutation<DiabetesExpert>({
    table: 'diabetes_experts'
  });
}
