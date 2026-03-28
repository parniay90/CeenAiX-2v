import { ArrowLeft, CheckCircle, AlertCircle, XCircle, Activity, Database, Shield, Globe, Zap, Server, Clock, TrendingUp } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  lastChecked: string;
  responseTime?: string;
}

interface Incident {
  id: string;
  date: string;
  service: string;
  duration: string;
  resolution: string;
  status: 'resolved' | 'investigating' | 'monitoring';
}

export default function SuperAdminPlatformStatus({ onBack }: { onBack?: () => void }) {
  const services: ServiceStatus[] = [
    { name: 'API Server', status: 'operational', uptime: '99.98%', lastChecked: '2 minutes ago', responseTime: '45ms' },
    { name: 'Database', status: 'operational', uptime: '99.99%', lastChecked: '1 minute ago', responseTime: '12ms' },
    { name: 'Nabidh HIE Sync', status: 'operational', uptime: '99.85%', lastChecked: '5 minutes ago', responseTime: '230ms' },
    { name: 'DHA API', status: 'operational', uptime: '99.92%', lastChecked: '3 minutes ago', responseTime: '180ms' },
    { name: 'Insurance APIs', status: 'degraded', uptime: '98.50%', lastChecked: '1 minute ago', responseTime: '850ms' },
    { name: 'Email Service', status: 'operational', uptime: '99.95%', lastChecked: '4 minutes ago' },
    { name: 'SMS Service', status: 'operational', uptime: '99.88%', lastChecked: '2 minutes ago' },
    { name: 'AI Service (ChatGPT)', status: 'operational', uptime: '99.70%', lastChecked: '1 minute ago', responseTime: '1200ms' },
  ];

  const incidents: Incident[] = [
    {
      id: '1',
      date: '2026-03-25 14:30',
      service: 'Insurance APIs',
      duration: '45 minutes',
      resolution: 'Third-party provider network issue. Service restored automatically.',
      status: 'resolved',
    },
    {
      id: '2',
      date: '2026-03-20 09:15',
      service: 'Database',
      duration: '12 minutes',
      resolution: 'Scheduled maintenance completed successfully.',
      status: 'resolved',
    },
    {
      id: '3',
      date: '2026-03-15 18:45',
      service: 'AI Service',
      duration: '1 hour 20 minutes',
      resolution: 'OpenAI API rate limit exceeded. Increased quota and implemented caching.',
      status: 'resolved',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle, iconColor: 'text-green-600' };
      case 'degraded':
        return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertCircle, iconColor: 'text-yellow-600' };
      case 'down':
        return { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle, iconColor: 'text-red-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', icon: Activity, iconColor: 'text-gray-600' };
    }
  };

  const getServiceIcon = (name: string) => {
    if (name.includes('API') || name.includes('Server')) return Server;
    if (name.includes('Database')) return Database;
    if (name.includes('DHA') || name.includes('Nabidh')) return Shield;
    if (name.includes('Insurance')) return Globe;
    if (name.includes('AI') || name.includes('ChatGPT')) return Zap;
    return Activity;
  };

  const overallStatus = services.some(s => s.status === 'down') ? 'down' :
                        services.some(s => s.status === 'degraded') ? 'degraded' : 'operational';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Status</h1>
              <p className="text-sm text-gray-600 mt-1">Real-time monitoring of all platform services</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8 space-y-6">
        <div className={`rounded-2xl shadow-sm border p-8 ${
          overallStatus === 'operational' ? 'bg-green-50 border-green-200' :
          overallStatus === 'degraded' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-4">
            {overallStatus === 'operational' && <CheckCircle className="w-12 h-12 text-green-600" />}
            {overallStatus === 'degraded' && <AlertCircle className="w-12 h-12 text-yellow-600" />}
            {overallStatus === 'down' && <XCircle className="w-12 h-12 text-red-600" />}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {overallStatus === 'operational' && 'All Systems Operational'}
                {overallStatus === 'degraded' && 'Some Systems Experiencing Issues'}
                {overallStatus === 'down' && 'System Outage Detected'}
              </h2>
              <p className="text-gray-700">
                {overallStatus === 'operational' && 'All platform services are running smoothly'}
                {overallStatus === 'degraded' && 'Some services are experiencing degraded performance'}
                {overallStatus === 'down' && 'Critical systems are currently down'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Service Status</h2>
              <p className="text-sm text-gray-600">Current status of all platform services</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, index) => {
              const statusInfo = getStatusColor(service.status);
              const ServiceIcon = getServiceIcon(service.name);
              const StatusIcon = statusInfo.icon;

              return (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <ServiceIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Checked {service.lastChecked}</span>
                        </div>
                      </div>
                    </div>
                    <StatusIcon className={`w-6 h-6 ${statusInfo.iconColor}`} />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">30-day uptime</div>
                      <div className="font-semibold text-gray-900">{service.uptime}</div>
                    </div>
                  </div>

                  {service.responseTime && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Avg Response Time</span>
                        <span className="font-semibold text-gray-900">{service.responseTime}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Recent Incidents</h2>
              <p className="text-sm text-gray-600">Last 10 platform incidents and their resolutions</p>
            </div>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div key={incident.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{incident.service}</h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{incident.date}</span>
                      <span>•</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2">{incident.resolution}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Overall Uptime</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">99.94%</p>
            <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Avg Response Time</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">156ms</p>
            <p className="text-sm text-gray-600 mt-1">Across all services</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-gray-900">Incidents</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-600 mt-1">Last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
}
