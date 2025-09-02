-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medicines_name_trgm ON medicines USING gin (name extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_medicines_category ON medicines (category_id);
CREATE INDEX IF NOT EXISTS idx_medicines_featured ON medicines (featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines (active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_lab_tests_name_trgm ON lab_tests USING gin (name extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_lab_tests_category ON lab_tests (category_id);
CREATE INDEX IF NOT EXISTS idx_lab_tests_featured ON lab_tests (featured) WHERE featured = true;

CREATE INDEX IF NOT EXISTS idx_doctors_name_trgm ON doctors USING gin (name extensions.gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors (specialty_id);
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors (clinic_city, clinic_state);
CREATE INDEX IF NOT EXISTS idx_doctors_active ON doctors (active) WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_item ON cart_items (item_id, item_type);

CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id ON prescriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_status ON prescriptions (verification_status);
CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions (created_at DESC);

-- Create audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs" ON audit_logs
FOR SELECT USING (
    get_current_user_role() = 'super_admin'
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, ip_address
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD),
            inet_client_addr()
        );
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, old_values, new_values, ip_address
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW),
            inet_client_addr()
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (
            user_id, action, table_name, record_id, new_values, ip_address
        ) VALUES (
            auth.uid(),
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW),
            inet_client_addr()
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_medicines_trigger
    AFTER INSERT OR UPDATE OR DELETE ON medicines
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_orders_trigger
    AFTER INSERT OR UPDATE OR DELETE ON orders
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_prescriptions_trigger
    AFTER INSERT OR UPDATE OR DELETE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_user_roles_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();