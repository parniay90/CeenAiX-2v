import React, { useState, useEffect } from 'react';
import { Users, User, Calendar, Heart, AlertCircle, Pill, FileText, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  medical_notes?: string;
  allergies?: string[];
  chronic_conditions?: string[];
  current_medications?: string[];
  emergency_contact: boolean;
}

interface Prescription {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  prescribed_date: string;
  duration_days: number;
  instructions?: string;
  active: boolean;
}

interface LabResult {
  id: string;
  test_name: string;
  test_date: string;
  result: string;
  status: string;
  notes?: string;
}

interface FamilyMedicalHistoryProps {
  patientId: string;
}

export default function FamilyMedicalHistory({ patientId }: FamilyMedicalHistoryProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFamilyMembers();
  }, [patientId]);

  useEffect(() => {
    if (selectedMember) {
      fetchMemberMedicalData(selectedMember.id);
    }
  }, [selectedMember]);

  const fetchFamilyMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
      if (data && data.length > 0) {
        setSelectedMember(data[0]);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMemberMedicalData = async (memberId: string) => {
    try {
      const [prescriptionsData, labResultsData] = await Promise.all([
        supabase
          .from('family_member_prescriptions')
          .select('*')
          .eq('family_member_id', memberId)
          .order('prescribed_date', { ascending: false }),
        supabase
          .from('family_member_lab_results')
          .select('*')
          .eq('family_member_id', memberId)
          .order('test_date', { ascending: false })
      ]);

      if (prescriptionsData.error) throw prescriptionsData.error;
      if (labResultsData.error) throw labResultsData.error;

      setPrescriptions(prescriptionsData.data || []);
      setLabResults(labResultsData.data || []);
    } catch (error) {
      console.error('Error fetching member medical data:', error);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      normal: 'bg-green-100 text-green-800',
      abnormal: 'bg-amber-100 text-amber-800',
      critical: 'bg-red-100 text-red-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status.toLowerCase()] || colors.pending;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Activity className="w-8 h-8 text-teal-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading family medical history...</p>
      </div>
    );
  }

  if (familyMembers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Family Members</h3>
        <p className="text-gray-600">This patient has not added any family members yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-teal-100 rounded-lg">
            <Users className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Family Medical History</h2>
            <p className="text-sm text-gray-600">View patient's family members and their medical records</p>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {familyMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                selectedMember?.id === member.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {member.first_name} {member.last_name}
            </button>
          ))}
        </div>
      </div>

      {selectedMember && (
        <div className="p-6">
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 text-teal-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {selectedMember.first_name} {selectedMember.last_name}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {calculateAge(selectedMember.date_of_birth)} years old
                  </span>
                  <span className="capitalize">{selectedMember.gender}</span>
                  <span className="capitalize font-medium text-teal-600">{selectedMember.relationship}</span>
                  {selectedMember.blood_type && (
                    <span className="font-medium text-red-600">{selectedMember.blood_type}</span>
                  )}
                </div>
              </div>
            </div>

            {selectedMember.allergies && selectedMember.allergies.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">Allergies</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.allergies.map((allergy, index) => (
                    <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMember.chronic_conditions && selectedMember.chronic_conditions.length > 0 && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 font-medium mb-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Chronic Conditions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedMember.chronic_conditions.map((condition, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedMember.medical_notes && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Medical Notes</span>
                </div>
                <p className="text-sm text-blue-900">{selectedMember.medical_notes}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pill className="w-5 h-5 text-teal-600" />
                <h4 className="font-semibold text-gray-900">Prescriptions</h4>
              </div>
              {prescriptions.length === 0 ? (
                <p className="text-gray-500 text-sm">No prescriptions recorded</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{prescription.medication_name}</h5>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prescription.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {prescription.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Dosage:</span> {prescription.dosage}
                        </p>
                        <p>
                          <span className="font-medium">Frequency:</span> {prescription.frequency}
                        </p>
                        <p>
                          <span className="font-medium">Duration:</span> {prescription.duration_days} days
                        </p>
                        <p>
                          <span className="font-medium">Prescribed:</span>{' '}
                          {new Date(prescription.prescribed_date).toLocaleDateString()}
                        </p>
                        {prescription.instructions && (
                          <p className="text-xs text-gray-500 mt-2">{prescription.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-teal-600" />
                <h4 className="font-semibold text-gray-900">Lab Results</h4>
              </div>
              {labResults.length === 0 ? (
                <p className="text-gray-500 text-sm">No lab results recorded</p>
              ) : (
                <div className="space-y-3">
                  {labResults.map((lab) => (
                    <div key={lab.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{lab.test_name}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lab.status)}`}>
                          {lab.status}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">Result:</span> {lab.result}
                        </p>
                        <p>
                          <span className="font-medium">Test Date:</span>{' '}
                          {new Date(lab.test_date).toLocaleDateString()}
                        </p>
                        {lab.notes && <p className="text-xs text-gray-500 mt-2">{lab.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}