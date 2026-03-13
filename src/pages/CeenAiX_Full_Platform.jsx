import { useState } from "react";

const T = {
  teal:"#0D7377",tealL:"#14BDBD",tealPale:"#E8F4F4",tealMid:"#0a5c60",
  navy:"#0F2137",bg:"#F2F6FA",card:"#FFFFFF",border:"#DDE8F0",
  text:"#0F2137",textM:"#3D5A6E",textL:"#7A96A8",textF:"#B0C4CE",
  green:"#1A9E5C",greenP:"#E6F9F0",red:"#DC2626",redP:"#FEE8E8",
  amber:"#D97706",amberP:"#FEF3E2",purple:"#6C63FF",purpleP:"#EFEDFF",
  blue:"#2563EB",blueP:"#EFF6FF",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Lora:wght@700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Outfit','Segoe UI',sans-serif;background:#F2F6FA}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#0D7377;border-radius:4px}
.card{background:#fff;border-radius:16px;padding:22px;box-shadow:0 1px 4px rgba(13,115,119,0.07),0 4px 18px rgba(13,115,119,0.05);transition:all 0.2s}
.ch:hover{box-shadow:0 6px 28px rgba(13,115,119,0.13);transform:translateY(-1px)}
.nav-i{transition:all 0.15s;cursor:pointer;border-radius:10px;display:flex;align-items:center;gap:10px;padding:9px 11px;color:#3D5A6E;font-size:13px;font-weight:500}
.nav-i:hover{background:#E8F4F4;color:#0D7377}
.nav-i.act{background:#0D7377;color:#fff}
.bdg{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.2px}
.tl{background:#E8F4F4;color:#0D7377}.gr{background:#E6F9F0;color:#1A9E5C}
.am{background:#FEF3E2;color:#D97706}.rd{background:#FEE8E8;color:#DC2626}
.pu{background:#EFEDFF;color:#6C63FF}.bl{background:#EFF6FF;color:#2563EB}
.ac{background:rgba(13,115,119,0.12);color:#0D7377;border:1px solid rgba(13,115,119,0.25);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.6}}
.btn{border:none;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;transition:all .18s;font-family:inherit;display:inline-flex;align-items:center;gap:6px;padding:8px 16px}
.bp{background:#0D7377;color:#fff}.bp:hover{background:#0a5c60;box-shadow:0 4px 14px rgba(13,115,119,0.3);transform:translateY(-1px)}
.bo{background:transparent;color:#0D7377;border:1.5px solid #0D7377}.bo:hover{background:#E8F4F4}
.bg{background:#F2F6FA;color:#3D5A6E;border:1px solid #DDE8F0}.bg:hover{background:#E8F4F4;color:#0D7377;border-color:#0D7377}
.bd{background:#FEE8E8;color:#DC2626;border:1px solid #FECACA}.bd:hover{background:#DC2626;color:#fff}
.sm{padding:5px 11px;font-size:12px}
.inp{background:#F2F6FA;border:1.5px solid #DDE8F0;border-radius:10px;padding:9px 13px;font-size:13.5px;color:#0F2137;font-family:inherit;outline:none;transition:border-color .18s;width:100%}
.inp:focus{border-color:#0D7377;background:#fff}
.inp::placeholder{color:#B0C4CE}
select.inp option{background:#fff}
.ava{border-radius:50%;background:linear-gradient(135deg,#0D7377,#14BDBD);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.stit{font-family:'Lora',serif;font-size:25px;font-weight:800;color:#0F2137;margin-bottom:3px}
.ssub{font-size:13px;color:#7A96A8;margin-bottom:22px}
.pbar{height:5px;background:#E8F4F4;border-radius:4px;overflow:hidden}
.pfill{height:100%;background:linear-gradient(90deg,#0D7377,#14BDBD);border-radius:4px}
.tb{padding:7px 16px;border-radius:8px;border:none;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .18s}
.ta{background:#0D7377;color:#fff}.ti{background:transparent;color:#7A96A8}.ti:hover{color:#0D7377;background:#E8F4F4}
.mb{max-width:70%;padding:9px 13px;border-radius:13px;font-size:13px;line-height:1.5}
.mr{background:#0D7377;color:#fff;border-radius:13px 3px 13px 13px;margin-left:auto}
.ml{background:#fff;color:#0F2137;border:1px solid #DDE8F0;border-radius:3px 13px 13px 13px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.ar{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:11px;border:1px solid transparent;transition:all .18s;margin-bottom:7px;cursor:pointer}
.ar:hover{background:#E8F4F4;border-color:#14BDBD}
.ar.an{background:#E8F4F4;border-left:3px solid #0D7377;border-color:#0D7377}
@keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fi .28s ease forwards}
`;

const Av = ({l,s=38}) => <div className="ava" style={{width:s,height:s,fontSize:s*.38}}>{l}</div>;
const Bdg = ({t="tl",children}) => <span className={`bdg ${t}`}>{children}</span>;
const SC = ({icon,label,value,sub,color=T.teal}) => (
  <div className="card fi">
    <div style={{fontSize:20,marginBottom:8}}>{icon}</div>
    <div style={{fontFamily:"Lora,serif",fontSize:26,fontWeight:800,color}}>{value}</div>
    <div style={{fontSize:12,fontWeight:600,color:T.textM,marginTop:2}}>{label}</div>
    {sub&&<div style={{fontSize:11,color:T.textF,marginTop:2}}>{sub}</div>}
  </div>
);
const SH = ({title,sub,action}) => (
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:22}}>
    <div><div className="stit">{title}</div>{sub&&<div className="ssub">{sub}</div>}</div>
    {action}
  </div>
);

function Sidebar({items,active,setActive,open,name,role,onLogoClick}) {
  return (
    <div style={{width:open?228:64,background:"#fff",borderRight:`1px solid ${T.border}`,display:"flex",flexDirection:"column",padding:"18px 10px",position:"sticky",top:0,height:"100vh",overflowY:"auto",transition:"width .24s ease",flexShrink:0}}>
      <button onClick={onLogoClick} style={{display:"flex",alignItems:"center",gap:9,padding:"0 7px",marginBottom:26,border:"none",background:"transparent",cursor:"pointer",transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" style={{height:120,width:"auto"}}/>
      </button>
      {open&&<div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:"1px",padding:"0 11px",marginBottom:7}}>{role}</div>}
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
        {items.map(item=>(
          <div key={item.id} className={`nav-i ${active===item.id?"act":""}`} onClick={()=>setActive(item.id)}>
            <span style={{fontSize:16,flexShrink:0}}>{item.icon}</span>
            {open&&<span>{item.label}</span>}
            {item.badge&&open&&<span style={{marginLeft:"auto",background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px"}}>{item.badge}</span>}
          </div>
        ))}
      </div>
      {open&&(
        <div style={{borderTop:`1px solid ${T.border}`,paddingTop:12,display:"flex",alignItems:"center",gap:9}}>
          <Av l={name[0]} s={32}/>
          <div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{name}</div><div style={{fontSize:10.5,color:T.textF}}>{role}</div></div>
        </div>
      )}
    </div>
  );
}

function Topbar({onToggle,onLogout,name}) {
  return (
    <div style={{background:"#fff",borderBottom:`1px solid ${T.border}`,padding:"11px 26px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onToggle} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:T.textL}}>☰</button>
        <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"7px 14px",display:"flex",alignItems:"center",gap:7,width:240}}>
          <span style={{color:T.textF}}>🔍</span><span style={{fontSize:13,color:T.textF}}>Search...</span>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:12,color:T.textF}}>Thu 12 Mar 2026</span>
        <div style={{position:"relative"}}><span style={{fontSize:19,cursor:"pointer"}}>🔔</span><span style={{position:"absolute",top:-2,right:-2,width:7,height:7,background:"#EF4444",borderRadius:"50%",border:"2px solid #fff"}}></span></div>
        <Av l={name[0]} s={32}/>
        <button className="btn bg sm" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}

function Portal({nav,active,setActive,children,name,role,onLogout,onLogoClick}) {
  const [open,setOpen]=useState(true);
  return (
    <div style={{display:"flex",minHeight:"100vh",background:T.bg}}>
      <Sidebar items={nav} active={active} setActive={setActive} open={open} name={name} role={role} onLogoClick={onLogoClick}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <Topbar onToggle={()=>setOpen(p=>!p)} onLogout={onLogout} name={name}/>
        <div style={{flex:1,overflowY:"auto",maxHeight:"calc(100vh - 57px)"}}>
          <div style={{padding:"26px 30px"}} className="fi">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const DOCTORS=[
  {id:1,name:"Dr. Layla Al Mansoori",spec:"Cardiologist",clinic:"Dubai Heart Center",rating:4.9,avail:"Today",fee:350,lang:"Arabic, English",dha:true,av:"L",exp:12},
  {id:2,name:"Dr. Rami Khalil",spec:"General Practitioner",clinic:"HealthFirst Clinic",rating:4.7,avail:"Tomorrow",fee:200,lang:"Arabic, English, French",dha:true,av:"R",exp:8},
  {id:3,name:"Dr. Sara Nasser",spec:"Dermatologist",clinic:"Skin & Care Dubai",rating:4.8,avail:"Mar 15",fee:280,lang:"Arabic, English",dha:true,av:"S",exp:10},
  {id:4,name:"Dr. Ahmed Farhan",spec:"Orthopedist",clinic:"City Medical Center",rating:4.6,avail:"Mar 16",fee:320,lang:"English, Hindi",dha:true,av:"A",exp:15},
  {id:5,name:"Dr. Priya Menon",spec:"Pediatrician",clinic:"Mediclinic City",rating:4.9,avail:"Today",fee:250,lang:"English, Hindi",dha:true,av:"P",exp:11},
];
const CLINICS=[
  {id:1,name:"Dubai Heart Center",type:"Specialty Center",area:"Downtown Dubai",specs:["Cardiology","Vascular"],doctors:8,hours:"8AM–8PM"},
  {id:2,name:"HealthFirst Clinic",type:"General Clinic",area:"Jumeirah",specs:["General","Family Medicine"],doctors:5,hours:"7AM–10PM"},
  {id:3,name:"Mediclinic City",type:"Hospital",area:"Healthcare City",specs:["Multi-specialty"],doctors:120,hours:"24/7"},
  {id:4,name:"Skin & Care Dubai",type:"Specialty Clinic",area:"Business Bay",specs:["Dermatology","Aesthetics"],doctors:4,hours:"9AM–7PM"},
];
const PHARMACIES=[
  {id:1,name:"LifeCare Pharmacy",area:"Downtown Dubai",hours:"8AM–12AM",delivery:true},
  {id:2,name:"MedPlus Dubai",area:"Jumeirah",hours:"24 Hours",delivery:true},
  {id:3,name:"Al Manara Pharmacy",area:"Deira",hours:"8AM–11PM",delivery:false},
];
const LABS=[
  {id:1,name:"LifeLab Dubai",area:"Healthcare City",home:true,tests:["CBC","HbA1c","Lipid Panel","Thyroid","Liver Function"]},
  {id:2,name:"AlMana Medical Lab",area:"Deira",home:false,tests:["PCR","Urine Analysis","Hormones","Vitamins"]},
  {id:3,name:"Synlab UAE",area:"Business Bay",home:true,tests:["Genetics","Oncology Markers","Metabolic Panel"]},
];
const INSURERS=[
  {id:1,name:"Daman",plans:["Basic","Enhanced","Thiqa"],clinics:48},
  {id:2,name:"AXA Gulf",plans:["Smart","Select","Elite"],clinics:62},
  {id:3,name:"MetLife",plans:["Core","Core Plus","Premier"],clinics:35},
];
const P_APPTS=[
  {id:1,doc:"Dr. Layla Al Mansoori",spec:"Cardiologist",date:"Today",time:"11:00 AM",type:"In-Clinic",status:"upcoming",av:"L"},
  {id:2,doc:"Dr. Rami Khalil",spec:"GP",date:"Mar 15",time:"2:30 PM",type:"Teleconsultation",status:"upcoming",av:"R"},
  {id:3,doc:"Dr. Sara Nasser",spec:"Dermatologist",date:"Feb 28",time:"10:00 AM",type:"In-Clinic",status:"completed",av:"S"},
];
const D_APPTS=[
  {id:1,patient:"Fatima Al Rashid",age:34,time:"09:00",type:"In-Clinic",cond:"Diabetes follow-up",status:"completed",av:"F"},
  {id:2,patient:"Mohammed Al Zaabi",age:52,time:"10:00",type:"In-Clinic",cond:"Hypertension review",status:"completed",av:"M"},
  {id:3,patient:"Parnia Yazdkhasti",age:38,time:"11:00",type:"In-Clinic",cond:"Cardiac check-up",status:"active",av:"P"},
  {id:4,patient:"Aisha Noor",age:29,time:"12:30",type:"Teleconsultation",cond:"New patient — chest pain",status:"upcoming",av:"A"},
  {id:5,patient:"Rajan Pillai",age:45,time:"14:00",type:"In-Clinic",cond:"ECG review",status:"upcoming",av:"R"},
  {id:6,patient:"Sara Al Hashimi",age:61,time:"15:30",type:"Teleconsultation",cond:"Medication adjustment",status:"upcoming",av:"S"},
];
const PENDING_DRS=[
  {id:1,name:"Dr. Khalid Rashid",spec:"Orthopedist",dha:"DHA-2024-KR-9981",clinic:"Emirates Hospital",sub:"Mar 10, 2026",flag:"Unmatched"},
  {id:2,name:"Dr. Nadia Hussain",spec:"Gynecologist",dha:"DHA-2023-NH-4421",clinic:"City Medical Center",sub:"Mar 11, 2026",flag:"Pending"},
  {id:3,name:"Dr. Samuel Okafor",spec:"Neurologist",dha:"DHA-2025-SO-7731",clinic:"Mediclinic City",sub:"Mar 12, 2026",flag:"Valid"},
];
const ALL_USERS=[
  {id:1,name:"Parnia Yazdkhasti",role:"Patient",email:"parnia@aryaix.com",joined:"Jan 2026",status:"Active"},
  {id:2,name:"Dr. Layla Al Mansoori",role:"Doctor",email:"layla@dhc.ae",joined:"Dec 2025",status:"Active"},
  {id:3,name:"Mohammed Al Zaabi",role:"Patient",email:"m.alzaabi@email.com",joined:"Feb 2026",status:"Active"},
  {id:4,name:"Dr. Khalid Rashid",role:"Doctor",email:"k.rashid@email.com",joined:"Mar 2026",status:"Pending"},
  {id:5,name:"Fatima Al Rashid",role:"Patient",email:"fatima@email.com",joined:"Jan 2026",status:"Active"},
];

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function LoginScreen({onLogin}) {
  const [sel,setSel]=useState(null);
  const roles=[
    {id:"patient",label:"Patient",icon:"🧑‍⚕️",desc:"Book appointments & manage your health"},
    {id:"doctor",label:"Doctor",icon:"👨‍⚕️",desc:"Manage patients & consultations"},
    {id:"clinic",label:"Clinic / Hospital",icon:"🏥",desc:"Manage your facility & staff"},
    {id:"pharmacy",label:"Pharmacy & Lab",icon:"💊",desc:"Manage catalogue & referrals"},
    {id:"insurance",label:"Insurance",icon:"🛡️",desc:"Manage claims & providers"},
    {id:"admin",label:"Super Admin",icon:"⚙️",desc:"Full platform management"},
  ];
  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${T.teal} 0%,${T.tealL} 55%,#C8E8E8 100%)`,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{CSS}</style>
      <div style={{background:"#fff",borderRadius:22,padding:"44px 48px",width:560,boxShadow:"0 24px 80px rgba(13,115,119,0.18)"}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontFamily:"Lora,serif",fontSize:34,fontWeight:800,color:T.teal,marginBottom:5}}>CeenAiX</div>
          <div style={{fontSize:13.5,color:T.textL}}>AI-Native Healthcare Intelligence for the UAE</div>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:13,textAlign:"center"}}>Select your role to continue</div>
        <div className="g2" style={{gap:10,marginBottom:26}}>
          {roles.map(r=>(
            <div key={r.id} onClick={()=>setSel(r.id)} style={{border:`2px solid ${sel===r.id?T.teal:T.border}`,borderRadius:13,padding:"14px 16px",cursor:"pointer",background:sel===r.id?T.tealPale:"#fff",transition:"all .18s"}}>
              <div style={{fontSize:20,marginBottom:5}}>{r.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:sel===r.id?T.teal:T.text}}>{r.label}</div>
              <div style={{fontSize:11,color:T.textL,marginTop:2}}>{r.desc}</div>
            </div>
          ))}
        </div>
        <button className="btn bp" style={{width:"100%",justifyContent:"center",padding:"12px",fontSize:14}} disabled={!sel} onClick={()=>sel&&onLogin(sel)}>
          {sel?`Enter as ${roles.find(r=>r.id===sel)?.label}`:"Select a role to continue"}
        </button>
        <div style={{textAlign:"center",marginTop:14,fontSize:11.5,color:T.textF}}>DHA Licensed · Nabidh Integrated · UAE Data Residency</div>
      </div>
    </div>
  );
}

// ── LANDING PAGE ──────────────────────────────────────────────────────────────
function LandingPage({onLogin,onLogoClick}) {
  const [tab,setTab]=useState("doctors");
  const [search,setSearch]=useState("");
  const tabs=["doctors","clinics","pharmacies","labs","insurance"];
  const fd=DOCTORS.filter(d=>d.name.toLowerCase().includes(search.toLowerCase())||d.spec.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{fontFamily:"Outfit,'Segoe UI',sans-serif",background:T.bg,minHeight:"100vh"}}>
      <style>{CSS}</style>
      <nav style={{background:"#fff",borderBottom:`1px solid ${T.border}`,padding:"13px 44px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <button onClick={onLogoClick} style={{border:"none",background:"transparent",cursor:"pointer",padding:0,transition:"opacity .2s"}} onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <img src="/ChatGPT_Image_Feb_27,_2026,_11_29_01_AM.png" alt="CeenAiX" style={{height:100,width:"auto"}}/>
        </button>
        <div style={{display:"flex",gap:22,fontSize:13,fontWeight:500,color:T.textM}}>
          {["Find Care","For Patients","For Doctors","About"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="btn bg sm" onClick={()=>onLogin("patient")}>Log In</button>
          <button className="btn bp sm" onClick={()=>onLogin("patient")}>Sign Up Free</button>
        </div>
      </nav>

      <div style={{background:`linear-gradient(135deg,${T.teal} 0%,${T.tealL} 60%,#C8E8E8 100%)`,padding:"64px 44px 52px",textAlign:"center"}}>
        <div style={{fontFamily:"Lora,serif",fontSize:50,fontWeight:800,color:"#fff",margin:"16px 0 14px",lineHeight:1.1}}>Your Health,<br/>Intelligently Managed.</div>
        <div style={{fontSize:16,color:"rgba(255,255,255,.85)",marginBottom:32,maxWidth:520,margin:"0 auto 32px"}}>Find DHA-licensed doctors, book appointments, manage your health records, and access AI-powered care — built for the UAE.</div>
        <div style={{maxWidth:620,margin:"0 auto 20px",background:"#fff",borderRadius:16,padding:"7px 7px 7px 18px",display:"flex",alignItems:"center",gap:9,boxShadow:"0 8px 32px rgba(0,0,0,.12)"}}>
          <span style={{fontSize:17}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search doctors, specialties, clinics..." style={{flex:1,border:"none",outline:"none",fontSize:14.5,color:T.text,background:"transparent",fontFamily:"Outfit,sans-serif"}}/>
          <button className="btn bp" style={{borderRadius:11}}>Find Care</button>
        </div>
        <div style={{display:"flex",gap:7,justifyContent:"center",flexWrap:"wrap"}}>
          {tabs.map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:"7px 18px",borderRadius:18,border:`1.5px solid ${tab===t?"#fff":"rgba(255,255,255,.3)"}`,background:tab===t?"#fff":"rgba(255,255,255,.12)",color:tab===t?T.teal:"#fff",fontWeight:600,fontSize:12.5,cursor:"pointer",fontFamily:"inherit",transition:"all .18s"}}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"30px 44px"}}>
        {tab==="doctors"&&(
          <div>
            <div style={{fontSize:12.5,color:T.textL,marginBottom:14}}>{fd.length} doctors found</div>
            <div className="g3" style={{gap:16}}>
              {fd.map(d=>(
                <div key={d.id} className="card ch" style={{border:"1.5px solid transparent",cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#14BDBD"} onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                  <div style={{display:"flex",gap:11,marginBottom:12}}>
                    <Av l={d.av} s={50}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:T.text}}>{d.name}</div>
                      <div style={{fontSize:12,color:T.textL}}>{d.spec}</div>
                      {d.dha&&<Bdg t="gr">✓ DHA</Bdg>}
                    </div>
                  </div>
                  <div style={{fontSize:12,color:T.textL,marginBottom:11}}>
                    <div>🏥 {d.clinic}</div>
                    <div style={{marginTop:3}}>⭐ {d.rating} · {d.exp} yrs · {d.lang}</div>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${T.border}`,paddingTop:11}}>
                    <div><div style={{fontSize:10.5,color:T.textF}}>From</div><div style={{fontSize:15,fontWeight:700,color:T.teal}}>AED {d.fee}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:10.5,color:T.textF}}>Next avail.</div><div style={{fontSize:12,fontWeight:600,color:T.green}}>{d.avail}</div></div>
                    <button className="btn bp sm" onClick={()=>onLogin("patient")}>Book</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab==="clinics"&&(
          <div className="g3" style={{gap:16}}>
            {CLINICS.map(c=>(
              <div key={c.id} className="card ch">
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontSize:22}}>🏥</span><Bdg t="gr">DHA ✓</Bdg>
                </div>
                <div style={{fontSize:14.5,fontWeight:700,color:T.text,marginBottom:4}}>{c.name}</div>
                <div style={{fontSize:12,color:T.textL,marginBottom:10}}>📍 {c.area} · {c.type}<br/>🕐 {c.hours} · {c.doctors} doctors</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{c.specs.map(s=><Bdg key={s} t="tl">{s}</Bdg>)}</div>
                <button className="btn bo sm" style={{marginTop:12,width:"100%",justifyContent:"center"}} onClick={()=>onLogin("patient")}>View Clinic</button>
              </div>
            ))}
          </div>
        )}
        {tab==="pharmacies"&&(
          <div className="g3" style={{gap:16}}>
            {PHARMACIES.map(p=>(
              <div key={p.id} className="card ch">
                <div style={{fontSize:22,marginBottom:9}}>💊</div>
                <div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{p.name}</div>
                <div style={{fontSize:12,color:T.textL,marginTop:4}}>📍 {p.area} · 🕐 {p.hours}</div>
                <div style={{display:"flex",gap:7,marginTop:9}}>
                  <Bdg t="gr">● Open</Bdg>
                  {p.delivery&&<Bdg t="bl">🚗 Delivery</Bdg>}
                </div>
                <button className="btn bo sm" style={{marginTop:12,width:"100%",justifyContent:"center"}}>View Catalogue</button>
              </div>
            ))}
          </div>
        )}
        {tab==="labs"&&(
          <div className="g3" style={{gap:16}}>
            {LABS.map(l=>(
              <div key={l.id} className="card ch">
                <div style={{fontSize:22,marginBottom:9}}>🔬</div>
                <div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{l.name}</div>
                <div style={{fontSize:12,color:T.textL,marginTop:4}}>📍 {l.area}</div>
                {l.home&&<div style={{marginTop:7}}><Bdg t="pu">🏠 Home Sample</Bdg></div>}
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:9}}>
                  {l.tests.slice(0,3).map(t=><Bdg key={t} t="tl">{t}</Bdg>)}
                  {l.tests.length>3&&<Bdg t="am">+{l.tests.length-3}</Bdg>}
                </div>
                <button className="btn bo sm" style={{marginTop:12,width:"100%",justifyContent:"center"}}>View Tests</button>
              </div>
            ))}
          </div>
        )}
        {tab==="insurance"&&(
          <div className="g3" style={{gap:16}}>
            {INSURERS.map(ins=>(
              <div key={ins.id} className="card ch">
                <div style={{fontSize:22,marginBottom:9}}>🛡️</div>
                <div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{ins.name}</div>
                <div style={{fontSize:12,color:T.textL,marginTop:4}}>{ins.clinics} clinics on CeenAiX</div>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:9}}>{ins.plans.map(p=><Bdg key={p} t="bl">{p}</Bdg>)}</div>
                <button className="btn bo sm" style={{marginTop:12,width:"100%",justifyContent:"center"}}>Check Coverage</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{background:"#fff",padding:"56px 44px",textAlign:"center"}}>
        <div style={{fontFamily:"Lora,serif",fontSize:32,fontWeight:800,color:T.text,marginBottom:7}}>How CeenAiX Works</div>
        <div style={{fontSize:13.5,color:T.textL,marginBottom:44}}>Three steps to smarter healthcare</div>
        <div className="g3" style={{maxWidth:860,margin:"0 auto"}}>
          {[
            {n:"01",icon:"🔍",title:"Search & Discover",desc:"Find DHA-licensed doctors, clinics, pharmacies and labs across the UAE."},
            {n:"02",icon:"📅",title:"Book & Consult",desc:"Book in-clinic or teleconsultation appointments. Video call and message your doctor."},
            {n:"03",icon:"🗂",title:"Your Health, Connected",desc:"Records, prescriptions, lab results — all in one place, powered by AI."},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center",padding:"0 14px"}}>
              <div style={{fontFamily:"Lora,serif",fontSize:44,fontWeight:800,color:T.tealPale,lineHeight:1}}>{s.n}</div>
              <div style={{fontSize:30,margin:"6px 0"}}>{s.icon}</div>
              <div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:7}}>{s.title}</div>
              <div style={{fontSize:13,color:T.textL,lineHeight:1.65}}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:T.teal,padding:"22px 44px",display:"flex",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
        {["DHA Licensed","Nabidh HIE Integrated","FHIR R4","End-to-End Encrypted","UAE Data Residency"].map(t=>(
          <div key={t} style={{display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,.9)",fontSize:12.5,fontWeight:600}}>
            <span style={{color:T.tealL}}>✓</span>{t}
          </div>
        ))}
      </div>

      <div style={{padding:"64px 44px",textAlign:"center",background:T.bg}}>
        <div style={{fontFamily:"Lora,serif",fontSize:36,fontWeight:800,color:T.text,marginBottom:10}}>Be Among the First</div>
        <div style={{fontSize:14,color:T.textL,marginBottom:32}}>Launching across Dubai. Join the waitlist today.</div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn bp" style={{fontSize:13.5,padding:"11px 26px"}} onClick={()=>onLogin("patient")}>I'm a Patient →</button>
          <button className="btn bo" style={{fontSize:13.5,padding:"11px 26px"}} onClick={()=>onLogin("doctor")}>I'm a Doctor →</button>
        </div>
      </div>

      <div style={{background:T.navy,padding:"24px 44px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"Lora,serif",fontWeight:800,fontSize:17,color:T.tealL}}>CeenAiX</span>
        <span style={{fontSize:11.5,color:"#334155"}}>© 2026 CeenAiX · AryAiX Intelligent Ventures · Dubai, UAE</span>
        <div style={{display:"flex",gap:14,fontSize:12,color:"#334155"}}>
          {["Privacy","Terms","Contact"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}
        </div>
      </div>
    </div>
  );
}

// ── PATIENT PORTAL ────────────────────────────────────────────────────────────
function PatientPortal({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const [apptTab,setApptTab]=useState("upcoming");
  const [aiMsgs,setAiMsgs]=useState([{from:"ai",text:"Hi Parnia 👋 I'm your CeenAiX AI Health Assistant. Ask me about your health, medications, or lab results."}]);
  const [aiIn,setAiIn]=useState("");
  const [chatIn,setChatIn]=useState("");
  const [chatMsgs,setChatMsgs]=useState([]);
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"appointments",icon:"📅",label:"My Appointments"},
    {id:"records",icon:"🗂",label:"Health Records"},
    {id:"prescriptions",icon:"💊",label:"Prescriptions"},
    {id:"labs",icon:"🔬",label:"Lab Results"},
    {id:"messages",icon:"💬",label:"Messages"},
    {id:"ai",icon:"✦",label:"AI Assistant"},
    {id:"findcare",icon:"🔍",label:"Find Care"},
    {id:"profile",icon:"👤",label:"My Profile"},
  ];
  const sendAi=(t)=>{
    const txt=t||aiIn; if(!txt.trim()) return;
    const replies={"medications":"Your Metformin and Atorvastatin have no major interactions. Stay hydrated and avoid large amounts of grapefruit juice with Atorvastatin.","hba1c":"Your latest HbA1c is 6.8% — pre-diabetic range, being managed with Metformin. Discuss with Dr. Al Mansoori at your next visit.","cardiologist":"Top cardiologists on CeenAiX: Dr. Layla Al Mansoori (Dubai Heart Center), Dr. Khalid Rashid (Emirates Hospital). Book now?","headache":"For mild headaches: rest, hydrate, paracetamol. Seek emergency care if severe, sudden, or with fever/vision changes."};
    const rep=Object.entries(replies).find(([k])=>txt.toLowerCase().includes(k))?.[1]||"Based on your profile, I'd recommend consulting your doctor for a personalized assessment. Would you like me to help book an appointment?";
    setAiMsgs(p=>[...p,{from:"user",text:txt},{from:"ai",text:rep}]);
    setAiIn("");
  };
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="Parnia Y." role="Patient" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {active==="home"&&(
        <div>
          <div style={{background:`linear-gradient(135deg,${T.teal},${T.tealL})`,borderRadius:18,padding:"26px 30px",marginBottom:22,color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-16,top:-16,width:160,height:160,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}></div>
            <div style={{fontSize:11.5,opacity:.8,marginBottom:3,textTransform:"uppercase",letterSpacing:".5px"}}>Good morning</div>
            <div style={{fontFamily:"Lora,serif",fontSize:26,fontWeight:800,marginBottom:7}}>Parnia Yazdkhasti</div>
            <div style={{fontSize:13,opacity:.9,marginBottom:16}}>Next: <strong>Dr. Al Mansoori</strong> today at 11:00 AM — Cardiac check-up</div>
            <div style={{display:"flex",gap:9}}>
              <button className="btn" style={{background:"rgba(255,255,255,.18)",color:"#fff",border:"1px solid rgba(255,255,255,.3)"}} onClick={()=>setActive("appointments")}>View Schedule</button>
              <button className="btn" style={{background:"rgba(255,255,255,.1)",color:"#fff",border:"1px solid rgba(255,255,255,.2)"}} onClick={()=>setActive("ai")}>✦ Ask AI</button>
            </div>
          </div>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="📅" label="Upcoming Appointments" value="3" color={T.teal}/>
            <SC icon="💊" label="Active Prescriptions" value="2" color={T.purple}/>
            <SC icon="🔬" label="Lab Results" value="4" color={T.green}/>
            <SC icon="💬" label="Unread Messages" value="1" color={T.amber}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontWeight:700,fontSize:13.5,color:T.text}}>Upcoming Appointments</div>
                <button className="btn bg sm" onClick={()=>setActive("appointments")}>View All</button>
              </div>
              {P_APPTS.filter(a=>a.status==="upcoming").map(a=>(
                <div key={a.id} className="ar">
                  <Av l={a.av} s={36}/> 
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.doc}</div>
                    <div style={{fontSize:11.5,color:T.textL}}>{a.spec}</div>
                    <div style={{fontSize:11.5,color:T.teal,marginTop:2,fontWeight:600}}>{a.date} · {a.time}</div>
                  </div>
                  <Bdg t={a.type==="Teleconsultation"?"pu":"tl"}>{a.type==="Teleconsultation"?"📹 Tele":"🏥 Clinic"}</Bdg>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:14}}>Health Summary</div>
              {[["Blood Type","A+"],["Conditions","Diabetes, Hypertension"],["Allergies","Penicillin"],["Active Meds","2"],["Last HbA1c","6.8% — Mar 2026"],["Insurance","Daman — Active"]].map(([k,v],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<5?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:12.5,color:T.textL}}>{k}</span>
                  <span style={{fontSize:12.5,fontWeight:600,color:T.text}}>{v}</span>
                </div>
              ))}
              <button className="btn bo sm" style={{width:"100%",justifyContent:"center",marginTop:14}} onClick={()=>setActive("records")}>Full Records</button>
            </div>
          </div>
        </div>
      )}
      {active==="appointments"&&(
        <div>
          <SH title="My Appointments" sub="Upcoming and past consultations"/>
          <div style={{display:"flex",gap:7,marginBottom:18}}>
            {["upcoming","past"].map(t=><button key={t} className={`tb ${apptTab===t?"ta":"ti"}`} onClick={()=>setApptTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)} ({P_APPTS.filter(a=>a.status===(t==="upcoming"?"upcoming":"completed")).length})</button>)}
          </div>
          {P_APPTS.filter(a=>a.status===(apptTab==="upcoming"?"upcoming":"completed")).map(a=>(
            <div key={a.id} className="card" style={{display:"flex",alignItems:"center",gap:16,marginBottom:10,padding:"16px 20px"}}>
              <Av l={a.av} s={44}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{a.doc}</div>
                <div style={{fontSize:12.5,color:T.textL}}>{a.spec}</div>
                <div style={{display:"flex",gap:10,marginTop:7}}>
                  <span style={{fontSize:12,color:T.teal,fontWeight:600}}>📅 {a.date} at {a.time}</span>
                  <Bdg t={a.type==="Teleconsultation"?"pu":"tl"}>{a.type}</Bdg>
                </div>
              </div>
              {a.status==="upcoming"?(
                <div style={{display:"flex",gap:7}}>
                  {a.type==="Teleconsultation"&&<button className="btn bp sm">Join Call</button>}
                  <button className="btn bg sm">Cancel</button>
                </div>
              ):<Bdg t="gr">✓ Completed</Bdg>}
            </div>
          ))}
          {P_APPTS.filter(a=>a.status===(apptTab==="upcoming"?"upcoming":"completed")).length===0&&(
            <div style={{textAlign:"center",padding:"48px 0",color:T.textF}}><div style={{fontSize:36,marginBottom:10}}>📅</div><div>No {apptTab} appointments</div></div>
          )}
        </div>
      )}
      {active==="records"&&(
        <div>
          <SH title="Health Records" sub="Your complete medical history" action={<button className="btn bo sm">⬇ Download PDF</button>}/>
          <div className="g2">
            {[
              {title:"Chronic Conditions",icon:"🫀",items:["Type 2 Diabetes (since 2022)","Hypertension (since 2021)"]},
              {title:"Allergies",icon:"⚠️",items:["Penicillin — Severe","Shellfish — Moderate"]},
              {title:"Current Medications",icon:"💊",items:["Metformin 500mg — Twice daily","Atorvastatin 20mg — Once daily"]},
              {title:"Past Surgeries",icon:"🏥",items:["Appendectomy — 2018","Knee Arthroscopy — 2020"]},
              {title:"Vaccinations",icon:"💉",items:["COVID-19 Booster — Dec 2025","Flu Shot — Oct 2025"]},
              {title:"Emergency Contact",icon:"🆘",items:["Tooraj Helmi — Friend","+971 50 XXX XXXX"]},
            ].map((s,i)=>(
              <div key={i} className="card">
                <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:11}}>{s.icon} {s.title}</div>
                {s.items.map((item,j)=>(
                  <div key={j} style={{fontSize:13,color:T.textM,padding:"5px 0",borderBottom:j<s.items.length-1?`1px solid ${T.border}`:"none",display:"flex",gap:7,alignItems:"center"}}>
                    <span style={{width:4,height:4,borderRadius:"50%",background:T.teal,display:"inline-block",flexShrink:0}}></span>{item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="prescriptions"&&(
        <div>
          <SH title="Prescriptions" sub="Your digital prescriptions from CeenAiX doctors"/>
          {[
            {name:"Metformin 500mg",freq:"Twice daily",dur:"3 months",doc:"Dr. Layla Al Mansoori",date:"Mar 1, 2026",status:"Active"},
            {name:"Atorvastatin 20mg",freq:"Once daily",dur:"Ongoing",doc:"Dr. Layla Al Mansoori",date:"Jan 15, 2026",status:"Active"},
            {name:"Amoxicillin 500mg",freq:"Three times daily",dur:"7 days",doc:"Dr. Rami Khalil",date:"Dec 10, 2025",status:"Completed"},
          ].map((rx,i)=>(
            <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:10,padding:"15px 20px"}}>
              <div style={{width:42,height:42,background:T.purpleP,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>💊</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:T.text}}>{rx.name}</div>
                <div style={{fontSize:12.5,color:T.textL}}>{rx.freq} · {rx.dur}</div>
                <div style={{fontSize:11.5,color:T.textF,marginTop:2}}>{rx.doc} · {rx.date}</div>
              </div>
              <Bdg t={rx.status==="Active"?"gr":"tl"}>{rx.status}</Bdg>
              <button className="btn bo sm">Share to Pharmacy</button>
            </div>
          ))}
        </div>
      )}
      {active==="labs"&&(
        <div>
          <SH title="Lab Results" sub="Results from your CeenAiX referrals"/>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr",padding:"11px 22px",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
              {["Test","Lab","Date","Result","Status"].map(h=><div key={h} style={{fontSize:10.5,fontWeight:700,color:T.textF,textTransform:"uppercase",letterSpacing:".4px"}}>{h}</div>)}
            </div>
            {[
              ["HbA1c","LifeLab Dubai","Mar 2, 2026","6.8%","Normal"],
              ["Lipid Panel","LifeLab Dubai","Mar 2, 2026","See report","Review"],
              ["CBC","AlMana Lab","Jan 14, 2026","Normal range","Normal"],
              ["Thyroid (TSH)","AlMana Lab","Nov 5, 2025","2.1 mIU/L","Normal"],
            ].map((r,i,arr)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr",padding:"13px 22px",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",alignItems:"center"}}>
                <div style={{fontWeight:600,color:T.text}}>{r[0]}</div>
                <div style={{fontSize:13,color:T.textL}}>{r[1]}</div>
                <div style={{fontSize:13,color:T.textL}}>{r[2]}</div>
                <div style={{fontWeight:600,color:T.text}}>{r[3]}</div>
                <Bdg t={r[4]==="Normal"?"gr":"am"}>{r[4]}</Bdg>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="messages"&&(
        <div>
          <SH title="Messages" sub="Secure communications with your doctors"/>
          <div style={{display:"grid",gridTemplateColumns:"250px 1fr",gap:0,height:500,borderRadius:14,overflow:"hidden",border:`1px solid ${T.border}`}}>
            <div style={{background:T.bg,borderRight:`1px solid ${T.border}`}}>
              {P_APPTS.filter(a=>a.status==="upcoming").map((a,i)=>(
                <div key={i} style={{display:"flex",gap:9,padding:"13px 14px",cursor:"pointer",background:i===0?"#fff":T.bg,borderBottom:`1px solid ${T.border}`,borderLeft:i===0?`2px solid ${T.teal}`:"2px solid transparent"}}>
                  <Av l={a.av} s={34}/><div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{a.doc}</div><div style={{fontSize:11.5,color:T.textL}}>{a.spec}</div></div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",display:"flex",flexDirection:"column"}}>
              <div style={{padding:"13px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:9}}>
                <Av l="L" s={34}/><div><div style={{fontSize:13,fontWeight:700,color:T.text}}>Dr. Layla Al Mansoori</div><div style={{fontSize:11,color:T.green}}>● Online</div></div>
                <button className="btn bo sm" style={{marginLeft:"auto"}}>📹 Video Call</button>
              </div>
              <div style={{flex:1,padding:18,display:"flex",flexDirection:"column",gap:10,overflowY:"auto"}}>
                {chatMsgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}><div className={`mb ${m.from==="me"?"mr":"ml"}`}>{m.text}</div></div>)}
                {chatMsgs.length===0&&<div style={{textAlign:"center",color:T.textF,fontSize:13,marginTop:36}}>Your conversation with Dr. Al Mansoori will appear here</div>}
              </div>
              <div style={{padding:"11px 14px",borderTop:`1px solid ${T.border}`,display:"flex",gap:7}}>
                <input className="inp" placeholder="Type a message..." value={chatIn} onChange={e=>setChatIn(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&chatIn.trim()){setChatMsgs(p=>[...p,{from:"me",text:chatIn}]);setChatIn("");}}}/>
                <button className="btn bp sm" onClick={()=>{if(chatIn.trim()){setChatMsgs(p=>[...p,{from:"me",text:chatIn}]);setChatIn("");}}} >Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {active==="ai"&&(
        <div>
          <SH title="AI Health Assistant" sub="Clinically guided · Not a substitute for your doctor"/>
          <div className="card" style={{height:460,display:"flex",flexDirection:"column"}}>
            <div style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:12,paddingBottom:8}}>
              {aiMsgs.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.from==="user"?"flex-end":"flex-start",gap:7,alignItems:"flex-end"}}>
                  {m.from==="ai"&&<div style={{width:28,height:28,background:`linear-gradient(135deg,${T.purple},#a855f7)`,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{color:"#fff",fontSize:11}}>✦</span></div>}
                  <div className={`mb ${m.from==="user"?"mr":"ml"}`}>{m.text}</div>
                </div>
              ))}
            </div>
            {aiMsgs.length<=1&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:10}}>
                {["Check my medications","HbA1c result","Find a cardiologist","I have a headache"].map(s=>(
                  <button key={s} onClick={()=>sendAi(s)} style={{background:"#fff",border:`1.5px solid ${T.border}`,borderRadius:18,padding:"6px 13px",fontSize:12,color:T.textM,cursor:"pointer",fontFamily:"inherit"}}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div style={{display:"flex",gap:7,borderTop:`1px solid ${T.border}`,paddingTop:11}}>
              <input className="inp" value={aiIn} onChange={e=>setAiIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendAi()} placeholder="Ask about symptoms, medications, results..."/>
              <button className="btn" style={{background:`linear-gradient(135deg,${T.purple},#a855f7)`,color:"#fff"}} onClick={()=>sendAi()}>Send</button>
            </div>
          </div>
          <div style={{textAlign:"center",fontSize:11.5,color:T.textF,marginTop:9}}>⚠️ Always consult a licensed physician for medical decisions.</div>
        </div>
      )}
      {active==="findcare"&&(
        <div>
          <SH title="Find Care" sub="Book doctors, clinics, pharmacies and labs"/>
          <div style={{display:"flex",flexWrap:"wrap",gap:14}}>
            {DOCTORS.map(d=>(
              <div key={d.id} className="card ch" style={{width:270,border:"1.5px solid transparent"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#14BDBD"} onMouseLeave={e=>e.currentTarget.style.borderColor="transparent"}>
                <div style={{display:"flex",gap:10,marginBottom:10}}><Av l={d.av} s={44}/><div><div style={{fontSize:13.5,fontWeight:700,color:T.text}}>{d.name}</div><div style={{fontSize:12,color:T.textL}}>{d.spec}</div><Bdg t="gr">✓ DHA</Bdg></div></div>
                <div style={{fontSize:12,color:T.textL,marginBottom:10}}>🏥 {d.clinic}<br/>AED {d.fee} · Next: {d.avail}</div>
                <button className="btn bp sm" style={{width:"100%",justifyContent:"center"}}>Book Appointment</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="profile"&&(
        <div>
          <SH title="My Profile" sub="Personal and medical information"/>
          <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:22}}>
            <div className="card" style={{textAlign:"center"}}>
              <Av l="P" s={70} style={{margin:"0 auto 13px"}}/>
              <div style={{fontFamily:"Lora,serif",fontSize:18,fontWeight:800,color:T.text}}>Parnia Yazdkhasti</div>
              <div style={{fontSize:12.5,color:T.textL,marginTop:3}}>Patient · Dubai, UAE</div>
              <div style={{marginTop:9}}><Bdg t="gr">✓ Verified</Bdg></div>
              <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
                {[["Emirates ID","784-XXXX-XXXXXXX"],["Insurance","Daman — Active"],["Blood Type","A+"],["Member Since","Jan 2026"]].map(([k,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12}}>
                    <span style={{color:T.textF}}>{k}</span><span style={{fontWeight:600,color:T.text}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {title:"Personal Information",fields:[["Full Name","Parnia Yazdkhasti"],["Date of Birth","1988"],["Gender","Female"],["Email","parnia@aryaix.com"],["Phone","+971 5X XXX XXXX"],["Emirate","Dubai"]]},
                {title:"Emergency Contact",fields:[["Name","Pedram Vaziri"],["Relationship","Spouse"],["Phone","+971 5X XXX XXXX"]]},
              ].map((s,i)=>(
                <div key={i} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>{s.title}</div>
                    <button className="btn bg sm">Edit</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}>
                    {s.fields.map(([k,v],j)=>(
                      <div key={j}><div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:3}}>{k}</div><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{v}</div></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
}

// ── DOCTOR PORTAL ─────────────────────────────────────────────────────────────
function DoctorPortal({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const [modal,setModal]=useState(false);
  const [notes,setNotes]=useState("");
  const [selPt,setSelPt]=useState(null);
  const [rxSent,setRxSent]=useState(false);
  const [refSent,setRefSent]=useState(false);
  const [rxTo,setRxTo]=useState("both");
  const [urg,setUrg]=useState("Routine");
  const [msgIn,setMsgIn]=useState("");
  const [msgs,setMsgs]=useState([{from:"patient",text:"I've been having chest pains since yesterday evening, should I be worried?"}]);
  const [ptSrch,setPtSrch]=useState("");
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"today",icon:"📋",label:"Today's Appointments"},
    {id:"upcoming",icon:"📅",label:"Upcoming Schedule"},
    {id:"patients",icon:"🧑‍⚕️",label:"Patient Records"},
    {id:"prescriptions",icon:"💊",label:"Prescriptions"},
    {id:"referrals",icon:"🔬",label:"Lab Referrals"},
    {id:"messages",icon:"💬",label:"Messages",badge:3},
    {id:"earnings",icon:"💰",label:"Earnings"},
    {id:"profile",icon:"👤",label:"My Profile"},
  ];
  const sendMsg=()=>{if(msgIn.trim()){setMsgs(p=>[...p,{from:"doctor",text:msgIn}]);setMsgIn("");}};
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="Dr. Layla" role="Doctor · Cardiologist" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.48)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{background:"#fff",borderRadius:18,padding:30,width:620,maxHeight:"85vh",overflowY:"auto",boxShadow:"0 24px 80px rgba(0,0,0,.18)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
              <div style={{fontFamily:"Lora,serif",fontSize:19,fontWeight:800,color:T.text}}>Consultation Workspace</div>
              <Bdg t="ac">● Live Session</Bdg>
            </div>
            <div style={{background:T.tealPale,border:`1px solid #B2D8DA`,borderRadius:11,padding:"13px 16px",marginBottom:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10}}>
              {[["Patient","Parnia Yazdkhasti"],["Age / Blood","38 yrs · A+"],["Conditions","Diabetes, HTN"],["Allergies","Penicillin"]].map(([k,v],i)=>(
                <div key={i}><div style={{fontSize:9.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{k}</div><div style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</div></div>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:7}}>Current Medications</div>
              <div style={{display:"flex",gap:7}}><Bdg t="bl">Metformin 500mg</Bdg><Bdg t="bl">Atorvastatin 20mg</Bdg></div>
            </div>
            <div style={{marginBottom:14}}>
              <div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:6}}>Notes & Diagnosis</div>
              <textarea className="inp" rows={5} placeholder="Enter diagnosis, observations, treatment plan..." value={notes} onChange={e=>setNotes(e.target.value)} style={{resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",gap:9}}>
              <button className="btn bo sm" onClick={()=>{setModal(false);setActive("prescriptions");}}>💊 Write Prescription</button>
              <button className="btn bo sm" onClick={()=>{setModal(false);setActive("referrals");}}>🔬 Order Lab</button>
              <button className="btn bp" style={{marginLeft:"auto"}} onClick={()=>setModal(false)}>✓ Mark Complete</button>
            </div>
          </div>
        </div>
      )}
      {active==="home"&&(
        <div>
          <div style={{background:"linear-gradient(135deg,#0D2B2D,#0D4A50)",borderRadius:18,padding:"26px 30px",marginBottom:22,color:"#fff",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-18,top:-18,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(20,189,189,.1) 0%,transparent 70%)"}}></div>
            <div style={{fontSize:11.5,color:T.tealL,textTransform:"uppercase",letterSpacing:".4px",marginBottom:5}}>Good morning</div>
            <div style={{fontFamily:"Lora,serif",fontSize:24,fontWeight:800,marginBottom:5}}>Dr. Layla Al Mansoori</div>
            <div style={{fontSize:13,color:"rgba(255,255,255,.7)",marginBottom:16}}>Next: <span style={{color:T.tealL,fontWeight:600}}>Parnia Yazdkhasti</span> at 11:00 AM — Cardiac check-up</div>
            <div style={{display:"flex",gap:9}}>
              <button className="btn" style={{background:"rgba(20,189,189,.18)",color:"#fff",border:"1px solid rgba(20,189,189,.3)"}} onClick={()=>setActive("today")}>Today's Schedule</button>
              <button className="btn" style={{background:"rgba(255,255,255,.09)",color:"#fff",border:"1px solid rgba(255,255,255,.2)"}} onClick={()=>setModal(true)}>Start Consultation</button>
            </div>
          </div>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="📋" label="Today's Appointments" value="6" sub="3 remaining" color={T.teal}/>
            <SC icon="💬" label="Pending Messages" value="3" sub="2 urgent" color={T.red}/>
            <SC icon="🔬" label="New Lab Results" value="2" color={T.green}/>
            <SC icon="💰" label="This Month" value="AED 28.4K" sub="+12% vs last month" color={T.amber}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13.5,color:T.text}}>Today's Schedule</div>
                <button className="btn bg sm" onClick={()=>setActive("today")}>View All</button>
              </div>
              {D_APPTS.map(a=>(
                <div key={a.id} className={`ar ${a.status==="active"?"an":""}`} onClick={()=>{if(a.status!=="completed")setModal(true);}}>
                  <div style={{width:42,textAlign:"center"}}>
                    <div style={{fontSize:11.5,fontWeight:700,color:a.status==="active"?T.teal:T.textF}}>{a.time}</div>
                  </div>
                  <Av l={a.av} s={32}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{a.patient}</div>
                    <div style={{fontSize:11,color:T.textL}}>{a.cond}</div>
                  </div>
                  {a.status==="active"&&<Bdg t="ac">● Active</Bdg>}
                  {a.status==="completed"&&<Bdg t="gr">✓</Bdg>}
                  {a.status==="upcoming"&&<Bdg t={a.type==="Teleconsultation"?"pu":"tl"}>{a.type==="Teleconsultation"?"📹":"🏥"}</Bdg>}
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Recent Activity</div>
              {[
                {icon:"🔬",text:"Fatima Al Rashid's HbA1c result is ready",time:"5 min ago"},
                {icon:"💬",text:"Aisha Noor sent an urgent message",time:"22 min ago"},
                {icon:"💊",text:"Prescription sent to Rajan Pillai",time:"1 hr ago"},
                {icon:"✓",text:"Mohammed Al Zaabi consultation complete",time:"2 hrs ago"},
                {icon:"📅",text:"New appointment — Sara Al Hashimi",time:"3 hrs ago"},
              ].map((n,i)=>(
                <div key={i} style={{display:"flex",gap:9,padding:"8px 0",borderBottom:i<4?`1px solid ${T.border}`:"none",alignItems:"flex-start"}}>
                  <div style={{width:28,height:28,background:T.tealPale,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{n.icon}</div>
                  <div><div style={{fontSize:12,color:T.textM}}>{n.text}</div><div style={{fontSize:10.5,color:T.textF,marginTop:2}}>{n.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="today"&&(
        <div>
          <SH title="Today's Appointments" sub="Thursday, 12 March 2026 · 6 appointments"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 290px",gap:18}}>
            <div>
              {D_APPTS.map(a=>(
                <div key={a.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:10,padding:"16px 20px",borderLeft:`3px solid ${a.status==="active"?T.teal:a.status==="completed"?T.border:"transparent"}`,cursor:"pointer"}} onClick={()=>{if(a.status!=="completed")setModal(true);}}>
                  <div style={{textAlign:"center",minWidth:46}}>
                    <div style={{fontFamily:"Lora,serif",fontSize:18,fontWeight:800,color:a.status==="active"?T.teal:T.textF}}>{a.time}</div>
                  </div>
                  <Av l={a.av} s={40}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:a.status==="completed"?T.textL:T.text}}>{a.patient} <span style={{fontSize:11.5,color:T.textF}}>· {a.age}y</span></div>
                    <div style={{fontSize:12,color:T.textL}}>{a.cond}</div>
                  </div>
                  <div style={{display:"flex",gap:7,alignItems:"center"}}>
                    <Bdg t={a.type==="Teleconsultation"?"pu":"tl"}>{a.type==="Teleconsultation"?"📹 Tele":"🏥 Clinic"}</Bdg>
                    {a.status==="active"&&<Bdg t="ac">● In Progress</Bdg>}
                    {a.status==="completed"&&<Bdg t="gr">✓ Done</Bdg>}
                    {a.status==="upcoming"&&<button className="btn bp sm" onClick={e=>{e.stopPropagation();setModal(true);}}>Start</button>}
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{alignSelf:"flex-start"}}>
              <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:12}}>Day Summary</div>
              {[["Total","6"],["Completed","2"],["In Progress","1"],["Remaining","3"],["In-Clinic","4"],["Teleconsultation","2"]].map(([k,v],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<5?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:12,color:T.textL}}>{k}</span><span style={{fontSize:12,fontWeight:700,color:T.text}}>{v}</span>
                </div>
              ))}
              <div style={{marginTop:13}}>
                <div style={{fontSize:10.5,color:T.textF,marginBottom:5}}>Day progress</div>
                <div className="pbar"><div className="pfill" style={{width:"50%"}}></div></div>
                <div style={{fontSize:11,color:T.textF,marginTop:4}}>3 of 6 complete</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {active==="upcoming"&&(
        <div>
          <SH title="Upcoming Schedule" sub="Next 7 days · Managed by CeenAiX admin"/>
          <div className="g2">
            {[{date:"Mar 13",day:"Thu",count:6},{date:"Mar 14",day:"Fri",count:3},{date:"Mar 16",day:"Sun",count:7},{date:"Mar 17",day:"Mon",count:5}].map((d,i)=>(
              <div key={i} className="card">
                <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:12}}>
                  <div style={{background:T.tealPale,borderRadius:11,padding:"9px 13px",textAlign:"center"}}>
                    <div style={{fontSize:9.5,color:T.teal,fontWeight:700,textTransform:"uppercase"}}>{d.day}</div>
                    <div style={{fontFamily:"Lora,serif",fontSize:22,fontWeight:800,color:T.teal,lineHeight:1.1}}>{d.date.split(" ")[1]}</div>
                  </div>
                  <div><div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{d.count} Appointments</div><div style={{fontSize:12,color:T.textL}}>Full day schedule</div></div>
                </div>
                <div className="pbar"><div className="pfill" style={{width:`${(d.count/8)*100}%`}}></div></div>
                <div style={{fontSize:11,color:T.textF,marginTop:5}}>{d.count} of 8 slots filled</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="patients"&&(
        <div>
          <SH title="Patient Records" sub="All patients under your care"/>
          {selPt?(
            <div>
              <button className="btn bg sm" style={{marginBottom:14}} onClick={()=>setSelPt(null)}>← Back</button>
              <div className="card" style={{marginBottom:14}}>
                <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
                  <Av l={selPt.av} s={50}/>
                  <div style={{flex:1}}><div style={{fontFamily:"Lora,serif",fontSize:19,fontWeight:800,color:T.text}}>{selPt.patient}</div><div style={{fontSize:13,color:T.textL}}>{selPt.cond}</div></div>
                  <button className="btn bo sm" onClick={()=>setActive("prescriptions")}>Write Rx</button>
                  <button className="btn bp sm" onClick={()=>setModal(true)}>Start Consultation</button>
                </div>
                <div className="g4">
                  {[["Visits","5"],["Last Visit","Today"],["Insurance","Daman"],["Blood Type","A+"]].map(([k,v],i)=>(
                    <div key={i} style={{background:T.bg,borderRadius:9,padding:"11px 13px"}}>
                      <div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{k}</div>
                      <div style={{fontSize:14,fontWeight:700,color:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="g2">
                {[
                  {title:"Conditions",icon:"🫀",items:["Type 2 Diabetes","Hypertension"]},
                  {title:"Allergies",icon:"⚠️",items:["Penicillin — Severe"]},
                  {title:"Current Medications",icon:"💊",items:["Metformin 500mg","Atorvastatin 20mg"]},
                  {title:"Visit History",icon:"📋",items:["Mar 12 — Cardiac check-up","Jan 15 — Follow-up","Nov 5 — Initial consult"]},
                ].map((s,i)=>(
                  <div key={i} className="card">
                    <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:9}}>{s.icon} {s.title}</div>
                    {s.items.map((item,j)=><div key={j} style={{fontSize:12.5,color:T.textM,padding:"5px 0",borderBottom:j<s.items.length-1?`1px solid ${T.border}`:"none"}}>· {item}</div>)}
                  </div>
                ))}
              </div>
            </div>
          ):(
            <div>
              <input className="inp" placeholder="🔍  Search patients..." value={ptSrch} onChange={e=>setPtSrch(e.target.value)} style={{maxWidth:340,marginBottom:16}}/>
              {D_APPTS.filter((a,i,arr)=>arr.findIndex(x=>x.patient===a.patient)===i&&a.patient.toLowerCase().includes(ptSrch.toLowerCase())).map(a=>(
                <div key={a.id} className="card ch" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px",cursor:"pointer"}} onClick={()=>setSelPt(a)}>
                  <Av l={a.av} s={40}/>
                  <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:700,color:T.text}}>{a.patient}</div><div style={{fontSize:12,color:T.textL}}>Age {a.age} · {a.cond}</div></div>
                  <Bdg t="tl">5 visits</Bdg>
                  <span style={{color:T.textF}}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {active==="prescriptions"&&(
        <div>
          <SH title="Prescription Writing" sub="Write and send digital prescriptions"/>
          <div className="g2">
            <div className="card" style={{position:"relative"}}>
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:14}}>New Prescription</div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                {[["Patient","select"],["Medication Name","text","e.g. Metformin 500mg"],["Dosage","text","e.g. 500mg"],["Frequency","text","e.g. Twice daily"],["Duration","text","e.g. 3 months"],["Instructions","textarea","Take after meals"]].map(([label,type,ph],i)=>(
                  <div key={i}>
                    <div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:4}}>{label}</div>
                    {type==="select"?<select className="inp"><option>Select patient...</option>{D_APPTS.map(a=><option key={a.id}>{a.patient}</option>)}</select>:type==="textarea"?<textarea className="inp" rows={2} placeholder={ph} style={{resize:"none"}}/>:<input className="inp" placeholder={ph}/>}
                  </div>
                ))}
                <div>
                  <div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:7}}>Send To</div>
                  <div style={{display:"flex",gap:7}}>
                    {["Patient","Pharmacy","Both"].map(o=><button key={o} className={`btn ${rxTo===o.toLowerCase()?"bp":"bg"} sm`} style={{flex:1,justifyContent:"center"}} onClick={()=>setRxTo(o.toLowerCase())}>{o}</button>)}
                  </div>
                </div>
                <button className="btn bp" style={{justifyContent:"center"}} onClick={()=>{setRxSent(true);setTimeout(()=>setRxSent(false),2500);}}>Send Prescription</button>
              </div>
              {rxSent&&<div style={{position:"absolute",inset:0,background:"rgba(232,244,244,.95)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:7}}><div style={{fontSize:38}}>✓</div><div style={{fontSize:14,fontWeight:700,color:T.green}}>Prescription Sent!</div></div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:11}}>Recent Prescriptions</div>
              {[
                {patient:"Parnia Yazdkhasti",drug:"Metformin 500mg",freq:"Twice daily",date:"Mar 12",av:"P"},
                {patient:"Fatima Al Rashid",drug:"Insulin Glargine 20U",freq:"Once nightly",date:"Mar 12",av:"F"},
                {patient:"Mohammed Al Zaabi",drug:"Amlodipine 5mg",freq:"Once daily",date:"Mar 12",av:"M"},
              ].map((rx,i)=>(
                <div key={i} className="card" style={{marginBottom:9,padding:"13px 16px",display:"flex",gap:10,alignItems:"center"}}>
                  <Av l={rx.av} s={34}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>{rx.drug}</div><div style={{fontSize:11.5,color:T.textL}}>{rx.patient} · {rx.freq} · {rx.date}</div></div>
                  <Bdg t="gr">Sent ✓</Bdg>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="referrals"&&(
        <div>
          <SH title="Lab Referrals" sub="Refer patients to CeenAiX-listed labs"/>
          <div className="g2">
            <div className="card" style={{position:"relative"}}>
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:14}}>New Lab Referral</div>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                <div><div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:4}}>Patient</div><select className="inp"><option>Select patient...</option>{D_APPTS.map(a=><option key={a.id}>{a.patient}</option>)}</select></div>
                <div><div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:4}}>Lab</div><select className="inp"><option>Select lab...</option>{LABS.map(l=><option key={l.id}>{l.name}</option>)}</select></div>
                <div><div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:4}}>Tests Required</div><input className="inp" placeholder="e.g. HbA1c, Lipid Panel, CBC..."/></div>
                <div><div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:4}}>Clinical Notes</div><textarea className="inp" rows={2} placeholder="Context for the lab..." style={{resize:"none"}}/></div>
                <div>
                  <div style={{fontSize:10.5,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:7}}>Urgency</div>
                  <div style={{display:"flex",gap:7}}>
                    {["Routine","Urgent","STAT"].map(u=><button key={u} className={`btn ${urg===u?"bp":"bg"} sm`} style={{flex:1,justifyContent:"center"}} onClick={()=>setUrg(u)}>{u}</button>)}
                  </div>
                </div>
                <button className="btn bp" style={{justifyContent:"center"}} onClick={()=>{setRefSent(true);setTimeout(()=>setRefSent(false),2500);}}>Send Referral</button>
              </div>
              {refSent&&<div style={{position:"absolute",inset:0,background:"rgba(232,244,244,.95)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:7}}><div style={{fontSize:38}}>✓</div><div style={{fontSize:14,fontWeight:700,color:T.green}}>Referral Sent!</div></div>}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:T.text,marginBottom:11}}>Recent Referrals</div>
              {[
                {patient:"Parnia Yazdkhasti",test:"HbA1c, Lipid Panel",lab:"LifeLab Dubai",status:"Pending",urg:"Routine",av:"P"},
                {patient:"Mohammed Al Zaabi",test:"ECG, Troponin",lab:"AlMana Lab",status:"In Progress",urg:"Urgent",av:"M"},
                {patient:"Fatima Al Rashid",test:"HbA1c, Renal Function",lab:"LifeLab Dubai",status:"Result Ready",urg:"Routine",av:"F"},
              ].map((r,i)=>(
                <div key={i} className="card" style={{marginBottom:9,padding:"13px 16px"}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <Av l={r.av} s={34}/>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:T.text}}>{r.test}</div><div style={{fontSize:11.5,color:T.textL}}>{r.patient} · {r.lab}</div></div>
                    <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
                      <Bdg t={r.urg==="Urgent"?"rd":"tl"}>{r.urg}</Bdg>
                      <Bdg t={r.status==="Result Ready"?"gr":r.status==="In Progress"?"am":"bl"}>{r.status}</Bdg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="messages"&&(
        <div>
          <SH title="Messages & Teleconsultation" sub="Secure communications with your patients"/>
          <div style={{display:"grid",gridTemplateColumns:"250px 1fr",gap:0,height:520,borderRadius:14,overflow:"hidden",border:`1px solid ${T.border}`}}>
            <div style={{background:T.bg,borderRight:`1px solid ${T.border}`}}>
              {[
                {name:"Aisha Noor",last:"I've been having chest pains...",time:"10:22 AM",unread:2,av:"A"},
                {name:"Rajan Pillai",last:"Medication is working well.",time:"Yesterday",unread:0,av:"R"},
                {name:"Sara Al Hashimi",last:"Can we move the appointment?",time:"Yesterday",unread:1,av:"S"},
              ].map((m,i)=>(
                <div key={i} style={{display:"flex",gap:9,padding:"13px 14px",cursor:"pointer",background:i===0?"#fff":T.bg,borderBottom:`1px solid ${T.border}`,borderLeft:i===0?`2px solid ${T.teal}`:"2px solid transparent"}}>
                  <Av l={m.av} s={34}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{m.name}</div><div style={{fontSize:10,color:T.textF}}>{m.time}</div></div>
                    <div style={{fontSize:11,color:T.textL,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{m.last}</div>
                  </div>
                  {m.unread>0&&<span style={{background:"#EF4444",color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,padding:"2px 5px",flexShrink:0}}>{m.unread}</span>}
                </div>
              ))}
            </div>
            <div style={{background:"#fff",display:"flex",flexDirection:"column"}}>
              <div style={{padding:"13px 18px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:9}}>
                <Av l="A" s={34}/><div><div style={{fontSize:13,fontWeight:700,color:T.text}}>Aisha Noor</div><div style={{fontSize:11,color:T.green}}>● Online</div></div>
                <div style={{marginLeft:"auto",display:"flex",gap:7}}>
                  <button className="btn bo sm">📹 Video Call</button>
                  <button className="btn bg sm" onClick={()=>setActive("prescriptions")}>💊 Write Rx</button>
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:10}}>
                {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.from==="doctor"?"flex-end":"flex-start"}}><div className={`mb ${m.from==="doctor"?"mr":"ml"}`}>{m.text}</div></div>)}
              </div>
              <div style={{padding:"11px 14px",borderTop:`1px solid ${T.border}`,display:"flex",gap:7}}>
                <input className="inp" placeholder="Type a message..." value={msgIn} onChange={e=>setMsgIn(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()}/>
                <button className="btn bp sm" onClick={sendMsg}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {active==="earnings"&&(
        <div>
          <SH title="Earnings & Payments" sub="Your financial overview on CeenAiX"/>
          <div className="g3" style={{marginBottom:22}}>
            {[{label:"Total Earned",value:"AED 28,400",pct:72,color:T.teal},{label:"Pending",value:"AED 4,200",pct:18,color:T.amber},{label:"Paid Out",value:"AED 24,200",pct:62,color:T.green}].map((s,i)=>(
              <div key={i} className="card">
                <div style={{fontFamily:"Lora,serif",fontSize:24,fontWeight:800,color:s.color}}>{s.value}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.textM,marginTop:4}}>{s.label}</div>
                <div className="pbar" style={{marginTop:12}}><div className="pfill" style={{width:`${s.pct}%`}}></div></div>
              </div>
            ))}
          </div>
          <div className="card">
            <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:14}}>Payment Breakdown</div>
            {[
              {source:"Credit / Debit Card",amount:"AED 12,800",count:"32 consultations",pct:45},
              {source:"Insurance Direct Billing",amount:"AED 11,200",count:"28 claims",pct:39},
              {source:"In-App Wallet",amount:"AED 4,400",count:"11 consultations",pct:16},
            ].map((row,i)=>(
              <div key={i} style={{padding:"13px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
                  <div><div style={{fontSize:13.5,fontWeight:700,color:T.text}}>{row.source}</div><div style={{fontSize:11.5,color:T.textL}}>{row.count}</div></div>
                  <div style={{fontFamily:"Lora,serif",fontSize:17,fontWeight:800,color:T.teal}}>{row.amount}</div>
                </div>
                <div className="pbar"><div className="pfill" style={{width:`${row.pct}%`}}></div></div>
              </div>
            ))}
            <button className="btn bo sm" style={{marginTop:14}}>⬇ Export Report</button>
          </div>
        </div>
      )}
      {active==="profile"&&(
        <div>
          <SH title="My Profile" sub="Your public-facing CeenAiX doctor profile"/>
          <div style={{display:"grid",gridTemplateColumns:"270px 1fr",gap:22}}>
            <div className="card" style={{textAlign:"center"}}>
              <Av l="L" s={70} style={{margin:"0 auto 13px"}}/>
              <div style={{fontFamily:"Lora,serif",fontSize:18,fontWeight:800,color:T.text}}>Dr. Layla Al Mansoori</div>
              <div style={{fontSize:12.5,color:T.textL}}>Cardiologist</div>
              <div style={{display:"flex",justifyContent:"center",gap:7,marginTop:9}}><Bdg t="gr">✓ DHA Verified</Bdg><Bdg t="tl">Active</Bdg></div>
              <div style={{marginTop:14,borderTop:`1px solid ${T.border}`,paddingTop:12}}>
                {[["Experience","12 years"],["Languages","Arabic, English"],["Clinic","Dubai Heart Center"],["Rating","4.9 / 5.0"],["Consultations","1,240+"]].map(([k,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:12,borderBottom:i<4?`1px solid ${T.border}`:"none"}}>
                    <span style={{color:T.textF}}>{k}</span><span style={{fontWeight:700,color:T.textM}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {title:"Professional Info",fields:[["Specialty","Cardiology"],["Sub-specialty","Interventional Cardiology"],["Medical School","UAE University, College of Medicine"],["Graduation Year","2013"]]},
                {title:"Consultation Fees",fields:[["In-Clinic Fee","AED 350"],["Teleconsultation Fee","AED 200"],["Insurance Accepted","Daman, AXA, Thiqa, MetLife"]]},
              ].map((s,i)=>(
                <div key={i} className="card">
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
                    <div style={{fontSize:13.5,fontWeight:700,color:T.text}}>{s.title}</div>
                    <button className="btn bg sm">Edit</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    {s.fields.map(([k,v],j)=><div key={j}><div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:3}}>{k}</div><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{v}</div></div>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
}

// ── CLINIC PORTAL ─────────────────────────────────────────────────────────────
function ClinicPortal({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"doctors",icon:"👨‍⚕️",label:"Our Doctors"},
    {id:"appointments",icon:"📅",label:"Appointments"},
    {id:"departments",icon:"🏥",label:"Departments"},
    {id:"analytics",icon:"📊",label:"Analytics"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="Dubai Heart Center" role="Clinic Admin" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {active==="home"&&(
        <div>
          <SH title="Clinic Dashboard" sub="Dubai Heart Center · Healthcare City"/>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="📅" label="Today's Appointments" value="42" color={T.teal}/>
            <SC icon="👨‍⚕️" label="Active Doctors" value="8" sub="2 on leave" color={T.green}/>
            <SC icon="🏥" label="Departments" value="5" color={T.purple}/>
            <SC icon="👥" label="Monthly Patients" value="1,240" sub="+8% this month" color={T.amber}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Doctors On Duty Today</div>
              {DOCTORS.slice(0,4).map(d=>(
                <div key={d.id} className="ar">
                  <Av l={d.av} s={34}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{d.name}</div><div style={{fontSize:11.5,color:T.textL}}>{d.spec}</div></div>
                  <Bdg t="gr">● On Duty</Bdg>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Appointment Distribution</div>
              {[["Cardiology","18","43%"],["General","10","24%"],["Orthopedics","8","19%"],["Dermatology","6","14%"]].map(([dept,count,pct],i)=>(
                <div key={i} style={{padding:"9px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontSize:13,fontWeight:600,color:T.text}}>{dept}</span>
                    <span style={{fontSize:13,color:T.textL}}>{count} appts</span>
                  </div>
                  <div className="pbar"><div className="pfill" style={{width:pct}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="doctors"&&(
        <div>
          <SH title="Our Doctors" sub="All doctors affiliated with Dubai Heart Center" action={<button className="btn bp sm">+ Add Doctor</button>}/>
          {DOCTORS.map(d=>(
            <div key={d.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <Av l={d.av} s={42}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{d.name}</div><div style={{fontSize:12,color:T.textL}}>{d.spec} · {d.exp}y exp</div></div>
              <Bdg t="gr">✓ DHA</Bdg><Bdg t="tl">Active</Bdg>
              <button className="btn bg sm">Schedule</button><button className="btn bd sm">Remove</button>
            </div>
          ))}
        </div>
      )}
      {active==="appointments"&&(
        <div>
          <SH title="All Appointments" sub="Today's clinic-wide appointment list"/>
          {D_APPTS.concat(D_APPTS.slice(0,2)).map((a,i)=>(
            <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:13,marginBottom:9,padding:"13px 18px"}}>
              <div style={{fontSize:12.5,fontWeight:700,color:T.teal,minWidth:46}}>{a.time}</div>
              <Av l={a.av} s={34}/>
              <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{a.patient}</div><div style={{fontSize:11.5,color:T.textL}}>{a.cond}</div></div>
              <div style={{fontSize:12,color:T.textM}}>Dr. Layla Al Mansoori</div>
              <Bdg t={a.status==="completed"?"gr":a.status==="active"?"ac":"tl"}>{a.status==="completed"?"Done":a.status==="active"?"In Progress":"Upcoming"}</Bdg>
            </div>
          ))}
        </div>
      )}
      {active==="departments"&&(
        <div>
          <SH title="Departments & Services" sub="Manage your clinic's departments" action={<button className="btn bp sm">+ Add Department</button>}/>
          <div className="g2">
            {[
              {name:"Cardiology",icon:"🫀",doctors:4,services:["ECG","Echocardiography","Stress Test","Holter Monitor"]},
              {name:"General Medicine",icon:"🩺",doctors:2,services:["Check-ups","Vaccinations","Chronic Disease Management"]},
              {name:"Radiology",icon:"🩻",doctors:1,services:["X-Ray","Ultrasound","MRI","CT Scan"]},
              {name:"Vascular Surgery",icon:"🔬",doctors:1,services:["Angiography","Stenting","Bypass Assessment"]},
            ].map((d,i)=>(
              <div key={i} className="card">
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}><span style={{fontSize:22}}>{d.icon}</span><div><div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{d.name}</div><div style={{fontSize:11.5,color:T.textL}}>{d.doctors} doctors</div></div></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5}}>{d.services.map(s=><Bdg key={s} t="tl">{s}</Bdg>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="analytics"&&(
        <div>
          <SH title="Analytics" sub="Clinic performance overview"/>
          <div className="g3">
            {[["👥","Patient Volume","1,240","this month",T.teal],["✓","Completion Rate","94%","appointments",T.green],["⭐","Avg Rating","4.8","from 312 reviews",T.amber],["🆕","New Patients","183","this month",T.teal],["📹","Teleconsultations","28%","of all appointments",T.purple],["🛡️","Insurance Claims","87%","approval rate",T.green]].map(([icon,label,value,sub,color],i)=>(
              <SC key={i} icon={icon} label={label} value={value} sub={sub} color={color}/>
            ))}
          </div>
        </div>
      )}
      {active==="settings"&&(
        <div>
          <SH title="Clinic Settings" sub="Manage your clinic profile and configuration"/>
          <div className="card">
            <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:14}}>Clinic Information</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[["Clinic Name","Dubai Heart Center"],["Type","Specialty Center"],["DHA License","DHA-2019-DHC-0012"],["Location","Healthcare City, Dubai"],["Phone","+971 4 XXX XXXX"],["Operating Hours","Mon–Sat 8AM–8PM"]].map(([k,v],i)=>(
                <div key={i}><div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:3}}>{k}</div><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{v}</div></div>
              ))}
            </div>
            <button className="btn bo sm" style={{marginTop:18}}>Edit Clinic Profile</button>
          </div>
        </div>
      )}
    </Portal>
  );
}

// ── PHARMACY & LAB PORTAL ─────────────────────────────────────────────────────
function PharmacyPortal({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const [tab,setTab]=useState("pharmacy");
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"profile",icon:"🏪",label:"Our Profile"},
    {id:"catalogue",icon:"📦",label:"Catalogue / Tests"},
    {id:"referrals",icon:"📋",label:"Referrals Received"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="LifeLab Dubai" role="Pharmacy & Lab Partner" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {active==="home"&&(
        <div>
          <SH title="Partner Dashboard" sub="LifeLab Dubai · Healthcare City"/>
          <div style={{display:"flex",gap:7,marginBottom:18}}>
            {["pharmacy","lab"].map(t=><button key={t} className={`tb ${tab===t?"ta":"ti"}`} onClick={()=>setTab(t)}>{t==="pharmacy"?"💊 Pharmacy":"🔬 Lab"}</button>)}
          </div>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon={tab==="pharmacy"?"💊":"🔬"} label={tab==="pharmacy"?"Prescriptions Today":"Referrals Today"} value={tab==="pharmacy"?"24":"18"} color={T.teal}/>
            <SC icon="⏳" label="Pending" value={tab==="pharmacy"?"6":"4"} color={T.amber}/>
            <SC icon="✓" label="Completed" value={tab==="pharmacy"?"18":"14"} color={T.green}/>
            <SC icon="📦" label={tab==="pharmacy"?"Catalogue Items":"Tests Available"} value={tab==="pharmacy"?"342":"68"} color={T.purple}/>
          </div>
          <div className="card">
            <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Today's {tab==="pharmacy"?"Prescriptions":"Referrals"}</div>
            {[
              {patient:"Parnia Yazdkhasti",item:tab==="pharmacy"?"Metformin 500mg":"HbA1c, Lipid Panel",doc:"Dr. Layla Al Mansoori",time:"11:30 AM",status:"Pending"},
              {patient:"Mohammed Al Zaabi",item:tab==="pharmacy"?"Amlodipine 5mg":"ECG, Troponin",doc:"Dr. Layla Al Mansoori",time:"10:00 AM",status:"In Progress"},
              {patient:"Fatima Al Rashid",item:tab==="pharmacy"?"Insulin Glargine":"HbA1c, Renal Function",doc:"Dr. Rami Khalil",time:"09:00 AM",status:"Completed"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                <Av l={r.patient[0]} s={34}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{r.item}</div><div style={{fontSize:11.5,color:T.textL}}>{r.patient} · {r.doc} · {r.time}</div></div>
                <Bdg t={r.status==="Completed"?"gr":r.status==="In Progress"?"am":"bl"}>{r.status}</Bdg>
                {r.status!=="Completed"&&<button className="btn bp sm">{tab==="pharmacy"?"Dispensed":"Upload Result"}</button>}
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="catalogue"&&(
        <div>
          <SH title={tab==="pharmacy"?"Drug Catalogue":"Test Menu"} sub={`Manage your ${tab==="pharmacy"?"medications":"lab tests"}`} action={<button className="btn bp sm">+ Add Item</button>}/>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"11px 22px",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
              {(tab==="pharmacy"?["Drug Name","Category","Stock","Price (AED)","Action"]:["Test Name","Category","Turnaround","Price (AED)","Action"]).map(h=><div key={h} style={{fontSize:10.5,fontWeight:700,color:T.textF,textTransform:"uppercase",letterSpacing:".4px"}}>{h}</div>)}
            </div>
            {(tab==="pharmacy"?[
              ["Metformin 500mg","Antidiabetic","In Stock","28"],
              ["Atorvastatin 20mg","Statin","In Stock","45"],
              ["Amlodipine 5mg","Antihypertensive","In Stock","35"],
              ["Amoxicillin 500mg","Antibiotic","Low Stock","18"],
              ["Insulin Glargine","Insulin","In Stock","185"],
            ]:[
              ["HbA1c","Biochemistry","Same Day","95"],
              ["Lipid Panel","Biochemistry","Same Day","120"],
              ["CBC","Haematology","3 Hours","65"],
              ["Thyroid (TSH)","Endocrinology","24 Hours","85"],
              ["Troponin I","Cardiac","2 Hours","145"],
            ]).map(([name,cat,third,price],i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",padding:"12px 22px",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
                <div style={{fontWeight:600,color:T.text}}>{name}</div>
                <Bdg t="tl">{cat}</Bdg>
                <div style={{fontSize:13,color:third==="Low Stock"?T.amber:third==="In Stock"?T.green:T.textM,fontWeight:600}}>{third}</div>
                <div style={{fontWeight:700,color:T.text}}>AED {price}</div>
                <button className="btn bg sm">Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="referrals"&&(
        <div>
          <SH title="Referrals Received" sub={`Incoming ${tab==="pharmacy"?"prescriptions":"lab referrals"} from CeenAiX doctors`}/>
          {[
            {patient:"Parnia Yazdkhasti",item:"HbA1c, Lipid Panel",doc:"Dr. Layla Al Mansoori",date:"Mar 12, 2026",urg:"Routine",status:"Pending"},
            {patient:"Mohammed Al Zaabi",item:"ECG, Troponin",doc:"Dr. Layla Al Mansoori",date:"Mar 12, 2026",urg:"Urgent",status:"In Progress"},
            {patient:"Fatima Al Rashid",item:"HbA1c, Renal Function",doc:"Dr. Rami Khalil",date:"Mar 1, 2026",urg:"Routine",status:"Result Ready"},
          ].map((r,i)=>(
            <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <Av l={r.patient[0]} s={40}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{r.item}</div><div style={{fontSize:12,color:T.textL}}>{r.patient} · {r.doc} · {r.date}</div></div>
              <Bdg t={r.urg==="Urgent"?"rd":"tl"}>{r.urg}</Bdg>
              <Bdg t={r.status==="Result Ready"?"gr":r.status==="In Progress"?"am":"bl"}>{r.status}</Bdg>
              {r.status!=="Result Ready"&&<button className="btn bp sm">Upload Result</button>}
            </div>
          ))}
        </div>
      )}
      {(active==="profile"||active==="settings")&&(
        <div>
          <SH title="Partner Profile" sub="LifeLab Dubai — CeenAiX Partner"/>
          <div className="card">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[["Partner Name","LifeLab Dubai"],["Type","Laboratory"],["DHA License","DHA-2021-LL-5512"],["Location","Healthcare City, Dubai"],["Home Sample","Yes"],["Operating Hours","7AM–9PM Daily"],["Contact","+971 4 XXX XXXX"],["Status","Active on CeenAiX"]].map(([k,v],i)=>(
                <div key={i}><div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:3}}>{k}</div><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{v}</div></div>
              ))}
            </div>
            <button className="btn bo sm" style={{marginTop:18}}>Edit Profile</button>
          </div>
        </div>
      )}
    </Portal>
  );
}

// ── INSURANCE PORTAL ──────────────────────────────────────────────────────────
function InsurancePortal({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"claims",icon:"📋",label:"Claims"},
    {id:"providers",icon:"🏥",label:"Approved Providers"},
    {id:"analytics",icon:"📊",label:"Analytics"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="Daman Insurance" role="Insurance Provider" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {active==="home"&&(
        <div>
          <SH title="Insurance Dashboard" sub="Daman National Health Insurance Company"/>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="📋" label="Active Claims" value="284" sub="this month" color={T.teal}/>
            <SC icon="✓" label="Approved" value="241" sub="85% rate" color={T.green}/>
            <SC icon="⏳" label="Pending Review" value="31" color={T.amber}/>
            <SC icon="✗" label="Rejected" value="12" sub="4% rate" color={T.red}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Recent Claims</div>
              {[
                {pid:"P-****-1234",doc:"Dr. Layla Al Mansoori",amount:"AED 350",date:"Mar 12",status:"Approved"},
                {pid:"P-****-5678",doc:"Dr. Rami Khalil",amount:"AED 200",date:"Mar 12",status:"Pending"},
                {pid:"P-****-9012",doc:"Dr. Sara Nasser",amount:"AED 280",date:"Mar 11",status:"Approved"},
                {pid:"P-****-3456",doc:"Dr. Ahmed Farhan",amount:"AED 320",date:"Mar 11",status:"Rejected"},
              ].map((c,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<3?`1px solid ${T.border}`:"none"}}>
                  <div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{c.pid}</div><div style={{fontSize:11.5,color:T.textL}}>{c.doc} · {c.date}</div></div>
                  <div style={{fontWeight:700,color:T.teal,fontSize:13}}>{c.amount}</div>
                  <Bdg t={c.status==="Approved"?"gr":c.status==="Pending"?"am":"rd"}>{c.status}</Bdg>
                </div>
              ))}
              <button className="btn bg sm" style={{marginTop:11}} onClick={()=>setActive("claims")}>View All Claims</button>
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Claims by Specialty</div>
              {[["Cardiology","38%",38],["General Medicine","24%",24],["Orthopedics","18%",18],["Dermatology","12%",12],["Other","8%",8]].map(([spec,pct,n],i)=>(
                <div key={i} style={{padding:"7px 0",borderBottom:i<4?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>{spec}</span><span style={{fontSize:12.5,color:T.textL}}>{pct}</span></div>
                  <div className="pbar"><div className="pfill" style={{width:`${n}%`}}></div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="claims"&&(
        <div>
          <SH title="Claims Management" sub="Review and action all insurance claims"/>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1.2fr 1fr 1fr 1fr",padding:"11px 22px",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
              {["Patient ID","Doctor","Clinic","Amount","Date","Status"].map(h=><div key={h} style={{fontSize:10.5,fontWeight:700,color:T.textF,textTransform:"uppercase",letterSpacing:".4px"}}>{h}</div>)}
            </div>
            {[
              ["P-****-1234","Dr. Layla Al Mansoori","Dubai Heart Center","AED 350","Mar 12","Approved"],
              ["P-****-5678","Dr. Rami Khalil","HealthFirst Clinic","AED 200","Mar 12","Pending"],
              ["P-****-9012","Dr. Sara Nasser","Skin & Care Dubai","AED 280","Mar 11","Approved"],
              ["P-****-3456","Dr. Ahmed Farhan","City Medical Center","AED 320","Mar 11","Rejected"],
              ["P-****-7890","Dr. Priya Menon","Mediclinic City","AED 250","Mar 10","Approved"],
            ].map((row,i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1.5fr 1.2fr 1fr 1fr 1fr",padding:"12px 22px",borderBottom:`1px solid ${T.border}`,alignItems:"center"}}>
                <div style={{fontSize:12.5,fontWeight:600,color:T.text}}>{row[0]}</div>
                <div style={{fontSize:12.5,color:T.textM}}>{row[1]}</div>
                <div style={{fontSize:12,color:T.textL}}>{row[2]}</div>
                <div style={{fontWeight:700,color:T.teal}}>{row[3]}</div>
                <div style={{fontSize:12,color:T.textL}}>{row[4]}</div>
                <Bdg t={row[5]==="Approved"?"gr":row[5]==="Pending"?"am":"rd"}>{row[5]}</Bdg>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="providers"&&(
        <div>
          <SH title="Approved Providers" sub="Clinics in the Daman network on CeenAiX"/>
          <div className="g2">
            {CLINICS.map(c=>(
              <div key={c.id} className="card">
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:9}}><div style={{fontSize:14.5,fontWeight:700,color:T.text}}>{c.name}</div><Bdg t="gr">In Network</Bdg></div>
                <div style={{fontSize:12,color:T.textL}}>📍 {c.area} · {c.type}<br/>👨‍⚕️ {c.doctors} doctors · 🕐 {c.hours}</div>
                <div style={{display:"flex",flexWrap:"wrap",gap:5,marginTop:9}}>{c.specs.map(s=><Bdg key={s} t="tl">{s}</Bdg>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="analytics"&&(
        <div>
          <SH title="Analytics" sub="Claims and network performance"/>
          <div className="g3">
            {[["📋","Total Claims","1,842","this year",T.teal],["✓","Approval Rate","87%","+2% vs last year",T.green],["💰","Avg Claim","AED 285","per consultation",T.amber],["💳","Total Paid Out","AED 523K","this year",T.teal],["👥","Active Members","12,400","on CeenAiX",T.purple],["🏥","Network Providers","48","clinics & hospitals",T.green]].map(([icon,label,value,sub,color],i)=>(
              <SC key={i} icon={icon} label={label} value={value} sub={sub} color={color}/>
            ))}
          </div>
        </div>
      )}
      {active==="settings"&&(
        <div>
          <SH title="Settings" sub="Daman Insurance account configuration"/>
          <div className="card">
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              {[["Company Name","Daman National Health Insurance"],["License","DHA Insurance License #00124"],["Tier","Premium Partner"],["Active Plans","3 — Basic, Enhanced, Thiqa"],["CeenAiX Since","January 2025"],["Status","Active"]].map(([k,v],i)=>(
                <div key={i}><div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:3}}>{k}</div><div style={{fontSize:13.5,fontWeight:600,color:T.text}}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
}

// ── SUPER ADMIN PANEL ─────────────────────────────────────────────────────────
function AdminPanel({onLogout,onLogoClick}) {
  const [active,setActive]=useState("home");
  const [approved,setApproved]=useState(null);
  const [userSrch,setUserSrch]=useState("");
  const nav=[
    {id:"home",icon:"⊞",label:"Dashboard"},
    {id:"verification",icon:"✅",label:"Doctor Verification",badge:3},
    {id:"users",icon:"👥",label:"User Management"},
    {id:"clinics",icon:"🏥",label:"Clinic Management"},
    {id:"pharmacy",icon:"💊",label:"Pharmacy Data"},
    {id:"labs",icon:"🔬",label:"Lab Data"},
    {id:"insurance",icon:"🛡️",label:"Insurance Providers"},
    {id:"analytics",icon:"📊",label:"Analytics"},
    {id:"admins",icon:"⚙️",label:"Admin Users"},
  ];
  return (
    <Portal nav={nav} active={active} setActive={setActive} name="Parnia Y." role="Super Admin" onLogout={onLogout} onLogoClick={onLogoClick}>
      <style>{CSS}</style>
      {active==="home"&&(
        <div>
          <SH title="Platform Overview" sub="CeenAiX Super Admin Panel · Thu, 12 Mar 2026"/>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="👥" label="Total Users" value="5,284" sub="+128 today" color={T.teal}/>
            <SC icon="✅" label="Pending Verification" value="3" sub="Doctors awaiting review" color={T.amber}/>
            <SC icon="🏥" label="Active Clinics" value="48" color={T.green}/>
            <SC icon="💊" label="Pharmacies & Labs" value="83" color={T.purple}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontWeight:700,fontSize:13.5,color:T.text}}>Verification Queue</div>
                <button className="btn bg sm" onClick={()=>setActive("verification")}>View All</button>
              </div>
              {PENDING_DRS.map(d=>(
                <div key={d.id} className="ar">
                  <Av l={d.name.split(" ").pop()[0]} s={34}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{d.name}</div><div style={{fontSize:11.5,color:T.textL}}>{d.spec} · {d.clinic}</div></div>
                  <Bdg t={d.flag==="Valid"?"gr":d.flag==="Pending"?"am":"rd"}>{d.flag}</Bdg>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Platform Stats</div>
              {[["Patients","4,820","+95 today"],["Verified Doctors","464","+3 pending"],["Appointments Today","1,240",""],["Prescriptions Today","384",""],["Lab Referrals Today","142",""],["Teleconsultations","218","active"]].map(([k,v,s],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<5?`1px solid ${T.border}`:"none",alignItems:"center"}}>
                  <span style={{fontSize:12.5,color:T.textM}}>{k}</span>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:13.5,fontWeight:700,color:T.text}}>{v}</span>
                    {s&&<span style={{fontSize:11,color:T.green,marginLeft:5}}>{s}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="verification"&&(
        <div>
          <SH title="Doctor Verification Queue" sub="Review DHA license submissions and approve doctor accounts"/>
          {PENDING_DRS.map(d=>(
            <div key={d.id} className="card" style={{marginBottom:13,padding:"20px 22px"}}>
              <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                <Av l={d.name.split(" ").pop()[0]} s={46}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:15,fontWeight:700,color:T.text}}>{d.name}</div>
                  <div style={{fontSize:12.5,color:T.textL}}>{d.spec} · {d.clinic}</div>
                  <div style={{fontSize:11.5,color:T.textF,marginTop:2}}>DHA License: {d.dha} · Submitted: {d.sub}</div>
                </div>
                <Bdg t={d.flag==="Valid"?"gr":d.flag==="Pending"?"am":"rd"}>DHA Check: {d.flag}</Bdg>
              </div>
              <div className="g3" style={{marginBottom:14}}>
                {[["Specialty",d.spec],["Clinic",d.clinic],["DHA Status",d.flag]].map(([k,v],i)=>(
                  <div key={i} style={{background:T.bg,borderRadius:9,padding:"10px 13px"}}>
                    <div style={{fontSize:10,color:T.textF,textTransform:"uppercase",letterSpacing:".4px",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</div>
                  </div>
                ))}
              </div>
              {approved===d.id?(
                <div style={{background:T.greenP,border:`1px solid ${T.green}`,borderRadius:10,padding:14,display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:18}}>✓</span>
                  <div><div style={{fontSize:13,fontWeight:700,color:T.green}}>Account Activated</div><div style={{fontSize:11.5,color:T.textL}}>Doctor notified via SMS and email</div></div>
                </div>
              ):(
                <div style={{display:"flex",gap:8}}>
                  <button className="btn bp sm" onClick={()=>{setApproved(d.id);setTimeout(()=>setApproved(null),3000);}}>✓ Approve</button>
                  <button className="btn bd sm">✗ Reject</button>
                  <button className="btn bg sm">📄 View License</button>
                  <button className="btn bg sm">✉ Request Info</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {active==="users"&&(
        <div>
          <SH title="User Management" sub="All patients and doctors on the platform"/>
          <input className="inp" placeholder="🔍  Search users..." value={userSrch} onChange={e=>setUserSrch(e.target.value)} style={{maxWidth:340,marginBottom:16}}/>
          <div className="card" style={{padding:0,overflow:"hidden"}}>
            <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 1fr 1fr 1fr",padding:"11px 22px",background:T.bg,borderBottom:`1px solid ${T.border}`}}>
              {["Name","Role","Email","Joined","Status","Actions"].map(h=><div key={h} style={{fontSize:10.5,fontWeight:700,color:T.textF,textTransform:"uppercase",letterSpacing:".4px"}}>{h}</div>)}
            </div>
            {ALL_USERS.filter(u=>u.name.toLowerCase().includes(userSrch.toLowerCase())||u.role.toLowerCase().includes(userSrch.toLowerCase())).map((u,i,arr)=>(
              <div key={u.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 1fr 1fr 1fr",padding:"12px 22px",borderBottom:i<arr.length-1?`1px solid ${T.border}`:"none",alignItems:"center"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}><Av l={u.name[0]} s={28}/><div style={{fontSize:13,fontWeight:600,color:T.text}}>{u.name}</div></div>
                <Bdg t={u.role==="Doctor"?"pu":"tl"}>{u.role}</Bdg>
                <div style={{fontSize:12,color:T.textL}}>{u.email}</div>
                <div style={{fontSize:12,color:T.textL}}>{u.joined}</div>
                <Bdg t={u.status==="Active"?"gr":"am"}>{u.status}</Bdg>
                <div style={{display:"flex",gap:5}}><button className="btn bg sm">Edit</button><button className="btn bd sm">Suspend</button></div>
              </div>
            ))}
          </div>
        </div>
      )}
      {active==="clinics"&&(
        <div>
          <SH title="Clinic Management" sub="Add and manage all clinics on CeenAiX" action={<button className="btn bp sm">+ Add Clinic</button>}/>
          {CLINICS.map(c=>(
            <div key={c.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <div style={{width:42,height:42,background:T.tealPale,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏥</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{c.name}</div><div style={{fontSize:12,color:T.textL}}>{c.type} · {c.area} · {c.doctors} doctors · {c.hours}</div></div>
              <Bdg t="gr">DHA ✓</Bdg><Bdg t="tl">Active</Bdg>
              <button className="btn bg sm">Edit</button><button className="btn bd sm">Deactivate</button>
            </div>
          ))}
        </div>
      )}
      {active==="pharmacy"&&(
        <div>
          <SH title="Pharmacy Data" sub="Manage all pharmacies — entered by Macy & Abud" action={<button className="btn bp sm">+ Add Pharmacy</button>}/>
          {PHARMACIES.map(p=>(
            <div key={p.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <div style={{width:42,height:42,background:T.purpleP,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>💊</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{p.name}</div><div style={{fontSize:12,color:T.textL}}>📍 {p.area} · 🕐 {p.hours}</div></div>
              <Bdg t="gr">● Open</Bdg>{p.delivery&&<Bdg t="bl">🚗 Delivery</Bdg>}
              <button className="btn bg sm">Edit Catalogue</button><button className="btn bd sm">Deactivate</button>
            </div>
          ))}
        </div>
      )}
      {active==="labs"&&(
        <div>
          <SH title="Lab Data" sub="Manage all labs — entered by Macy & Abud" action={<button className="btn bp sm">+ Add Lab</button>}/>
          {LABS.map(l=>(
            <div key={l.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <div style={{width:42,height:42,background:T.tealPale,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🔬</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{l.name}</div><div style={{fontSize:12,color:T.textL}}>📍 {l.area}{l.home?" · 🏠 Home sample":""}</div><div style={{display:"flex",gap:5,marginTop:5,flexWrap:"wrap"}}>{l.tests.slice(0,3).map(t=><Bdg key={t} t="tl">{t}</Bdg>)}{l.tests.length>3&&<Bdg t="am">+{l.tests.length-3}</Bdg>}</div></div>
              <button className="btn bg sm">Edit Tests</button><button className="btn bd sm">Deactivate</button>
            </div>
          ))}
        </div>
      )}
      {active==="insurance"&&(
        <div>
          <SH title="Insurance Providers" sub="Manage insurance providers integrated with CeenAiX" action={<button className="btn bp sm">+ Add Insurer</button>}/>
          {INSURERS.map(ins=>(
            <div key={ins.id} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <div style={{width:42,height:42,background:T.blueP,borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🛡️</div>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{ins.name}</div><div style={{fontSize:12,color:T.textL}}>{ins.clinics} clinics in network</div><div style={{display:"flex",gap:5,marginTop:5}}>{ins.plans.map(p=><Bdg key={p} t="bl">{p}</Bdg>)}</div></div>
              <Bdg t="gr">Active</Bdg>
              <button className="btn bg sm">Edit</button>
            </div>
          ))}
        </div>
      )}
      {active==="analytics"&&(
        <div>
          <SH title="Analytics & Reporting" sub="Full platform performance metrics" action={<button className="btn bo sm">⬇ Export Report</button>}/>
          <div className="g4" style={{marginBottom:22}}>
            <SC icon="👥" label="Total Users" value="5,284" sub="+128 today" color={T.teal}/>
            <SC icon="📅" label="Appointments Today" value="1,240" color={T.green}/>
            <SC icon="💊" label="Prescriptions Today" value="384" color={T.purple}/>
            <SC icon="🔬" label="Lab Referrals Today" value="142" color={T.amber}/>
          </div>
          <div className="g2">
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>User Growth</div>
              {[["Jan 2026","3,200",53],["Feb 2026","4,100",68],["Mar 2026 (to date)","5,284",88]].map(([month,count,pct],i)=>(
                <div key={i} style={{padding:"9px 0",borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:13,fontWeight:600,color:T.text}}>{month}</span><span style={{fontWeight:700,color:T.teal}}>{count} users</span></div>
                  <div className="pbar"><div className="pfill" style={{width:`${pct}%`}}></div></div>
                </div>
              ))}
            </div>
            <div className="card">
              <div style={{fontWeight:700,fontSize:13.5,color:T.text,marginBottom:12}}>Platform Breakdown</div>
              {[["Patients","4,820","91%"],["Verified Doctors","464","9%"],["Active Clinics","48",""],["Pharmacies","52",""],["Labs","31",""],["Insurance Providers","4",""]].map(([k,v,pct],i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:i<5?`1px solid ${T.border}`:"none"}}>
                  <span style={{fontSize:12.5,color:T.textM}}>{k}</span>
                  <div><span style={{fontSize:13,fontWeight:700,color:T.text}}>{v}</span>{pct&&<span style={{fontSize:11,color:T.textF,marginLeft:4}}>({pct})</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {active==="admins"&&(
        <div>
          <SH title="Admin User Management" sub="Manage who has access to this admin panel" action={<button className="btn bp sm">+ Invite Admin</button>}/>
          {[
            {name:"Parnia Yazdkhasti",email:"parnia@aryaix.com",role:"Super Admin",since:"Jan 2026",status:"Active"},
            {name:"Macy Katry",email:"macy@aryaix.com",role:"Ops Staff",since:"Jan 2026",status:"Active"},
            {name:"Abdolrahim Alidad",email:"abud@aryaix.com",role:"Ops Staff",since:"Feb 2026",status:"Active"},
          ].map((a,i)=>(
            <div key={i} className="card" style={{display:"flex",alignItems:"center",gap:14,marginBottom:9,padding:"14px 18px"}}>
              <Av l={a.name[0]} s={40}/>
              <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:T.text}}>{a.name}</div><div style={{fontSize:12,color:T.textL}}>{a.email} · Since {a.since}</div></div>
              <Bdg t={a.role==="Super Admin"?"rd":"tl"}>{a.role}</Bdg>
              <Bdg t="gr">{a.status}</Bdg>
              {a.role!=="Super Admin"&&<><button className="btn bg sm">Edit Role</button><button className="btn bd sm">Deactivate</button></>}
            </div>
          ))}
        </div>
      )}
    </Portal>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function CeenAiX({onNavigateHome}) {
  const [screen,setScreen]=useState("landing");
  const [role,setRole]=useState(null);
  const login=(r)=>{setRole(r);setScreen("portal");};
  const logout=()=>{setRole(null);setScreen("landing");};
  const handleLogoClick=()=>{
    if(onNavigateHome) onNavigateHome();
    else {setRole(null);setScreen("landing");}
  };
  if(screen==="landing") return <LandingPage onLogin={login} onLogoClick={handleLogoClick}/>;
  if(screen==="portal"){
    if(role==="patient") return <PatientPortal onLogout={logout} onLogoClick={handleLogoClick}/>;
    if(role==="doctor") return <DoctorPortal onLogout={logout} onLogoClick={handleLogoClick}/>;
    if(role==="clinic") return <ClinicPortal onLogout={logout} onLogoClick={handleLogoClick}/>;
    if(role==="pharmacy") return <PharmacyPortal onLogout={logout} onLogoClick={handleLogoClick}/>;
    if(role==="insurance") return <InsurancePortal onLogout={logout} onLogoClick={handleLogoClick}/>;
    if(role==="admin") return <AdminPanel onLogout={logout} onLogoClick={handleLogoClick}/>;
  }
  return <LoginScreen onLogin={login}/>;
}
