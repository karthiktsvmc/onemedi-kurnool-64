-- Assign super admin role to karthiktsvmc@gmail.com
-- This migration should be run after the user has signed up

DO $$
DECLARE
    target_user_id UUID;
BEGIN
    -- Get the user ID for karthiktsvmc@gmail.com
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = 'karthiktsvmc@gmail.com';
    
    IF target_user_id IS NOT NULL THEN
        -- Remove any existing roles for this user
        DELETE FROM public.user_roles WHERE user_id = target_user_id;
        
        -- Assign super_admin role
        INSERT INTO public.user_roles (user_id, role, assigned_by)
        VALUES (target_user_id, 'super_admin', target_user_id);
        
        RAISE NOTICE 'Successfully assigned super_admin role to karthiktsvmc@gmail.com';
    ELSE
        RAISE NOTICE 'User karthiktsvmc@gmail.com not found. Please ensure the user has signed up first.';
    END IF;
END $$;