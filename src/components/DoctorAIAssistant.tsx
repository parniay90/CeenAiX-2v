import { useState, useRef, useEffect } from 'react';
import {
  Mic, MicOff, Play, Pause, StopCircle, FileText, Sparkles,
  AlertCircle, CheckCircle, Loader, Download, Share2, User,
  Clock, Activity, Brain, Stethoscope, Pill, FlaskConical
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DoctorAIAssistantProps {
  appointmentId?: string;
  patientId: string;
  onClose?: () => void;
}

export function DoctorAIAssistant({ appointmentId, patientId, onClose }: DoctorAIAssistantProps) {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'completed'>('idle');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setStatus('recording');

      const { data: session, error } = await supabase
        .from('doctor_ai_sessions')
        .insert({
          doctor_id: user?.id,
          patient_id: patientId,
          appointment_id: appointmentId,
          session_type: 'consultation',
          status: 'recording',
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setSessionId(session.id);

      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current || !sessionId) return;

    mediaRecorderRef.current.stop();
    if (timerRef.current) clearInterval(timerRef.current);

    mediaRecorderRef.current.onstop = async () => {
      setIsRecording(false);
      setStatus('processing');
      setIsProcessing(true);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;

        try {
          const transcriptResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-transcribe`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                audioData: base64Audio,
                sessionId: sessionId
              })
            }
          );

          const transcriptData = await transcriptResponse.json();
          setTranscript(transcriptData.transcript);

          await supabase
            .from('ai_session_transcriptions')
            .insert({
              session_id: sessionId,
              transcript_text: transcriptData.transcript,
              transcript_segments: transcriptData.segments
            });

          const analysisResponse = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-analyze`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                transcript: transcriptData.transcript
              })
            }
          );

          const analysisData = await analysisResponse.json();
          setAnalysis(analysisData.analysis);

          await supabase
            .from('ai_session_reports')
            .insert({
              session_id: sessionId,
              chief_complaint: analysisData.analysis.chiefComplaint,
              history_of_present_illness: analysisData.analysis.historyOfPresentIllness,
              physical_examination: analysisData.analysis.physicalExamination,
              assessment: analysisData.analysis.assessment,
              diagnosis_suggestions: analysisData.analysis.diagnosisSuggestions,
              treatment_plan: analysisData.analysis.treatmentPlan,
              follow_up_recommendations: analysisData.analysis.followUpRecommendations,
              prescriptions_suggested: analysisData.analysis.prescriptionsSuggested,
              lab_tests_suggested: analysisData.analysis.labTestsSuggested,
              full_report: analysisData.analysis.fullReport
            });

          await supabase
            .from('doctor_ai_sessions')
            .update({
              status: 'completed',
              ended_at: new Date().toISOString(),
              duration_seconds: duration
            })
            .eq('id', sessionId);

          setStatus('completed');
          setIsProcessing(false);

        } catch (error) {
          console.error('Error processing recording:', error);
          setIsProcessing(false);
          alert('Failed to process recording. Please try again.');
        }
      };

      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    };
  };

  const downloadReport = () => {
    if (!analysis) return;

    const blob = new Blob([analysis.fullReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f8fafc, #e0f2f1)',
      padding: '24px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
          borderRadius: '16px',
          padding: '32px',
          color: 'white',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Brain size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0 }}>AI Medical Assistant</h1>
              <p style={{ margin: '4px 0 0 0', opacity: 0.9 }}>Record consultation and generate intelligent reports</p>
            </div>
          </div>

          {status === 'recording' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }} />
                <span style={{ fontSize: '18px', fontWeight: 600 }}>
                  {isPaused ? 'Paused' : 'Recording in progress'}
                </span>
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                fontFamily: 'monospace'
              }}>
                {formatTime(duration)}
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        {status === 'idle' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0891b2, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 8px 24px rgba(8, 145, 178, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={startRecording}>
              <Mic size={56} color="white" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>
              Start Recording Session
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              Click the microphone to begin recording your consultation
            </p>
          </div>
        )}

        {status === 'recording' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '24px'
            }}>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '2px solid #f59e0b',
                    background: 'white',
                    color: '#f59e0b',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f59e0b';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#f59e0b';
                  }}>
                  <Pause size={20} />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  style={{
                    padding: '16px 32px',
                    borderRadius: '12px',
                    border: '2px solid #10b981',
                    background: 'white',
                    color: '#10b981',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#10b981';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#10b981';
                  }}>
                  <Play size={20} />
                  Resume
                </button>
              )}

              <button
                onClick={stopRecording}
                style={{
                  padding: '16px 32px',
                  borderRadius: '12px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}>
                <StopCircle size={20} />
                Stop & Analyze
              </button>
            </div>

            <div style={{
              background: '#f8fafc',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center'
            }}>
              <Activity size={24} style={{ margin: '0 auto 8px', color: '#0891b2' }} />
              <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                Speak clearly near your microphone. The AI is listening and will transcribe automatically.
              </p>
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
          }}>
            <Loader size={64} style={{ margin: '0 auto 24px', color: '#0891b2', animation: 'spin 1s linear infinite' }} />
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#1e293b' }}>
              Processing Recording
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px' }}>
              AI is transcribing and analyzing your consultation...
            </p>
          </div>
        )}

        {status === 'completed' && analysis && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Action Buttons */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              gap: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <button
                onClick={downloadReport}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#0891b2',
                  color: 'white',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                <Download size={20} />
                Download Report
              </button>
              <button
                onClick={() => {
                  setStatus('idle');
                  setTranscript('');
                  setAnalysis(null);
                  setDuration(0);
                }}
                style={{
                  flex: 1,
                  padding: '16px',
                  borderRadius: '12px',
                  background: '#64748b',
                  color: 'white',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                New Session
              </button>
            </div>

            {/* Diagnosis Suggestions */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <Stethoscope size={24} color="#0891b2" />
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                  Diagnosis Suggestions
                </h3>
              </div>
              {analysis.diagnosisSuggestions.map((diag: any, index: number) => (
                <div key={index} style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                        {diag.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        ICD-10: {diag.code}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: diag.confidence > 0.7 ? '#dcfce7' : '#fef3c7',
                      color: diag.confidence > 0.7 ? '#166534' : '#854d0e',
                      fontSize: '13px',
                      fontWeight: 600
                    }}>
                      {(diag.confidence * 100).toFixed(0)}% confidence
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                    {diag.rationale}
                  </p>
                </div>
              ))}
            </div>

            {/* Treatment Plan */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Pill size={24} color="#0891b2" />
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                  Treatment Plan
                </h3>
              </div>
              <p style={{ color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {analysis.treatmentPlan}
              </p>
            </div>

            {/* Lab Tests */}
            {analysis.labTestsSuggested.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <FlaskConical size={24} color="#0891b2" />
                  <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                    Recommended Lab Tests
                  </h3>
                </div>
                {analysis.labTestsSuggested.map((test: any, index: number) => (
                  <div key={index} style={{
                    background: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '4px' }}>
                      {test.test}
                    </div>
                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                      {test.reason} • Priority: {test.priority}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Full Transcript */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <FileText size={24} color="#0891b2" />
                <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                  Full Transcript
                </h3>
              </div>
              <p style={{
                color: '#475569',
                lineHeight: 1.7,
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px'
              }}>
                {transcript}
              </p>
            </div>
          </div>
        )}

        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
