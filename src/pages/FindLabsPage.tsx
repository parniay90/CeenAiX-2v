import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  Activity,
  Heart,
  Brain,
  Eye,
  Stethoscope
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
  image_url: string;
}

interface TestType {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation_instructions: string;
  typical_turnaround: string;
}

const categoryIcons: { [key: string]: any } = {
  blood: Activity,
  imaging: Eye,
  cardiology: Heart,
  neurology: Brain,
  diagnostic: Stethoscope,
  other: Beaker
};

export default function FindLabsPage() {
  const { userId } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [labs, setLabs] = useState<LabFacility[]>([]);
  const [testTypes, setTestTypes] = useState<TestType[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<LabFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTestType, setSelectedTestType] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLab, setSelectedLab] = useState<LabFacility | null>(null);
  const [bookingTest, setBookingTest] = useState<TestType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterLabs();
  }, [searchQuery, selectedCategory, selectedTestType, labs]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [labsResult, testTypesResult] = await Promise.all([
        supabase.from('lab_facilities').select('*').order('rating', { ascending: false }),
        supabase.from('test_types').select('*').order('category', { ascending: true })
      ]);

      if (labsResult.error) throw labsResult.error;
      if (testTypesResult.error) throw testTypesResult.error;

      setLabs(labsResult.data || []);
      setTestTypes(testTypesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLabs = () => {
    let filtered = [...labs];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        lab =>
          lab.name.toLowerCase().includes(query) ||
          lab.city.toLowerCase().includes(query) ||
          lab.state.toLowerCase().includes(query)
      );
    }

    if (selectedTestType) {
      filtered = filtered.filter(lab => lab.test_types.includes(selectedTestType));
    }

    if (selectedCategory && selectedCategory !== 'all') {
      const categoryTests = testTypes
        .filter(t => t.category === selectedCategory)
        .map(t => t.name);
      filtered = filtered.filter(lab =>
        lab.test_types.some(testType => categoryTests.includes(testType))
      );
    }

    setFilteredLabs(filtered);
  };

  const categories = [
    { key: 'all', label: 'All Categories', icon: Beaker },
    { key: 'blood', label: 'Blood Tests', icon: Activity },
    { key: 'imaging', label: 'Imaging', icon: Eye },
    { key: 'cardiology', label: 'Cardiology', icon: Heart },
    { key: 'neurology', label: 'Neurology', icon: Brain },
    { key: 'diagnostic', label: 'Diagnostic', icon: Stethoscope }
  ];

  const bookTest = async (lab: LabFacility, test: TestType) => {
    try {
      const { error } = await supabase.from('lab_test_orders').insert({
        patient_id: user?.id,
        test_type_id: test.id,
        lab_facility_id: lab.id,
        status: 'ordered',
        priority: 'routine'
      });

      if (error) throw error;

      alert(`Test ordered successfully at ${lab.name}! You can track it in the Lab Tests page.`);
      setSelectedLab(null);
      setBookingTest(null);
      window.location.href = '/lab-tests';
    } catch (error) {
      console.error('Error booking test:', error);
      alert('Failed to book test. Please try again.');
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen" style={{ background: isDarkMode ? '#0F172A' : '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Beaker className="w-8 h-8 text-teal-600" />
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Find Lab Facilities
              </h1>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Search for labs and book tests by category
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by lab name or location..."
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-teal-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                  showFilters
                    ? 'bg-teal-600 text-white'
                    : isDarkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-all ${
                      selectedCategory === cat.key
                        ? 'bg-teal-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Test Type Filter */}
            {showFilters && (
              <div className="p-6 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
                <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Filter by Test Type
                </h3>
                <div className="grid md:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedTestType('')}
                    className={`px-4 py-2 rounded-lg text-left text-sm transition-all ${
                      selectedTestType === ''
                        ? 'bg-teal-600 text-white'
                        : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    All Tests
                  </button>
                  {testTypes.map(test => (
                    <button
                      key={test.id}
                      onClick={() => setSelectedTestType(test.name)}
                      className={`px-4 py-2 rounded-lg text-left text-sm transition-all ${
                        selectedTestType === test.name
                          ? 'bg-teal-600 text-white'
                          : isDarkMode
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-semibold">{test.name}</div>
                      <div className="text-xs opacity-75">{test.category}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
              <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading labs...</p>
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="text-center py-12 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
              <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                No labs found
              </h3>
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map(lab => (
                <div
                  key={lab.id}
                  className="rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg"
                  style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                >
                  {/* Lab Image */}
                  {lab.image_url && (
                    <div className="h-48 bg-gradient-to-br from-teal-400 to-blue-500"></div>
                  )}

                  <div className="p-6">
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(lab.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {lab.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Lab Name */}
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {lab.name}
                    </h3>

                    {/* Location */}
                    <div className={`flex items-start gap-2 mb-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{lab.address}, {lab.city}, {lab.state}</span>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4">
                      {lab.phone && (
                        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Phone className="w-4 h-4" />
                          <span>{lab.phone}</span>
                        </div>
                      )}
                      {lab.hours && (
                        <div className={`flex items-center gap-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4" />
                          <span>{lab.hours}</span>
                        </div>
                      )}
                    </div>

                    {/* Insurance Badge */}
                    {lab.accepts_insurance && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          <CheckCircle className="w-3 h-3" />
                          Accepts Insurance
                        </span>
                      </div>
                    )}

                    {/* Test Types */}
                    <div className="mb-4">
                      <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Available Tests:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {lab.test_types.slice(0, 3).map((type, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded text-xs ${
                              isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {type}
                          </span>
                        ))}
                        {lab.test_types.length > 3 && (
                          <span className={`px-2 py-1 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            +{lab.test_types.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => setSelectedLab(lab)}
                      className="w-full py-3 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all"
                    >
                      Book Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Modal */}
        {selectedLab && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className="max-w-2xl w-full rounded-xl shadow-xl max-h-[90vh] overflow-y-auto"
              style={{ background: isDarkMode ? '#1E293B' : 'white' }}
            >
              <div className="p-6 border-b" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Book Test at {selectedLab.name}
                </h2>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Select a test to book
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {testTypes
                    .filter(test => selectedLab.test_types.includes(test.name))
                    .map(test => {
                      const Icon = categoryIcons[test.category] || Beaker;
                      return (
                        <div
                          key={test.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isDarkMode
                              ? 'bg-gray-800 border-gray-700 hover:border-teal-600'
                              : 'bg-gray-50 border-gray-200 hover:border-teal-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-5 h-5 text-teal-600" />
                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {test.name}
                                </h3>
                              </div>
                              <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {test.description}
                              </p>
                              {test.preparation_instructions && (
                                <p className={`text-xs mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  <strong>Preparation:</strong> {test.preparation_instructions}
                                </p>
                              )}
                              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <strong>Turnaround:</strong> {test.typical_turnaround}
                              </p>
                            </div>
                            <button
                              onClick={() => bookTest(selectedLab, test)}
                              className="px-4 py-2 rounded-lg font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-all whitespace-nowrap"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="p-6 border-t" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
                <button
                  onClick={() => setSelectedLab(null)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
