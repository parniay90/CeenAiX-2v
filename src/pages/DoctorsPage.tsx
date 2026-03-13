import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, Award, Filter, Video, Calendar } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Ahmed Al Mansoori',
    specialty: 'Cardiologist',
    image: 'AM',
    rating: 4.9,
    reviews: 387,
    experience: '15+ years',
    location: 'Dubai Heart Center, Dubai Healthcare City',
    availability: 'Available Today',
    consultationFee: 'AED 500',
    languages: ['English', 'Arabic'],
    teleconsultation: true,
    verified: true,
  },
  {
    id: 2,
    name: 'Dr. Sarah Johnson',
    specialty: 'Pediatrician',
    image: 'SJ',
    rating: 4.8,
    reviews: 412,
    experience: '12+ years',
    location: 'Emirates Hospital, Jumeirah',
    availability: 'Available Tomorrow',
    consultationFee: 'AED 400',
    languages: ['English', 'French'],
    teleconsultation: true,
    verified: true,
  },
  {
    id: 3,
    name: 'Dr. Fatima Al Zaabi',
    specialty: 'Dermatologist',
    image: 'FZ',
    rating: 4.9,
    reviews: 298,
    experience: '10+ years',
    location: 'Skin & Care Dubai, Downtown',
    availability: 'Available Today',
    consultationFee: 'AED 450',
    languages: ['English', 'Arabic', 'Urdu'],
    teleconsultation: false,
    verified: true,
  },
  {
    id: 4,
    name: 'Dr. Michael Chen',
    specialty: 'Orthopedic Surgeon',
    image: 'MC',
    rating: 4.7,
    reviews: 231,
    experience: '18+ years',
    location: 'City Medical Center, Al Barsha',
    availability: 'Next Week',
    consultationFee: 'AED 600',
    languages: ['English', 'Chinese'],
    teleconsultation: false,
    verified: true,
  },
  {
    id: 5,
    name: 'Dr. Layla Hassan',
    specialty: 'General Practitioner',
    image: 'LH',
    rating: 4.8,
    reviews: 456,
    experience: '8+ years',
    location: 'HealthFirst Clinic, Marina',
    availability: 'Available Today',
    consultationFee: 'AED 300',
    languages: ['English', 'Arabic'],
    teleconsultation: true,
    verified: true,
  },
  {
    id: 6,
    name: 'Dr. Ravi Kumar',
    specialty: 'Neurologist',
    image: 'RK',
    rating: 4.9,
    reviews: 189,
    experience: '20+ years',
    location: 'Mediclinic City Hospital, Dubai Healthcare City',
    availability: 'Available Tomorrow',
    consultationFee: 'AED 550',
    languages: ['English', 'Hindi', 'Arabic'],
    teleconsultation: true,
    verified: true,
  },
];

const SPECIALTIES = [
  'All Specialties',
  'Cardiologist',
  'Pediatrician',
  'Dermatologist',
  'Orthopedic Surgeon',
  'General Practitioner',
  'Neurologist',
  'Gynecologist',
  'Dentist',
];

export function DoctorsPage() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [showFilters, setShowFilters] = useState(false);
  const [teleconsultationOnly, setTeleconsultationOnly] = useState(false);

  const filteredDoctors = DOCTORS.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All Specialties' || doctor.specialty === selectedSpecialty;
    const matchesTeleconsultation = !teleconsultationOnly || doctor.teleconsultation;

    return matchesSearch && matchesSpecialty && matchesTeleconsultation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Find Top Doctors in UAE' : 'ابحث عن أفضل الأطباء في الإمارات'}
          </h1>
          <p className="text-lg opacity-90 mb-8">
            {language === 'en'
              ? 'Book appointments with DHA-licensed doctors across Dubai & UAE'
              : 'احجز مواعيد مع أطباء معتمدين من هيئة الصحة بدبي'}
          </p>

          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search by doctor name, specialty, or location...' : 'ابحث بالاسم أو التخصص أو الموقع...'}
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">
                  {language === 'en' ? 'Filters' : 'الفلاتر'}
                </h3>
                <Filter className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {language === 'en' ? 'Specialty' : 'التخصص'}
                  </label>
                  <div className="space-y-2">
                    {SPECIALTIES.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedSpecialty === specialty
                            ? 'bg-[#0D7377] text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={teleconsultationOnly}
                      onChange={(e) => setTeleconsultationOnly(e.target.checked)}
                      className="w-4 h-4 text-[#0D7377] border-gray-300 rounded focus:ring-[#0D7377]"
                    />
                    <span className="text-sm text-gray-700">
                      {language === 'en' ? 'Teleconsultation Available' : 'استشارة عن بعد متاحة'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                {language === 'en'
                  ? `${filteredDoctors.length} doctors found`
                  : `تم العثور على ${filteredDoctors.length} طبيب`}
              </p>
            </div>

            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#0D7377] to-[#14BDBD] rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {doctor.image}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                            {doctor.verified && (
                              <Award className="w-5 h-5 text-[#0D7377]" title="Verified Doctor" />
                            )}
                          </div>
                          <p className="text-[#0D7377] font-semibold mb-2">{doctor.specialty}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="font-semibold">{doctor.rating}</span>
                            <span>({doctor.reviews} reviews)</span>
                            <span className="mx-2">•</span>
                            <Clock className="w-4 h-4" />
                            <span>{doctor.experience}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{doctor.consultationFee}</p>
                          <p className="text-sm text-gray-500">
                            {language === 'en' ? 'Consultation' : 'استشارة'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="w-4 h-4" />
                        <span>{doctor.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          doctor.availability === 'Available Today'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {doctor.availability}
                        </span>
                        {doctor.teleconsultation && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Teleconsultation
                          </span>
                        )}
                        {doctor.languages.map((lang) => (
                          <span key={lang} className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                            {lang}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-3">
                        <button className="px-6 py-2 bg-[#0D7377] text-white rounded-lg font-semibold hover:bg-[#0a5c5f] transition-colors flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {language === 'en' ? 'Book Appointment' : 'احجز موعد'}
                        </button>
                        <button className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-[#0D7377] hover:text-[#0D7377] transition-colors">
                          {language === 'en' ? 'View Profile' : 'عرض الملف الشخصي'}
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
