import { useState } from 'react';
import { Plus, Search, Filter, Download, ChevronDown, Eye, CreditCard as Edit, Settings as SettingsIcon, MoreVertical, Building2, CheckCircle, Clock, XCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { Pharmacy, PharmacyStatus, PharmacyType, DHALicenseStatus, SubscriptionPlan } from '../types/pharmacy';
import { mockPharmacies } from '../data/mockPharmacies';
import PharmacyProfile from '../components/PharmacyProfile';
import AddPharmacyModal from '../components/AddPharmacyModal';

type ViewMode = 'list' | 'profile';

export default function SuperAdminPharmacies() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    status: 'All' as PharmacyStatus | 'All',
    type: 'All' as PharmacyType | 'All',
    location: 'All',
    plan: 'All' as SubscriptionPlan | 'All',
    dhaStatus: 'All' as DHALicenseStatus | 'All',
  });

  const totalPharmacies = pharmacies.length;
  const activePharmacies = pharmacies.filter(p => p.status === 'Active' && p.dhaLicenseStatus === 'Verified').length;
  const pendingPharmacies = pharmacies.filter(p => p.status === 'Pending' || p.dhaLicenseStatus === 'Pending').length;
  const suspendedPharmacies = pharmacies.filter(p => p.status === 'Suspended').length;

  const handleViewPharmacy = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setViewMode('profile');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPharmacy(null);
  };

  const getStatusBadge = (status: PharmacyStatus) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
      Inactive: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getDHABadge = (status: DHALicenseStatus) => {
    const config = {
      Verified: { icon: CheckCircle, style: 'text-emerald-600', label: 'Verified ✓' },
      Pending: { icon: Clock, style: 'text-amber-600', label: 'Pending ⏳' },
      Expired: { icon: AlertCircle, style: 'text-red-600', label: 'Expired ⚠' },
      'Not Submitted': { icon: XCircle, style: 'text-gray-600', label: 'Not Submitted ✗' },
    };
    const { icon: Icon, style, label } = config[status];
    return (
      <span className={`flex items-center gap-1 text-xs font-medium ${style}`}>
        <Icon className="w-3 h-3" />
        {label}
      </span>
    );
  };

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const matchesSearch = searchTerm === '' ||
      pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.dhaLicenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pharmacy.primaryContactEmail.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'All' || pharmacy.status === filters.status;
    const matchesType = filters.type === 'All' || pharmacy.type === filters.type;
    const matchesLocation = filters.location === 'All' || pharmacy.emirate === filters.location;
    const matchesPlan = filters.plan === 'All' || pharmacy.subscriptionPlan === filters.plan;
    const matchesDHA = filters.dhaStatus === 'All' || pharmacy.dhaLicenseStatus === filters.dhaStatus;

    return matchesSearch && matchesStatus && matchesType && matchesLocation && matchesPlan && matchesDHA;
  });

  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);
  const paginatedPharmacies = filteredPharmacies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleRowSelection = (id: string) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedPharmacies.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedPharmacies.map(p => p.id)));
    }
  };

  if (viewMode === 'profile' && selectedPharmacy) {
    return <PharmacyProfile pharmacy={selectedPharmacy} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span className="text-blue-600 font-medium">Pharmacies</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                Pharmacies
              </h1>
              <p className="text-gray-600 mt-1">Manage all registered pharmacies on CeenAiX</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-5 h-5" />
              Add New Pharmacy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Registered</span>
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalPharmacies}</div>
            <div className="text-xs text-emerald-600 font-medium">+3 this month</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active & DHA Verified</span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">{activePharmacies}</div>
            <div className="text-xs text-gray-500">All systems operational</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Pending Verification</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">{pendingPharmacies}</div>
            <div className="text-xs text-gray-500">Awaiting review</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Suspended</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-600 mb-1">{suspendedPharmacies}</div>
            <div className="text-xs text-gray-500">Requires action</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by pharmacy name, DHA license, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-5 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Community">Community</option>
                    <option value="Hospital-Attached">Hospital-Attached</option>
                    <option value="Clinic-Attached">Clinic-Attached</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    value={filters.plan}
                    onChange={(e) => setFilters({...filters, plan: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Basic">Basic</option>
                    <option value="Pro">Pro</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">DHA Status</label>
                  <select
                    value={filters.dhaStatus}
                    onChange={(e) => setFilters({...filters, dhaStatus: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                    <option value="Expired">Expired</option>
                    <option value="Not Submitted">Not Submitted</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Showing {filteredPharmacies.length} pharmacies
              </span>
              {selectedRows.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{selectedRows.size} selected</span>
                  <button className="px-3 py-1.5 text-sm bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors">
                    Suspend
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                    Activate
                  </button>
                  <button className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    Export Selected
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedPharmacies.length && paginatedPharmacies.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Pharmacy
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    DHA License
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Insurance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Staff
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    RX/Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(pharmacy.id)}
                        onChange={() => toggleRowSelection(pharmacy.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {pharmacy.logo ? (
                          <img src={pharmacy.logo} alt={pharmacy.name} className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{pharmacy.name}</div>
                          <div className="text-sm text-gray-500">{pharmacy.emirate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                        {pharmacy.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm font-mono text-gray-900">{pharmacy.dhaLicenseNumber}</div>
                        {getDHABadge(pharmacy.dhaLicenseStatus)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {pharmacy.insuranceNetworks.slice(0, 3).map((network) => (
                          <span key={network} className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-100">
                            {network}
                          </span>
                        ))}
                        {pharmacy.insuranceNetworks.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-50 text-gray-600 rounded text-xs font-medium border border-gray-200">
                            +{pharmacy.insuranceNetworks.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                        pharmacy.subscriptionPlan === 'Enterprise' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        pharmacy.subscriptionPlan === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {pharmacy.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {pharmacy.staffCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {pharmacy.prescriptionsThisMonth.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(pharmacy.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPharmacy(pharmacy)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="Settings"
                        >
                          <SettingsIcon className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          title="More"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1.5 rounded-lg text-sm ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddPharmacyModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
