import { useState, useEffect } from 'react';
import { Users, Calendar, Building2, Stethoscope, Activity, TrendingUp, DollarSign, FileText, Settings, Bell, Search, Filter, Download, Plus, MoreVertical, ChevronRight, ArrowUp, ArrowDown, Eye, CreditCard as Edit, Trash2, CheckCircle, XCircle, Clock, BarChart3, PieChart, UserPlus, Guitar as Hospital, Pill, FlaskConical, Shield, Crown, Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalRevenue: number;
  activeAppointments: number;
  pendingApprovals: number;
}

export default function AdminPortal({ onNavigateHome }: { onNavigateHome?: () => void }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    activeAppointments: 0,
    pendingApprovals: 0
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);

    const [
      { count: patientsCount },
      { count: doctorsCount },
      { count: appointmentsCount },
      { data: appointmentsData }
    ] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*, patient:patients(id), doctor:doctors(id)')
        .order('created_at', { ascending: false })
        .limit(10)
    ]);

    setStats({
      totalPatients: patientsCount || 0,
      totalDoctors: doctorsCount || 0,
      totalAppointments: appointmentsCount || 0,
      totalRevenue: 125400,
      activeAppointments: 23,
      pendingApprovals: 8
    });

    if (appointmentsData) {
      setRecentActivities(appointmentsData);
    }

    setLoading(false);
  };

  const StatCard = ({ icon: Icon, label, value, change, color, gradient }: any) => (
    <div className={`bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-${color}-200 transition-all transform hover:scale-105 hover:shadow-xl animate-in slide-in-from-bottom duration-500`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-4 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-gray-600 text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats.totalPatients}
          change={12}
          color="blue"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={Stethoscope}
          label="Total Doctors"
          value={stats.totalDoctors}
          change={8}
          color="purple"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={Calendar}
          label="Total Appointments"
          value={stats.totalAppointments}
          change={15}
          color="teal"
          gradient="from-teal-500 to-green-500"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.totalRevenue}
          change={22}
          color="green"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          icon={Activity}
          label="Active Appointments"
          value={stats.activeAppointments}
          change={-3}
          color="orange"
          gradient="from-orange-500 to-amber-500"
        />
        <StatCard
          icon={Clock}
          label="Pending Approvals"
          value={stats.pendingApprovals}
          change={5}
          color="red"
          gradient="from-red-500 to-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-in slide-in-from-left duration-500 delay-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-600">Latest platform events</p>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group">
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="space-y-3">
            {[
              { action: 'New patient registered', user: 'Sarah Johnson', time: '5 min ago', type: 'user', color: 'blue' },
              { action: 'Appointment scheduled', user: 'Dr. Ahmed Khan', time: '12 min ago', type: 'calendar', color: 'green' },
              { action: 'Lab results uploaded', user: 'LifeLab Dubai', time: '23 min ago', type: 'lab', color: 'purple' },
              { action: 'Payment received', user: 'John Smith', time: '1 hour ago', type: 'payment', color: 'teal' },
              { action: 'Doctor verified', user: 'Dr. Maria Santos', time: '2 hours ago', type: 'verify', color: 'orange' }
            ].map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer animate-in slide-in-from-right duration-300"
                style={{ animationDelay: `${idx * 50 + 300}ms` }}
              >
                <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                  {activity.type === 'user' && <UserPlus className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'calendar' && <Calendar className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'lab' && <FlaskConical className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'payment' && <DollarSign className={`w-5 h-5 text-${activity.color}-600`} />}
                  {activity.type === 'verify' && <Shield className={`w-5 h-5 text-${activity.color}-600`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.user}</p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 animate-in slide-in-from-right duration-500 delay-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
                <p className="text-sm text-gray-600">Performance overview</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Appointment Rate', value: 87, color: 'teal' },
              { label: 'Patient Satisfaction', value: 94, color: 'green' },
              { label: 'Doctor Availability', value: 78, color: 'blue' },
              { label: 'Revenue Growth', value: 65, color: 'purple' }
            ].map((stat, idx) => (
              <div key={idx} className="animate-in slide-in-from-bottom duration-500" style={{ animationDelay: `${idx * 100 + 400}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <span className="text-sm font-bold text-gray-900">{stat.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom duration-500 delay-400">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
                <p className="text-sm text-gray-600">Latest scheduled visits</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentActivities.slice(0, 5).map((activity, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors animate-in fade-in duration-300" style={{ animationDelay: `${idx * 50 + 500}ms` }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(activity.appointment_date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">{activity.appointment_time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <span className="text-sm text-gray-900">Patient #{activity.patient_id?.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        D
                      </div>
                      <span className="text-sm text-gray-900">Doctor #{activity.doctor_id?.slice(0, 8)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 capitalize">{activity.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.status === 'scheduled' ? 'bg-green-100 text-green-700' :
                      activity.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {activity.status === 'scheduled' && <CheckCircle className="w-3 h-3" />}
                      {activity.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      {activity.status === 'pending' && <Clock className="w-3 h-3" />}
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors group">
                        <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-purple-50 rounded-lg transition-colors group">
                        <Edit className="w-4 h-4 text-gray-600 group-hover:text-purple-600" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors group">
                        <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              {onNavigateHome && (
                <button
                  onClick={onNavigateHome}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 font-semibold transition-all transform hover:scale-105 hover:shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CeenAiX Admin
                </h1>
                <p className="text-xs text-gray-600">Platform Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors group">
                <Bell className="w-6 h-6 text-gray-600 group-hover:text-purple-600 transition-colors" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-600">Super Admin</p>
                </div>
                <div className="w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  A
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
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'patients', icon: Users, label: 'Patients' },
              { id: 'doctors', icon: Stethoscope, label: 'Doctors' },
              { id: 'appointments', icon: Calendar, label: 'Appointments' },
              { id: 'clinics', icon: Building2, label: 'Clinics' },
              { id: 'reports', icon: FileText, label: 'Reports' },
              { id: 'settings', icon: Settings, label: 'Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-200'
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
        {activeTab !== 'dashboard' && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-xl animate-in fade-in duration-500">
            <Zap className="w-20 h-20 text-purple-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management</h3>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </main>
    </div>
  );
}
