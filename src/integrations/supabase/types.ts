export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string
          address_line_2: string | null
          city: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          landmark: string | null
          latitude: number | null
          longitude: number | null
          phone: string
          pincode: string
          state: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line_1: string
          address_line_2?: string | null
          city: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          phone: string
          pincode: string
          state: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          landmark?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string
          pincode?: string
          state?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ambulance_services: {
        Row: {
          available_24x7: boolean | null
          city: string
          contact: string | null
          created_at: string
          description: string | null
          equipment: string[] | null
          id: string
          image_url: string | null
          latitude: number | null
          location_restricted: boolean | null
          longitude: number | null
          name: string
          pincode: string | null
          price: number
          service_radius_km: number | null
          state: string | null
          updated_at: string
          vehicle_type: string | null
        }
        Insert: {
          available_24x7?: boolean | null
          city: string
          contact?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name: string
          pincode?: string | null
          price: number
          service_radius_km?: number | null
          state?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Update: {
          available_24x7?: boolean | null
          city?: string
          contact?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name?: string
          pincode?: string | null
          price?: number
          service_radius_km?: number | null
          state?: string | null
          updated_at?: string
          vehicle_type?: string | null
        }
        Relationships: []
      }
      blood_banks: {
        Row: {
          address: string
          available_blood_groups: string[] | null
          city: string
          contact: string | null
          created_at: string
          emergency_contact: string | null
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          location_restricted: boolean | null
          name: string
          pincode: string
          service_radius_km: number | null
          state: string
          updated_at: string
        }
        Insert: {
          address: string
          available_blood_groups?: string[] | null
          city: string
          contact?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          location_restricted?: boolean | null
          name: string
          pincode: string
          service_radius_km?: number | null
          state: string
          updated_at?: string
        }
        Update: {
          address?: string
          available_blood_groups?: string[] | null
          city?: string
          contact?: string | null
          created_at?: string
          emergency_contact?: string | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          location_restricted?: boolean | null
          name?: string
          pincode?: string
          service_radius_km?: number | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      bottom_navigation: {
        Row: {
          active: boolean | null
          created_at: string
          icon_url: string | null
          id: string
          link: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      carousel_items: {
        Row: {
          carousel_id: string
          created_at: string
          id: string
          item_id: string
          item_type: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          carousel_id: string
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          carousel_id?: string
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "carousel_items_carousel_id_fkey"
            columns: ["carousel_id"]
            isOneToOne: false
            referencedRelation: "carousels"
            referencedColumns: ["id"]
          },
        ]
      }
      carousels: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          module_name: string
          sort_order: number | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          module_name: string
          sort_order?: number | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          module_name?: string
          sort_order?: number | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          prescription_required: boolean | null
          quantity: number
          total_price: number
          unit_price: number
          updated_at: string
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          prescription_required?: boolean | null
          quantity?: number
          total_price: number
          unit_price: number
          updated_at?: string
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          prescription_required?: boolean | null
          quantity?: number
          total_price?: number
          unit_price?: number
          updated_at?: string
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_types: {
        Row: {
          available: boolean | null
          created_at: string
          doctor_id: string
          duration_minutes: number | null
          fee: number | null
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          available?: boolean | null
          created_at?: string
          doctor_id: string
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          available?: boolean | null
          created_at?: string
          doctor_id?: string
          duration_minutes?: number | null
          fee?: number | null
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_types_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_usage: {
        Row: {
          coupon_id: string
          created_at: string
          discount_amount: number
          id: string
          order_id: string
          user_id: string
        }
        Insert: {
          coupon_id: string
          created_at?: string
          discount_amount: number
          id?: string
          order_id: string
          user_id: string
        }
        Update: {
          coupon_id?: string
          created_at?: string
          discount_amount?: number
          id?: string
          order_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_usage_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          active: boolean | null
          applicable_to: string | null
          code: string
          created_at: string
          description: string | null
          id: string
          maximum_discount_amount: number | null
          minimum_order_amount: number | null
          title: string
          type: string
          updated_at: string
          usage_limit: number | null
          used_count: number | null
          user_usage_limit: number | null
          valid_from: string
          valid_until: string
          value: number
        }
        Insert: {
          active?: boolean | null
          applicable_to?: string | null
          code: string
          created_at?: string
          description?: string | null
          id?: string
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          title: string
          type: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
          user_usage_limit?: number | null
          valid_from?: string
          valid_until: string
          value: number
        }
        Update: {
          active?: boolean | null
          applicable_to?: string | null
          code?: string
          created_at?: string
          description?: string | null
          id?: string
          maximum_discount_amount?: number | null
          minimum_order_amount?: number | null
          title?: string
          type?: string
          updated_at?: string
          usage_limit?: number | null
          used_count?: number | null
          user_usage_limit?: number | null
          valid_from?: string
          valid_until?: string
          value?: number
        }
        Relationships: []
      }
      diabetes_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      diabetes_diets: {
        Row: {
          calories: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          instructions: string | null
          name: string
          plan_id: string
          updated_at: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name: string
          plan_id: string
          updated_at?: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name?: string
          plan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diabetes_diets_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "diabetes_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      diabetes_experts: {
        Row: {
          bio: string | null
          contact: string | null
          created_at: string
          experience: number | null
          id: string
          image_url: string | null
          name: string
          qualification: string | null
          speciality: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name: string
          qualification?: string | null
          speciality?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name?: string
          qualification?: string | null
          speciality?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      diabetes_plans: {
        Row: {
          created_at: string
          description: string | null
          duration: number | null
          expert_id: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          sessions: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration?: number | null
          expert_id?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          sessions?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number | null
          expert_id?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sessions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diabetes_plans_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "diabetes_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      diabetes_products: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diabetes_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "diabetes_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      diabetes_services: {
        Row: {
          category_id: string
          city: string | null
          created_at: string
          description: string | null
          expert_id: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location_restricted: boolean | null
          longitude: number | null
          name: string
          pincode: string | null
          price: number
          service_radius_km: number | null
          state: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          city?: string | null
          created_at?: string
          description?: string | null
          expert_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name: string
          pincode?: string | null
          price: number
          service_radius_km?: number | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          city?: string | null
          created_at?: string
          description?: string | null
          expert_id?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name?: string
          pincode?: string | null
          price?: number
          service_radius_km?: number | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diabetes_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "diabetes_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "diabetes_services_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "diabetes_experts"
            referencedColumns: ["id"]
          },
        ]
      }
      diabetes_tests: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          fasting_required: boolean | null
          featured: boolean | null
          home_collection_available: boolean | null
          id: string
          image_url: string | null
          instructions: string | null
          mrp: number
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          fasting_required?: boolean | null
          featured?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp: number
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          fasting_required?: boolean | null
          featured?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "diabetes_tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "diabetes_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics_centres: {
        Row: {
          active: boolean | null
          address: string
          city: string
          contact: string | null
          created_at: string
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          name: string
          pincode: string
          state: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address: string
          city: string
          contact?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          pincode: string
          state: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string
          contact?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          pincode?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      diet_guides: {
        Row: {
          calories_per_day: number | null
          category: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          instructions: string | null
          name: string
          updated_at: string
        }
        Insert: {
          calories_per_day?: number | null
          category: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          calories_per_day?: number | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctor_promotional_strips: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          link: string | null
          sort_order: number | null
          specialty_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          specialty_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          specialty_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_promotional_strips_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "doctor_specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_schedules: {
        Row: {
          active: boolean | null
          consultation_type: string
          created_at: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          slot_duration_minutes: number | null
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          consultation_type: string
          created_at?: string
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          slot_duration_minutes?: number | null
          start_time: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          consultation_type?: string
          created_at?: string
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          slot_duration_minutes?: number | null
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_schedules_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_specialties: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      doctors: {
        Row: {
          about: string | null
          active: boolean | null
          age: number | null
          clinic_address: string | null
          clinic_city: string | null
          clinic_latitude: number | null
          clinic_longitude: number | null
          clinic_name: string | null
          clinic_pincode: string | null
          clinic_state: string | null
          created_at: string
          email: string | null
          experience: number | null
          expertise: string[] | null
          gender: string | null
          id: string
          image_url: string | null
          languages: string[] | null
          name: string
          phone: string | null
          procedures: string[] | null
          qualification: string | null
          rating: number | null
          registration_number: string | null
          review_count: number | null
          specialty_id: string | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          about?: string | null
          active?: boolean | null
          age?: number | null
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_latitude?: number | null
          clinic_longitude?: number | null
          clinic_name?: string | null
          clinic_pincode?: string | null
          clinic_state?: string | null
          created_at?: string
          email?: string | null
          experience?: number | null
          expertise?: string[] | null
          gender?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name: string
          phone?: string | null
          procedures?: string[] | null
          qualification?: string | null
          rating?: number | null
          registration_number?: string | null
          review_count?: number | null
          specialty_id?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          about?: string | null
          active?: boolean | null
          age?: number | null
          clinic_address?: string | null
          clinic_city?: string | null
          clinic_latitude?: number | null
          clinic_longitude?: number | null
          clinic_name?: string | null
          clinic_pincode?: string | null
          clinic_state?: string | null
          created_at?: string
          email?: string | null
          experience?: number | null
          expertise?: string[] | null
          gender?: string | null
          id?: string
          image_url?: string | null
          languages?: string[] | null
          name?: string
          phone?: string | null
          procedures?: string[] | null
          qualification?: string | null
          rating?: number | null
          registration_number?: string | null
          review_count?: number | null
          specialty_id?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "doctors_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "doctor_specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      hero_banners: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          image_url: string
          link: string | null
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url: string
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url?: string
          link?: string | null
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      homecare_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      homecare_services: {
        Row: {
          category_id: string
          city: string | null
          created_at: string
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          latitude: number | null
          location_restricted: boolean | null
          longitude: number | null
          name: string
          pincode: string | null
          price: number
          service_radius_km: number | null
          sessions: number | null
          state: string | null
          updated_at: string
        }
        Insert: {
          category_id: string
          city?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name: string
          pincode?: string | null
          price: number
          service_radius_km?: number | null
          sessions?: number | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          city?: string | null
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          name?: string
          pincode?: string | null
          price?: number
          service_radius_km?: number | null
          sessions?: number | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "homecare_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "homecare_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string
          city: string
          contact: string | null
          created_at: string
          emergency_services: boolean | null
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          location_restricted: boolean | null
          name: string
          pincode: string
          service_radius_km: number | null
          specialities: string[] | null
          state: string
          updated_at: string
        }
        Insert: {
          address: string
          city: string
          contact?: string | null
          created_at?: string
          emergency_services?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          location_restricted?: boolean | null
          name: string
          pincode: string
          service_radius_km?: number | null
          specialities?: string[] | null
          state: string
          updated_at?: string
        }
        Update: {
          address?: string
          city?: string
          contact?: string | null
          created_at?: string
          emergency_services?: boolean | null
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          location_restricted?: boolean | null
          name?: string
          pincode?: string
          service_radius_km?: number | null
          specialities?: string[] | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      insurance_plans: {
        Row: {
          coverage_amount: number
          created_at: string
          description: string | null
          duration: number
          exclusions: string[] | null
          features: string[] | null
          id: string
          image_url: string | null
          name: string
          premium: number
          provider: string
          updated_at: string
        }
        Insert: {
          coverage_amount: number
          created_at?: string
          description?: string | null
          duration: number
          exclusions?: string[] | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          premium: number
          provider: string
          updated_at?: string
        }
        Update: {
          coverage_amount?: number
          created_at?: string
          description?: string | null
          duration?: number
          exclusions?: string[] | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          premium?: number
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_packages: {
        Row: {
          category_id: string
          centre: string | null
          created_at: string
          description: string | null
          "discount price": number | null
          fasting_required: boolean | null
          home_collection_available: boolean | null
          id: string
          image_url: string | null
          instructions: string | null
          mrp: number
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          fasting_required?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp: number
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          fasting_required?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_packages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "lab_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_packages_centre_fkey"
            columns: ["centre"]
            isOneToOne: false
            referencedRelation: "diagnostics_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_test_variants: {
        Row: {
          created_at: string
          diagnostic_centre_id: string
          id: string
          lab_test_id: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostic_centre_id: string
          id?: string
          lab_test_id: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostic_centre_id?: string
          id?: string
          lab_test_id?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_test_variants_diagnostic_centre_id_fkey"
            columns: ["diagnostic_centre_id"]
            isOneToOne: false
            referencedRelation: "diagnostics_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_test_variants_lab_test_id_fkey"
            columns: ["lab_test_id"]
            isOneToOne: false
            referencedRelation: "lab_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_tests: {
        Row: {
          category_id: string
          centre: string | null
          created_at: string
          description: string | null
          "discount price": number | null
          fasting_required: boolean | null
          featured: boolean | null
          home_collection_available: boolean | null
          id: string
          image_url: string | null
          instructions: string | null
          mrp: number
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          fasting_required?: boolean | null
          featured?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp: number
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          fasting_required?: boolean | null
          featured?: boolean | null
          home_collection_available?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "lab_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_tests_centre_fkey"
            columns: ["centre"]
            isOneToOne: false
            referencedRelation: "diagnostics_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      location_analytics: {
        Row: {
          action: string
          city: string | null
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          pincode: string | null
          service_id: string | null
          service_type: string | null
          state: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          city?: string | null
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          pincode?: string | null
          service_id?: string | null
          service_type?: string | null
          state?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          city?: string | null
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          pincode?: string | null
          service_id?: string | null
          service_type?: string | null
          state?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      medicine_brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      medicine_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "medicine_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      medicines: {
        Row: {
          brand: string | null
          brand_id: string | null
          branded_alternatives: string[] | null
          category_id: string
          city: string | null
          created_at: string
          description: string | null
          expiry_date: string | null
          featured: boolean | null
          generic_alternative: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location_restricted: boolean | null
          longitude: number | null
          mrp: number
          name: string
          pharmacy_name: string | null
          pincode: string | null
          prescription_required: boolean | null
          sale_price: number
          state: string | null
          stock_qty: number
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          brand?: string | null
          brand_id?: string | null
          branded_alternatives?: string[] | null
          category_id: string
          city?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          generic_alternative?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          mrp: number
          name: string
          pharmacy_name?: string | null
          pincode?: string | null
          prescription_required?: boolean | null
          sale_price: number
          state?: string | null
          stock_qty?: number
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          brand?: string | null
          brand_id?: string | null
          branded_alternatives?: string[] | null
          category_id?: string
          city?: string | null
          created_at?: string
          description?: string | null
          expiry_date?: string | null
          featured?: boolean | null
          generic_alternative?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location_restricted?: boolean | null
          longitude?: number | null
          mrp?: number
          name?: string
          pharmacy_name?: string | null
          pincode?: string | null
          prescription_required?: boolean | null
          sale_price?: number
          state?: string | null
          stock_qty?: number
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicines_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "medicine_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medicines_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "medicine_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      mega_menu: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          link: string
          module_name: string
          parent_id: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          link: string
          module_name: string
          parent_id?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          link?: string
          module_name?: string
          parent_id?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mega_menu_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "mega_menu"
            referencedColumns: ["id"]
          },
        ]
      }
      mobile_menu: {
        Row: {
          active: boolean | null
          created_at: string
          icon_url: string | null
          id: string
          link: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          expires_at: string | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          expires_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      offer_strips: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          discount: string | null
          id: string
          image_url: string | null
          link: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          discount?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          discount?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_name: string
          item_type: string
          order_id: string
          quantity: number
          status: string | null
          total_price: number
          unit_price: number
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_name: string
          item_type: string
          order_id: string
          quantity: number
          status?: string | null
          total_price: number
          unit_price: number
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_name?: string
          item_type?: string
          order_id?: string
          quantity?: number
          status?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_address_id: string
          delivery_charges: number
          delivery_date: string | null
          delivery_slot: string | null
          discount_amount: number
          gst_amount: number
          id: string
          order_number: string
          payment_method: string | null
          payment_status: string | null
          special_instructions: string | null
          status: string
          subtotal: number
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address_id: string
          delivery_charges?: number
          delivery_date?: string | null
          delivery_slot?: string | null
          discount_amount?: number
          gst_amount?: number
          id?: string
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: string
          subtotal: number
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address_id?: string
          delivery_charges?: number
          delivery_date?: string | null
          delivery_slot?: string | null
          discount_amount?: number
          gst_amount?: number
          id?: string
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          special_instructions?: string | null
          status?: string
          subtotal?: number
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_delivery_address_id_fkey"
            columns: ["delivery_address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          gateway: string
          gateway_response: Json | null
          id: string
          order_id: string
          payment_id: string | null
          refund_amount: number | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          gateway: string
          gateway_response?: Json | null
          id?: string
          order_id: string
          payment_id?: string | null
          refund_amount?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          gateway?: string
          gateway_response?: Json | null
          id?: string
          order_id?: string
          payment_id?: string | null
          refund_amount?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      physiotherapy_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      physiotherapy_centres: {
        Row: {
          active: boolean | null
          address: string
          city: string
          contact: string | null
          created_at: string
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address: string
          city: string
          contact?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string
          contact?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      physiotherapy_services: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          duration: number | null
          id: string
          image_url: string | null
          name: string
          price: number
          sessions: number | null
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          sessions?: number | null
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          sessions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "physiotherapy_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "physiotherapy_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      prescriptions: {
        Row: {
          created_at: string
          doctor_name: string | null
          file_type: string
          file_url: string
          id: string
          notes: string | null
          order_id: string | null
          patient_name: string
          updated_at: string
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          doctor_name?: string | null
          file_type: string
          file_url: string
          id?: string
          notes?: string | null
          order_id?: string | null
          patient_name: string
          updated_at?: string
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          doctor_name?: string | null
          file_type?: string
          file_url?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          patient_name?: string
          updated_at?: string
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prescriptions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          pincode: string | null
          profile_image_url: string | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          pincode?: string | null
          profile_image_url?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotional_strips: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          link: string | null
          module_name: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          module_name: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          module_name?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          helpful_count: number | null
          id: string
          item_id: string
          item_type: string
          order_id: string | null
          rating: number
          title: string | null
          updated_at: string
          user_id: string
          verified_purchase: boolean | null
        }
        Insert: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          item_id: string
          item_type: string
          order_id?: string | null
          rating: number
          title?: string | null
          updated_at?: string
          user_id: string
          verified_purchase?: boolean | null
        }
        Update: {
          comment?: string | null
          created_at?: string
          helpful_count?: number | null
          id?: string
          item_id?: string
          item_type?: string
          order_id?: string | null
          rating?: number
          title?: string | null
          updated_at?: string
          user_id?: string
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      scan_variants: {
        Row: {
          created_at: string
          diagnostic_centre_id: string
          id: string
          price: number
          scan_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          diagnostic_centre_id: string
          id?: string
          price: number
          scan_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          diagnostic_centre_id?: string
          id?: string
          price?: number
          scan_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_variants_diagnostic_centre_id_fkey"
            columns: ["diagnostic_centre_id"]
            isOneToOne: false
            referencedRelation: "diagnostics_centres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scan_variants_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          category_id: string
          centre: string | null
          created_at: string
          description: string | null
          "discount price": number | null
          featured: boolean | null
          "home pickup": boolean | null
          id: string
          image_url: string | null
          instructions: string | null
          mrp: number
          name: string
          updated_at: string
        }
        Insert: {
          category_id: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          featured?: boolean | null
          "home pickup"?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp: number
          name: string
          updated_at?: string
        }
        Update: {
          category_id?: string
          centre?: string | null
          created_at?: string
          description?: string | null
          "discount price"?: number | null
          featured?: boolean | null
          "home pickup"?: boolean | null
          id?: string
          image_url?: string | null
          instructions?: string | null
          mrp?: number
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scans_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "scan_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      search_placeholders: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          module_name: string
          text: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          module_name: string
          text: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          module_name?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      services_cards: {
        Row: {
          active: boolean | null
          created_at: string
          icon_url: string | null
          id: string
          link: string
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon_url?: string | null
          id?: string
          link?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      surgeons: {
        Row: {
          bio: string | null
          contact: string | null
          created_at: string
          experience: number | null
          id: string
          image_url: string | null
          name: string
          qualification: string | null
          speciality_id: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name: string
          qualification?: string | null
          speciality_id: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name?: string
          qualification?: string | null
          speciality_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surgeons_speciality_id_fkey"
            columns: ["speciality_id"]
            isOneToOne: false
            referencedRelation: "surgery_specialities"
            referencedColumns: ["id"]
          },
        ]
      }
      surgery_procedures: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number | null
          speciality_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number | null
          speciality_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number | null
          speciality_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "surgery_procedures_speciality_id_fkey"
            columns: ["speciality_id"]
            isOneToOne: false
            referencedRelation: "surgery_specialities"
            referencedColumns: ["id"]
          },
        ]
      }
      surgery_specialities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          image_url: string | null
          location: string | null
          message: string
          name: string
          rating: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          message: string
          name: string
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          image_url?: string | null
          location?: string | null
          message?: string
          name?: string
          rating?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          centre_id: string
          contact: string | null
          created_at: string
          experience: number | null
          id: string
          image_url: string | null
          name: string
          qualification: string | null
          speciality: string | null
          updated_at: string
        }
        Insert: {
          centre_id: string
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name: string
          qualification?: string | null
          speciality?: string | null
          updated_at?: string
        }
        Update: {
          centre_id?: string
          contact?: string | null
          created_at?: string
          experience?: number | null
          id?: string
          image_url?: string | null
          name?: string
          qualification?: string | null
          speciality?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "therapists_centre_id_fkey"
            columns: ["centre_id"]
            isOneToOne: false
            referencedRelation: "physiotherapy_centres"
            referencedColumns: ["id"]
          },
        ]
      }
      trusted_partners: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          link: string | null
          logo_url: string
          name: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          link?: string | null
          logo_url: string
          name: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          link?: string | null
          logo_url?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          active: boolean | null
          address: string
          city: string
          commission_rate: number | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          latitude: number | null
          license_number: string | null
          longitude: number | null
          name: string
          phone: string | null
          pincode: string
          state: string
          type: string
          updated_at: string
          verification_status: string | null
        }
        Insert: {
          active?: boolean | null
          address: string
          city: string
          commission_rate?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name: string
          phone?: string | null
          pincode: string
          state: string
          type: string
          updated_at?: string
          verification_status?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string
          city?: string
          commission_rate?: number | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          latitude?: number | null
          license_number?: string | null
          longitude?: number | null
          name?: string
          phone?: string | null
          pincode?: string
          state?: string
          type?: string
          updated_at?: string
          verification_status?: string | null
        }
        Relationships: []
      }
      wellness_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      wellness_services: {
        Row: {
          category_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wellness_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "wellness_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_nearby_services: {
        Args: {
          radius_km?: number
          table_name: string
          user_lat: number
          user_lng: number
        }
        Returns: {
          distance_km: number
          service_data: Json
        }[]
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "moderator" | "user" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "moderator", "user", "manager"],
    },
  },
} as const
