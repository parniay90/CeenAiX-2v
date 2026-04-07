import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Printer, Share2, CheckCircle, AlertCircle, AlertTriangle, XCircle, FileText, Clock, Users, Eye, Copy, Mail, ExternalLink, ChevronDown, ChevronUp, X, Check } from 'lucide-react';

export default function PharmacyTermsConditions() {
  const [acceptanceStatus, setAcceptanceStatus] = useState<'accepted' | 'pending' | 'overdue'>('pending');
  const [readingProgress, setReadingProgress] = useState(78);
  const [activeSection, setActiveSection] = useState(1);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [lineSpacing, setLineSpacing] = useState<'compact' | 'normal' | 'spacious'>('normal');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [acceptCheckbox1, setAcceptCheckbox1] = useState(false);
  const [acceptCheckbox2, setAcceptCheckbox2] = useState(false);
  const [acceptCheckbox3, setAcceptCheckbox3] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [acceptanceComplete, setAcceptanceComplete] = useState(false);
  const [expandedChanges, setExpandedChanges] = useState(true);

  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (documentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = documentRef.current;
        const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
        setReadingProgress(progress);
      }
    };

    const ref = documentRef.current;
    if (ref) {
      ref.addEventListener('scroll', handleScroll);
      return () => ref.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      setAcceptanceComplete(true);
      setAcceptanceStatus('accepted');
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    alert('PDF downloaded: CeenAiX_TC_v2.1_AlShifa_15Mar2026.pdf');
  };

  const canAccept = acceptCheckbox1 && acceptCheckbox2 && readingProgress >= 90;

  const sections = [
    'Introduction & Definitions',
    'Acceptance of Terms',
    'Platform Overview & Access',
    'License & Permitted Use',
    'DHA Compliance Obligations',
    'Prescription Handling Standards',
    'Patient Data & Privacy',
    'Controlled Substance Requirements',
    'Insurance Claims Integrity',
    'Nabidh HIE Obligations',
    'Staff & Account Responsibilities',
    'System Security Requirements',
    'Intellectual Property',
    'Payment & Subscription Terms',
    'Limitation of Liability',
    'Indemnification',
    'Termination & Suspension',
    'Dispute Resolution',
    'Governing Law & Jurisdiction',
    'Amendments & Updates',
    'Contact Information',
  ];

  const changes = [
    { section: '4.3', clause: 'DDA Reporting', change: 'Updated deadline from month-end to 15th', type: 'modified' },
    { section: '2.6', clause: 'Telemedicine', change: 'Telemedicine prescription clause added', type: 'added' },
    { section: '8.4', clause: 'Data Retention', change: 'Extended to 25 years from 10 years', type: 'modified' },
    { section: '12', clause: 'Governing Law', change: 'Updated UAE law references', type: 'modified' },
    { section: '17', clause: 'Termination', change: 'Emergency suspension clause added', type: 'added' },
  ];

  const teamMembers = [
    { name: 'Sara Al Mansoori', role: 'Head Pharmacist', status: 'accepted', version: 'v2.1', date: '4 Mar 2026' },
    { name: 'Ahmed Khalid', role: 'Pharmacist', status: 'accepted', version: 'v2.1', date: '5 Mar 2026' },
    { name: 'Fatima Al Rashidi', role: 'Technician', status: 'accepted', version: 'v2.1', date: '6 Mar 2026' },
    { name: 'Omar Hassan', role: 'Pharmacist', status: 'outdated', version: 'v2.0', date: '15 Jul 2025' },
    { name: 'Layla Al Mansouri', role: 'Admin', status: 'accepted', version: 'v2.1', date: '4 Mar 2026' },
    { name: 'Khalid Al Rashidi', role: 'Pharmacist', status: 'accepted', version: 'v2.1', date: '7 Mar 2026' },
    { name: 'Nour Al Zaabi', role: 'Technician', status: 'not-accepted', version: '-', date: '-' },
  ];

  const acceptedCount = teamMembers.filter(m => m.status === 'accepted').length;
  const complianceRate = Math.round((acceptedCount / teamMembers.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>Dashboard</span>
                <span>›</span>
                <span>Settings</span>
                <span>›</span>
                <span className="text-gray-900 font-medium">Terms & Conditions</span>
              </div>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
                  <p className="text-sm text-gray-600 mt-1">Legal agreements governing your use of the CeenAiX Pharmacy Portal</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 print:p-0">
        {acceptanceStatus === 'accepted' && (
          <div className="mb-8 p-6 rounded-2xl border border-emerald-200 shadow-sm print:hidden" style={{ background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)' }}>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-emerald-900 mb-1">✅ Terms & Conditions Accepted</h3>
                <p className="text-sm text-gray-700 mb-2">Pharmacist Portal Terms & Conditions — Version 2.1</p>
                <p className="text-xs text-gray-600">
                  Accepted by: <span className="font-medium">Sara Al Mansoori (Head Pharmacist)</span> ·
                  Date: <span className="font-medium">4 March 2026 at 09:14 AM GST</span> ·
                  IP: <span className="font-medium">185.220.X.X (Dubai, UAE)</span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-medium text-sm">
                  📄 Download Certificate
                </button>
                <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">v2.1 CURRENT</span>
              </div>
            </div>
          </div>
        )}

        {acceptanceStatus === 'pending' && !acceptanceComplete && (
          <div className="mb-8 p-6 rounded-2xl border-2 border-amber-500 shadow-md animate-pulse-border print:hidden" style={{ background: 'linear-gradient(135deg, #FFFBEB, #FFF8E1)', borderLeftWidth: '4px' }}>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-1">⚠️ Updated Terms & Conditions Require Acceptance</h3>
                <p className="text-sm text-gray-700 mb-2">Version 2.2 published on 1 April 2026 replaces your currently accepted Version 2.1</p>
                <p className="text-sm text-gray-700 mb-3">
                  🗓️ Acceptance required by: <span className="font-bold">15 April 2026</span>
                  <span className="ml-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">⚠️ 13 days remaining</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-gray-600">What changed:</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full cursor-pointer hover:bg-amber-200">Updated DDA reporting §4.3</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full cursor-pointer hover:bg-amber-200">New telemedicine clause §2.6</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full cursor-pointer hover:bg-amber-200">Extended data retention §8.4</span>
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full cursor-pointer hover:bg-amber-200">+ 2 more</span>
                </div>
              </div>
              <div>
                <button
                  onClick={() => documentRef.current?.scrollTo({ top: documentRef.current.scrollHeight, behavior: 'smooth' })}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold shadow-lg hover:shadow-xl transition-all"
                >
                  Review & Accept →
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-[320px_1fr] gap-8 print:grid-cols-1">
          <div className="space-y-6 print:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Document Information</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Document:</span>
                  <span className="font-medium text-gray-900">Pharmacy Portal T&C</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Version:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">v2.1</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">CURRENT</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium text-gray-900">1 January 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Effective:</span>
                  <span className="font-medium text-gray-900">1 January 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Sections:</span>
                  <span className="font-medium text-gray-900">21</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Read:</span>
                  <span className="font-medium text-gray-900">18–22 min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium text-gray-900">English</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Jurisdiction:</span>
                  <span className="font-medium text-gray-900">Dubai, UAE 🇦🇪</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-600 mb-1">DHA Reference:</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-1 rounded">CEENAIX-TC-PHARMA-2026-001</code>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Copy className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Document Language</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm ${
                    language === 'en'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm ${
                    language === 'ar'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🇦🇪 العربية
                </button>
              </div>
              {language === 'ar' && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Arabic translation is provided for reference. In case of conflict, English version prevails per Section 19.3.
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Document Contents</h3>
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {sections.map((section, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSection(idx + 1)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === idx + 1
                        ? 'bg-emerald-50 text-emerald-700 font-semibold border-l-2 border-emerald-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xs text-gray-500 mr-2">{idx + 1}</span>
                    {section}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Reading Progress</h3>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#059669"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - readingProgress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{readingProgress}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{readingProgress}% of document read</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
                {readingProgress >= 100 && (
                  <div className="mt-3 text-sm font-medium text-emerald-600">✅ Fully read</div>
                )}
                {readingProgress < 90 && (
                  <div className="mt-3 text-xs text-gray-600 text-center">
                    You must read 90% before accepting
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Version History</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">v2.1 — CURRENT</div>
                    <div className="text-xs text-gray-600">Jan 2026 | ✅ Accepted 4 Mar 2026</div>
                    <button className="text-xs text-blue-600 hover:underline mt-1">View</button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-700">v2.0</div>
                    <div className="text-xs text-gray-600">Jul 2025 | ✅ Accepted 15 Jul 2025</div>
                    <div className="flex gap-2 mt-1">
                      <button className="text-xs text-blue-600 hover:underline">View</button>
                      <button
                        onClick={() => setShowVersionComparison(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Compare to v2.1
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-300 rounded-full mt-1.5"></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-700">v1.5</div>
                    <div className="text-xs text-gray-600">Jan 2025 | ✅ Accepted 3 Jan 2025</div>
                    <button className="text-xs text-blue-600 hover:underline mt-1">View</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Reading Options</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-600 mb-2">Text size</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextSize('small')}
                      className={`px-3 py-1 rounded ${textSize === 'small' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                    >
                      A-
                    </button>
                    <button
                      onClick={() => setTextSize('normal')}
                      className={`px-3 py-1 rounded ${textSize === 'normal' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Aa
                    </button>
                    <button
                      onClick={() => setTextSize('large')}
                      className={`px-3 py-1 rounded ${textSize === 'large' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                    >
                      A+
                    </button>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-2">Font preference</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFontFamily('sans')}
                      className={`flex-1 px-3 py-2 rounded text-sm ${fontFamily === 'sans' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Sans-serif
                    </button>
                    <button
                      onClick={() => setFontFamily('serif')}
                      className={`flex-1 px-3 py-2 rounded text-sm ${fontFamily === 'serif' ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 text-gray-600'}`}
                    >
                      Serif
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={documentRef}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-12 max-h-[calc(100vh-200px)] overflow-y-auto print:max-h-none print:overflow-visible print:shadow-none print:border-0 ${
              textSize === 'small' ? 'text-sm' : textSize === 'large' ? 'text-lg' : 'text-base'
            } ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${
              lineSpacing === 'compact' ? 'leading-relaxed' : lineSpacing === 'spacious' ? 'leading-loose' : 'leading-normal'
            }`}
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">CeenAiX</h1>
                <p className="text-sm text-gray-600 mb-8">Pharmacy Portal — Legal Agreement</p>
                <div className="w-full h-px bg-gray-300 mb-8"></div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">PHARMACIST PORTAL<br />TERMS AND CONDITIONS</h2>
                <div className="text-sm text-gray-600 space-y-1 mb-8">
                  <p>Version: 2.1 | Effective: 1 January 2026</p>
                  <p>Reference: CEENAIX-TC-PHARMA-2026-001</p>
                  <p>Governing Law: UAE Federal Law</p>
                </div>
                <div className="w-full h-1 bg-gray-300 mb-8"></div>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  These Terms and Conditions ("Terms") constitute a legally binding agreement between AryAiX LLC, a limited liability company registered in Dubai, United Arab Emirates ("AryAiX," "we," "us," or "our"), and the licensed pharmacy entity and its authorized personnel ("you," "your," or "Pharmacy") accessing and using the CeenAiX Pharmacy Portal ("Platform" or "Portal").
                </p>
                <p className="text-gray-700 leading-relaxed mb-8">
                  By accessing, registering for, or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and all applicable laws and regulations of the United Arab Emirates, including but not limited to Dubai Health Authority regulations.
                </p>

                <div className="w-full h-px bg-gray-300 my-12"></div>

                <div id="section-1" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-emerald-100">
                    SECTION 1: INTRODUCTION & DEFINITIONS
                  </h3>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Company Information</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    AryAiX (Intelligent Ventures) — AryAiX LLC<br />
                    Registered Office: Dilan Tower, Al Jadaf, Dubai, United Arab Emirates<br />
                    Email: legal@aryaix.com<br />
                    Platform URL: www.ceenaix.com
                  </p>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                    <p className="text-sm text-purple-900">
                      ⚖️ <strong>UAE Law Reference:</strong> These Terms are governed by UAE Federal Commercial Transactions Law No. 18 of 1993 and applicable DHA regulations.
                    </p>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Definitions</h4>
                  <div className="space-y-3 text-gray-700">
                    <p><strong>"Platform"</strong> means the CeenAiX healthcare management software system, including the Pharmacy Portal, APIs, integrations, mobile applications, and all associated services provided by AryAiX.</p>
                    <p><strong>"Pharmacy"</strong> means the DHA-licensed pharmacy entity that has completed registration and received approval to access the Platform.</p>
                    <p><strong>"Authorized User"</strong> means any pharmacy staff member granted portal access credentials by the pharmacy's Head Pharmacist or designated administrator.</p>
                    <p><strong>"DHA"</strong> means the Dubai Health Authority, the regulatory body governing healthcare in Dubai.</p>
                    <p><strong>"Prescription"</strong> means a written or electronic medication order by a DHA-licensed practitioner complying with all applicable DHA requirements.</p>
                    <p><strong>"Patient Data"</strong> means any personally identifiable health information relating to pharmacy patients processed through the Platform.</p>
                    <p><strong>"Nabidh HIE"</strong> means Dubai's National Unified Medical Record Health Information Exchange.</p>
                    <p><strong>"Controlled Substance (CS)"</strong> means any medication listed under UAE Federal Law No. 14 of 1995 on Narcotic Drugs and Psychotropic Substances.</p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-6">
                    <p className="text-sm text-blue-900">
                      ℹ️ <strong>Note:</strong> Terms defined in this section apply throughout this document wherever capitalized.
                    </p>
                  </div>
                </div>

                <div id="section-2" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-emerald-100">
                    SECTION 2: ACCEPTANCE OF TERMS
                  </h3>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Formation of Agreement</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    These Terms become legally binding when an Authorized User clicks "I Accept the Terms & Conditions" within the Platform. This constitutes valid electronic acceptance under UAE Federal Law No. 1 of 2006 on Electronic Commerce and Transactions.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Authority to Accept</h4>
                  <p className="text-gray-700 leading-relaxed mb-2">By accepting, you represent and warrant:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                    <li>You are an authorized representative with legal authority to bind the Pharmacy;</li>
                    <li>The Pharmacy holds a valid DHA Pharmacy License;</li>
                    <li>All registration information is accurate;</li>
                    <li>You are at least 21 years old and legally competent to enter contracts under UAE law.</li>
                  </ul>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                    <p className="text-sm text-amber-900">
                      ⚠️ <strong>Important:</strong> Accepting on behalf of the Pharmacy without authority is a breach of these Terms and may constitute fraud under UAE law.
                    </p>
                  </div>
                </div>

                <div id="section-5" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-emerald-100">
                    SECTION 5: DHA COMPLIANCE OBLIGATIONS
                  </h3>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 License Requirements</h4>
                  <p className="text-gray-700 leading-relaxed mb-2">The Pharmacy warrants at all times that:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                    <li>A valid DHA Pharmacy License is maintained;</li>
                    <li>All dispensing pharmacists hold current DHA professional licenses;</li>
                    <li>All DHA guidelines, circulars, and regulations are fully complied with;</li>
                    <li>Changes to DHA license status are reported to AryAiX within 24 hours.</li>
                  </ul>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                    <p className="text-sm text-amber-900">
                      ⚠️ <strong>Important:</strong> Operating with an expired DHA Pharmacy License is illegal and will result in platform suspension. AryAiX monitors license expiry and will notify you in advance.
                    </p>
                  </div>
                </div>

                <div id="section-7" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-emerald-100">
                    SECTION 7: PATIENT DATA & PRIVACY
                  </h3>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 UAE PDPL Compliance</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Patient data processed through the Platform is subject to UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection. The Pharmacy is the Data Controller. AryAiX operates as the Data Processor.
                  </p>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-6">
                    <p className="text-sm text-purple-900">
                      ⚖️ <strong>UAE Law Reference:</strong> UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data governs all personal data processing activities.
                    </p>
                  </div>

                  <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.3 UAE Data Residency</h4>
                  <p className="text-gray-700 leading-relaxed mb-2">All patient data processed through CeenAiX:</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4 ml-4">
                    <li>Is stored exclusively within the UAE;</li>
                    <li>Is not transferred outside UAE jurisdiction;</li>
                    <li>Is hosted on DHA-compliant UAE servers;</li>
                    <li>Complies with UAE data sovereignty rules.</li>
                  </ul>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                    <p className="text-sm text-blue-900">
                      ℹ️ <strong>Note:</strong> CeenAiX uses UAE-based data centers in Dubai and Abu Dhabi for all data storage.
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                    <p className="text-sm text-red-900">
                      🔴 <strong>Critical:</strong> Failure to report data breaches within required timeframes violates UAE PDPL and may result in significant regulatory penalties.
                    </p>
                  </div>
                </div>

                <div id="section-21" className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-emerald-100">
                    SECTION 21: CONTACT INFORMATION
                  </h3>

                  <div className="text-gray-700 leading-relaxed space-y-2">
                    <p className="font-semibold">AryAiX LLC — Legal Department</p>
                    <p>Dilan Tower, Al Jadaf, Dubai, UAE</p>
                    <p>📧 legal@aryaix.com</p>
                    <p>📧 dpo@aryaix.com (Data Protection)</p>
                    <p>📧 compliance@aryaix.com (DHA matters)</p>
                    <p>📧 support@aryaix.com</p>
                    <p>📞 +971 4 XXX XXXX</p>
                    <p>🌐 www.aryaix.com/legal</p>
                  </div>
                </div>

                <div className="border-t-2 border-gray-300 pt-8 mt-12 text-center text-sm text-gray-600">
                  <p>© 2026 AryAiX LLC. All Rights Reserved.</p>
                  <p>CeenAiX® | CEENAIX-TC-PHARMA-2026-001</p>
                  <p>Version 2.1 | Effective 1 January 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {acceptanceStatus === 'pending' && !acceptanceComplete && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-12 print:hidden">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Accept Updated Terms & Conditions</h3>
            <p className="text-gray-600 mb-8">Version 2.2 — Effective 1 April 2026</p>

            <div className="mb-8">
              <button
                onClick={() => setExpandedChanges(!expandedChanges)}
                className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <h4 className="text-lg font-bold text-gray-900">📋 Changes in Version 2.2</h4>
                {expandedChanges ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>

              {expandedChanges && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Section</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Clause</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Change</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {changes.map((change, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{change.section}</td>
                          <td className="px-4 py-3 text-gray-700">{change.clause}</td>
                          <td className="px-4 py-3 text-gray-700">{change.change}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              change.type === 'added' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {change.type === 'added' ? 'Added' : 'Modified'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Reading progress: {readingProgress}%</span>
                  {readingProgress >= 90 ? (
                    <span className="text-sm text-emerald-600 font-medium">✅ You have read sufficient content to accept</span>
                  ) : (
                    <span className="text-sm text-amber-600 font-medium">Please read more to enable acceptance</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all"
                    style={{ width: `${readingProgress}%` }}
                  ></div>
                </div>
              </div>

              {readingProgress < 90 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    📖 Please read the full document before accepting. Acceptance will unlock at 90% reading progress.
                  </p>
                </div>
              )}
            </div>

            {readingProgress >= 90 && (
              <div className="space-y-4 mb-8">
                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={acceptCheckbox1}
                    onChange={(e) => setAcceptCheckbox1(e.target.checked)}
                    className="mt-1 w-5 h-5 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I have read and fully understood Version 2.2 of the CeenAiX Pharmacist Portal Terms & Conditions, including all changes to DDA reporting requirements, telemedicine provisions, data retention periods, and governing law clauses.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={acceptCheckbox2}
                    onChange={(e) => setAcceptCheckbox2(e.target.checked)}
                    className="mt-1 w-5 h-5 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I confirm I have the legal authority to accept these Terms on behalf of Al Shifa Pharmacy (DHA-PH-2021-04821) and that all pharmacy staff will be informed of the updated Terms.
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                  <input
                    type="checkbox"
                    checked={acceptCheckbox3}
                    onChange={(e) => setAcceptCheckbox3(e.target.checked)}
                    className="mt-1 w-5 h-5 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    I acknowledge that the Arabic translation is for reference only and the English version prevails in case of conflict (Section 19.3).
                  </span>
                </label>
              </div>
            )}

            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-8">
              <h4 className="font-bold text-gray-900 mb-4">Acceptance Signature</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Full Name:</span>
                  <span className="ml-2 font-medium text-gray-900">Sara Al Mansoori</span>
                </div>
                <div>
                  <span className="text-gray-600">Role:</span>
                  <span className="ml-2 font-medium text-gray-900">Head Pharmacist</span>
                </div>
                <div>
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="ml-2 font-medium text-gray-900">EMP-001</span>
                </div>
                <div>
                  <span className="text-gray-600">Pharmacy:</span>
                  <span className="ml-2 font-medium text-gray-900">Al Shifa Pharmacy</span>
                </div>
                <div>
                  <span className="text-gray-600">DHA License:</span>
                  <span className="ml-2 font-medium text-gray-900">DHA-PH-2021-04821</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                Digital signature is captured upon clicking 'I Accept' and constitutes a legally binding electronic signature under UAE Federal Law No. 1 of 2006 on Electronic Commerce.
              </p>
            </div>

            {!acceptanceComplete ? (
              <button
                onClick={handleAccept}
                disabled={!canAccept || isAccepting}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  canAccept && !isAccepting
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAccepting ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Recording your acceptance...
                  </div>
                ) : (
                  <>🔒 I Accept the Terms & Conditions</>
                )}
              </button>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-6">
                  <CheckCircle className="w-16 h-16 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-bold text-emerald-900 mb-2">✅ Terms & Conditions Accepted!</h3>
                <p className="text-gray-600 mb-8">Version 2.2 accepted on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>

                <div className="max-w-2xl mx-auto p-6 bg-emerald-50 border-2 border-emerald-200 rounded-xl mb-6">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-4">ACCEPTANCE CERTIFICATE</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div className="text-left">
                      <span className="text-gray-600">Accepted by:</span>
                      <p className="font-medium text-gray-900">Sara Al Mansoori</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-600">Pharmacy:</span>
                      <p className="font-medium text-gray-900">Al Shifa Pharmacy</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-600">Version:</span>
                      <p className="font-medium text-gray-900">v2.2 (Latest)</p>
                    </div>
                    <div className="text-left">
                      <span className="text-gray-600">IP:</span>
                      <p className="font-medium text-gray-900">185.220.X.X</p>
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-600 text-white rounded-lg text-center">
                    <p className="font-bold text-sm">✓ LEGALLY BINDING ELECTRONIC ACCEPTANCE</p>
                    <p className="text-xs mt-1">UAE Federal Law No. 1 of 2006</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold">
                    ⬇ Download Certificate
                  </button>
                  <button className="w-full py-3 border-2 border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 font-semibold">
                    ✉️ Email Certificate to My Address
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8 print:hidden">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Team Terms & Conditions Compliance</h3>
          <p className="text-gray-600 mb-6">All active staff must accept the current Terms (v2.1)</p>

          <div className="flex items-center gap-8 mb-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#F59E0B"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - complianceRate / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{acceptedCount}/{teamMembers.length}</span>
                  <span className="text-xs text-gray-600">staff compliant</span>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-gray-700">Accepted v2.1: <span className="font-bold">{acceptedCount} staff</span></span>
              </div>
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="text-gray-700">Accepted older version: <span className="font-bold">1 staff</span></span>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Not yet accepted: <span className="font-bold">1 staff</span></span>
              </div>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium">
              Send Reminders to Non-Compliant
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Staff Member</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Version</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date Accepted</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teamMembers.map((member, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      member.status === 'outdated' ? 'bg-amber-50' :
                      member.status === 'not-accepted' ? 'bg-red-50' :
                      'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 text-gray-700">{member.role}</td>
                    <td className="px-4 py-3">
                      {member.status === 'accepted' && (
                        <span className="flex items-center gap-1 text-emerald-700">
                          <CheckCircle className="w-4 h-4" /> Accepted v2.1
                        </span>
                      )}
                      {member.status === 'outdated' && (
                        <span className="flex items-center gap-1 text-amber-700">
                          <AlertTriangle className="w-4 h-4" /> Outdated
                        </span>
                      )}
                      {member.status === 'not-accepted' && (
                        <span className="flex items-center gap-1 text-red-700">
                          <XCircle className="w-4 h-4" /> Not accepted
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{member.version}</td>
                    <td className="px-4 py-3 text-gray-700">{member.date}</td>
                    <td className="px-4 py-3">
                      {member.status === 'accepted' ? (
                        <button className="text-blue-600 hover:underline text-sm">View Certificate</button>
                      ) : (
                        <button className={`px-3 py-1 rounded text-sm font-medium ${
                          member.status === 'outdated' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' :
                          'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}>
                          Send Reminder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showVersionComparison && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-8">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Terms Comparison</h3>
                <p className="text-sm text-gray-600">Version 2.1 → Version 2.2</p>
              </div>
              <button
                onClick={() => setShowVersionComparison(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {changes.map((change, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`px-4 py-3 font-semibold ${
                      change.type === 'added' ? 'bg-blue-50 text-blue-900' : 'bg-amber-50 text-amber-900'
                    }`}>
                      Section {change.section} — {change.clause} ({change.type.toUpperCase()})
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-gray-200">
                      <div className="p-4">
                        <div className="text-xs font-semibold text-gray-500 mb-2">Version 2.1 (Current)</div>
                        {change.type === 'added' ? (
                          <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded">[Section did not exist]</div>
                        ) : (
                          <div className="text-sm text-gray-700">Original clause text...</div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="text-xs font-semibold text-gray-500 mb-2">Version 2.2 (New)</div>
                        <div className={`text-sm p-3 rounded ${
                          change.type === 'added' ? 'bg-green-50 text-green-900' : 'bg-amber-50 text-amber-900'
                        }`}>
                          {change.change}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <span className="font-bold">{changes.length} changes total:</span> Modified: 3 | Added: 2
                </div>
                <button
                  onClick={() => setShowVersionComparison(false)}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
