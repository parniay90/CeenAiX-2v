import { useState } from 'react';
import { ArrowLeft, Building2, Users, FlaskConical, ClipboardList, FileCheck, DollarSign, History, Settings, CheckCircle, Clock, XCircle, AlertCircle, CreditCard as Edit, MoreVertical, Bell, TrendingUp, TrendingDown, Activity, Award, MapPin, Mail, Phone, Globe, Calendar, Shield, Database, Zap, Plus, Eye, Trash2, Download, Search, Filter } from 'lucide-react';
import { Laboratory } from '../types/laboratory';
import {
  mockLabStaff,
  mockLabTests,
  mockLabOrders,
  mockLabResults,
  mockConnectedClinics,
  mockReferringDoctors,
  mockLabInvoices,
  mockLabAuditLog,
  mockLabActivityFeed,
} from '../data/mockLaboratories';
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

interface LaboratoryProfileProps {
  laboratory: Laboratory;
  onBack: () => void;
}

type TabId = 'overview' | 'staff' | 'catalog' | 'orders' | 'results' | 'clinics' | 'financials' | 'audit' | 'settings';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function LaboratoryProfile({ laboratory, onBack }: LaboratoryProfileProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const staff = mockLabStaff.filter((s) => s.labId === laboratory.id);
  const tests = mockLabTests.filter((t) => t.labId === laboratory.id);
  const orders = mockLabOrders.filter((o) => o.labId === laboratory.id);
  const results = mockLabResults.filter((r) => r.labId === laboratory.id);
  const connectedClinics = mockConnectedClinics.filter((c) => c.labId === laboratory.id);
  const referringDoctors = mockReferringDoctors.filter((d) => d.labId === laboratory.id);
  const invoices = mockLabInvoices.filter((i) => i.labId === laboratory.id);
  const auditLog = mockLabAuditLog.filter((a) => a.labId === laboratory.id);
  const activityFeed = mockLabActivityFeed.filter((a) => a.labId === laboratory.id);

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-emerald-100 text-emerald-700',
      Pending: 'bg-amber-100 text-amber-700',
      Suspended: 'bg-red-100 text-red-700',
      Inactive: 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
  };

  const getDhaLicenseBadge = (status: string) => {
    const config = {
      Verified: { icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
      Expired: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
      'Expiring Soon': { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
      'Not Submitted': { icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-100' },
    };
    const cfg = config[status as keyof typeof config] || config['Not Submitted'];
    const Icon = cfg.icon;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${cfg.color} ${cfg.bg}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  const getLabTypeBadge = (type: string) => {
    const colors: { [key: string]: string } = {
      Clinical: 'bg-blue-100 text-blue-700',
      Pathology: 'bg-purple-100 text-purple-700',
      Microbiology: 'bg-teal-100 text-teal-700',
      'Radiology & Imaging': 'bg-indigo-100 text-indigo-700',
      Genetics: 'bg-pink-100 text-pink-700',
      Hematology: 'bg-red-100 text-red-700',
      Biochemistry: 'bg-orange-100 text-orange-700',
      'Multi-Discipline': 'bg-gray-100 text-gray-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}>{type}</span>;
  };

  const getPlanBadge = (plan: string) => {
    const styles = {
      Basic: 'bg-blue-100 text-blue-700',
      Pro: 'bg-purple-100 text-purple-700',
      Enterprise: 'bg-indigo-100 text-indigo-700',
      Custom: 'bg-pink-100 text-pink-700',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[plan as keyof typeof styles]}`}>{plan}</span>;
  };

  const tabs = [
    { id: 'overview' as TabId, label: 'Overview', icon: Activity },
    { id: 'staff' as TabId, label: 'Staff', icon: Users },
    { id: 'catalog' as TabId, label: 'Test Catalog', icon: FlaskConical },
    { id: 'orders' as TabId, label: 'Orders', icon: ClipboardList },
    { id: 'results' as TabId, label: 'Results', icon: FileCheck },
    { id: 'clinics' as TabId, label: 'Connected Clinics', icon: Building2 },
    { id: 'financials' as TabId, label: 'Financials', icon: DollarSign },
    { id: 'audit' as TabId, label: 'Audit Log', icon: History },
    { id: 'settings' as TabId, label: 'Settings', icon: Settings },
  ];

  const ordersVsCompletedData = [
    { day: 'Day 1', received: 42, completed: 38 },
    { day: 'Day 5', received: 38, completed: 35 },
    { day: 'Day 10', received: 51, completed: 47 },
    { day: 'Day 15', received: 45, completed: 42 },
    { day: 'Day 20', received: 48, completed: 45 },
    { day: 'Day 25', received: 54, completed: 50 },
    { day: 'Day 30', received: 49, completed: 46 },
  ];

  const ordersByCategoryData = [
    { category: 'Hematology', count: 287 },
    { category: 'Biochemistry', count: 354 },
    { category: 'Microbiology', count: 142 },
    { category: 'Hormones', count: 198 },
    { category: 'Other', count: 266 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Laboratories
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img src={laboratory.logo} alt={laboratory.name} className="w-16 h-16 rounded-lg object-cover" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{laboratory.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {getLabTypeBadge(laboratory.type)}
                {getStatusBadge(laboratory.status)}
                {getDhaLicenseBadge(laboratory.dhaLicenseStatus)}
                {laboratory.accreditations.filter(a => a !== 'None').map((acc) => (
                  <span key={acc} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {acc}
                  </span>
                ))}
                {getPlanBadge(laboratory.subscriptionPlan)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Laboratory
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Send Notification
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-2">
          Dashboard &gt; Laboratories &gt; {laboratory.name}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex items-center gap-1 px-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Laboratory Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Laboratory Name:</span>
                      <p className="text-gray-900">{laboratory.name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Lab Type:</span>
                      <div className="mt-1">{getLabTypeBadge(laboratory.type)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Sub-specializations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {laboratory.subspecializations.map((spec) => (
                          <span key={spec} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">DHA License:</span>
                      <p className="text-gray-900">{laboratory.dhaLicenseNumber}</p>
                      <p className="text-xs text-gray-500">Expires: {laboratory.dhaLicenseExpiry}</p>
                      <div className="mt-1">{getDhaLicenseBadge(laboratory.dhaLicenseStatus)}</div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Trade License:</span>
                      <p className="text-gray-900">{laboratory.tradeLicenseNumber}</p>
                      <p className="text-xs text-gray-500">Expires: {laboratory.tradeLicenseExpiry}</p>
                    </div>
                    {laboratory.mohPermitNumber && (
                      <div>
                        <span className="font-medium text-gray-700">MOH Permit:</span>
                        <p className="text-gray-900">{laboratory.mohPermitNumber}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Accreditations:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {laboratory.accreditations.map((acc) => (
                          <span key={acc} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                            {acc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${laboratory.loincCompliant ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        LOINC {laboratory.loincCompliant ? 'Compliant' : 'Non-Compliant'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${laboratory.nabidhConnected ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        Nabidh {laboratory.nabidhConnected ? 'Connected' : 'Not Connected'}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-900">{laboratory.area}, {laboratory.emirates}</p>
                      <p className="text-gray-600 text-xs">{laboratory.address}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span className="text-xs">{laboratory.contactEmail}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-xs">{laboratory.contactPhone}</span>
                      </div>
                      {laboratory.website && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span className="text-xs">{laboratory.website}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Lab Director:</span>
                      <p className="text-gray-900">{laboratory.directorName}</p>
                      <p className="text-xs text-gray-600">DHA: {laboratory.directorDhaLicense}</p>
                      <p className="text-xs text-gray-600">{laboratory.directorEmail}</p>
                    </div>
                    {laboratory.managerName && (
                      <div>
                        <span className="font-medium text-gray-700">Lab Manager:</span>
                        <p className="text-gray-900">{laboratory.managerName}</p>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Subscription Plan:</span>
                      <div className="mt-1">{getPlanBadge(laboratory.subscriptionPlan)}</div>
                      <p className="text-xs text-gray-500 mt-1">Renews: {laboratory.subscriptionRenewalDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Registered:</span>
                      <p className="text-gray-900">{laboratory.registeredDate}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Last Activity:</span>
                      <p className="text-gray-900">{laboratory.lastActivity}</p>
                    </div>
                    {laboratory.internalTags.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Internal Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {laboratory.internalTags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {laboratory.internalNotes && (
                      <div>
                        <span className="font-medium text-gray-700">Internal Notes:</span>
                        <p className="text-gray-600 text-xs mt-1">{laboratory.internalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Orders This Month</div>
                    <div className="text-2xl font-bold text-gray-900">{laboratory.ordersThisMonth}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Orders Completed</div>
                    <div className="text-2xl font-bold text-gray-900">{Math.floor(laboratory.ordersThisMonth * 0.92)}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Pending Orders</div>
                    <div className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Critical Results</div>
                    <div className="text-2xl font-bold text-red-600">{laboratory.criticalFlagsThisMonth}</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Avg TAT (hours)</div>
                    <div className="text-2xl font-bold text-gray-900">6.2</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Test Catalog Size</div>
                    <div className="text-2xl font-bold text-gray-900">{laboratory.testCatalogSize}</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders: Received vs Completed</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={ordersVsCompletedData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="received" stroke="#2563EB" strokeWidth={2} name="Received" />
                      <Line type="monotone" dataKey="completed" stroke="#10B981" strokeWidth={2} name="Completed" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Orders by Test Category (Last 6 Months)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={ordersByCategoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#2563EB" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activityFeed.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <FlaskConical className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Alerts & Warnings</h3>
                  <div className="space-y-2">
                    {laboratory.dhaLicenseStatus === 'Expiring Soon' && (
                      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-amber-900">DHA License Expiring Soon</p>
                          <p className="text-amber-700">License expires on {laboratory.dhaLicenseExpiry}</p>
                        </div>
                      </div>
                    )}
                    {laboratory.dhaLicenseStatus === 'Expired' && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-red-900">DHA License Expired</p>
                          <p className="text-red-700">License expired on {laboratory.dhaLicenseExpiry}</p>
                        </div>
                      </div>
                    )}
                    {results.filter(r => r.isCritical && !r.doctorAcknowledged).length > 0 && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-medium text-red-900">Critical Results Pending Acknowledgement</p>
                          <p className="text-red-700">{results.filter(r => r.isCritical && !r.doctorAcknowledged).length} critical results awaiting doctor review</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Staff</div>
                  <div className="text-2xl font-bold text-gray-900">{staff.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Active</div>
                  <div className="text-2xl font-bold text-emerald-600">{staff.filter(s => s.status === 'Active').length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">DHA Licensed</div>
                  <div className="text-2xl font-bold text-blue-600">{staff.filter(s => s.dhaLicenseNumber).length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">License Expiring Soon</div>
                  <div className="text-2xl font-bold text-amber-600">{staff.filter(s => s.dhaLicenseStatus === 'Expiring Soon').length}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Staff Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Staff Member</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Specialization</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">DHA License</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Orders (Month)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Login</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.map((member) => (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                            <span className="text-sm font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{member.role}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{member.specialization}</td>
                        <td className="py-3 px-4">
                          {member.dhaLicenseNumber ? (
                            <div>
                              <div className="text-xs text-gray-900">{member.dhaLicenseNumber}</div>
                              <div className="text-xs text-gray-500">{member.dhaLicenseExpiry}</div>
                              {member.dhaLicenseStatus && (
                                <div className="mt-1">{getDhaLicenseBadge(member.dhaLicenseStatus)}</div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(member.status)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{member.ordersHandledThisMonth}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{member.lastLogin}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {staff.filter(s => s.dhaLicenseStatus && ['Expiring Soon', 'Expired'].includes(s.dhaLicenseStatus)).length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-amber-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    DHA License Compliance Alert
                  </h3>
                  <div className="space-y-2">
                    {staff.filter(s => s.dhaLicenseStatus && ['Expiring Soon', 'Expired'].includes(s.dhaLicenseStatus)).map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-white rounded">
                        <div className="flex items-center gap-3">
                          <img src={member.avatar} alt={member.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                            <p className="text-xs text-gray-600">{member.dhaLicenseNumber} - Expires: {member.dhaLicenseExpiry}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1.5 bg-amber-600 text-white text-xs rounded hover:bg-amber-700">
                          Send Reminder
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Active Tests</div>
                  <div className="text-2xl font-bold text-gray-900">{tests.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Tests Added This Month</div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Most Ordered Test</div>
                  <div className="text-sm font-bold text-gray-900">CBC</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Avg Price (AED)</div>
                  <div className="text-2xl font-bold text-gray-900">112</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Test Catalog</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Test
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Test Code</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Test Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Sample Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">TAT</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price (AED)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Orders (Month)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tests.map((test) => (
                      <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{test.testCode}</div>
                          <div className="text-xs text-gray-500">{test.loincCode}</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{test.testName}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                            {test.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-900">{test.sampleType.join(', ')}</td>
                        <td className="py-3 px-4">
                          <span className={`text-xs font-medium ${test.turnaroundTime < 4 ? 'text-emerald-600' : test.turnaroundTime <= 24 ? 'text-amber-600' : 'text-red-600'}`}>
                            {test.turnaroundTime} {test.turnaroundUnit}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{test.price}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{test.ordersThisMonth}</td>
                        <td className="py-3 px-4">{getStatusBadge(test.status)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
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
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total This Month</div>
                  <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending</div>
                  <div className="text-2xl font-bold text-amber-600">{orders.filter(o => o.status === 'New').length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">In Progress</div>
                  <div className="text-2xl font-bold text-blue-600">{orders.filter(o => ['Sample Collected', 'Processing'].includes(o.status)).length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Completed</div>
                  <div className="text-2xl font-bold text-emerald-600">{orders.filter(o => o.status === 'Delivered').length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Critical Results</div>
                  <div className="text-2xl font-bold text-red-600 animate-pulse">{orders.filter(o => o.status === 'Critical Result').length}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900">Lab Orders</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Order ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Ordering Doctor</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Clinic</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tests</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Priority</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.sort((a, b) => a.priority === 'STAT' ? -1 : 0).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{order.patientName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{order.orderingDoctor}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{order.clinic}</td>
                        <td className="py-3 px-4 text-xs text-gray-900">{order.testsRequested.slice(0, 2).join(', ')}{order.testsRequested.length > 2 ? ` +${order.testsRequested.length - 2}` : ''}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${order.priority === 'STAT' ? 'bg-red-100 text-red-700' : order.priority === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'}`}>
                            {order.priority}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">{order.dateOrdered}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === 'Critical Result' ? 'bg-red-100 text-red-700 animate-pulse' : order.status === 'Results Ready' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="grid grid-cols-5 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Results This Month</div>
                  <div className="text-2xl font-bold text-gray-900">{results.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Normal</div>
                  <div className="text-2xl font-bold text-emerald-600">{results.filter(r => r.interpretation === 'Normal').length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Abnormal</div>
                  <div className="text-2xl font-bold text-amber-600">{results.filter(r => r.interpretation === 'Abnormal').length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Critical</div>
                  <div className="text-2xl font-bold text-red-600 animate-pulse">{results.filter(r => r.isCritical).length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Pending Ack</div>
                  <div className="text-2xl font-bold text-red-600">{results.filter(r => !r.doctorAcknowledged).length}</div>
                </div>
              </div>

              {results.filter(r => r.isCritical && !r.doctorAcknowledged).length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 animate-pulse">
                  <h3 className="text-sm font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    CRITICAL RESULTS - PENDING DOCTOR ACKNOWLEDGEMENT
                  </h3>
                  <div className="space-y-3">
                    {results.filter(r => r.isCritical && !r.doctorAcknowledged).map(result => (
                      <div key={result.id} className="flex items-center justify-between p-4 bg-white border border-red-200 rounded">
                        <div>
                          <p className="text-sm font-bold text-red-900">{result.patientName} - {result.testName}</p>
                          <p className="text-xs text-red-700">Result: {result.resultValue} | Ref Range: {result.referenceRange}</p>
                          <p className="text-xs text-red-600">Uploaded {result.hoursUnacknowledged ? `${result.hoursUnacknowledged} hours ago` : 'recently'} by {result.uploadedBy}</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-semibold">
                          Notify Doctor
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h3 className="text-lg font-semibold text-gray-900">Lab Results</h3>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Result ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Patient</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Test</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Interpretation</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Uploaded By</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Acknowledged</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => (
                      <tr key={result.id} className={`border-b border-gray-100 hover:bg-gray-50 ${result.isCritical ? 'bg-red-50' : ''}`}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{result.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{result.patientName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{result.testName}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm font-medium text-gray-900">{result.resultValue}</div>
                          <div className="text-xs text-gray-500">{result.referenceRange}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${result.interpretation === 'Normal' ? 'bg-emerald-100 text-emerald-700' : result.interpretation === 'Abnormal' ? 'bg-amber-100 text-amber-700' : result.interpretation === 'Critical' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-100 text-gray-700'}`}>
                            {result.interpretation}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-600">{result.uploadedBy}</td>
                        <td className="py-3 px-4">
                          {result.doctorAcknowledged ? (
                            <div className="flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-xs">Yes</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-amber-600">
                              <Clock className="w-4 h-4" />
                              <span className="text-xs">Pending</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'clinics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Connected Clinics</div>
                  <div className="text-2xl font-bold text-gray-900">{connectedClinics.length}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Orders This Month</div>
                  <div className="text-2xl font-bold text-blue-600">{connectedClinics.reduce((sum, c) => sum + c.ordersThisMonth, 0)}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Most Active Clinic</div>
                  <div className="text-sm font-bold text-gray-900">{connectedClinics[0]?.clinicName || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Connected Clinics</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Connect New Clinic
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Clinic Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Primary Contact</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Orders (Month)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Orders (All Time)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Last Order</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {connectedClinics.map((clinic) => (
                      <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{clinic.clinicName}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{clinic.clinicType}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{clinic.location}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{clinic.primaryContact}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{clinic.ordersThisMonth}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{clinic.ordersAllTime.toLocaleString()}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{clinic.lastOrderDate}</td>
                        <td className="py-3 px-4">{getStatusBadge(clinic.status.includes('Active') ? 'Active' : 'Inactive')}</td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Referring Doctors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {referringDoctors.map((doctor) => (
                    <div key={doctor.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doctor.doctorName}</p>
                          <p className="text-xs text-gray-600">{doctor.specialization}</p>
                          <p className="text-xs text-gray-500">{doctor.clinic}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">{doctor.ordersThisMonth}</p>
                          <p className="text-xs text-gray-500">orders this month</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financials' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Subscription</p>
                    <p className="text-2xl font-bold text-gray-900">AED {laboratory.monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Renewal</p>
                    <p className="text-lg font-semibold text-gray-900">{laboratory.subscriptionRenewalDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Outstanding Balance</p>
                    <p className="text-2xl font-bold text-emerald-600">AED 0</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Invoice History</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                    Change Plan
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                    Issue Invoice
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Invoice #</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Billing Period</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Plan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">VAT (5%)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Total</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Issue Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm font-medium text-gray-900">{invoice.invoiceNumber}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{invoice.billingPeriod}</td>
                        <td className="py-3 px-4">{getPlanBadge(invoice.plan)}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">AED {invoice.amount.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">AED {invoice.vat.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">AED {invoice.total.toLocaleString()}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{invoice.issueDate}</td>
                        <td className="py-3 px-4">{getStatusBadge(invoice.status)}</td>
                        <td className="py-3 px-4">
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Timestamp</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Action</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Performed By</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">IP Address</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map((entry) => (
                      <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-xs text-gray-600">{entry.timestamp}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900">{entry.action}</span>
                            {entry.isAdminAction && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                                ADMIN ACTION
                              </span>
                            )}
                            {entry.isCriticalAction && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold animate-pulse">
                                CRITICAL
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900">{entry.performedBy}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{entry.role}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{entry.ipAddress}</td>
                        <td className="py-3 px-4 text-xs text-gray-600">{entry.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lab Status Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
                    <div>{getStatusBadge(laboratory.status)}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">LOINC & Nabidh Compliance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">LOINC Codes Compliant</p>
                      <p className="text-xs text-gray-600">Test catalog uses standard LOINC codes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={laboratory.loincCompliant} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nabidh HIE Connected</p>
                      <p className="text-xs text-gray-600">Connected to National Unified Medical Record</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={laboratory.nabidhConnected} className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium text-gray-900">FHIR R4 Result Submission</p>
                      <p className="text-xs text-gray-600">Results formatted in FHIR R4 standard</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked className="sr-only peer" readOnly />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Result Escalation Rules</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unacknowledged Critical Result Alert After (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Notify clinic admin if doctor hasn't acknowledged</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Second Escalation After (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Notify CeenAiX super admin</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-red-900 mb-4">Danger Zone</h3>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm">
                    Export All Laboratory Data
                  </button>
                  <button className="w-full px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm">
                    Reset Lab Portal
                  </button>
                  <button className="w-full px-4 py-2 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium text-sm">
                    Suspend All Active Orders
                  </button>
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold text-sm">
                    Delete Laboratory Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
