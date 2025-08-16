-- Create doctor specialties table
CREATE TABLE public.doctor_specialties (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  image_url text,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create doctors table
CREATE TABLE public.doctors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  phone text,
  image_url text,
  qualification text,
  experience integer DEFAULT 0,
  age integer,
  about text,
  verified boolean DEFAULT false,
  active boolean DEFAULT true,
  specialty_id uuid REFERENCES public.doctor_specialties(id),
  languages text[] DEFAULT '{}',
  expertise text[] DEFAULT '{}',
  procedures text[] DEFAULT '{}',
  gender text,
  registration_number text,
  clinic_name text,
  clinic_address text,
  clinic_city text,
  clinic_state text,
  clinic_pincode text,
  clinic_latitude numeric,
  clinic_longitude numeric,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create consultation types table
CREATE TABLE public.consultation_types (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('online', 'clinic', 'home')),
  available boolean DEFAULT true,
  fee numeric DEFAULT 0,
  duration_minutes integer DEFAULT 30,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, type)
);

-- Create doctor schedules table
CREATE TABLE public.doctor_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id uuid NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  consultation_type text NOT NULL CHECK (consultation_type IN ('online', 'clinic', 'home')),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0 = Sunday, 6 = Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_duration_minutes integer DEFAULT 30,
  active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create doctor promotional strips table
CREATE TABLE public.doctor_promotional_strips (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  specialty_id uuid REFERENCES public.doctor_specialties(id),
  image_url text,
  link text,
  active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for all tables
ALTER TABLE public.doctor_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_promotional_strips ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access and admin management
CREATE POLICY "Public read access to doctor specialties" ON public.doctor_specialties FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage doctor specialties" ON public.doctor_specialties FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to doctors" ON public.doctors FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage doctors" ON public.doctors FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to consultation types" ON public.consultation_types FOR SELECT USING (available = true);
CREATE POLICY "Admins can manage consultation types" ON public.consultation_types FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to doctor schedules" ON public.doctor_schedules FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage doctor schedules" ON public.doctor_schedules FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to doctor promotional strips" ON public.doctor_promotional_strips FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage doctor promotional strips" ON public.doctor_promotional_strips FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Add update triggers
CREATE TRIGGER update_doctor_specialties_updated_at
  BEFORE UPDATE ON public.doctor_specialties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consultation_types_updated_at
  BEFORE UPDATE ON public.consultation_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_schedules_updated_at
  BEFORE UPDATE ON public.doctor_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctor_promotional_strips_updated_at
  BEFORE UPDATE ON public.doctor_promotional_strips
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_doctors_specialty_id ON public.doctors(specialty_id);
CREATE INDEX idx_doctors_active ON public.doctors(active);
CREATE INDEX idx_consultation_types_doctor_id ON public.consultation_types(doctor_id);
CREATE INDEX idx_doctor_schedules_doctor_id ON public.doctor_schedules(doctor_id);
CREATE INDEX idx_doctor_promotional_strips_specialty_id ON public.doctor_promotional_strips(specialty_id);