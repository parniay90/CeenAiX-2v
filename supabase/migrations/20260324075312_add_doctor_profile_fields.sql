/*
  # Add Doctor Profile Fields

  1. Changes
    - Add medical_school to doctors table
    - Add graduation_year to doctors table
    - Add insurance_providers array to doctors table
    - Add profile_image_url to profiles table for both doctors and patients

  2. Notes
    - These fields will be editable by doctors in their profile settings
*/

-- Add fields to doctors table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'medical_school'
  ) THEN
    ALTER TABLE doctors ADD COLUMN medical_school text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'graduation_year'
  ) THEN
    ALTER TABLE doctors ADD COLUMN graduation_year integer;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'doctors' AND column_name = 'insurance_providers'
  ) THEN
    ALTER TABLE doctors ADD COLUMN insurance_providers text[];
  END IF;
END $$;

-- Add profile_image_url to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'profile_image_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN profile_image_url text;
  END IF;
END $$;
