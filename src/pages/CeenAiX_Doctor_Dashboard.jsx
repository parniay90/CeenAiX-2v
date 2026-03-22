import { useState } from "react";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { EmergencyButton } from "../components/EmergencyButton";
import FamilyMedicalHistory from "../components/FamilyMedicalHistory";

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
  const [active, setActive] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [consultOpen, setConsultOpen] = useState(false);
  const [consultNotes, setConsultNotes] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
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
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif", background: "#0F1923", minHeight: "100vh", display: "flex", color: "#E2E8F0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #0D7377; border-radius: 4px; }
        .nav-item { transition: all 0.18s ease; cursor: pointer; border-radius: 10px; display: flex; align-items: center; gap: 11px; padding: 10px 12px; color: #64748B; }
        .nav-item:hover { background: rgba(13,115,119,0.15); color: #94A3B8; }
        .nav-item.active { background: rgba(13,115,119,0.25); color: #14BDBD; border-left: 2px solid #14BDBD; }
        .glass-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; backdrop-filter: blur(10px); }
        .glass-card-hover { transition: all 0.2s; }
        .glass-card-hover:hover { background: rgba(255,255,255,0.06); border-color: rgba(13,115,119,0.3); }
        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px 22px; }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
        .badge-teal { background: rgba(13,115,119,0.2); color: #14BDBD; }
        .badge-green { background: rgba(26,158,92,0.15); color: #34D399; }
        .badge-amber { background: rgba(245,158,11,0.15); color: #FCD34D; }
        .badge-red { background: rgba(239,68,68,0.15); color: #F87171; }
        .badge-blue { background: rgba(99,102,241,0.15); color: #818CF8; }
        .badge-active { background: rgba(13,115,119,0.3); color: #5EEAD4; border: 1px solid rgba(13,115,119,0.5); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .btn-primary { background: linear-gradient(135deg, #0D7377, #14BDBD); color: white; border: none; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(13,115,119,0.4); }
        .btn-outline { background: transparent; color: #14BDBD; border: 1px solid rgba(13,115,119,0.4); padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-outline:hover { background: rgba(13,115,119,0.15); }
        .btn-ghost { background: rgba(255,255,255,0.06); color: #94A3B8; border: 1px solid rgba(255,255,255,0.08); padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #E2E8F0; }
        .appt-row { display: flex; align-items: center; gap: 14px; padding: 14px 16px; border-radius: 12px; transition: all 0.18s; cursor: pointer; border: 1px solid transparent; }
        .appt-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(13,115,119,0.2); }
        .appt-row.active-appt { background: rgba(13,115,119,0.12); border-color: rgba(13,115,119,0.4); }
        .avatar { border-radius: 50%; background: linear-gradient(135deg, #0D7377, #14BDBD); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
        .input-dark { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 13.5px; color: #E2E8F0; font-family: inherit; width: 100%; outline: none; transition: border-color 0.18s; }
        .input-dark:focus { border-color: #0D7377; background: rgba(13,115,119,0.08); }
        .input-dark::placeholder { color: #475569; }
        select.input-dark option { background: #1E2D3D; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 800; color: #E2E8F0; margin-bottom: 4px; }
        .section-sub { font-size: 13px; color: #475569; margin-bottom: 24px; }
        .timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .tab-btn { padding: 7px 16px; border-radius: 8px; border: none; font-size: 12.5px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .tab-active { background: rgba(13,115,119,0.25); color: #14BDBD; }
        .tab-inactive { background: transparent; color: #475569; }
        .tab-inactive:hover { color: #94A3B8; }
        .msg-bubble { max-width: 78%; padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.55; }
        .msg-doctor { background: rgba(13,115,119,0.25); color: #E2E8F0; border-radius: 14px 4px 14px 14px; margin-left: auto; }
        .msg-patient { background: rgba(255,255,255,0.06); color: #CBD5E1; border-radius: 4px 14px 14px 14px; }
        .earnings-bar { height: 6px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden; margin-top: 8px; }
        .earnings-fill { height: 100%; background: linear-gradient(90deg, #0D7377, #14BDBD); border-radius: 4px; }
        .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .modal { background: #1A2633; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 32px; width: 680px; max-height: 85vh; overflow-y: auto; }
        .modal-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 800; color: #E2E8F0; margin-bottom: 20px; }
        .success-overlay { position: absolute; inset: 0; background: rgba(13,115,119,0.15); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; backdrop-filter: blur(4px); }
      `}</style>

      {/* CONSULTATION MODAL */}
      {consultOpen && (
        <div className="overlay" onClick={() => setConsultOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div className="modal-title">Consultation Workspace</div>
                <div style={{ fontSize: 13, color: "#475569" }}>Active session — {CONSULTATION_PATIENT.name}</div>
              </div>
              <span className="badge badge-active">● Live</span>
            </div>

            {/* Patient summary strip */}
            <div style={{ background: "rgba(13,115,119,0.1)", border: "1px solid rgba(13,115,119,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
              {[
                ["Patient", CONSULTATION_PATIENT.name],
                ["Age / Blood", `${CONSULTATION_PATIENT.age} yrs · ${CONSULTATION_PATIENT.blood}`],
                ["Conditions", CONSULTATION_PATIENT.conditions.join(", ")],
                ["Allergies", CONSULTATION_PATIENT.allergies.join(", ")],
              ].map(([k, v], i) => (
                <div key={i}>
                  <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#E2E8F0" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Current meds */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Current Medications</div>
              <div style={{ display: "flex", gap: 8 }}>
                {CONSULTATION_PATIENT.meds.map((m, i) => <span key={i} className="badge badge-blue">{m}</span>)}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11.5, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Consultation Notes & Diagnosis</div>
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
              <button className="btn-outline" onClick={() => { setConsultOpen(false); setActive("prescriptions"); }}>💊 Write Prescription</button>
              <button className="btn-outline" onClick={() => { setConsultOpen(false); setActive("referrals"); }}>🔬 Order Lab Test</button>
              <button className="btn-primary" style={{ marginLeft: "auto" }} onClick={() => setConsultOpen(false)}>✓ Mark Complete</button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 230 : 68,
        background: "#0A1520",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex", flexDirection: "column",
        padding: "20px 10px",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto"
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
          <div style={{ fontSize: 10, color: "#2D4A5A", textTransform: "uppercase", letterSpacing: "1px", padding: "0 12px", marginBottom: 8 }}>Doctor Portal</div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          {NAV.map(item => (
            <div key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
              {item.id === "messages" && sidebarOpen && <span style={{ marginLeft: "auto", background: "#EF4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 6px" }}>3</span>}
            </div>
          ))}
        </div>

        {sidebarOpen && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14, display: "flex", alignItems: "center", gap: 10, padding: "14px 8px 0" }}>
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 12 }}>L</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#E2E8F0" }}>Dr. Layla Al Mansoori</div>
              <div style={{ fontSize: 10.5, color: "#2D4A5A" }}>Cardiologist · DHA ✓</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}>

        {/* TOPBAR */}
        <div style={{ background: "#0A1520", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {onNavigateHome && (
              <button
                onClick={onNavigateHome}
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
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#475569" }}>☰</button>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, width: 260 }}>
              <span style={{ color: "#475569", fontSize: 13 }}>🔍</span>
              <span style={{ fontSize: 13, color: "#2D4A5A" }}>Search patients, records...</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ fontSize: 12, color: "#475569" }}>Thu, 12 Mar 2026</div>
            <NotificationDropdown />
            <div className="avatar" style={{ width: 34, height: 34, fontSize: 13, cursor: "pointer" }}>L</div>
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>

          {/* ── DASHBOARD HOME ── */}
          {active === "home" && (
            <div>
              {/* Welcome banner */}
              <div style={{ background: "linear-gradient(135deg, #0D2B2D 0%, #0D3D40 50%, #0A2A3A 100%)", border: "1px solid rgba(13,115,119,0.3)", borderRadius: 20, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,189,189,0.1) 0%, transparent 70%)" }}></div>
                <div style={{ position: "absolute", right: 32, top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
                  <div style={{ fontSize: 40, fontFamily: "Playfair Display, serif", fontWeight: 800, color: "rgba(20,189,189,0.15)", lineHeight: 1 }}>8</div>
                  <div style={{ fontSize: 11, color: "#0D7377", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Appointments today</div>
                </div>
                <div style={{ fontSize: 12, color: "#0D7377", fontWeight: 600, letterSpacing: "0.5px", marginBottom: 6, textTransform: "uppercase" }}>Good morning</div>
                <div style={{ fontFamily: "Playfair Display, serif", fontSize: 26, fontWeight: 800, color: "#E2E8F0", marginBottom: 6 }}>Dr. Layla Al Mansoori</div>
                <div style={{ fontSize: 13.5, color: "#64748B", marginBottom: 18 }}>Next: <span style={{ color: "#14BDBD", fontWeight: 600 }}>Parnia Yazdkhasti</span> at 11:00 AM — Cardiac check-up</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-primary" onClick={() => setActive("today")}>View Today's Schedule</button>
                  <button className="btn-outline" onClick={() => { setConsultOpen(true); }}>Start Consultation</button>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Today's Appointments", value: "8", sub: "3 remaining", color: "#14BDBD", icon: "📋", onClick: () => setActive("today") },
                  { label: "Pending Messages", value: "3", sub: "2 urgent", color: "#F87171", icon: "💬", onClick: () => setActive("messages") },
                  { label: "Lab Results In", value: "2", sub: "New today", color: "#34D399", icon: "🔬", onClick: () => setActive("referrals") },
                  { label: "Earnings This Month", value: "AED 28,400", sub: "+12% vs last month", color: "#FCD34D", icon: "💰", onClick: () => setActive("earnings") },
                ].map((s, i) => (
                  <div key={i} className="stat-card" onClick={s.onClick} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
                    <div style={{ fontFamily: "Playfair Display, serif", fontSize: i === 3 ? 20 : 30, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 11.5, color: "#334155", marginTop: 2, fontWeight: 600 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#1E3448", marginTop: 3 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              {/* Today's schedule + Patient activity */}
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
                <div className="glass-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>Today's Schedule</div>
                    <button className="btn-ghost" onClick={() => setShowAppointmentsModal(true)}>View All</button>
                  </div>
                  {TODAY_APPTS.slice(0, 5).map(a => (
                    <div key={a.id} className={`appt-row ${a.status === "active" ? "active-appt" : ""}`} onClick={() => { if (a.status === "active") setConsultOpen(true); }}>
                      <div style={{ width: 48, textAlign: "center", flexShrink: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: a.status === "active" ? "#14BDBD" : "#475569" }}>{a.time}</div>
                      </div>
                      <div style={{ width: 1, background: a.status === "active" ? "rgba(20,189,189,0.4)" : "rgba(255,255,255,0.06)", alignSelf: "stretch" }}></div>
                      <div className="avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{a.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{a.patient}</div>
                        <div style={{ fontSize: 11.5, color: "#475569" }}>{a.condition}</div>
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 18 }}>Recent Patient Activity</div>
                  {[
                    { icon: "🔬", text: "Fatima Al Rashid's HbA1c result is ready", time: "5 min ago", color: "#34D399" },
                    { icon: "💬", text: "Aisha Noor sent an urgent message", time: "22 min ago", color: "#F87171" },
                    { icon: "💊", text: "Prescription sent to Rajan Pillai", time: "1 hr ago", color: "#14BDBD" },
                    { icon: "✓", text: "Mohammed Al Zaabi consultation complete", time: "2 hrs ago", color: "#34D399" },
                    { icon: "📅", text: "New appointment booked by Sara Al Hashimi", time: "3 hrs ago", color: "#FCD34D" },
                  ].map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "flex-start" }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "#2D4A5A", marginTop: 3 }}>{n.time}</div>
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
                    <div key={a.id} className={`glass-card glass-card-hover ${a.status === "active" ? "" : ""}`} style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, borderLeft: a.status === "active" ? "3px solid #14BDBD" : a.status === "completed" ? "3px solid rgba(52,211,153,0.3)" : "3px solid transparent", cursor: "pointer" }} onClick={() => { if (a.status === "active" || a.status === "upcoming") setConsultOpen(true); }}>
                      <div style={{ textAlign: "center", minWidth: 52 }}>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: a.status === "active" ? "#14BDBD" : a.status === "completed" ? "#334155" : "#64748B" }}>{a.time}</div>
                        <div style={{ fontSize: 10, color: "#2D4A5A" }}>AM</div>
                      </div>
                      <div style={{ width: 1, height: 44, background: "rgba(255,255,255,0.06)" }}></div>
                      <div className="avatar" style={{ width: 42, height: 42, fontSize: 16 }}>{a.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: a.status === "completed" ? "#475569" : "#E2E8F0" }}>{a.patient}</div>
                        <div style={{ fontSize: 12, color: "#334155", marginTop: 2 }}>{a.condition}</div>
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 16 }}>Day Summary</div>
                  {[
                    ["Total", "8 appointments"],
                    ["Completed", "2"],
                    ["In Progress", "1"],
                    ["Remaining", "5"],
                    ["In-Clinic", "5"],
                    ["Teleconsultation", "2"],
                  ].map(([k, v], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 5 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ fontSize: 12.5, color: "#475569" }}>{k}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#E2E8F0" }}>{v}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "#2D4A5A", marginBottom: 6 }}>Day progress</div>
                    <div className="earnings-bar">
                      <div className="earnings-fill" style={{ width: "37%" }}></div>
                    </div>
                    <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>3 of 8 complete</div>
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
                      <div style={{ textAlign: "center", background: "rgba(13,115,119,0.15)", borderRadius: 10, padding: "8px 14px" }}>
                        <div style={{ fontSize: 10, color: "#0D7377", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{day.day}</div>
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 22, fontWeight: 800, color: "#14BDBD", lineHeight: 1.1 }}>{day.date.split(" ")[1]}</div>
                        <div style={{ fontSize: 10, color: "#0D7377" }}>Mar</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#E2E8F0" }}>{day.count} Appointments</div>
                        <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>Full day schedule</div>
                      </div>
                    </div>
                    {day.appts.map((a, j) => (
                      <div key={j} style={{ display: "flex", gap: 10, padding: "7px 0", borderTop: "1px solid rgba(255,255,255,0.04)", alignItems: "center" }}>
                        <span style={{ fontSize: 11.5, color: "#0D7377", fontWeight: 600, minWidth: 42 }}>{a.split(" ")[0]}</span>
                        <span style={{ fontSize: 12, color: "#64748B" }}>{a.split(" ").slice(1).join(" ")}</span>
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
                        <div style={{ fontFamily: "Playfair Display, serif", fontSize: 20, fontWeight: 800, color: "#E2E8F0" }}>{selectedPatient.name}</div>
                        <div style={{ fontSize: 12.5, color: "#475569" }}>Age {selectedPatient.age} · {selectedPatient.condition} · {selectedPatient.insurance}</div>
                      </div>
                      <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                        <button className="btn-outline" onClick={() => setActive("prescriptions")}>Write Rx</button>
                        <button className="btn-primary" onClick={() => setConsultOpen(true)}>Start Consultation</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {[["Total Visits", selectedPatient.visits], ["Last Visit", selectedPatient.lastVisit], ["Phone", selectedPatient.phone], ["Insurance", selectedPatient.insurance]].map(([k, v], i) => (
                        <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ fontSize: 10.5, color: "#2D4A5A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{k}</div>
                          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0" }}>{v}</div>
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
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>{s.icon} {s.title}</div>
                        {s.items.map((item, j) => (
                          <div key={j} style={{ fontSize: 12.5, color: "#64748B", padding: "5px 0", borderBottom: j < s.items.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>· {item}</div>
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
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0" }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#475569" }}>Age {p.age} · {p.condition}</div>
                      </div>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 11, color: "#2D4A5A" }}>Last visit</div>
                          <div style={{ fontSize: 12.5, fontWeight: 600, color: "#64748B" }}>{p.lastVisit}</div>
                        </div>
                        <span className="badge badge-teal">{p.visits} visits</span>
                        <span style={{ fontSize: 16, color: "#334155" }}>→</span>
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 18 }}>Write New Prescription</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Patient", "Select patient..."], ["Medication Name", "e.g. Metformin 500mg"], ["Dosage", "e.g. 500mg"], ["Frequency", "e.g. Twice daily"], ["Duration", "e.g. 3 months"], ["Instructions", "e.g. Take after meals"]].map(([label, placeholder], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{label}</div>
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
                      <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Send To</div>
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
                      <div style={{ fontSize: 36 }}>✓</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>Prescription Sent!</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>Logged to patient record</div>
                    </div>
                  )}
                </div>

                {/* Recent prescriptions */}
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 14 }}>Recent Prescriptions</div>
                  {PRESCRIPTIONS_DATA.map((rx, i) => (
                    <div key={i} className="glass-card glass-card-hover" style={{ marginBottom: 10, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{rx.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{rx.drug}</div>
                          <div style={{ fontSize: 11.5, color: "#475569" }}>{rx.patient} · {rx.freq}</div>
                          <div style={{ fontSize: 11, color: "#2D4A5A", marginTop: 2 }}>{rx.date} · Sent to: {rx.sent}</div>
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
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#E2E8F0", marginBottom: 18 }}>New Lab Referral</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[["Patient", true], ["Lab", true], ["Tests Required", false], ["Clinical Notes", false]].map(([label, isSelect], i) => (
                      <div key={i}>
                        <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 5 }}>{label}</div>
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
                      <div style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Urgency</div>
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
                      <div style={{ fontSize: 36 }}>✓</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#34D399" }}>Referral Sent!</div>
                      <div style={{ fontSize: 12, color: "#475569" }}>Patient and lab notified</div>
                    </div>
                  )}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 14 }}>Recent Referrals</div>
                  {REFERRALS_DATA.map((r, i) => (
                    <div key={i} className="glass-card glass-card-hover" style={{ marginBottom: 10, padding: "14px 18px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                        <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{r.avatar}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{r.test}</div>
                          <div style={{ fontSize: 11.5, color: "#475569" }}>{r.patient} · {r.lab}</div>
                          <div style={{ fontSize: 11, color: "#2D4A5A", marginTop: 2 }}>{r.date}</div>
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
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 28 }}>{stat.icon}</span>
                      <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Imaging Modalities Quick Access */}
              <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #1E293B, #0F172A)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Order Imaging Studies</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Quick access to common imaging modalities</div>
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
                        border: "1px solid rgba(255,255,255,0.08)",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = modality.color; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#0A1520"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    >
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{modality.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{modality.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Imaging Orders */}
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: "20px 24px", background: "linear-gradient(135deg, #1E293B, #0F172A)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "white" }}>Recent Imaging Orders</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>Review and manage patient imaging requests</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr", padding: "12px 24px", background: "rgba(15,23,42,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Patient", "Study Type", "Body Part", "Urgency", "Status", "Action"].map((h, i) => (
                    <div key={i} style={{ fontSize: 11.5, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
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
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(13,115,119,0.08)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "white" }}>{order.patient}</div>
                      <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>{order.date}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "#CBD5E1" }}>{order.study}</div>
                    <div style={{ fontSize: 13, color: "#94A3B8" }}>{order.part}</div>
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
              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 0, height: 540, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                {/* Thread list */}
                <div style={{ background: "#0A1520", borderRight: "1px solid rgba(255,255,255,0.06)", overflowY: "auto" }}>
                  {MESSAGES.map((m, i) => (
                    <div key={i} onClick={() => setActiveMsg(i)} style={{ display: "flex", gap: 12, padding: "16px", cursor: "pointer", background: activeMsg === i ? "rgba(13,115,119,0.12)" : "transparent", borderBottom: "1px solid rgba(255,255,255,0.04)", borderLeft: activeMsg === i ? "2px solid #14BDBD" : "2px solid transparent", transition: "all 0.15s" }}>
                      <div className="avatar" style={{ width: 38, height: 38, fontSize: 14, flexShrink: 0 }}>{m.avatar}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{m.patient}</div>
                          <div style={{ fontSize: 10.5, color: "#2D4A5A" }}>{m.time}</div>
                        </div>
                        <div style={{ fontSize: 11.5, color: "#334155", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.last}</div>
                      </div>
                      {m.unread > 0 && <span style={{ background: "#EF4444", color: "white", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "2px 6px", alignSelf: "flex-start", flexShrink: 0 }}>{m.unread}</span>}
                    </div>
                  ))}
                </div>

                {/* Chat area */}
                <div style={{ background: "#0F1923", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12 }}>
                    <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>{MESSAGES[activeMsg].avatar}</div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0" }}>{MESSAGES[activeMsg].patient}</div>
                      <div style={{ fontSize: 11, color: "#34D399" }}>● Online</div>
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
                      <div style={{ textAlign: "center", color: "#2D4A5A", fontSize: 13, marginTop: 40 }}>No messages yet. Start the conversation.</div>
                    )}
                  </div>
                  <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 10 }}>
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
                    <div style={{ fontSize: 12.5, color: "#334155", fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#1E3448", marginTop: 2 }}>{s.sub}</div>
                    <div className="earnings-bar" style={{ marginTop: 14 }}>
                      <div className="earnings-fill" style={{ width: `${s.pct}%`, background: `linear-gradient(90deg, ${s.color}88, ${s.color})` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card">
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0", marginBottom: 16 }}>Payment Breakdown by Source</div>
                {[
                  { source: "Credit / Debit Card", amount: "AED 12,800", count: "32 consultations", color: "#14BDBD", pct: 45 },
                  { source: "Insurance Direct Billing", amount: "AED 11,200", count: "28 claims", color: "#818CF8", pct: 39 },
                  { source: "In-App Wallet", amount: "AED 4,400", count: "11 consultations", color: "#34D399", pct: 16 },
                ].map((row, i) => (
                  <div key={i} style={{ padding: "14px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0" }}>{row.source}</div>
                        <div style={{ fontSize: 11.5, color: "#2D4A5A", marginTop: 2 }}>{row.count}</div>
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
              <div className="section-sub">Your public-facing CeenAiX doctor profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 24 }}>
                <div className="glass-card" style={{ textAlign: "center" }}>
                  <div className="avatar" style={{ width: 80, height: 80, fontSize: 30, margin: "0 auto 16px" }}>L</div>
                  <div style={{ fontFamily: "Playfair Display, serif", fontSize: 18, fontWeight: 800, color: "#E2E8F0" }}>Dr. Layla Al Mansoori</div>
                  <div style={{ fontSize: 12.5, color: "#475569", marginTop: 4 }}>Cardiologist</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 10 }}>
                    <span className="badge badge-green">✓ DHA Verified</span>
                    <span className="badge badge-teal">Active</span>
                  </div>
                  <div style={{ marginTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
                    {[["Experience", "12 years"], ["Languages", "Arabic, English"], ["Clinic", "Dubai Heart Center"], ["Rating", "4.9 / 5.0"], ["Consultations", "1,240+"]].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12, borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <span style={{ color: "#334155" }}>{k}</span>
                        <span style={{ fontWeight: 700, color: "#94A3B8" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { title: "Professional Info", fields: [["Full Name", "Dr. Layla Al Mansoori"], ["Specialty", "Cardiology"], ["Sub-specialty", "Interventional Cardiology"], ["Medical School", "UAE University, College of Medicine"], ["Graduation Year", "2013"], ["DHA License", "●●●●●●●● (Verified ✓)"]] },
                    { title: "Consultation Fees", fields: [["In-Clinic Fee", "AED 350"], ["Teleconsultation Fee", "AED 200"], ["Insurance Accepted", "Daman, AXA, Thiqa, MetLife"]] },
                  ].map((section, i) => (
                    <div key={i} className="glass-card">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0" }}>{section.title}</div>
                        <button className="btn-ghost" style={{ fontSize: 11.5 }}>Edit</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {section.fields.map(([k, v], j) => (
                          <div key={j}>
                            <div style={{ fontSize: 10.5, color: "#2D4A5A", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 3 }}>{k}</div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#94A3B8" }}>{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="glass-card">
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#E2E8F0", marginBottom: 12 }}>Bio</div>
                    <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>Dr. Layla Al Mansoori is a board-certified cardiologist with over 12 years of experience treating cardiovascular conditions in Dubai. She specializes in interventional cardiology and preventive heart care, and is committed to delivering patient-centered, evidence-based treatment.</div>
                    <button className="btn-ghost" style={{ marginTop: 12, fontSize: 11.5 }}>Edit Bio</button>
                  </div>
                  <div className="glass-card" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#F87171", marginBottom: 12 }}>Account Actions</div>
                    <button
                      onClick={handleSignOut}
                      className="btn-outline"
                      style={{ width: "100%", borderColor: "#EF4444", color: "#F87171", fontSize: 13 }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Appointments Modal */}
      {showAppointmentsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAppointmentsModal(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 900, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>Today's Appointments</h3>
              <button onClick={() => setShowAppointmentsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94A3B8" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {TODAY_APPTS.map(a => (
                <div key={a.id} className={`appt-row ${a.status === "active" ? "active-appt" : ""}`} style={{ background: "rgba(255,255,255,0.02)", padding: "16px 20px", borderRadius: 12, cursor: "pointer" }} onClick={() => { if (a.status === "active") { setConsultOpen(true); setShowAppointmentsModal(false); } }}>
                  <div style={{ width: 60, textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: a.status === "active" ? "#14BDBD" : "#94A3B8" }}>{a.time}</div>
                  </div>
                  <div style={{ width: 1, background: a.status === "active" ? "rgba(20,189,189,0.4)" : "rgba(255,255,255,0.06)", alignSelf: "stretch" }}></div>
                  <div className="avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{a.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{a.patient}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{a.condition}</div>
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
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPatientsModal(false)}>
          <div className="glass-card" style={{ width: "90%", maxWidth: 900, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#E2E8F0" }}>All Patients</h3>
              <button onClick={() => setShowPatientsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#94A3B8" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PATIENTS.map(p => (
                <div key={p.id} className="glass-card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: "rgba(255,255,255,0.02)", cursor: "pointer" }} onClick={() => { setSelectedPatient(p); setShowPatientsModal(false); }}>
                  <div className="avatar" style={{ width: 44, height: 44, fontSize: 16 }}>{p.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{p.condition}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>Age: {p.age} • {p.insurance}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>Last visit</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#14BDBD", marginTop: 2 }}>{p.lastVisit}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{p.visits} total visits</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <EmergencyButton />
    </div>
  );
}
