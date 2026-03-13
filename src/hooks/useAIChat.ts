import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  requiresLogin: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(patientContext?: { name?: string; age?: number }): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi${patientContext?.name ? ` ${patientContext.name}` : ''}! 👋 I'm your CeenAiX AI Health Assistant. How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const isAuthenticated = !!session;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const apiUrl = `${supabaseUrl}/functions/v1/ai-chat`;

      const conversationHistory = messages
        .filter((msg) => msg.role === 'user' || msg.role === 'assistant')
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      };

      if (session) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [...conversationHistory, { role: 'user', content: content.trim() }],
          patientContext,
          isAuthenticated,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();

      if (data.requiresLogin) {
        setRequiresLogin(true);
      } else {
        setRequiresLogin(false);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);

      const errorMsg: Message = {
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hi${patientContext?.name ? ` ${patientContext.name}` : ''}! 👋 I'm your CeenAiX AI Health Assistant. How can I help you today?`,
        timestamp: new Date(),
      },
    ]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    requiresLogin,
    sendMessage,
    clearMessages,
  };
}
