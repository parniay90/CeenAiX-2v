import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PatientLayout } from '../components/PatientLayout';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Download,
  Calendar,
  FileText,
  Search,
  Clock,
  CheckCircle,
  Beaker,
  Plus,
  AlertCircle,
  Filter,
  Eye
} from 'lucide-react';

interface LabTestOrder {
  id: string;
  patient_id: string;
  test_type_id: string;
  facility_id: string;
  doctor_id: string;
  order_date: string;
  scheduled_date: string | null;
  status: string;
  priority: string;
  notes: string | null;
  created_at: string;
  test_type?: {
    name: string;
    category: string;
    description: string;
  };
  facility?: {
    name: string;
    city: string;
    address: string;
  };
  doctor?: {
    full_name: string;
  };
}

interface LabTestResult {
  id: string;
  test_order_id: string;
  result_date: string;
  result_values: any;
  status: string;
  interpretation: string | null;
  created_at: string;
}

export default function LabTestsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [testOrders, setTestOrders] = useState<LabTestOrder[]>([]);
  const [testResults, setTestResults] = useState<LabTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'results'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchTestOrders();
      fetchTestResults();
    }
  }, [user]);

  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lab_test_orders')
        .select(`
          *,
          test_type:lab_test_catalog(name, category, description),
          facility:lab_facilities(name, city, address),
          doctor:profiles!lab_test_orders_doctor_id_fkey(full_name)
        `)
        .eq('patient_id', user?.id)
        .order('order_date', { ascending: false });

      if (error) throw error;
      setTestOrders(data || []);
    } catch (error) {
      console.error('Error fetching test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResults = async () => {
    try {
      const { data: orders } = await supabase
        .from('lab_test_orders')
        .select('id')
        .eq('patient_id', user?.id);

      if (!orders || orders.length === 0) return;

      const orderIds = orders.map(o => o.id);
      const { data, error } = await supabase
        .from('lab_test_results')
        .select('*')
        .in('test_order_id', orderIds)
        .order('result_date', { ascending: false });

      if (error) throw error;
      setTestResults(data || []);
    } catch (error) {
      console.error('Error fetching test results:', error);
    }
  };

  const filteredOrders = testOrders.filter(order => {
    const matchesSearch = order.test_type?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.facility?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'in_progress': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Beaker className="w-12 h-12" />
              <h1 className="text-4xl font-bold">
                {language === 'en' ? 'Lab Tests & Results' : 'الفحوصات المخبرية والنتائج'}
              </h1>
            </div>
            <p className="text-lg opacity-90 mb-8">
              {language === 'en'
                ? 'View your lab test orders and results'
                : 'عرض طلبات الفحوصات والنتائج'}
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {language === 'en' ? 'Test Orders' : 'طلبات الفحوصات'}
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'results'
                    ? 'bg-white text-blue-700'
                    : 'bg-blue-700 text-white hover:bg-blue-800'
                }`}
              >
                {language === 'en' ? 'Test Results' : 'نتائج الفحوصات'}
              </button>
            </div>

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search tests or labs...' : 'ابحث عن الفحوصات أو المختبرات...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  >
                    <option value="all">{language === 'en' ? 'All Status' : 'جميع الحالات'}</option>
                    <option value="pending">{language === 'en' ? 'Pending' : 'قيد الانتظار'}</option>
                    <option value="scheduled">{language === 'en' ? 'Scheduled' : 'مجدول'}</option>
                    <option value="completed">{language === 'en' ? 'Completed' : 'مكتمل'}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'orders' ? (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${filteredOrders.length} ${filteredOrders.length === 1 ? 'order' : 'orders'} found`
                    : `تم العثور على ${filteredOrders.length} طلب`}
                </p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  {language === 'en' ? 'New Test' : 'فحص جديد'}
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No test orders found' : 'لم يتم العثور على طلبات فحوصات'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Your lab test orders will appear here'
                      : 'ستظهر طلبات الفحوصات المخبرية هنا'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Beaker className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {order.test_type?.name || 'Unknown Test'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              {order.test_type?.category || 'N/A'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.test_type?.description || 'No description available'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className={`text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                            {order.priority} Priority
                          </span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Ordered Date</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {new Date(order.order_date).toLocaleDateString()}
                            </p>
                          </div>
                          {order.scheduled_date && (
                            <div>
                              <p className="text-xs text-gray-600 mb-1">Scheduled For</p>
                              <p className="font-semibold text-gray-900 text-sm">
                                {new Date(order.scheduled_date).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Lab Facility</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {order.facility?.name || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Ordered By</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {order.doctor?.full_name || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-900">{order.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                        </button>
                        {order.status.toLowerCase() === 'completed' && (
                          <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {language === 'en' ? 'View Results' : 'عرض النتائج'}
                          </button>
                        )}
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          {language === 'en' ? 'Download' : 'تنزيل'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {language === 'en' ? 'Test Results' : 'نتائج الفحوصات'}
                </h2>
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${testResults.length} ${testResults.length === 1 ? 'result' : 'results'} available`
                    : `${testResults.length} نتيجة متاحة`}
                </p>
              </div>

              {testResults.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No results yet' : 'لا توجد نتائج بعد'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Your lab test results will appear here when available'
                      : 'ستظهر نتائج الفحوصات المخبرية هنا عند توفرها'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Test Results
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Result Date: {new Date(result.result_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                      </div>

                      {result.interpretation && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
                          <p className="text-sm font-semibold text-blue-900 mb-1">
                            Interpretation:
                          </p>
                          <p className="text-sm text-blue-800">{result.interpretation}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === 'en' ? 'View Full Report' : 'عرض التقرير الكامل'}
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          {language === 'en' ? 'Download PDF' : 'تنزيل PDF'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
