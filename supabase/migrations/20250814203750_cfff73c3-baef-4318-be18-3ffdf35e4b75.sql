-- ========================================
-- ROW LEVEL SECURITY POLICIES
-- ========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostics_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_centres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physiotherapy_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diabetes_diets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homecare_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homecare_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_specialities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgeons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surgery_procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambulance_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blood_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_strips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_placeholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusted_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mega_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mobile_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bottom_navigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotional_strips ENABLE ROW LEVEL SECURITY;

-- ========================================
-- USER PROFILES POLICIES
-- ========================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.get_current_user_role() IN ('super_admin', 'admin'));

-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE USING (public.get_current_user_role() IN ('super_admin', 'admin'));

-- ========================================
-- USER ROLES POLICIES
-- ========================================

-- Only super_admin can manage user roles
CREATE POLICY "Super admins can manage user roles" ON public.user_roles
FOR ALL USING (public.get_current_user_role() = 'super_admin');

-- Users can view their own roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

-- ========================================
-- PUBLIC READ POLICIES (Frontend Data)
-- ========================================

-- All tables that need to be publicly readable for frontend
CREATE POLICY "Public read access" ON public.medicine_brands FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.medicine_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.medicines FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diagnostics_centres FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.lab_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.lab_tests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.lab_test_variants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.lab_packages FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.scan_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.scans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.scan_variants FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.physiotherapy_centres FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.physiotherapy_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.therapists FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.physiotherapy_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_experts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_tests FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_plans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diabetes_diets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.homecare_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.homecare_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.surgery_specialities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.surgeons FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.surgery_procedures FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.hospitals FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.ambulance_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.blood_banks FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.insurance_plans FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.diet_guides FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.wellness_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.wellness_services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.hero_banners FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.offer_strips FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.search_placeholders FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.services_cards FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.carousels FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.carousel_items FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.trusted_partners FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.mega_menu FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.mobile_menu FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.bottom_navigation FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON public.promotional_strips FOR SELECT USING (active = true);

-- ========================================
-- ADMIN MANAGEMENT POLICIES
-- ========================================

-- Admin and super_admin can manage all content
CREATE POLICY "Admins can manage medicine brands" ON public.medicine_brands
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage medicine categories" ON public.medicine_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage medicines" ON public.medicines
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diagnostic centres" ON public.diagnostics_centres
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage lab categories" ON public.lab_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage lab tests" ON public.lab_tests
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage lab test variants" ON public.lab_test_variants
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage lab packages" ON public.lab_packages
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage scan categories" ON public.scan_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage scans" ON public.scans
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage scan variants" ON public.scan_variants
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage physiotherapy centres" ON public.physiotherapy_centres
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage physiotherapy categories" ON public.physiotherapy_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage therapists" ON public.therapists
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage physiotherapy services" ON public.physiotherapy_services
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes categories" ON public.diabetes_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes experts" ON public.diabetes_experts
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes products" ON public.diabetes_products
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes services" ON public.diabetes_services
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes tests" ON public.diabetes_tests
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes plans" ON public.diabetes_plans
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diabetes diets" ON public.diabetes_diets
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage homecare categories" ON public.homecare_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage homecare services" ON public.homecare_services
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage surgery specialities" ON public.surgery_specialities
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage surgeons" ON public.surgeons
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage surgery procedures" ON public.surgery_procedures
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage hospitals" ON public.hospitals
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage ambulance services" ON public.ambulance_services
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage blood banks" ON public.blood_banks
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage insurance plans" ON public.insurance_plans
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage diet guides" ON public.diet_guides
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage wellness categories" ON public.wellness_categories
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage wellness services" ON public.wellness_services
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage hero banners" ON public.hero_banners
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage offer strips" ON public.offer_strips
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage search placeholders" ON public.search_placeholders
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage services cards" ON public.services_cards
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage carousels" ON public.carousels
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage carousel items" ON public.carousel_items
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage testimonials" ON public.testimonials
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage trusted partners" ON public.trusted_partners
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage mega menu" ON public.mega_menu
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage mobile menu" ON public.mobile_menu
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage bottom navigation" ON public.bottom_navigation
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can manage promotional strips" ON public.promotional_strips
FOR ALL USING (public.get_current_user_role() IN ('super_admin', 'admin'));

-- ========================================
-- ENABLE REALTIME FOR TABLES
-- ========================================

-- Enable realtime for all tables to support real-time sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicine_brands;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicine_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.medicines;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diagnostics_centres;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_test_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lab_packages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scan_variants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.physiotherapy_centres;
ALTER PUBLICATION supabase_realtime ADD TABLE public.physiotherapy_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.therapists;
ALTER PUBLICATION supabase_realtime ADD TABLE public.physiotherapy_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_experts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_tests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diabetes_diets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homecare_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homecare_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.surgery_specialities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.surgeons;
ALTER PUBLICATION supabase_realtime ADD TABLE public.surgery_procedures;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hospitals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ambulance_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blood_banks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.insurance_plans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.diet_guides;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wellness_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.wellness_services;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_banners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.offer_strips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.search_placeholders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.services_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE public.carousels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.carousel_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.testimonials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusted_partners;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mega_menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mobile_menu;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bottom_navigation;
ALTER PUBLICATION supabase_realtime ADD TABLE public.promotional_strips;