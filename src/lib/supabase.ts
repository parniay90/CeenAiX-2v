import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);

export type UserRole =
  | 'patient'
  | 'doctor'
  | 'clinic_admin'
  | 'pharmacy_admin'
  | 'lab_admin'
  | 'insurance_admin'
  | 'super_admin';
