-- Prescription Upload Feature - Database Schema Migration
-- This migration creates comprehensive tables for prescription management in the healthcare e-commerce platform

-- Create prescription status enum
CREATE TYPE prescription_status AS ENUM (
  'uploaded',
  'processing', 
  'review_required',
  'validated',
  'rejected',
  'expired',
  'fulfilled'
);

-- Create prescription validation type enum  
CREATE TYPE validation_type AS ENUM (
  'format_validation',
  'content_validation', 
  'medicine_validation',
  'regulatory_compliance',
  'pharmacist_approval'
);

-- Main prescriptions table
CREATE TABLE prescriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  prescription_number TEXT UNIQUE,
  
  -- Doctor Information
  doctor_name TEXT NOT NULL,
  doctor_registration TEXT,
  doctor_phone TEXT,
  clinic_name TEXT,
  clinic_address TEXT,
  
  -- Patient Information  
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  patient_gender TEXT,
  patient_phone TEXT,
  
  -- Prescription Details
  prescription_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  diagnosis TEXT,
  symptoms TEXT,
  
  -- Status and Processing
  status prescription_status DEFAULT 'uploaded',
  priority_level INTEGER DEFAULT 1, -- 1=normal, 2=urgent, 3=emergency
  
  -- File Information
  file_urls JSONB DEFAULT '[]'::jsonb, -- Array of uploaded file URLs
  original_file_names JSONB DEFAULT '[]'::jsonb,
  file_sizes JSONB DEFAULT '[]'::jsonb,
  
  -- OCR and Processing Results
  ocr_text TEXT,
  ocr_confidence DECIMAL(3,2),
  extracted_medicines JSONB DEFAULT '[]'::jsonb,
  processing_notes TEXT,
  
  -- Validation Results
  validation_results JSONB DEFAULT '{}'::jsonb,
  validation_score DECIMAL(3,2),
  rejection_reasons TEXT[],
  
  -- Pharmacist Review
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  pharmacist_notes TEXT,
  
  -- Analytics and Tracking
  source_channel TEXT DEFAULT 'web', -- web, mobile, whatsapp, email
  location_data JSONB,
  device_info JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_dates CHECK (expiry_date > prescription_date),
  CONSTRAINT valid_age CHECK (patient_age > 0 AND patient_age < 150),
  CONSTRAINT valid_priority CHECK (priority_level BETWEEN 1 AND 3)
);

-- Create index for performance
CREATE INDEX idx_prescriptions_user_id ON prescriptions(user_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_created_at ON prescriptions(created_at DESC);
CREATE INDEX idx_prescriptions_verified_by ON prescriptions(verified_by);
CREATE INDEX idx_prescriptions_prescription_date ON prescriptions(prescription_date DESC);

-- Prescription medicines table (extracted/identified medicines)
CREATE TABLE prescription_medicines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  
  -- Medicine Information
  medicine_name TEXT NOT NULL,
  generic_name TEXT,
  brand_name TEXT,
  medicine_id UUID REFERENCES medicines(id), -- Link to actual medicine if found
  
  -- Prescription Details
  dosage TEXT NOT NULL, -- e.g., "500mg", "10ml"
  strength TEXT,
  frequency TEXT NOT NULL, -- e.g., "twice daily", "3 times a day"
  duration TEXT, -- e.g., "7 days", "2 weeks"
  quantity_prescribed INTEGER,
  route_of_administration TEXT, -- oral, topical, injection, etc.
  
  -- Instructions
  before_after_food TEXT, -- before/after/with food
  special_instructions TEXT,
  warnings TEXT,
  
  -- Availability and Pricing
  available BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2),
  discount_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  
  -- Alternative Suggestions
  alternatives JSONB DEFAULT '[]'::jsonb, -- Array of alternative medicine IDs
  generic_alternatives JSONB DEFAULT '[]'::jsonb,
  
  -- Processing Information
  extraction_method TEXT, -- ocr, manual, ai_assisted
  confidence_score DECIMAL(3,2),
  requires_verification BOOLEAN DEFAULT TRUE,
  verification_status TEXT DEFAULT 'pending',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_quantity CHECK (quantity_prescribed > 0),
  CONSTRAINT valid_confidence CHECK (confidence_score BETWEEN 0 AND 1)
);

