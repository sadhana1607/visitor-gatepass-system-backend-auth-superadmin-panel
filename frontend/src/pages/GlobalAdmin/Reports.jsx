// ════════════════════════════════════════════════
// src/pages/GlobalAdmin/Reports.jsx
//
// System-wide analytics for Global Admin.
// Shows: visitor trends, org performance,
//        user activity, and export options.
// ════════════════════════════════════════════════

import { useState } from "react";

// ── Mock data ────────────────────────────────────
const MONTHLY_VISITORS = [
  { month:"Jul", count:210 },
  { month:"Aug", count:340 },
  { month:"Sep", count:290 },
  { month:"Oct", count:480 },
  { month:"Nov", count:520 },
  { month:"Dec", count:430 },
  { month:"Jan", count:610 },
  { month:"Feb", count:570 },
  { month:"Mar", count:700 },
  { month:"Apr", count:650 },
  { month:"May", count:780 },
  { month:"Jun", count:820 },
];

const ORG_PERFORMANCE = [
  { name:"Infosys Technologies", visitors:342, users:120, incidents:3,  avgStay:"1h 45m", color:"#0d6efd" },
  { name:"TCS — BKC Tower",      visitors:210, users:85,  incidents:1,  avgStay:"2h 10m", color:"#00c878" },
  { name:"Wipro Campus",         visitors:560, users:200, incidents:5,  avgStay:"1h 20m", color:"#8b5cf6" },
  { name:"Raheja Residences",    visitors:130, users:45,  incidents:0,  avgStay:"0h 45m", color:"#f59e0b" },
  { name:"Lodha Park Apts",      visitors:88,  users:30,  incidents:1,  avgStay:"0h 30m", color:"#ff3d5a" },
  { name:"HCL Technologies",     visitors:410, users:150, incidents:4,  avgStay:"1h 55m", color:"#00c8e0" },
];

const VISITOR_TYPES = [
  { type:"Business Meeting", count:620, color:"#0d6efd" },
  { type:"Vendor / Supplier", count:380, color:"#00c878" },
  { type:"Interview",         count:290, color:"#8b5cf6" },
  { type:"Government / Audit",count:180, color:"#ff3d5a" },
  { type:"Delivery / Others", count:270, color:"#f59e0b" },
];

