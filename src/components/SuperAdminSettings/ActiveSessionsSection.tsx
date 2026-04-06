import { useState } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, Shield, AlertTriangle, X } from 'lucide-react';

interface Session {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  deviceName: string;
  browser: string;
  os: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
  loginTime: string;
}

const mockSessions: Session[] = [
  {
    id: '1',
    deviceType: 'desktop',
    deviceName: 'MacBook Pro',
    browser: 'Chrome 122',
    os: 'macOS 14.3',
    location: 'Dubai, UAE',
    ipAddress: '192.168.1.45',
    lastActive: 'Active now',
    isCurrent: true,
    loginTime: '2026-04-06 09:30 AM',
  },
  {
    id: '2',
    deviceType: 'mobile',
    deviceName: 'iPhone 15 Pro',
    browser: 'Safari 17',
    os: 'iOS 17.3',
    location: 'Dubai, UAE',
    ipAddress: '192.168.1.78',
    lastActive: '2 hours ago',
    isCurrent: false,
    loginTime: '2026-04-06 07:15 AM',
  },
  {
    id: '3',
    deviceType: 'tablet',
    deviceName: 'iPad Air',
    browser: 'Safari 17',
    os: 'iPadOS 17.3',
    location: 'Abu Dhabi, UAE',
    ipAddress: '10.0.0.34',
    lastActive: '1 day ago',
    isCurrent: false,
    loginTime: '2026-04-05 02:20 PM',
  },
];

export default function ActiveSessionsSection() {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [showRevokeDialog, setShowRevokeDialog] = useState(false);
  const [sessionToRevoke, setSessionToRevoke] = useState<Session | null>(null);

  const handleRevoke = (session: Session) => {
    setSessionToRevoke(session);
    setShowRevokeDialog(true);
  };

  const confirmRevoke = () => {
    if (sessionToRevoke) {
      setSessions(sessions.filter(s => s.id !== sessionToRevoke.id));
      setShowRevokeDialog(false);
      setSessionToRevoke(null);
    }
  };

  const revokeAllOthers = () => {
    setSessions(sessions.filter(s => s.isCurrent));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return Smartphone;
      case 'tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Active Sessions</h2>
            <p className="text-sm text-gray-600">Manage your active login sessions across devices</p>
          </div>
        </div>
        <button
          onClick={revokeAllOthers}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors"
        >
          Revoke All Other Sessions
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const DeviceIcon = getDeviceIcon(session.deviceType);
          return (
            <div
              key={session.id}
              className={`p-5 rounded-xl border-2 transition-all ${
                session.isCurrent
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`p-3 rounded-lg ${
                      session.isCurrent ? 'bg-green-100' : 'bg-gray-100'
                    }`}
                  >
                    <DeviceIcon className={`w-6 h-6 ${session.isCurrent ? 'text-green-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{session.deviceName}</h3>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                          Current Session
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Monitor className="w-4 h-4" />
                        <span>{session.browser} • {session.os}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Last active: {session.lastActive}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 font-mono text-xs">
                        IP: {session.ipAddress}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Logged in: {session.loginTime}</p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevoke(session)}
                    className="ml-4 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm transition-colors"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showRevokeDialog && sessionToRevoke && (
        <RevokeSessionDialog
          session={sessionToRevoke}
          onConfirm={confirmRevoke}
          onCancel={() => setShowRevokeDialog(false)}
        />
      )}
    </div>
  );
}

interface RevokeSessionDialogProps {
  session: Session;
  onConfirm: () => void;
  onCancel: () => void;
}

function RevokeSessionDialog({ session, onConfirm, onCancel }: RevokeSessionDialogProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Revoke Session
        </h3>

        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to revoke the session on <strong>{session.deviceName}</strong>? This will sign out this device immediately.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}
