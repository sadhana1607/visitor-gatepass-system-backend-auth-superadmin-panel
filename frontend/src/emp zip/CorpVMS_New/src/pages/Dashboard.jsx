import { SEED_VISITORS, formatDate, ORGANIZATION } from "../constants/data";
import StatusBadge from "../components/shared/StatusBadge";

export default function Dashboard({ visitors, employee, navigate }) {
  const myVisitors    = visitors.filter(v => v.registeredBy === employee.id);
  const allToday      = visitors.filter(v => v.visitDate === new Date().toISOString().split("T")[0]);
  const pending       = visitors.filter(v => v.status === "Pending").length;
  const checkedIn     = visitors.filter(v => v.status === "Checked In").length;
  const completed     = visitors.filter(v => v.status === "Completed").length;
  const totalMine     = myVisitors.length;

  const recentActivity = [
    { dot:"#16a34a", text:`Rohit Sharma checked in at Gate 1`,               time:"09:55 AM" },
    { dot:"#2563eb", text:`Ananya Iyer pre-registration confirmed`,           time:"10:05 AM" },
    { dot:"#d97706", text:`Suresh Babu is awaiting approval at Gate 2`,       time:"11:20 AM" },
    { dot:"#7c3aed", text:`Preethi Nair scheduled for tomorrow's audit visit`,time:"Yesterday" },
    { dot:"#6b7280", text:`Mohammed Raza completed visit — departed at 17:30`,time:"Yesterday" },
  ];

  const quickStats = [
    { label: "My Total Visitors",  value: totalMine,  color:"#2563eb",  icon:"bi-people-fill",         sub:"Registered by you" },
    { label: "Pending Approval",   value: pending,    color:"#d97706",  icon:"bi-hourglass-split",     sub:"Awaiting security" },
    { label: "Currently Inside",   value: checkedIn,  color:"#16a34a",  icon:"bi-person-check-fill",   sub:"Active on premises" },
    { label: "Completed Today",    value: completed,  color:"#7c3aed",  icon:"bi-check-circle-fill",   sub:"Successfully departed" },
  ];

  const purposeBreakdown = {};
  visitors.forEach(v => { purposeBreakdown[v.purpose] = (purposeBreakdown[v.purpose] || 0) + 1; });
  const purposeData = Object.entries(purposeBreakdown).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxPurpose = Math.max(...purposeData.map(x=>x[1]), 1);

  const purposeColors = ["#2563eb","#7c3aed","#16a34a","#d97706","#dc2626"];

  return (
    <div className="page-enter">

      {/* Welcome banner */}
      <div style={{
        background:"linear-gradient(135deg, #1a56db 0%, #1447bc 100%)",
        borderRadius:"var(--r-lg)", padding:"20px 24px", marginBottom:20,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        boxShadow:"0 4px 16px rgba(26,86,219,.25)", overflow:"hidden", position:"relative",
      }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,.06)" }} />
        <div style={{ position:"absolute", right:80, bottom:-40, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />
        <div style={{ position:"relative" }}>
          <div style={{ fontSize:18, fontWeight:800, color:"#fff", marginBottom:4, letterSpacing:"-.3px" }}>
            Good {new Date().getHours()<12?"Morning":new Date().getHours()<17?"Afternoon":"Evening"}, {employee.name.split(" ")[0]}! 👋
          </div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,.8)" }}>
            {employee.designation} · {employee.department} · {ORGANIZATION.shortName}
          </div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,.65)", marginTop:4 }}>
            <i className="bi bi-calendar3" style={{ marginRight:5 }} />
            {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
          </div>
        </div>
        <div style={{ position:"relative", display:"flex", gap:10 }}>
          <button className="btn" onClick={() => navigate("prereg")} style={{ background:"rgba(255,255,255,.18)", color:"#fff", border:"1px solid rgba(255,255,255,.3)", backdropFilter:"blur(4px)" }}>
            <i className="bi bi-calendar-plus-fill" />
            Pre-Register
          </button>
          <button className="btn" onClick={() => navigate("reglist")} style={{ background:"rgba(255,255,255,.12)", color:"#fff", border:"1px solid rgba(255,255,255,.2)", backdropFilter:"blur(4px)" }}>
            <i className="bi bi-journal-text" />
            View List
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid-4" style={{ marginBottom:20 }}>
        {quickStats.map((s,i) => (
          <div key={i} className="stat-card" onClick={() => navigate("reglist")}>
            <div className="stat-glow" style={{ background:s.color }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            <i className={`bi ${s.icon} stat-icon`} />
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom:20 }}>

        {/* Recent visitors */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background:"var(--accent-lt)", color:"var(--accent)" }}>
              <i className="bi bi-people-fill" />
            </div>
            <span className="card-title">Recent Visitors</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("reglist")}>
              View All <i className="bi bi-arrow-right" />
            </button>
          </div>
          <div>
            {visitors.slice(0,5).map((v,i) => (
              <div key={v.id} className="visitor-row">
                <div className="visitor-avatar" style={{ background: ["#eff6ff","#f0fdf4","#fffbeb","#faf5ff","#f0fdfa"][i%5], color:["#1e40af","#166534","#92400e","#4c1d95","#0f766e"][i%5] }}>
                  {v.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:"var(--fg)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.name}</div>
                  <div style={{ fontSize:11, color:"var(--fg-3)", marginTop:2, display:"flex", gap:8 }}>
                    <span><i className="bi bi-calendar3" style={{ marginRight:3 }} />{formatDate(v.visitDate)}</span>
                    <span><i className="bi bi-briefcase-fill" style={{ marginRight:3 }} />{v.purpose}</span>
                  </div>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

          {/* Activity feed */}
          <div className="card" style={{ flex:1 }}>
            <div className="card-header">
              <div className="card-icon" style={{ background:"var(--green-lt)", color:"var(--green)" }}>
                <i className="bi bi-activity" />
              </div>
              <span className="card-title">Recent Activity</span>
              <span style={{ fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"var(--green-lt)", color:"var(--green)", border:"1px solid var(--green-bd)" }}>● Live</span>
            </div>
            <div className="card-body" style={{ padding:"10px 16px" }}>
              {recentActivity.map((a,i) => (
                <div key={i} className="feed-item">
                  <div className="feed-dot" style={{ background:a.dot }} />
                  <div style={{ flex:1, fontSize:12, color:"var(--fg-2)" }}>{a.text}</div>
                  <div className="feed-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Purpose chart */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon" style={{ background:"var(--purple-lt)", color:"var(--purple)" }}>
                <i className="bi bi-bar-chart-fill" />
              </div>
              <span className="card-title">Visit Purposes</span>
            </div>
            <div className="card-body">
              {purposeData.map(([purpose, count], i) => {
                const pct = Math.round(count / maxPurpose * 100);
                return (
                  <div key={purpose} style={{ marginBottom:i<purposeData.length-1?12:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:12, color:"var(--fg-2)" }}>{purpose}</span>
                      <span style={{ fontFamily:"var(--mono-font)", fontSize:11, color:"var(--fg-3)", fontWeight:500 }}>{count} visit{count!==1?"s":""}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill" style={{ width:`${pct}%`, background:purposeColors[i%purposeColors.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Organisation quick info */}
      <div className="card">
        <div className="card-header">
          <div className="card-icon" style={{ background:"var(--teal-lt)", color:"var(--teal)" }}>
            <i className="bi bi-building-fill" />
          </div>
          <span className="card-title">Organisation — {ORGANIZATION.name}</span>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate("profile")}>
            Full Details <i className="bi bi-arrow-right" />
          </button>
        </div>
        <div className="card-body">
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16 }}>
            {[
              { icon:"bi-geo-alt-fill",     label:"Headquarters",   value:ORGANIZATION.hq.split(",")[0],    color:"var(--accent)" },
              { icon:"bi-clock-fill",        label:"Working Hours",  value:ORGANIZATION.workingHours,         color:"var(--green)"  },
              { icon:"bi-door-open-fill",    label:"Active Gates",   value:`${ORGANIZATION.gates.length} Gates`, color:"var(--amber)"  },
              { icon:"bi-telephone-fill",    label:"Security Desk",  value:ORGANIZATION.securityDesk,         color:"var(--red)"    },
            ].map((item,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"var(--hover-bg)", borderRadius:"var(--r-md)", border:"1px solid var(--bd)" }}>
                <div style={{ width:36,height:36,borderRadius:"var(--r-sm)",background:"white",border:"1px solid var(--bd)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,boxShadow:"var(--sh-xs)" }}>
                  <i className={`bi ${item.icon}`} style={{ color:item.color, fontSize:16 }} />
                </div>
                <div>
                  <div style={{ fontSize:10,color:"var(--fg-4)",textTransform:"uppercase",letterSpacing:.5,fontWeight:600,marginBottom:2 }}>{item.label}</div>
                  <div style={{ fontSize:12.5, fontWeight:600, color:"var(--fg)" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
