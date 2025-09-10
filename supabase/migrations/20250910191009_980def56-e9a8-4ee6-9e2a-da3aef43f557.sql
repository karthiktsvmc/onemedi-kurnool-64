-- Phase 1: Critical Security Hardening

-- 1. Enhanced User Roles and Permissions System
CREATE TYPE public.admin_permission AS ENUM (
  'users_read', 'users_write', 'users_delete',
  'orders_read', 'orders_write', 'orders_cancel', 'orders_refund',
  'inventory_read', 'inventory_write', 'inventory_delete',
  'analytics_read', 'analytics_export',
  'settings_read', 'settings_write',
  'security_read', 'security_write',
  'vendors_read', 'vendors_write', 'vendors_approve',
  'payments_read', 'payments_process', 'payments_refund',
  'marketing_read', 'marketing_write', 'marketing_send',
  'reports_read', 'reports_generate', 'reports_export',
  'system_admin', 'audit_logs_read'
);

-- Role permissions mapping table
CREATE TABLE public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission admin_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

-- Admin sessions table for enhanced security
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  ip_address INET,
  user_agent TEXT,
  location JSONB,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Security settings table
CREATE TABLE public.security_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  require_mfa BOOLEAN DEFAULT true,
  session_timeout_minutes INTEGER DEFAULT 30,
  max_login_attempts INTEGER DEFAULT 5,
  lockout_duration_minutes INTEGER DEFAULT 15,
  password_min_length INTEGER DEFAULT 12,
  password_require_special BOOLEAN DEFAULT true,
  password_require_numbers BOOLEAN DEFAULT true,
  password_require_uppercase BOOLEAN DEFAULT true,
  allowed_ip_ranges TEXT[],
  geo_restrictions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- MFA settings table
CREATE TABLE public.user_mfa_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  totp_secret TEXT,
  backup_codes TEXT[],
  phone_number TEXT,
  is_enabled BOOLEAN DEFAULT false,
  preferred_method TEXT DEFAULT 'totp',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Failed login attempts tracking
CREATE TABLE public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  ip_address INET,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reason TEXT
);

-- API rate limiting table
CREATE TABLE public.api_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or user_id
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Enhanced audit logs with more details
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS session_id UUID,
ADD COLUMN IF NOT EXISTS request_id TEXT,
ADD COLUMN IF NOT EXISTS endpoint TEXT,
ADD COLUMN IF NOT EXISTS request_method TEXT,
ADD COLUMN IF NOT EXISTS response_status INTEGER,
ADD COLUMN IF NOT EXISTS execution_time_ms INTEGER,
ADD COLUMN IF NOT EXISTS risk_score INTEGER DEFAULT 0;

-- System notifications table
CREATE TABLE public.system_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- 'security', 'system', 'business'
  severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB,
  is_read BOOLEAN DEFAULT false,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced business settings
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS security_policy JSONB DEFAULT '{
  "password_policy": {
    "min_length": 12,
    "require_special": true,
    "require_numbers": true,
    "require_uppercase": true,
    "expiry_days": 90
  },
  "session_policy": {
    "timeout_minutes": 30,
    "concurrent_sessions": 3
  },
  "access_policy": {
    "allowed_countries": ["IN"],
    "blocked_ips": []
  }
}'::jsonb,
ADD COLUMN IF NOT EXISTS feature_flags JSONB DEFAULT '{
  "realtime_sync": true,
  "advanced_analytics": true,
  "ai_insights": false,
  "mobile_app": true,
  "third_party_integrations": true
}'::jsonb,
ADD COLUMN IF NOT EXISTS integration_settings JSONB DEFAULT '{
  "payment_gateways": {
    "razorpay": {"enabled": true},
    "paytm": {"enabled": false},
    "phonepe": {"enabled": false}
  },
  "sms_providers": {
    "twilio": {"enabled": false},
    "msg91": {"enabled": false}
  },
  "email_providers": {
    "sendgrid": {"enabled": false},
    "aws_ses": {"enabled": false}
  }
}'::jsonb;

-- Performance monitoring table
CREATE TABLE public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  tags JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default role permissions
INSERT INTO public.role_permissions (role, permission) VALUES
-- Super Admin - All permissions
('super_admin', 'system_admin'),
('super_admin', 'audit_logs_read'),
('super_admin', 'security_read'),
('super_admin', 'security_write'),

-- Admin - Most permissions except system admin
('admin', 'users_read'),
('admin', 'users_write'),
('admin', 'orders_read'),
('admin', 'orders_write'),
('admin', 'orders_cancel'),
('admin', 'inventory_read'),
('admin', 'inventory_write'),
('admin', 'analytics_read'),
('admin', 'vendors_read'),
('admin', 'vendors_write'),
('admin', 'vendors_approve'),
('admin', 'payments_read'),
('admin', 'reports_read'),
('admin', 'reports_generate'),
('admin', 'marketing_read'),
('admin', 'marketing_write'),

