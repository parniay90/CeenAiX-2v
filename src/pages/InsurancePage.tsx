import { useState, useEffect } from 'react';
import { Search, Shield, CheckCircle, Phone, Mail, FileText, Users, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { PatientLayout } from '../components/PatientLayout';

interface InsuranceProvider {
  id: string;
  name: string;
  logo_url: string | null;
  contact_email: string;
  contact_phone: string;
  plan_types: string[];
  created_at: string;
}

interface InsuranceClaim {
  id: string;
  patient_id: string;
  provider_id: string;
  claim_number: string;
  service_date: string;
  claim_amount: number;
  status: string;
  submitted_date: string;
  processed_date: string | null;
  approved_amount: number | null;
  notes: string | null;
}

interface InsurancePageProps {
  tab?: 'claims' | 'pre-auth' | 'coverage';
}

export function InsurancePage({ tab }: InsurancePageProps = {}) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'providers' | 'claims' | 'pre-auth' | 'coverage'>(tab || 'claims');
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);

  useEffect(() => {
    fetchProviders();
    if (user) {
      fetchClaims();
    }
  }, [user]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .order('name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const { data, error } = await supabase
        .from('insurance_claims')
        .select('*')
        .eq('patient_id', user?.id)
        .order('submitted_date', { ascending: false });

      if (error) throw error;
      setClaims(data || []);
    } catch (error) {
      console.error('Error fetching claims:', error);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    return provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           provider.contact_email.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-12 h-12" />
              <h1 className="text-4xl font-bold">
                {language === 'en' ? 'Health Insurance' : 'التأمين الصحي'}
              </h1>
            </div>
            <p className="text-lg opacity-90 mb-8">
              {language === 'en'
                ? 'Manage your insurance providers and claims'
                : 'إدارة مزودي التأمين والمطالبات الخاصة بك'}
            </p>

            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setActiveTab('providers')}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  activeTab === 'providers'
                    ? 'bg-white text-teal-700'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                {language === 'en' ? 'Insurance Providers' : 'مزودو التأمين'}
              </button>
              {user && (
                <button
                  onClick={() => setActiveTab('claims')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeTab === 'claims'
                      ? 'bg-white text-teal-700'
                      : 'bg-teal-700 text-white hover:bg-teal-800'
                  }`}
                >
                  {language === 'en' ? 'My Claims' : 'مطالباتي'}
                </button>
              )}
            </div>

            {activeTab === 'providers' && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder={language === 'en' ? 'Search insurance providers...' : 'ابحث عن مزودي التأمين...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900"
                    />
                  </div>
                  <button
                    onClick={fetchProviders}
                    className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors"
                  >
                    {language === 'en' ? 'Search' : 'بحث'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {activeTab === 'providers' ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${filteredProviders.length} ${filteredProviders.length === 1 ? 'provider' : 'providers'} found`
                    : `تم العثور على ${filteredProviders.length} مزود`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : filteredProviders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No providers found' : 'لم يتم العثور على مزودين'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Try adjusting your search'
                      : 'حاول تعديل البحث'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {provider.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{provider.name}</h3>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-teal-600" />
                          <span>{provider.contact_phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-teal-600" />
                          <span className="truncate">{provider.contact_email}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Available Plans:</p>
                        <div className="flex flex-wrap gap-2">
                          {provider.plan_types.map((plan, idx) => (
                            <span key={idx} className="px-2 py-1 rounded-md text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
                              {plan}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4" />
                          {language === 'en' ? 'View Plans' : 'عرض الخطط'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'My Insurance Claims' : 'مطالبات التأمين الخاصة بي'}
                </h2>
                <button
                  onClick={() => setShowNewClaimModal(true)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  {language === 'en' ? 'New Claim' : 'مطالبة جديدة'}
                </button>
              </div>

              {claims.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No claims yet' : 'لا توجد مطالبات بعد'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {language === 'en'
                      ? 'Submit your first insurance claim'
                      : 'قدم أول مطالبة تأمين'}
                  </p>
                  <button
                    onClick={() => setShowNewClaimModal(true)}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                  >
                    {language === 'en' ? 'Submit Claim' : 'تقديم مطالبة'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {claims.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            Claim #{claim.claim_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(claim.submitted_date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Service Date</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(claim.service_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Claim Amount</p>
                          <p className="font-semibold text-gray-900">
                            AED {claim.claim_amount.toLocaleString()}
                          </p>
                        </div>
                        {claim.approved_amount && (
                          <div>
                            <p className="text-sm text-gray-600">Approved Amount</p>
                            <p className="font-semibold text-emerald-700">
                              AED {claim.approved_amount.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>

                      {claim.notes && (
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-sm text-gray-600 mb-1">Notes:</p>
                          <p className="text-sm text-gray-900">{claim.notes}</p>
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

export default InsurancePage;
