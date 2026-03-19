import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface LoginPageProps {
  onLogin: () => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const { language } = useLanguage();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const mockNames: Record<UserRole, string> = {
      patient: 'Ahmed Al-Mansoori',
      doctor: 'Ahmed Al Mansoori',
      clinic_admin: 'Clinic Manager',
      pharmacy_admin: 'Pharmacy Manager',
      lab_admin: 'Lab Manager',
      insurance_admin: 'Insurance Admin',
      super_admin: 'Super Admin',
    };

    const mockUserIds: Record<UserRole, string> = {
      patient: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      doctor: 'mock-doctor-id',
      clinic_admin: 'mock-clinic-admin-id',
      pharmacy_admin: 'mock-pharmacy-admin-id',
      lab_admin: 'mock-lab-admin-id',
      insurance_admin: 'mock-insurance-admin-id',
      super_admin: 'mock-super-admin-id',
    };

    login(selectedRole, mockUserIds[selectedRole], mockNames[selectedRole]);
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D7377] to-[#14BDBD] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-8">
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy copy.png"
            alt="CeenAiX Logo"
            className="h-72 w-auto"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Select Role (Demo)' : 'اختر الدور (تجريبي)'}
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
            >
              <option value="patient">{language === 'en' ? 'Patient' : 'مريض'}</option>
              <option value="doctor">{language === 'en' ? 'Doctor' : 'طبيب'}</option>
              <option value="clinic_admin">{language === 'en' ? 'Clinic Admin' : 'مدير عيادة'}</option>
              <option value="pharmacy_admin">{language === 'en' ? 'Pharmacy Admin' : 'مدير صيدلية'}</option>
              <option value="lab_admin">{language === 'en' ? 'Lab Admin' : 'مدير مختبر'}</option>
              <option value="insurance_admin">{language === 'en' ? 'Insurance Admin' : 'مدير تأمين'}</option>
              <option value="super_admin">{language === 'en' ? 'Super Admin' : 'مدير نظام'}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Email' : 'البريد الإلكتروني'}
            </label>
            <input
              type="email"
              defaultValue="demo@ceenaix.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {language === 'en' ? 'Password' : 'كلمة المرور'}
            </label>
            <input
              type="password"
              defaultValue="demo123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors"
          >
            {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('landing')}
            className="text-sm text-[#0D7377] hover:underline"
          >
            {language === 'en' ? '← Back to Home' : '→ العودة إلى الصفحة الرئيسية'}
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            {language === 'en'
              ? '🎯 Demo Mode: Select any role above and click Sign In to explore that dashboard.'
              : '🎯 وضع التجريبي: اختر أي دور أعلاه وانقر فوق تسجيل الدخول لاستكشاف لوحة التحكم.'}
          </p>
        </div>
      </div>
    </div>
  );
}
