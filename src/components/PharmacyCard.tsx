import React from 'react';
import { MapPin, Clock, Truck, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PharmacyCardProps {
  id: string;
  name: string;
  location: string;
  hours: string;
  homeDelivery: boolean;
  open24Hours: boolean;
  onClick?: () => void;
}

export function PharmacyCard({
  name,
  location,
  hours,
  homeDelivery,
  open24Hours,
  onClick,
}: PharmacyCardProps) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{name}</h3>
        <div className="flex flex-wrap gap-2">
          {homeDelivery && (
            <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-md">
              <Truck className="w-3 h-3" />
              {language === 'en' ? 'Home Delivery' : 'توصيل منزلي'}
            </span>
          )}
          {open24Hours && (
            <span className="px-2 py-1 bg-[#6C63FF] bg-opacity-10 text-[#6C63FF] text-xs font-medium rounded-md">
              {language === 'en' ? '24 Hours' : '24 ساعة'}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{hours}</span>
        </div>
      </div>

      <button className="mt-4 w-full px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg hover:bg-[#0D7377] hover:text-white transition-colors text-sm font-medium">
        {language === 'en' ? 'View Catalogue' : 'عرض الكتالوج'}
      </button>
    </div>
  );
}
