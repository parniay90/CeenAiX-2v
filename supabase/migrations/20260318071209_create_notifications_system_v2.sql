/*
  # Create Notifications System

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `type` (text) - appointment_reminder, appointment_confirmed, etc.
      - `related_id` (uuid) - reference to appointment/prescription/etc
      - `is_read` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `notifications` table
    - Add policies for users to read their own notifications
    - Add policies for users to update their own notifications (mark as read)

  3. Functions
    - Create function to auto-create notification when appointment is booked
*/

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  related_id uuid,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
  DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
  DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
END $$;

-- Policies for notifications
CREATE POLICY "Users can view own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Function to create appointment confirmation notification
CREATE OR REPLACE FUNCTION create_appointment_notification()
RETURNS TRIGGER AS $$
DECLARE
  doctor_name text;
  appt_datetime text;
BEGIN
  -- Get doctor name
  SELECT full_name INTO doctor_name
  FROM profiles
  WHERE id = NEW.doctor_id;

  -- Format appointment datetime
  appt_datetime := TO_CHAR(NEW.appointment_date, 'FMMonth DD, YYYY') || ' at ' || 
                   TO_CHAR(NEW.appointment_time::time, 'HH12:MI AM');

  -- Create notification for patient
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (
    NEW.patient_id,
    'Appointment Confirmed',
    'Your appointment with ' || doctor_name || ' on ' || appt_datetime || ' has been confirmed.',
    'appointment_confirmed',
    NEW.id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notification when appointment is booked
DROP TRIGGER IF EXISTS appointment_notification_trigger ON appointments;
CREATE TRIGGER appointment_notification_trigger
  AFTER INSERT ON appointments
  FOR EACH ROW
  WHEN (NEW.status = 'scheduled')
  EXECUTE FUNCTION create_appointment_notification();
