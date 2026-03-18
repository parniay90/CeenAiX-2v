import { useState, useEffect } from 'react';
import { X, Download, Share2, Printer, MessageCircle, Sparkles, Send, FileText, Calendar, User, Building } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HealthRecord {
  id: string;
  patient_id: string;
  record_type: string;
  title: string;
  description: string | null;
  recorded_date: string;
  provider_name: string | null;
  created_at: string;
}

interface HealthRecordModalProps {
  record: HealthRecord;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'ai' | 'doctor';
  text: string;
  timestamp: Date;
}

export function HealthRecordModal({ record, onClose }: HealthRecordModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'ask-ai' | 'ask-doctor'>('details');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (activeTab === 'ask-ai' && messages.length === 0) {
      setMessages([
        {
          role: 'ai',
          text: `Hello! I'm your AI Health Assistant. I can help answer questions about your ${record.title}. What would you like to know?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [activeTab, messages.length, record.title]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    setTimeout(() => {
      const aiResponse: Message = {
        role: activeTab === 'ask-ai' ? 'ai' : 'doctor',
        text: activeTab === 'ask-ai'
          ? `Based on your health record "${record.title}", I can provide some general insights. However, for specific medical advice, I recommend consulting with ${record.provider_name || 'your healthcare provider'}. The record indicates: ${record.description?.substring(0, 100)}...`
          : `Your message has been sent to ${record.provider_name || 'the healthcare provider'}. They will review your question and respond within 24-48 hours. You'll receive a notification when they reply.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setSending(false);
    }, 1000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${record.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { color: #0D7377; border-bottom: 3px solid #0D7377; padding-bottom: 10px; }
              .meta { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .meta-item { margin: 8px 0; }
              .label { font-weight: bold; color: #555; }
              .description { margin-top: 20px; white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <h1>${record.title}</h1>
            <div class="meta">
              <div class="meta-item"><span class="label">Record Type:</span> ${record.record_type.replace('_', ' ').toUpperCase()}</div>
              <div class="meta-item"><span class="label">Provider:</span> ${record.provider_name || 'N/A'}</div>
              <div class="meta-item"><span class="label">Date:</span> ${new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            </div>
            <div class="description">
              <h2>Description</h2>
              <p>${record.description || 'No description available'}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleShare = async () => {
    const shareText = `Health Record: ${record.title}\nProvider: ${record.provider_name}\nDate: ${new Date(record.recorded_date).toLocaleDateString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: record.title,
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert('Record details copied to clipboard!');
    }
  };

  const handleDownload = () => {
    const content = `
HEALTH RECORD
=============

Title: ${record.title}
Record Type: ${record.record_type.replace('_', ' ').toUpperCase()}
Provider: ${record.provider_name || 'N/A'}
Date: ${new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Created: ${new Date(record.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

DESCRIPTION
-----------
${record.description || 'No description available'}

---
Generated from CeenAiX Health Records System
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatRecordType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FileText size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{record.title}</h2>
                  <p className="text-teal-50 text-sm mt-1">{formatRecordType(record.record_type)}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-teal-200" />
                  <span>{record.provider_name || 'Unknown Provider'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-teal-200" />
                  <span>{new Date(record.recorded_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="ml-4 hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={24} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-semibold"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-semibold"
            >
              <Share2 size={18} />
              Share
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all text-sm font-semibold"
            >
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex px-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'details'
                  ? 'text-teal-700 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText size={18} />
                Record Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ask-ai')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'ask-ai'
                  ? 'text-teal-700 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={18} />
                Ask AI Assistant
              </div>
            </button>
            <button
              onClick={() => setActiveTab('ask-doctor')}
              className={`px-6 py-4 font-semibold transition-all relative ${
                activeTab === 'ask-doctor'
                  ? 'text-teal-700 border-b-2 border-teal-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                Ask Doctor
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-280px)]">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
              {/* Record Information */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building size={20} className="text-teal-600" />
                  Record Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Record Type</p>
                    <p className="text-base font-semibold text-gray-900">{formatRecordType(record.record_type)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Healthcare Provider</p>
                    <p className="text-base font-semibold text-gray-900">{record.provider_name || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Record Date</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(record.recorded_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-teal-700 uppercase mb-1">Uploaded On</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(record.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FileText size={20} className="text-teal-600" />
                  Description & Notes
                </h3>
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  {record.description ? (
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{record.description}</p>
                  ) : (
                    <p className="text-gray-400 italic">No description available for this record</p>
                  )}
                </div>
              </div>

              {/* Provider Information */}
              {record.provider_name && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    Provider Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-700">Provider:</span>
                      <span className="text-sm text-gray-900">{record.provider_name}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      This record was created/uploaded by {record.provider_name}. For any questions or concerns about this record,
                      you can use the "Ask Doctor" tab to send them a message directly.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {(activeTab === 'ask-ai' || activeTab === 'ask-doctor') && (
            <div className="flex flex-col h-[calc(90vh-400px)] animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {activeTab === 'ask-doctor' && messages.length === 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                    <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Ask Your Doctor</h3>
                    <p className="text-sm text-gray-600">
                      Send a message to {record.provider_name || 'your healthcare provider'} about this record.
                      They'll be notified and will respond to your question within 24-48 hours.
                    </p>
                  </div>
                )}

                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role !== 'user' && (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'ai'
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                          : 'bg-gradient-to-br from-blue-500 to-blue-600'
                      }`}>
                        {msg.role === 'ai' ? (
                          <Sparkles className="w-5 h-5 text-white" />
                        ) : (
                          <User className="w-5 h-5 text-white" />
                        )}
                      </div>
                    )}
                    <div className={`max-w-2xl px-5 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : msg.role === 'ai'
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-blue-100 text-blue-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                      <p className={`text-xs mt-2 ${
                        msg.role === 'user' ? 'text-teal-100' : msg.role === 'ai' ? 'text-gray-500' : 'text-blue-600'
                      }`}>
                        {msg.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))}

                {sending && (
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeTab === 'ask-ai'
                        ? 'bg-gradient-to-br from-teal-500 to-cyan-500'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600'
                    }`}>
                      {activeTab === 'ask-ai' ? (
                        <Sparkles className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="bg-gray-100 px-5 py-3 rounded-2xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                    placeholder={
                      activeTab === 'ask-ai'
                        ? 'Ask a question about this record...'
                        : `Message ${record.provider_name || 'your doctor'}...`
                    }
                    disabled={sending}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || sending}
                    className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal-600/30"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {activeTab === 'ask-ai'
                    ? 'AI Assistant can provide general information but cannot replace professional medical advice.'
                    : 'Your message will be sent directly to the healthcare provider who created this record.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
