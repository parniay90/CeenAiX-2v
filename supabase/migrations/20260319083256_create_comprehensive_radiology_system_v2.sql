/*
  # Comprehensive Radiology System with Patient Test Results

  1. New Tables
    - `radiology_categories` - Different types of imaging modalities
    - `radiology_studies` - Individual imaging studies with detailed reports
    - `radiology_findings` - Specific findings within each study
    - `radiology_images` - Links to actual medical images

  2. Changes
    - Extends existing radiology schema with detailed clinical data
    - Adds comprehensive reporting structure
    - Includes image categorization and analysis

  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - All authenticated users can view radiology data
*/

-- Create radiology categories table
CREATE TABLE IF NOT EXISTS radiology_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radiology_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view radiology categories"
  ON radiology_categories FOR SELECT
  TO authenticated
  USING (true);

-- Create comprehensive radiology studies table
CREATE TABLE IF NOT EXISTS radiology_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id),
  category_id uuid REFERENCES radiology_categories(id),
  study_type text NOT NULL,
  body_part text NOT NULL,
  laterality text,
  clinical_indication text NOT NULL,
  technique text,
  findings text NOT NULL,
  impression text NOT NULL,
  recommendations text,
  urgency text DEFAULT 'Routine' CHECK (urgency IN ('Routine', 'Urgent', 'Stat')),
  status text DEFAULT 'Completed' CHECK (status IN ('Scheduled', 'In Progress', 'Completed', 'Reviewed', 'Amended')),
  study_date timestamptz DEFAULT now(),
  report_date timestamptz DEFAULT now(),
  radiologist_name text,
  accession_number text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE radiology_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view radiology studies"
  ON radiology_studies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create radiology studies"
  ON radiology_studies FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update radiology studies"
  ON radiology_studies FOR UPDATE
  TO authenticated
  USING (true);

-- Create radiology findings table for detailed observations
CREATE TABLE IF NOT EXISTS radiology_findings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id uuid REFERENCES radiology_studies(id) ON DELETE CASCADE,
  finding_type text NOT NULL,
  description text NOT NULL,
  severity text CHECK (severity IN ('Normal', 'Mild', 'Moderate', 'Severe', 'Critical')),
  location text,
  measurements text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radiology_findings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view radiology findings"
  ON radiology_findings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create radiology findings"
  ON radiology_findings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create radiology images table
CREATE TABLE IF NOT EXISTS radiology_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  study_id uuid REFERENCES radiology_studies(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  image_type text NOT NULL,
  view_position text,
  series_number integer,
  instance_number integer,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE radiology_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view radiology images"
  ON radiology_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create radiology images"
  ON radiology_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert radiology categories
INSERT INTO radiology_categories (name, description, icon, color) VALUES
  ('X-Ray', 'Conventional radiography using X-rays to visualize bones and soft tissues', '🦴', '#06B6D4'),
  ('CT Scan', 'Computed Tomography - Cross-sectional imaging using X-rays', '💿', '#3B82F6'),
  ('MRI', 'Magnetic Resonance Imaging - Detailed soft tissue imaging using magnetic fields', '🧲', '#8B5CF6'),
  ('Ultrasound', 'Real-time imaging using high-frequency sound waves', '🔊', '#10B981'),
  ('Bone Scan', 'Nuclear medicine imaging to detect bone abnormalities', '☢️', '#F59E0B'),
  ('Mammography', 'Specialized breast imaging for cancer screening', '🎀', '#EC4899')
ON CONFLICT DO NOTHING;
