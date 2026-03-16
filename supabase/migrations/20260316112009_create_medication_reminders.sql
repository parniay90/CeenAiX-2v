/*
  # Create Medication Reminders System

  1. New Tables
    - `medication_reminders`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, references patients)
      - `prescription_id` (uuid, references prescriptions)
      - `medication_name` (text)
      - `dosage` (text)
      - `reminder_times` (jsonb array of time strings)
      - `frequency` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `is_active` (boolean)
      - `notification_enabled` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `medication_reminders` table
    - Add policies for authenticated patients to manage their own reminders
*/

CREATE TABLE IF NOT EXISTS medication_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  prescription_id text NOT NULL,
  medication_name text NOT NULL,
  dosage text NOT NULL,
  reminder_times jsonb DEFAULT '[]'::jsonb NOT NULL,
  frequency text NOT NULL,
  start_date date DEFAULT CURRENT_DATE NOT NULL,
  end_date date,
  is_active boolean DEFAULT true NOT NULL,
  notification_enabled boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE medication_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own medication reminders"
  ON medication_reminders
  FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Patients can insert own medication reminders"
  ON medication_reminders
  FOR INSERT
  TO authenticated
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Patients can update own medication reminders"
  ON medication_reminders
  FOR UPDATE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()))
  WITH CHECK (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Patients can delete own medication reminders"
  ON medication_reminders
  FOR DELETE
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_medication_reminders_patient_id ON medication_reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_medication_reminders_is_active ON medication_reminders(is_active);