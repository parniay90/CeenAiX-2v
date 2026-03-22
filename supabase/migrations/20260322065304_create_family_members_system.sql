/*
  # Family Members Management System

  ## Overview
  This migration creates a comprehensive system for managing family members and their relationships,
  allowing patients to add family members and doctors to access their medical histories.

  ## New Tables
  
  ### `family_members`
  Stores information about family members linked to patient accounts
  - `id` (uuid, primary key) - Unique identifier
  - `patient_id` (uuid, foreign key) - References the main patient who added this family member
  - `first_name` (text) - Family member's first name
  - `last_name` (text) - Family member's last name
  - `date_of_birth` (date) - Date of birth
  - `gender` (text) - Gender (male/female/other)
  - `relationship` (text) - Relationship to patient (spouse/child/parent/sibling/other)
  - `blood_type` (text, optional) - Blood type
  - `phone` (text, optional) - Contact phone number
  - `email` (text, optional) - Email address
  - `profile_image_url` (text, optional) - Profile image URL
  - `medical_notes` (text, optional) - General medical notes
  - `allergies` (text[], optional) - List of allergies
  - `chronic_conditions` (text[], optional) - List of chronic conditions
  - `current_medications` (text[], optional) - Current medications
  - `emergency_contact` (boolean) - Whether this person is an emergency contact
  - `created_at` (timestamptz) - When the record was created
  - `updated_at` (timestamptz) - When the record was last updated

  ### `family_member_appointments`
  Links appointments to family members
  - `id` (uuid, primary key) - Unique identifier
  - `family_member_id` (uuid, foreign key) - References family_members
  - `appointment_id` (uuid, foreign key) - References appointments
  - `created_at` (timestamptz) - When the link was created

  ### `family_member_prescriptions`
  Stores prescriptions for family members
  - `id` (uuid, primary key) - Unique identifier
  - `family_member_id` (uuid, foreign key) - References family_members
  - `medication_name` (text) - Name of medication
  - `dosage` (text) - Dosage information
  - `frequency` (text) - How often to take
  - `prescribed_by` (uuid, foreign key) - Doctor who prescribed
  - `prescribed_date` (date) - When it was prescribed
  - `duration_days` (integer) - Duration in days
  - `instructions` (text, optional) - Special instructions
  - `active` (boolean) - Whether prescription is active
  - `created_at` (timestamptz) - When created

  ### `family_member_lab_results`
  Lab results for family members
  - `id` (uuid, primary key) - Unique identifier
  - `family_member_id` (uuid, foreign key) - References family_members
  - `test_name` (text) - Name of the test
  - `test_date` (date) - When test was performed
  - `result` (text) - Test result
  - `status` (text) - Status (normal/abnormal/pending)
  - `ordered_by` (uuid, foreign key) - Doctor who ordered
  - `notes` (text, optional) - Additional notes
  - `created_at` (timestamptz) - When created

  ## Security
  - RLS enabled on all tables
  - Patients can manage their own family members
  - Doctors can view family members of their patients
  - Family medical history accessible to treating doctors
*/

-- Create family_members table
CREATE TABLE IF NOT EXISTS family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  relationship text NOT NULL CHECK (relationship IN ('spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other')),
  blood_type text CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  phone text,
  email text,
  profile_image_url text,
  medical_notes text,
  allergies text[] DEFAULT '{}',
  chronic_conditions text[] DEFAULT '{}',
  current_medications text[] DEFAULT '{}',
  emergency_contact boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create family_member_appointments table
CREATE TABLE IF NOT EXISTS family_member_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id uuid NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  appointment_id uuid NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(family_member_id, appointment_id)
);

-- Create family_member_prescriptions table
CREATE TABLE IF NOT EXISTS family_member_prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id uuid NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  medication_name text NOT NULL,
  dosage text NOT NULL,
  frequency text NOT NULL,
  prescribed_by uuid REFERENCES auth.users(id),
  prescribed_date date NOT NULL DEFAULT CURRENT_DATE,
  duration_days integer NOT NULL,
  instructions text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create family_member_lab_results table
