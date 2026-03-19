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

const mockTestOrders = [
  {
    id: '1',
    test_type_id: '1',
    order_date: '2026-03-10T10:00:00',
    scheduled_date: '2026-03-12T10:00:00',
    status: 'Completed',
    priority: 'Normal',
    notes: '',
    test_types: {
      name: 'Complete Blood Count (CBC)',
      category: 'Hematology',
      description: 'Comprehensive blood panel measuring red and white blood cells, platelets, and hemoglobin'
    },
    lab_facilities: {
      name: 'Quest Diagnostics',
      address: '123 Medical Center Dr',
      city: 'New York'
    }
  },
  {
    id: '2',
    test_type_id: '2',
    order_date: '2026-03-08T14:00:00',
    scheduled_date: '2026-03-10T14:00:00',
    status: 'Completed',
    priority: 'Normal',
    notes: '',
    test_types: {
      name: 'Lipid Panel',
      category: 'Chemistry',
      description: 'Cholesterol and triglycerides screening'
    },
    lab_facilities: {
      name: 'LabCorp',
      address: '456 Health Plaza',
      city: 'New York'
    }
  },
  {
    id: '3',
    test_type_id: '3',
    order_date: '2026-03-15T09:00:00',
    scheduled_date: '2026-03-18T09:00:00',
    status: 'Processing',
    priority: 'Normal',
    notes: '',
    test_types: {
      name: 'Thyroid Function Test',
      category: 'Endocrinology',
      description: 'TSH, T3, and T4 levels'
    },
    lab_facilities: {
      name: 'BioReference Laboratories',
      address: '789 Medical Pkwy',
      city: 'New York'
    }
  },
  {
    id: '4',
    test_type_id: '4',
    order_date: '2026-02-28T11:00:00',
    scheduled_date: '2026-03-02T11:00:00',
    status: 'Completed',
    priority: 'Normal',
    notes: '',
    test_types: {
      name: 'Vitamin D Test',
      category: 'Chemistry',
      description: 'Measures vitamin D levels in blood'
    },
    lab_facilities: {
      name: 'Quest Diagnostics',
      address: '123 Medical Center Dr',
      city: 'New York'
    }
  }
];

