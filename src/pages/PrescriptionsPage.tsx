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
          background: isDarkMode ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header Section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <h1
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                    marginBottom: 8,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Prescriptions & Refills
                </h1>
                <p style={{ fontSize: 16, color: '#64748B' }}>
                  Manage medications, request refills, and set reminders
                </p>
              </div>
              <div
                style={{
                  padding: '16px 24px',
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)'
                    : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  borderRadius: 16,
                  boxShadow: '0 8px 24px rgba(6, 182, 212, 0.3)',
                }}
              >
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
                  Active Prescriptions
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>
                  {prescriptions.filter((p) => p.status === 'active').length}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Pharmacy Card */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* Preferred Pharmacy Card */}
            <div
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                  : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                borderRadius: 20,
                padding: 28,
                border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                boxShadow: isDarkMode
                  ? '0 10px 40px rgba(0,0,0,0.3)'
                  : '0 10px 40px rgba(0,0,0,0.06)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
                  borderRadius: '50%',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                      borderRadius: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)',
                    }}
                  >
                    <MapPin size={28} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                      PREFERRED PHARMACY
                    </div>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: isDarkMode ? '#F8FAFC' : '#0F172A',
                      }}
                    >
                      {selectedPharmacy.name}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowPharmacyModal(true)}
                  style={{
                    padding: '10px 18px',
                    background: isDarkMode ? '#334155' : 'white',
                    border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                    borderRadius: 12,
                    color: isDarkMode ? '#F8FAFC' : '#334155',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isDarkMode ? '#334155' : 'white';
                    e.currentTarget.style.color = isDarkMode ? '#F8FAFC' : '#334155';
                    e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                  }}
                >
                  <Edit2 size={16} />
                  Change
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <div style={{ fontSize: 15, color: '#64748B', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={16} />
                  {selectedPharmacy.address}
                </div>
                <div style={{ fontSize: 15, color: '#64748B', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} />
                  {selectedPharmacy.phone}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 8, fontWeight: 600 }}>
                  REFILLS AVAILABLE
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
                  {prescriptions.reduce((sum, p) => sum + p.refillsRemaining, 0)}
                </div>
              </div>
              <div
                style={{
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)'
                    : 'linear-gradient(135deg, #FBBF24 0%, #FCD34D 100%)',
                  borderRadius: 16,
                  padding: 20,
                  boxShadow: '0 8px 20px rgba(251, 191, 36, 0.3)',
                }}
              >
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 8, fontWeight: 600 }}>
                  PENDING REFILLS
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: 'white' }}>
                  {refillRequests.filter((r) => r.status === 'pending').length}
                </div>
              </div>
            </div>
          </div>

          {/* Active Prescriptions */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  letterSpacing: '-0.01em',
                }}
              >
                Active Medications
              </h2>
            </div>
            {loading ? (
              <div
                style={{
                  background: isDarkMode ? '#1E293B' : 'white',
                  borderRadius: 20,
                  padding: 64,
                  textAlign: 'center',
                  color: '#64748B',
                  boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.06)',
                }}
              >
                Loading prescriptions...
              </div>
            ) : prescriptions.filter((p) => p.status === 'active').length === 0 ? (
              <div
                style={{
                  background: isDarkMode ? '#1E293B' : 'white',
                  borderRadius: 20,
                  padding: 64,
                  textAlign: 'center',
                  color: '#64748B',
                  boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.06)',
                }}
              >
                No active prescriptions
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 20 }}>
                {prescriptions
                  .filter((p) => p.status === 'active')
                  .map((prescription) => (
                  <div
                    key={prescription.id}
                    style={{
                      background: isDarkMode
                        ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                        : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                      borderRadius: 20,
                      padding: 28,
                      border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                      boxShadow: isDarkMode
                        ? '0 10px 40px rgba(0,0,0,0.3)'
                        : '0 10px 40px rgba(0,0,0,0.06)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = isDarkMode
                        ? '0 20px 60px rgba(0,0,0,0.4)'
                        : '0 20px 60px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isDarkMode
                        ? '0 10px 40px rgba(0,0,0,0.3)'
                        : '0 10px 40px rgba(0,0,0,0.06)';
                    }}
                  >
                      {/* Decorative gradient blob */}
                      <div
                        style={{
                          position: 'absolute',
                          top: -60,
                          right: -60,
                          width: 180,
                          height: 180,
                          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
                          borderRadius: '50%',
                        }}
                      />

                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'start', gap: 16, marginBottom: 12 }}>
                            <div
                              style={{
                                width: 56,
                                height: 56,
                                background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                                borderRadius: 16,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 20px rgba(6, 182, 212, 0.4)',
                                flexShrink: 0,
                              }}
                            >
                              <Pill size={28} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <h3 style={{ fontSize: 20, fontWeight: 800, color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: 6, letterSpacing: '-0.01em' }}>
                                {prescription.medicationName}
                              </h3>
                              <p style={{ fontSize: 15, color: '#64748B', marginBottom: 4 }}>
                                {prescription.dosage} • {prescription.frequency}
                              </p>
                              <p style={{ fontSize: 13, color: '#94A3B8' }}>
                                Prescribed for {prescription.prescribedFor}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 18px',
                            background: prescription.refillsRemaining > 0
                              ? 'linear-gradient(135deg, #10B981 0%, #34D399 100%)'
                              : 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'white',
                            boxShadow: prescription.refillsRemaining > 0
                              ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                              : '0 4px 12px rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <Check size={16} />
                          {prescription.refillsRemaining} {prescription.refillsRemaining === 1 ? 'Refill' : 'Refills'}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(4, 1fr)',
                          gap: 20,
                          padding: 20,
                          background: isDarkMode
                            ? 'rgba(15, 23, 42, 0.6)'
                            : 'rgba(241, 245, 249, 0.8)',
                          borderRadius: 16,
                          marginBottom: 20,
                          border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Doctor
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <User size={14} color="#06B6D4" />
                            {prescription.doctorName}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quantity
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                            {prescription.quantity} tablets
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Prescribed
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={14} color="#06B6D4" />
                            {prescription.prescribedDate}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Expires
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} color="#F59E0B" />
                            {prescription.expiresDate}
                          </div>
                        </div>
                      </div>

                      {/* Instructions Banner */}
                      <div
                        style={{
                          padding: 16,
                          background: isDarkMode
                            ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
                            : 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                          border: isDarkMode ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid #FDE68A',
                          borderRadius: 12,
                          marginBottom: 20,
                        }}
                      >
                        <div style={{ display: 'flex', gap: 12 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              background: '#F59E0B',
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <AlertCircle size={18} color="white" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#FCD34D' : '#92400E', marginBottom: 4 }}>
                              Dosage Instructions
                            </div>
                            <div style={{ fontSize: 14, color: isDarkMode ? '#FDE68A' : '#78350F', lineHeight: 1.5 }}>
                              {prescription.instructions}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12 }}>
                        <button
                          onClick={() => handleRequestRefill(prescription)}
                          disabled={prescription.refillsRemaining === 0}
                          style={{
                            padding: '14px 24px',
                            background:
                              prescription.refillsRemaining === 0
                                ? isDarkMode ? '#334155' : '#E2E8F0'
                                : 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                            border: 'none',
                            borderRadius: 12,
                            color: 'white',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: prescription.refillsRemaining === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            opacity: prescription.refillsRemaining === 0 ? 0.5 : 1,
                            boxShadow: prescription.refillsRemaining > 0 ? '0 4px 16px rgba(6, 182, 212, 0.4)' : 'none',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            if (prescription.refillsRemaining > 0) {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 6px 24px rgba(6, 182, 212, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (prescription.refillsRemaining > 0) {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(6, 182, 212, 0.4)';
                            }
                          }}
                        >
                          <Send size={18} />
                          {prescription.refillsRemaining === 0 ? 'No Refills' : 'Request Refill'}
                        </button>
                        <button
                          onClick={() => handleSetReminder(prescription)}
                          style={{
                            padding: '14px 20px',
                            background: isDarkMode
                              ? 'rgba(51, 65, 85, 0.6)'
                              : 'white',
                            border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                            borderRadius: 12,
                            color: isDarkMode ? '#F8FAFC' : '#334155',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? 'rgba(51, 65, 85, 0.6)' : 'white';
                            e.currentTarget.style.color = isDarkMode ? '#F8FAFC' : '#334155';
                            e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Bell size={16} />
                          Remind
                        </button>
                        <div style={{ position: 'relative' }}>
                          <button
                            onClick={() => setShowCalendarOptions(showCalendarOptions === prescription.id ? null : prescription.id)}
                            style={{
                              width: '100%',
                              padding: '14px 20px',
                              background: isDarkMode
                                ? 'rgba(51, 65, 85, 0.6)'
                                : 'white',
                              border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                              borderRadius: 12,
                              color: isDarkMode ? '#F8FAFC' : '#334155',
                              fontSize: 14,
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 8,
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
                              e.currentTarget.style.color = 'white';
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isDarkMode ? 'rgba(51, 65, 85, 0.6)' : 'white';
                              e.currentTarget.style.color = isDarkMode ? '#F8FAFC' : '#334155';
                              e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <CalendarPlus size={16} />
                            Export
                          </button>
                          {showCalendarOptions === prescription.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 12px)',
                                right: 0,
                                background: isDarkMode
                                  ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                                  : 'white',
                                border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                                borderRadius: 16,
                                boxShadow: isDarkMode
                                  ? '0 20px 60px rgba(0,0,0,0.5)'
                                  : '0 20px 60px rgba(0,0,0,0.15)',
                                minWidth: 240,
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
                                  padding: '14px 18px',
                                  background: 'transparent',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: isDarkMode ? '#F8FAFC' : '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = isDarkMode ? '#F8FAFC' : '#334155';
                                }}
                              >
                                <Calendar size={18} />
                                Google Calendar
                              </button>
                              <div
                                style={{
                                  height: 1,
                                  background: isDarkMode ? '#334155' : '#E2E8F0',
                                  margin: '4px 0',
                                }}
                              />
                              <button
                                onClick={() => {
                                  generateICSFile(prescription);
                                  setShowCalendarOptions(null);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '14px 18px',
                                  background: 'transparent',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: 14,
                                  fontWeight: 600,
                                  color: isDarkMode ? '#F8FAFC' : '#334155',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)';
                                  e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = isDarkMode ? '#F8FAFC' : '#334155';
                                }}
                              >
                                <Calendar size={18} />
                                Apple Calendar (.ics)
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

            {/* Refill Requests Section */}
            <div>
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 800,
                  color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  marginBottom: 20,
                  letterSpacing: '-0.01em',
                }}
              >
                Refill Request History
              </h2>
              <div style={{ display: 'grid', gap: 20 }}>
                {refillRequests.length === 0 ? (
                  <div
                    style={{
                      background: isDarkMode ? '#1E293B' : 'white',
                      borderRadius: 20,
                      padding: 64,
                      textAlign: 'center',
                      color: '#64748B',
                      boxShadow: isDarkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.06)',
                    }}
                  >
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        opacity: 0.5,
                      }}
                    >
                      <Send size={32} color="white" />
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>No refill requests yet</div>
                  </div>
                ) : (
                  refillRequests.map((request) => (
                    <div
                      key={request.id}
                      style={{
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1E293B 0%, #334155 100%)'
                          : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)',
                        borderRadius: 20,
                        padding: 28,
                        border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                        boxShadow: isDarkMode
                          ? '0 10px 40px rgba(0,0,0,0.3)'
                          : '0 10px 40px rgba(0,0,0,0.06)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Decorative gradient */}
                      <div
                        style={{
                          position: 'absolute',
                          top: -60,
                          right: -60,
                          width: 180,
                          height: 180,
                          background: `radial-gradient(circle, ${getStatusColor(request.status)}20 0%, transparent 70%)`,
                          borderRadius: '50%',
                        }}
                      />

                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 20, fontWeight: 800, color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: 6, letterSpacing: '-0.01em' }}>
                            {request.medicationName}
                          </h3>
                          <p style={{ fontSize: 14, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={14} />
                            Requested on {request.requestDate}
                          </p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '10px 18px',
                            background: `${getStatusColor(request.status)}`,
                            borderRadius: 12,
                            fontSize: 13,
                            fontWeight: 700,
                            color: 'white',
                            boxShadow: `0 4px 12px ${getStatusColor(request.status)}40`,
                          }}
                        >
                          {getStatusIcon(request.status)}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                        <div
                          style={{
                            padding: 16,
                            background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                            borderRadius: 12,
                            border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quantity
                          </div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>
                            {request.requestedQuantity} tablets
                          </div>
                        </div>
                        <div
                          style={{
                            padding: 16,
                            background: isDarkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)',
                            borderRadius: 12,
                            border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                            gridColumn: 'span 2',
                          }}
                        >
                          <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Pharmacy
                          </div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MapPin size={16} color="#06B6D4" />
                            {request.pharmacyName}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>{request.pharmacyAddress}</div>
                        </div>
                      </div>

                      {request.requestNotes && (
                        <div
                          style={{
                            padding: 16,
                            background: isDarkMode
                              ? 'rgba(148, 163, 184, 0.1)'
                              : 'rgba(241, 245, 249, 1)',
                            borderRadius: 12,
                            marginBottom: 12,
                            border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#64748B', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Your Notes
                          </div>
                          <div style={{ fontSize: 14, color: isDarkMode ? '#CBD5E1' : '#475569', lineHeight: 1.5 }}>{request.requestNotes}</div>
                        </div>
                      )}

                      {request.doctorNotes && (
                        <div
                          style={{
                            padding: 16,
                            background: isDarkMode
                              ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)'
                              : 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                            border: isDarkMode ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid #7DD3FC',
                            borderRadius: 12,
                          }}
                        >
                          <div style={{ display: 'flex', gap: 12 }}>
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                background: '#0EA5E9',
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <User size={18} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#7DD3FC' : '#0369A1', marginBottom: 4 }}>
                                Doctor's Response
                              </div>
                              <div style={{ fontSize: 14, color: isDarkMode ? '#BAE6FD' : '#075985', lineHeight: 1.5 }}>{request.doctorNotes}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
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
