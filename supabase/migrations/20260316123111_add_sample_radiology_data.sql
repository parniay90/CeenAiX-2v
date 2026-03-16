-- Sample Radiology Data
-- 
-- This migration adds sample data for:
-- - Imaging modalities (MRI, CT, X-Ray, Ultrasound, PET, Mammography)
-- - Radiology centers across UAE
-- - For demonstration purposes

-- Insert Imaging Modalities
INSERT INTO imaging_modalities (name, category, description, preparation_instructions, duration, contrast_available, typical_cost_range) VALUES
(
  'MRI Brain',
  'MRI',
  'Magnetic Resonance Imaging of the brain for detailed neurological assessment',
  'Remove all metal objects. Inform technician of any implants or claustrophobia. Fasting may be required if contrast is used.',
  '45-60 minutes',
  true,
  'AED 1,500 - 3,000'
),
(
  'MRI Spine',
  'MRI',
  'Magnetic Resonance Imaging of the spine (cervical, thoracic, or lumbar)',
  'Remove all metal objects. Comfortable clothing without metal fasteners recommended.',
  '45-60 minutes',
  true,
  'AED 1,800 - 3,500'
),
(
  'CT Scan Brain',
  'CT',
  'Computed Tomography scan of the brain for rapid diagnosis',
  'Fasting for 4 hours if contrast is planned. Remove metal objects.',
  '15-30 minutes',
  true,
  'AED 800 - 1,500'
),
(
  'CT Chest',
  'CT',
  'CT scan of the chest for lung and thoracic evaluation',
  'Fasting for 4 hours recommended. Inform about allergies.',
  '20-30 minutes',
  true,
  'AED 900 - 1,600'
),
(
  'CT Abdomen & Pelvis',
  'CT',
  'CT scan of abdomen and pelvis for comprehensive evaluation',
  'Fasting for 6 hours. Drink oral contrast 1-2 hours before scan.',
  '30-45 minutes',
  true,
  'AED 1,200 - 2,000'
),
(
  'X-Ray Chest',
  'X-Ray',
  'Digital chest radiography for lung and heart assessment',
  'No special preparation. Remove jewelry and metal objects.',
  '5-10 minutes',
  false,
  'AED 100 - 300'
),
(
  'X-Ray Spine',
  'X-Ray',
  'Radiography of the spine (cervical, thoracic, or lumbar)',
  'Wear loose clothing. Remove jewelry.',
  '10-15 minutes',
  false,
  'AED 150 - 400'
),
(
  'X-Ray Extremities',
  'X-Ray',
  'Radiography of arms, legs, hands, or feet',
  'No special preparation required.',
  '5-10 minutes',
  false,
  'AED 100 - 250'
),
(
  'Ultrasound Abdomen',
  'Ultrasound',
  'Abdominal ultrasound for organ evaluation',
  'Fasting for 6 hours. Drink water 1 hour before scan.',
  '20-30 minutes',
  false,
  'AED 300 - 600'
),
(
  'Ultrasound Pelvic',
  'Ultrasound',
  'Pelvic ultrasound for reproductive organ assessment',
  'Full bladder required. Drink 4-6 glasses of water 1 hour before.',
  '20-30 minutes',
  false,
  'AED 350 - 700'
),
(
  'Ultrasound Pregnancy',
  'Ultrasound',
  'Obstetric ultrasound for fetal assessment',
  'Full bladder for early pregnancy. No preparation for later stages.',
  '20-40 minutes',
  false,
  'AED 250 - 500'
),
(
  'PET-CT Scan',
  'PET',
  'Positron Emission Tomography combined with CT for cancer detection',
  'Fasting for 6 hours. Avoid exercise 24 hours before. Diabetics need special instructions.',
  '60-90 minutes',
  true,
  'AED 4,000 - 8,000'
),
(
  'Mammography Screening',
  'Mammography',
  'Breast screening mammography for early cancer detection',
  'Avoid deodorants, powders, or lotions. Schedule after menstrual period.',
  '15-20 minutes',
  false,
  'AED 400 - 800'
),
(
  'Mammography Diagnostic',
  'Mammography',
  'Diagnostic mammography with additional views',
  'Avoid deodorants, powders, or lotions. Bring previous mammograms.',
  '30-45 minutes',
  false,
  'AED 600 - 1,200'
)
ON CONFLICT DO NOTHING;

