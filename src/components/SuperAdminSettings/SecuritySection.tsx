import { useState } from 'react';
import { Shield, Smartphone, Monitor, MapPin, AlertTriangle, Check, X, Download, Copy } from 'lucide-react';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface LoginHistory {
  id: string;
  timestamp: string;
  device: string;
  ip: string;
  location: string;
  status: 'Success' | 'Failed' | 'Blocked';
}

export default function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [backupCodes] = useState([
    '4K7M-2P9N-8Q3R',
    '7J6F-9D5H-2W8X',
    '3N8B-1M7V-4C9Z',
    '6R2P-8K5L-9T4Y',
  ]);

  const [activeSessions] = useState<ActiveSession[]>([
    {
      id: '1',
      device: 'MacBook Pro',
      browser: 'Chrome 120',
      ip: '185.210.144.53',
      location: 'Dubai, UAE',
      lastActive: '2 minutes ago',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'iPhone 15 Pro',
      browser: 'Safari Mobile',
      ip: '185.210.144.67',
      location: 'Dubai, UAE',
      lastActive: '1 hour ago',
      isCurrent: false,
    },
  ]);

  const [loginHistory] = useState<LoginHistory[]>([
    { id: '1', timestamp: '2026-03-28 14:30', device: 'MacBook Pro', ip: '185.210.144.53', location: 'Dubai, UAE', status: 'Success' },
    { id: '2', timestamp: '2026-03-28 08:15', device: 'iPhone 15 Pro', ip: '185.210.144.67', location: 'Dubai, UAE', status: 'Success' },
    { id: '3', timestamp: '2026-03-27 19:45', device: 'Windows PC', ip: '91.102.37.21', location: 'Unknown', status: 'Failed' },
    { id: '4', timestamp: '2026-03-27 15:20', device: 'MacBook Pro', ip: '185.210.144.53', location: 'Dubai, UAE', status: 'Success' },
  ]);

  const handleToggle2FA = () => {
    if (!twoFactorEnabled) {
      setShowQRCode(true);
    }
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleRevokeSession = (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session? The user will be signed out.')) {
      alert('Session revoked successfully!');
    }
  };

  const handleTerminateAll = () => {
    if (confirm('Are you sure you want to terminate all other sessions? You will remain signed in on this device only.')) {
      alert('All other sessions terminated!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Security & Two-Factor Authentication</h2>
            <p className="text-sm text-gray-600">Manage your security settings and authentication methods</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Add an extra layer of security to your account
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {twoFactorEnabled ? '✓ Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={handleToggle2FA}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {showQRCode && !twoFactorEnabled && (
            <div className="mt-6 pt-6 border-t border-green-200">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Setup Two-Factor Authentication</h4>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500 text-sm">QR Code</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-4">
                      1. Download an authenticator app like Google Authenticator or Authy<br />
                      2. Scan this QR code with your app<br />
                      3. Enter the 6-digit code to verify
                    </p>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 mb-3"
                    />
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700">
                      Verify & Enable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div className="mt-6 pt-6 border-t border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">Backup Codes</h4>
              <p className="text-sm text-gray-600 mb-3">
                Save these codes in a safe place. You can use them to access your account if you lose your phone.
              </p>
              <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <span className="font-mono text-sm font-semibold text-gray-900">{code}</span>
                      <button className="text-gray-500 hover:text-gray-700">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <Download className="w-4 h-4" />
                  Download Backup Codes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Active Sessions</h3>
            <p className="text-sm text-gray-600">Manage devices where you're currently signed in</p>
          </div>
          <button
            onClick={handleTerminateAll}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors text-sm"
          >
            Terminate All Other Sessions
          </button>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Monitor className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{session.device}</span>
                    {session.isCurrent && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Current Session
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{session.browser}</span>
                    <span>•</span>
                    <span>{session.ip}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {session.location}
                    </div>
                    <span>•</span>
                    <span>Last active: {session.lastActive}</span>
                  </div>
                </div>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900">Login History</h3>
          <p className="text-sm text-gray-600">Recent login attempts to your account</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Device</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loginHistory.map((login) => (
                <tr key={login.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{login.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{login.device}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{login.ip}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{login.location}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                      login.status === 'Success' ? 'bg-green-100 text-green-700' :
                      login.status === 'Failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {login.status === 'Success' && <Check className="w-3 h-3 mr-1" />}
                      {login.status === 'Failed' && <X className="w-3 h-3 mr-1" />}
                      {login.status === 'Blocked' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {login.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {login.status === 'Failed' && (
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        Flag Suspicious
                      </button>
                    )}
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