-- Create indexes for prescription medicines
CREATE INDEX idx_prescription_medicines_prescription_id ON prescription_medicines(prescription_id);
CREATE INDEX idx_prescription_medicines_medicine_id ON prescription_medicines(medicine_id);
CREATE INDEX idx_prescription_medicines_available ON prescription_medicines(available);

-- Prescription validation logs table
CREATE TABLE prescription_validation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  
  -- Validation Details
  validation_type validation_type NOT NULL,
  status TEXT NOT NULL, -- passed, failed, warning
  
  -- Validation Data
  validation_data JSONB DEFAULT '{}'::jsonb,
  error_details JSONB DEFAULT '{}'::jsonb,
  suggested_corrections JSONB DEFAULT '{}'::jsonb,
  
  -- Validator Information
  validated_by UUID REFERENCES auth.users(id),
  validator_type TEXT, -- system, pharmacist, admin
  
  -- Additional Information
  notes TEXT,
  severity_level INTEGER DEFAULT 1, -- 1=info, 2=warning, 3=error, 4=critical
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_severity CHECK (severity_level BETWEEN 1 AND 4)
);

-- Create indexes for validation logs
CREATE INDEX idx_validation_logs_prescription_id ON prescription_validation_logs(prescription_id);
CREATE INDEX idx_validation_logs_validation_type ON prescription_validation_logs(validation_type);
CREATE INDEX idx_validation_logs_created_at ON prescription_validation_logs(created_at DESC);

-- Prescription file attachments table (for detailed file management)
CREATE TABLE prescription_file_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prescription_id UUID REFERENCES prescriptions(id) ON DELETE CASCADE,
  
  -- File Information
  file_name TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Processing Information
  processing_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  ocr_text TEXT,
  ocr_confidence DECIMAL(3,2),
  
  -- Storage Information
  storage_bucket TEXT DEFAULT 'prescription-uploads',
  storage_path TEXT NOT NULL,
  
  -- Security and Access
  access_level TEXT DEFAULT 'private', -- private, restricted, public
  encryption_key TEXT,
  
  -- Timestamps
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  CONSTRAINT valid_file_size CHECK (file_size > 0),
  CONSTRAINT valid_ocr_confidence CHECK (ocr_confidence BETWEEN 0 AND 1)
);

-- Create indexes for file attachments
CREATE INDEX idx_file_attachments_prescription_id ON prescription_file_attachments(prescription_id);
CREATE INDEX idx_file_attachments_processing_status ON prescription_file_attachments(processing_status);

-- Orders table extension for prescription-based orders
-- Add prescription reference to existing orders table if not exists
-- This assumes orders table exists from previous migrations
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'prescription_id') THEN
    ALTER TABLE orders ADD COLUMN prescription_id UUID REFERENCES prescriptions(id);
    ALTER TABLE orders ADD COLUMN order_type TEXT DEFAULT 'regular'; -- regular, prescription, emergency
    ALTER TABLE orders ADD COLUMN prescription_verified BOOLEAN DEFAULT FALSE;
    ALTER TABLE orders ADD COLUMN pharmacist_approved_by UUID REFERENCES auth.users(id);
    ALTER TABLE orders ADD COLUMN special_instructions TEXT;
    
    CREATE INDEX idx_orders_prescription_id ON orders(prescription_id);
    CREATE INDEX idx_orders_order_type ON orders(order_type);
  END IF;
END $$;

