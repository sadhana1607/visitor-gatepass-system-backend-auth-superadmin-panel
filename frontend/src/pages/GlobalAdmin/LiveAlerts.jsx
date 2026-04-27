// ════════════════════════════════════════════════
// src/pages/GlobalAdmin/LiveAlerts.jsx
//
// Live security alerts from all organizations.
// Role-aware: Global Admin sees ALL org alerts.
// Features:
//  - Real-time alert feed
//  - Filter by org, severity, status
//  - Acknowledge / Resolve / Escalate
//  - Alert statistics
// ════════════════════════════════════════════════

import { useState, useEffect } from "react";

const INIT_ALERTS = [
  { id:"ALT-001", org:"Infosys Technologies", orgColor:"#0d6efd", type:"danger",  icon:"🚨", title:"Unauthorized Zone Access",       msg:"Visitor CVP-2025-0005 attempted access to restricted Server Room B2.",                    time:"14:45", status:"Open",         action:"Escalated to L3" },
  { id:"ALT-002", org:"Wipro Campus",         orgColor:"#8b5cf6", type:"danger",  icon:"🔴", title:"Blacklist Match Detected",        msg:"System flagged a visitor during ID check against the restricted visitor database.",        time:"14:12", status:"Open",         action:"Guard Notified" },
  { id:"ALT-003", org:"TCS — BKC Tower",      orgColor:"#00c878", type:"warning", icon:"⏱", title:"Visitor Overstay — 55+ Minutes", msg:"Visitor Anil Verma (Pass: TCS-0042) has exceeded authorized duration by 55 minutes.",      time:"13:15", status:"Open",         action:"Auto-generated" },
  { id:"ALT-004", org:"HCL Technologies",     orgColor:"#00c8e0", type:"warning", icon:"🌙", title:"After-Hours Entry Attempt",      msg:"Visitor attempted check-in at 9:15 PM, after official hours. Host authorization required.",time:"21:15", status:"Acknowledged", action:"Host Contacted" },
  { id:"ALT-005", org:"Raheja Residences",    orgColor:"#f59e0b", type:"info",    icon:"🔔", title:"Unknown Vehicle in Premises",    msg:"Unregistered vehicle MH-12-XX-9999 detected in the residential parking zone.",             time:"12:00", status:"Acknowledged", action:"Guard Investigating" },
  { id:"ALT-006", org:"Infosys Technologies", orgColor:"#0d6efd", type:"info",    icon:"📋", title:"Duplicate Visitor Registration", msg:"Same visitor Rohit Kumar attempted to register twice in one day. Second pass blocked.",      time:"10:30", status:"Resolved",     action:"System Blocked" },
  { id:"ALT-007", org:"Wipro Campus",         orgColor:"#8b5cf6", type:"danger",  icon:"🚨", title:"Tailgating Detected at Gate",    msg:"Security camera flagged possible tailgating at Main Gate. Guard dispatched immediately.",   time:"09:52", status:"Resolved",     action:"Guard Cleared" },
];

// Simulated live ticker items
const LIVE_TICKER = [
  "🟢 Infosys: Sunita Verma checked in — 10:02 AM",
  "🔴 Wipro: Blacklist check triggered — 14:12 PM",
  "🟡 TCS: Visitor overstay warning raised — 13:15 PM",
  "🟢 HCL: Deepak Nair pre-registration confirmed",
  "🔴 Infosys: L3 escalation raised — ESC-001",
  "🟢 Raheja: 5 new visitor check-ins this hour",
];

const TYPE_STYLE = {
  danger:  { cls:"al-danger",  labelColor:"#ff6b7e",  badgeStyle:"b-alrt" },
  warning: { cls:"al-warning", labelColor:"#ffaa00",  badgeStyle:"b-pend" },
  info:    { cls:"al-info",    labelColor:"#93c5fd",  badgeStyle:"b-blue" },
};

