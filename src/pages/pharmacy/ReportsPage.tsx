import { BarChart2 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart2 className="w-8 h-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        <p className="text-gray-600">View pharmacy performance and compliance reports</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
        <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Reports & Analytics</h2>
        <p className="text-gray-600">Pharmacy reports will appear here</p>
      </div>
    </div>
  );
}
