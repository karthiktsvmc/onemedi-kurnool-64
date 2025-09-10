-- Phase 1: Critical Security Hardening - Modified to skip existing tables

-- 1. Enhanced User Roles and Permissions System
DO $$ BEGIN
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
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Role permissions mapping table
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role TEXT NOT NULL,
  permission admin_permission NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role, permission)
);

-- Admin sessions table for enhanced security
CREATE TABLE IF NOT EXISTS public.admin_sessions (
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

-- MFA settings table
CREATE TABLE IF NOT EXISTS public.user_mfa_settings (
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
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  ip_address INET,
  user_agent TEXT,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reason TEXT
);

-- API rate limiting table
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
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
CREATE TABLE IF NOT EXISTS public.system_notifications (
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

-- Enhanced business settings - Add new columns safely
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
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_unit TEXT,
  tags JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default role permissions (only if not exists)
INSERT INTO public.role_permissions (role, permission) 
SELECT * FROM (VALUES
-- Super Admin - All permissions
('super_admin', 'system_admin'::admin_permission),
('super_admin', 'audit_logs_read'::admin_permission),
('super_admin', 'security_read'::admin_permission),
('super_admin', 'security_write'::admin_permission),

-- Admin - Most permissions except system admin
('admin', 'users_read'::admin_permission),
('admin', 'users_write'::admin_permission),
('admin', 'orders_read'::admin_permission),
('admin', 'orders_write'::admin_permission),
('admin', 'orders_cancel'::admin_permission),
('admin', 'inventory_read'::admin_permission),
('admin', 'inventory_write'::admin_permission),
('admin', 'analytics_read'::admin_permission),
('admin', 'vendors_read'::admin_permission),
('admin', 'vendors_write'::admin_permission),
('admin', 'vendors_approve'::admin_permission),
('admin', 'payments_read'::admin_permission),
('admin', 'reports_read'::admin_permission),
('admin', 'reports_generate'::admin_permission),
('admin', 'marketing_read'::admin_permission),
('admin', 'marketing_write'::admin_permission),

-- Operations Manager - Order and inventory focused
('operations_manager', 'orders_read'::admin_permission),
('operations_manager', 'orders_write'::admin_permission),
('operations_manager', 'orders_cancel'::admin_permission),
('operations_manager', 'inventory_read'::admin_permission),
('operations_manager', 'inventory_write'::admin_permission),
('operations_manager', 'vendors_read'::admin_permission),

-- Finance Manager - Payment and financial operations
('finance_manager', 'orders_read'::admin_permission),
('finance_manager', 'payments_read'::admin_permission),
('finance_manager', 'payments_process'::admin_permission),
('finance_manager', 'payments_refund'::admin_permission),
('finance_manager', 'reports_read'::admin_permission),
('finance_manager', 'reports_generate'::admin_permission),
('finance_manager', 'analytics_read'::admin_permission),

-- Marketing Manager - Marketing and promotions
('marketing_manager', 'marketing_read'::admin_permission),
('marketing_manager', 'marketing_write'::admin_permission),
('marketing_manager', 'marketing_send'::admin_permission),
('marketing_manager', 'analytics_read'::admin_permission),
('marketing_manager', 'reports_read'::admin_permission),

-- Support Agent - Customer support focused
('support_agent', 'users_read'::admin_permission),
('support_agent', 'orders_read'::admin_permission),
('support_agent', 'orders_write'::admin_permission)
) AS v(role, permission)
ON CONFLICT (role, permission) DO NOTHING;

-- Enable RLS on new tables
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for new tables
DROP POLICY IF EXISTS "Super admins can manage role permissions" ON public.role_permissions;
CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
FOR ALL USING (get_current_user_role() = 'super_admin');

DROP POLICY IF EXISTS "Users can view their own sessions" ON public.admin_sessions;
CREATE POLICY "Users can view their own sessions" ON public.admin_sessions
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can manage sessions" ON public.admin_sessions;
CREATE POLICY "Admins can manage sessions" ON public.admin_sessions
FOR ALL USING (get_current_user_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "Users can manage their own MFA" ON public.user_mfa_settings;
CREATE POLICY "Users can manage their own MFA" ON public.user_mfa_settings
FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can log failed attempts" ON public.failed_login_attempts;
CREATE POLICY "System can log failed attempts" ON public.failed_login_attempts
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view failed attempts" ON public.failed_login_attempts;
CREATE POLICY "Admins can view failed attempts" ON public.failed_login_attempts
FOR SELECT USING (get_current_user_role() IN ('super_admin', 'admin'));

DROP POLICY IF EXISTS "System can manage rate limits" ON public.api_rate_limits;
CREATE POLICY "System can manage rate limits" ON public.api_rate_limits
FOR ALL USING (true);

DROP POLICY IF EXISTS "Admins can view notifications" ON public.system_notifications;
CREATE POLICY "Admins can view notifications" ON public.system_notifications
FOR ALL USING (get_current_user_role() IN ('super_admin', 'admin', 'operations_manager'));

DROP POLICY IF EXISTS "System can record metrics" ON public.performance_metrics;
CREATE POLICY "System can record metrics" ON public.performance_metrics
FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view metrics" ON public.performance_metrics;
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