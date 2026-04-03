import { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import type { LabOrder } from '../types/labOrder';

interface Props {
  order: LabOrder;
  onBack: () => void;
}

export default function LabOrderDetailView({ order, onBack }: Props) {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Lab Orders
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>Dashboard</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span>Lab Orders</span>
                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                <span className="text-gray-900 font-medium">{order.id}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#0A1628] font-['Sora']">{order.id}</h1>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1.5 rounded-full text-base font-medium ${
                  order.priority === 'stat' ? 'bg-red-100 text-red-700' :
                  order.priority === 'urgent' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {order.priority.toUpperCase()}
                </span>
                {order.criticalResult && (
                  <span className="px-3 py-1.5 bg-red-100 text-red-700 text-base font-bold rounded-full animate-pulse">
                    🔴 CRITICAL RESULT
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6">
            {['Details', 'Tests & Samples', 'Results', 'Insurance', 'Patient History', 'Audit Trail'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/ /g, '_'))}
                className={`py-3 px-2 border-b-2 transition-colors ${
                  activeTab === tab.toLowerCase().replace(/ /g, '_')
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="font-medium">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600">Patient</div>
              <div className="text-gray-900 mt-1 font-medium">{order.patientName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Doctor</div>
              <div className="text-gray-900 mt-1 font-medium">{order.doctorName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Laboratory</div>
              <div className="text-gray-900 mt-1 font-medium">{order.labName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-gray-900 mt-1 font-medium capitalize">{order.status.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ordered Date</div>
              <div className="text-gray-900 mt-1">{order.orderedDate} at {order.orderedTime}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Clinical Indication</div>
              <div className="text-gray-900 mt-1">{order.clinicalIndication}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tests Ordered</h3>
            <div className="space-y-3">
              {order.tests.map((test) => (
                <div key={test.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{test.testName}</div>
                      <div className="text-sm text-gray-600 mt-1">LOINC: {test.loincCode}</div>
                      <div className="text-sm text-gray-600">Sample: {test.sampleType.replace(/_/g, ' ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Price</div>
                      <div className="font-semibold text-gray-900">AED {test.price}</div>
                    </div>
                  </div>
                  {test.resultValue && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-gray-600">Result: </span>
                          <span className="font-semibold text-gray-900">
                            {test.resultValue} {test.resultUnit}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.interpretation === 'normal' ? 'bg-emerald-100 text-emerald-700' :
                          test.interpretation === 'abnormal' ? 'bg-amber-100 text-amber-700' :
                          test.interpretation === 'critical' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {test.interpretation?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
