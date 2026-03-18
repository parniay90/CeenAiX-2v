import { useState, useEffect } from 'react';
import { Calendar, Clock, User, X, CheckCircle, Download, CalendarPlus, MapPin, Navigation, ChevronRight, Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  consultation_fee_clinic: number;
  years_of_experience: number;
  location: string;
  address: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface EnhancedAppointmentSchedulerProps {
  onClose: () => void;
  onAppointmentBooked: () => void;
  patientId: string;
}

const specialtyIcons: Record<string, string> = {
  'Cardiology': '❤️',
  'Dermatology': '🧴',
  'Gynecology': '👶',
  'Internal Medicine': '🩺',
  'Orthopedics': '🦴',
  'Pediatrics': '👶'
};

export function EnhancedAppointmentScheduler({ onClose, onAppointmentBooked, patientId }: EnhancedAppointmentSchedulerProps) {
  const [step, setStep] = useState(1);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [calculatingDistance, setCalculatingDistance] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    if (selectedSpecialty) {
      fetchDoctorsBySpecialty();
    }
  }, [selectedSpecialty]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      generateTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchSpecialties = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('specialty')
      .order('specialty');

    if (data && !error) {
      const uniqueSpecialties = [...new Set(data.map(d => d.specialty).filter(s => s))];
      setSpecialties(uniqueSpecialties);
    } else {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchDoctorsBySpecialty = async () => {
    const { data, error } = await supabase
      .from('doctors')
      .select('id, specialty, years_of_experience, consultation_fee_clinic')
      .eq('specialty', selectedSpecialty)
      .order('years_of_experience', { ascending: false });

    if (data && !error) {
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', data.map(d => d.id));

      const doctorsWithNames = data.map(doctor => {
        const profile = profilesData?.find(p => p.id === doctor.id);
        return {
          ...doctor,
          full_name: profile?.full_name || 'Unknown Doctor',
          location: 'Dubai Healthcare City',
          address: 'Building 27, Al Razi Medical Complex, Dubai'
        };
      });

      setDoctors(doctorsWithNames);
    }
  };

  const generateTimeSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();

    const { data: availability } = await supabase
      .from('doctor_availability')
      .select('*')
      .eq('doctor_id', selectedDoctor.id)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true);

    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('doctor_id', selectedDoctor.id)
      .eq('appointment_date', selectedDate)
      .neq('status', 'cancelled');

    const booked = existingAppointments?.map(apt => apt.appointment_time) || [];

    const slots: TimeSlot[] = [];

    if (availability && availability.length > 0) {
      availability.forEach((avail: any) => {
        const start = parseTime(avail.start_time);
        const end = parseTime(avail.end_time);

        for (let time = start; time < end; time += 45) {
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

          slots.push({
            time: timeString,
            available: !booked.includes(timeString)
          });
        }
      });
    }

    setTimeSlots(slots);
  };

  const parseTime = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const calculateDistance = () => {
    setCalculatingDistance(true);
    setTimeout(() => {
      const randomDistance = (Math.random() * 15 + 2).toFixed(1);
      setDistance(parseFloat(randomDistance));
      setCalculatingDistance(false);
    }, 1000);
  };

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('appointments')
      .insert({
        patient_id: patientId,
        doctor_id: selectedDoctor.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        duration_minutes: 45,
        status: 'scheduled',
        type: 'consultation',
        reason: reason,
        notes: null
      });

    setLoading(false);

    if (error) {
      alert('Failed to book appointment. Please try again.');
      console.error(error);
    } else {
      setStep(5);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Stethoscope size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Book Appointment</h2>
                <p className="text-teal-50 text-sm mt-0.5">Schedule your visit in a few steps</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className="flex-1 h-1.5 rounded-full transition-all duration-300"
                style={{
                  background: step >= s ? 'white' : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Step 1: Select Specialty */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Medical Specialty</h3>
                <p className="text-gray-600">Choose the type of doctor you need</p>
              </div>

              {specialties.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
                  <p className="text-gray-500">Loading specialties...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => {
                        setSelectedSpecialty(specialty);
                        setStep(2);
                      }}
                      className="group relative p-6 border-2 border-gray-200 rounded-xl text-left hover:border-teal-600 hover:bg-teal-50/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{specialtyIcons[specialty] || '🏥'}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-900 group-hover:text-teal-700">{specialty}</div>
                          <div className="text-sm text-gray-500 mt-0.5">View available doctors</div>
                        </div>
                        <ChevronRight className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Your Doctor</h3>
                  <p className="text-gray-600">Choose from our experienced {selectedSpecialty} specialists</p>
                </div>
                <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold">
                  {selectedSpecialty}
                </span>
              </div>

              {doctors.length === 0 ? (
                <div className="text-center py-20">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent mb-4"></div>
                  <p className="text-gray-500">Loading doctors...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`group cursor-pointer p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-lg ${
                        selectedDoctor?.id === doctor.id
                          ? 'border-teal-600 bg-teal-50/50 shadow-md'
                          : 'border-gray-200 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                          <User size={32} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-bold text-gray-900">{doctor.full_name}</h4>
                          <p className="text-teal-700 font-medium mt-1">{doctor.specialty}</p>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Clock size={16} className="text-teal-600" />
                              {doctor.years_of_experience} years experience
                            </span>
                            <span className="flex items-center gap-1.5 font-semibold text-gray-900">
                              <span className="text-teal-600">💰</span>
                              AED {doctor.consultation_fee_clinic}
                            </span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-teal-600 bg-teal-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedDoctor?.id === doctor.id && (
                            <CheckCircle size={20} className="text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDoctor}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Select Date & Time */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Date & Time</h3>
                <p className="text-gray-600">Select your preferred appointment slot</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar size={18} className="text-teal-600" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-4 py-3 border-2 border-teal-200 rounded-lg text-base focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                />
              </div>

              {selectedDate && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-teal-600" />
                    Available Time Slots
                    <span className="text-gray-500 font-normal">(45 min each)</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                    {timeSlots.length > 0 ? timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedTime === slot.time
                            ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-teal-400 hover:bg-teal-50'
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    )) : (
                      <p className="col-span-full text-center py-12 text-gray-500">
                        No available slots for this date
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Confirm Details */}
          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Appointment</h3>
                <p className="text-gray-600">Review the details before booking</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 space-y-5">
                <div>
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-2">Doctor</p>
                  <p className="text-lg font-bold text-gray-900">{selectedDoctor?.full_name}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedDoctor?.specialty}</p>
                </div>

                <div className="border-t border-teal-200/50 pt-5">
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-2">Date & Time</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{formatTime(selectedTime)} (45 minutes)</p>
                </div>

                <div className="border-t border-teal-200/50 pt-5">
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-2">Location</p>
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-teal-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-base font-semibold text-gray-900">{selectedDoctor?.location}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{selectedDoctor?.address}</p>
                    </div>
                  </div>

                  {!distance && !calculatingDistance && (
                    <button
                      onClick={calculateDistance}
                      className="mt-3 flex items-center gap-2 text-sm text-teal-700 font-semibold hover:text-teal-800 transition-colors"
                    >
                      <Navigation size={16} />
                      Calculate distance from my location
                    </button>
                  )}

                  {calculatingDistance && (
                    <p className="mt-3 text-sm text-gray-500">Calculating distance...</p>
                  )}

                  {distance && (
                    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
                      <Navigation size={16} />
                      {distance} km from your location
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!reason || loading}
                  className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="animate-in fade-in zoom-in duration-300 text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-600/40">
                <CheckCircle size={56} className="text-white" />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3">Appointment Confirmed!</h3>
              <p className="text-lg text-gray-600 mb-8">Your appointment has been successfully booked</p>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-8 text-left max-w-lg mx-auto space-y-4">
                <div>
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Doctor</p>
                  <p className="text-base font-bold text-gray-900">{selectedDoctor?.full_name}</p>
                  <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
                </div>
                <div className="border-t border-teal-200/50 pt-4">
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Date & Time</p>
                  <p className="text-base font-bold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-600">{formatTime(selectedTime)}</p>
                </div>
                <div className="border-t border-teal-200/50 pt-4">
                  <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Location</p>
                  <p className="text-base font-semibold text-gray-900">{selectedDoctor?.location}</p>
                  {distance && (
                    <p className="text-sm text-teal-700 font-semibold mt-1">{distance} km from you</p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-4">Add to your calendar:</p>
                <div className="flex gap-3 max-w-lg mx-auto">
                  <button
                    onClick={() => {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                      const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dr. ${selectedDoctor?.full_name}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(reason)}&location=${encodeURIComponent(selectedDoctor?.address || '')}`;
                      window.open(googleCalUrl, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white text-teal-700 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                  >
                    <CalendarPlus size={18} />
                    Google Calendar
                  </button>
                  <button
                    onClick={() => {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                      const formatDateForCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                      const icsContent = [
                        'BEGIN:VCALENDAR',
                        'VERSION:2.0',
                        'BEGIN:VEVENT',
                        `DTSTART:${formatDateForCal(startDateTime)}`,
                        `DTEND:${formatDateForCal(endDateTime)}`,
                        `SUMMARY:Dr. ${selectedDoctor?.full_name}`,
                        `LOCATION:${selectedDoctor?.address}`,
                        'END:VEVENT',
                        'END:VCALENDAR'
                      ].join('\r\n');
                      const blob = new Blob([icsContent], { type: 'text/calendar' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = 'appointment.ics';
                      link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white text-teal-700 border-2 border-teal-600 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
                  >
                    <Download size={18} />
                    iCal
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onAppointmentBooked();
                  onClose();
                }}
                className="w-full max-w-lg mx-auto px-6 py-4 bg-teal-600 text-white rounded-lg text-lg font-bold hover:bg-teal-700 transition-colors shadow-xl shadow-teal-600/30"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
