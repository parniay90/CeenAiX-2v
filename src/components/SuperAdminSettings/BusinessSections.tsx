import { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, FileText, Download, Eye, Calendar, Save, Upload } from 'lucide-react';

export function BillingOverviewSection() {
  const revenueData = [
    { month: 'Jan 2026', mrr: 127500, growth: 15 },
    { month: 'Feb 2026', mrr: 142000, growth: 11 },
    { month: 'Mar 2026', mrr: 158600, growth: 12 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-green-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Billing & Revenue Overview</h2>
          <p className="text-sm text-gray-600">Monitor monthly recurring revenue and payment metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <h3 className="text-sm font-semibold text-gray-700">Current MRR</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">158,600 AED</p>
          <div className="flex items-center gap-1 mt-2 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+12% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-semibold text-gray-700">Active Subscriptions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">54</p>
          <p className="text-sm text-gray-600 mt-2">Across all plans</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-semibold text-gray-700">Pending Invoices</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">7</p>
          <p className="text-sm text-gray-600 mt-2">12,450 AED outstanding</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Month</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">MRR</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Growth</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {revenueData.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-semibold text-gray-900">{row.month}</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900">{row.mrr.toLocaleString()} AED</td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-green-600 font-semibold">+{row.growth}%</span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export Revenue Report
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50">
          <Calendar className="w-4 h-4" />
          Custom Date Range
        </button>
      </div>
    </div>
  );
}

export function InvoiceSettingsSection() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FileText className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Invoice & Payment Settings</h2>
          <p className="text-sm text-gray-600">Configure invoice templates and payment terms</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Company Legal Name</label>
              <input
                type="text"
                defaultValue="AryAiX LLC"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Trade License Number</label>
              <input
                type="text"
                defaultValue="DED-12345678"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">TRN (Tax Registration Number)</label>
              <input
                type="text"
                defaultValue="100123456700003"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">VAT Rate (%)</label>
              <input
                type="number"
                defaultValue={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Billing Address</label>
              <textarea
                defaultValue="Dilan Tower, Al Jadaf, Dubai, UAE"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Terms</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Default Payment Terms</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>Net 30</option>
                <option>Net 15</option>
                <option>Net 7</option>
                <option>Due on Receipt</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Late Payment Fee (%)</label>
              <input
                type="number"
                defaultValue={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Instructions</label>
              <textarea
                defaultValue="Bank Transfer: Emirates NBD - Account: 1234567890"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Template</h3>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-900">Current Template</p>
                <p className="text-sm text-gray-600">Standard Professional Template</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-white">
                  <Upload className="w-4 h-4" />
                  Upload Custom
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900">Auto-send Invoices</h3>
            <p className="text-sm text-gray-600">Automatically email invoices when generated</p>
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

export function NotificationTemplatesSection() {
  const [templates] = useState([
    { id: '1', name: 'Welcome Email', type: 'Email', status: 'active', lastEdited: '2026-03-15' },
    { id: '2', name: 'Appointment Reminder', type: 'SMS', status: 'active', lastEdited: '2026-03-20' },
    { id: '3', name: 'Password Reset', type: 'Email', status: 'active', lastEdited: '2026-02-28' },
    { id: '4', name: 'Lab Results Ready', type: 'Push', status: 'active', lastEdited: '2026-03-10' },
    { id: '5', name: 'Payment Confirmation', type: 'Email', status: 'active', lastEdited: '2026-03-18' },
    { id: '6', name: 'Prescription Refill', type: 'SMS', status: 'draft', lastEdited: '2026-03-25' },
  ]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notification Templates</h2>
            <p className="text-sm text-gray-600">Manage email, SMS, and push notification templates</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Create Template
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        <input
          type="search"
          placeholder="Search templates..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
          <option>All Types</option>
          <option>Email</option>
          <option>SMS</option>
          <option>Push</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Template Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Edited</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 font-semibold text-gray-900">{template.name}</td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    template.type === 'Email' ? 'bg-blue-100 text-blue-700' :
                    template.type === 'SMS' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {template.type}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600">{template.lastEdited}</td>
                <td className="px-4 py-4">
                  <div className="flex gap-3">
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
                    <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">Preview</button>
                    <button className="text-red-600 hover:text-red-700 font-medium text-sm">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