CREATE TABLE IF NOT EXISTS family_member_lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_member_id uuid NOT NULL REFERENCES family_members(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_date date NOT NULL,
  result text NOT NULL,
  status text NOT NULL CHECK (status IN ('normal', 'abnormal', 'pending', 'critical')),
  ordered_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_family_members_patient_id ON family_members(patient_id);
CREATE INDEX IF NOT EXISTS idx_family_member_appointments_family_member ON family_member_appointments(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_member_prescriptions_family_member ON family_member_prescriptions(family_member_id);
CREATE INDEX IF NOT EXISTS idx_family_member_lab_results_family_member ON family_member_lab_results(family_member_id);

-- Enable RLS
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_member_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_member_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_member_lab_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for family_members

-- Patients can view their own family members
CREATE POLICY "Patients can view own family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

-- Patients can insert their own family members
CREATE POLICY "Patients can add family members"
  ON family_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own family members
CREATE POLICY "Patients can update own family members"
  ON family_members FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Patients can delete their own family members
CREATE POLICY "Patients can delete own family members"
  ON family_members FOR DELETE
  TO authenticated
  USING (auth.uid() = patient_id);

-- Doctors can view family members of their patients
CREATE POLICY "Doctors can view patient family members"
  ON family_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE (a.patient_id = family_members.patient_id OR 
             EXISTS (
               SELECT 1 FROM family_member_appointments fma
               WHERE fma.family_member_id = family_members.id
               AND fma.appointment_id = a.id
             ))
      AND a.doctor_id = auth.uid()
    )
  );

-- RLS Policies for family_member_appointments

-- Patients can view appointments for their family members
CREATE POLICY "Patients can view family member appointments"
  ON family_member_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.id = family_member_appointments.family_member_id
      AND fm.patient_id = auth.uid()
    )
  );

-- Patients can create appointments for their family members
CREATE POLICY "Patients can create family member appointments"
  ON family_member_appointments FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.id = family_member_appointments.family_member_id
      AND fm.patient_id = auth.uid()
    )
  );

-- Doctors can view appointments they're involved in
CREATE POLICY "Doctors can view related family appointments"
  ON family_member_appointments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = family_member_appointments.appointment_id
      AND a.doctor_id = auth.uid()
    )
  );

-- RLS Policies for family_member_prescriptions

-- Patients can view prescriptions for their family members
CREATE POLICY "Patients can view family member prescriptions"
  ON family_member_prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.id = family_member_prescriptions.family_member_id
      AND fm.patient_id = auth.uid()
    )
  );

-- Doctors can view prescriptions they prescribed
CREATE POLICY "Doctors can view prescribed family prescriptions"
  ON family_member_prescriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = prescribed_by);

-- Doctors can insert prescriptions for family members
CREATE POLICY "Doctors can create family member prescriptions"
  ON family_member_prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = prescribed_by);

-- Doctors can view prescriptions for their patients' family members
CREATE POLICY "Doctors can view patient family prescriptions"
  ON family_member_prescriptions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      JOIN appointments a ON a.patient_id = fm.patient_id
      WHERE fm.id = family_member_prescriptions.family_member_id
      AND a.doctor_id = auth.uid()
    )
  );

-- RLS Policies for family_member_lab_results

-- Patients can view lab results for their family members
CREATE POLICY "Patients can view family member lab results"
  ON family_member_lab_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      WHERE fm.id = family_member_lab_results.family_member_id
      AND fm.patient_id = auth.uid()
    )
  );

-- Doctors can view lab results they ordered
CREATE POLICY "Doctors can view ordered family lab results"
  ON family_member_lab_results FOR SELECT
  TO authenticated
  USING (auth.uid() = ordered_by);

-- Doctors can insert lab results for family members
CREATE POLICY "Doctors can create family member lab results"
  ON family_member_lab_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = ordered_by);

-- Doctors can view lab results for their patients' family members
CREATE POLICY "Doctors can view patient family lab results"
  ON family_member_lab_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM family_members fm
      JOIN appointments a ON a.patient_id = fm.patient_id
      WHERE fm.id = family_member_lab_results.family_member_id
      AND a.doctor_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_family_member_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_family_members_updated_at
  BEFORE UPDATE ON family_members
  FOR EACH ROW
  EXECUTE FUNCTION update_family_member_updated_at();