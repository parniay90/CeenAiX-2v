-- Radiology and Imaging Services Schema
-- 
-- 1. New Tables
--    - radiology_centers: Imaging centers and radiology facilities
--    - imaging_modalities: Types of imaging services offered
--    - radiology_appointments: Patient imaging appointments
--    - radiology_results: Imaging results with doctor reports
--    - radiology_images: Storage references for imaging files
--
-- 2. Security
--    - RLS enabled on all tables
--    - Patients can view their own appointments and results
--    - Doctors can view and manage their patients imaging data

-- Imaging Modalities Table
CREATE TABLE IF NOT EXISTS imaging_modalities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  preparation_instructions text,
  duration text DEFAULT '30-60 minutes',
  contrast_available boolean DEFAULT false,
  typical_cost_range text,
  created_at timestamptz DEFAULT now()
);

-- Radiology Centers Table
CREATE TABLE IF NOT EXISTS radiology_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  phone text,
  email text,
  rating numeric DEFAULT 4.5,
  modalities_available text[] DEFAULT '{}',
  accepts_insurance boolean DEFAULT true,
  emergency_services boolean DEFAULT false,
  hours text DEFAULT 'Mon-Sat 8:00 AM - 8:00 PM',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Radiology Appointments Table
CREATE TABLE IF NOT EXISTS radiology_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) NOT NULL,
  doctor_id uuid REFERENCES auth.users(id),
  radiology_center_id uuid REFERENCES radiology_centers(id),
  modality_id uuid REFERENCES imaging_modalities(id) NOT NULL,
  appointment_date timestamptz NOT NULL,
  status text DEFAULT 'scheduled',
  body_part text,
  with_contrast boolean DEFAULT false,
  urgency text DEFAULT 'routine',
  referring_doctor_notes text,
  patient_preparation_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Radiology Results Table
CREATE TABLE IF NOT EXISTS radiology_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES radiology_appointments(id) NOT NULL,
  result_date timestamptz DEFAULT now(),
  findings text,
  impression text,
  radiologist_name text,
  radiologist_notes text,
  follow_up_recommended boolean DEFAULT false,
  follow_up_instructions text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Radiology Images Storage References
CREATE TABLE IF NOT EXISTS radiology_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  result_id uuid REFERENCES radiology_results(id) NOT NULL,
  image_type text NOT NULL,
  storage_path text NOT NULL,
  file_size bigint,
  image_notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE imaging_modalities ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiology_images ENABLE ROW LEVEL SECURITY;

-- Imaging Modalities Policies (Public Read)
CREATE POLICY "Anyone can view imaging modalities"
  ON imaging_modalities FOR SELECT
  TO authenticated
  USING (true);

-- Radiology Centers Policies (Public Read)
CREATE POLICY "Anyone can view radiology centers"
  ON radiology_centers FOR SELECT
  TO authenticated
  USING (true);

-- Radiology Appointments Policies
CREATE POLICY "Patients can view own radiology appointments"
  ON radiology_appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their patients radiology appointments"
  ON radiology_appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can insert own radiology appointments"
  ON radiology_appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own radiology appointments"
  ON radiology_appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Radiology Results Policies
CREATE POLICY "Patients can view own radiology results"
  ON radiology_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM radiology_appointments
      WHERE radiology_appointments.id = radiology_results.appointment_id
      AND radiology_appointments.patient_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their patients radiology results"
  ON radiology_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM radiology_appointments
      WHERE radiology_appointments.id = radiology_results.appointment_id
      AND radiology_appointments.doctor_id = auth.uid()
    )
  );

-- Radiology Images Policies
CREATE POLICY "Users can view images for their results"
  ON radiology_images FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM radiology_results
      JOIN radiology_appointments ON radiology_appointments.id = radiology_results.appointment_id
      WHERE radiology_results.id = radiology_images.result_id
      AND (radiology_appointments.patient_id = auth.uid() OR radiology_appointments.doctor_id = auth.uid())
    )
  );