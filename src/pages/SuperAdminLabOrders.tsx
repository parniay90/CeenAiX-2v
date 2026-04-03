import { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  Download,
  Flag,
  X,
  ChevronDown,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  Eye,
  MoreVertical,
  Activity,
  Zap,
} from 'lucide-react';
import { mockLabOrders } from '../data/mockLabOrders';
import type { LabOrder, LabOrderStatus } from '../types/labOrder';
import LabOrderDetailView from '../components/LabOrderDetailView';
import CreateManualLabOrderModal from '../components/CreateManualLabOrderModal';

type TabType = 'all' | 'pending' | 'in_progress' | 'results_ready' | 'critical' | 'overdue' | 'stat' | 'flagged';

export default function SuperAdminLabOrders() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const orders = mockLabOrders;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'pending') return order.status === 'new';
    if (activeTab === 'in_progress') return order.status === 'sample_collected' || order.status === 'processing';
    if (activeTab === 'results_ready') return order.status === 'results_ready' || order.status === 'results_delivered';
    if (activeTab === 'critical') return order.criticalResult;
    if (activeTab === 'overdue') return order.isOverdue;
    if (activeTab === 'stat') return order.priority === 'stat';
    if (activeTab === 'flagged') return order.isFlagged;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.patientName.toLowerCase().includes(query) ||
        order.doctorName.toLowerCase().includes(query) ||
        order.labName.toLowerCase().includes(query) ||
        order.tests.some((t) => t.testName.toLowerCase().includes(query))
      );
    }

    return true;
  });

  const statOrders = filteredOrders.filter((o) => o.priority === 'stat');
  const regularOrders = filteredOrders.filter((o) => o.priority !== 'stat');
  const sortedOrders = [...statOrders, ...regularOrders];

  const stats = {
    totalThisMonth: 3847,
    inProgress: 412,
    resultsUploaded: 3201,
    pendingSample: 234,
    critical: 47,
    overdue: 38,
  };

  const tabCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'new').length,
    in_progress: orders.filter((o) => o.status === 'sample_collected' || o.status === 'processing').length,
    results_ready: orders.filter((o) => o.status === 'results_ready' || o.status === 'results_delivered').length,
    critical: orders.filter((o) => o.criticalResult).length,
    overdue: orders.filter((o) => o.isOverdue).length,
    stat: orders.filter((o) => o.priority === 'stat').length,
    flagged: orders.filter((o) => o.isFlagged).length,
  };

  const getStatusBadge = (status: LabOrderStatus) => {
    const styles = {
      new: 'bg-blue-100 text-blue-700',
      sample_collected: 'bg-cyan-100 text-cyan-700',
      processing: 'bg-purple-100 text-purple-700',
      results_ready: 'bg-emerald-100 text-emerald-700',
      results_delivered: 'bg-teal-100 text-teal-700',
      critical_result: 'bg-red-100 text-red-700 animate-pulse',
      cancelled: 'bg-gray-200 text-gray-600',
      on_hold: 'bg-orange-100 text-orange-700',
    };

    const labels = {
      new: 'New',
      sample_collected: 'Sample Collected',
      processing: 'Processing',
      results_ready: 'Results Ready',
      results_delivered: 'Results Delivered',
      critical_result: 'Critical Result',
      cancelled: 'Cancelled',
      on_hold: 'On Hold',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getPriorityBadge = (priority: LabOrder['priority']) => {
    const styles = {
      routine: 'bg-gray-100 text-gray-700',
      urgent: 'bg-amber-100 text-amber-700',
      stat: 'bg-red-100 text-red-700 font-bold',
    };

    const labels = {
      routine: 'Routine',
      urgent: 'Urgent',
      stat: 'STAT',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[priority]}`}>
        {labels[priority].toUpperCase()}
      </span>
    );
  };

  const getResultBadge = (interpretation?: string) => {
    if (!interpretation || interpretation === 'pending') {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Pending</span>;
    }

    const styles = {
      normal: 'bg-emerald-100 text-emerald-700',
      abnormal: 'bg-amber-100 text-amber-700',
      critical: 'bg-red-100 text-red-700 font-bold',
      inconclusive: 'bg-gray-100 text-gray-700',
    };

    const labels = {
      normal: 'Normal',
      abnormal: 'Abnormal',
      critical: 'CRITICAL',
      inconclusive: 'Inconclusive',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[interpretation as keyof typeof styles]}`}>
        {labels[interpretation as keyof typeof labels]}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTATStatus = (expectedTAT: string, isOverdue: boolean, hoursOverdue?: number) => {
    if (isOverdue && hoursOverdue) {
      return (
        <span className="text-red-600 font-medium">
          {hoursOverdue}h overdue
        </span>
      );
    }

    const deadline = new Date(expectedTAT);
    const now = new Date();
    const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursRemaining < 2) {
      return <span className="text-amber-600 font-medium">{deadline.toLocaleString()}</span>;
    }

    return <span className="text-emerald-600">{deadline.toLocaleString()}</span>;
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedOrders.map((o) => o.id));
    }
  };

  if (selectedOrder) {
    return (
      <LabOrderDetailView
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
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
                <span className="text-gray-900 font-medium">Lab Orders</span>
              </div>
              <h1 className="text-3xl font-bold text-[#0A1628] font-['Sora']">Lab Orders</h1>
              <p className="text-gray-600 mt-1">Monitor and manage all laboratory orders across CeenAiX</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2.5 bg-[#2563EB] text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Create Manual Lab Order
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="grid grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <FlaskConical className="w-8 h-8 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalThisMonth.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Total This Month</div>
            <div className="flex items-center gap-1 mt-2 text-emerald-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8% vs last month</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <Activity className="w-8 h-8 text-purple-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.inProgress.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Orders In Progress</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <CheckCircle className="w-8 h-8 text-emerald-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.resultsUploaded.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Results Uploaded</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <Clock className="w-8 h-8 text-amber-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.pendingSample.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Pending Sample</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <AlertTriangle className="w-8 h-8 text-red-600 mb-2 animate-pulse" />
            <div className="text-2xl font-bold text-gray-900">{stats.critical.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Critical Results</div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <XCircle className="w-8 h-8 text-red-600 mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.overdue.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-1">Overdue Orders</div>
            <div className="text-xs text-gray-500 mt-1">Past expected TAT</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex items-center gap-6 px-6 overflow-x-auto">
              {[
                { key: 'all', label: 'All Orders', count: tabCounts.all },
                { key: 'pending', label: 'Pending', count: tabCounts.pending },
                { key: 'in_progress', label: 'In Progress', count: tabCounts.in_progress },
                { key: 'results_ready', label: 'Results Ready', count: tabCounts.results_ready },
                { key: 'critical', label: 'Critical Results', count: tabCounts.critical },
                { key: 'overdue', label: 'Overdue', count: tabCounts.overdue },
                { key: 'stat', label: 'STAT Orders', count: tabCounts.stat },
                { key: 'flagged', label: 'Flagged', count: tabCounts.flagged },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabType)}
                  className={`py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
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
                  placeholder="Search by Order ID, Patient, Doctor, Lab, Test..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
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
                    {selectedIds.length} order{selectedIds.length > 1 ? 's' : ''} selected
                  </span>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    <Zap className="w-4 h-4 inline mr-1" />
                    Escalate to STAT
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-sm">
                    <Flag className="w-4 h-4 inline mr-1" />
                    Flag Selected
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm">
                    <XCircle className="w-4 h-4 inline mr-1" />
                    Cancel Selected
                  </button>
                </div>
                <button onClick={() => setSelectedIds([])} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="text-sm text-gray-600 mb-4">
              Showing {sortedOrders.length} order{sortedOrders.length !== 1 ? 's' : ''}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === sortedOrders.length && sortedOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Order ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Doctor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Lab</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Tests</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Sample ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Ordered</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Expected TAT</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Result</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        order.criticalResult ? 'border-l-4 border-l-red-600' : ''
                      } ${order.isOverdue ? 'bg-amber-50' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleSelection(order.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {order.priority === 'stat' && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                              STAT
                            </span>
                          )}
                          {order.criticalResult && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded animate-pulse">
                              CRITICAL
                            </span>
                          )}
                          <button
                            onClick={() => copyToClipboard(order.id)}
                            className="font-mono text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                          >
                            {order.id}
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img src={order.patientAvatar} alt={order.patientName} className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="font-medium text-gray-900">{order.patientName}</div>
                            <div className="text-sm text-gray-500">{order.patientAge} years</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.doctorName}</div>
                          <div className="text-sm text-gray-500">{order.doctorSpecialization}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{order.labName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900">{order.tests[0].testName}</span>
                          {order.tests.length > 1 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{order.tests.length - 1} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">{getPriorityBadge(order.priority)}</td>
                      <td className="py-4 px-4">
                        {order.samples.length > 0 && order.samples[0].sampleId ? (
                          <span className="font-mono text-sm text-gray-900">{order.samples[0].sampleId}</span>
                        ) : (
                          <span className="text-amber-600 text-sm">Not Collected</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-900">{order.orderedDate}</div>
                        <div className="text-xs text-gray-500">{order.orderedTime}</div>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {getTATStatus(order.expectedTAT, order.isOverdue, order.hoursOverdue)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(order.status)}
                          {order.isFlagged && (
                            <Flag className="w-4 h-4 text-red-600" title={order.flagReason} />
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getResultBadge(order.tests[0].interpretation)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                            title="View Detail"
                          >
                            <Eye className="w-5 h-5 text-gray-600" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="More Actions">
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
        <CreateManualLabOrderModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
