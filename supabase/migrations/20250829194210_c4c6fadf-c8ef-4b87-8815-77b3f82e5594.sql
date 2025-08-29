-- Create family_members table for Phase 2.3 completion
CREATE TABLE IF NOT EXISTS public.family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    phone TEXT,
    email TEXT,
    chronic_conditions TEXT[],
    allergies TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on family_members
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for family_members
CREATE POLICY "Users can manage their family members" 
ON public.family_members 
FOR ALL 
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_family_members_updated_at
    BEFORE UPDATE ON public.family_members
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add missing columns to profiles table for complete profile management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS chronic_conditions TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allergies TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT;

-- Enhance prescriptions table for better prescription management
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS prescription_date DATE;
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS doctor_name TEXT;
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS hospital_name TEXT;
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS diagnosis TEXT;
ALTER TABLE public.prescriptions ADD COLUMN IF NOT EXISTS family_member_id UUID REFERENCES public.family_members(id);

-- Add family member column to wishlists for family-based wishlists
ALTER TABLE public.wishlists ADD COLUMN IF NOT EXISTS family_member_id UUID REFERENCES public.family_members(id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_family_member ON public.prescriptions(family_member_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_family_member ON public.wishlists(family_member_id);