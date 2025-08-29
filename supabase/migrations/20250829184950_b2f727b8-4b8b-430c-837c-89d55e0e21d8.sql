-- Create comprehensive e-commerce database schema for ONE MEDI

-- Create addresses table for user addresses
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('home', 'work', 'other')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pharmacy', 'lab', 'hospital', 'clinic', 'homecare', 'ambulance', 'blood_bank')),
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  license_number TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  commission_rate NUMERIC DEFAULT 10.0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cart_items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('medicine', 'lab_test', 'scan', 'consultation', 'homecare', 'insurance', 'diabetes_product')),
  item_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  prescription_required BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  delivery_address_id UUID NOT NULL REFERENCES public.addresses(id),
  subtotal NUMERIC NOT NULL CHECK (subtotal >= 0),
  delivery_charges NUMERIC NOT NULL DEFAULT 0 CHECK (delivery_charges >= 0),
  gst_amount NUMERIC NOT NULL DEFAULT 0 CHECK (gst_amount >= 0),
  discount_amount NUMERIC NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
  total_amount NUMERIC NOT NULL CHECK (total_amount >= 0),
  payment_method TEXT CHECK (payment_method IN ('cod', 'online', 'wallet')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  delivery_date DATE,
  delivery_slot TEXT,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('medicine', 'lab_test', 'scan', 'consultation', 'homecare', 'insurance', 'diabetes_product')),
  item_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id),
  item_name TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC NOT NULL CHECK (total_price >= 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_id TEXT UNIQUE,
  gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'stripe', 'paytm', 'phonepe', 'gpay')),
  amount NUMERIC NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  gateway_response JSONB,
  refund_amount NUMERIC DEFAULT 0 CHECK (refund_amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE public.prescriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id),
  doctor_name TEXT,
  patient_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('medicine', 'lab_test', 'scan', 'doctor', 'hospital', 'homecare', 'vendor')),
  item_id UUID NOT NULL,
  order_id UUID REFERENCES public.orders(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order', 'payment', 'delivery', 'appointment', 'reminder', 'promotion')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupons table
CREATE TABLE public.coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed', 'free_delivery')),
  value NUMERIC NOT NULL CHECK (value > 0),
  minimum_order_amount NUMERIC DEFAULT 0,
  maximum_discount_amount NUMERIC,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  user_usage_limit INTEGER DEFAULT 1,
  applicable_to TEXT DEFAULT 'all' CHECK (applicable_to IN ('all', 'medicines', 'lab_tests', 'scans', 'consultations')),
  active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create coupon_usage table
CREATE TABLE public.coupon_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL CHECK (discount_amount >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('medicine', 'lab_test', 'scan', 'doctor', 'hospital', 'homecare', 'diabetes_product')),
  item_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for addresses
CREATE POLICY "Users can manage their own addresses" ON public.addresses
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses" ON public.addresses
FOR SELECT USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for vendors
CREATE POLICY "Public can view active vendors" ON public.vendors
FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage vendors" ON public.vendors
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for cart_items
CREATE POLICY "Users can manage their own cart items" ON public.cart_items
FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON public.orders
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for order_items
CREATE POLICY "Users can view their order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all order items" ON public.order_items
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for payments
CREATE POLICY "Users can view their payments" ON public.payments
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = payments.order_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can manage all payments" ON public.payments
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for prescriptions
CREATE POLICY "Users can manage their own prescriptions" ON public.prescriptions
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all prescriptions" ON public.prescriptions
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for reviews
CREATE POLICY "Users can manage their own reviews" ON public.reviews
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can read reviews" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "Admins can manage all reviews" ON public.reviews
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications
FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for coupons
CREATE POLICY "Public can view active coupons" ON public.coupons
FOR SELECT USING (active = true AND valid_from <= now() AND valid_until >= now());

CREATE POLICY "Admins can manage coupons" ON public.coupons
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for coupon_usage
CREATE POLICY "Users can view their coupon usage" ON public.coupon_usage
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create coupon usage" ON public.coupon_usage
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage coupon usage" ON public.coupon_usage
FOR ALL USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create RLS policies for wishlists
CREATE POLICY "Users can manage their own wishlists" ON public.wishlists
FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_addresses_pincode ON public.addresses(pincode);

CREATE INDEX idx_vendors_type ON public.vendors(type);
CREATE INDEX idx_vendors_city_state ON public.vendors(city, state);
CREATE INDEX idx_vendors_active ON public.vendors(active);

CREATE INDEX idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX idx_cart_items_item_type_id ON public.cart_items(item_type, item_id);

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_number ON public.orders(order_number);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_item_type_id ON public.order_items(item_type, item_id);

CREATE INDEX idx_payments_order_id ON public.payments(order_id);
CREATE INDEX idx_payments_status ON public.payments(status);

CREATE INDEX idx_prescriptions_user_id ON public.prescriptions(user_id);
CREATE INDEX idx_prescriptions_order_id ON public.prescriptions(order_id);

CREATE INDEX idx_reviews_item_type_id ON public.reviews(item_type, item_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at);

CREATE INDEX idx_coupons_code ON public.coupons(code);
CREATE INDEX idx_coupons_active ON public.coupons(active);

CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_wishlists_item_type_id ON public.wishlists(item_type, item_id);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON public.order_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON public.prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_number := 'OM' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::TEXT, 4, '0');
    
    IF NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = new_number) THEN
      RETURN new_number;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;