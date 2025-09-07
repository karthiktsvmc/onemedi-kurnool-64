-- Enhanced Prescription Management System with Storage and OCR capabilities

-- Create storage bucket for prescriptions
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prescriptions', 'prescriptions', false)
ON CONFLICT (id) DO NOTHING;

-- Enhanced prescriptions table with OCR fields
ALTER TABLE prescriptions 
ADD COLUMN IF NOT EXISTS ocr_text TEXT,
ADD COLUMN IF NOT EXISTS ocr_confidence NUMERIC,
ADD COLUMN IF NOT EXISTS medicines_extracted JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS dosage_extracted JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- Storage policies for prescriptions
CREATE POLICY "Users can upload their own prescriptions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own prescriptions" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'prescriptions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all prescriptions" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'prescriptions' AND get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create payment gateways configuration table
CREATE TABLE IF NOT EXISTS payment_gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    gateway_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    test_mode BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default payment gateways
INSERT INTO payment_gateways (name, gateway_key, config) VALUES
('Razorpay', 'razorpay', '{"webhook_secret": "", "key_id": "", "key_secret": ""}'::jsonb),
('PhonePe', 'phonepe', '{"merchant_id": "", "salt_key": "", "salt_index": 1}'::jsonb),
('Paytm', 'paytm', '{"merchant_id": "", "merchant_key": "", "website": "WEBSTAGING"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Enhanced payments table with gateway details
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS gateway_name TEXT DEFAULT 'razorpay',
ADD COLUMN IF NOT EXISTS gateway_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS gateway_response JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS payment_method TEXT,
ADD COLUMN IF NOT EXISTS refund_amount NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS refund_status TEXT DEFAULT 'none';

-- Create campaign management tables for marketing
CREATE TABLE IF NOT EXISTS marketing_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- email, sms, whatsapp, push
    status TEXT DEFAULT 'draft', -- draft, scheduled, active, paused, completed
    target_audience JSONB DEFAULT '{}'::jsonb,
    message_content JSONB NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    stats JSONB DEFAULT '{"sent": 0, "delivered": 0, "opened": 0, "clicked": 0}'::jsonb,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- WhatsApp integration settings
CREATE TABLE IF NOT EXISTS whatsapp_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'aisensy',
    api_key TEXT,
    phone_number TEXT,
    template_configs JSONB DEFAULT '{}'::jsonb,
    webhook_url TEXT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- SEO settings table
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_type TEXT NOT NULL, -- home, medicines, lab_tests, etc.
    page_identifier TEXT, -- specific page ID if applicable
    meta_title TEXT,
    meta_description TEXT,
    meta_keywords TEXT[],
    structured_data JSONB DEFAULT '{}'::jsonb,
    canonical_url TEXT,
    robots_meta TEXT DEFAULT 'index,follow',
    og_title TEXT,
    og_description TEXT,
    og_image TEXT,
    twitter_title TEXT,
    twitter_description TEXT,
    twitter_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(page_type, page_identifier)
);

-- PWA settings
CREATE TABLE IF NOT EXISTS pwa_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_name TEXT DEFAULT 'ONE MEDI',
    short_name TEXT DEFAULT 'OneMedi',
    description TEXT DEFAULT 'One Stop for all Medical Needs',
    theme_color TEXT DEFAULT '#0070f3',
    background_color TEXT DEFAULT '#ffffff',
    display TEXT DEFAULT 'standalone',
    orientation TEXT DEFAULT 'portrait',
    start_url TEXT DEFAULT '/',
    icons JSONB DEFAULT '[]'::jsonb,
    offline_fallback TEXT DEFAULT '/offline.html',
    cache_strategy TEXT DEFAULT 'network_first',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS policies
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pwa_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies for new tables
CREATE POLICY "Admins can manage payment gateways" 
ON payment_gateways FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text]));

CREATE POLICY "Admins can manage marketing campaigns" 
ON marketing_campaigns FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'marketing_manager'::text]));

CREATE POLICY "Admins can manage WhatsApp settings" 
ON whatsapp_settings FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Admins can manage SEO settings" 
ON seo_settings FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'marketing_manager'::text]));

CREATE POLICY "Admins can manage PWA settings" 
ON pwa_settings FOR ALL 
USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create triggers for updated_at
CREATE TRIGGER update_payment_gateways_updated_at 
BEFORE UPDATE ON payment_gateways 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_campaigns_updated_at 
BEFORE UPDATE ON marketing_campaigns 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_settings_updated_at 
BEFORE UPDATE ON whatsapp_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at 
BEFORE UPDATE ON seo_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pwa_settings_updated_at 
BEFORE UPDATE ON pwa_settings 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();