-- Fix security issues and complete cart integration

-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
    SELECT role::TEXT FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = now();
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$function$;

-- Add missing RLS policies for security compliance
-- Fix addresses table RLS
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses" 
ON public.addresses 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix profiles table RLS  
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.profiles;
CREATE POLICY "Users can view and edit own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix cart_items RLS (already secure)
DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
CREATE POLICY "Users can manage their own cart items" 
ON public.cart_items 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix orders RLS
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;

CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" 
ON public.orders 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Fix order_items RLS
DROP POLICY IF EXISTS "Users can view their order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order items" ON public.order_items;

CREATE POLICY "Users can view their order items" 
ON public.order_items 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all order items" 
ON public.order_items 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Fix payments RLS
DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;

CREATE POLICY "Users can view their payments" 
ON public.payments 
FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = payments.order_id 
    AND orders.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all payments" 
ON public.payments 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Fix prescriptions RLS
DROP POLICY IF EXISTS "Users can manage their prescriptions" ON public.prescriptions;
CREATE POLICY "Users can manage their prescriptions" 
ON public.prescriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix notifications RLS
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Fix wishlists RLS
DROP POLICY IF EXISTS "Users can manage their wishlists" ON public.wishlists;
CREATE POLICY "Users can manage their wishlists" 
ON public.wishlists 
FOR ALL 
USING (auth.uid() = user_id);

-- Fix reviews RLS
DROP POLICY IF EXISTS "Users can manage their reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;

CREATE POLICY "Users can manage their reviews" 
ON public.reviews 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Public can view approved reviews" 
ON public.reviews 
FOR SELECT 
USING (status = 'approved');

-- Add enhanced cart item details function for better cart experience
CREATE OR REPLACE FUNCTION public.get_enriched_cart_items(p_user_id UUID)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    item_type TEXT,
    item_id UUID,
    vendor_id UUID,
    quantity INTEGER,
    unit_price NUMERIC,
    total_price NUMERIC,
    prescription_required BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    item_name TEXT,
    item_image TEXT,
    item_description TEXT,
    vendor_name TEXT
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
    SELECT 
        ci.id,
        ci.user_id,
        ci.item_type,
        ci.item_id,
        ci.vendor_id,
        ci.quantity,
        ci.unit_price,
        ci.total_price,
        ci.prescription_required,
        ci.created_at,
        ci.updated_at,
        CASE 
            WHEN ci.item_type = 'medicine' THEN m.name
            WHEN ci.item_type = 'lab_test' THEN lt.name
            WHEN ci.item_type = 'scan' THEN s.name
            ELSE 'Unknown Item'
        END as item_name,
        CASE 
            WHEN ci.item_type = 'medicine' THEN m.image_url
            WHEN ci.item_type = 'lab_test' THEN lt.image_url
            WHEN ci.item_type = 'scan' THEN s.image_url
            ELSE NULL
        END as item_image,
        CASE 
            WHEN ci.item_type = 'medicine' THEN m.description
            WHEN ci.item_type = 'lab_test' THEN lt.description
            WHEN ci.item_type = 'scan' THEN s.description
            ELSE NULL
        END as item_description,
        v.name as vendor_name
    FROM public.cart_items ci
    LEFT JOIN public.medicines m ON ci.item_type = 'medicine' AND ci.item_id = m.id
    LEFT JOIN public.lab_tests lt ON ci.item_type = 'lab_test' AND ci.item_id = lt.id
    LEFT JOIN public.scans s ON ci.item_type = 'scan' AND ci.item_id = s.id
    LEFT JOIN public.vendors v ON ci.vendor_id = v.id
    WHERE ci.user_id = p_user_id
    ORDER BY ci.created_at DESC;
$function$;