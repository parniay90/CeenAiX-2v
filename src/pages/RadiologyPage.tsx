import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientLayout } from '../components/PatientLayout';
import {
  Calendar,
  MapPin,
  Clock,
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Eye,
  Zap,
  Activity,
  Search,
  Filter,
  Star,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ImagingModality {
  id: string;
  name: string;
  category: string;
  description: string;
  preparation_instructions: string;
  duration: string;
  contrast_available: boolean;
  typical_cost_range: string;
}

interface RadiologyCenter {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  modalities_available: string[];
  accepts_insurance: boolean;
  emergency_services: boolean;
  hours: string;
}

interface RadiologyAppointment {
  id: string;
  appointment_date: string;
  status: string;
  body_part: string;
  with_contrast: boolean;
  urgency: string;
  patient_preparation_status: string;
  imaging_modalities: {
    name: string;
    category: string;
  };
  radiology_centers: {
    name: string;
    address: string;
    city: string;
  } | null;
}

interface RadiologyResult {
  id: string;
  result_date: string;
  findings: string;
  impression: string;
  radiologist_name: string;
  radiologist_notes: string;
  follow_up_recommended: boolean;
  follow_up_instructions: string;
  status: string;
}

export default function RadiologyPage() {
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  const [modalities, setModalities] = useState<ImagingModality[]>([]);
  const [centers, setCenters] = useState<RadiologyCenter[]>([]);
  const [appointments, setAppointments] = useState<RadiologyAppointment[]>([]);
  const [results, setResults] = useState<{ [key: string]: RadiologyResult }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'find-centers' | 'results'>('appointments');
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModality, setSelectedModality] = useState<string>('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<RadiologyCenter | null>(null);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [modalitiesRes, centersRes, appointmentsRes] = await Promise.all([
        supabase.from('imaging_modalities').select('*').order('category', { ascending: true }),
        supabase.from('radiology_centers').select('*').order('rating', { ascending: false }),
        supabase
          .from('radiology_appointments')
          .select(`
            *,
            imaging_modalities (name, category),
            radiology_centers (name, address, city)
          `)
          .eq('patient_id', user?.id)
          .order('appointment_date', { ascending: false })
      ]);

      if (modalitiesRes.error) throw modalitiesRes.error;
      if (centersRes.error) throw centersRes.error;
      if (appointmentsRes.error) throw appointmentsRes.error;

      setModalities(modalitiesRes.data || []);
      setCenters(centersRes.data || []);
      setAppointments(appointmentsRes.data || []);

      for (const appointment of appointmentsRes.data || []) {
        if (appointment.status === 'completed') {
          await fetchResult(appointment.id);
        }
      }
    } catch (error) {
      console.error('Error fetching radiology data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchResult = async (appointmentId: string) => {
    try {
      const { data, error } = await supabase
        .from('radiology_results')
        .select('*')
        .eq('appointment_id', appointmentId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setResults(prev => ({ ...prev, [appointmentId]: data }));
      }
    } catch (error) {
      console.error('Error fetching result:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getModalityIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mri':
        return '🧲';
      case 'ct':
        return '💿';
      case 'x-ray':
        return '🦴';
      case 'ultrasound':
        return '🔊';
      case 'pet':
        return '⚛️';
      case 'mammography':
        return '🎀';
      default:
        return '📊';
    }
  };

  const filteredCenters = centers.filter(center => {
    const matchesSearch = searchQuery === '' ||
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModality = selectedModality === '' ||
      center.modalities_available.includes(selectedModality);

    return matchesSearch && matchesModality;
  });

  return (
    <PatientLayout>
      <div className="min-h-screen" style={{ background: isDarkMode ? '#0F172A' : '#F8FAFC' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-8 h-8 text-blue-600" />
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Imaging & Radiology
              </h1>
            </div>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Schedule imaging appointments, view results, and find radiology centers
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
            {[
              { key: 'appointments', label: 'My Appointments' },
              { key: 'find-centers', label: 'Find Centers' },
              { key: 'results', label: 'Results & Reports' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div>
              {/* Imaging Modalities */}
              <div className="mb-8">
                <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Available Imaging Services
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {modalities.map(modality => (
                    <div
                      key={modality.id}
                      className="p-6 rounded-xl transition-all hover:shadow-lg cursor-pointer"
                      style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{getModalityIcon(modality.category)}</div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {modality.name}
                          </h3>
                          <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {modality.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              ⏱ {modality.duration}
                            </span>
                            {modality.contrast_available && (
                              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                Contrast Available
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments List */}
              <h2 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Appointments
              </h2>
              {appointments.length === 0 ? (
                <div className="text-center py-12 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No appointments yet
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Book an imaging appointment to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(appointment => {
                    const result = results[appointment.id];
                    const isExpanded = expandedResult === appointment.id;

                    return (
                      <div
                        key={appointment.id}
                        className="rounded-xl shadow-sm"
                        style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="text-4xl">{getModalityIcon(appointment.imaging_modalities.category)}</div>
                              <div className="flex-1">
                                <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {appointment.imaging_modalities.name}
                                </h3>
                                <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {appointment.body_part}
                                  {appointment.with_contrast && ' (with contrast)'}
                                </p>
                                <div className="flex flex-wrap gap-2 items-center">
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(appointment.status)}
                                    <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                  </div>
                                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {new Date(appointment.appointment_date).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            {result && (
                              <button
                                onClick={() => setExpandedResult(isExpanded ? null : appointment.id)}
                                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all bg-blue-600 text-white hover:bg-blue-700"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 inline mr-1" />
                                    Hide Report
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 inline mr-1" />
                                    View Report
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {appointment.radiology_centers && (
                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-blue-600" />
                                <div>
                                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {appointment.radiology_centers.name}
                                  </p>
                                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {appointment.radiology_centers.address}, {appointment.radiology_centers.city}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Expanded Result */}
                        {result && isExpanded && (
                          <div className="border-t px-6 py-6" style={{ borderColor: isDarkMode ? '#334155' : '#E2E8F0' }}>
                            <div className="space-y-6">
                              {/* Findings */}
                              {result.findings && (
                                <div>
                                  <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <FileText className="w-5 h-5" />
                                    Findings
                                  </h4>
                                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {result.findings}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Impression */}
                              {result.impression && (
                                <div>
                                  <h4 className={`font-bold text-lg mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <CheckCircle className="w-5 h-5" />
                                    Impression
                                  </h4>
                                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-green-50'}`}>
                                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                                      {result.impression}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Radiologist */}
                              {result.radiologist_name && (
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                  <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    Reviewed by:
                                  </p>
                                  <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {result.radiologist_name}
                                  </p>
                                  {result.radiologist_notes && (
                                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {result.radiologist_notes}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Follow-up */}
                              {result.follow_up_recommended && (
                                <div className={`p-4 rounded-lg border-l-4 border-yellow-500 ${isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                                    <div>
                                      <p className={`font-bold mb-1 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>
                                        Follow-up Recommended
                                      </p>
                                      <p className={isDarkMode ? 'text-yellow-200' : 'text-yellow-700'}>
                                        {result.follow_up_instructions}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Find Centers Tab */}
          {activeTab === 'find-centers' && (
            <div>
              {/* Search and Filter */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by center name or location..."
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-600 transition-all ${
                          isDarkMode
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                  <select
                    value={selectedModality}
                    onChange={(e) => setSelectedModality(e.target.value)}
                    className={`px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-blue-600 transition-all ${
                      isDarkMode
                        ? 'bg-gray-800 border-gray-700 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="">All Modalities</option>
                    {modalities.map(m => (
                      <option key={m.id} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Centers Grid */}
              {filteredCenters.length === 0 ? (
                <div className="text-center py-12 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
                  <Eye className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No centers found
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Try adjusting your search criteria
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCenters.map(center => (
                    <div
                      key={center.id}
                      className="rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-lg"
                      style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                    >
                      <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500"></div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(center.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {center.rating.toFixed(1)}
                          </span>
                        </div>

                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {center.name}
                        </h3>

                        <div className={`flex items-start gap-2 mb-3 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{center.address}, {center.city}</span>
                        </div>

                        <div className={`flex items-center gap-2 mb-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <Clock className="w-4 h-4" />
                          <span>{center.hours}</span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {center.accepts_insurance && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                              <CheckCircle className="w-3 h-3" />
                              Insurance
                            </span>
                          )}
                          {center.emergency_services && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                              <Zap className="w-3 h-3" />
                              Emergency
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => setSelectedCenter(center)}
                          className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Results Tab */}
          {activeTab === 'results' && (
            <div>
              {Object.keys(results).length === 0 ? (
                <div className="text-center py-12 rounded-xl" style={{ background: isDarkMode ? '#1E293B' : 'white' }}>
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    No results available
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    Your imaging results will appear here once ready
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments
                    .filter(a => results[a.id])
                    .map(appointment => {
                      const result = results[appointment.id];
                      return (
                        <div
                          key={appointment.id}
                          className="p-6 rounded-xl shadow-sm"
                          style={{ background: isDarkMode ? '#1E293B' : 'white' }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {appointment.imaging_modalities.name}
                              </h3>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {new Date(result.result_date).toLocaleDateString()}
                              </p>
                            </div>
                            <button className="px-4 py-2 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          </div>

                          {result.impression && (
                            <div className={`p-4 rounded-lg mb-3 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                              <p className={`font-semibold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Impression:
                              </p>
                              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {result.impression}
                              </p>
                            </div>
                          )}

                          {result.radiologist_name && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              Reviewed by: <span className="font-semibold">{result.radiologist_name}</span>
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PatientLayout>
  );
}
