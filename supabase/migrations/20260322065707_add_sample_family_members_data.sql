/*
  # Add Sample Family Members Data

  ## Overview
  Adds sample family member data for demonstration purposes to showcase the family member 
  management features in both patient and doctor portals.

  ## Changes
  1. Sample Family Members
    - Adds family members for the test patient account
    - Includes complete medical information (allergies, conditions, medications)
    - Demonstrates different relationships (spouse, child, parent)

  2. Sample Prescriptions for Family Members
    - Adds sample prescriptions for family members
    - Shows both active and inactive prescriptions

  3. Sample Lab Results for Family Members
    - Adds sample lab results with different statuses
    - Demonstrates normal, abnormal, and pending results

  ## Notes
  - Uses existing patient account (patient.test@ceenaix.com)
  - All data is for demonstration purposes only
*/

-- Add sample family members for the test patient
INSERT INTO family_members (
  patient_id,
  first_name,
  last_name,
  date_of_birth,
  gender,
  relationship,
  blood_type,
  phone,
  email,
  medical_notes,
  allergies,
  chronic_conditions,
  current_medications,
  emergency_contact
) VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Ahmad',
    'Yazdkhasti',
    '1985-06-15',
    'male',
    'spouse',
    'A+',
    '+971 50 123 4567',
    'ahmad.yazdkhasti@example.com',
    'Generally healthy, exercises regularly. Occasional back pain from desk work.',
    ARRAY['Shellfish'],
    ARRAY['Mild Asthma'],
    ARRAY['Albuterol Inhaler (as needed)'],
    true
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Sara',
    'Yazdkhasti',
    '2015-03-20',
    'female',
    'child',
    'O+',
    '',
    '',
    'Healthy and active child. Up to date on all vaccinations. Plays soccer twice a week.',
    ARRAY['Peanuts', 'Tree nuts'],
    ARRAY[]::text[],
    ARRAY[]::text[],
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Reza',
    'Yazdkhasti',
    '2018-11-08',
    'male',
    'child',
    'O+',
    '',
    '',
    'Energetic and playful. Recent check-up shows excellent growth and development.',
    ARRAY[]::text[],
    ARRAY[]::text[],
    ARRAY[]::text[],
    false
  ),
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Maryam',
    'Hosseini',
    '1958-09-12',
    'female',
    'parent',
    'B+',
    '+971 55 987 6543',
    'maryam.hosseini@example.com',
    'History of osteoporosis. Regular bone density monitoring recommended.',
    ARRAY['Latex'],
    ARRAY['Osteoporosis', 'Type 2 Diabetes'],
    ARRAY['Calcium + Vitamin D', 'Metformin 1000mg'],
    true
  );

-- Get the family member IDs for adding prescriptions and lab results
DO $$
DECLARE
  ahmad_id uuid;
  sara_id uuid;
  maryam_id uuid;
  doctor_id uuid;
