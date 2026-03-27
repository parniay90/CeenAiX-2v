/*
  # Add Sample Pharmacy and Lab Data

  ## Overview
  This migration adds sample pharmacies, labs, and test orders for demo purposes

  ## New Data
  - 3 sample pharmacies
  - 3 sample labs
  - Sample prescription orders
  - Sample lab referrals
*/

-- Insert sample pharmacies
INSERT INTO pharmacies (id, name, license_number, address, emirate, phone, email, home_delivery, open_24_hours)
VALUES 
  (gen_random_uuid(), 'LifeCare Pharmacy', 'PHR-2024-001', 'Sheikh Zayed Road, Dubai', 'Dubai', '+971-4-123-4567', 'info@lifecarepharmacy.ae', true, true),
  (gen_random_uuid(), 'MediPlus Pharmacy', 'PHR-2024-002', 'Al Wasl Road, Dubai', 'Dubai', '+971-4-234-5678', 'contact@medipluspharmacy.ae', true, false),
  (gen_random_uuid(), 'HealthFirst Pharmacy', 'PHR-2024-003', 'Khalifa Street, Abu Dhabi', 'Abu Dhabi', '+971-2-345-6789', 'hello@healthfirstpharmacy.ae', false, false)
ON CONFLICT (license_number) DO NOTHING;

-- Insert sample labs
INSERT INTO labs (id, name, license_number, address, emirate, phone, email, home_collection, rapid_results)
VALUES 
  (gen_random_uuid(), 'Dubai Medical Laboratory', 'LAB-2024-001', 'Healthcare City, Dubai', 'Dubai', '+971-4-456-7890', 'info@dubaimedlab.ae', true, true),
  (gen_random_uuid(), 'Advanced Diagnostics Center', 'LAB-2024-002', 'Jumeirah, Dubai', 'Dubai', '+971-4-567-8901', 'contact@advanceddiagnostics.ae', true, false),
  (gen_random_uuid(), 'Prime Lab Services', 'LAB-2024-003', 'Corniche Road, Abu Dhabi', 'Abu Dhabi', '+971-2-678-9012', 'hello@primelabs.ae', false, true)
ON CONFLICT (license_number) DO NOTHING;

-- Add sample prescription orders
DO $$
DECLARE
  v_pharmacy_id uuid;
  v_patient_id uuid;
  v_doctor_id uuid;
  v_prescription_id uuid;
