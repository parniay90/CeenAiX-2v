import { useState } from 'react';
import { Check, X, Clock, Pill, User, MapPin, FileText, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface RefillRequest {
  id: string;
  prescriptionId: string;
  patientName: string;
  patientId: string;
  medicationName: string;
  dosage: string;
  requestedQuantity: number;
  refillsRemaining: number;
  pharmacyName: string;
  pharmacyAddress: string;
  requestNotes: string;
  status: 'pending' | 'approved' | 'denied' | 'fulfilled';
  requestDate: string;
  doctorNotes?: string;
  lastPrescribedDate: string;
  prescribedFor: string;
}

export default function DoctorRefillApproval() {
  const { isDarkMode } = useTheme();

  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([
    {
      id: '1',
      prescriptionId: 'RX-2026-001',
      patientName: 'Fatima Al Hashimi',
      patientId: 'P-12345',
      medicationName: 'Metformin',
      dosage: '500mg',
      requestedQuantity: 60,
      refillsRemaining: 3,
      pharmacyName: 'Dubai Pharmacy',
      pharmacyAddress: 'Dubai Mall, Sheikh Zayed Road, Dubai',
      requestNotes: 'Running low on medication, need refill before travel',
      status: 'pending',
      requestDate: 'Mar 14, 2026',
      lastPrescribedDate: 'Jan 15, 2026',
      prescribedFor: 'Type 2 Diabetes',
    },
    {
      id: '2',
      prescriptionId: 'RX-2026-045',
      patientName: 'Omar Al Zaabi',
      patientId: 'P-67890',
      medicationName: 'Lisinopril',
      dosage: '10mg',
      requestedQuantity: 30,
      refillsRemaining: 2,
      pharmacyName: 'HealthPlus Pharmacy',
      pharmacyAddress: 'Marina Walk, Dubai Marina',
      requestNotes: '',
      status: 'pending',
      requestDate: 'Mar 15, 2026',
      lastPrescribedDate: 'Feb 1, 2026',
      prescribedFor: 'Hypertension',
    },
    {
      id: '3',
      prescriptionId: 'RX-2026-023',
      patientName: 'Sara Mohammed',
      patientId: 'P-54321',
      medicationName: 'Atorvastatin',
      dosage: '20mg',
      requestedQuantity: 30,
      refillsRemaining: 1,
      pharmacyName: 'City Pharmacy',
      pharmacyAddress: 'Downtown Dubai',
      requestNotes: '',
      status: 'approved',
      requestDate: 'Mar 13, 2026',
      lastPrescribedDate: 'Jan 20, 2026',
      prescribedFor: 'High Cholesterol',
      doctorNotes: 'Approved. Patient compliance has been excellent.',
    },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<RefillRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'deny' | null>(null);

  const handleReviewRequest = (request: RefillRequest, action: 'approve' | 'deny') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setShowReviewModal(true);
    setDoctorNotes('');
  };

  const handleSubmitReview = () => {
    if (selectedRequest && reviewAction) {
      setRefillRequests(
        refillRequests.map((req) =>
          req.id === selectedRequest.id
            ? {
                ...req,
                status: reviewAction === 'approve' ? 'approved' : 'denied',
                doctorNotes: doctorNotes,
              }
            : req
        )
      );
      setShowReviewModal(false);
      setSelectedRequest(null);
      setDoctorNotes('');
      setReviewAction(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'denied':
        return '#DC2626';
      case 'fulfilled':
        return '#0EA5E9';
      default:
        return '#64748B';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check size={14} />;
      case 'pending':
        return <Clock size={14} />;
      case 'denied':
        return <X size={14} />;
      default:
        return null;
    }
  };

  const pendingRequests = refillRequests.filter((req) => req.status === 'pending');
  const reviewedRequests = refillRequests.filter((req) => req.status !== 'pending');

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDarkMode ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
        padding: '32px 24px',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
              marginBottom: 8,
            }}
          >
            Prescription Refill Requests
          </h1>
          <p style={{ fontSize: 15, color: '#64748B' }}>
            Review and approve prescription refill requests from your patients
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 32 }}>
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 24,
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={24} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                  {pendingRequests.length}
                </div>
                <div style={{ fontSize: 13, color: '#64748B' }}>Pending Requests</div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 24,
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #22C55E, #10B981)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Check size={24} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                  {refillRequests.filter((r) => r.status === 'approved').length}
                </div>
                <div style={{ fontSize: 13, color: '#64748B' }}>Approved Today</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 32 }}>
          {/* Pending Requests */}
          {pendingRequests.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <Clock size={20} color="#F59E0B" />
                Pending Review ({pendingRequests.length})
              </h2>
              <div style={{ display: 'grid', gap: 16 }}>
                {pendingRequests.map((request) => (
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
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24 }}>
                      {/* Left Side - Request Details */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, #0D7377, #14FFEC)',
                              borderRadius: 12,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <User size={24} color="white" />
                          </div>
                          <div>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.patientName}
                            </h3>
                            <p style={{ fontSize: 13, color: '#64748B' }}>
                              Patient ID: {request.patientId} • Requested {request.requestDate}
                            </p>
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
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <Pill size={14} color="#0D7377" />
                              <div style={{ fontSize: 12, color: '#64748B' }}>Medication</div>
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.medicationName} {request.dosage}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Requested Quantity</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.requestedQuantity} tablets
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Prescribed For</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.prescribedFor}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Refills Remaining</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#22C55E' }}>
                              {request.refillsRemaining} refills
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Last Prescribed</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.lastPrescribedDate}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>Prescription ID</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                              {request.prescriptionId}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            padding: 14,
                            background: isDarkMode ? '#1A1A2E' : '#F0F9FF',
                            border: '1px solid #BAE6FD',
                            borderRadius: 10,
                            marginBottom: 12,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'start', gap: 8 }}>
                            <MapPin size={16} color="#0369A1" style={{ marginTop: 2, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 600, color: '#0369A1', marginBottom: 2 }}>
                                Pharmacy
                              </div>
                              <div style={{ fontSize: 13, color: '#075985' }}>
                                {request.pharmacyName} - {request.pharmacyAddress}
                              </div>
                            </div>
                          </div>
                        </div>

                        {request.requestNotes && (
                          <div
                            style={{
                              padding: 14,
                              background: '#FEF3C7',
                              border: '1px solid #FDE68A',
                              borderRadius: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'start', gap: 8 }}>
                              <FileText size={16} color="#D97706" style={{ marginTop: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#92400E', marginBottom: 2 }}>
                                  Patient Notes
                                </div>
                                <div style={{ fontSize: 13, color: '#78350F' }}>{request.requestNotes}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Side - Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 140 }}>
                        <button
                          onClick={() => handleReviewRequest(request, 'approve')}
                          style={{
                            padding: '12px 20px',
                            background: 'linear-gradient(135deg, #22C55E, #10B981)',
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
                            transition: 'all 0.2s',
                          }}
                        >
                          <Check size={16} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReviewRequest(request, 'deny')}
                          style={{
                            padding: '12px 20px',
                            background: 'white',
                            border: '1px solid #FEE2E2',
                            borderRadius: 10,
                            color: '#DC2626',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                          }}
                        >
                          <X size={16} />
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviewed Requests */}
          {reviewedRequests.length > 0 && (
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  marginBottom: 16,
                }}
              >
                Recently Reviewed
              </h2>
              <div style={{ display: 'grid', gap: 16 }}>
                {reviewedRequests.map((request) => (
                  <div
                    key={request.id}
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 20,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      opacity: 0.8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                            {request.patientName}
                          </h3>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '4px 10px',
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
                        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 8 }}>
                          {request.medicationName} {request.dosage} - {request.requestedQuantity} tablets
                        </div>
                        {request.doctorNotes && (
                          <div
                            style={{
                              padding: 10,
                              background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
                              borderRadius: 8,
                              fontSize: 12,
                              color: '#64748B',
                            }}
                          >
                            <strong>Your notes:</strong> {request.doctorNotes}
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: 12, color: '#64748B', textAlign: 'right' }}>
                        {request.requestDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {refillRequests.length === 0 && (
            <div
              style={{
                background: isDarkMode ? '#16213E' : 'white',
                borderRadius: 16,
                padding: 64,
                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: isDarkMode ? '#F8FAFC' : '#1A1A2E', marginBottom: 8 }}>
                No Refill Requests
              </h3>
              <p style={{ fontSize: 14, color: '#64748B' }}>
                You don't have any prescription refill requests at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
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
          onClick={() => setShowReviewModal(false)}
        >
          <div
            style={{
              background: isDarkMode ? '#16213E' : 'white',
              borderRadius: 16,
              padding: 32,
              maxWidth: 600,
              width: '100%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                marginBottom: 8,
              }}
            >
              {reviewAction === 'approve' ? 'Approve' : 'Deny'} Refill Request
            </h3>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
              {selectedRequest.patientName} - {selectedRequest.medicationName} {selectedRequest.dosage}
            </p>

            <div
              style={{
                padding: 16,
                background: reviewAction === 'approve' ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${reviewAction === 'approve' ? '#BBF7D0' : '#FEE2E2'}`,
                borderRadius: 12,
                marginBottom: 24,
              }}
            >
              <div style={{ display: 'flex', gap: 10 }}>
                <AlertCircle size={18} color={reviewAction === 'approve' ? '#16A34A' : '#DC2626'} />
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: reviewAction === 'approve' ? '#16A34A' : '#DC2626',
                      marginBottom: 4,
                    }}
                  >
                    {reviewAction === 'approve' ? 'Approving Refill Request' : 'Denying Refill Request'}
                  </div>
                  <div style={{ fontSize: 12, color: reviewAction === 'approve' ? '#15803D' : '#991B1B' }}>
                    {reviewAction === 'approve'
                      ? 'The pharmacy will be notified and can dispense the medication.'
                      : 'The patient will be notified of your decision.'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isDarkMode ? '#CBD5E1' : '#475569',
                  display: 'block',
                  marginBottom: 8,
                }}
              >
                Add Notes {reviewAction === 'deny' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                placeholder={
                  reviewAction === 'approve'
                    ? 'Add any instructions or notes for the patient...'
                    : 'Please provide a reason for denial...'
                }
                rows={4}
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

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowReviewModal(false)}
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
                onClick={handleSubmitReview}
                disabled={reviewAction === 'deny' && !doctorNotes.trim()}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  background:
                    reviewAction === 'deny' && !doctorNotes.trim()
                      ? '#E2E8F0'
                      : reviewAction === 'approve'
                      ? 'linear-gradient(135deg, #22C55E, #10B981)'
                      : '#DC2626',
                  border: 'none',
                  borderRadius: 10,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: reviewAction === 'deny' && !doctorNotes.trim() ? 'not-allowed' : 'pointer',
                  opacity: reviewAction === 'deny' && !doctorNotes.trim() ? 0.5 : 1,
                }}
              >
                {reviewAction === 'approve' ? 'Approve Request' : 'Deny Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
