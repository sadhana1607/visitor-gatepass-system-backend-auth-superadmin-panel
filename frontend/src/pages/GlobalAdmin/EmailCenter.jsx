// ════════════════════════════════════════════════
// src/pages/GlobalAdmin/EmailCenter.jsx
//
// Email management for Global Admin:
//  - Inbox of system emails
//  - Compose & send email to org admins
//  - Email templates
//  - Sent history
// ════════════════════════════════════════════════

import { useState } from "react";

const INBOX = [
  { id:"ML-001", from:"admin@infosys.com",    fromName:"Meera Krishnan",   subject:"Security incident report — April 2026",       time:"09:15 AM", read:false, tag:"Security",  tagColor:"#ff6b7e",  body:"Dear Global Admin,\n\nWe had a security incident yesterday where an unauthorized visitor attempted to access the server room. The guard denied entry and escalated the case to L3. Full report attached.\n\nRegards,\nMeera Krishnan\nOrg Admin — Infosys Technologies" },
  { id:"ML-002", from:"admin@wipro.com",      fromName:"Suresh Naik",      subject:"Request: Add 2 new employees to the system",   time:"08:45 AM", read:false, tag:"Request",   tagColor:"#93c5fd",  body:"Hello,\n\nWe have two new employees joining our Wipro Campus team next week. Please add them to the system with Employee role.\n\n1. Anita Sharma — anita.s@wipro.com\n2. Rohit Desai — rohit.d@wipro.com\n\nThanks,\nSuresh Naik" },
  { id:"ML-003", from:"admin@tcs.com",        fromName:"Priya Sharma",     subject:"Monthly visitor report — March 2026",          time:"Yesterday", read:true,  tag:"Report",    tagColor:"#00c878",  body:"Hi,\n\nPlease find attached the monthly visitor statistics for TCS BKC Tower for March 2026.\n\nTotal Visitors: 210\nVIP Visitors: 12\nSecurity Incidents: 1\n\nBest regards,\nPriya Sharma" },
  { id:"ML-004", from:"admin@raheja.com",     fromName:"Sunita Rao",       subject:"Apartment gate pass system query",             time:"Yesterday", read:true,  tag:"Query",     tagColor:"#f59e0b",  body:"Hello,\n\nOur residents are asking about getting gate passes for their regular domestic workers. Is there a feature to set up recurring visitor passes?\n\nRegards,\nSunita Rao — Raheja Residences" },
  { id:"ML-005", from:"system@corpvms.com",   fromName:"CorpVMS System",   subject:"⚠ Auto-backup completed — 08-Apr-2026",        time:"12:00 AM", read:true,  tag:"System",    tagColor:"#a78bfa",  body:"Automated daily backup completed successfully.\n\nDate: 08-Apr-2026 12:00 AM\nRecords backed up: 1,740 visitor records\nUsers backed up: 630\nSize: 24.7 MB\n\nThis is an automated message." },
];

const SENT = [
  { id:"SN-001", to:"All Org Admins",      subject:"System maintenance notice — 10-Apr-2026",  time:"Yesterday", status:"Delivered" },
  { id:"SN-002", to:"admin@wipro.com",     subject:"Re: Add 2 new employees",                 time:"2 days ago", status:"Delivered" },
  { id:"SN-003", to:"admin@infosys.com",   subject:"Security protocol update — Version 2.1",  time:"3 days ago", status:"Delivered" },
];

const TEMPLATES = [
  { key:"welcome",    label:"Welcome New Org Admin",   preview:"Dear [Name], Welcome to CorpVMS. Your organization [Org] has been successfully registered..." },
  { key:"maintenance",label:"Maintenance Notification", preview:"Dear Admin, CorpVMS will undergo scheduled maintenance on [Date] from [Time]..." },
  { key:"alert",      label:"Security Alert Notice",    preview:"URGENT: A security incident has been reported in [Org]. Immediate action required..." },
  { key:"report",     label:"Monthly Report Request",   preview:"Dear [Name], Please submit your monthly visitor report for [Month] by [Date]..." },
];

const ORG_ADMINS = [
  "All Org Admins",
  "admin@infosys.com — Meera Krishnan",
  "admin@tcs.com — Priya Sharma",
  "admin@wipro.com — Suresh Naik",
  "admin@raheja.com — Sunita Rao",
  "admin@hcl.com — Deepak Nair",
];

