import { useState, useEffect } from 'react';
import {
  Home, Calendar, FileText, Pill, FlaskConical, MessageSquare, Sparkles, User,
  Clock, Video, MapPin, Phone, Mail, Bell, Search, Filter, Download, Upload,
  Activity, Heart, TrendingUp, AlertCircle, Check, X, ChevronRight, Plus,
  Settings, LogOut, Menu, Shield, Award, Star, Send, Paperclip, CalendarPlus
} from 'lucide-react';
import { NotificationDropdown } from '../components/NotificationDropdown';
import { AppointmentScheduler } from '../components/AppointmentScheduler';
import { MyAppointments } from '../components/MyAppointments';
import { HealthRecordModal } from '../components/HealthRecordModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'records', label: 'Health Records', icon: FileText },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'labs', label: 'Lab Results', icon: FlaskConical },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  { id: 'profile', label: 'Profile', icon: User },
];

const APPOINTMENTS = [
  {
    id: 1,
    doctor: 'Dr. Layla Al Mansoori',
    specialty: 'Cardiologist',
    date: 'Today',
    time: '11:00 AM',
    type: 'In-Clinic',
    clinic: 'Dubai Heart Center',
    status: 'upcoming',
    location: 'Healthcare City, Dubai'
  },
  {
    id: 2,
    doctor: 'Dr. Rami Khalil',
    specialty: 'General Practitioner',
    date: 'Mar 15',
    time: '2:30 PM',
    type: 'Teleconsultation',
    clinic: 'HealthFirst Clinic',
    status: 'upcoming',
    location: 'Virtual'
  },
  {
    id: 3,
    doctor: 'Dr. Sara Nasser',
    specialty: 'Dermatologist',
    date: 'Mar 20',
    time: '10:00 AM',
    type: 'In-Clinic',
    clinic: 'Skin & Care Dubai',
    status: 'upcoming',
    location: 'Marina, Dubai'
  },
  {
    id: 4,
    doctor: 'Dr. Ahmed Farhan',
    specialty: 'Orthopedist',
    date: 'Feb 28',
    time: '9:00 AM',
    type: 'In-Clinic',
    clinic: 'City Medical Center',
    status: 'completed',
    location: 'Downtown Dubai'
  },
];

const PRESCRIPTIONS = [
  {
    id: 1,
    name: 'Metformin 500mg',
    frequency: 'Twice daily',
    duration: '3 months',
    doctor: 'Dr. Layla Al Mansoori',
    date: 'Mar 1, 2026',
    status: 'Active',
    refills: 2
  },
  {
    id: 2,
    name: 'Atorvastatin 20mg',
    frequency: 'Once daily',
    duration: 'Ongoing',
    doctor: 'Dr. Layla Al Mansoori',
    date: 'Jan 15, 2026',
    status: 'Active',
    refills: 1
  },
  {
    id: 3,
    name: 'Amoxicillin 500mg',
    frequency: 'Three times daily',
    duration: '7 days',
    doctor: 'Dr. Rami Khalil',
    date: 'Dec 10, 2025',
    status: 'Completed',
    refills: 0
  },
];

const LAB_RESULTS = [
  {
    id: 1,
    test: 'HbA1c',
    lab: 'LifeLab Dubai',
    date: 'Mar 2, 2026',
    result: '6.8%',
    status: 'Normal',
    range: '4.0-5.6%'
  },
  {
    id: 2,
    test: 'Lipid Panel',
    lab: 'LifeLab Dubai',
    date: 'Mar 2, 2026',
    result: 'See report',
    status: 'Review',
    range: 'Multiple values'
  },
  {
    id: 3,
    test: 'CBC (Complete Blood Count)',
    lab: 'AlMana Medical Lab',
    date: 'Jan 14, 2026',
    result: 'Normal range',
    status: 'Normal',
    range: 'Within limits'
  },
];

const HEALTH_RECORDS = [
  {
    id: 1,
    type: 'Medical Report',
    title: 'Cardiology Consultation',
    doctor: 'Dr. Layla Al Mansoori',
    date: 'Mar 1, 2026',
    size: '2.4 MB'
  },
  {
    id: 2,
    type: 'Lab Report',
    title: 'Blood Work - Comprehensive',
    doctor: 'LifeLab Dubai',
    date: 'Mar 2, 2026',
    size: '1.8 MB'
  },
  {
    id: 3,
    type: 'Imaging',
    title: 'Chest X-Ray',
    doctor: 'Radiology Center',
    date: 'Feb 15, 2026',
    size: '5.2 MB'
  },
];

