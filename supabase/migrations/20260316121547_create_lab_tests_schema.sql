-- Lab Tests and Facilities Schema
-- 
-- 1. New Tables
--    - lab_facilities: Lab facility information
--    - test_types: Available test types and categories
--    - lab_test_orders: Doctor-ordered tests for patients
--    - lab_test_results: Test results with doctor interpretation
--    - lab_test_messages: Patient-doctor messaging about results
--
-- 2. Security
--    - RLS enabled on all tables
--    - Patients can view their own data
--    - Doctors can manage their patients' tests

-- Lab Facilities Table
CREATE TABLE IF NOT EXISTS lab_facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  phone text,
  email text,
  rating numeric DEFAULT 4.5,
  test_types text[] DEFAULT '{}',
  accepts_insurance boolean DEFAULT true,
  hours text DEFAULT '9:00 AM - 5:00 PM',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Test Types Table
CREATE TABLE IF NOT EXISTS test_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text,
  preparation_instructions text,
  typical_turnaround text DEFAULT '2-3 business days',
  created_at timestamptz DEFAULT now()
);

-- Lab Test Orders Table
CREATE TABLE IF NOT EXISTS lab_test_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) NOT NULL,
  doctor_id uuid REFERENCES auth.users(id),
  test_type_id uuid REFERENCES test_types(id) NOT NULL,
  lab_facility_id uuid REFERENCES lab_facilities(id),
  order_date timestamptz DEFAULT now(),
  scheduled_date timestamptz,
  status text DEFAULT 'ordered',
  priority text DEFAULT 'routine',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Lab Test Results Table
CREATE TABLE IF NOT EXISTS lab_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_order_id uuid REFERENCES lab_test_orders(id) NOT NULL,
  result_date timestamptz DEFAULT now(),
  result_data jsonb DEFAULT '{}',
  doctor_interpretation text,
  doctor_recommendations text,
  follow_up_tests text[] DEFAULT '{}',
  status text DEFAULT 'pending_review',
  attachments text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lab Test Messages Table
CREATE TABLE IF NOT EXISTS lab_test_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_result_id uuid REFERENCES lab_test_results(id) NOT NULL,
  sender_id uuid REFERENCES auth.users(id) NOT NULL,
  message text NOT NULL,
  is_doctor boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lab_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_test_messages ENABLE ROW LEVEL SECURITY;

-- Lab Facilities Policies (Public Read)
CREATE POLICY "Anyone can view lab facilities"
  ON lab_facilities FOR SELECT
  TO authenticated
  USING (true);

-- Test Types Policies (Public Read)
CREATE POLICY "Anyone can view test types"
  ON test_types FOR SELECT
  TO authenticated
  USING (true);

-- Lab Test Orders Policies
CREATE POLICY "Patients can view own test orders"
  ON lab_test_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = patient_id);

CREATE POLICY "Doctors can view their patients test orders"
  ON lab_test_orders FOR SELECT
  TO authenticated
  USING (auth.uid() = doctor_id);

CREATE POLICY "Patients can insert own test orders"
  ON lab_test_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = patient_id);

-- Lab Test Results Policies
CREATE POLICY "Patients can view own test results"
  ON lab_test_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_test_orders
      WHERE lab_test_orders.id = lab_test_results.test_order_id
      AND lab_test_orders.patient_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can view their patients test results"
  ON lab_test_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_test_orders
      WHERE lab_test_orders.id = lab_test_results.test_order_id
      AND lab_test_orders.doctor_id = auth.uid()
    )
  );

-- Lab Test Messages Policies
CREATE POLICY "Users can view messages for their test results"
  ON lab_test_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM lab_test_results
      JOIN lab_test_orders ON lab_test_orders.id = lab_test_results.test_order_id
      WHERE lab_test_results.id = lab_test_messages.test_result_id
      AND (lab_test_orders.patient_id = auth.uid() OR lab_test_orders.doctor_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages for their test results"
  ON lab_test_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM lab_test_results
      JOIN lab_test_orders ON lab_test_orders.id = lab_test_results.test_order_id
      WHERE lab_test_results.id = lab_test_messages.test_result_id
      AND (lab_test_orders.patient_id = auth.uid() OR lab_test_orders.doctor_id = auth.uid())
    )
  );