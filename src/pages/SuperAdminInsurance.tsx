import { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  FileText,
  DollarSign,
  Users,
  Activity,
  BarChart3,
  PieChart,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  InsuranceProvider,
  InsuranceClaim,
  PreAuthorization,
  NetworkType,
  ProviderStatus,
  ConnectionType,
  ClaimStatus,
  EntityType,
  ServiceType,
  RejectionReason,
  PAStatus,
  FlagReason,
  Priority,
} from '../types/insurance';
import { mockInsuranceProviders, mockInsuranceClaims, mockPreAuthorizations } from '../data/mockInsurance';
import AddInsuranceProviderModal from '../components/AddInsuranceProviderModal';
import InsuranceProviderProfile from '../components/InsuranceProviderProfile';

type TabType = 'overview' | 'providers' | 'claims' | 'pre-auth' | 'rejected' | 'pending-review' | 'analytics';
type ProviderTab = 'all' | 'active' | 'pending' | 'disconnected';
type ClaimTab = 'all' | 'approved' | 'rejected' | 'pending' | 'resubmitted';

const COLORS = {
  primary: '#2563EB',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
  teal: '#14B8A6',
  blue: '#3B82F6',
  gray: '#6B7280',
  orange: '#F97316',
  darkRed: '#DC2626',
  darkGray: '#4B5563',
};

const CHART_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#F97316', '#EC4899'];

