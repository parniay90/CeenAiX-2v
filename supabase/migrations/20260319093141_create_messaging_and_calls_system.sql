/*
  # Create Messaging and Communication System

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `recipient_id` (uuid, references auth.users)
      - `subject` (text)
      - `body` (text)
      - `is_read` (boolean, default false)
      - `is_starred` (boolean, default false)
      - `parent_message_id` (uuid, nullable for replies/forwards)
      - `message_type` (text: 'inbox', 'sent', 'draft', 'archived')
      - `attachments` (jsonb, nullable)
      - `created_at` (timestamptz)
      - `read_at` (timestamptz, nullable)
    
    - `message_participants`
      - `id` (uuid, primary key)
      - `message_id` (uuid, references messages)
      - `user_id` (uuid, references auth.users)
      - `participant_type` (text: 'to', 'cc', 'bcc')
      - `created_at` (timestamptz)
    
    - `call_history`
      - `id` (uuid, primary key)
      - `caller_id` (uuid, references auth.users)
      - `recipient_id` (uuid, references auth.users)
      - `call_type` (text: 'audio', 'video')
      - `status` (text: 'completed', 'missed', 'declined', 'ongoing')
      - `duration` (integer, seconds)
      - `started_at` (timestamptz)
      - `ended_at` (timestamptz, nullable)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can read their own messages (sent or received)
    - Users can create messages
    - Users can view their own call history
*/

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) NOT NULL,
  subject text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  is_starred boolean DEFAULT false,
  parent_message_id uuid REFERENCES messages(id),
  message_type text DEFAULT 'inbox' CHECK (message_type IN ('inbox', 'sent', 'draft', 'archived')),
  attachments jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages they sent"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id);

CREATE POLICY "Users can view messages sent to them"
  ON messages FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their received messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

CREATE POLICY "Users can update their sent messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = sender_id)
  WITH CHECK (auth.uid() = sender_id);

-- Message participants table
CREATE TABLE IF NOT EXISTS message_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  participant_type text DEFAULT 'to' CHECK (participant_type IN ('to', 'cc', 'bcc')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view participants of their messages"
  ON message_participants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages
      WHERE messages.id = message_participants.message_id
      AND (messages.sender_id = auth.uid() OR messages.recipient_id = auth.uid())
    )
  );

-- Call history table
CREATE TABLE IF NOT EXISTS call_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id uuid REFERENCES auth.users(id) NOT NULL,
  recipient_id uuid REFERENCES auth.users(id) NOT NULL,
  call_type text NOT NULL CHECK (call_type IN ('audio', 'video')),
  status text DEFAULT 'ongoing' CHECK (status IN ('completed', 'missed', 'declined', 'ongoing')),
  duration integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE call_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their call history"
  ON call_history FOR SELECT
  TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can create call records"
  ON call_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update their call records"
  ON call_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = caller_id OR auth.uid() = recipient_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_call_history_participants ON call_history(caller_id, recipient_id);
CREATE INDEX IF NOT EXISTS idx_call_history_started_at ON call_history(started_at DESC);