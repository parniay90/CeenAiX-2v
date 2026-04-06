import { useState } from 'react';
import { Activity, Link, Shield, DollarSign, Database, Mail, MessageSquare, Smartphone, Webhook, Eye, Copy, RefreshCw, Save, CheckCircle, XCircle } from 'lucide-react';

interface APIKey {
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed?: string;
}

export function NabidhIntegrationSection() {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState('nabidh_live_sk_7f8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Activity className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nabidh HIE Integration</h2>
          <p className="text-sm text-gray-600">UAE National Health Information Exchange integration settings</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Integration Status</p>
              <p className="text-sm text-green-700">Connected and syncing</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Active</span>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nabidh API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
              />
            </div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={showKey ? 'Hide' : 'Show'}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(apiKey)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Facility ID</label>
            <input
              type="text"
              defaultValue="FAC-UAE-DXB-001"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider ID</label>
            <input
              type="text"
              defaultValue="PROV-UAE-CEENAIX"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Endpoint URL</label>
            <input
              type="url"
              defaultValue="https://api.nabidh.ae/v1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Environment</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
              <option>Production</option>
              <option>Sandbox</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Auto-sync Patient Records</h3>
            <p className="text-sm text-gray-600">Automatically push patient records to Nabidh HIE</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
            Test Connection
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function DHAIntegrationSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">DHA API Integration</h2>
          <p className="text-sm text-gray-600">Dubai Health Authority license verification and compliance</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-gray-900">Integration Status</p>
              <p className="text-sm text-green-700">Connected</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Active</span>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">DHA API Credentials</label>
          <div className="space-y-3">
            <APIKeyField label="Client ID" value="dha_client_a1b2c3d4e5f6" />
            <APIKeyField label="Client Secret" value="dha_secret_g7h8i9j0k1l2m3n4o5p6" isSecret />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">API Base URL</label>
            <input
              type="url"
              defaultValue="https://api.dha.gov.ae/v2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">License Verification Endpoint</label>
            <input
              type="text"
              defaultValue="/verify-license"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Auto-verify Doctor Licenses</h3>
            <p className="text-sm text-gray-600">Automatically verify DHA licenses on doctor registration</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function InsuranceIntegrationSection() {
  const [providers] = useState([
    { name: 'Daman Insurance', status: 'active', lastSync: '10 min ago' },
    { name: 'ADNIC', status: 'active', lastSync: '25 min ago' },
    { name: 'AXA Gulf', status: 'error', lastSync: '2 hours ago' },
    { name: 'MetLife Alico', status: 'inactive', lastSync: 'Never' },
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insurance Provider Integrations</h2>
            <p className="text-sm text-gray-600">Manage insurance company API connections</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Add Provider
        </button>
      </div>

      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                {provider.name.slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-600">Last sync: {provider.lastSync}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                provider.status === 'active' ? 'bg-green-100 text-green-700' :
                provider.status === 'error' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Configure</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AIServicesSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-teal-100 rounded-lg">
          <Activity className="w-6 h-6 text-teal-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI & Third-Party Services</h2>
          <p className="text-sm text-gray-600">Configure ChatGPT and other AI model integrations</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">OpenAI / ChatGPT</h3>
          <APIKeyField label="API Key" value="sk-proj-abcdef123456789..." isSecret />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Model</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option>GPT-4 Turbo</option>
                <option>GPT-4</option>
                <option>GPT-3.5 Turbo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Tokens</label>
              <input type="number" defaultValue={2000} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS Provider (Twilio)</h3>
          <APIKeyField label="Account SID" value="AC1234567890abcdef..." />
          <div className="mt-3">
            <APIKeyField label="Auth Token" value="your_auth_token_here" isSecret />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Provider (SendGrid)</h3>
          <APIKeyField label="API Key" value="SG.1234567890..." isSecret />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700">
            <Save className="w-4 h-4" />
            Save All Services
          </button>
        </div>
      </div>
    </div>
  );
}

export function FHIRAPISection() {
  const [apiKeys] = useState([
    { id: '1', name: 'Production API Key', key: 'fhir_pk_...', created: '2026-03-01', lastUsed: '2 min ago', status: 'active' },
    { id: '2', name: 'Development API Key', key: 'fhir_dk_...', created: '2026-02-15', lastUsed: '1 day ago', status: 'active' },
    { id: '3', name: 'Testing API Key', key: 'fhir_tk_...', created: '2026-01-10', lastUsed: 'Never', status: 'inactive' },
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Database className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">FHIR R4 API Access</h2>
            <p className="text-sm text-gray-600">Manage API keys for FHIR-compliant data access</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Generate New Key
        </button>
      </div>

      <div className="space-y-3 mb-6">
        {apiKeys.map((key) => (
          <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{key.name}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Created: {key.created}</span>
                <span>•</span>
                <span>Last used: {key.lastUsed}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                key.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {key.status.charAt(0).toUpperCase() + key.status.slice(1)}
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View</button>
              <button className="text-red-600 hover:text-red-700 font-medium text-sm">Revoke</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-2">FHIR Endpoint</h3>
        <p className="text-sm font-mono text-gray-700 bg-white p-3 rounded-lg border border-blue-200">
          https://api.ceenaix.com/fhir/r4
        </p>
      </div>
    </div>
  );
}

export function SMSIntegrationSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 rounded-lg">
          <MessageSquare className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SMS Gateway Integration</h2>
          <p className="text-sm text-gray-600">Configure SMS provider for notifications and OTP</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
            <option>Twilio</option>
            <option>AWS SNS</option>
            <option>MessageBird</option>
          </select>
        </div>

        <APIKeyField label="Account SID" value="AC1234567890abcdef..." />
        <APIKeyField label="Auth Token" value="your_auth_token_here" isSecret />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Sender ID</label>
          <input
            type="text"
            defaultValue="CeenAiX"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmailIntegrationSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Email Service Integration</h2>
          <p className="text-sm text-gray-600">Configure email provider for notifications and alerts</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>SendGrid</option>
            <option>AWS SES</option>
            <option>Mailgun</option>
          </select>
        </div>

        <APIKeyField label="API Key" value="SG.1234567890..." isSecret />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Email</label>
            <input
              type="email"
              defaultValue="noreply@ceenaix.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Name</label>
            <input
              type="text"
              defaultValue="CeenAiX Platform"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function PushNotificationSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Smartphone className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Push Notification Service</h2>
          <p className="text-sm text-gray-600">Configure Firebase Cloud Messaging for push notifications</p>
        </div>
      </div>

      <div className="space-y-6">
        <APIKeyField label="Server Key" value="AAAAxxxxxxx:APAxxxxxxx..." isSecret />
        <APIKeyField label="Sender ID" value="123456789012" />

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Firebase Project ID</label>
          <input
            type="text"
            defaultValue="ceenaix-healthcare"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700">
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export function WebhooksSection() {
  const [webhooks] = useState([
    { id: '1', url: 'https://example.com/webhook/prescriptions', event: 'prescription.created', status: 'active' },
    { id: '2', url: 'https://example.com/webhook/appointments', event: 'appointment.booked', status: 'active' },
    { id: '3', url: 'https://example.com/webhook/lab-results', event: 'lab_result.available', status: 'inactive' },
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Webhook className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Webhook Configuration</h2>
            <p className="text-sm text-gray-600">Configure outbound webhooks for real-time events</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Add Webhook
        </button>
      </div>

      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{webhook.event}</h3>
              <p className="text-sm font-mono text-gray-600">{webhook.url}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                webhook.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {webhook.status.charAt(0).toUpperCase() + webhook.status.slice(1)}
              </span>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function APIKeyField({ label, value, isSecret = false }: { label: string; value: string; isSecret?: boolean }) {
  const [show, setShow] = useState(false);

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          readOnly
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-gray-50"
        />
        <button
          onClick={() => setShow(!show)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          title={show ? 'Hide' : 'Show'}
        >
          <Eye className="w-4 h-4" />
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          title="Copy"
        >
          <Copy className="w-4 h-4" />
        </button>
        {isSecret && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Regenerate"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
