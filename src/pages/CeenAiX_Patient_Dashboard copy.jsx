import { useState, useEffect, useRef } from "react";
import { useUserProfile } from "../contexts/UserProfileContext";
import { UserAvatar } from "../components/UserAvatar";
import { NotificationDropdown } from "../components/NotificationDropdown";
import { useNavigation } from "../Router";

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: "⊞" },
  { id: "appointments", label: "My Appointments", icon: "📅" },
  { id: "records", label: "Health Records", icon: "🗂" },
  { id: "prescriptions", label: "Prescriptions", icon: "💊" },
  { id: "labs", label: "Lab Results", icon: "🔬" },
  { id: "messages", label: "Messages", icon: "💬" },
  { id: "ai", label: "AI Assistant", icon: "✦" },
  { id: "profile", label: "My Profile", icon: "👤" },
];

const INITIAL_APPOINTMENTS = [
  { id: 1, doctor: "Dr. Layla Al Mansoori", specialty: "Cardiologist", date: "Today", time: "11:00 AM", type: "In-Clinic", clinic: "Dubai Heart Center", status: "upcoming", avatar: "L" },
  { id: 2, doctor: "Dr. Rami Khalil", specialty: "General Practitioner", date: "Mar 15", time: "2:30 PM", type: "Teleconsultation", clinic: "HealthFirst Clinic", status: "upcoming", avatar: "R" },
  { id: 3, doctor: "Dr. Sara Nasser", specialty: "Dermatologist", date: "Mar 20", time: "10:00 AM", type: "In-Clinic", clinic: "Skin & Care Dubai", status: "upcoming", avatar: "S" },
  { id: 4, doctor: "Dr. Ahmed Farhan", specialty: "Orthopedist", date: "Feb 28", time: "9:00 AM", type: "In-Clinic", clinic: "City Medical Center", status: "completed", avatar: "A" },
  { id: 5, doctor: "Dr. Layla Al Mansoori", specialty: "Cardiologist", date: "Jan 15", time: "11:00 AM", type: "Teleconsultation", clinic: "Dubai Heart Center", status: "completed", avatar: "L" },
];

const PRESCRIPTIONS = [
  { id: 1, name: "Metformin 500mg", frequency: "Twice daily", duration: "3 months", doctor: "Dr. Layla Al Mansoori", date: "Mar 1, 2026", status: "Active" },
  { id: 2, name: "Atorvastatin 20mg", frequency: "Once daily", duration: "Ongoing", doctor: "Dr. Layla Al Mansoori", date: "Jan 15, 2026", status: "Active" },
  { id: 3, name: "Amoxicillin 500mg", frequency: "Three times daily", duration: "7 days", doctor: "Dr. Rami Khalil", date: "Dec 10, 2025", status: "Completed" },
];

const LAB_RESULTS = [
  { id: 1, test: "HbA1c", lab: "LifeLab Dubai", date: "Mar 2, 2026", result: "6.8%", status: "Normal", turnaround: "Same day" },
  { id: 2, test: "Lipid Panel", lab: "LifeLab Dubai", date: "Mar 2, 2026", result: "See report", status: "Review", turnaround: "Same day" },
  { id: 3, test: "CBC (Complete Blood Count)", lab: "AlMana Medical Lab", date: "Jan 14, 2026", result: "Normal range", status: "Normal", turnaround: "24 hrs" },
  { id: 4, test: "Thyroid Function (TSH)", lab: "AlMana Medical Lab", date: "Nov 5, 2025", result: "2.1 mIU/L", status: "Normal", turnaround: "48 hrs" },
];

const AI_SUGGESTIONS = [
  "Check my medications for interactions",
  "What does my HbA1c result mean?",
  "Find me a cardiologist near me",
  "I have a headache, what should I do?",
];

const AI_RESPONSES = {
  "Check my medications for interactions": "I've reviewed your current medications — Metformin and Atorvastatin. These two are commonly prescribed together and have no major interactions. However, make sure to stay well-hydrated with Metformin and avoid large amounts of grapefruit juice with Atorvastatin. Would you like me to explain more about either medication?",
  "What does my HbA1c result mean?": "Your latest HbA1c is 6.8%, which falls in the pre-diabetic range (5.7%–6.4% is pre-diabetic, 6.5%+ is diabetic). However, since you're on Metformin, your doctor is already managing this. A result of 6.8% suggests your blood sugar is being managed but there's room for improvement. I'd recommend discussing this with Dr. Al Mansoori at your next appointment.",
  "Find me a cardiologist near me": "Based on your location in Dubai, here are top DHA-licensed cardiologists on CeenAiX: Dr. Layla Al Mansoori at Dubai Heart Center (your current cardiologist), Dr. Khalid Rashid at Emirates Hospital, and Dr. Priya Menon at Mediclinic City Hospital. Would you like to book an appointment with any of them?",
  "I have a headache, what should I do?": "For a mild headache, try rest, hydration, and an over-the-counter analgesic like paracetamol. However, if your headache is severe, sudden, or accompanied by vision changes, stiff neck, or fever — please seek emergency care immediately. Given your cardiac history, if you experience headaches frequently, I'd suggest mentioning it to Dr. Al Mansoori. Should I help you book an appointment?",
};

