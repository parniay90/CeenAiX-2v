import { useState, useEffect } from 'react';
import { Pill, Calendar, User, MapPin, FileText, Send, Check, Clock, X, AlertCircle, CalendarPlus, Bell, CreditCard as Edit2, Search } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  quantity: number;
  refillsRemaining: number;
  prescribedDate: string;
  expiresDate: string;
  prescribedFor: string;
  doctorName: string;
  instructions: string;
  status: 'active' | 'expired' | 'discontinued';
}

interface RefillRequest {
  id: string;
  prescriptionId: string;
  medicationName: string;
  requestedQuantity: number;
  pharmacyName: string;
  pharmacyAddress: string;
  requestNotes: string;
  status: 'pending' | 'approved' | 'denied' | 'fulfilled';
  requestDate: string;
  doctorNotes?: string;
}

export default function PrescriptionsPage() {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();

  const generateGoogleCalendarUrl = (prescription: Prescription) => {
    const title = encodeURIComponent(`Take ${prescription.medicationName}`);
    const details = encodeURIComponent(
      `Medication: ${prescription.medicationName} ${prescription.dosage}\nFrequency: ${prescription.frequency}\nInstructions: ${prescription.instructions}`
    );
    const recurrence = prescription.frequency.toLowerCase().includes('twice') ? 'RRULE:FREQ=DAILY;INTERVAL=1' : 'RRULE:FREQ=DAILY;INTERVAL=1';

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&recur=${recurrence}`;
  };

  const generateICSFile = (prescription: Prescription) => {
    const now = new Date();
    const startDate = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(now.getTime() + 15 * 60000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const frequency = prescription.frequency.toLowerCase().includes('twice') ? 'FREQ=DAILY;INTERVAL=1;COUNT=365' : 'FREQ=DAILY;INTERVAL=1;COUNT=365';

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CeenAiX//Medication Reminder//EN
BEGIN:VEVENT
UID:${prescription.id}@ceenaix.com
DTSTAMP:${startDate}
DTSTART:${startDate}
DTEND:${endDate}
RRULE:${frequency}
SUMMARY:Take ${prescription.medicationName}
DESCRIPTION:Medication: ${prescription.medicationName} ${prescription.dosage}\\nFrequency: ${prescription.frequency}\\nInstructions: ${prescription.instructions}
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Time to take ${prescription.medicationName}
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${prescription.medicationName.replace(/\s+/g, '_')}_reminder.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showCalendarOptions, setShowCalendarOptions] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [refillQuantity, setRefillQuantity] = useState(0);
  const [selectedPharmacy, setSelectedPharmacy] = useState({
    name: 'Dubai Pharmacy',
    address: 'Dubai Mall, Sheikh Zayed Road, Dubai',
    phone: '+971 4 XXX XXXX',
  });
  const [refillNotes, setRefillNotes] = useState('');

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderTimes, setReminderTimes] = useState<string[]>(['09:00']);
  const [reminderEndDate, setReminderEndDate] = useState('');

  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [availablePharmacies, setAvailablePharmacies] = useState<any[]>([]);
  const [pharmacySearch, setPharmacySearch] = useState('');

  useEffect(() => {
    if (user) {
      fetchPrescriptions();
      fetchRefillRequests();
      fetchPreferredPharmacy();
      fetchAvailablePharmacies();
    }
  }, [user]);

  const fetchPrescriptions = async () => {
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', user?.id)
        .maybeSingle();

      if (!patientData) return;

      const { data: prescriptionsData, error } = await supabase
        .from('prescriptions')
        .select(`
          id,
          medications,
          status,
          valid_until,
          created_at,
          doctor_id,
          doctors!inner (
            id,
            profiles!inner (
              full_name
            )
          )
        `)
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPrescriptions: Prescription[] = (prescriptionsData || []).flatMap((prescription) => {
        const medications = prescription.medications as any[];
        return medications.map((med: any, index: number) => ({
          id: `${prescription.id}-${index}`,
          medicationName: `${med.name} ${med.dosage}`,
          dosage: med.dosage,
          frequency: med.frequency,
          quantity: med.quantity || 30,
          refillsRemaining: med.refills || 0,
          prescribedDate: new Date(prescription.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          expiresDate: prescription.valid_until
            ? new Date(prescription.valid_until).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'N/A',
          prescribedFor: med.prescribed_for || 'General medication',
          doctorName: prescription.doctors?.profiles?.full_name || 'Unknown Doctor',
          instructions: med.instructions || 'Follow doctor instructions',
          status: prescription.status as 'active' | 'expired' | 'discontinued',
        }));
      });

      setPrescriptions(formattedPrescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefillRequests = async () => {
    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', user?.id)
        .maybeSingle();

      if (!patientData) return;

      const { data, error } = await supabase
        .from('refill_requests')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRequests: RefillRequest[] = (data || []).map((request) => ({
        id: request.id,
        prescriptionId: request.prescription_id,
        medicationName: request.medication_name,
        requestedQuantity: request.requested_quantity,
        pharmacyName: request.pharmacy_name,
        pharmacyAddress: request.pharmacy_address,
        requestNotes: request.request_notes || '',
        status: request.status as 'pending' | 'approved' | 'denied' | 'fulfilled',
        requestDate: new Date(request.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        doctorNotes: request.doctor_notes,
      }));

      setRefillRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching refill requests:', error);
    }
  };

  const fetchPreferredPharmacy = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pharmacies')
        .select('*')
        .eq('user_id', user?.id)
        .eq('is_preferred', true)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSelectedPharmacy({
          name: data.pharmacy_name,
          address: data.pharmacy_address,
          phone: data.pharmacy_phone || '+971 4 XXX XXXX',
        });
      }
    } catch (error) {
      console.error('Error fetching preferred pharmacy:', error);
    }
  };

  const fetchAvailablePharmacies = async () => {
    try {
      const { data, error } = await supabase
        .from('user_pharmacies')
        .select('*')
        .eq('user_id', user?.id)
        .order('is_preferred', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

      setAvailablePharmacies(data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const handleSelectPharmacy = async (pharmacy: any) => {
    try {
      await supabase
        .from('user_pharmacies')
        .update({ is_preferred: false })
        .eq('user_id', user?.id);

      await supabase
        .from('user_pharmacies')
        .update({ is_preferred: true })
        .eq('id', pharmacy.id);

      setSelectedPharmacy({
        name: pharmacy.pharmacy_name,
        address: pharmacy.pharmacy_address,
        phone: pharmacy.pharmacy_phone || '+971 4 XXX XXXX',
      });

      setShowPharmacyModal(false);
      await fetchAvailablePharmacies();
    } catch (error) {
      console.error('Error updating preferred pharmacy:', error);
      alert('Failed to update pharmacy preference');
    }
  };

  const handleAddPharmacy = async (name: string, address: string, phone: string) => {
    try {
      const { error } = await supabase
        .from('user_pharmacies')
        .insert({
          user_id: user?.id,
          pharmacy_name: name,
          pharmacy_address: address,
          pharmacy_phone: phone,
          is_preferred: availablePharmacies.length === 0,
        });

      if (error) throw error;

      await fetchAvailablePharmacies();
      if (availablePharmacies.length === 0) {
        await fetchPreferredPharmacy();
      }
    } catch (error) {
      console.error('Error adding pharmacy:', error);
      alert('Failed to add pharmacy');
    }
  };

  const handleRequestRefill = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setRefillQuantity(prescription.quantity);
    setShowRefillModal(true);
  };

  const handleSetReminder = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setReminderTimes(['09:00']);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    setReminderEndDate(thirtyDaysFromNow.toISOString().split('T')[0]);
    setShowReminderModal(true);
  };

  const handleSaveReminder = async () => {
    if (!selectedPrescription || !user) return;

    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!patientData) return;

      const prescriptionId = selectedPrescription.id.split('-')[0];

      const { error } = await supabase
        .from('medication_reminders')
        .insert({
          patient_id: patientData.id,
          prescription_id: prescriptionId,
          medication_name: selectedPrescription.medicationName,
          dosage: selectedPrescription.dosage,
          reminder_times: reminderTimes,
          frequency: selectedPrescription.frequency,
          start_date: new Date().toISOString().split('T')[0],
          end_date: reminderEndDate || null,
          is_active: true,
          notification_enabled: true,
        });

      if (error) throw error;

      setShowReminderModal(false);
      alert('Reminder set successfully! You will receive notifications at the scheduled times.');
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Failed to set reminder. Please try again.');
    }
  };

  const addReminderTime = () => {
    setReminderTimes([...reminderTimes, '09:00']);
  };

  const updateReminderTime = (index: number, time: string) => {
    const newTimes = [...reminderTimes];
    newTimes[index] = time;
    setReminderTimes(newTimes);
  };

  const removeReminderTime = (index: number) => {
    if (reminderTimes.length > 1) {
      setReminderTimes(reminderTimes.filter((_, i) => i !== index));
    }
  };

  const handleSubmitRefill = async () => {
    if (!selectedPrescription || !user) return;

    try {
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!patientData) return;

      const prescriptionId = selectedPrescription.id.split('-')[0];

      const { data: prescriptionData } = await supabase
        .from('prescriptions')
        .select('doctor_id')
        .eq('id', prescriptionId)
        .maybeSingle();

      if (!prescriptionData) return;

      const { error } = await supabase
        .from('refill_requests')
        .insert({
          prescription_id: prescriptionId,
          patient_id: patientData.id,
          doctor_id: prescriptionData.doctor_id,
          pharmacy_name: selectedPharmacy.name,
          pharmacy_address: selectedPharmacy.address,
          pharmacy_phone: selectedPharmacy.phone,
          medication_name: selectedPrescription.medicationName,
          requested_quantity: refillQuantity,
          request_notes: refillNotes,
          status: 'pending',
        });

      if (error) throw error;

      await fetchRefillRequests();
      setShowRefillModal(false);
      setRefillNotes('');
    } catch (error) {
      console.error('Error submitting refill request:', error);
      alert('Failed to submit refill request. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'fulfilled':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'denied':
      case 'expired':
      case 'discontinued':
        return '#DC2626';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'fulfilled':
        return <Check size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'denied':
        return <X size={14} />;
      default:
        return null;
    }
  };

  return (
    <PatientLayout activeNav="prescriptions">
      <div
        style={{
          minHeight: '100%',
          background: isDarkMode ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                marginBottom: 8,
              }}
            >
              My Prescriptions
            </h1>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Manage your prescriptions and request refills
            </p>
          </div>

          {/* Preferred Pharmacy Section */}
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 24,
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              marginBottom: 24,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                }}
              >
                Preferred Pharmacy
              </h2>
              <button
                onClick={() => setShowPharmacyModal(true)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Edit2 size={14} />
                Change
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <MapPin size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 4 }}>
                  {selectedPharmacy.name}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginBottom: 2 }}>{selectedPharmacy.address}</div>
                <div style={{ fontSize: 13, color: '#64748B' }}>{selectedPharmacy.phone}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 24 }}>
            {/* Active Prescriptions */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  marginBottom: 16,
                }}
              >
                Active Prescriptions
              </h2>
              {loading ? (
                <div
                  style={{
                    background: isDarkMode ? '#16213E' : 'white',
                    borderRadius: 16,
                    padding: 48,
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    textAlign: 'center',
                    color: '#64748B',
                  }}
                >
                  Loading prescriptions...
                </div>
              ) : prescriptions.filter((p) => p.status === 'active').length === 0 ? (
                <div
                  style={{
                    background: isDarkMode ? '#16213E' : 'white',
                    borderRadius: 16,
                    padding: 48,
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    textAlign: 'center',
                    color: '#64748B',
                  }}
                >
                  No active prescriptions
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 16 }}>
                  {prescriptions
                    .filter((p) => p.status === 'active')
                    .map((prescription) => (
                    <div
                      key={prescription.id}
                      style={{
                        background: isDarkMode ? '#16213E' : 'white',
                        borderRadius: 16,
                        padding: 24,
                        border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                                borderRadius: 10,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Pill size={20} color="white" />
                            </div>
                            <div>
                              <h3 style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                                {prescription.medicationName}
                              </h3>
                              <p style={{ fontSize: 13, color: '#64748B' }}>
                                {prescription.dosage} - {prescription.frequency}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            background: `${getStatusColor(prescription.status)}15`,
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            color: getStatusColor(prescription.status),
                          }}
                        >
                          {prescription.refillsRemaining} refills remaining
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: 16,
                          padding: 16,
                          background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                          borderRadius: 12,
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Prescribed For</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {prescription.prescribedFor}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Doctor</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {prescription.doctorName}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Prescribed Date</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {prescription.prescribedDate}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Expires</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {prescription.expiresDate}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: 12,
                          background: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          borderRadius: 10,
                          marginBottom: 16,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 8 }}>
                          <AlertCircle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 2 }}>
                              Instructions
                            </div>
                            <div style={{ fontSize: 12, color: '#78350F' }}>{prescription.instructions}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 12 }}>
                        <button
                          onClick={() => handleRequestRefill(prescription)}
                          disabled={prescription.refillsRemaining === 0}
                          style={{
                            flex: 1,
                            padding: '12px 20px',
                            background:
                              prescription.refillsRemaining === 0
                                ? '#E2E8F0'
                                : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                            border: 'none',
                            borderRadius: 10,
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: prescription.refillsRemaining === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            opacity: prescription.refillsRemaining === 0 ? 0.5 : 1,
                          }}
                        >
                          <Send size={16} />
                          {prescription.refillsRemaining === 0 ? 'No Refills Available' : 'Request Refill'}
                        </button>
                        <button
                          onClick={() => handleSetReminder(prescription)}
                          style={{
                            padding: '12px 16px',
                            background: isDarkMode ? '#1A1A2E' : 'white',
                            border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                            borderRadius: 10,
                            color: isDarkMode ? '#CBD5E1' : '#475569',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                          }}
                        >
                          <Bell size={16} />
                          Set Reminder
                        </button>
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setShowCalendarOptions(showCalendarOptions === prescription.id ? null : prescription.id)}
                            style={{
                              padding: '12px 16px',
                              background: isDarkMode ? '#1A1A2E' : 'white',
                              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                              borderRadius: 10,
                              color: isDarkMode ? '#CBD5E1' : '#475569',
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                            }}
                          >
                            <CalendarPlus size={16} />
                            Export
                          </button>
                          {showCalendarOptions === prescription.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 8px)',
                                right: 0,
                                background: isDarkMode ? '#16213E' : 'white',
                                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                                borderRadius: 12,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                minWidth: 220,
                                zIndex: 100,
                                overflow: 'hidden',
                              }}
                            >
                              <button
                                onClick={() => {
                                  window.open(generateGoogleCalendarUrl(prescription), '_blank');
                                  setShowCalendarOptions(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  background: 'transparent',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  color: isDarkMode ? '#CBD5E1' : '#475569',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <span style={{ fontSize: 16 }}>📅</span>
                                Add to Google Calendar
                              </button>
                              <button
                                onClick={() => {
                                  generateICSFile(prescription);
                                  setShowCalendarOptions(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '12px 16px',
                                  background: 'transparent',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: 13,
                                  color: isDarkMode ? '#CBD5E1' : '#475569',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 10,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                              >
                                <span style={{ fontSize: 16 }}>🍎</span>
                                Download for Apple Calendar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refill Requests */}
            <div>
              <h2
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  marginBottom: 16,
                }}
              >
                Refill Requests
              </h2>
              <div style={{ display: 'grid', gap: 16 }}>
                {refillRequests.length === 0 ? (
                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 48,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      textAlign: 'center',
                      color: '#64748B',
                    }}
                  >
                    No refill requests yet
                  </div>
                ) : (
                  refillRequests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        background: isDarkMode ? '#16213E' : 'white',
                        borderRadius: 16,
                        padding: 24,
                        border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <div>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 4 }}>
                            {request.medicationName}
                          </h3>
                          <p style={{ fontSize: 13, color: '#64748B' }}>Requested on {request.requestDate}</p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '6px 12px',
                            background: `${getStatusColor(request.status)}15`,
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            color: getStatusColor(request.status),
                          }}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Quantity</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {request.requestedQuantity} tablets
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Pharmacy</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {request.pharmacyName}
                          </div>
                        </div>
                      </div>

                      {request.requestNotes && (
                        <div
                          style={{
                            padding: 12,
                            background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                            borderRadius: 8,
                            marginBottom: 12,
                          }}
                        >
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 4 }}>Notes</div>
                          <div style={{ fontSize: 13, color: isDarkMode ? '#CBD5E1' : '#475569' }}>{request.requestNotes}</div>
                        </div>
                      )}

                      {request.doctorNotes && (
                        <div
                          style={{
                            padding: 12,
                            background: '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            borderRadius: 8,
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#0369A1', marginBottom: 4 }}>Doctor's Notes</div>
                          <div style={{ fontSize: 13, color: '#075985' }}>{request.doctorNotes}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refill Request Modal */}
      {showRefillModal && selectedPrescription && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowRefillModal(false)}
        >
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 32,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 8 }}>
              Request Prescription Refill
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
              Your doctor will review and approve your refill request
            </p>

            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Medication
                </label>
                <div
                  style={{
                    padding: 12,
                    background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                    borderRadius: 8,
                    fontSize: 14,
                    color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                    fontWeight: 600,
                  }}
                >
                  {selectedPrescription.medicationName} - {selectedPrescription.dosage}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={refillQuantity}
                  onChange={(e) => setRefillQuantity(parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    fontSize: 14,
                    color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                    background: isDarkMode ? '#1A1A2E' : 'white',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Preferred Pharmacy
                </label>
                <div
                  style={{
                    padding: 16,
                    background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
                    <MapPin size={18} color="#0D7377" style={{ marginTop: 2 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 4 }}>
                        {selectedPharmacy.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>{selectedPharmacy.address}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{selectedPharmacy.phone}</div>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: '#64748B', marginTop: 8 }}>
                  You can change your preferred pharmacy in Settings
                </p>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={refillNotes}
                  onChange={(e) => setRefillNotes(e.target.value)}
                  placeholder="Add any additional information for your doctor..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    fontSize: 14,
                    color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                    background: isDarkMode ? '#1A1A2E' : 'white',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => setShowRefillModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: isDarkMode ? '#1A1A2E' : 'white',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    color: isDarkMode ? '#CBD5E1' : '#475569',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRefill}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Send size={16} />
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* In-App Reminder Modal */}
      {showReminderModal && selectedPrescription && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowReminderModal(false)}
        >
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 32,
              maxWidth: 500,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 8 }}>
              Set Medication Reminder
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
              Get in-app notifications to remind you to take your medication
            </p>

            <div style={{ display: 'grid', gap: 20 }}>
              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Medication
                </label>
                <div
                  style={{
                    padding: 12,
                    background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                    borderRadius: 8,
                    fontSize: 14,
                    color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                    fontWeight: 600,
                  }}
                >
                  {selectedPrescription.medicationName}
                </div>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  Reminder Times
                </label>
                {reminderTimes.map((time, index) => (
                  <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '12px 14px',
                        border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                        borderRadius: 10,
                        fontSize: 14,
                        color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                        background: isDarkMode ? '#1A1A2E' : 'white',
                        outline: 'none',
                      }}
                    />
                    {reminderTimes.length > 1 && (
                      <button
                        onClick={() => removeReminderTime(index)}
                        style={{
                          padding: '12px 16px',
                          background: '#FEE2E2',
                          border: 'none',
                          borderRadius: 10,
                          color: '#DC2626',
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addReminderTime}
                  style={{
                    padding: '10px 16px',
                    background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    color: '#0D7377',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  + Add Another Time
                </button>
              </div>

              <div>
                <label style={{ fontSize: 14, fontWeight: 600, color: isDarkMode ? '#CBD5E1' : '#475569', display: 'block', marginBottom: 8 }}>
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reminderEndDate}
                  onChange={(e) => setReminderEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    fontSize: 14,
                    color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                    background: isDarkMode ? '#1A1A2E' : 'white',
                    outline: 'none',
                  }}
                />
                <p style={{ fontSize: 11, color: '#64748B', marginTop: 6 }}>
                  Leave empty for ongoing reminders
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  onClick={() => setShowReminderModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: isDarkMode ? '#1A1A2E' : 'white',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    color: isDarkMode ? '#CBD5E1' : '#475569',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  style={{
                    flex: 1,
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <Bell size={16} />
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pharmacy Selection Modal */}
      {showPharmacyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowPharmacyModal(false)}
        >
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 32,
              maxWidth: 600,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 8 }}>
              Select Preferred Pharmacy
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              Choose where you'd like to pick up your prescriptions
            </p>

            <div style={{ position: 'relative', marginBottom: 20 }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#64748B',
                }}
              />
              <input
                type="text"
                placeholder="Search pharmacies..."
                value={pharmacySearch}
                onChange={(e) => setPharmacySearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 44px',
                  border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                  borderRadius: 10,
                  fontSize: 14,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  background: isDarkMode ? '#1A1A2E' : 'white',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'grid', gap: 12, maxHeight: 400, overflowY: 'auto' }}>
              {availablePharmacies.length === 0 ? (
                <div
                  style={{
                    padding: 32,
                    textAlign: 'center',
                    color: '#64748B',
                    background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                    borderRadius: 12,
                  }}
                >
                  <p style={{ marginBottom: 8 }}>No pharmacies added yet</p>
                  <p style={{ fontSize: 12 }}>Add pharmacies from Settings</p>
                </div>
              ) : (
                availablePharmacies
                  .filter((p) =>
                    p.pharmacy_name.toLowerCase().includes(pharmacySearch.toLowerCase()) ||
                    p.pharmacy_address.toLowerCase().includes(pharmacySearch.toLowerCase())
                  )
                  .map((pharmacy) => (
                    <div
                      key={pharmacy.id}
                      onClick={() => handleSelectPharmacy(pharmacy)}
                      style={{
                        padding: 16,
                        background: pharmacy.is_preferred
                          ? isDarkMode
                            ? '#0D737715'
                            : '#E0F2F1'
                          : isDarkMode
                          ? '#1A1A2E'
                          : 'white',
                        border: pharmacy.is_preferred
                          ? '2px solid #0D7377'
                          : isDarkMode
                          ? '1px solid #2D3748'
                          : '1px solid #E2E8F0',
                        borderRadius: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (!pharmacy.is_preferred) {
                          e.currentTarget.style.borderColor = '#0D7377';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!pharmacy.is_preferred) {
                          e.currentTarget.style.borderColor = isDarkMode ? '#2D3748' : '#E2E8F0';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                        <MapPin size={20} color="#0D7377" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {pharmacy.pharmacy_name}
                            </div>
                            {pharmacy.is_preferred && (
                              <div
                                style={{
                                  padding: '2px 8px',
                                  background: '#0D7377',
                                  borderRadius: 12,
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: 'white',
                                }}
                              >
                                PREFERRED
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 2 }}>
                            {pharmacy.pharmacy_address}
                          </div>
                          {pharmacy.pharmacy_phone && (
                            <div style={{ fontSize: 13, color: '#64748B' }}>{pharmacy.pharmacy_phone}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <button
              onClick={() => setShowPharmacyModal(false)}
              style={{
                width: '100%',
                padding: '12px 20px',
                background: isDarkMode ? '#1A1A2E' : 'white',
                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                borderRadius: 10,
                color: isDarkMode ? '#CBD5E1' : '#475569',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: 16,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
