import { useState, useEffect } from 'react';
import { useNavigation } from '../Router';
import { supabase } from '../lib/supabase';

export default function DoctorSettings() {
  const { navigateBack } = useNavigation();
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [accountSettings, setAccountSettings] = useState({
    full_name: 'Dr. Layla Al Mansoori',
    email: 'dr.layla@ceenaix.com',
    phone: '+971 50 123 4567',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'Asia/Dubai',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    currency: 'AED',
    theme: 'light'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    notifications_enabled: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    appointment_reminders: true,
    marketing_emails: false
  });

  const [notificationPreferences, setNotificationPreferences] = useState({
    appointments: { email: true, sms: false, push: true },
    messages: { email: true, sms: false, push: true },
    prescriptions: { email: true, sms: false, push: true },
    lab_results: { email: true, sms: true, push: true },
    refill_requests: { email: true, sms: false, push: true }
  });

  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public',
    show_in_search: true,
    allow_reviews: true,
    share_analytics: true,
    two_factor_enabled: false,
    session_timeout: 30
  });

  const [availabilitySettings, setAvailabilitySettings] = useState({
    online_booking: true,
    tele_consultations: true,
    emergency_appointments: false,
    auto_accept_appointments: false,
    booking_advance_days: 30
  });

  const handleSave = async (section: string) => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuccessMessage(`${section} settings saved successfully!`);
    setSaving(false);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'availability', label: 'Availability', icon: '📅' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFB 0%, #E8F5F5 100%)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <button
            onClick={navigateBack}
            style={{
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: 10,
              padding: '10px 14px',
              fontSize: 20,
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            ←
          </button>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', margin: 0 }}>Settings</h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0 0' }}>Manage your account preferences and configurations</p>
          </div>
        </div>

        {successMessage && (
          <div style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            padding: '14px 20px',
            borderRadius: 12,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}>
            <span style={{ fontSize: 20 }}>✓</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{successMessage}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'white' : 'transparent',
                  border: activeTab === tab.id ? '1px solid #E2E8F0' : '1px solid transparent',
                  borderLeft: activeTab === tab.id ? '3px solid #0D7377' : '3px solid transparent',
                  borderRadius: 10,
                  padding: '14px 18px',
                  fontSize: 14,
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? '#1E293B' : '#64748B',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', padding: 32, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            {activeTab === 'account' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>Account Information</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>Update your personal information and login credentials</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Full Name</label>
                    <input
                      type="text"
                      value={accountSettings.full_name}
                      onChange={(e) => setAccountSettings({...accountSettings, full_name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Email Address</label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) => setAccountSettings({...accountSettings, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Phone Number</label>
                    <input
                      type="tel"
                      value={accountSettings.phone}
                      onChange={(e) => setAccountSettings({...accountSettings, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB'
                      }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 28, marginTop: 28 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 20 }}>Change Password</h3>
                  <div style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Current Password</label>
                      <input
                        type="password"
                        value={accountSettings.current_password}
                        onChange={(e) => setAccountSettings({...accountSettings, current_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          fontSize: 14,
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          background: '#F8FAFB'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>New Password</label>
                      <input
                        type="password"
                        value={accountSettings.new_password}
                        onChange={(e) => setAccountSettings({...accountSettings, new_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          fontSize: 14,
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          background: '#F8FAFB'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Confirm New Password</label>
                      <input
                        type="password"
                        value={accountSettings.confirm_password}
                        onChange={(e) => setAccountSettings({...accountSettings, confirm_password: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          fontSize: 14,
                          border: '1px solid #E2E8F0',
                          borderRadius: 10,
                          background: '#F8FAFB'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={() => handleSave('Account')}
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    style={{
                      background: 'white',
                      color: '#64748B',
                      border: '1px solid #E2E8F0',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>Preferences</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>Customize your experience with language, timezone, and display settings</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Language</label>
                    <select
                      value={preferences.language}
                      onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="en">English</option>
                      <option value="ar">العربية (Arabic)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="ur">اردو (Urdu)</option>
                      <option value="fr">Français (French)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Timezone</label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="Asia/Dubai">Dubai (GMT+4)</option>
                      <option value="Asia/Abu_Dhabi">Abu Dhabi (GMT+4)</option>
                      <option value="Asia/Riyadh">Riyadh (GMT+3)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Date Format</label>
                    <select
                      value={preferences.date_format}
                      onChange={(e) => setPreferences({...preferences, date_format: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (24/03/2026)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (03/24/2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2026-03-24)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Time Format</label>
                    <select
                      value={preferences.time_format}
                      onChange={(e) => setPreferences({...preferences, time_format: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="24h">24-hour (14:30)</option>
                      <option value="12h">12-hour (2:30 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Currency</label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="AED">AED (د.إ)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="SAR">SAR (ر.س)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Theme</label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 10,
                        background: '#F8FAFB',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto (System)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={() => handleSave('Preferences')}
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>Notification Settings</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>Control how and when you receive notifications</p>

                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>General Notifications</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {[
                      { key: 'notifications_enabled', label: 'Enable all notifications', desc: 'Master switch for all notifications' },
                      { key: 'email_notifications', label: 'Email notifications', desc: 'Receive notifications via email' },
                      { key: 'sms_notifications', label: 'SMS notifications', desc: 'Receive notifications via SMS' },
                      { key: 'push_notifications', label: 'Push notifications', desc: 'Receive browser/mobile push notifications' },
                      { key: 'appointment_reminders', label: 'Appointment reminders', desc: 'Get reminders before appointments' },
                      { key: 'marketing_emails', label: 'Marketing emails', desc: 'Receive updates and promotional content' }
                    ].map(setting => (
                      <div key={setting.key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: '#F8FAFB',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0'
                      }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 2 }}>{setting.label}</div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{setting.desc}</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                            onChange={(e) => setNotificationSettings({...notificationSettings, [setting.key]: e.target.checked})}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: notificationSettings[setting.key as keyof typeof notificationSettings] ? '#0D7377' : '#CBD5E1',
                            transition: '0.3s',
                            borderRadius: 26,
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: 20,
                              width: 20,
                              left: notificationSettings[setting.key as keyof typeof notificationSettings] ? 26 : 3,
                              bottom: 3,
                              background: 'white',
                              transition: '0.3s',
                              borderRadius: '50%'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 28 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Notification Preferences by Type</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(notificationPreferences).map(([type, prefs]) => (
                      <div key={type} style={{
                        padding: '16px 20px',
                        background: '#F8FAFB',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0'
                      }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 12, textTransform: 'capitalize' }}>
                          {type.replace('_', ' ')}
                        </div>
                        <div style={{ display: 'flex', gap: 24 }}>
                          {['email', 'sms', 'push'].map(channel => (
                            <label key={channel} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={prefs[channel as keyof typeof prefs]}
                                onChange={(e) => setNotificationPreferences({
                                  ...notificationPreferences,
                                  [type]: { ...prefs, [channel]: e.target.checked }
                                })}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                              />
                              <span style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize' }}>{channel}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button
                    onClick={() => handleSave('Notification')}
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Notification Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>Privacy & Security</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>Manage your privacy settings and security options</p>

                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Profile Privacy</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{
                      padding: '16px 20px',
                      background: '#F8FAFB',
                      borderRadius: 10,
                      border: '1px solid #E2E8F0'
                    }}>
                      <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Profile Visibility</label>
                      <select
                        value={privacySettings.profile_visibility}
                        onChange={(e) => setPrivacySettings({...privacySettings, profile_visibility: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: 14,
                          border: '1px solid #E2E8F0',
                          borderRadius: 8,
                          background: 'white',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="public">Public - Visible to all users</option>
                        <option value="patients">Patients Only - Visible only to your patients</option>
                        <option value="private">Private - Not visible in search</option>
                      </select>
                    </div>

                    {[
                      { key: 'show_in_search', label: 'Show in search results', desc: 'Allow patients to find your profile in search' },
                      { key: 'allow_reviews', label: 'Allow patient reviews', desc: 'Patients can leave reviews and ratings' },
                      { key: 'share_analytics', label: 'Share analytics data', desc: 'Help improve CeenAiX with usage data' }
                    ].map(setting => (
                      <div key={setting.key} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px 20px',
                        background: '#F8FAFB',
                        borderRadius: 10,
                        border: '1px solid #E2E8F0'
                      }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 2 }}>{setting.label}</div>
                          <div style={{ fontSize: 12, color: '#64748B' }}>{setting.desc}</div>
                        </div>
                        <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={privacySettings[setting.key as keyof typeof privacySettings] as boolean}
                            onChange={(e) => setPrivacySettings({...privacySettings, [setting.key]: e.target.checked})}
                            style={{ opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: privacySettings[setting.key as keyof typeof privacySettings] ? '#0D7377' : '#CBD5E1',
                            transition: '0.3s',
                            borderRadius: 26,
                          }}>
                            <span style={{
                              position: 'absolute',
                              content: '',
                              height: 20,
                              width: 20,
                              left: privacySettings[setting.key as keyof typeof privacySettings] ? 26 : 3,
                              bottom: 3,
                              background: 'white',
                              transition: '0.3s',
                              borderRadius: '50%'
                            }} />
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: 28, marginBottom: 32 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 16 }}>Security Settings</h3>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: '#F8FAFB',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    marginBottom: 14
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 2 }}>Two-Factor Authentication</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>Add an extra layer of security to your account</div>
                    </div>
                    <button
                      onClick={() => setPrivacySettings({...privacySettings, two_factor_enabled: !privacySettings.two_factor_enabled})}
                      style={{
                        background: privacySettings.two_factor_enabled ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #0D7377, #14BDBD)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        padding: '8px 16px',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {privacySettings.two_factor_enabled ? 'Enabled ✓' : 'Enable'}
                    </button>
                  </div>

                  <div style={{
                    padding: '16px 20px',
                    background: '#F8FAFB',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0'
                  }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={privacySettings.session_timeout}
                      onChange={(e) => setPrivacySettings({...privacySettings, session_timeout: parseInt(e.target.value)})}
                      min="5"
                      max="120"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        background: 'white'
                      }}
                    />
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                      Automatically log out after {privacySettings.session_timeout} minutes of inactivity
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => handleSave('Privacy')}
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Privacy Settings'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>Availability Settings</h2>
                <p style={{ fontSize: 13, color: '#64748B', marginBottom: 28 }}>Manage your appointment and booking preferences</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                  {[
                    { key: 'online_booking', label: 'Enable online booking', desc: 'Allow patients to book appointments online' },
                    { key: 'tele_consultations', label: 'Accept tele-consultations', desc: 'Offer virtual appointments via video/audio' },
                    { key: 'emergency_appointments', label: 'Accept emergency appointments', desc: 'Allow same-day emergency bookings' },
                    { key: 'auto_accept_appointments', label: 'Auto-accept appointments', desc: 'Automatically approve appointment requests' }
                  ].map(setting => (
                    <div key={setting.key} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: '#F8FAFB',
                      borderRadius: 10,
                      border: '1px solid #E2E8F0'
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', marginBottom: 2 }}>{setting.label}</div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>{setting.desc}</div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={availabilitySettings[setting.key as keyof typeof availabilitySettings] as boolean}
                          onChange={(e) => setAvailabilitySettings({...availabilitySettings, [setting.key]: e.target.checked})}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute',
                          cursor: 'pointer',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: availabilitySettings[setting.key as keyof typeof availabilitySettings] ? '#0D7377' : '#CBD5E1',
                          transition: '0.3s',
                          borderRadius: 26,
                        }}>
                          <span style={{
                            position: 'absolute',
                            content: '',
                            height: 20,
                            width: 20,
                            left: availabilitySettings[setting.key as keyof typeof availabilitySettings] ? 26 : 3,
                            bottom: 3,
                            background: 'white',
                            transition: '0.3s',
                            borderRadius: '50%'
                          }} />
                        </span>
                      </label>
                    </div>
                  ))}

                  <div style={{
                    padding: '16px 20px',
                    background: '#F8FAFB',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0'
                  }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 8 }}>Booking Advance Period (days)</label>
                    <input
                      type="number"
                      value={availabilitySettings.booking_advance_days}
                      onChange={(e) => setAvailabilitySettings({...availabilitySettings, booking_advance_days: parseInt(e.target.value)})}
                      min="1"
                      max="90"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: 14,
                        border: '1px solid #E2E8F0',
                        borderRadius: 8,
                        background: 'white'
                      }}
                    />
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 6 }}>
                      Patients can book appointments up to {availabilitySettings.booking_advance_days} days in advance
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={() => handleSave('Availability')}
                    disabled={saving}
                    style={{
                      background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 10,
                      padding: '12px 28px',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: saving ? 'not-allowed' : 'pointer',
                      opacity: saving ? 0.7 : 1
                    }}
                  >
                    {saving ? 'Saving...' : 'Save Availability Settings'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
