import { useState, useEffect } from 'react';
import { PatientLayout } from '../components/PatientLayout';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import {
  Brain,
  Heart,
  Bone,
  Scan,
  Zap,
  FileText,
  User,
  Calendar,
  MapPin,
  CheckCircle,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Filter,
  Search,
  X,
  ZoomIn,
  Shield,
  Activity,
} from 'lucide-react';

interface RadiologyStudy {
  id: string;
  category: string;
  modality: string;
  bodyPart: string;
  studyDate: string;
  status: 'pending' | 'ai-analyzed' | 'doctor-reviewed' | 'final';
  imageUrl: string;
  thumbnailUrl: string;
  aiAnalysis: {
    findings: string[];
    confidence: number;
    abnormalitiesDetected: boolean;
    keyObservations: string[];
    suggestedFollowUp: string;
  };
  doctorReview: {
    approved: boolean;
    reviewDate: string;
    doctorName: string;
    doctorComments: string;
    finalDiagnosis: string;
    recommendations: string[];
  } | null;
  technicalDetails: {
    studyId: string;
    accessionNumber: string;
    radiologist: string;
    facility: string;
  };
}

const CATEGORIES = [
  { id: 'all', name: 'All Studies', icon: Scan, color: '#3B82F6' },
  { id: 'neuro', name: 'Neuro (Brain/Spine)', icon: Brain, color: '#8B5CF6' },
  { id: 'cardiac', name: 'Cardiac', icon: Heart, color: '#EF4444' },
  { id: 'musculoskeletal', name: 'Musculoskeletal', icon: Bone, color: '#F59E0B' },
  { id: 'chest', name: 'Chest', icon: Activity, color: '#10B981' },
];

