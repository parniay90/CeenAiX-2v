import { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, CreditCard as Edit, MoreVertical, Building2, CheckCircle, Clock, XCircle, AlertCircle, Users, UserCheck, TrendingUp } from 'lucide-react';
import {
  Clinic,
  ClinicType,
  ClinicStatus,
  DhaLicenseStatus,
  Emirates,
  SubscriptionPlan,
  InsuranceProvider,
} from '../types/clinic';
import { mockClinics } from '../data/mockClinics';
import RegisterClinicModal from '../components/RegisterClinicModal';
import ClinicProfile from '../components/ClinicProfile';

type ClinicTab = 'all' | 'active' | 'pending' | 'suspended' | 'expiring' | 'new';

export default function SuperAdminClinics() {
  const [clinics] = useState<Clinic[]>(mockClinics);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState<ClinicTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All' as ClinicStatus | 'All',
    type: 'All' as ClinicType | 'All',
    emirates: 'All' as Emirates | 'All',
    plan: 'All' as SubscriptionPlan | 'All',
    dhaLicenseStatus: 'All' as DhaLicenseStatus | 'All',
  });
  const [selectedClinics, setSelectedClinics] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const totalClinics = clinics.length;
  const activeClinics = clinics.filter((c) => c.status === 'Active' && c.dhaLicenseStatus === 'Verified').length;
  const pendingClinics = clinics.filter((c) => c.status === 'Pending').length;
  const suspendedClinics = clinics.filter((c) => c.status === 'Suspended').length;
  const totalDoctors = clinics.reduce((sum, c) => sum + c.doctorCount, 0);
  const totalPatients = clinics.reduce((sum, c) => sum + c.patientCount, 0);

  const tabs: { id: ClinicTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Clinics', count: totalClinics },
    { id: 'active', label: 'Active', count: activeClinics },
    { id: 'pending', label: 'Pending Verification', count: pendingClinics },
    { id: 'suspended', label: 'Suspended', count: suspendedClinics },
    {
      id: 'expiring',
      label: 'DHA License Expiring Soon',
      count: clinics.filter((c) => c.dhaLicenseStatus === 'Expiring Soon').length,
    },
    {
      id: 'new',
      label: 'Newly Registered',
      count: clinics.filter((c) => new Date(c.registeredDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
    },
  ];

  const getStatusBadge = (status: ClinicStatus) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Suspended: 'bg-red-100 text-red-700',
      Inactive: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
  };

  const getDhaLicenseBadge = (status: DhaLicenseStatus) => {
    const config = {
      Verified: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
      Expired: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
      'Expiring Soon': { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
      'Not Submitted': { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
    };
    const { icon: Icon, color, bg } = config[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color} ${bg} w-fit`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getPlanBadge = (plan: SubscriptionPlan) => {
    const styles = {
      Basic: 'bg-blue-100 text-blue-700',
      Pro: 'bg-purple-100 text-purple-700',
      Enterprise: 'bg-indigo-100 text-indigo-700',
      Custom: 'bg-pink-100 text-pink-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[plan]}`}>{plan}</span>;
  };

  const getTypeBadge = (type: ClinicType) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-green-100 text-green-700',
      'bg-orange-100 text-orange-700',
      'bg-pink-100 text-pink-700',
      'bg-teal-100 text-teal-700',
    ];
    const hash = type.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[hash % colors.length]}`}>{type}</span>;
  };

  const handleViewClinic = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleRegister = (data: any) => {
    console.log('Registering clinic:', data);
  };

  const toggleClinicSelection = (clinicId: string) => {
    setSelectedClinics((prev) =>
      prev.includes(clinicId) ? prev.filter((id) => id !== clinicId) : [...prev, clinicId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedClinics(selectedClinics.length === clinics.length ? [] : clinics.map((c) => c.id));
  };

  if (selectedClinic) {
    return <ClinicProfile clinic={selectedClinic} onBack={() => setSelectedClinic(null)} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clinic Management</h1>
            <p className="text-gray-600 mt-1">Manage all registered clinics on CeenAiX</p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Register New Clinic
          </button>
        </div>
        <div className="text-sm text-gray-500">Dashboard &gt; Clinic Management</div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Registered</span>
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalClinics}</div>
          <div className="text-xs text-emerald-600 mt-1">+5 this month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active & Verified</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeClinics}</div>
          <div className="text-xs text-emerald-600 mt-1">DHA Verified</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Verification</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingClinics}</div>
          <div className="text-xs text-amber-600 mt-1">Awaiting review</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Suspended</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{suspendedClinics}</div>
          <div className="text-xs text-red-600 mt-1">Compliance issues</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Doctors</span>
            <UserCheck className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalDoctors}</div>
          <div className="text-xs text-gray-500 mt-1">Across all clinics</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Patients</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalPatients}</div>
          <div className="text-xs text-gray-500 mt-1">Registered users</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-6 px-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-xs">{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clinics by name, DHA license, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-5 h-5" />
              Export
            </button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              <option value="General Practice">General Practice</option>
              <option value="Specialist">Specialist</option>
              <option value="Polyclinic">Polyclinic</option>
              <option value="Dental">Dental</option>
              <option value="Multi-Specialty">Multi-Specialty</option>
            </select>

            <select
              value={filters.emirates}
              onChange={(e) => setFilters({ ...filters, emirates: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Emirates</option>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
            </select>

            <select
              value={filters.plan}
              onChange={(e) => setFilters({ ...filters, plan: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Pro">Pro</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Custom">Custom</option>
            </select>

            <button className="text-sm text-blue-600 hover:text-blue-700">Clear All Filters</button>
          </div>

          <div className="text-sm text-gray-600 mb-4">Showing {clinics.length} clinics</div>

          {selectedClinics.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">{selectedClinics.length} clinics selected</span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700">
                  Approve Selected
                </button>
                <button className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                  Suspend Selected
                </button>
                <button className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                  Export Selected
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">
                    <input
                      type="checkbox"
                      checked={selectedClinics.length === clinics.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Clinic</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DHA License</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Doctors</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Patients</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic, index) => (
                  <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedClinics.includes(clinic.id)}
                        onChange={() => toggleClinicSelection(clinic.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={clinic.logo} alt={clinic.name} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <div className="font-medium text-gray-900">{clinic.name}</div>
                          <div className="text-xs text-gray-500">{clinic.emirates}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(clinic.type)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{clinic.area}</div>
                      <div className="text-xs text-gray-500">{clinic.emirates}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-gray-900 mb-1">{clinic.dhaLicenseNumber}</div>
                      {getDhaLicenseBadge(clinic.dhaLicenseStatus)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{clinic.doctorCount}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{clinic.patientCount}</td>
                    <td className="py-3 px-4">{getPlanBadge(clinic.subscriptionPlan)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">AED {clinic.monthlyRevenue.toLocaleString()}</td>
                    <td className="py-3 px-4">{getStatusBadge(clinic.status)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewClinic(clinic)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded" title="More">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing 1 to {clinics.length} of {clinics.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
              <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Next</button>
            </div>
          </div>
        </div>
      </div>

      <RegisterClinicModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}
