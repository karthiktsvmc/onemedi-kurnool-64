-- Create invoice templates table for customizable invoice layouts
CREATE TABLE public.invoice_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  company_logo_url TEXT,
  header_text TEXT,
  footer_text TEXT,
  terms_conditions TEXT,
  disclaimers TEXT,
  show_doctor_name BOOLEAN DEFAULT true,
  show_prescription_ref BOOLEAN DEFAULT true,
  show_patient_details BOOLEAN DEFAULT true,
  branding_colors JSONB DEFAULT '{"primary": "#2563eb", "secondary": "#64748b"}',
  contact_info JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create business settings table for global finance configuration
CREATE TABLE public.business_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'ONE MEDI',
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  company_website TEXT,
  gst_number TEXT,
  pan_number TEXT,
  default_currency TEXT DEFAULT 'INR',
  gst_rate NUMERIC DEFAULT 18.00,
  delivery_charge NUMERIC DEFAULT 0,
  service_charge_rate NUMERIC DEFAULT 0,
  invoice_number_format TEXT DEFAULT 'INV-{YYYY}{MM}{DD}-{####}',
  invoice_counter INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES public.orders(id),
  user_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  doctor_name TEXT,
  prescription_ref TEXT,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  delivery_charge NUMERIC NOT NULL DEFAULT 0,
  service_charge NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'pending', 'refunded', 'cancelled')),
  payment_method TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  template_id UUID REFERENCES public.invoice_templates(id),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice items table
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT,
  item_type TEXT NOT NULL, -- medicine, lab_test, homecare_service, etc.
  item_id UUID, -- reference to the actual item
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL DEFAULT 0,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  tax_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoice_templates
CREATE POLICY "Admins can manage invoice templates" ON public.invoice_templates
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text]));

CREATE POLICY "Public read access to templates" ON public.invoice_templates
  FOR SELECT USING (true);

-- RLS Policies for business_settings
CREATE POLICY "Admins can manage business settings" ON public.business_settings
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text]));

CREATE POLICY "Public read access to business settings" ON public.business_settings
  FOR SELECT USING (true);

-- RLS Policies for invoices
CREATE POLICY "Admins can manage all invoices" ON public.invoices
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text]));

CREATE POLICY "Users can view their own invoices" ON public.invoices
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for invoice_items
CREATE POLICY "Admins can manage invoice items" ON public.invoice_items
  FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text, 'finance_manager'::text]));

CREATE POLICY "Users can view their invoice items" ON public.invoice_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.invoices 
      WHERE invoices.id = invoice_items.invoice_id 
      AND invoices.user_id = auth.uid()
    )
  );

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  settings RECORD;
  new_number TEXT;
  counter_part TEXT;
BEGIN
  -- Get business settings
  SELECT * INTO settings FROM public.business_settings LIMIT 1;
  
  IF settings IS NULL THEN
    -- Create default settings if none exist
    INSERT INTO public.business_settings (company_name) VALUES ('ONE MEDI');
    SELECT * INTO settings FROM public.business_settings LIMIT 1;
  END IF;
  
  -- Generate counter part
  counter_part := LPAD(settings.invoice_counter::TEXT, 4, '0');
  
  -- Replace placeholders in format
  new_number := settings.invoice_number_format;
  new_number := REPLACE(new_number, '{YYYY}', TO_CHAR(NOW(), 'YYYY'));
  new_number := REPLACE(new_number, '{MM}', TO_CHAR(NOW(), 'MM'));
  new_number := REPLACE(new_number, '{DD}', TO_CHAR(NOW(), 'DD'));
  new_number := REPLACE(new_number, '{####}', counter_part);
  
  -- Update counter
  UPDATE public.business_settings 
  SET invoice_counter = invoice_counter + 1
  WHERE id = settings.id;
  
  RETURN new_number;
END;
$$;

-- Create function to auto-generate invoice on order completion
CREATE OR REPLACE FUNCTION public.auto_generate_invoice()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  invoice_id UUID;
  template_id UUID;
  settings RECORD;
  customer_info RECORD;
  item RECORD;
  subtotal NUMERIC := 0;
  tax_amount NUMERIC := 0;
  total_amount NUMERIC := 0;
BEGIN
  -- Only generate invoice when order status changes to 'completed'
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    
    -- Get business settings
    SELECT * INTO settings FROM public.business_settings LIMIT 1;
    
    -- Get default template
    SELECT id INTO template_id FROM public.invoice_templates WHERE is_default = true LIMIT 1;
    
    -- Get customer info from profiles
    SELECT full_name, email, phone 
    INTO customer_info 
    FROM public.profiles 
    WHERE user_id = NEW.user_id;
    
    -- Create invoice
    INSERT INTO public.invoices (
      invoice_number,
      order_id,
      user_id,
      customer_name,
      customer_email,
      customer_phone,
      subtotal,
      tax_amount,
      total_amount,
      currency,
      template_id,
      created_by
    ) VALUES (
      generate_invoice_number(),
      NEW.id,
      NEW.user_id,
      COALESCE(customer_info.full_name, 'Customer'),
      customer_info.email,
      customer_info.phone,
      NEW.total_amount,
      NEW.tax_amount,
      NEW.total_amount,
      COALESCE(settings.default_currency, 'INR'),
      template_id,
      auth.uid()
    ) RETURNING id INTO invoice_id;
    
    -- Create invoice items from order items
    FOR item IN 
      SELECT * FROM public.order_items WHERE order_id = NEW.id
    LOOP
      INSERT INTO public.invoice_items (
        invoice_id,
        item_name,
        item_type,
        item_id,
        quantity,
        unit_price,
        total_amount
      ) VALUES (
        invoice_id,
        item.item_name,
        item.item_type,
        item.item_id,
        item.quantity,
        item.unit_price,
        item.total_price
      );
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for auto invoice generation
CREATE TRIGGER auto_generate_invoice_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_invoice();

-- Create indexes for performance
CREATE INDEX idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX idx_invoices_order_id ON public.invoices(order_id);
CREATE INDEX idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX idx_invoices_status ON public.invoices(payment_status);
CREATE INDEX idx_invoices_date ON public.invoices(invoice_date);
CREATE INDEX idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);

-- Insert default template
INSERT INTO public.invoice_templates (
  name,
  is_default,
  header_text,
  footer_text,
  terms_conditions,
  disclaimers
) VALUES (
  'Default Template',
  true,
  'Thank you for choosing ONE MEDI',
  'For any queries, contact us at support@onemedi.com',
  '1. Payment is due within 15 days of invoice date. 2. All disputes must be raised within 7 days.',
  'This is a computer-generated invoice and does not require a signature.'
);

-- Insert default business settings
INSERT INTO public.business_settings (
  company_name,
  company_address,
  company_phone,
  company_email,
  company_website
) VALUES (
  'ONE MEDI',
  'Kurnool, Andhra Pradesh, India',
  '+91-XXXX-XXXX',
  'info@onemedi.com',
  'www.onemedi.com'
) ON CONFLICT DO NOTHING;

-- Add updated_at triggers
CREATE TRIGGER update_invoice_templates_updated_at
  BEFORE UPDATE ON public.invoice_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_settings_updated_at
  BEFORE UPDATE ON public.business_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();