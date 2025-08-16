
import { useSupabaseMutation } from '@/shared/hooks/useSupabaseMutation';
import { useLocationAwareData } from '@/shared/hooks/useLocationAwareData';
import type { Database } from '@/integrations/supabase/types';

type DiabetesProduct = Database['public']['Tables']['diabetes_products']['Row'];
type DiabetesService = Database['public']['Tables']['diabetes_services']['Row'];
type DiabetesExpert = Database['public']['Tables']['diabetes_experts']['Row'];

export function useDiabetesProducts() {
  return useLocationAwareData('diabetes_products', {
    searchFields: ['name', 'description', 'brand']
  });
}

export function useDiabetesServices() {
  return useLocationAwareData('diabetes_services', {
    searchFields: ['name', 'description']
  });
}

export function useDiabetesExperts() {
  return useLocationAwareData('diabetes_experts', {
    searchFields: ['name', 'specialization', 'qualification']
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
