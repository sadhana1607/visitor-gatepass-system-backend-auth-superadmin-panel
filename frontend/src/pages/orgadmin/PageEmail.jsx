// pages/PageEmail.jsx — Internal Email for Org Admin
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const INBOX = [
  {id:"ML-001",from:"globaladmin@corpvms.com",fromName:"Global Admin",subject:"Monthly Security Report Required — April 2026",time:"09:15 AM",read:false,tag:"Report",tagColor:"#6366f1",body:"Dear Org Admin,\n\nPlease submit your monthly security and visitor report for April 2026 by April 30th.\n\nThe report should include:\n- Total visitor count\n- Security incidents\n- Employee attendance summary\n- Any escalations raised\n\nSubmit via the CorpVMS portal or reply to this email.\n\nRegards,\nGlobal Admin Team\nCorpVMS"},
  {id:"ML-002",from:"security@corpvms.com",  fromName:"Security System",subject:"⚠ Auto-Alert: Unauthorized access attempt logged",time:"08:52 AM",read:false,tag:"Alert",tagColor:"#ef4444",body:"This is an automated security notification.\n\nAn unauthorized access attempt was detected at your organization:\n\nDetails:\n- Visitor: Mohammed Raza\n- Zone: Server Room B2 (RESTRICTED)\n- Time: 08:50 AM\n- Action Taken: Entry Blocked\n- Status: Escalated to Security Guard\n\nPlease review and take necessary action.\n\nCorpVMS Security System"},
  {id:"ML-003",from:"ram@company.com",       fromName:"Ram Gupta",       subject:"Visitor gate pass issue — urgent",time:"Yesterday",read:true, tag:"Internal",tagColor:"#10b981",body:"Dear Admin,\n\nI am facing an issue with the visitor gate pass system. When I try to scan the QR code for pass CVP-006, the system shows an error.\n\nCould you please look into this and help me resolve it?\n\nThe visitor Deepa Kulkarni is waiting at the gate.\n\nThanks,\nRam Gupta\nSecurity Guard"},
  {id:"ML-004",from:"globaladmin@corpvms.com",fromName:"Global Admin",subject:"System Maintenance — April 25, 2026 (12 AM - 2 AM)",time:"2 days ago",read:true,tag:"Notice",tagColor:"#8b5cf6",body:"Dear Organization Admin,\n\nPlease be informed that the CorpVMS system will undergo scheduled maintenance on April 25, 2026 from 12:00 AM to 2:00 AM IST.\n\nDuring this time:\n- Visitor check-in/out will be unavailable\n- All gate passes should be printed in advance\n- Manual registers should be maintained\n\nWe apologize for any inconvenience.\n\nCorpVMS Operations Team"},
];

const SENT = [
  {id:"SN-001",to:"globaladmin@corpvms.com",subject:"Re: Monthly Security Report — March 2026",time:"3 days ago",status:"Delivered"},
  {id:"SN-002",to:"ram@company.com",          subject:"Re: Gate pass issue resolved",          time:"Yesterday",   status:"Delivered"},
];

