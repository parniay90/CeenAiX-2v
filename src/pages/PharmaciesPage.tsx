import React, { useState } from 'react';
import { Search, MapPin, Clock, Phone, Package } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PHARMACIES = [
  {
    id: 1,
    name: 'Life Pharmacy',
    branch: 'Dubai Mall',
    image: 'LP',
    location: 'The Dubai Mall, Downtown Dubai',
    phone: '+971 4 339 8989',
    openHours: '10:00 AM - 12:00 AM',
    services: ['Prescription Filling', 'Home Delivery', 'Health Screening', 'Consultation'],
    delivery: true,
    open24Hours: false,
  },
  {
    id: 2,
    name: 'Aster Pharmacy',
    branch: 'Marina Walk',
    image: 'AP',
    location: 'Marina Walk, Dubai Marina',
    phone: '+971 4 399 9900',
    openHours: '24 Hours',
    services: ['Prescription Filling', 'Home Delivery', 'OTC Medications', 'Baby Care'],
    delivery: true,
    open24Hours: true,
  },
  {
    id: 3,
    name: 'Boots Pharmacy',
    branch: 'Mall of the Emirates',
    image: 'BP',
    location: 'Mall of the Emirates, Al Barsha',
    phone: '+971 4 341 0000',
    openHours: '10:00 AM - 11:00 PM',
    services: ['Prescription Filling', 'Beauty Products', 'Health Screening', 'Consultation'],
    delivery: true,
    open24Hours: false,
  },
  {
    id: 4,
    name: 'Al Nahdi Pharmacy',
    branch: 'Jumeirah',
    image: 'AN',
    location: 'Jumeirah Beach Road, Jumeirah',
    phone: '+971 4 344 5566',
    openHours: '8:00 AM - 12:00 AM',
    services: ['Prescription Filling', 'Home Delivery', 'Health Screening', 'Medical Equipment'],
    delivery: true,
    open24Hours: false,
  },
  {
    id: 5,
    name: 'Day to Day Pharmacy',
    branch: 'Business Bay',
    image: 'DD',
    location: 'Business Bay, Sheikh Zayed Road',
    phone: '+971 4 450 9900',
    openHours: '24 Hours',
    services: ['Prescription Filling', 'Home Delivery', 'OTC Medications', 'Emergency Service'],
    delivery: true,
    open24Hours: true,
  },
  {
    id: 6,
    name: 'Medeor Pharmacy',
    branch: 'Dubai Healthcare City',
    image: 'MP',
    location: 'Dubai Healthcare City',
    phone: '+971 4 362 4000',
    openHours: '8:00 AM - 10:00 PM',
    services: ['Prescription Filling', 'Specialized Medications', 'Consultation', 'Health Screening'],
    delivery: true,
    open24Hours: false,
  },
];

export function PharmaciesPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [open24Only, setOpen24Only] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);

  const filteredPharmacies = PHARMACIES.filter((pharmacy) => {
    const matchesSearch = pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pharmacy.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matches24Hours = !open24Only || pharmacy.open24Hours;
    const matchesDelivery = !deliveryOnly || pharmacy.delivery;

    return matchesSearch && matches24Hours && matchesDelivery;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Pharmacies in UAE' : 'الصيدليات في الإمارات'}
          </h1>
          <p className="text-lg opacity-90 mb-8">
            {language === 'en'
              ? 'Find licensed pharmacies with home delivery services across Dubai'
              : 'ابحث عن صيدليات مرخصة مع خدمة التوصيل المنزلي في دبي'}
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
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7377] text-gray-900"
                />
              </div>
              <button className="px-8 py-3 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors">
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
              <h3 className="font-semibold text-gray-900 mb-6">
                {language === 'en' ? 'Filters' : 'الفلاتر'}
              </h3>

              <div className="space-y-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={open24Only}
                    onChange={(e) => setOpen24Only(e.target.checked)}
                    className="w-4 h-4 text-[#0D7377] border-gray-300 rounded focus:ring-[#0D7377]"
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
                    className="w-4 h-4 text-[#0D7377] border-gray-300 rounded focus:ring-[#0D7377]"
                  />
                  <span className="text-sm text-gray-700">
                    {language === 'en' ? 'Home Delivery Available' : 'التوصيل المنزلي متاح'}
                  </span>
                </label>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {language === 'en'
                  ? `${filteredPharmacies.length} pharmacies found`
                  : `تم العثور على ${filteredPharmacies.length} صيدلية`}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-lg flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {pharmacy.image}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{pharmacy.name}</h3>
                      <p className="text-sm text-[#0D7377] font-semibold mb-2">{pharmacy.branch}</p>
                      {pharmacy.open24Hours && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                          24 Hours
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{pharmacy.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{pharmacy.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{pharmacy.openHours}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.services.map((service) => (
                        <span key={service} className="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {pharmacy.delivery && (
                      <button className="flex-1 px-4 py-2 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors flex items-center justify-center gap-2">
                        <Package className="w-4 h-4" />
                        {language === 'en' ? 'Order Online' : 'اطلب عبر الإنترنت'}
                      </button>
                    )}
                    <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
                      {language === 'en' ? 'Get Directions' : 'الحصول على الاتجاهات'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
