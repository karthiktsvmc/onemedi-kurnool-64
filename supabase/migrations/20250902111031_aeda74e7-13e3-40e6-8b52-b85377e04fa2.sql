-- Fix function search path security issues
ALTER FUNCTION public.generate_order_number() SET search_path = 'public';
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public';
ALTER FUNCTION public.calculate_distance(numeric, numeric, numeric, numeric) SET search_path = 'public';
ALTER FUNCTION public.get_nearby_services(text, numeric, numeric, integer) SET search_path = 'public';
ALTER FUNCTION public.handle_new_user() SET search_path = 'public';
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';

-- Move pg_trgm extension from public to extensions schema
DROP EXTENSION IF EXISTS pg_trgm CASCADE;
CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;