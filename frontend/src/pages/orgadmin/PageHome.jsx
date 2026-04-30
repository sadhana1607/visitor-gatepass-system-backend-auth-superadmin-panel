// pages/PageHome.jsx — Dashboard overview
import { useAuth } from "../../context/AuthContext";

const ini = n => n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();

const MOCK_VISITORS = [
  { id:"CVP-001", name:"Arjun Mehta",    org:"Tata Consulting",   host:"Meera Krishnan",   zone:"HR Wing",       checkin:"09:15", status:"in",  clr:"#6366f1" },
  { id:"CVP-002", name:"Sunita Verma",   org:"McKinsey & Co",     host:"Rajesh Singhania", zone:"Board Room",    checkin:"10:00", status:"in",  clr:"#f59e0b" },
  { id:"CVP-003", name:"Rajan Kumar",    org:"HP India",          host:"Vikram Joshi",     zone:"IT Dept",       checkin:"11:20", status:"out", clr:"#10b981" },
  { id:"CVP-004", name:"Kavitha Pillai", org:"Self",              host:"Priya Shah",       zone:"Reception",     checkin:"12:30", status:"in",  clr:"#ef4444" },
];

const ACTIVITY = [
  { dot:"#10b981", txt:"Arjun Mehta checked in at HR Wing",               time:"09:15 AM" },
  { dot:"#ef4444", txt:"Security alert: Unauthorized access — Floor 3",   time:"08:52 AM" },
  { dot:"#6366f1", txt:"Pre-reg confirmed: Rohit Sharma — Deloitte",      time:"08:30 AM" },
  { dot:"#f59e0b", txt:"Rajan Kumar (HP India) departed successfully",    time:"12:50 PM" },
  { dot:"#8b5cf6", txt:"New employee added: Sunita Rao — Operations",     time:"Yesterday"},
];

