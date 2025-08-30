-- Create care_takers table for home care staff management
CREATE TABLE public.care_takers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  phone TEXT,
  email TEXT,
  qualifications TEXT[],
  specializations TEXT[],
  experience_years INTEGER DEFAULT 0,
  bio TEXT,
  image_url TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  available BOOLEAN DEFAULT true,
  location_restricted BOOLEAN DEFAULT true,
  service_radius_km INTEGER DEFAULT 10,
  hourly_rate NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  services TEXT[], -- Array of service IDs they can handle
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create homecare_offers table for discounts and promotions
CREATE TABLE public.homecare_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  offer_type TEXT NOT NULL CHECK (offer_type IN ('percentage', 'fixed_amount', 'buy_one_get_one')),
  discount_value NUMERIC NOT NULL,
  minimum_order_amount NUMERIC DEFAULT 0,
  maximum_discount_amount NUMERIC,
  applicable_to TEXT NOT NULL CHECK (applicable_to IN ('all', 'category', 'service', 'location')),
  applicable_ids TEXT[], -- category_ids, service_ids, or location_codes
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create homecare_bookings table for booking management
CREATE TABLE public.homecare_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID REFERENCES homecare_services(id),
  care_taker_id UUID REFERENCES care_takers(id),
  booking_date DATE NOT NULL,
  start_time TIME,
  duration_minutes INTEGER,
  sessions INTEGER DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  offer_id UUID REFERENCES homecare_offers(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  customer_address TEXT,
  customer_phone TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create care_taker_services junction table for many-to-many relationship
CREATE TABLE public.care_taker_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  care_taker_id UUID REFERENCES care_takers(id) ON DELETE CASCADE,
  service_id UUID REFERENCES homecare_services(id) ON DELETE CASCADE,
  experience_years INTEGER DEFAULT 0,
  specialization_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(care_taker_id, service_id)
);

-- Enable RLS on all tables
ALTER TABLE public.care_takers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homecare_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homecare_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.care_taker_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for care_takers
CREATE POLICY "Admins can manage care takers" ON public.care_takers
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Public read access to available care takers" ON public.care_takers
  FOR SELECT USING (available = true);

-- RLS Policies for homecare_offers
CREATE POLICY "Admins can manage homecare offers" ON public.homecare_offers
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Public can view active offers" ON public.homecare_offers
  FOR SELECT USING (active = true AND valid_from <= now() AND valid_until >= now());

-- RLS Policies for homecare_bookings
CREATE POLICY "Admins can manage all bookings" ON public.homecare_bookings
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Users can manage their own bookings" ON public.homecare_bookings
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for care_taker_services
CREATE POLICY "Admins can manage care taker services" ON public.care_taker_services
  FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Public read access to care taker services" ON public.care_taker_services
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_care_takers_location ON care_takers(city, state, pincode);
CREATE INDEX idx_care_takers_available ON care_takers(available);
CREATE INDEX idx_care_takers_rating ON care_takers(rating DESC);
CREATE INDEX idx_homecare_offers_active ON homecare_offers(active, valid_from, valid_until);
CREATE INDEX idx_homecare_bookings_user ON homecare_bookings(user_id);
CREATE INDEX idx_homecare_bookings_date ON homecare_bookings(booking_date);
CREATE INDEX idx_care_taker_services_lookup ON care_taker_services(care_taker_id, service_id);

-- Create triggers for updated_at columns
CREATE TRIGGER update_care_takers_updated_at
  BEFORE UPDATE ON care_takers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homecare_offers_updated_at
  BEFORE UPDATE ON homecare_offers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_homecare_bookings_updated_at
  BEFORE UPDATE ON homecare_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add some sample data for care takers
INSERT INTO public.care_takers (name, age, gender, phone, qualifications, specializations, experience_years, bio, available, city, state, hourly_rate, rating, review_count, verified) VALUES
('Priya Sharma', 28, 'female', '+91-9876543210', ARRAY['Registered Nurse', 'BLS Certified'], ARRAY['Nursing Care', 'Medication Management'], 5, 'Experienced registered nurse specializing in home healthcare with 5 years of clinical experience.', true, 'Kurnool', 'Andhra Pradesh', 300, 4.8, 127, true),
('Rajesh Kumar', 35, 'male', '+91-9876543211', ARRAY['Physiotherapist', 'BPT', 'MPT'], ARRAY['Physiotherapy', 'Rehabilitation'], 8, 'Licensed physiotherapist with expertise in home-based rehabilitation and elderly care.', true, 'Kurnool', 'Andhra Pradesh', 400, 4.9, 89, true),
('Sunita Devi', 32, 'female', '+91-9876543212', ARRAY['CNA Certified', 'Elder Care Specialist'], ARRAY['Elder Care', 'Personal Care'], 6, 'Compassionate caregiver specializing in elderly care and personal assistance.', true, 'Kurnool', 'Andhra Pradesh', 250, 4.7, 156, true);