import { useState, useEffect } from 'react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { Mail, MailOpen, Star, X, Search, Clock } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  created_at: string;
  read_at: string | null;
}

interface Sender {
  id: string;
  full_name: string;
  specialty?: string;
}

export default function MessagesPage() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [senders, setSenders] = useState<{ [key: string]: Sender }>({});
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        setLoading(false);
        return;
      }

      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, role');

      if (profilesError) throw profilesError;

      const { data: doctorsData, error: doctorsError } = await supabase
        .from('doctors')
        .select('id, specialty');

      if (doctorsError) throw doctorsError;

      const sendersMap: { [key: string]: Sender } = {};
      profilesData?.forEach((profile: any) => {
        const doctor = doctorsData?.find((d: any) => d.id === profile.id);
        sendersMap[profile.id] = {
          id: profile.id,
          full_name: profile.full_name || 'Unknown',
          specialty: doctor?.specialty
        };
      });

      setMessages(messagesData || []);
      setSenders(sendersMap);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', messageId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, is_read: true, read_at: new Date().toISOString() }
            : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const toggleStar = async (messageId: string, currentStarred: boolean) => {
    try {
      await supabase
        .from('messages')
        .update({ is_starred: !currentStarred })
        .eq('id', messageId);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, is_starred: !currentStarred } : msg
        )
      );

      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, is_starred: !currentStarred });
      }
    } catch (error) {
      console.error('Error toggling star:', error);
    }
  };

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  const getSenderName = (senderId: string) => {
    return senders[senderId]?.full_name || 'Unknown Sender';
  };

  const getSenderSpecialty = (senderId: string) => {
    return senders[senderId]?.specialty || '';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const filteredMessages = messages.filter((msg) =>
    msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getSenderName(msg.sender_id).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <PatientLayout>
      <div
        style={{
          minHeight: '100vh',
          background: isDarkMode ? '#0F172A' : '#F8FAFC',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: isDarkMode ? 'white' : '#1A1A2E',
                marginBottom: 8,
              }}
            >
              Messages
            </h1>
            <p style={{ color: isDarkMode ? '#94A3B8' : '#64748B', fontSize: 14 }}>
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: selectedMessage ? '400px 1fr' : '1fr',
              gap: 20,
              height: 'calc(100vh - 200px)',
            }}
          >
            <div
              style={{
                background: isDarkMode ? '#1E293B' : 'white',
                borderRadius: 16,
                boxShadow: isDarkMode
                  ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                  : '0 1px 3px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: isDarkMode ? '#0F172A' : '#F8FAFC',
                    borderRadius: 12,
                    padding: '10px 14px',
                  }}
                >
                  <Search size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      outline: 'none',
                      flex: 1,
                      fontSize: 14,
                      color: isDarkMode ? 'white' : '#1A1A2E',
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                  <div style={{ padding: 40, textAlign: 'center', color: isDarkMode ? '#64748B' : '#94A3B8' }}>
                    Loading messages...
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div style={{ padding: 40, textAlign: 'center', color: isDarkMode ? '#64748B' : '#94A3B8' }}>
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      style={{
                        padding: '16px 20px',
                        borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                        cursor: 'pointer',
                        background:
                          selectedMessage?.id === message.id
                            ? isDarkMode
                              ? '#334155'
                              : '#F1F5F9'
                            : 'transparent',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMessage?.id !== message.id) {
                          e.currentTarget.style.background = isDarkMode ? '#1E293B' : '#F8FAFC';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMessage?.id !== message.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ paddingTop: 4 }}>
                          {message.is_read ? (
                            <MailOpen size={18} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                          ) : (
                            <Mail size={18} color="#3B82F6" />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span
                              style={{
                                fontSize: 14,
                                fontWeight: message.is_read ? 500 : 700,
                                color: isDarkMode ? 'white' : '#1A1A2E',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {getSenderName(message.sender_id)}
                            </span>
                            {message.is_starred && <Star size={14} fill="#FBBF24" color="#FBBF24" />}
                          </div>

                          {getSenderSpecialty(message.sender_id) && (
                            <div
                              style={{
                                fontSize: 12,
                                color: isDarkMode ? '#64748B' : '#94A3B8',
                                marginBottom: 4,
                              }}
                            >
                              {getSenderSpecialty(message.sender_id)}
                            </div>
                          )}

                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: message.is_read ? 400 : 600,
                              color: isDarkMode ? '#E2E8F0' : '#334155',
                              marginBottom: 4,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message.subject}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={12} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                            <span style={{ fontSize: 12, color: isDarkMode ? '#64748B' : '#94A3B8' }}>
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {selectedMessage && (
              <div
                style={{
                  background: isDarkMode ? '#1E293B' : 'white',
                  borderRadius: 16,
                  boxShadow: isDarkMode
                    ? '0 4px 6px rgba(0, 0, 0, 0.3)'
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: isDarkMode ? 'white' : '#1A1A2E',
                      margin: 0,
                    }}
                  >
                    {selectedMessage.subject}
                  </h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => toggleStar(selectedMessage.id, selectedMessage.is_starred)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <Star
                        size={20}
                        fill={selectedMessage.is_starred ? '#FBBF24' : 'none'}
                        color={selectedMessage.is_starred ? '#FBBF24' : isDarkMode ? '#64748B' : '#94A3B8'}
                      />
                    </button>

                    <button
                      onClick={() => setSelectedMessage(null)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 8,
                      }}
                    >
                      <X size={20} color={isDarkMode ? '#64748B' : '#94A3B8'} />
                    </button>
                  </div>
                </div>

                <div style={{ padding: 20, borderBottom: `1px solid ${isDarkMode ? '#334155' : '#E2E8F0'}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {getSenderName(selectedMessage.sender_id).charAt(0)}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: isDarkMode ? 'white' : '#1A1A2E',
                        }}
                      >
                        {getSenderName(selectedMessage.sender_id)}
                      </div>
                      <div style={{ fontSize: 13, color: isDarkMode ? '#64748B' : '#94A3B8' }}>
                        {getSenderSpecialty(selectedMessage.sender_id)}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: 13, color: isDarkMode ? '#64748B' : '#94A3B8' }}>
                    {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                <div
                  style={{
                    flex: 1,
                    padding: 20,
                    overflowY: 'auto',
                    color: isDarkMode ? '#E2E8F0' : '#334155',
                    fontSize: 14,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedMessage.body}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
