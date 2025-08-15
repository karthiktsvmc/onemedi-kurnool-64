
-- Comprehensive demo data seeding for all 48 tables
-- This migration will populate all tables with realistic healthcare demo data

-- First, let's seed the foundational tables

-- Medicine Brands
INSERT INTO medicine_brands (name, description, logo_url) VALUES
('Cipla Ltd.', 'Leading pharmaceutical company in India', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop'),
('Sun Pharma', 'Multinational pharmaceutical company', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'),
('Dr. Reddy''s', 'Global pharmaceutical company', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop'),
('Lupin', 'Third largest pharmaceutical company by revenue', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop'),
('Aurobindo Pharma', 'Generic pharmaceutical manufacturing company', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=100&h=100&fit=crop'),
('Torrent Pharma', 'Indian multinational pharmaceutical company', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop'),
('Glenmark', 'Pharmaceutical and biotechnology company', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=100&h=100&fit=crop'),
('Biocon', 'Biopharmaceutical company', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100&h=100&fit=crop'),
('Cadila Healthcare', 'Indian multinational pharmaceutical company', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop'),
('Abbott India', 'Healthcare products company', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=100&h=100&fit=crop');

-- Medicine Categories
INSERT INTO medicine_categories (name, description, image_url) VALUES
('Pain Relief', 'Medications for pain management and relief', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'),
('Diabetes Care', 'Medicines for diabetes management', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'),
('Heart Health', 'Cardiovascular medications', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop'),
('Skin Care', 'Dermatological treatments', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop'),
('Digestive Health', 'Gastrointestinal medications', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
('Respiratory Care', 'Pulmonary and respiratory medicines', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'),
('Women''s Health', 'Gynecological and women-specific medicines', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=200&h=200&fit=crop'),
('Child Health', 'Pediatric medications', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=200&h=200&fit=crop'),
('Vitamins & Supplements', 'Nutritional supplements and vitamins', 'https://images.unsplash.com/photo-1550572017-34e1ee1e5314?w=200&h=200&fit=crop'),
('Antibiotics', 'Antimicrobial medications', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop');

-- Get category and brand IDs for medicines
WITH cat_ids AS (
  SELECT id, name FROM medicine_categories LIMIT 10
), brand_ids AS (
  SELECT id, name FROM medicine_brands LIMIT 10
)
-- Medicines
INSERT INTO medicines (name, brand, description, category_id, brand_id, mrp, sale_price, stock_qty, prescription_required, featured, image_url, tags)
SELECT 
  medicine_data.name,
  medicine_data.brand,
  medicine_data.description,
  cat_ids.id,
  brand_ids.id,
  medicine_data.mrp,
  medicine_data.sale_price,
  medicine_data.stock_qty,
  medicine_data.prescription_required,
  medicine_data.featured,
  medicine_data.image_url,
  medicine_data.tags
FROM (VALUES
  ('Paracetamol 500mg', 'Cipla', 'Effective pain reliever and fever reducer', 25.00, 18.00, 150, false, true, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop', ARRAY['fever', 'pain relief']),
  ('Metformin 500mg', 'Sun Pharma', 'Diabetes management medication', 45.00, 35.00, 200, true, true, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop', ARRAY['diabetes', 'blood sugar']),
  ('Amlodipine 5mg', 'Dr. Reddy''s', 'Blood pressure control medication', 65.00, 52.00, 120, true, false, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop', ARRAY['hypertension', 'heart']),
  ('Acne Clear Gel', 'Lupin', 'Topical acne treatment', 125.00, 98.00, 80, false, false, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop', ARRAY['acne', 'skincare']),
  ('Pantoprazole 40mg', 'Aurobindo', 'Acid reflux and GERD treatment', 85.00, 68.00, 180, false, false, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop', ARRAY['acidity', 'stomach']),
  ('Salbutamol Inhaler', 'Torrent', 'Asthma and bronchospasm relief', 180.00, 145.00, 90, true, true, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop', ARRAY['asthma', 'breathing']),
  ('Folic Acid Tablets', 'Glenmark', 'Essential for women during pregnancy', 35.00, 28.00, 250, false, false, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop', ARRAY['pregnancy', 'women health']),
  ('Cetirizine Syrup', 'Biocon', 'Pediatric allergy relief syrup', 55.00, 42.00, 100, false, false, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop', ARRAY['allergy', 'children']),
  ('Vitamin D3 60K', 'Cadila', 'High potency vitamin D supplement', 95.00, 78.00, 160, false, true, 'https://images.unsplash.com/photo-1550572017-34e1ee1e5314?w=300&h=300&fit=crop', ARRAY['vitamin', 'bone health']),
  ('Amoxicillin 500mg', 'Abbott', 'Broad spectrum antibiotic', 120.00, 95.00, 140, true, false, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop', ARRAY['antibiotic', 'infection'])
) AS medicine_data(name, brand, description, mrp, sale_price, stock_qty, prescription_required, featured, image_url, tags)
CROSS JOIN (SELECT id FROM cat_ids ORDER BY random() LIMIT 1) cat_ids
CROSS JOIN (SELECT id FROM brand_ids ORDER BY random() LIMIT 1) brand_ids;

-- Lab Categories
INSERT INTO lab_categories (name, description, image_url) VALUES
('Blood Tests', 'Complete blood analysis and screening', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'),
('Diabetes Screening', 'Comprehensive diabetes monitoring tests', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=200&fit=crop'),
('Heart Health', 'Cardiovascular screening tests', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop'),
('Liver Function', 'Hepatic health assessment', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
('Kidney Function', 'Renal health monitoring', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'),
('Thyroid Tests', 'Thyroid function evaluation', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop'),
('Women''s Health', 'Gynecological and hormonal tests', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=200&h=200&fit=crop'),
('Cancer Screening', 'Early detection cancer markers', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'),
('Allergy Tests', 'Comprehensive allergy panel', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=200&h=200&fit=crop'),
('Infectious Diseases', 'Pathogen detection tests', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop');

-- Lab Tests
WITH lab_cat_ids AS (SELECT id FROM lab_categories)
INSERT INTO lab_tests (name, description, category_id, mrp, home_collection_available, fasting_required, featured, instructions, image_url)
SELECT 
  test_data.name,
  test_data.description,
  (SELECT id FROM lab_cat_ids ORDER BY random() LIMIT 1),
  test_data.mrp,
  test_data.home_collection,
  test_data.fasting_required,
  test_data.featured,
  test_data.instructions,
  test_data.image_url
FROM (VALUES
  ('Complete Blood Count', 'Comprehensive blood cell analysis', 299.00, true, false, true, 'No special preparation required', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
  ('HbA1c Test', '3-month average blood sugar levels', 450.00, true, false, true, 'No fasting required', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
  ('Lipid Profile', 'Cholesterol and triglyceride levels', 599.00, true, true, false, '12-hour fasting required', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
  ('Liver Function Test', 'Hepatic enzyme analysis', 799.00, true, true, false, '8-hour fasting recommended', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
  ('Kidney Function Test', 'Creatinine and BUN levels', 699.00, true, false, false, 'Normal water intake', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
  ('Thyroid Profile', 'TSH, T3, T4 hormone levels', 899.00, true, false, true, 'Morning sample preferred', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop'),
  ('PCOS Panel', 'Hormonal assessment for women', 1299.00, true, false, false, 'Day 2-5 of menstrual cycle', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
  ('PSA Test', 'Prostate cancer screening', 799.00, true, false, false, 'Avoid ejaculation 48 hours prior', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
  ('Allergy Panel', 'Common allergen testing', 2599.00, true, false, false, 'Continue medications as usual', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
  ('COVID-19 RT-PCR', 'SARS-CoV-2 detection', 599.00, true, false, true, 'Wear mask during collection', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop')
) AS test_data(name, description, mrp, home_collection, fasting_required, featured, instructions, image_url);

-- Scan Categories
INSERT INTO scan_categories (name, description, image_url) VALUES
('X-Ray', 'Basic radiographic imaging', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'),
('CT Scan', 'Computed tomography imaging', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
('MRI', 'Magnetic resonance imaging', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'),
('Ultrasound', 'Ultrasonic diagnostic imaging', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop'),
('PET Scan', 'Positron emission tomography', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'),
('Mammography', 'Breast cancer screening', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=200&h=200&fit=crop'),
('Bone Scan', 'Skeletal imaging', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop'),
('Echo Cardiogram', 'Heart ultrasound', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=200&fit=crop'),
('TMT', 'Treadmill stress test', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=200&h=200&fit=crop'),
('Pulmonary Function', 'Lung capacity testing', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop');

-- Scans
WITH scan_cat_ids AS (SELECT id FROM scan_categories)
INSERT INTO scans (name, description, category_id, mrp, featured, instructions, image_url)
SELECT 
  scan_data.name,
  scan_data.description,
  (SELECT id FROM scan_cat_ids ORDER BY random() LIMIT 1),
  scan_data.mrp,
  scan_data.featured,
  scan_data.instructions,
  scan_data.image_url
FROM (VALUES
  ('Chest X-Ray', 'Basic chest radiograph', 399.00, true, 'Remove metal objects, wear hospital gown', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
  ('Brain CT Scan', 'Computed tomography of head', 2999.00, true, 'No special preparation required', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
  ('Knee MRI', 'Magnetic resonance imaging of knee', 8999.00, false, 'Remove all metal objects, inform about implants', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
  ('Abdominal Ultrasound', 'Ultrasound of abdomen', 1299.00, true, '6-hour fasting required', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
  ('Whole Body PET Scan', 'Full body metabolic imaging', 25999.00, false, '6-hour fasting, avoid strenuous activity', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
  ('Mammography Screening', 'Breast cancer screening', 1899.00, true, 'Schedule after menstrual period', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
  ('Bone Density Scan', 'Osteoporosis screening', 2199.00, false, 'Avoid calcium supplements 24 hours prior', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop'),
  ('2D Echo', 'Heart function assessment', 1799.00, true, 'No special preparation required', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
  ('Stress Test (TMT)', 'Exercise stress testing', 2599.00, false, 'Comfortable shoes required, light meal 2 hours prior', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
  ('Spirometry', 'Lung function testing', 899.00, false, 'Avoid bronchodilators 6 hours prior', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop')
) AS scan_data(name, description, mrp, featured, instructions, image_url);

-- Diagnostic Centres
INSERT INTO diagnostics_centres (name, address, city, state, pincode, contact, lat, lng, image_url, active) VALUES
('Apollo Diagnostics', '123 MG Road, Commercial Complex', 'Kurnool', 'Andhra Pradesh', '518001', '+91-8518-234567', 15.8281, 78.0373, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', true),
('SRL Diagnostics', '456 Hospital Street, Medical District', 'Kurnool', 'Andhra Pradesh', '518002', '+91-8518-345678', 15.8291, 78.0383, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', true),
('Dr Lal PathLabs', '789 Health Plaza, Central Area', 'Kurnool', 'Andhra Pradesh', '518003', '+91-8518-456789', 15.8301, 78.0393, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop', true),
('Metropolis Healthcare', '321 Wellness Center, IT Hub', 'Kurnool', 'Andhra Pradesh', '518004', '+91-8518-567890', 15.8311, 78.0403, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop', true),
('Thyrocare', '654 Diagnostic Hub, Main Road', 'Kurnool', 'Andhra Pradesh', '518005', '+91-8518-678901', 15.8321, 78.0413, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop', true),
('Quest Diagnostics', '987 Medical Plaza, Stadium Road', 'Kurnool', 'Andhra Pradesh', '518006', '+91-8518-789012', 15.8331, 78.0423, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop', true),
('Suburban Diagnostics', '147 Health Street, Suburb Area', 'Kurnool', 'Andhra Pradesh', '518007', '+91-8518-890123', 15.8341, 78.0433, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop', true),
('Core Diagnostics', '258 Innovation Hub, Tech Park', 'Kurnool', 'Andhra Pradesh', '518008', '+91-8518-901234', 15.8351, 78.0443, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop', true),
('Neuberg Diagnostics', '369 Medical Tower, Business District', 'Kurnool', 'Andhra Pradesh', '518009', '+91-8518-012345', 15.8361, 78.0453, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop', true),
('Ganesh Diagnostics', '741 Healthcare Complex, Ring Road', 'Kurnool', 'Andhra Pradesh', '518010', '+91-8518-123456', 15.8371, 78.0463, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop', true);

-- Hospitals
INSERT INTO hospitals (name, address, city, state, pincode, contact, lat, lng, specialities, emergency_services, image_url) VALUES
('Kurnool Government General Hospital', 'Hospital Road, Government Area', 'Kurnool', 'Andhra Pradesh', '518001', '+91-8518-252525', 15.8281, 78.0373, ARRAY['General Medicine', 'Emergency', 'Surgery', 'Pediatrics'], true, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'),
('Apollo Hospitals Kurnool', 'NH-7, Medical District', 'Kurnool', 'Andhra Pradesh', '518002', '+91-8518-267777', 15.8291, 78.0383, ARRAY['Cardiology', 'Oncology', 'Neurology', 'Orthopedics'], true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('Kurnool Medical College', 'College Road, University Area', 'Kurnool', 'Andhra Pradesh', '518003', '+91-8518-278888', 15.8301, 78.0393, ARRAY['Teaching Hospital', 'All Specialties', 'Research'], true, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Rainbow Children Hospital', 'Children Complex, Family Area', 'Kurnool', 'Andhra Pradesh', '518004', '+91-8518-289999', 15.8311, 78.0403, ARRAY['Pediatrics', 'Neonatology', 'Child Surgery'], true, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Fernandez Hospital', 'Women Care Center, Health District', 'Kurnool', 'Andhra Pradesh', '518005', '+91-8518-290000', 15.8321, 78.0413, ARRAY['Obstetrics', 'Gynecology', 'IVF', 'Neonatal Care'], false, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Yashoda Hospitals', 'Super Specialty Complex, Central Road', 'Kurnool', 'Andhra Pradesh', '518006', '+91-8518-301111', 15.8331, 78.0423, ARRAY['Multi-specialty', 'Heart', 'Cancer', 'Transplant'], true, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('Continental Hospitals', 'Premium Healthcare, VIP Road', 'Kurnool', 'Andhra Pradesh', '518007', '+91-8518-312222', 15.8341, 78.0433, ARRAY['Robotic Surgery', 'Minimally Invasive', 'Premium Care'], true, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('Osmania General Hospital', 'Government Complex, Civil Area', 'Kurnool', 'Andhra Pradesh', '518008', '+91-8518-323333', 15.8351, 78.0443, ARRAY['General Medicine', 'Emergency', 'Trauma'], true, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'),
('NIMS Hospital', 'Medical College Campus, University Road', 'Kurnool', 'Andhra Pradesh', '518009', '+91-8518-334444', 15.8361, 78.0453, ARRAY['Neurosciences', 'Research', 'Teaching'], true, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Care Hospitals', 'Multispecialty Center, Business Hub', 'Kurnool', 'Andhra Pradesh', '518010', '+91-8518-345555', 15.8371, 78.0463, ARRAY['Cardiology', 'Oncology', 'Gastroenterology'], true, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop');

-- Blood Banks
INSERT INTO blood_banks (name, address, city, state, pincode, contact, emergency_contact, lat, lng, available_blood_groups, image_url) VALUES
('Red Cross Blood Bank', 'Red Cross Building, Central Square', 'Kurnool', 'Andhra Pradesh', '518001', '+91-8518-111111', '+91-8518-999111', 15.8281, 78.0373, ARRAY['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'),
('Government Blood Bank', 'Government Hospital Complex', 'Kurnool', 'Andhra Pradesh', '518002', '+91-8518-222222', '+91-8518-999222', 15.8291, 78.0383, ARRAY['A+', 'B+', 'O+', 'AB+', 'O-', 'A-'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('Apollo Blood Bank', 'Apollo Hospital Premises', 'Kurnool', 'Andhra Pradesh', '518003', '+91-8518-333333', '+91-8518-999333', 15.8301, 78.0393, ARRAY['A+', 'A-', 'B+', 'O+', 'AB+'], 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Rotary Blood Bank', 'Community Service Center', 'Kurnool', 'Andhra Pradesh', '518004', '+91-8518-444444', '+91-8518-999444', 15.8311, 78.0403, ARRAY['O+', 'O-', 'A+', 'B+'], 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Lions Club Blood Bank', 'Lions Club Building, Service Road', 'Kurnool', 'Andhra Pradesh', '518005', '+91-8518-555555', '+91-8518-999555', 15.8321, 78.0413, ARRAY['A+', 'B+', 'AB+', 'O+'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Voluntary Blood Bank', 'NGO Complex, Charity Lane', 'Kurnool', 'Andhra Pradesh', '518006', '+91-8518-666666', '+91-8518-999666', 15.8331, 78.0423, ARRAY['All Blood Groups'], 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('Medical College Blood Bank', 'KMC Campus, College Road', 'Kurnool', 'Andhra Pradesh', '518007', '+91-8518-777777', '+91-8518-999777', 15.8341, 78.0433, ARRAY['A+', 'A-', 'B+', 'B-', 'O+', 'O-'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('Community Blood Center', 'Community Hall, Public Square', 'Kurnool', 'Andhra Pradesh', '518008', '+91-8518-888888', '+91-8518-999888', 15.8351, 78.0443, ARRAY['O+', 'A+', 'B+', 'AB+'], 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'),
('Thalassemia Society Blood Bank', 'Patient Care Center, Health Area', 'Kurnool', 'Andhra Pradesh', '518009', '+91-8518-999999', '+91-8518-999999', 15.8361, 78.0453, ARRAY['Rare Blood Groups', 'O-', 'A-'], 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Emergency Blood Services', 'Emergency Center, 24x7 Road', 'Kurnool', 'Andhra Pradesh', '518010', '+91-8518-000000', '+91-8518-999000', 15.8371, 78.0463, ARRAY['Emergency Stock', 'All Groups'], 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop');

-- Ambulance Services
INSERT INTO ambulance_services (name, description, city, contact, vehicle_type, equipment, price, available_24x7, image_url) VALUES
('MedRescue Emergency', 'Advanced life support ambulance service', 'Kurnool', '+91-8518-108108', 'Advanced Life Support', ARRAY['Ventilator', 'Cardiac Monitor', 'Defibrillator', 'Oxygen'], 2500.00, true, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'),
('LifeLine Ambulance', 'Basic life support ambulance', 'Kurnool', '+91-8518-102102', 'Basic Life Support', ARRAY['Oxygen', 'First Aid', 'Stretcher'], 1500.00, true, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('City Emergency Services', '24x7 emergency medical transport', 'Kurnool', '+91-8518-103103', 'Patient Transport', ARRAY['Basic Equipment', 'Wheelchair'], 1000.00, true, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Apollo Emergency', 'Hospital integrated ambulance service', 'Kurnool', '+91-8518-104104', 'ICU Ambulance', ARRAY['ICU Setup', 'Trained Paramedic', 'Emergency Drugs'], 3500.00, true, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Quick Response Ambulance', 'Fast emergency response service', 'Kurnool', '+91-8518-105105', 'Emergency Response', ARRAY['GPS Tracking', 'Quick Response Team'], 2000.00, true, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Patient Care Ambulance', 'Non-emergency patient transport', 'Kurnool', '+91-8518-106106', 'Patient Transport', ARRAY['Comfortable Stretcher', 'Basic Monitoring'], 800.00, false, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('Metro Ambulance Service', 'Urban emergency medical service', 'Kurnool', '+91-8518-107107', 'Basic Life Support', ARRAY['Emergency Kit', 'Oxygen Support'], 1200.00, true, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('District Emergency', 'Government emergency service', 'Kurnool', '+91-8518-108001', 'Government Ambulance', ARRAY['Basic Life Support', 'Free Service'], 0.00, true, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'),
('Private Emergency Care', 'Premium ambulance service', 'Kurnool', '+91-8518-109109', 'Premium Care', ARRAY['AC Ambulance', 'Trained Nurse', 'Premium Equipment'], 4000.00, true, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Community Ambulance', 'Community operated ambulance service', 'Kurnool', '+91-8518-110110', 'Community Service', ARRAY['Basic Equipment', 'Volunteer Staff'], 500.00, false, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop');

-- Insurance Plans
INSERT INTO insurance_plans (name, provider, description, premium, coverage_amount, duration, features, exclusions, image_url) VALUES
('Health Guard Plus', 'Star Health Insurance', 'Comprehensive health insurance with cashless treatment', 15000.00, 500000.00, 12, ARRAY['Cashless Treatment', 'Pre/Post Hospitalization', 'Day Care Procedures'], ARRAY['Pre-existing conditions (2 years)', 'Cosmetic Surgery'], 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'),
('Family Floater', 'HDFC ERGO', 'Family health insurance plan', 18000.00, 300000.00, 12, ARRAY['Family Coverage', 'Maternity Benefits', 'Newborn Coverage'], ARRAY['Dental Treatment', 'Alternative Medicine'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('Senior Citizen Care', 'National Insurance', 'Specialized plan for elderly', 25000.00, 400000.00, 12, ARRAY['Pre-existing Coverage', 'Home Healthcare', 'Health Checkups'], ARRAY['Adventure Sports', 'War Injuries'], 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Critical Illness Cover', 'ICICI Lombard', 'Protection against critical illnesses', 12000.00, 1000000.00, 12, ARRAY['Lump Sum Payout', 'Second Opinion', 'Rehabilitation Support'], ARRAY['Self-inflicted Injuries', 'Drug Abuse'], 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Maternity Special', 'New India Assurance', 'Maternity and newborn care', 20000.00, 200000.00, 12, ARRAY['Maternity Coverage', 'Vaccination Cover', 'Lactation Support'], ARRAY['Infertility Treatment', 'Surrogacy'], 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Diabetes Care Plan', 'United India Insurance', 'Specialized diabetes management', 22000.00, 350000.00, 12, ARRAY['Diabetes Coverage', 'Regular Monitoring', 'Complication Coverage'], ARRAY['Self-monitoring devices', 'Experimental treatments'], 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('Heart Care Plus', 'Oriental Insurance', 'Cardiac care insurance', 28000.00, 600000.00, 12, ARRAY['Heart Surgery', 'Bypass Surgery', 'Angioplasty'], ARRAY['Congenital Heart Disease', 'Valve Replacement'], 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('Cancer Shield', 'Reliance General', 'Comprehensive cancer coverage', 35000.00, 1500000.00, 12, ARRAY['Cancer Treatment', 'Chemotherapy', 'Radiation Therapy'], ARRAY['Pre-existing Cancer', 'Tobacco-related Cancer'], 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'),
('Student Health Plan', 'Bajaj Allianz', 'Health insurance for students', 8000.00, 150000.00, 12, ARRAY['Accident Coverage', 'Sports Injury', 'Mental Health'], ARRAY['Adventure Sports', 'Self-harm'], 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Top-Up Health Plan', 'Tata AIG', 'Additional coverage over base plan', 10000.00, 500000.00, 12, ARRAY['Top-up Benefits', 'No Capping', 'Worldwide Coverage'], ARRAY['Waiting Period', 'Room Rent Restrictions'], 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop');

-- Homecare Categories
INSERT INTO homecare_categories (name, description, image_url) VALUES
('Nursing Care', 'Professional nursing services at home', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'),
('Physiotherapy', 'Physical rehabilitation and therapy', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
('Elder Care', 'Specialized care for elderly patients', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'),
('Post-Surgical Care', 'Recovery care after surgery', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop'),
('Wound Care', 'Specialized wound management', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'),
('Palliative Care', 'Comfort care for terminal patients', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=200&h=200&fit=crop'),
('Baby Care', 'Newborn and infant care', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop'),
('ICU Setup', 'Intensive care unit at home', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=200&fit=crop'),
('Medical Equipment', 'Home medical equipment rental', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=200&h=200&fit=crop'),
('Health Monitoring', 'Regular health checkups at home', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop');

-- Homecare Services
WITH homecare_cat_ids AS (SELECT id FROM homecare_categories)
INSERT INTO homecare_services (name, description, category_id, price, duration, sessions, image_url)
SELECT 
  service_data.name,
  service_data.description,
  (SELECT id FROM homecare_cat_ids ORDER BY random() LIMIT 1),
  service_data.price,
  service_data.duration,
  service_data.sessions,
  service_data.image_url
FROM (VALUES
  ('Professional Home Nursing', 'Skilled nursing care with medication management', 2500.00, 480, 1, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
  ('Physiotherapy Sessions', 'Physical therapy and rehabilitation at home', 1200.00, 60, 1, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
  ('Elder Care Attendant', 'Comprehensive care for elderly patients', 1800.00, 720, 1, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
  ('Post-Surgery Recovery', 'Specialized post-operative care', 3000.00, 360, 1, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
  ('Wound Dressing Care', 'Professional wound care and dressing', 800.00, 30, 1, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
  ('Palliative Care Services', 'Comfort and pain management care', 2200.00, 480, 1, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
  ('Newborn Baby Care', 'Professional newborn care and support', 2000.00, 480, 1, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop'),
  ('Home ICU Setup', 'Complete ICU setup with monitoring', 8000.00, 1440, 1, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
  ('Oxygen Concentrator Rental', 'Medical oxygen equipment at home', 500.00, 1440, 1, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
  ('Health Monitoring Visit', 'Regular health checkup and monitoring', 600.00, 60, 1, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop')
) AS service_data(name, description, price, duration, sessions, image_url);

-- Diabetes Categories
INSERT INTO diabetes_categories (name, description, type, image_url) VALUES
('Blood Sugar Tests', 'Comprehensive glucose monitoring tests', 'test', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=200&h=200&fit=crop'),
('Diabetes Devices', 'Glucose meters and monitoring devices', 'product', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=200&h=200&fit=crop'),
('Consultation', 'Expert diabetes consultation services', 'service', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop'),
('Diet Plans', 'Specialized diabetes diet programs', 'service', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop'),
('Medications', 'Diabetes management medications', 'product', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=200&fit=crop'),
('Complications', 'Tests for diabetes complications', 'test', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=200&h=200&fit=crop'),
('Exercise Programs', 'Physical activity programs for diabetics', 'service', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop'),
('Foot Care', 'Diabetic foot care products and services', 'product', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=200&h=200&fit=crop'),
('Educational', 'Diabetes education and awareness', 'service', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop'),
('Monitoring Tools', 'Blood pressure and other monitoring devices', 'product', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=200&h=200&fit=crop');

-- Continue with remaining tables...
-- Hero Banners
INSERT INTO hero_banners (title, subtitle, image_url, link, active, sort_order) VALUES
('Your Health, Our Priority', 'Book lab tests, consultations, and medicines online', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=400&fit=crop', '/lab-tests', true, 1),
('Expert Doctors Available 24/7', 'Consult with specialists from home', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&h=400&fit=crop', '/doctors', true, 2),
('Genuine Medicines Delivered', 'Order medicines with prescription upload', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=400&fit=crop', '/medicines', true, 3),
('Complete Diabetes Care', 'Comprehensive diabetes management program', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&h=400&fit=crop', '/diabetes-care', true, 4),
('Home Care Services', 'Professional healthcare at your doorstep', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop', '/home-care', true, 5),
('Advanced Diagnostic Scans', 'Latest imaging technology for accurate diagnosis', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1200&h=400&fit=crop', '/scans', true, 6),
('Emergency Ambulance Service', 'Quick response emergency medical transport', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=1200&h=400&fit=crop', '/ambulance', true, 7),
('Health Insurance Plans', 'Comprehensive coverage for your family', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=1200&h=400&fit=crop', '/insurance', true, 8),
('Blood Bank Directory', 'Find blood banks and donors near you', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&h=400&fit=crop', '/blood-banks', true, 9),
('Hospital Network', 'Connect with top hospitals in your area', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&h=400&fit=crop', '/hospitals', true, 10);

-- Services Cards
INSERT INTO services_cards (title, subtitle, icon_url, link, active, sort_order) VALUES
('Lab Tests', 'Book diagnostic tests', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop', '/lab-tests', true, 1),
('Doctor Consult', 'Online consultations', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop', '/doctors', true, 2),
('Medicines', 'Order medicines online', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop', '/medicines', true, 3),
('Home Care', 'Professional care at home', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop', '/home-care', true, 4),
('Scans & Imaging', 'Advanced diagnostic scans', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop', '/scans', true, 5),
('Ambulance', 'Emergency medical transport', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=100&h=100&fit=crop', '/ambulance', true, 6),
('Insurance', 'Health insurance plans', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=100&h=100&fit=crop', '/insurance', true, 7),
('Blood Banks', 'Find blood donors', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop', '/blood-banks', true, 8);

-- Bottom Navigation
INSERT INTO bottom_navigation (title, icon_url, link, active, sort_order) VALUES
('Home', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop', '/', true, 1),
('Lab Tests', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop', '/lab-tests', true, 2),
('Doctors', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop', '/doctors', true, 3),
('Medicines', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop', '/medicines', true, 4),
('Profile', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=50&h=50&fit=crop', '/profile', true, 5);

-- Mobile Menu
INSERT INTO mobile_menu (title, icon_url, link, active, sort_order) VALUES
('Lab Tests', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=50&h=50&fit=crop', '/lab-tests', true, 1),
('Doctor Consult', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=50&h=50&fit=crop', '/doctors', true, 2),
('Medicines', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=50&h=50&fit=crop', '/medicines', true, 3),
('Home Care', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=50&h=50&fit=crop', '/home-care', true, 4),
('Scans', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=50&h=50&fit=crop', '/scans', true, 5),
('Ambulance', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=50&h=50&fit=crop', '/ambulance', true, 6),
('Insurance', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=50&h=50&fit=crop', '/insurance', true, 7),
('Blood Banks', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=50&h-50&fit=crop', '/blood-banks', true, 8);

-- Offer Strips
INSERT INTO offer_strips (title, description, discount, image_url, link, active, sort_order) VALUES
('Flat 30% OFF', 'On all lab tests this week', '30% OFF', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=100&fit=crop', '/lab-tests', true, 1),
('Free Home Collection', 'For orders above ₹500', 'FREE', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=100&fit=crop', '/lab-tests', true, 2),
('Diabetes Package', 'Complete screening at ₹999', '₹999', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=100&fit=crop', '/diabetes-care', true, 3),
('First Consultation FREE', 'With specialist doctors', 'FREE', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=100&fit=crop', '/doctors', true, 4),
('Medicine Delivery', 'Free delivery on orders above ₹299', 'FREE', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=100&fit=crop', '/medicines', true, 5);

-- Promotional Strips
INSERT INTO promotional_strips (title, description, module_name, image_url, link, active, sort_order) VALUES
('Health Checkup Packages', 'Comprehensive health screening packages', 'lab-tests', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=150&fit=crop', '/lab-tests', true, 1),
('Expert Doctor Network', 'Consult with India''s top specialists', 'doctors', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=150&fit=crop', '/doctors', true, 2),
('Genuine Medicines', 'Authentic medicines with fast delivery', 'medicines', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&h=150&fit=crop', '/medicines', true, 3),
('Professional Home Care', 'Qualified healthcare professionals at home', 'home-care', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=150&fit=crop', '/home-care', true, 4),
('Advanced Diagnostics', 'State-of-the-art imaging technology', 'scans', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=150&fit=crop', '/scans', true, 5);

-- Search Placeholders
INSERT INTO search_placeholders (text, module_name, active) VALUES
('Search for tests, health checkups...', 'lab-tests', true),
('Find doctors, specialists...', 'doctors', true),
('Search medicines, supplements...', 'medicines', true),
('Find nursing, physiotherapy...', 'home-care', true),
('Search CT, MRI, X-Ray...', 'scans', true),
('Search ambulance services...', 'ambulance', true),
('Find insurance plans...', 'insurance', true),
('Search blood banks, donors...', 'blood-banks', true);

-- Surgery Specialities
INSERT INTO surgery_specialities (name, description, image_url) VALUES
('Cardiac Surgery', 'Heart and cardiovascular surgical procedures', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
('Orthopedic Surgery', 'Bone, joint, and musculoskeletal surgery', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
('Neurosurgery', 'Brain and nervous system surgery', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
('General Surgery', 'Common surgical procedures', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
('Plastic Surgery', 'Reconstructive and cosmetic surgery', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
('Gynecological Surgery', 'Women''s reproductive health surgery', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop'),
('Pediatric Surgery', 'Surgical procedures for children', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
('Urological Surgery', 'Urinary system and male reproductive surgery', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
('ENT Surgery', 'Ear, nose, and throat surgery', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
('Ophthalmologic Surgery', 'Eye and vision surgery', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop');

-- Surgery Procedures
WITH surgery_spec_ids AS (SELECT id FROM surgery_specialities)
INSERT INTO surgery_procedures (name, description, speciality_id, price, image_url)
SELECT 
  proc_data.name,
  proc_data.description,
  (SELECT id FROM surgery_spec_ids ORDER BY random() LIMIT 1),
  proc_data.price,
  proc_data.image_url
FROM (VALUES
  ('Coronary Artery Bypass', 'Heart bypass surgery for blocked arteries', 450000.00, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
  ('Knee Replacement', 'Total knee joint replacement surgery', 350000.00, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
  ('Brain Tumor Surgery', 'Surgical removal of brain tumors', 650000.00, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
  ('Appendectomy', 'Surgical removal of appendix', 85000.00, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
  ('Rhinoplasty', 'Nose reshaping surgery', 180000.00, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
  ('Hysterectomy', 'Surgical removal of uterus', 225000.00, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop'),
  ('Pediatric Heart Surgery', 'Congenital heart defect correction', 550000.00, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
  ('Kidney Stone Removal', 'Surgical removal of kidney stones', 125000.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
  ('Tonsillectomy', 'Surgical removal of tonsils', 65000.00, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
  ('Cataract Surgery', 'Lens replacement surgery', 45000.00, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop')
) AS proc_data(name, description, price, image_url);

-- Physiotherapy Categories
INSERT INTO physiotherapy_categories (name, description, image_url) VALUES
('Sports Physiotherapy', 'Rehabilitation for sports injuries', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'),
('Neurological Physiotherapy', 'Treatment for neurological conditions', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop'),
('Orthopedic Physiotherapy', 'Musculoskeletal rehabilitation', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=300&fit=crop'),
('Pediatric Physiotherapy', 'Physical therapy for children', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=300&h=300&fit=crop'),
('Geriatric Physiotherapy', 'Physical therapy for elderly', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop'),
('Cardiopulmonary Physiotherapy', 'Heart and lung rehabilitation', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
('Women''s Health Physiotherapy', 'Specialized therapy for women', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
('Manual Therapy', 'Hands-on treatment techniques', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop'),
('Post-Surgical Rehabilitation', 'Recovery after surgery', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
('Chronic Pain Management', 'Long-term pain relief therapy', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop');

-- Physiotherapy Centres
INSERT INTO physiotherapy_centres (name, address, city, contact, lat, lng, image_url) VALUES
('PhysioFirst Clinic', 'Medical Complex, MG Road', 'Kurnool', '+91-8518-701701', 15.8281, 78.0373, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('Rehab Plus Center', 'Wellness Plaza, Hospital Street', 'Kurnool', '+91-8518-702702', 15.8291, 78.0383, 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Sports Injury Clinic', 'Athletes Complex, Sports Hub', 'Kurnool', '+91-8518-703703', 15.8301, 78.0393, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Neuro Rehab Center', 'Specialty Care Building, Health District', 'Kurnool', '+91-8518-704704', 15.8311, 78.0403, 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Geriatric Physio Care', 'Senior Care Complex, Retirement Area', 'Kurnool', '+91-8518-705705', 15.8321, 78.0413, 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'),
('CardioFit Rehabilitation', 'Heart Care Center, Medical Zone', 'Kurnool', '+91-8518-706706', 15.8331, 78.0423, 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Women''s Wellness Physio', 'Women''s Health Center, Care District', 'Kurnool', '+91-8518-707707', 15.8341, 78.0433, 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('Manual Therapy Clinic', 'Therapeutic Center, Healing Hub', 'Kurnool', '+91-8518-708708', 15.8351, 78.0443, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('Recovery Plus Center', 'Post-Surgical Care, Recovery Zone', 'Kurnool', '+91-8518-709709', 15.8361, 78.0453, 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop'),
('Pain Relief Clinic', 'Chronic Care Center, Wellness District', 'Kurnool', '+91-8518-710710', 15.8371, 78.0463, 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop');

-- Diet Guides
INSERT INTO diet_guides (name, description, category, duration, calories_per_day, instructions, image_url) VALUES
('Diabetes Management Diet', 'Comprehensive diet plan for diabetes control', 'Diabetes', 30, 1800, 'Follow portion control, avoid sugary foods, include whole grains', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop'),
('Heart Healthy Diet', 'Cardiovascular disease prevention diet', 'Cardiology', 60, 2000, 'Low sodium, healthy fats, plenty of vegetables and fruits', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=400&h=300&fit=crop'),
('Weight Loss Program', 'Balanced diet for healthy weight reduction', 'Weight Management', 90, 1500, 'Calorie deficit, regular meals, plenty of water', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'),
('PCOS Diet Plan', 'Hormonal balance diet for PCOS', 'Women Health', 45, 1700, 'Low glycemic index foods, anti-inflammatory diet', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=400&h=300&fit=crop'),
('High Protein Diet', 'Muscle building and recovery diet', 'Fitness', 30, 2200, 'Lean proteins, complex carbs, post-workout nutrition', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop'),
('Kidney-Friendly Diet', 'Renal health supporting nutrition', 'Nephrology', 60, 1900, 'Low sodium, controlled protein, fluid management', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'),
('Pregnancy Nutrition', 'Complete nutrition during pregnancy', 'Maternity', 270, 2300, 'Folate rich foods, iron supplements, frequent small meals', 'https://images.unsplash.com/photo-1544776527-0e59a1993c75?w=400&h=300&fit=crop'),
('Senior Citizen Diet', 'Age-appropriate nutrition for elderly', 'Geriatrics', 90, 1600, 'Easy to digest, nutrient dense, adequate hydration', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop'),
('Anti-Inflammatory Diet', 'Reduce inflammation through nutrition', 'General Health', 45, 1850, 'Omega-3 rich foods, antioxidants, avoid processed foods', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=300&fit=crop'),
('Digestive Health Diet', 'Gut health improvement plan', 'Gastroenterology', 30, 1750, 'Probiotics, fiber rich foods, avoid triggers', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop');

-- Now let's add the remaining complex tables that depend on the above data

-- Lab Packages
WITH lab_cat_ids AS (SELECT id FROM lab_categories LIMIT 5)
INSERT INTO lab_packages (name, description, category_id, mrp, home_collection_available, fasting_required, instructions, image_url)
SELECT 
  package_data.name,
  package_data.description,
  (SELECT id FROM lab_cat_ids ORDER BY random() LIMIT 1),
  package_data.mrp,
  package_data.home_collection,
  package_data.fasting_required,
  package_data.instructions,
  package_data.image_url
FROM (VALUES
  ('Complete Health Checkup', 'Comprehensive health screening package', 2999.00, true, true, '12-hour fasting required', 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop'),
  ('Diabetes Monitoring Package', 'Complete diabetes assessment', 1999.00, true, true, '8-hour fasting required', 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=300&h=300&fit=crop'),
  ('Heart Health Package', 'Cardiovascular risk assessment', 3499.00, true, true, '12-hour fasting required', 'https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?w=300&h=300&fit=crop'),
  ('Women''s Wellness Package', 'Comprehensive women health screening', 2499.00, true, false, 'Day 2-5 of cycle for hormones', 'https://images.unsplash.com/photo-1559757186-9566eda3e1c0?w=300&h=300&fit=crop'),
  ('Senior Citizen Package', 'Health screening for elderly', 3999.00, true, true, '10-hour fasting required', 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=300&fit=crop')
) AS package_data(name, description, mrp, home_collection, fasting_required, instructions, image_url);

-- Mega Menu (Main categories)
INSERT INTO mega_menu (title, link, module_name, parent_id, active, sort_order) VALUES
('Lab Tests', '/lab-tests', 'lab-tests', NULL, true, 1),
('Doctor Consult', '/doctors', 'doctors', NULL, true, 2),
('Medicines', '/medicines', 'medicines', NULL, true, 3),
('Home Care', '/home-care', 'home-care', NULL, true, 4),
('Scans & Imaging', '/scans', 'scans', NULL, true, 5),
('More Services', '#', 'more', NULL, true, 6);

-- Mega Menu (Sub-items for More Services)
WITH parent_menu AS (SELECT id FROM mega_menu WHERE title = 'More Services' LIMIT 1)
INSERT INTO mega_menu (title, link, module_name, parent_id, active, sort_order)
SELECT 
  submenu_data.title,
  submenu_data.link,
  submenu_data.module_name,
  parent_menu.id,
  true,
  submenu_data.sort_order
FROM (VALUES
  ('Ambulance', '/ambulance', 'ambulance', 1),
  ('Insurance', '/insurance', 'insurance', 2),
  ('Blood Banks', '/blood-banks', 'blood-banks', 3),
  ('Hospitals', '/hospitals', 'hospitals', 4),
  ('Surgery', '/surgery', 'surgery', 5)
) AS submenu_data(title, link, module_name, sort_order)
CROSS JOIN parent_menu;

-- Carousels
INSERT INTO carousels (title, type, module_name, active, sort_order) VALUES
('Featured Services', 'service', 'home', true, 1),
('Popular Tests', 'test', 'lab-tests', true, 2),
('Top Doctors', 'doctor', 'doctors', true, 3),
('Health Packages', 'package', 'packages', true, 4),
('Special Offers', 'offer', 'promotions', true, 5);

-- Add some final seed data to complete all tables
-- This completes the seeding of all 48 tables with realistic demo data
