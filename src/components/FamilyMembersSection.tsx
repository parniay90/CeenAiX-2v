import React, { useState, useEffect } from 'react';
import { Users, Plus, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import FamilyMemberCard from './FamilyMemberCard';
import AddFamilyMemberModal from './AddFamilyMemberModal';

interface FamilyMember {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  relationship: string;
  blood_type?: string;
  phone?: string;
  email?: string;
  profile_image_url?: string;
  medical_notes?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];
  emergency_contact: boolean;
}

export default function FamilyMembersSection() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMember = async (memberData: Partial<FamilyMember>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      if (editingMember) {
        const { error } = await supabase
          .from('family_members')
          .update(memberData)
          .eq('id', editingMember.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('family_members')
          .insert([{ ...memberData, patient_id: user.id }]);

        if (error) throw error;
      }

      await fetchFamilyMembers();
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error saving family member:', error);
      throw error;
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to remove this family member?')) return;

    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchFamilyMembers();
    } catch (error) {
      console.error('Error deleting family member:', error);
    }
  };

  const handleEditMember = (member: FamilyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center">
        <Loader className="w-8 h-8 text-teal-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-100 rounded-lg">
              <Users className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Family Members</h2>
              <p className="text-sm text-gray-600">Manage your family's health profiles</p>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Family Member
          </button>
        </div>
      </div>

      <div className="p-6">
        {familyMembers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No family members added yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your family members to manage their health records</p>
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Your First Family Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyMembers.map((member) => (
              <FamilyMemberCard
                key={member.id}
                member={member}
                onEdit={handleEditMember}
                onDelete={handleDeleteMember}
              />
            ))}
          </div>
        )}
      </div>

      <AddFamilyMemberModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMember(null);
        }}
        onSave={handleSaveMember}
        editingMember={editingMember}
      />
    </div>
  );
}