const mockTestResults: { [key: string]: any } = {
  '1': {
    id: 'r1',
    test_order_id: '1',
    result_date: '2026-03-13T10:00:00',
    result_data: {
      'White Blood Cells': {
        value: 7.5,
        unit: 'K/uL',
        reference_range: '4.0-11.0',
        status: 'Normal'
      },
      'Red Blood Cells': {
        value: 4.8,
        unit: 'M/uL',
        reference_range: '4.2-5.9',
        status: 'Normal'
      },
      'Hemoglobin': {
        value: 14.2,
        unit: 'g/dL',
        reference_range: '12.0-16.0',
        status: 'Normal'
      },
      'Hematocrit': {
        value: 42.5,
        unit: '%',
        reference_range: '36.0-48.0',
        status: 'Normal'
      },
      'Platelets': {
        value: 245,
        unit: 'K/uL',
        reference_range: '150-400',
        status: 'Normal'
      }
    },
    doctor_interpretation: 'Your Complete Blood Count results are within normal ranges. All blood cell counts, including white blood cells, red blood cells, and platelets, are healthy and functioning properly. This indicates good overall health with no signs of anemia, infection, or blood disorders.',
    doctor_recommendations: 'Continue maintaining your current healthy lifestyle. Ensure adequate hydration, balanced nutrition rich in iron and vitamins, and regular physical activity. Schedule routine follow-up testing in 6 months as part of your preventive care plan.',
    follow_up_tests: [],
    status: 'Final',
    attachments: []
  },
  '2': {
    id: 'r2',
    test_order_id: '2',
    result_date: '2026-03-11T14:00:00',
    result_data: {
      'Total Cholesterol': {
        value: 195,
        unit: 'mg/dL',
        reference_range: '<200',
        status: 'Normal'
      },
      'LDL Cholesterol': {
        value: 115,
        unit: 'mg/dL',
        reference_range: '<100',
        status: 'High'
      },
      'HDL Cholesterol': {
        value: 58,
        unit: 'mg/dL',
        reference_range: '>40',
        status: 'Normal'
      },
      'Triglycerides': {
        value: 110,
        unit: 'mg/dL',
        reference_range: '<150',
        status: 'Normal'
      },
      'VLDL Cholesterol': {
        value: 22,
        unit: 'mg/dL',
        reference_range: '5-40',
        status: 'Normal'
      }
    },
    doctor_interpretation: 'Your lipid panel shows generally good results with total cholesterol and triglycerides in healthy ranges. However, your LDL (bad cholesterol) is slightly elevated at 115 mg/dL, which is above the optimal level of 100 mg/dL. Your HDL (good cholesterol) is at a healthy level.',
    doctor_recommendations: 'To lower your LDL cholesterol, consider increasing dietary fiber intake, reducing saturated fats, and incorporating more omega-3 fatty acids. Regular aerobic exercise (30 minutes daily) can also help. We should recheck your lipid panel in 3 months to monitor progress. If levels remain elevated, we may discuss statin therapy.',
    follow_up_tests: ['Lipid Panel'],
    status: 'Final',
    attachments: []
  },
  '4': {
    id: 'r4',
    test_order_id: '4',
    result_date: '2026-03-03T11:00:00',
    result_data: {
      'Vitamin D, 25-Hydroxy': {
        value: 28,
        unit: 'ng/mL',
        reference_range: '30-100',
        status: 'Low'
      }
    },
    doctor_interpretation: 'Your Vitamin D level is slightly below the optimal range at 28 ng/mL. Vitamin D insufficiency is common, especially in winter months or with limited sun exposure. Low vitamin D can affect bone health, immune function, and overall energy levels.',
    doctor_recommendations: 'Start Vitamin D3 supplementation at 2000 IU daily. Increase sun exposure when possible (15-20 minutes daily). Include vitamin D-rich foods such as fatty fish, fortified dairy, and egg yolks in your diet. Recheck vitamin D levels in 8-12 weeks to ensure adequate response to supplementation.',
    follow_up_tests: ['Vitamin D Test'],
    status: 'Final',
    attachments: []
  }
};

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
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const testOrders = mockTestOrders;
  const testResults = mockTestResults;

  const handleDownloadReport = (order: any) => {
    const result = testResults[order.id];
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Report - ${order.test_types.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 60px; background: #fff; color: #333; }
            .header { text-align: center; border-bottom: 4px solid #0D7377; padding-bottom: 30px; margin-bottom: 40px; }
            .header h1 { color: #0D7377; font-size: 32px; margin-bottom: 10px; }
            .header p { color: #666; font-size: 14px; }
            .info-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #0D7377; }
            .info-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
            .info-value { font-size: 18px; color: #333; font-weight: 600; }
            .section-title { font-size: 24px; color: #0D7377; margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
            .results-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .results-table th { background: #0D7377; color: white; padding: 15px; text-align: left; font-weight: 600; }
            .results-table td { padding: 15px; border-bottom: 1px solid #e5e7eb; }
            .results-table tbody tr:hover { background: #f8f9fa; }
            .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-normal { background: #d1fae5; color: #065f46; }
            .status-high { background: #fee2e2; color: #991b1b; }
            .status-low { background: #fef3c7; color: #92400e; }
            .interpretation-box { background: #eff6ff; padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .recommendations-box { background: #f0fdf4; padding: 25px; border-radius: 12px; border-left: 4px solid #16a34a; margin: 20px 0; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
            @media print { body { padding: 40px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laboratory Test Report</h1>
            <p>CeenAiX Healthcare Platform | Comprehensive Health Testing</p>
          </div>

          <div class="info-section">
            <div class="info-box">
              <div class="info-label">Patient Test</div>
              <div class="info-value">${order.test_types.name}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Test Category</div>
              <div class="info-value">${order.test_types.category}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Test Date</div>
              <div class="info-value">${new Date(result?.result_date || order.scheduled_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Laboratory</div>
              <div class="info-value">${order.lab_facilities?.name || 'N/A'}</div>
            </div>
          </div>

          ${result?.result_data ? `
            <h2 class="section-title">Test Results</h2>
            <table class="results-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Result</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(result.result_data).map(([key, value]: [string, any]) => `
                  <tr>
                    <td><strong>${key}</strong></td>
                    <td><strong>${value.value} ${value.unit || ''}</strong></td>
                    <td>${value.reference_range || 'N/A'}</td>
                    <td><span class="status-badge status-${(value.status || 'Normal').toLowerCase()}">${value.status || 'Normal'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${result?.doctor_interpretation ? `
            <h2 class="section-title">Doctor's Interpretation</h2>
            <div class="interpretation-box">
              <p>${result.doctor_interpretation}</p>
            </div>
          ` : ''}

          ${result?.doctor_recommendations ? `
            <h2 class="section-title">Recommendations</h2>
            <div class="recommendations-box">
              <p>${result.doctor_recommendations}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p><strong>CeenAiX Healthcare Platform</strong></p>
            <p>This is an official laboratory report generated on ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin-top: 10px;">For questions or concerns about this report, please contact your healthcare provider.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async (order: any) => {
    const shareText = `Lab Test Report: ${order.test_types.name}\nCategory: ${order.test_types.category}\nDate: ${new Date(order.order_date).toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lab Report - ${order.test_types.name}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Test information copied to clipboard!');
    }
  };

  const pendingTests = testOrders.filter(order => !testResults[order.id]);
  const completedTests = testOrders.filter(order => testResults[order.id]);

  const categories = ['all', ...Array.from(new Set(testOrders.map(order => order.test_types.category)))];

  const filteredTests = completedTests.filter(order => {
    const matchesSearch = order.test_types.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.test_types.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || order.test_types.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedTestData = selectedTest ? testOrders.find(t => t.id === selectedTest) : null;
  const selectedResult = selectedTest ? testResults[selectedTest] : null;

  return (
    <div className="max-w-6xl mx-auto">
      {!selectedTest ? (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Lab Test Results</h2>
                <p className="text-gray-600">View your test reports and track your health progress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-2xl p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold">{pendingTests.length}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Pending Tests</h3>
                <p className="text-blue-100 text-sm">Awaiting results</p>
              </div>

              <div className="rounded-2xl p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold">{completedTests.length}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Completed</h3>
                <p className="text-green-100 text-sm">Results available</p>
              </div>

              <div className="rounded-2xl p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold">{testOrders.length}</span>
                </div>
                <h3 className="text-lg font-semibold mb-1">Total Tests</h3>
                <p className="text-purple-100 text-sm">All time</p>
              </div>
            </div>
          </div>

          {pendingTests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Tests in Progress</h3>
              <div className="grid gap-4">
                {pendingTests.map(order => (
                  <div
                    key={order.id}
                    className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {order.test_types.name}
                          </h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Calendar className="w-4 h-4" />
                              Ordered {new Date(order.order_date).toLocaleDateString()}
                            </span>
                            {order.lab_facilities && (
                              <span className="flex items-center gap-1 text-gray-600">
                                <MapPin className="w-4 h-4" />
                                {order.lab_facilities.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Test Reports ({completedTests.length})
              </h3>
            </div>

            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search test results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-500 outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                      filterCategory === cat
                        ? 'bg-teal-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Tests' : cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredTests.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-white border-2 border-dashed border-gray-300">
                <FlaskConical className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-xl font-semibold mb-2 text-gray-900">
                  No test reports found
                </h4>
                <p className="mb-6 text-gray-600">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Complete your first test to see results here'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTests.map(order => {
                  const result = testResults[order.id];
                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedTest(order.id)}
                      className="rounded-xl p-6 bg-white border border-gray-200 hover:border-teal-500 shadow-sm hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <FileText className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {order.test_types.name}
                              </h4>
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                                {order.test_types.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                Result: {new Date(result.result_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              {order.lab_facilities && (
                                <span className="flex items-center gap-1 text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  {order.lab_facilities.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadReport(order);
                            }}
                            className="p-3 rounded-lg transition-all bg-gray-100 hover:bg-gray-200 text-gray-700"
                            title="Download Report"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={() => setSelectedTest(null)}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Results
          </button>

          {selectedTestData && selectedResult && (
            <div>
              <div className="rounded-2xl p-8 mb-6 bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-3xl font-bold mb-2 text-gray-900">
                      {selectedTestData.test_types.name}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {selectedTestData.test_types.description}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDownloadReport(selectedTestData)}
                      className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium mb-1 text-gray-600">Test Date</div>
                    <div className="text-lg font-bold text-gray-900">
                      {new Date(selectedResult.result_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium mb-1 text-gray-600">Category</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedTestData.test_types.category}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium mb-1 text-gray-600">Laboratory</div>
                    <div className="text-lg font-bold text-gray-900">
                      {selectedTestData.lab_facilities?.name || 'N/A'}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium mb-1 text-gray-600">Status</div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-lg font-bold text-gray-900">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedResult.result_data && (
                <div className="rounded-2xl p-8 mb-6 bg-white border border-gray-200 shadow-lg">
                  <h4 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                    <Activity className="w-6 h-6 text-teal-600" />
                    Test Results
                  </h4>
                  <div className="overflow-hidden rounded-xl border-2 border-gray-200">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Parameter</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Result</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Reference Range</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(selectedResult.result_data).map(([key, value]: [string, any], idx) => (
                          <tr key={key} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-teal-50 transition-colors`}>
                            <td className="px-6 py-4 font-medium text-gray-900">{key}</td>
                            <td className="px-6 py-4 font-bold text-lg text-gray-900">
                              {value.value} <span className="text-sm font-normal text-gray-500">{value.unit || ''}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{value.reference_range || 'N/A'}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                value.status === 'High' ? 'bg-red-100 text-red-800' :
                                value.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {value.status === 'High' ? <TrendingUp className="w-3 h-3" /> :
                                 value.status === 'Low' ? <AlertCircle className="w-3 h-3" /> :
                                 <Check className="w-3 h-3" />}
                                {value.status || 'Normal'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedResult.doctor_interpretation && (
                <div className="rounded-2xl p-8 mb-6 bg-blue-50 border-2 border-blue-200">
                  <h4 className="text-2xl font-bold mb-4 flex items-center gap-2 text-blue-900">
                    <Activity className="w-6 h-6" />
                    Doctor's Interpretation
                  </h4>
                  <p className="text-lg leading-relaxed text-blue-900">
                    {selectedResult.doctor_interpretation}
                  </p>
                </div>
              )}

              {selectedResult.doctor_recommendations && (
                <div className="rounded-2xl p-8 bg-green-50 border-2 border-green-200">
                  <h4 className="text-2xl font-bold mb-4 flex items-center gap-2 text-green-900">
                    <Check className="w-6 h-6" />
                    Recommendations
                  </h4>
                  <p className="text-lg leading-relaxed text-green-900">
                    {selectedResult.doctor_recommendations}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
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
