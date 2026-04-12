import { useState } from 'react';
import {
  ArrowLeft,
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Globe,
  Cookie,
  AlertCircle,
  FileText,
  Mail,
  Settings,
  Share2,
  Bell,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useNavigation } from '../contexts/NavigationContext';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
  subsections?: { title: string; items: string[] }[];
}

export default function PrivacyPolicy() {
  const { navigateBack } = useNavigation();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['introduction']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const sections: Section[] = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: <Shield size={20} />,
      content: [
        'At CeenAiX, we are committed to protecting your privacy and ensuring the security of your personal health information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our healthcare platform.',
        'We understand the sensitive nature of health information and comply with applicable privacy laws, including the Health Insurance Portability and Accountability Act (HIPAA) where applicable, and the General Data Protection Regulation (GDPR) for users in the European Economic Area.',
        'By using CeenAiX, you consent to the practices described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our platform.',
      ],
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      icon: <Database size={20} />,
      content: [
        'We collect several types of information from and about users of our platform:',
      ],
      subsections: [
        {
          title: 'Personal Information',
          items: [
            'Name, email address, phone number, and date of birth',
            'Government-issued identification numbers (when required for verification)',
            'Profile photos and avatars',
            'Demographic information such as gender and language preference',
          ],
        },
        {
          title: 'Health Information',
          items: [
            'Medical history, symptoms, and diagnoses',
            'Medications and allergies',
            'Lab results and test reports',
            'Appointment notes and consultation records',
            'Insurance information and claims data',
            'Vital signs and health metrics',
          ],
        },
        {
          title: 'Payment Information',
          items: [
            'Credit card numbers and billing addresses (processed securely through third-party payment processors)',
            'Transaction history and payment records',
            'Insurance provider details and policy numbers',
          ],
        },
        {
          title: 'Usage Information',
          items: [
            'Device information (IP address, browser type, operating system)',
            'Log data (access times, pages viewed, features used)',
            'Location data (when you enable location services)',
            'Cookies and similar tracking technologies',
          ],
        },
      ],
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: <Settings size={20} />,
      content: [
        'We use the information we collect for the following purposes:',
      ],
      subsections: [
        {
          title: 'To Provide Healthcare Services',
          items: [
            'Facilitate appointments and consultations with healthcare providers',
            'Enable communication between patients and providers',
            'Process prescriptions and lab orders',
            'Maintain your medical records and health history',
            'Provide personalized health recommendations through our AI Assistant',
          ],
        },
        {
          title: 'To Improve Our Platform',
          items: [
            'Analyze usage patterns to enhance user experience',
            'Develop new features and services',
            'Conduct research and analytics (using de-identified data)',
            'Test and optimize platform performance',
          ],
        },
        {
          title: 'To Communicate With You',
          items: [
            'Send appointment reminders and notifications',
            'Provide customer support and respond to inquiries',
            'Send administrative information and updates',
            'Deliver marketing communications (with your consent)',
          ],
        },
        {
          title: 'For Legal and Security Purposes',
          items: [
            'Comply with legal obligations and regulations',
            'Detect and prevent fraud and security threats',
            'Enforce our Terms and Conditions',
            'Protect the rights and safety of our users',
          ],
        },
      ],
    },
    {
      id: 'information-sharing',
      title: 'How We Share Your Information',
      icon: <Share2 size={20} />,
      content: [
        'We do not sell your personal health information. We share your information only in the following circumstances:',
      ],
      subsections: [
        {
          title: 'With Healthcare Providers',
          items: [
            'We share necessary medical information with doctors, clinics, hospitals, labs, and pharmacies to facilitate your care',
            'Healthcare providers can only access information relevant to your treatment',
            'All providers are bound by professional confidentiality obligations',
          ],
        },
        {
          title: 'With Service Providers',
          items: [
            'Payment processors for transaction processing',
            'Cloud storage providers for data hosting',
            'Analytics services for platform improvement',
            'Customer support tools and communication platforms',
            'All third-party service providers are contractually obligated to protect your data',
          ],
        },
        {
          title: 'For Legal Compliance',
          items: [
            'When required by law, regulation, or legal process',
            'To comply with court orders or government requests',
            'To protect our rights, property, or safety',
            'In connection with the investigation of fraud or security issues',
          ],
        },
        {
          title: 'With Your Consent',
          items: [
            'When you explicitly authorize us to share information',
            'For research purposes (using de-identified data)',
            'When you use third-party integrations or services',
          ],
        },
      ],
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock size={20} />,
      content: [
        'We implement comprehensive security measures to protect your information from unauthorized access, disclosure, alteration, and destruction:',
      ],
      subsections: [
        {
          title: 'Technical Safeguards',
          items: [
            'End-to-end encryption for data transmission (TLS/SSL)',
            'Encryption of sensitive data at rest',
            'Secure authentication and access controls',
            'Regular security audits and penetration testing',
            'Intrusion detection and prevention systems',
          ],
        },
        {
          title: 'Administrative Safeguards',
          items: [
            'Role-based access control limiting who can view your information',
            'Employee training on privacy and security practices',
            'Confidentiality agreements with all staff and contractors',
            'Regular privacy and security policy reviews',
          ],
        },
        {
          title: 'Physical Safeguards',
          items: [
            'Secure data centers with restricted physical access',
            'Environmental controls and monitoring',
            'Backup and disaster recovery systems',
          ],
        },
      ],
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: <UserCheck size={20} />,
      content: [
        'You have several rights regarding your personal and health information:',
      ],
      subsections: [
        {
          title: 'Access and Portability',
          items: [
            'Right to access your personal and health information',
            'Right to receive a copy of your data in a portable format',
            'Right to request your medical records',
          ],
        },
        {
          title: 'Correction and Update',
          items: [
            'Right to correct inaccurate or incomplete information',
            'Right to update your profile and preferences',
            'Right to amend your medical records (subject to provider approval)',
          ],
        },
        {
          title: 'Deletion and Restriction',
          items: [
            'Right to request deletion of your account and data',
            'Right to restrict certain types of data processing',
            'Right to object to specific uses of your information',
          ],
        },
        {
          title: 'Communication Preferences',
          items: [
            'Right to opt-out of marketing communications',
            'Right to manage notification settings',
            'Right to withdraw consent for non-essential data processing',
          ],
        },
        {
          title: 'For EU/EEA Users (GDPR Rights)',
          items: [
            'Right to lodge a complaint with a supervisory authority',
            'Right to data portability in machine-readable format',
            'Right to object to automated decision-making',
          ],
        },
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: <Cookie size={20} />,
      content: [
        'We use cookies and similar tracking technologies to enhance your experience on our platform:',
      ],
      subsections: [
        {
          title: 'Essential Cookies',
          items: [
            'Required for platform functionality and security',
            'Enable user authentication and session management',
            'Cannot be disabled without affecting platform performance',
          ],
        },
        {
          title: 'Functional Cookies',
          items: [
            'Remember your preferences and settings',
            'Provide personalized features and content',
            'Enable social media integration',
          ],
        },
        {
          title: 'Analytics Cookies',
          items: [
            'Help us understand how users interact with our platform',
            'Provide insights for improving our services',
            'Generate statistical reports on usage patterns',
          ],
        },
        {
          title: 'Managing Cookies',
          items: [
            'You can control cookies through your browser settings',
            'Disabling cookies may affect platform functionality',
            'You can opt-out of analytics tracking in your account settings',
          ],
        },
      ],
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: <Database size={20} />,
      content: [
        'We retain your information for as long as necessary to provide our services and comply with legal obligations:',
      ],
      subsections: [
        {
          title: 'Active Account Data',
          items: [
            'Personal and health information is retained while your account is active',
            'Medical records are maintained according to healthcare regulations',
            'Payment records are kept for tax and accounting purposes',
          ],
        },
        {
          title: 'After Account Deletion',
          items: [
            'Some information may be retained to comply with legal requirements',
            'Medical records may be archived according to healthcare laws',
            'De-identified data may be retained for research and analytics',
            'Backup copies may persist for a limited time in our systems',
          ],
        },
        {
          title: 'Legal Retention Requirements',
          items: [
            'We comply with applicable laws governing medical record retention',
            'Financial records are maintained according to tax regulations',
            'Audit logs may be retained for security and compliance purposes',
          ],
        },
      ],
    },
    {
      id: 'children',
      title: "Children's Privacy",
      icon: <AlertCircle size={20} />,
      content: [
        'Our platform is designed for users aged 18 and above. We do not knowingly collect personal information from children under 18 without parental consent.',
        'If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately. We will take steps to remove such information from our systems.',
        'For users under 18, we require parental or guardian involvement in creating and managing the account.',
      ],
    },
    {
      id: 'international',
      title: 'International Data Transfers',
      icon: <Globe size={20} />,
      content: [
        'Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws.',
        'When we transfer data internationally, we ensure appropriate safeguards are in place:',
      ],
      subsections: [
        {
          title: 'Protection Measures',
          items: [
            'Standard contractual clauses approved by regulatory authorities',
            'Data processing agreements with third-party providers',
            'Compliance with applicable cross-border data transfer regulations',
            'Encryption during transmission and storage',
          ],
        },
      ],
    },
    {
      id: 'ai-disclaimer',
      title: 'AI and Automated Processing',
      icon: <Eye size={20} />,
      content: [
        'Our AI Assistant uses artificial intelligence to provide health information and assistance:',
      ],
      subsections: [
        {
          title: 'How AI Is Used',
          items: [
            'To answer general health questions and provide information',
            'To help you navigate the platform and find services',
            'To provide appointment scheduling assistance',
            'To generate health insights from your data (with your consent)',
          ],
        },
        {
          title: 'Your Rights Regarding AI',
          items: [
            'You have the right to know when AI is being used',
            'You can request human review of AI-generated recommendations',
            'You can opt-out of AI-powered features in your settings',
            'AI does not make medical decisions without human oversight',
          ],
        },
        {
          title: 'AI Data Usage',
          items: [
            'AI interactions may be logged for quality improvement',
            'Your data is not used to train AI models without consent',
            'AI processing respects your privacy settings and preferences',
          ],
        },
      ],
    },
    {
      id: 'updates',
      title: 'Changes to This Privacy Policy',
      icon: <Bell size={20} />,
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors.',
        'When we make material changes, we will notify you by:',
      ],
      subsections: [
        {
          title: 'Notification Methods',
          items: [
            'Sending an email to the address associated with your account',
            'Displaying a prominent notice on our platform',
            'Requiring you to acknowledge the changes upon login',
          ],
        },
        {
          title: 'Your Options',
          items: [
            'You can review the updated policy before continuing to use our services',
            'If you disagree with changes, you may close your account',
            'Continued use after notification constitutes acceptance of changes',
          ],
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: <Mail size={20} />,
      content: [
        'If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:',
      ],
      subsections: [
        {
          title: 'Privacy Office',
          items: [
            'Email: privacy@ceenaix.com',
            'Support: support@ceenaix.com',
            'Data Protection Officer: dpo@ceenaix.com',
            'Address: CeenAiX Healthcare Platform, Dubai, United Arab Emirates',
          ],
        },
        {
          title: 'Response Time',
          items: [
            'We will respond to privacy inquiries within 48 hours during business days',
            'Requests to access or delete data will be processed within 30 days',
            'Urgent security matters will be addressed immediately',
          ],
        },
      ],
    },
  ];

  return (
    <PatientLayout activeNav="profile">
      <div
        style={{
          minHeight: '100%',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          padding: '32px 24px',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Back Button */}
          <button
            onClick={() => navigateBack()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 16px',
              background: 'white',
              border: '1px solid #E2E8F0',
              borderRadius: 8,
              color: '#475569',
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 24,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          {/* Header */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 40,
              marginBottom: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Shield size={28} color="white" />
              </div>
              <div>
                <h1
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#1A1A2E',
                    marginBottom: 4,
                  }}
                >
                  Privacy Policy
                </h1>
                <p style={{ fontSize: 14, color: '#64748B' }}>
                  Last updated: March 13, 2026
                </p>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
              Your privacy is our priority. This policy explains how we collect, use, protect, and
              share your personal and health information when you use CeenAiX.
            </p>
          </div>

          {/* Quick Summary */}
          <div
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #BFDBFE',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1E40AF',
                marginBottom: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Eye size={20} />
              Quick Summary
            </h2>
            <div style={{ display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1E40AF',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <p style={{ fontSize: 14, color: '#1E3A8A', lineHeight: 1.6 }}>
                  We collect personal and health information to provide healthcare services and
                  improve our platform
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1E40AF',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <p style={{ fontSize: 14, color: '#1E3A8A', lineHeight: 1.6 }}>
                  We never sell your health information and only share it with healthcare providers
                  for your treatment
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1E40AF',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <p style={{ fontSize: 14, color: '#1E3A8A', lineHeight: 1.6 }}>
                  You have the right to access, correct, and delete your information at any time
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#1E40AF',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <p style={{ fontSize: 14, color: '#1E3A8A', lineHeight: 1.6 }}>
                  We use industry-standard security measures including encryption to protect your data
                </p>
              </div>
            </div>
          </div>

          {/* Table of Contents */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 28,
              marginBottom: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1A1A2E',
                marginBottom: 16,
              }}
            >
              Table of Contents
            </h2>
            <div style={{ display: 'grid', gap: 8 }}>
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => {
                    const element = document.getElementById(section.id);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 8,
                    color: '#475569',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#0D7377';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }}
                >
                  <span style={{ color: '#94A3B8', fontSize: 12, fontWeight: 600, minWidth: 24 }}>
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <span style={{ flex: 1 }}>{section.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: 'grid', gap: 16 }}>
            {sections.map((section, index) => {
              const isExpanded = expandedSections.has(section.id);
              return (
                <div
                  key={section.id}
                  id={section.id}
                  style={{
                    background: 'white',
                    borderRadius: 16,
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                  }}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 24,
                      background: isExpanded ? '#F8FAFC' : 'white',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = '#F8FAFC';
                    }}
                    onMouseLeave={(e) => {
                      if (!isExpanded) e.currentTarget.style.background = 'white';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: isExpanded
                            ? 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)'
                            : '#EFF6FF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isExpanded ? 'white' : '#0D7377',
                        }}
                      >
                        {section.icon}
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: '#94A3B8',
                            marginBottom: 2,
                          }}
                        >
                          SECTION {(index + 1).toString().padStart(2, '0')}
                        </div>
                        <div
                          style={{
                            fontSize: 18,
                            fontWeight: 700,
                            color: '#1A1A2E',
                          }}
                        >
                          {section.title}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={20} color="#64748B" />
                    ) : (
                      <ChevronDown size={20} color="#64748B" />
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 24px 24px 24px',
                        borderTop: '1px solid #F1F5F9',
                      }}
                    >
                      {section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          style={{
                            fontSize: 14,
                            color: '#475569',
                            lineHeight: 1.8,
                            marginBottom: 16,
                          }}
                        >
                          {paragraph}
                        </p>
                      ))}

                      {section.subsections && (
                        <div style={{ marginTop: 16 }}>
                          {section.subsections.map((subsection, subIndex) => (
                            <div key={subIndex} style={{ marginBottom: 20 }}>
                              <h3
                                style={{
                                  fontSize: 15,
                                  fontWeight: 700,
                                  color: '#1A1A2E',
                                  marginBottom: 12,
                                }}
                              >
                                {subsection.title}
                              </h3>
                              <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {subsection.items.map((item, itemIndex) => (
                                  <li
                                    key={itemIndex}
                                    style={{
                                      fontSize: 14,
                                      color: '#475569',
                                      lineHeight: 1.8,
                                      marginBottom: 8,
                                    }}
                                  >
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              padding: 32,
              marginTop: 24,
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: '#DBEAFE',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Shield size={16} color="#1E40AF" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1E3A8A' }}>
                Your Privacy Matters
              </span>
            </div>
            <p
              style={{
                fontSize: 14,
                color: '#475569',
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              If you have any questions about how we handle your data or wish to exercise your
              privacy rights, please contact us at privacy@ceenaix.com
            </p>
            <button
              onClick={() => navigateBack()}
              style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)',
                border: 'none',
                borderRadius: 10,
                color: 'white',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
