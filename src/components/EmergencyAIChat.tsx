import { useState, useRef, useEffect } from 'react';
import { X, Send, AlertTriangle, Phone, Ambulance } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface EmergencyAIChatProps {
  onClose: () => void;
}

export function EmergencyAIChat({ onClose }: EmergencyAIChatProps) {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "I'm the CeenAiX Emergency AI Assistant. I'm here to help assess your situation. Please describe your emergency or symptoms. If this is life-threatening, call 911 immediately.",
      timestamp: new Date(),
      severity: 'medium'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const assessSeverity = (userMessage: string, aiResponse: string): 'low' | 'medium' | 'high' | 'critical' => {
    const critical = ['chest pain', 'can\'t breathe', 'unconscious', 'seizure', 'stroke', 'heart attack', 'severe bleeding', 'suicide'];
    const high = ['difficulty breathing', 'severe pain', 'allergic reaction', 'broken bone', 'high fever', 'bleeding'];
    const medium = ['fever', 'pain', 'injury', 'vomiting', 'diarrhea'];

    const combined = (userMessage + ' ' + aiResponse).toLowerCase();

    if (critical.some(term => combined.includes(term))) return 'critical';
    if (high.some(term => combined.includes(term))) return 'high';
    if (medium.some(term => combined.includes(term))) return 'medium';
    return 'low';
  };

  const generateEmergencyResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('chest pain') || lowerMessage.includes('heart')) {
      return "⚠️ CRITICAL: Chest pain could indicate a heart attack. Call 911 immediately or have someone take you to the emergency room. While waiting:\n\n• Sit down and stay calm\n• Chew an aspirin if available and not allergic\n• Loosen tight clothing\n• Do NOT drive yourself\n\nIs someone with you? Are you able to call 911 now?";
    }

    if (lowerMessage.includes('can\'t breathe') || lowerMessage.includes('difficulty breathing') || lowerMessage.includes('breathing')) {
      return "⚠️ URGENT: Difficulty breathing requires immediate attention. Call 911 now. While waiting:\n\n• Sit upright, don't lie down\n• Loosen tight clothing\n• Try to stay calm and breathe slowly\n• If you have an inhaler, use it\n\nAre you able to speak in full sentences? Do you have a history of asthma?";
    }

    if (lowerMessage.includes('bleeding') || lowerMessage.includes('blood')) {
      return "⚠️ URGENT: For severe bleeding:\n\n• Apply direct pressure with a clean cloth\n• Don't remove the cloth if it soaks through, add more on top\n• Elevate the wound above heart level if possible\n• Call 911 if bleeding doesn't stop in 10 minutes\n\nHow much blood have you lost? Is the bleeding slowing down with pressure?";
    }

    if (lowerMessage.includes('unconscious') || lowerMessage.includes('passed out') || lowerMessage.includes('fainted')) {
      return "⚠️ CRITICAL: If someone is unconscious, call 911 immediately.\n\n• Check if they're breathing\n• Place them on their side (recovery position)\n• Do NOT give them anything to eat or drink\n• Stay with them until help arrives\n\nAre they breathing? Are they responsive to touch or voice?";
    }

    if (lowerMessage.includes('seizure') || lowerMessage.includes('convulsion')) {
      return "⚠️ CRITICAL: During a seizure:\n\n• Call 911 immediately\n• Protect them from injury (move objects away)\n• Do NOT restrain them or put anything in their mouth\n• Time the seizure\n• Turn them on their side when seizure stops\n\nIs this their first seizure? How long has it lasted?";
    }

    if (lowerMessage.includes('stroke') || lowerMessage.includes('face drooping') || lowerMessage.includes('arm weakness')) {
      return "⚠️ CRITICAL: Possible stroke. Use FAST test:\n\n• Face: Is one side drooping?\n• Arms: Can they raise both arms?\n• Speech: Is speech slurred?\n• Time: Call 911 immediately\n\nEvery minute counts in stroke treatment. Do NOT drive to hospital. Which symptoms are you experiencing?";
    }

    if (lowerMessage.includes('allergic reaction') || lowerMessage.includes('swelling') || lowerMessage.includes('hives')) {
      return "⚠️ URGENT: Severe allergic reaction needs immediate care. Call 911 if:\n\n• Difficulty breathing or swallowing\n• Swelling of face, lips, or tongue\n• Dizziness or fainting\n• Use EpiPen if available\n\nDo you have an EpiPen? Are you having trouble breathing or swallowing?";
    }

    if (lowerMessage.includes('poison') || lowerMessage.includes('overdose') || lowerMessage.includes('swallowed')) {
      return "⚠️ CRITICAL: Poisoning emergency:\n\n• Call Poison Control: 1-800-222-1222\n• Call 911 if unconscious, seizing, or not breathing\n• Do NOT induce vomiting unless instructed\n• Keep the substance container if possible\n\nWhat was ingested? How much and when?";
    }

    if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return "Fever assessment:\n\n• High fever (103°F+): Seek urgent care\n• Moderate fever (100-102°F): Monitor and rest\n• Take acetaminophen or ibuprofen\n• Stay hydrated\n• Rest\n\nWhat's your temperature? Do you have other symptoms like rash, stiff neck, or confusion?";
    }

    if (lowerMessage.includes('broken') || lowerMessage.includes('fracture') || lowerMessage.includes('bone')) {
      return "Possible fracture care:\n\n• Don't move the injured area\n• Apply ice (not directly on skin)\n• Elevate if possible\n• Seek medical attention\n• Go to ER if severe pain, deformity, or bone visible\n\nCan you move the area? Is there visible deformity or swelling?";
    }

    if (lowerMessage.includes('burn')) {
      return "Burn treatment:\n\n• Cool the burn with cool (not ice) water for 10-20 minutes\n• Remove jewelry/tight items before swelling\n• Don't break blisters\n• Cover with sterile gauze\n• Seek ER for large burns, face/hand/joint burns, or third-degree burns\n\nHow large is the burn? What caused it?";
    }

    if (lowerMessage.includes('suicide') || lowerMessage.includes('kill myself') || lowerMessage.includes('end my life')) {
      return "⚠️ CRITICAL: Your life matters and help is available:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Call 911 if in immediate danger\n\nYou don't have to face this alone. Will you call 988 now? Is someone with you?";
    }

    if (lowerMessage.includes('anxiety') || lowerMessage.includes('panic attack')) {
      return "For anxiety/panic attack:\n\n• Find a quiet place to sit\n• Practice deep breathing: inhale 4 counts, hold 4, exhale 4\n• Focus on your senses (5 things you see, 4 you hear, etc.)\n• Remind yourself this will pass\n\nCall 988 for mental health crisis support if needed. How long have you been feeling this way?";
    }

    if (lowerMessage.includes('pain')) {
      return "Pain assessment needed:\n\n• Location and type of pain?\n• On a scale of 1-10, how severe?\n• When did it start?\n• Any other symptoms?\n\nSevere, sudden pain (especially chest, abdomen, or head) requires immediate ER visit. Can you describe the pain in more detail?";
    }

    return "I understand you need help. To better assist you, please tell me:\n\n• What are your main symptoms?\n• When did they start?\n• On a scale of 1-10, how severe?\n• Any other medical conditions?\n\nRemember: If this is life-threatening (chest pain, difficulty breathing, severe bleeding, etc.), call 911 immediately. How can I help assess your situation?";
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse = generateEmergencyResponse(userMessage.content);
      const severity = assessSeverity(userMessage.content, aiResponse);

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        severity
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#3B82F6';
      case 'low': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 700,
          height: '80vh',
          maxHeight: 800,
          background: isDarkMode ? '#1A1A2E' : 'white',
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Emergency AI Assistant</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Medical triage and guidance</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              width: 40,
              height: 40,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div
          style={{
            background: 'rgba(220, 38, 38, 0.1)',
            padding: '12px 24px',
            borderBottom: isDarkMode ? '1px solid #2D3748' : '1px solid #FEE2E2',
            display: 'flex',
            gap: 16,
          }}
        >
          <button
            onClick={() => window.location.href = 'tel:911'}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Ambulance size={16} />
            Call 911
          </button>
          <button
            onClick={() => window.location.href = 'tel:1-800-222-1222'}
            style={{
              flex: 1,
              background: isDarkMode ? '#2D3748' : '#FEF2F2',
              color: isDarkMode ? '#F8FAFC' : '#DC2626',
              border: `1px solid ${isDarkMode ? '#374151' : '#FEE2E2'}`,
              padding: '10px 16px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <Phone size={16} />
            Poison Control
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 24,
            background: isDarkMode ? '#0F1923' : '#F8FAFC',
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  maxWidth: '75%',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                    : msg.severity === 'critical'
                    ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                    : isDarkMode ? '#1A1A2E' : 'white',
                  color: msg.role === 'user' || msg.severity === 'critical' ? 'white' : isDarkMode ? '#F8FAFC' : '#1A1A2E',
                  padding: '12px 16px',
                  borderRadius: 16,
                  fontSize: 14,
                  lineHeight: 1.6,
                  boxShadow: isDarkMode ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
                  whiteSpace: 'pre-wrap',
                  border: msg.severity && msg.role === 'assistant'
                    ? `2px solid ${getSeverityColor(msg.severity)}`
                    : 'none',
                }}
              >
                {msg.content}
                <div
                  style={{
                    fontSize: 11,
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div style={{ display: 'flex', gap: 8, padding: '12px 16px' }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#64748B',
                  animation: 'bounce 1.4s infinite ease-in-out both',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#64748B',
                  animation: 'bounce 1.4s infinite ease-in-out both 0.2s',
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#64748B',
                  animation: 'bounce 1.4s infinite ease-in-out both 0.4s',
                }}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: 20,
            background: isDarkMode ? '#1A1A2E' : 'white',
            borderTop: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Describe your symptoms or emergency..."
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: 12,
                border: isDarkMode ? '1px solid #2D3748' : '1px solid #E2E8F0',
                background: isDarkMode ? '#0F1923' : '#F8FAFC',
                color: isDarkMode ? '#F8FAFC' : '#1A1A2E',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              style={{
                background: input.trim() && !isLoading
                  ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)'
                  : '#64748B',
                color: 'white',
                border: 'none',
                width: 48,
                height: 48,
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
              }}
            >
              <Send size={20} />
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8, textAlign: 'center' }}>
            This is AI guidance only. For life-threatening emergencies, call 911 immediately.
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
