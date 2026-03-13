import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface InsuranceCardProps {
  id: string;
  name: string;
  planType: string;
  acceptedClinics: number;
  coverageHighlights: string[];
  onClick?: () => void;
}

export function InsuranceCard({
  name,
  planType,
  acceptedClinics,
  coverageHighlights,
  onClick,
}: InsuranceCardProps) {
  const { language } = useLanguage();

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-[#14BDBD] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <Shield className="w-6 h-6 text-[#0D7377]" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{planType}</p>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        {language === 'en' ? 'Accepted at' : 'مقبول في'}{' '}
        <span className="font-semibold text-[#0D7377]">{acceptedClinics}</span>{' '}
        {language === 'en' ? 'clinics on CeenAiX' : 'عيادة على CeenAiX'}
      </div>

      <div className="space-y-2 mb-4">
        {coverageHighlights.slice(0, 3).map((highlight, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>

      <button className="w-full px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg hover:bg-[#0D7377] hover:text-white transition-colors text-sm font-medium">
        {language === 'en' ? 'Check Coverage' : 'تحقق من التغطية'}
      </button>
    </div>
  );
}
