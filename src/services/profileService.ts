import { supabase } from '../lib/supabase';

export interface ProfileData {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  emirates_id: string;
  address: string;
  emirate: string;
  blood_type: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  avatar_url: string;
}

export const profileService = {
  async getProfile(userId: string) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) throw profileError;

      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (patientError) throw patientError;

      return {
        ...profile,
        ...patient,
      };
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  async updateProfile(userId: string, data: Partial<ProfileData>) {
    try {
      const profileFields: Record<string, any> = {};
      if (data.full_name !== undefined) profileFields.full_name = data.full_name;
      if (data.email !== undefined) profileFields.email = data.email;
      if (data.phone !== undefined) profileFields.phone = data.phone;
      if (data.avatar_url !== undefined) profileFields.avatar_url = data.avatar_url;

      if (Object.keys(profileFields).length > 0) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update(profileFields)
          .eq('id', userId);

        if (profileError) throw profileError;
      }

      const patientFields: Record<string, any> = {};
      if (data.date_of_birth !== undefined) patientFields.date_of_birth = data.date_of_birth;
      if (data.gender !== undefined) patientFields.gender = data.gender;
      if (data.emirates_id !== undefined) patientFields.emirates_id = data.emirates_id;
      if (data.address !== undefined) patientFields.address = data.address;
      if (data.emirate !== undefined) patientFields.emirate = data.emirate;
      if (data.blood_type !== undefined) patientFields.blood_type = data.blood_type;
      if (data.emergency_contact_name !== undefined) patientFields.emergency_contact_name = data.emergency_contact_name;
      if (data.emergency_contact_phone !== undefined) patientFields.emergency_contact_phone = data.emergency_contact_phone;

      if (Object.keys(patientFields).length > 0) {
        const { error: patientError } = await supabase
          .from('patients')
          .update(patientFields)
          .eq('id', userId);

        if (patientError) throw patientError;
      }

      return { success: true };
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

  async uploadAvatar(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
};