-- Insert Radiology Centers
INSERT INTO radiology_centers (name, address, city, state, phone, email, rating, modalities_available, accepts_insurance, emergency_services, hours) VALUES
(
  'Advanced Imaging Center Dubai',
  'Sheikh Zayed Road, Trade Center District',
  'Dubai',
  'Dubai',
  '+971-4-321-8800',
  'info@advancedimaging.ae',
  4.9,
  ARRAY['MRI Brain', 'MRI Spine', 'CT Scan Brain', 'CT Chest', 'CT Abdomen & Pelvis', 'X-Ray Chest', 'X-Ray Spine', 'Ultrasound Abdomen', 'PET-CT Scan'],
  true,
  true,
  '24/7'
),
(
  'Emirates Diagnostic Center',
  'Jumeirah Beach Road',
  'Dubai',
  'Dubai',
  '+971-4-345-6700',
  'contact@emiratesdiagnostic.ae',
  4.8,
  ARRAY['MRI Brain', 'MRI Spine', 'CT Scan Brain', 'CT Chest', 'X-Ray Chest', 'X-Ray Extremities', 'Ultrasound Abdomen', 'Ultrasound Pelvic'],
  true,
  false,
  'Daily 7:00 AM - 11:00 PM'
),
(
  'Capital Radiology Center',
  'Corniche Road',
  'Abu Dhabi',
  'Abu Dhabi',
  '+971-2-444-5500',
  'info@capitalradiology.ae',
  4.7,
  ARRAY['MRI Brain', 'CT Scan Brain', 'CT Chest', 'CT Abdomen & Pelvis', 'X-Ray Chest', 'X-Ray Spine', 'Ultrasound Abdomen'],
  true,
  true,
  '24/7'
),
(
  'Women''s Imaging Center',
  'Al Wasl Road',
  'Dubai',
  'Dubai',
  '+971-4-388-9900',
  'womensimaging@healthcare.ae',
  4.9,
  ARRAY['Mammography Screening', 'Mammography Diagnostic', 'Ultrasound Pelvic', 'Ultrasound Pregnancy', 'MRI Brain'],
  true,
  false,
  'Sun-Thu 8:00 AM - 6:00 PM, Sat 9:00 AM - 2:00 PM'
),
(
  'Premier Diagnostic Imaging',
  'King Faisal Street',
  'Sharjah',
  'Sharjah',
  '+971-6-555-7700',
  'premier@imaging.ae',
  4.6,
  ARRAY['CT Scan Brain', 'CT Chest', 'X-Ray Chest', 'X-Ray Extremities', 'Ultrasound Abdomen', 'Ultrasound Pelvic'],
  true,
  false,
  'Daily 8:00 AM - 10:00 PM'
),
(
  'HealthScan Medical Imaging',
  'Sheikh Khalifa Street',
  'Ajman',
  'Ajman',
  '+971-6-742-3300',
  'healthscan@medical.ae',
  4.5,
  ARRAY['MRI Brain', 'CT Scan Brain', 'CT Chest', 'X-Ray Chest', 'X-Ray Spine', 'Ultrasound Abdomen'],
  true,
  false,
  'Daily 8:00 AM - 8:00 PM'
),
(
  'Nuclear Medicine & PET Center',
  'Dubai Healthcare City',
  'Dubai',
  'Dubai',
  '+971-4-429-8800',
  'pet@nuclearmedicine.ae',
  4.8,
  ARRAY['PET-CT Scan', 'CT Scan Brain', 'CT Chest', 'CT Abdomen & Pelvis', 'MRI Brain'],
  true,
  false,
  'Mon-Sat 7:00 AM - 7:00 PM'
),
(
  'QuickScan Express Imaging',
  'Al Nahda Road',
  'Dubai',
  'Dubai',
  '+971-4-266-5500',
  'express@quickscan.ae',
  4.4,
  ARRAY['X-Ray Chest', 'X-Ray Spine', 'X-Ray Extremities', 'Ultrasound Abdomen', 'Ultrasound Pelvic'],
  true,
  false,
  'Daily 7:00 AM - 11:00 PM'
)
ON CONFLICT DO NOTHING;