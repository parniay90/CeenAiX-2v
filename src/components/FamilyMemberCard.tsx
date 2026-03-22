import React from 'react';
import { User, Phone, Mail, Calendar, Trash2, CreditCard as Edit, Heart, AlertCircle } from 'lucide-react';

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
  allergies?: string[];
  chronic_conditions?: string[];
  emergency_contact: boolean;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
}

export default function FamilyMemberCard({ member, onEdit, onDelete }: FamilyMemberCardProps) {
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

  const getRelationshipColor = (relationship: string) => {
    const colors: Record<string, string> = {
      spouse: 'bg-pink-100 text-pink-800',
      child: 'bg-blue-100 text-blue-800',
      parent: 'bg-green-100 text-green-800',
      sibling: 'bg-purple-100 text-purple-800',
      grandparent: 'bg-amber-100 text-amber-800',
      grandchild: 'bg-cyan-100 text-cyan-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[relationship] || colors.other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {member.profile_image_url ? (
            <img
              src={member.profile_image_url}
              alt={`${member.first_name} ${member.last_name}`}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <User className="w-8 h-8 text-teal-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {member.first_name} {member.last_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(member.relationship)}`}>
                {member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}
              </span>
              {member.emergency_contact && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  Emergency Contact
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{calculateAge(member.date_of_birth)} years old</span>
          <span className="text-gray-400">•</span>
          <span className="capitalize">{member.gender}</span>
          {member.blood_type && (
            <>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-red-600">{member.blood_type}</span>
            </>
          )}
        </div>

        {member.phone && (
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{member.phone}</span>
          </div>
        )}

        {member.email && (
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4" />
            <span>{member.email}</span>
          </div>
        )}

        {member.allergies && member.allergies.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 font-medium mb-1">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Allergies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {member.allergies.map((allergy, index) => (
                <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}

        {member.chronic_conditions && member.chronic_conditions.length > 0 && (
          <div className="mt-2 p-2 bg-amber-50 rounded-lg">
            <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">Chronic Conditions</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {member.chronic_conditions.map((condition, index) => (
                <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs">
                  {condition}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}