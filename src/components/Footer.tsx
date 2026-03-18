import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { language } = useLanguage();

  return (
    <footer className="bg-[#1A1A2E] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <div className="mb-4">
              <img
                src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy copy.png"
                alt="CeenAiX Logo"
                className="h-40 w-auto"
              />
            </div>
            <p className="text-gray-400 text-sm">
              {language === 'en'
                ? 'AI-Native Healthcare Intelligence for the UAE'
                : 'الذكاء الصحي المدعوم بالذكاء الاصطناعي لدولة الإمارات'}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{language === 'en' ? 'Platform' : 'المنصة'}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Find Care' : 'ابحث عن الرعاية'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Doctors' : 'الأطباء'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Clinics' : 'العيادات'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Pharmacies' : 'الصيدليات'}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{language === 'en' ? 'Company' : 'الشركة'}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'About Us' : 'معلومات عنا'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Contact' : 'اتصل بنا'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Careers' : 'الوظائف'}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{language === 'en' ? 'Legal' : 'القانونية'}</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
              </li>
              <li className="hover:text-white cursor-pointer">
                {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>
            {language === 'en'
              ? '© 2026 CeenAiX — AryAiX Intelligent Ventures | Dubai, UAE'
              : '© 2026 CeenAiX — AryAiX Intelligent Ventures | دبي، الإمارات'}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer">
              {language === 'en' ? 'DHA Licensed' : 'مرخص من DHA'}
            </span>
            <span className="hover:text-white cursor-pointer">
              {language === 'en' ? 'Nabidh HIE' : 'Nabidh HIE'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
