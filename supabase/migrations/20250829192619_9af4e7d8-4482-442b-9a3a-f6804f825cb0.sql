-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  gst_number TEXT,
  pan_number TEXT,
  license_number TEXT,
  commission_rate NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending',
  logo_url TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  operating_hours JSONB DEFAULT '{}'::jsonb,
  services_offered TEXT[],
  coverage_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendor_locations table
CREATE TABLE public.vendor_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  contact_phone TEXT,
  manager_name TEXT,
  is_primary BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create inventory management tables
CREATE TABLE public.inventory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  current_stock INTEGER,
  threshold INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Admins can manage vendors" ON public.vendors
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to vendors" ON public.vendors
FOR SELECT USING (status = 'active');

-- Create RLS policies for vendor_locations
CREATE POLICY "Admins can manage vendor locations" ON public.vendor_locations
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to vendor locations" ON public.vendor_locations
FOR SELECT USING (status = 'active');

-- Create RLS policies for inventory_alerts
CREATE POLICY "Admins can manage inventory alerts" ON public.inventory_alerts
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for stock_movements
CREATE POLICY "Admins can manage stock movements" ON public.stock_movements
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

-- Create triggers for updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendor_locations_updated_at
  BEFORE UPDATE ON public.vendor_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_inventory_alerts_updated_at
  BEFORE UPDATE ON public.inventory_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_stock_movements_updated_at
  BEFORE UPDATE ON public.stock_movements
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();