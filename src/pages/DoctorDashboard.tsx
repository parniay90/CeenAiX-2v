import React, { useState } from 'react';
import { Home, Calendar, Users, FileText, TestTube, MessageCircle, DollarSign, Settings, Bell, User, CheckCircle, Brain } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { useLanguage } from '../contexts/LanguageContext';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { DoctorAIAssistant } from '../components/DoctorAIAssistant';

type Section = 'home' | 'today' | 'schedule' | 'patients' | 'prescriptions' | 'labs' | 'messages' | 'earnings' | 'profile' | 'settings' | 'ai-assistant';

export function DoctorDashboard() {
  const { language } = useLanguage();
  const userName = 'Ahmed Al Mansoori';
  const [activeSection, setActiveSection] = useState<Section>('home');

  const sidebarItems = [
    { id: 'home', label: language === 'en' ? 'Dashboard' : 'لوحة التحكم', icon: Home },
    { id: 'ai-assistant', label: language === 'en' ? 'AI Assistant' : 'مساعد الذكاء الاصطناعي', icon: Brain },
    { id: 'today', label: language === 'en' ? "Today's Appointments" : 'مواعيد اليوم', icon: Calendar },
    { id: 'schedule', label: language === 'en' ? 'Upcoming Schedule' : 'الجدول القادم', icon: Calendar },
    { id: 'patients', label: language === 'en' ? 'Patient Records' : 'سجلات المرضى', icon: Users },
    { id: 'prescriptions', label: language === 'en' ? 'Prescriptions' : 'الوصفات', icon: FileText },
    { id: 'labs', label: language === 'en' ? 'Lab Referrals' : 'إحالات المختبر', icon: TestTube },
    { id: 'messages', label: language === 'en' ? 'Messages' : 'الرسائل', icon: MessageCircle },
    { id: 'earnings', label: language === 'en' ? 'Earnings' : 'الأرباح', icon: DollarSign },
    { id: 'profile', label: language === 'en' ? 'My Profile' : 'ملفي الشخصي', icon: User },
    { id: 'settings', label: language === 'en' ? 'Settings' : 'الإعدادات', icon: Settings },
  ];

  const todayAppointments = [
    { time: '9:00 AM', patient: 'Ahmed Hassan', type: 'In-clinic', status: 'Completed' },
    { time: '10:00 AM', patient: 'Sara Mohammed', type: 'In-clinic', status: 'Completed' },
    { time: '11:30 AM', patient: 'Omar Al Zaabi', type: 'Teleconsultation', status: 'In Progress' },
    { time: '2:00 PM', patient: 'Fatima Al Amiri', type: 'In-clinic', status: 'Scheduled' },
    { time: '3:30 PM', patient: 'Mohammed Ali', type: 'In-clinic', status: 'Scheduled' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar items={sidebarItems} activeItem={activeSection} onNavigate={(id) => setActiveSection(id as Section)} />

      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'en' ? `Dr. ${userName || 'Doctor'}` : `د. ${userName || 'طبيب'}`}
          </h1>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="w-10 h-10 bg-[#0D7377] rounded-full flex items-center justify-center text-white font-semibold">
              {userName?.charAt(0) || 'D'}
            </div>
          </div>
        </div>

        <div className="p-8">
          {activeSection === 'ai-assistant' && (
            <DoctorAIAssistant
              patientId="00000000-0000-0000-0000-000000000001"
            />
          )}

          {activeSection === 'home' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? `Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, Dr. ${userName || 'Doctor'}` : `${new Date().getHours() < 12 ? 'صباح الخير' : 'مساء الخير'}, د. ${userName || 'طبيب'}`}
                </h1>
                <p className="text-gray-600">
                  {language === 'en' ? 'You have 8 appointments today.' : 'لديك 8 مواعيد اليوم.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  icon={Calendar}
                  label={language === 'en' ? 'Appointments Today' : 'مواعيد اليوم'}
                  value={8}
                  trend={language === 'en' ? '+2 from yesterday' : '+2 من الأمس'}
                />
                <StatCard
                  icon={MessageCircle}
                  label={language === 'en' ? 'Pending Messages' : 'الرسائل المعلقة'}
                  value={12}
                />
                <StatCard
                  icon={TestTube}
                  label={language === 'en' ? 'Unread Lab Results' : 'نتائج المختبر غير المقروءة'}
                  value={5}
                />
                <StatCard
                  icon={DollarSign}
                  label={language === 'en' ? 'Earnings This Month' : 'الأرباح هذا الشهر'}
                  value="AED 45,000"
                  color="#10B981"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'en' ? "Today's Schedule" : 'جدول اليوم'}
                  </h2>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                    {todayAppointments.map((apt, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-900">{apt.time}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{apt.patient}</p>
                            <p className="text-sm text-gray-600">{apt.type}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          apt.status === 'Completed' ? 'bg-green-50 text-green-700' :
                          apt.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">
                    {language === 'en' ? 'Recent Activity' : 'النشاط الأخير'}
                  </h2>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                    {[
                      { text: 'Lab result received for Ahmed Hassan', time: '30 minutes ago', icon: TestTube },
                      { text: 'Prescription sent to Sara Mohammed', time: '1 hour ago', icon: FileText },
                      { text: 'New message from Omar Al Zaabi', time: '2 hours ago', icon: MessageCircle },
                      { text: 'Appointment completed with Fatima Al Amiri', time: '3 hours ago', icon: CheckCircle },
                    ].map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div key={idx} className="p-4 flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#0D7377] bg-opacity-10 rounded-full flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[#0D7377]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{activity.text}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'today' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'en' ? "Today's Appointments" : 'مواعيد اليوم'}
              </h1>

              <div className="space-y-4">
                {todayAppointments.map((apt, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#14BDBD] rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {apt.patient.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{apt.patient}</h3>
                          <p className="text-sm text-gray-600">{apt.time} • {apt.type}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        apt.status === 'Completed' ? 'bg-green-50 text-green-700' :
                        apt.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    {apt.status === 'Scheduled' && (
                      <button className="w-full px-4 py-3 bg-[#0D7377] text-white rounded-lg font-medium hover:bg-[#0a5c5f] transition-colors">
                        {language === 'en' ? 'Start Consultation' : 'بدء الاستشارة'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'patients' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'en' ? 'Patient Records' : 'سجلات المرضى'}
              </h1>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search by name or Emirates ID...' : 'ابحث بالاسم أو الهوية الإماراتية...'}
                  className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['Ahmed Hassan', 'Sara Mohammed', 'Omar Al Zaabi', 'Fatima Al Amiri'].map((patient, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 bg-[#14BDBD] rounded-full flex items-center justify-center text-white font-semibold text-xl">
                        {patient.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient}</h3>
                        <p className="text-sm text-gray-600">
                          {language === 'en' ? 'Last visit:' : 'آخر زيارة:'} Mar {idx + 1}, 2026
                        </p>
                      </div>
                    </div>
                    <button className="w-full px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg font-medium hover:bg-[#0D7377] hover:text-white transition-all">
                      {language === 'en' ? 'View Full Record' : 'عرض السجل الكامل'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'prescriptions' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'en' ? 'Prescriptions' : 'الوصفات'}
              </h1>

              <button className="mb-6 px-6 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f]">
                {language === 'en' ? '+ Write New Prescription' : '+ كتابة وصفة جديدة'}
              </button>

              <div className="space-y-4">
                {[1, 2, 3].map((idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {idx === 1 ? 'Ahmed Hassan' : idx === 2 ? 'Sara Mohammed' : 'Omar Al Zaabi'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">Mar {idx}, 2026 • Lisinopril 10mg, Atorvastatin 20mg</p>
                        <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      <button className="px-4 py-2 text-[#0D7377] hover:bg-[#0D7377] hover:text-white border border-[#0D7377] rounded-lg font-medium transition-all">
                        {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'earnings' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'en' ? 'Earnings & Payments' : 'الأرباح والمدفوعات'}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard
                  icon={DollarSign}
                  label={language === 'en' ? 'Total Earned' : 'إجمالي الأرباح'}
                  value="AED 145,000"
                  color="#10B981"
                />
                <StatCard
                  icon={DollarSign}
                  label={language === 'en' ? 'Pending' : 'معلق'}
                  value="AED 12,500"
                  color="#F59E0B"
                />
                <StatCard
                  icon={DollarSign}
                  label={language === 'en' ? 'Paid Out' : 'مدفوع'}
                  value="AED 132,500"
                  color="#0D7377"
                />
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {language === 'en' ? 'Payment History' : 'سجل المدفوعات'}
                  </h2>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:border-[#0D7377]">
                    {language === 'en' ? 'Export CSV' : 'تصدير CSV'}
                  </button>
                </div>
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">March {idx}, 2026</p>
                        <p className="text-sm text-gray-600">
                          {idx % 2 === 0 ? 'Card Payment' : 'Insurance Claim'}
                        </p>
                      </div>
                      <p className="text-lg font-semibold text-[#0D7377]">
                        AED {(idx * 250 + 500).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'profile' && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {language === 'en' ? 'My Profile' : 'ملفي الشخصي'}
              </h1>

              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-[#0D7377] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {userName?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dr. {userName || 'Doctor'}</h2>
                    <p className="text-gray-600">Cardiology Specialist</p>
                    <div className="flex items-center gap-2 mt-2">
                      <CheckCircle className="w-5 h-5 text-[#0D7377]" fill="#0D7377" />
                      <span className="text-sm text-[#0D7377] font-medium">DHA Verified</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Specialty' : 'التخصص'}
                    </label>
                    <input
                      type="text"
                      defaultValue="Cardiology"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'DHA License Number' : 'رقم ترخيص DHA'}
                    </label>
                    <input
                      type="text"
                      defaultValue="DHA-12345678"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Years of Experience' : 'سنوات الخبرة'}
                    </label>
                    <input
                      type="number"
                      defaultValue="15"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'Languages' : 'اللغات'}
                    </label>
                    <input
                      type="text"
                      defaultValue="English, Arabic"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'en' ? 'Bio' : 'السيرة الذاتية'}
                  </label>
                  <textarea
                    rows={4}
                    defaultValue="Board-certified cardiologist with over 15 years of experience in interventional cardiology. Specialized in complex coronary interventions and structural heart disease."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377]"
                  />
                </div>

                <button className="mt-6 px-8 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f]">
                  {language === 'en' ? 'Update Profile' : 'تحديث الملف'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