export default function SuperAdminInsurance() {
  const [providers] = useState<InsuranceProvider[]>(mockInsuranceProviders);
  const [claims] = useState<InsuranceClaim[]>(mockInsuranceClaims);
  const [preAuthorizations] = useState<PreAuthorization[]>(mockPreAuthorizations);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [providerTab, setProviderTab] = useState<ProviderTab>('all');
  const [claimTab, setClaimTab] = useState<ClaimTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedClaims, setSelectedClaims] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('6months');

  // Calculate KPIs
  const totalProviders = providers.length;
  const insuredPatients = 3482; // Mock data
  const claimsSubmitted = claims.length;
  const claimsApproved = claims.filter((c) => c.status === 'Approved').length;
  const claimsRejected = claims.filter((c) => c.status === 'Rejected').length;
  const totalValue = claims.reduce((sum, c) => sum + c.amount, 0);
  const approvedValue = claims.reduce((sum, c) => sum + (c.approvedAmount || 0), 0);
  const approvalRate = ((claimsApproved / claimsSubmitted) * 100).toFixed(1);
  const avgProcessingTime = (claims.reduce((sum, c) => sum + c.processingDays, 0) / claims.length).toFixed(1);
  const pendingOver7Days = claims.filter((c) => c.processingDays > 7 && c.status === 'Under Review').length;

  // Tab configuration
  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'providers', label: 'Insurance Providers' },
    { id: 'claims', label: 'All Claims' },
    { id: 'pre-auth', label: 'Pre-Authorizations' },
    { id: 'rejected', label: 'Rejected Claims' },
    { id: 'pending-review', label: 'Pending Review' },
    { id: 'analytics', label: 'Analytics' },
  ];

  // Filter providers
  const filteredProviders = useMemo(() => {
    let filtered = providers;
    if (providerTab !== 'all') {
      filtered = filtered.filter((p) => {
        if (providerTab === 'active') return p.status === 'Active';
        if (providerTab === 'pending') return p.status === 'Pending Setup';
        if (providerTab === 'disconnected') return p.status === 'Disconnected';
        return true;
      });
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [providers, providerTab, searchQuery]);

  // Filter claims
  const filteredClaims = useMemo(() => {
    let filtered = claims;
    if (claimTab !== 'all') {
      filtered = filtered.filter((c) => {
        if (claimTab === 'approved') return c.status === 'Approved';
        if (claimTab === 'rejected') return c.status === 'Rejected';
        if (claimTab === 'pending') return c.status === 'Pending' || c.status === 'Under Review';
        if (claimTab === 'resubmitted') return c.status === 'Resubmitted';
        return true;
      });
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.claimId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.providerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [claims, claimTab, searchQuery]);

  // Helper functions for badges
  const getNetworkBadge = (type: NetworkType) => {
    const styles = {
      Basic: 'bg-blue-100 text-blue-700',
      Enhanced: 'bg-purple-100 text-purple-700',
      Comprehensive: 'bg-emerald-100 text-emerald-700',
      Government: 'bg-indigo-100 text-indigo-700',
      International: 'bg-pink-100 text-pink-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>{type}</span>;
  };

  const getProviderStatusBadge = (status: ProviderStatus) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700',
      'Pending Setup': 'bg-amber-100 text-amber-700',
      Disconnected: 'bg-red-100 text-red-700',
      'Under Review': 'bg-blue-100 text-blue-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{status}</span>;
  };

  const getConnectionBadge = (type: ConnectionType) => {
    const styles = {
      API: 'bg-emerald-100 text-emerald-700',
      Manual: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[type]}`}>{type}</span>;
  };

  const getClaimStatusBadge = (status: ClaimStatus) => {
    const config = {
      Pending: { bg: 'bg-amber-100', text: 'text-amber-700' },
      'Under Review': { bg: 'bg-blue-100', text: 'text-blue-700' },
      Approved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Partially Approved': { bg: 'bg-teal-100', text: 'text-teal-700' },
      Rejected: { bg: 'bg-red-100', text: 'text-red-700' },
      Resubmitted: { bg: 'bg-purple-100', text: 'text-purple-700' },
      Cancelled: { bg: 'bg-gray-100', text: 'text-gray-700' },
      'On Hold': { bg: 'bg-orange-100', text: 'text-orange-700' },
    };
    const { bg, text } = config[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{status}</span>;
  };

  const getPAStatusBadge = (status: PAStatus) => {
    const config = {
      Submitted: { bg: 'bg-blue-100', text: 'text-blue-700' },
      'Under Review': { bg: 'bg-amber-100', text: 'text-amber-700' },
      Approved: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
      'Conditionally Approved': { bg: 'bg-teal-100', text: 'text-teal-700' },
      Rejected: { bg: 'bg-red-100', text: 'text-red-700' },
      Expired: { bg: 'bg-gray-100', text: 'text-gray-700' },
      Cancelled: { bg: 'bg-gray-200', text: 'text-gray-800' },
    };
    const { bg, text } = config[status];
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>{status}</span>;
  };

  const getRejectionBadge = (reason: RejectionReason) => {
    const styles = {
      'Policy Expired': 'bg-red-100 text-red-700',
      'Service Not Covered': 'bg-orange-100 text-orange-700',
      'Missing Documentation': 'bg-amber-100 text-amber-700',
      'Duplicate Claim': 'bg-purple-100 text-purple-700',
      'Patient Not Eligible': 'bg-red-100 text-red-700',
      'Coding Error': 'bg-blue-100 text-blue-700',
      'Pre-Auth Required': 'bg-amber-100 text-amber-700',
      'Claim Limit Exceeded': 'bg-orange-100 text-orange-700',
      'Timely Filing Exceeded': 'bg-red-100 text-red-700',
      'Provider Not in Network': 'bg-red-100 text-red-700',
      Other: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[reason]}`}>{reason}</span>;
  };

  const getFlagBadge = (flag: FlagReason) => {
    const styles = {
      'High Value': 'bg-purple-100 text-purple-700',
      'Duplicate Suspected': 'bg-orange-100 text-orange-700',
      'Missing Pre-Auth': 'bg-amber-100 text-amber-700',
      'Unusual Coding': 'bg-blue-100 text-blue-700',
      'Patient Complaint': 'bg-red-100 text-red-700',
      'Provider Dispute': 'bg-red-200 text-red-800',
      'Manual Override Requested': 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[flag]}`}>{flag}</span>;
  };

  const getPriorityBadge = (priority: Priority) => {
    const styles = {
      Low: 'bg-gray-100 text-gray-700',
      Medium: 'bg-blue-100 text-blue-700',
      High: 'bg-amber-100 text-amber-700',
      Critical: 'bg-red-100 text-red-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>{priority}</span>;
  };

  const getEntityIcon = (type: EntityType) => {
    const icons = {
      Clinic: '🏥',
      Pharmacy: '💊',
      Lab: '🔬',
    };
    return icons[type];
  };

  const getApprovalRateColor = (rate: number) => {
    if (rate > 80) return 'text-emerald-600';
    if (rate >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return `AED ${amount.toLocaleString()}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  // Mock data for charts
  const claimsOverTimeData = [
    { month: 'Oct', submitted: 450, approved: 360, rejected: 90 },
    { month: 'Nov', submitted: 520, approved: 410, rejected: 110 },
    { month: 'Dec', submitted: 480, approved: 390, rejected: 90 },
    { month: 'Jan', submitted: 550, approved: 440, rejected: 110 },
    { month: 'Feb', submitted: 610, approved: 490, rejected: 120 },
    { month: 'Mar', submitted: 680, approved: 560, rejected: 120 },
  ];

  const claimsByProviderData = providers.map((p) => ({
    name: p.name,
    approved: Math.floor(p.claimsThisMonth * (p.approvalRate / 100)),
    rejected: Math.floor(p.claimsThisMonth * (1 - p.approvalRate / 100) * 0.7),
    pending: Math.floor(p.claimsThisMonth * (1 - p.approvalRate / 100) * 0.3),
  }));

  const claimsByEntityData = [
    { name: 'Clinics', value: claims.filter((c) => c.entityType === 'Clinic').length },
    { name: 'Pharmacies', value: claims.filter((c) => c.entityType === 'Pharmacy').length },
    { name: 'Labs', value: claims.filter((c) => c.entityType === 'Lab').length },
  ];

  const rejectionReasonsData = [
    { reason: 'Policy Expired', count: 25 },
    { reason: 'Missing Docs', count: 18 },
    { reason: 'Service Not Covered', count: 15 },
    { reason: 'Pre-Auth Required', count: 12 },
    { reason: 'Coding Error', count: 8 },
  ];

  const emiratesData = [
    { emirate: 'Dubai', claims: 2847, approved: 2254, rejected: 593, rate: 79.2 },
    { emirate: 'Abu Dhabi', claims: 1842, approved: 1521, rejected: 321, rate: 82.6 },
    { emirate: 'Sharjah', claims: 956, approved: 745, rejected: 211, rate: 77.9 },
    { emirate: 'Ajman', claims: 324, approved: 251, rejected: 73, rate: 77.5 },
    { emirate: 'Ras Al Khaimah', claims: 187, approved: 142, rejected: 45, rate: 75.9 },
  ];

  // Render provider profile if selected
  if (selectedProvider) {
    return <InsuranceProviderProfile provider={selectedProvider} onBack={() => setSelectedProvider(null)} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span>Super Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Insurance Management</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insurance Management</h1>
            <p className="text-gray-600 mt-1">Manage insurance providers, claims, and pre-authorizations</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" />
            Add Insurance Provider
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Providers</span>
            <Building2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalProviders}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Insured Patients</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{insuredPatients.toLocaleString()}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Claims Submitted</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{claimsSubmitted}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Claims Approved</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{claimsApproved}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Claims Rejected</span>
            <XCircle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{claimsRejected}</div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Value</span>
            <DollarSign className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</div>
          <div className="text-xs text-gray-500 mt-1">{formatCurrency(approvedValue)} approved</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Large Metric Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-lg shadow">
                  <div className="text-sm opacity-90 mb-2">Approval Rate</div>
                  <div className="text-3xl font-bold mb-2">{approvalRate}%</div>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <TrendingUp className="w-4 h-4" />
                    +2.3% vs last month
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
                  <div className="text-sm opacity-90 mb-2">Total Revenue</div>
                  <div className="text-3xl font-bold mb-2">{formatCurrency(approvedValue)}</div>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <TrendingUp className="w-4 h-4" />
                    +8.5% vs last month
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow">
                  <div className="text-sm opacity-90 mb-2">Avg Processing Time</div>
                  <div className="text-3xl font-bold mb-2">{avgProcessingTime} days</div>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <TrendingDown className="w-4 h-4" />
                    -0.8 days improvement
                  </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-lg shadow">
                  <div className="text-sm opacity-90 mb-2">Pending &gt; 7 Days</div>
                  <div className="text-3xl font-bold mb-2">{pendingOver7Days}</div>
                  <div className="flex items-center gap-1 text-sm opacity-90">
                    <AlertCircle className="w-4 h-4" />
                    Requires attention
                  </div>
                </div>
              </div>

              {/* Claims Status Funnel */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Processing Funnel</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Submitted', count: claimsSubmitted, color: 'bg-blue-500', width: '100%' },
                    {
                      label: 'Under Review',
                      count: claims.filter((c) => c.status === 'Under Review').length,
                      color: 'bg-amber-500',
                      width: '60%',
                    },
                    { label: 'Approved', count: claimsApproved, color: 'bg-emerald-500', width: '40%' },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{item.label}</span>
                        <span className="text-sm font-medium text-gray-900">{item.count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: item.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charts Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                {/* Claims Over Time */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Trend (Last 6 Months)</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={claimsOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="submitted" stroke={COLORS.primary} strokeWidth={2} />
                      <Line type="monotone" dataKey="approved" stroke={COLORS.emerald} strokeWidth={2} />
                      <Line type="monotone" dataKey="rejected" stroke={COLORS.red} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Claims by Provider */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Provider</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={claimsByProviderData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" stackId="a" fill={COLORS.emerald} />
                      <Bar dataKey="rejected" stackId="a" fill={COLORS.red} />
                      <Bar dataKey="pending" stackId="a" fill={COLORS.amber} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Charts Row 2 */}
              <div className="grid grid-cols-3 gap-4">
                {/* Claims by Entity Type */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Entity Type</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsPie>
                      <Pie data={claimsByEntityData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label>
                        {claimsByEntityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                {/* Top Rejection Reasons */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Rejection Reasons</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={rejectionReasonsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="reason" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill={COLORS.red} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Emirates Table */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Claims by Emirates</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emirate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Claims</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejected</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {emiratesData.map((emirate) => (
                        <tr key={emirate.emirate} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{emirate.emirate}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{emirate.claims.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-emerald-600">{emirate.approved.toLocaleString()}</td>
                          <td className="px-6 py-4 text-sm text-red-600">{emirate.rejected.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${getApprovalRateColor(emirate.rate)}`}>{emirate.rate}%</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Claims Activity</h3>
                <div className="space-y-3">
                  {claims.slice(0, 15).map((claim) => (
                    <div key={claim.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs">
                          {getEntityIcon(claim.entityType)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {claim.claimId} - {claim.patientName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {claim.entityName} • {claim.serviceName}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">{formatCurrency(claim.amount)}</span>
                        {getClaimStatusBadge(claim.status)}
                        <span className="text-xs text-gray-500">{formatDate(claim.submittedDate)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* INSURANCE PROVIDERS TAB */}
          {activeTab === 'providers' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Providers</div>
                  <div className="text-2xl font-bold text-gray-900">{providers.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Active</div>
                  <div className="text-2xl font-bold text-emerald-600">{providers.filter((p) => p.status === 'Active').length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending Setup</div>
                  <div className="text-2xl font-bold text-amber-600">{providers.filter((p) => p.status === 'Pending Setup').length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Disconnected</div>
                  <div className="text-2xl font-bold text-red-600">{providers.filter((p) => p.status === 'Disconnected').length}</div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Providers Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Network Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected Entities</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims (Month)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg TAT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Value</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connection</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProviders.map((provider) => (
                        <tr key={provider.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={provider.logo} alt={provider.name} className="w-10 h-10 rounded-lg object-cover" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                                <div className="text-xs text-gray-500">{provider.code}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{getNetworkBadge(provider.networkType)}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">
                              {provider.connectedClinics} Clinics | {provider.connectedPharmacies} Pharmacies | {provider.connectedLabs} Labs
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{provider.claimsThisMonth.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${getApprovalRateColor(provider.approvalRate)}`}>
                              {provider.approvalRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{provider.avgProcessingTime} days</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(provider.totalValueThisMonth)}</div>
                            <div className="text-xs text-gray-500">{formatCurrency(provider.approvedValueThisMonth)} approved</div>
                          </td>
                          <td className="px-6 py-4">{getConnectionBadge(provider.connectionType)}</td>
                          <td className="px-6 py-4">{getProviderStatusBadge(provider.status)}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedProvider(provider)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ALL CLAIMS TAB */}
          {activeTab === 'claims' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Claims</div>
                  <div className="text-2xl font-bold text-gray-900">{claims.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Approved</div>
                  <div className="text-2xl font-bold text-emerald-600">{claimsApproved}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Rejected</div>
                  <div className="text-2xl font-bold text-red-600">{claimsRejected}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {claims.filter((c) => c.status === 'Pending' || c.status === 'Under Review').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Resubmitted</div>
                  <div className="text-2xl font-bold text-purple-600">{claims.filter((c) => c.status === 'Resubmitted').length}</div>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by claim ID, patient name, or provider..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              {/* Bulk Actions Bar */}
              {selectedClaims.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">{selectedClaims.length} claims selected</span>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm">
                      Approve Selected
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">Reject Selected</button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm">
                      Export Selected
                    </button>
                  </div>
                </div>
              )}

              {/* Claims Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processing Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <input type="checkbox" className="rounded border-gray-300" />
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-blue-600">{claim.claimId}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{claim.patientName}</div>
                            <div className="text-xs text-gray-500">{claim.patientEmiratesId}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <img src={claim.providerLogo} alt={claim.providerName} className="w-8 h-8 rounded object-cover" />
                              <span className="text-sm text-gray-900">{claim.providerName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{getEntityIcon(claim.entityType)}</span>
                              <div>
                                <div className="text-sm text-gray-900">{claim.entityName}</div>
                                <div className="text-xs text-gray-500">{claim.entityType}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{claim.serviceType}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{claim.doctorName}</td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{formatCurrency(claim.amount)}</div>
                            {claim.approvedAmount && (
                              <div className="text-xs text-emerald-600">{formatCurrency(claim.approvedAmount)} approved</div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{formatDate(claim.submittedDate)}</td>
                          <td className="px-6 py-4">{getClaimStatusBadge(claim.status)}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm ${claim.processingDays > 7 ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
                              {claim.processingDays} days
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setSelectedClaim(claim)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRE-AUTHORIZATIONS TAB */}
          {activeTab === 'pre-auth' && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Total PA Requests</div>
                  <div className="text-2xl font-bold text-gray-900">{preAuthorizations.length}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Approved</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {preAuthorizations.filter((p) => p.status === 'Approved').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending</div>
                  <div className="text-2xl font-bold text-amber-600">
                    {preAuthorizations.filter((p) => p.status === 'Submitted' || p.status === 'Under Review').length}
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Rejected</div>
                  <div className="text-2xl font-bold text-red-600">{preAuthorizations.filter((p) => p.status === 'Rejected').length}</div>
                </div>
              </div>

              {/* PA Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PA ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision Deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {preAuthorizations.map((pa) => {
                        const daysRemaining = getDaysRemaining(pa.decisionDeadline);
                        const isOverdue = daysRemaining < 0;
                        const isUrgent = daysRemaining < 2 && daysRemaining >= 0;
                        return (
                          <tr key={pa.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{pa.paId}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{pa.patientName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{pa.providerName}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-base">{getEntityIcon(pa.entityType)}</span>
                                <span className="text-sm text-gray-900">{pa.entityName}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{pa.serviceName}</div>
                              <div className="text-xs text-gray-500">{pa.serviceType}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{pa.doctorName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(pa.requestedDate)}</td>
                            <td className="px-6 py-4">
                              <div
                                className={`text-sm font-medium ${
                                  isOverdue ? 'text-red-700' : isUrgent ? 'text-red-600' : 'text-gray-600'
                                }`}
                              >
                                {isOverdue
                                  ? `${Math.abs(daysRemaining)} days overdue`
                                  : `${daysRemaining} days remaining`}
                              </div>
                              <div className="text-xs text-gray-500">{formatDate(pa.decisionDeadline)}</div>
                            </td>
                            <td className="px-6 py-4">{getPAStatusBadge(pa.status)}</td>
                            <td className="px-6 py-4">
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Review</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PA Analytics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PA Approval Rate by Provider</h3>
                  <div className="text-center text-gray-500 py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chart placeholder</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">PA Approval Rate by Service Type</h3>
                  <div className="text-center text-gray-500 py-8">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Chart placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REJECTED CLAIMS TAB */}
          {activeTab === 'rejected' && (
            <div className="space-y-6">
              {/* Rejection Summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Rejected</div>
                  <div className="text-2xl font-bold text-red-600">{claimsRejected}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Rejection Rate</div>
                  <div className="text-2xl font-bold text-red-600">{((claimsRejected / claimsSubmitted) * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Potentially Recoverable</div>
                  <div className="text-2xl font-bold text-amber-600">12</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(claims.filter((c) => c.status === 'Rejected').reduce((sum, c) => sum + c.amount, 0))}
                  </div>
                </div>
              </div>

              {/* Rejected Claims Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejection Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {claims
                        .filter((c) => c.status === 'Rejected')
                        .map((claim) => (
                          <tr key={claim.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <input type="checkbox" className="rounded border-gray-300" />
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{claim.claimId}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{claim.patientName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{claim.providerName}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{claim.serviceName}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(claim.amount)}</td>
                            <td className="px-6 py-4">
                              {claim.rejectionReason && (
                                <div>
                                  {getRejectionBadge(claim.rejectionReason)}
                                  <div className="text-xs text-gray-500 mt-1">{claim.rejectionDetails}</div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{formatDate(claim.submittedDate)}</td>
                            <td className="px-6 py-4">
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Resubmit</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Rejection Analytics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Rejection Reasons Distribution</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <RechartsPie>
                      <Pie data={rejectionReasonsData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="count" label>
                        {rejectionReasonsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Entities with Highest Rejection Rates</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Sharjah Family Clinic', rate: 32.5, entity: 'Clinic' },
                      { name: 'Dubai Cardiology Center', rate: 28.8, entity: 'Clinic' },
                      { name: 'Quick Pharmacy', rate: 24.3, entity: 'Pharmacy' },
                      { name: 'Al Ain Lab Services', rate: 21.7, entity: 'Lab' },
                      { name: 'Emirates Hospital', rate: 19.2, entity: 'Clinic' },
                    ].map((entity) => (
                      <div key={entity.name} className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{entity.name}</div>
                          <div className="text-xs text-gray-500">{entity.entity}</div>
                        </div>
                        <span className="text-sm font-medium text-red-600">{entity.rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PENDING REVIEW TAB */}
          {activeTab === 'pending-review' && (
            <div className="space-y-6">
              {/* Pending Review Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flag Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flagged By</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Flagged Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Pending</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {claims
                        .filter((c) => c.flagReason)
                        .map((claim) => (
                          <tr key={claim.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-blue-600">{claim.claimId}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{claim.patientName}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{claim.providerName}</td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(claim.amount)}</td>
                            <td className="px-6 py-4">{claim.flagReason && getFlagBadge(claim.flagReason)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{claim.flaggedBy}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{claim.flaggedDate && formatDate(claim.flaggedDate)}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{claim.processingDays} days</td>
                            <td className="px-6 py-4">{claim.priority && getPriorityBadge(claim.priority)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Approve</button>
                                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Reject</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Admin Review Notes Panel */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Review Notes</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Note</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter review notes..."
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Note</button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Date Range Selector */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="1month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="1year">Last Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              {/* Section 1 - Claims Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Volume Trends</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={claimsOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="submitted" stroke={COLORS.primary} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Status Distribution</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={claimsOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approved" stackId="a" fill={COLORS.emerald} />
                        <Bar dataKey="rejected" stackId="a" fill={COLORS.red} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Section 2 - Provider Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Performance Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg TAT</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {providers.map((provider) => (
                        <tr key={provider.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{provider.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{provider.claimsThisMonth}</td>
                          <td className="px-6 py-4">
                            <span className={`text-sm font-medium ${getApprovalRateColor(provider.approvalRate)}`}>
                              {provider.approvalRate}%
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{provider.avgProcessingTime} days</td>
                          <td className="px-6 py-4">
                            <div className="w-20 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Activity className="w-4 h-4 text-gray-400" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3 - Financial Analytics */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Analytics</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-4 rounded-lg">
                    <div className="text-sm opacity-90">Total Claimed Value</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(totalValue)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                    <div className="text-sm opacity-90">Approved Value</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(approvedValue)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                    <div className="text-sm opacity-90">Avg Claim Value</div>
                    <div className="text-2xl font-bold mt-1">{formatCurrency(totalValue / claimsSubmitted)}</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={claimsOverTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="submitted" stackId="1" stroke={COLORS.primary} fill={COLORS.primary} />
                    <Area type="monotone" dataKey="approved" stackId="1" stroke={COLORS.emerald} fill={COLORS.emerald} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Section 4 - Entity Performance */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Entity Performance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">By Type</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <RechartsPie>
                        <Pie data={claimsByEntityData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} fill="#8884d8" dataKey="value" label>
                          {claimsByEntityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Top 10 Clinics by Claims</h4>
                    <div className="text-center text-gray-500 py-8">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Chart placeholder</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Export All Analytics
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Claim Detail Side Panel */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto shadow-xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-gray-900">Claim Details</h2>
              <button
                onClick={() => setSelectedClaim(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Claim Header */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{selectedClaim.claimId}</span>
                  {getClaimStatusBadge(selectedClaim.status)}
                </div>
                <div className="text-sm text-gray-600">
                  Submitted {formatDate(selectedClaim.submittedDate)} • Processing for {selectedClaim.processingDays} days
                </div>
              </div>

              {/* Patient Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Patient Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Name</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Emirates ID</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.patientEmiratesId}</span>
                  </div>
                </div>
              </div>

              {/* Policy Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Policy Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Policy Number</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Policy Type</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.policyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Valid Period</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(selectedClaim.policyValidFrom)} - {formatDate(selectedClaim.policyValidTo)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Provider</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.providerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Entity</span>
                    <span className="text-sm font-medium text-gray-900">
                      {getEntityIcon(selectedClaim.entityType)} {selectedClaim.entityName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Doctor</span>
                    <span className="text-sm font-medium text-gray-900">{selectedClaim.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Service Date</span>
                    <span className="text-sm font-medium text-gray-900">{formatDate(selectedClaim.serviceDate)}</span>
                  </div>
                </div>
              </div>

              {/* Claim Breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Claim Breakdown</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Claimed Amount</span>
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(selectedClaim.amount)}</span>
                  </div>
                  {selectedClaim.approvedAmount && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Approved Amount</span>
                      <span className="text-sm font-bold text-emerald-600">{formatCurrency(selectedClaim.approvedAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Copay</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedClaim.copayAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Deductible Remaining</span>
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedClaim.deductibleRemaining)}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis & Procedure Codes */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Medical Codes</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Diagnosis Codes</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClaim.diagnosisCodes.map((code, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Procedure Codes</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedClaim.procedureCodes.map((code, idx) => (
                        <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rejection Details */}
              {selectedClaim.rejectionReason && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Rejection Details</h3>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="mb-2">{getRejectionBadge(selectedClaim.rejectionReason)}</div>
                    <p className="text-sm text-gray-700">{selectedClaim.rejectionDetails}</p>
                  </div>
                </div>
              )}

              {/* Status Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Status Timeline</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Claim Submitted</div>
                        <div className="text-xs text-gray-500">{formatDate(selectedClaim.submittedDate)}</div>
                      </div>
                    </div>
                    {selectedClaim.status !== 'Pending' && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{selectedClaim.status}</div>
                          <div className="text-xs text-gray-500">Status updated</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Approve Claim
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Reject Claim
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
