/*
  # Add Sample Prescription Data for Testing

  1. Purpose
    - Creates sample data for prescriptions, refill requests, and pharmacies
    - This allows users to see the prescription UI with realistic data
    - Data will be created for the authenticated user when they log in

  2. Sample Data Created
    - Sample doctors with various specialties
    - Sample prescriptions with multiple medications
    - Sample refill requests in various states
    - Sample pharmacy preferences
    - Sample medication reminders

  3. Important Notes
    - This is test data only
    - Real data will be created when users actually use the system
    - The data is generic and can be used by any authenticated user
*/

-- Note: This migration creates a function that can be called to populate sample data
-- for any authenticated user. It doesn't insert data directly to avoid conflicts.

-- Function to create sample data for a user
CREATE OR REPLACE FUNCTION create_sample_prescription_data(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  patient_record_id uuid;
  doctor_record_id uuid;
  prescription_id uuid;
BEGIN
  -- Check if patient already exists
  SELECT id INTO patient_record_id FROM patients WHERE id = target_user_id;
  
  IF patient_record_id IS NULL THEN
    -- Create patient record if it doesn't exist
    INSERT INTO patients (id, date_of_birth, gender, blood_type, emirate, address)
    VALUES (
      target_user_id,
      '1990-01-01',
      'male',
      'O+',
      'Dubai',
      'Dubai Marina, Dubai, UAE'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Create a sample doctor if none exists
  SELECT id INTO doctor_record_id FROM doctors LIMIT 1;
  
  IF doctor_record_id IS NULL THEN
    -- First create a profile for the doctor
    INSERT INTO profiles (id, role, email, full_name, phone)
    VALUES (
      gen_random_uuid(),
      'doctor',
      'dr.ahmed@ceenaix.com',
      'Dr. Ahmed Al Mansouri',
      '+971 50 XXX XXXX'
    )
    ON CONFLICT (email) DO NOTHING
    RETURNING id INTO doctor_record_id;
    
    -- Then create the doctor record
    INSERT INTO doctors (
      id,
      specialty,
      sub_specialty,
      dha_license_number,
      dha_verified,
      years_of_experience,
      bio,
      languages,
      consultation_fee_clinic,
      accepts_insurance
    )
    VALUES (
      doctor_record_id,
      'Internal Medicine',
      'Cardiology',
      'DHA-' || floor(random() * 900000 + 100000)::text,
      true,
      15,
      'Experienced cardiologist specializing in preventive care',
      ARRAY['English', 'Arabic'],
      300,
      true
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Create sample prescriptions
  INSERT INTO prescriptions (patient_id, doctor_id, medications, status, valid_until)
  VALUES 
    (
      target_user_id,
      doctor_record_id,
      jsonb_build_array(
        jsonb_build_object(
          'name', 'Lisinopril',
          'dosage', '10mg',
          'frequency', 'Once daily',
          'quantity', 30,
          'refills', 3,
          'prescribed_for', 'High Blood Pressure',
          'instructions', 'Take one tablet every morning with or without food. Monitor your blood pressure regularly.'
        )
      ),
      'active',
      CURRENT_DATE + interval '6 months'
    ),
    (
      target_user_id,
      doctor_record_id,
      jsonb_build_array(
        jsonb_build_object(
          'name', 'Metformin',
          'dosage', '500mg',
          'frequency', 'Twice daily',
          'quantity', 60,
          'refills', 5,
          'prescribed_for', 'Type 2 Diabetes',
          'instructions', 'Take one tablet with breakfast and one with dinner. Take with food to reduce stomach upset.'
        )
      ),
      'active',
      CURRENT_DATE + interval '1 year'
    ),
    (
      target_user_id,
      doctor_record_id,
      jsonb_build_array(
        jsonb_build_object(
          'name', 'Atorvastatin',
          'dosage', '20mg',
          'frequency', 'Once daily at bedtime',
          'quantity', 30,
          'refills', 2,
          'prescribed_for', 'High Cholesterol',
          'instructions', 'Take one tablet at bedtime. Avoid grapefruit juice while taking this medication.'
        )
      ),
      'active',
      CURRENT_DATE + interval '6 months'
    )
  ON CONFLICT DO NOTHING
  RETURNING id INTO prescription_id;

  -- Get the first prescription ID for refill requests
  SELECT id INTO prescription_id FROM prescriptions WHERE patient_id = target_user_id LIMIT 1;

  -- Create sample refill requests
  INSERT INTO refill_requests (
    prescription_id,
    patient_id,
    doctor_id,
    pharmacy_name,
    pharmacy_address,
    pharmacy_phone,
    medication_name,
    requested_quantity,
    request_notes,
    status,
    doctor_notes,
    reviewed_at
  )
  VALUES 
    (
      prescription_id,
      target_user_id,
      doctor_record_id,
      'Dubai Pharmacy',
      'Dubai Mall, Sheikh Zayed Road, Dubai',
      '+971 4 XXX XXXX',
      'Lisinopril 10mg',
      30,
      'Running low on medication, need refill',
      'approved',
      'Approved. Patient compliance is good. Continue current dosage.',
      NOW() - interval '2 days'
    ),
    (
      prescription_id,
      target_user_id,
      doctor_record_id,
      'Life Pharmacy',
      'Ibn Battuta Mall, Dubai',
      '+971 4 YYY YYYY',
      'Metformin 500mg',
      60,
      'Need refill for next month',
      'pending',
      NULL,
      NULL
    )
  ON CONFLICT DO NOTHING;

  -- Create sample pharmacy preferences
  INSERT INTO user_pharmacies (
    user_id,
    pharmacy_name,
    pharmacy_address,
    pharmacy_phone,
    is_preferred
  )
  VALUES 
    (
      target_user_id,
      'Dubai Pharmacy',
      'Dubai Mall, Sheikh Zayed Road, Dubai',
      '+971 4 XXX XXXX',
      true
    ),
    (
      target_user_id,
      'Life Pharmacy',
      'Ibn Battuta Mall, Dubai',
      '+971 4 YYY YYYY',
      false
    ),
    (
      target_user_id,
      'Aster Pharmacy',
      'Marina Mall, Dubai Marina',
      '+971 4 ZZZ ZZZZ',
      false
    )
  ON CONFLICT DO NOTHING;

  -- Create sample medication reminders
  INSERT INTO medication_reminders (
    patient_id,
    prescription_id,
    medication_name,
    dosage,
    reminder_times,
    frequency,
    start_date,
    end_date,
    is_active,
    notification_enabled
  )
  VALUES 
    (
      target_user_id,
      prescription_id::text,
      'Lisinopril',
      '10mg',
      jsonb_build_array('09:00'),
      'Once daily',
      CURRENT_DATE,
      CURRENT_DATE + interval '6 months',
      true,
      true
    ),
    (
      target_user_id,
      prescription_id::text,
      'Metformin',
      '500mg',
      jsonb_build_array('08:00', '20:00'),
      'Twice daily',
      CURRENT_DATE,
      CURRENT_DATE + interval '1 year',
      true,
      true
    )
  ON CONFLICT DO NOTHING;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_sample_prescription_data(uuid) TO authenticated;

-- Add a helpful comment
COMMENT ON FUNCTION create_sample_prescription_data IS 'Creates sample prescription data for testing. Call with user ID: SELECT create_sample_prescription_data(auth.uid());';
