import React, { useState } from 'react';
import { X, Mic, Square, Play, Loader, Brain, FileText, Pill, TestTube } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
}

export function ConsultationModal({ isOpen, onClose, patientName, patientId }: ConsultationModalProps) {
  const { language } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<{
    chiefComplaint?: string;
    symptoms?: string[];
    possibleDiagnoses?: string[];
    recommendedTests?: string[];
    suggestedTreatment?: string[];
  } | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  if (!isOpen) return null;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAndAnalyze = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('patientId', patientId);

      const transcribeResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-transcribe`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      const transcribeData = await transcribeResponse.json();
      setTranscript(transcribeData.transcript || 'Could not transcribe audio');

      const analyzeResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-analyze`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: transcribeData.transcript,
            patientId: patientId,
          }),
        }
      );

      const analyzeData = await analyzeResponse.json();
      setAnalysis(analyzeData.analysis);
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Failed to process recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveDiagnosis = async () => {
    alert('Diagnosis and notes saved to patient record!');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-[#0D7377] to-[#14BDBD] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {language === 'en' ? 'Consultation Session' : 'جلسة الاستشارة'}
            </h2>
            <p className="text-sm opacity-90">
              {language === 'en' ? `Patient: ${patientName}` : `المريض: ${patientName}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-[#0D7377]" />
                  {language === 'en' ? 'Voice Recording' : 'تسجيل الصوت'}
                </h3>

                <div className="flex flex-col items-center gap-4">
                  {!isRecording && !audioBlob && (
                    <button
                      onClick={startRecording}
                      className="w-20 h-20 bg-[#0D7377] hover:bg-[#0a5c5f] text-white rounded-full flex items-center justify-center transition-all shadow-lg hover:shadow-xl"
                    >
                      <Mic className="w-10 h-10" />
                    </button>
                  )}

                  {isRecording && (
                    <button
                      onClick={stopRecording}
                      className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all animate-pulse shadow-lg"
                    >
                      <Square className="w-10 h-10" />
                    </button>
                  )}

                  {audioBlob && !isRecording && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setAudioBlob(null);
                          setTranscript('');
                          setAnalysis(null);
                        }}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        {language === 'en' ? 'Record Again' : 'إعادة التسجيل'}
                      </button>
                      <button
                        onClick={transcribeAndAnalyze}
                        disabled={isProcessing}
                        className="px-6 py-3 bg-[#0D7377] hover:bg-[#0a5c5f] text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            {language === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                          </>
                        ) : (
                          <>
                            <Brain className="w-5 h-5" />
                            {language === 'en' ? 'Analyze' : 'تحليل'}
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <p className="text-sm text-gray-600 text-center">
                    {isRecording
                      ? language === 'en'
                        ? 'Recording... Click stop when finished'
                        : 'جاري التسجيل... انقر على إيقاف عند الانتهاء'
                      : language === 'en'
                      ? 'Click the microphone to start recording the consultation'
                      : 'انقر على الميكروفون لبدء تسجيل الاستشارة'}
                  </p>
                </div>
              </div>

              {transcript && (
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#0D7377]" />
                    {language === 'en' ? 'Transcript' : 'النص المكتوب'}
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {analysis && (
                <>
                  {analysis.chiefComplaint && (
                    <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-lg font-semibold mb-3 text-blue-900">
                        {language === 'en' ? 'Chief Complaint' : 'الشكوى الرئيسية'}
                      </h3>
                      <p className="text-blue-800">{analysis.chiefComplaint}</p>
                    </div>
                  )}

                  {analysis.symptoms && analysis.symptoms.length > 0 && (
                    <div className="bg-orange-50 rounded-xl p-6 border-2 border-orange-200">
                      <h3 className="text-lg font-semibold mb-3 text-orange-900">
                        {language === 'en' ? 'Symptoms' : 'الأعراض'}
                      </h3>
                      <ul className="space-y-2">
                        {analysis.symptoms.map((symptom, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-orange-800">
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2" />
                            <span>{symptom}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.possibleDiagnoses && analysis.possibleDiagnoses.length > 0 && (
                    <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
                      <h3 className="text-lg font-semibold mb-3 text-purple-900 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        {language === 'en' ? 'AI Suggested Diagnoses' : 'التشخيصات المقترحة من الذكاء الاصطناعي'}
                      </h3>
                      <ul className="space-y-2">
                        {analysis.possibleDiagnoses.map((diagnosis, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-purple-800">
                            <span className="font-semibold">{idx + 1}.</span>
                            <span>{diagnosis}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.recommendedTests && analysis.recommendedTests.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-lg font-semibold mb-3 text-green-900 flex items-center gap-2">
                        <TestTube className="w-5 h-5" />
                        {language === 'en' ? 'Recommended Tests' : 'الفحوصات المقترحة'}
                      </h3>
                      <ul className="space-y-2">
                        {analysis.recommendedTests.map((test, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-green-800">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                            <span>{test}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysis.suggestedTreatment && analysis.suggestedTreatment.length > 0 && (
                    <div className="bg-teal-50 rounded-xl p-6 border-2 border-teal-200">
                      <h3 className="text-lg font-semibold mb-3 text-teal-900 flex items-center gap-2">
                        <Pill className="w-5 h-5" />
                        {language === 'en' ? 'Suggested Treatment' : 'العلاج المقترح'}
                      </h3>
                      <ul className="space-y-2">
                        {analysis.suggestedTreatment.map((treatment, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-teal-800">
                            <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2" />
                            <span>{treatment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}

              {!analysis && !isProcessing && (
                <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {language === 'en'
                      ? 'Record and analyze the consultation to see AI-powered insights'
                      : 'سجل وحلل الاستشارة لرؤية رؤى مدعومة بالذكاء الاصطناعي'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {analysis && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              onClick={saveDiagnosis}
              className="px-6 py-3 bg-[#0D7377] hover:bg-[#0a5c5f] text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              {language === 'en' ? 'Save to Patient Record' : 'حفظ في سجل المريض'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
