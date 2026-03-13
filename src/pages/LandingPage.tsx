import React, { useState } from 'react';
import { Search, Sparkles, CheckCircle, Shield, Database, Lock, Globe as GlobeIcon, Zap, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { DoctorCard } from '../components/DoctorCard';
import { ClinicCard } from '../components/ClinicCard';
import { PharmacyCard } from '../components/PharmacyCard';
import { LabCard } from '../components/LabCard';
import { InsuranceCard } from '../components/InsuranceCard';
import { AIChat } from '../components/AIChat';

type Tab = 'doctors' | 'clinics' | 'pharmacies' | 'labs' | 'insurance';

interface LandingPageProps {
  onNavigateToFindCare: () => void;
  onNavigateToPatientPortal: () => void;
  onNavigateToDoctorPortal: () => void;
}

export default function LandingPage({ onNavigateToFindCare, onNavigateToPatientPortal, onNavigateToDoctorPortal }: LandingPageProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const mockDoctors = [
    {
      id: '1',
      name: 'Dr. Ahmed Al Mansoori',
      specialty: 'Cardiology',
      verified: true,
      languages: ['English', 'Arabic'],
      clinic: 'Dubai Heart Center',
      rating: 4.9,
      nextAvailable: 'Tomorrow 2:00 PM',
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrics',
      verified: true,
      languages: ['English'],
      clinic: 'American Hospital Dubai',
      rating: 4.8,
      nextAvailable: 'Today 4:30 PM',
    },
  ];

  const mockClinics = [
    {
      id: '1',
      name: 'Dubai Heart Center',
      type: 'Specialty Center',
      location: 'Dubai Healthcare City',
      specialties: ['Cardiology', 'Cardiac Surgery', 'Vascular Medicine'],
      verified: true,
      hours: 'Sun-Thu: 8AM-8PM',
    },
    {
      id: '2',
      name: 'American Hospital Dubai',
      type: 'Hospital',
      location: 'Oud Metha, Dubai',
      specialties: ['Emergency', 'Pediatrics', 'Surgery', 'Orthopedics'],
      verified: true,
      hours: '24/7',
    },
  ];

  const mockPharmacies = [
    {
      id: '1',
      name: 'Aster Pharmacy',
      location: 'Dubai Marina',
      hours: '8:00 AM - 11:00 PM',
      homeDelivery: true,
      open24Hours: false,
    },
    {
      id: '2',
      name: 'Life Pharmacy',
      location: 'JBR, Dubai',
      hours: 'Open 24 Hours',
      homeDelivery: true,
      open24Hours: true,
    },
  ];

  const mockLabs = [
    {
      id: '1',
      name: 'Al Borg Medical Laboratories',
      location: 'Multiple locations across Dubai',
      homeCollection: true,
      rapidResults: true,
      turnaround: '24-48 hours',
    },
    {
      id: '2',
      name: 'NMC Pathology',
      location: 'Dubai Healthcare City',
      homeCollection: false,
      rapidResults: true,
      turnaround: '12-24 hours',
    },
  ];

  const mockInsurance = [
    {
      id: '1',
      name: 'Daman Insurance',
      planType: 'Enhanced Plan',
      acceptedClinics: 120,
      coverageHighlights: [
        'Inpatient & Outpatient Care',
        'Emergency Services',
        'Maternity Coverage',
      ],
    },
    {
      id: '2',
      name: 'AXA Gulf',
      planType: 'Comprehensive Health',
      acceptedClinics: 95,
      coverageHighlights: [
        'Worldwide Coverage',
        'Dental & Optical',
        'Chronic Conditions',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            {language === 'en'
              ? 'Your Health, Intelligently Managed.'
              : 'صحتك، تُدار بذكاء.'}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {language === 'en'
              ? 'Find doctors, book appointments, manage your health records, and access AI-powered care — all in one platform. Built for the UAE. Compliant with DHA.'
              : 'ابحث عن الأطباء، احجز المواعيد، أدر سجلاتك الصحية، واحصل على رعاية مدعومة بالذكاء الاصطناعي - كل ذلك في منصة واحدة. مبنية لدولة الإمارات. متوافقة مع DHA.'}
          </p>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search doctors, clinics, specialties, symptoms...'
                    : 'ابحث عن الأطباء، العيادات، التخصصات، الأعراض...'
                }
                className="w-full pl-14 pr-4 py-5 text-lg text-gray-900 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
            </div>

            <div className="flex gap-3 mt-8 justify-center">
              <button
                onClick={onNavigateToPatientPortal}
                className="px-8 py-4 bg-white text-teal-700 font-bold rounded-xl hover:bg-gray-100 shadow-xl transition-all"
              >
                Patient Portal
              </button>
              <button
                onClick={onNavigateToDoctorPortal}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/20 border-2 border-white/30 transition-all"
              >
                Doctor Portal
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              {['doctors', 'clinics', 'pharmacies', 'labs', 'insurance'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as Tab)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white text-[#0D7377] shadow-lg'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {language === 'en'
                    ? tab.charAt(0).toUpperCase() + tab.slice(1)
                    : tab === 'doctors'
                    ? 'الأطباء'
                    : tab === 'clinics'
                    ? 'العيادات'
                    : tab === 'pharmacies'
                    ? 'الصيدليات'
                    : tab === 'labs'
                    ? 'المختبرات'
                    : 'التأمين'}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <button className="px-8 py-4 bg-white text-[#0D7377] rounded-xl font-semibold text-lg hover:shadow-2xl transition-shadow">
                {language === 'en' ? 'Find Care Now' : 'ابحث عن الرعاية الآن'}
              </button>
              <button
                onClick={() => setShowAIChat(true)}
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[#0D7377] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                {language === 'en' ? 'Talk to AI Health Assistant' : 'تحدث إلى المساعد الصحي'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <Sparkles className="w-5 h-5 text-[#6C63FF]" />
            <p>
              {language === 'en'
                ? "Not sure where to start? Describe your symptoms and our AI will guide you to the right care."
                : 'لست متأكدًا من أين تبدأ؟ صف أعراضك وسيوجهك الذكاء الاصطناعي إلى الرعاية المناسبة.'}
            </p>
            <button
              onClick={() => setShowAIChat(true)}
              className="text-[#6C63FF] font-medium hover:underline"
            >
              {language === 'en' ? 'Start AI Consultation' : 'ابدأ الاستشارة'}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'doctors' &&
            mockDoctors.map((doctor) => <DoctorCard key={doctor.id} {...doctor} />)}
          {activeTab === 'clinics' &&
            mockClinics.map((clinic) => <ClinicCard key={clinic.id} {...clinic} />)}
          {activeTab === 'pharmacies' &&
            mockPharmacies.map((pharmacy) => <PharmacyCard key={pharmacy.id} {...pharmacy} />)}
          {activeTab === 'labs' && mockLabs.map((lab) => <LabCard key={lab.id} {...lab} />)}
          {activeTab === 'insurance' &&
            mockInsurance.map((insurance) => <InsuranceCard key={insurance.id} {...insurance} />)}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {language === 'en' ? 'How It Works' : 'كيف يعمل'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D7377] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-[#0D7377]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'en' ? 'Search & Discover' : 'ابحث واكتشف'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Find the right doctor, clinic, pharmacy, or lab across the UAE'
                  : 'ابحث عن الطبيب، العيادة، الصيدلية أو المختبر المناسب في جميع أنحاء الإمارات'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D7377] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#0D7377]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'en' ? 'Book & Consult' : 'احجز واستشر'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Book in-clinic or teleconsultation. Consult via messaging or video.'
                  : 'احجز في العيادة أو الاستشارة عن بعد. استشر عبر الرسائل أو الفيديو.'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#0D7377] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Database className="w-8 h-8 text-[#0D7377]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {language === 'en' ? 'Your Health, Connected' : 'صحتك، متصلة'}
              </h3>
              <p className="text-gray-600">
                {language === 'en'
                  ? 'Records, prescriptions, lab results, and referrals — all in one place, forever.'
                  : 'السجلات، الوصفات، نتائج المختبر، والإحالات - كل شيء في مكان واحد، إلى الأبد.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            {language === 'en' ? 'Platform Features' : 'ميزات المنصة'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: language === 'en' ? 'AI Health Assistant' : 'المساعد الصحي الذكي',
                description:
                  language === 'en'
                    ? 'Symptom checker and care navigator powered by AI'
                    : 'فاحص الأعراض وملاح الرعاية مدعوم بالذكاء الاصطناعي',
              },
              {
                icon: Database,
                title: language === 'en' ? 'Unified Health Records' : 'سجلات صحية موحدة',
                description:
                  language === 'en'
                    ? 'One complete medical history across all providers'
                    : 'تاريخ طبي كامل عبر جميع مقدمي الخدمة',
              },
              {
                icon: FileText,
                title: language === 'en' ? 'E-Prescriptions' : 'وصفات إلكترونية',
                description:
                  language === 'en'
                    ? 'Digital prescriptions sent to you or your pharmacy instantly'
                    : 'وصفات رقمية ترسل إليك أو إلى صيدليتك فورًا',
              },
              {
                icon: Zap,
                title: language === 'en' ? 'Lab & Pharmacy Integration' : 'تكامل المختبر والصيدلية',
                description:
                  language === 'en'
                    ? 'Referrals and results in one place'
                    : 'الإحالات والنتائج في مكان واحد',
              },
              {
                icon: GlobeIcon,
                title: language === 'en' ? 'Teleconsultation' : 'الاستشارة عن بعد',
                description:
                  language === 'en'
                    ? 'Secure messaging and video with your doctor'
                    : 'رسائل وفيديو آمنة مع طبيبك',
              },
              {
                icon: Shield,
                title: language === 'en' ? 'DHA & Nabidh Compliant' : 'متوافق مع DHA و Nabidh',
                description:
                  language === 'en'
                    ? 'Built to UAE regulatory standards'
                    : 'مبني وفقًا للمعايير التنظيمية لدولة الإمارات',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200">
                  <Icon className="w-10 h-10 text-[#0D7377] mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#0D7377] to-[#14BDBD] text-white p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">
                {language === 'en' ? 'For Patients' : 'للمرضى'}
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  language === 'en' ? 'Book with any DHA-licensed doctor' : 'احجز مع أي طبيب مرخص من DHA',
                  language === 'en' ? 'Access your complete health records' : 'الوصول إلى سجلاتك الصحية الكاملة',
                  language === 'en' ? 'Receive digital prescriptions' : 'تلقي وصفات رقمية',
                  language === 'en' ? 'Get lab results in-app' : 'احصل على نتائج المختبر في التطبيق',
                  language === 'en' ? 'Consult from anywhere via video' : 'استشر من أي مكان عبر الفيديو',
                  language === 'en' ? 'AI health guidance 24/7' : 'إرشادات صحية ذكية على مدار الساعة',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onNavigateToPatientPortal}
                className="px-8 py-4 bg-white text-[#0D7377] rounded-xl font-semibold hover:shadow-xl transition-shadow"
              >
                {language === 'en' ? 'Sign Up as Patient' : 'سجل كمريض'}
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#1A1A2E] to-gray-800 text-white p-12 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6">
                {language === 'en' ? 'For Doctors' : 'للأطباء'}
              </h2>
              <ul className="space-y-4 mb-8">
                {[
                  language === 'en' ? 'Full digital workspace' : 'مساحة عمل رقمية كاملة',
                  language === 'en' ? 'Patient records at a glance' : 'سجلات المرضى في لمحة',
                  language === 'en' ? 'Write and send e-prescriptions' : 'اكتب وأرسل الوصفات الإلكترونية',
                  language === 'en' ? 'Refer to labs and pharmacies on platform' : 'إحالة إلى المختبرات والصيدليات على المنصة',
                  language === 'en' ? 'Conduct secure teleconsultations' : 'إجراء استشارات آمنة عن بعد',
                  language === 'en' ? 'Track earnings and payments' : 'تتبع الأرباح والمدفوعات',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onNavigateToDoctorPortal}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:shadow-xl transition-shadow"
              >
                {language === 'en' ? 'Register as Doctor' : 'سجل كطبيب'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              { icon: Shield, text: 'DHA Licensed' },
              { icon: Database, text: 'Nabidh HIE Integrated' },
              { icon: Lock, text: 'End-to-End Encrypted' },
              { icon: GlobeIcon, text: 'UAE Data Residency' },
              { icon: Sparkles, text: 'AI Clinically Validated' },
            ].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-2 text-[#0D7377]">
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {[
              { value: '500K+', label: language === 'en' ? 'Patients' : 'مريض' },
              { value: '2,000+', label: language === 'en' ? 'Doctors' : 'طبيب' },
              { value: '150+', label: language === 'en' ? 'Clinics' : 'عيادة' },
              { value: '50+', label: language === 'en' ? 'Labs' : 'مختبر' },
              { value: '30+', label: language === 'en' ? 'Pharmacies' : 'صيدلية' },
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl font-bold text-[#0D7377] mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Be Among the First on CeenAiX' : 'كن من بين الأوائل على CeenAiX'}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {language === 'en' ? 'Launching across Dubai. Join the waitlist.' : 'الإطلاق في جميع أنحاء دبي. انضم إلى قائمة الانتظار.'}
          </p>
          <button
            onClick={() => setShowWaitlist(true)}
            className="px-8 py-4 bg-white text-[#0D7377] rounded-xl font-semibold text-lg hover:shadow-2xl transition-shadow"
          >
            {language === 'en' ? 'Join Waitlist' : 'انضم إلى قائمة الانتظار'}
          </button>
        </div>
      </section>

      {showAIChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-3xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                {language === 'en' ? 'AI Health Assistant' : 'المساعد الصحي الذكي'}
              </h2>
              <button
                onClick={() => setShowAIChat(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                {language === 'en' ? 'Close' : 'إغلاق'}
              </button>
            </div>
            <div className="h-[calc(100%-64px)]">
              <AIChat />
            </div>
          </div>
        </div>
      )}

      {showWaitlist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {language === 'en' ? 'Join the Waitlist' : 'انضم إلى قائمة الانتظار'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? "I'm a Patient" : 'أنا مريض'}
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <input
                    type="email"
                    placeholder={language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <input
                    type="tel"
                    placeholder={language === 'en' ? 'Phone' : 'الهاتف'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]">
                    <option>{language === 'en' ? 'Select Emirate' : 'اختر الإمارة'}</option>
                    <option>Dubai</option>
                    <option>Abu Dhabi</option>
                    <option>Sharjah</option>
                  </select>
                  <button className="w-full px-6 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors">
                    {language === 'en' ? 'Join as Patient' : 'انضم كمريض'}
                  </button>
                </form>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {language === 'en' ? "I'm a Doctor / Clinic" : 'أنا طبيب / عيادة'}
                </h3>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Full Name' : 'الاسم الكامل'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <input
                    type="email"
                    placeholder={language === 'en' ? 'Email' : 'البريد الإلكتروني'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]">
                    <option>{language === 'en' ? 'Role' : 'الدور'}</option>
                    <option>Doctor</option>
                    <option>Clinic Admin</option>
                  </select>
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Specialty / Clinic Name' : 'التخصص / اسم العيادة'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                  <button className="w-full px-6 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors">
                    {language === 'en' ? 'Join as Provider' : 'انضم كمزود'}
                  </button>
                </form>
              </div>
            </div>
            <button
              onClick={() => setShowWaitlist(false)}
              className="mt-6 w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {language === 'en' ? 'Close' : 'إغلاق'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