-- Prescription notification preferences table
CREATE TABLE prescription_notification_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Notification Channels
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  
  -- Notification Types
  upload_confirmation BOOLEAN DEFAULT TRUE,
  processing_updates BOOLEAN DEFAULT TRUE,
  validation_results BOOLEAN DEFAULT TRUE,
  medicine_availability BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  
  -- Delivery Preferences
  notification_frequency TEXT DEFAULT 'immediate', -- immediate, daily, weekly
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_prescriptions_updated_at BEFORE UPDATE ON prescriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prescription_medicines_updated_at BEFORE UPDATE ON prescription_medicines 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON prescription_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Prescription Cart Items Table
-- Stores prescription-based items added to user's cart
CREATE TABLE prescription_cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  extracted_medicine_id UUID REFERENCES prescription_medicines(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
  alternative_selected BOOLEAN DEFAULT FALSE,
  generic_substitution BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  status prescription_cart_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add cart status enum
CREATE TYPE prescription_cart_status AS ENUM (
  'active',
  'saved_for_later',
  'ordered',
  'removed',
  'expired'
);

-- Create indexes for cart items
CREATE INDEX idx_cart_items_user_id ON prescription_cart_items(user_id);
CREATE INDEX idx_cart_items_prescription_id ON prescription_cart_items(prescription_id);
CREATE INDEX idx_cart_items_status ON prescription_cart_items(status);
CREATE INDEX idx_cart_items_composite ON prescription_cart_items(user_id, status, created_at DESC);

-- Create trigger for cart items updated_at
CREATE TRIGGER update_prescription_cart_items_updated_at BEFORE UPDATE ON prescription_cart_items 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_file_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_cart_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prescriptions
CREATE POLICY "Users can view their own prescriptions" ON prescriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prescriptions" ON prescriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prescriptions" ON prescriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Pharmacists can view all prescriptions" ON prescriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

CREATE POLICY "Pharmacists can update prescription status" ON prescriptions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

-- RLS Policies for prescription medicines
CREATE POLICY "Users can view medicines from their prescriptions" ON prescription_medicines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prescriptions 
      WHERE id = prescription_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can view all prescription medicines" ON prescription_medicines
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

-- RLS Policies for validation logs
CREATE POLICY "Users can view validation logs for their prescriptions" ON prescription_validation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prescriptions 
      WHERE id = prescription_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for file attachments
CREATE POLICY "Users can view their own prescription files" ON prescription_file_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prescriptions 
      WHERE id = prescription_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert files for their prescriptions" ON prescription_file_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prescriptions 
      WHERE id = prescription_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for notification preferences
CREATE POLICY "Users can manage their own notification preferences" ON prescription_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for prescription cart items
CREATE POLICY "Users can view their own cart items" ON prescription_cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON prescription_cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON prescription_cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON prescription_cart_items
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Pharmacists can view all cart items" ON prescription_cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

-- RLS Policies for order workflow tables

-- Order workflow steps policies
CREATE POLICY "Users can view workflow for their orders" ON order_workflow_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can view all workflow steps" ON order_workflow_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist', 'staff')
    )
  );

CREATE POLICY "Staff can insert workflow steps" ON order_workflow_steps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist', 'staff')
    )
  );

-- Prescription verification policies
CREATE POLICY "Users can view verifications for their orders" ON prescription_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can manage verifications" ON prescription_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

-- Order substitutions policies
CREATE POLICY "Users can view substitutions for their orders" ON order_substitutions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.id = order_item_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can approve substitutions" ON order_substitutions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE oi.id = order_item_id 
      AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Pharmacists can manage substitutions" ON order_substitutions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'pharmacist')
    )
  );

-- Delivery tracking policies
CREATE POLICY "Users can view delivery tracking for their orders" ON delivery_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE id = order_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can manage delivery tracking" ON delivery_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'staff', 'delivery')
    )
  );

-- Order notifications policies
CREATE POLICY "Users can view their notifications" ON order_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON order_notifications
  FOR INSERT WITH CHECK (true); -- Allow system to insert notifications

-- Prescription Order Workflow Tables
-- Tracks the complete order processing workflow for prescription orders

-- Order workflow steps tracking
CREATE TABLE order_workflow_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Prescription verification records
CREATE TABLE prescription_verifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  pharmacist_id UUID NOT NULL REFERENCES auth.users(id),
  verification_status TEXT NOT NULL CHECK (verification_status IN ('approved', 'rejected', 'requires_substitution')),
  verified_items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order substitutions tracking
CREATE TABLE order_substitutions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_item_id UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  original_medicine_id UUID NOT NULL REFERENCES medicines(id),
  substitute_medicine_id UUID NOT NULL REFERENCES medicines(id),
  reason TEXT NOT NULL,
  pharmacist_notes TEXT,
  patient_approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delivery tracking
CREATE TABLE delivery_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  tracking_number TEXT UNIQUE,
  courier_partner TEXT,
  current_status TEXT NOT NULL,
  current_location TEXT,
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  delivery_attempts INTEGER DEFAULT 0,
  delivered_at TIMESTAMP WITH TIME ZONE,
  delivered_to TEXT,
  delivery_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order notifications log
CREATE TABLE order_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  notification_type TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push', 'whatsapp')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'failed', 'pending')),
  error_message TEXT
);

