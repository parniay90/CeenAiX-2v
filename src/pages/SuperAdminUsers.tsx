import { useState } from 'react';
import {
  Plus, Search, Filter, Download, ChevronLeft, Eye, CreditCard as Edit, MoreVertical,
  Users as UsersIcon, CheckCircle, Clock, XCircle, AlertCircle, Lock, UserCheck,
  Stethoscope, Building2, Pill, FlaskConical, Shield, User as UserIcon
} from 'lucide-react';
import type { User, UserRole, UserStatus } from '../types/user';
import { allMockUsers } from '../data/mockUsers';
import UserProfile from '../components/UserProfile';
import InviteUserModal from '../components/InviteUserModal';

type ViewMode = 'list' | 'profile';
type UserTab = 'all' | 'patients' | 'doctors' | 'clinic-staff' | 'pharmacists' | 'lab-techs' | 'insurance' | 'admins';

export default function SuperAdminUsers() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users] = useState<User[]>(allMockUsers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<UserTab>('all');

  const [filters, setFilters] = useState({
    status: 'All' as UserStatus | 'All',
    role: 'All' as UserRole | 'All',
    emirate: 'All',
    gender: 'All',
    ageRange: 'All',
    lastLogin: 'All',
    twoFactor: 'All',
    insurance: 'All'
  });

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'Active').length;
  const patients = users.filter(u => u.role === 'Patient').length;
  const doctors = users.filter(u => u.role === 'Doctor').length;
  const pharmacyLab = users.filter(u => u.role === 'Pharmacist' || u.role === 'Lab Technician').length;
  const pendingUsers = users.filter(u => u.status === 'Pending').length;

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewMode('profile');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const getStatusBadge = (status: UserStatus) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      Pending: 'bg-amber-100 text-amber-700 border-amber-200',
      Suspended: 'bg-red-100 text-red-700 border-red-200',
      Deactivated: 'bg-gray-100 text-gray-700 border-gray-200',
      Locked: 'bg-red-200 text-red-900 border-red-300',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<UserRole, string> = {
      'Patient': 'bg-blue-50 text-blue-700 border-blue-100',
      'Doctor': 'bg-purple-50 text-purple-700 border-purple-100',
      'Clinic Admin': 'bg-indigo-50 text-indigo-700 border-indigo-100',
      'Pharmacist': 'bg-emerald-50 text-emerald-700 border-emerald-100',
      'Lab Technician': 'bg-teal-50 text-teal-700 border-teal-100',
      'Insurance Manager': 'bg-orange-50 text-orange-700 border-orange-100',
      'Super Admin': 'bg-red-50 text-red-700 border-red-100',
      'Platform Admin': 'bg-red-50 text-red-700 border-red-100',
      'Support Agent': 'bg-red-50 text-red-700 border-red-100',
      'Finance Admin': 'bg-red-50 text-red-700 border-red-100',
      'Technical Admin': 'bg-red-50 text-red-700 border-red-100',
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${styles[role]}`}>
        {role}
      </span>
    );
  };

  const maskEmiratesId = (id: string) => {
    const parts = id.split('-');
    if (parts.length === 4) {
      return `XXX-XXXX-XXXXXXX-${parts[3]}`;
    }
    return 'XXX-XXXX-XXXXXXX-X';
  };

  const getRelativeTime = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  const filteredUsersByTab = users.filter(user => {
    if (activeTab === 'all') return true;
    if (activeTab === 'patients') return user.role === 'Patient';
    if (activeTab === 'doctors') return user.role === 'Doctor';
    if (activeTab === 'clinic-staff') return user.role === 'Clinic Admin';
    if (activeTab === 'pharmacists') return user.role === 'Pharmacist';
    if (activeTab === 'lab-techs') return user.role === 'Lab Technician';
    if (activeTab === 'insurance') return user.role === 'Insurance Manager';
    if (activeTab === 'admins') return ['Super Admin', 'Platform Admin', 'Support Agent', 'Finance Admin', 'Technical Admin'].includes(user.role);
    return true;
  });

  const filteredUsers = filteredUsersByTab.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'All' || user.status === filters.status;
    const matchesRole = filters.role === 'All' || user.role === filters.role;
    const matchesEmirate = filters.emirate === 'All' || user.emirate === filters.emirate;

    return matchesSearch && matchesStatus && matchesRole && matchesEmirate;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
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
    if (selectedRows.size === paginatedUsers.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedUsers.map(u => u.id)));
    }
  };

  const tabs: { id: UserTab; label: string; icon: any; count: number }[] = [
    { id: 'all', label: 'All Users', icon: UsersIcon, count: users.length },
    { id: 'patients', label: 'Patients', icon: UserIcon, count: patients },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, count: doctors },
    { id: 'clinic-staff', label: 'Clinic Staff', icon: Building2, count: users.filter(u => u.role === 'Clinic Admin').length },
    { id: 'pharmacists', label: 'Pharmacists', icon: Pill, count: users.filter(u => u.role === 'Pharmacist').length },
    { id: 'lab-techs', label: 'Lab Technicians', icon: FlaskConical, count: users.filter(u => u.role === 'Lab Technician').length },
    { id: 'insurance', label: 'Insurance Managers', icon: Shield, count: users.filter(u => u.role === 'Insurance Manager').length },
    { id: 'admins', label: 'CeenAiX Admins', icon: UserCheck, count: users.filter(u => ['Super Admin', 'Platform Admin', 'Support Agent', 'Finance Admin', 'Technical Admin'].includes(u.role)).length },
  ];

  if (viewMode === 'profile' && selectedUser) {
    return <UserProfile user={selectedUser} onBack={handleBackToList} />;
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
                <span className="text-blue-600 font-medium">User Management</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Sora, sans-serif' }}>
                User Management
              </h1>
              <p className="text-gray-600 mt-1">Manage all users across the CeenAiX platform</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg shadow-blue-600/30"
            >
              <Plus className="w-5 h-5" />
              Invite New User
            </button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Total Users</span>
              <UsersIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{totalUsers}</div>
            <div className="text-xs text-emerald-600 font-medium">+47 this month</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Active Users</span>
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 mb-1">{activeUsers}</div>
            <div className="text-xs text-gray-500">All verified</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Patients</span>
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-1">{patients}</div>
            <div className="text-xs text-gray-500">Platform members</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Doctors</span>
              <Stethoscope className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-1">{doctors}</div>
            <div className="text-xs text-gray-500">Healthcare providers</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Pharmacy & Lab</span>
              <Pill className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-teal-600 mb-1">{pharmacyLab}</div>
            <div className="text-xs text-gray-500">Support staff</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm font-medium">Pending</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-1">{pendingUsers}</div>
            <div className="text-xs text-gray-500">Awaiting verification</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-1 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, Emirates ID, phone, user ID..."
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
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Verification</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Deactivated">Deactivated</option>
                    <option value="Locked">Locked</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={filters.role}
                    onChange={(e) => setFilters({...filters, role: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Patient">Patient</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Lab Technician">Lab Technician</option>
                    <option value="Insurance Manager">Insurance Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Emirates</label>
                  <select
                    value={filters.emirate}
                    onChange={(e) => setFilters({...filters, emirate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">2FA Status</label>
                  <select
                    value={filters.twoFactor}
                    onChange={(e) => setFilters({...filters, twoFactor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All">All</option>
                    <option value="Yes">Enabled</option>
                    <option value="No">Disabled</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-gray-600">
                Showing {filteredUsers.length} users
              </span>
              {selectedRows.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{selectedRows.size} selected</span>
                  <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
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
                      checked={selectedRows.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Linked Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Emirates ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(user.id)}
                        onChange={() => toggleRowSelection(user.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {user.fullName.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-gray-900">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.linkedEntity ? (
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                          {user.linkedEntity.name}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-600">{maskEmiratesId(user.emiratesId)}</span>
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{user.email}</div>
                      <div className="text-xs text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={user.lastLogin ? 'text-gray-600' : 'text-amber-600'}>
                        {getRelativeTime(user.lastLogin)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Profile"
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
                <option value={100}>100</option>
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
                {[...Array(Math.min(5, totalPages))].map((_, i) => (
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

      {showInviteModal && (
        <InviteUserModal onClose={() => setShowInviteModal(false)} />
      )}
    </div>
  );
}
