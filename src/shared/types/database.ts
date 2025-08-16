
import type { Database } from '@/integrations/supabase/types';

// Core table types
export type Medicine = Database['public']['Tables']['medicines']['Row'];
export type MedicineInsert = Database['public']['Tables']['medicines']['Insert'];
export type MedicineUpdate = Database['public']['Tables']['medicines']['Update'];

export type LabTest = Database['public']['Tables']['lab_tests']['Row'];
export type LabTestInsert = Database['public']['Tables']['lab_tests']['Insert'];
export type LabTestUpdate = Database['public']['Tables']['lab_tests']['Update'];

export type Hospital = Database['public']['Tables']['hospitals']['Row'];
export type HospitalInsert = Database['public']['Tables']['hospitals']['Insert'];
export type HospitalUpdate = Database['public']['Tables']['hospitals']['Update'];

export type BloodBank = Database['public']['Tables']['blood_banks']['Row'];
export type BloodBankInsert = Database['public']['Tables']['blood_banks']['Insert'];
export type BloodBankUpdate = Database['public']['Tables']['blood_banks']['Update'];

export type AmbulanceService = Database['public']['Tables']['ambulance_services']['Row'];
export type AmbulanceServiceInsert = Database['public']['Tables']['ambulance_services']['Insert'];
export type AmbulanceServiceUpdate = Database['public']['Tables']['ambulance_services']['Update'];

export type DiabetesProduct = Database['public']['Tables']['diabetes_products']['Row'];
export type DiabetesProductInsert = Database['public']['Tables']['diabetes_products']['Insert'];
export type DiabetesProductUpdate = Database['public']['Tables']['diabetes_products']['Update'];

export type HomecareService = Database['public']['Tables']['homecare_services']['Row'];
export type HomecareServiceInsert = Database['public']['Tables']['homecare_services']['Insert'];
export type HomecareServiceUpdate = Database['public']['Tables']['homecare_services']['Update'];

export type Scan = Database['public']['Tables']['scans']['Row'];
export type ScanInsert = Database['public']['Tables']['scans']['Insert'];
export type ScanUpdate = Database['public']['Tables']['scans']['Update'];

// Category types
export type MedicineCategory = Database['public']['Tables']['medicine_categories']['Row'];
export type LabCategory = Database['public']['Tables']['lab_categories']['Row'];
export type ScanCategory = Database['public']['Tables']['scan_categories']['Row'];
export type HomecareCategory = Database['public']['Tables']['homecare_categories']['Row'];

// Location-aware types
export interface LocationFilterOptions {
  city?: string;
  state?: string;
  pincode?: string;
}

// Common query options
export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, any>;
  locationFilter?: LocationFilterOptions;
}

// Realtime payload type
export type RealtimePayload<T = any> = {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: T;
  old: T;
  errors: any;
};
