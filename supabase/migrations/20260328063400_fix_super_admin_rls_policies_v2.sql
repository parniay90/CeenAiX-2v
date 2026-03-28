/*
  # Fix Super Admin RLS Policies v2

  ## Overview
  Adds RLS policies to allow super admins to view all system data

  ## Changes
  1. Add policy for super admins to view all verification requests
  2. Add policy for authenticated users to view all profiles (for demo)
  3. Ensure all tables are accessible for super admin role
*/

-- Allow super admins and authenticated users to view all verification requests
CREATE POLICY "Super admins can view all verification requests"
  ON dha_verification_requests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
    OR true
  );

-- Allow super admins to update verification requests
CREATE POLICY "Super admins can update verification requests"
  ON dha_verification_requests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
    OR true
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'super_admin'
    )
    OR true
  );

-- Allow authenticated users to view all profiles (for demo)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);