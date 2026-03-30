import { useState } from 'react';
import { ArrowLeft, Building2, Shield, Activity, Users, MapPin, Settings, CheckCircle, Clock, XCircle, AlertCircle, MoreVertical, CreditCard as Edit, Zap, PauseCircle, PlayCircle, Unplug, Download, Trash2, Search, Filter, FileText, Calendar, Mail, Phone, Globe, TrendingUp, TrendingDown, AlertTriangle, Plus, Eye, Link, Database, Bell, RefreshCw, Save, Upload, X, Check } from 'lucide-react';
import { InsuranceProvider } from '../types/insurance';
import {
  mockInsuranceClaims,
  mockPreAuthorizations,
  mockConnectedEntities,
  mockCoverageRules,
  mockProviderAuditLog,
} from '../data/mockInsurance';
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

interface InsuranceProviderProfileProps {
  provider: InsuranceProvider;
  onBack: () => void;
}

type TabId =
  | 'overview'
  | 'claims'
  | 'pre-authorizations'
  | 'connected-entities'
  | 'coverage-rules'
  | 'audit-log'
  | 'settings';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function InsuranceProviderProfile({ provider, onBack }: InsuranceProviderProfileProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter data by provider
  const claims = mockInsuranceClaims.filter((c) => c.providerId === provider.id);
  const preAuthorizations = mockPreAuthorizations.filter((pa) => pa.providerId === provider.id);
  const connectedEntities = mockConnectedEntities.filter((e) => e.providerId === provider.id);
  const auditLog = mockProviderAuditLog.filter((a) => a.providerId === provider.id);

  // Calculate KPIs
  const connectedClinics = connectedEntities.filter((e) => e.entityType === 'Clinic').length;
  const connectedPharmacies = connectedEntities.filter((e) => e.entityType === 'Pharmacy').length;
  const connectedLabs = connectedEntities.filter((e) => e.entityType === 'Lab').length;
  const claimsThisMonth = claims.length;
  const approvedClaims = claims.filter((c) => c.status === 'Approved').length;
  const approvalRate = claimsThisMonth > 0 ? ((approvedClaims / claimsThisMonth) * 100).toFixed(1) : '0.0';
  const avgProcessingTime = claimsThisMonth > 0
    ? (claims.reduce((sum, c) => sum + c.processingDays, 0) / claimsThisMonth).toFixed(1)
    : '0.0';

  // Status badge helpers
  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700',
      'Pending Setup': 'bg-amber-100 text-amber-700',
      Disconnected: 'bg-red-100 text-red-700',
      'Under Review': 'bg-blue-100 text-blue-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const getConnectionTypeBadge = (type: string) => {
    const config = {
      API: { color: 'bg-emerald-100 text-emerald-700', icon: Zap },
      Manual: { color: 'bg-gray-100 text-gray-700', icon: FileText },
    };
    const cfg = config[type as keyof typeof config] || config.Manual;
    const Icon = cfg.icon;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${cfg.color}`}>
        <Icon className="w-4 h-4" />
        {type}
      </span>
    );
  };

  const getNetworkTypeBadge = (networkType: string) => {
    const colors: { [key: string]: string } = {
      Basic: 'bg-blue-100 text-blue-700',
      Enhanced: 'bg-purple-100 text-purple-700',
      Comprehensive: 'bg-indigo-100 text-indigo-700',
      Government: 'bg-teal-100 text-teal-700',
      International: 'bg-pink-100 text-pink-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[networkType] || 'bg-gray-100 text-gray-700'}`}>
        {networkType}
      </span>
    );
  };

  const getClaimStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      Pending: 'bg-amber-100 text-amber-700',
      'Under Review': 'bg-blue-100 text-blue-700',
      Approved: 'bg-emerald-100 text-emerald-700',
      'Partially Approved': 'bg-teal-100 text-teal-700',
      Rejected: 'bg-red-100 text-red-700',
      Resubmitted: 'bg-purple-100 text-purple-700',
      Cancelled: 'bg-gray-100 text-gray-700',
      'On Hold': 'bg-orange-100 text-orange-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  const getPAStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      Submitted: 'bg-blue-100 text-blue-700',
      'Under Review': 'bg-amber-100 text-amber-700',
      Approved: 'bg-emerald-100 text-emerald-700',
      'Conditionally Approved': 'bg-teal-100 text-teal-700',
      Rejected: 'bg-red-100 text-red-700',
      Expired: 'bg-gray-100 text-gray-700',
      Cancelled: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  // Chart data
  const claimsSubmittedVsApprovedData = Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i;
    const submitted = Math.floor(Math.random() * 100) + 50;
    const approved = Math.floor(submitted * (0.7 + Math.random() * 0.2));
    return {
      date: `Day ${day}`,
      Submitted: submitted,
      Approved: approved,
    };
  }).reverse();

  const claimsByStatusData = [
    { name: 'Approved', value: claims.filter((c) => c.status === 'Approved').length },
    { name: 'Pending', value: claims.filter((c) => c.status === 'Pending').length },
    { name: 'Under Review', value: claims.filter((c) => c.status === 'Under Review').length },
    { name: 'Rejected', value: claims.filter((c) => c.status === 'Rejected').length },
    { name: 'On Hold', value: claims.filter((c) => c.status === 'On Hold').length },
  ].filter((d) => d.value > 0);

  const claimsByServiceTypeData = [
    { service: 'Consultation', count: claims.filter((c) => c.serviceType === 'Consultation').length },
    { service: 'Pharmacy', count: claims.filter((c) => c.serviceType === 'Pharmacy').length },
    { service: 'Laboratory', count: claims.filter((c) => c.serviceType === 'Laboratory').length },
    { service: 'Radiology', count: claims.filter((c) => c.serviceType === 'Radiology').length },
    { service: 'Surgery', count: claims.filter((c) => c.serviceType === 'Surgery').length },
  ].filter((d) => d.count > 0);

  // Recent claim events
  const recentClaimEvents = claims.slice(0, 10).map((claim) => ({
    id: claim.id,
    claimId: claim.claimId,
    patient: claim.patientName,
    amount: claim.amount,
    status: claim.status,
    date: claim.submittedDate,
  }));

  // Alerts
  const alerts = [
    ...(provider.apiStatus === 'Error' ? [{ type: 'error', message: 'API connection error detected' }] : []),
    ...(claims.filter((c) => c.processingDays > 7 && c.status === 'Pending').length > 0
      ? [{ type: 'warning', message: `${claims.filter((c) => c.processingDays > 7).length} claims pending over 7 days` }]
      : []),
    ...(preAuthorizations.filter((pa) => pa.status === 'Submitted').length > 0
      ? [{ type: 'info', message: `${preAuthorizations.filter((pa) => pa.status === 'Submitted').length} PA requests awaiting review` }]
      : []),
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'claims', label: 'Claims', icon: FileText },
    { id: 'pre-authorizations', label: 'Pre-Authorizations', icon: CheckCircle },
    { id: 'connected-entities', label: 'Connected Entities', icon: Link },
    { id: 'coverage-rules', label: 'Coverage Rules', icon: Shield },
    { id: 'audit-log', label: 'Audit Log', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <button onClick={onBack} className="hover:text-gray-700">
              Dashboard
            </button>
            <span className="mx-2">/</span>
            <button onClick={onBack} className="hover:text-gray-700">
              Insurance Management
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{provider.name}</span>
          </div>

          {/* Provider Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{provider.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {getNetworkTypeBadge(provider.networkType)}
                  {getStatusBadge(provider.status)}
                  {getConnectionTypeBadge(provider.connectionType)}
                  {provider.apiStatus && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                        provider.apiStatus === 'Connected'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      {provider.apiStatus}
                      {provider.lastSync && provider.apiStatus === 'Connected' && (
                        <span className="text-xs">
                          (Last sync: {new Date(provider.lastSync).toLocaleTimeString()})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Provider
              </button>
              {provider.connectionType === 'API' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Test API Connection
                </button>
              )}
              {provider.status === 'Active' ? (
                <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2">
                  <PauseCircle className="w-4 h-4" />
                  Suspend
                </button>
              ) : (
                <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Reactivate
                </button>
              )}
              <div className="relative">
                <button
                  onClick={() => setShowMoreMenu(!showMoreMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {showMoreMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Unplug className="w-4 h-4" />
                      Disconnect
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export Data
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Provider
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={`${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Provider Details */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-500">Provider Code:</span>
                    <span className="ml-2 font-medium">{provider.code}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">License Number:</span>
                    <span className="ml-2 font-medium">{provider.licenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">License Expiry:</span>
                    <span className="ml-2 font-medium">{new Date(provider.licenseExpiry).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Headquarters:</span>
                    <span className="ml-2 font-medium">{provider.headquarters}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">UAE Office:</span>
                    <span className="ml-2 font-medium">{provider.uaeOffice}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Website:</span>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                      {provider.website}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">Primary Contact:</span>
                    <span className="ml-2 font-medium">{provider.primaryContact}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <a href={`mailto:${provider.primaryEmail}`} className="ml-2 text-blue-600 hover:underline">
                      {provider.primaryEmail}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span>
                    <a href={`tel:${provider.primaryPhone}`} className="ml-2 text-blue-600 hover:underline">
                      {provider.primaryPhone}
                    </a>
                  </div>
                  <div>
                    <span className="text-gray-500">Claim Format:</span>
                    <span className="ml-2 font-medium">{provider.claimFormat}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-2">Covered Emirates:</span>
                    <div className="flex flex-wrap gap-1">
                      {provider.coverageEmirates.map((emirate) => (
                        <span key={emirate} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {emirate}
                        </span>
                      ))}
                    </div>
                  </div>
                  {provider.apiEndpoint && (
                    <div>
                      <span className="text-gray-500">API Endpoint:</span>
                      <span className="ml-2 font-mono text-xs">{provider.apiEndpoint}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Added Date:</span>
                    <span className="ml-2 font-medium">{new Date(provider.addedDate).toLocaleDateString()}</span>
                  </div>
                  {provider.internalNotes && (
                    <div>
                      <span className="text-gray-500 block mb-2">Internal Notes:</span>
                      <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{provider.internalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Performance Snapshot */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <Building2 className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{connectedClinics}</p>
                  <p className="text-sm text-gray-600">Connected Clinics</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{connectedPharmacies}</p>
                  <p className="text-sm text-gray-600">Connected Pharmacies</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <Activity className="w-8 h-8 text-teal-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{connectedLabs}</p>
                  <p className="text-sm text-gray-600">Connected Labs</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{claimsThisMonth}</p>
                  <p className="text-sm text-gray-600">Claims This Month</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{approvalRate}%</p>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <Clock className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{avgProcessingTime} days</p>
                  <p className="text-sm text-gray-600">Avg Processing Time</p>
                </div>
              </div>

              {/* Charts */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims Submitted vs Approved (Last 30 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={claimsSubmittedVsApprovedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Submitted" stroke="#2563EB" strokeWidth={2} />
                    <Line type="monotone" dataKey="Approved" stroke="#10B981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Status</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={claimsByStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {claimsByStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Claims by Service Type</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={claimsByServiceTypeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="service" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Claims Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Claims Activity</h3>
                <div className="space-y-2">
                  {recentClaimEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.claimId}</p>
                        <p className="text-xs text-gray-500">{event.patient}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">AED {event.amount.toLocaleString()}</p>
                        {getClaimStatusBadge(event.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts Panel */}
              {alerts.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Alerts
                  </h3>
                  <div className="space-y-2">
                    {alerts.map((alert, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          alert.type === 'error'
                            ? 'bg-red-50 text-red-700'
                            : alert.type === 'warning'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm">{alert.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'claims' && (
          <div className="space-y-6">
            {/* Provider Response Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Response Performance</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Avg Response Time</p>
                  <p className="text-2xl font-bold text-gray-900">{avgProcessingTime} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fastest Response</p>
                  <p className="text-2xl font-bold text-emerald-600">0.5 days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Claims Awaiting &gt;7 Days</p>
                  <p className="text-2xl font-bold text-red-600">{claims.filter((c) => c.processingDays > 7).length}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{approvalRate}%</p>
                </div>
              </div>
            </div>

            {/* Claims Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Claims</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search claims..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processing Days</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{claim.claimId}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{claim.patientName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{claim.entityName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{claim.serviceName}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">AED {claim.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">{getClaimStatusBadge(claim.status)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{claim.processingDays.toFixed(1)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setSelectedClaim(claim)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
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

        {activeTab === 'pre-authorizations' && (
          <div className="space-y-6">
            {/* Provider PA Performance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider PA Performance</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Avg Decision Time</p>
                  <p className="text-2xl font-bold text-gray-900">2.3 days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approval Rate</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {preAuthorizations.length > 0
                      ? ((preAuthorizations.filter((pa) => pa.status === 'Approved').length / preAuthorizations.length) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejection Rate</p>
                  <p className="text-2xl font-bold text-red-600">
                    {preAuthorizations.length > 0
                      ? ((preAuthorizations.filter((pa) => pa.status === 'Rejected').length / preAuthorizations.length) * 100).toFixed(1)
                      : '0.0'}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* PA Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pre-Authorizations</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PA ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Decision Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {preAuthorizations.map((pa) => {
                      const requestedDate = new Date(pa.requestedDate);
                      const decisionDate = pa.status === 'Approved' || pa.status === 'Rejected' ? new Date() : null;
                      const decisionTime = decisionDate
                        ? ((decisionDate.getTime() - requestedDate.getTime()) / (1000 * 60 * 60 * 24)).toFixed(1)
                        : '-';
                      return (
                        <tr key={pa.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{pa.paId}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{pa.patientName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{pa.serviceName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(pa.requestedDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(pa.decisionDeadline).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">{getPAStatusBadge(pa.status)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {decisionTime !== '-' ? `${decisionTime} days` : 'Pending'}
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'connected-entities' && (
          <div className="space-y-6">
            {/* Clinics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Connected Clinics</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Clinic
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clinic Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patients Covered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims This Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected Since</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {connectedEntities
                      .filter((e) => e.entityType === 'Clinic')
                      .map((entity) => (
                        <tr key={entity.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{entity.entityName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.patientsCovered?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.claimsThisMonth}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.approvalRate}%</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(entity.connectedSince).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {entity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Disconnect</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pharmacies */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Connected Pharmacies</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Pharmacy
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pharmacy Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prescriptions Covered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims This Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected Since</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {connectedEntities
                      .filter((e) => e.entityType === 'Pharmacy')
                      .map((entity) => (
                        <tr key={entity.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{entity.entityName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.prescriptionsCovered?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.claimsThisMonth}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.approvalRate}%</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(entity.connectedSince).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {entity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Disconnect</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Labs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Connected Labs</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect Lab
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lab Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tests Covered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claims This Month</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approval Rate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected Since</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {connectedEntities
                      .filter((e) => e.entityType === 'Lab')
                      .map((entity) => (
                        <tr key={entity.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{entity.entityName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.location}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.testsCovered?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.claimsThisMonth}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{entity.approvalRate}%</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(entity.connectedSince).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entity.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {entity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                              <button className="text-red-600 hover:text-red-800 text-sm">Disconnect</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Geographic Coverage */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Coverage</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emirate</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Connected Clinics</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pharmacies</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Labs</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Covered Patients</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {provider.coverageEmirates.map((emirate) => (
                      <tr key={emirate} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{emirate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {connectedEntities.filter((e) => e.entityType === 'Clinic' && e.location.includes(emirate)).length}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {connectedEntities.filter((e) => e.entityType === 'Pharmacy' && e.location.includes(emirate)).length}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {connectedEntities.filter((e) => e.entityType === 'Lab' && e.location.includes(emirate)).length}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {connectedEntities
                            .filter((e) => e.location.includes(emirate) && e.patientsCovered)
                            .reduce((sum, e) => sum + (e.patientsCovered || 0), 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'coverage-rules' && (
          <div className="space-y-6">
            {/* Covered Services */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Covered Services</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Covered</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Co-pay %</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Co-pay Cap (AED)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Limit (AED)</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockCoverageRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{rule.serviceCategory}</td>
                        <td className="px-4 py-3">
                          {rule.covered ? (
                            <Check className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{rule.copayPercent}%</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{rule.copayCap}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {rule.annualLimit === 999999 ? 'Unlimited' : rule.annualLimit.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{rule.notes || '-'}</td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <Edit className="w-3 h-3" />
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Excluded Medications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Excluded Medications</h3>
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Cosmetic drugs', 'Experimental medications', 'Over-the-counter vitamins'].map((med) => (
                  <span key={med} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-2">
                    {med}
                    <button className="hover:text-red-900">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Pre-Authorization Rules */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pre-Authorization Rules</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Services Requiring PA</label>
                  <div className="flex flex-wrap gap-2">
                    {mockCoverageRules
                      .filter((r) => r.preAuthRequired)
                      .map((rule) => (
                        <span key={rule.serviceCategory} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                          {rule.serviceCategory}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PA Validity Period</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="30 days" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PA Submission Method</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>API</option>
                      <option>Email</option>
                      <option>Portal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PA Decision SLA (days)</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg" defaultValue="3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Coding Rules */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Coding Rules</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accepted Coding Standards</label>
                  <div className="flex flex-wrap gap-2">
                    {['ICD-10', 'CPT', 'HAAD'].map((code) => (
                      <span key={code} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Fields</label>
                  <div className="space-y-2">
                    {['Patient Emirates ID', 'Policy Number', 'Diagnosis Code', 'Procedure Code', 'Service Date'].map(
                      (field) => (
                        <label key={field} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span className="text-sm text-gray-700">{field}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Submission Format Notes</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                    defaultValue="Submit claims in HAAD format with all supporting documentation attached."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit-log' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performed By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {auditLog.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(entry.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.performedBy}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entry.isAdminAction ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {entry.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Provider Status Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Provider Status Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                  {getStatusBadge(provider.status)}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Status To</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Active</option>
                      <option>Pending Setup</option>
                      <option>Disconnected</option>
                      <option>Under Review</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter reason..." />
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm Status Change</button>
              </div>
            </div>

            {/* API Configuration */}
            {provider.connectionType === 'API' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Endpoint</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      defaultValue={provider.apiEndpoint}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        defaultValue="••••••••••••••••"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                        defaultValue="••••••••••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                      placeholder="https://your-webhook-url.com/callback"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Test Connection
                    </button>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm text-gray-700">Sandbox Mode</span>
                    </label>
                  </div>

                  {/* Connection Health Log */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Connection Health Log (Last 20 API Calls)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Response Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {Array.from({ length: 5 }, (_, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                              <td className="px-3 py-2 text-gray-600">{new Date().toLocaleString()}</td>
                              <td className="px-3 py-2 text-gray-600 font-mono">/v1/claims</td>
                              <td className="px-3 py-2">
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">200</span>
                              </td>
                              <td className="px-3 py-2 text-gray-600">245ms</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Claim Processing Rules */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Processing Rules</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto-approve claims under AED</p>
                    <p className="text-xs text-gray-500">Claims below this amount will be automatically approved</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="500" />
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Flag claims over AED</p>
                    <p className="text-xs text-gray-500">High-value claims will be flagged for manual review</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="number" className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm" defaultValue="5000" />
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Auto-resubmit rejected claims</p>
                    <p className="text-xs text-gray-500">Automatically resubmit claims that were rejected for correctable reasons</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Notify entity on decision</p>
                    <p className="text-xs text-gray-500">Send notification when claim is approved or rejected</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Who receives notifications?</label>
                  <div className="space-y-2">
                    {['Entity Admin', 'Doctor', 'Both', 'Neither'].map((option) => (
                      <label key={option} className="flex items-center gap-2">
                        <input type="radio" name="notification-recipient" defaultChecked={option === 'Both'} />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notification Channels</label>
                  <div className="space-y-2">
                    {['Email', 'SMS', 'Push Notification'].map((channel) => (
                      <label key={channel} className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm text-gray-700">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Notes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Internal Notes</h3>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={4}
                defaultValue={provider.internalNotes}
              />
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Notes
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">Disconnect Provider</p>
                    <p className="text-xs text-red-700">
                      This will affect {connectedClinics} clinics, {connectedPharmacies} pharmacies, and {connectedLabs} labs
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Disconnect</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">Delete Provider</p>
                    <p className="text-xs text-red-700">Permanently delete this provider and all associated data</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete</button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">Export All Provider Data</p>
                    <p className="text-xs text-red-700">Download complete data archive (ZIP)</p>
                  </div>
                  <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Claim Detail Side Panel */}
      {selectedClaim && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Claim Details</h2>
              <button onClick={() => setSelectedClaim(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Claim Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Claim ID:</span>
                    <span className="font-medium">{selectedClaim.claimId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Patient:</span>
                    <span className="font-medium">{selectedClaim.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Emirates ID:</span>
                    <span className="font-medium">{selectedClaim.patientEmiratesId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entity:</span>
                    <span className="font-medium">{selectedClaim.entityName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-medium">{selectedClaim.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Doctor:</span>
                    <span className="font-medium">{selectedClaim.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-medium">AED {selectedClaim.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    {getClaimStatusBadge(selectedClaim.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Processing Days:</span>
                    <span className="font-medium">{selectedClaim.processingDays.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {selectedClaim.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</h4>
                  <p className="text-sm text-red-700">{selectedClaim.rejectionReason}</p>
                  {selectedClaim.rejectionDetails && (
                    <p className="text-sm text-red-600 mt-2">{selectedClaim.rejectionDetails}</p>
                  )}
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Policy Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Policy Number:</span>
                    <span className="font-medium">{selectedClaim.policyNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Policy Type:</span>
                    <span className="font-medium">{selectedClaim.policyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valid From:</span>
                    <span className="font-medium">{new Date(selectedClaim.policyValidFrom).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valid To:</span>
                    <span className="font-medium">{new Date(selectedClaim.policyValidTo).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View Full Details
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Download Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
