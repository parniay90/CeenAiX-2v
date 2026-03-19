import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientLayout } from '../components/PatientLayout';
import { useNavigation } from '../Router';
import {
  Download,
  Share2,
  MessageCircle,
  Calendar,
  FileText,
  Activity,
  Search,
  Filter,
  ChevronRight,
  X,
  Send,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Building2,
  Beaker,
  Eye,
  Plus
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
  const { navigateToFindLabs } = useNavigation();

  const [testOrders, setTestOrders] = useState<TestOrder[]>([]);
  const [testResults, setTestResults] = useState<{ [key: string]: TestResult }>({});
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<{ [key: string]: string }>({});
  const [sendingMessage, setSendingMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAIChat, setShowAIChat] = useState<string | null>(null);
  const [aiMessages, setAiMessages] = useState<{ [key: string]: Array<{role: string, text: string}> }>({});
  const [aiInput, setAiInput] = useState<{ [key: string]: string }>({});
  const [showDoctorChat, setShowDoctorChat] = useState<string | null>(null);

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
      const messagesMap: { [key: string]: Message[] } = {};

      for (const order of orders || []) {
        const { data: result } = await supabase
          .from('lab_test_results')
          .select('*')
          .eq('test_order_id', order.id)
          .single();

        if (result) {
          resultsMap[order.id] = result;

          const { data: msgs } = await supabase
            .from('lab_result_messages')
            .select('*')
            .eq('test_result_id', result.id)
            .order('created_at', { ascending: true });

          messagesMap[result.id] = msgs || [];
        }
      }

      setTestResults(resultsMap);
      setMessages(messagesMap);
    } catch (error) {
      console.error('Error fetching test orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (resultId: string) => {
    if (!newMessage[resultId]?.trim() || sendingMessage) return;

    try {
      setSendingMessage(resultId);
      const { error } = await supabase
        .from('lab_result_messages')
        .insert({
          test_result_id: resultId,
          sender_id: user?.id,
          message: newMessage[resultId],
          is_doctor: false
        });

      if (error) throw error;

      setNewMessage(prev => ({ ...prev, [resultId]: '' }));
      await fetchTestOrders();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(null);
    }
  };

  const handlePrint = (order: TestOrder) => {
    const result = testResults[order.id];
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Lab Test Report - ${order.test_types.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            .header { border-bottom: 3px solid #0D7377; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0D7377; margin: 0; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .info-item { padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .info-label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
            .info-value { font-size: 16px; color: #333; margin-top: 5px; }
            .section { margin: 30px 0; }
            .section h2 { color: #0D7377; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background: #f8f9fa; font-weight: 600; }
            .interpretation { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #0D7377; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Laboratory Test Report</h1>
            <p style="color: #666; margin: 10px 0 0 0;">CeenAiX Healthcare Platform</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Test Name</div>
              <div class="info-value">${order.test_types.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Test Date</div>
              <div class="info-value">${new Date(result?.result_date || order.scheduled_date).toLocaleDateString()}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Laboratory</div>
              <div class="info-value">${order.lab_facilities?.name || 'N/A'}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Status</div>
              <div class="info-value">${order.status}</div>
            </div>
          </div>

          ${result?.result_data ? `
            <div class="section">
              <h2>Test Results</h2>
              <table>
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
                      <td>${key}</td>
                      <td><strong>${value.value} ${value.unit || ''}</strong></td>
                      <td>${value.reference_range || 'N/A'}</td>
                      <td>${value.status || 'Normal'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

          ${result?.doctor_interpretation ? `
            <div class="section">
              <h2>Doctor's Interpretation</h2>
              <div class="interpretation">
                <p>${result.doctor_interpretation}</p>
              </div>
            </div>
          ` : ''}

          ${result?.doctor_recommendations ? `
            <div class="section">
              <h2>Recommendations</h2>
              <p>${result.doctor_recommendations}</p>
            </div>
          ` : ''}

          <div style="margin-top: 60px; padding-top: 20px; border-top: 2px solid #e2e8f0; font-size: 12px; color: #666;">
            <p>This is a computer-generated report from CeenAiX Healthcare Platform.</p>
            <p>Generated on: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async (order: TestOrder) => {
    const shareText = `Lab Test: ${order.test_types.name}\nOrder Date: ${new Date(order.order_date).toLocaleDateString()}\nStatus: ${order.status}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lab Test - ${order.test_types.name}`,
          text: shareText,
        });
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Test information copied to clipboard!');
    }
  };

  const handleAIQuestion = (resultId: string, question: string) => {
    if (!question.trim()) return;

    const newMessages = [...(aiMessages[resultId] || []), { role: 'user', text: question }];

    const aiResponse = `Based on your test results, ${question.toLowerCase().includes('mean') ? 'this indicates...' : 'I can help explain...'} However, I recommend discussing specific concerns with your doctor for personalized medical advice.`;

    newMessages.push({ role: 'ai', text: aiResponse });
    setAiMessages(prev => ({ ...prev, [resultId]: newMessages }));
    setAiInput(prev => ({ ...prev, [resultId]: '' }));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
        return 'text-red-600 dark:text-red-400';
      case 'high':
        return 'text-orange-600 dark:text-orange-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const filteredOrders = testOrders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status.toLowerCase() === activeTab;
    const matchesSearch = order.test_types.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.test_types.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading) {
    return (
      <PatientLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Beaker className="w-12 h-12 animate-pulse mx-auto mb-4 text-teal-600" />
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Loading test results...</p>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Lab Results
              </h1>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View and manage your laboratory test results
              </p>
            </div>
            <button
              onClick={navigateToFindLabs}
              className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Book New Test
            </button>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search tests by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700 text-white focus:border-teal-500'
                    : 'bg-white border-gray-200 text-gray-900 focus:border-teal-500'
                } outline-none`}
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-teal-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Results Grid */}
        {filteredOrders.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <Beaker className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No test results found
            </h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Try adjusting your search' : 'Book your first lab test to get started'}
            </p>
            <button
              onClick={navigateToFindLabs}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all"
            >
              Find Lab Facilities
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => {
              const result = testResults[order.id];
              const isSelected = selectedResult === order.id;

              return (
                <div
                  key={order.id}
                  className={`rounded-2xl border-2 transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  } ${isSelected ? 'ring-4 ring-teal-500/20' : ''}`}
                >
                  {/* Test Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                            <Beaker className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                              {order.test_types.name}
                            </h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {order.test_types.category}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                        {order.priority && (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(order.priority)}`}>
                            {order.priority}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Test Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Order Date
                          </span>
                        </div>
                        <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>

                      {result && (
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Result Date
                            </span>
                          </div>
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {new Date(result.result_date).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {order.lab_facilities && (
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Laboratory
                            </span>
                          </div>
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {order.lab_facilities.name}
                          </p>
                        </div>
                      )}

                      {order.lab_facilities && (
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="w-4 h-4 text-purple-600" />
                            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Location
                            </span>
                          </div>
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {order.lab_facilities.city}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {result && (
                        <>
                          <button
                            onClick={() => setSelectedResult(isSelected ? null : order.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                            {isSelected ? 'Hide' : 'View'} Details
                          </button>
                          <button
                            onClick={() => handlePrint(order)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Download className="w-4 h-4" />
                            Print
                          </button>
                          <button
                            onClick={() => handleShare(order)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                              isDarkMode
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Share2 className="w-4 h-4" />
                            Share
                          </button>
                          <button
                            onClick={() => setShowAIChat(showAIChat === result.id ? null : result.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                          >
                            <Sparkles className="w-4 h-4" />
                            AI Assistant
                          </button>
                          <button
                            onClick={() => setShowDoctorChat(showDoctorChat === result.id ? null : result.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                              isDarkMode
                                ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50'
                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                            }`}
                          >
                            <MessageCircle className="w-4 h-4" />
                            Ask Doctor
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isSelected && result && (
                    <div className={`border-t-2 p-6 ${isDarkMode ? 'border-gray-700 bg-gray-900/30' : 'border-gray-200 bg-gray-50'}`}>
                      {/* Test Results Table */}
                      {result.result_data && (
                        <div className="mb-6">
                          <h4 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Test Results
                          </h4>
                          <div className="overflow-x-auto rounded-xl border-2" style={{ borderColor: isDarkMode ? '#374151' : '#E5E7EB' }}>
                            <table className="w-full">
                              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                                <tr>
                                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Parameter
                                  </th>
                                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Result
                                  </th>
                                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Reference Range
                                  </th>
                                  <th className={`px-6 py-4 text-left text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(result.result_data).map(([key, value]: [string, any], idx) => (
                                  <tr key={key} className={idx % 2 === 0 ? (isDarkMode ? 'bg-gray-800/50' : 'bg-white') : ''}>
                                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {key}
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                      {value.value} {value.unit || ''}
                                    </td>
                                    <td className={`px-6 py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {value.reference_range || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        value.status === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                        value.status === 'Low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      }`}>
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

                      {/* Doctor's Interpretation */}
                      {result.doctor_interpretation && (
                        <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-blue-900/20 border-2 border-blue-800' : 'bg-blue-50 border-2 border-blue-200'}`}>
                          <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                            <Activity className="w-5 h-5" />
                            Doctor's Interpretation
                          </h4>
                          <p className={isDarkMode ? 'text-blue-200' : 'text-blue-800'}>
                            {result.doctor_interpretation}
                          </p>
                        </div>
                      )}

                      {/* Recommendations */}
                      {result.doctor_recommendations && (
                        <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-green-900/20 border-2 border-green-800' : 'bg-green-50 border-2 border-green-200'}`}>
                          <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-900'}`}>
                            <CheckCircle className="w-5 h-5" />
                            Recommendations
                          </h4>
                          <p className={isDarkMode ? 'text-green-200' : 'text-green-800'}>
                            {result.doctor_recommendations}
                          </p>
                        </div>
                      )}

                      {/* Follow-up Tests */}
                      {result.follow_up_tests && result.follow_up_tests.length > 0 && (
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-purple-900/20 border-2 border-purple-800' : 'bg-purple-50 border-2 border-purple-200'}`}>
                          <h4 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                            Recommended Follow-up Tests
                          </h4>
                          <ul className="space-y-2">
                            {result.follow_up_tests.map((test, idx) => (
                              <li key={idx} className={`flex items-center gap-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-800'}`}>
                                <ChevronRight className="w-4 h-4" />
                                {test}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Chat Panel */}
                  {showAIChat === result?.id && (
                    <div className={`border-t-2 p-6 ${isDarkMode ? 'border-gray-700 bg-gradient-to-br from-purple-900/20 to-pink-900/20' : 'border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            AI Health Assistant
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ask questions about your test results
                          </p>
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 mb-4 max-h-64 overflow-y-auto ${isDarkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                        {(aiMessages[result.id] || []).map((msg, idx) => (
                          <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                            <div className={`inline-block px-4 py-2 rounded-2xl max-w-xs ${
                              msg.role === 'user'
                                ? 'bg-teal-600 text-white'
                                : isDarkMode
                                ? 'bg-gray-800 text-gray-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Ask about your results..."
                          value={aiInput[result.id] || ''}
                          onChange={(e) => setAiInput(prev => ({ ...prev, [result.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleAIQuestion(result.id, aiInput[result.id])}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } outline-none focus:border-purple-500`}
                        />
                        <button
                          onClick={() => handleAIQuestion(result.id, aiInput[result.id])}
                          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Doctor Chat Panel */}
                  {showDoctorChat === result?.id && (
                    <div className={`border-t-2 p-6 ${isDarkMode ? 'border-gray-700 bg-blue-900/10' : 'border-gray-200 bg-blue-50'}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Message Your Doctor
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Ask questions about this test result
                          </p>
                        </div>
                      </div>

                      <div className={`rounded-xl p-4 mb-4 max-h-64 overflow-y-auto ${isDarkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
                        {(messages[result.id] || []).length === 0 ? (
                          <p className={`text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            No messages yet. Start a conversation with your doctor.
                          </p>
                        ) : (
                          messages[result.id].map((msg) => (
                            <div key={msg.id} className={`mb-3 ${msg.is_doctor ? 'text-left' : 'text-right'}`}>
                              <div className={`inline-block px-4 py-2 rounded-2xl max-w-xs ${
                                msg.is_doctor
                                  ? isDarkMode
                                    ? 'bg-gray-800 text-gray-200'
                                    : 'bg-gray-100 text-gray-800'
                                  : 'bg-blue-600 text-white'
                              }`}>
                                <p className="text-sm">{msg.message}</p>
                                <p className={`text-xs mt-1 ${msg.is_doctor ? 'text-gray-500' : 'text-blue-100'}`}>
                                  {new Date(msg.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your message..."
                          value={newMessage[result.id] || ''}
                          onChange={(e) => setNewMessage(prev => ({ ...prev, [result.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(result.id)}
                          disabled={sendingMessage === result.id}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700 text-white'
                              : 'bg-white border-gray-300 text-gray-900'
                          } outline-none focus:border-blue-500`}
                        />
                        <button
                          onClick={() => handleSendMessage(result.id)}
                          disabled={sendingMessage === result.id}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
