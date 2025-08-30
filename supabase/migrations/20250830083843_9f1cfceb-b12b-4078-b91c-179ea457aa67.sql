-- ============= Physiotherapy Management Module =============

-- Physiotherapy Categories
CREATE TABLE public.physiotherapy_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Physiotherapists/Therapists
CREATE TABLE public.physiotherapists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    image_url TEXT,
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    qualifications TEXT[],
    specializations TEXT[],
    certifications TEXT[],
    languages TEXT[],
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    age INTEGER,
    verified BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    rating NUMERIC(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    location_restricted BOOLEAN DEFAULT true,
    service_radius_km INTEGER DEFAULT 10,
    city TEXT,
    state TEXT,
    pincode TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Physiotherapy Services
CREATE TABLE public.physiotherapy_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.physiotherapy_categories(id),
    therapist_id UUID REFERENCES public.physiotherapists(id),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    service_type TEXT CHECK (service_type IN ('home_visit', 'clinic_session', 'package')) DEFAULT 'home_visit',
    session_duration_minutes INTEGER DEFAULT 60,
    sessions_included INTEGER DEFAULT 1,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    location_restricted BOOLEAN DEFAULT true,
    service_radius_km INTEGER DEFAULT 10,
    city TEXT,
    state TEXT,
    pincode TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Physiotherapy Service Pricing (for session and therapist wise variations)
CREATE TABLE public.physiotherapy_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES public.physiotherapy_services(id),
    therapist_id UUID REFERENCES public.physiotherapists(id),
    session_type TEXT NOT NULL, -- single, package, consultation
    sessions_count INTEGER DEFAULT 1,
    price NUMERIC NOT NULL,
    discount_percentage NUMERIC DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
    valid_until TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Physiotherapy Offers/Discounts
CREATE TABLE public.physiotherapy_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    offer_type TEXT CHECK (offer_type IN ('percentage', 'fixed_amount', 'session_discount')) NOT NULL,
    discount_value NUMERIC NOT NULL,
    minimum_sessions INTEGER DEFAULT 1,
    maximum_discount_amount NUMERIC,
    applicable_to TEXT CHECK (applicable_to IN ('all', 'specific_services', 'specific_therapists')) DEFAULT 'all',
    applicable_ids UUID[],
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============= Insurance Plans Management Module =============

-- Insurance Providers/Companies
CREATE TABLE public.insurance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_email TEXT,
    contact_phone TEXT,
    logo_url TEXT,
    website TEXT,
    description TEXT,
    license_number TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insurance Categories
CREATE TABLE public.insurance_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Insurance Plans table (updating existing)
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.insurance_providers(id);
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.insurance_categories(id);
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('health', 'life', 'critical_illness', 'maternity', 'senior_citizen', 'opd', 'comprehensive'));
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS coverage_details JSONB;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS terms_conditions TEXT[];
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS waiting_period INTEGER DEFAULT 0;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS claim_process TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS network_hospitals TEXT[];
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS location_restricted BOOLEAN DEFAULT false;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS service_radius_km INTEGER DEFAULT 100;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.insurance_plans ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- ============= Hospitals Management Module =============

-- Hospital Categories
CREATE TABLE public.hospital_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Hospitals table (updating existing)
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.hospital_categories(id);
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS hospital_type TEXT CHECK (hospital_type IN ('government', 'private', 'trust', 'corporate'));
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS accreditation TEXT[];
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS facilities TEXT[];
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS procedures TEXT[];
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS bed_count INTEGER DEFAULT 0;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS icu_beds INTEGER DEFAULT 0;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS operation_theaters INTEGER DEFAULT 0;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS ambulance_services BOOLEAN DEFAULT false;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS pharmacy BOOLEAN DEFAULT false;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS lab_services BOOLEAN DEFAULT false;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS blood_bank BOOLEAN DEFAULT false;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS established_year INTEGER;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.hospitals ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Hospital Services/Packages
CREATE TABLE public.hospital_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES public.hospitals(id),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT, -- surgery, consultation, diagnostic, emergency
    price NUMERIC,
    duration_hours INTEGER,
    includes TEXT[],
    excludes TEXT[],
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Hospital Doctor Assignments
CREATE TABLE public.hospital_doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hospital_id UUID REFERENCES public.hospitals(id),
    doctor_id UUID REFERENCES public.doctors(id),
    department TEXT,
    position TEXT, -- consultant, senior_consultant, head_of_department
    available_days TEXT[], -- mon, tue, wed, thu, fri, sat, sun
    consultation_fee NUMERIC,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(hospital_id, doctor_id)
);

-- ============= Blood Banks Management Enhancement =============

-- Blood Donors
CREATE TABLE public.blood_donors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    age INTEGER,
    weight NUMERIC,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT,
    last_donation_date DATE,
    eligible_for_donation BOOLEAN DEFAULT true,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Blood Banks table (updating existing)
