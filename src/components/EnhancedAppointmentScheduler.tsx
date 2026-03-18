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
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        width: '100%',
        maxWidth: 800,
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 10
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Book Appointment
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8
            }}
          >
            <X size={24} color="#6B7280" />
          </button>
        </div>

        <div style={{ padding: 28 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: step >= s ? '#0D7377' : '#E5E7EB',
                  transition: 'background 0.3s'
                }}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', marginBottom: 16 }}>
                Select Specialty
              </h3>
              {specialties.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ color: '#9CA3AF' }}>Loading specialties...</div>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                  maxHeight: 400,
                  overflowY: 'auto'
                }}>
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => {
                        setSelectedSpecialty(specialty);
                        setStep(2);
                      }}
                      style={{
                        padding: 16,
                        border: selectedSpecialty === specialty ? '2px solid #0D7377' : '1px solid #E5E7EB',
                        borderRadius: 12,
                        background: selectedSpecialty === specialty ? '#F0FDFA' : 'white',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedSpecialty !== specialty) {
                          e.currentTarget.style.borderColor = '#0D7377';
                          e.currentTarget.style.background = '#F9FAFB';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedSpecialty !== specialty) {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                          e.currentTarget.style.background = 'white';
                        }
                      }}
                    >
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937' }}>{specialty}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', margin: 0 }}>
                  Select Doctor
                </h3>
                <span style={{ fontSize: 14, color: '#0D7377', fontWeight: 500 }}>{selectedSpecialty}</span>
              </div>
              {doctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <div style={{ color: '#9CA3AF' }}>Loading doctors...</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      onClick={() => setSelectedDoctor(doctor)}
                      style={{
                        padding: 16,
                        border: selectedDoctor?.id === doctor.id ? '2px solid #0D7377' : '1px solid #E5E7EB',
                        borderRadius: 12,
                        background: selectedDoctor?.id === doctor.id ? '#F0FDFA' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDoctor?.id !== doctor.id) {
                          e.currentTarget.style.borderColor = '#0D7377';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDoctor?.id !== doctor.id) {
                          e.currentTarget.style.borderColor = '#E5E7EB';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                        <div style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #0D7377, #14FFEC)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <User size={24} color="white" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>
                            {doctor.full_name}
                          </div>
                          <div style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>
                            {doctor.specialty}
                          </div>
                          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#6B7280', marginTop: 6 }}>
                            <span>{doctor.years_of_experience} yrs exp</span>
                            <span>AED {doctor.consultation_fee_clinic}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'white',
                    color: '#6B7280',
                    border: '2px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedDoctor}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: selectedDoctor ? '#0D7377' : '#D1D5DB',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: selectedDoctor ? 'pointer' : 'not-allowed'
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', marginBottom: 16 }}>
                Select Date & Time
              </h3>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                  <Calendar size={16} style={{ display: 'inline', marginRight: 8 }} />
                  Appointment Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={minDate}
                  max={maxDate}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14
                  }}
                />
              </div>

              {selectedDate && (
                <div>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                    <Clock size={16} style={{ display: 'inline', marginRight: 8 }} />
                    Available Time Slots (45 min each)
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 8,
                    maxHeight: 280,
                    overflowY: 'auto',
                    padding: 4
                  }}>
                    {timeSlots.length > 0 ? timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        style={{
                          padding: '10px 12px',
                          border: selectedTime === slot.time ? '2px solid #0D7377' : '1px solid #E5E7EB',
                          borderRadius: 8,
                          background: !slot.available ? '#F3F4F6' : selectedTime === slot.time ? '#F0FDFA' : 'white',
                          color: !slot.available ? '#9CA3AF' : '#1F2937',
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: slot.available ? 'pointer' : 'not-allowed',
                          textDecoration: !slot.available ? 'line-through' : 'none'
                        }}
                      >
                        {formatTime(slot.time)}
                      </button>
                    )) : (
                      <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#6B7280', padding: 20 }}>
                        No available slots for this date
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'white',
                    color: '#6B7280',
                    border: '2px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedDate || !selectedTime}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: (selectedDate && selectedTime) ? '#0D7377' : '#D1D5DB',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: (selectedDate && selectedTime) ? 'pointer' : 'not-allowed'
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937', marginBottom: 16 }}>
                Confirm Details
              </h3>

              <div style={{
                padding: 16,
                background: '#F9FAFB',
                borderRadius: 12,
                marginBottom: 20,
                border: '1px solid #E5E7EB'
              }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Doctor</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>
                    {selectedDoctor?.full_name}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {selectedDoctor?.specialty}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Date & Time</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {formatTime(selectedTime)} (45 minutes)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Location</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={16} color="#0D7377" />
                    {selectedDoctor?.location}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {selectedDoctor?.address}
                  </div>

                  {!distance && !calculatingDistance && (
                    <button
                      onClick={calculateDistance}
                      style={{
                        marginTop: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 13,
                        color: '#0D7377',
                        fontWeight: 500,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <Navigation size={14} />
                      Calculate distance from my location
                    </button>
                  )}

                  {calculatingDistance && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#6B7280' }}>Calculating...</div>
                  )}

                  {distance && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#0D7377' }}>
                      <Navigation size={14} />
                      {distance} km from your location
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 8 }}>
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe your symptoms or reason for visit..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: 12,
                    border: '1px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 14,
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(3)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'white',
                    color: '#6B7280',
                    border: '2px solid #D1D5DB',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Back
                </button>
                <button
                  onClick={handleBookAppointment}
                  disabled={!reason || loading}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: (reason && !loading) ? '#0D7377' : '#D1D5DB',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: (reason && !loading) ? 'pointer' : 'not-allowed'
                  }}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 80,
                height: 80,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <CheckCircle size={48} color="white" />
              </div>

              <h3 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', marginBottom: 12 }}>
                Appointment Confirmed!
              </h3>
              <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 28 }}>
                Your appointment has been successfully booked
              </p>

              <div style={{
                padding: 20,
                background: '#F9FAFB',
                borderRadius: 12,
                marginBottom: 24,
                border: '1px solid #E5E7EB',
                textAlign: 'left'
              }}>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Doctor</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>
                    {selectedDoctor?.full_name}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {selectedDoctor?.specialty}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Date & Time</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>
                    {formatTime(selectedTime)}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Location</span>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#1F2937', marginTop: 4 }}>
                    {selectedDoctor?.location}
                  </div>
                  {distance && (
                    <div style={{ fontSize: 13, color: '#0D7377', marginTop: 4 }}>
                      {distance} km from you
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 12 }}>
                  Add to your calendar:
                </p>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => {
                      const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
                      const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
                      const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
                      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dr. ${selectedDoctor?.full_name}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(reason)}&location=${encodeURIComponent(selectedDoctor?.address || '')}`;
                      window.open(googleCalUrl, '_blank');
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      background: 'white',
                      color: '#0D7377',
                      border: '2px solid #0D7377',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <CalendarPlus size={16} />
                    Google
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
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      background: 'white',
                      color: '#0D7377',
                      border: '2px solid #0D7377',
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={16} />
                    iPhone
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onAppointmentBooked();
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: '#0D7377',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
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
