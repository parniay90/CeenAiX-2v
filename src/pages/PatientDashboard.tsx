import { useState } from 'react';
import {
  Home, Calendar, FileText, Pill, FlaskConical, MessageSquare, Sparkles, User,
  Clock, Video, MapPin, Phone, Mail, Bell, Search, Filter, Download, Upload,
  Activity, Heart, TrendingUp, AlertCircle, Check, X, ChevronRight, Plus,
  Settings, LogOut, Menu, Shield, Award, Star, Send, Paperclip
} from 'lucide-react';
import { NotificationDropdown } from '../components/NotificationDropdown';

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
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [apptFilter, setApptFilter] = useState('upcoming');
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
        return <DashboardHome />;
      case 'appointments':
        return <AppointmentsTab filter={apptFilter} setFilter={setApptFilter} appointments={filteredAppointments} />;
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
        return <DashboardHome />;
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
    </div>
  );
}

function DashboardHome() {
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
            <button className="w-full flex items-center gap-3 p-4 bg-white/20 hover:bg-white/30 rounded-xl transition-all">
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

function AppointmentsTab({ filter, setFilter, appointments }: any) {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h2>
          <p className="text-gray-600">Manage your healthcare appointments</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-lg transition-all">
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
        {appointments.map((apt: any) => (
          <div key={apt.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl">
                  {apt.doctor.charAt(4)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{apt.doctor}</h3>
                  <p className="text-teal-700 font-semibold mb-2">{apt.specialty}</p>
                  <p className="text-sm text-gray-600">{apt.clinic}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                apt.type === 'Teleconsultation'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-green-100 text-green-700'
              }`}>
                {apt.type}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span>{apt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{apt.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>{apt.location}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {apt.type === 'Teleconsultation' && (
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">
                  <Video className="w-5 h-5" />
                  Join Video Call
                </button>
              )}
              <button className="flex-1 px-4 py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all">
                View Details
              </button>
              <button className="px-4 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecordsTab() {
  return (
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

      <div className="grid gap-4">
        {HEALTH_RECORDS.map(record => (
          <div key={record.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 rounded-xl">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{record.title}</h3>
                  <p className="text-sm text-gray-600">{record.doctor}</p>
                  <p className="text-xs text-gray-500 mt-1">{record.date} • {record.size}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrescriptionsTab() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Prescriptions</h2>
        <p className="text-gray-600">Manage your medications</p>
      </div>

      <div className="grid gap-4">
        {PRESCRIPTIONS.map(rx => (
          <div key={rx.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Pill className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{rx.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">Prescribed by {rx.doctor}</p>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                rx.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {rx.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Frequency</p>
                <p className="text-sm font-semibold text-gray-900">{rx.frequency}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="text-sm font-semibold text-gray-900">{rx.duration}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Refills</p>
                <p className="text-sm font-semibold text-gray-900">{rx.refills} remaining</p>
              </div>
            </div>

            {rx.status === 'Active' && (
              <button className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all">
                Request Refill
              </button>
            )}
          </div>
        ))}
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
