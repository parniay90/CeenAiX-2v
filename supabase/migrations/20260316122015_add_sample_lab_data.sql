-- Sample Lab Data
-- 
-- This migration adds sample data for:
-- - Lab facilities with various locations and test capabilities
-- - Test types across different categories (blood, imaging, diagnostic, etc.)
-- - Sample test orders and results for demonstration

-- Insert Sample Test Types
INSERT INTO test_types (name, category, description, preparation_instructions, typical_turnaround) VALUES
('Complete Blood Count (CBC)', 'blood', 'Measures red blood cells, white blood cells, and platelets', 'Fasting not required', '24 hours'),
('Lipid Panel', 'blood', 'Measures cholesterol levels and triglycerides', 'Fasting for 9-12 hours required', '1-2 days'),
('HbA1c (Diabetes Test)', 'blood', 'Measures average blood sugar levels over 3 months', 'Fasting not required', 'Same day'),
('Thyroid Function (TSH)', 'blood', 'Tests thyroid hormone levels', 'Fasting not required', '2-3 days'),
('Liver Function Test (LFT)', 'blood', 'Assesses liver health and function', 'Fasting for 8 hours recommended', '1-2 days'),
('Kidney Function Test', 'blood', 'Evaluates kidney health through creatinine and BUN', 'Fasting not required', '1-2 days'),
('Vitamin D Test', 'blood', 'Measures vitamin D levels in blood', 'Fasting not required', '2-3 days'),
('X-Ray Chest', 'imaging', 'Imaging of chest area for lung and heart evaluation', 'Remove metal objects', 'Same day'),
('Ultrasound Abdomen', 'imaging', 'Imaging of abdominal organs', 'Fasting for 6 hours required', 'Same day'),
('MRI Brain', 'imaging', 'Detailed brain imaging using magnetic resonance', 'Remove all metal objects, may require sedation', '2-3 days'),
('CT Scan', 'imaging', 'Detailed cross-sectional imaging', 'May require contrast, fasting recommended', '1-2 days'),
('ECG (Electrocardiogram)', 'cardiology', 'Records electrical activity of the heart', 'No special preparation', 'Immediate'),
('Echocardiogram', 'cardiology', 'Ultrasound of the heart', 'No special preparation', 'Same day'),
('Stress Test', 'cardiology', 'Evaluates heart function during exercise', 'Avoid caffeine, wear comfortable clothes', 'Same day'),
('EEG (Brain Wave Test)', 'neurology', 'Records electrical activity in the brain', 'Wash hair, avoid caffeine', 'Same day'),
('Urine Analysis', 'diagnostic', 'Tests urine for various health markers', 'Clean catch specimen', 'Same day'),
('Stool Test', 'diagnostic', 'Tests for digestive issues and infections', 'Follow collection instructions', '2-3 days'),
('COVID-19 PCR Test', 'diagnostic', 'Detects COVID-19 virus', 'No eating/drinking 30 minutes before', '24 hours'),
('Allergy Test Panel', 'diagnostic', 'Tests for common allergens', 'Avoid antihistamines 3 days prior', '3-5 days'),
('Bone Density Scan', 'imaging', 'Measures bone strength and osteoporosis risk', 'Avoid calcium supplements 24 hours before', '1-2 days')
ON CONFLICT DO NOTHING;

-- Insert Sample Lab Facilities
INSERT INTO lab_facilities (name, address, city, state, phone, email, rating, test_types, accepts_insurance, hours) VALUES
(
  'LifeLab Medical Center',
  '123 Healthcare Blvd',
  'Dubai',
  'Dubai',
  '+971-4-123-4567',
  'info@lifelab.ae',
  4.8,
  ARRAY['Complete Blood Count (CBC)', 'Lipid Panel', 'HbA1c (Diabetes Test)', 'Thyroid Function (TSH)', 'Liver Function Test (LFT)', 'Vitamin D Test', 'Urine Analysis'],
  true,
  'Sun-Thu 7:00 AM - 9:00 PM'
),
(
  'AlMana Medical Laboratory',
  '456 Medical District',
  'Abu Dhabi',
  'Abu Dhabi',
  '+971-2-234-5678',
  'contact@almana.ae',
  4.7,
  ARRAY['Complete Blood Count (CBC)', 'Lipid Panel', 'Kidney Function Test', 'Liver Function Test (LFT)', 'COVID-19 PCR Test', 'Urine Analysis', 'Stool Test'],
  true,
  'Daily 8:00 AM - 8:00 PM'
),
(
  'Advanced Imaging Center',
  '789 Innovation Street',
  'Dubai',
  'Dubai',
  '+971-4-345-6789',
  'appointments@advancedimaging.ae',
  4.9,
  ARRAY['X-Ray Chest', 'Ultrasound Abdomen', 'MRI Brain', 'CT Scan', 'Bone Density Scan'],
  true,
  'Mon-Sat 9:00 AM - 6:00 PM'
),
(
  'Heart & Vascular Diagnostic Center',
  '321 Cardiac Avenue',
  'Sharjah',
  'Sharjah',
  '+971-6-456-7890',
  'info@heartcenter.ae',
  4.8,
  ARRAY['ECG (Electrocardiogram)', 'Echocardiogram', 'Stress Test', 'Ultrasound Abdomen'],
  true,
  'Sun-Thu 8:00 AM - 5:00 PM'
),
(
  'NeuroCare Diagnostic Lab',
  '654 Brain Boulevard',
  'Dubai',
  'Dubai',
  '+971-4-567-8901',
  'neurocare@diagnostics.ae',
  4.6,
  ARRAY['EEG (Brain Wave Test)', 'MRI Brain', 'CT Scan'],
  true,
  'Sun-Thu 9:00 AM - 7:00 PM'
),
(
  'QuickTest Express Lab',
  '987 Fast Lane',
  'Abu Dhabi',
  'Abu Dhabi',
  '+971-2-678-9012',
  'express@quicktest.ae',
  4.5,
  ARRAY['Complete Blood Count (CBC)', 'COVID-19 PCR Test', 'Urine Analysis', 'HbA1c (Diabetes Test)', 'Thyroid Function (TSH)'],
  true,
  'Daily 7:00 AM - 11:00 PM'
),
(
  'Comprehensive Health Diagnostics',
  '147 Wellness Way',
  'Dubai',
  'Dubai',
  '+971-4-789-0123',
  'hello@comprehensivehealth.ae',
  4.9,
  ARRAY['Complete Blood Count (CBC)', 'Lipid Panel', 'HbA1c (Diabetes Test)', 'Thyroid Function (TSH)', 'Liver Function Test (LFT)', 'Kidney Function Test', 'Vitamin D Test', 'Allergy Test Panel', 'Urine Analysis'],
  true,
  'Sun-Thu 6:00 AM - 10:00 PM'
),
(
  'Premier Medical Laboratory',
  '258 Health Plaza',
  'Ajman',
  'Ajman',
  '+971-7-890-1234',
  'service@premierlab.ae',
  4.7,
  ARRAY['Complete Blood Count (CBC)', 'Lipid Panel', 'Liver Function Test (LFT)', 'Kidney Function Test', 'COVID-19 PCR Test'],
  true,
  'Daily 8:00 AM - 8:00 PM'
)
ON CONFLICT DO NOTHING;