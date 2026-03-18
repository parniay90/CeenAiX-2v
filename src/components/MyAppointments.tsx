import { useState, useEffect } from 'react';
import {
  Calendar, Clock, Plus, Bell, BellOff, CalendarPlus, Download,
  Video, MapPin, FileText
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { EnhancedAppointmentScheduler } from './EnhancedAppointmentScheduler';

export function MyAppointments() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('upcoming');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, filter]);

  const fetchAppointments = async () => {
    if (!user) return;

    setLoading(true);
    const statusFilter = filter === 'upcoming' ? 'scheduled' : 'completed';

    const { data: appointmentsData } = await supabase
      .from('appointments')
      .select(`
        *,
        doctor:doctors!appointments_doctor_id_fkey (
          id,
          specialty
        )
      `)
      .eq('patient_id', user.id)
      .eq('status', statusFilter)
      .order('appointment_date', { ascending: filter === 'upcoming' });

    if (appointmentsData) {
      const appointmentsWithDoctorNames = await Promise.all(
        appointmentsData.map(async (apt) => {
          const { data: doctorProfile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', apt.doctor_id)
            .single();

          return {
            ...apt,
            doctorName: doctorProfile?.full_name || 'Unknown Doctor',
            specialty: apt.doctor?.specialty || 'General'
          };
        })
      );

      setAppointments(appointmentsWithDoctorNames);
    }

    setLoading(false);
  };

  const handleToggleNotifications = async (appointmentId: string, enabled: boolean) => {
    await supabase
      .from('appointments')
      .update({ notifications_enabled: enabled })
      .eq('id', appointmentId);

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === appointmentId ? { ...apt, notifications_enabled: enabled } : apt
      )
    );
  };

  const addToGoogleCalendar = (apt: any) => {
    const startDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
    const formatGoogleDate = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dr. ${apt.doctorName}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(`Reason: ${apt.reason || 'Consultation'}\nSpecialty: ${apt.specialty}`)}&location=${encodeURIComponent('CeenAiX Medical Center')}`;
    window.open(googleCalUrl, '_blank');
  };

  const downloadICS = (apt: any) => {
    const startDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`);
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);
    const formatDateForCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CeenAiX//Appointment//EN', 'BEGIN:VEVENT',
      `DTSTART:${formatDateForCal(startDateTime)}`, `DTEND:${formatDateForCal(endDateTime)}`,
      `SUMMARY:Dr. ${apt.doctorName}`, `DESCRIPTION:${apt.reason || 'Consultation'}\\nSpecialty: ${apt.specialty}`,
      `LOCATION:CeenAiX Medical Center`, 'STATUS:CONFIRMED',
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Appointment in 1 hour', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `appointment-${apt.appointment_date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Appointments</h1>
            <p className="text-teal-100">Schedule and manage your healthcare visits</p>
          </div>
          <button
            onClick={() => setShowScheduler(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:shadow-lg transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Schedule New
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 inline-flex gap-2">
        <button
          onClick={() => setFilter('upcoming')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'upcoming'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
            filter === 'completed'
              ? 'bg-teal-600 text-white shadow-md'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          Past
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Loading appointments...</p>
          </div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No {filter} appointments</h3>
          <p className="text-gray-500 mb-6">You don't have any {filter} appointments at the moment</p>
          <button
            onClick={() => setShowScheduler(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-medium"
          >
            Schedule Your First Appointment
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-gradient-to-br from-teal-500 to-cyan-500 text-white p-6 md:w-48 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">{formatDate(apt.appointment_date).split(' ')[2]}</div>
                    <div className="text-sm uppercase tracking-wide opacity-90">{formatDate(apt.appointment_date).split(' ')[1]}</div>
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="text-2xl font-semibold">{formatTime(apt.appointment_time)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                        {apt.doctorName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Dr. {apt.doctorName}</h3>
                        <p className="text-teal-600 font-medium">{apt.specialty}</p>
                        {apt.reason && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            {apt.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${
                      apt.type === 'teleconsultation'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {apt.type === 'teleconsultation' ? (
                        <span className="flex items-center gap-1">
                          <Video className="w-3.5 h-3.5" />
                          Video Call
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          In-Person
                        </span>
                      )}
                    </span>
                  </div>

                  {filter === 'upcoming' && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setShowScheduler(true)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-teal-600 text-teal-700 font-medium rounded-lg hover:bg-teal-50 transition-all"
                        >
                          <Calendar className="w-4 h-4" />
                          <span className="hidden sm:inline">Reschedule</span>
                          <span className="sm:hidden">Reschedule</span>
                        </button>

                        <button
                          onClick={() => handleToggleNotifications(apt.id, !apt.notifications_enabled)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            apt.notifications_enabled
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'border-2 border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {apt.notifications_enabled ? (
                            <>
                              <Bell className="w-4 h-4" />
                              <span className="hidden sm:inline">Notify On</span>
                            </>
                          ) : (
                            <>
                              <BellOff className="w-4 h-4" />
                              <span className="hidden sm:inline">Notify Off</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => addToGoogleCalendar(apt)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <CalendarPlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Google</span>
                        </button>

                        <button
                          onClick={() => downloadICS(apt)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">iPhone</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showScheduler && user && (
        <EnhancedAppointmentScheduler
          onClose={() => setShowScheduler(false)}
          onAppointmentBooked={() => {
            setShowScheduler(false);
            fetchAppointments();
          }}
          patientId={user.id}
        />
      )}
    </div>
  );
}