export default function PatientDashboard({ onNavigateHome }) {
  const { profile, updateProfile, updateAvatar } = useUserProfile();
  const { navigateToPaymentSettings, navigateToChangePassword, navigateToSettings, navigateToTerms, navigateToPrivacy, navigateToHome: navToHome } = useNavigation();
  const [active, setActive] = useState("home");
  const [apptTab, setApptTab] = useState("upcoming");
  const [aiMessages, setAiMessages] = useState([
    { role: "ai", text: "Hi Parnia 👋 I'm your CeenAiX AI Health Assistant. How can I help you today?" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showPrescriptionsModal, setShowPrescriptionsModal] = useState(false);
  const [showLabResultsModal, setShowLabResultsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    specialty: '',
    doctor: '',
    date: '',
    time: '',
    type: 'In-Clinic',
    reason: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRecordDetailModal, setShowRecordDetailModal] = useState(false);
  const [recordAiInput, setRecordAiInput] = useState("");
  const [recordAiMessages, setRecordAiMessages] = useState([]);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [refillForm, setRefillForm] = useState({ pharmacy: 'Dubai Pharmacy', notes: '' });
  const [notificationEnabled, setNotificationEnabled] = useState({});
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [calendarPrescription, setCalendarPrescription] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  const handleSignOut = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      navToHome();
    }
  };

  const handleProfileChange = (field, value) => {
    updateProfile({ [field]: value });
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profile);
    setIsEditingProfile(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendAiMessage = (text) => {
    const msg = text || aiInput;
    if (!msg.trim()) return;
    const response = AI_RESPONSES[msg] || "I understand your concern. Based on your health profile, I'd recommend consulting with your doctor for a personalized assessment. Would you like me to help book an appointment?";
    setAiMessages(prev => [...prev,
      { role: "user", text: msg },
      { role: "ai", text: response }
    ]);
    setAiInput("");
  };

  const generateTimeSlots = (date) => {
    if (!date) return [];

    const bookedTimes = ["09:00", "10:30", "14:00", "15:30"];
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 45) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const isBooked = bookedTimes.includes(timeStr);

        if (min === 0) {
          slots.push({ time: timeStr, available: !isBooked });
        } else if (min === 45) {
          if (hour + 1 < endHour) {
            slots.push({ time: timeStr, available: !isBooked });
          }
        }
      }
    }

    return slots;
  };

  useEffect(() => {
    if (bookingForm.date) {
      setAvailableSlots(generateTimeSlots(bookingForm.date));
    }
  }, [bookingForm.date]);

  const handleBookAppointment = () => {
    if (bookingForm.specialty && bookingForm.date && bookingForm.time && bookingForm.reason) {
      const newAppointment = {
        id: Date.now(),
        doctor: bookingForm.doctor || `Dr. ${bookingForm.specialty} Specialist`,
        specialty: bookingForm.specialty,
        date: new Date(bookingForm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        time: bookingForm.time,
        type: bookingForm.type,
        clinic: "CeenAiX Medical Center",
        status: "upcoming",
        avatar: bookingForm.specialty.charAt(0)
      };

      setAppointments(prev => [newAppointment, ...prev]);

      alert('Appointment booked successfully!');
      setShowBookingModal(false);
      setBookingForm({ specialty: '', doctor: '', date: '', time: '', type: 'In-Clinic', reason: '' });
      setAvailableSlots([]);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const filteredAppts = appointments.filter(a =>
    apptTab === "upcoming" ? a.status === "upcoming" : a.status === "completed"
  );

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#F0F4F8", minHeight: "100vh", display: "flex" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #0D7377; border-radius: 4px; }
        .nav-item { transition: all 0.18s ease; cursor: pointer; border-radius: 12px; }
        .nav-item:hover { background: rgba(13,115,119,0.08); }
        .nav-item.active { background: #0D7377; color: white !important; }
        .nav-item.active span { color: white !important; }
        .card { background: white; border-radius: 16px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04); transition: box-shadow 0.2s; }
        .card:hover { box-shadow: 0 4px 20px rgba(13,115,119,0.12); }
        .stat-card { background: white; border-radius: 16px; padding: 20px 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.3px; }
        .badge-teal { background: #E6F4F4; color: #0D7377; }
        .badge-green { background: #E8F8F0; color: #1A9E5C; }
        .badge-amber { background: #FEF3E2; color: #C97B1A; }
        .badge-red { background: #FEE8E8; color: #C0392B; }
        .badge-purple { background: #F0EDFF; color: #6C63FF; }
        .btn-primary { background: #0D7377; color: white; border: none; padding: 9px 18px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-primary:hover { background: #0a5f63; transform: translateY(-1px); }
        .btn-outline { background: transparent; color: #0D7377; border: 1.5px solid #0D7377; padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .btn-outline:hover { background: #E6F4F4; }
        .appt-card { border-left: 3px solid #0D7377; padding: 16px 20px; background: white; border-radius: 0 12px 12px 0; margin-bottom: 10px; display: flex; align-items: center; gap: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); transition: all 0.18s; }
        .appt-card:hover { transform: translateX(3px); box-shadow: 0 4px 16px rgba(13,115,119,0.1); }
        .appt-card.completed { border-left-color: #CBD5E1; opacity: 0.75; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #0D7377, #14BDBD); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; flex-shrink: 0; }
        .ai-bubble { max-width: 80%; padding: 12px 16px; border-radius: 16px; font-size: 13.5px; line-height: 1.6; }
        .ai-bubble.ai { background: #F0F4F8; color: #1A1A2E; border-radius: 4px 16px 16px 16px; }
        .ai-bubble.user { background: #0D7377; color: white; border-radius: 16px 4px 16px 16px; margin-left: auto; }
        .ai-chip { background: white; border: 1.5px solid #E2E8F0; border-radius: 20px; padding: 7px 14px; font-size: 12.5px; color: #475569; cursor: pointer; transition: all 0.18s; font-family: inherit; }
        .ai-chip:hover { border-color: #0D7377; color: #0D7377; background: #E6F4F4; }
        .tab-btn { padding: 8px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.18s; }
        .tab-btn.active { background: #0D7377; color: white; }
        .tab-btn.inactive { background: transparent; color: #64748B; }
        .tab-btn.inactive:hover { background: #F1F5F9; }
        .rx-card { border: 1px solid #E8EFFE; border-radius: 12px; padding: 16px 20px; background: white; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
        .lab-row { padding: 14px 0; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; }
        .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; color: #1A1A2E; margin-bottom: 6px; }
        .section-sub { font-size: 13.5px; color: #64748B; margin-bottom: 24px; }
        input[type="text"] { font-family: inherit; }
        .quick-action { background: white; border-radius: 14px; padding: 20px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
        .quick-action:hover { border-color: #0D7377; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,115,119,0.12); }
        .profile-menu { position: absolute; top: 50px; right: 0; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); min-width: 240px; z-index: 100; overflow: hidden; }
        .profile-menu-item { padding: 12px 20px; display: flex; align-items: center; gap: 12px; font-size: 13.5px; color: #475569; cursor: pointer; transition: all 0.15s; border-left: 3px solid transparent; }
        .profile-menu-item:hover { background: #F8FAFC; border-left-color: #0D7377; color: #0D7377; }
        .profile-menu-item.danger { color: #EF4444; }
        .profile-menu-item.danger:hover { background: #FEF2F2; border-left-color: #EF4444; }
        .profile-menu-divider { height: 1px; background: #F1F5F9; margin: 8px 0; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 240 : 72,
        background: "white",
        borderRight: "1px solid #E8EFF5",
        display: "flex", flexDirection: "column",
        padding: "24px 12px",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "sticky", top: 0, height: "100vh", overflowY: "auto"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px", marginBottom: 32 }}>
          <img
            src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM copy.png"
            alt="CeenAiX"
            style={{
              height: sidebarOpen ? 32 : 36,
              width: "auto",
              objectFit: "contain",
              transition: "all 0.25s ease"
            }}
          />
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => setActive(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", color: active === item.id ? "white" : "#475569" }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 13.5, fontWeight: 500 }}>{item.label}</span>}
            </div>
          ))}
        </div>

        {/* Profile footer */}
        {sidebarOpen && (
          <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <UserAvatar size={34} fontSize={13} />
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.full_name.split(' ')[0]} {profile.full_name.split(' ')[1]?.charAt(0)}.</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>Patient</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: "auto", maxHeight: "100vh" }}>

        {/* TOP BAR */}
        <div style={{ background: "white", borderBottom: "1px solid #E8EFF5", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#64748B" }}>☰</button>
            <div style={{ background: "#F0F4F8", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, width: 280 }}>
              <span style={{ color: "#94A3B8", fontSize: 14 }}>🔍</span>
              <span style={{ fontSize: 13, color: "#94A3B8" }}>Search records, doctors...</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button className="btn-outline" onClick={() => setActive("ai")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5 }}>
              <span style={{ color: "#6C63FF" }}>✦</span> AI Assistant
            </button>
            <NotificationDropdown />
            <div style={{ position: "relative" }} ref={profileMenuRef}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              >
                <UserAvatar size={36} fontSize={14} />
              </div>

              {profileMenuOpen && (
                <div className="profile-menu">
                  <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9" }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: "#1A1A2E" }}>{profile.full_name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{profile.email}</div>
                  </div>

                  <div style={{ padding: "8px 0" }}>
                    <div className="profile-menu-item" onClick={() => { setActive("profile"); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>👤</span>
                      <span style={{ fontWeight: 500 }}>My Profile</span>
                    </div>

                    <div className="profile-menu-item" onClick={() => { navigateToPaymentSettings(); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>💳</span>
                      <span style={{ fontWeight: 500 }}>Payment Settings</span>
                    </div>

                    <div className="profile-menu-item" onClick={() => { navigateToChangePassword(); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>🔒</span>
                      <span style={{ fontWeight: 500 }}>Change Password</span>
                    </div>

                    <div className="profile-menu-item" onClick={() => { navigateToSettings(); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>⚙️</span>
                      <span style={{ fontWeight: 500 }}>Settings</span>
                    </div>

                    <div className="profile-menu-divider"></div>

                    <div className="profile-menu-item" onClick={() => { navigateToTerms(); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>📋</span>
                      <span style={{ fontWeight: 500 }}>Terms & Conditions</span>
                    </div>

                    <div className="profile-menu-item" onClick={() => { navigateToPrivacy(); setProfileMenuOpen(false); }}>
                      <span style={{ fontSize: 16 }}>🔐</span>
                      <span style={{ fontWeight: 500 }}>Privacy Policy</span>
                    </div>

                    <div className="profile-menu-divider"></div>

                    <div className="profile-menu-item danger" onClick={handleSignOut}>
                      <span style={{ fontSize: 16 }}>🚪</span>
                      <span style={{ fontWeight: 500 }}>Sign Out</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: "32px" }}>

          {/* ── DASHBOARD HOME ── */}
          {active === "home" && (
            <div>
              {/* Welcome */}
              <div style={{ background: "linear-gradient(135deg, #0D7377 0%, #14BDBD 100%)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, color: "white", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", right: -20, top: -20, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }}></div>
                <div style={{ position: "absolute", right: 40, bottom: -40, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }}></div>
                <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>Good morning 👋</div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Parnia Yazdkhasti</div>
                <div style={{ fontSize: 13.5, opacity: 0.85 }}>You have <strong>1 appointment today</strong> at 11:00 AM with Dr. Al Mansoori</div>
                <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                  <button className="btn-primary" style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }} onClick={() => setActive("appointments")}>View Appointments</button>
                  <button className="btn-primary" style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.3)" }} onClick={() => setActive("ai")}>✦ Ask AI</button>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
                {[
                  { label: "Upcoming Appointments", value: appointments.filter(a => a.status === "upcoming").length.toString(), icon: "📅", color: "#0D7377", onClick: () => setActive("appointments") },
                  { label: "Active Prescriptions", value: "2", icon: "💊", color: "#6C63FF", onClick: () => setActive("prescriptions") },
                  { label: "Lab Results", value: "4", icon: "🔬", color: "#1A9E5C", onClick: () => setActive("labs") },
                  { label: "Unread Messages", value: "1", icon: "💬", color: "#E67E22", onClick: () => setActive("messages") },
                ].map((s, i) => (
                  <div key={i} className="stat-card" onClick={s.onClick} style={{ cursor: "pointer" }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12.5, color: "#64748B", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 14 }}>Quick Actions</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { icon: "📅", label: "Book Appointment", action: () => setActive("appointments") },
                    { icon: "✦", label: "AI Health Check", action: () => setActive("ai") },
                    { icon: "💊", label: "View Prescriptions", action: () => setActive("prescriptions") },
                    { icon: "🔬", label: "Lab Results", action: () => setActive("labs") },
                  ].map((q, i) => (
                    <div key={i} className="quick-action" onClick={q.action}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>{q.icon}</div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A2E" }}>{q.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Appointments */}
              <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
                <div className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>Upcoming Appointments</div>
                    <button className="btn-outline" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setShowAppointmentsModal(true)}>View All</button>
                  </div>
                  {appointments.filter(a => a.status === "upcoming").map(a => (
                    <div key={a.id} className="appt-card" style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => { setSelectedAppointment(a); setShowAppointmentsModal(true); }}>
                      <div className="avatar">{a.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{a.doctor}</div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>{a.specialty}</div>
                        <div style={{ fontSize: 12, color: "#0D7377", marginTop: 2, fontWeight: 500 }}>{a.date} · {a.time}</div>
                      </div>
                      <span className={`badge ${a.type === "Teleconsultation" ? "badge-purple" : "badge-teal"}`}>{a.type === "Teleconsultation" ? "📹 Tele" : "🏥 Clinic"}</span>
                    </div>
                  ))}
                </div>

                {/* Health Summary */}
                <div className="card">
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 18 }}>Health Summary</div>
                  {[
                    { label: "Blood Type", value: "A+" },
                    { label: "Known Conditions", value: "Type 2 Diabetes" },
                    { label: "Allergies", value: "Penicillin" },
                    { label: "Current Medications", value: "2 active" },
                    { label: "Last HbA1c", value: "6.8% — Mar 2026" },
                    { label: "Insurance", value: "Daman — Active" },
                  ].map((h, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < 5 ? "1px solid #F1F5F9" : "none" }}>
                      <span style={{ fontSize: 12.5, color: "#64748B" }}>{h.label}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1A1A2E" }}>{h.value}</span>
                    </div>
                  ))}
                  <button className="btn-outline" style={{ width: "100%", marginTop: 16, fontSize: 12.5 }} onClick={() => setActive("records")}>View Full Records</button>
                </div>
              </div>
            </div>
          )}

          {/* ── APPOINTMENTS ── */}
          {active === "appointments" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div className="section-title">My Appointments</div>
                  <div className="section-sub">Manage your upcoming and past consultations</div>
                </div>
                <button className="btn-primary" onClick={() => setShowBookingModal(true)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>+</span> Book New Appointment
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                <button className={`tab-btn ${apptTab === "upcoming" ? "active" : "inactive"}`} onClick={() => setApptTab("upcoming")}>Upcoming ({appointments.filter(a => a.status === "upcoming").length})</button>
                <button className={`tab-btn ${apptTab === "past" ? "active" : "inactive"}`} onClick={() => setApptTab("past")}>Past ({appointments.filter(a => a.status === "completed").length})</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {filteredAppts.map(a => (
                  <div key={a.id} className="card" style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px" }}>
                    <div className="avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{a.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{a.doctor}</div>
                      <div style={{ fontSize: 13, color: "#64748B" }}>{a.specialty} · {a.clinic}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                        <span style={{ fontSize: 12.5, color: "#0D7377", fontWeight: 600 }}>📅 {a.date} at {a.time}</span>
                        <span className={`badge ${a.type === "Teleconsultation" ? "badge-purple" : "badge-teal"}`}>{a.type}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {a.status === "upcoming" ? (
                        <>
                          {a.type === "Teleconsultation" && <button className="btn-primary" style={{ fontSize: 12 }}>Join Call</button>}
                          <button className="btn-outline" style={{ fontSize: 12 }}>Cancel</button>
                        </>
                      ) : (
                        <span className="badge badge-green">✓ Completed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── HEALTH RECORDS ── */}
          {active === "records" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div>
                  <div className="section-title">Health Records</div>
                  <div className="section-sub">Your complete medical history in one place</div>
                </div>
                <button className="btn-primary" style={{ fontSize: 12.5 }}>⬇ Download PDF</button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  {
                    title: "Chronic Conditions",
                    icon: "🫀",
                    items: ["Type 2 Diabetes (since 2022)", "Hypertension (since 2021)"],
                    details: {
                      type: "Chronic Conditions",
                      lastUpdated: "Mar 1, 2026",
                      updatedBy: "Dr. Layla Al Mansoori",
                      records: [
                        { condition: "Type 2 Diabetes", diagnosed: "Jan 2022", severity: "Moderate", treatment: "Metformin 500mg twice daily", notes: "Well controlled with medication and diet" },
                        { condition: "Hypertension", diagnosed: "Mar 2021", severity: "Mild", treatment: "Lifestyle modifications", notes: "Blood pressure monitoring recommended" }
                      ]
                    }
                  },
                  {
                    title: "Allergies",
                    icon: "⚠️",
                    items: ["Penicillin — Severe", "Shellfish — Moderate"],
                    details: {
                      type: "Allergies",
                      lastUpdated: "Jan 10, 2026",
                      updatedBy: "Dr. Rami Khalil",
                      records: [
                        { allergen: "Penicillin", severity: "Severe", reaction: "Anaphylaxis", firstOccurrence: "2015", notes: "Avoid all penicillin-based antibiotics" },
                        { allergen: "Shellfish", severity: "Moderate", reaction: "Hives, difficulty breathing", firstOccurrence: "2019", notes: "Carry EpiPen when dining out" }
                      ]
                    }
                  },
                  {
                    title: "Current Medications",
                    icon: "💊",
                    items: ["Metformin 500mg — Twice daily", "Atorvastatin 20mg — Once daily"],
                    details: {
                      type: "Current Medications",
                      lastUpdated: "Mar 1, 2026",
                      updatedBy: "Dr. Layla Al Mansoori",
                      records: [
                        { medication: "Metformin 500mg", dosage: "500mg", frequency: "Twice daily", startDate: "Jan 2022", prescribedFor: "Type 2 Diabetes", sideEffects: "None reported", notes: "Take with meals" },
                        { medication: "Atorvastatin 20mg", dosage: "20mg", frequency: "Once daily (evening)", startDate: "Jan 2022", prescribedFor: "High cholesterol", sideEffects: "None reported", notes: "Avoid grapefruit juice" }
                      ]
                    }
                  },
                  {
                    title: "Past Surgeries",
                    icon: "🏥",
                    items: ["Appendectomy — 2018", "Knee Arthroscopy — 2020"],
                    details: {
                      type: "Past Surgeries",
                      lastUpdated: "Feb 15, 2026",
                      updatedBy: "Medical Records",
                      records: [
                        { surgery: "Appendectomy", date: "Jun 15, 2018", hospital: "City Medical Center", surgeon: "Dr. Ahmed Farhan", reason: "Acute appendicitis", recovery: "Full recovery", complications: "None", notes: "Laparoscopic procedure" },
                        { surgery: "Knee Arthroscopy", date: "Sep 10, 2020", hospital: "Sports Medicine Clinic", surgeon: "Dr. Sarah Johnson", reason: "Meniscus tear", recovery: "Full recovery with PT", complications: "None", notes: "6 weeks physical therapy" }
                      ]
                    }
                  },
                  {
                    title: "Vaccinations",
                    icon: "💉",
                    items: ["COVID-19 Booster — Dec 2025", "Flu Shot — Oct 2025", "Hepatitis B — Complete"],
                    details: {
                      type: "Vaccinations",
                      lastUpdated: "Dec 12, 2025",
                      updatedBy: "Dubai Health Authority",
                      records: [
                        { vaccine: "COVID-19 Booster", date: "Dec 12, 2025", manufacturer: "Pfizer-BioNTech", lotNumber: "FN8795", administeredBy: "HealthFirst Clinic", nextDue: "Dec 2026", notes: "3rd booster dose" },
                        { vaccine: "Influenza (Flu)", date: "Oct 5, 2025", manufacturer: "Sanofi", lotNumber: "FL2934", administeredBy: "Dubai Heart Center", nextDue: "Oct 2026", notes: "Annual flu vaccine" },
                        { vaccine: "Hepatitis B (Complete Series)", date: "2010-2011", manufacturer: "GSK", lotNumber: "HB-SERIES", administeredBy: "School Health Program", nextDue: "N/A", notes: "3-dose series completed" }
                      ]
                    }
                  },
                  {
                    title: "Emergency Contact",
                    icon: "🆘",
                    items: ["Tooraj Helmi — Friend", "+971 50 XXX XXXX"],
                    details: {
                      type: "Emergency Contact",
                      lastUpdated: "Jan 5, 2026",
                      updatedBy: "Patient",
                      records: [
                        { name: "Tooraj Helmi", relationship: "Friend", phone: "+971 50 XXX XXXX", alternatePhone: "+971 4 XXX XXXX", address: "Dubai Marina, Dubai", notes: "Primary emergency contact" }
                      ]
                    }
                  },
                ].map((section, i) => (
                  <div
                    key={i}
                    className="card"
                    style={{ cursor: section.title !== "Emergency Contact" ? "pointer" : "default" }}
                    onClick={() => {
                      if (section.title !== "Emergency Contact") {
                        setSelectedRecord(section.details);
                        setShowRecordDetailModal(true);
                        setRecordAiMessages([{ role: "ai", text: `Hi! I'm here to help you understand your ${section.details.type}. What would you like to know?` }]);
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 20 }}>{section.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{section.title}</span>
                    </div>
                    {section.items.map((item, j) => (
                      <div key={j} style={{ fontSize: 13, color: "#475569", padding: "6px 0", borderBottom: j < section.items.length - 1 ? "1px solid #F8FAFC" : "none", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0D7377", display: "inline-block", flexShrink: 0 }}></span>
                        {item}
                      </div>
                    ))}
                    {section.title !== "Emergency Contact" && (
                      <div style={{ marginTop: 12, fontSize: 12, color: "#0D7377", fontWeight: 600 }}>
                        Click to view details →
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRESCRIPTIONS ── */}
          {active === "prescriptions" && (
            <div>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 36, fontWeight: 900, background: "linear-gradient(135deg, #0D7377, #14FFEC)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>
                  My Medications
                </h2>
                <p style={{ fontSize: 16, color: "#64748B" }}>Manage your prescriptions, request refills, and track your medications</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
                <div style={{ background: "linear-gradient(135deg, #0D7377, #0a5d61)", borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(13,115,119,0.3)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -24, right: -24, width: 128, height: 128, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>💊</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 8 }}>ACTIVE MEDICATIONS</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "white" }}>{PRESCRIPTIONS.filter(p => p.status === "Active").length}</div>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #14FFEC, #0fc9ba)", borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(20,255,236,0.3)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -24, right: -24, width: 128, height: 128, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📥</div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.7)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 8 }}>REFILLS AVAILABLE</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "#1A1A2E" }}>2</div>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #323232, #1e1e1e)", borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(50,50,50,0.3)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -24, right: -24, width: 128, height: 128, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>⏱️</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 8 }}>PENDING REFILLS</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: "white" }}>0</div>
                  </div>
                </div>

                <div style={{ background: "linear-gradient(135deg, #0D7377, #14FFEC)", borderRadius: 16, padding: 24, boxShadow: "0 10px 30px rgba(13,115,119,0.3)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: -24, right: -24, width: 128, height: 128, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>
                  <div style={{ position: "relative" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📍</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.5px", marginBottom: 8 }}>PREFERRED PHARMACY</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Dubai Pharmacy</div>
                    <button style={{ padding: "6px 12px", background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, fontSize: 11, fontWeight: 700, color: "white", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.3)"} onMouseLeave={(e) => e.target.style.background = "rgba(255,255,255,0.2)"}>
                      Change
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 20 }}>Active Prescriptions</h3>
                <div style={{ display: "grid", gap: 20 }}>
                  {PRESCRIPTIONS.filter(rx => rx.status === "Active").map(rx => (
                    <div key={rx.id} style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #f1f5f9", transition: "all 0.3s" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #0D7377, #14FFEC)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(13,115,119,0.3)" }}>
                            <span style={{ fontSize: 28 }}>💊</span>
                          </div>
                          <div>
                            <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>{rx.name}</h3>
                            <p style={{ fontSize: 14, color: "#64748B" }}>{rx.frequency} • {rx.duration}</p>
                          </div>
                        </div>
                        <span style={{ padding: "8px 16px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: "#d1fae5", color: "#065f46" }}>{rx.status}</span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginBottom: 24 }}>
                        <div>
                          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, marginBottom: 8 }}>PRESCRIBING DOCTOR</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>👨‍⚕️</span>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{rx.doctor}</p>
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, marginBottom: 8 }}>PRESCRIBED DATE</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 16 }}>📅</span>
                            <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>{rx.date}</p>
                          </div>
                        </div>
                        <div>
                          <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 700, marginBottom: 8 }}>REFILLS REMAINING</p>
                          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, background: "linear-gradient(135deg, #14FFEC, #0fc9ba)", borderRadius: 12, fontSize: 18, fontWeight: 900, color: "#1A1A2E", boxShadow: "0 4px 12px rgba(20,255,236,0.3)" }}>
                            2
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12 }}>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedPrescription(rx); setShowRefillModal(true); }}
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", background: "linear-gradient(135deg, #0D7377, #0a5d61)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", boxShadow: "0 4px 12px rgba(13,115,119,0.3)", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 20px rgba(13,115,119,0.4)"; }}
                          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 12px rgba(13,115,119,0.3)"; }}>
                          <span style={{ fontSize: 16 }}>📨</span>
                          Request Refill
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setNotificationEnabled(prev => ({ ...prev, [rx.id]: !prev[rx.id] })); }}
                          style={{ padding: "12px 20px", border: notificationEnabled[rx.id] ? "2px solid #0D7377" : "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 700, color: notificationEnabled[rx.id] ? "#0D7377" : "#64748B", cursor: "pointer", background: notificationEnabled[rx.id] ? "#e6f7f8" : "white", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { if (!notificationEnabled[rx.id]) { e.target.style.borderColor = "#0D7377"; e.target.style.color = "#0D7377"; e.target.style.background = "#e6f7f8"; } }}
                          onMouseLeave={(e) => { if (!notificationEnabled[rx.id]) { e.target.style.borderColor = "#e2e8f0"; e.target.style.color = "#64748B"; e.target.style.background = "white"; } }}>
                          <span style={{ fontSize: 16 }}>{notificationEnabled[rx.id] ? "🔔" : "🔕"}</span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setCalendarPrescription(rx); setShowCalendarModal(true); }}
                          style={{ padding: "12px 20px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#64748B", cursor: "pointer", background: "white", transition: "all 0.2s" }}
                          onMouseEnter={(e) => { e.target.style.borderColor = "#14FFEC"; e.target.style.color = "#0D7377"; e.target.style.background = "#e6f7f8"; }}
                          onMouseLeave={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.color = "#64748B"; e.target.style.background = "white"; }}>
                          <span style={{ fontSize: 16 }}>📅</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LAB RESULTS ── */}
          {active === "labs" && (
            <div>
              <div className="section-title">Lab Results</div>
              <div className="section-sub">Results from your CeenAiX lab referrals</div>
              <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "12px 24px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                  {["Test", "Lab", "Date", "Result", "Status"].map((h, i) => (
                    <div key={i} style={{ fontSize: 11.5, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
                  ))}
                </div>
                {LAB_RESULTS.map((r, i) => (
                  <div key={r.id} className="lab-row" style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: i < LAB_RESULTS.length - 1 ? "1px solid #F8FAFC" : "none", cursor: "pointer" }} onClick={() => setShowLabResultsModal(true)}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{r.test}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{r.lab}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{r.date}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{r.result}</div>
                    <span className={`badge ${r.status === "Normal" ? "badge-green" : r.status === "Review" ? "badge-amber" : "badge-teal"}`}>{r.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── MESSAGES ── */}
          {active === "messages" && (
            <div>
              <div className="section-title">Messages</div>
              <div className="section-sub">Secure messages with your doctors</div>
              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 20, height: 500 }}>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {appointments.filter(a => a.status === "upcoming").map((a, i) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid #F8FAFC", cursor: "pointer", background: i === 0 ? "#F0F4F8" : "white" }}>
                      <div className="avatar" style={{ width: 38, height: 38, fontSize: 14 }}>{a.avatar}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{a.doctor}</div>
                        <div style={{ fontSize: 11.5, color: "#94A3B8" }}>{a.specialty}</div>
                      </div>
                      {i === 0 && <span style={{ width: 8, height: 8, background: "#0D7377", borderRadius: "50%", marginLeft: "auto" }}></span>}
                    </div>
                  ))}
                </div>
                <div className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", color: "#94A3B8" }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>Select a conversation to start messaging</div>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}>Your messages are end-to-end encrypted</div>
                </div>
              </div>
            </div>
          )}

          {/* ── AI ASSISTANT ── */}
          {active === "ai" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{ width: 38, height: 38, background: "linear-gradient(135deg, #6C63FF, #a855f7)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "white", fontWeight: 800, fontSize: 16 }}>✦</span>
                </div>
                <div className="section-title" style={{ margin: 0 }}>AI Health Assistant</div>
              </div>
              <div className="section-sub">Powered by CeenAiX AI · Your health, intelligently guided</div>

              <div className="card" style={{ height: 420, display: "flex", flexDirection: "column" }}>
                {/* Messages */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14, paddingBottom: 16 }}>
                  {aiMessages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      {msg.role === "ai" && (
                        <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #6C63FF, #a855f7)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 8, flexShrink: 0, alignSelf: "flex-end" }}>
                          <span style={{ color: "white", fontSize: 12 }}>✦</span>
                        </div>
                      )}
                      <div className={`ai-bubble ${msg.role}`}>{msg.text}</div>
                    </div>
                  ))}
                </div>

                {/* Suggestions */}
                {aiMessages.length < 3 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                    {AI_SUGGESTIONS.map((s, i) => (
                      <button key={i} className="ai-chip" onClick={() => sendAiMessage(s)}>{s}</button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div style={{ display: "flex", gap: 10, borderTop: "1px solid #F1F5F9", paddingTop: 14 }}>
                  <input
                    type="text"
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendAiMessage()}
                    placeholder="Ask about your health, medications, symptoms..."
                    style={{ flex: 1, background: "#F0F4F8", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13.5, color: "#1A1A2E", outline: "none" }}
                  />
                  <button className="btn-primary" onClick={() => sendAiMessage()} style={{ background: "linear-gradient(135deg, #6C63FF, #a855f7)", padding: "10px 20px" }}>Send</button>
                </div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11.5, color: "#94A3B8", textAlign: "center" }}>
                ⚠️ This assistant provides health guidance only. Always consult a licensed physician for medical decisions.
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {active === "profile" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div className="section-title">My Profile</div>
                  <div className="section-sub">Your personal and medical information</div>
                </div>
                {!isEditingProfile ? (
                  <button className="btn-primary" onClick={() => setIsEditingProfile(true)}>
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn-outline" onClick={() => setIsEditingProfile(false)}>Cancel</button>
                    <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
                {/* Left Column - Avatar & Quick Info */}
                <div className="card" style={{ textAlign: "center" }}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <UserAvatar size={80} fontSize={32} style={{ margin: "0 auto 16px" }} />
                    {isEditingProfile && (
                      <label style={{ position: "absolute", bottom: 10, right: -5, background: "#0D7377", color: "white", width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "3px solid white", fontSize: 12 }}>
                        📷
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                        />
                      </label>
                    )}
                  </div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontSize: 18, fontWeight: 800, color: "#1A1A2E" }}>{profile.full_name}</div>
                  <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>Patient · {profile.emirate}, UAE</div>
                  <span className="badge badge-green" style={{ marginTop: 10 }}>✓ Verified Account</span>
                  <div style={{ marginTop: 20, borderTop: "1px solid #F1F5F9", paddingTop: 16 }}>
                    {[["Emirates ID", profile.emirates_id], ["Insurance", "Daman — Active"], ["Blood Type", profile.blood_type], ["Member Since", "Jan 2026"]].map(([k, v], i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: 12.5 }}>
                        <span style={{ color: "#94A3B8" }}>{k}</span>
                        <span style={{ fontWeight: 600, color: "#1A1A2E" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - Editable Forms */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {/* Personal Information */}
                  <div className="card">
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 16 }}>Personal Information</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Full Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => handleProfileChange("full_name", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.full_name}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Date of Birth</label>
                        {isEditingProfile ? (
                          <input
                            type="date"
                            value={profile.date_of_birth}
                            onChange={(e) => handleProfileChange("date_of_birth", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.date_of_birth || "—"}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Gender</label>
                        {isEditingProfile ? (
                          <select
                            value={profile.gender}
                            onChange={(e) => handleProfileChange("gender", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.gender}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Blood Type</label>
                        {isEditingProfile ? (
                          <select
                            value={profile.blood_type}
                            onChange={(e) => handleProfileChange("blood_type", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.blood_type}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Email</label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => handleProfileChange("email", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.email}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Phone</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => handleProfileChange("phone", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.phone}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Emirates ID</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profile.emirates_id}
                            onChange={(e) => handleProfileChange("emirates_id", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.emirates_id}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Emirate</label>
                        {isEditingProfile ? (
                          <select
                            value={profile.emirate}
                            onChange={(e) => handleProfileChange("emirate", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          >
                            <option value="">Select</option>
                            <option value="Abu Dhabi">Abu Dhabi</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Sharjah">Sharjah</option>
                            <option value="Ajman">Ajman</option>
                            <option value="Umm Al Quwain">Umm Al Quwain</option>
                            <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                            <option value="Fujairah">Fujairah</option>
                          </select>
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.emirate}</div>
                        )}
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Address</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => handleProfileChange("address", e.target.value)}
                            placeholder="Enter your full address"
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.address || "—"}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="card">
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", marginBottom: 16 }}>Emergency Contact</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Name</label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={profile.emergency_contact_name}
                            onChange={(e) => handleProfileChange("emergency_contact_name", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.emergency_contact_name}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: 11, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.5px", display: "block", marginBottom: 6 }}>Phone</label>
                        {isEditingProfile ? (
                          <input
                            type="tel"
                            value={profile.emergency_contact_phone}
                            onChange={(e) => handleProfileChange("emergency_contact_phone", e.target.value)}
                            style={{ width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                          />
                        ) : (
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1A1A2E" }}>{profile.emergency_contact_phone}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Appointments Modal */}
      {showAppointmentsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => { setShowAppointmentsModal(false); setSelectedAppointment(null); }}>
          <div className="card" style={{ width: "90%", maxWidth: 800, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>All Appointments</h3>
              <button onClick={() => { setShowAppointmentsModal(false); setSelectedAppointment(null); }} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              <button className={`tab-btn ${apptTab === "upcoming" ? "active" : "inactive"}`} onClick={() => setApptTab("upcoming")}>Upcoming ({appointments.filter(a => a.status === "upcoming").length})</button>
              <button className={`tab-btn ${apptTab === "past" ? "active" : "inactive"}`} onClick={() => setApptTab("past")}>Past ({appointments.filter(a => a.status === "completed").length})</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(apptTab === "upcoming" ? appointments.filter(a => a.status === "upcoming") : appointments.filter(a => a.status === "completed")).map(a => (
                <div key={a.id} className="card" style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 24px", background: "#F8FAFC" }}>
                  <div className="avatar" style={{ width: 48, height: 48, fontSize: 18 }}>{a.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E" }}>{a.doctor}</div>
                    <div style={{ fontSize: 13, color: "#64748B" }}>{a.specialty} · {a.clinic}</div>
                    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                      <span style={{ fontSize: 12.5, color: "#0D7377", fontWeight: 600 }}>📅 {a.date} at {a.time}</span>
                      <span className={`badge ${a.type === "Teleconsultation" ? "badge-purple" : "badge-teal"}`}>{a.type}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {a.status === "upcoming" ? (
                      <>
                        {a.type === "Teleconsultation" && <button className="btn-primary" style={{ fontSize: 12 }}>Join Call</button>}
                        <button className="btn-outline" style={{ fontSize: 12 }}>Reschedule</button>
                      </>
                    ) : (
                      <span className="badge badge-green">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions Modal */}
      {showPrescriptionsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPrescriptionsModal(false)}>
          <div className="card" style={{ width: "90%", maxWidth: 700, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>All Prescriptions</h3>
              <button onClick={() => setShowPrescriptionsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {PRESCRIPTIONS.map(p => (
                <div key={p.id} className="card" style={{ padding: "18px 20px", background: "#F8FAFC" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>Prescribed by {p.doctor}</div>
                    </div>
                    <span className={`badge ${p.status === "Active" ? "badge-green" : "badge-amber"}`}>{p.status}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Frequency</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{p.frequency}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>Duration</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>{p.duration}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E2E8F0", fontSize: 11, color: "#64748B" }}>
                    Issued: {p.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lab Results Modal */}
      {showLabResultsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowLabResultsModal(false)}>
          <div className="card" style={{ width: "90%", maxWidth: 700, maxHeight: "80vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>Lab Results</h3>
              <button onClick={() => setShowLabResultsModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { test: "HbA1c (Glucose Control)", value: "6.8%", range: "Normal: <7.0%", status: "Good", date: "Mar 1, 2026" },
                { test: "Lipid Panel", value: "LDL: 95 mg/dL", range: "Target: <100 mg/dL", status: "Good", date: "Mar 1, 2026" },
                { test: "Complete Blood Count", value: "All parameters normal", range: "-", status: "Normal", date: "Feb 15, 2026" },
                { test: "Kidney Function", value: "eGFR: 92 mL/min", range: "Normal: >60", status: "Normal", date: "Feb 15, 2026" },
              ].map((lab, i) => (
                <div key={i} className="card" style={{ padding: "18px 20px", background: "#F8FAFC" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>{lab.test}</div>
                      <div style={{ fontSize: 13, color: "#0D7377", marginTop: 4, fontWeight: 600 }}>{lab.value}</div>
                    </div>
                    <span className="badge badge-green">{lab.status}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 8 }}>
                    Reference: {lab.range}
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #E2E8F0", fontSize: 11, color: "#64748B" }}>
                    Test Date: {lab.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Record Detail Modal */}
      {showRecordDetailModal && selectedRecord && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setShowRecordDetailModal(false)}>
          <div className="card" style={{ width: "95%", maxWidth: 1200, maxHeight: "90vh", overflow: "auto", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #E2E8F0", position: "sticky", top: 0, background: "white", zIndex: 10 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "#1A1A2E", fontFamily: "Syne, sans-serif" }}>{selectedRecord.type}</h3>
                <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>
                  Last updated: {selectedRecord.lastUpdated} by {selectedRecord.updatedBy}
                </div>
              </div>
              <button onClick={() => setShowRecordDetailModal(false)} style={{ background: "none", border: "none", fontSize: 28, cursor: "pointer", color: "#64748B", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, flex: 1 }}>
              {/* Left Panel - Record Details */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      window.print();
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
                  >
                    🖨️ Print Report
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      alert('Share options:\n- Email to doctor\n- Download PDF\n- Share link');
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
                  >
                    📤 Share
                  </button>
                  <button
                    className="btn-outline"
                    onClick={() => {
                      const doctors = appointments.filter(a => a.status === "upcoming").map(a => a.doctor);
                      if (doctors.length > 0) {
                        alert(`Send to:\n${doctors.join('\n')}`);
                      } else {
                        alert('No upcoming appointments. Please book an appointment first.');
                      }
                    }}
                    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}
                  >
                    👨‍⚕️ Send to Doctor
                  </button>
                </div>

                {/* Record Details */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {selectedRecord.records.map((record, idx) => (
                    <div key={idx} style={{ background: "#F8FAFC", borderRadius: 12, padding: 20, border: "1px solid #E2E8F0" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A2E", marginBottom: 12, fontFamily: "Syne, sans-serif" }}>
                        {record.condition || record.allergen || record.medication || record.surgery || record.vaccine || record.name || `Record ${idx + 1}`}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "8px 16px", fontSize: 13 }}>
                        {Object.entries(record).map(([key, value]) => {
                          if (key === 'condition' || key === 'allergen' || key === 'medication' || key === 'surgery' || key === 'vaccine' || key === 'name') return null;
                          return (
                            <div key={key} style={{ display: "contents" }}>
                              <div style={{ color: "#64748B", textTransform: "capitalize", fontWeight: 500 }}>
                                {key.replace(/([A-Z])/g, ' $1').trim()}:
                              </div>
                              <div style={{ color: "#1A1A2E", fontWeight: 600 }}>{value}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - AI Assistant */}
              <div style={{ background: "#F0F4F8", borderRadius: 16, padding: 20, display: "flex", flexDirection: "column", height: "fit-content", maxHeight: "calc(90vh - 200px)", position: "sticky", top: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid #E2E8F0" }}>
                  <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #6C63FF, #a855f7)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>✦</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>AI Health Assistant</div>
                    <div style={{ fontSize: 11, color: "#64748B" }}>Ask about this record</div>
                  </div>
                </div>

                {/* AI Messages */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, maxHeight: 400 }}>
                  {recordAiMessages.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      {msg.role === "ai" && (
                        <div style={{ width: 24, height: 24, background: "linear-gradient(135deg, #6C63FF, #a855f7)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 6, flexShrink: 0, alignSelf: "flex-end" }}>
                          <span style={{ color: "white", fontSize: 10 }}>✦</span>
                        </div>
                      )}
                      <div className={`ai-bubble ${msg.role}`} style={{ maxWidth: "85%", fontSize: 12.5 }}>{msg.text}</div>
                    </div>
                  ))}
                </div>

                {/* Quick Questions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                  {[
                    "What does this mean?",
                    "Any precautions?",
                    "Treatment options?"
                  ].map((q, i) => (
                    <button
                      key={i}
                      className="ai-chip"
                      onClick={() => {
                        setRecordAiMessages(prev => [
                          ...prev,
                          { role: "user", text: q },
                          { role: "ai", text: `Based on your ${selectedRecord.type.toLowerCase()}, ${q.toLowerCase()} This is general information. Please consult your doctor for personalized advice.` }
                        ]);
                      }}
                      style={{ fontSize: 11, padding: "5px 10px" }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* AI Input */}
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    value={recordAiInput}
                    onChange={e => setRecordAiInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && recordAiInput.trim()) {
                        setRecordAiMessages(prev => [
                          ...prev,
                          { role: "user", text: recordAiInput },
                          { role: "ai", text: `Regarding your question about ${selectedRecord.type.toLowerCase()}: "${recordAiInput}" - I'd recommend discussing this with your healthcare provider for personalized guidance based on your complete medical history.` }
                        ]);
                        setRecordAiInput("");
                      }
                    }}
                    placeholder="Ask AI about this record..."
                    style={{ flex: 1, background: "white", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: "#1A1A2E", outline: "none" }}
                  />
                  <button
                    className="btn-primary"
                    onClick={() => {
                      if (recordAiInput.trim()) {
                        setRecordAiMessages(prev => [
                          ...prev,
                          { role: "user", text: recordAiInput },
                          { role: "ai", text: `Regarding your question about ${selectedRecord.type.toLowerCase()}: "${recordAiInput}" - I'd recommend discussing this with your healthcare provider for personalized guidance based on your complete medical history.` }
                        ]);
                        setRecordAiInput("");
                      }
                    }}
                    style={{ background: "linear-gradient(135deg, #6C63FF, #a855f7)", padding: "8px 14px", fontSize: 12 }}
                  >
                    Send
                  </button>
                </div>

                <div style={{ marginTop: 10, fontSize: 10, color: "#94A3B8", textAlign: "center", lineHeight: 1.4 }}>
                  ⚠️ AI provides general information only.<br/>Consult your doctor for medical advice.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowBookingModal(false)}>
          <div className="card" style={{ width: "90%", maxWidth: 600, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #E2E8F0" }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1A1A2E" }}>Book New Appointment</h3>
              <button onClick={() => setShowBookingModal(false)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#64748B" }}>×</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Specialty *</label>
                <select
                  value={bookingForm.specialty}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, specialty: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                >
                  <option value="">Select specialty</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="General Practice">General Practice</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Psychiatry">Psychiatry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Preferred Doctor (Optional)</label>
                <input
                  type="text"
                  value={bookingForm.doctor}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, doctor: e.target.value }))}
                  placeholder="e.g., Dr. Layla Al Mansoori"
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Date *</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value, time: '' }))}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit" }}
                />
              </div>

              {bookingForm.date && (
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Available Time Slots (45 min each) *</label>
                  {availableSlots.length > 0 ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, maxHeight: 200, overflowY: "auto", padding: 2 }}>
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setBookingForm(prev => ({ ...prev, time: slot.time }))}
                          disabled={!slot.available}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 6,
                            fontSize: 12.5,
                            fontWeight: 600,
                            fontFamily: "inherit",
                            cursor: slot.available ? "pointer" : "not-allowed",
                            border: bookingForm.time === slot.time ? "2px solid #0D7377" : "1.5px solid #E2E8F0",
                            background: !slot.available ? "#F8FAFC" : bookingForm.time === slot.time ? "#E6F4F4" : "white",
                            color: !slot.available ? "#CBD5E1" : bookingForm.time === slot.time ? "#0D7377" : "#1A1A2E",
                            transition: "all 0.15s"
                          }}
                        >
                          {slot.time}
                          {!slot.available && <div style={{ fontSize: 9, marginTop: 2, color: "#94A3B8" }}>Booked</div>}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: 20, textAlign: "center", color: "#94A3B8", fontSize: 13 }}>
                      Select a date to see available time slots
                    </div>
                  )}
                </div>
              )}

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Appointment Type *</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setBookingForm(prev => ({ ...prev, type: 'In-Clinic' }))}
                    className={bookingForm.type === 'In-Clinic' ? 'btn-primary' : 'btn-outline'}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    🏥 In-Clinic
                  </button>
                  <button
                    onClick={() => setBookingForm(prev => ({ ...prev, type: 'Teleconsultation' }))}
                    className={bookingForm.type === 'Teleconsultation' ? 'btn-primary' : 'btn-outline'}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    📹 Teleconsultation
                  </button>
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 6 }}>Reason for Visit *</label>
                <textarea
                  value={bookingForm.reason}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Please describe your symptoms or reason for consultation"
                  rows={4}
                  style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E2E8F0", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button className="btn-outline" onClick={() => setShowBookingModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleBookAppointment}
                  style={{ flex: 1 }}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRefillModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, maxWidth: 500, width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #0D7377, #14FFEC)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(13,115,119,0.3)" }}>
                  <span style={{ fontSize: 28 }}>📨</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>Request Refill</h3>
                  <p style={{ fontSize: 14, color: "#64748B" }}>{selectedPrescription?.name}</p>
                </div>
              </div>

              <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>ℹ️</span>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E" }}>Refill Details</p>
                </div>
                <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>
                  Your refill request will be sent to <strong>{selectedPrescription?.doctor}</strong> for approval. You'll receive a notification once it's approved, and your pharmacy will be notified.
                </p>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 8 }}>Preferred Pharmacy</label>
                <select
                  value={refillForm.pharmacy}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, pharmacy: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", border: "2px solid #E2E8F0", borderRadius: 12, fontSize: 14, fontFamily: "inherit", cursor: "pointer" }}>
                  <option value="Dubai Pharmacy">Dubai Pharmacy</option>
                  <option value="HealthPlus Pharmacy">HealthPlus Pharmacy</option>
                  <option value="Care Pharmacy">Care Pharmacy</option>
                  <option value="Express Pharmacy">Express Pharmacy</option>
                </select>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#1A1A2E", display: "block", marginBottom: 8 }}>Additional Notes (Optional)</label>
                <textarea
                  value={refillForm.notes}
                  onChange={(e) => setRefillForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional information for your doctor..."
                  rows={3}
                  style={{ width: "100%", padding: "12px 14px", border: "2px solid #E2E8F0", borderRadius: 12, fontSize: 13, fontFamily: "inherit", resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => { setShowRefillModal(false); setRefillForm({ pharmacy: 'Dubai Pharmacy', notes: '' }); }}
                  style={{ flex: 1, padding: "12px 20px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#64748B", cursor: "pointer", background: "white", transition: "all 0.2s" }}>
                  Cancel
                </button>
                <button
                  onClick={() => { alert(`Refill request sent to ${selectedPrescription?.doctor}. Status: Pending Approval`); setShowRefillModal(false); setRefillForm({ pharmacy: 'Dubai Pharmacy', notes: '' }); }}
                  style={{ flex: 1, padding: "12px 20px", background: "linear-gradient(135deg, #0D7377, #0a5d61)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "white", cursor: "pointer", boxShadow: "0 4px 12px rgba(13,115,119,0.3)", transition: "all 0.2s" }}>
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCalendarModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
          <div style={{ background: "white", borderRadius: 20, maxWidth: 450, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #14FFEC, #0fc9ba)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(20,255,236,0.3)" }}>
                  <span style={{ fontSize: 28 }}>📅</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 24, fontWeight: 700, color: "#1A1A2E", marginBottom: 4 }}>Add to Calendar</h3>
                  <p style={{ fontSize: 14, color: "#64748B" }}>Medication Reminder</p>
                </div>
              </div>

              <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1A1A2E", marginBottom: 8 }}>{calendarPrescription?.name}</p>
                <p style={{ fontSize: 12, color: "#64748B" }}>{calendarPrescription?.frequency} • {calendarPrescription?.duration}</p>
              </div>

              <p style={{ fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 1.6 }}>
                Choose your preferred calendar to set up daily medication reminders:
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                <button
                  onClick={() => { alert('Opening Google Calendar...'); setShowCalendarModal(false); }}
                  style={{ padding: "16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#1A1A2E", cursor: "pointer", background: "white", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#0D7377"; e.target.style.background = "#e6f7f8"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "white"; }}>
                  <span style={{ fontSize: 24 }}>📆</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>Google Calendar</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>Add reminders to your Google account</div>
                  </div>
                </button>

                <button
                  onClick={() => { alert('Opening Apple Calendar...'); setShowCalendarModal(false); }}
                  style={{ padding: "16px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#1A1A2E", cursor: "pointer", background: "white", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 12 }}
                  onMouseEnter={(e) => { e.target.style.borderColor = "#0D7377"; e.target.style.background = "#e6f7f8"; }}
                  onMouseLeave={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "white"; }}>
                  <span style={{ fontSize: 24 }}>🍎</span>
                  <div style={{ flex: 1, textAlign: "left" }}>
                    <div style={{ fontWeight: 700 }}>Apple Calendar</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>Add reminders to your iPhone/Mac</div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowCalendarModal(false)}
                style={{ width: "100%", marginTop: 20, padding: "12px 20px", border: "2px solid #e2e8f0", borderRadius: 12, fontSize: 14, fontWeight: 700, color: "#64748B", cursor: "pointer", background: "white" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