export default function PageHome({ setPage, addToast, openAlerts }) {
  const { user } = useAuth();
  const org = user?.org;
  const inside = MOCK_VISITORS.filter(v=>v.status==="in");

  return (
    <div className="page">
      {/* Welcome banner */}
      <div style={{background:"linear-gradient(135deg,#1e293b 0%,#334155 100%)",borderRadius:"var(--radius-lg)",padding:"24px 28px",marginBottom:22,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"var(--shadow-lg)"}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>Welcome back</div>
          <div style={{fontSize:22,fontWeight:800,color:"#fff",letterSpacing:"-.4px"}}>{user?.name} 👋</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.55)",marginTop:4}}>{org?.name} · {org?.city}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:11,color:"rgba(255,255,255,.4)",marginBottom:4}}>Organization Status</div>
          <span style={{padding:"5px 14px",borderRadius:"var(--radius-full)",background:"rgba(5,150,105,.2)",border:"1px solid rgba(5,150,105,.3)",color:"#34d399",fontSize:12,fontWeight:700}}>● Active</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        {[
          { label:"Total Employees",   value:org?.employees||0, color:"#6366f1",  icon:"bi-people-fill",       sub:"Active in org",       pg:"employees" },
          { label:"Visitors Today",    value:MOCK_VISITORS.length, color:"#0ea5e9", icon:"bi-person-badge-fill", sub:"Registered today",    pg:null        },
          { label:"Currently Inside",  value:inside.length,     color:"#10b981",  icon:"bi-person-check-fill", sub:"On premises now",     pg:null        },
          { label:"Open Alerts",       value:openAlerts,        color:"#ef4444",  icon:"bi-shield-exclamation",sub:"Require attention",   pg:"alerts"    },
        ].map(s=>(
          <div key={s.label} className="stat-card" onClick={()=>s.pg&&setPage(s.pg)}>
            <div className="stat-glow" style={{background:s.color}}/>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color}}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <i className={`bi ${s.icon} stat-icon`}/>
          </div>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.6fr 1fr",gap:16,marginBottom:16}}>
        {/* Active visitors */}
        <div className="cv-card">
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(16,185,129,.1)",color:"#059669"}}><i className="bi bi-person-check-fill"/></div>
            <span className="card-head-title">Currently Inside</span>
            <span className="cv-badge b-active">{inside.length} Active</span>
          </div>
          <div className="overflow-x-auto">
            <table className="cv-table">
              <thead><tr><th>Pass ID</th><th>Visitor</th><th>Host</th><th>Zone</th><th>Since</th></tr></thead>
              <tbody>
                {inside.length===0 ? (
                  <tr><td colSpan="5" style={{textAlign:"center",padding:28,color:"var(--text-tertiary)"}}>No active visitors</td></tr>
                ):inside.map(v=>(
                  <tr key={v.id}>
                    <td><span className="mono">{v.id}</span></td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:9}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:v.clr+"15",border:`1px solid ${v.clr}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:v.clr,flexShrink:0}}>{ini(v.name)}</div>
                        <div><strong>{v.name}</strong><div style={{fontSize:11,color:"var(--text-tertiary)"}}>{v.org}</div></div>
                      </div>
                    </td>
                    <td style={{fontSize:12.5}}>{v.host}</td>
                    <td style={{fontSize:12,color:"var(--text-tertiary)"}}>{v.zone}</td>
                    <td><span className="mono">{v.checkin}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity feed */}
        <div className="cv-card">
          <div className="card-head">
            <div className="c-icon" style={{background:"rgba(99,102,241,.1)",color:"#6366f1"}}><i className="bi bi-activity"/></div>
            <span className="card-head-title">Live Activity</span>
            <span style={{fontSize:10,fontWeight:700,color:"#059669",padding:"2px 9px",borderRadius:"var(--radius-full)",background:"rgba(5,150,105,.1)",border:"1px solid rgba(5,150,105,.2)",marginLeft:4}}>● LIVE</span>
          </div>
          <div className="card-body" style={{padding:"10px 20px"}}>
            {ACTIVITY.map((f,i)=>(
              <div key={i} className="feed-item">
                <div className="feed-dot" style={{background:f.dot}}/>
                <div style={{flex:1,fontSize:12.5,color:"var(--text-secondary)",lineHeight:1.5}}>{f.txt}</div>
                <div className="feed-time">{f.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="cv-card">
        <div className="card-head">
          <div className="c-icon" style={{background:"rgba(14,165,233,.1)",color:"#0ea5e9"}}><i className="bi bi-lightning-fill"/></div>
          <span className="card-head-title">Quick Actions</span>
        </div>
        <div className="card-body" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[
            {icon:"bi-people-fill",        label:"Manage Employees",   color:"#6366f1",  pg:"employees"},
            {icon:"bi-shield-exclamation", label:"View Alerts",         color:"#ef4444",  pg:"alerts"   },
            {icon:"bi-envelope-fill",      label:"Check Email",         color:"#0ea5e9",  pg:"email"    },
            {icon:"bi-building",           label:"Org Information",     color:"#f59e0b",  pg:"info"     },
          ].map(q=>(
            <button key={q.label} onClick={()=>setPage(q.pg)}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,padding:"20px 12px",
                background:q.color+"0d",border:`1px solid ${q.color}20`,
                borderRadius:"var(--radius-lg)",cursor:"pointer",transition:"all .15s",boxShadow:"var(--shadow-sm)"}}
              onMouseEnter={e=>{e.currentTarget.style.background=q.color+"1a";e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="var(--shadow-md)";}}
              onMouseLeave={e=>{e.currentTarget.style.background=q.color+"0d";e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow="var(--shadow-sm)";}}>
              <i className={`bi ${q.icon}`} style={{fontSize:24,color:q.color}}/>
              <span style={{fontSize:13,fontWeight:600,color:"var(--text-primary)"}}>{q.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