const WEEKLY = [65, 82, 74, 91, 78, 55, 42];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function Reports({ addToast }) {
  const [period, setPeriod] = useState("monthly"); // monthly | weekly

  const maxVisitors = Math.max(...MONTHLY_VISITORS.map(m=>m.count));
  const totalVisitors = VISITOR_TYPES.reduce((s,v)=>s+v.count,0);

  return (
    <div className="page">

      {/* ── Header with export ── */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div>
          <div style={{fontSize:16,fontWeight:900,color:"var(--text)"}}>📊 System-Wide Reports</div>
          <div style={{fontSize:11.5,color:"var(--muted)",marginTop:2}}>All data across 6 organizations · Updated live</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button className="cv-btn btn-ghost sm" onClick={()=>addToast("📥 Report exported as CSV!","success")}>
            <i className="bi bi-filetype-csv"/> Export CSV
          </button>
          <button className="cv-btn btn-ghost sm" onClick={()=>addToast("📄 Report exported as PDF!","success")}>
            <i className="bi bi-file-earmark-pdf-fill"/> Export PDF
          </button>
        </div>
      </div>

      {/* ── Top stat cards ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        {[
          { label:"Total Visitors (All Time)", value:"1,740",  color:"#0d6efd", icon:"bi-people-fill",        sub:"Across all organizations" },
          { label:"This Month",                value:"820",    color:"#00c878", icon:"bi-calendar-check-fill", sub:"+5.4% vs last month"      },
          { label:"Avg Daily Visits",          value:"46",     color:"#8b5cf6", icon:"bi-graph-up-arrow",      sub:"Across all orgs today"    },
          { label:"Security Incidents",        value:"14",     color:"#ff3d5a", icon:"bi-shield-exclamation",  sub:"3 open · 11 resolved"     },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-glow" style={{background:s.color}}/>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color,fontSize:26}}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <i className={`bi ${s.icon} stat-icon`}/>
          </div>
        ))}
      </div>

      {/* ── Row 2: Bar chart + Weekly ── */}
      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:16}}>

        {/* Monthly visitor trend */}
        <div className="cv-card">
          <div className="card-head">
            <span className="card-head-title">📈 Visitor Trend — Last 12 Months</span>
            <div style={{display:"flex",gap:4,background:"rgba(255,255,255,.04)",borderRadius:".45rem",padding:3}}>
              {["monthly","weekly"].map(p=>(
                <button key={p} onClick={()=>setPeriod(p)}
                  style={{padding:"4px 12px",borderRadius:".35rem",border:"none",cursor:"pointer",fontSize:11.5,fontWeight:700,fontFamily:"Nunito,sans-serif",
                    background:period===p?"var(--surface2)":"none", color:period===p?"var(--text)":"var(--muted)"}}>
                  {p.charAt(0).toUpperCase()+p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="card-body">
            {period==="monthly" ? (
              <>
                <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120}}>
                  {MONTHLY_VISITORS.map((m,i)=>(
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Fira Code',monospace"}}>{m.count}</div>
                      <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${(m.count/maxVisitors)*100}%`,
                        background:`linear-gradient(180deg,#0d6efd,#00c8e0)`,opacity:.75,minHeight:4,transition:"height .4s"}}/>
                      <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Fira Code',monospace"}}>{m.month}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{display:"flex",alignItems:"flex-end",gap:8,height:120}}>
                {WEEKLY.map((h,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                    <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Fira Code',monospace"}}>{h}</div>
                    <div style={{width:"100%",borderRadius:"3px 3px 0 0",height:`${h}%`,
                      background:["#0d6efd","#00c878","#8b5cf6","#f59e0b","#00c8e0","#ff3d5a","#0d6efd"][i],opacity:.8}}/>
                    <div style={{fontSize:9,color:"var(--muted)",fontFamily:"'Fira Code',monospace"}}>{DAYS[i]}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Visitor Type Breakdown */}
        <div className="cv-card">
          <div className="card-head"><span className="card-head-title">🎯 Visit Purpose Breakdown</span></div>
          <div className="card-body">
            {VISITOR_TYPES.map((v,i)=>{
              const pct = Math.round((v.count/totalVisitors)*100);
              return (
                <div key={i} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:"var(--text)"}}>{v.type}</span>
                    <span style={{fontFamily:"'Fira Code',monospace",fontSize:11,color:v.color}}>{pct}% ({v.count})</span>
                  </div>
                  <div style={{height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:v.color,borderRadius:3,transition:"width .5s"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 3: Org performance table ── */}
      <div className="cv-card">
        <div className="card-head">
          <span className="card-head-title">🏢 Organization Performance</span>
          <button className="cv-btn btn-ghost sm" onClick={()=>addToast("📥 Org report downloaded!","success")}>
            <i className="bi bi-download"/> Download
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead>
              <tr><th>Organization</th><th>Total Visitors</th><th>Total Users</th><th>Security Incidents</th><th>Avg Stay</th><th>Performance</th></tr>
            </thead>
            <tbody>
              {ORG_PERFORMANCE.map((o,i)=>{
                const maxV = Math.max(...ORG_PERFORMANCE.map(x=>x.visitors));
                const pct  = Math.round((o.visitors/maxV)*100);
                return (
                  <tr key={i}>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:10,height:10,borderRadius:"50%",background:o.color,flexShrink:0}}/>
                        <strong>{o.name}</strong>
                      </div>
                    </td>
                    <td><span className="mono" style={{color:o.color}}>{o.visitors}</span></td>
                    <td><span className="mono">{o.users}</span></td>
                    <td>
                      <span style={{color:o.incidents>3?"#ff6b7e":o.incidents>0?"#ffaa00":"#00c878",fontFamily:"'Fira Code',monospace",fontWeight:700}}>
                        {o.incidents===0?"✓ None":o.incidents}
                      </span>
                    </td>
                    <td><span className="mono">{o.avgStay}</span></td>
                    <td style={{minWidth:120}}>
                      <div style={{height:5,background:"rgba(255,255,255,.07)",borderRadius:3,overflow:"hidden"}}>
                        <div style={{width:`${pct}%`,height:"100%",background:o.color,borderRadius:3}}/>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
