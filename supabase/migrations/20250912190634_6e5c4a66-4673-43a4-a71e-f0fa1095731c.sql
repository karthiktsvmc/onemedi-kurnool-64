-- Create simplified role-based access control system
-- Drop existing type and table if they exist
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TYPE IF EXISTS public.app_role CASCADE;

-- Create role enum with only essential roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'vendor', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role app_role NOT NULL DEFAULT 'user',
    assigned_by UUID REFERENCES auth.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role::TEXT FROM public.user_roles WHERE user_id = auth.uid() ORDER BY 
        CASE role 
            WHEN 'super_admin' THEN 1
            WHEN 'admin' THEN 2
            WHEN 'vendor' THEN 3
            ELSE 10
        END
    LIMIT 1;
$$;

-- Create function to check if user has admin privileges
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = ANY(ARRAY['super_admin', 'admin']::app_role[])
    );
$$;

-- Create function to check if user has super admin privileges
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    );
$$;

-- Create RLS policies for user_roles table
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
USING (public.is_super_admin());

CREATE POLICY "Admins can view and manage non-super-admin roles"
ON public.user_roles
FOR ALL
USING (
    public.is_admin() 
    AND role != 'super_admin'
);

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Update handle_new_user function to assign default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Insert into profiles
    INSERT INTO public.profiles (user_id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email)
    ON CONFLICT (user_id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        email = COALESCE(EXCLUDED.email, profiles.email),
        updated_at = now();
    
    -- Assign default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$$;

-- Create trigger for new users (drop and recreate to ensure it's up to date)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger to user_roles
CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON public.user_roles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Make karthiktsvmc@gmail.com a super admin
DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID for karthiktsvmc@gmail.com
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'karthiktsvmc@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Remove any existing roles
        DELETE FROM public.user_roles WHERE user_id = target_user_id;
        
        -- Assign super_admin role
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (target_user_id, 'super_admin', target_user_id);
        
        RAISE NOTICE 'Successfully assigned super_admin role to karthiktsvmc@gmail.com';
    ELSE
        RAISE NOTICE 'User karthiktsvmc@gmail.com not found. Please ensure the user has signed up first.';
    END IF;
END $$;