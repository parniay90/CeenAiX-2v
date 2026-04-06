import { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Clock, Save } from 'lucide-react';

interface NotificationChannel {
  id: string;
  name: string;
  icon: any;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
}

export default function NotificationPreferencesSection() {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: 'email', name: 'Email Notifications', icon: Mail, enabled: true },
    { id: 'sms', name: 'SMS Notifications', icon: MessageSquare, enabled: true },
    { id: 'push', name: 'Push Notifications', icon: Smartphone, enabled: true },
    { id: 'in-app', name: 'In-App Notifications', icon: Bell, enabled: true },
  ]);

  const [categories, setCategories] = useState<NotificationCategory[]>([
    {
      id: 'critical',
      name: 'Critical System Alerts',
      description: 'Server downtime, security breaches, critical errors',
      email: true,
      sms: true,
      push: true,
      inApp: true,
    },
    {
      id: 'user-management',
      name: 'User Management',
      description: 'New user registrations, profile updates, account changes',
      email: true,
      sms: false,
      push: true,
      inApp: true,
    },
    {
      id: 'payments',
      name: 'Payments & Billing',
      description: 'Payment confirmations, failed transactions, subscription changes',
      email: true,
      sms: true,
      push: false,
      inApp: true,
    },
    {
      id: 'integrations',
      name: 'Integration Status',
      description: 'API failures, integration errors, connection issues',
      email: true,
      sms: false,
      push: true,
      inApp: true,
    },
    {
      id: 'platform-updates',
      name: 'Platform Updates',
      description: 'New features, maintenance windows, system announcements',
      email: true,
      sms: false,
      push: false,
      inApp: true,
    },
    {
      id: 'reports',
      name: 'Reports & Analytics',
      description: 'Weekly reports, monthly summaries, data exports',
      email: true,
      sms: false,
      push: false,
      inApp: false,
    },
  ]);

  const [quietHours, setQuietHours] = useState({
    enabled: true,
    startTime: '22:00',
    endTime: '08:00',
  });

  const toggleChannel = (channelId: string) => {
    setChannels(channels.map(ch =>
      ch.id === channelId ? { ...ch, enabled: !ch.enabled } : ch
    ));
  };

  const toggleCategoryChannel = (categoryId: string, channel: 'email' | 'sms' | 'push' | 'inApp') => {
    setCategories(categories.map(cat =>
      cat.id === categoryId ? { ...cat, [channel]: !cat[channel] } : cat
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Bell className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notification Preferences</h2>
          <p className="text-sm text-gray-600">Configure how and when you receive notifications</p>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
          <div className="grid grid-cols-2 gap-4">
            {channels.map((channel) => {
              const Icon = channel.icon;
              return (
                <div
                  key={channel.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">{channel.name}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={channel.enabled}
                      onChange={() => toggleChannel(channel.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">SMS</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Push</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">In-App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-600">{category.description}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={category.email}
                        onChange={() => toggleCategoryChannel(category.id, 'email')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={category.sms}
                        onChange={() => toggleCategoryChannel(category.id, 'sms')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={category.push}
                        onChange={() => toggleCategoryChannel(category.id, 'push')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={category.inApp}
                        onChange={() => toggleCategoryChannel(category.id, 'inApp')}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-semibold text-gray-900">Enable Quiet Hours</p>
                  <p className="text-sm text-gray-600">Mute non-critical notifications during specified hours</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={quietHours.enabled}
                  onChange={(e) => setQuietHours({ ...quietHours, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            {quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                  <input
                    type="time"
                    value={quietHours.startTime}
                    onChange={(e) => setQuietHours({ ...quietHours, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                  <input
                    type="time"
                    value={quietHours.endTime}
                    onChange={(e) => setQuietHours({ ...quietHours, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
