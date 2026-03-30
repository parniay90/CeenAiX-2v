import { useState } from 'react';
import { ChevronLeft, CreditCard as Edit, Ban, CheckCircle, MoreVertical, Building2, Users, Calendar, FileText, FlaskConical, Shield, DollarSign, Activity, Settings as SettingsIcon, Phone, Mail, MapPin, Clock, TrendingUp, AlertCircle, Download, Plus, Eye, Trash2, Search, Filter, Bell, Globe, Award, CreditCard, XCircle } from 'lucide-react';
import { Clinic } from '../types/clinic';
import {
  mockClinicDoctors,
  mockClinicPatients,
  mockClinicAppointments,
  mockClinicPrescriptions,
  mockClinicLabOrders,
  mockInsuranceClaims,
  mockClinicInvoices,
  mockAuditLog,
  mockActivityFeed,
} from '../data/mockClinics';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ClinicProfileProps {
  clinic: Clinic;
  onBack: () => void;
}

type Tab =
  | 'overview'
  | 'doctors'
  | 'patients'
  | 'appointments'
  | 'prescriptions'
  | 'lab-orders'
  | 'insurance'
  | 'financials'
  | 'audit'
  | 'settings';

export default function ClinicProfile({ clinic, onBack }: ClinicProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'lab-orders', label: 'Lab Orders', icon: FlaskConical },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'audit', label: 'Audit Log', icon: Activity },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
      Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
      Verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Expired: 'bg-red-100 text-red-700 border-red-200',
      'Expiring Soon': 'bg-amber-100 text-amber-700 border-amber-200',
    };
    return (
      <span
        className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Clinics
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {clinic.logo ? (
                <img
                  src={clinic.logo}
                  alt={clinic.name}
                  className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>Dashboard</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span>Clinics</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span className="text-blue-600 font-medium">{clinic.name}</span>
                </div>
                <h1
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {clinic.name}
                </h1>
                <div className="flex items-center gap-3">
                  {getStatusBadge(clinic.status)}
                  {getStatusBadge(clinic.dhaLicenseStatus)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                {clinic.status === 'Suspended' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Reactivate
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4" />
                    Suspend
                  </>
                )}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                <Bell className="w-4 h-4" />
                Send Notification
              </button>
              <button className="p-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-8">
          <div className="flex gap-1 border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-8">
        {activeTab === 'overview' && <OverviewTab clinic={clinic} />}
        {activeTab === 'doctors' && <DoctorsTab clinic={clinic} />}
        {activeTab === 'patients' && <PatientsTab clinic={clinic} />}
        {activeTab === 'appointments' && <AppointmentsTab clinic={clinic} />}
        {activeTab === 'prescriptions' && <PrescriptionsTab clinic={clinic} />}
        {activeTab === 'lab-orders' && <LabOrdersTab clinic={clinic} />}
        {activeTab === 'insurance' && <InsuranceTab clinic={clinic} />}
        {activeTab === 'financials' && <FinancialsTab clinic={clinic} />}
        {activeTab === 'audit' && <AuditTab clinic={clinic} />}
        {activeTab === 'settings' && <SettingsTab clinic={clinic} />}
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab({ clinic }: { clinic: Clinic }) {
  const activities = mockActivityFeed.filter((a) => a.clinicId === clinic.id);

  const revenueData = [
    { month: 'Oct', revenue: 9500 },
    { month: 'Nov', revenue: 11200 },
    { month: 'Dec', revenue: 10800 },
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 11500 },
    { month: 'Mar', revenue: 12500 },
  ];

  const appointmentData = [
    { day: 'Mon', count: 45 },
    { day: 'Tue', count: 52 },
    { day: 'Wed', count: 48 },
    { day: 'Thu', count: 61 },
    { day: 'Fri', count: 38 },
    { day: 'Sat', count: 42 },
  ];

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Left Column - Clinic Details */}
      <div className="col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Clinic Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Clinic Name</label>
              <p className="mt-1 text-gray-900 font-semibold">{clinic.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <p className="mt-1 text-gray-900 font-semibold">{clinic.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Specializations</label>
              <p className="mt-1 text-gray-900">{clinic.specializations.join(', ')}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Year Established</label>
              <p className="mt-1 text-gray-900 font-semibold">{clinic.yearEstablished}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">DHA License</label>
              <p className="mt-1 text-gray-900 font-semibold font-mono">
                {clinic.dhaLicenseNumber}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Expires: {new Date(clinic.dhaLicenseExpiry).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Trade License</label>
              <p className="mt-1 text-gray-900 font-semibold font-mono">
                {clinic.tradeLicenseNumber}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Expires: {new Date(clinic.tradeLicenseExpiry).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Location</label>
              <p className="mt-1 text-gray-900">{clinic.emirates}, {clinic.area}</p>
              <p className="text-sm text-gray-600 mt-1">{clinic.address}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Contact</label>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{clinic.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{clinic.contactEmail}</span>
                </div>
                {clinic.website && (
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a href={clinic.website} className="text-blue-600 hover:underline">
                      {clinic.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">Admin Contact</label>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{clinic.adminName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{clinic.adminEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{clinic.adminPhone}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Medical Director</label>
              <p className="mt-1 text-gray-900 font-semibold">
                {clinic.medicalDirectorName}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                {clinic.medicalDirectorDhaLicense}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Accreditations</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {clinic.accreditations.map((acc) => (
                  <span
                    key={acc}
                    className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100"
                  >
                    {acc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {clinic.internalNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Internal Notes (Admin Only)
              </label>
              <p className="mt-2 text-sm text-gray-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                {clinic.internalNotes}
              </p>
            </div>
          )}
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Appointments</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={appointmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column - KPIs, Activity, Alerts */}
      <div className="space-y-6">
        {/* Performance KPIs */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Snapshot</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium mb-1">Total Doctors</div>
              <div className="text-2xl font-bold text-blue-700">{clinic.doctorCount}</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-sm text-emerald-600 font-medium mb-1">Total Patients</div>
              <div className="text-2xl font-bold text-emerald-700">
                {clinic.patientCount.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-600 font-medium mb-1">Monthly Revenue</div>
              <div className="text-2xl font-bold text-purple-700">
                AED {clinic.monthlyRevenue.toLocaleString()}
              </div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
              <div className="text-sm text-amber-600 font-medium mb-1">Insurance Networks</div>
              <div className="text-2xl font-bold text-amber-700">
                {clinic.insuranceNetworks.length}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Alerts & Warnings</h3>
          <div className="space-y-3">
            {clinic.dhaLicenseStatus === 'Expiring Soon' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      DHA License Expiring Soon
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      License expires on {new Date(clinic.dhaLicenseExpiry).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {clinic.dhaLicenseStatus === 'Expired' && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">
                      DHA License Expired
                    </p>
                    <p className="text-xs text-red-700 mt-1">
                      Immediate action required
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Performance Excellent
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Patient satisfaction rate: 4.8/5.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Doctors Tab
function DoctorsTab({ clinic }: { clinic: Clinic }) {
  const doctors = mockClinicDoctors.filter((d) => d.clinicId === clinic.id);
  const expiringLicenses = doctors.filter(
    (d) => d.dhaLicenseStatus === 'Expiring Soon' || d.dhaLicenseStatus === 'Expired'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Doctors</h3>
          <p className="text-gray-600 mt-1">{doctors.length} doctors in total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      {/* Compliance Alert */}
      {expiringLicenses.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h4 className="text-lg font-bold text-amber-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            License Compliance Alert
          </h4>
          <p className="text-sm text-amber-700 mb-3">
            {expiringLicenses.length} doctor(s) have expiring or expired DHA licenses
          </p>
          <div className="space-y-2">
            {expiringLicenses.map((doctor) => (
              <div
                key={doctor.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={doctor.avatar}
                    alt={doctor.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                    <p className="text-xs text-gray-500">
                      License: {doctor.dhaLicenseNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      doctor.dhaLicenseStatus === 'Expired'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }`}
                  >
                    {doctor.dhaLicenseStatus}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Expires: {new Date(doctor.dhaLicenseExpiry).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctors Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                DHA License
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Patients
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Prescriptions/Month
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <tr key={doctor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="font-semibold text-gray-900">{doctor.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{doctor.specialization}</td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-mono text-gray-900">{doctor.dhaLicenseNumber}</div>
                    <div className="text-xs text-gray-500">
                      Exp: {new Date(doctor.dhaLicenseExpiry).toLocaleDateString()}
                    </div>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                        doctor.dhaLicenseStatus === 'Verified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : doctor.dhaLicenseStatus === 'Expiring Soon'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {doctor.dhaLicenseStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {doctor.patientCount}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {doctor.prescriptionsThisMonth}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      doctor.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {doctor.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Patients Tab
function PatientsTab({ clinic }: { clinic: Clinic }) {
  const patients = mockClinicPatients.filter((p) => p.clinicId === clinic.id);

  const genderData = [
    { name: 'Male', value: patients.filter((p) => p.gender === 'Male').length },
    { name: 'Female', value: patients.filter((p) => p.gender === 'Female').length },
  ];

  const ageData = [
    { range: '0-18', count: Math.floor(patients.length * 0.15) },
    { range: '19-35', count: Math.floor(patients.length * 0.35) },
    { range: '36-55', count: Math.floor(patients.length * 0.30) },
    { range: '56+', count: Math.floor(patients.length * 0.20) },
  ];

  const COLORS = ['#3b82f6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Patients</h3>
          <p className="text-gray-600 mt-1">{patients.length} registered patients</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      {/* Demographics Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Gender Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Emirates ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Primary Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Insurance
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Last Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={patient.avatar}
                      alt={patient.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="font-semibold text-gray-900">{patient.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.age}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.gender}</td>
                <td className="px-6 py-4 font-mono text-sm text-gray-900">
                  {patient.emiratesId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{patient.primaryDoctor}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {patient.insurance || 'Self-Pay'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(patient.lastVisit).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Appointments Tab
function AppointmentsTab({ clinic }: { clinic: Clinic }) {
  const appointments = mockClinicAppointments.filter((a) => a.clinicId === clinic.id);

  const appointmentsPerDay = [
    { day: 'Mon', count: 28 },
    { day: 'Tue', count: 35 },
    { day: 'Wed', count: 32 },
    { day: 'Thu', count: 42 },
    { day: 'Fri', count: 25 },
    { day: 'Sat', count: 30 },
  ];

  const statusCounts = {
    Upcoming: appointments.filter((a) => a.status === 'Upcoming').length,
    Completed: appointments.filter((a) => a.status === 'Completed').length,
    Cancelled: appointments.filter((a) => a.status === 'Cancelled').length,
    'No-Show': appointments.filter((a) => a.status === 'No-Show').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Appointments</h3>
          <p className="text-gray-600 mt-1">{appointments.length} appointments this month</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Upcoming</div>
          <div className="text-3xl font-bold text-blue-600">{statusCounts.Upcoming}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Completed</div>
          <div className="text-3xl font-bold text-emerald-600">{statusCounts.Completed}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Cancellation Rate</div>
          <div className="text-3xl font-bold text-red-600">
            {((statusCounts.Cancelled / appointments.length) * 100).toFixed(1)}%
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">No-Show Rate</div>
          <div className="text-3xl font-bold text-amber-600">
            {((statusCounts['No-Show'] / appointments.length) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Appointments Per Day</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={appointmentsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Busiest Days</h3>
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Thursday</span>
              <span className="text-lg font-bold text-gray-900">42 appointments</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tuesday</span>
              <span className="text-lg font-bold text-gray-900">35 appointments</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Wednesday</span>
              <span className="text-lg font-bold text-gray-900">32 appointments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appt) => (
              <tr key={appt.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {appt.patientName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{appt.doctorName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{appt.specialization}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(appt.dateTime).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      appt.type === 'In-Person'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {appt.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{appt.duration} min</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      appt.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : appt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : appt.status === 'Cancelled'
                        ? 'bg-gray-100 text-gray-700 border-gray-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Prescriptions Tab
function PrescriptionsTab({ clinic }: { clinic: Clinic }) {
  const prescriptions = mockClinicPrescriptions.filter((p) => p.clinicId === clinic.id);

  const volumeData = [
    { month: 'Oct', count: 85 },
    { month: 'Nov', count: 95 },
    { month: 'Dec', count: 88 },
    { month: 'Jan', count: 102 },
    { month: 'Feb', count: 98 },
    { month: 'Mar', count: 110 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Prescriptions</h3>
          <p className="text-gray-600 mt-1">{prescriptions.length} prescriptions</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Volume Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Medications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Aspirin 100mg</span>
              <span className="text-lg font-bold text-gray-900">45</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Atorvastatin 20mg</span>
              <span className="text-lg font-bold text-gray-900">38</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Metformin 500mg</span>
              <span className="text-lg font-bold text-gray-900">32</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                RX ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Medications
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Pharmacy
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Insurance
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-900">{rx.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {rx.patientName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{rx.doctorName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {rx.medications.length} item{rx.medications.length > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {rx.pharmacyName || 'Not Sent'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(rx.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      rx.status === 'Dispensed'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : rx.status === 'Sent to Pharmacy'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {rx.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {rx.insuranceCovered ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Lab Orders Tab
function LabOrdersTab({ clinic }: { clinic: Clinic }) {
  const labOrders = mockClinicLabOrders.filter((l) => l.clinicId === clinic.id);

  const volumeData = [
    { month: 'Oct', count: 42 },
    { month: 'Nov', count: 48 },
    { month: 'Dec', count: 45 },
    { month: 'Jan', count: 52 },
    { month: 'Feb', count: 49 },
    { month: 'Mar', count: 56 },
  ];

  const testsByCategory = [
    { category: 'Blood Work', count: 85 },
    { category: 'Imaging', count: 42 },
    { category: 'Cultures', count: 28 },
    { category: 'Other', count: 15 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Lab Orders</h3>
          <p className="text-gray-600 mt-1">{labOrders.length} lab orders</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Order Volume</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tests by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testsByCategory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lab Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lab orders..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Ordering Doctor
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Lab Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Tests
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Date Ordered
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {labOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-900">{order.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {order.patientName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.orderingDoctor}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{order.labName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.testsRequested.length} test{order.testsRequested.length > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      order.priority === 'STAT'
                        ? 'bg-red-50 text-red-700'
                        : order.priority === 'Urgent'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {order.priority}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(order.dateOrdered).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      order.status === 'Results Ready'
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                        : order.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Insurance Tab
function InsuranceTab({ clinic }: { clinic: Clinic }) {
  const claims = mockInsuranceClaims.filter((c) => c.clinicId === clinic.id);

  const claimsByProvider = clinic.insuranceNetworks.map((provider) => ({
    provider,
    count: claims.filter((c) => c.provider === provider).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Connected Insurance Networks</h3>
        <div className="grid grid-cols-3 gap-4">
          {clinic.insuranceNetworks.map((network) => (
            <div key={network} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-bold text-gray-900 text-lg">{network}</div>
                  <div className="text-xs text-gray-500 mt-1">Connected</div>
                </div>
                <span className="px-2 py-1 rounded-md text-xs font-semibold border bg-emerald-100 text-emerald-700 border-emerald-200">
                  Active
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Claims</div>
                  <div className="text-lg font-bold text-gray-900">
                    {claims.filter((c) => c.provider === network).length}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Approved</div>
                  <div className="text-lg font-bold text-emerald-600">
                    {claims.filter((c) => c.provider === network && c.status === 'Approved').length}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Rejected</div>
                  <div className="text-lg font-bold text-red-600">
                    {claims.filter((c) => c.provider === network && c.status === 'Rejected').length}
                  </div>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Claims Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Claims by Provider</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={claimsByProvider}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="provider" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Claim Status Summary</h3>
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-emerald-900">Approved</span>
              <span className="text-lg font-bold text-emerald-700">
                {claims.filter((c) => c.status === 'Approved').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-amber-900">Pending</span>
              <span className="text-lg font-bold text-amber-700">
                {claims.filter((c) => c.status === 'Pending').length}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-900">Rejected</span>
              <span className="text-lg font-bold text-red-700">
                {claims.filter((c) => c.status === 'Rejected').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Claim ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Service Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {claim.patientName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.doctorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.serviceType}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.provider}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    AED {claim.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(claim.submitted).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : claim.status === 'Rejected'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-amber-100 text-amber-700 border-amber-200'
                      }`}
                    >
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Financials Tab
function FinancialsTab({ clinic }: { clinic: Clinic }) {
  const invoices = mockClinicInvoices.filter((i) => i.clinicId === clinic.id);

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-500">Monthly Revenue</label>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              AED {clinic.monthlyRevenue.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Subscription Plan</label>
            <p className="mt-1">
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
                  clinic.subscriptionPlan === 'Enterprise'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    : clinic.subscriptionPlan === 'Pro'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200'
                }`}
              >
                {clinic.subscriptionPlan}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Renewal Date</label>
            <p className="mt-1 text-gray-900 font-semibold">
              {new Date(clinic.subscriptionRenewalDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Total Invoices</label>
            <p className="mt-1 text-2xl font-bold text-gray-900">{invoices.length}</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Methods</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2026</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
              Primary
            </span>
          </div>
        </div>
      </div>

      {/* Billing Actions */}
      <div className="grid grid-cols-3 gap-4">
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
          <Download className="w-5 h-5" />
          Download Statement
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
          <CreditCard className="w-5 h-5" />
          Update Payment Method
        </button>
      </div>

      {/* Invoice History */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Invoice History</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Invoice Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  VAT
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.period}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.plan}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    AED {invoice.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    AED {invoice.vat.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    AED {invoice.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                          : invoice.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 border-amber-200'
                          : 'bg-red-100 text-red-700 border-red-200'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Audit Log Tab
function AuditTab({ clinic }: { clinic: Clinic }) {
  const logs = mockAuditLog.filter((l) => l.clinicId === clinic.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Audit Log</h3>
          <p className="text-gray-600 mt-1">Complete chronological activity log</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search audit log..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          Filters
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Download className="w-5 h-5" />
          Export
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Performed By
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{log.action}</span>
                    {log.isAdminAction && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold border border-red-200">
                        ADMIN
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{log.performedBy}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                    {log.role}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-gray-600">{log.ipAddress}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Settings Tab
function SettingsTab({ clinic }: { clinic: Clinic }) {
  return (
    <div className="space-y-6">
      {/* Admin Override Controls */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Override Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Force Password Reset</p>
              <p className="text-xs text-gray-500 mt-1">
                Require all clinic users to reset passwords
              </p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm">
              Trigger Reset
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Override Access Restrictions</p>
              <p className="text-xs text-gray-500 mt-1">Grant temporary full access</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
              Grant Access
            </button>
          </div>
        </div>
      </div>

      {/* Status Management */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Clinic Status Management</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Current Status</label>
            <div className="mt-2">
              <span
                className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
                  clinic.status === 'Active'
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                    : clinic.status === 'Suspended'
                    ? 'bg-red-100 text-red-700 border-red-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}
              >
                {clinic.status}
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Change Status</label>
            <div className="mt-2 flex items-center gap-3">
              <select className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="Active">Active</option>
                <option value="Pending">Pending Verification</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DHA License Management */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">DHA License Management</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">DHA License Number</label>
              <input
                type="text"
                defaultValue={clinic.dhaLicenseNumber}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">License Expiry Date</label>
              <input
                type="date"
                defaultValue={clinic.dhaLicenseExpiry}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Verification Status</label>
              <select
                defaultValue={clinic.dhaLicenseStatus}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Not Submitted">Not Submitted</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Trade License Number</label>
              <input
                type="text"
                defaultValue={clinic.tradeLicenseNumber}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
            Update License Information
          </button>
        </div>
      </div>

      {/* Feature Access Toggles */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Access</h3>
        <div className="space-y-3">
          {[
            'AI Clinical Assistant',
            'Telemedicine Module',
            'Electronic Prescribing',
            'Lab Integration',
            'Insurance Claims Module',
            'Analytics & Reports',
            'FHIR API Access',
            'Multi-Location Support',
          ].map((feature) => (
            <div
              key={feature}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <span className="font-medium text-gray-900">{feature}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Checklist */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Compliance Checklist</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">DHA License Verified</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">Trade License Valid</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">
              All Doctors Licensed
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-900">
              Insurance Contracts Active
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Export All Clinic Data</span>
            <Download className="w-5 h-5" />
          </button>
          <button className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Suspend Clinic Account</span>
            <Ban className="w-5 h-5" />
          </button>
          <button className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Reset All Clinic Data</span>
            <AlertCircle className="w-5 h-5" />
          </button>
          <button className="w-full px-4 py-3 bg-red-600 border-2 border-red-700 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Delete Clinic Account Permanently</span>
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
