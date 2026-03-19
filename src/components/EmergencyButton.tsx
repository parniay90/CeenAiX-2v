import { useState } from 'react';
import { Phone, Ambulance, AlertTriangle, X, MessageSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { EmergencyAIChat } from './EmergencyAIChat';

export function EmergencyButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const { isDarkMode } = useTheme();

  const emergencyContacts = [
    { name: '999 Emergency', number: '999', icon: Ambulance, type: 'emergency' },
    { name: 'Emergency AI Assistant', number: '', icon: MessageSquare, type: 'ai' },
    { name: 'Dubai Police', number: '901', icon: Phone, type: 'police' },
    { name: 'Ambulance', number: '998', icon: AlertTriangle, type: 'ambulance' },
  ];

  const handleCall = (number: string, type: string) => {
    if (type === 'ai') {
      setShowAIChat(true);
      setShowMenu(false);
    } else {
      window.location.href = `tel:${number}`;
    }
  };

  return (
    <>
      {showAIChat && <EmergencyAIChat onClose={() => setShowAIChat(false)} />}

      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        {showMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: 80,
              right: 0,
              background: isDarkMode ? '#1A1A2E' : 'white',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              padding: '16px',
              minWidth: 280,
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <div style={{
                fontSize: 16,
                fontWeight: 700,
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                marginBottom: 4,
              }}>
                Emergency Services
              </div>
              <div style={{ fontSize: 12, color: '#94A3B8' }}>
                Tap to call immediately
              </div>
            </div>

            {emergencyContacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleCall(contact.number, contact.type)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px',
                    borderRadius: 10,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    marginBottom: idx < emergencyContacts.length - 1 ? 8 : 0,
                    background: contact.type === 'emergency'
                      ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                      : contact.type === 'ai'
                      ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                      : isDarkMode ? '#2D3748' : '#F8FAFC',
                    color: contact.type === 'emergency' || contact.type === 'ai' ? 'white' : isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  }}
                  onMouseEnter={(e) => {
                    if (contact.type !== 'emergency' && contact.type !== 'ai') {
                      e.currentTarget.style.background = isDarkMode ? '#374151' : '#E2E8F0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (contact.type !== 'emergency' && contact.type !== 'ai') {
                      e.currentTarget.style.background = isDarkMode ? '#2D3748' : '#F8FAFC';
                    }
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: contact.type === 'emergency' || contact.type === 'ai'
                        ? 'rgba(255,255,255,0.2)'
                        : '#EF4444',
                    }}
                  >
                    <Icon size={20} color="white" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>
                      {contact.name}
                    </div>
                    <div style={{
                      fontSize: 13,
                      opacity: 0.8,
                      fontWeight: 500,
                    }}>
                      {contact.number || (contact.type === 'ai' ? 'Instant medical guidance' : '')}
                    </div>
                  </div>
                  {contact.type === 'ai' ? (
                    <MessageSquare size={18} style={{ opacity: 0.6 }} />
                  ) : (
                    <Phone size={18} style={{ opacity: 0.6 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: showMenu
              ? 'linear-gradient(135deg, #64748B 0%, #475569 100%)'
              : 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.4)',
            transition: 'all 0.3s',
            color: 'white',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(220, 38, 38, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(220, 38, 38, 0.4)';
          }}
        >
          {showMenu ? <X size={28} /> : <Phone size={28} />}
        </button>
      </div>
    </>
  );
}