const SAMPLE_STUDIES: RadiologyStudy[] = [
  {
    id: '1',
    category: 'neuro',
    modality: 'MRI Brain',
    bodyPart: 'Brain',
    studyDate: '2026-03-15',
    status: 'doctor-reviewed',
    imageUrl: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg',
    thumbnailUrl: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=400',
    aiAnalysis: {
      findings: [
        'No evidence of acute intracranial hemorrhage',
        'Normal gray-white matter differentiation',
        'Ventricles and sulci are normal in size',
        'No midline shift detected',
        'Paranasal sinuses are clear',
      ],
      confidence: 0.94,
      abnormalitiesDetected: false,
      keyObservations: [
        'Normal brain parenchyma',
        'Age-appropriate brain volume',
        'Clear cerebrospinal fluid spaces',
      ],
      suggestedFollowUp: 'Routine follow-up in 12 months if clinically indicated',
    },
    doctorReview: {
      approved: true,
      reviewDate: '2026-03-16',
      doctorName: 'Dr. Sarah Mitchell',
      doctorComments: 'AI analysis is accurate. Normal MRI brain with no acute findings.',
      finalDiagnosis: 'Normal MRI Brain',
      recommendations: [
        'No immediate follow-up required',
        'Return if symptoms develop',
        'Routine screening as per clinical guidelines',
      ],
    },
    technicalDetails: {
      studyId: 'MR-2026-001234',
      accessionNumber: 'ACC789456',
      radiologist: 'Dr. Sarah Mitchell, MD',
      facility: 'Dubai Medical Imaging Center',
    },
  },
  {
    id: '2',
    category: 'chest',
    modality: 'CT Chest',
    bodyPart: 'Chest',
    studyDate: '2026-03-10',
    status: 'doctor-reviewed',
    imageUrl: 'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg',
    thumbnailUrl: 'https://images.pexels.com/photos/7089170/pexels-photo-7089170.jpeg?auto=compress&cs=tinysrgb&w=400',
    aiAnalysis: {
      findings: [
        'Lungs are clear bilaterally',
        'No focal consolidation or mass',
        'Heart size within normal limits',
        'No pleural effusion',
        'Mediastinal structures normal',
      ],
      confidence: 0.92,
      abnormalitiesDetected: false,
      keyObservations: [
        'Clear lung fields',
        'Normal cardiac silhouette',
        'No adenopathy',
      ],
      suggestedFollowUp: 'No immediate follow-up required',
    },
    doctorReview: {
      approved: true,
      reviewDate: '2026-03-11',
      doctorName: 'Dr. James Chen',
      doctorComments: 'Concur with AI findings. Normal chest CT with no acute pathology.',
      finalDiagnosis: 'Normal CT Chest',
      recommendations: [
        'No treatment necessary',
        'Maintain healthy lifestyle',
        'Regular check-ups as needed',
      ],
    },
    technicalDetails: {
      studyId: 'CT-2026-005678',
      accessionNumber: 'ACC456123',
      radiologist: 'Dr. James Chen, MD',
      facility: 'Dubai Medical Imaging Center',
    },
  },
  {
    id: '3',
    category: 'neuro',
    modality: 'MRI Spine',
    bodyPart: 'Lumbar Spine',
    studyDate: '2026-03-08',
    status: 'ai-analyzed',
    imageUrl: 'https://images.pexels.com/photos/8847317/pexels-photo-8847317.jpeg',
    thumbnailUrl: 'https://images.pexels.com/photos/8847317/pexels-photo-8847317.jpeg?auto=compress&cs=tinysrgb&w=400',
    aiAnalysis: {
      findings: [
        'Mild degenerative disc disease at L4-L5',
        'Small disc bulge at L5-S1 without nerve compression',
        'Normal spinal cord signal',
        'Vertebral body heights maintained',
        'No fractures detected',
      ],
      confidence: 0.89,
      abnormalitiesDetected: true,
      keyObservations: [
        'Age-related degenerative changes',
        'No significant stenosis',
        'Neural foramina patent',
      ],
      suggestedFollowUp: 'Clinical correlation recommended. Consider physical therapy.',
    },
    doctorReview: null,
    technicalDetails: {
      studyId: 'MR-2026-002345',
      accessionNumber: 'ACC234567',
      radiologist: 'Pending Review',
      facility: 'Dubai Medical Imaging Center',
    },
  },
  {
    id: '4',
    category: 'musculoskeletal',
    modality: 'X-Ray',
    bodyPart: 'Knee',
    studyDate: '2026-03-05',
    status: 'doctor-reviewed',
    imageUrl: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg',
    thumbnailUrl: 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=400',
    aiAnalysis: {
      findings: [
        'Joint space narrowing in medial compartment',
        'Mild osteophyte formation',
        'No acute fracture',
        'Soft tissues unremarkable',
      ],
      confidence: 0.91,
      abnormalitiesDetected: true,
      keyObservations: [
        'Mild osteoarthritis changes',
        'Bones intact',
      ],
      suggestedFollowUp: 'Orthopedic consultation for symptom management',
    },
    doctorReview: {
      approved: true,
      reviewDate: '2026-03-06',
      doctorName: 'Dr. Ahmed Al-Mansoori',
      doctorComments: 'Mild osteoarthritis as identified by AI. Recommend conservative management.',
      finalDiagnosis: 'Mild Osteoarthritis, Right Knee',
      recommendations: [
        'Physical therapy',
        'Weight management',
        'NSAIDs as needed',
        'Consider joint injections if conservative measures fail',
      ],
    },
    technicalDetails: {
      studyId: 'XR-2026-003456',
      accessionNumber: 'ACC345678',
      radiologist: 'Dr. Ahmed Al-Mansoori, MD',
      facility: 'Dubai Medical Imaging Center',
    },
  },
];

