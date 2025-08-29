-- Create missing tables only
CREATE TABLE IF NOT EXISTS public.vendor_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL,
  vendor_name TEXT,
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

CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID,
  medicine_name TEXT,
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  current_stock INTEGER,
  threshold INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stock_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  medicine_id UUID,
  medicine_name TEXT,
  movement_type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage vendor locations" ON public.vendor_locations
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Public read access to vendor locations" ON public.vendor_locations
FOR SELECT USING (status = 'active');

CREATE POLICY "Admins can manage inventory alerts" ON public.inventory_alerts
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

CREATE POLICY "Admins can manage stock movements" ON public.stock_movements
FOR ALL USING (get_current_user_role() = ANY(ARRAY['super_admin'::text, 'admin'::text]));

-- Create triggers for updated_at
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