const MESSAGES = [
  {
    id: 1,
    from: 'Dr. Layla Al Mansoori',
    subject: 'Follow-up on Recent Tests',
    preview: 'Your recent lab results look good. Let\'s discuss...',
    date: 'Today, 9:30 AM',
    unread: true
  },
  {
    id: 2,
    from: 'Dubai Heart Center',
    subject: 'Appointment Reminder',
    preview: 'This is a reminder for your upcoming appointment...',
    date: 'Yesterday',
    unread: false
  },
];

export default function PatientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apptFilter, setApptFilter] = useState('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [refreshAppointments, setRefreshAppointments] = useState(0);
  const [aiMessages, setAiMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your CeenAiX AI Health Assistant. How can I help you today?' }
  ]);
  const [aiInput, setAiInput] = useState('');

  const filteredAppointments = APPOINTMENTS.filter(apt => apt.status === apptFilter);

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages([...aiMessages,
      { role: 'user', text: aiInput },
      { role: 'ai', text: 'I understand your question. Based on your health profile, I recommend consulting with your doctor for personalized advice.' }
    ]);
    setAiInput('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome onBookAppointment={() => setShowBookingModal(true)} />;
      case 'appointments':
        return <MyAppointments />;
      case 'records':
        return <RecordsTab />;
      case 'prescriptions':
        return <PrescriptionsTab />;
      case 'labs':
        return <LabsTab />;
      case 'messages':
        return <MessagesTab />;
      case 'ai':
        return <AIAssistantTab messages={aiMessages} input={aiInput} setInput={setAiInput} sendMessage={sendAiMessage} />;
      case 'profile':
        return <ProfileTab />;
      default:
        return <DashboardHome onBookAppointment={() => setShowBookingModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <img
              src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
              alt="CeenAiX"
              className="h-10 w-auto"
            />
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-gray-900">Patient Portal</h1>
              <p className="text-xs text-gray-500">Welcome back, Parnia</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NotificationDropdown />
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                P
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-gray-900">Parnia Hassan</p>
                <p className="text-xs text-gray-500">Patient ID: P-2026-001</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-[73px] left-0 h-[calc(100vh-73px)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-30 overflow-y-auto`}>
          <nav className="p-4 space-y-1">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 mt-6 border-t border-gray-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all">
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>

      {showBookingModal && user && (
        <AppointmentScheduler
          onClose={() => setShowBookingModal(false)}
          onAppointmentBooked={() => {
            setShowBookingModal(false);
            setRefreshAppointments(prev => prev + 1);
          }}
          patientId={user.id}
        />
      )}
    </div>
  );
}

function DashboardHome({ onBookAppointment }: { onBookAppointment: () => void }) {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your health journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-semibold text-green-600">This month</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
          <p className="text-sm text-gray-600">Upcoming Appointments</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Pill className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-semibold text-blue-600">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">2</h3>
          <p className="text-sm text-gray-600">Active Prescriptions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-100 rounded-xl">
              <FlaskConical className="w-6 h-6 text-amber-600" />
            </div>
            <span className="text-sm font-semibold text-amber-600">Recent</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">3</h3>
          <p className="text-sm text-gray-600">Lab Results</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm font-semibold text-red-600">Good</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">78</h3>
          <p className="text-sm text-gray-600">Health Score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Appointments</h3>
          <div className="space-y-4">
            {APPOINTMENTS.filter(a => a.status === 'upcoming').slice(0, 3).map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl border border-teal-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                  {apt.doctor.charAt(4)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{apt.doctor}</p>
                  <p className="text-sm text-gray-600">{apt.specialty}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-700">{apt.date}</p>
                  <p className="text-xs text-gray-600">{apt.time}</p>
                </div>
                {apt.type === 'Teleconsultation' && (
                  <Video className="w-5 h-5 text-blue-600" />
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-3 text-sm font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition-all">
            View All Appointments
          </button>
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-6 shadow-lg text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={onBookAppointment}
              className="w-full flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Book Appointment</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <Upload className="w-5 h-5" />
              <span className="font-medium">Upload Records</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">Ask AI Assistant</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
              <Search className="w-5 h-5" />
              <span className="font-medium">Find Doctors</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Lab results uploaded</p>
              <p className="text-sm text-gray-600">HbA1c test results from LifeLab Dubai</p>
              <p className="text-xs text-gray-500 mt-1">Today, 10:30 AM</p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Appointment confirmed</p>
              <p className="text-sm text-gray-600">Dr. Layla Al Mansoori - Today at 11:00 AM</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday, 3:45 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Pill className="w-5 h-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Prescription renewed</p>
              <p className="text-sm text-gray-600">Metformin 500mg - 2 refills remaining</p>
              <p className="text-xs text-gray-500 mt-1">Mar 1, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsTab({ filter, setFilter, appointments, onBookAppointment, refreshTrigger }: any) {
  const { user } = useAuth();
  const [realAppointments, setRealAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, filter, refreshTrigger]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    const statusFilter = filter === 'upcoming' ? 'scheduled' : 'completed';

    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors!appointments_doctor_id_fkey (
          id,
          specialty
        )
      `)
      .eq('patient_id', user.id)
      .eq('status', statusFilter)
      .order('appointment_date', { ascending: filter === 'upcoming' });

    if (appointmentsData) {
      const appointmentsWithDoctorNames = await Promise.all(
        appointmentsData.map(async (apt) => {
          const { data: doctorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', apt.doctor_id)
            .single();

          return {
            ...apt,
            doctorName: doctorProfile?.full_name || 'Unknown Doctor',
            specialty: apt.doctor?.specialty || 'General'
          };
        })
      );

      setRealAppointments(appointmentsWithDoctorNames);
    }

    setLoading(false);
  };

  const handleToggleNotifications = async (appointmentId: string, enabled: boolean) => {
    await supabase
      .from('appointments')
      .update({ notifications_enabled: enabled })
      .eq('id', appointmentId);
  };

  const handleReschedule = (appointmentId: string) => {
    setRescheduleAppointmentId(appointmentId);
    setShowReschedule(true);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      fetchAppointments();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h2>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <button
          onClick={onBookAppointment}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Book Appointment
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'upcoming'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'completed'
              ? 'bg-teal-600 text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Past
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading appointments...</p>
          </div>
        ) : realAppointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No {filter} appointments</p>
            <button
              onClick={onBookAppointment}
              className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          realAppointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                    {apt.doctorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{apt.doctorName}</h3>
                    <p className="text-teal-700 font-semibold mb-2">{apt.specialty}</p>
                    {apt.reason && <p className="text-sm text-gray-600">{apt.reason}</p>}
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                  apt.type === 'teleconsultation'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {apt.type === 'teleconsultation' ? 'Teleconsultation' : 'In-Clinic'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>{formatDate(apt.appointment_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>{formatTime(apt.appointment_time)}</span>
                </div>
              </div>

              {filter === 'upcoming' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReschedule(apt.id)}
                      className="flex-1 px-4 py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all"
                    >
                      Reschedule
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleToggleNotifications(apt.id, !apt.notifications_enabled)}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                        apt.notifications_enabled
                          ? 'bg-[#0D7377] text-white hover:bg-[#0a5c5f]'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {apt.notifications_enabled ? (
                        <>
                          <Bell className="w-4 h-4" />
                          <span className="hidden sm:inline">On</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-4 h-4" />
                          <span className="hidden sm:inline">Off</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        const startDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
                        const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                        const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                        const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${apt.doctorName}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(`Reason: ${apt.reason || 'Consultation'}\nSpecialty: ${apt.specialty}`)}&location=${encodeURIComponent('CeenAiX Medical Center')}`;
                        window.open(googleCalUrl, '_blank');
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <CalendarPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Google</span>
                    </button>

                    <button
                      onClick={() => {
                        const startDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
                        const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                        const formatDateForCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                        const icsContent = [
                          'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CeenAiX//Appointment//EN', 'BEGIN:VEVENT',
                          `DTSTART:${formatDateForCal(startDateTime)}`, `DTEND:${formatDateForCal(endDateTime)}`,
                          `SUMMARY:Appointment with ${apt.doctorName}`, `DESCRIPTION:${apt.reason || 'Consultation'}\\nSpecialty: ${apt.specialty}`,
                          `LOCATION:CeenAiX Medical Center`, 'STATUS:CONFIRMED',
                          'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', `DESCRIPTION:Appointment with ${apt.doctorName} in 1 hour`, 'END:VALARM',
                          'END:VEVENT', 'END:VCALENDAR'
                        ].join('\r\n');
                        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                        const link = document.createElement('a');
                        link.href = window.URL.createObjectURL(blob);
                        link.download = `appointment-${apt.appointment_date}.ics`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">.ics</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showReschedule && user && (
        <AppointmentScheduler
          onClose={() => setShowReschedule(false)}
          onAppointmentBooked={() => {
            setShowReschedule(false);
            fetchAppointments();
          }}
          patientId={user.id}
        />
      )}
    </div>
  );
}

function RecordsTab() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchHealthRecords();
    }
  }, [user]);

  const fetchHealthRecords = async () => {
    if (!user) return;

    setLoading(true);

    const { data: patientData } = await supabase
      .from('patients')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (patientData) {
      const { data: recordsData, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('recorded_date', { ascending: false });

      if (recordsData && !error) {
        setRecords(recordsData);
      }
    }

    setLoading(false);
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'medical_report':
        return { icon: FileText, color: 'bg-blue-100 text-blue-600' };
      case 'lab_report':
        return { icon: FlaskConical, color: 'bg-green-100 text-green-600' };
      case 'imaging':
        return { icon: Activity, color: 'bg-purple-100 text-purple-600' };
      case 'prescription':
        return { icon: Pill, color: 'bg-amber-100 text-amber-600' };
      default:
        return { icon: FileText, color: 'bg-teal-100 text-teal-600' };
    }
  };

  const recordTypes = [
    { value: 'all', label: 'All Records' },
    { value: 'medical_report', label: 'Medical Reports' },
    { value: 'lab_report', label: 'Lab Reports' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'prescription', label: 'Prescriptions' },
    { value: 'consultation_notes', label: 'Consultation Notes' },
  ];

  const filteredRecords = filterType === 'all'
    ? records
    : records.filter(r => r.record_type === filterType);

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Health Records</h2>
            <p className="text-gray-600">Your medical documents and reports</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all">
            <Upload className="w-5 h-5" />
            Upload Record
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {recordTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setFilterType(type.value)}
              className={`px-5 py-2.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                filterType === type.value
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
            <p className="text-gray-500">Loading health records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No health records found</p>
            <p className="text-sm text-gray-500">Upload your first health record to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map(record => {
              const { icon: Icon, color } = getRecordIcon(record.record_type);
              return (
                <div key={record.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-3 ${color} rounded-xl flex-shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{record.title}</h3>
                        <p className="text-sm text-gray-600 mt-0.5">{record.provider_name || 'Healthcare Provider'}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full font-semibold">
                            {record.record_type.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-600/30 group-hover:shadow-xl"
                      >
                        View Details
                      </button>
                    </div>
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

      {selectedRecord && (
        <HealthRecordModal
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}

function PrescriptionsTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          My Medications
        </h2>
        <p className="text-gray-600 text-lg">Manage your prescriptions, request refills, and track your medications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <Pill className="w-8 h-8 text-white/90 mb-3" />
            <div className="text-sm text-white/80 font-semibold tracking-wide mb-2">ACTIVE MEDICATIONS</div>
            <div className="text-4xl font-extrabold text-white">
              {PRESCRIPTIONS.filter(p => p.status === 'Active').length}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <Download className="w-8 h-8 text-white/90 mb-3" />
            <div className="text-sm text-white/80 font-semibold tracking-wide mb-2">REFILLS AVAILABLE</div>
            <div className="text-4xl font-extrabold text-white">
              {PRESCRIPTIONS.reduce((sum, p) => sum + p.refills, 0)}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <Clock className="w-8 h-8 text-white/90 mb-3" />
            <div className="text-sm text-white/80 font-semibold tracking-wide mb-2">PENDING REFILLS</div>
            <div className="text-4xl font-extrabold text-white">0</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <MapPin className="w-8 h-8 text-white/90 mb-3" />
            <div className="text-sm text-white/80 font-semibold tracking-wide mb-2">PREFERRED PHARMACY</div>
            <div className="text-base font-bold text-white truncate">Dubai Pharmacy</div>
            <button className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold text-white transition-all">
              Change
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-5">Active Prescriptions</h3>
        <div className="grid gap-5">
          {PRESCRIPTIONS.filter(rx => rx.status === 'Active').map(rx => (
            <div key={rx.id} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Pill className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{rx.name}</h3>
                    <p className="text-sm text-gray-600">
                      {rx.frequency} • {rx.duration}
                    </p>
                  </div>
                </div>
                <span className="px-4 py-2 rounded-full text-xs font-bold bg-green-100 text-green-700">
                  {rx.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">PRESCRIBING DOCTOR</p>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <p className="text-sm font-semibold text-gray-900">{rx.doctor}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">PRESCRIBED DATE</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <p className="text-sm font-semibold text-gray-900">{rx.date}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-2">REFILLS REMAINING</p>
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl text-white text-lg font-extrabold shadow-lg shadow-green-500/30">
                    {rx.refills}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:-translate-y-0.5">
                  <Send className="w-5 h-5" />
                  Request Refill
                </button>
                <button className="px-5 py-3 border-2 border-gray-200 hover:border-purple-600 text-gray-700 hover:text-purple-700 font-bold rounded-xl transition-all hover:bg-purple-50">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="px-5 py-3 border-2 border-gray-200 hover:border-green-600 text-gray-700 hover:text-green-700 font-bold rounded-xl transition-all hover:bg-green-50">
                  <CalendarPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LabsTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Lab Results</h2>
        <p className="text-gray-600">Your laboratory test results</p>
      </div>

      <div className="grid gap-4">
        {LAB_RESULTS.map(lab => (
          <div key={lab.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  lab.status === 'Normal' ? 'bg-green-100' : 'bg-amber-100'
                }`}>
                  <FlaskConical className={`w-6 h-6 ${
                    lab.status === 'Normal' ? 'text-green-600' : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{lab.test}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lab.lab} • {lab.date}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                lab.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {lab.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Result</p>
                <p className="text-lg font-bold text-gray-900">{lab.result}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Reference Range</p>
                <p className="text-sm font-semibold text-gray-600">{lab.range}</p>
              </div>
            </div>

            <button className="w-full py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all">
              View Full Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Messages</h2>
        <p className="text-gray-600">Communication with healthcare providers</p>
      </div>

      <div className="grid gap-4">
        {MESSAGES.map(msg => (
          <div key={msg.id} className={`bg-white rounded-2xl p-6 shadow-lg border transition-all cursor-pointer hover:shadow-xl ${
            msg.unread ? 'border-teal-200 bg-teal-50/30' : 'border-gray-100'
          }`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {msg.from.charAt(4)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{msg.from}</h3>
                  <p className="text-sm font-semibold text-teal-700 mt-1">{msg.subject}</p>
                  <p className="text-sm text-gray-600 mt-2">{msg.preview}</p>
                </div>
              </div>
              {msg.unread && (
                <span className="w-3 h-3 bg-teal-600 rounded-full"></span>
              )}
            </div>
            <p className="text-xs text-gray-500">{msg.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AIAssistantTab({ messages, input, setInput, sendMessage }: any) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[calc(100vh-200px)] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Health Assistant</h2>
              <p className="text-sm text-gray-600">Ask me anything about your health</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg: any, idx: number) => (
            <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div className={`max-w-2xl px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your health question..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h2>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold">
            P
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Parnia Hassan</h3>
            <p className="text-gray-600">Patient ID: P-2026-001</p>
            <button className="mt-2 text-sm text-teal-700 font-semibold hover:underline">
              Change Photo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input type="text" value="Parnia Hassan" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
            <input type="text" value="January 15, 1990" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" value="parnia.hassan@email.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input type="tel" value="+971 50 123 4567" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input type="text" value="Dubai Marina, Dubai, UAE" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all">
            Save Changes
          </button>
          <button className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    type: 'In-Clinic',
    reason: ''
  });

  const specialties = ['Cardiology', 'General Practice', 'Dermatology', 'Orthopedics', 'Pediatrics', 'Neurology'];
  const availableTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Book New Appointment</h3>
            <p className="text-sm text-gray-600 mt-1">Schedule your healthcare visit</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Specialty
            </label>
            <select
              required
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a specialty</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Doctor Name (Optional)
            </label>
            <input
              type="text"
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              placeholder="Leave empty for any available doctor"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Time
              </label>
              <select
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Select time</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Appointment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'In-Clinic' })}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'In-Clinic'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In-Clinic Visit
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'Teleconsultation' })}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${
                  formData.type === 'Teleconsultation'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Teleconsultation
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Visit
            </label>
            <textarea
              required
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Please describe your symptoms or reason for visit"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all"
            >
              Book Appointment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