export default function LiveAlerts({ addToast }) {
  const [alerts,      setAlerts]     = useState(INIT_ALERTS);
  const [orgFilter,   setOrgFilter]  = useState("all");
  const [typeFilter,  setTypeFilter] = useState("all");
  const [statusFilter,setStatusFilter]=useState("all");
  const [ticker,      setTicker]     = useState(0);

  // Cycle through ticker every 3 seconds
  useEffect(()=>{
    const t = setInterval(()=>setTicker(n=>(n+1)%LIVE_TICKER.length),3000);
    return ()=>clearInterval(t);
  },[]);

  const orgs = [...new Set(alerts.map(a=>a.org))];

  const filtered = alerts.filter(a=>{
    if(orgFilter!=="all"    && a.org!==orgFilter)     return false;
    if(typeFilter!=="all"   && a.type!==typeFilter)   return false;
    if(statusFilter!=="all" && a.status!==statusFilter) return false;
    return true;
  });

  const doAck     = (id) => { setAlerts(p=>p.map(a=>a.id===id?{...a,status:"Acknowledged"}:a)); addToast("Alert acknowledged","info"); };
  const doResolve = (id) => { setAlerts(p=>p.map(a=>a.id===id?{...a,status:"Resolved"}:a));     addToast("✅ Alert resolved & logged","success"); };
  const doEsc     = (id) => { setAlerts(p=>p.map(a=>a.id===id?{...a,status:"Escalated",action:"Escalated to Authority"}:a)); addToast("🔺 Escalated to org admin","warning"); };

  const openCount  = alerts.filter(a=>a.status==="Open").length;
  const critCount  = alerts.filter(a=>a.type==="danger").length;
  const resolvedCount = alerts.filter(a=>a.status==="Resolved").length;

  return (
    <div className="page">

      {/* ── Live Ticker Banner ── */}
      <div style={{background:"rgba(255,61,90,.07)",border:"1px solid rgba(255,61,90,.2)",borderRadius:".65rem",padding:"10px 18px",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:9.5,fontWeight:900,color:"#ff6b7e",textTransform:"uppercase",letterSpacing:1,background:"rgba(255,61,90,.2)",padding:"3px 8px",borderRadius:6,flexShrink:0,animation:"pulse-dot 1.5s infinite"}}>
          ● LIVE
        </span>
        <span style={{fontSize:12.5,color:"var(--text)",fontWeight:600,transition:"opacity .3s"}}>
          {LIVE_TICKER[ticker]}
        </span>
      </div>

      {/* ── Stat strip ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          { label:"Total Alerts Today", value:alerts.length,    color:"#0d6efd", icon:"bi-bell-fill"          },
          { label:"Open / Critical",    value:openCount,        color:"#ff3d5a", icon:"bi-exclamation-octagon-fill" },
          { label:"Acknowledged",       value:alerts.filter(a=>a.status==="Acknowledged").length, color:"#ffaa00", icon:"bi-eye-fill" },
          { label:"Resolved Today",     value:resolvedCount,    color:"#00c878", icon:"bi-check-circle-fill"   },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-glow" style={{background:s.color}}/>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color,fontSize:26}}>{s.value}</div>
            <i className={`bi ${s.icon} stat-icon`}/>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16}}>

        {/* ── Alert Feed ── */}
        <div>
          {/* Filters */}
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
            <select className="f-control" style={{width:"auto",padding:"5px 12px",fontSize:12}} value={orgFilter} onChange={e=>setOrgFilter(e.target.value)}>
              <option value="all">All Organizations</option>
              {orgs.map(o=><option key={o} value={o}>{o}</option>)}
            </select>
            <select className="f-control" style={{width:"auto",padding:"5px 12px",fontSize:12}} value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="danger">🔴 Critical</option>
              <option value="warning">🟡 Warning</option>
              <option value="info">🔵 Info</option>
            </select>
            <select className="f-control" style={{width:"auto",padding:"5px 12px",fontSize:12}} value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Resolved">Resolved</option>
            </select>

          </div>

          {/* Alert cards */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {filtered.length===0 ? (
              <div style={{textAlign:"center",padding:40,color:"var(--muted)",fontSize:13}}>No alerts matching filters</div>
            ) : filtered.map(a=>{
              const ts = TYPE_STYLE[a.type]||TYPE_STYLE.info;
              return (
                <div key={a.id} className={`cv-alert ${ts.cls}`} style={{display:"flex",gap:12,padding:"14px 16px",borderRadius:".75rem",border:"1px solid"}}>
                  <div style={{fontSize:22,flexShrink:0}}>{a.icon}</div>
                  <div style={{flex:1}}>
                    {/* Org + severity */}
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:a.orgColor,flexShrink:0}}/>
                      <span style={{fontSize:10,fontWeight:800,color:a.orgColor}}>{a.org}</span>
                      <span style={{fontSize:10,color:"var(--muted)"}}>·</span>
                      <span style={{fontSize:10,fontWeight:800,color:ts.labelColor,textTransform:"uppercase"}}>{a.type}</span>
                    </div>
                    <div style={{fontSize:13,fontWeight:800,color:"var(--text)",marginBottom:4}}>{a.title}</div>
                    <div style={{fontSize:11.5,color:"var(--muted)",lineHeight:1.5,marginBottom:6}}>{a.msg}</div>
                    <div style={{fontSize:10.5,color:"var(--muted)"}}>{a.time} today · {a.action}</div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"flex-end",flexShrink:0}}>
                    <span className={`cv-badge ${a.status==="Open"?"b-alrt":a.status==="Acknowledged"?"b-pend":a.status==="Escalated"?"b-alrt":"b-inactive"}`}>
                      {a.status}
                    </span>
                    {a.status==="Open" && (
                      <>
                        <button className="cv-btn btn-ghost sm" style={{fontSize:10.5}} onClick={()=>doAck(a.id)}><i className="bi bi-eye"/>Ack</button>
                        <button className="cv-btn btn-ghost sm" style={{fontSize:10.5,color:"#ffaa00"}} onClick={()=>doEsc(a.id)}><i className="bi bi-exclamation-triangle-fill"/>Escalate</button>
                      </>
                    )}
                    {a.status==="Acknowledged" && (
                      <button className="cv-btn btn-success sm" style={{fontSize:10.5}} onClick={()=>doResolve(a.id)}><i className="bi bi-check-circle-fill"/>Resolve</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Stats by org ── */}
        <div>
          <div className="cv-card mb16" style={{marginBottom:16}}>
            <div className="card-head"><span className="card-head-title">📊 Alerts by Organization</span></div>
            <div className="card-body">
              {orgs.map(org=>{
                const orgAlerts = alerts.filter(a=>a.org===org);
                const open   = orgAlerts.filter(a=>a.status==="Open").length;
                const danger = orgAlerts.filter(a=>a.type==="danger").length;
                const color  = alerts.find(a=>a.org===org)?.orgColor||"#888";
                return (
                  <div key={org} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <div style={{width:8,height:8,borderRadius:"50%",background:color}}/>
                        <span style={{fontSize:12,color:"var(--text)",fontWeight:700}}>{org}</span>
                      </div>
                      <div style={{display:"flex",gap:5}}>
                        {open>0&&<span className="cv-badge b-alrt" style={{fontSize:9}}>{open} Open</span>}
                        {danger>0&&<span style={{fontSize:9,fontWeight:800,padding:"1px 6px",borderRadius:8,background:"rgba(255,61,90,.15)",color:"#ff6b7e"}}>{danger} Critical</span>}
                      </div>
                    </div>
                    <div style={{fontSize:10.5,color:"var(--muted)",marginBottom:4}}>{orgAlerts.length} total alerts</div>
                    <div style={{height:4,background:"rgba(255,255,255,.07)",borderRadius:3}}>
                      <div style={{width:`${Math.min((orgAlerts.length/alerts.length)*100*2,100)}%`,height:"100%",background:color,borderRadius:3}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="cv-card">
            <div className="card-head"><span className="card-head-title">⚡ Alert Type Summary</span></div>
            <div className="card-body">
              {[
                { label:"🔴 Critical Alerts", count:critCount,                               color:"#ff3d5a" },
                { label:"🟡 Warnings",         count:alerts.filter(a=>a.type==="warning").length, color:"#ffaa00" },
                { label:"🔵 Info Alerts",       count:alerts.filter(a=>a.type==="info").length,   color:"#93c5fd" },
                { label:"✅ Resolved",           count:resolvedCount,                          color:"#00c878" },
              ].map(r=>(
                <div key={r.label} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid var(--border)"}}>
                  <span style={{fontSize:12.5,color:"var(--muted)"}}>{r.label}</span>
                  <span style={{fontFamily:"'Fira Code',monospace",fontWeight:700,color:r.color,fontSize:15}}>{r.count}</span>
                </div>
              ))}
              <div style={{marginTop:14,padding:12,background:"rgba(255,61,90,.06)",border:"1px solid rgba(255,61,90,.15)",borderRadius:".6rem",fontSize:11,color:"#fca5a5"}}>
                <i className="bi bi-info-circle" style={{marginRight:6}}/>
                All alerts auto-escalate per SLA if unresolved within 10 minutes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
