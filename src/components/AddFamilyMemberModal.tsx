import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';

interface FamilyMember {
  id?: string;
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

interface AddFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: FamilyMember) => Promise<void>;
  editingMember?: FamilyMember | null;
}

export default function AddFamilyMemberModal({ isOpen, onClose, onSave, editingMember }: AddFamilyMemberModalProps) {
  const [formData, setFormData] = useState<FamilyMember>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'male',
    relationship: 'child',
    blood_type: '',
    phone: '',
    email: '',
    medical_notes: '',
    allergies: [],
    chronic_conditions: [],
    current_medications: [],
    emergency_contact: false
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingMember) {
      setFormData(editingMember);
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'male',
        relationship: 'child',
        blood_type: '',
        phone: '',
        email: '',
        medical_notes: '',
        allergies: [],
        chronic_conditions: [],
        current_medications: [],
        emergency_contact: false
      });
    }
  }, [editingMember, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving family member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = (type: 'allergies' | 'chronic_conditions' | 'current_medications', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [type]: [...(prev[type] || []), value.trim()]
      }));
      if (type === 'allergies') setNewAllergy('');
      if (type === 'chronic_conditions') setNewCondition('');
      if (type === 'current_medications') setNewMedication('');
    }
  };

  const removeItem = (type: 'allergies' | 'chronic_conditions' | 'current_medications', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type]?.filter((_, i) => i !== index) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingMember ? 'Edit Family Member' : 'Add Family Member'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
              <input
                type="date"
                required
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
              <select
                required
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="spouse">Spouse</option>
                <option value="child">Child</option>
                <option value="parent">Parent</option>
                <option value="sibling">Sibling</option>
                <option value="grandparent">Grandparent</option>
                <option value="grandchild">Grandchild</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
              <select
                value={formData.blood_type}
                onChange={(e) => setFormData({ ...formData, blood_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Blood Type</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.checked })}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-gray-700">Set as Emergency Contact</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('allergies', newAllergy))}
                placeholder="Add allergy"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addItem('allergies', newAllergy)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies?.map((allergy, index) => (
                <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-2">
                  {allergy}
                  <button type="button" onClick={() => removeItem('allergies', index)}>
                    <Minus className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('chronic_conditions', newCondition))}
                placeholder="Add condition"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addItem('chronic_conditions', newCondition)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.chronic_conditions?.map((condition, index) => (
                <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm flex items-center gap-2">
                  {condition}
                  <button type="button" onClick={() => removeItem('chronic_conditions', index)}>
                    <Minus className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('current_medications', newMedication))}
                placeholder="Add medication"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => addItem('current_medications', newMedication)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.current_medications?.map((medication, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {medication}
                  <button type="button" onClick={() => removeItem('current_medications', index)}>
                    <Minus className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Medical Notes</label>
            <textarea
              value={formData.medical_notes}
              onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Any additional medical information..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : editingMember ? 'Update' : 'Add Family Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}