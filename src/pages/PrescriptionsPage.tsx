import { useState, useEffect } from 'react';
import { Pill, Calendar, User, MapPin, FileText, Send, Check, Clock, X, AlertCircle, CalendarPlus, Bell, CreditCard as Edit2, Search, Download, Plus, ChevronRight } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

  const { userId } = useAuth();
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
    fetchPrescriptions();
    fetchRefillRequests();
    fetchPreferredPharmacy();
    fetchAvailablePharmacies();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      if (!userId) return;

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!patientData) {
        setLoading(false);
        return;
      }

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

      if (!prescriptionsData || prescriptionsData.length === 0) {
        await supabase.rpc('create_sample_prescription_data', { target_user_id: userId });

        const { data: retryData } = await supabase
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

        if (retryData) {
          const formatted = retryData.flatMap((prescription) => {
            const medications = prescription.medications as any[];
            return medications.map((med: any, index: number) => ({
              id: `${prescription.id}-${index}`,
              medicationName: med.name,
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
          setPrescriptions(formatted);
        }
      } else {
        const formattedPrescriptions: Prescription[] = prescriptionsData.flatMap((prescription) => {
          const medications = prescription.medications as any[];
          return medications.map((med: any, index: number) => ({
            id: `${prescription.id}-${index}`,
            medicationName: med.name,
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
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRefillRequests = async () => {
    try {
      if (!userId) return;

      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', userId)
        .maybeSingle();

      if (!patientData) return;

      const { data, error } = await supabase
        .from('refill_requests')
        .select('*')
        .eq('patient_id', patientData.id)
        .order('created_at', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

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
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_pharmacies')
        .select('*')
        .eq('user_id', userId)
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
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_pharmacies')
        .select('*')
        .eq('user_id', userId)
        .order('is_preferred', { ascending: false });

      if (error && error.code !== 'PGRST116') throw error;

      setAvailablePharmacies(data || []);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
    }
  };

  const handleSelectPharmacy = async (pharmacy: any) => {
    try {
      if (!userId) return;

      await supabase
        .from('user_pharmacies')
        .update({ is_preferred: false })
        .eq('user_id', userId);

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
      if (!userId) return;
      const { error } = await supabase
        .from('user_pharmacies')
        .insert({
          user_id: userId,
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
    if (!selectedPrescription) return;

    try {
      if (!userId) return;
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', userId)
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
    if (!selectedPrescription) return;

    try {
      if (!userId) return;
      const { data: patientData } = await supabase
        .from('patients')
        .select('id')
        .eq('id', userId)
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

  if (loading) {
    return (
      <PatientLayout activeNav="prescriptions">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, color: '#64748B' }}>Loading your prescriptions...</div>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout activeNav="prescriptions">
      <div
        style={{
          minHeight: '100vh',
          background: isDarkMode ? '#0F172A' : '#F8FAFC',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                background: isDarkMode
                  ? 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)'
                  : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8,
                letterSpacing: '-0.03em',
              }}
            >
              My Medications
            </h1>
            <p style={{ fontSize: 18, color: '#64748B', fontWeight: 500 }}>
              Manage your prescriptions, request refills, and track your medications
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
            <div
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                  : 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 20px 60px rgba(59, 130, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <div style={{ position: 'relative' }}>
                <Pill size={32} color="rgba(255, 255, 255, 0.9)" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' }}>
                  ACTIVE MEDICATIONS
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'white' }}>
                  {prescriptions.filter((p) => p.status === 'active').length}
                </div>
              </div>
            </div>

            <div
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <div style={{ position: 'relative' }}>
                <Download size={32} color="rgba(255, 255, 255, 0.9)" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' }}>
                  REFILLS AVAILABLE
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'white' }}>
                  {prescriptions.reduce((sum, p) => sum + p.refillsRemaining, 0)}
                </div>
              </div>
            </div>

            <div
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                  : 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 20px 60px rgba(245, 158, 11, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <div style={{ position: 'relative' }}>
                <Clock size={32} color="rgba(255, 255, 255, 0.9)" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' }}>
                  PENDING REFILLS
                </div>
                <div style={{ fontSize: 40, fontWeight: 800, color: 'white' }}>
                  {refillRequests.filter((r) => r.status === 'pending').length}
                </div>
              </div>
            </div>

            <div
              style={{
                background: isDarkMode
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                  : 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
                borderRadius: 20,
                padding: 28,
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -30,
                  right: -30,
                  width: 150,
                  height: 150,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)',
                }}
              />
              <div style={{ position: 'relative' }}>
                <MapPin size={32} color="rgba(255, 255, 255, 0.9)" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.5px' }}>
                  PREFERRED PHARMACY
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedPharmacy.name}
                </div>
                <button
                  onClick={() => setShowPharmacyModal(true)}
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Change Pharmacy
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 20,
              }}
            >
              Active Prescriptions
            </h2>

            <div style={{ display: 'grid', gap: 20 }}>
              {prescriptions.filter(p => p.status === 'active').map((prescription) => (
                <div
                  key={prescription.id}
                  style={{
                    background: isDarkMode ? '#1E293B' : 'white',
                    borderRadius: 20,
                    padding: 32,
                    border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    boxShadow: isDarkMode
                      ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                      : '0 10px 40px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                      : '0 20px 60px rgba(0, 0, 0, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = isDarkMode
                      ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                      : '0 10px 40px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, marginBottom: 24 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <Pill size={28} color="white" />
                        </div>
                        <div>
                          <h3
                            style={{
                              fontSize: 24,
                              fontWeight: 700,
                              color: isDarkMode ? '#F1F5F9' : '#1E293B',
                              marginBottom: 4,
                            }}
                          >
                            {prescription.medicationName}
                          </h3>
                          <div style={{ fontSize: 15, color: '#64748B', fontWeight: 500 }}>
                            {prescription.dosage} • {prescription.frequency}
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 14px',
                          background: isDarkMode ? '#334155' : '#F1F5F9',
                          borderRadius: 10,
                          marginBottom: 16,
                        }}
                      >
                        <AlertCircle size={16} color="#64748B" />
                        <span style={{ fontSize: 14, color: '#64748B', fontWeight: 600 }}>
                          {prescription.prescribedFor}
                        </span>
                      </div>

                      <div
                        style={{
                          padding: 20,
                          background: isDarkMode ? '#0F172A' : '#F8FAFC',
                          borderRadius: 12,
                          marginBottom: 20,
                        }}
                      >
                        <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 8 }}>
                          INSTRUCTIONS
                        </div>
                        <div style={{ fontSize: 15, color: isDarkMode ? '#CBD5E1' : '#475569', lineHeight: 1.6 }}>
                          {prescription.instructions}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <div>
                          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
                            PRESCRIBING DOCTOR
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={18} color="#3B82F6" />
                            <span style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {prescription.doctorName}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
                            PRESCRIBED DATE
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Calendar size={18} color="#8B5CF6" />
                            <span style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {prescription.prescribedDate}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
                            EXPIRES ON
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Clock size={18} color="#F59E0B" />
                            <span style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {prescription.expiresDate}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 6, fontWeight: 600 }}>
                            REFILLS REMAINING
                          </div>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 40,
                              height: 40,
                              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                              borderRadius: 10,
                              fontSize: 18,
                              fontWeight: 800,
                              color: 'white',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            }}
                          >
                            {prescription.refillsRemaining}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <button
                        onClick={() => handleRequestRefill(prescription)}
                        disabled={prescription.refillsRemaining === 0}
                        style={{
                          padding: '14px 24px',
                          background: prescription.refillsRemaining === 0
                            ? '#94A3B8'
                            : 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          border: 'none',
                          borderRadius: 12,
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: prescription.refillsRemaining === 0 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          boxShadow: prescription.refillsRemaining === 0
                            ? 'none'
                            : '0 8px 20px rgba(59, 130, 246, 0.4)',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          if (prescription.refillsRemaining > 0) {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.5)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = prescription.refillsRemaining === 0
                            ? 'none'
                            : '0 8px 20px rgba(59, 130, 246, 0.4)';
                        }}
                      >
                        <Send size={18} />
                        Request Refill
                      </button>

                      <button
                        onClick={() => handleSetReminder(prescription)}
                        style={{
                          padding: '14px 24px',
                          background: isDarkMode ? '#334155' : 'white',
                          border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                          borderRadius: 12,
                          color: isDarkMode ? '#F1F5F9' : '#334155',
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = 'transparent';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDarkMode ? '#334155' : 'white';
                          e.currentTarget.style.color = isDarkMode ? '#F1F5F9' : '#334155';
                          e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <Bell size={18} />
                        Set Reminder
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() =>
                            setShowCalendarOptions(
                              showCalendarOptions === prescription.id ? null : prescription.id
                            )
                          }
                          style={{
                            padding: '14px 24px',
                            background: isDarkMode ? '#334155' : 'white',
                            border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                            borderRadius: 12,
                            color: isDarkMode ? '#F1F5F9' : '#334155',
                            fontSize: 15,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                            width: '100%',
                            whiteSpace: 'nowrap',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = isDarkMode ? '#334155' : 'white';
                            e.currentTarget.style.color = isDarkMode ? '#F1F5F9' : '#334155';
                            e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <CalendarPlus size={18} />
                          Add to Calendar
                        </button>

                        {showCalendarOptions === prescription.id && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '100%',
                              right: 0,
                              marginTop: 8,
                              background: isDarkMode ? '#1E293B' : 'white',
                              borderRadius: 12,
                              padding: 8,
                              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
                              border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                              zIndex: 10,
                              minWidth: 200,
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
                                borderRadius: 8,
                                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#334155' : '#F1F5F9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              Google Calendar
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
                                borderRadius: 8,
                                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = isDarkMode ? '#334155' : '#F1F5F9';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              Google / iPhone Calendar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {refillRequests.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  marginBottom: 20,
                }}
              >
                Refill Requests
              </h2>

              <div style={{ display: 'grid', gap: 16 }}>
                {refillRequests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      background: isDarkMode ? '#1E293B' : 'white',
                      borderRadius: 16,
                      padding: 24,
                      border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                      boxShadow: isDarkMode
                        ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                        : '0 4px 12px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <h3
                            style={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: isDarkMode ? '#F1F5F9' : '#1E293B',
                            }}
                          >
                            {request.medicationName}
                          </h3>
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 12px',
                              background: `${getStatusColor(request.status)}15`,
                              borderRadius: 8,
                            }}
                          >
                            <div style={{ color: getStatusColor(request.status) }}>
                              {getStatusIcon(request.status)}
                            </div>
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: getStatusColor(request.status),
                                textTransform: 'uppercase',
                              }}
                            >
                              {request.status}
                            </span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                          <div>
                            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                              QUANTITY
                            </div>
                            <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {request.requestedQuantity} units
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                              REQUESTED ON
                            </div>
                            <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {request.requestDate}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                              PHARMACY
                            </div>
                            <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                              {request.pharmacyName}
                            </div>
                          </div>
                        </div>

                        {request.requestNotes && (
                          <div
                            style={{
                              padding: 16,
                              background: isDarkMode ? '#0F172A' : '#F8FAFC',
                              borderRadius: 10,
                              marginBottom: 12,
                            }}
                          >
                            <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600, marginBottom: 6 }}>
                              YOUR NOTE
                            </div>
                            <div style={{ fontSize: 14, color: isDarkMode ? '#CBD5E1' : '#475569' }}>
                              {request.requestNotes}
                            </div>
                          </div>
                        )}

                        {request.doctorNotes && (
                          <div
                            style={{
                              padding: 16,
                              background: isDarkMode ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                              borderRadius: 10,
                              border: '1px solid rgba(16, 185, 129, 0.2)',
                            }}
                          >
                            <div style={{ fontSize: 13, color: '#10B981', fontWeight: 600, marginBottom: 6 }}>
                              DOCTOR'S RESPONSE
                            </div>
                            <div style={{ fontSize: 14, color: isDarkMode ? '#CBD5E1' : '#475569' }}>
                              {request.doctorNotes}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showRefillModal && selectedPrescription && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
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
              background: isDarkMode ? '#1E293B' : 'white',
              borderRadius: 24,
              padding: 40,
              maxWidth: 600,
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 8,
              }}
            >
              Request Refill
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32 }}>
              {selectedPrescription.medicationName}
            </p>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDarkMode ? '#F1F5F9' : '#334155',
                  marginBottom: 8,
                }}
              >
                Quantity
              </label>
              <input
                type="number"
                value={refillQuantity}
                onChange={(e) => setRefillQuantity(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #CBD5E1',
                  borderRadius: 12,
                  fontSize: 16,
                  color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  fontWeight: 600,
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDarkMode ? '#F1F5F9' : '#334155',
                  marginBottom: 8,
                }}
              >
                Pharmacy
              </label>
              <div
                style={{
                  padding: 16,
                  background: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderRadius: 12,
                  border: isDarkMode ? '1px solid #334155' : '1px solid #CBD5E1',
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F1F5F9' : '#1E293B', marginBottom: 4 }}>
                  {selectedPharmacy.name}
                </div>
                <div style={{ fontSize: 14, color: '#64748B' }}>{selectedPharmacy.address}</div>
              </div>
            </div>

            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDarkMode ? '#F1F5F9' : '#334155',
                  marginBottom: 8,
                }}
              >
                Additional Notes (Optional)
              </label>
              <textarea
                value={refillNotes}
                onChange={(e) => setRefillNotes(e.target.value)}
                placeholder="Any special instructions or information for the doctor..."
                style={{
                  width: '100%',
                  minHeight: 120,
                  padding: '14px 16px',
                  background: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #CBD5E1',
                  borderRadius: 12,
                  fontSize: 15,
                  color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowRefillModal(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: isDarkMode ? '#334155' : '#F1F5F9',
                  border: 'none',
                  borderRadius: 12,
                  color: isDarkMode ? '#F1F5F9' : '#475569',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#334155' : '#F1F5F9';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitRefill}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  border: 'none',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                }}
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {showReminderModal && selectedPrescription && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
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
              background: isDarkMode ? '#1E293B' : 'white',
              borderRadius: 24,
              padding: 40,
              maxWidth: 600,
              width: '100%',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 8,
              }}
            >
              Set Medication Reminder
            </h2>
            <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32 }}>
              {selectedPrescription.medicationName}
            </p>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isDarkMode ? '#F1F5F9' : '#334155',
                  }}
                >
                  Reminder Times
                </label>
                <button
                  onClick={addReminderTime}
                  style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Plus size={16} />
                  Add Time
                </button>
              </div>

              {reminderTimes.map((time, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    gap: 12,
                    marginBottom: 12,
                  }}
                >
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => updateReminderTime(index, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '14px 16px',
                      background: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: isDarkMode ? '1px solid #334155' : '1px solid #CBD5E1',
                      borderRadius: 12,
                      fontSize: 16,
                      color: isDarkMode ? '#F1F5F9' : '#1E293B',
                      fontWeight: 600,
                    }}
                  />
                  {reminderTimes.length > 1 && (
                    <button
                      onClick={() => removeReminderTime(index)}
                      style={{
                        padding: '14px 16px',
                        background: isDarkMode ? '#334155' : '#F1F5F9',
                        border: 'none',
                        borderRadius: 12,
                        color: '#DC2626',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: isDarkMode ? '#F1F5F9' : '#334155',
                  marginBottom: 8,
                }}
              >
                End Date (Optional)
              </label>
              <input
                type="date"
                value={reminderEndDate}
                onChange={(e) => setReminderEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: isDarkMode ? '#0F172A' : '#F8FAFC',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #CBD5E1',
                  borderRadius: 12,
                  fontSize: 16,
                  color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  fontWeight: 600,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowReminderModal(false)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: isDarkMode ? '#334155' : '#F1F5F9',
                  border: 'none',
                  borderRadius: 12,
                  color: isDarkMode ? '#F1F5F9' : '#475569',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDarkMode ? '#334155' : '#F1F5F9';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReminder}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  border: 'none',
                  borderRadius: 12,
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(139, 92, 246, 0.4)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(139, 92, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                }}
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {showPharmacyModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
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
              background: isDarkMode ? '#1E293B' : 'white',
              borderRadius: 24,
              padding: 40,
              maxWidth: 700,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 32,
              }}
            >
              Select Pharmacy
            </h2>

            <div style={{ display: 'grid', gap: 16 }}>
              {availablePharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  onClick={() => handleSelectPharmacy(pharmacy)}
                  style={{
                    padding: 24,
                    background: pharmacy.is_preferred
                      ? isDarkMode
                        ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                        : 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)'
                      : isDarkMode
                      ? '#334155'
                      : '#F8FAFC',
                    borderRadius: 16,
                    cursor: 'pointer',
                    border: pharmacy.is_preferred
                      ? 'none'
                      : isDarkMode
                      ? '1px solid #475569'
                      : '1px solid #CBD5E1',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!pharmacy.is_preferred) {
                      e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                    }
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    if (!pharmacy.is_preferred) {
                      e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                    }
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: pharmacy.is_preferred ? 'white' : isDarkMode ? '#F1F5F9' : '#1E293B',
                          marginBottom: 6,
                        }}
                      >
                        {pharmacy.pharmacy_name}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: pharmacy.is_preferred ? 'rgba(255, 255, 255, 0.8)' : '#64748B',
                        }}
                      >
                        {pharmacy.pharmacy_address}
                      </div>
                    </div>
                    {pharmacy.is_preferred && (
                      <div
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          color: 'white',
                        }}
                      >
                        PREFERRED
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPharmacyModal(false)}
              style={{
                marginTop: 24,
                width: '100%',
                padding: '16px',
                background: isDarkMode ? '#334155' : '#F1F5F9',
                border: 'none',
                borderRadius: 12,
                color: isDarkMode ? '#F1F5F9' : '#475569',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDarkMode ? '#334155' : '#F1F5F9';
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
