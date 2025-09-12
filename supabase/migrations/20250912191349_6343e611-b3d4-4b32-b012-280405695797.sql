-- Update RLS policies across all tables to use new role functions
-- This migration ensures proper security across the entire application

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

-- Update profiles table policies (create if not exists)
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

-- Update orders table policies (create if not exists)
-- First check if orders table exists and enable RLS
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
        DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
        
        CREATE POLICY "Users can view their own orders"
        ON public.orders
        FOR SELECT
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Admins can manage all orders"
        ON public.orders
        FOR ALL
        USING (public.is_admin());
    END IF;
END $$;

-- Update order_items table policies (create if not exists)
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'order_items') THEN
        ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
        DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;
        
        CREATE POLICY "Users can view their order items"
        ON public.order_items
        FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM public.orders 
                WHERE orders.id = order_items.order_id 
                AND orders.user_id = auth.uid()
            )
        );
        
        CREATE POLICY "Admins can manage all order items"
        ON public.order_items
        FOR ALL
        USING (public.is_admin());
    END IF;
END $$;

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

-- Update all other admin-managed tables with consistent policies
-- This includes: hero_banners, coupons, doctors, medicines, lab_tests, etc.

-- Hero banners
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

-- Coupons
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

-- Coupon usage
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

-- Audit logs
DROP POLICY IF EXISTS "Super admins can view audit logs" ON public.audit_logs;

CREATE POLICY "Super admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (public.is_super_admin());

-- Create policies for inventory-related tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'inventory_alerts') THEN
        ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Admins can manage inventory alerts" ON public.inventory_alerts;
        
        CREATE POLICY "Admins can manage inventory alerts"
        ON public.inventory_alerts
        FOR ALL
        USING (public.is_admin());
    END IF;
END $$;

-- Ensure all service tables have proper admin access
-- These tables should be readable by public but manageable only by admins

-- Medicine-related tables
DO $$
DECLARE
    table_name TEXT;
    tables_array TEXT[] := ARRAY[
        'medicines', 'medicine_categories', 'medicine_variants',
        'lab_tests', 'lab_test_categories', 'lab_packages',
        'scan_tests', 'scan_categories', 'scan_packages',
        'doctors', 'doctor_specialties', 'doctor_schedules',
        'hospitals', 'blood_banks', 'ambulance_services',
        'insurance_plans', 'homecare_services', 'homecare_categories',
        'diabetes_categories', 'diabetes_products', 'diabetes_services',
        'diet_guides'
    ];
BEGIN
    FOREACH table_name IN ARRAY tables_array
    LOOP
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = table_name) THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
            
            -- Drop existing policies
            EXECUTE format('DROP POLICY IF EXISTS "Admins can manage %s" ON public.%I', table_name, table_name);
            EXECUTE format('DROP POLICY IF EXISTS "Public read access" ON public.%I', table_name);
            EXECUTE format('DROP POLICY IF EXISTS "Public read access to %s" ON public.%I', table_name, table_name);
            
            -- Create new policies
            EXECUTE format('CREATE POLICY "Admins can manage %s" ON public.%I FOR ALL USING (public.is_admin())', table_name, table_name);
            EXECUTE format('CREATE POLICY "Public read access" ON public.%I FOR SELECT USING (true)', table_name);
        END IF;
    END LOOP;
END $$;