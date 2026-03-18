import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ onNavigate, currentPage }: NavbarProps) {
  const { language, toggleLanguage } = useLanguage();

  const navLinks = [
    { id: 'doctors', label: 'Doctors', labelAr: 'الأطباء' },
    { id: 'clinics', label: 'Hospitals', labelAr: 'المستشفيات' },
    { id: 'pharmacies', label: 'Pharmacies', labelAr: 'الصيدليات' },
    { id: 'insurance', label: 'Insurance', labelAr: 'التأمين' },
    { id: 'news', label: 'Health News', labelAr: 'أخبار صحية' },
    { id: 'patient-dashboard', label: 'Patient Portal', labelAr: 'بوابة المريض' },
    { id: 'doctor-dashboard', label: 'Doctor Portal', labelAr: 'بوابة الطبيب' },
  ];

  return (
    <nav style={{ background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <img
              src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy copy.png"
              alt="CeenAiX Logo"
              className="h-36 w-auto"
            />
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: currentPage === link.id ? 'white' : 'rgba(255, 255, 255, 0.85)',
                  background: currentPage === link.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== link.id) {
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== link.id) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {language === 'en' ? link.label : link.labelAr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <Globe className="w-4 h-4" />
              {language === 'en' ? 'EN' : 'عربي'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
