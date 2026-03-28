import { useState, useEffect } from 'react';
import {
  Users, Building2, Stethoscope, FlaskConical, Pill, Activity, Shield, Settings,
  BarChart3, AlertCircle, CheckCircle, Clock, TrendingUp, UserCheck, FileText,
  Database, Search, Bell, Menu, X, Home, CreditCard, DollarSign, Filter,
  Download, Plus, MoreVertical, Eye, Edit2, Trash2, XCircle, ChevronDown,
  Calendar, MapPin, Phone, Mail, Globe, Award, Zap, Server, CloudOff,
  RefreshCw, SlidersHorizontal, BookOpen, ClipboardList, Briefcase
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  LineChart, Line, PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Types
interface DashboardStats {
  activeClinics: number;
  totalPatients: number;
  activeDoctors: number;
  prescriptionsToday: number;
  labOrdersToday: number;
  insuranceClaimsPending: number;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
  created_at: string;
  entity_name?: string;
}

interface Clinic {
  id: string;
  name: string;
  dha_license: string;
  status: string;
  doctors_count: number;
  patients_count: number;
  subscription_tier: string;
  contact: string;
  location: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function SuperAdminPortal() {
  const { userId } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserTab, setSelectedUserTab] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Dashboard Stats
  const [stats, setStats] = useState<DashboardStats>({
    activeClinics: 0,
    totalPatients: 0,
    activeDoctors: 0,
    prescriptionsToday: 0,
    labOrdersToday: 0,
    insuranceClaimsPending: 0,
  });

  // Data States
  const [users, setUsers] = useState<User[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [platformUsageData, setPlatformUsageData] = useState<any[]>([]);
  const [userTypeData, setUserTypeData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch real stats from Supabase
      const [
        { count: patientsCount },
        { count: doctorsCount },
        { count: pharmaciesCount },
        { count: labsCount },
        { data: prescriptionsData },
        { data: profilesData }
      ] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('pharmacies').select('*', { count: 'exact', head: true }),
        supabase.from('labs').select('*', { count: 'exact', head: true }),
        supabase.from('prescriptions').select('*').gte('created_at', new Date().toISOString().split('T')[0]),
        supabase.from('profiles').select('role')
      ]);

      setStats({
        activeClinics: 12,
        totalPatients: patientsCount || 0,
        activeDoctors: doctorsCount || 0,
        prescriptionsToday: prescriptionsData?.length || 0,
        labOrdersToday: 34,
        insuranceClaimsPending: 18,
      });

      // Mock platform usage data (last 30 days)
      const usageData = Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${i + 1}`,
        users: Math.floor(Math.random() * 500) + 200,
        appointments: Math.floor(Math.random() * 100) + 50,
        prescriptions: Math.floor(Math.random() * 80) + 30,
      }));
      setPlatformUsageData(usageData);

      // Calculate user type distribution
      const roleCounts: { [key: string]: number } = {};
      profilesData?.forEach((profile: any) => {
        roleCounts[profile.role] = (roleCounts[profile.role] || 0) + 1;
      });

      const userTypes = Object.entries(roleCounts).map(([role, count]) => ({
        name: role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: count
      }));
      setUserTypeData(userTypes);

      // Mock recent activity
      setRecentActivity([
        { id: '1', type: 'registration', description: 'New clinic registered: Dubai Medical Center', timestamp: '5 minutes ago', user: 'System' },
        { id: '2', type: 'alert', description: 'DHA license verification required for Dr. Ahmed', timestamp: '15 minutes ago', user: 'System' },
        { id: '3', type: 'registration', description: 'New doctor joined: Dr. Sarah Johnson', timestamp: '1 hour ago', user: 'Admin' },
        { id: '4', type: 'flag', description: 'Unusual prescription pattern detected', timestamp: '2 hours ago', user: 'AI Monitor' },
        { id: '5', type: 'registration', description: '25 new patient registrations', timestamp: '3 hours ago', user: 'System' },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (data) {
        const enrichedUsers = data.map(user => ({
          ...user,
          status: 'Active',
          last_login: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
          entity_name: user.role === 'doctor' ? 'Dubai Medical Center' : user.role === 'pharmacy_admin' ? 'City Pharmacy' : undefined
        }));
        setUsers(enrichedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (activePage === 'users') {
      fetchUsers();
    }
  }, [activePage]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedUserTab === 'all' || user.role === selectedUserTab;
    return matchesSearch && matchesTab;
  });

  // Dashboard Component
  const DashboardView = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          icon={Building2}
          label="Active Clinics"
          value={stats.activeClinics}
          color="from-blue-500 to-blue-600"
          trend="+3 this month"
        />
        <KPICard
          icon={Users}
          label="Registered Patients"
          value={stats.totalPatients}
          color="from-emerald-500 to-emerald-600"
          trend="+12% growth"
        />
        <KPICard
          icon={Stethoscope}
          label="Active Doctors"
          value={stats.activeDoctors}
          color="from-teal-500 to-teal-600"
          trend="+5 new"
        />
        <KPICard
          icon={Pill}
          label="Prescriptions Today"
          value={stats.prescriptionsToday}
          color="from-purple-500 to-purple-600"
          trend="12:00 PM"
        />
        <KPICard
          icon={FlaskConical}
          label="Lab Orders Today"
          value={stats.labOrdersToday}
          color="from-orange-500 to-orange-600"
          trend="Updated now"
        />
        <KPICard
          icon={CreditCard}
          label="Insurance Claims Pending"
          value={stats.insuranceClaimsPending}
          color="from-red-500 to-red-600"
          trend="Requires attention"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Usage Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Usage (Last 30 Days)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={platformUsageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="prescriptions" stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Type Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">User Type Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={userTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'registration' ? 'bg-blue-100' :
                  activity.type === 'alert' ? 'bg-orange-100' :
                  'bg-red-100'
                }`}>
                  {activity.type === 'registration' ? <UserCheck className="w-4 h-4 text-blue-600" /> :
                   activity.type === 'alert' ? <AlertCircle className="w-4 h-4 text-orange-600" /> :
                   <XCircle className="w-4 h-4 text-red-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.timestamp} • {activity.user}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Plus className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Add Clinic</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
              <UserCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-medium text-emerald-900">Invite User</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">View Reports</span>
            </button>
            <button className="w-full flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
              <Download className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-900">Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // User Management Component
  const UserManagementView = () => (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage all platform users</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            <Plus className="w-5 h-5" />
            Create User
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* User Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Users' },
          { id: 'patient', label: 'Patients' },
          { id: 'doctor', label: 'Doctors' },
          { id: 'pharmacy_admin', label: 'Pharmacy' },
          { id: 'lab_admin', label: 'Lab' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedUserTab(tab.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedUserTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Entity</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Login</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.slice(0, 20).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.full_name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'doctor' ? 'bg-teal-100 text-teal-700' :
                      user.role === 'patient' ? 'bg-blue-100 text-blue-700' :
                      user.role === 'pharmacy_admin' ? 'bg-pink-100 text-pink-700' :
                      user.role === 'lab_admin' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role?.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600">{user.entity_name || '—'}</td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {new Date(user.last_login).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="More">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
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

  // Clinic Management Component
  const ClinicManagementView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinic Management</h2>
          <p className="text-gray-600 mt-1">Manage registered clinics and DHA verification</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          <Plus className="w-5 h-5" />
          Add Clinic
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Clinic Name</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">DHA License</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Doctors</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Patients</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Tier</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { name: 'Dubai Medical Center', license: 'DHA-12345', status: 'verified', doctors: 15, patients: 450, tier: 'Enterprise' },
              { name: 'Healthcare Plus Clinic', license: 'DHA-23456', status: 'verified', doctors: 8, patients: 280, tier: 'Pro' },
              { name: 'City Family Clinic', license: 'DHA-34567', status: 'pending', doctors: 5, patients: 120, tier: 'Basic' },
            ].map((clinic, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{clinic.name}</p>
                      <p className="text-sm text-gray-500">Dubai, UAE</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-600">{clinic.license}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    clinic.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                    clinic.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {clinic.status === 'verified' ? 'DHA Verified' : 'Pending'}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-900 font-medium">{clinic.doctors}</td>
                <td className="py-4 px-6 text-gray-900 font-medium">{clinic.patients}</td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    clinic.tier === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                    clinic.tier === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {clinic.tier}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <button className="text-blue-600 hover:text-blue-700 font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Settings Component
  const SettingsView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings & Configuration</h2>

      {/* Platform Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Platform Settings</h3>
        <div className="space-y-4">
          <ToggleSetting
            label="Maintenance Mode"
            description="Temporarily disable user access to the platform"
            enabled={false}
          />
          <ToggleSetting
            label="Email Notifications"
            description="Send system notifications via email"
            enabled={true}
          />
          <ToggleSetting
            label="SMS Notifications"
            description="Send appointment reminders via SMS"
            enabled={true}
          />
          <ToggleSetting
            label="Auto-approve Doctors"
            description="Automatically approve doctor registrations"
            enabled={false}
          />
        </div>
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationCard
            name="Nabidh HIE"
            status="connected"
            lastSync="2 minutes ago"
          />
          <IntegrationCard
            name="DHA API"
            status="connected"
            lastSync="5 minutes ago"
          />
          <IntegrationCard
            name="Payment Gateway"
            status="connected"
            lastSync="1 hour ago"
          />
          <IntegrationCard
            name="SMS Service"
            status="connected"
            lastSync="Just now"
          />
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Basic', 'Pro', 'Enterprise'].map((plan) => (
            <div key={plan} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-bold text-gray-900 mb-2">{plan}</h4>
              <p className="text-sm text-gray-600 mb-3">
                {plan === 'Basic' ? 'Up to 5 doctors' :
                 plan === 'Pro' ? 'Up to 20 doctors' :
                 'Unlimited doctors'}
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit Plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Audit Logs Component
  const AuditLogsView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Audit Logs</h2>
          <p className="text-gray-600 mt-1">System activity and security logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Search logs..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>All Actions</option>
              <option>Login</option>
              <option>Data Access</option>
              <option>Configuration</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">IP Address</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { time: '2024-03-28 14:30:45', user: 'admin@ceenaix.com', action: 'Updated clinic settings', ip: '192.168.1.1', status: 'success' },
                { time: '2024-03-28 14:25:12', user: 'dr.ahmed@clinic.com', action: 'Logged in', ip: '192.168.1.50', status: 'success' },
                { time: '2024-03-28 14:20:33', user: 'system', action: 'Backup completed', ip: '127.0.0.1', status: 'success' },
                { time: '2024-03-28 14:15:22', user: 'pharmacy@example.com', action: 'Failed login attempt', ip: '192.168.1.100', status: 'failed' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-4 px-6 text-sm text-gray-600">{log.time}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{log.user}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{log.action}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{log.ip}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status}
                    </span>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading CeenAiX Super Admin Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-gradient-to-b from-[#0A1628] to-[#1a2942] text-white transition-all duration-300 z-50 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen ? (
              <div className="flex items-center gap-2">
                <Zap className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="font-bold text-lg">CeenAiX</h1>
                  <p className="text-xs text-gray-400">Super Admin</p>
                </div>
              </div>
            ) : (
              <Zap className="w-8 h-8 text-blue-400" />
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'clinics', label: 'Clinic Management', icon: Building2 },
              { id: 'pharmacies', label: 'Pharmacies', icon: Pill },
              { id: 'labs', label: 'Laboratories', icon: FlaskConical },
              { id: 'insurance', label: 'Insurance', icon: CreditCard },
              { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
              { id: 'lab-orders', label: 'Lab Orders', icon: ClipboardList },
              { id: 'settings', label: 'Settings', icon: Settings },
              { id: 'audit', label: 'Audit Logs', icon: Database },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activePage === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Global search..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  SA
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">Super Admin</p>
                  <p className="text-gray-500">CeenAiX Team</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {activePage === 'dashboard' && <DashboardView />}
          {activePage === 'users' && <UserManagementView />}
          {activePage === 'clinics' && <ClinicManagementView />}
          {activePage === 'settings' && <SettingsView />}
          {activePage === 'audit' && <AuditLogsView />}

          {/* Placeholder for other pages */}
          {!['dashboard', 'users', 'clinics', 'settings', 'audit'].includes(activePage) && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}
              </h3>
              <p className="text-gray-600">This module is under construction</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Helper Components
const KPICard = ({ icon: Icon, label, value, color, trend }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-3xl font-bold text-gray-900 mb-2">{value.toLocaleString()}</p>
    <p className="text-sm text-gray-500">{trend}</p>
  </div>
);

const ToggleSetting = ({ label, description, enabled }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={enabled} />
      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const IntegrationCard = ({ name, status, lastSync }: any) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-medium text-gray-900">{name}</h4>
      {status === 'connected' ? (
        <CheckCircle className="w-5 h-5 text-emerald-600" />
      ) : (
        <CloudOff className="w-5 h-5 text-red-600" />
      )}
    </div>
    <p className="text-sm text-gray-600">Last sync: {lastSync}</p>
    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
      status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
    }`}>
      {status === 'connected' ? 'Connected' : 'Disconnected'}
    </span>
  </div>
);
