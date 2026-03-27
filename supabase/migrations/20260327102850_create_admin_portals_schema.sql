/*
  # Create Admin Portals Schema

  ## Overview
  This migration creates the necessary tables and policies for:
  1. Super Admin Portal - System-wide management
  2. Pharmacy Admin Portal - Prescription management
  3. Laboratory Admin Portal - Lab order management

  ## New Tables

  ### `pharmacy_admins`
  Links pharmacy_admin users to their pharmacies
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - The pharmacy admin user
  - `pharmacy_id` (uuid, references pharmacies) - The pharmacy they manage
  - `role` (text) - admin role level: owner, manager, staff
  - `permissions` (jsonb) - Specific permissions
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)

  ### `lab_admins`
  Links lab_admin users to their laboratory facilities
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - The lab admin user
  - `lab_id` (uuid, references labs) - The lab they manage
  - `role` (text) - admin role level: owner, manager, technician
  - `permissions` (jsonb) - Specific permissions
  - `is_active` (boolean) - Active status
  - `created_at` (timestamptz)

  ### `prescription_orders`
  Tracks prescription orders sent to pharmacies
  - `id` (uuid, primary key)
  - `prescription_id` (uuid, references prescriptions)
  - `pharmacy_id` (uuid, references pharmacies)
  - `patient_id` (uuid, references patients)
  - `doctor_id` (uuid, references doctors)
  - `medications` (jsonb) - Medication details
  - `status` (text) - pending, processing, ready, completed, cancelled
  - `order_type` (text) - pickup, delivery
  - `delivery_address` (text)
  - `patient_notes` (text)
  - `pharmacy_notes` (text)
  - `total_amount` (numeric)
  - `insurance_coverage` (numeric)
  - `patient_payment` (numeric)
  - `ordered_at` (timestamptz)
  - `ready_at` (timestamptz)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `system_settings`
  Super admin system configuration
  - `id` (uuid, primary key)
  - `setting_key` (text, unique) - Setting identifier
  - `setting_value` (jsonb) - Setting value
  - `category` (text) - Setting category
  - `description` (text) - Setting description
  - `updated_by` (uuid, references profiles)
  - `updated_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `audit_logs`
  System-wide audit trail
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles) - Who performed the action
  - `action_type` (text) - create, update, delete, login, etc.
  - `resource_type` (text) - prescription, lab_order, user, etc.
  - `resource_id` (uuid) - ID of the affected resource
  - `changes` (jsonb) - What changed
  - `ip_address` (text) - User IP
  - `user_agent` (text) - Browser/device info
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Pharmacy admins can only see their pharmacy's data
  - Lab admins can only see their lab's data
  - Super admins can see everything
*/

-- Create pharmacy_admins table
CREATE TABLE IF NOT EXISTS pharmacy_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  pharmacy_id uuid REFERENCES pharmacies(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'staff',
  permissions jsonb DEFAULT '{"manage_orders": true, "manage_inventory": false, "manage_staff": false, "view_reports": true}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, pharmacy_id)
);

ALTER TABLE pharmacy_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pharmacy admins can view own pharmacy data"
  ON pharmacy_admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- Create lab_admins table
CREATE TABLE IF NOT EXISTS lab_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lab_id uuid REFERENCES labs(id) ON DELETE CASCADE NOT NULL,
  role text NOT NULL DEFAULT 'technician',
  permissions jsonb DEFAULT '{"manage_orders": true, "upload_results": true, "manage_staff": false, "view_reports": true}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lab_id)
);

ALTER TABLE lab_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lab admins can view own lab data"
  ON lab_admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- Create prescription_orders table
CREATE TABLE IF NOT EXISTS prescription_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE NOT NULL,
  pharmacy_id uuid REFERENCES pharmacies(id) ON DELETE SET NULL,
  patient_id uuid REFERENCES patients(id) NOT NULL,
  doctor_id uuid REFERENCES doctors(id),
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'completed', 'cancelled')),
  order_type text DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery')),
  delivery_address text,
  patient_notes text,
  pharmacy_notes text,
  total_amount numeric DEFAULT 0,
  insurance_coverage numeric DEFAULT 0,
  patient_payment numeric DEFAULT 0,
  ordered_at timestamptz DEFAULT now(),
  ready_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prescription_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can view own prescription orders"
  ON prescription_orders FOR SELECT
  TO authenticated
  USING (patient_id IN (SELECT id FROM patients WHERE id = auth.uid()));

CREATE POLICY "Pharmacy admins can view their pharmacy orders"
  ON prescription_orders FOR SELECT
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT pharmacy_id FROM pharmacy_admins WHERE user_id = auth.uid() AND is_active = true
    ) OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Pharmacy admins can update their pharmacy orders"
  ON prescription_orders FOR UPDATE
  TO authenticated
  USING (
    pharmacy_id IN (
      SELECT pharmacy_id FROM pharmacy_admins WHERE user_id = auth.uid() AND is_active = true
    )
  )
  WITH CHECK (
    pharmacy_id IN (
      SELECT pharmacy_id FROM pharmacy_admins WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  category text DEFAULT 'general',
  description text,
  updated_by uuid REFERENCES profiles(id),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can manage system settings"
  ON system_settings FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  action_type text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only super admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
  ));

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_pharmacy_admins_user_id ON pharmacy_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_pharmacy_admins_pharmacy_id ON pharmacy_admins(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_lab_admins_user_id ON lab_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_admins_lab_id ON lab_admins(lab_id);
CREATE INDEX IF NOT EXISTS idx_prescription_orders_pharmacy_id ON prescription_orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_prescription_orders_status ON prescription_orders(status);
CREATE INDEX IF NOT EXISTS idx_prescription_orders_patient_id ON prescription_orders(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Update lab_referrals with pharmacy-related fields if needed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_referrals' AND column_name = 'lab_admin_notes'
  ) THEN
    ALTER TABLE lab_referrals ADD COLUMN lab_admin_notes text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_referrals' AND column_name = 'processed_by'
  ) THEN
    ALTER TABLE lab_referrals ADD COLUMN processed_by uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'lab_referrals' AND column_name = 'processed_at'
  ) THEN
    ALTER TABLE lab_referrals ADD COLUMN processed_at timestamptz;
  END IF;
END $$;

-- Add RLS policies for lab_referrals for lab admins
CREATE POLICY "Lab admins can view their lab referrals"
  ON lab_referrals FOR SELECT
  TO authenticated
  USING (
    lab_id IN (
      SELECT lab_id FROM lab_admins WHERE user_id = auth.uid() AND is_active = true
    ) OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Lab admins can update their lab referrals"
  ON lab_referrals FOR UPDATE
  TO authenticated
  USING (
    lab_id IN (
      SELECT lab_id FROM lab_admins WHERE user_id = auth.uid() AND is_active = true
    )
  )
  WITH CHECK (
    lab_id IN (
      SELECT lab_id FROM lab_admins WHERE user_id = auth.uid() AND is_active = true
    )
  );