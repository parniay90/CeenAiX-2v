/*
  # CeenAiX Healthcare Platform - Core Schema

  ## Overview
  Complete database schema for CeenAiX multi-portal healthcare platform supporting
  patients, doctors, clinics, pharmacies, labs, and insurance providers.

  ## New Tables

  ### 1. profiles - User profiles with role-based access
  ### 2. patients - Patient-specific data
  ### 3. doctors - Doctor profiles and credentials
  ### 4. clinics - Healthcare facilities
  ### 5. doctor_clinic_affiliations - Doctor-clinic relationships
  ### 6. pharmacies - Pharmacy locations
  ### 7. labs - Laboratory facilities
  ### 8. insurance_providers - Insurance companies
  ### 9. appointments - Medical appointments
  ### 10. health_records - Patient medical history
  ### 11. prescriptions - Electronic prescriptions
  ### 12. lab_referrals - Lab test orders
  ### 13. lab_test_catalog - Available lab tests
  ### 14. pharmacy_catalog - Available medications
  ### 15. insurance_claims - Insurance claim submissions

  ## Security
  - RLS enabled on all tables
  - Role-based access control
  - Patients access own data only
  - Doctors access their patients' data
  - Public can view provider listings
*/

-- Create enum type for user roles
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'clinic_admin', 'pharmacy_admin', 'lab_admin', 'insurance_admin', 'super_admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  language_preference text DEFAULT 'en',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. Patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  date_of_birth date,
  gender text,
  emirates_id text UNIQUE,
  address text,
  emirate text,
  emergency_contact_name text,
  emergency_contact_phone text,
  blood_type text,
  insurance_provider_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- 3. Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  specialty text NOT NULL,
  sub_specialty text,
  dha_license_number text UNIQUE,
  dha_verified boolean DEFAULT false,
  years_of_experience integer DEFAULT 0,
  bio text,
  languages text[] DEFAULT ARRAY['English'],
  consultation_fee_clinic decimal(10,2),
  consultation_fee_tele decimal(10,2),
  accepts_insurance boolean DEFAULT false,
  available_for_tele boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;

-- 4. Clinics table
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  dha_license_number text UNIQUE,
  address text,
  emirate text,
  phone text,
  email text,
  opening_hours jsonb,
  specialties text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;

-- 5. Doctor-Clinic Affiliations
CREATE TABLE IF NOT EXISTS doctor_clinic_affiliations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid REFERENCES clinics(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(doctor_id, clinic_id)
);

ALTER TABLE doctor_clinic_affiliations ENABLE ROW LEVEL SECURITY;

-- 6. Pharmacies table
CREATE TABLE IF NOT EXISTS pharmacies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  license_number text UNIQUE,
  address text,
  emirate text,
  phone text,
  email text,
  opening_hours jsonb,
  home_delivery boolean DEFAULT false,
  open_24_hours boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;

-- 7. Labs table
CREATE TABLE IF NOT EXISTS labs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  license_number text UNIQUE,
  address text,
  emirate text,
  phone text,
  email text,
  home_collection boolean DEFAULT false,
  rapid_results boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE labs ENABLE ROW LEVEL SECURITY;

-- 8. Insurance Providers table
CREATE TABLE IF NOT EXISTS insurance_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  contact_email text,
  contact_phone text,
  plan_types text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insurance_providers ENABLE ROW LEVEL SECURITY;

-- 9. Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'scheduled',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 10. Health Records table
CREATE TABLE IF NOT EXISTS health_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  record_type text NOT NULL,
  title text NOT NULL,
  description text,
  recorded_date date NOT NULL,
  provider_name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- 11. Prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE SET NULL,
  medications jsonb NOT NULL,
  status text DEFAULT 'active',
  valid_until date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- 12. Lab Referrals table
CREATE TABLE IF NOT EXISTS lab_referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  tests_ordered jsonb NOT NULL,
  clinical_notes text,
  urgency text DEFAULT 'routine',
  status text DEFAULT 'pending',
  result_uploaded_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_referrals ENABLE ROW LEVEL SECURITY;

-- 13. Lab Test Catalog table
CREATE TABLE IF NOT EXISTS lab_test_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  category text,
  price decimal(10,2),
  turnaround_hours integer,
  fasting_required boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lab_test_catalog ENABLE ROW LEVEL SECURITY;

-- 14. Pharmacy Catalog table
CREATE TABLE IF NOT EXISTS pharmacy_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid REFERENCES pharmacies(id) ON DELETE CASCADE,
  drug_name text NOT NULL,
  category text,
  price decimal(10,2),
  stock_status text DEFAULT 'in_stock',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pharmacy_catalog ENABLE ROW LEVEL SECURITY;

-- 15. Insurance Claims table
CREATE TABLE IF NOT EXISTS insurance_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  insurance_provider_id uuid REFERENCES insurance_providers(id) ON DELETE CASCADE,
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_id uuid REFERENCES appointments(id) ON DELETE CASCADE,
  claim_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'pending',
  rejection_reason text,
  submitted_at timestamptz DEFAULT now(),
  processed_at timestamptz
);

ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Patients can view own data"
  ON patients FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Patients can update own data"
  ON patients FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for doctors
CREATE POLICY "Doctors can view own profile"
  ON doctors FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Doctors can update own profile"
  ON doctors FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public can view verified doctors"
  ON doctors FOR SELECT
  TO anon, authenticated
  USING (dha_verified = true);

-- RLS Policies for clinics
CREATE POLICY "Public can view clinics"
  ON clinics FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for doctor-clinic affiliations
CREATE POLICY "Public can view active affiliations"
  ON doctor_clinic_affiliations FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for pharmacies
CREATE POLICY "Public can view pharmacies"
  ON pharmacies FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for labs
CREATE POLICY "Public can view labs"
  ON labs FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for insurance providers
CREATE POLICY "Public can view insurance providers"
  ON insurance_providers FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for appointments
CREATE POLICY "Patients can view own appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their appointments"
  ON appointments FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  TO authenticated
  WITH CHECK (patient_id = auth.uid());

-- RLS Policies for health records
CREATE POLICY "Patients can view own health records"
  ON health_records FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

-- RLS Policies for prescriptions
CREATE POLICY "Patients can view own prescriptions"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view prescriptions they wrote"
  ON prescriptions FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create prescriptions"
  ON prescriptions FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for lab referrals
CREATE POLICY "Patients can view own lab referrals"
  ON lab_referrals FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

CREATE POLICY "Doctors can view their lab referrals"
  ON lab_referrals FOR SELECT
  TO authenticated
  USING (doctor_id = auth.uid());

CREATE POLICY "Doctors can create lab referrals"
  ON lab_referrals FOR INSERT
  TO authenticated
  WITH CHECK (doctor_id = auth.uid());

-- RLS Policies for lab test catalog
CREATE POLICY "Public can view active lab tests"
  ON lab_test_catalog FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for pharmacy catalog
CREATE POLICY "Public can view active pharmacy items"
  ON pharmacy_catalog FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for insurance claims
CREATE POLICY "Patients can view own claims"
  ON insurance_claims FOR SELECT
  TO authenticated
  USING (patient_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_health_records_patient ON health_records(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_referrals_patient ON lab_referrals(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);
CREATE INDEX IF NOT EXISTS idx_clinics_emirate ON clinics(emirate);