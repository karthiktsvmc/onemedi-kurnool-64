import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Type aliases for convenience
export type Tables = Database['public']['Tables'];
export type Medicine = Tables['medicines']['Row'];
export type MedicineCategory = Tables['medicine_categories']['Row'];
export type MedicineBrand = Tables['medicine_brands']['Row'];
export type LabTest = Tables['lab_tests']['Row'];
export type LabCategory = Tables['lab_categories']['Row'];
export type Scan = Tables['scans']['Row'];
export type ScanCategory = Tables['scan_categories']['Row'];
export type DiagnosticCentre = Tables['diagnostics_centres']['Row'];
export type PhysiotherapyService = Tables['physiotherapy_services']['Row'];
export type PhysiotherapyCategory = Tables['physiotherapy_categories']['Row'];
export type DiabetesProduct = Tables['diabetes_products']['Row'];
export type DiabetesService = Tables['diabetes_services']['Row'];
export type DiabetesTest = Tables['diabetes_tests']['Row'];
export type DiabetesExpert = Tables['diabetes_experts']['Row'];
export type DiabetesPlan = Tables['diabetes_plans']['Row'];
export type DiabetesDiet = Tables['diabetes_diets']['Row'];
export type HomecareService = Tables['homecare_services']['Row'];
export type HomecareCategory = Tables['homecare_categories']['Row'];
export type SurgeryProcedure = Tables['surgery_procedures']['Row'];
export type SurgerySpeciality = Tables['surgery_specialities']['Row'];
export type Surgeon = Tables['surgeons']['Row'];
export type Hospital = Tables['hospitals']['Row'];
export type AmbulanceService = Tables['ambulance_services']['Row'];
export type BloodBank = Tables['blood_banks']['Row'];
export type InsurancePlan = Tables['insurance_plans']['Row'];
export type DietGuide = Tables['diet_guides']['Row'];
export type WellnessService = Tables['wellness_services']['Row'];
export type WellnessCategory = Tables['wellness_categories']['Row'];
export type HeroBanner = Tables['hero_banners']['Row'];
export type OfferStrip = Tables['offer_strips']['Row'];
export type Testimonial = Tables['testimonials']['Row'];
export type TrustedPartner = Tables['trusted_partners']['Row'];
export type Profile = Tables['profiles']['Row'];
export type UserRole = Tables['user_roles']['Row'];

// Generic CRUD utilities
export class SupabaseTable<T extends Record<string, any>> {
  constructor(private tableName: string) {}

