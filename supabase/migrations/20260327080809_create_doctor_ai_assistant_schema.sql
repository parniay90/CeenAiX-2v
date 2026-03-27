/*
  # Doctor AI Assistant Schema

  1. New Tables
    - `doctor_ai_sessions`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, references doctors)
      - `patient_id` (uuid, references patients)
      - `appointment_id` (uuid, references appointments, optional)
      - `session_type` (text) - 'consultation', 'follow_up', 'emergency'
      - `status` (text) - 'recording', 'processing', 'completed', 'cancelled'
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz, optional)
      - `duration_seconds` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_session_transcriptions`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references doctor_ai_sessions)
      - `transcript_text` (text) - Full transcription
      - `transcript_segments` (jsonb) - Timestamped segments with speaker identification
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_session_reports`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references doctor_ai_sessions)
      - `chief_complaint` (text)
      - `history_of_present_illness` (text)
      - `physical_examination` (text)
      - `assessment` (text)
      - `diagnosis_suggestions` (jsonb) - Array of suggested diagnoses with confidence scores
      - `treatment_plan` (text)
      - `follow_up_recommendations` (text)
      - `prescriptions_suggested` (jsonb)
      - `lab_tests_suggested` (jsonb)
      - `full_report` (text) - Complete formatted report
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Doctors can only access their own sessions
    - Patients can view sessions related to them (read-only)
*/

-- Create doctor_ai_sessions table
CREATE TABLE IF NOT EXISTS doctor_ai_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  session_type text NOT NULL DEFAULT 'consultation',
  status text NOT NULL DEFAULT 'recording',
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_session_transcriptions table
CREATE TABLE IF NOT EXISTS ai_session_transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES doctor_ai_sessions(id) ON DELETE CASCADE,
  transcript_text text NOT NULL DEFAULT '',
  transcript_segments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_session_reports table
CREATE TABLE IF NOT EXISTS ai_session_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES doctor_ai_sessions(id) ON DELETE CASCADE,
  chief_complaint text DEFAULT '',
  history_of_present_illness text DEFAULT '',
  physical_examination text DEFAULT '',
  assessment text DEFAULT '',
  diagnosis_suggestions jsonb DEFAULT '[]'::jsonb,
  treatment_plan text DEFAULT '',
  follow_up_recommendations text DEFAULT '',
  prescriptions_suggested jsonb DEFAULT '[]'::jsonb,
  lab_tests_suggested jsonb DEFAULT '[]'::jsonb,
  full_report text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE doctor_ai_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_session_transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_session_reports ENABLE ROW LEVEL SECURITY;

-- Policies for doctor_ai_sessions
CREATE POLICY "Doctors can view their own sessions"
  ON doctor_ai_sessions FOR SELECT
  TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Doctors can create their own sessions"
  ON doctor_ai_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their own sessions"
  ON doctor_ai_sessions FOR UPDATE
  TO authenticated
  USING (
    doctor_id IN (
      SELECT id FROM doctors WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    doctor_id IN (
      SELECT id FROM doctors WHERE id = auth.uid()
    )
  );

CREATE POLICY "Patients can view their sessions"
  ON doctor_ai_sessions FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE id = auth.uid()
    )
  );

-- Policies for ai_session_transcriptions
CREATE POLICY "Doctors can view transcriptions of their sessions"
  ON ai_session_transcriptions FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Doctors can create transcriptions for their sessions"
  ON ai_session_transcriptions FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Doctors can update transcriptions of their sessions"
  ON ai_session_transcriptions FOR UPDATE
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

-- Policies for ai_session_reports
CREATE POLICY "Doctors can view reports of their sessions"
  ON ai_session_reports FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Doctors can create reports for their sessions"
  ON ai_session_reports FOR INSERT
  TO authenticated
  WITH CHECK (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Doctors can update reports of their sessions"
  ON ai_session_reports FOR UPDATE
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  )
  WITH CHECK (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE doctor_id IN (
        SELECT id FROM doctors WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Patients can view reports of their sessions"
  ON ai_session_reports FOR SELECT
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM doctor_ai_sessions WHERE patient_id IN (
        SELECT id FROM patients WHERE id = auth.uid()
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_doctor_ai_sessions_doctor_id ON doctor_ai_sessions(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_ai_sessions_patient_id ON doctor_ai_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_ai_sessions_status ON doctor_ai_sessions(status);
CREATE INDEX IF NOT EXISTS idx_ai_session_transcriptions_session_id ON ai_session_transcriptions(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_session_reports_session_id ON ai_session_reports(session_id);