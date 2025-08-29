import { supabase } from '@/integrations/supabase/client';

export class DataService {
  // Medicines
  static async getMedicines(filters?: any) {
    try {
      let query = supabase.from('medicines').select('*');
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters?.location) {
        query = query.eq('city', filters.location);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching medicines:', error);
      throw error;
    }
  }

  static async getMedicineById(id: string) {
    try {
      const { data, error } = await supabase
        .from('medicines')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching medicine:', error);
      throw error;
    }
  }

  // Lab Tests
  static async getLabTests(filters?: any) {
    try {
      let query = supabase.from('lab_tests').select(`
        *,
        category:lab_categories(name, image_url)
      `);
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lab tests:', error);
      throw error;
    }
  }

  static async getLabTestById(id: string) {
    try {
      const { data, error } = await supabase
        .from('lab_tests')
        .select(`
          *,
          category:lab_categories(name, image_url)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching lab test:', error);
      throw error;
    }
  }

  // Scans
  static async getScans(filters?: any) {
    try {
      let query = supabase.from('scans').select(`
        *,
        category:scan_categories(name, image_url)
      `);
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scans:', error);
      throw error;
    }
  }

  // Doctors
  static async getDoctors(filters?: any) {
    try {
      let query = supabase.from('doctors').select(`
        *,
        specialty:doctor_specialties(name, image_url)
      `).eq('active', true);
      
      if (filters?.specialty_id) {
        query = query.eq('specialty_id', filters.specialty_id);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,qualification.ilike.%${filters.search}%`);
      }
      
      if (filters?.location) {
        query = query.eq('clinic_city', filters.location);
      }
      
      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  }

  static async getDoctorById(id: string) {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select(`
          *,
          specialty:doctor_specialties(name, image_url),
          consultation_types(*),
          schedules:doctor_schedules(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  // Categories
  static async getMedicineCategories() {
    try {
      const { data, error } = await supabase
        .from('medicine_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching medicine categories:', error);
      throw error;
    }
  }

  static async getLabCategories() {
    try {
      const { data, error } = await supabase
        .from('lab_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching lab categories:', error);
      throw error;
    }
  }

  static async getScanCategories() {
    try {
      const { data, error } = await supabase
        .from('scan_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching scan categories:', error);
      throw error;
    }
  }

  static async getDoctorSpecialties() {
    try {
      const { data, error } = await supabase
        .from('doctor_specialties')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching doctor specialties:', error);
      throw error;
    }
  }

  // Homecare Services
  static async getHomecareServices(filters?: any) {
    try {
      let query = supabase.from('homecare_services').select(`
        *,
        category:homecare_categories(name, image_url)
      `);
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      if (filters?.location) {
        query = query.eq('city', filters.location);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching homecare services:', error);
      throw error;
    }
  }

  // Hospitals
  static async getHospitals(filters?: any) {
    try {
      let query = supabase.from('hospitals').select('*');
      
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,specialities.cs.{${filters.search}}`);
      }
      
      if (filters?.location) {
        query = query.eq('city', filters.location);
      }
      
      if (filters?.emergency_services) {
        query = query.eq('emergency_services', true);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  }

  // Ambulance Services
  static async getAmbulanceServices(filters?: any) {
    try {
      let query = supabase.from('ambulance_services').select('*');
      
      if (filters?.location) {
        query = query.eq('city', filters.location);
      }
      
      if (filters?.vehicle_type) {
        query = query.eq('vehicle_type', filters.vehicle_type);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching ambulance services:', error);
      throw error;
    }
  }

  // Blood Banks
  static async getBloodBanks(filters?: any) {
    try {
      let query = supabase.from('blood_banks').select('*');
      
      if (filters?.location) {
        query = query.eq('city', filters.location);
      }
      
      if (filters?.blood_group) {
        query = query.contains('available_blood_groups', [filters.blood_group]);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blood banks:', error);
      throw error;
    }
  }

  // Insurance Plans
  static async getInsurancePlans(filters?: any) {
    try {
      let query = supabase.from('insurance_plans').select('*');
      
      if (filters?.provider) {
        query = query.eq('provider', filters.provider);
      }
      
      if (filters?.max_premium) {
        query = query.lte('premium', filters.max_premium);
      }
      
      const { data, error } = await query.order('premium');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching insurance plans:', error);
      throw error;
    }
  }

  // Diabetes Care
  static async getDiabetesProducts(filters?: any) {
    try {
      let query = supabase.from('diabetes_products').select(`
        *,
        category:diabetes_categories(name, image_url)
      `);
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching diabetes products:', error);
      throw error;
    }
  }

  static async getDiabetesServices(filters?: any) {
    try {
      let query = supabase.from('diabetes_services').select(`
        *,
        category:diabetes_categories(name, image_url),
        expert:diabetes_experts(name, qualification, experience)
      `);
      
      if (filters?.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching diabetes services:', error);
      throw error;
    }
  }

  // Search across all services
  static async globalSearch(query: string, filters?: any) {
    try {
      const results = await Promise.allSettled([
        this.getMedicines({ search: query, ...filters }),
        this.getLabTests({ search: query, ...filters }),
        this.getScans({ search: query, ...filters }),
        this.getDoctors({ search: query, ...filters }),
        this.getHomecareServices({ search: query, ...filters }),
        this.getHospitals({ search: query, ...filters }),
      ]);

      const medicines = results[0].status === 'fulfilled' ? results[0].value.map((item: any) => ({ ...item, type: 'medicine' })) : [];
      const labTests = results[1].status === 'fulfilled' ? results[1].value.map((item: any) => ({ ...item, type: 'lab_test' })) : [];
      const scans = results[2].status === 'fulfilled' ? results[2].value.map((item: any) => ({ ...item, type: 'scan' })) : [];
      const doctors = results[3].status === 'fulfilled' ? results[3].value.map((item: any) => ({ ...item, type: 'doctor' })) : [];
      const homecare = results[4].status === 'fulfilled' ? results[4].value.map((item: any) => ({ ...item, type: 'homecare' })) : [];
      const hospitals = results[5].status === 'fulfilled' ? results[5].value.map((item: any) => ({ ...item, type: 'hospital' })) : [];

      return {
        medicines,
        labTests,
        scans,
        doctors,
        homecare,
        hospitals,
        all: [...medicines, ...labTests, ...scans, ...doctors, ...homecare, ...hospitals]
      };
    } catch (error) {
      console.error('Error in global search:', error);
      throw error;
    }
  }
}