import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientLayout } from '../components/PatientLayout';
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle,
  Filter,
  Beaker,
  Calendar,
  FileText,
  Navigation
} from 'lucide-react';

interface LabFacility {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  rating: number;
  test_types: string[];
  accepts_insurance: boolean;
  hours: string;
  image_url: string | null;
  created_at: string;
}

export function FindLabsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [insuranceOnly, setInsuranceOnly] = useState(false);
  const [labFacilities, setLabFacilities] = useState<LabFacility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLabFacilities();
  }, []);

  const fetchLabFacilities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('lab_facilities')
        .select('*')
        .order('rating', { ascending: false });

      if (error) throw error;
      setLabFacilities(data || []);
    } catch (error) {
      console.error('Error fetching lab facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLabs = labFacilities.filter((lab) => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lab.test_types.some(test => test.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCity = selectedCity === 'all' || lab.city === selectedCity;
    const matchesInsurance = !insuranceOnly || lab.accepts_insurance;

    return matchesSearch && matchesCity && matchesInsurance;
  });

  const cities = ['all', ...Array.from(new Set(labFacilities.map(l => l.city)))];

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'en' ? 'Laboratory & Diagnostic Centers' : 'مراكز المختبرات والتشخيص'}
            </h1>
            <p className="text-lg opacity-90 mb-8">
              {language === 'en'
                ? 'Find accredited labs for blood tests, imaging, and diagnostics'
                : 'ابحث عن مختبرات معتمدة لفحوصات الدم والتصوير والتشخيص'}
            </p>

            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search by lab name, location, or test type...' : 'ابحث بالاسم أو الموقع أو نوع الفحص...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-gray-900"
                  />
                </div>
                <button
                  onClick={fetchLabFacilities}
                  className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  {language === 'en' ? 'Search' : 'بحث'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">
                    {language === 'en' ? 'Filters' : 'الفلاتر'}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'en' ? 'City' : 'المدينة'}
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      {cities.map(city => (
                        <option key={city} value={city}>
                          {city === 'all' ? 'All Cities' : city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={insuranceOnly}
                        onChange={(e) => setInsuranceOnly(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Accepts Insurance' : 'يقبل التأمين'}
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setInsuranceOnly(false);
                    }}
                    className="w-full mt-4 px-4 py-2 text-sm text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    {language === 'en' ? 'Clear Filters' : 'مسح الفلاتر'}
                  </button>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {language === 'en'
                    ? `${filteredLabs.length} ${filteredLabs.length === 1 ? 'lab' : 'labs'} found`
                    : `تم العثور على ${filteredLabs.length} مختبر`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredLabs.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Beaker className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No labs found' : 'لم يتم العثور على مختبرات'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Try adjusting your search or filters'
                      : 'حاول تعديل البحث أو الفلاتر'}
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredLabs.map((lab) => (
                    <div
                      key={lab.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                            {lab.name.substring(0, 2).toUpperCase()}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{lab.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm font-semibold text-gray-700">{lab.rating}</span>
                                </div>
                                {lab.accepts_insurance && (
                                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Insurance
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-600" />
                              <span>{lab.address}, {lab.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-blue-600" />
                              <span>{lab.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 text-blue-600" />
                              <span>{lab.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span>{lab.hours}</span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Beaker className="w-4 h-4" />
                              Available Tests:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {lab.test_types.slice(0, 6).map((test, idx) => (
                                <span key={idx} className="px-3 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                  {test}
                                </span>
                              ))}
                              {lab.test_types.length > 6 && (
                                <span className="px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                  +{lab.test_types.length - 6} more
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {language === 'en' ? 'Book Test' : 'احجز فحص'}
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              {language === 'en' ? 'View Tests' : 'عرض الفحوصات'}
                            </button>
                            <button className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                              <Navigation className="w-4 h-4" />
                              {language === 'en' ? 'Directions' : 'الاتجاهات'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
