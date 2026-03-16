import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientLayout } from '../components/PatientLayout';
import {
  FileText,
  Calendar,
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  ChevronDown,
  ChevronUp,
  Beaker,
  Activity
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

interface Message {
  id: string;
  sender_id: string;
  message: string;
  is_doctor: boolean;
  created_at: string;
}

export default function LabTestsPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<{ [key: string]: string }>({});
  const [sendingMessage, setSendingMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

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

      // Fetch results for completed tests
      for (const order of orders || []) {
        if (order.status === 'completed') {
          await fetchTestResult(order.id);
        }
      }
    } catch (error) {
      console.error('Error fetching test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestResult = async (testOrderId: string) => {
    try {
      const { data, error } = await supabase
        .from('lab_test_results')
        .select('*')
        .eq('test_order_id', testOrderId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setTestResults(prev => ({ ...prev, [testOrderId]: data }));
        await fetchMessages(data.id);
      }
    } catch (error) {
      console.error('Error fetching test result:', error);
    }
  };

  const fetchMessages = async (testResultId: string) => {
    try {
      const { data, error } = await supabase
        .from('lab_test_messages')
        .select('*')
        .eq('test_result_id', testResultId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({ ...prev, [testResultId]: data || [] }));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (testResultId: string) => {
    const messageText = newMessage[testResultId]?.trim();
    if (!messageText || sendingMessage) return;

    try {
      setSendingMessage(testResultId);

      const { error } = await supabase
        .from('lab_test_messages')
        .insert({
          test_result_id: testResultId,
          sender_id: user?.id,
          message: messageText,
          is_doctor: false
        });

      if (error) throw error;

      setNewMessage(prev => ({ ...prev, [testResultId]: '' }));
      await fetchMessages(testResultId);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'ordered':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  const filteredOrders = testOrders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status !== 'completed';
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

  return (
    <PatientLayout>
      <div className="min-h-screen" style={{ background: isDarkMode ? '#0F172A' : '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Beaker className="w-8 h-8 text-teal-600" />
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Lab Tests & Results
              </h1>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              View your test results, doctor recommendations, and ask questions
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
            {[
              { key: 'all', label: 'All Tests' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => window.location.href = '/find-labs'}
              className="p-6 rounded-xl border-2 border-dashed transition-all hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
              style={{
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                background: isDarkMode ? '#1E293B' : 'white'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Beaker className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Find Lab Facilities
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Search for labs and book tests
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => window.location.href = '/doctors'}
              className="p-6 rounded-xl border-2 border-dashed transition-all hover:border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/20"
              style={{
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                background: isDarkMode ? '#1E293B' : 'white'
              }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Request Test from Doctor
                  </h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Consult with a doctor for test orders
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* Test Orders List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading tests...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
              <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No tests found
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                You don't have any {activeTab !== 'all' ? activeTab : ''} lab tests yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => {
                const result = testResults[order.id];
                const isExpanded = expandedResult === order.id;

                return (
                  <div
                    key={order.id}
                    className="rounded-xl shadow-sm transition-all"
                    style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                  >
                    {/* Order Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                            {getStatusIcon(order.status)}
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {order.test_types.name}
                            </h3>
                            <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {order.test_types.category} • {order.test_types.description}
                            </p>
                            <div className="flex flex-wrap gap-2 items-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                                {order.priority.toUpperCase()}
                              </span>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Ordered: {new Date(order.order_date).toLocaleDateString()}
                              </span>
                              {order.scheduled_date && (
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  • Scheduled: {new Date(order.scheduled_date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {result && (
                          <button
                            onClick={() => setExpandedResult(isExpanded ? null : order.id)}
                            className="px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-teal-600 text-white hover:bg-teal-700"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4 inline mr-1" />
                                Hide Results
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4 inline mr-1" />
                                View Results
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {order.lab_facilities && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {order.lab_facilities.name}
                          </p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {order.lab_facilities.address}, {order.lab_facilities.city}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Expanded Results Section */}
                    {result && isExpanded && (
                      <div className="border-t px-6 py-6" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
                        {/* Result Data */}
                        <div className="mb-6">
                          <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Test Results
                          </h4>
                          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                            {Object.keys(result.result_data).length > 0 ? (
                              <div className="space-y-2">
                                {Object.entries(result.result_data).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {key}:
                                    </span>
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                      {String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                Detailed results will be available soon
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Doctor's Interpretation */}
                        {result.doctor_interpretation && (
                          <div className="mb-6">
                            <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              <FileText className="w-5 h-5" />
                              Doctor's Interpretation
                            </h4>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
                              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {result.doctor_interpretation}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Recommendations */}
                        {result.doctor_recommendations && (
                          <div className="mb-6">
                            <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              <AlertCircle className="w-5 h-5" />
                              Recommendations
                            </h4>
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-yellow-50'}`}>
                              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                {result.doctor_recommendations}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Follow-up Tests */}
                        {result.follow_up_tests && result.follow_up_tests.length > 0 && (
                          <div className="mb-6">
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Recommended Follow-up Tests
                            </h4>
                            <div className="space-y-2">
                              {result.follow_up_tests.map((test, index) => (
                                <div
                                  key={index}
                                  className={`p-3 rounded-lg flex items-center gap-2 ${isDarkMode ? 'bg-gray-800' : 'bg-purple-50'}`}
                                >
                                  <CheckCircle className="w-5 h-5 text-purple-600" />
                                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                    {test}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Attachments */}
                        {result.attachments && result.attachments.length > 0 && (
                          <div className="mb-6">
                            <h4 className={`font-bold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              Attachments
                            </h4>
                            <div className="space-y-2">
                              {result.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href={attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`p-3 rounded-lg flex items-center gap-2 hover:bg-opacity-80 transition-all ${
                                    isDarkMode ? 'bg-gray-800 text-blue-400' : 'bg-gray-50 text-blue-600'
                                  }`}
                                >
                                  <Download className="w-5 h-5" />
                                  <span>Download Report {index + 1}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Messages Section */}
                        <div className={`border-t pt-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <h4 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            <MessageSquare className="w-5 h-5" />
                            Ask Your Doctor
                          </h4>

                          {/* Message List */}
                          <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                            {messages[result.id]?.map(msg => (
                              <div
                                key={msg.id}
                                className={`p-4 rounded-lg ${
                                  msg.is_doctor
                                    ? isDarkMode
                                      ? 'bg-blue-900/30 ml-8'
                                      : 'bg-blue-50 ml-8'
                                    : isDarkMode
                                    ? 'bg-gray-800 mr-8'
                                    : 'bg-gray-100 mr-8'
                                }`}
                              >
                                <div className="flex items-start gap-2">
                                  <div>
                                    <p className={`text-xs font-semibold mb-1 ${
                                      msg.is_doctor ? 'text-blue-600' : isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>
                                      {msg.is_doctor ? 'Doctor' : 'You'}
                                    </p>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {msg.message}
                                    </p>
                                    <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                      {new Date(msg.created_at).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newMessage[result.id] || ''}
                              onChange={(e) => setNewMessage(prev => ({ ...prev, [result.id]: e.target.value }))}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage(result.id)}
                              placeholder="Ask a question about your results..."
                              className={`flex-1 px-4 py-3 rounded-lg border-2 focus:outline-none focus:border-teal-600 ${
                                isDarkMode
                                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                              }`}
                            />
                            <button
                              onClick={() => sendMessage(result.id)}
                              disabled={!newMessage[result.id]?.trim() || sendingMessage === result.id}
                              className="px-6 py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
