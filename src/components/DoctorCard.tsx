import React from 'react';
import { MapPin, Star, CheckCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  verified: boolean;
  languages: string[];
  clinic?: string;
  rating?: number;
  nextAvailable?: string;
  photo?: string;
  onClick?: () => void;
}

export function DoctorCard({
  name,
  specialty,
  verified,
  languages,
  clinic,
  rating,
  nextAvailable,
  onClick,
}: DoctorCardProps) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-[#14BDBD] rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {name.charAt(0)}
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
              <p className="text-sm text-gray-600">{specialty}</p>
            </div>
            {verified && (
              <CheckCircle className="w-5 h-5 text-[#0D7377]" fill="#0D7377" />
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{languages.join(', ')}</span>
            </div>

            {clinic && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{clinic}</span>
              </div>
            )}

            {rating && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" fill="#FFC107" />
                <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
              </div>
            )}

            {nextAvailable && (
              <div className="flex items-center gap-2 text-sm text-[#0D7377]">
                <Calendar className="w-4 h-4" />
                <span>{language === 'en' ? 'Next: ' : 'القادم: '}{nextAvailable}</span>
              </div>
            )}
          </div>

          <button className="mt-4 w-full px-4 py-2 bg-[#0D7377] text-white rounded-lg hover:bg-[#0a5c5f] transition-colors text-sm font-medium">
            {language === 'en' ? 'Book Appointment' : 'احجز موعد'}
          </button>
        </div>
      </div>
    </div>
  );
}
