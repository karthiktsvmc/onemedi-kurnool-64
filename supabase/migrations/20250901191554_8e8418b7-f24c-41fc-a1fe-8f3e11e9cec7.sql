-- Create prescriptions storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', false);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    order_id UUID,
    patient_name TEXT NOT NULL,
    family_member_id UUID,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    original_filename TEXT,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
    verified_by UUID,
    verified_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    prescription_date DATE,
    doctor_name TEXT,
    hospital_name TEXT,
    diagnosis TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own prescriptions" 
ON public.prescriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prescriptions" 
ON public.prescriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescriptions" 
ON public.prescriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prescriptions" 
ON public.prescriptions 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all prescriptions" 
ON public.prescriptions 
FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Storage policies
CREATE POLICY "Users can upload their own prescription files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own prescription files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own prescription files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own prescription files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can manage all prescription files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'prescriptions' AND get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Add updated_at trigger
CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON public.prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_prescriptions_user_id ON public.prescriptions(user_id);
CREATE INDEX idx_prescriptions_order_id ON public.prescriptions(order_id);
CREATE INDEX idx_prescriptions_verification_status ON public.prescriptions(verification_status);
CREATE INDEX idx_prescriptions_created_at ON public.prescriptions(created_at);
CREATE INDEX idx_prescriptions_prescription_date ON public.prescriptions(prescription_date);