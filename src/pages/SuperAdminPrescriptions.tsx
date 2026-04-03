import { useState } from 'react';
import {
  Pill,
  Plus,
  Search,
  Filter,
  Download,
  Flag,
  X,
  ChevronDown,
  TrendingUp,
  Send,
  Check,
  XCircle,
  Clock,
  Shield,
  Copy,
  Eye,
  MoreVertical,
} from 'lucide-react';
import { mockPrescriptions } from '../data/mockPrescriptions';
import type { Prescription, PrescriptionStatus, FlagReason } from '../types/prescription';
import PrescriptionDetailView from '../components/PrescriptionDetailView';
import CreateManualPrescriptionModal from '../components/CreateManualPrescriptionModal';

type TabType = 'all' | 'pending' | 'dispensed' | 'cancelled' | 'flagged' | 'expiring' | 'controlled';

export default function SuperAdminPrescriptions() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [filters, setFilters] = useState({
    status: 'all',
    clinic: '',
    doctor: '',
    pharmacy: '',
    patient: '',
    medication: '',
    category: 'all',
    insurance: 'all',
    controlledSubstance: 'all',
    dateFrom: '',
    dateTo: '',
    validity: 'all',
    refills: 'all',
    flagged: 'all',
  });

  const prescriptions = mockPrescriptions;

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (activeTab === 'pending') return rx.status === 'sent' || rx.status === 'acknowledged' || rx.status === 'dispensing';
    if (activeTab === 'dispensed') return rx.status === 'dispensed' || rx.status === 'partially_dispensed';
    if (activeTab === 'cancelled') return rx.status === 'cancelled';
    if (activeTab === 'flagged') return rx.isFlagged;
    if (activeTab === 'expiring') {
      const daysUntilExpiry = Math.ceil((new Date(rx.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
    }
    if (activeTab === 'controlled') return rx.hasControlledSubstance;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        rx.id.toLowerCase().includes(query) ||
        rx.patientName.toLowerCase().includes(query) ||
        rx.doctorName.toLowerCase().includes(query) ||
        rx.medications.some((m) => m.drugName.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const stats = {
    totalThisMonth: 4821,
    sentToPharmacy: 4103,
    dispensed: 3687,
    pending: 416,
    cancelled: 203,
    withInsurance: 2941,
  };

  const tabCounts = {
    all: prescriptions.length,
    pending: prescriptions.filter((rx) => ['sent', 'acknowledged', 'dispensing'].includes(rx.status)).length,
    dispensed: prescriptions.filter((rx) => rx.status === 'dispensed' || rx.status === 'partially_dispensed').length,
    cancelled: prescriptions.filter((rx) => rx.status === 'cancelled').length,
    flagged: prescriptions.filter((rx) => rx.isFlagged).length,
    expiring: prescriptions.filter((rx) => {
      const days = Math.ceil((new Date(rx.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 7 && days > 0;
    }).length,
    controlled: prescriptions.filter((rx) => rx.hasControlledSubstance).length,
  };

  const getStatusBadge = (status: PrescriptionStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      sent: 'bg-blue-100 text-blue-700',
      acknowledged: 'bg-cyan-100 text-cyan-700',
      dispensing: 'bg-purple-100 text-purple-700',
      dispensed: 'bg-emerald-100 text-emerald-700',
      partially_dispensed: 'bg-teal-100 text-teal-700',
      cancelled: 'bg-red-100 text-red-700',
      expired: 'bg-gray-200 text-gray-600',
    };

    const labels = {
      draft: 'Draft',
      sent: 'Sent',
      acknowledged: 'Acknowledged',
      dispensing: 'Dispensing',
      dispensed: 'Dispensed',
      partially_dispensed: 'Partially Dispensed',
      cancelled: 'Cancelled',
      expired: 'Expired',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getInsuranceBadge = (coverage: Prescription['insuranceCoverage']) => {
    const styles = {
      covered: 'bg-emerald-100 text-emerald-700',
      partial: 'bg-amber-100 text-amber-700',
      self_pay: 'bg-gray-100 text-gray-700',
      pending_check: 'bg-blue-100 text-blue-700',
    };

    const labels = {
      covered: 'Covered',
      partial: 'Partial',
      self_pay: 'Self-Pay',
      pending_check: 'Pending Check',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[coverage]}`}>
        {labels[coverage]}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isExpiringSoon = (validUntil: string) => {
    const days = Math.ceil((new Date(validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPrescriptions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPrescriptions.map((rx) => rx.id));
    }
  };

  if (selectedPrescription) {
    return (
      <PrescriptionDetailView
        prescription={selectedPrescription}
        onBack={() => setSelectedPrescription(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span className="text-gray-900 font-medium">Prescriptions</span>
              </div>
              <h1 className="text-3xl font-bold text-[#0A1628] font-['Sora']">Prescriptions</h1>
              <p className="text-gray-600 mt-1">Monitor and manage all prescriptions issued across CeenAiX</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Manual Prescription
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalThisMonth.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Total This Month</div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Send className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.sentToPharmacy.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Sent to Pharmacy</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.dispensed.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Dispensed This Month</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pending.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Dispensing</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.cancelled.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Cancelled This Month</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.withInsurance.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">With Insurance</div>
            <div className="text-sm text-gray-500 mt-1">61% of total</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-6 px-6">
              {[
                { key: 'all', label: 'All Prescriptions', count: tabCounts.all },
                { key: 'pending', label: 'Pending', count: tabCounts.pending },
                { key: 'dispensed', label: 'Dispensed', count: tabCounts.dispensed },
                { key: 'cancelled', label: 'Cancelled', count: tabCounts.cancelled },
                { key: 'flagged', label: 'Flagged', count: tabCounts.flagged },
                { key: 'expiring', label: 'Expiring Soon', count: tabCounts.expiring },
                { key: 'controlled', label: 'Controlled Substances', count: tabCounts.controlled },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`py-4 px-2 border-b-2 transition-colors relative ${
                    activeTab === tab.key
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="font-medium">{tab.label}</span>
                  <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-700">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Prescription ID, Patient, Doctor, Medication..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>

            {selectedIds.length > 0 && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-900">
                    {selectedIds.length} prescription{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    <Flag className="w-4 h-4 inline mr-1" />
                    Flag Selected
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm">
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Cancel Selected
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4 inline mr-1" />
                    Export Selected
                  </button>
                </div>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredPrescriptions.length && filteredPrescriptions.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Presc. ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Doctor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Clinic</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Pharmacy</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Medications</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Issued</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Valid Until</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Insurance</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPrescriptions.map((rx) => (
                    <tr key={rx.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(rx.id)}
                          onChange={() => toggleSelection(rx.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {rx.hasControlledSubstance && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              CS
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(rx.id)}
                            className="font-mono text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {rx.id}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={rx.patientAvatar}
                            alt={rx.patientName}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium text-gray-900">{rx.patientName}</div>
                            <div className="text-sm text-gray-500">{rx.patientAge} years</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{rx.doctorName}</div>
                          <div className="text-sm text-gray-500">{rx.doctorSpecialization}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{rx.clinicName}</div>
                          <div className="text-sm text-gray-500">{rx.clinicEmirate}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {rx.pharmacyName ? (
                          <div className="font-medium text-gray-900">{rx.pharmacyName}</div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not Sent</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900">{rx.medications[0].drugName}</span>
                          {rx.medications.length > 1 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{rx.medications.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{rx.issuedDate}</div>
                        <div className="text-xs text-gray-500">{rx.issuedTime}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`text-sm ${
                            isExpired(rx.validUntil)
                              ? 'text-red-600 font-medium'
                              : isExpiringSoon(rx.validUntil)
                              ? 'text-amber-600 font-medium'
                              : 'text-gray-900'
                          }`}
                        >
                          {rx.validUntil}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getInsuranceBadge(rx.insuranceCoverage)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(rx.status)}
                          {rx.isFlagged && (
                            <Flag className="w-4 h-4 text-red-600" title={rx.flagReason} />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedPrescription(rx)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="View Detail"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
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
      </div>

      {showCreateModal && (
        <CreateManualPrescriptionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
