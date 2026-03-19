import { useState, useEffect, useRef } from 'react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import {
  Mail,
  MailOpen,
  Star,
  Reply,
  Forward,
  Printer,
  Trash2,
  Archive,
  Send,
  X,
  Search,
  Phone,
  Video,
  Clock,
  ChevronLeft,
  Paperclip,
  AlertCircle,
} from 'lucide-react';

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
  sender_name: string;
  sender_email: string;
  sender_role: string;
}

interface CallModalProps {
  isOpen: boolean;
  callType: 'audio' | 'video' | null;
  recipientName: string;
  onClose: () => void;
}

const CallModal = ({ isOpen, callType, recipientName, onClose }: CallModalProps) => {
  const { isDarkMode } = useTheme();
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsConnecting(true);
      const connectTimer = setTimeout(() => {
        setIsConnecting(false);
      }, 3000);

      return () => clearTimeout(connectTimer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isConnecting) {
      const timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, isConnecting]);

  if (!isOpen) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
      }}
    >
      <div
        style={{
          background: isDarkMode ? '#1E293B' : 'white',
          borderRadius: 24,
          padding: 48,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        {isConnecting ? (
          <>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite',
              }}
            >
              {callType === 'video' ? (
                <Video size={56} color="white" />
              ) : (
                <Phone size={56} color="white" />
              )}
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 8,
              }}
            >
              Connecting...
            </h3>
            <p style={{ fontSize: 16, color: '#64748B', marginBottom: 32 }}>
              Calling {recipientName}
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {callType === 'video' ? (
                <Video size={56} color="white" />
              ) : (
                <Phone size={56} color="white" />
              )}
            </div>
            <h3
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                marginBottom: 8,
              }}
            >
              {recipientName}
            </h3>
            <p style={{ fontSize: 16, color: '#64748B', marginBottom: 8 }}>
              {callType === 'video' ? 'Video Call' : 'Audio Call'}
            </p>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#10B981',
                marginBottom: 32,
              }}
            >
              {formatDuration(callDuration)}
            </div>
          </>
        )}

        <button
          onClick={() => {
            setCallDuration(0);
            setIsConnecting(true);
            onClose();
          }}
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: '#EF4444',
            border: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            margin: '0 auto',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Phone size={28} />
        </button>
      </div>
    </div>
  );
};