BEGIN
  -- Get family member IDs
  SELECT id INTO ahmad_id FROM family_members WHERE first_name = 'Ahmad' AND last_name = 'Yazdkhasti';
  SELECT id INTO sara_id FROM family_members WHERE first_name = 'Sara' AND last_name = 'Yazdkhasti';
  SELECT id INTO maryam_id FROM family_members WHERE first_name = 'Maryam' AND last_name = 'Hosseini';
  
  -- Use the doctor account if available, otherwise use NULL
  SELECT id INTO doctor_id FROM auth.users WHERE email = 'doctor.test@ceenaix.com';

  -- Add prescriptions for Ahmad
  IF ahmad_id IS NOT NULL THEN
    INSERT INTO family_member_prescriptions (
      family_member_id,
      medication_name,
      dosage,
      frequency,
      prescribed_by,
      prescribed_date,
      duration_days,
      instructions,
      active
    ) VALUES
      (
        ahmad_id,
        'Albuterol Inhaler',
        '90 mcg',
        'As needed (up to 4 times daily)',
        doctor_id,
        '2026-01-15',
        180,
        'Use when experiencing shortness of breath or wheezing. Shake well before use.',
        true
      );
  END IF;

  -- Add prescriptions for Maryam
  IF maryam_id IS NOT NULL THEN
    INSERT INTO family_member_prescriptions (
      family_member_id,
      medication_name,
      dosage,
      frequency,
      prescribed_by,
      prescribed_date,
      duration_days,
      instructions,
      active
    ) VALUES
      (
        maryam_id,
        'Metformin',
        '1000mg',
        'Twice daily',
        doctor_id,
        '2026-02-01',
        90,
        'Take with meals to reduce stomach upset. Monitor blood sugar regularly.',
        true
      ),
      (
        maryam_id,
        'Calcium + Vitamin D',
        '600mg/400IU',
        'Once daily',
        doctor_id,
        '2026-02-01',
        90,
        'Take with food for better absorption. Important for bone health.',
        true
      ),
      (
        maryam_id,
        'Alendronate',
        '70mg',
        'Once weekly',
        doctor_id,
        '2025-12-10',
        84,
        'Take on empty stomach first thing in morning. Stay upright for 30 minutes after taking.',
        false
      );
  END IF;

  -- Add lab results for Ahmad
  IF ahmad_id IS NOT NULL THEN
    INSERT INTO family_member_lab_results (
      family_member_id,
      test_name,
      test_date,
      result,
      status,
      ordered_by,
      notes
    ) VALUES
      (
        ahmad_id,
        'Pulmonary Function Test',
        '2026-02-20',
        'FEV1: 88% predicted',
        'normal',
        doctor_id,
        'Mild obstruction consistent with controlled asthma. Continue current medication.'
      ),
      (
        ahmad_id,
        'Complete Blood Count',
        '2026-02-20',
        'All values within normal range',
        'normal',
        doctor_id,
        'No concerns. Routine monitoring.'
      );
  END IF;

  -- Add lab results for Sara
  IF sara_id IS NOT NULL THEN
    INSERT INTO family_member_lab_results (
      family_member_id,
      test_name,
      test_date,
      result,
      status,
      ordered_by,
      notes
    ) VALUES
      (
        sara_id,
        'Allergy Panel - Food',
        '2026-01-10',
        'Positive for peanuts and tree nuts',
        'abnormal',
        doctor_id,
        'Confirmed severe peanut and tree nut allergy. Prescribed EpiPen. Avoid all nut products.'
      ),
      (
        sara_id,
        'Annual Physical - Growth Assessment',
        '2026-03-01',
        'Height: 145cm (75th percentile), Weight: 38kg (70th percentile)',
        'normal',
        doctor_id,
        'Excellent growth and development. Age-appropriate milestones met.'
      );
  END IF;

  -- Add lab results for Maryam
  IF maryam_id IS NOT NULL THEN
    INSERT INTO family_member_lab_results (
      family_member_id,
      test_name,
      test_date,
      result,
      status,
      ordered_by,
      notes
    ) VALUES
      (
        maryam_id,
        'HbA1c',
        '2026-03-05',
        '6.9%',
        'normal',
        doctor_id,
        'Well-controlled diabetes. Continue current medication and diet plan.'
      ),
      (
        maryam_id,
        'Bone Density Scan (DEXA)',
        '2026-02-15',
        'T-score: -2.2 (lumbar spine)',
        'abnormal',
        doctor_id,
        'Osteoporosis confirmed. Started on weekly bisphosphonate. Recommend calcium and vitamin D supplementation.'
      ),
      (
        maryam_id,
        'Lipid Panel',
        '2026-03-05',
        'Total Cholesterol: 195 mg/dL, LDL: 118 mg/dL, HDL: 58 mg/dL',
        'normal',
        doctor_id,
        'Cholesterol levels are within normal range. Continue healthy diet and exercise.'
      ),
      (
        maryam_id,
        'Comprehensive Metabolic Panel',
        '2026-03-10',
        'Pending',
        'pending',
        doctor_id,
        'Results expected within 24-48 hours.'
      );
  END IF;
END $$;