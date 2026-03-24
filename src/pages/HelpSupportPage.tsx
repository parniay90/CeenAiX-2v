import { useState } from 'react';
import { Search, Book, MessageCircle, Phone, Mail, FileText, ChevronDown, ChevronRight, Send, Clock, CheckCircle } from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';

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
  }
];

const categories = ['All', 'Appointments', 'Medical Records', 'Prescriptions', 'Privacy & Security', 'Account', 'Insurance', 'Communication', 'Lab Tests', 'Emergency'];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [supportMessage, setSupportMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (supportMessage.trim()) {
      setMessageSent(true);
      setSupportMessage('');
      setTimeout(() => setMessageSent(false), 5000);
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Help & Support</h1>
            <p className="text-slate-600">Find answers to your questions or contact our support team</p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all text-slate-900"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-6">

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Book className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedCategory === category
                          ? 'bg-teal-600 text-white shadow-sm'
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
                        className="border border-slate-200 rounded-lg overflow-hidden hover:border-teal-300 transition-colors"
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded">
                                {faq.category}
                              </span>
                            </div>
                            <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                          </div>
                          {expandedFAQ === faq.id ? (
                            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFAQ === faq.id && (
                          <div className="px-5 py-4 bg-slate-50 border-t border-slate-200">
                            <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-slate-500">No FAQs match your search. Try different keywords or contact support.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-6 h-6 text-teal-600" />
                  <h2 className="text-2xl font-bold text-slate-900">Send us a message</h2>
                </div>
                <p className="text-slate-600 mb-4">Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.</p>

                {messageSent && (
                  <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="text-green-800 font-medium">Message sent successfully! We'll respond within 24 hours.</p>
                  </div>
                )}

                <textarea
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your issue or question..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none mb-4"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!supportMessage.trim()}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </div>
            </div>

            <div className="space-y-6">

              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Contact Support</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">24/7 Hotline</p>
                      <p className="text-teal-100">1-800-CEENAIX</p>
                      <p className="text-sm text-teal-100 mt-1">(1-800-233-6249)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Email Support</p>
                      <p className="text-teal-100">support@ceenaix.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">Response Time</p>
                      <p className="text-teal-100">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="text-slate-700 group-hover:text-teal-600 font-medium">User Guide</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="text-slate-700 group-hover:text-teal-600 font-medium">Privacy Policy</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <FileText className="w-5 h-5 text-teal-600" />
                    <span className="text-slate-700 group-hover:text-teal-600 font-medium">Terms of Service</span>
                  </a>
                  <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                    <Book className="w-5 h-5 text-teal-600" />
                    <span className="text-slate-700 group-hover:text-teal-600 font-medium">Video Tutorials</span>
                  </a>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Need Immediate Help?</h3>
                <p className="text-blue-100 mb-4">Our AI Assistant is available 24/7 to answer your questions instantly.</p>
                <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                  Chat with AI Assistant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
