import { useState, useEffect } from 'react';
import { Search, MapPin, Clock, Phone, Package, Filter, Star, Navigation } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import { PatientLayout } from '../components/PatientLayout';

interface Pharmacy {
  id: string;
  name: string;
  license_number: string;
  address: string;
  emirate: string;
  phone: string;
  email: string;
  opening_hours: string | null;
  home_delivery: boolean;
  open_24_hours: boolean;
  created_at: string;
}

export function PharmaciesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [open24Only, setOpen24Only] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [selectedEmirate, setSelectedEmirate] = useState('all');
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pharmacies')
        .select('*')
        .order('name');

      if (error) throw error;
      setPharmacies(data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPharmacies = pharmacies.filter((pharmacy) => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.emirate.toLowerCase().includes(searchQuery.toLowerCase());
    const matches24Hours = !open24Only || pharmacy.open_24_hours;
    const matchesDelivery = !deliveryOnly || pharmacy.home_delivery;
    const matchesEmirate = selectedEmirate === 'all' || pharmacy.emirate === selectedEmirate;

    return matchesSearch && matches24Hours && matchesDelivery && matchesEmirate;
  });

  const emirates = ['all', ...Array.from(new Set(pharmacies.map(p => p.emirate)))];

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {language === 'en' ? 'Pharmacies in UAE' : 'الصيدليات في الإمارات'}
            </h1>
            <p className="text-lg opacity-90 mb-8">
              {language === 'en'
                ? 'Find licensed pharmacies with home delivery services across UAE'
                : 'ابحث عن صيدليات مرخصة مع خدمة التوصيل المنزلي في الإمارات'}
            </p>

            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Search by pharmacy name or location...' : 'ابحث بالاسم أو الموقع...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 text-gray-900"
                  />
                </div>
                <button
                  onClick={fetchPharmacies}
                  className="px-8 py-3 bg-teal-700 text-white rounded-lg font-semibold hover:bg-teal-800 transition-colors"
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
                      {language === 'en' ? 'Emirate' : 'الإمارة'}
                    </label>
                    <select
                      value={selectedEmirate}
                      onChange={(e) => setSelectedEmirate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
                    >
                      {emirates.map(emirate => (
                        <option key={emirate} value={emirate}>
                          {emirate === 'all' ? 'All Emirates' : emirate}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={open24Only}
                        onChange={(e) => setOpen24Only(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Open 24 Hours' : 'مفتوح 24 ساعة'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deliveryOnly}
                        onChange={(e) => setDeliveryOnly(e.target.checked)}
                        className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">
                        {language === 'en' ? 'Home Delivery Available' : 'التوصيل المنزلي متاح'}
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setOpen24Only(false);
                      setDeliveryOnly(false);
                      setSelectedEmirate('all');
                    }}
                    className="w-full mt-4 px-4 py-2 text-sm text-teal-700 border border-teal-300 rounded-lg hover:bg-teal-50 transition-colors"
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
                    ? `${filteredPharmacies.length} ${filteredPharmacies.length === 1 ? 'pharmacy' : 'pharmacies'} found`
                    : `تم العثور على ${filteredPharmacies.length} صيدلية`}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : filteredPharmacies.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'No pharmacies found' : 'لم يتم العثور على صيدليات'}
                  </h3>
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Try adjusting your search or filters'
                      : 'حاول تعديل البحث أو الفلاتر'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPharmacies.map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-500 rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                          {pharmacy.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{pharmacy.name}</h3>
                          <p className="text-sm text-teal-700 font-semibold mb-2">{pharmacy.emirate}</p>
                          <div className="flex gap-2">
                            {pharmacy.open_24_hours && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                24 Hours
                              </span>
                            )}
                            {pharmacy.home_delivery && (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                Delivery
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-teal-600" />
                          <span>{pharmacy.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-teal-600" />
                          <span>{pharmacy.phone}</span>
                        </div>
                        {pharmacy.opening_hours && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span>{pharmacy.opening_hours}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-3">
                          License: {pharmacy.license_number}
                        </p>
                        <div className="flex gap-3">
                          {pharmacy.home_delivery && (
                            <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
                              <Package className="w-4 h-4" />
                              {language === 'en' ? 'Order Online' : 'اطلب عبر الإنترنت'}
                            </button>
                          )}
                          <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-teal-600 hover:text-teal-700 transition-colors flex items-center justify-center gap-2">
                            <Navigation className="w-4 h-4" />
                            {language === 'en' ? 'Directions' : 'الاتجاهات'}
                          </button>
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
