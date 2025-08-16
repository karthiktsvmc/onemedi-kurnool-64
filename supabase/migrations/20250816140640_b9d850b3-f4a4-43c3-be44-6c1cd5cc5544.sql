
-- Add location columns to existing service tables
ALTER TABLE ambulance_services 
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

ALTER TABLE blood_banks 
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 15,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

ALTER TABLE hospitals 
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 25,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

ALTER TABLE homecare_services 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

ALTER TABLE diabetes_services 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS service_radius_km integer DEFAULT 10,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

-- Add location columns to medicines for pharmacy location tracking
ALTER TABLE medicines 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS pincode text,
ADD COLUMN IF NOT EXISTS latitude numeric,
ADD COLUMN IF NOT EXISTS longitude numeric,
ADD COLUMN IF NOT EXISTS pharmacy_name text,
ADD COLUMN IF NOT EXISTS location_restricted boolean DEFAULT true;

-- Create function to calculate distance between two points using Haversine formula
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 numeric, lng1 numeric, 
  lat2 numeric, lng2 numeric
) RETURNS numeric AS $$
DECLARE
  radius_earth numeric := 6371; -- Earth's radius in km
  dlat numeric;
  dlng numeric;
  a numeric;
  c numeric;
BEGIN
  -- Convert degrees to radians
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  
  a := sin(dlat/2) * sin(dlat/2) + 
       cos(radians(lat1)) * cos(radians(lat2)) * 
       sin(dlng/2) * sin(dlng/2);
  c := 2 * atan2(sqrt(a), sqrt(1-a));
  
  RETURN radius_earth * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to get nearby services within radius
CREATE OR REPLACE FUNCTION get_nearby_services(
  table_name text,
  user_lat numeric,
  user_lng numeric,
  radius_km integer DEFAULT 25
) RETURNS TABLE(
  service_data jsonb,
  distance_km numeric
) AS $$
BEGIN
  RETURN QUERY EXECUTE format('
    SELECT 
      row_to_json(t.*)::jsonb as service_data,
      calculate_distance(%L, %L, t.latitude, t.longitude) as distance_km
    FROM %I t
    WHERE t.latitude IS NOT NULL 
      AND t.longitude IS NOT NULL
      AND (
        t.location_restricted = false 
        OR calculate_distance(%L, %L, t.latitude, t.longitude) <= COALESCE(t.service_radius_km, %L)
      )
    ORDER BY distance_km ASC
  ', user_lat, user_lng, table_name, user_lat, user_lng, radius_km);
END;
$$ LANGUAGE plpgsql;

-- Create analytics table for location tracking
CREATE TABLE IF NOT EXISTS location_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  city text,
  state text,
  pincode text,
  action text NOT NULL, -- 'search', 'order', 'view_service'
  service_type text, -- 'medicine', 'lab_test', 'hospital', etc.
  service_id uuid,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on location_analytics
ALTER TABLE location_analytics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for location_analytics
CREATE POLICY "Users can insert their own analytics" 
  ON location_analytics FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics" 
  ON location_analytics FOR SELECT 
  USING (get_current_user_role() = ANY (ARRAY['super_admin'::text, 'admin'::text]));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ambulance_services_location ON ambulance_services(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_blood_banks_location ON blood_banks(lat, lng);
CREATE INDEX IF NOT EXISTS idx_hospitals_location ON hospitals(lat, lng);
CREATE INDEX IF NOT EXISTS idx_homecare_services_location ON homecare_services(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_diabetes_services_location ON diabetes_services(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_medicines_location ON medicines(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_location_analytics_created_at ON location_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_location_analytics_user_city ON location_analytics(user_id, city);