export default function EnhancedRadiologyPage() {
  const { isDarkMode } = useTheme();
  const [studies, setStudies] = useState<RadiologyStudy[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStudy, setSelectedStudy] = useState<RadiologyStudy | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRadiologyStudies();
  }, []);

  const fetchRadiologyStudies = async () => {
    const testPatientId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

    try {
      const { data, error } = await supabase
        .from('radiology_studies')
        .select(`
          *,
          radiology_categories (
            name,
            color
          )
        `)
        .eq('patient_id', testPatientId)
        .order('study_date', { ascending: false });

      if (error) throw error;

      const formattedStudies: RadiologyStudy[] = data.map((study: any) => {
        const categoryName = study.radiology_categories?.name || 'X-Ray';
        let categoryId = 'musculoskeletal';
        if (categoryName === 'MRI' && study.body_part === 'Brain') {
          categoryId = 'neuro';
        } else if (categoryName === 'CT Scan') {
          categoryId = 'chest';
        }

        const findings = study.findings ? study.findings.split('\n\n').filter((f: string) => f.trim()) : [];
        const impressionLines = study.impression ? study.impression.split('\n\n').filter((f: string) => f.trim()) : [];

        return {
          id: study.id,
          category: categoryId,
          modality: study.study_type,
          bodyPart: study.body_part,
          studyDate: study.study_date,
          status: study.status === 'Completed' ? 'doctor-reviewed' : 'ai-analyzed',
          imageUrl: study.image_url || 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg',
          thumbnailUrl: study.image_url || 'https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=400',
          aiAnalysis: {
            findings: findings.slice(0, 5),
            confidence: 0.92,
            abnormalitiesDetected: study.urgency === 'Urgent' || study.urgency === 'Stat',
            keyObservations: impressionLines.slice(0, 3),
            suggestedFollowUp: study.recommendations || 'Follow-up as clinically indicated',
          },
          doctorReview: {
            approved: true,
            reviewDate: study.report_date,
            doctorName: study.radiologist_name || 'Radiologist',
            doctorComments: study.impression,
            finalDiagnosis: impressionLines[0] || 'Study completed',
            recommendations: study.recommendations ? study.recommendations.split('\n').filter((r: string) => r.trim()) : [],
          },
          technicalDetails: {
            studyId: study.id,
            accessionNumber: study.accession_number,
            radiologist: study.radiologist_name || 'Staff Radiologist',
            facility: 'CeenAiX Medical Imaging Center',
          },
        };
      });

      setStudies(formattedStudies);
    } catch (error) {
      console.error('Error fetching radiology studies:', error);
      setStudies(SAMPLE_STUDIES);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudies = studies.filter((study) => {
    const matchesCategory = selectedCategory === 'all' || study.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      study.modality.toLowerCase().includes(searchQuery.toLowerCase()) ||
      study.bodyPart.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status: RadiologyStudy['status']) => {
    const styles = {
      pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending Analysis' },
      'ai-analyzed': { bg: '#DBEAFE', text: '#1E40AF', label: 'AI Analyzed' },
      'doctor-reviewed': { bg: '#D1FAE5', text: '#065F46', label: 'Doctor Reviewed' },
      final: { bg: '#D1FAE5', text: '#065F46', label: 'Final Report' },
    };

    const style = styles[status];
    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: style.bg,
          color: style.text,
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        {status === 'doctor-reviewed' && <CheckCircle size={14} />}
        {status === 'ai-analyzed' && <Sparkles size={14} />}
        {style.label}
      </div>
    );
  };

  return (
    <PatientLayout activeNav="radiology">
      <div
        style={{
          minHeight: '100vh',
          background: isDarkMode ? '#0F172A' : '#F8FAFC',
          padding: '40px 32px',
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 800,
                background: isDarkMode
                  ? 'linear-gradient(135deg, #60A5FA 0%, #A78BFA 100%)'
                  : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 8,
                letterSpacing: '-0.03em',
              }}
            >
              Imaging & Radiology
            </h1>
            <p style={{ fontSize: 18, color: '#64748B', fontWeight: 500 }}>
              AI-powered imaging analysis with doctor verification
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ position: 'relative' }}>
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94A3B8',
                  }}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by modality or body part..."
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 48px',
                    background: isDarkMode ? '#1E293B' : 'white',
                    border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    borderRadius: 12,
                    fontSize: 16,
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '12px 20px',
                    background: isActive
                      ? cat.color
                      : isDarkMode
                      ? '#1E293B'
                      : 'white',
                    border: isActive ? 'none' : isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                    borderRadius: 12,
                    color: isActive ? 'white' : isDarkMode ? '#F1F5F9' : '#1E293B',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Icon size={20} />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div style={{
              textAlign: 'center',
              padding: 60,
              color: isDarkMode ? '#94A3B8' : '#64748B',
              fontSize: 16
            }}>
              Loading radiology studies...
            </div>
          ) : filteredStudies.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 60,
              color: isDarkMode ? '#94A3B8' : '#64748B',
              fontSize: 16
            }}>
              No studies found matching your criteria
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 24 }}>
              {filteredStudies.map((study) => (
              <div
                key={study.id}
                style={{
                  background: isDarkMode ? '#1E293B' : 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
                  boxShadow: isDarkMode
                    ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                    : '0 10px 40px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 20px 60px rgba(0, 0, 0, 0.4)'
                    : '0 20px 60px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isDarkMode
                    ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                    : '0 10px 40px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: '100%' }}>
                  <div
                    style={{
                      position: 'relative',
                      background: '#000',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setSelectedStudy(study);
                      setShowImageModal(true);
                    }}
                  >
                    <img
                      src={study.thumbnailUrl}
                      alt={study.modality}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        opacity: 0.8,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '0';
                      }}
                    >
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '50%',
                          padding: 16,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <ZoomIn size={24} color="#000" />
                      </div>
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                      }}
                    >
                      {getStatusBadge(study.status)}
                    </div>
                  </div>

                  <div style={{ padding: 32 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
                      <div>
                        <h3
                          style={{
                            fontSize: 24,
                            fontWeight: 700,
                            color: isDarkMode ? '#F1F5F9' : '#1E293B',
                            marginBottom: 8,
                          }}
                        >
                          {study.modality}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, color: '#64748B', fontSize: 15 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={16} />
                            {new Date(study.studyDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <MapPin size={16} />
                            {study.technicalDetails.facility}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        padding: 20,
                        background: isDarkMode
                          ? 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 100%)'
                          : 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)',
                        borderRadius: 16,
                        marginBottom: 20,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <Sparkles size={20} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                        <h4
                          style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: isDarkMode ? '#DBEAFE' : '#1E40AF',
                          }}
                        >
                          AI Analysis
                        </h4>
                        <div
                          style={{
                            marginLeft: 'auto',
                            padding: '4px 12px',
                            background: study.aiAnalysis.abnormalitiesDetected
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(16, 185, 129, 0.2)',
                            borderRadius: 8,
                            fontSize: 12,
                            fontWeight: 700,
                            color: study.aiAnalysis.abnormalitiesDetected ? '#EF4444' : '#10B981',
                          }}
                        >
                          {study.aiAnalysis.confidence * 100}% Confidence
                        </div>
                      </div>
                      <div style={{ fontSize: 14, color: isDarkMode ? '#BFDBFE' : '#1E40AF', lineHeight: 1.6 }}>
                        {study.aiAnalysis.findings.slice(0, 3).map((finding, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'start', gap: 8, marginBottom: 6 }}>
                            <div
                              style={{
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: isDarkMode ? '#60A5FA' : '#3B82F6',
                                marginTop: 6,
                                flexShrink: 0,
                              }}
                            />
                            {finding}
                          </div>
                        ))}
                      </div>
                    </div>

                    {study.doctorReview && (
                      <div
                        style={{
                          padding: 20,
                          background: isDarkMode
                            ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)'
                            : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                          borderRadius: 16,
                          marginBottom: 20,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                          <Shield size={20} color={isDarkMode ? '#34D399' : '#059669'} />
                          <h4
                            style={{
                              fontSize: 16,
                              fontWeight: 700,
                              color: isDarkMode ? '#D1FAE5' : '#065F46',
                            }}
                          >
                            Doctor Review
                          </h4>
                          {study.doctorReview.approved && (
                            <CheckCircle size={16} color={isDarkMode ? '#34D399' : '#059669'} />
                          )}
                        </div>
                        <div style={{ fontSize: 14, color: isDarkMode ? '#A7F3D0' : '#065F46', marginBottom: 8 }}>
                          <strong>Dr. {study.doctorReview.doctorName}</strong>
                        </div>
                        <div style={{ fontSize: 14, color: isDarkMode ? '#D1FAE5' : '#047857', lineHeight: 1.6 }}>
                          {study.doctorReview.doctorComments}
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={() => setSelectedStudy(study)}
                        style={{
                          flex: 1,
                          padding: '14px 24px',
                          background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                          border: 'none',
                          borderRadius: 12,
                          color: 'white',
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                      >
                        <Eye size={18} />
                        View Full Report
                      </button>
                      <button
                        style={{
                          padding: '14px 24px',
                          background: isDarkMode ? '#334155' : 'white',
                          border: isDarkMode ? '1px solid #475569' : '1px solid #CBD5E1',
                          borderRadius: 12,
                          color: isDarkMode ? '#F1F5F9' : '#334155',
                          fontSize: 15,
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#10B981';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = isDarkMode ? '#334155' : 'white';
                          e.currentTarget.style.color = isDarkMode ? '#F1F5F9' : '#334155';
                          e.currentTarget.style.borderColor = isDarkMode ? '#475569' : '#CBD5E1';
                        }}
                      >
                        <Download size={18} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showImageModal && selectedStudy && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <X size={24} />
          </button>
          <img
            src={selectedStudy.imageUrl}
            alt={selectedStudy.modality}
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              borderRadius: 12,
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {selectedStudy && !showImageModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
            overflow: 'auto',
          }}
          onClick={() => setSelectedStudy(null)}
        >
          <div
            style={{
              background: isDarkMode ? '#1E293B' : 'white',
              borderRadius: 24,
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
              border: isDarkMode ? '1px solid #334155' : '1px solid #E2E8F0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 32 }}>
                <div>
                  <h2
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: isDarkMode ? '#F1F5F9' : '#1E293B',
                      marginBottom: 8,
                    }}
                  >
                    {selectedStudy.modality} Report
                  </h2>
                  <p style={{ fontSize: 16, color: '#64748B' }}>
                    {selectedStudy.bodyPart} • {new Date(selectedStudy.studyDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedStudy(null)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isDarkMode ? '#334155' : '#F1F5F9',
                    border: 'none',
                    color: isDarkMode ? '#F1F5F9' : '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  padding: 24,
                  background: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderRadius: 16,
                  marginBottom: 24,
                }}
              >
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: isDarkMode ? '#F1F5F9' : '#1E293B',
                    marginBottom: 16,
                  }}
                >
                  Study Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                      STUDY ID
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                      {selectedStudy.technicalDetails.studyId}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                      ACCESSION NUMBER
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                      {selectedStudy.technicalDetails.accessionNumber}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                      RADIOLOGIST
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                      {selectedStudy.technicalDetails.radiologist}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#64748B', marginBottom: 4, fontWeight: 600 }}>
                      FACILITY
                    </div>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#F1F5F9' : '#1E293B', fontWeight: 600 }}>
                      {selectedStudy.technicalDetails.facility}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: 24,
                  background: isDarkMode
                    ? 'linear-gradient(135deg, #1E3A8A 0%, #3730A3 100%)'
                    : 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)',
                  borderRadius: 16,
                  marginBottom: 24,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <Sparkles size={24} color={isDarkMode ? '#60A5FA' : '#3B82F6'} />
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      color: isDarkMode ? '#DBEAFE' : '#1E40AF',
                    }}
                  >
                    AI Analysis Results
                  </h3>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isDarkMode ? '#BFDBFE' : '#1E40AF',
                      marginBottom: 12,
                    }}
                  >
                    Findings
                  </h4>
                  {selectedStudy.aiAnalysis.findings.map((finding, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 12,
                        marginBottom: 10,
                        fontSize: 15,
                        color: isDarkMode ? '#BFDBFE' : '#1E40AF',
                        lineHeight: 1.6,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: isDarkMode ? '#60A5FA' : '#3B82F6',
                          marginTop: 8,
                          flexShrink: 0,
                        }}
                      />
                      {finding}
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <h4
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: isDarkMode ? '#BFDBFE' : '#1E40AF',
                      marginBottom: 12,
                    }}
                  >
                    Key Observations
                  </h4>
                  {selectedStudy.aiAnalysis.keyObservations.map((obs, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'start',
                        gap: 12,
                        marginBottom: 10,
                        fontSize: 15,
                        color: isDarkMode ? '#BFDBFE' : '#1E40AF',
                        lineHeight: 1.6,
                      }}
                    >
                      <CheckCircle size={16} style={{ marginTop: 4, flexShrink: 0 }} />
                      {obs}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    padding: 16,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 12,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div style={{ fontSize: 14, color: isDarkMode ? '#BFDBFE' : '#1E40AF', fontWeight: 600, marginBottom: 6 }}>
                    Suggested Follow-Up
                  </div>
                  <div style={{ fontSize: 15, color: isDarkMode ? '#DBEAFE' : '#1E3A8A' }}>
                    {selectedStudy.aiAnalysis.suggestedFollowUp}
                  </div>
                </div>
              </div>

              {selectedStudy.doctorReview && (
                <div
                  style={{
                    padding: 24,
                    background: isDarkMode
                      ? 'linear-gradient(135deg, #065F46 0%, #047857 100%)'
                      : 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                    borderRadius: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <Shield size={24} color={isDarkMode ? '#34D399' : '#059669'} />
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: isDarkMode ? '#D1FAE5' : '#065F46',
                      }}
                    >
                      Doctor Review & Verification
                    </h3>
                    {selectedStudy.doctorReview.approved && (
                      <CheckCircle size={20} color={isDarkMode ? '#34D399' : '#059669'} />
                    )}
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 14, color: isDarkMode ? '#A7F3D0' : '#065F46', marginBottom: 4 }}>
                      Reviewed by
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#D1FAE5' : '#047857', marginBottom: 2 }}>
                      Dr. {selectedStudy.doctorReview.doctorName}
                    </div>
                    <div style={{ fontSize: 14, color: isDarkMode ? '#A7F3D0' : '#065F46' }}>
                      {new Date(selectedStudy.doctorReview.reviewDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: isDarkMode ? '#A7F3D0' : '#065F46',
                        marginBottom: 12,
                      }}
                    >
                      Final Diagnosis
                    </h4>
                    <div
                      style={{
                        padding: 16,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 12,
                        fontSize: 15,
                        color: isDarkMode ? '#D1FAE5' : '#047857',
                        lineHeight: 1.6,
                      }}
                    >
                      {selectedStudy.doctorReview.finalDiagnosis}
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: isDarkMode ? '#A7F3D0' : '#065F46',
                        marginBottom: 12,
                      }}
                    >
                      Doctor's Comments
                    </h4>
                    <div style={{ fontSize: 15, color: isDarkMode ? '#D1FAE5' : '#047857', lineHeight: 1.6 }}>
                      {selectedStudy.doctorReview.doctorComments}
                    </div>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: isDarkMode ? '#A7F3D0' : '#065F46',
                        marginBottom: 12,
                      }}
                    >
                      Recommendations
                    </h4>
                    {selectedStudy.doctorReview.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'start',
                          gap: 12,
                          marginBottom: 10,
                          fontSize: 15,
                          color: isDarkMode ? '#D1FAE5' : '#047857',
                          lineHeight: 1.6,
                        }}
                      >
                        <ChevronRight size={16} style={{ marginTop: 4, flexShrink: 0 }} />
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
