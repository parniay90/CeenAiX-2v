import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Video, Bell, BellOff, CalendarPlus, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentCardProps {
  appointmentId?: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in_clinic' | 'teleconsultation';
  clinic?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
  onJoin?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onToggleNotifications?: (enabled: boolean) => void;
  notificationsEnabled?: boolean;
}

export function AppointmentCard({
  appointmentId,
  doctorName,
  specialty,
  date,
  time,
  type,
  clinic,
  status,
  reason,
  onJoin,
  onCancel,
  onReschedule,
  onToggleNotifications,
  notificationsEnabled = true,
}: AppointmentCardProps) {
  const { language } = useLanguage();
  const [showOptions, setShowOptions] = useState(false);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(notificationsEnabled);

  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  };

  const generateCalendarFile = () => {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);

    const formatDateForCal = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CeenAiX//Appointment//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatDateForCal(startDateTime)}`,
      `DTEND:${formatDateForCal(endDateTime)}`,
      `SUMMARY:Appointment with ${doctorName}`,
      `DESCRIPTION:${reason || 'Consultation'}\\nSpecialty: ${specialty}`,
      `LOCATION:${clinic || 'CeenAiX Medical Center'}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Appointment with ${doctorName} in 1 hour`,
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Appointment with ${doctorName} tomorrow`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  const downloadCalendarFile = () => {
    const icsContent = generateCalendarFile();
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `appointment-${date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addToGoogleCalendar = () => {
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    const startDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60000);

    const formatGoogleDate = (d: Date) => {
      return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Appointment with ${doctorName}`)}&dates=${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}&details=${encodeURIComponent(`Reason: ${reason || 'Consultation'}\nSpecialty: ${specialty}`)}&location=${encodeURIComponent(clinic || 'CeenAiX Medical Center')}`;

    window.open(googleCalUrl, '_blank');
  };

  const handleToggleNotifications = () => {
    const newState = !localNotificationsEnabled;
    setLocalNotificationsEnabled(newState);
    if (onToggleNotifications) {
      onToggleNotifications(newState);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{doctorName}</h3>
          <p className="text-sm text-gray-600">{specialty}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status === 'scheduled' && (language === 'en' ? 'Scheduled' : 'مجدول')}
          {status === 'completed' && (language === 'en' ? 'Completed' : 'مكتمل')}
          {status === 'cancelled' && (language === 'en' ? 'Cancelled' : 'ملغي')}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Calendar className="w-4 h-4 text-[#0D7377]" />
          <span>{date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-[#0D7377]" />
          <span>{time}</span>
        </div>
        {type === 'teleconsultation' ? (
          <div className="flex items-center gap-2 text-sm text-[#6C63FF]">
            <Video className="w-4 h-4" />
            <span>{language === 'en' ? 'Teleconsultation' : 'استشارة عن بعد'}</span>
          </div>
        ) : (
          clinic && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-4 h-4 text-[#0D7377]" />
              <span>{clinic}</span>
            </div>
          )
        )}
      </div>

      {status === 'scheduled' && (
        <div className="space-y-3">
          <div className="flex gap-2">
            {type === 'teleconsultation' && onJoin && (
              <button
                onClick={onJoin}
                className="flex-1 px-4 py-2 bg-[#0D7377] text-white rounded-lg hover:bg-[#0a5c5f] transition-colors text-sm font-medium"
              >
                {language === 'en' ? 'Join Call' : 'انضم للمكالمة'}
              </button>
            )}
            {onReschedule && (
              <button
                onClick={onReschedule}
                className="flex-1 px-4 py-2 border border-[#0D7377] text-[#0D7377] rounded-lg hover:bg-[#F0FDFA] transition-colors text-sm font-medium"
              >
                {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleToggleNotifications}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                localNotificationsEnabled
                  ? 'bg-[#0D7377] text-white hover:bg-[#0a5c5f]'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {localNotificationsEnabled ? (
                <>
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'On' : 'مفعل'}</span>
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  <span className="hidden sm:inline">{language === 'en' ? 'Off' : 'معطل'}</span>
                </>
              )}
            </button>

            <button
              onClick={addToGoogleCalendar}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              title={language === 'en' ? 'Add to Google Calendar' : 'إضافة إلى تقويم Google'}
            >
              <CalendarPlus className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? 'Google' : 'جوجل'}</span>
            </button>

            <button
              onClick={downloadCalendarFile}
              className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              title={language === 'en' ? 'Download .ics file for iPhone/Outlook' : 'تنزيل ملف .ics لـ iPhone/Outlook'}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{language === 'en' ? '.ics' : '.ics'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
