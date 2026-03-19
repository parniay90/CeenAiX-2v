import { useState, useEffect } from 'react';
import { Home, Calendar, FileText, Settings, Bell, Heart, Activity, TrendingUp, Clock, CircleUser as UserCircle, ChevronRight, Sparkles, Pill, FlaskConical, Stethoscope, MessageCircle, Plus, ArrowRight, Zap, Shield, BarChart3, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { MyAppointments } from '../components/MyAppointments';
import { HealthRecordModal } from '../components/HealthRecordModal';
import { EmergencyButton } from '../components/EmergencyButton';

export default function CeenAiXPatientDashboard({ onNavigateHome }) {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 18) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');

    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
      setProfile({ full_name: 'Demo User' });
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileData) setProfile(profileData);

    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (patientData) {
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select(`
          *,
          doctor:doctors(id, specialty, sub_specialty),
          clinic:clinics(name, address)
        `)
        .eq('patient_id', patientData.id)
        .order('appointment_date', { ascending: true })
        .limit(5);

      const { data: recordsData } = await supabase
        .from('health_records')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('recorded_date', { ascending: false })
        .limit(6);

      if (appointmentsData) setAppointments(appointmentsData);
      if (recordsData) setHealthRecords(recordsData);
    }

    setLoading(false);
  };

  const DashboardView = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 animate-in slide-in-from-left duration-700">
            {timeOfDay === 'morning' && <Sun className="w-8 h-8 text-yellow-300 animate-pulse" />}
            {timeOfDay === 'afternoon' && <Sun className="w-8 h-8 text-orange-300" />}
            {timeOfDay === 'evening' && <Moon className="w-8 h-8 text-blue-200" />}
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Good {timeOfDay}, {profile?.full_name?.split(' ')[0] || 'there'}!
            </h1>
          </div>
          <p className="text-white/90 text-lg mb-6 animate-in slide-in-from-left duration-700 delay-100">
            Your health journey continues today. Let's make it great!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { icon: Heart, label: 'Health Score', value: '94%', color: 'bg-red-500/20 text-red-100', delay: '200' },
              { icon: Activity, label: 'Active Days', value: '28', color: 'bg-green-500/20 text-green-100', delay: '300' },
              { icon: Calendar, label: 'Upcoming', value: appointments.length, color: 'bg-blue-500/20 text-blue-100', delay: '400' },
              { icon: FileText, label: 'Records', value: healthRecords.length, color: 'bg-purple-500/20 text-purple-100', delay: '500' }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`${stat.color} backdrop-blur-sm rounded-2xl p-4 border border-white/20 transform hover:scale-105 transition-all duration-300 cursor-pointer animate-in slide-in-from-bottom duration-700`}
                style={{ animationDelay: `${stat.delay}ms` }}
              >
                <stat.icon className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Calendar,
            title: 'Book Appointment',
            desc: 'Schedule with top doctors',
            gradient: 'from-blue-500 to-cyan-500',
            action: () => setActiveTab('appointments')
          },
          {
            icon: FileText,
            title: 'View Records',
            desc: 'Access your health data',
            gradient: 'from-purple-500 to-pink-500',
            action: () => setActiveTab('records')
          },
          {
            icon: MessageCircle,
            title: 'AI Assistant',
            desc: 'Get instant health insights',
            gradient: 'from-teal-500 to-green-500',
            action: () => {}
          }
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className={`group relative overflow-hidden bg-gradient-to-br ${action.gradient} rounded-2xl p-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 text-left animate-in slide-in-from-bottom duration-500`}
            style={{ animationDelay: `${idx * 100 + 600}ms` }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <action.icon className="w-12 h-12 text-white mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <h3 className="text-xl font-bold text-white mb-2 relative z-10">{action.title}</h3>
            <p className="text-white/80 text-sm relative z-10">{action.desc}</p>
            <ArrowRight className="absolute bottom-4 right-4 w-6 h-6 text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 animate-in slide-in-from-bottom duration-500 delay-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Appointments</h2>
              <p className="text-gray-600 text-sm">Your scheduled consultations</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('appointments')}
            className="text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No upcoming appointments</p>
            <button
              onClick={() => setActiveTab('appointments')}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((apt, idx) => (
              <div
                key={apt.id}
                className="group bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 rounded-2xl p-5 border-2 border-transparent hover:border-teal-200 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${idx * 100 + 800}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {new Date(apt.appointment_date).getDate()}
                      <span className="text-xs ml-1">
                        {new Date(apt.appointment_date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{apt.doctor?.specialty || 'Consultation'}</h3>
                      <p className="text-gray-600 text-sm">{apt.clinic?.name || 'Medical Center'}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {apt.appointment_time}
                        </span>
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 animate-in slide-in-from-bottom duration-500 delay-900">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Health Records</h2>
              <p className="text-gray-600 text-sm">Your latest medical documents</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('records')}
            className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2 group"
          >
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {healthRecords.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No health records yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {healthRecords.slice(0, 6).map((record, idx) => {
              const icons = {
                medical_report: { icon: Stethoscope, color: 'from-blue-500 to-cyan-500' },
                lab_report: { icon: FlaskConical, color: 'from-green-500 to-emerald-500' },
                imaging: { icon: Activity, color: 'from-purple-500 to-pink-500' },
                prescription: { icon: Pill, color: 'from-amber-500 to-orange-500' }
              };
              const { icon: Icon, color } = icons[record.record_type] || icons.medical_report;

              return (
                <button
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="group bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 rounded-2xl p-5 border-2 border-gray-100 hover:border-teal-200 transition-all duration-300 text-left transform hover:scale-105 hover:shadow-xl animate-in slide-in-from-bottom duration-500"
                  style={{ animationDelay: `${idx * 100 + 1000}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
                    {record.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{record.provider_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-3xl p-8 shadow-2xl text-white animate-in slide-in-from-bottom duration-500 delay-1100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Zap className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">Daily Health Tip</h3>
            <p className="text-white/90 text-lg leading-relaxed">
              Stay hydrated! Drinking 8 glasses of water daily helps maintain energy levels,
              supports digestion, and keeps your skin healthy. Set reminders if needed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const AppointmentsView = () => (
    <div className="animate-in fade-in slide-in-from-right duration-500">
      <MyAppointments />
    </div>
  );

  const RecordsView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Records</h2>
          <p className="text-gray-600">Your complete medical history</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
          <Plus className="w-5 h-5" />
          Upload Record
        </button>
      </div>

      {healthRecords.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
          <FileText className="w-20 h-20 text-gray-300 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600 mb-2 text-lg">No health records found</p>
          <p className="text-sm text-gray-500">Upload your first health record to get started</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {healthRecords.map((record, idx) => {
            const icons = {
              medical_report: { icon: Stethoscope, color: 'bg-blue-100 text-blue-600' },
              lab_report: { icon: FlaskConical, color: 'bg-green-100 text-green-600' },
              imaging: { icon: Activity, color: 'bg-purple-100 text-purple-600' },
              prescription: { icon: Pill, color: 'bg-amber-100 text-amber-600' }
            };
            const { icon: Icon, color } = icons[record.record_type] || icons.medical_report;

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-teal-200 hover:shadow-2xl transition-all group cursor-pointer transform hover:scale-[1.02] animate-in slide-in-from-left duration-500"
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => setSelectedRecord(record)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-4 ${color} rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-teal-600 transition-colors">
                        {record.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{record.provider_name || 'Healthcare Provider'}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full font-semibold">
                          {record.record_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-2 transition-all flex-shrink-0 ml-4" />
                </div>
                {record.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-600 line-clamp-2">{record.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  CeenAiX
                </h1>
                <p className="text-xs text-gray-600">Your Health Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors group">
                <Bell className="w-6 h-6 text-gray-600 group-hover:text-teal-600 transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{profile?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-600">Patient Portal</p>
                </div>
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {profile?.full_name?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white/60 backdrop-blur-lg border-b border-gray-200 sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-4 overflow-x-auto">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'appointments', icon: Calendar, label: 'Appointments' },
              { id: 'records', icon: FileText, label: 'Health Records' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-600/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-teal-200'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'appointments' && <AppointmentsView />}
        {activeTab === 'records' && <RecordsView />}
      </main>

      {selectedRecord && (
        <HealthRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}

      <EmergencyButton />
    </div>
  );
}
