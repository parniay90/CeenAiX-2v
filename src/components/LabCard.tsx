import React from 'react';
import { MapPin, Home, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LabCardProps {
  id: string;
  name: string;
  location: string;
  homeCollection: boolean;
  rapidResults: boolean;
  turnaround?: string;
  onClick?: () => void;
}

export function LabCard({
  name,
  location,
  homeCollection,
  rapidResults,
  turnaround,
  onClick,
}: LabCardProps) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{name}</h3>
        <div className="flex flex-wrap gap-2">
          {homeCollection && (
            <span className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
              <Home className="w-3 h-3" />
              {language === 'en' ? 'Home Collection' : 'جمع منزلي'}
            </span>
          )}
          {rapidResults && (
            <span className="flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-md">
              <Zap className="w-3 h-3" />
              {language === 'en' ? 'Rapid Results' : 'نتائج سريعة'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{location}</span>
        </div>

        {turnaround && (
          <div className="text-sm text-gray-600">
            <span className="font-medium">{language === 'en' ? 'Typical turnaround: ' : 'الوقت المتوقع: '}</span>
            {turnaround}
          </div>
        )}
      </div>

      <button className="mt-4 w-full px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg hover:bg-[#0D7377] hover:text-white transition-colors text-sm font-medium">
        {language === 'en' ? 'View Tests' : 'عرض الفحوصات'}
      </button>
    </div>
  );
}