BEGIN
  SELECT id INTO v_pharmacy_id FROM pharmacies WHERE license_number = 'PHR-2024-001' LIMIT 1;
  SELECT id INTO v_patient_id FROM patients LIMIT 1;
  SELECT id INTO v_doctor_id FROM doctors LIMIT 1;
  
  IF v_pharmacy_id IS NOT NULL AND v_patient_id IS NOT NULL THEN
    -- Create prescriptions first
    INSERT INTO prescriptions (id, patient_id, doctor_id, medications, status)
    VALUES (gen_random_uuid(), v_patient_id, v_doctor_id, 
            '[{"name": "Amoxicillin", "dosage": "500mg", "frequency": "3 times daily", "duration": "7 days", "quantity": "21"}]'::jsonb,
            'active')
    RETURNING id INTO v_prescription_id;
    
    -- Create prescription orders
    INSERT INTO prescription_orders (prescription_id, pharmacy_id, patient_id, doctor_id, medications, status, order_type, total_amount, patient_payment, patient_notes)
    VALUES 
      (v_prescription_id, v_pharmacy_id, v_patient_id, v_doctor_id,
       '[{"name": "Amoxicillin", "dosage": "500mg", "frequency": "3 times daily", "duration": "7 days", "quantity": "21"}]'::jsonb,
       'pending', 'pickup', 75.00, 75.00, 'Please prepare this urgently, need to start treatment today.');
    
    -- Create another prescription
    INSERT INTO prescriptions (id, patient_id, doctor_id, medications, status)
    VALUES (gen_random_uuid(), v_patient_id, v_doctor_id, 
            '[{"name": "Paracetamol", "dosage": "500mg", "frequency": "As needed", "duration": "5 days", "quantity": "10"}]'::jsonb,
            'active')
    RETURNING id INTO v_prescription_id;
    
    INSERT INTO prescription_orders (prescription_id, pharmacy_id, patient_id, doctor_id, medications, status, order_type, delivery_address, total_amount, patient_payment)
    VALUES 
      (v_prescription_id, v_pharmacy_id, v_patient_id, v_doctor_id,
       '[{"name": "Paracetamol", "dosage": "500mg", "frequency": "As needed", "duration": "5 days", "quantity": "10"}]'::jsonb,
       'processing', 'delivery', 'Villa 123, Palm Jumeirah, Dubai', 25.00, 25.00);
    
    -- Create third prescription
    INSERT INTO prescriptions (id, patient_id, doctor_id, medications, status)
    VALUES (gen_random_uuid(), v_patient_id, v_doctor_id, 
            '[{"name": "Ibuprofen", "dosage": "400mg", "frequency": "2 times daily", "duration": "3 days", "quantity": "6"}]'::jsonb,
            'active')
    RETURNING id INTO v_prescription_id;
    
    INSERT INTO prescription_orders (prescription_id, pharmacy_id, patient_id, doctor_id, medications, status, order_type, total_amount, patient_payment, pharmacy_notes)
    VALUES 
      (v_prescription_id, v_pharmacy_id, v_patient_id, v_doctor_id,
       '[{"name": "Ibuprofen", "dosage": "400mg", "frequency": "2 times daily", "duration": "3 days", "quantity": "6"}]'::jsonb,
       'ready', 'pickup', 30.00, 30.00, 'Order is ready for pickup at counter 2');
  END IF;
END $$;

-- Add sample lab referrals
DO $$
DECLARE
  v_lab_id uuid;
  v_patient_id uuid;
  v_doctor_id uuid;
BEGIN
  SELECT id INTO v_lab_id FROM labs WHERE license_number = 'LAB-2024-001' LIMIT 1;
  SELECT id INTO v_patient_id FROM patients LIMIT 1;
  SELECT id INTO v_doctor_id FROM doctors LIMIT 1;
  
  IF v_lab_id IS NOT NULL AND v_patient_id IS NOT NULL AND v_doctor_id IS NOT NULL THEN
    INSERT INTO lab_referrals (patient_id, doctor_id, lab_id, tests_ordered, clinical_notes, urgency, status)
    VALUES 
      (v_patient_id, v_doctor_id, v_lab_id,
       '[{"test": "Complete Blood Count (CBC)", "name": "CBC"}, {"test": "Lipid Panel", "name": "Lipid Panel"}]'::jsonb,
       'Patient complaining of fatigue and weakness. Check for anemia and cholesterol levels.',
       'routine', 'pending'),
      (v_patient_id, v_doctor_id, v_lab_id,
       '[{"test": "HbA1c", "name": "Glycated Hemoglobin"}, {"test": "Fasting Blood Sugar", "name": "FBS"}]'::jsonb,
       'Diabetes monitoring - patient on metformin. Fasting required.',
       'routine', 'in_progress'),
      (v_patient_id, v_doctor_id, v_lab_id,
       '[{"test": "Troponin", "name": "Cardiac Troponin"}, {"test": "D-Dimer", "name": "D-Dimer"}]'::jsonb,
       'Chest pain evaluation - rule out cardiac event. URGENT - process immediately.',
       'urgent', 'pending'),
      (v_patient_id, v_doctor_id, v_lab_id,
       '[{"test": "Thyroid Panel", "name": "TSH, T3, T4"}, {"test": "Vitamin D", "name": "25-OH Vitamin D"}]'::jsonb,
       'Weight gain and fatigue. Check thyroid function and vitamin D levels.',
       'routine', 'pending');
  END IF;
END $$;