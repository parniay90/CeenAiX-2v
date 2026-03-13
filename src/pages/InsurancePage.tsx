import React, { useState } from 'react';
import { Search, Shield, CheckCircle, Phone, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const INSURANCE_PROVIDERS = [
  {
    id: 1,
    name: 'Daman',
    type: 'Comprehensive Health Insurance',
    image: 'DM',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Maternity', 'Dental', 'Emergency'],
    network: '500+ hospitals and clinics',
    phone: '800 326 26',
    email: 'customercare@damanhealth.ae',
    plans: ['Basic', 'Enhanced', 'Premier'],
    emirate: 'Abu Dhabi & Dubai',
  },
  {
    id: 2,
    name: 'AXA Gulf',
    type: 'Health & Life Insurance',
    image: 'AXA',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Maternity', 'Dental', 'Vision', 'Mental Health'],
    network: '400+ healthcare facilities',
    phone: '800 4845',
    email: 'contactus@axa-gulf.com',
    plans: ['Essential', 'Preferred', 'Premium'],
    emirate: 'All Emirates',
  },
  {
    id: 3,
    name: 'Nextcare',
    type: 'Medical Insurance',
    image: 'NC',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Maternity', 'Pharmacy', 'Lab Tests'],
    network: '300+ medical centers',
    phone: '800 639 82273',
    email: 'info@nextcare.com',
    plans: ['Silver', 'Gold', 'Platinum'],
    emirate: 'Dubai & Northern Emirates',
  },
  {
    id: 4,
    name: 'Oman Insurance',
    type: 'Health Insurance',
    image: 'OI',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Emergency', 'Dental', 'Maternity'],
    network: '250+ hospitals',
    phone: '800 4746',
    email: 'customerservice@omaninsurance.ae',
    plans: ['Basic', 'Classic', 'Deluxe'],
    emirate: 'All Emirates',
  },
  {
    id: 5,
    name: 'Cigna',
    type: 'International Health Insurance',
    image: 'CG',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Maternity', 'Dental', 'Vision', 'Wellness'],
    network: '600+ providers worldwide',
    phone: '800 744 26',
    email: 'customerservice@cigna.ae',
    plans: ['Silver', 'Gold', 'Platinum', 'Diamond'],
    emirate: 'All Emirates + International',
  },
  {
    id: 6,
    name: 'AMAN',
    type: 'Health Insurance',
    image: 'AM',
    coverage: ['Inpatient Care', 'Outpatient Care', 'Emergency', 'Pharmacy', 'Maternity'],
    network: '200+ healthcare facilities',
    phone: '800 2626',
    email: 'info@aman.ae',
    plans: ['Essential', 'Plus', 'Elite'],
    emirate: 'Dubai',
  },
];

export function InsurancePage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProviders = INSURANCE_PROVIDERS.filter((provider) => {
    return provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           provider.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
           provider.emirate.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Health Insurance Providers' : 'مزودو التأمين الصحي'}
          </h1>
          <p className="text-lg opacity-90 mb-8">
            {language === 'en'
              ? 'Compare health insurance plans and find the right coverage for you'
              : 'قارن خطط التأمين الصحي واعثر على التغطية المناسبة لك'}
          </p>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search insurance providers...' : 'ابحث عن مزودي التأمين...'}
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
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                {language === 'en' ? 'Health Insurance in UAE' : 'التأمين الصحي في الإمارات'}
              </h3>
              <p className="text-blue-800 text-sm">
                {language === 'en'
                  ? 'Health insurance is mandatory in Dubai and Abu Dhabi. Choose a plan that covers your healthcare needs and is accepted at your preferred hospitals and clinics.'
                  : 'التأمين الصحي إلزامي في دبي وأبوظبي. اختر خطة تغطي احتياجاتك الصحية ومقبولة في المستشفيات والعيادات المفضلة لديك.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            {language === 'en'
              ? `${filteredProviders.length} providers found`
              : `تم العثور على ${filteredProviders.length} مزود`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {provider.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                  <p className="text-sm text-[#0D7377] font-semibold mb-2">{provider.type}</p>
                  <p className="text-sm text-gray-600">{provider.emirate}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Coverage:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {provider.coverage.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Available Plans:</p>
                <div className="flex flex-wrap gap-2">
                  {provider.plans.map((plan) => (
                    <span key={plan} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0D7377] bg-opacity-10 text-[#0D7377]">
                      {plan}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 mb-1">Network Size:</p>
                <p className="text-sm text-gray-600">{provider.network}</p>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{provider.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{provider.email}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors">
                  {language === 'en' ? 'Get Quote' : 'احصل على عرض سعر'}
                </button>
                <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
                  {language === 'en' ? 'Learn More' : 'اعرف المزيد'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
