import { useState } from 'react';
import { ArrowLeft, Mail, Send, Download, CheckCircle, AlertTriangle, XCircle, AlertOctagon, Eye, Copy, RefreshCw, Save, FileText, Palette, Layers, UserMinus, Smartphone, Webhook, Activity, Shield, Link as LinkIcon, Database, MessageSquare, DollarSign, Globe, Calendar, Clock, TrendingUp, TrendingDown, BarChart3, PieChart, Zap, Settings, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PharmacyEmailService() {
  const [activeHealthBanner, setActiveHealthBanner] = useState<'healthy' | 'bounce' | 'error' | 'quota' | 'spam'>('healthy');
  const [dateRange, setDateRange] = useState('month');
  const [emailFormat, setEmailFormat] = useState('html');
  const [signatureEnabled, setSignatureEnabled] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [expandedEmailType, setExpandedEmailType] = useState<string | null>(null);
  const [expandedLogRow, setExpandedLogRow] = useState<string | null>(null);
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailSuccess, setTestEmailSuccess] = useState(false);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [diagnosticComplete, setDiagnosticComplete] = useState(false);

  const handleSendTestEmail = () => {
    setTestEmailSending(true);
    setTestEmailSuccess(false);
    setTimeout(() => {
      setTestEmailSending(false);
      setTestEmailSuccess(true);
    }, 3000);
  };

  const handleRunDiagnostic = () => {
    setRunningDiagnostic(true);
    setDiagnosticComplete(false);
    setTimeout(() => {
      setRunningDiagnostic(false);
      setDiagnosticComplete(true);
    }, 5000);
  };

  const dailyVolumeData = [
    { date: 'Mar 1', sent: 145, delivered: 143 },
    { date: 'Mar 2', sent: 156, delivered: 154 },
    { date: 'Mar 3', sent: 167, delivered: 165 },
    { date: 'Mar 4', sent: 142, delivered: 140 },
    { date: 'Mar 5', sent: 189, delivered: 186 },
    { date: 'Mar 6', sent: 178, delivered: 175 },
    { date: 'Mar 7', sent: 134, delivered: 132 },
    { date: 'Mar 8', sent: 198, delivered: 195 },
    { date: 'Mar 9', sent: 165, delivered: 163 },
    { date: 'Mar 10', sent: 172, delivered: 170 },
  ];

  const openRateData = [
    { date: 'Mar 1', openRate: 54, industryAvg: 45 },
    { date: 'Mar 2', openRate: 56, industryAvg: 45 },
    { date: 'Mar 3', openRate: 58, industryAvg: 45 },
    { date: 'Mar 4', openRate: 55, industryAvg: 45 },
    { date: 'Mar 5', openRate: 59, industryAvg: 45 },
    { date: 'Mar 6', openRate: 61, industryAvg: 45 },
    { date: 'Mar 7', openRate: 57, industryAvg: 45 },
    { date: 'Mar 8', openRate: 62, industryAvg: 45 },
    { date: 'Mar 9', openRate: 58, industryAvg: 45 },
    { date: 'Mar 10', openRate: 57, industryAvg: 45 },
  ];

  const emailTypeData = [
    { name: 'Notifications', value: 2847, color: '#059669' },
    { name: 'Reports', value: 1247, color: '#3B82F6' },
    { name: 'System', value: 531, color: '#7C3AED' },
    { name: 'Transactional', value: 222, color: '#0D9488' },
  ];

  const sendTimeData = [
    { hour: '8 AM', rate: 52 },
    { hour: '9 AM', rate: 72 },
    { hour: '10 AM', rate: 68 },
    { hour: '11 AM', rate: 61 },
    { hour: '12 PM', rate: 48 },
    { hour: '1 PM', rate: 43 },
    { hour: '2 PM', rate: 56 },
    { hour: '3 PM', rate: 59 },
    { hour: '4 PM', rate: 54 },
    { hour: '5 PM', rate: 47 },
  ];

  const deviceData = [
    { name: 'iPhone Mail', value: 38, color: '#3B82F6' },
    { name: 'Gmail', value: 24, color: '#EF4444' },
    { name: 'Outlook', value: 18, color: '#6366F1' },
    { name: 'Android', value: 12, color: '#10B981' },
    { name: 'Other', value: 8, color: '#6B7280' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Dashboard</span>
                <span>›</span>
                <span>Settings</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Email Service</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Email Service</h1>
                  <p className="text-sm text-gray-600 mt-1">Manage email delivery for notifications, reports, and pharmacy communications</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button
                onClick={handleSendTestEmail}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
              >
                <Send className="w-4 h-4" />
                Send Test Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {activeHealthBanner === 'healthy' && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Email service is fully operational</h3>
                  <p className="text-sm text-gray-700 mt-1">
                    SendGrid — Connected ✓ | Delivery rate: 98.2% | 0 bounces today
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Last email sent: 4 minutes ago — delivered ✓</p>
                </div>
              </div>
              <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-100 font-medium">
                Send Test →
              </button>
            </div>
          </div>
        )}

        {activeHealthBanner === 'bounce' && (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Bounce rate elevated — action required</h3>
                  <p className="text-sm text-gray-700 mt-1">3 email bounces today (2.1% rate)</p>
                  <p className="text-xs text-gray-600 mt-1">Soft bounces: 2 | Hard bounces: 1</p>
                  <p className="text-xs text-amber-700 mt-2">High bounce rates can affect future email deliverability</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">
                Review Bounces →
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4,847</div>
            <div className="text-sm text-gray-600 mb-2">Emails Sent This Month</div>
            <div className="text-xs text-gray-500">Daily avg: 161 | Today: 156</div>
            <div className="text-xs text-emerald-600 font-medium mt-1">↑ +12% vs last month</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-teal-600" />
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">✓</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">98.2%</div>
            <div className="text-sm text-gray-600 mb-2">Delivery Rate</div>
            <div className="text-xs text-gray-500">4,756 delivered | 91 failed</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Low</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">1.4%</div>
            <div className="text-sm text-gray-600 mb-2">Bounce Rate</div>
            <div className="text-xs text-gray-500">Hard: 8 | Soft: 59 | Total: 67</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">57.3%</div>
            <div className="text-sm text-gray-600 mb-2">Open Rate</div>
            <div className="text-xs text-gray-500">2,721 of 4,756 delivered</div>
            <div className="text-xs text-blue-600 font-medium mt-1">↑ +4% vs last month</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertOctagon className="w-5 h-5 text-red-600" />
              </div>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Good</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">2</div>
            <div className="text-sm text-gray-600 mb-2">Spam Complaints</div>
            <div className="text-xs text-gray-500">This month: 2 | Rate: 0.04%</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserMinus className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">4</div>
            <div className="text-sm text-gray-600 mb-2">Unsubscribes</div>
            <div className="text-xs text-gray-500">This month: 4 | Total: 18</div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Email Service Status</h2>
            <p className="text-sm text-gray-600 mt-1">SendGrid email delivery provider connection and configuration</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <div className="text-2xl font-bold text-blue-600 mb-2">SendGrid</div>
                  <p className="text-sm text-gray-600">Provider: SendGrid by Twilio</p>
                  <p className="text-sm text-gray-600">Plan: Professional (read-only)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">API ENDPOINT</label>
                    <div className="text-sm text-gray-900 font-mono">api.send****.com</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">AUTHENTICATION</label>
                    <div className="text-sm text-gray-900">API Key (Bearer Token)</div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">STATUS</label>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700">Connected</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">RESPONSE TIME</label>
                    <div className="text-sm font-medium text-green-600">182ms</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">SSL/TLS</div>
                      <div className="text-sm font-medium text-green-600">TLS 1.3 ✓</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">DKIM Signing</div>
                      <div className="text-sm font-medium text-green-600">✓ Verified</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">SPF Record</div>
                      <div className="text-sm font-medium text-green-600">✓ Verified</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">DMARC</div>
                      <div className="text-sm font-medium text-green-600">✓ Configured</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">SENDING DOMAIN</label>
                    <div className="text-sm font-bold text-gray-900">noreply@ceenaix.com</div>
                    <div className="text-xs text-gray-600 mt-1">Verified & warmed sending domain</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-6">Live Health Metrics</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">API STATUS</div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-bold text-green-700">Operational</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Last: 4 min ago</div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">QUEUE</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-gray-900">Empty</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">No emails queued</div>
                  </div>

                  <div className="col-span-2 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">MONTHLY VOLUME</div>
                    <div className="text-sm font-bold text-gray-900 mb-2">4,847 / 5,000 emails</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: '96.9%' }}></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span className="text-xs text-amber-700 font-medium">Approaching monthly limit</span>
                    </div>
                  </div>

                  <div className="col-span-2 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-xs font-semibold text-gray-600 mb-2">SENDER REPUTATION</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-emerald-700">98/100</div>
                        <div className="text-sm text-emerald-600 font-medium">Excellent</div>
                      </div>
                      <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                  Test Connection
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Delivery Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">Track email performance, open rates, and engagement metrics</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Email Volume — Last 10 Days</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sent" fill="#3B82F6" name="Sent" />
                  <Bar dataKey="delivered" fill="#059669" name="Delivered" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Email Open Rate — Last 10 Days</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={openRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="openRate" stroke="#059669" fill="#059669" fillOpacity={0.3} name="Your Rate" />
                  <Area type="monotone" dataKey="industryAvg" stroke="#9CA3AF" fill="none" strokeDasharray="5 5" name="Industry Avg" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Emails by Type</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={emailTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {emailTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {emailTypeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Best Send Times</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sendTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="rate" fill="#059669" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-sm text-center text-gray-600">
                Peak open rate: <span className="font-bold text-emerald-600">9-10 AM (72%)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Email Clients Used</h3>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPie>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="mt-4 space-y-1">
                {deviceData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-700">{item.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{item.value}%</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-center text-gray-600">
                72% opened on mobile devices
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Test & Diagnostic Tools</h2>
            <p className="text-sm text-gray-600 mt-1">Test email delivery and verify configuration is working correctly</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Test Email</h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                  <input
                    type="email"
                    defaultValue="sara.almansoori@alshifapharmacy.ae"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Type to Test</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>Custom Message</option>
                    <option>Daily Summary</option>
                    <option>Low Stock Alert</option>
                    <option>Claim Notification</option>
                    <option>DHA License Warning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  defaultValue="Test — Al Shifa Pharmacy Email Delivery Test"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
                <textarea
                  rows={6}
                  defaultValue="This is a test email from Al Shifa Pharmacy via CeenAiX Email Service (SendGrid).&#10;&#10;If you receive this, email delivery is working correctly.&#10;&#10;Sent by: Sara Al Mansoori"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">Include signature</span>
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">Format:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" defaultChecked className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">HTML</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="format" className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-gray-700">Plain Text</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleSendTestEmail}
                  disabled={testEmailSending}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold text-lg disabled:opacity-50"
                >
                  {testEmailSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending test email...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Send Test Email
                    </>
                  )}
                </button>
              </div>

              {testEmailSuccess && (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                    <h4 className="text-lg font-bold text-gray-900">Test Email Sent Successfully</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">To:</span>
                      <span className="ml-2 font-medium text-gray-900">sara.almansoori@alshifapharmacy.ae</span>
                    </div>
                    <div>
                      <span className="text-gray-600">From:</span>
                      <span className="ml-2 font-medium text-gray-900">noreply@ceenaix.com</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sent at:</span>
                      <span className="ml-2 font-medium text-gray-900">11:48 AM GST</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Format:</span>
                      <span className="ml-2 font-medium text-gray-900">HTML</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Size:</span>
                      <span className="ml-2 font-medium text-gray-900">24.3 KB</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Response time:</span>
                      <span className="ml-2 font-medium text-emerald-600">182ms</span>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">SendGrid Status:</div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">Accepted by SendGrid ✓</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Delivery to inbox — pending confirmation</div>
                  </div>

                  <div className="mt-4 text-sm text-gray-700">
                    Check <span className="font-bold">sara.almansoori@alshifapharmacy.ae</span> for the test email
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Full Email Diagnostic</h3>

            <button
              onClick={handleRunDiagnostic}
              disabled={runningDiagnostic}
              className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-bold disabled:opacity-50"
            >
              {runningDiagnostic ? 'Running Diagnostic...' : 'Run Email Diagnostic'}
            </button>

            {(runningDiagnostic || diagnosticComplete) && (
              <div className="mt-6 space-y-2">
                <DiagnosticStep step={1} label="API Connection" status={runningDiagnostic ? 'running' : 'complete'} result="Connected (182ms)" />
                <DiagnosticStep step={2} label="Authentication" status={runningDiagnostic && !diagnosticComplete ? 'pending' : 'complete'} result="API Key Valid" />
                <DiagnosticStep step={3} label="Domain Verification" status={diagnosticComplete ? 'complete' : 'pending'} result="Verified" />
                <DiagnosticStep step={4} label="DKIM Check" status={diagnosticComplete ? 'complete' : 'pending'} result="Signing Active" />
                <DiagnosticStep step={5} label="SPF Check" status={diagnosticComplete ? 'complete' : 'pending'} result="Record Found" />
                <DiagnosticStep step={6} label="DMARC Check" status={diagnosticComplete ? 'complete' : 'pending'} result="Policy Active" />
                <DiagnosticStep step={7} label="Bounce List" status={diagnosticComplete ? 'complete' : 'pending'} result="Synced (23 suppressed)" />
                <DiagnosticStep step={8} label="Unsubscribe List" status={diagnosticComplete ? 'complete' : 'pending'} result="Synced (18 addresses)" />
                <DiagnosticStep step={9} label="Spam Rate Check" status={diagnosticComplete ? 'complete' : 'pending'} result="0.04% (below threshold)" />
                <DiagnosticStep step={10} label="Monthly Quota" status={diagnosticComplete ? 'warning' : 'pending'} result="96.9% used" />
              </div>
            )}

            {diagnosticComplete && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold text-emerald-900">9 of 10 checks passed</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="text-sm text-amber-800">1 warning: Monthly quota nearly full</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiagnosticStep({ step, label, status, result }: { step: number; label: string; status: 'pending' | 'running' | 'complete' | 'warning'; result: string }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <span className="text-sm font-medium text-gray-500 w-8">#{step}</span>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{label}</div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div
              className={`h-1 rounded-full transition-all duration-500 ${
                status === 'complete' ? 'bg-emerald-500 w-full' :
                status === 'warning' ? 'bg-amber-500 w-full' :
                status === 'running' ? 'bg-blue-500 w-2/3' :
                'bg-gray-300 w-0'
              }`}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {status === 'complete' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
        {status === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
        {status === 'running' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
        {status === 'pending' && <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>}
        <span className={`text-sm font-medium ${
          status === 'complete' ? 'text-emerald-700' :
          status === 'warning' ? 'text-amber-700' :
          'text-gray-500'
        }`}>{result}</span>
      </div>
    </div>
  );
}
