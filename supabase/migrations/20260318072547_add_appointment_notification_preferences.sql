/*
  # Add Appointment Notification Preferences

  1. Changes
    - Add `notifications_enabled` column to appointments table
    - Default value is true (notifications enabled by default)

  2. Notes
    - This allows users to toggle notifications on/off for individual appointments
*/

-- Add notifications_enabled column to appointments table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'notifications_enabled'
  ) THEN
    ALTER TABLE appointments ADD COLUMN notifications_enabled boolean DEFAULT true;
  END IF;
END $$;
