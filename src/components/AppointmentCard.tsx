import React from 'react';
import { Calendar, Clock, MapPin, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AppointmentCardProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'in_clinic' | 'teleconsultation';
  clinic?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  onJoin?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
}

export function AppointmentCard({
  doctorName,
  specialty,
  date,
  time,
  type,
  clinic,
  status,
  onJoin,
  onCancel,
  onReschedule,
}: AppointmentCardProps) {
  const { language } = useLanguage();

  const statusColors = {
    scheduled: 'bg-blue-50 text-blue-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              {language === 'en' ? 'Reschedule' : 'إعادة جدولة'}
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
