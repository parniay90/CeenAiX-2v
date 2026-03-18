/*
  # Add Sample Doctors with Auth Users

  1. Sample Data
    - Create auth users for doctors
    - Create profiles for doctors
    - Add doctor records with specialties
    - Add availability schedules

  2. Notes
    - Creates 6 sample doctors with different specialties
    - Each doctor has weekday availability (9 AM - 12 PM and 2 PM - 5 PM)
*/

DO $$
DECLARE
  doctor1_id uuid := gen_random_uuid();
  doctor2_id uuid := gen_random_uuid();
  doctor3_id uuid := gen_random_uuid();
  doctor4_id uuid := gen_random_uuid();
  doctor5_id uuid := gen_random_uuid();
  doctor6_id uuid := gen_random_uuid();
  weekday INTEGER;
BEGIN
  -- Insert auth users
  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
  VALUES 
    (doctor1_id, 'dr.ahmed@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Ahmed Al Mansoori"}'),
    (doctor2_id, 'dr.fatima@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Fatima Hassan"}'),
    (doctor3_id, 'dr.mohammed@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Mohammed Al Zaabi"}'),
    (doctor4_id, 'dr.sara@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Sara Abdullah"}'),
    (doctor5_id, 'dr.khalid@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Khalid Ibrahim"}'),
    (doctor6_id, 'dr.layla@ceenaix.com', crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Layla Al Nuaimi"}')
  ON CONFLICT (id) DO NOTHING;

  -- Insert profiles
  INSERT INTO profiles (id, role, email, full_name, phone, created_at)
  VALUES 
    (doctor1_id, 'doctor', 'dr.ahmed@ceenaix.com', 'Dr. Ahmed Al Mansoori', '+971-50-123-4501', now()),
    (doctor2_id, 'doctor', 'dr.fatima@ceenaix.com', 'Dr. Fatima Hassan', '+971-50-123-4502', now()),
    (doctor3_id, 'doctor', 'dr.mohammed@ceenaix.com', 'Dr. Mohammed Al Zaabi', '+971-50-123-4503', now()),
    (doctor4_id, 'doctor', 'dr.sara@ceenaix.com', 'Dr. Sara Abdullah', '+971-50-123-4504', now()),
    (doctor5_id, 'doctor', 'dr.khalid@ceenaix.com', 'Dr. Khalid Ibrahim', '+971-50-123-4505', now()),
    (doctor6_id, 'doctor', 'dr.layla@ceenaix.com', 'Dr. Layla Al Nuaimi', '+971-50-123-4506', now())
  ON CONFLICT (id) DO NOTHING;

  -- Insert doctors
  INSERT INTO doctors (id, specialty, sub_specialty, years_of_experience, consultation_fee_clinic, consultation_fee_tele, bio, accepts_insurance, available_for_tele)
  VALUES 
    (doctor1_id, 'Cardiology', 'Interventional Cardiology', 15, 350, 250, 'Specialized in heart disease prevention and treatment', true, true),
    (doctor2_id, 'Pediatrics', 'General Pediatrics', 12, 300, 200, 'Child health specialist with focus on preventive care', true, true),
    (doctor3_id, 'Orthopedics', 'Sports Medicine', 18, 400, 300, 'Expert in bone and joint disorders', true, false),
    (doctor4_id, 'Dermatology', 'Cosmetic Dermatology', 8, 250, 180, 'Skin care and aesthetic treatments', true, true),
    (doctor5_id, 'Internal Medicine', 'General Practice', 20, 300, 220, 'Primary care physician for adults', true, true),
    (doctor6_id, 'Gynecology', 'Obstetrics', 14, 350, 250, 'Women health and maternity care', true, true)
  ON CONFLICT (id) DO NOTHING;

  -- Add availability for all doctors (all days 9 AM - 12 PM and 2 PM - 5 PM)
  FOR weekday IN 0..6 LOOP
    -- Morning slots: 9 AM to 12 PM
    INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active)
    VALUES 
      (doctor1_id, weekday, '09:00:00', '12:00:00', true),
      (doctor2_id, weekday, '09:00:00', '12:00:00', true),
      (doctor3_id, weekday, '09:00:00', '12:00:00', true),
      (doctor4_id, weekday, '09:00:00', '12:00:00', true),
      (doctor5_id, weekday, '09:00:00', '12:00:00', true),
      (doctor6_id, weekday, '09:00:00', '12:00:00', true)
    ON CONFLICT DO NOTHING;
    
    -- Afternoon slots: 2 PM to 5 PM
    INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active)
    VALUES 
      (doctor1_id, weekday, '14:00:00', '17:00:00', true),
      (doctor2_id, weekday, '14:00:00', '17:00:00', true),
      (doctor3_id, weekday, '14:00:00', '17:00:00', true),
      (doctor4_id, weekday, '14:00:00', '17:00:00', true),
      (doctor5_id, weekday, '14:00:00', '17:00:00', true),
      (doctor6_id, weekday, '14:00:00', '17:00:00', true)
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
