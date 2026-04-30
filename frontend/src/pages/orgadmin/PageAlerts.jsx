// pages/PageAlerts.jsx
import { useState } from "react";

const INIT_ALERTS = [
  {id:"ALT-001",type:"danger", icon:"🚨",title:"Unauthorized Zone Access",       msg:"Mohammed Raza attempted access to restricted Server Room B2 without authorization.",          time:"14:45",status:"Open",        action:"Guard Notified",  priority:"Critical"},
  {id:"ALT-002",type:"warning",icon:"⏱", title:"Visitor Overstay — 55+ Minutes", msg:"Kavitha Pillai (CVP-004) has exceeded their authorized duration by 55 minutes.",             time:"13:15",status:"Open",        action:"Auto-generated",  priority:"High"    },
  {id:"ALT-003",type:"info",   icon:"🌙",title:"After-Hours Entry Detected",     msg:"Deepa Kulkarni registered after 6:00 PM. Extended access authorized by IT Manager.",         time:"18:30",status:"Acknowledged",action:"Host Authorized",  priority:"Medium"  },
  {id:"ALT-004",type:"danger", icon:"👁", title:"Blacklist Match Flagged",        msg:"System flagged a match against the restricted visitor list during ID verification process.",   time:"10:12",status:"Resolved",    action:"Guard Cleared",   priority:"Critical"},
  {id:"ALT-005",type:"warning",icon:"🚗", title:"Unregistered Vehicle Detected",  msg:"Vehicle MH-12-XX-9999 found in restricted parking zone. Not linked to any active visitor.",  time:"09:40",status:"Resolved",    action:"Guard Investigated",priority:"Low"   },
];

export function PageAlerts({ addToast, openAlerts, setOpenAlerts }) {
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [filter, setFilter] = useState("all");

  const resolve = (id) => {
    setAlerts(a => a.map(x => x.id===id ? {...x,status:"Resolved"} : x));
    setOpenAlerts(n => Math.max(0, n-1));
    addToast("Alert resolved and logged ✅","success");
  };
  const ack = (id) => {
    setAlerts(a => a.map(x => x.id===id ? {...x,status:"Acknowledged"} : x));
    setOpenAlerts(n => Math.max(0, n-1));
    addToast("Alert acknowledged","info");
  };

  const typeStyle = {
    danger:  {cls:"al-danger",  tagColor:"#dc2626", tagBg:"rgba(220,38,38,.08)"},
    warning: {cls:"al-warning", tagColor:"#d97706", tagBg:"rgba(217,119,6,.08)"},
    info:    {cls:"al-info",    tagColor:"#0284c7", tagBg:"rgba(2,132,199,.08)"},
  };
  const badgeMap = {Open:"b-alrt",Acknowledged:"b-pending",Resolved:"b-inactive"};

  const open  = alerts.filter(a=>a.status==="Open").length;
  const acked = alerts.filter(a=>a.status==="Acknowledged").length;
  const done  = alerts.filter(a=>a.status==="Resolved").length;

  const filtered = filter==="all" ? alerts : alerts.filter(a=>a.status===filter);

  return (
    <div className="page">
      {/* Stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        {[
          {label:"Total Alerts",    value:alerts.length, color:"#6366f1", icon:"bi-bell-fill"               },
          {label:"Open / Critical", value:open,          color:"#ef4444", icon:"bi-exclamation-octagon-fill" },
          {label:"Acknowledged",   value:acked,          color:"#d97706", icon:"bi-eye-fill"                },
          {label:"Resolved",       value:done,           color:"#059669", icon:"bi-check-circle-fill"        },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-glow" style={{background:s.color}}/>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color,fontSize:28}}>{s.value}</div>
            <i className={`bi ${s.icon} stat-icon`}/>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["all","Open","Acknowledged","Resolved"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{padding:"7px 16px",borderRadius:"var(--radius-full)",border:"1px solid var(--border-default)",cursor:"pointer",fontSize:13,fontWeight:600,fontFamily:"var(--font-ui)",transition:"all .13s",
              background:filter===f?"var(--brand)":"var(--surface-0)",
              color:filter===f?"#fff":"var(--text-secondary)",
              boxShadow:filter===f?"0 2px 8px rgba(30,41,59,.2)":"var(--shadow-sm)"}}>
            {f==="all"?"All Alerts":f}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16}}>
        {/* Alert list */}
        <div>
          {filtered.length===0 ? (
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--text-tertiary)",fontSize:14}}>No alerts found</div>
          ):filtered.map(a=>{
            const ts = typeStyle[a.type]||typeStyle.info;
            return (
              <div key={a.id} className={`al-card ${ts.cls}`} style={{display:"flex",gap:14,padding:"16px 16px 16px 20px"}}>
                <div style={{fontSize:24,flexShrink:0}}>{a.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}>
                    <strong style={{fontSize:14,color:"var(--text-primary)"}}>{a.title}</strong>
                    <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:"var(--radius-full)",background:ts.tagBg,color:ts.tagColor}}>{a.priority}</span>
                  </div>
                  <div style={{fontSize:13,color:"var(--text-secondary)",lineHeight:1.6,marginBottom:6}}>{a.msg}</div>
                  <div style={{fontSize:11.5,color:"var(--text-tertiary)"}}>{a.time} today · {a.action}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end",flexShrink:0}}>
                  <span className={`cv-badge ${badgeMap[a.status]}`}>{a.status}</span>
                  {a.status==="Open"&&<>
                    <button className="cv-btn btn-ghost sm" style={{fontSize:12}} onClick={()=>ack(a.id)}><i className="bi bi-eye"/>Acknowledge</button>
                    <button className="cv-btn btn-ghost sm" style={{fontSize:12,color:"#d97706"}} onClick={()=>addToast("Escalated to Security Manager","warning")}><i className="bi bi-exclamation-triangle-fill"/>Escalate</button>
                  </>}
                  {a.status==="Acknowledged"&&(
                    <button className="cv-btn btn-success sm" style={{fontSize:12}} onClick={()=>resolve(a.id)}><i className="bi bi-check-circle-fill"/>Resolve</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="cv-card">
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(239,68,68,.08)",color:"var(--danger)"}}><i className="bi bi-bar-chart-fill"/></div>
            <span className="card-head-title">Alert Summary</span>
          </div>
          <div className="card-body">
            {[
              ["Critical Alerts", alerts.filter(a=>a.priority==="Critical").length, "#ef4444"],
              ["High Priority",   alerts.filter(a=>a.priority==="High").length,     "#d97706"],
              ["Medium",          alerts.filter(a=>a.priority==="Medium").length,   "#0ea5e9"],
              ["Low",             alerts.filter(a=>a.priority==="Low").length,      "#10b981"],
              ["Open",            open,                                              "#ef4444"],
              ["Acknowledged",    acked,                                             "#d97706"],
              ["Resolved",        done,                                              "#059669"],
            ].map(([l,v,c])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border-subtle)"}}>
                <span style={{fontSize:13,color:"var(--text-secondary)"}}>{l}</span>
                <span style={{fontFamily:"var(--font-mono)",fontWeight:700,color:c,fontSize:16}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:14,padding:12,background:"rgba(220,38,38,.05)",border:"1px solid rgba(220,38,38,.12)",borderRadius:"var(--radius-md)",fontSize:12,color:"#dc2626",lineHeight:1.6}}>
              <i className="bi bi-info-circle" style={{marginRight:6}}/>
              All critical incidents are automatically reported to the Global Admin dashboard.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default PageAlerts;