export default function EmailCenter({ addToast }) {
  const [tab,      setTab]     = useState("inbox");   // inbox | compose | sent | templates
  const [selected, setSelected]= useState(null);
  const [inbox,    setInbox]   = useState(INBOX);
  const [compose,  setCompose] = useState({ to:"", subject:"", body:"" });

  const unread = inbox.filter(m=>!m.read).length;

  const openMail = (m) => {
    setSelected(m);
    setInbox(prev=>prev.map(x=>x.id===m.id?{...x,read:true}:x));
  };

  const sendEmail = () => {
    if(!compose.to||!compose.subject||!compose.body){ addToast("Please fill all fields","danger"); return; }
    addToast(`📧 Email sent to ${compose.to.split("—")[0].trim()}!`,"success");
    setCompose({to:"",subject:"",body:""});
    setTab("sent");
  };

  const useTemplate = (tpl) => {
    setCompose(c=>({...c, subject: tpl.label, body: tpl.preview}));
    setTab("compose");
    addToast("Template loaded into compose window","info");
  };

  return (
    <div className="page">

      {/* ── Tab header ── */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        <div style={{display:"flex",gap:3,background:"rgba(255,255,255,.04)",borderRadius:".55rem",padding:3}}>
          {[
            {key:"inbox",    label:"📥 Inbox",      badge:unread},
            {key:"compose",  label:"✉️ Compose",     badge:0},
            {key:"sent",     label:"📤 Sent",        badge:0},
            {key:"templates",label:"📋 Templates",   badge:0},
          ].map(t=>(
            <button key={t.key} onClick={()=>{setTab(t.key);setSelected(null);}}
              style={{padding:"6px 14px",borderRadius:".4rem",border:"none",cursor:"pointer",fontFamily:"Nunito,sans-serif",fontSize:12.5,fontWeight:700,display:"flex",alignItems:"center",gap:6,
                background:tab===t.key?"var(--surface2)":"none", color:tab===t.key?"var(--text)":"var(--muted)"}}>
              {t.label}
              {t.badge>0&&<span style={{background:"var(--primary)",color:"#fff",fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8}}>{t.badge}</span>}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto",fontSize:11,color:"var(--muted)"}}>
          <i className="bi bi-envelope-fill" style={{marginRight:5,color:"#0d6efd"}}/>{unread} unread messages
        </div>
      </div>

      {/* ══ INBOX ══ */}
      {tab==="inbox" && (
        <div style={{display:"grid",gridTemplateColumns:selected?"1fr 1.3fr":"1fr",gap:16}}>
          {/* Mail list */}
          <div className="cv-card">
            <div className="card-head">
              <span className="card-head-title">📥 Inbox</span>
              <span style={{background:"var(--primary)",color:"#fff",fontSize:9.5,fontWeight:800,padding:"2px 8px",borderRadius:10}}>{unread} New</span>
            </div>
            <div>
              {inbox.map(m=>(
                <div key={m.id} onClick={()=>openMail(m)}
                  style={{display:"flex",gap:12,padding:"13px 18px",borderBottom:"1px solid var(--border)",cursor:"pointer",
                    background:selected?.id===m.id?"rgba(13,110,253,.07)":m.read?"transparent":"rgba(13,110,253,.03)",
                    borderLeft:selected?.id===m.id?"3px solid var(--primary)":"3px solid transparent",transition:"background .15s"}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(13,110,253,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#93c5fd",flexShrink:0}}>
                    {m.fromName.split(" ").map(x=>x[0]).join("").slice(0,2)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:12.5,fontWeight:m.read?600:800,color:m.read?"var(--muted)":"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                        {m.fromName}
                      </div>
                      <div style={{fontSize:10,color:"var(--muted)",flexShrink:0,marginLeft:8}}>{m.time}</div>
                    </div>
                    <div style={{fontSize:12,fontWeight:m.read?500:700,color:m.read?"var(--muted)":"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginTop:2}}>
                      {m.subject}
                    </div>
                    <span style={{fontSize:9.5,fontWeight:800,padding:"1px 7px",borderRadius:8,marginTop:3,display:"inline-block",
                      background:m.tagColor+"15",color:m.tagColor,border:`1px solid ${m.tagColor}25`}}>{m.tag}</span>
                  </div>
                  {!m.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--primary)",flexShrink:0,marginTop:6}}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Mail detail */}
          {selected && (
            <div className="cv-card">
              <div className="card-head">
                <span className="card-head-title" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.subject}</span>
                <button className="act-btn" style={{flexShrink:0}} onClick={()=>setSelected(null)}><i className="bi bi-x-lg"/></button>
              </div>
              <div className="card-body">
                {/* From / To / Time strip */}
                <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--border)",borderRadius:".65rem",padding:"12px 16px",marginBottom:16}}>
                  {[["From",`${selected.fromName} <${selected.from}>`],["To","globaladmin@corpvms.com"],["Time",selected.time]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",gap:10,fontSize:11.5,marginBottom:4}}>
                      <span style={{color:"var(--muted)",fontWeight:700,width:40}}>{l}:</span>
                      <span style={{color:"var(--text)"}}>{v}</span>
                    </div>
                  ))}
                </div>
                {/* Body */}
                <div style={{fontSize:13,color:"var(--muted)",lineHeight:1.8,whiteSpace:"pre-line",padding:"0 4px"}}>
                  {selected.body}
                </div>
                {/* Actions */}
                <div style={{display:"flex",gap:8,marginTop:20,paddingTop:16,borderTop:"1px solid var(--border)"}}>
                  <button className="cv-btn btn-primary sm" onClick={()=>{setCompose({to:selected.from,subject:`Re: ${selected.subject}`,body:""});setTab("compose");setSelected(null);}}>
                    <i className="bi bi-reply-fill"/> Reply
                  </button>
                  <button className="cv-btn btn-ghost sm" onClick={()=>addToast("📥 Email archived","info")}>
                    <i className="bi bi-archive-fill"/> Archive
                  </button>
                  <button className="cv-btn btn-ghost sm" style={{color:"#ff6b7e"}} onClick={()=>{ setInbox(p=>p.filter(x=>x.id!==selected.id)); setSelected(null); addToast("Email deleted","info"); }}>
                    <i className="bi bi-trash3-fill"/> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══ COMPOSE ══ */}
      {tab==="compose" && (
        <div className="cv-card" style={{maxWidth:700}}>
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(13,110,253,.12)",color:"#93c5fd"}}><i className="bi bi-pencil-fill"/></div>
            <span className="card-head-title">Compose Email</span>
          </div>
          <div className="card-body" style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label className="f-label">To *</label>
              <select className="f-control" value={compose.to} onChange={e=>setCompose(c=>({...c,to:e.target.value}))}>
                <option value="">— Select Recipient —</option>
                {ORG_ADMINS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="f-label">Subject *</label>
              <input className="f-control" placeholder="Email subject..." value={compose.subject} onChange={e=>setCompose(c=>({...c,subject:e.target.value}))}/>
            </div>
            <div>
              <label className="f-label">Message *</label>
              <textarea className="f-control" rows="7" placeholder="Write your message here..." value={compose.body} onChange={e=>setCompose(c=>({...c,body:e.target.value}))} style={{resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="cv-btn btn-primary" onClick={sendEmail}><i className="bi bi-send-fill"/>Send Email</button>
              <button className="cv-btn btn-ghost" onClick={()=>setCompose({to:"",subject:"",body:""})}><i className="bi bi-arrow-counterclockwise"/>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ SENT ══ */}
      {tab==="sent" && (
        <div className="cv-card">
          <div className="card-head"><span className="card-head-title">📤 Sent Emails</span></div>
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead><tr><th>To</th><th>Subject</th><th>Sent</th><th>Status</th></tr></thead>
              <tbody>
                {SENT.map(s=>(
                  <tr key={s.id}>
                    <td style={{color:"var(--muted)"}}>{s.to}</td>
                    <td><strong>{s.subject}</strong></td>
                    <td style={{color:"var(--muted)",fontSize:11}}>{s.time}</td>
                    <td><span className="cv-badge b-active">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══ TEMPLATES ══ */}
      {tab==="templates" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          {TEMPLATES.map(tpl=>(
            <div key={tpl.key} className="cv-card" style={{cursor:"pointer"}} onClick={()=>useTemplate(tpl)}>
              <div className="card-head">
                <div className="c-icon" style={{background:"rgba(139,92,246,.12)",color:"#a78bfa"}}><i className="bi bi-file-earmark-text-fill"/></div>
                <span className="card-head-title">{tpl.label}</span>
                <button className="cv-btn btn-primary sm" style={{marginLeft:"auto"}}>
                  <i className="bi bi-pencil-fill"/> Use
                </button>
              </div>
              <div className="card-body">
                <div style={{fontSize:12,color:"var(--muted)",lineHeight:1.6,fontStyle:"italic"}}>
                  "{tpl.preview.slice(0,120)}..."
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
