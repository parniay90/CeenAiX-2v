import { useState } from 'react';
import { Pill, Calendar, User, MapPin, FileText, Send, Check, Clock, X, AlertCircle, CalendarPlus } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';

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

  const [showCalendarOptions, setShowCalendarOptions] = useState<string | null>(null);

  const [prescriptions] = useState<Prescription[]>([
    {
      id: '1',
      medicationName: 'Metformin 500mg',
      dosage: '500mg',
      frequency: 'Twice daily',
      quantity: 60,
      refillsRemaining: 3,
      prescribedDate: 'Jan 15, 2026',
      expiresDate: 'Jul 15, 2026',
      prescribedFor: 'Type 2 Diabetes',
      doctorName: 'Dr. Layla Al Mansoori',
      instructions: 'Take with meals. Monitor blood sugar levels regularly.',
      status: 'active',
    },
    {
      id: '2',
      medicationName: 'Atorvastatin 20mg',
      dosage: '20mg',
      frequency: 'Once daily (evening)',
      quantity: 30,
      refillsRemaining: 2,
      prescribedDate: 'Jan 15, 2026',
      expiresDate: 'Jul 15, 2026',
      prescribedFor: 'High cholesterol',
      doctorName: 'Dr. Layla Al Mansoori',
      instructions: 'Take in the evening. Avoid grapefruit juice.',
      status: 'active',
    },
  ]);

  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([
    {
      id: '1',
      prescriptionId: '1',
      medicationName: 'Metformin 500mg',
      requestedQuantity: 60,
      pharmacyName: 'Dubai Pharmacy',
      pharmacyAddress: 'Dubai Mall, Sheikh Zayed Road',
      requestNotes: 'Running low on medication',
      status: 'pending',
      requestDate: 'Mar 10, 2026',
    },
  ]);

  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [refillQuantity, setRefillQuantity] = useState(0);
  const [selectedPharmacy, setSelectedPharmacy] = useState({
    name: 'Dubai Pharmacy',
    address: 'Dubai Mall, Sheikh Zayed Road, Dubai',
    phone: '+971 4 XXX XXXX',
  });
  const [refillNotes, setRefillNotes] = useState('');

  const handleRequestRefill = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setRefillQuantity(prescription.quantity);
    setShowRefillModal(true);
  };

  const handleSubmitRefill = () => {
    if (selectedPrescription) {
      const newRequest: RefillRequest = {
        id: Date.now().toString(),
        prescriptionId: selectedPrescription.id,
        medicationName: selectedPrescription.medicationName,
        requestedQuantity: refillQuantity,
        pharmacyName: selectedPharmacy.name,
        pharmacyAddress: selectedPharmacy.address,
        requestNotes: refillNotes,
        status: 'pending',
        requestDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setRefillRequests([newRequest, ...refillRequests]);
      setShowRefillModal(false);
      setRefillNotes('');
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
                            Reminder
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
    </PatientLayout>
  );
}
