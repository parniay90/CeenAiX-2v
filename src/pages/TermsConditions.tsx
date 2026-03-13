import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  Shield,
  Users,
  AlertTriangle,
  Globe,
  Lock,
  CreditCard,
  UserX,
  Scale,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PatientLayout } from '../components/PatientLayout';
import { useNavigation } from '../Router';

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string[];
}

export default function TermsConditions() {
  const { navigateToPatientPortal } = useNavigation();
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
      icon: <FileText size={20} />,
      content: [
        'Welcome to CeenAiX, a comprehensive healthcare platform designed to connect patients with healthcare providers, facilities, and services. These Terms and Conditions ("Terms") govern your access to and use of our platform, including our website, mobile applications, and all related services.',
        'By accessing or using CeenAiX, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our platform.',
        'We reserve the right to modify these Terms at any time. Your continued use of the platform after such modifications constitutes your acceptance of the updated Terms.',
      ],
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: <Globe size={20} />,
      content: [
        '"Platform" refers to the CeenAiX website, mobile applications, and all related services.',
        '"User" refers to any individual who accesses or uses the Platform, including patients, healthcare providers, and administrators.',
        '"Healthcare Provider" refers to licensed medical professionals, clinics, hospitals, and other healthcare facilities registered on the Platform.',
        '"Patient" refers to individuals seeking or receiving healthcare services through the Platform.',
        '"Services" refers to all features, functionalities, and services provided through the Platform.',
        '"Personal Health Information" (PHI) refers to any health-related data that can identify an individual.',
      ],
    },
    {
      id: 'eligibility',
      title: 'User Eligibility',
      icon: <Users size={20} />,
      content: [
        'You must be at least 18 years old to create an account and use our Services. Users under 18 may only use the Platform with the involvement and consent of a parent or legal guardian.',
        'By using the Platform, you represent and warrant that you have the legal capacity to enter into these Terms and comply with all applicable laws and regulations.',
        'Healthcare Providers must maintain valid and current professional licenses and credentials. You agree to promptly update your credentials if they change or expire.',
        'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.',
      ],
    },
    {
      id: 'medical-disclaimer',
      title: 'Medical Disclaimer',
      icon: <AlertTriangle size={20} />,
      content: [
        'CeenAiX is a platform that facilitates connections between patients and healthcare providers. We do not provide medical advice, diagnosis, or treatment.',
        'The AI Assistant feature is designed to provide general health information and help you navigate the platform. It is not a substitute for professional medical advice, diagnosis, or treatment.',
        'Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of information obtained through the Platform.',
        'In case of a medical emergency, immediately call emergency services or visit the nearest emergency room. Do not rely on the Platform for emergency medical assistance.',
        'Healthcare Providers are solely responsible for the medical services they provide. CeenAiX does not supervise, direct, control, or monitor the healthcare services provided by Healthcare Providers.',
      ],
    },
    {
      id: 'privacy',
      title: 'Privacy and Data Protection',
      icon: <Shield size={20} />,
      content: [
        'Your privacy is important to us. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.',
        'We implement industry-standard security measures to protect your Personal Health Information (PHI) in compliance with applicable healthcare privacy laws, including HIPAA (where applicable).',
        'You consent to the collection, use, and sharing of your information as described in our Privacy Policy. This includes sharing necessary medical information with Healthcare Providers to facilitate your care.',
        'You have the right to access, correct, or delete your personal information in accordance with applicable laws. Please refer to our Privacy Policy for more information.',
        'We use encryption and secure protocols to protect data transmission. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.',
      ],
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      icon: <UserX size={20} />,
      content: [
        'You agree to provide accurate, current, and complete information when creating your account and using our Services.',
        'Patients are responsible for providing accurate medical history, symptoms, and other health information to Healthcare Providers.',
        'You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, or impair the Platform.',
        'You will not attempt to gain unauthorized access to any part of the Platform, other user accounts, or computer systems connected to the Platform.',
        'You agree not to interfere with or disrupt the Platform or servers or networks connected to the Platform.',
        'You will not upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.',
        'Healthcare Providers agree to maintain the confidentiality of patient information and comply with all applicable medical ethics and professional standards.',
      ],
    },
    {
      id: 'appointments',
      title: 'Appointments and Consultations',
      icon: <FileText size={20} />,
      content: [
        'The Platform allows you to schedule appointments with Healthcare Providers. Appointment availability is determined by individual Healthcare Providers.',
        'You are responsible for attending scheduled appointments or canceling them in advance according to the Healthcare Provider\'s cancellation policy.',
        'Healthcare Providers may charge cancellation fees for late cancellations or no-shows. These fees are determined by individual Healthcare Providers.',
        'Telemedicine consultations are subject to additional terms and may not be available in all jurisdictions. Both patients and Healthcare Providers must comply with applicable telemedicine regulations.',
        'The Platform facilitates appointment scheduling but is not responsible for the quality, timing, or outcomes of healthcare services provided.',
      ],
    },
    {
      id: 'payments',
      title: 'Payments and Billing',
      icon: <CreditCard size={20} />,
      content: [
        'Healthcare services provided through the Platform may be subject to fees determined by individual Healthcare Providers or facilities.',
        'Payment processing is handled through secure third-party payment processors. You agree to abide by the terms and conditions of these payment processors.',
        'You are responsible for all charges incurred under your account, including consultation fees, prescription costs, and any applicable taxes.',
        'Insurance coverage varies by provider and service. You are responsible for verifying your insurance coverage and understanding your benefits.',
        'Refunds, if applicable, are subject to the policies of individual Healthcare Providers and payment processors.',
        'The Platform may charge platform fees or service fees for certain features. These fees will be clearly disclosed before you incur them.',
      ],
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: <Lock size={20} />,
      content: [
        'The Platform, including all content, features, functionality, software, and design, is owned by CeenAiX and is protected by international copyright, trademark, and other intellectual property laws.',
        'You are granted a limited, non-exclusive, non-transferable license to access and use the Platform for your personal, non-commercial use.',
        'You may not copy, modify, distribute, sell, or lease any part of the Platform or its content without our express written permission.',
        'User-generated content remains the property of the user, but by posting content on the Platform, you grant us a worldwide, non-exclusive, royalty-free license to use, display, and distribute such content in connection with the Platform.',
        'All trademarks, service marks, and logos displayed on the Platform are the property of their respective owners.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <Scale size={20} />,
      content: [
        'TO THE MAXIMUM EXTENT PERMITTED BY LAW, CEENAIX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.',
        'CeenAiX is not liable for the actions, errors, or omissions of Healthcare Providers. Healthcare Providers are independent professionals responsible for their own services.',
        'We do not guarantee that the Platform will be uninterrupted, secure, or error-free. We reserve the right to modify, suspend, or discontinue any part of the Platform at any time.',
        'You use the Platform at your own risk. The Platform is provided "as is" and "as available" without warranties of any kind, either express or implied.',
        'Our total liability to you for any claims arising from your use of the Platform shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.',
        'Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability, so some of the above limitations may not apply to you.',
      ],
    },
    {
      id: 'termination',
      title: 'Account Termination',
      icon: <UserX size={20} />,
      content: [
        'You may terminate your account at any time by contacting our support team or using the account deletion feature in your settings.',
        'We reserve the right to suspend or terminate your account at any time, with or without notice, for violations of these Terms or for any other reason.',
        'Upon termination, your right to use the Platform will immediately cease. We may retain certain information as required by law or for legitimate business purposes.',
        'Healthcare Providers must ensure continuity of care for their patients before terminating their accounts.',
        'Termination does not relieve you of any obligations incurred prior to termination, including payment obligations.',
      ],
    },
    {
      id: 'governing-law',
      title: 'Governing Law and Dispute Resolution',
      icon: <Scale size={20} />,
      content: [
        'These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates, without regard to its conflict of law provisions.',
        'Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the Dubai International Arbitration Centre.',
        'You agree to waive your right to participate in class actions or class arbitrations.',
        'Notwithstanding the above, we may seek injunctive or other equitable relief in any court of competent jurisdiction to protect our intellectual property rights.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: <Mail size={20} />,
      content: [
        'If you have any questions about these Terms or the Platform, please contact us at:',
        'Email: legal@ceenaix.com',
        'Support: support@ceenaix.com',
        'Address: CeenAiX Healthcare Platform, Dubai, United Arab Emirates',
        'We will respond to your inquiries within 48 hours during business days.',
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
            onClick={() => navigateToPatientPortal()}
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
                <FileText size={28} color="white" />
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
                  Terms & Conditions
                </h1>
                <p style={{ fontSize: 14, color: '#64748B' }}>
                  Last updated: March 13, 2026
                </p>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
              Please read these terms and conditions carefully before using the CeenAiX platform.
              By accessing or using our services, you acknowledge that you have read, understood, and
              agree to be bound by these terms.
            </p>
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
                            marginBottom: pIndex < section.content.length - 1 ? 16 : 0,
                          }}
                        >
                          {paragraph}
                        </p>
                      ))}
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
                background: '#FEF3C7',
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <AlertTriangle size={16} color="#D97706" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
                Important Notice
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
              By continuing to use CeenAiX, you acknowledge that you have read, understood, and
              agree to be bound by these Terms & Conditions. If you do not agree to these terms,
              please discontinue use of the platform immediately.
            </p>
            <button
              onClick={() => navigateToPatientPortal()}
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
              I Understand and Agree
            </button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
