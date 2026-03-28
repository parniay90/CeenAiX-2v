import { useState, useEffect } from 'react';
import { Users, Building2, Stethoscope, FlaskConical, Pill, Activity, Shield, Settings, BarChart3, AlertCircle, CheckCircle, Clock, TrendingUp, UserCheck, FileText, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalPharmacies: number;
  totalLabs: number;
  pendingVerifications: number;
  todayAppointments: number;
  activePrescriptions: number;
}

interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
}

interface VerificationRequest {
  id: string;
  doctor_id: string;
  doctor_name: string;
  specialization: string;
  status: string;
  submitted_at: string;
}

export default function SuperAdminPortal() {
  const { userId } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalPharmacies: 0,
    totalLabs: 0,
    pendingVerifications: 0,
    todayAppointments: 0,
    activePrescriptions: 0,
  });
  const [users, setUsers] = useState<User[]>([]);
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [profilesData, doctorsData, patientsData, pharmaciesData, labsData, verificationsData, appointmentsData, prescriptionsData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('pharmacies').select('*', { count: 'exact', head: true }),
        supabase.from('labs').select('*', { count: 'exact', head: true }),
        supabase.from('dha_verification_requests').select('*', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', new Date().toISOString().split('T')[0]),
        supabase.from('prescriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      ]);

      setStats({
        totalUsers: profilesData.count || 0,
        totalDoctors: doctorsData.count || 0,
        totalPatients: patientsData.count || 0,
        totalPharmacies: pharmaciesData.count || 0,
        totalLabs: labsData.count || 0,
        pendingVerifications: verificationsData.count || 0,
        todayAppointments: appointmentsData.count || 0,
        activePrescriptions: prescriptionsData.count || 0,
      });

      if (verificationsData.data) {
        const verificationsList = await Promise.all(
          verificationsData.data.map(async (v: any) => {
            const { data: doctor } = await supabase
              .from('doctors')
              .select('id')
              .eq('id', v.doctor_id)
              .single();

            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', v.doctor_id)
              .single();

            return {
              id: v.id,
              doctor_id: v.doctor_id,
              doctor_name: profile?.full_name || 'Unknown',
              specialization: v.specialization,
              status: v.status,
              submitted_at: v.submitted_at,
            };
          })
        );
        setVerifications(verificationsList);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleVerification = async (verificationId: string, approve: boolean) => {
    try {
      const verification = verifications.find(v => v.id === verificationId);
      if (!verification) return;

      await supabase
        .from('dha_verification_requests')
        .update({
          status: approve ? 'approved' : 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id,
        })
        .eq('id', verificationId);

      if (approve) {
        await supabase
          .from('doctors')
          .update({ dha_verified: true })
          .eq('id', verification.doctor_id);
      }

      fetchDashboardData();
    } catch (error) {
      console.error('Error handling verification:', error);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }: any) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-teal-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8" />
                <h1 className="text-2xl font-bold">Super Admin Portal</h1>
              </div>
              <p className="text-slate-300">System Management & Oversight</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-300">Logged in as</p>
              <p className="font-semibold">Super Administrator</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'verifications', label: 'Verifications', icon: UserCheck },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'audit', label: 'Audit Logs', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-blue-500" trend="+12% this month" />
              <StatCard icon={Stethoscope} label="Total Doctors" value={stats.totalDoctors} color="bg-teal-500" trend="+5 new" />
              <StatCard icon={Users} label="Total Patients" value={stats.totalPatients} color="bg-purple-500" trend="+24% this month" />
              <StatCard icon={Pill} label="Pharmacies" value={stats.totalPharmacies} color="bg-pink-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={FlaskConical} label="Laboratories" value={stats.totalLabs} color="bg-green-500" />
              <StatCard icon={Clock} label="Pending Verifications" value={stats.pendingVerifications} color="bg-orange-500" />
              <StatCard icon={Activity} label="Today's Appointments" value={stats.todayAppointments} color="bg-cyan-500" />
              <StatCard icon={FileText} label="Active Prescriptions" value={stats.activePrescriptions} color="bg-indigo-500" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Database</p>
                    <p className="font-semibold text-green-900">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">API Services</p>
                    <p className="font-semibold text-green-900">Running</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Storage</p>
                    <p className="font-semibold text-green-900">78% Used</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">{user.full_name}</td>
                      <td className="py-4 px-4 text-gray-600">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.role === 'doctor' ? 'bg-teal-100 text-teal-700' :
                          user.role === 'patient' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'pharmacy_admin' ? 'bg-pink-100 text-pink-700' :
                          user.role === 'lab_admin' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <button className="text-teal-600 hover:text-teal-700 font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'verifications' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Doctor Verification Requests</h2>
            <div className="space-y-4">
              {verifications.length === 0 ? (
                <div className="text-center py-12">
                  <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No pending verifications</p>
                </div>
              ) : (
                verifications.map((verification) => (
                  <div key={verification.id} className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{verification.doctor_name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{verification.specialization}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {new Date(verification.submitted_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleVerification(verification.id, true)}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleVerification(verification.id, false)}
                          className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">General Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-600">Temporarily disable user access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-600">Send system notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Audit Logs</h2>
            <div className="text-center py-12">
              <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Audit log viewer coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