export default function PageEmail({ addToast }) {
  const { user } = useAuth();
  const [tab,      setTab]     = useState("inbox");
  const [inbox,    setInbox]   = useState(INBOX);
  const [selected, setSelected]= useState(null);
  const [compose,  setCompose] = useState({to:"",subject:"",body:""});

  const unread = inbox.filter(m=>!m.read).length;

  const openMail = (m) => {
    setSelected(m);
    setInbox(prev=>prev.map(x=>x.id===m.id?{...x,read:true}:x));
  };

  const sendEmail = () => {
    if(!compose.to||!compose.subject||!compose.body){addToast("Please fill all fields","danger");return;}
    addToast(`📧 Email sent to ${compose.to}!`,"success");
    setCompose({to:"",subject:"",body:""});
    setTab("inbox");
  };

  const RECIPIENTS = [
    "globaladmin@corpvms.com — Global Admin",
    "ram@company.com — Ram Gupta (Security Guard)",
    "rajesh@company.com — Rajesh Singhania (CEO)",
    "meera@company.com — Meera Krishnan (HR Director)",
    "vikram@company.com — Vikram Joshi (CTO)",
  ];

  return (
    <div className="page">
      {/* Tab bar */}
      <div style={{display:"flex",gap:4,background:"var(--surface-2)",borderRadius:"var(--radius-lg)",padding:4,marginBottom:18,width:"fit-content",border:"1px solid var(--border-default)"}}>
        {[
          {k:"inbox",   l:"📥 Inbox",   badge:unread},
          {k:"compose", l:"✉️ Compose", badge:0     },
          {k:"sent",    l:"📤 Sent",    badge:0     },
        ].map(t=>(
          <button key={t.k} onClick={()=>{setTab(t.k);setSelected(null);}}
            style={{padding:"8px 20px",borderRadius:"var(--radius-md)",border:"none",cursor:"pointer",fontFamily:"var(--font-ui)",fontSize:13.5,fontWeight:600,display:"flex",alignItems:"center",gap:7,transition:"all .13s",
              background:tab===t.k?"var(--surface-0)":"none",
              color:tab===t.k?"var(--text-primary)":"var(--text-tertiary)",
              boxShadow:tab===t.k?"var(--shadow-sm)":"none"}}>
            {t.l}
            {t.badge>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,padding:"1px 7px",borderRadius:"var(--radius-full)"}}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── INBOX ── */}
      {tab==="inbox"&&(
        <div style={{display:"grid",gridTemplateColumns:selected?"1fr 1.4fr":"1fr",gap:16}}>
          {/* Mail list */}
          <div className="cv-card">
            <div className="card-head">
              <div className="c-icon" style={{background:"rgba(99,102,241,.1)",color:"#6366f1"}}><i className="bi bi-inbox-fill"/></div>
              <span className="card-head-title">Inbox</span>
              {unread>0&&<span style={{background:"#ef4444",color:"#fff",fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:"var(--radius-full)",marginLeft:4}}>{unread} New</span>}
              {unread>0&&<button className="cv-btn btn-ghost sm" style={{marginLeft:"auto"}} onClick={()=>setInbox(l=>l.map(x=>({...x,read:true})))}><i className="bi bi-check2-all"/>Mark all read</button>}
            </div>
            <div>
              {inbox.map(m=>(
                <div key={m.id} onClick={()=>openMail(m)}
                  style={{display:"flex",gap:12,padding:"14px 20px",borderBottom:"1px solid var(--border-subtle)",cursor:"pointer",transition:"background .13s",
                    background:selected?.id===m.id?"rgba(99,102,241,.05)":m.read?"transparent":"rgba(99,102,241,.02)",
                    borderLeft:selected?.id===m.id?"3px solid var(--brand)":"3px solid transparent"}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:"rgba(30,41,59,.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:"var(--brand)",flexShrink:0}}>
                    {m.fromName.split(" ").map(x=>x[0]).join("").slice(0,2)}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <div style={{fontSize:13,fontWeight:m.read?600:800,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:180}}>{m.fromName}</div>
                      <div style={{fontSize:10.5,color:"var(--text-tertiary)",flexShrink:0,marginLeft:8}}>{m.time}</div>
                    </div>
                    <div style={{fontSize:12.5,fontWeight:m.read?500:700,color:m.read?"var(--text-secondary)":"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:4}}>{m.subject}</div>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:"var(--radius-full)",background:m.tagColor+"10",color:m.tagColor,border:`1px solid ${m.tagColor}22`}}>{m.tag}</span>
                  </div>
                  {!m.read&&<div style={{width:8,height:8,borderRadius:"50%",background:"var(--accent)",flexShrink:0,marginTop:5}}/>}
                </div>
              ))}
            </div>
          </div>

          {/* Mail detail */}
          {selected&&(
            <div className="cv-card">
              <div className="card-head">
                <span className="card-head-title" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{selected.subject}</span>
                <button className="act-btn" style={{flexShrink:0}} onClick={()=>setSelected(null)}><i className="bi bi-x-lg"/></button>
              </div>
              <div className="card-body">
                <div style={{background:"var(--surface-2)",border:"1px solid var(--border-default)",borderRadius:"var(--radius-md)",padding:"12px 16px",marginBottom:18}}>
                  {[["From",`${selected.fromName} <${selected.from}>`],["To",user?.email||"admin@company.com"],["Time",selected.time]].map(([l,v])=>(
                    <div key={l} style={{display:"flex",gap:10,fontSize:12.5,marginBottom:4}}>
                      <span style={{color:"var(--text-tertiary)",fontWeight:600,width:36}}>{l}:</span>
                      <span style={{color:"var(--text-primary)"}}>{v}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontSize:13.5,color:"var(--text-secondary)",lineHeight:1.85,whiteSpace:"pre-line"}}>{selected.body}</div>
                <div style={{display:"flex",gap:8,marginTop:22,paddingTop:16,borderTop:"1px solid var(--border-subtle)"}}>
                  <button className="cv-btn btn-primary sm" onClick={()=>{setCompose({to:selected.from,subject:`Re: ${selected.subject}`,body:""});setTab("compose");setSelected(null);}}>
                    <i className="bi bi-reply-fill"/>Reply
                  </button>
                  <button className="cv-btn btn-ghost sm" onClick={()=>{setInbox(p=>p.filter(x=>x.id!==selected.id));setSelected(null);addToast("Email deleted","info");}}>
                    <i className="bi bi-trash3-fill"/>Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COMPOSE ── */}
      {tab==="compose"&&(
        <div className="cv-card" style={{maxWidth:680}}>
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(99,102,241,.1)",color:"#6366f1"}}><i className="bi bi-pencil-square"/></div>
            <span className="card-head-title">New Email</span>
          </div>
          <div className="card-body" style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label className="f-label">To *</label>
              <select className="f-control" value={compose.to} onChange={e=>setCompose(c=>({...c,to:e.target.value}))}>
                <option value="">— Select Recipient —</option>
                {RECIPIENTS.map(r=><option key={r} value={r.split(" — ")[0]}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="f-label">Subject *</label>
              <input className="f-control" placeholder="Email subject..." value={compose.subject} onChange={e=>setCompose(c=>({...c,subject:e.target.value}))}/>
            </div>
            <div>
              <label className="f-label">Message *</label>
              <textarea className="f-control" rows="8" placeholder="Write your message here..." value={compose.body} onChange={e=>setCompose(c=>({...c,body:e.target.value}))} style={{resize:"vertical"}}/>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="cv-btn btn-primary" onClick={sendEmail}><i className="bi bi-send-fill"/>Send Email</button>
              <button className="cv-btn btn-ghost" onClick={()=>setCompose({to:"",subject:"",body:""})}><i className="bi bi-arrow-counterclockwise"/>Clear</button>
            </div>
          </div>
        </div>
      )}

      {/* ── SENT ── */}
      {tab==="sent"&&(
        <div className="cv-card">
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(16,185,129,.1)",color:"#059669"}}><i className="bi bi-send-fill"/></div>
            <span className="card-head-title">Sent Emails</span>
          </div>
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead><tr><th>To</th><th>Subject</th><th>Sent</th><th>Status</th></tr></thead>
              <tbody>
                {SENT.map(s=>(
                  <tr key={s.id}>
                    <td style={{fontSize:12.5,fontFamily:"var(--font-mono)"}}>{s.to}</td>
                    <td><strong>{s.subject}</strong></td>
                    <td style={{color:"var(--text-tertiary)",fontSize:12}}>{s.time}</td>
                    <td><span className="cv-badge b-active">{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
