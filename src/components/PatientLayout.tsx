import { useState, useEffect, useRef, ReactNode } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { UserAvatar } from './UserAvatar';
import { useNavigation } from '../Router';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { BackButton } from './BackButton';
import { EmergencyButton } from './EmergencyButton';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  onClick?: () => void;
}

interface PatientLayoutProps {
  children: ReactNode;
  activeNav?: string;
  onNavChange?: (navId: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: '⊞' },
  { id: 'appointments', label: 'My Appointments', icon: '📅' },
  { id: 'records', label: 'Health Records', icon: '🗂' },
  { id: 'prescriptions', label: 'Prescriptions', icon: '💊' },
  { id: 'labs', label: 'Lab Results', icon: '🔬' },
  { id: 'radiology', label: 'Imaging / Radiology', icon: '🩻' },
  { id: 'messages', label: 'Messages', icon: '💬' },
  { id: 'ai', label: 'AI Assistant', icon: '✦' },
  { id: 'help', label: 'Help & Support', icon: '❓' },
  { id: 'profile', label: 'My Profile', icon: '👤' },
];

export function PatientLayout({ children, activeNav = 'home', onNavChange }: PatientLayoutProps) {
  const { profile } = useUserProfile();
  const { signOut } = useAuth();
  const { navigateToPaymentSettings, navigateToPatientPortal, navigateToChangePassword, navigateToSettings, navigateToTerms, navigateToPrivacy, navigateToHome, navigateToPrescriptions, navigateToRadiology, navigateToMessages, navigateToHelpSupport, navigateBack, canGoBack } = useNavigation();
  const { isDarkMode } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigateToHome();
  };

  const handleNavClick = (itemId: string) => {
    if (itemId === 'home') {
      navigateToPatientPortal();
    } else if (itemId === 'prescriptions') {
      navigateToPrescriptions();
    } else if (itemId === 'radiology') {
      navigateToRadiology();
    } else if (itemId === 'messages') {
      navigateToMessages();
    } else if (itemId === 'help') {
      navigateToHelpSupport();
    } else if (onNavChange) {
      onNavChange(itemId);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: 'Inter, sans-serif', background: isDarkMode ? '#1A1A2E' : 'white' }}>
      {/* SIDEBAR */}
      <div
        style={{
          width: sidebarOpen ? 220 : 60,
          background: 'linear-gradient(180deg, #0D7377 0%, #14FFEC 100%)',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          transition: 'width 0.3s',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
          position: 'relative',
          zIndex: 20,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy copy.png"
            alt="CeenAiX Logo"
            style={{ height: sidebarOpen ? 80 : 50, width: 'auto', transition: 'height 0.3s' }}
          />
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                background: activeNav === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                color: 'white',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeNav !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Profile footer */}
        {sidebarOpen && (
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserAvatar size={34} fontSize={13} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'white' }}>
                {profile.full_name.split(' ')[0]} {profile.full_name.split(' ')[1]?.charAt(0)}.
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Patient</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* TOP BAR */}
        <div
          style={{
            background: isDarkMode ? '#16213E' : 'white',
            borderBottom: isDarkMode ? '1px solid #2D3748' : '1px solid #E8EFF5',
            padding: '14px 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {canGoBack && <BackButton onClick={navigateBack} />}
            <button
              onClick={() => setSidebarOpen((p) => !p)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 18,
                color: isDarkMode ? '#94A3B8' : '#64748B',
                padding: 8,
              }}
            >
              ☰
            </button>
            <div
              style={{
                background: isDarkMode ? '#2D3748' : '#F0F4F8',
                borderRadius: 10,
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: 280,
              }}
            >
              <span style={{ color: '#94A3B8', fontSize: 14 }}>🔍</span>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>Search records, doctors...</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => handleNavClick('ai')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                padding: '8px 16px',
                background: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                cursor: 'pointer',
                color: '#475569',
                fontWeight: 600,
              }}
            >
              <span style={{ color: '#6C63FF' }}>✦</span> AI Assistant
            </button>
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span
                style={{
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  width: 8,
                  height: 8,
                  background: '#EF4444',
                  borderRadius: '50%',
                  border: '2px solid white',
                }}
              ></span>
            </div>
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <div style={{ cursor: 'pointer' }} onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen(!profileMenuOpen);
              }}>
                <UserAvatar size={36} fontSize={14} />
              </div>

              {profileMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: isDarkMode ? '#16213E' : 'white',
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    minWidth: 240,
                    zIndex: 9999,
                  }}
                >
                  <div style={{ padding: '16px 20px', borderBottom: isDarkMode ? '1px solid #2D3748' : '1px solid #F1F5F9' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: isDarkMode ? '#F8FAFC' : '#1A1A2E' }}>{profile.full_name}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{profile.email}</div>
                  </div>

                  <div style={{ padding: '8px 0' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        handleNavClick('profile');
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>👤</span>
                      <span style={{ fontWeight: 500 }}>My Profile</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        navigateToPaymentSettings();
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>💳</span>
                      <span style={{ fontWeight: 500 }}>Payment Settings</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        navigateToChangePassword();
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>🔒</span>
                      <span style={{ fontWeight: 500 }}>Change Password</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        navigateToSettings();
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>⚙️</span>
                      <span style={{ fontWeight: 500 }}>Settings</span>
                    </div>

                    <div style={{ height: 1, background: isDarkMode ? '#2D3748' : '#F1F5F9', margin: '8px 0' }}></div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        navigateToTerms();
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>📋</span>
                      <span style={{ fontWeight: 500 }}>Terms & Conditions</span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: isDarkMode ? '#CBD5E1' : '#475569',
                      }}
                      onClick={() => {
                        navigateToPrivacy();
                        setProfileMenuOpen(false);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>🔐</span>
                      <span style={{ fontWeight: 500 }}>Privacy Policy</span>
                    </div>

                    <div style={{ height: 1, background: isDarkMode ? '#2D3748' : '#F1F5F9', margin: '8px 0' }}></div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: 13,
                        color: '#EF4444',
                      }}
                      onClick={handleSignOut}
                      onMouseEnter={(e) => (e.currentTarget.style.background = isDarkMode ? '#3F1F1F' : '#FEF2F2')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ fontSize: 16 }}>🚪</span>
                      <span style={{ fontWeight: 500 }}>Sign Out</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ flex: 1, overflowY: 'auto' }}>{children}</div>
      </div>

      {/* EMERGENCY BUTTON */}
      <EmergencyButton />
    </div>
  );
}