-- Create indexes for order workflow tables
CREATE INDEX idx_workflow_steps_order_id ON order_workflow_steps(order_id);
CREATE INDEX idx_workflow_steps_status ON order_workflow_steps(status);
CREATE INDEX idx_workflow_steps_created_at ON order_workflow_steps(created_at DESC);

CREATE INDEX idx_prescription_verifications_order_id ON prescription_verifications(order_id);
CREATE INDEX idx_prescription_verifications_pharmacist ON prescription_verifications(pharmacist_id);
CREATE INDEX idx_prescription_verifications_status ON prescription_verifications(verification_status);

CREATE INDEX idx_order_substitutions_item_id ON order_substitutions(order_item_id);
CREATE INDEX idx_order_substitutions_patient_approved ON order_substitutions(patient_approved);

CREATE INDEX idx_delivery_tracking_order_id ON delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_tracking_number ON delivery_tracking(tracking_number);
CREATE INDEX idx_delivery_tracking_status ON delivery_tracking(current_status);

CREATE INDEX idx_order_notifications_order_id ON order_notifications(order_id);
CREATE INDEX idx_order_notifications_user_id ON order_notifications(user_id);
CREATE INDEX idx_order_notifications_type ON order_notifications(notification_type);

-- Create triggers for updated_at
CREATE TRIGGER update_delivery_tracking_updated_at BEFORE UPDATE ON delivery_tracking 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on workflow tables
ALTER TABLE order_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_substitutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_prescriptions_composite ON prescriptions(user_id, status, created_at DESC);
CREATE INDEX idx_prescription_medicines_composite ON prescription_medicines(prescription_id, available, verification_status);
CREATE INDEX idx_validation_logs_composite ON prescription_validation_logs(prescription_id, validation_type, created_at DESC);

-- Add sample data for testing (optional)
-- This can be removed in production
INSERT INTO prescription_notification_preferences (user_id, email_notifications, sms_notifications, push_notifications)
SELECT id, true, true, true 
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM prescription_notification_preferences)
ON CONFLICT (user_id) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE prescriptions IS 'Main table storing prescription information and processing status';
COMMENT ON TABLE prescription_medicines IS 'Individual medicines extracted from prescriptions with availability info';
COMMENT ON TABLE prescription_validation_logs IS 'Audit trail for prescription validation steps';
COMMENT ON TABLE prescription_file_attachments IS 'File management for prescription uploads';
COMMENT ON TABLE prescription_notification_preferences IS 'User preferences for prescription-related notifications';

COMMENT ON COLUMN prescriptions.prescription_number IS 'Unique identifier for tracking prescriptions';
COMMENT ON COLUMN prescriptions.validation_results IS 'JSON object containing detailed validation results';
COMMENT ON COLUMN prescriptions.extracted_medicines IS 'JSON array of medicines extracted via OCR/AI';
COMMENT ON COLUMN prescription_medicines.alternatives IS 'JSON array of alternative medicine suggestions';
COMMENT ON COLUMN prescription_validation_logs.validation_data IS 'JSON object with detailed validation information';

-- Real-time Notification Tables
-- Create notifications table for real-time updates
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN (
    'prescription_status', 'order_update', 'pharmacist_message', 'system_alert'
  )) NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  action_url TEXT
);

-- Create user notification preferences table
CREATE TABLE IF NOT EXISTS user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  push_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  prescription_updates BOOLEAN DEFAULT TRUE,
  order_updates BOOLEAN DEFAULT TRUE,
  promotional_messages BOOLEAN DEFAULT FALSE,
  system_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_composite ON notifications(user_id, read, created_at DESC);

CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);

-- Enable RLS on notification tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- RLS Policies for user notification preferences
CREATE POLICY "Users can manage their own notification preferences" ON user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for notification preferences updated_at
CREATE TRIGGER update_user_notification_preferences_updated_at BEFORE UPDATE ON user_notification_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for notification tables
COMMENT ON TABLE notifications IS 'Real-time notifications for prescription and order updates';
COMMENT ON TABLE user_notification_preferences IS 'User preferences for different types of notifications';

COMMENT ON COLUMN notifications.data IS 'JSON object containing notification-specific data like prescription_id, order_id, etc';
COMMENT ON COLUMN notifications.action_url IS 'URL for notification action (e.g., view prescription, view order)';
COMMENT ON COLUMN notifications.expires_at IS 'Optional expiration timestamp for time-sensitive notifications';