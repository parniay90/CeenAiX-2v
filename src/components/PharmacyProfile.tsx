import { useState } from 'react';
import { ChevronLeft, CreditCard as Edit, Ban, CheckCircle, MoreVertical, Building2, Users, FileText, Shield, Bell, Activity, Settings as SettingsIcon, Phone, Mail, MapPin, Clock, Calendar, TrendingUp, Package, Eye, Trash2, AlertCircle, Download, Plus, X, Search, Filter } from 'lucide-react';
import { Pharmacy } from '../types/pharmacy';
import {
  mockPharmacyStaff, mockPrescriptions, mockInsuranceClaims, mockReminders,
  mockAuditLog, mockInsuranceNetworks
} from '../data/mockPharmacies';

interface PharmacyProfileProps {
  pharmacy: Pharmacy;
  onBack: () => void;
}

type Tab = 'overview' | 'staff' | 'prescriptions' | 'insurance' | 'reminders' | 'audit' | 'settings';

export default function PharmacyProfile({ pharmacy, onBack }: PharmacyProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showEditModal, setShowEditModal] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'insurance', label: 'Insurance', icon: Shield },
    { id: 'reminders', label: 'Reminders', icon: Bell },
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
    };
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="p-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-4"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Pharmacies
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              {pharmacy.logo ? (
                <img src={pharmacy.logo} alt={pharmacy.name} className="w-24 h-24 rounded-xl object-cover border-2 border-gray-200" />
              ) : (
                <div className="w-24 h-24 bg-blue-100 rounded-xl flex items-center justify-center border-2 border-blue-200">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span>Dashboard</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span>Pharmacies</span>
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span className="text-blue-600 font-medium">{pharmacy.name}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {pharmacy.name}
                </h1>
                <div className="flex items-center gap-3">
                  {getStatusBadge(pharmacy.status)}
                  {getStatusBadge(pharmacy.dhaLicenseStatus)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                {pharmacy.status === 'Suspended' ? (
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

      <div className="p-8">
        {activeTab === 'overview' && <OverviewTab pharmacy={pharmacy} />}
        {activeTab === 'staff' && <StaffTab pharmacy={pharmacy} />}
        {activeTab === 'prescriptions' && <PrescriptionsTab pharmacy={pharmacy} />}
        {activeTab === 'insurance' && <InsuranceTab pharmacy={pharmacy} />}
        {activeTab === 'reminders' && <RemindersTab pharmacy={pharmacy} />}
        {activeTab === 'audit' && <AuditTab pharmacy={pharmacy} />}
        {activeTab === 'settings' && <SettingsTab pharmacy={pharmacy} />}
      </div>
    </div>
  );
}

function OverviewTab({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Pharmacy Details</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Pharmacy Name</label>
              <p className="mt-1 text-gray-900 font-semibold">{pharmacy.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Pharmacy Type</label>
              <p className="mt-1 text-gray-900 font-semibold">{pharmacy.type}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">DHA License Number</label>
              <p className="mt-1 text-gray-900 font-semibold font-mono">{pharmacy.dhaLicenseNumber}</p>
              <p className="text-xs text-gray-500 mt-1">Expires: {pharmacy.dhaLicenseExpiry || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Trade License</label>
              <p className="mt-1 text-gray-900 font-semibold font-mono">{pharmacy.tradeLicenseNumber || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emirate</label>
              <p className="mt-1 text-gray-900 font-semibold">{pharmacy.emirate}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Full Address</label>
              <p className="mt-1 text-gray-900">{pharmacy.address}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-500">Primary Contact</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 font-medium">{pharmacy.primaryContactName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{pharmacy.primaryContactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{pharmacy.primaryContactPhone}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Subscription Plan</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${
                  pharmacy.subscriptionPlan === 'Enterprise' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                  pharmacy.subscriptionPlan === 'Pro' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {pharmacy.subscriptionPlan}
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">Renews: {pharmacy.subscriptionRenewal}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Registered On</label>
              <p className="mt-1 text-gray-900">{new Date(pharmacy.registeredOn).toLocaleDateString()}</p>
            </div>
          </div>

          {pharmacy.internalNotes && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Internal Notes (Admin Only)
              </label>
              <p className="mt-2 text-sm text-gray-700 bg-amber-50 p-4 rounded-lg border border-amber-200">
                {pharmacy.internalNotes}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Snapshot</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="text-sm text-blue-600 font-medium mb-1">Prescriptions This Month</div>
              <div className="text-2xl font-bold text-blue-700">{pharmacy.prescriptionsThisMonth.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="text-sm text-emerald-600 font-medium mb-1">Active Staff</div>
              <div className="text-2xl font-bold text-emerald-700">{pharmacy.staffCount}</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <div className="text-sm text-purple-600 font-medium mb-1">Insurance Networks</div>
              <div className="text-2xl font-bold text-purple-700">{pharmacy.insuranceNetworks.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockAuditLog.slice(0, 5).map((log) => (
              <div key={log.id} className="flex gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(log.timestamp).toLocaleString()} • {log.performedBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const staff = mockPharmacyStaff.filter(s => s.pharmacyId === pharmacy.id);
  const [showAddStaff, setShowAddStaff] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Staff Members</h3>
          <p className="text-gray-600 mt-1">{staff.length} team members</p>
        </div>
        <button
          onClick={() => setShowAddStaff(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Staff Member
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Staff Member</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">DHA License</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Last Login</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                    <div className="font-semibold text-gray-900">{member.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="text-gray-900">{member.email}</div>
                    <div className="text-gray-500">{member.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {member.dhaLicenseNumber ? (
                    <div className="text-sm">
                      <div className="font-mono text-gray-900">{member.dhaLicenseNumber}</div>
                      <div className="text-xs text-gray-500">Exp: {member.dhaLicenseExpiry}</div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                    member.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    member.status === 'Pending Invite' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {member.lastLogin ? new Date(member.lastLogin).toLocaleString() : 'Never'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
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

function PrescriptionsTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const prescriptions = mockPrescriptions.filter(p => p.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Total This Month</div>
          <div className="text-3xl font-bold text-gray-900">{pharmacy.prescriptionsThisMonth}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Dispensed</div>
          <div className="text-3xl font-bold text-emerald-600">
            {prescriptions.filter(p => p.status === 'Dispensed').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Pending</div>
          <div className="text-3xl font-bold text-amber-600">
            {prescriptions.filter(p => p.status === 'Acknowledged').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Cancelled</div>
          <div className="text-3xl font-bold text-red-600">
            {prescriptions.filter(p => p.status === 'Cancelled').length}
          </div>
        </div>
      </div>

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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">RX ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Medications</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date Received</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Insurance</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {prescriptions.map((rx) => (
              <tr key={rx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-mono text-sm text-gray-900">{rx.id}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{rx.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{rx.doctorName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {rx.medications.length} item{rx.medications.length > 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(rx.dateReceived).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                    rx.status === 'Dispensed' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    rx.status === 'Acknowledged' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {rx.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{rx.insurance || 'Self-Pay'}</td>
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

function InsuranceTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const claims = mockInsuranceClaims.filter(c => c.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Connected Networks</h3>
        <div className="grid grid-cols-2 gap-4">
          {mockInsuranceNetworks.map((network) => (
            <div key={network.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                    {network.logo}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{network.name}</div>
                    <div className="text-xs text-gray-500">Connected since {new Date(network.connectedSince).toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                  network.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                  'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {network.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500">Submitted</div>
                  <div className="text-lg font-bold text-gray-900">{network.claimsThisMonth.submitted}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Approved</div>
                  <div className="text-lg font-bold text-emerald-600">{network.claimsThisMonth.approved}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Rejected</div>
                  <div className="text-lg font-bold text-red-600">{network.claimsThisMonth.rejected}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-600">Approval Rate: </span>
                  <span className={`font-bold ${
                    network.approvalRate >= 80 ? 'text-emerald-600' :
                    network.approvalRate >= 50 ? 'text-amber-600' :
                    'text-red-600'
                  }`}>
                    {network.approvalRate}%
                  </span>
                </div>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Disconnect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Claims</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Claim ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm text-gray-900">{claim.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{claim.patientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{claim.provider}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">AED {claim.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(claim.submittedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                      claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                      claim.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                      claim.status === 'Pending' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                      'bg-blue-100 text-blue-700 border-blue-200'
                    }`}>
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

function RemindersTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const reminders = mockReminders.filter(r => r.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Total Active</div>
          <div className="text-3xl font-bold text-gray-900">{reminders.filter(r => r.status === 'Active').length}</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Sent Today</div>
          <div className="text-3xl font-bold text-blue-600">24</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="text-sm text-gray-600 font-medium mb-1">Patient Opt-Outs</div>
          <div className="text-3xl font-bold text-red-600">3</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Medication</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Created By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reminders.map((reminder) => (
              <tr key={reminder.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{reminder.patientName}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{reminder.medication}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{reminder.schedule}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium border border-blue-100">
                    {reminder.channel}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{reminder.createdBy}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                    reminder.status === 'Active' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    reminder.status === 'Paused' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    'bg-gray-100 text-gray-700 border-gray-200'
                  }`}>
                    {reminder.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <Ban className="w-4 h-4" />
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

function AuditTab({ pharmacy }: { pharmacy: Pharmacy }) {
  const logs = mockAuditLog.filter(l => l.pharmacyId === pharmacy.id);

  return (
    <div className="space-y-6">
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
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Timestamp</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Performed By</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Details</th>
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

function SettingsTab({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Pharmacy Status Management</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Current Status</label>
            <div className="mt-2">
              {pharmacy.status === 'Active' ? (
                <span className="px-3 py-1 rounded-lg text-sm font-semibold border bg-emerald-100 text-emerald-700 border-emerald-200">
                  Active
                </span>
              ) : pharmacy.status === 'Suspended' ? (
                <span className="px-3 py-1 rounded-lg text-sm font-semibold border bg-red-100 text-red-700 border-red-200">
                  Suspended
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg text-sm font-semibold border bg-amber-100 text-amber-700 border-amber-200">
                  {pharmacy.status}
                </span>
              )}
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

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription & Billing</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Current Plan</label>
              <p className="mt-1 text-gray-900 font-semibold">{pharmacy.subscriptionPlan}</p>
              <p className="text-xs text-gray-500">Renews: {pharmacy.subscriptionRenewal}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Change Plan</label>
              <select className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="Basic">Basic - AED 299/month</option>
                <option value="Pro">Pro - AED 599/month</option>
                <option value="Enterprise">Enterprise - AED 1,299/month</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">DHA License Management</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">DHA License Number</label>
              <input
                type="text"
                value={pharmacy.dhaLicenseNumber}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">License Expiry Date</label>
              <input
                type="date"
                value={pharmacy.dhaLicenseExpiry}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Verification Status</label>
              <select
                value={pharmacy.dhaLicenseStatus}
                className="mt-1 w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Verified">Verified</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
                <option value="Not Submitted">Not Submitted</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Feature Access</h3>
        <div className="space-y-3">
          {['AI Prescription Assistant', 'Insurance Module', 'Patient Reminders Module', 'FHIR API Access', 'Analytics & Reports'].map((feature) => (
            <div key={feature} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <span className="font-medium text-gray-900">{feature}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Export All Pharmacy Data</span>
            <Download className="w-5 h-5" />
          </button>
          <button className="w-full px-4 py-3 bg-white border-2 border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Reset Pharmacy Portal</span>
            <AlertCircle className="w-5 h-5" />
          </button>
          <button className="w-full px-4 py-3 bg-red-600 border-2 border-red-700 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-left flex items-center justify-between">
            <span>Delete Pharmacy Account</span>
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