  async getAll(options?: {
    select?: string;
    orderBy?: string;
    ascending?: boolean;
    limit?: number;
    filters?: Record<string, any>;
  }) {
    let query = supabase.from(this.tableName as any).select(options?.select || '*');
    
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }
    
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? true });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as unknown as T[];
  }

  async getById(id: string, select?: string) {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .select(select || '*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as unknown as T;
  }

  async create(item: any) {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as T;
  }

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from(this.tableName as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as unknown as T;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async search(query: string, searchFields: string[], options?: {
    limit?: number;
    filters?: Record<string, any>;
  }) {
    let supabaseQuery = supabase.from(this.tableName as any).select('*');
    
    // Add search conditions
    if (query.trim()) {
      const searchConditions = searchFields.map(field => `${field}.ilike.%${query}%`).join(',');
      supabaseQuery = supabaseQuery.or(searchConditions);
    }
    
    // Add filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          supabaseQuery = supabaseQuery.eq(key, value);
        }
      });
    }
    
    if (options?.limit) {
      supabaseQuery = supabaseQuery.limit(options.limit);
    }
    
    const { data, error } = await supabaseQuery;
    if (error) throw error;
    return data as unknown as T[];
  }

  // Real-time subscription
  subscribe(
    callback: (payload: any) => void,
    options?: {
      event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
      filter?: string;
    }
  ) {
    return supabase
      .channel(`${this.tableName}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event: options?.event || '*',
          schema: 'public',
          table: this.tableName,
          filter: options?.filter
        },
        callback
      )
      .subscribe();
  }
}

// Pre-configured table instances
export const medicinesTable = new SupabaseTable<Medicine>('medicines');
export const medicineCategoriesTable = new SupabaseTable<MedicineCategory>('medicine_categories');
export const medicineBrandsTable = new SupabaseTable<MedicineBrand>('medicine_brands');
export const labTestsTable = new SupabaseTable<LabTest>('lab_tests');
export const labCategoriesTable = new SupabaseTable<LabCategory>('lab_categories');
export const scansTable = new SupabaseTable<Scan>('scans');
export const scanCategoriesTable = new SupabaseTable<ScanCategory>('scan_categories');
export const diagnosticCentresTable = new SupabaseTable<DiagnosticCentre>('diagnostics_centres');
export const physiotherapyServicesTable = new SupabaseTable<PhysiotherapyService>('physiotherapy_services');
export const physiotherapyCategoriesTable = new SupabaseTable<PhysiotherapyCategory>('physiotherapy_categories');
export const diabetesProductsTable = new SupabaseTable<DiabetesProduct>('diabetes_products');
export const diabetesServicesTable = new SupabaseTable<DiabetesService>('diabetes_services');
export const diabetesTestsTable = new SupabaseTable<DiabetesTest>('diabetes_tests');
export const diabetesExpertsTable = new SupabaseTable<DiabetesExpert>('diabetes_experts');
export const diabetesPlansTable = new SupabaseTable<DiabetesPlan>('diabetes_plans');
export const diabetesDietsTable = new SupabaseTable<DiabetesDiet>('diabetes_diets');
export const homecareServicesTable = new SupabaseTable<HomecareService>('homecare_services');
export const homecareCategoriesTable = new SupabaseTable<HomecareCategory>('homecare_categories');
export const surgeryProceduresTable = new SupabaseTable<SurgeryProcedure>('surgery_procedures');
export const surgerySpecialitiesTable = new SupabaseTable<SurgerySpeciality>('surgery_specialities');
export const surgeonsTable = new SupabaseTable<Surgeon>('surgeons');
export const hospitalsTable = new SupabaseTable<Hospital>('hospitals');
export const ambulanceServicesTable = new SupabaseTable<AmbulanceService>('ambulance_services');
export const bloodBanksTable = new SupabaseTable<BloodBank>('blood_banks');
export const insurancePlansTable = new SupabaseTable<InsurancePlan>('insurance_plans');
export const dietGuidesTable = new SupabaseTable<DietGuide>('diet_guides');
export const wellnessServicesTable = new SupabaseTable<WellnessService>('wellness_services');
export const wellnessCategoriesTable = new SupabaseTable<WellnessCategory>('wellness_categories');
export const heroBannersTable = new SupabaseTable<HeroBanner>('hero_banners');
export const offerStripsTable = new SupabaseTable<OfferStrip>('offer_strips');
export const testimonialsTable = new SupabaseTable<Testimonial>('testimonials');
export const trustedPartnersTable = new SupabaseTable<TrustedPartner>('trusted_partners');
export const profilesTable = new SupabaseTable<Profile>('profiles');
export const userRolesTable = new SupabaseTable<UserRole>('user_roles');

// Additional service management tables
export const vendorsTable = new SupabaseTable('vendors');
export const vendorLocationsTable = new SupabaseTable('vendor_locations');
export const inventoryAlertsTable = new SupabaseTable('inventory_alerts');
export const stockMovementsTable = new SupabaseTable('stock_movements');

// Auth utilities
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentUserProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  return await profilesTable.getById(user.id);
};

export const getCurrentUserRole = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();
  
  if (error) return 'user';
  return data.role;
};

export const isAdmin = async () => {
  const role = await getCurrentUserRole();
  return role === 'admin' || role === 'super_admin';
};

// File upload utilities
export const uploadFile = async (
  file: File,
  bucket: string,
  path: string
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);
  
  if (error) throw error;
};