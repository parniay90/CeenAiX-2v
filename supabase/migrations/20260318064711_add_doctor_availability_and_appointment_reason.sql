/*
  # Add Doctor Availability and Appointment Enhancements

  1. New Table
    - `doctor_availability`
      - `id` (uuid, primary key)
      - `doctor_id` (uuid, foreign key to doctors)
      - `day_of_week` (integer, 0-6 where 0=Sunday)
      - `start_time` (time)
      - `end_time` (time)
      - `is_active` (boolean)
      - `created_at` (timestamptz)

  2. Changes to `appointments` table
    - Add `reason` column for appointment purpose
    - Add `duration_minutes` column (default 45)

  3. Security
    - Enable RLS on doctor_availability
    - Anyone can view doctor availability
    
  4. Sample Data
    - Add availability for all existing doctors
    - Weekday mornings (9 AM - 12 PM) and afternoons (2 PM - 5 PM)
*/

-- Create doctor_availability table
CREATE TABLE IF NOT EXISTS doctor_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id uuid REFERENCES doctors(id) ON DELETE CASCADE NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE doctor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view doctor availability"
  ON doctor_availability FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_day ON doctor_availability(day_of_week);

-- Add columns to appointments table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'reason'
  ) THEN
    ALTER TABLE appointments ADD COLUMN reason text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'appointments' AND column_name = 'duration_minutes'
  ) THEN
    ALTER TABLE appointments ADD COLUMN duration_minutes integer DEFAULT 45;
  END IF;
END $$;

-- Add sample availability for all doctors (weekdays 9 AM - 12 PM and 2 PM - 5 PM)
DO $$
DECLARE
  doctor_record RECORD;
  weekday INTEGER;
BEGIN
  FOR doctor_record IN SELECT id FROM doctors LOOP
    FOR weekday IN 0..6 LOOP
      -- Morning slots: 9 AM to 12 PM
      INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active)
      VALUES (doctor_record.id, weekday, '09:00:00', '12:00:00', true)
      ON CONFLICT DO NOTHING;
      
      -- Afternoon slots: 2 PM to 5 PM
      INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active)
      VALUES (doctor_record.id, weekday, '14:00:00', '17:00:00', true)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
