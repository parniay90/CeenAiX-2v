import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  Mail,
  MessageSquare,
  Phone,
  Lock,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  Check,
  ArrowLeft,
  MapPin,
  Plus,
  Star,
} from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useNavigation } from '../Router';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useTheme } from '../contexts/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';
type Language = 'en' | 'ar';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  isPreferred: boolean;
}

export default function Settings() {
  const { navigateToPatientPortal } = useNavigation();
  const { profile } = useUserProfile();
  const { isDarkMode, toggleDarkMode, isAutoMode, setAutoMode } = useTheme();

  const [activeSection, setActiveSection] = useState<'general' | 'notifications' | 'privacy' | 'data' | 'pharmacy'>('general');

  // General Settings
  const [theme, setTheme] = useState<ThemeMode>(isAutoMode ? 'system' : (isDarkMode ? 'dark' : 'light'));
  const [language, setLanguage] = useState<Language>('en');
  const [timezone, setTimezone] = useState('Asia/Dubai');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [prescriptionReminders, setPrescriptionReminders] = useState(true);
  const [labResultNotifications, setLabResultNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState<'private' | 'doctors-only' | 'public'>('doctors-only');
  const [dataSharing, setDataSharing] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Pharmacy Settings
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([
    {
      id: '1',
      name: 'Dubai Pharmacy',
      address: 'Dubai Mall, Sheikh Zayed Road, Dubai',
      phone: '+971 4 XXX XXXX',
      isPreferred: true,
    },
  ]);
  const [showAddPharmacy, setShowAddPharmacy] = useState(false);
  const [newPharmacy, setNewPharmacy] = useState({ name: '', address: '', phone: '' });

  const handleSaveSettings = () => {
    if (theme === 'system') {
      setAutoMode(true);
    } else if (theme === 'dark') {
      setAutoMode(false);
      if (!isDarkMode) toggleDarkMode();
    } else if (theme === 'light') {
      setAutoMode(false);
      if (isDarkMode) toggleDarkMode();
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'pharmacy', label: 'Pharmacy Preferences', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Download },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Always use light theme' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Always use dark theme' },
    { value: 'system', label: 'Auto (Time-based)', icon: Monitor, description: 'Dark mode from 6 PM to 6 AM' },
  ];

  return (
    <PatientLayout activeNav="profile">
      <div
        style={{
          minHeight: '100%',
          background: isDarkMode ? 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => navigateToPatientPortal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: isDarkMode ? '#16213E' : 'white',
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
              borderRadius: 8,
              color: isDarkMode ? '#CBD5E1' : '#475569',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 24,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                marginBottom: 8,
              }}
            >
              Settings
            </h1>
            <p style={{ fontSize: 15, color: '#64748B' }}>
              Manage your preferences and account settings
            </p>
          </div>

          {saveSuccess && (
            <div
              style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: 12,
                padding: '12px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Check size={18} color="#22C55E" />
              <span style={{ fontSize: 13, color: '#16A34A', fontWeight: 500 }}>
                Settings saved successfully!
              </span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
            {/* Sidebar Navigation */}
            <div
              style={{
                background: isDarkMode ? '#16213E' : 'white',
                borderRadius: 16,
                padding: 16,
                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                height: 'fit-content',
              }}
            >
              <div style={{ display: 'grid', gap: 4 }}>
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: isActive ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)' : 'transparent',
                        border: 'none',
                        borderRadius: 10,
                        color: isActive ? 'white' : '#475569',
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'left',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = '#F8FAFC';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Icon size={18} />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gap: 24 }}>
              {/* General Settings */}
              {activeSection === 'general' && (
                <>
                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 24 }}>
                      Appearance
                    </h3>

                    {/* Theme Selection */}
                    <div style={{ marginBottom: 24 }}>
                      <label
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isDarkMode ? '#CBD5E1' : '#475569',
                          display: 'block',
                          marginBottom: 12,
                        }}
                      >
                        Theme Mode
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {themeOptions.map((option) => {
                          const Icon = option.icon;
                          const isSelected = theme === option.value;
                          return (
                            <button
                              key={option.value}
                              onClick={() => setTheme(option.value as ThemeMode)}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 8,
                                padding: 16,
                                background: isSelected ? '#EFF6FF' : 'white',
                                border: `2px solid ${isSelected ? '#0D7377' : '#E2E8F0'}`,
                                borderRadius: 12,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = '#CBD5E1';
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) e.currentTarget.style.borderColor = '#E2E8F0';
                              }}
                            >
                              <Icon size={24} color={isSelected ? '#0D7377' : '#64748B'} />
                              <span
                                style={{
                                  fontSize: 13,
                                  fontWeight: 600,
                                  color: isSelected ? '#0D7377' : '#475569',
                                }}
                              >
                                {option.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 24 }}>
                      Regional Settings
                    </h3>

                    {/* Language */}
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Globe size={16} />
                          Language
                        </div>
                      </label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                          borderRadius: 10,
                          fontSize: 14,
                          color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                          outline: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <option value="en">English</option>
                        <option value="ar">العربية (Arabic)</option>
                      </select>
                    </div>

                    {/* Timezone */}
                    <div>
                      <label
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isDarkMode ? '#CBD5E1' : '#475569',
                          display: 'block',
                          marginBottom: 8,
                        }}
                      >
                        Timezone
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                          borderRadius: 10,
                          fontSize: 14,
                          color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                          outline: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        <option value="Asia/Dubai">Dubai (GMT+4)</option>
                        <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                        <option value="Europe/London">London (GMT+0)</option>
                        <option value="America/New_York">New York (GMT-5)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Pharmacy Preferences */}
              {activeSection === 'pharmacy' && (
                <div
                  style={{
                    background: isDarkMode ? '#16213E' : 'white',
                    borderRadius: 16,
                    padding: 32,
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>
                      Preferred Pharmacies
                    </h3>
                    <button
                      onClick={() => setShowAddPharmacy(!showAddPharmacy)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 14px',
                        background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                        border: 'none',
                        borderRadius: 8,
                        color: 'white',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <Plus size={16} />
                      Add Pharmacy
                    </button>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                    Add and manage your preferred pharmacies for prescription refills
                  </p>

                  {showAddPharmacy && (
                    <div
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 20,
                      }}
                    >
                      <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 16 }}>
                        Add New Pharmacy
                      </h4>
                      <div style={{ display: 'grid', gap: 12 }}>
                        <input
                          type="text"
                          placeholder="Pharmacy Name"
                          value={newPharmacy.name}
                          onChange={(e) => setNewPharmacy({ ...newPharmacy, name: e.target.value })}
                          style={{
                            padding: '10px 14px',
                            border: '1px solid #E2E8F0',
                            borderRadius: 8,
                            fontSize: 14,
                            outline: 'none',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Address"
                          value={newPharmacy.address}
                          onChange={(e) => setNewPharmacy({ ...newPharmacy, address: e.target.value })}
                          style={{
                            padding: '10px 14px',
                            border: '1px solid #E2E8F0',
                            borderRadius: 8,
                            fontSize: 14,
                            outline: 'none',
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Phone Number"
                          value={newPharmacy.phone}
                          onChange={(e) => setNewPharmacy({ ...newPharmacy, phone: e.target.value })}
                          style={{
                            padding: '10px 14px',
                            border: '1px solid #E2E8F0',
                            borderRadius: 8,
                            fontSize: 14,
                            outline: 'none',
                          }}
                        />
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => {
                              setShowAddPharmacy(false);
                              setNewPharmacy({ name: '', address: '', phone: '' });
                            }}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              border: '1px solid #E2E8F0',
                              borderRadius: 8,
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (newPharmacy.name && newPharmacy.address) {
                                setPharmacies([
                                  ...pharmacies,
                                  {
                                    id: Date.now().toString(),
                                    ...newPharmacy,
                                    isPreferred: pharmacies.length === 0,
                                  },
                                ]);
                                setNewPharmacy({ name: '', address: '', phone: '' });
                                setShowAddPharmacy(false);
                              }
                            }}
                            style={{
                              padding: '8px 16px',
                              background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                              border: 'none',
                              borderRadius: 8,
                              color: 'white',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            Add Pharmacy
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: 12 }}>
                    {pharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy.id}
                        style={{
                          padding: 16,
                          background: pharmacy.isPreferred ? '#F0F9FF' : '#F8FAFC',
                          border: `1px solid ${pharmacy.isPreferred ? '#0EA5E9' : '#E2E8F0'}`,
                          borderRadius: 12,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E' }}>
                              {pharmacy.name}
                            </h4>
                            {pharmacy.isPreferred && (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  padding: '2px 8px',
                                  background: '#0EA5E9',
                                  borderRadius: 12,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  color: 'white',
                                }}
                              >
                                <Star size={12} fill="white" />
                                Preferred
                              </div>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 2 }}>
                            {pharmacy.address}
                          </div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{pharmacy.phone}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {!pharmacy.isPreferred && (
                            <button
                              onClick={() => {
                                setPharmacies(
                                  pharmacies.map((p) => ({
                                    ...p,
                                    isPreferred: p.id === pharmacy.id,
                                  }))
                                );
                              }}
                              style={{
                                padding: '6px 12px',
                                background: 'white',
                                border: '1px solid #E2E8F0',
                                borderRadius: 8,
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#0D7377',
                                cursor: 'pointer',
                              }}
                            >
                              Set as Preferred
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setPharmacies(pharmacies.filter((p) => p.id !== pharmacy.id));
                            }}
                            style={{
                              padding: '6px 12px',
                              background: 'white',
                              border: '1px solid #FEE2E2',
                              borderRadius: 8,
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#DC2626',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    {pharmacies.length === 0 && (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: 40,
                          color: '#64748B',
                          fontSize: 14,
                        }}
                      >
                        No pharmacies added yet. Click "Add Pharmacy" to get started.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeSection === 'notifications' && (
                <>
                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                      Communication Channels
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Choose how you want to receive notifications
                    </p>

                    <div style={{ display: 'grid', gap: 20 }}>
                      <ToggleSwitch
                        icon={<Mail size={18} />}
                        label="Email Notifications"
                        description="Receive updates via email"
                        checked={emailNotifications}
                        onChange={setEmailNotifications}
                      />
                      <ToggleSwitch
                        icon={<Phone size={18} />}
                        label="SMS Notifications"
                        description="Receive text messages for important updates"
                        checked={smsNotifications}
                        onChange={setSmsNotifications}
                      />
                      <ToggleSwitch
                        icon={<Bell size={18} />}
                        label="Push Notifications"
                        description="Receive push notifications on your devices"
                        checked={pushNotifications}
                        onChange={setPushNotifications}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                      Notification Preferences
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Customize what notifications you receive
                    </p>

                    <div style={{ display: 'grid', gap: 20 }}>
                      <ToggleSwitch
                        label="Appointment Reminders"
                        description="Get reminded before your scheduled appointments"
                        checked={appointmentReminders}
                        onChange={setAppointmentReminders}
                      />
                      <ToggleSwitch
                        label="Prescription Reminders"
                        description="Reminders to refill and take your medications"
                        checked={prescriptionReminders}
                        onChange={setPrescriptionReminders}
                      />
                      <ToggleSwitch
                        label="Lab Results"
                        description="Notifications when new lab results are available"
                        checked={labResultNotifications}
                        onChange={setLabResultNotifications}
                      />
                      <ToggleSwitch
                        label="Messages"
                        description="Notifications for new messages from healthcare providers"
                        checked={messageNotifications}
                        onChange={setMessageNotifications}
                      />
                      <ToggleSwitch
                        label="Marketing & Promotions"
                        description="Receive health tips and promotional offers"
                        checked={marketingEmails}
                        onChange={setMarketingEmails}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Privacy & Security */}
              {activeSection === 'privacy' && (
                <>
                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                      Account Security
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Keep your account secure
                    </p>

                    <div style={{ display: 'grid', gap: 20 }}>
                      <ToggleSwitch
                        icon={<Shield size={18} />}
                        label="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                        checked={twoFactorAuth}
                        onChange={setTwoFactorAuth}
                      />

                      <div
                        style={{
                          padding: 20,
                          background: isDarkMode ? '#2D3748' : '#F8FAFC',
                          borderRadius: 12,
                          border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                          <Lock size={18} color="#0D7377" />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>
                              Password
                            </h4>
                            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
                              Last changed 30 days ago
                            </p>
                            <button
                              onClick={() => navigateToPatientPortal()}
                              style={{
                                padding: '8px 16px',
                                background: isDarkMode ? '#16213E' : 'white',
                                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                                borderRadius: 8,
                                color: '#0D7377',
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#F8FAFC';
                                e.currentTarget.style.borderColor = '#0D7377';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.borderColor = '#E2E8F0';
                              }}
                            >
                              Change Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                      Privacy Preferences
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Control who can see your information
                    </p>

                    <div style={{ marginBottom: 24 }}>
                      <label
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isDarkMode ? '#CBD5E1' : '#475569',
                          display: 'block',
                          marginBottom: 12,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Eye size={16} />
                          Profile Visibility
                        </div>
                      </label>
                      <div style={{ display: 'grid', gap: 12 }}>
                        {[
                          { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
                          { value: 'doctors-only', label: 'Healthcare Providers Only', desc: 'Only your doctors can view your profile' },
                          { value: 'public', label: 'Public', desc: 'Anyone on the platform can view your profile' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setProfileVisibility(option.value as any)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              padding: 16,
                              background: profileVisibility === option.value ? '#EFF6FF' : 'white',
                              border: `2px solid ${profileVisibility === option.value ? '#0D7377' : '#E2E8F0'}`,
                              borderRadius: 12,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              textAlign: 'left',
                            }}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                border: `2px solid ${profileVisibility === option.value ? '#0D7377' : '#CBD5E1'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {profileVisibility === option.value && (
                                <div
                                  style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: '50%',
                                    background: '#0D7377',
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 2 }}>
                                {option.label}
                              </div>
                              <div style={{ fontSize: 12, color: '#64748B' }}>{option.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <ToggleSwitch
                      label="Data Sharing for Research"
                      description="Allow anonymized health data to be used for medical research"
                      checked={dataSharing}
                      onChange={setDataSharing}
                    />
                  </div>
                </>
              )}

              {/* Data Management */}
              {activeSection === 'data' && (
                <>
                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A2E', marginBottom: 8 }}>
                      Export Your Data
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Download a copy of your health records and account information
                    </p>

                    <div style={{ display: 'grid', gap: 12 }}>
                      <DataExportCard
                        title="Health Records"
                        description="All your medical history, prescriptions, and lab results"
                        icon={<Download size={18} />}
                      />
                      <DataExportCard
                        title="Appointment History"
                        description="Complete record of all your appointments"
                        icon={<Download size={18} />}
                      />
                      <DataExportCard
                        title="Account Information"
                        description="Your profile data and account settings"
                        icon={<Download size={18} />}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      background: isDarkMode ? '#16213E' : 'white',
                      borderRadius: 16,
                      padding: 32,
                      border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#DC2626', marginBottom: 8 }}>
                      Danger Zone
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24 }}>
                      Irreversible actions that affect your account
                    </p>

                    <div
                      style={{
                        padding: 20,
                        background: '#FEF2F2',
                        border: '1px solid #FEE2E2',
                        borderRadius: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <AlertCircle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#DC2626', marginBottom: 4 }}>
                            Delete Account
                          </h4>
                          <p style={{ fontSize: 13, color: '#991B1B', marginBottom: 16, lineHeight: 1.5 }}>
                            Once you delete your account, there is no going back. All your health records,
                            appointments, and personal data will be permanently removed.
                          </p>
                          <button
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '10px 16px',
                              background: '#DC2626',
                              border: 'none',
                              borderRadius: 8,
                              color: 'white',
                              fontSize: 13,
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#B91C1C')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#DC2626')}
                          >
                            <Trash2 size={16} />
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  onClick={() => navigateToPatientPortal()}
                  style={{
                    padding: '12px 24px',
                    background: isDarkMode ? '#16213E' : 'white',
                    border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                    borderRadius: 10,
                    color: isDarkMode ? '#CBD5E1' : '#475569',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                    border: 'none',
                    borderRadius: 10,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}

interface ToggleSwitchProps {
  icon?: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ icon, label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: 16,
        background: '#F8FAFC',
        borderRadius: 12,
        border: '1px solid #E2E8F0',
      }}
    >
      <div style={{ display: 'flex', gap: 12, flex: 1 }}>
        {icon && <div style={{ color: '#64748B', marginTop: 2 }}>{icon}</div>}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>
            {label}
          </div>
          <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: 48,
          height: 26,
          background: checked ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)' : '#CBD5E1',
          border: 'none',
          borderRadius: 13,
          cursor: 'pointer',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 25 : 3,
            width: 20,
            height: 20,
            background: 'white',
            borderRadius: '50%',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        />
      </button>
    </div>
  );
}

interface DataExportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function DataExportCard({ title, description, icon }: DataExportCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        transition: 'all 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#EFF6FF';
        e.currentTarget.style.borderColor = '#BFDBFE';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = '#F8FAFC';
        e.currentTarget.style.borderColor = '#E2E8F0';
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A2E', marginBottom: 4 }}>
          {title}
        </div>
        <div style={{ fontSize: 12, color: '#64748B' }}>{description}</div>
      </div>
      <button
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 14px',
          background: 'white',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          color: '#0D7377',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F8FAFC';
          e.currentTarget.style.borderColor = '#0D7377';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#E2E8F0';
        }}
      >
        {icon}
        Export
      </button>
    </div>
  );
}
