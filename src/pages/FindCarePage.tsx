import { useState } from 'react';
import { Search, MapPin, Star, Calendar, Video, Clock, Filter, X, ChevronDown, Award, Languages, Shield, Phone, MessageCircle, Heart, Activity, ArrowLeft } from 'lucide-react';

interface FindCarePageProps {
  onNavigateToPlatform: () => void;
  onNavigateHome: () => void;
}

const SPECIALTIES = [
  'All Specialties', 'Cardiology', 'Dermatology', 'General Practice', 'Orthopedics',
  'Pediatrics', 'Gynecology', 'Neurology', 'Ophthalmology', 'Psychiatry', 'Dentistry'
];

const AREAS = [
  'All Areas', 'Downtown Dubai', 'Jumeirah', 'Healthcare City', 'Business Bay',
  'Marina', 'Deira', 'Bur Dubai', 'Al Barsha', 'Motor City'
];

const DOCTORS = [
  {
    id: 1,
    name: 'Dr. Layla Al Mansoori',
    specialty: 'Cardiologist',
    clinic: 'Dubai Heart Center',
    area: 'Healthcare City',
    rating: 4.9,
    reviews: 312,
    experience: 12,
    fee: 350,
    nextAvailable: 'Today',
    languages: ['Arabic', 'English'],
    teleconsult: true,
    verified: true,
    insurances: ['Daman', 'AXA', 'Thiqa'],
    education: 'MD Harvard, FACC',
    availability: '24/7 Emergency'
  },
  {
    id: 2,
    name: 'Dr. Rami Khalil',
    specialty: 'General Practitioner',
    clinic: 'HealthFirst Clinic',
    area: 'Jumeirah',
    rating: 4.7,
    reviews: 248,
    experience: 8,
    fee: 200,
    nextAvailable: 'Tomorrow',
    languages: ['Arabic', 'English', 'French'],
    teleconsult: true,
    verified: true,
    insurances: ['Daman', 'MetLife'],
    education: 'MBBS, MRCGP',
    availability: 'Mon-Sat 9AM-8PM'
  },
  {
    id: 3,
    name: 'Dr. Sara Nasser',
    specialty: 'Dermatologist',
    clinic: 'Skin & Care Dubai',
    area: 'Marina',
    rating: 4.8,
    reviews: 189,
    experience: 10,
    fee: 400,
    nextAvailable: 'Today',
    languages: ['Arabic', 'English'],
    teleconsult: false,
    verified: true,
    insurances: ['AXA', 'Thiqa'],
    education: 'MD, Board Certified',
    availability: 'Tue-Sat 10AM-6PM'
  },
  {
    id: 4,
    name: 'Dr. Ahmed Farhan',
    specialty: 'Orthopedist',
    clinic: 'City Medical Center',
    area: 'Downtown Dubai',
    rating: 4.6,
    reviews: 156,
    experience: 15,
    fee: 450,
    nextAvailable: 'In 3 days',
    languages: ['Arabic', 'English'],
    teleconsult: false,
    verified: true,
    insurances: ['Daman', 'AXA'],
    education: 'MD, FAAOS',
    availability: 'Mon-Thu 8AM-4PM'
  }
];

export default function FindCarePage({ onNavigateToPlatform, onNavigateHome }: FindCarePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  const filteredDoctors = DOCTORS.filter(doctor => {
    const matchesSearch = searchQuery === '' ||
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.clinic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All Specialties' ||
      doctor.specialty === selectedSpecialty;

    const matchesArea = selectedArea === 'All Areas' ||
      doctor.area === selectedArea;

    return matchesSearch && matchesSpecialty && matchesArea;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
                alt="CeenAiX Logo"
                className="h-14 w-auto"
              />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={onNavigateHome}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <a href="#" className="text-sm font-semibold text-teal-700 hover:text-teal-800 transition-colors">Find Care</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">For Patients</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">For Doctors</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">About</a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateToPlatform}
                className="px-5 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 rounded-lg transition-all"
              >
                Sign In
              </button>
              <button
                onClick={onNavigateToPlatform}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Find the Right Doctor
              <span className="block text-cyan-200">For Your Health Needs</span>
            </h1>
            <p className="text-xl text-cyan-100 mb-8">
              Search from thousands of verified healthcare professionals across the UAE
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Doctor name or specialty..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {SPECIALTIES.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {AREAS.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-teal-700">{filteredDoctors.length}</span> doctors available
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="lg:hidden">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Consultation Type</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">In-Clinic</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">Teleconsultation</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Availability</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">Available Today</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                        <span className="text-sm text-gray-700">Available This Week</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Rating</label>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5].map(rating => (
                        <label key={rating} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="text-sm text-gray-700">{rating}+</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Insurance</label>
                    <div className="space-y-2">
                      {['Daman', 'AXA', 'Thiqa', 'MetLife'].map(insurance => (
                        <label key={insurance} className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                          <span className="text-sm text-gray-700">{insurance}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctor Cards */}
          <div className={showFilters ? "lg:col-span-2" : "lg:col-span-3"}>
            <div className="space-y-6">
              {filteredDoctors.map(doctor => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                          {doctor.name.charAt(3)}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                              {doctor.verified && (
                                <Shield className="w-5 h-5 text-teal-600" />
                              )}
                            </div>
                            <p className="text-teal-700 font-semibold mb-1">{doctor.specialty}</p>
                            <p className="text-sm text-gray-600">{doctor.education}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 mb-1">
                              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                              <span className="font-bold text-gray-900">{doctor.rating}</span>
                              <span className="text-sm text-gray-500">({doctor.reviews})</span>
                            </div>
                            <p className="text-sm text-gray-600">{doctor.experience} years exp</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 text-teal-600" />
                            <span>{doctor.clinic}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-teal-600" />
                            <span>{doctor.availability}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Languages className="w-4 h-4 text-teal-600" />
                            <span>{doctor.languages.join(', ')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="w-4 h-4 text-teal-600" />
                            <span>{doctor.insurances.join(', ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap mb-4">
                          {doctor.teleconsult && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                              <Video className="w-3 h-3" />
                              Teleconsult
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            doctor.nextAvailable === 'Today'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            <Calendar className="w-3 h-3" />
                            {doctor.nextAvailable}
                          </span>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            AED {doctor.fee}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                            Book Appointment
                          </button>
                          <button className="px-6 py-3 border-2 border-teal-600 text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all">
                            View Profile
                          </button>
                          <button className="p-3 border-2 border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-all">
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png"
                alt="CeenAiX Logo"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
              <p className="text-sm text-gray-400">
                AI-powered healthcare platform connecting patients with the best medical professionals.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Patients</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Doctors</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book Appointment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Records</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prescriptions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">For Doctors</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Join CeenAiX</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Doctor Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 CeenAiX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
