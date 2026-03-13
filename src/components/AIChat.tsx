import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { useAIChat } from '../hooks/useAIChat';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useTheme } from '../contexts/ThemeContext';

export function AIChat() {
  const { profile } = useUserProfile();
  const { isDarkMode } = useTheme();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading, sendMessage } = useAIChat({
    name: profile.full_name,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const messageToSend = input;
    setInput('');
    await sendMessage(messageToSend);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: isDarkMode ? '#16213E' : 'white',
        borderRadius: 16,
        border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
          background: isDarkMode ? '#1A1A2E' : '#F8FAFC',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bot size={20} color="white" />
          </div>
          <div>
            <h3
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                marginBottom: 2,
              }}
            >
              AI Health Assistant
            </h3>
            <p style={{ fontSize: 12, color: '#64748B' }}>Powered by ChatGPT</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            {message.role === 'assistant' ? (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Bot size={16} color="white" />
              </div>
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: isDarkMode ? '#2D3748' : '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={16} color={isDarkMode ? '#94A3B8' : '#64748B'} />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  background:
                    message.role === 'assistant'
                      ? isDarkMode
                        ? '#2D3748'
                        : '#F8FAFC'
                      : isDarkMode
                      ? '#0D7377'
                      : '#EFF6FF',
                  padding: '12px 16px',
                  borderRadius: 12,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color:
                    message.role === 'assistant'
                      ? isDarkMode
                        ? '#E2E8F0'
                        : '#1A1A2E'
                      : isDarkMode
                      ? '#F8FAFC'
                      : '#1A1A2E',
                }}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={16} color="white" />
            </div>
            <div
              style={{
                background: isDarkMode ? '#2D3748' : '#F8FAFC',
                padding: '12px 16px',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Loader2
                size={16}
                color={isDarkMode ? '#94A3B8' : '#64748B'}
                style={{ animation: 'spin 1s linear infinite' }}
              />
              <span style={{ fontSize: 14, color: isDarkMode ? '#94A3B8' : '#64748B' }}>
                Thinking...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '16px 24px',
          borderTop: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
          background: isDarkMode ? '#1A1A2E' : 'white',
        }}
      >
        <div style={{ display: 'flex', gap: 12 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your health..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
              borderRadius: 10,
              fontSize: 14,
              outline: 'none',
              background: isDarkMode ? '#16213E' : 'white',
              color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              padding: '12px 20px',
              background:
                !input.trim() || isLoading
                  ? isDarkMode
                    ? '#2D3748'
                    : '#E2E8F0'
                  : 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
              border: 'none',
              borderRadius: 10,
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: !input.trim() || isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.2s',
              opacity: !input.trim() || isLoading ? 0.5 : 1,
            }}
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </form>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
