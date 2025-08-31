-- Create enhanced medicine management tables

-- Product types enum
CREATE TYPE product_type AS ENUM ('simple', 'variable', 'grouped', 'digital', 'subscription');

-- Medicine variants table for product variations
CREATE TABLE IF NOT EXISTS medicine_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  strength TEXT,
  pack_size TEXT,
  dosage_form TEXT,
  mrp NUMERIC NOT NULL DEFAULT 0,
  sale_price NUMERIC NOT NULL DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  weight NUMERIC DEFAULT 0,
  dimensions JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Inventory batches for batch tracking
CREATE TABLE IF NOT EXISTS medicine_inventory_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES medicine_variants(id) ON DELETE CASCADE,
  batch_number TEXT NOT NULL,
  manufacturer TEXT,
  manufacturing_date DATE,
  expiry_date DATE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  cost_price NUMERIC DEFAULT 0,
  location_id UUID,
  vendor_id UUID,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'recalled', 'damaged')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(variant_id, batch_number, location_id)
);

-- Medicine locations/vendors for multi-location inventory
CREATE TABLE IF NOT EXISTS medicine_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  contact TEXT,
  email TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medicine attributes for flexible product properties
CREATE TABLE IF NOT EXISTS medicine_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'number', 'select', 'multiselect', 'boolean')),
  options JSONB DEFAULT '[]',
  required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medicine attribute values
CREATE TABLE IF NOT EXISTS medicine_attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
  attribute_id UUID REFERENCES medicine_attributes(id) ON DELETE CASCADE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(medicine_id, attribute_id)
);

-- Medicine tags for better categorization
CREATE TABLE IF NOT EXISTS medicine_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medicine tag relationships
CREATE TABLE IF NOT EXISTS medicine_tag_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES medicine_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(medicine_id, tag_id)
);

-- Tax configurations
CREATE TABLE IF NOT EXISTS tax_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  rate NUMERIC NOT NULL DEFAULT 0,
  type TEXT DEFAULT 'percentage' CHECK (type IN ('percentage', 'fixed')),
  hsn_code TEXT,
  applicable_states JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping zones
CREATE TABLE IF NOT EXISTS shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  states JSONB DEFAULT '[]',
  cities JSONB DEFAULT '[]',
  pincodes JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Shipping methods
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'flat_rate' CHECK (type IN ('flat_rate', 'free', 'calculated', 'pickup')),
  cost NUMERIC DEFAULT 0,
  min_order_amount NUMERIC DEFAULT 0,
  max_weight NUMERIC,
  estimated_days INTEGER DEFAULT 1,
  zone_id UUID REFERENCES shipping_zones(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Medicine pricing tiers for bulk pricing
CREATE TABLE IF NOT EXISTS medicine_pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL DEFAULT 1,
  max_quantity INTEGER,
  price NUMERIC NOT NULL,
  location_id UUID REFERENCES medicine_locations(id),
  vendor_id UUID,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Stock alerts configuration
CREATE TABLE IF NOT EXISTS stock_alert_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
  location_id UUID REFERENCES medicine_locations(id),
  low_stock_threshold INTEGER DEFAULT 10,
  out_of_stock_threshold INTEGER DEFAULT 0,
  expiry_alert_days INTEGER DEFAULT 30,
  email_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(medicine_id, location_id)
);

-- Add new columns to existing medicines table
ALTER TABLE medicines 
ADD COLUMN IF NOT EXISTS product_type product_type DEFAULT 'simple',
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS hsn_code TEXT,
ADD COLUMN IF NOT EXISTS tax_configuration_id UUID REFERENCES tax_configurations(id),
ADD COLUMN IF NOT EXISTS weight NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS dimensions JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS shipping_class TEXT,
ADD COLUMN IF NOT EXISTS min_order_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS max_order_quantity INTEGER,
ADD COLUMN IF NOT EXISTS backorder_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_interval_days INTEGER,
ADD COLUMN IF NOT EXISTS manufacturer TEXT,
ADD COLUMN IF NOT EXISTS composition TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_medicine_variants_medicine_id ON medicine_variants(medicine_id);
CREATE INDEX IF NOT EXISTS idx_medicine_variants_sku ON medicine_variants(sku);
CREATE INDEX IF NOT EXISTS idx_inventory_batches_variant_id ON medicine_inventory_batches(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batches_expiry ON medicine_inventory_batches(expiry_date);
CREATE INDEX IF NOT EXISTS idx_medicine_attributes_name ON medicine_attributes(name);
CREATE INDEX IF NOT EXISTS idx_medicine_tags_slug ON medicine_tags(slug);
CREATE INDEX IF NOT EXISTS idx_medicines_product_type ON medicines(product_type);
CREATE INDEX IF NOT EXISTS idx_medicines_sku ON medicines(sku);

-- Enable RLS on new tables
ALTER TABLE medicine_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_tag_relations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_alert_configurations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admins can manage medicine variants" ON medicine_variants FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage inventory batches" ON medicine_inventory_batches FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine locations" ON medicine_locations FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine attributes" ON medicine_attributes FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine attribute values" ON medicine_attribute_values FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine tags" ON medicine_tags FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine tag relations" ON medicine_tag_relations FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage tax configurations" ON tax_configurations FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage shipping zones" ON shipping_zones FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage shipping methods" ON shipping_methods FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage medicine pricing tiers" ON medicine_pricing_tiers FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));
CREATE POLICY "Admins can manage stock alert configurations" ON stock_alert_configurations FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Public read access for certain tables
CREATE POLICY "Public can read medicine variants" ON medicine_variants FOR SELECT USING (active = true);
CREATE POLICY "Public can read medicine locations" ON medicine_locations FOR SELECT USING (active = true);
CREATE POLICY "Public can read medicine attributes" ON medicine_attributes FOR SELECT USING (true);
CREATE POLICY "Public can read medicine tags" ON medicine_tags FOR SELECT USING (true);
CREATE POLICY "Public can read tax configurations" ON tax_configurations FOR SELECT USING (active = true);
CREATE POLICY "Public can read shipping zones" ON shipping_zones FOR SELECT USING (active = true);
CREATE POLICY "Public can read shipping methods" ON shipping_methods FOR SELECT USING (active = true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medicine_variants_updated_at BEFORE UPDATE ON medicine_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_inventory_batches_updated_at BEFORE UPDATE ON medicine_inventory_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_locations_updated_at BEFORE UPDATE ON medicine_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_attributes_updated_at BEFORE UPDATE ON medicine_attributes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_tags_updated_at BEFORE UPDATE ON medicine_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_configurations_updated_at BEFORE UPDATE ON tax_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_zones_updated_at BEFORE UPDATE ON shipping_zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shipping_methods_updated_at BEFORE UPDATE ON shipping_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicine_pricing_tiers_updated_at BEFORE UPDATE ON medicine_pricing_tiers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_alert_configurations_updated_at BEFORE UPDATE ON stock_alert_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();