export default function MessagesPage() {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [composeMode, setComposeMode] = useState<'new' | 'reply' | 'forward'>('new');
  const [replyText, setReplyText] = useState('');
  const [callModal, setCallModal] = useState<{
    isOpen: boolean;
    callType: 'audio' | 'video' | null;
    recipientName: string;
  }>({
    isOpen: false,
    callType: null,
    recipientName: '',
  });

  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const testPatientId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (
            email,
            raw_user_meta_data
          )
        `)
        .or(`sender_id.eq.${testPatientId},recipient_id.eq.${testPatientId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedMessages: Message[] = messagesData.map((msg: any) => {
        const senderData = msg.sender;
        const senderName = senderData?.raw_user_meta_data?.full_name || senderData?.email?.split('@')[0] || 'Unknown';
        const senderRole = senderData?.raw_user_meta_data?.role || 'User';

        return {
          id: msg.id,
          sender_id: msg.sender_id,
          recipient_id: msg.recipient_id,
          subject: msg.subject,
          body: msg.body,
          is_read: msg.is_read,
          is_starred: msg.is_starred,
          created_at: msg.created_at,
          read_at: msg.read_at,
          sender_name: senderName,
          sender_email: senderData?.email || '',
          sender_role: senderRole,
        };
      });

      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMessage = async (message: Message) => {
    setSelectedMessage(message);

    if (!message.is_read && message.recipient_id === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890') {
      await supabase
        .from('messages')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', message.id);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, is_read: true, read_at: new Date().toISOString() } : msg
        )
      );
    }
  };

  const handleToggleStar = async (messageId: string, currentStarred: boolean) => {
    await supabase
      .from('messages')
      .update({ is_starred: !currentStarred })
      .eq('id', messageId);

    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, is_starred: !currentStarred } : msg))
    );

    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, is_starred: !currentStarred });
    }
  };

  const handleReply = () => {
    setComposeMode('reply');
    setShowCompose(true);
    setReplyText('');
  };

  const handleForward = () => {
    setComposeMode('forward');
    setShowCompose(true);
    setReplyText(selectedMessage?.body || '');
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Message</title>');
        printWindow.document.write('<style>body { font-family: Arial, sans-serif; padding: 20px; } h1 { font-size: 24px; margin-bottom: 10px; } .meta { color: #666; margin-bottom: 20px; } .body { line-height: 1.6; white-space: pre-wrap; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printRef.current.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleStartCall = (callType: 'audio' | 'video') => {
    if (selectedMessage) {
      setCallModal({
        isOpen: true,
        callType,
        recipientName: selectedMessage.sender_name,
      });
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = messages.filter((msg) => !msg.is_read && msg.recipient_id === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890').length;

  return (
    <PatientLayout activeNav="messages">
      <div
        style={{
          minHeight: '100vh',
          background: isDarkMode ? '#0F172A' : '#F8FAFC',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: 1600, margin: '0 auto' }}>
          <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
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
                Messages
              </h1>
              <p style={{ fontSize: 18, color: '#64748B', fontWeight: 500 }}>
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            <button
              onClick={() => {
                setComposeMode('new');
                setShowCompose(true);
                setReplyText('');
              }}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                border: 'none',
                borderRadius: 12,
                color: 'white',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <Send size={20} />
              Compose
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: selectedMessage ? '400px 1fr' : '1fr',
              gap: 24,
              height: 'calc(100vh - 250px)',
            }}
          >
            <div
              style={{
                background: isDarkMode ? '#1E293B' : 'white',
                borderRadius: 20,
                border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ padding: 20, borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={20}
                    style={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94A3B8',
                    }}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 48px',
                      background: isDarkMode ? '#0F172A' : '#F8FAFC',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 15,
                      color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    }}
                  />
                </div>
              </div>

              <div style={{ flex: 1, overflow: 'auto' }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
                    Loading messages...
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 40, color: '#64748B' }}>
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleSelectMessage(message)}
                      style={{
                        padding: 20,
                        borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        background:
                          selectedMessage?.id === message.id
                            ? isDarkMode
                              ? '#334155'
                              : '#F1F5F9'
                            : 'transparent',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedMessage?.id !== message.id) {
                          e.currentTarget.style.background = isDarkMode ? '#1E3A5F' : '#F8FAFC';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedMessage?.id !== message.id) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            {!message.is_read && message.recipient_id === 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' ? (
                              <Mail size={18} color="#3B82F6" />
                            ) : (
                              <MailOpen size={18} color="#94A3B8" />
                            )}
                            <span
                              style={{
                                fontSize: 15,
                                fontWeight: message.is_read ? 400 : 700,
                                color: isDarkMode ? '#F1F5F9' : '#1E293B',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {message.sender_name}
                            </span>
                            {message.is_starred && <Star size={16} color="#F59E0B" fill="#F59E0B" />}
                          </div>
                          <div
                            style={{
                              fontSize: 14,
                              fontWeight: message.is_read ? 400 : 700,
                              color: isDarkMode ? '#E2E8F0' : '#334155',
                              marginBottom: 4,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message.subject}
                          </div>
                          <div
                            style={{
                              fontSize: 13,
                              color: '#64748B',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {message.body.substring(0, 60)}...
                          </div>
                        </div>
                        <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                          {new Date(message.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
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
                  borderRadius: 20,
                  border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    padding: 24,
                    borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <button
                    onClick={() => setSelectedMessage(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isDarkMode ? '#F1F5F9' : '#1E293B',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 15,
                      fontWeight: 600,
                    }}
                  >
                    <ChevronLeft size={20} />
                    Back
                  </button>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleToggleStar(selectedMessage.id, selectedMessage.is_starred)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: selectedMessage.is_starred ? '#F59E0B' : '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                      }}
                    >
                      <Star size={20} fill={selectedMessage.is_starred ? '#F59E0B' : 'none'} />
                    </button>

                    <button
                      onClick={handleReply}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                      }}
                    >
                      <Reply size={20} />
                    </button>

                    <button
                      onClick={handleForward}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                      }}
                    >
                      <Forward size={20} />
                    </button>

                    <button
                      onClick={handlePrint}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#475569' : '#E2E8F0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                      }}
                    >
                      <Printer size={20} />
                    </button>

                    <button
                      onClick={() => handleStartCall('audio')}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#10B981',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#10B981';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                        e.currentTarget.style.color = '#10B981';
                      }}
                    >
                      <Phone size={20} />
                    </button>

                    <button
                      onClick={() => handleStartCall('video')}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#3B82F6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#3B82F6';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                        e.currentTarget.style.color = '#3B82F6';
                      }}
                    >
                      <Video size={20} />
                    </button>

                    <button
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: isDarkMode ? '#334155' : '#F8FAFC',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#EF4444';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = isDarkMode ? '#334155' : '#F8FAFC';
                        e.currentTarget.style.color = '#94A3B8';
                      }}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div ref={printRef} style={{ flex: 1, overflow: 'auto', padding: 32 }}>
                  <h1
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: isDarkMode ? '#F1F5F9' : '#1E293B',
                      marginBottom: 24,
                    }}
                  >
                    {selectedMessage.subject}
                  </h1>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      marginBottom: 24,
                      paddingBottom: 24,
                      borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      {selectedMessage.sender_name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: isDarkMode ? '#F1F5F9' : '#1E293B',
                          marginBottom: 4,
                        }}
                      >
                        {selectedMessage.sender_name}
                      </div>
                      <div style={{ fontSize: 14, color: '#64748B' }}>
                        {selectedMessage.sender_email}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Clock size={16} />
                        {new Date(selectedMessage.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}{' '}
                        at{' '}
                        {new Date(selectedMessage.created_at).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>

                  <div
                    className="body"
                    style={{
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: isDarkMode ? '#E2E8F0' : '#334155',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {selectedMessage.body}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CallModal
        isOpen={callModal.isOpen}
        callType={callModal.callType}
        recipientName={callModal.recipientName}
        onClose={() => setCallModal({ isOpen: false, callType: null, recipientName: '' })}
      />
    </PatientLayout>
  );
}
