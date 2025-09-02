-- Enhanced Business Settings Schema for Enterprise E-commerce Platform

-- Regional Settings
CREATE TABLE public.regional_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL DEFAULT 'India',
  default_state TEXT DEFAULT 'Andhra Pradesh',
  default_city TEXT DEFAULT 'Kurnool',
  serviceable_locations JSONB DEFAULT '[]'::jsonb,
  shipping_zones JSONB DEFAULT '[]'::jsonb,
  delivery_coverage JSONB DEFAULT '[]'::jsonb,
  local_tax_rules JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Payment Gateway Settings
CREATE TABLE public.payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway_name TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  api_key_encrypted TEXT,
  api_secret_encrypted TEXT,
  webhook_url TEXT,
  test_mode BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}'::jsonb,
  supported_currencies TEXT[] DEFAULT ARRAY['INR'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notification Templates
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT NOT NULL,
  template_type TEXT NOT NULL, -- email, sms, whatsapp, push
  event_trigger TEXT NOT NULL, -- order_placed, order_shipped, etc.
  subject TEXT,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping Providers
CREATE TABLE public.shipping_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  api_endpoint TEXT,
  api_key_encrypted TEXT,
  enabled BOOLEAN DEFAULT false,
  configuration JSONB DEFAULT '{}'::jsonb,
  supported_services TEXT[] DEFAULT ARRAY['standard'],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- System Policies
CREATE TABLE public.system_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_type TEXT NOT NULL, -- refund_policy, return_policy, terms, privacy, disclaimer
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  effective_date DATE DEFAULT CURRENT_DATE,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security Settings
CREATE TABLE public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 3600, -- seconds
  max_login_attempts INTEGER DEFAULT 5,
  password_policy JSONB DEFAULT '{
    "min_length": 8,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_numbers": true,
    "require_symbols": false
  }'::jsonb,
  data_encryption_enabled BOOLEAN DEFAULT true,
  activity_monitoring BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Catalog Settings
CREATE TABLE public.catalog_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_category TEXT,
  auto_stock_management BOOLEAN DEFAULT true,
  low_stock_threshold INTEGER DEFAULT 10,
  backorder_allowed BOOLEAN DEFAULT false,
  pricing_rules JSONB DEFAULT '{}'::jsonb,
  bulk_discounts JSONB DEFAULT '[]'::jsonb,
  subscription_pricing_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Business Settings (extend existing)
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS whatsapp_business_number TEXT;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{
  "facebook": "",
  "twitter": "",
  "instagram": "",
  "linkedin": "",
  "youtube": ""
}'::jsonb;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS multi_location_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Asia/Kolkata';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS storefront_status TEXT DEFAULT 'live';
ALTER TABLE public.business_settings ADD COLUMN IF NOT EXISTS maintenance_message TEXT;

-- RLS Policies
ALTER TABLE public.regional_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catalog_settings ENABLE ROW LEVEL SECURITY;

-- Admin access policies
CREATE POLICY "Admins can manage regional settings" ON public.regional_settings
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Admins can manage payment settings" ON public.payment_settings
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin', 'finance_manager']));

CREATE POLICY "Admins can manage notification templates" ON public.notification_templates
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin', 'marketing_manager']));

CREATE POLICY "Admins can manage shipping providers" ON public.shipping_providers
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Admins can manage system policies" ON public.system_policies
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

CREATE POLICY "Super admins can manage security settings" ON public.security_settings
FOR ALL USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Admins can manage catalog settings" ON public.catalog_settings
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin', 'admin']));

-- Public read access for some settings
CREATE POLICY "Public read access to system policies" ON public.system_policies
FOR SELECT USING (enabled = true);

-- Insert default data
INSERT INTO public.regional_settings (country, default_state, default_city) VALUES 
('India', 'Andhra Pradesh', 'Kurnool') ON CONFLICT DO NOTHING;

INSERT INTO public.security_settings (id) VALUES 
(gen_random_uuid()) ON CONFLICT DO NOTHING;

INSERT INTO public.catalog_settings (id) VALUES 
(gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Insert default notification templates
INSERT INTO public.notification_templates (template_name, template_type, event_trigger, subject, content) VALUES
('Order Placed Email', 'email', 'order_placed', 'Order Confirmation - {{order_number}}', 
'Dear {{customer_name}}, your order {{order_number}} has been placed successfully.'),
('Order Shipped SMS', 'sms', 'order_shipped', '', 
'Your order {{order_number}} has been shipped and will be delivered soon. Track: {{tracking_url}}'),
('Lab Test Reminder WhatsApp', 'whatsapp', 'lab_test_reminder', '', 
'Reminder: Your lab test appointment is scheduled for {{appointment_date}} at {{appointment_time}}.'),
('Prescription Approved Push', 'push', 'prescription_approved', 'Prescription Approved', 
'Your prescription has been approved. You can now proceed with your order.')
ON CONFLICT DO NOTHING;

-- Insert default system policies
INSERT INTO public.system_policies (policy_type, title, content) VALUES
('refund_policy', 'Refund Policy', 'Our refund policy allows returns within 7 days of delivery for unopened medicines and within 24 hours for lab tests.'),
('return_policy', 'Return & Exchange Policy', 'Items can be returned in their original packaging within the specified time frame.'),
('terms', 'Terms & Conditions', 'By using ONE MEDI services, you agree to our terms and conditions.'),
('privacy', 'Privacy Policy', 'We are committed to protecting your privacy and handling your data responsibly.'),
('disclaimer', 'Medical Disclaimer', 'This platform is for informational purposes. Always consult healthcare professionals for medical advice.')
ON CONFLICT DO NOTHING;

-- Insert default payment gateways
INSERT INTO public.payment_settings (gateway_name, enabled, supported_currencies) VALUES
('Razorpay', false, ARRAY['INR']),
('Paytm', false, ARRAY['INR']),
('PhonePe', false, ARRAY['INR']),
('UPI', true, ARRAY['INR']),
('Cash on Delivery', true, ARRAY['INR'])
ON CONFLICT DO NOTHING;

-- Insert default shipping providers
INSERT INTO public.shipping_providers (provider_name, enabled, supported_services) VALUES
('Shiprocket', false, ARRAY['standard', 'express']),
('Delhivery', false, ARRAY['standard', 'express', 'same_day']),
('Own Delivery', true, ARRAY['standard', 'express'])
ON CONFLICT DO NOTHING;

-- Update triggers
CREATE TRIGGER update_regional_settings_updated_at BEFORE UPDATE ON public.regional_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON public.payment_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at BEFORE UPDATE ON public.notification_templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shipping_providers_updated_at BEFORE UPDATE ON public.shipping_providers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_policies_updated_at BEFORE UPDATE ON public.system_policies
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_security_settings_updated_at BEFORE UPDATE ON public.security_settings
For EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catalog_settings_updated_at BEFORE UPDATE ON public.catalog_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();