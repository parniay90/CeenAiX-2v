/*
  # Doctor Documents and Verification System

  1. New Tables
    - `doctor_documents`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `document_type` (text) - e.g., 'medical_license', 'dha_certificate', 'degree', 'specialization_certificate'
      - `document_url` (text) - URL to the stored document
      - `file_name` (text)
      - `file_size` (integer) - in bytes
      - `upload_date` (timestamptz)
      - `status` (text) - 'pending', 'approved', 'rejected'
      - `verified_by` (uuid, nullable, references profiles)
      - `verified_at` (timestamptz, nullable)
      - `rejection_reason` (text, nullable)
      - `created_at` (timestamptz)

    - `dha_verification_requests`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `request_type` (text) - 'initial', 'renewal'
      - `license_number` (text, nullable)
      - `specialization` (text)
      - `sub_specialization` (text, nullable)
      - `years_of_experience` (integer)
      - `medical_school` (text)
      - `graduation_year` (integer)
      - `additional_notes` (text, nullable)
      - `status` (text) - 'pending', 'under_review', 'approved', 'rejected', 'requires_info'
      - `submitted_at` (timestamptz)
      - `reviewed_at` (timestamptz, nullable)
      - `reviewed_by` (uuid, nullable, references profiles)
      - `admin_notes` (text, nullable)
      - `created_at` (timestamptz)

  2. Storage
    - Create storage bucket for doctor documents
    - Set up appropriate policies

  3. Security
    - Enable RLS on both tables
    - Doctors can view and upload their own documents
    - Doctors can submit their own verification requests
    - Only admins can approve/reject
*/

-- Create doctor_documents table
CREATE TABLE IF NOT EXISTS doctor_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  document_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  upload_date timestamptz DEFAULT now() NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  rejection_reason text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create dha_verification_requests table
CREATE TABLE IF NOT EXISTS dha_verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  request_type text DEFAULT 'initial' NOT NULL CHECK (request_type IN ('initial', 'renewal')),
  license_number text,
  specialization text NOT NULL,
  sub_specialization text,
  years_of_experience integer NOT NULL,
  medical_school text NOT NULL,
  graduation_year integer NOT NULL,
  additional_notes text,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'requires_info')),
  submitted_at timestamptz DEFAULT now() NOT NULL,
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id),
  admin_notes text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE doctor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE dha_verification_requests ENABLE ROW LEVEL SECURITY;

-- Policies for doctor_documents
CREATE POLICY "Doctors can view own documents"
  ON doctor_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can insert own documents"
  ON doctor_documents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own pending documents"
  ON doctor_documents FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id AND status = 'pending')
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can delete own pending documents"
  ON doctor_documents FOR DELETE
  TO authenticated
  USING (auth.uid() = doctor_id AND status = 'pending');

-- Policies for dha_verification_requests
CREATE POLICY "Doctors can view own verification requests"
  ON dha_verification_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Doctors can submit verification requests"
  ON dha_verification_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = doctor_id);

CREATE POLICY "Doctors can update own pending requests"
  ON dha_verification_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id AND status = 'pending')
  WITH CHECK (auth.uid() = doctor_id);

-- Create storage bucket for doctor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('doctor-documents', 'doctor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for doctor documents
CREATE POLICY "Doctors can upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'doctor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Doctors can view own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'doctor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Doctors can delete own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'doctor-documents' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_doctor_documents_doctor_id ON doctor_documents(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_documents_status ON doctor_documents(status);
CREATE INDEX IF NOT EXISTS idx_dha_verification_doctor_id ON dha_verification_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_dha_verification_status ON dha_verification_requests(status);
