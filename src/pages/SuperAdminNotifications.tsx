import { useState } from 'react';
import { ArrowLeft, Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';

export default function SuperAdminNotifications({ onBack }: { onBack?: () => void }) {
  const [emailNotifications, setEmailNotifications] = useState({
    systemAlerts: true,
    securityAlerts: true,
    userActivity: false,
    newClinics: true,
    paymentUpdates: true,
    weeklyReports: true,
    monthlyReports: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    criticalAlerts: true,
    systemDown: true,
    newUserSignups: false,
    supportTickets: true,
  });

  const [smsNotifications, setSmsNotifications] = useState({
    criticalSystemAlerts: true,
    securityBreaches: true,
  });

  const handleSave = () => {
    alert('Notification preferences saved successfully!');
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Notification Preferences</h1>
              <p className="text-sm text-gray-600 mt-1">Manage how you receive notifications and alerts</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email Notifications</h2>
              <p className="text-sm text-gray-600">Choose which emails you want to receive</p>
            </div>
          </div>

          <div className="space-y-4">
            <NotificationToggle
              label="System Alerts"
              description="Platform-wide system alerts and maintenance notifications"
              checked={emailNotifications.systemAlerts}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, systemAlerts: checked })}
            />
            <NotificationToggle
              label="Security Alerts"
              description="Failed login attempts, suspicious activity, and security events"
              checked={emailNotifications.securityAlerts}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, securityAlerts: checked })}
            />
            <NotificationToggle
              label="User Activity"
              description="New user registrations and significant user actions"
              checked={emailNotifications.userActivity}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, userActivity: checked })}
            />
            <NotificationToggle
              label="New Clinic Registrations"
              description="Notifications when new clinics register on the platform"
              checked={emailNotifications.newClinics}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, newClinics: checked })}
            />
            <NotificationToggle
              label="Payment Updates"
              description="Subscription payments, failed transactions, and billing alerts"
              checked={emailNotifications.paymentUpdates}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, paymentUpdates: checked })}
            />
            <NotificationToggle
              label="Weekly Reports"
              description="Weekly summary of platform activity and metrics"
              checked={emailNotifications.weeklyReports}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, weeklyReports: checked })}
            />
            <NotificationToggle
              label="Monthly Reports"
              description="Detailed monthly analytics and performance reports"
              checked={emailNotifications.monthlyReports}
              onChange={(checked) => setEmailNotifications({ ...emailNotifications, monthlyReports: checked })}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Smartphone className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Push Notifications</h2>
              <p className="text-sm text-gray-600">Browser and mobile push notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            <NotificationToggle
              label="Critical Alerts"
              description="Urgent platform issues requiring immediate attention"
              checked={pushNotifications.criticalAlerts}
              onChange={(checked) => setPushNotifications({ ...pushNotifications, criticalAlerts: checked })}
            />
            <NotificationToggle
              label="System Down Alerts"
              description="Notifications when critical systems are down"
              checked={pushNotifications.systemDown}
              onChange={(checked) => setPushNotifications({ ...pushNotifications, systemDown: checked })}
            />
            <NotificationToggle
              label="New User Signups"
              description="Real-time notifications for new user registrations"
              checked={pushNotifications.newUserSignups}
              onChange={(checked) => setPushNotifications({ ...pushNotifications, newUserSignups: checked })}
            />
            <NotificationToggle
              label="Support Tickets"
              description="New support tickets and urgent customer inquiries"
              checked={pushNotifications.supportTickets}
              onChange={(checked) => setPushNotifications({ ...pushNotifications, supportTickets: checked })}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">SMS Notifications</h2>
              <p className="text-sm text-gray-600">Text message alerts for critical events</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-amber-800">
              SMS notifications are sent only for critical events. Standard messaging rates may apply.
            </p>
          </div>

          <div className="space-y-4">
            <NotificationToggle
              label="Critical System Alerts"
              description="Platform outages and critical infrastructure issues"
              checked={smsNotifications.criticalSystemAlerts}
              onChange={(checked) => setSmsNotifications({ ...smsNotifications, criticalSystemAlerts: checked })}
            />
            <NotificationToggle
              label="Security Breaches"
              description="Immediate alerts for security incidents and data breaches"
              checked={smsNotifications.securityBreaches}
              onChange={(checked) => setSmsNotifications({ ...smsNotifications, securityBreaches: checked })}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}
