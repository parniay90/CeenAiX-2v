/*
  # User Settings and Preferences Schema

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `language` (text) - Default: 'en'
      - `timezone` (text) - Default: 'Asia/Dubai'
      - `date_format` (text) - Default: 'DD/MM/YYYY'
      - `time_format` (text) - Default: '24h'
      - `currency` (text) - Default: 'AED'
      - `theme` (text) - Default: 'light'
      - `notifications_enabled` (boolean) - Default: true
      - `email_notifications` (boolean) - Default: true
      - `sms_notifications` (boolean) - Default: false
      - `push_notifications` (boolean) - Default: true
      - `appointment_reminders` (boolean) - Default: true
      - `marketing_emails` (boolean) - Default: false
      - `two_factor_enabled` (boolean) - Default: false
      - `session_timeout` (integer) - Default: 30 (minutes)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `notification_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `notification_type` (text) - e.g., 'appointment', 'message', 'prescription', 'lab_result'
      - `email_enabled` (boolean) - Default: true
      - `sms_enabled` (boolean) - Default: false
      - `push_enabled` (boolean) - Default: true
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only view and update their own settings

  3. Notes
    - Settings are created automatically when a user registers
    - Updated_at timestamp updates automatically
*/

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  language text DEFAULT 'en' NOT NULL,
  timezone text DEFAULT 'Asia/Dubai' NOT NULL,
  date_format text DEFAULT 'DD/MM/YYYY' NOT NULL,
  time_format text DEFAULT '24h' NOT NULL CHECK (time_format IN ('12h', '24h')),
  currency text DEFAULT 'AED' NOT NULL,
  theme text DEFAULT 'light' NOT NULL CHECK (theme IN ('light', 'dark', 'auto')),
  notifications_enabled boolean DEFAULT true NOT NULL,
  email_notifications boolean DEFAULT true NOT NULL,
  sms_notifications boolean DEFAULT false NOT NULL,
  push_notifications boolean DEFAULT true NOT NULL,
  appointment_reminders boolean DEFAULT true NOT NULL,
  marketing_emails boolean DEFAULT false NOT NULL,
  two_factor_enabled boolean DEFAULT false NOT NULL,
  session_timeout integer DEFAULT 30 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  notification_type text NOT NULL,
  email_enabled boolean DEFAULT true NOT NULL,
  sms_enabled boolean DEFAULT false NOT NULL,
  push_enabled boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, notification_type)
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
CREATE POLICY "Users can view own settings"
  ON user_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON user_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON user_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for notification_preferences
CREATE POLICY "Users can view own notification preferences"
  ON notification_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification preferences"
  ON notification_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification preferences"
  ON notification_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notification preferences"
  ON notification_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON notification_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_type ON notification_preferences(notification_type);