-- Operations Manager - Order and inventory focused
('operations_manager', 'orders_read'),
('operations_manager', 'orders_write'),
('operations_manager', 'orders_cancel'),
('operations_manager', 'inventory_read'),
('operations_manager', 'inventory_write'),
('operations_manager', 'vendors_read'),

-- Finance Manager - Payment and financial operations
('finance_manager', 'orders_read'),
('finance_manager', 'payments_read'),
('finance_manager', 'payments_process'),
('finance_manager', 'payments_refund'),
('finance_manager', 'reports_read'),
('finance_manager', 'reports_generate'),
('finance_manager', 'analytics_read'),

-- Marketing Manager - Marketing and promotions
('marketing_manager', 'marketing_read'),
('marketing_manager', 'marketing_write'),
('marketing_manager', 'marketing_send'),
('marketing_manager', 'analytics_read'),
('marketing_manager', 'reports_read'),

-- Support Agent - Customer support focused
('support_agent', 'users_read'),
('support_agent', 'orders_read'),
('support_agent', 'orders_write');

-- Insert default security settings
INSERT INTO public.security_settings DEFAULT VALUES;

-- Enable RLS on new tables
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
FOR ALL USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Users can view their own sessions" ON public.admin_sessions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage sessions" ON public.admin_sessions
FOR ALL USING (get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Admins can view security settings" ON public.security_settings
FOR SELECT USING (get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Super admins can manage security settings" ON public.security_settings
FOR ALL USING (get_current_user_role() = 'super_admin');

CREATE POLICY "Users can manage their own MFA" ON public.user_mfa_settings
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "System can log failed attempts" ON public.failed_login_attempts
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view failed attempts" ON public.failed_login_attempts
FOR SELECT USING (get_current_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "System can manage rate limits" ON public.api_rate_limits
FOR ALL USING (true);

CREATE POLICY "Admins can view notifications" ON public.system_notifications
FOR ALL USING (get_current_user_role() IN ('super_admin', 'admin', 'operations_manager'));

CREATE POLICY "System can record metrics" ON public.performance_metrics
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view metrics" ON public.performance_metrics
FOR SELECT USING (get_current_user_role() IN ('super_admin', 'admin'));

-- Enhanced security functions
CREATE OR REPLACE FUNCTION public.check_admin_permission(
  _user_id UUID,
  _permission admin_permission
) RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role = rp.role
    WHERE ur.user_id = _user_id 
    AND rp.permission = _permission
  ) OR EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    WHERE ur.user_id = _user_id 
    AND ur.role = 'super_admin'
  );
$$;

-- Function to track login attempts
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  _email TEXT,
  _ip_address INET,
  _user_agent TEXT,
  _success BOOLEAN,
  _reason TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT _success THEN
    INSERT INTO public.failed_login_attempts (
      email, ip_address, user_agent, reason
    ) VALUES (
      _email, _ip_address, _user_agent, _reason
    );
  END IF;
END;
$$;

-- Function to check if IP/user is locked out
CREATE OR REPLACE FUNCTION public.is_locked_out(
  _identifier TEXT -- email or IP
) RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  settings RECORD;
  attempt_count INTEGER;
BEGIN
  SELECT * INTO settings FROM public.security_settings LIMIT 1;
  
  SELECT COUNT(*) INTO attempt_count
  FROM public.failed_login_attempts
  WHERE (email = _identifier OR ip_address::TEXT = _identifier)
  AND attempted_at > now() - INTERVAL '1 hour' * settings.lockout_duration_minutes / 60;
  
  RETURN attempt_count >= settings.max_login_attempts;
END;
$$;

-- Function to create system notification
CREATE OR REPLACE FUNCTION public.create_system_notification(
  _type TEXT,
  _severity TEXT,
  _title TEXT,
  _message TEXT,
  _metadata JSONB DEFAULT '{}'
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.system_notifications (
    type, severity, title, message, metadata
  ) VALUES (
    _type, _severity, _title, _message, _metadata
  ) RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Enhanced audit trigger function
CREATE OR REPLACE FUNCTION public.enhanced_audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  risk_score INTEGER := 0;
BEGIN
  -- Calculate risk score based on action
  CASE TG_OP
    WHEN 'DELETE' THEN risk_score := 8;
    WHEN 'UPDATE' THEN risk_score := 5;
    WHEN 'INSERT' THEN risk_score := 3;
  END CASE;
  
  -- Increase risk for sensitive tables
  IF TG_TABLE_NAME IN ('users', 'payments', 'business_settings', 'security_settings') THEN
    risk_score := risk_score + 3;
  END IF;

  IF TG_OP = 'DELETE' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, old_values, 
      ip_address, risk_score
    ) VALUES (
      auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, 
      to_jsonb(OLD), inet_client_addr(), risk_score
    );
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, old_values, new_values,
      ip_address, risk_score
    ) VALUES (
      auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id,
      to_jsonb(OLD), to_jsonb(NEW), inet_client_addr(), risk_score
    );
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO audit_logs (
      user_id, action, table_name, record_id, new_values,
      ip_address, risk_score
    ) VALUES (
      auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id,
      to_jsonb(NEW), inet_client_addr(), risk_score
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;