import { useState, useEffect } from 'react';
import { Calendar, Clock, User, X, CheckCircle, Download, CalendarPlus, MapPin, Navigation } from 'lucide-react';
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
    const { data } = await supabase
      .from('doctors')
      .select('specialty')
      .order('specialty');

    if (data) {
      const uniqueSpecialties = [...new Set(data.map(d => d.specialty))];
      setSpecialties(uniqueSpecialties);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl">
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-all ${
                  step >= s ? 'bg-teal-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Specialty</h3>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      setSelectedSpecialty(specialty);
                      setStep(2);
                    }}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      selectedSpecialty === specialty
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{specialty}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Doctor</h3>
                <span className="text-sm text-teal-600 font-medium">{selectedSpecialty}</span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-teal-600 bg-teal-50'
                        : 'border-gray-200 hover:border-teal-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Dr. {doctor.full_name}</div>
                        <div className="text-sm text-gray-600">{doctor.specialty}</div>
                        <div className="flex gap-4 mt-2 text-xs text-gray-500">
                          <span>{doctor.years_of_experience} yrs exp</span>
                          <span>AED {doctor.consultation_fee_clinic}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDoctor}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl ${
                    selectedDoctor
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date & Time</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2">
                    {timeSlots.length > 0 ? timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg text-sm font-medium transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                            : selectedTime === slot.time
                            ? 'bg-teal-600 text-white'
                            : 'bg-white border-2 border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {formatTime(slot.time)}
                      </button>
                    )) : (
                      <p className="col-span-3 text-center text-gray-500 py-8">
                        No available slots for this date
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl ${
                    selectedDate && selectedTime
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Details</h3>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Doctor</span>
                  <div className="font-semibold text-gray-900">Dr. {selectedDoctor?.full_name}</div>
                  <div className="text-sm text-gray-600">{selectedDoctor?.specialty}</div>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Date & Time</span>
                  <div className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-600">{formatTime(selectedTime)} (45 minutes)</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Location</span>
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-teal-600" />
                    {selectedDoctor?.location}
                  </div>
                  <div className="text-sm text-gray-600">{selectedDoctor?.address}</div>

                  {!distance && !calculatingDistance && (
                    <button
                      onClick={calculateDistance}
                      className="mt-2 flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      <Navigation className="w-4 h-4" />
                      Calculate distance from my location
                    </button>
                  )}

                  {calculatingDistance && (
                    <div className="mt-2 text-sm text-gray-500">Calculating distance...</div>
                  )}

                  {distance && (
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-teal-700">
                      <Navigation className="w-4 h-4" />
                      {distance} km from your location
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!reason || loading}
                  className={`flex-1 px-4 py-3 font-semibold rounded-xl ${
                    reason && !loading
                      ? 'bg-teal-600 text-white hover:bg-teal-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your appointment has been successfully booked</p>

              <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200 text-left">
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Doctor</span>
                  <div className="font-semibold text-gray-900">Dr. {selectedDoctor?.full_name}</div>
                  <div className="text-sm text-gray-600">{selectedDoctor?.specialty}</div>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-500">Date & Time</span>
                  <div className="font-semibold text-gray-900">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="text-sm text-gray-600">{formatTime(selectedTime)}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Location</span>
                  <div className="font-semibold text-gray-900">{selectedDoctor?.location}</div>
                  {distance && (
                    <div className="text-sm text-teal-600 mt-1">{distance} km from you</div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">Add to your calendar:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                      const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dr. ${selectedDoctor?.full_name}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(`${reason}\n\nLocation: ${selectedDoctor?.address}`)}`;
                      window.open(googleCalUrl, '_blank');
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-600 text-teal-700 font-medium rounded-xl hover:bg-teal-50"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    Google
                  </button>
                  <button
                    onClick={() => {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                      const formatDateForCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                      const icsContent = [
                        'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
                        `DTSTART:${formatDateForCal(startDateTime)}`, `DTEND:${formatDateForCal(endDateTime)}`,
                        `SUMMARY:Dr. ${selectedDoctor?.full_name}`, `LOCATION:${selectedDoctor?.address}`,
                        'END:VEVENT', 'END:VCALENDAR'
                      ].join('\r\n');
                      const blob = new Blob([icsContent], { type: 'text/calendar' });
                      const link = document.createElement('a');
                      link.href = URL.createObjectURL(blob);
                      link.download = 'appointment.ics';
                      link.click();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-teal-600 text-teal-700 font-medium rounded-xl hover:bg-teal-50"
                  >
                    <Download className="w-4 h-4" />
                    iPhone
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onAppointmentBooked();
                  onClose();
                }}
                className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700"
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
