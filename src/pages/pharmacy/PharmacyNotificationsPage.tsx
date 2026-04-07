import { BellRing } from 'lucide-react';

export default function PharmacyNotificationsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BellRing className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        </div>
        <p className="text-gray-600">View all system notifications and alerts</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <BellRing className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Notifications</h2>
        <p className="text-gray-600">All notifications will appear here</p>
      </div>
    </div>
  );
}
