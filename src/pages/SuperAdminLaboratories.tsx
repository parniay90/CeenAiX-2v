import { useState } from 'react';
import { Plus, Search, Filter, Download, Eye, CreditCard as Edit, MoreVertical, FlaskConical, CheckCircle, Clock, XCircle, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import {
  Laboratory,
  LabType,
  LabStatus,
  DhaLicenseStatus,
  Emirates,
  SubscriptionPlan,
  LabAccreditation,
} from '../types/laboratory';
import { mockLaboratories } from '../data/mockLaboratories';
import RegisterLabModal from '../components/RegisterLabModal';
import LaboratoryProfile from '../components/LaboratoryProfile';

type LabTab = 'all' | 'active' | 'pending' | 'suspended' | 'expiring' | 'new';

export default function SuperAdminLaboratories() {
  const [laboratories] = useState<Laboratory[]>(mockLaboratories);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [activeTab, setActiveTab] = useState<LabTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'All' as LabStatus | 'All',
    type: 'All' as LabType | 'All',
    accreditation: 'All' as LabAccreditation | 'All',
    emirates: 'All' as Emirates | 'All',
    plan: 'All' as SubscriptionPlan | 'All',
    dhaLicenseStatus: 'All' as DhaLicenseStatus | 'All',
  });
  const [selectedLabs, setSelectedLabs] = useState<string[]>([]);

  const totalLabs = laboratories.length;
  const activeLabs = laboratories.filter((l) => l.status === 'Active' && l.dhaLicenseStatus === 'Verified').length;
  const pendingLabs = laboratories.filter((l) => l.status === 'Pending').length;
  const suspendedLabs = laboratories.filter((l) => l.status === 'Suspended').length;
  const totalOrders = laboratories.reduce((sum, l) => sum + l.ordersThisMonth, 0);
  const totalCriticalFlags = laboratories.reduce((sum, l) => sum + l.criticalFlagsThisMonth, 0);

  const tabs: { id: LabTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Labs', count: totalLabs },
    { id: 'active', label: 'Active', count: activeLabs },
    { id: 'pending', label: 'Pending Verification', count: pendingLabs },
    { id: 'suspended', label: 'Suspended', count: suspendedLabs },
    {
      id: 'expiring',
      label: 'DHA License Expiring Soon',
      count: laboratories.filter((l) => l.dhaLicenseStatus === 'Expiring Soon').length,
    },
    {
      id: 'new',
      label: 'Newly Registered',
      count: laboratories.filter((l) => new Date(l.registeredDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .length,
    },
  ];

  const getStatusBadge = (status: LabStatus) => {
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

  const getTypeBadge = (type: LabType) => {
    const colors: Record<LabType, string> = {
      Clinical: 'bg-blue-100 text-blue-700',
      Pathology: 'bg-purple-100 text-purple-700',
      Microbiology: 'bg-green-100 text-green-700',
      'Radiology & Imaging': 'bg-orange-100 text-orange-700',
      Genetics: 'bg-pink-100 text-pink-700',
      Hematology: 'bg-red-100 text-red-700',
      Biochemistry: 'bg-teal-100 text-teal-700',
      'Multi-Discipline': 'bg-indigo-100 text-indigo-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type]}`}>{type}</span>;
  };

  const getAccreditationBadge = (acc: LabAccreditation) => {
    if (acc === 'None') {
      return <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{acc}</span>;
    }
    const colors: Record<LabAccreditation, string> = {
      CAP: 'bg-blue-100 text-blue-700',
      'ISO 15189': 'bg-emerald-100 text-emerald-700',
      CLIA: 'bg-purple-100 text-purple-700',
      JCI: 'bg-orange-100 text-orange-700',
      ESMA: 'bg-pink-100 text-pink-700',
      None: 'bg-gray-100 text-gray-600',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[acc]}`}>{acc}</span>;
  };

  const handleViewLab = (lab: Laboratory) => {
    setSelectedLab(lab);
  };

  const handleRegister = (data: any) => {
    console.log('Registering laboratory:', data);
  };

  const toggleLabSelection = (labId: string) => {
    setSelectedLabs((prev) => (prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]));
  };

  const toggleSelectAll = () => {
    setSelectedLabs(selectedLabs.length === laboratories.length ? [] : laboratories.map((l) => l.id));
  };

  // If viewing a selected lab, render LaboratoryProfile component
  if (selectedLab) {
    return <LaboratoryProfile laboratory={selectedLab} onBack={() => setSelectedLab(null)} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratories</h1>
            <p className="text-gray-600 mt-1">Manage all registered laboratories on CeenAiX</p>
          </div>
          <button
            onClick={() => setShowRegisterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Register New Laboratory
          </button>
        </div>
        <div className="text-sm text-gray-500">Dashboard &gt; Laboratories</div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Registered</span>
            <FlaskConical className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalLabs}</div>
          <div className="text-xs text-emerald-600 mt-1">+4 this month</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active & Verified</span>
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{activeLabs}</div>
          <div className="text-xs text-emerald-600 mt-1">DHA Verified</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Pending Verification</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{pendingLabs}</div>
          <div className="text-xs text-amber-600 mt-1">Awaiting review</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Suspended</span>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{suspendedLabs}</div>
          <div className="text-xs text-red-600 mt-1">Compliance issues</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Lab Orders This Month</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalOrders.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Across all labs</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Critical Flags</span>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 animate-pulse">{totalCriticalFlags}</div>
          <div className="text-xs text-red-600 mt-1">This month</div>
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
                placeholder="Search laboratories by name, DHA license, email, phone..."
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
              <option value="All">All Lab Types</option>
              <option value="Clinical">Clinical</option>
              <option value="Pathology">Pathology</option>
              <option value="Microbiology">Microbiology</option>
              <option value="Radiology & Imaging">Radiology & Imaging</option>
              <option value="Genetics">Genetics</option>
              <option value="Hematology">Hematology</option>
              <option value="Biochemistry">Biochemistry</option>
              <option value="Multi-Discipline">Multi-Discipline</option>
            </select>

            <select
              value={filters.accreditation}
              onChange={(e) => setFilters({ ...filters, accreditation: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Accreditations</option>
              <option value="CAP">CAP</option>
              <option value="ISO 15189">ISO 15189</option>
              <option value="CLIA">CLIA</option>
              <option value="JCI">JCI</option>
              <option value="ESMA">ESMA</option>
              <option value="None">None</option>
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
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
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

            <select
              value={filters.dhaLicenseStatus}
              onChange={(e) => setFilters({ ...filters, dhaLicenseStatus: e.target.value as any })}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">DHA License Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
              <option value="Not Submitted">Not Submitted</option>
            </select>

            <button className="text-sm text-blue-600 hover:text-blue-700 whitespace-nowrap">Clear All Filters</button>
          </div>

          <div className="text-sm text-gray-600 mb-4">Showing {laboratories.length} laboratories</div>

          {selectedLabs.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">{selectedLabs.length} laboratories selected</span>
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
                      checked={selectedLabs.length === laboratories.length}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">#</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Laboratory</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DHA License</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Accreditation</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Test Catalog</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Orders (Month)</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Critical Flags</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {laboratories.map((lab, index) => (
                  <tr key={lab.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedLabs.includes(lab.id)}
                        onChange={() => toggleLabSelection(lab.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={lab.logo} alt={lab.name} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <div className="font-medium text-gray-900">{lab.name}</div>
                          <div className="text-xs text-gray-500">{lab.emirates}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{getTypeBadge(lab.type)}</td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-900">{lab.area}</div>
                      <div className="text-xs text-gray-500">{lab.emirates}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-gray-900 mb-1">{lab.dhaLicenseNumber}</div>
                      {getDhaLicenseBadge(lab.dhaLicenseStatus)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {lab.accreditations.slice(0, 2).map((acc) => (
                          <div key={acc}>{getAccreditationBadge(acc)}</div>
                        ))}
                        {lab.accreditations.length > 2 && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{lab.accreditations.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{lab.testCatalogSize}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{lab.ordersThisMonth.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-medium ${
                          lab.criticalFlagsThisMonth > 0 ? 'text-red-600' : 'text-gray-900'
                        }`}
                      >
                        {lab.criticalFlagsThisMonth}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getPlanBadge(lab.subscriptionPlan)}</td>
                    <td className="py-3 px-4">{getStatusBadge(lab.status)}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {new Date(lab.registeredDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewLab(lab)}
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
              Showing 1 to {laboratories.length} of {laboratories.length} entries
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

      <RegisterLabModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}
