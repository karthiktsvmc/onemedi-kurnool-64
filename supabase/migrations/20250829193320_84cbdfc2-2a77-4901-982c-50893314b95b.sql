-- Fix security issues - simplified version without status column

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

-- Fix all RLS policies for security compliance
-- Addresses table RLS
DROP POLICY IF EXISTS "Users can manage their own addresses" ON public.addresses;
CREATE POLICY "Users can manage their own addresses" 
ON public.addresses 
FOR ALL 
USING (auth.uid() = user_id);

-- Profiles table RLS  
DROP POLICY IF EXISTS "Users can view and edit own profile" ON public.profiles;
CREATE POLICY "Users can view and edit own profile" 
ON public.profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Orders RLS
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

-- Order items RLS
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

-- Payments RLS
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

-- Prescriptions RLS
DROP POLICY IF EXISTS "Users can manage their prescriptions" ON public.prescriptions;
CREATE POLICY "Users can manage their prescriptions" 
ON public.prescriptions 
FOR ALL 
USING (auth.uid() = user_id);

-- Notifications RLS
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Wishlists RLS
DROP POLICY IF EXISTS "Users can manage their wishlists" ON public.wishlists;
CREATE POLICY "Users can manage their wishlists" 
ON public.wishlists 
FOR ALL 
USING (auth.uid() = user_id);

-- Reviews RLS (no status column)
DROP POLICY IF EXISTS "Users can manage their reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;

CREATE POLICY "Users can manage their reviews" 
ON public.reviews 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Public can view reviews" 
ON public.reviews 
FOR SELECT 
USING (true);