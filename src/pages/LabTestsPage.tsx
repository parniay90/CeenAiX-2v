import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { PatientLayout } from '../components/PatientLayout';
import { useNavigation } from '../Router';
import {
  Download,
  Share2,
  Calendar,
  FileText,
  Activity,
  Search,
  Clock,
  CheckCircle,
  Building2,
  Beaker,
  Plus,
  BarChart3,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Filter,
  X
} from 'lucide-react';

interface TestOrder {
  id: string;
  test_type_id: string;
  order_date: string;
  scheduled_date: string;
  status: string;
  priority: string;
  notes: string;
  test_types: {
    name: string;
    category: string;
    description: string;
  };
  lab_facilities: {
    name: string;
    address: string;
    city: string;
  } | null;
}

interface TestResult {
  id: string;
  test_order_id: string;
  result_date: string;
  result_data: any;
  doctor_interpretation: string;
  doctor_recommendations: string;
  follow_up_tests: string[];
  status: string;
  attachments: string[];
}

export default function LabTestsPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { navigateToFindLabs } = useNavigation();

  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTestOrders();
    }
  }, [user]);

  const fetchTestOrders = async () => {
    try {
      setLoading(true);
      const { data: orders, error: ordersError } = await supabase
        .from('lab_test_orders')
        .select(`
          *,
          test_types (name, category, description),
          lab_facilities (name, address, city)
        `)
        .eq('patient_id', user?.id)
        .order('order_date', { ascending: false });

      if (ordersError) throw ordersError;

      setTestOrders(orders || []);

      const resultsMap: { [key: string]: TestResult } = {};

      for (const order of orders || []) {
        const { data: result } = await supabase
          .from('lab_test_results')
          .select('*')
          .eq('test_order_id', order.id)
          .maybeSingle();

        if (result) {
          resultsMap[order.id] = result;
        }
      }

      setTestResults(resultsMap);
    } catch (error) {
      console.error('Error fetching test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = (order: TestOrder) => {
    const result = testResults[order.id];
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Report - ${order.test_types.name}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 60px; background: #fff; color: #333; }
            .header { text-align: center; border-bottom: 4px solid #0D7377; padding-bottom: 30px; margin-bottom: 40px; }
            .header h1 { color: #0D7377; font-size: 32px; margin-bottom: 10px; }
            .header p { color: #666; font-size: 14px; }
            .info-section { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 40px; }
            .info-box { background: #f8f9fa; padding: 20px; border-radius: 12px; border-left: 4px solid #0D7377; }
            .info-label { font-size: 12px; color: #666; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; }
            .info-value { font-size: 18px; color: #333; font-weight: 600; }
            .section-title { font-size: 24px; color: #0D7377; margin: 40px 0 20px 0; padding-bottom: 10px; border-bottom: 2px solid #e5e7eb; }
            .results-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .results-table th { background: #0D7377; color: white; padding: 15px; text-align: left; font-weight: 600; }
            .results-table td { padding: 15px; border-bottom: 1px solid #e5e7eb; }
            .results-table tbody tr:hover { background: #f8f9fa; }
            .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
            .status-normal { background: #d1fae5; color: #065f46; }
            .status-high { background: #fee2e2; color: #991b1b; }
            .status-low { background: #fef3c7; color: #92400e; }
            .interpretation-box { background: #eff6ff; padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 20px 0; }
            .recommendations-box { background: #f0fdf4; padding: 25px; border-radius: 12px; border-left: 4px solid #16a34a; margin: 20px 0; }
            .footer { margin-top: 60px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #666; font-size: 12px; }
            @media print { body { padding: 40px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laboratory Test Report</h1>
            <p>CeenAiX Healthcare Platform | Comprehensive Health Testing</p>
          </div>

          <div class="info-section">
            <div class="info-box">
              <div class="info-label">Patient Test</div>
              <div class="info-value">${order.test_types.name}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Test Category</div>
              <div class="info-value">${order.test_types.category}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Test Date</div>
              <div class="info-value">${new Date(result?.result_date || order.scheduled_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div class="info-box">
              <div class="info-label">Laboratory</div>
              <div class="info-value">${order.lab_facilities?.name || 'N/A'}</div>
            </div>
          </div>

          ${result?.result_data ? `
            <h2 class="section-title">Test Results</h2>
            <table class="results-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Result</th>
                  <th>Reference Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(result.result_data).map(([key, value]: [string, any]) => `
                  <tr>
                    <td><strong>${key}</strong></td>
                    <td><strong>${value.value} ${value.unit || ''}</strong></td>
                    <td>${value.reference_range || 'N/A'}</td>
                    <td><span class="status-badge status-${(value.status || 'Normal').toLowerCase()}">${value.status || 'Normal'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}

          ${result?.doctor_interpretation ? `
            <h2 class="section-title">Doctor's Interpretation</h2>
            <div class="interpretation-box">
              <p>${result.doctor_interpretation}</p>
            </div>
          ` : ''}

          ${result?.doctor_recommendations ? `
            <h2 class="section-title">Recommendations</h2>
            <div class="recommendations-box">
              <p>${result.doctor_recommendations}</p>
            </div>
          ` : ''}

          <div class="footer">
            <p><strong>CeenAiX Healthcare Platform</strong></p>
            <p>This is an official laboratory report generated on ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin-top: 10px;">For questions or concerns about this report, please contact your healthcare provider.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async (order: TestOrder) => {
    const shareText = `Lab Test Report: ${order.test_types.name}\nCategory: ${order.test_types.category}\nDate: ${new Date(order.order_date).toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lab Report - ${order.test_types.name}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Test information copied to clipboard!');
    }
  };

  const pendingTests = testOrders.filter(order => !testResults[order.id]);
  const completedTests = testOrders.filter(order => testResults[order.id]);

  const categories = ['all', ...Array.from(new Set(testOrders.map(order => order.test_types.category)))];

  const filteredTests = completedTests.filter(order => {
    const matchesSearch = order.test_types.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.test_types.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || order.test_types.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const selectedTestData = selectedTest ? testOrders.find(t => t.id === selectedTest) : null;
  const selectedResult = selectedTest ? testResults[selectedTest] : null;

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your test results...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!selectedTest ? (
            <>
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Lab Test Results
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      View your test reports and track your health progress
                    </p>
                  </div>
                  <button
                    onClick={navigateToFindLabs}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5" />
                    Schedule New Test
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-blue-500 to-blue-600'} text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Clock className="w-6 h-6" />
                      </div>
                      <span className="text-4xl font-bold">{pendingTests.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Pending Tests</h3>
                    <p className="text-blue-100 text-sm">Awaiting results</p>
                  </div>

                  <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-green-500 to-green-600'} text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <span className="text-4xl font-bold">{completedTests.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Completed</h3>
                    <p className="text-green-100 text-sm">Results available</p>
                  </div>

                  <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-purple-700' : 'bg-gradient-to-br from-purple-500 to-purple-600'} text-white shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <span className="text-4xl font-bold">{testOrders.length}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Total Tests</h3>
                    <p className="text-purple-100 text-sm">All time</p>
                  </div>
                </div>
              </div>

              {pendingTests.length > 0 && (
                <div className="mb-8">
                  <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Tests in Progress
                  </h2>
                  <div className="grid gap-4">
                    {pendingTests.map(order => (
                      <div
                        key={order.id}
                        className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-sm hover:shadow-md transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                              <Beaker className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {order.test_types.name}
                              </h3>
                              <div className="flex items-center gap-4 text-sm">
                                <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  <Calendar className="w-4 h-4" />
                                  Ordered {new Date(order.order_date).toLocaleDateString()}
                                </span>
                                {order.lab_facilities && (
                                  <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Building2 className="w-4 h-4" />
                                    {order.lab_facilities.name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Test Reports ({completedTests.length})
                  </h2>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Search test results..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all ${
                        isDarkMode
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-teal-500'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-teal-500'
                      } outline-none`}
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                          filterCategory === cat
                            ? 'bg-teal-600 text-white shadow-lg'
                            : isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                        }`}
                      >
                        {cat === 'all' ? 'All Tests' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredTests.length === 0 ? (
                  <div className={`text-center py-20 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-2 border-dashed ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                    <Beaker className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      No test reports found
                    </h3>
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {searchQuery ? 'Try adjusting your search or filters' : 'Complete your first test to see results here'}
                    </p>
                    {!searchQuery && (
                      <button
                        onClick={navigateToFindLabs}
                        className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all inline-flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Schedule a Test
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {filteredTests.map(order => {
                      const result = testResults[order.id];
                      return (
                        <div
                          key={order.id}
                          onClick={() => setSelectedTest(order.id)}
                          className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700 hover:border-teal-600' : 'bg-white border border-gray-200 hover:border-teal-500'} shadow-sm hover:shadow-lg transition-all cursor-pointer group`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <FileText className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {order.test_types.name}
                                  </h3>
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                    {order.test_types.category}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar className="w-4 h-4" />
                                    Result: {new Date(result.result_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                  {order.lab_facilities && (
                                    <span className={`flex items-center gap-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      <Building2 className="w-4 h-4" />
                                      {order.lab_facilities.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadReport(order);
                                }}
                                className={`p-3 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                title="Download Report"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleShare(order);
                                }}
                                className={`p-3 rounded-lg transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                title="Share"
                              >
                                <Share2 className="w-5 h-5" />
                              </button>
                              <ArrowRight className={`w-6 h-6 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} group-hover:text-teal-600 group-hover:translate-x-1 transition-all`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>
              <button
                onClick={() => setSelectedTest(null)}
                className={`mb-6 flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' : 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200'}`}
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                Back to Results
              </button>

              {selectedTestData && selectedResult && (
                <div>
                  <div className={`rounded-2xl p-8 mb-6 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'} shadow-lg`}>
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTestData.test_types.name}
                        </h1>
                        <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {selectedTestData.test_types.description}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDownloadReport(selectedTestData)}
                          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg"
                        >
                          <Download className="w-5 h-5" />
                          Download Report
                        </button>
                        <button
                          onClick={() => handleShare(selectedTestData)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
                        >
                          <Share2 className="w-5 h-5" />
                          Share
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Test Date</div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(selectedResult.result_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTestData.test_types.category}
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Laboratory</div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {selectedTestData.lab_facilities?.name || 'N/A'}
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-700/50' : 'bg-white'} border ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedResult.result_data && (
                    <div className={`rounded-2xl p-8 mb-6 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} shadow-lg`}>
                      <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Activity className="w-6 h-6 text-teal-600" />
                        Test Results
                      </h2>
                      <div className="overflow-hidden rounded-xl border-2" style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }}>
                        <table className="w-full">
                          <thead className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                            <tr>
                              <th className={`px-6 py-4 text-left text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Parameter
                              </th>
                              <th className={`px-6 py-4 text-left text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Result
                              </th>
                              <th className={`px-6 py-4 text-left text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Reference Range
                              </th>
                              <th className={`px-6 py-4 text-left text-sm font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(selectedResult.result_data).map(([key, value]: [string, any], idx) => (
                              <tr key={key} className={`${idx % 2 === 0 ? (isDarkMode ? 'bg-gray-800' : 'bg-white') : (isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50')} hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-colors`}>
                                <td className={`px-6 py-4 font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  {key}
                                </td>
                                <td className={`px-6 py-4 font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {value.value} <span className="text-sm font-normal text-gray-500">{value.unit || ''}</span>
                                </td>
                                <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {value.reference_range || 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                    value.status === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                    value.status === 'Low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                  }`}>
                                    {value.status === 'High' ? <TrendingUp className="w-3 h-3" /> :
                                     value.status === 'Low' ? <AlertCircle className="w-3 h-3" /> :
                                     <CheckCircle className="w-3 h-3" />}
                                    {value.status || 'Normal'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {selectedResult.doctor_interpretation && (
                    <div className={`rounded-2xl p-8 mb-6 ${isDarkMode ? 'bg-blue-900/20 border-2 border-blue-800' : 'bg-blue-50 border-2 border-blue-200'}`}>
                      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                        <Activity className="w-6 h-6" />
                        Doctor's Interpretation
                      </h2>
                      <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                        {selectedResult.doctor_interpretation}
                      </p>
                    </div>
                  )}

                  {selectedResult.doctor_recommendations && (
                    <div className={`rounded-2xl p-8 ${isDarkMode ? 'bg-green-900/20 border-2 border-green-800' : 'bg-green-50 border-2 border-green-200'}`}>
                      <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                        <CheckCircle className="w-6 h-6" />
                        Recommendations
                      </h2>
                      <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-green-200' : 'text-green-900'}`}>
                        {selectedResult.doctor_recommendations}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
