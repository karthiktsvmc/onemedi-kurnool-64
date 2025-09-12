-- Fix RLS policies with corrected variable names
-- Update key security policies for user data and admin access

-- Update addresses table policies
DROP POLICY IF EXISTS "Admins can view all addresses" ON public.addresses;
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;

CREATE POLICY "Admins can view all addresses"
ON public.addresses
FOR SELECT
USING (public.is_admin());

CREATE POLICY "Users can manage their own addresses"
ON public.addresses
FOR ALL
USING (auth.uid() = user_id);

-- Update cart_items table policies
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;

CREATE POLICY "Users can manage their own cart items"
ON public.cart_items
FOR ALL
USING (auth.uid() = user_id);

-- Update family_members table policies
DROP POLICY IF EXISTS "Users can manage their family members" ON public.family_members;

CREATE POLICY "Users can manage their family members"
ON public.family_members
FOR ALL
USING (auth.uid() = user_id);

-- Update profiles table policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view and update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view and update own profile"
ON public.profiles
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- Update business_settings table policies
DROP POLICY IF EXISTS "Admins can manage business settings" ON public.business_settings;
DROP POLICY IF EXISTS "Public read access to business settings" ON public.business_settings;

CREATE POLICY "Admins can manage business settings"
ON public.business_settings
FOR ALL
USING (public.is_admin());

CREATE POLICY "Public read access to business settings"
ON public.business_settings
FOR SELECT
USING (true);

-- Update hero_banners table policies
DROP POLICY IF EXISTS "Admins can manage hero banners" ON public.hero_banners;
DROP POLICY IF EXISTS "Public read access" ON public.hero_banners;

CREATE POLICY "Admins can manage hero banners"
ON public.hero_banners
FOR ALL
USING (public.is_admin());

CREATE POLICY "Public read access to active banners"
ON public.hero_banners
FOR SELECT
USING (active = true);

-- Update coupons table policies
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public can view active coupons" ON public.coupons;

CREATE POLICY "Admins can manage coupons"
ON public.coupons
FOR ALL
USING (public.is_admin());

CREATE POLICY "Public can view active coupons"
ON public.coupons
FOR SELECT
USING (active = true AND valid_from <= now() AND valid_until >= now());

-- Update coupon_usage table policies
DROP POLICY IF EXISTS "Admins can manage coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Users can create coupon usage" ON public.coupon_usage;
DROP POLICY IF EXISTS "Users can view their coupon usage" ON public.coupon_usage;

CREATE POLICY "Admins can manage coupon usage"
ON public.coupon_usage
FOR ALL
USING (public.is_admin());

CREATE POLICY "Users can create coupon usage"
ON public.coupon_usage
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their coupon usage"
ON public.coupon_usage
FOR SELECT
USING (auth.uid() = user_id);

-- Update audit_logs table policies
DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.audit_logs;

CREATE POLICY "Super admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (public.is_super_admin());