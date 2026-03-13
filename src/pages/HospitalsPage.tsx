import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, Clock, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HOSPITALS = [
  {
    id: 1,
    name: 'Dubai Healthcare City',
    type: 'Multi-Specialty Hospital',
    image: 'DHC',
    rating: 4.8,
    reviews: 523,
    location: 'Dubai Healthcare City, Al Jaddaf',
    phone: '+971 4 362 4000',
    openHours: '24/7 Emergency',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics'],
    insurance: ['Daman', 'AXA Gulf', 'Oman Insurance', 'Nextcare'],
    verified: true,
    emergency: true,
  },
  {
    id: 2,
    name: 'Emirates Hospital',
    type: 'General Hospital',
    image: 'EH',
    rating: 4.7,
    reviews: 412,
    location: 'Jumeirah, Dubai',
    phone: '+971 4 349 6666',
    openHours: '24/7 Emergency',
    specialties: ['Pediatrics', 'Maternity', 'General Surgery', 'Dermatology'],
    insurance: ['AXA Gulf', 'Cigna', 'Daman'],
    verified: true,
    emergency: true,
  },
  {
    id: 3,
    name: 'Mediclinic City Hospital',
    type: 'Multi-Specialty Hospital',
    image: 'MCH',
    rating: 4.9,
    reviews: 687,
    location: 'Dubai Healthcare City',
    phone: '+971 4 435 9999',
    openHours: '24/7 Emergency',
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics'],
    insurance: ['Daman', 'AXA Gulf', 'AMAN', 'Cigna', 'Oman Insurance'],
    verified: true,
    emergency: true,
  },
  {
    id: 4,
    name: 'HealthFirst Clinic',
    type: 'Outpatient Clinic',
    image: 'HFC',
    rating: 4.6,
    reviews: 298,
    location: 'Dubai Marina',
    phone: '+971 4 399 9000',
    openHours: 'Mon-Sat: 8AM-10PM',
    specialties: ['General Medicine', 'Pediatrics', 'Dermatology'],
    insurance: ['Nextcare', 'Daman'],
    verified: true,
    emergency: false,
  },
  {
    id: 5,
    name: 'Dubai Heart Center',
    type: 'Specialty Hospital',
    image: 'DHC',
    rating: 4.9,
    reviews: 445,
    location: 'Dubai Healthcare City',
    phone: '+971 4 362 5800',
    openHours: 'Mon-Fri: 8AM-6PM',
    specialties: ['Cardiology', 'Cardiac Surgery', 'Vascular Surgery'],
    insurance: ['Daman', 'AXA Gulf', 'Cigna', 'AMAN'],
    verified: true,
    emergency: false,
  },
  {
    id: 6,
    name: 'City Medical Center',
    type: 'General Hospital',
    image: 'CMC',
    rating: 4.5,
    reviews: 334,
    location: 'Al Barsha, Dubai',
    phone: '+971 4 340 5000',
    openHours: '24/7 Emergency',
    specialties: ['Orthopedics', 'General Surgery', 'Internal Medicine', 'Radiology'],
    insurance: ['Daman', 'Nextcare', 'Oman Insurance'],
    verified: true,
    emergency: true,
  },
];

const HOSPITAL_TYPES = ['All Types', 'Multi-Specialty Hospital', 'General Hospital', 'Specialty Hospital', 'Outpatient Clinic'];

export function HospitalsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filteredHospitals = HOSPITALS.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hospital.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'All Types' || hospital.type === selectedType;
    const matchesEmergency = !emergencyOnly || hospital.emergency;

    return matchesSearch && matchesType && matchesEmergency;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Hospitals & Clinics in UAE' : 'المستشفيات والعيادات في الإمارات'}
          </h1>
          <p className="text-lg opacity-90 mb-8">
            {language === 'en'
              ? 'Find DHA-licensed healthcare facilities across Dubai & UAE'
              : 'ابحث عن المرافق الصحية المعتمدة من هيئة الصحة بدبي'}
          </p>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search by name, location, or specialty...' : 'ابحث بالاسم أو الموقع أو التخصص...'}
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'en' ? 'Hospital Type' : 'نوع المستشفى'}
                  </label>
                  <div className="space-y-2">
                    {HOSPITAL_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedType === type
                            ? 'bg-[#0D7377] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emergencyOnly}
                      onChange={(e) => setEmergencyOnly(e.target.checked)}
                      className="w-4 h-4 text-[#0D7377] border-gray-300 rounded focus:ring-[#0D7377]"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'en' ? '24/7 Emergency Services' : 'خدمات طوارئ 24/7'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                {language === 'en'
                  ? `${filteredHospitals.length} facilities found`
                  : `تم العثور على ${filteredHospitals.length} منشأة`}
              </p>
            </div>

            <div className="space-y-4">
              {filteredHospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                      {hospital.image}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{hospital.name}</h3>
                            {hospital.verified && (
                              <Award className="w-5 h-5 text-[#0D7377]" title="DHA Verified" />
                            )}
                          </div>
                          <p className="text-[#0D7377] font-semibold mb-2">{hospital.type}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{hospital.rating}</span>
                            <span>({hospital.reviews} reviews)</span>
                          </div>
                        </div>
                        {hospital.emergency && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                            24/7 Emergency
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{hospital.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{hospital.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{hospital.openHours}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Specialties:</p>
                        <div className="flex flex-wrap gap-2">
                          {hospital.specialties.map((specialty) => (
                            <span key={specialty} className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0D7377] bg-opacity-10 text-[#0D7377]">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Insurance Accepted:</p>
                        <div className="flex flex-wrap gap-2">
                          {hospital.insurance.map((ins) => (
                            <span key={ins} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                              {ins}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors">
                          {language === 'en' ? 'Book Appointment' : 'احجز موعد'}
                        </button>
                        <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
                          {language === 'en' ? 'View Details' : 'عرض التفاصيل'}
                        </button>
                      </div>
                    </div>
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
