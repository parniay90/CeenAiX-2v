import { useState, useEffect } from 'react';
import { Pill, Calendar, User, FileText, Clock, AlertCircle, Search, Download, Plus, ChevronRight, Package, MapPin } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
}

interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id: string | null;
  medications: Medication[];
  status: string;
  valid_until: string | null;
  created_at: string;
  doctor?: {
    full_name: string;
    specialization: string;
  };
}

interface RefillRequest {
  id: string;
  prescription_id: string;
  pharmacy_id: string;
  status: string;
  requested_quantity: number;
  notes: string | null;
  created_at: string;
  pharmacy?: {
    name: string;
    address: string;
  };
}

export default function PrescriptionsPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'refills'>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
      fetchRefillRequests();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prescriptions')
        .select(`
          *,
          doctor:profiles!prescriptions_doctor_id_fkey(full_name, specialization)
        `)
        .eq('patient_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPrescriptions(data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefillRequests = async () => {
    try {
      const { data: prescriptionIds } = await supabase
        .from('prescriptions')
        .select('id')
        .eq('patient_id', user?.id);

      if (!prescriptionIds || prescriptionIds.length === 0) return;

      const ids = prescriptionIds.map(p => p.id);
      const { data, error } = await supabase
        .from('refill_requests')
        .select(`
          *,
          pharmacy:pharmacies(name, address)
        `)
        .in('prescription_id', ids)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRefillRequests(data || []);
    } catch (error) {
      console.error('Error fetching refill requests:', error);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.medications.some(med =>
      med.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || prescription.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-100 text-emerald-700';
      case 'expired': return 'bg-gray-100 text-gray-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-blue-100 text-blue-700';
      case 'fulfilled': return 'bg-emerald-100 text-emerald-700';
      case 'denied': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Pill className="w-12 h-12" />
              <h1 className="text-4xl font-bold">
                {language === 'en' ? 'My Prescriptions' : 'الوصفات الطبية'}
              </h1>
            </div>
            <p className="text-lg opacity-90 mb-8">
              {language === 'en'
                ? 'Manage your prescriptions and request refills'
                : 'إدارة الوصفات الطبية وطلب التجديد'}
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'prescriptions'
                    ? 'bg-white text-purple-700'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                {language === 'en' ? 'All Prescriptions' : 'جميع الوصفات'}
              </button>
              <button
                onClick={() => setActiveTab('refills')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'refills'
                    ? 'bg-white text-purple-700'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                }`}
              >
                {language === 'en' ? 'Refill Requests' : 'طلبات التجديد'}
              </button>
            </div>

            {activeTab === 'prescriptions' && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search medications...' : 'ابحث عن الأدوية...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-gray-900"
                  >
                    <option value="all">{language === 'en' ? 'All Status' : 'جميع الحالات'}</option>
                    <option value="active">{language === 'en' ? 'Active' : 'نشط'}</option>
                    <option value="expired">{language === 'en' ? 'Expired' : 'منتهي'}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'prescriptions' ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${filteredPrescriptions.length} ${filteredPrescriptions.length === 1 ? 'prescription' : 'prescriptions'} found`
                    : `تم العثور على ${filteredPrescriptions.length} وصفة طبية`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : filteredPrescriptions.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No prescriptions found' : 'لم يتم العثور على وصفات طبية'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Your prescriptions will appear here after your doctor appointments'
                      : 'ستظهر الوصفات الطبية هنا بعد مواعيد الطبيب'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPrescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Pill className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {prescription.medications.map(med => med.name).join(', ')}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              {prescription.doctor?.full_name || 'Unknown Doctor'} - {prescription.doctor?.specialization || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(prescription.status)}`}>
                          {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                        </span>
                      </div>

                      <div className="space-y-3 mb-4">
                        {prescription.medications.map((medication, idx) => (
                          <div key={idx} className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-gray-600">Medication</p>
                                <p className="font-semibold text-gray-900">{medication.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Dosage</p>
                                <p className="font-semibold text-gray-900">{medication.dosage}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Frequency</p>
                                <p className="font-semibold text-gray-900">{medication.frequency}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Duration</p>
                                <p className="font-semibold text-gray-900">{medication.duration}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Prescribed on {new Date(prescription.created_at).toLocaleDateString()}</span>
                        {prescription.valid_until && (
                          <>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4" />
                            <span>Valid until {new Date(prescription.valid_until).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {language === 'en' ? 'Request Refill' : 'طلب تجديد'}
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          {language === 'en' ? 'Download' : 'تنزيل'}
                        </button>
                        <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-700 transition-colors flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
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
                  {language === 'en' ? 'Refill Requests' : 'طلبات التجديد'}
                </h2>
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${refillRequests.length} ${refillRequests.length === 1 ? 'request' : 'requests'}`
                    : `${refillRequests.length} طلب`}
                </p>
              </div>

              {refillRequests.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No refill requests' : 'لا توجد طلبات تجديد'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Your refill requests will appear here'
                      : 'ستظهر طلبات التجديد هنا'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {refillRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Refill Request
                          </h3>
                          <p className="text-sm text-gray-600">
                            Requested on {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                      {request.pharmacy && (
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Pharmacy
                          </p>
                          <p className="font-semibold text-gray-900">{request.pharmacy.name}</p>
                          <p className="text-sm text-gray-600">{request.pharmacy.address}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Quantity Requested</p>
                          <p className="font-semibold text-gray-900">{request.requested_quantity}</p>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-900">{request.notes}</p>
                        </div>
                      )}
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
