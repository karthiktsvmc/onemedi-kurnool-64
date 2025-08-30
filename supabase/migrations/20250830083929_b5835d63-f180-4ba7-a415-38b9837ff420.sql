-- ============= RLS Policies Setup =============

-- Enable RLS on all new tables
ALTER TABLE public.physiotherapy_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_enquiries ENABLE ROW LEVEL SECURITY;

-- Physiotherapy RLS Policies
CREATE POLICY "Admins can manage physiotherapy categories" ON public.physiotherapy_categories
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to physiotherapy categories" ON public.physiotherapy_categories
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage physiotherapists" ON public.physiotherapists
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to available physiotherapists" ON public.physiotherapists
    FOR SELECT USING (available = true AND verified = true);

CREATE POLICY "Admins can manage physiotherapy services" ON public.physiotherapy_services
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to physiotherapy services" ON public.physiotherapy_services
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage physiotherapy pricing" ON public.physiotherapy_pricing
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to physiotherapy pricing" ON public.physiotherapy_pricing
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage physiotherapy offers" ON public.physiotherapy_offers
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to active physiotherapy offers" ON public.physiotherapy_offers
    FOR SELECT USING (active = true AND valid_from <= now() AND valid_until >= now());

-- Insurance RLS Policies
CREATE POLICY "Admins can manage insurance providers" ON public.insurance_providers
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to insurance providers" ON public.insurance_providers
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage insurance categories" ON public.insurance_categories
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to insurance categories" ON public.insurance_categories
    FOR SELECT USING (active = true);

-- Hospital RLS Policies
CREATE POLICY "Admins can manage hospital categories" ON public.hospital_categories
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to hospital categories" ON public.hospital_categories
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage hospital services" ON public.hospital_services
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to hospital services" ON public.hospital_services
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage hospital doctors" ON public.hospital_doctors
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to hospital doctors" ON public.hospital_doctors
    FOR SELECT USING (active = true);

-- Blood Banks RLS Policies
CREATE POLICY "Admins can manage blood donors" ON public.blood_donors
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to eligible blood donors" ON public.blood_donors
    FOR SELECT USING (active = true AND eligible_for_donation = true);

CREATE POLICY "Admins can manage blood inventory" ON public.blood_inventory
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to blood inventory" ON public.blood_inventory
    FOR SELECT USING (true);

-- Ambulance RLS Policies
CREATE POLICY "Admins can manage ambulance providers" ON public.ambulance_providers
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to ambulance providers" ON public.ambulance_providers
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage ambulance enquiries" ON public.ambulance_enquiries
    FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Users can create ambulance enquiries" ON public.ambulance_enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their ambulance enquiries" ON public.ambulance_enquiries
    FOR SELECT USING (auth.uid() = user_id OR get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Users can update their ambulance enquiries" ON public.ambulance_enquiries
    FOR UPDATE USING (auth.uid() = user_id OR get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create indexes for better performance
CREATE INDEX idx_physiotherapy_services_category ON public.physiotherapy_services(category_id);
CREATE INDEX idx_physiotherapy_services_therapist ON public.physiotherapy_services(therapist_id);
CREATE INDEX idx_physiotherapy_services_location ON public.physiotherapy_services(city, state, pincode);
CREATE INDEX idx_physiotherapy_pricing_service ON public.physiotherapy_pricing(service_id);
CREATE INDEX idx_physiotherapy_pricing_therapist ON public.physiotherapy_pricing(therapist_id);

CREATE INDEX idx_insurance_plans_provider ON public.insurance_plans(provider_id);
CREATE INDEX idx_insurance_plans_category ON public.insurance_plans(category_id);
CREATE INDEX idx_insurance_plans_location ON public.insurance_plans(city, state, pincode);

CREATE INDEX idx_hospital_services_hospital ON public.hospital_services(hospital_id);
CREATE INDEX idx_hospital_doctors_hospital ON public.hospital_doctors(hospital_id);
CREATE INDEX idx_hospital_doctors_doctor ON public.hospital_doctors(doctor_id);

CREATE INDEX idx_blood_inventory_bank ON public.blood_inventory(blood_bank_id);
CREATE INDEX idx_blood_inventory_group ON public.blood_inventory(blood_group);
CREATE INDEX idx_blood_donors_location ON public.blood_donors(city, state);
CREATE INDEX idx_blood_donors_group ON public.blood_donors(blood_group);

CREATE INDEX idx_ambulance_services_provider ON public.ambulance_services(provider_id);
CREATE INDEX idx_ambulance_enquiries_service ON public.ambulance_enquiries(ambulance_service_id);
CREATE INDEX idx_ambulance_enquiries_user ON public.ambulance_enquiries(user_id);
CREATE INDEX idx_ambulance_enquiries_status ON public.ambulance_enquiries(status);