import { useState } from 'react';
import { CreditCard, Building2, Wallet, Plus, Trash2, Check, Lock, Shield, Clock } from 'lucide-react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { PatientLayout } from '../components/PatientLayout';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  last4?: string;
  expiryDate?: string;
  bankName?: string;
  accountNumber?: string;
  isDefault: boolean;
  brand?: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: string;
}

export default function PaymentSettings() {
  const { profile } = useUserProfile();
  const [activeTab, setActiveTab] = useState<'methods' | 'history' | 'billing'>('methods');
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      last4: '4242',
      expiryDate: '12/25',
      brand: 'visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      name: 'Mastercard ending in 8888',
      last4: '8888',
      expiryDate: '09/26',
      brand: 'mastercard',
      isDefault: false,
    },
    {
      id: '3',
      type: 'bank',
      name: 'Emirates NBD',
      bankName: 'Emirates NBD',
      accountNumber: '****1234',
      isDefault: false,
    },
  ]);

  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2026-03-12',
      description: 'Dr. Layla Al Mansoori - Consultation',
      amount: 350,
      status: 'completed',
      paymentMethod: 'Visa •••• 4242',
    },
    {
      id: '2',
      date: '2026-03-10',
      description: 'Lab Tests - Blood Work',
      amount: 280,
      status: 'completed',
      paymentMethod: 'Mastercard •••• 8888',
    },
    {
      id: '3',
      date: '2026-03-08',
      description: 'Prescription Medication',
      amount: 120,
      status: 'completed',
      paymentMethod: 'Visa •••• 4242',
    },
    {
      id: '4',
      date: '2026-03-05',
      description: 'Dr. Rami Khalil - Follow-up',
      amount: 250,
      status: 'completed',
      paymentMethod: 'Emirates NBD',
    },
    {
      id: '5',
      date: '2026-03-01',
      description: 'Insurance Premium - March',
      amount: 450,
      status: 'pending',
      paymentMethod: 'Visa •••• 4242',
    },
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
  };

  const handleDelete = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
  };

  const handleAddCard = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      alert('Please fill in all fields');
      return;
    }

    const last4 = cardNumber.slice(-4);
    const brand = cardNumber.startsWith('4') ? 'visa' : cardNumber.startsWith('5') ? 'mastercard' : 'amex';

    const newCard: PaymentMethod = {
      id: Date.now().toString(),
      type: 'card',
      name: `${brand.charAt(0).toUpperCase() + brand.slice(1)} ending in ${last4}`,
      last4,
      expiryDate,
      brand,
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods(methods => [...methods, newCard]);

    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setShowAddCard(false);
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  return (
    <PatientLayout activeNav="profile">
      <div style={{ minHeight: '100%', background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1A1A2E', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
              Payment Settings
            </h1>
            <p style={{ fontSize: 15, color: '#64748B' }}>Manage your payment methods, view transaction history, and billing information</p>
          </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '2px solid #E2E8F0' }}>
          {[
            { id: 'methods', label: 'Payment Methods', icon: CreditCard },
            { id: 'history', label: 'Transaction History', icon: Clock },
            { id: 'billing', label: 'Billing Info', icon: Building2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                background: 'transparent',
                border: 'none',
                borderBottom: `3px solid ${activeTab === tab.id ? '#0D7377' : 'transparent'}`,
                color: activeTab === tab.id ? '#0D7377' : '#64748B',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'methods' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', fontFamily: 'Syne, sans-serif' }}>
                Saved Payment Methods
              </h2>
              <button
                onClick={() => setShowAddCard(true)}
                style={{
                  padding: '10px 18px',
                  background: '#0D7377',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#0A5C5F'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0D7377'}
              >
                <Plus size={18} />
                Add Payment Method
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    padding: 24,
                    border: method.isDefault ? '2px solid #0D7377' : '1px solid #E2E8F0',
                    position: 'relative',
                    transition: 'all 0.2s',
                  }}
                >
                  {method.isDefault && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 60,
                        background: '#D1FAE5',
                        color: '#065F46',
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Check size={14} />
                      Default
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(method.id)}
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      padding: '8px 12px',
                      background: '#FEE2E2',
                      color: '#DC2626',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#FECACA'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#FEE2E2'}
                  >
                    <Trash2 size={16} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                      }}
                    >
                      {method.type === 'card' ? getCardIcon(method.brand) : method.type === 'bank' ? <Building2 size={28} color="white" /> : <Wallet size={28} color="white" />}
                    </div>

                    <div style={{ flex: 1, paddingRight: method.isDefault ? 140 : 80 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 4 }}>
                        {method.name}
                      </h3>
                      {method.type === 'card' && (
                        <p style={{ fontSize: 13, color: '#64748B' }}>
                          Expires {method.expiryDate}
                        </p>
                      )}
                      {method.type === 'bank' && (
                        <p style={{ fontSize: 13, color: '#64748B' }}>
                          Account {method.accountNumber}
                        </p>
                      )}
                    </div>

                    {!method.isDefault && (
                      <div style={{ display: 'flex', gap: 8, marginRight: 60 }}>
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#F1F5F9',
                            color: '#475569',
                            border: 'none',
                            borderRadius: 8,
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = '#E2E8F0'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#F1F5F9'}
                        >
                          Set as Default
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: 24,
                padding: 20,
                background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
                borderRadius: 12,
                border: '1px solid #93C5FD',
                display: 'flex',
                alignItems: 'start',
                gap: 16,
              }}
            >
              <Shield size={24} color="#2563EB" />
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1E40AF', marginBottom: 4 }}>
                  Your payments are secure
                </h4>
                <p style={{ fontSize: 13, color: '#1E40AF', lineHeight: 1.6 }}>
                  All payment information is encrypted and stored securely. We use industry-standard security protocols to protect your financial data. Your card details are never stored on our servers.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
                Transaction History
              </h2>
              <p style={{ fontSize: 14, color: '#64748B' }}>View all your past transactions and payments</p>
            </div>

            <div
              style={{
                background: 'white',
                borderRadius: 12,
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 120px 150px 120px',
                  padding: '16px 24px',
                  background: '#F8FAFC',
                  borderBottom: '1px solid #E2E8F0',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#475569',
                }}
              >
                <div>Date</div>
                <div>Description</div>
                <div>Amount</div>
                <div>Payment Method</div>
                <div>Status</div>
              </div>

              {transactions.map((tx, index) => (
                <div
                  key={tx.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr 120px 150px 120px',
                    padding: '16px 24px',
                    borderBottom: index < transactions.length - 1 ? '1px solid #F1F5F9' : 'none',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A2E' }}>
                    AED {tx.amount}
                  </div>
                  <div style={{ fontSize: 13, color: '#64748B' }}>
                    {tx.paymentMethod}
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 600,
                        background: `${getStatusColor(tx.status)}20`,
                        color: getStatusColor(tx.status),
                        textTransform: 'capitalize',
                      }}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: 13, color: '#64748B' }}>Showing 5 of 24 transactions</p>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: 'pointer',
                }}
              >
                Load More
              </button>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', fontFamily: 'Syne, sans-serif', marginBottom: 8 }}>
                Billing Information
              </h2>
              <p style={{ fontSize: 14, color: '#64748B' }}>Manage your billing address and information</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                  Billing Address
                </h3>
                <div style={{ display: 'grid', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.full_name}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        fontSize: 14,
                        color: '#1A1A2E',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      defaultValue={profile.address || ''}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        fontSize: 14,
                        color: '#1A1A2E',
                      }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                        Emirate
                      </label>
                      <input
                        type="text"
                        defaultValue={profile.emirate}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #E2E8F0',
                          borderRadius: 8,
                          fontSize: 14,
                          color: '#1A1A2E',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                        Country
                      </label>
                      <input
                        type="text"
                        defaultValue="United Arab Emirates"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          border: '1px solid #E2E8F0',
                          borderRadius: 8,
                          fontSize: 14,
                          color: '#1A1A2E',
                        }}
                      />
                    </div>
                  </div>
                  <button
                    style={{
                      padding: '12px',
                      background: '#0D7377',
                      color: 'white',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      fontSize: 14,
                      cursor: 'pointer',
                      marginTop: 8,
                    }}
                  >
                    Update Billing Address
                  </button>
                </div>
              </div>

              <div>
                <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0', marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                    Tax Information
                  </h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>VAT Registration Number</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>—</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>Tax Residence</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>UAE</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: 'white', borderRadius: 12, padding: 24, border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E', marginBottom: 16 }}>
                    Payment Summary
                  </h3>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>Total Spent (2026)</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>AED 1,450</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>Pending Payments</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B' }}>AED 450</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
                      <span style={{ fontSize: 13, color: '#64748B' }}>Average per Visit</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>AED 290</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddCard && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}
            onClick={() => setShowAddCard(false)}
          >
            <div
              style={{
                background: 'white',
                borderRadius: 16,
                padding: 32,
                maxWidth: 500,
                width: '90%',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', fontFamily: 'Syne, sans-serif' }}>
                  Add Payment Method
                </h3>
                <button
                  onClick={() => setShowAddCard(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: 24,
                    cursor: 'pointer',
                    color: '#64748B',
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: '#F8FAFC', borderRadius: 8 }}>
                  <Lock size={16} color="#64748B" />
                  <span style={{ fontSize: 12, color: '#64748B' }}>
                    Your card information is encrypted and secure
                  </span>
                </div>

                <button
                  style={{
                    padding: '12px',
                    background: '#0D7377',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: 'pointer',
                    marginTop: 8,
                  }}
                  onClick={handleAddCard}
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </PatientLayout>
  );
}