ALTER TABLE public.blood_banks ADD COLUMN IF NOT EXISTS license_number TEXT;
ALTER TABLE public.blood_banks ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('government', 'private', 'ngo', 'hospital_based'));
ALTER TABLE public.blood_banks ADD COLUMN IF NOT EXISTS facilities TEXT[];
ALTER TABLE public.blood_banks ADD COLUMN IF NOT EXISTS storage_capacity INTEGER DEFAULT 0;
ALTER TABLE public.blood_banks ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Blood Inventory
CREATE TABLE public.blood_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blood_bank_id UUID REFERENCES public.blood_banks(id),
    blood_group TEXT NOT NULL,
    component_type TEXT DEFAULT 'whole_blood', -- whole_blood, plasma, platelets, rbc
    units_available INTEGER DEFAULT 0,
    expiry_date DATE,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============= Ambulance Service Enhancement =============

-- Ambulance Providers
CREATE TABLE public.ambulance_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    provider_type TEXT CHECK (provider_type IN ('hospital', 'private', 'government', 'ngo')) NOT NULL,
    license_number TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Ambulance Services table (updating existing)
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.ambulance_providers(id);
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS ambulance_type TEXT CHECK (ambulance_type IN ('basic_life_support', 'advanced_life_support', 'icu_ambulance', 'neonatal_transport'));
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS registration_number TEXT;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS driver_name TEXT;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS driver_phone TEXT;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS paramedic_available BOOLEAN DEFAULT false;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS oxygen_support BOOLEAN DEFAULT false;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS ventilator_support BOOLEAN DEFAULT false;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS gps_tracking BOOLEAN DEFAULT false;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS current_status TEXT CHECK (current_status IN ('available', 'busy', 'maintenance', 'offline')) DEFAULT 'available';
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS last_maintenance DATE;
ALTER TABLE public.ambulance_services ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Ambulance Enquiries/Bookings
CREATE TABLE public.ambulance_enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    ambulance_service_id UUID REFERENCES public.ambulance_services(id),
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_condition TEXT,
    pickup_address TEXT NOT NULL,
    pickup_latitude NUMERIC,
    pickup_longitude NUMERIC,
    drop_address TEXT NOT NULL,
    drop_latitude NUMERIC,
    drop_longitude NUMERIC,
    urgency_level TEXT CHECK (urgency_level IN ('emergency', 'urgent', 'scheduled')) DEFAULT 'emergency',
    requested_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
    estimated_distance NUMERIC,
    estimated_cost NUMERIC,
    actual_cost NUMERIC,
    status TEXT CHECK (status IN ('pending', 'confirmed', 'assigned', 'in_transit', 'completed', 'cancelled')) DEFAULT 'pending',
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============= Diabetes Care Management Enhancement =============

-- Update existing diabetes tables to be consistent with the structure
ALTER TABLE public.diabetes_categories ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_products ADD COLUMN IF NOT EXISTS brand TEXT;
ALTER TABLE public.diabetes_products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.diabetes_products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.diabetes_products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE public.diabetes_services ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_services ADD COLUMN IF NOT EXISTS service_type TEXT CHECK (service_type IN ('consultation', 'home_visit', 'package'));
ALTER TABLE public.diabetes_services ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 30;

ALTER TABLE public.diabetes_tests ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_tests ADD COLUMN IF NOT EXISTS test_code TEXT;
ALTER TABLE public.diabetes_tests ADD COLUMN IF NOT EXISTS sample_type TEXT;
ALTER TABLE public.diabetes_tests ADD COLUMN IF NOT EXISTS report_delivery_hours INTEGER DEFAULT 24;

ALTER TABLE public.diabetes_experts ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_experts ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE public.diabetes_experts ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.diabetes_experts ADD COLUMN IF NOT EXISTS consultation_fee NUMERIC DEFAULT 0;
ALTER TABLE public.diabetes_experts ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT true;

ALTER TABLE public.diabetes_plans ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE public.diabetes_plans ADD COLUMN IF NOT EXISTS plan_type TEXT CHECK (plan_type IN ('basic', 'standard', 'premium'));
ALTER TABLE public.diabetes_plans ADD COLUMN IF NOT EXISTS includes TEXT[];

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for all new tables
CREATE TRIGGER update_physiotherapy_categories_updated_at BEFORE UPDATE ON public.physiotherapy_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physiotherapists_updated_at BEFORE UPDATE ON public.physiotherapists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physiotherapy_services_updated_at BEFORE UPDATE ON public.physiotherapy_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physiotherapy_pricing_updated_at BEFORE UPDATE ON public.physiotherapy_pricing FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_physiotherapy_offers_updated_at BEFORE UPDATE ON public.physiotherapy_offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_providers_updated_at BEFORE UPDATE ON public.insurance_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_categories_updated_at BEFORE UPDATE ON public.insurance_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_categories_updated_at BEFORE UPDATE ON public.hospital_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_services_updated_at BEFORE UPDATE ON public.hospital_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospital_doctors_updated_at BEFORE UPDATE ON public.hospital_doctors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_donors_updated_at BEFORE UPDATE ON public.blood_donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ambulance_providers_updated_at BEFORE UPDATE ON public.ambulance_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ambulance_enquiries_updated_at BEFORE UPDATE ON public.ambulance_enquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();