/*
  # Prescription Refill Requests and Pharmacy Preferences

  1. New Tables
    - `refill_requests`
      - `id` (uuid, primary key)
      - `prescription_id` (uuid, references prescriptions)
      - `patient_id` (uuid, references patients)
      - `doctor_id` (uuid, references doctors)
      - `pharmacy_name` (text)
      - `pharmacy_address` (text)
      - `pharmacy_phone` (text)
      - `medication_name` (text) - denormalized for quick access
      - `requested_quantity` (integer)
      - `request_notes` (text)
      - `status` (text: pending, approved, denied, fulfilled)
      - `doctor_notes` (text)
      - `reviewed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_pharmacies`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `pharmacy_name` (text)
      - `pharmacy_address` (text)
      - `pharmacy_phone` (text)
      - `is_preferred` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Patients can view and create their own refill requests
    - Doctors can view and approve/deny refill requests for their prescriptions
    - Users can manage their own pharmacy preferences

  3. Indexes
    - Add indexes for frequently queried columns
*/

-- Create refill_requests table
CREATE TABLE IF NOT EXISTS refill_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  pharmacy_name text NOT NULL,
  pharmacy_address text NOT NULL,
  pharmacy_phone text,
  medication_name text NOT NULL,
  requested_quantity integer NOT NULL,
  request_notes text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'fulfilled')),
  doctor_notes text,
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_pharmacies table
CREATE TABLE IF NOT EXISTS user_pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  pharmacy_name text NOT NULL,
  pharmacy_address text NOT NULL,
  pharmacy_phone text,
  is_preferred boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE refill_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pharmacies ENABLE ROW LEVEL SECURITY;

-- Refill requests policies
CREATE POLICY "Patients can view own refill requests"
  ON refill_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view refill requests for their prescriptions"
  ON refill_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can create refill requests"
  ON refill_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can update refill request status"
  ON refill_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = doctor_id)
  WITH CHECK (auth.uid() = doctor_id);

-- User pharmacies policies
CREATE POLICY "Users can view own pharmacies"
  ON user_pharmacies FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own pharmacies"
  ON user_pharmacies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pharmacies"
  ON user_pharmacies FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pharmacies"
  ON user_pharmacies FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_refill_requests_patient_id ON refill_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_doctor_id ON refill_requests(doctor_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_status ON refill_requests(status);
CREATE INDEX IF NOT EXISTS idx_refill_requests_prescription_id ON refill_requests(prescription_id);
CREATE INDEX IF NOT EXISTS idx_user_pharmacies_user_id ON user_pharmacies(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pharmacies_preferred ON user_pharmacies(user_id, is_preferred) WHERE is_preferred = true;

-- Trigger for updated_at on refill_requests
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_refill_requests_updated_at') THEN
    CREATE TRIGGER update_refill_requests_updated_at
      BEFORE UPDATE ON refill_requests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Trigger for updated_at on user_pharmacies
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_pharmacies_updated_at') THEN
    CREATE TRIGGER update_user_pharmacies_updated_at
      BEFORE UPDATE ON user_pharmacies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;