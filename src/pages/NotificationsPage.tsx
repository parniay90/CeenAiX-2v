import { useState, useEffect } from 'react';
import { useNavigation } from '../Router';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export default function NotificationsPage() {
  const { navigateBack } = useNavigation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment': return '📅';
      case 'message': return '💬';
      case 'prescription': return '💊';
      case 'lab_result': return '🧪';
      case 'refill_request': return '🔄';
      case 'payment': return '💳';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment': return '#0D7377';
      case 'message': return '#2563EB';
      case 'prescription': return '#7C3AED';
      case 'lab_result': return '#059669';
      case 'refill_request': return '#DC2626';
      case 'payment': return '#EA580C';
      case 'system': return '#64748B';
      default: return '#0D7377';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFB 0%, #E8F5F5 100%)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
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
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1E293B', margin: 0 }}>Notifications</h1>
            <p style={{ fontSize: 14, color: '#64748B', margin: '4px 0 0 0' }}>
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                background: 'linear-gradient(135deg, #0D7377, #14BDBD)',
                color: 'white',
                border: 'none',
                borderRadius: 10,
                padding: '10px 20px',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', gap: 8, padding: '16px 20px', borderBottom: '1px solid #E2E8F0' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? 'linear-gradient(135deg, #0D7377, #14BDBD)' : 'transparent',
                color: filter === 'all' ? 'white' : '#64748B',
                border: filter === 'all' ? 'none' : '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                background: filter === 'unread' ? 'linear-gradient(135deg, #0D7377, #14BDBD)' : 'transparent',
                color: filter === 'unread' ? 'white' : '#64748B',
                border: filter === 'unread' ? 'none' : '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
                Loading notifications...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div style={{ padding: 60, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#1E293B', marginBottom: 8 }}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </div>
                <div style={{ fontSize: 14, color: '#64748B' }}>
                  {filter === 'unread' ? 'All caught up!' : 'Notifications will appear here when you receive them'}
                </div>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  style={{
                    display: 'flex',
                    gap: 16,
                    padding: '16px 20px',
                    borderBottom: '1px solid #F1F5F9',
                    background: notification.read ? 'white' : '#F0FDFA',
                    cursor: notification.read ? 'default' : 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!notification.read) {
                      e.currentTarget.style.background = '#CCFBF1';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!notification.read) {
                      e.currentTarget.style.background = '#F0FDFA';
                    }
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: `linear-gradient(135deg, ${getNotificationColor(notification.type)}, ${getNotificationColor(notification.type)}CC)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>
                        {notification.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {formatTime(notification.created_at)}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
                      {notification.message}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {!notification.read && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: '#0D7377',
                          marginTop: 6
                        }}
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        fontSize: 16,
                        padding: '4px 8px',
                        borderRadius: 6
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F1F5F9';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
