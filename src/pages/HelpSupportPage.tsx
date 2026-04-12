import { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, FileText, ChevronDown, Send, Clock, CheckCircle, HelpCircle, Video, AlertCircle, ExternalLink, Users, Shield, ArrowLeft } from 'lucide-react';
import { useNavigation } from '../contexts/NavigationContext';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment by navigating to the "Find Care" section, selecting your preferred doctor or specialty, and choosing an available time slot. You will receive a confirmation via email and SMS.',
    category: 'Appointments'
  },
  {
    id: '2',
    question: 'Can I cancel or reschedule my appointment?',
    answer: 'Yes, you can cancel or reschedule appointments up to 24 hours before the scheduled time. Go to "My Appointments", select the appointment, and choose the reschedule or cancel option.',
    category: 'Appointments'
  },
  {
    id: '3',
    question: 'How do I access my medical records?',
    answer: 'Your medical records are available in the "Health Records" section of your dashboard. You can view, download, and share your records securely with healthcare providers.',
    category: 'Medical Records'
  },
  {
    id: '4',
    question: 'How do I request a prescription refill?',
    answer: 'Navigate to the "Prescriptions" page, select the medication you need to refill, and click "Request Refill". Your doctor will review and approve the request.',
    category: 'Prescriptions'
  },
  {
    id: '5',
    question: 'Is my health information secure?',
    answer: 'Yes, we use industry-standard encryption and comply with HIPAA regulations to ensure your health information is completely secure and private.',
    category: 'Privacy & Security'
  },
  {
    id: '6',
    question: 'How do I add a family member to my account?',
    answer: 'Go to your profile settings and select "Family Members". Click "Add Family Member" and fill in their details. They will receive an invitation to link their account.',
    category: 'Account'
  },
  {
    id: '7',
    question: 'What insurance plans do you accept?',
    answer: 'We accept most major insurance plans. You can view the complete list in the "Insurance" section or contact our support team for specific plan verification.',
    category: 'Insurance'
  },
  {
    id: '8',
    question: 'How do I contact my doctor?',
    answer: 'You can message your doctor directly through the "Messages" section. For urgent matters, use the emergency contact feature or call the clinic directly.',
    category: 'Communication'
  },
  {
    id: '9',
    question: 'Can I get lab results online?',
    answer: 'Yes, lab results are automatically uploaded to your account and you will receive a notification when they are available. You can view them in the "Lab Tests" section.',
    category: 'Lab Tests'
  },
  {
    id: '10',
    question: 'What should I do in a medical emergency?',
    answer: 'For life-threatening emergencies, call 911 immediately. For urgent but non-life-threatening issues, use our Emergency AI Assistant or contact our 24/7 hotline.',
    category: 'Emergency'
  },
  {
    id: '11',
    question: 'How do I update my payment information?',
    answer: 'Go to Settings > Payment Settings to add, remove, or update your payment methods. All payment information is securely encrypted.',
    category: 'Billing'
  },
  {
    id: '12',
    question: 'Can I have a video consultation?',
    answer: 'Yes, many of our doctors offer teleconsultation services. When booking an appointment, select "Video Call" as the consultation type.',
    category: 'Appointments'
  }
];

const categories = ['All', 'Appointments', 'Medical Records', 'Prescriptions', 'Privacy & Security', 'Account', 'Insurance', 'Communication', 'Lab Tests', 'Emergency', 'Billing'];

const quickLinks = [
  { icon: Book, label: 'Getting Started Guide', description: 'Learn the basics of using CeenAiX', color: 'bg-blue-50 text-blue-600' },
  { icon: Video, label: 'Video Tutorials', description: 'Watch step-by-step video guides', color: 'bg-purple-50 text-purple-600' },
  { icon: FileText, label: 'Privacy Policy', description: 'Read our privacy policy', color: 'bg-green-50 text-green-600' },
  { icon: Shield, label: 'Terms of Service', description: 'View our terms and conditions', color: 'bg-orange-50 text-orange-600' },
];

export default function HelpSupportPage() {
  const { navigateBack, canGoBack } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (supportMessage.trim() && supportSubject.trim()) {
      setMessageSent(true);
      setSupportMessage('');
      setSupportSubject('');
      setTimeout(() => setMessageSent(false), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {canGoBack && (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={navigateBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 shadow-sm hover:shadow"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          </div>
        </div>
      )}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-3">How can we help you?</h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Find answers to your questions, browse our knowledge base, or contact our support team</p>
          </div>

          <div className="mb-8 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search for help articles, guides, FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all text-slate-900 text-lg shadow-sm"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6 mb-10">
            {quickLinks.map((link, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-5 border border-slate-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${link.color}`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-teal-600 transition-colors">{link.label}</h3>
                <p className="text-sm text-slate-600">{link.description}</p>
                <ExternalLink className="w-4 h-4 text-slate-400 mt-2 group-hover:text-teal-500 transition-colors" />
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <Book className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    <p className="text-sm text-slate-600">Quick answers to common questions</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b border-slate-200">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-200'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredFAQs.length > 0 ? (
                    filteredFAQs.map(faq => (
                      <div
                        key={faq.id}
                        className="border-2 border-slate-200 rounded-xl overflow-hidden hover:border-teal-300 transition-all"
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors group"
                        >
                          <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                                {faq.category}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">{faq.question}</h3>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${expandedFAQ === faq.id ? 'rotate-180' : ''}`} />
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-blue-50 border-t-2 border-slate-200">
                            <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-16">
                      <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-lg">No FAQs match your search</p>
                      <p className="text-slate-400 text-sm mt-1">Try different keywords or contact support</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Contact Support</h2>
                    <p className="text-sm text-slate-600">Send us a message and we'll respond within 24 hours</p>
                  </div>
                </div>

                {messageSent && (
                  <div className="mb-6 p-5 bg-green-50 border-2 border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-green-900 font-semibold mb-1">Message sent successfully!</p>
                      <p className="text-green-700 text-sm">Our support team will respond within 24 hours.</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe your issue or question in detail..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 outline-none resize-none transition-all"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!supportMessage.trim() || !supportSubject.trim()}
                    className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-teal-200 disabled:shadow-none"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">

              <div className="bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <Phone className="w-6 h-6" />
                  <h3 className="text-xl font-bold">24/7 Support</h3>
                </div>
                <div className="space-y-5">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <p className="text-teal-100 text-sm mb-1">Hotline</p>
                    <p className="text-xl font-bold">1-800-CEENAIX</p>
                    <p className="text-teal-100 text-sm mt-1">(1-800-233-6249)</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      <p className="text-teal-100 text-sm">Email</p>
                    </div>
                    <p className="font-semibold break-all">support@ceenaix.com</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      <p className="text-teal-100 text-sm">Response Time</p>
                    </div>
                    <p className="font-semibold">Within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">AI Assistant</h3>
                </div>
                <p className="text-blue-100 mb-6 leading-relaxed">Get instant answers to your questions with our intelligent AI assistant, available 24/7.</p>
                <button className="w-full bg-white text-blue-600 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
                  Chat with AI Assistant
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-slate-600" />
                  <h3 className="text-lg font-bold text-slate-900">Community</h3>
                </div>
                <p className="text-slate-600 text-sm mb-4">Join our community forum to connect with other users and share experiences.</p>
                <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-all">
                  Visit Community Forum
                </button>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-bold text-orange-900">Emergency?</h3>
                </div>
                <p className="text-orange-800 text-sm mb-4">For life-threatening emergencies, call 911 immediately.</p>
                <button className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg">
                  Emergency Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
