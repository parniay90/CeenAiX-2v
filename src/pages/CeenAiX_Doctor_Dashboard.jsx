import { useState, useEffect, useRef } from "react";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { EmergencyButton } from "../components/EmergencyButton";
import FamilyMedicalHistory from "../components/FamilyMedicalHistory";
import { useNavigation } from "../contexts/NavigationContext";

const NAV = [
  { id: "home", label: "Dashboard", icon: "⊞" },
  { id: "today", label: "Today's Appointments", icon: "📋" },
  { id: "upcoming", label: "Upcoming Schedule", icon: "📅" },
  { id: "patients", label: "Patient Records", icon: "🧑‍⚕️" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "referrals", label: "Lab Referrals", icon: "🔬" },
  { id: "radiology", label: "Imaging / Radiology", icon: "🩻" },
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "earnings", label: "Earnings", icon: "💰" },
  { id: "help", label: "Help & Support", icon: "❓" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

const TODAY_APPTS = [
  { id: 1, patient: "Fatima Al Rashid", age: 34, time: "09:00", type: "In-Clinic", condition: "Diabetes follow-up", status: "completed", avatar: "F" },
  { id: 2, patient: "Mohammed Al Zaabi", age: 52, time: "10:00", type: "In-Clinic", condition: "Hypertension review", status: "completed", avatar: "M" },
  { id: 3, patient: "Parnia Yazdkhasti", age: 38, time: "11:00", type: "In-Clinic", condition: "Cardiac check-up", status: "active", avatar: "P" },
  { id: 4, patient: "Aisha Noor", age: 29, time: "12:30", type: "Teleconsultation", condition: "New patient — chest pain", status: "upcoming", avatar: "A" },
  { id: 5, patient: "Rajan Pillai", age: 45, time: "14:00", type: "In-Clinic", condition: "ECG review", status: "upcoming", avatar: "R" },
  { id: 6, patient: "Sara Al Hashimi", age: 61, time: "15:30", type: "Teleconsultation", condition: "Medication adjustment", status: "upcoming", avatar: "S" },
  { id: 7, patient: "Omar Khalil", age: 48, time: "16:30", type: "In-Clinic", condition: "Post-surgery follow-up", status: "upcoming", avatar: "O" },
];

const PATIENTS = [
  { id: 1, name: "Fatima Al Rashid", age: 34, condition: "Type 2 Diabetes", lastVisit: "Today", visits: 8, avatar: "F", insurance: "Daman", phone: "+971 50 XXX XXXX", patient_id: null },
  { id: 2, name: "Mohammed Al Zaabi", age: 52, condition: "Hypertension", lastVisit: "Today", visits: 12, avatar: "M", insurance: "AXA", phone: "+971 55 XXX XXXX", patient_id: null },
  { id: 3, name: "Parnia Yazdkhasti", age: 38, condition: "Cardiac monitoring", lastVisit: "Today", visits: 5, avatar: "P", insurance: "Daman", phone: "+971 5X XXX XXXX", patient_id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" },
  { id: 4, name: "Rajan Pillai", age: 45, condition: "Post-surgery care", lastVisit: "Mar 5", visits: 3, avatar: "R", insurance: "MetLife", phone: "+971 52 XXX XXXX", patient_id: null },
  { id: 5, name: "Aisha Noor", age: 29, condition: "New patient", lastVisit: "—", visits: 0, avatar: "A", insurance: "Thiqa", phone: "+971 56 XXX XXXX", patient_id: null },
];

const UPCOMING_APPTS = [
  { date: "Mar 13", day: "Thu", count: 6, appts: ["09:00 Fatima Al Rashid", "10:30 New Patient", "11:30 Mohammed Al Zaabi", "14:00 Rajan Pillai", "15:00 Sara Al Hashimi", "16:30 Omar Khalil"] },
  { date: "Mar 14", day: "Fri", count: 3, appts: ["09:00 Aisha Noor", "11:00 Walk-in", "14:30 Parnia Yazdkhasti"] },
  { date: "Mar 16", day: "Sun", count: 7, appts: ["09:00 Fatima Al Rashid", "10:00 New patient", "11:30 Mohammed Al Zaabi", "13:00 Rajan Pillai", "14:30 Sara Al Hashimi", "15:30 Omar Khalil", "16:30 Walk-in"] },
  { date: "Mar 17", day: "Mon", count: 5, appts: ["09:30 New patient", "11:00 Aisha Noor", "13:00 Parnia Yazdkhasti", "15:00 Fatima Al Rashid", "16:30 Rajan Pillai"] },
];

const PRESCRIPTIONS_DATA = [
  { patient: "Parnia Yazdkhasti", drug: "Metformin 500mg", freq: "Twice daily", duration: "3 months", date: "Mar 12, 2026", sent: "Patient + Pharmacy", avatar: "P" },
  { patient: "Fatima Al Rashid", drug: "Insulin Glargine 20U", freq: "Once daily at bedtime", duration: "Ongoing", date: "Mar 12, 2026", sent: "Patient", avatar: "F" },
  { patient: "Mohammed Al Zaabi", drug: "Amlodipine 5mg", freq: "Once daily", duration: "Ongoing", date: "Mar 12, 2026", sent: "Patient + Pharmacy", avatar: "M" },
  { patient: "Rajan Pillai", drug: "Aspirin 100mg", freq: "Once daily", duration: "6 months", date: "Mar 5, 2026", sent: "Patient", avatar: "R" },
];

const REFERRALS_DATA = [
  { patient: "Parnia Yazdkhasti", test: "HbA1c, Lipid Panel", lab: "LifeLab Dubai", date: "Mar 12, 2026", urgency: "Routine", status: "Pending", avatar: "P" },
  { patient: "Mohammed Al Zaabi", test: "ECG, Troponin", lab: "AlMana Medical Lab", date: "Mar 12, 2026", urgency: "Urgent", status: "In Progress", avatar: "M" },
  { patient: "Fatima Al Rashid", test: "HbA1c, Renal Function", lab: "LifeLab Dubai", date: "Mar 1, 2026", urgency: "Routine", status: "Result Ready", avatar: "F" },
];

const MESSAGES = [
  { patient: "Aisha Noor", last: "I've been having chest pains since yesterday evening...", time: "10:22 AM", unread: 2, avatar: "A" },
  { patient: "Rajan Pillai", last: "Thank you Doctor, the medication is working well.", time: "Yesterday", unread: 0, avatar: "R" },
  { patient: "Sara Al Hashimi", last: "Can we move tomorrow's appointment to the afternoon?", time: "Yesterday", unread: 1, avatar: "S" },
];

const CONSULTATION_PATIENT = {
  name: "Parnia Yazdkhasti",
  age: 38, dob: "1988", blood: "A+",
  conditions: ["Type 2 Diabetes", "Hypertension"],
  allergies: ["Penicillin"],
  meds: ["Metformin 500mg", "Atorvastatin 20mg"],
  lastHba1c: "6.8% — Mar 2, 2026",
  insurance: "Daman — Active",
};

export default function DoctorDashboard({ onNavigateHome }) {
  const navigation = useNavigation();
  const [active, setActive] = useState("home");
  const [viewHistory, setViewHistory] = useState(["home"]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultNotes, setConsultNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [rxForm, setRxForm] = useState({ drug: "", dosage: "", freq: "", duration: "", notes: "", sendTo: "both" });
  const [rxSubmitted, setRxSubmitted] = useState(false);
  const [refForm, setRefForm] = useState({ lab: "", tests: "", notes: "", urgency: "Routine" });
  const [refSubmitted, setRefSubmitted] = useState(false);
  const [patientSearch, setPatientSearch] = useState("");
  const [activeMsg, setActiveMsg] = useState(0);
  const [msgInput, setMsgInput] = useState("");
  const [msgThreads, setMsgThreads] = useState({ 0: [{ from: "patient", text: "I've been having chest pains since yesterday evening, should I be worried?" }], 1: [], 2: [] });
  const [earningsTab, setEarningsTab] = useState("overview");
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const navigateToView = (view) => {
    setViewHistory(prev => [...prev, view]);
    setActive(view);
  };

  const handleBackNavigation = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setActive(previousView);
      return true;
    }
    return false;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setAnalysis(null);
      setTranscript('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'consultation.webm');
      formData.append('patientId', CONSULTATION_PATIENT.id || 'demo-patient');

      const transcriptResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-transcribe`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: formData,
        }
      );

      if (!transcriptResponse.ok) throw new Error('Transcription failed');

      const { transcript: transcriptText } = await transcriptResponse.json();
      setTranscript(transcriptText);

      const analysisResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/doctor-ai-analyze`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transcript: transcriptText,
            patientId: CONSULTATION_PATIENT.id || 'demo-patient',
          }),
        }
      );

      if (!analysisResponse.ok) throw new Error('Analysis failed');

      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);

      if (analysisData.summary) {
        setConsultNotes(analysisData.summary);
      }
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Error processing recording. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const [profileForm, setProfileForm] = useState({
    full_name: "Dr. Layla Al Mansoori",
    specialty: "Cardiology",
    sub_specialty: "Interventional Cardiology",
    medical_school: "UAE University, College of Medicine",
    graduation_year: "2013",
    dha_license: "DHA-12345678",
    years_experience: "12",
    languages: "Arabic, English",
    clinic_fee: "350",
    tele_fee: "200",
    insurance: "Daman, AXA, Thiqa, MetLife",
    bio: "Dr. Layla Al Mansoori is a board-certified cardiologist with over 12 years of experience treating cardiovascular conditions in Dubai. She specializes in interventional cardiology and preventive heart care, and is committed to delivering patient-centered, evidence-based treatment."
  });
  const [showDHAVerification, setShowDHAVerification] = useState(false);
  const [dhaVerificationForm, setDhaVerificationForm] = useState({
    request_type: "initial",
    license_number: "",
    specialization: "Cardiology",
    sub_specialization: "",
    years_of_experience: 12,
    medical_school: "",
    graduation_year: 2013,
    additional_notes: ""
  });
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [documents, setDocuments] = useState([
    { id: 1, type: "Medical License", status: "approved", uploaded: "2024-01-15", name: "medical_license.pdf" },
    { id: 2, type: "DHA Certificate", status: "approved", uploaded: "2024-01-15", name: "dha_cert.pdf" },
    { id: 3, type: "Medical Degree", status: "approved", uploaded: "2024-01-15", name: "degree.pdf" }
  ]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.sidebar-user-menu')) {
        setUserMenuOpen(false);
      }
      if (headerMenuOpen && !event.target.closest('.header-user-menu')) {
        setHeaderMenuOpen(false);
      }
    };

    if (userMenuOpen || headerMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, headerMenuOpen]);

  const handleSignOut = () => {
    if (onNavigateHome) {
      onNavigateHome();
    }
  };

  const filteredPatients = PATIENTS.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.condition.toLowerCase().includes(patientSearch.toLowerCase())
  );

  const sendMsg = () => {
    if (!msgInput.trim()) return;
    setMsgThreads(prev => ({ ...prev, [activeMsg]: [...(prev[activeMsg] || []), { from: "doctor", text: msgInput }] }));
    setMsgInput("");
  };

  const submitRx = () => { if (rxForm.drug) { setRxSubmitted(true); setTimeout(() => { setRxSubmitted(false); setRxForm({ drug: "", dosage: "", freq: "", duration: "", notes: "", sendTo: "both" }); }, 2500); } };
  const submitRef = () => { if (refForm.tests) { setRefSubmitted(true); setTimeout(() => { setRefSubmitted(false); setRefForm({ lab: "", tests: "", notes: "", urgency: "Routine" }); }, 2500); } };

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: "#F8FAFB", minHeight: "100vh", display: "flex", color: "#1E293B" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #0D7377; border-radius: 4px; }
        .nav-item { transition: all 0.18s ease; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 11px; padding: 10px 12px; color: #64748B; }
        .nav-item:hover { background: rgba(13,115,119,0.08); color: #0D7377; }
        .nav-item.active { background: rgba(13,115,119,0.12); color: #0D7377; border-left: 3px solid #0D7377; font-weight: 600; }
        .glass-card { background: white; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .glass-card-hover { transition: all 0.2s; }
        .glass-card-hover:hover { box-shadow: 0 4px 12px rgba(13,115,119,0.1); border-color: #0D7377; }
        .stat-card { background: white; border: 1px solid #E2E8F0; border-radius: 14px; padding: 20px 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
        .badge-teal { background: rgba(13,115,119,0.1); color: #0D7377; }
        .badge-green { background: rgba(16,185,129,0.1); color: #059669; }
        .badge-amber { background: rgba(245,158,11,0.1); color: #D97706; }
        .badge-red { background: rgba(239,68,68,0.1); color: #DC2626; }
        .badge-blue { background: rgba(59,130,246,0.1); color: #2563EB; }
        .badge-active { background: rgba(13,115,119,0.15); color: #0D7377; border: 1px solid rgba(13,115,119,0.3); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .btn-primary { background: linear-gradient(135deg, #0D7377, #14BDBD); color: white; border: none; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(13,115,119,0.3); }
        .btn-outline { background: white; color: #0D7377; border: 1px solid #0D7377; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-outline:hover { background: #0D7377; color: white; }
        .btn-ghost { background: #F1F5F9; color: #64748B; border: 1px solid #E2E8F0; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.15s; font-weight: 500; }
        .btn-ghost:hover { background: #E2E8F0; color: #334155; }
        .appt-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; transition: all 0.18s; cursor: pointer; border: 1px solid transparent; }
        .appt-row:hover { background: #F8FAFB; border-color: #E2E8F0; }
        .appt-row.active-appt { background: rgba(13,115,119,0.05); border-color: #0D7377; }
        .avatar { border-radius: 50%; background: linear-gradient(135deg, #0D7377, #14BDBD); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .input-dark { background: white; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px 14px; font-size: 13.5px; color: #1E293B; font-family: inherit; width: 100%; outline: none; transition: border-color 0.18s; }
        .input-dark:focus { border-color: #0D7377; box-shadow: 0 0 0 3px rgba(13,115,119,0.1); }
        .input-dark::placeholder { color: #94A3B8; }
        select.input-dark option { background: white; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: #1E293B; margin-bottom: 4px; }
        .section-sub { font-size: 13px; color: #64748B; margin-bottom: 24px; }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .tab-btn { padding: 7px 16px; border-radius: 8px; border: none; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .tab-active { background: rgba(13,115,119,0.12); color: #0D7377; }
        .tab-inactive { background: transparent; color: #64748B; }
        .tab-inactive:hover { color: #1E293B; }
        .msg-bubble { max-width: 78%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.55; }
        .msg-doctor { background: #0D7377; color: white; border-radius: 14px 4px 14px 14px; margin-left: auto; }
        .msg-patient { background: #F1F5F9; color: #334155; border-radius: 4px 14px 14px 14px; }
        .earnings-bar { height: 6px; background: #E2E8F0; border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .earnings-fill { height: 100%; background: linear-gradient(90deg, #0D7377, #14BDBD); border-radius: 4px; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal { background: white; border: 1px solid #E2E8F0; border-radius: 20px; padding: 32px; width: 680px; max-height: 85vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #1E293B; margin-bottom: 20px; }
        .success-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.95); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; backdrop-filter: blur(4px); }
        .card { background: white; border: 1px solid #E2E8F0; border-radius: 12px; }
      `}</style>

      {/* CONSULTATION MODAL */}
      {consultOpen && (
        <div className="overlay" onClick={() => setConsultOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div className="modal-title">Consultation Workspace</div>
                <div style={{ fontSize: 13, color: "#64748B" }}>Active session — {CONSULTATION_PATIENT.name}</div>
              </div>
              <span className="badge badge-active">● Live</span>
            </div>

            {/* Patient summary strip */}
            <div style={{ background: "rgba(13,115,119,0.05)", border: "1px solid rgba(13,115,119,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              {[
                ["Patient", CONSULTATION_PATIENT.name],
                ["Age / Blood", `${CONSULTATION_PATIENT.age} yrs · ${CONSULTATION_PATIENT.blood}`],
                ["Conditions", CONSULTATION_PATIENT.conditions.join(", ")],
                ["Allergies", CONSULTATION_PATIENT.allergies.join(", ")],
              ].map(([k, v], i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1E293B" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Current meds */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>Current Medications</div>
              <div style={{ display: "flex", gap: 8 }}>
                {CONSULTATION_PATIENT.meds.map((m, i) => <span key={i} className="badge badge-blue">{m}</span>)}
              </div>
            </div>

            {/* Voice Recording Section */}
            <div style={{ marginBottom: 20, background: "linear-gradient(135deg, #0D7377 0%, #14FFEC 100%)", borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 13, color: "white", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                🎙️ Voice Recording Assistant
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                {!isRecording && !audioBlob && (
                  <button
                    className="btn-primary"
                    onClick={startRecording}
                    style={{ background: "white", color: "#0D7377", flex: 1 }}
                  >
                    🎙️ Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    className="btn-primary"
                    onClick={stopRecording}
                    style={{ background: "#EF4444", color: "white", flex: 1, animation: "pulse 2s infinite" }}
                  >
                    ⏹️ Stop Recording
                  </button>
                )}

                {audioBlob && !isRecording && (
                  <>
                    <button
                      className="btn-outline"
                      onClick={() => { setAudioBlob(null); setAnalysis(null); setTranscript(''); }}
                      style={{ background: "white", borderColor: "white", color: "#0D7377" }}
                    >
                      🔄 Re-record
                    </button>
                    <button
                      className="btn-primary"
                      onClick={processRecording}
                      disabled={isProcessing}
                      style={{ background: "white", color: "#0D7377", flex: 1 }}
                    >
                      {isProcessing ? "⏳ Processing..." : "🧠 Analyze with AI"}
                    </button>
                  </>
                )}
              </div>

              {isRecording && (
                <div style={{ color: "white", fontSize: 12, textAlign: "center", opacity: 0.9 }}>
                  🔴 Recording in progress... Speak naturally about the consultation
                </div>
              )}
            </div>

            {/* AI Analysis Results */}
            {analysis && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "#0D7377", fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  🧠 AI Analysis Results
                </div>

                <div style={{ display: "grid", gap: 12 }}>
                  {analysis.chiefComplaint && (
                    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#1E40AF", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Chief Complaint</div>
                      <div style={{ fontSize: 13, color: "#1E293B", lineHeight: 1.5 }}>{analysis.chiefComplaint}</div>
                    </div>
                  )}

                  {analysis.symptoms && analysis.symptoms.length > 0 && (
                    <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#92400E", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Symptoms</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {analysis.symptoms.map((symptom, idx) => (
                          <span key={idx} style={{ background: "white", border: "1px solid #FCD34D", color: "#92400E", fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>
                            {symptom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.possibleDiagnoses && analysis.possibleDiagnoses.length > 0 && (
                    <div style={{ background: "#F3E8FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#6B21A8", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Possible Diagnoses</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {analysis.possibleDiagnoses.map((diagnosis, idx) => (
                          <div key={idx} style={{ fontSize: 13, color: "#1E293B", display: "flex", gap: 6 }}>
                            <span>•</span>
                            <span>{diagnosis}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.recommendedTests && analysis.recommendedTests.length > 0 && (
                    <div style={{ background: "#DCFCE7", border: "1px solid #BBF7D0", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#166534", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Recommended Tests</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {analysis.recommendedTests.map((test, idx) => (
                          <span key={idx} style={{ background: "white", border: "1px solid #86EFAC", color: "#166534", fontSize: 12, padding: "4px 10px", borderRadius: 6, fontWeight: 500 }}>
                            🔬 {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.suggestedTreatment && analysis.suggestedTreatment.length > 0 && (
                    <div style={{ background: "#CFFAFE", border: "1px solid #A5F3FC", borderRadius: 10, padding: 14 }}>
                      <div style={{ fontSize: 11, color: "#0E7490", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.5px" }}>Suggested Treatment</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {analysis.suggestedTreatment.map((treatment, idx) => (
                          <div key={idx} style={{ fontSize: 13, color: "#1E293B", display: "flex", gap: 6 }}>
                            <span>•</span>
                            <span>{treatment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>Consultation Notes & Diagnosis</div>
              <textarea
                className="input-dark"
                rows={5}
                placeholder="Enter diagnosis, observations, treatment plan..."
                value={consultNotes}
                onChange={e => setConsultNotes(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-outline" onClick={() => { setConsultOpen(false); navigateToView("prescriptions"); }}>💊 Write Prescription</button>
              <button className="btn-outline" onClick={() => { setConsultOpen(false); navigateToView("referrals"); }}>🔬 Order Lab Test</button>
              <button className="btn-primary" style={{ marginLeft: "auto" }} onClick={() => setConsultOpen(false)}>✓ Mark Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 230 : 68,
        background: "white",
        borderRight: "1px solid #E2E8F0",
        display: "flex", flexDirection: "column",
        padding: "20px 10px",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto",
        boxShadow: "1px 0 3px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 }}>
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy.png"
            alt="CeenAiX"
            style={{
              height: sidebarOpen ? 48 : 44,
              width: "auto",
              objectFit: "contain",
              transition: "all 0.25s ease"
            }}
          />
        </div>

        {sidebarOpen && (
          <div style={{ fontSize: 10, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "1px", padding: "0 12px", marginBottom: 8, fontWeight: 600 }}>Doctor Portal</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map(item => (
            <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => {
              if (item.id === "help") {
                navigation.navigateToHelpSupport();
              } else {
                navigateToView(item.id);
              }
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              {item.id === "messages" && sidebarOpen && <span style={{ marginLeft: "auto", background: "#EF4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>3</span>}
            </div>
          ))}
        </div>

        {sidebarOpen && (
          <div className="sidebar-user-menu" style={{ position: "relative" }}>
            <div
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{
                borderTop: "1px solid #E2E8F0",
                paddingTop: 14,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 8px 0",
                cursor: "pointer",
                transition: "background 0.2s",
                borderRadius: "8px",
                margin: "0 -4px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(13,115,119,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>L</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1E293B" }}>Dr. Layla Al Mansoori</div>
                <div style={{ fontSize: 10.5, color: "#64748B" }}>Cardiologist · DHA ✓</div>
              </div>
              <div style={{ fontSize: 18, color: "#64748B" }}>⋮</div>
            </div>

            {userMenuOpen && (
              <div style={{
                position: "absolute",
                bottom: "100%",
                left: 0,
                right: 0,
                marginBottom: 8,
                background: "white",
                border: "1px solid #E2E8F0",
                borderRadius: 12,
                padding: "8px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                zIndex: 1000
              }}>
                {[
                  { icon: "👤", label: "View Profile", action: () => { navigateToView("profile"); setUserMenuOpen(false); } },
                  { icon: "⚙️", label: "Settings", action: () => { navigation.navigateToDoctorSettings(); setUserMenuOpen(false); } },
                  { icon: "🔔", label: "Notifications", action: () => { navigation.navigateToNotifications(); setUserMenuOpen(false); } },
                  { icon: "❓", label: "Help & Support", action: () => { navigation.navigateToHelpSupport(); setUserMenuOpen(false); } },
                  { icon: "📄", label: "Terms & Conditions", action: () => { navigation.navigateToTerms(); setUserMenuOpen(false); } },
                  { icon: "🔒", label: "Privacy Policy", action: () => { navigation.navigateToPrivacy(); setUserMenuOpen(false); } },
                  { icon: "🚪", label: "Sign Out", action: handleSignOut, isDanger: true }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 12px",
                      border: "none",
                      background: "transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 500,
                      color: item.isDanger ? "#DC2626" : "#1E293B",
                      transition: "all 0.15s",
                      textAlign: "left",
                      marginTop: i === 6 ? "4px" : 0,
                      borderTop: i === 6 ? "1px solid #E2E8F0" : "none",
                      paddingTop: i === 6 ? "12px" : "10px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = item.isDanger ? "rgba(220,38,38,0.05)" : "#F8FAFB";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}>

        {/* TOPBAR */}
        <div style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {(viewHistory.length > 1 || onNavigateHome) && (
              <button
                onClick={() => {
                  const navigatedBack = handleBackNavigation();
                  if (!navigatedBack && onNavigateHome) {
                    onNavigateHome();
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  background: "#1E293B",
                  border: "1px solid #334155",
                  borderRadius: 10,
                  color: "#F1F5F9",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(-2px)";
                  e.currentTarget.style.background = "#334155";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.background = "#1E293B";
                }}
              >
                ← Back
              </button>
            )}
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#64748B" }}>☰</button>
            <div style={{ background: "#F8FAFB", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, width: 260 }}>
              <span style={{ color: "#64748B", fontSize: 13 }}>🔍</span>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>Search patients, records...</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 12, color: "#64748B" }}>Thu, 12 Mar 2026</div>
            <NotificationDropdown />
            <div className="header-user-menu" style={{ position: "relative" }}>
              <div
                className="avatar"
                style={{ width: 34, height: 34, fontSize: 13, cursor: "pointer" }}
                onClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              >
                L
              </div>

              {headerMenuOpen && (
                <div style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 220,
                  background: "white",
                  border: "1px solid #E2E8F0",
                  borderRadius: 12,
                  padding: "8px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                  zIndex: 1000
                }}>
                  <div style={{ padding: "12px", borderBottom: "1px solid #E2E8F0", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Dr. Layla Al Mansoori</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Cardiologist</div>
                  </div>

                  {[
                    { icon: "👤", label: "View Profile", action: () => { navigateToView("profile"); setHeaderMenuOpen(false); } },
                    { icon: "⚙️", label: "Settings", action: () => { navigation.navigateToDoctorSettings(); setHeaderMenuOpen(false); } },
                    { icon: "🔔", label: "Notifications", action: () => { navigation.navigateToNotifications(); setHeaderMenuOpen(false); } },
                    { icon: "❓", label: "Help & Support", action: () => { navigation.navigateToHelpSupport(); setHeaderMenuOpen(false); } },
                    { icon: "📄", label: "Terms & Conditions", action: () => { navigation.navigateToTerms(); setHeaderMenuOpen(false); } },
                    { icon: "🔒", label: "Privacy Policy", action: () => { navigation.navigateToPrivacy(); setHeaderMenuOpen(false); } },
                    { icon: "🚪", label: "Sign Out", action: handleSignOut, isDanger: true }
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        border: "none",
                        background: "transparent",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: item.isDanger ? "#DC2626" : "#1E293B",
                        transition: "all 0.15s",
                        textAlign: "left",
                        marginTop: i === 6 ? "4px" : 0,
                        borderTop: i === 6 ? "1px solid #E2E8F0" : "none",
                        paddingTop: i === 6 ? "12px" : "10px"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = item.isDanger ? "rgba(220,38,38,0.05)" : "#F8FAFB";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ── DASHBOARD HOME ── */}
          {active === "home" && (
            <div>
              {/* Welcome banner */}
              <div style={{ background: "linear-gradient(135deg, #0D7377 0%, #14BDBD 100%)", border: "1px solid #0D7377", borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}></div>
                <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
                  <div style={{ fontSize: 40, fontFamily: "Playfair Display, serif", fontWeight: 800, color: "rgba(255,255,255,0.3)", lineHeight: 1 }}>8</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Appointments today</div>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, textTransform: "uppercase" }}>Good morning</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "white", marginBottom: 6 }}>Dr. Layla Al Mansoori</div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.95)", marginBottom: 18 }}>Next: <span style={{ color: "white", fontWeight: 700 }}>Parnia Yazdkhasti</span> at 11:00 AM — Cardiac check-up</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" onClick={() => navigateToView("today")}>View Today's Schedule</button>
                  <button className="btn-outline" onClick={() => { setConsultOpen(true); }}>Start Consultation</button>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Today's Appointments", value: "8", sub: "3 remaining", color: "#14BDBD", icon: "📋", onClick: () => navigateToView("today") },
                  { label: "Pending Messages", value: "3", sub: "2 urgent", color: "#F87171", icon: "💬", onClick: () => navigateToView("messages") },
                  { label: "Lab Results In", value: "2", sub: "New today", color: "#34D399", icon: "🔬", onClick: () => navigateToView("referrals") },
                  { label: "Earnings This Month", value: "AED 28,400", sub: "+12% vs last month", color: "#FCD34D", icon: "💰", onClick: () => navigateToView("earnings") },
                ].map((s, i) => (
                  <div key={i} className="stat-card" onClick={s.onClick} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: i === 3 ? 20 : 30, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Today's schedule + Patient activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>Today's Schedule</div>
                    <button className="btn-ghost" onClick={() => setShowAppointmentsModal(true)}>View All</button>
                  </div>
                  {TODAY_APPTS.slice(0, 5).map(a => (
                    <div key={a.id} className={`appt-row ${a.status === "active" ? "active-appt" : ""}`} onClick={() => { if (a.status === "active") setConsultOpen(true); }}>
                      <div style={{ width: 48, textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: a.status === "active" ? "#0D7377" : "#64748B" }}>{a.time}</div>
                      </div>
                      <div style={{ width: 1, background: a.status === "active" ? "#0D7377" : "#E2E8F0", alignSelf: "stretch" }}></div>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{a.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{a.patient}</div>
                        <div style={{ fontSize: 11.5, color: "#64748B" }}>{a.condition}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {a.status === "active" && <span className="badge badge-active">● Active</span>}
                        {a.status === "completed" && <span className="badge badge-green">✓ Done</span>}
                        {a.status === "upcoming" && <span className={`badge ${a.type === "Teleconsultation" ? "badge-blue" : "badge-teal"}`}>{a.type === "Teleconsultation" ? "📹" : "🏥"}</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card">
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 18 }}>Recent Patient Activity</div>
                  {[
                    { icon: "🔬", text: "Fatima Al Rashid's HbA1c result is ready", time: "5 min ago", color: "#10B981" },
                    { icon: "💬", text: "Aisha Noor sent an urgent message", time: "22 min ago", color: "#EF4444" },
                    { icon: "💊", text: "Prescription sent to Rajan Pillai", time: "1 hr ago", color: "#0D7377" },
                    { icon: "✓", text: "Mohammed Al Zaabi consultation complete", time: "2 hrs ago", color: "#10B981" },
                    { icon: "📅", text: "New appointment booked by Sara Al Hashimi", time: "3 hrs ago", color: "#F59E0B" },
                  ].map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid #F1F5F9" : "none", alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TODAY'S APPOINTMENTS ── */}
          {active === "today" && (
            <div>
              <div className="section-title">Today's Appointments</div>
              <div className="section-sub">Thursday, 12 March 2026 · 8 appointments</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {TODAY_APPTS.map(a => (
                    <div key={a.id} className={`glass-card glass-card-hover ${a.status === "active" ? "" : ""}`} style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, borderLeft: a.status === "active" ? "3px solid #0D7377" : a.status === "completed" ? "3px solid #10B981" : "3px solid transparent", cursor: "pointer" }} onClick={() => { if (a.status === "active" || a.status === "upcoming") setConsultOpen(true); }}>
                      <div style={{ textAlign: "center", minWidth: 52 }}>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: a.status === "active" ? "#0D7377" : a.status === "completed" ? "#94A3B8" : "#64748B" }}>{a.time}</div>
                        <div style={{ fontSize: 10, color: "#94A3B8" }}>AM</div>
                      </div>
                      <div style={{ width: 1, height: 44, background: "#E2E8F0" }}></div>
                      <div className="avatar" style={{ width: 42, height: 42, fontSize: 16 }}>{a.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: a.status === "completed" ? "#64748B" : "#1E293B" }}>{a.patient}</div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{a.condition}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`badge ${a.type === "Teleconsultation" ? "badge-blue" : "badge-teal"}`}>{a.type === "Teleconsultation" ? "📹 Tele" : "🏥 Clinic"}</span>
                        {a.status === "active" && <span className="badge badge-active">● In Progress</span>}
                        {a.status === "completed" && <span className="badge badge-green">✓ Done</span>}
                        {a.status === "upcoming" && <button className="btn-primary" style={{ fontSize: 12, padding: "6px 14px" }} onClick={e => { e.stopPropagation(); setConsultOpen(true); }}>Start</button>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Day summary panel */}
                <div className="glass-card" style={{ alignSelf: "flex-start", position: "sticky", top: 80 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 16 }}>Day Summary</div>
                  {[
                    ["Total", "8 appointments"],
                    ["Completed", "2"],
                    ["In Progress", "1"],
                    ["Remaining", "5"],
                    ["In-Clinic", "5"],
                    ["Teleconsultation", "2"],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}>
                      <span style={{ fontSize: 12.5, color: "#64748B" }}>{k}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1E293B" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#64748B", marginBottom: 6 }}>Day progress</div>
                    <div className="earnings-bar">
                      <div className="earnings-fill" style={{ width: "37%" }}></div>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>3 of 8 complete</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── UPCOMING ── */}
          {active === "upcoming" && (
            <div>
              <div className="section-title">Upcoming Schedule</div>
              <div className="section-sub">Next 7 days · Schedule managed by CeenAiX admin</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                {UPCOMING_APPTS.map((day, i) => (
                  <div key={i} className="glass-card">
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ textAlign: "center", background: "rgba(13,115,119,0.1)", borderRadius: 10, padding: "8px 14px" }}>
                        <div style={{ fontSize: 10, color: "#0D7377", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{day.day}</div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#0D7377", lineHeight: 1.1 }}>{day.date.split(" ")[1]}</div>
                        <div style={{ fontSize: 10, color: "#0D7377" }}>Mar</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#1E293B" }}>{day.count} Appointments</div>
                        <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Full day schedule</div>
                      </div>
                    </div>
                    {day.appts.map((a, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, padding: "7px 0", borderTop: "1px solid #F1F5F9", alignItems: "center" }}>
                        <span style={{ fontSize: 11.5, color: "#0D7377", fontWeight: 600, minWidth: 42 }}>{a.split(" ")[0]}</span>
                        <span style={{ fontSize: 12, color: "#334155" }}>{a.split(" ").slice(1).join(" ")}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PATIENTS ── */}
          {active === "patients" && (
            <div>
              <div className="section-title">Patient Records</div>
              <div className="section-sub">All patients under your care on CeenAiX</div>
              <input className="input-dark" placeholder="🔍  Search by name or condition..." value={patientSearch} onChange={e => setPatientSearch(e.target.value)} style={{ marginBottom: 20, maxWidth: 380 }} />
              {selectedPatient ? (
                <div>
                  <button className="btn-ghost" style={{ marginBottom: 16 }} onClick={() => setSelectedPatient(null)}>← Back to patients</button>
                  <div className="glass-card" style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                      <div className="avatar" style={{ width: 56, height: 56, fontSize: 22 }}>{selectedPatient.avatar}</div>
                      <div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: "#1E293B" }}>{selectedPatient.name}</div>
                        <div style={{ fontSize: 12.5, color: "#64748B" }}>Age {selectedPatient.age} · {selectedPatient.condition} · {selectedPatient.insurance}</div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        <button className="btn-outline" onClick={() => navigateToView("prescriptions")}>Write Rx</button>
                        <button className="btn-primary" onClick={() => setConsultOpen(true)}>Start Consultation</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {[["Total Visits", selectedPatient.visits], ["Last Visit", selectedPatient.lastVisit], ["Phone", selectedPatient.phone], ["Insurance", selectedPatient.insurance]].map(([k, v], i) => (
                        <div key={i} style={{ background: "#F8FAFB", borderRadius: 10, padding: "12px 14px", border: "1px solid #E2E8F0" }}>
                          <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{k}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                    {[
                      { title: "Conditions", icon: "🫀", items: ["Type 2 Diabetes", "Hypertension"] },
                      { title: "Allergies", icon: "⚠️", items: ["Penicillin — Severe"] },
                      { title: "Current Medications", icon: "💊", items: ["Metformin 500mg", "Atorvastatin 20mg"] },
                      { title: "Past Visits with You", icon: "📋", items: ["Mar 12 — Cardiac check-up", "Jan 15 — Follow-up", "Nov 5 — Initial consult"] },
                    ].map((s, i) => (
                      <div key={i} className="glass-card">
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>{s.icon} {s.title}</div>
                        {s.items.map((item, j) => (
                          <div key={j} style={{ fontSize: 12.5, color: "#334155", padding: "5px 0", borderBottom: j < s.items.length - 1 ? "1px solid #F1F5F9" : "none" }}>· {item}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {selectedPatient.patient_id && (
                    <FamilyMedicalHistory patientId={selectedPatient.patient_id} />
                  )}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredPatients.map(p => (
                    <div key={p.id} className="glass-card glass-card-hover" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", cursor: "pointer" }} onClick={() => setSelectedPatient(p)}>
                      <div className="avatar" style={{ width: 44, height: 44, fontSize: 17 }}>{p.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>Age {p.age} · {p.condition}</div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#94A3B8" }}>Last visit</div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>{p.lastVisit}</div>
                        </div>
                        <span className="badge badge-teal">{p.visits} visits</span>
                        <span style={{ fontSize: 16, color: "#64748B" }}>→</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PRESCRIPTIONS ── */}
          {active === "prescriptions" && (
            <div>
              <div className="section-title">Prescription Writing</div>
              <div className="section-sub">Write and send digital prescriptions to patients or pharmacies</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Write new */}
                <div className="glass-card" style={{ position: "relative" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 18 }}>Write New Prescription</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Patient", "Select patient..."], ["Medication Name", "e.g. Metformin 500mg"], ["Dosage", "e.g. 500mg"], ["Frequency", "e.g. Twice daily"], ["Duration", "e.g. 3 months"], ["Instructions", "e.g. Take after meals"]].map(([label, placeholder], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5, fontWeight: 600 }}>{label}</div>
                        {label === "Patient" ? (
                          <select className="input-dark">
                            <option>Select patient...</option>
                            {PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}
                          </select>
                        ) : label === "Instructions" ? (
                          <textarea className="input-dark" rows={2} placeholder={placeholder} style={{ resize: "none" }} />
                        ) : (
                          <input className="input-dark" placeholder={placeholder} />
                        )}
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>Send To</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {["Patient", "Pharmacy", "Both"].map(opt => (
                          <button key={opt} className={rxForm.sendTo === opt.toLowerCase() ? "btn-primary" : "btn-ghost"} style={{ flex: 1, fontSize: 12 }} onClick={() => setRxForm(p => ({ ...p, sendTo: opt.toLowerCase() }))}>{opt}</button>
                        ))}
                      </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: 4 }} onClick={submitRx}>Send Prescription</button>
                  </div>
                  {rxSubmitted && (
                    <div className="success-overlay">
                      <div style={{ fontSize: 36, color: "#10B981" }}>✓</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>Prescription Sent!</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>Logged to patient record</div>
                    </div>
                  )}
                </div>

                {/* Recent prescriptions */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 14 }}>Recent Prescriptions</div>
                  {PRESCRIPTIONS_DATA.map((rx, i) => (
                    <div key={i} className="glass-card glass-card-hover" style={{ marginBottom: 10, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{rx.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{rx.drug}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{rx.patient} · {rx.freq}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{rx.date} · Sent to: {rx.sent}</div>
                        </div>
                        <span className="badge badge-green">Sent ✓</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── REFERRALS ── */}
          {active === "referrals" && (
            <div>
              <div className="section-title">Lab Referrals</div>
              <div className="section-sub">Refer patients to CeenAiX-listed labs and track results</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <div className="glass-card" style={{ position: "relative" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B", marginBottom: 18 }}>New Lab Referral</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Patient", true], ["Lab", true], ["Tests Required", false], ["Clinical Notes", false]].map(([label, isSelect], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5, fontWeight: 600 }}>{label}</div>
                        {isSelect ? (
                          <select className="input-dark">
                            {label === "Patient" ? (
                              <>{<option>Select patient...</option>}{PATIENTS.map(p => <option key={p.id}>{p.name}</option>)}</>
                            ) : (
                              <>{<option>Select lab...</option>}<option>LifeLab Dubai</option><option>AlMana Medical Lab</option><option>Mediclinic Lab</option></>
                            )}
                          </select>
                        ) : label === "Clinical Notes" ? (
                          <textarea className="input-dark" rows={3} placeholder="Context for the lab technician..." style={{ resize: "none" }} />
                        ) : (
                          <input className="input-dark" placeholder="e.g. HbA1c, Lipid Panel, CBC..." />
                        )}
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 600 }}>Urgency</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        {["Routine", "Urgent", "STAT"].map(u => (
                          <button key={u} className={refForm.urgency === u ? "btn-primary" : "btn-ghost"} style={{ flex: 1, fontSize: 12 }} onClick={() => setRefForm(p => ({ ...p, urgency: u }))}>{u}</button>
                        ))}
                      </div>
                    </div>
                    <button className="btn-primary" style={{ marginTop: 4 }} onClick={submitRef}>Send Referral</button>
                  </div>
                  {refSubmitted && (
                    <div className="success-overlay">
                      <div style={{ fontSize: 36, color: "#10B981" }}>✓</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#10B981" }}>Referral Sent!</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>Patient and lab notified</div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B", marginBottom: 14 }}>Recent Referrals</div>
                  {REFERRALS_DATA.map((r, i) => (
                    <div key={i} className="glass-card glass-card-hover" style={{ marginBottom: 10, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{r.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{r.test}</div>
                          <div style={{ fontSize: 11.5, color: "#64748B" }}>{r.patient} · {r.lab}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{r.date}</div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "flex-end" }}>
                          <span className={`badge ${r.urgency === "Urgent" ? "badge-red" : "badge-teal"}`}>{r.urgency}</span>
                          <span className={`badge ${r.status === "Result Ready" ? "badge-green" : r.status === "In Progress" ? "badge-amber" : "badge-blue"}`}>{r.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── RADIOLOGY / IMAGING ── */}
          {active === "radiology" && (
            <div>
              <div className="section-title">Imaging & Radiology Orders</div>
              <div className="section-sub">Manage patient imaging requests and review results</div>

              {/* Quick Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Pending Orders", value: "8", icon: "⏳", color: "#F59E0B" },
                  { label: "Awaiting Review", value: "12", icon: "📋", color: "#3B82F6" },
                  { label: "Completed Today", value: "5", icon: "✅", color: "#10B981" },
                  { label: "Urgent", value: "2", icon: "⚡", color: "#EF4444" },
                ].map((stat, i) => (
                  <div key={i} className="card" style={{ padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 28 }}>{stat.icon}</span>
                      <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "#64748B", fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Imaging Modalities Quick Access */}
              <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #0D7377, #14BDBD)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Order Imaging Studies</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>Quick access to common imaging modalities</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, padding: 24 }}>
                  {[
                    { name: "MRI", icon: "🧲", color: "#8B5CF6" },
                    { name: "CT Scan", icon: "💿", color: "#3B82F6" },
                    { name: "X-Ray", icon: "🦴", color: "#06B6D4" },
                    { name: "Ultrasound", icon: "🔊", color: "#10B981" },
                    { name: "PET Scan", icon: "⚛️", color: "#F59E0B" },
                    { name: "Mammography", icon: "🎀", color: "#EC4899" },
                  ].map((modality, i) => (
                    <div
                      key={i}
                      className="card"
                      style={{
                        padding: 16,
                        textAlign: "center",
                        cursor: "pointer",
                        border: "1px solid #E2E8F0",
                        transition: "all 0.2s",
                        background: "white"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFB"; e.currentTarget.style.borderColor = modality.color; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.borderColor = "#E2E8F0"; }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{modality.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{modality.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Imaging Orders */}
              <div className="card" style={{ padding: 0, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #0D7377, #14BDBD)", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Recent Imaging Orders</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 }}>Review and manage patient imaging requests</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr", padding: "12px 24px", background: "#F8FAFB", borderBottom: "1px solid #E2E8F0" }}>
                  {["Patient", "Study Type", "Body Part", "Urgency", "Status", "Action"].map((h, i) => (
                    <div key={i} style={{ fontSize: 11.5, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
                  ))}
                </div>
                {[
                  { patient: "Fatima Al Rashid", study: "MRI Brain", part: "Head", urgency: "Routine", status: "Completed", date: "Today" },
                  { patient: "Mohammed Al Zaabi", study: "CT Chest", part: "Thorax", urgency: "Urgent", status: "In Progress", date: "Today" },
                  { patient: "Parnia Yazdkhasti", study: "Echocardiogram", part: "Heart", urgency: "Routine", status: "Scheduled", date: "Mar 16" },
                  { patient: "Aisha Noor", study: "X-Ray Chest", part: "Thorax", urgency: "Stat", status: "Pending", date: "Today" },
                  { patient: "Rajan Pillai", study: "Ultrasound Abdomen", part: "Abdomen", urgency: "Routine", status: "Completed", date: "Yesterday" },
                ].map((order, i) => (
                  <div
                    key={i}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr",
                      padding: "16px 24px",
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      background: "white"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFB"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1E293B" }}>{order.patient}</div>
                      <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>{order.date}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "#334155" }}>{order.study}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{order.part}</div>
                    <span className={`badge ${order.urgency === "Stat" ? "badge-red" : order.urgency === "Urgent" ? "badge-amber" : "badge-teal"}`}>{order.urgency}</span>
                    <span className={`badge ${order.status === "Completed" ? "badge-green" : order.status === "In Progress" ? "badge-blue" : order.status === "Scheduled" ? "badge-teal" : "badge-amber"}`}>{order.status}</span>
                    <button
                      style={{
                        background: "linear-gradient(135deg, #0D7377, #14BDBD)",
                        color: "white",
                        border: "none",
                        padding: "6px 14px",
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                    >
                      {order.status === "Completed" ? "View" : "Manage"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {active === "messages" && (
            <div>
              <div className="section-title">Messages</div>
              <div className="section-sub">Secure patient communications and teleconsultation</div>
              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, height: 540, borderRadius: 16, overflow: "hidden", border: "1px solid #E2E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                {/* Thread list */}
                <div style={{ background: "#F8FAFB", borderRight: "1px solid #E2E8F0", overflowY: "auto" }}>
                  {MESSAGES.map((m, i) => (
                    <div key={i} onClick={() => setActiveMsg(i)} style={{ display: "flex", gap: 12, padding: "16px", cursor: "pointer", background: activeMsg === i ? "white" : "transparent", borderBottom: "1px solid #E2E8F0", borderLeft: activeMsg === i ? "3px solid #0D7377" : "3px solid transparent", transition: "all 0.15s" }}>
                      <div className="avatar" style={{ width: 38, height: 38, fontSize: 14, flexShrink: 0 }}>{m.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1E293B" }}>{m.patient}</div>
                          <div style={{ fontSize: 10.5, color: "#94A3B8" }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.last}</div>
                      </div>
                      {m.unread > 0 && <span style={{ background: "#EF4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "2px 6px", alignSelf: "flex-start", flexShrink: 0 }}>{m.unread}</span>}
                    </div>
                  ))}
                </div>

                {/* Chat area */}
                <div style={{ background: "white", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{MESSAGES[activeMsg].avatar}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>{MESSAGES[activeMsg].patient}</div>
                      <div style={{ fontSize: 11, color: "#10B981" }}>● Online</div>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                      <button className="btn-ghost" style={{ fontSize: 12 }}>📹 Video Call</button>
                      <button className="btn-ghost" style={{ fontSize: 12 }}>💊 Write Rx</button>
                    </div>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {(msgThreads[activeMsg] || []).map((msg, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: msg.from === "doctor" ? "flex-end" : "flex-start" }}>
                        <div className={`msg-bubble ${msg.from === "doctor" ? "msg-doctor" : "msg-patient"}`}>{msg.text}</div>
                      </div>
                    ))}
                    {(msgThreads[activeMsg] || []).length === 0 && (
                      <div style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, marginTop: 40 }}>No messages yet. Start the conversation.</div>
                    )}
                  </div>
                  <div style={{ padding: "14px 20px", borderTop: "1px solid #E2E8F0", display: "flex", gap: 10 }}>
                    <input className="input-dark" placeholder="Type a message..." value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} style={{ flex: 1 }} />
                    <button className="btn-primary" onClick={sendMsg}>Send</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── EARNINGS ── */}
          {active === "earnings" && (
            <div>
              <div className="section-title">Earnings & Payments</div>
              <div className="section-sub">Your financial overview on CeenAiX</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Earned", value: "AED 28,400", sub: "March 2026", color: "#14BDBD", pct: 72 },
                  { label: "Pending", value: "AED 4,200", sub: "Awaiting clearance", color: "#FCD34D", pct: 18 },
                  { label: "Paid Out", value: "AED 24,200", sub: "To bank account", color: "#34D399", pct: 62 },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12.5, color: "#64748B", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{s.sub}</div>
                    <div className="earnings-bar" style={{ marginTop: 14 }}>
                      <div className="earnings-fill" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card">
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B", marginBottom: 16 }}>Payment Breakdown by Source</div>
                {[
                  { source: "Credit / Debit Card", amount: "AED 12,800", count: "32 consultations", color: "#0D7377", pct: 45 },
                  { source: "Insurance Direct Billing", amount: "AED 11,200", count: "28 claims", color: "#6366F1", pct: 39 },
                  { source: "In-App Wallet", amount: "AED 4,400", count: "11 consultations", color: "#10B981", pct: 16 },
                ].map((row, i) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>{row.source}</div>
                        <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{row.count}</div>
                      </div>
                      <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: row.color }}>{row.amount}</div>
                    </div>
                    <div className="earnings-bar">
                      <div className="earnings-fill" style={{ width: `${row.pct}%`, background: `linear-gradient(90deg, ${row.color}66, ${row.color})` }}></div>
                    </div>
                  </div>
                ))}
                <button className="btn-outline" style={{ marginTop: 18, fontSize: 12.5 }}>⬇ Export Report (PDF / CSV)</button>
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {active === "profile" && (
            <div>
              <div className="section-title">My Profile</div>
              <div className="section-sub">Manage your professional information and credentials</div>

              <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                {/* Left Sidebar */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div className="glass-card" style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <div className="avatar" style={{ width: 80, height: 80, fontSize: 30, margin: "0 auto 16px" }}>L</div>
                      <button
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: -4,
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #0D7377, #14BDBD)",
                          color: "white",
                          border: "2px solid white",
                          fontSize: 14,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        📷
                      </button>
                    </div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: "#1E293B" }}>{profileForm.full_name}</div>
                    <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 4 }}>{profileForm.specialty}</div>
                    <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
                      <span className="badge badge-green">✓ DHA Verified</span>
                      <span className="badge badge-teal">Active</span>
                    </div>
                  </div>

                  <div className="glass-card">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>Quick Actions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button
                        onClick={() => setShowDHAVerification(true)}
                        className="btn-primary"
                        style={{ width: "100%", fontSize: 12, padding: "10px" }}
                      >
                        🏥 DHA Verification Request
                      </button>
                      <button
                        onClick={() => setShowDocumentUpload(true)}
                        className="btn-outline"
                        style={{ width: "100%", fontSize: 12, padding: "10px" }}
                      >
                        📄 Manage Documents
                      </button>
                    </div>
                  </div>

                  <div className="glass-card">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B", marginBottom: 12 }}>Statistics</div>
                    {[["Experience", profileForm.years_experience + " years"], ["Languages", profileForm.languages], ["Consultations", "1,240+"], ["Rating", "4.9 / 5.0"]].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12, borderBottom: i < 3 ? "1px solid #F1F5F9" : "none" }}>
                        <span style={{ color: "#64748B" }}>{k}</span>
                        <span style={{ fontWeight: 700, color: "#1E293B" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Professional Info */}
                  <div className="glass-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>Professional Information</div>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: 11.5 }}
                        onClick={() => setEditMode(editMode === "professional" ? null : "professional")}
                      >
                        {editMode === "professional" ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {editMode === "professional" ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                          { label: "Full Name", key: "full_name", type: "text" },
                          { label: "Specialty", key: "specialty", type: "text" },
                          { label: "Sub-specialty", key: "sub_specialty", type: "text" },
                          { label: "Medical School", key: "medical_school", type: "text" },
                          { label: "Graduation Year", key: "graduation_year", type: "number" },
                          { label: "DHA License", key: "dha_license", type: "text" },
                          { label: "Years Experience", key: "years_experience", type: "number" },
                          { label: "Languages", key: "languages", type: "text" }
                        ].map((field, i) => (
                          <div key={i}>
                            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{field.label}</div>
                            <input
                              type={field.type}
                              value={profileForm[field.key]}
                              onChange={(e) => setProfileForm({...profileForm, [field.key]: e.target.value})}
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                fontSize: 13,
                                border: "1px solid #E2E8F0",
                                borderRadius: 8,
                                background: "white"
                              }}
                            />
                          </div>
                        ))}
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, marginTop: 8 }}>
                          <button className="btn-primary" style={{ flex: 1 }} onClick={() => setEditMode(null)}>Save Changes</button>
                          <button className="btn-outline" onClick={() => setEditMode(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                          ["Full Name", profileForm.full_name],
                          ["Specialty", profileForm.specialty],
                          ["Sub-specialty", profileForm.sub_specialty],
                          ["Medical School", profileForm.medical_school],
                          ["Graduation Year", profileForm.graduation_year],
                          ["DHA License", "●●●●●●●● (Verified ✓)"],
                          ["Years Experience", profileForm.years_experience + " years"],
                          ["Languages", profileForm.languages]
                        ].map(([k, v], j) => (
                          <div key={j}>
                            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Consultation Fees */}
                  <div className="glass-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>Consultation Fees</div>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: 11.5 }}
                        onClick={() => setEditMode(editMode === "fees" ? null : "fees")}
                      >
                        {editMode === "fees" ? "Cancel" : "Edit"}
                      </button>
                    </div>

                    {editMode === "fees" ? (
                      <div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                          {[
                            { label: "In-Clinic Fee (AED)", key: "clinic_fee", type: "number" },
                            { label: "Teleconsultation Fee (AED)", key: "tele_fee", type: "number" },
                          ].map((field, i) => (
                            <div key={i}>
                              <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{field.label}</div>
                              <input
                                type={field.type}
                                value={profileForm[field.key]}
                                onChange={(e) => setProfileForm({...profileForm, [field.key]: e.target.value})}
                                style={{
                                  width: "100%",
                                  padding: "8px 12px",
                                  fontSize: 13,
                                  border: "1px solid #E2E8F0",
                                  borderRadius: 8,
                                  background: "white"
                                }}
                              />
                            </div>
                          ))}
                          <div style={{ gridColumn: "1 / -1" }}>
                            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>Insurance Accepted</div>
                            <input
                              type="text"
                              value={profileForm.insurance}
                              onChange={(e) => setProfileForm({...profileForm, insurance: e.target.value})}
                              placeholder="e.g., Daman, AXA, Thiqa"
                              style={{
                                width: "100%",
                                padding: "8px 12px",
                                fontSize: 13,
                                border: "1px solid #E2E8F0",
                                borderRadius: 8,
                                background: "white"
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button className="btn-primary" style={{ flex: 1 }} onClick={() => setEditMode(null)}>Save Changes</button>
                          <button className="btn-outline" onClick={() => setEditMode(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[
                          ["In-Clinic Fee", "AED " + profileForm.clinic_fee],
                          ["Teleconsultation Fee", "AED " + profileForm.tele_fee],
                          ["Insurance Accepted", profileForm.insurance]
                        ].map(([k, v], j) => (
                          <div key={j} style={{ gridColumn: j === 2 ? "1 / -1" : "auto" }}>
                            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="glass-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1E293B" }}>Professional Bio</div>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: 11.5 }}
                        onClick={() => setEditMode(editMode === "bio" ? null : "bio")}
                      >
                        {editMode === "bio" ? "Cancel" : "Edit Bio"}
                      </button>
                    </div>

                    {editMode === "bio" ? (
                      <div>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                          rows={5}
                          style={{
                            width: "100%",
                            padding: "12px",
                            fontSize: 13,
                            border: "1px solid #E2E8F0",
                            borderRadius: 8,
                            background: "white",
                            lineHeight: 1.7,
                            resize: "vertical"
                          }}
                        />
                        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                          <button className="btn-primary" style={{ flex: 1 }} onClick={() => setEditMode(null)}>Save Bio</button>
                          <button className="btn-outline" onClick={() => setEditMode(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{profileForm.bio}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Appointments Modal */}
      {showAppointmentsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAppointmentsModal(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 900, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>Today's Appointments</h3>
              <button onClick={() => setShowAppointmentsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TODAY_APPTS.map(a => (
                <div key={a.id} className={`appt-row ${a.status === "active" ? "active-appt" : ""}`} style={{ background: "#F8FAFB", padding: "16px 20px", borderRadius: 12, cursor: "pointer", border: "1px solid #E2E8F0" }} onClick={() => { if (a.status === "active") { setConsultOpen(true); setShowAppointmentsModal(false); } }}>
                  <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: a.status === "active" ? "#0D7377" : "#64748B" }}>{a.time}</div>
                  </div>
                  <div style={{ width: 1, background: a.status === "active" ? "#0D7377" : "#E2E8F0", alignSelf: "stretch" }}></div>
                  <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{a.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{a.patient}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{a.condition}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Age: {a.age}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {a.status === "active" && <span className="badge badge-active">● Active Now</span>}
                    {a.status === "completed" && <span className="badge badge-green">✓ Completed</span>}
                    {a.status === "upcoming" && (
                      <>
                        <span className={`badge ${a.type === "Teleconsultation" ? "badge-blue" : "badge-teal"}`}>{a.type === "Teleconsultation" ? "📹 Teleconsult" : "🏥 In-Clinic"}</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patients Modal */}
      {showPatientsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPatientsModal(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 900, maxHeight: "80vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>All Patients</h3>
              <button onClick={() => setShowPatientsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PATIENTS.map(p => (
                <div key={p.id} className="glass-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "#F8FAFB", cursor: "pointer", border: "1px solid #E2E8F0" }} onClick={() => { setSelectedPatient(p); setShowPatientsModal(false); }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{p.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{p.condition}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Age: {p.age} • {p.insurance}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>Last visit</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0D7377", marginTop: 2 }}>{p.lastVisit}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{p.visits} total visits</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DHA Verification Request Modal */}
      {showDHAVerification && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowDHAVerification(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 700, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>DHA Verification Request</h3>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Submit your credentials for DHA verification</p>
              </div>
              <button onClick={() => setShowDHAVerification(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Request Type</label>
                  <select
                    value={dhaVerificationForm.request_type}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, request_type: e.target.value})}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  >
                    <option value="initial">Initial Application</option>
                    <option value="renewal">License Renewal</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Current License Number (if any)</label>
                  <input
                    type="text"
                    value={dhaVerificationForm.license_number}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, license_number: e.target.value})}
                    placeholder="DHA-XXXXXXXX"
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Specialization *</label>
                  <input
                    type="text"
                    value={dhaVerificationForm.specialization}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, specialization: e.target.value})}
                    placeholder="e.g., Cardiology"
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Sub-Specialization</label>
                  <input
                    type="text"
                    value={dhaVerificationForm.sub_specialization}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, sub_specialization: e.target.value})}
                    placeholder="e.g., Interventional Cardiology"
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Years of Experience *</label>
                  <input
                    type="number"
                    value={dhaVerificationForm.years_of_experience}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, years_of_experience: parseInt(e.target.value)})}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Graduation Year *</label>
                  <input
                    type="number"
                    value={dhaVerificationForm.graduation_year}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, graduation_year: parseInt(e.target.value)})}
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Medical School *</label>
                  <input
                    type="text"
                    value={dhaVerificationForm.medical_school}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, medical_school: e.target.value})}
                    placeholder="e.g., UAE University, College of Medicine"
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8 }}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: 11.5, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Additional Notes</label>
                  <textarea
                    value={dhaVerificationForm.additional_notes}
                    onChange={(e) => setDhaVerificationForm({...dhaVerificationForm, additional_notes: e.target.value})}
                    rows={3}
                    placeholder="Any additional information you'd like to provide..."
                    style={{ width: "100%", padding: "10px 12px", fontSize: 13, border: "1px solid #E2E8F0", borderRadius: 8, resize: "vertical" }}
                  />
                </div>
              </div>

              <div style={{ background: "#F8FAFB", padding: 16, borderRadius: 10, border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#1E293B", marginBottom: 8 }}>📋 Required Documents:</div>
                <ul style={{ fontSize: 12, color: "#64748B", paddingLeft: 20, margin: 0 }}>
                  <li>Medical Degree Certificate</li>
                  <li>Specialization Certificate</li>
                  <li>Current Medical License (if applicable)</li>
                  <li>Passport Copy</li>
                  <li>CV / Resume</li>
                </ul>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 8 }}>
                  Please upload these documents in the Document Management section before submitting your request.
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    alert("DHA Verification request submitted successfully! We'll review your application within 5-7 business days.");
                    setShowDHAVerification(false);
                  }}
                >
                  Submit Verification Request
                </button>
                <button className="btn-outline" onClick={() => setShowDHAVerification(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Upload Modal */}
      {showDocumentUpload && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowDocumentUpload(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 800, maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>Document Management</h3>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Upload and manage your professional credentials</p>
              </div>
              <button onClick={() => setShowDocumentUpload(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ border: "2px dashed #E2E8F0", borderRadius: 12, padding: 32, textAlign: "center", background: "#F8FAFB", cursor: "pointer" }} onClick={() => document.getElementById('doc-upload').click()}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 6 }}>Upload New Document</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Click to browse or drag and drop your files here</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>Supported formats: PDF, JPG, PNG (max 10MB)</div>
                <input
                  id="doc-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      setUploadingDoc(true);
                      setTimeout(() => {
                        const newDoc = {
                          id: documents.length + 1,
                          type: "New Document",
                          status: "pending",
                          uploaded: new Date().toISOString().split('T')[0],
                          name: e.target.files[0].name
                        };
                        setDocuments([...documents, newDoc]);
                        setUploadingDoc(false);
                        alert("Document uploaded successfully!");
                      }, 1500);
                    }
                  }}
                />
              </div>

              <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {["Medical License", "DHA Certificate", "Degree", "Specialization Cert", "Passport", "CV"].map((docType, i) => (
                  <button
                    key={i}
                    className="btn-ghost"
                    style={{ fontSize: 11, padding: "8px 12px" }}
                    onClick={() => document.getElementById('doc-upload').click()}
                  >
                    + {docType}
                  </button>
                ))}
              </div>
            </div>

            {uploadingDoc && (
              <div style={{ background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 20 }}>⏳</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#0369A1" }}>Uploading document...</div>
                  <div style={{ width: "100%", height: 4, background: "#BAE6FD", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: "60%", height: "100%", background: "#0284C7", animation: "pulse 1.5s ease-in-out infinite" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {documents.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: "#F8FAFB",
                    border: "1px solid #E2E8F0",
                    borderRadius: 10
                  }}
                >
                  <div style={{ fontSize: 24 }}>
                    {doc.status === "approved" ? "✅" : doc.status === "pending" ? "⏳" : "❌"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1E293B" }}>{doc.type}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{doc.name}</div>
                    <div style={{ fontSize: 10.5, color: "#94A3B8", marginTop: 2 }}>Uploaded: {doc.uploaded}</div>
                  </div>
                  <span className={`badge ${doc.status === "approved" ? "badge-green" : doc.status === "pending" ? "badge-amber" : "badge-red"}`}>
                    {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn-ghost" style={{ fontSize: 11, padding: "6px 10px" }}>View</button>
                    <button className="btn-ghost" style={{ fontSize: 11, padding: "6px 10px", color: "#EF4444" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>

            {documents.length === 0 && !uploadingDoc && (
              <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                <div style={{ fontSize: 14 }}>No documents uploaded yet</div>
              </div>
            )}
          </div>
        </div>
      )}

      <EmergencyButton />
    </div>
  );
}
