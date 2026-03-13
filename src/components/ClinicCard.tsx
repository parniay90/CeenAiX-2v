import React from 'react';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ClinicCardProps {
  id: string;
  name: string;
  type: string;
  location: string;
  specialties: string[];
  verified: boolean;
  hours?: string;
  onClick?: () => void;
}

export function ClinicCard({
  name,
  type,
  location,
  specialties,
  verified,
  hours,
  onClick,
}: ClinicCardProps) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
            {verified && <CheckCircle className="w-5 h-5 text-[#0D7377]" fill="#0D7377" />}
          </div>
          <span className="inline-block px-3 py-1 bg-[#0D7377] bg-opacity-10 text-[#0D7377] text-xs font-medium rounded-full">
            {type}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{location}</span>
        </div>

        {hours && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{hours}</span>
          </div>
        )}

        <div className="pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">
            {language === 'en' ? 'Specialties:' : 'التخصصات:'}
          </p>
          <div className="flex flex-wrap gap-2">
            {specialties.slice(0, 3).map((specialty, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {specialty}
              </span>
            ))}
            {specialties.length > 3 && (
              <span className="px-2 py-1 text-gray-500 text-xs">
                +{specialties.length - 3} {language === 'en' ? 'more' : 'المزيد'}
              </span>
            )}
          </div>
        </div>
      </div>

      <button className="mt-4 w-full px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg hover:bg-[#0D7377] hover:text-white transition-colors text-sm font-medium">
        {language === 'en' ? 'View Clinic' : 'عرض العيادة'}
      </button>
    </div>
  );
}
