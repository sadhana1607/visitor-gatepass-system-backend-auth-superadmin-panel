// ═══════════════════════════════════════════
// pages/Dashboard.jsx
// Main shell — sidebar + topbar + sub pages
// Modules: Dashboard, Employees, Alerts,
//          Email, Info, Edit Org
// ═══════════════════════════════════════════
import { useState, useEffect } from "react";
import { useAuth }             from "../../context/AuthContext";
import { useNavigate }         from "react-router-dom";
import { useToast, ToastContainer } from "../../components/Toast";

// Sub-pages (all in one file for simplicity)
import PageHome       from "./PageHome";
import PageEmployees  from "./PageEmployees";
import PageAlerts     from "./PageAlerts";
import PageEmail      from "./PageEmail";
import PageOrgInfo    from "./PageOrgInfo";

const NAV = [
  { section:"Overview",       links:[
    { key:"home",      icon:"bi-speedometer2",        label:"Dashboard"           },
  ]},
  { section:"People",         links:[
    { key:"employees", icon:"bi-people-fill",          label:"Manage Employees"    },
  ]},
  { section:"Security",       links:[
    { key:"alerts",    icon:"bi-shield-exclamation",   label:"Live Alerts"         },
  ]},
  { section:"Communication",  links:[
    { key:"email",     icon:"bi-envelope-fill",        label:"Email"               },
  ]},
  { section:"Organization",   links:[
    { key:"info",      icon:"bi-building",             label:"Org Information"     },
  ]},
];

const PAGE_META = {
  home:      { t:"Dashboard",             s:"Your organization's live overview"             },
  employees: { t:"Manage Employees",      s:"Add, edit and manage employees & guards"       },
  alerts:    { t:"Live Security Alerts",  s:"Monitor and resolve security incidents"         },
  email:     { t:"Email",                 s:"Internal emails and communications"             },
  info:      { t:"Organization Info",     s:"View and edit your organization's details"      },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [page, setPage]   = useState("home");
  const [clock, setClock] = useState("");
  const [openAlerts, setOpenAlerts] = useState(2);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",second:"2-digit"}));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const meta = PAGE_META[page] || { t: page, s: "" };

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"/>
      <div className="app-wrap">

        {/* ══ SIDEBAR ══ */}
        <div className="sidebar">
          {/* Brand */}
          <div className="sb-brand">
            <div className="brand-logo">
              <i className="bi bi-building-fill"/>
            </div>
            <div>
              <div className="brand-title">{user?.org?.name?.split(" ")[0] || "OrgAdmin"}</div>
              <div className="brand-sub">Admin Portal</div>
            </div>
          </div>

          {/* Nav */}
          <div className="sb-scroll">
            {NAV.map(sec => (
              <div key={sec.section}>
                <div className="sb-section">{sec.section}</div>
                <div className="sb-nav">
                  {sec.links.map(link => (
                    <button
                      key={link.key}
                      className={`sb-link ${page === link.key ? "active" : ""}`}
                      onClick={() => setPage(link.key)}
                    >
                      <i className={`bi ${link.icon}`}/>
                      {link.label}
                      {/* Alert badge */}
                      {link.key === "alerts" && openAlerts > 0 && (
                        <span className="sb-badge" style={{background:"rgba(220,38,38,.1)",color:"#dc2626",border:"1px solid rgba(220,38,38,.2)"}}>
                          {openAlerts}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* User footer */}
          <div className="sb-foot">
            <div className="user-pill">
              <div className="user-av">{user?.initials || "OA"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12.5,fontWeight:700,color:"var(--text-primary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {user?.name}
                </div>
                <span className="role-pill rp-orgadmin">Org Admin</span>
              </div>
              <div className="online-dot"/>
            </div>
            <button className="cv-btn btn-ghost sm" style={{width:"100%",justifyContent:"center"}} onClick={handleLogout}>
              <i className="bi bi-box-arrow-left"/>Sign Out
            </button>
          </div>
        </div>

        {/* ══ MAIN ══ */}
        <div className="main-wrap">
          {/* Topbar */}
          <div className="topbar">
            <div style={{flex:1}}>
              <div className="pg-title">{meta.t}</div>
              <div className="pg-sub">{meta.s}</div>
            </div>
            <div className="clock-chip">{clock}</div>
            {/* Alert chip */}
            {openAlerts > 0 && (
              <button
                onClick={() => setPage("alerts")}
                style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:"var(--radius-md)",background:"rgba(220,38,38,.08)",border:"1px solid rgba(220,38,38,.15)",fontSize:12.5,fontWeight:700,color:"#dc2626",cursor:"pointer",animation:"alertblink 2.5s infinite"}}
              >
                <i className="bi bi-bell-fill"/>{openAlerts} Alerts
              </button>
            )}
            {/* Org chip */}
            <div style={{display:"flex",alignItems:"center",gap:7,padding:"6px 14px",borderRadius:"var(--radius-md)",background:"var(--surface-2)",border:"1px solid var(--border-default)",fontSize:12.5,fontWeight:600,color:"var(--text-secondary)"}}>
              <span style={{fontSize:15}}>{user?.org?.icon}</span>
              {user?.org?.name}
            </div>
          </div>

          {/* Content */}
          <div className="content">
            {page === "home"      && <PageHome      setPage={setPage} addToast={addToast} openAlerts={openAlerts}/>}
            {page === "employees" && <PageEmployees addToast={addToast}/>}
            {page === "alerts"    && <PageAlerts    addToast={addToast} openAlerts={openAlerts} setOpenAlerts={setOpenAlerts}/>}
            {page === "email"     && <PageEmail     addToast={addToast}/>}
            {page === "info"      && <PageOrgInfo   addToast={addToast}/>}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts}/>
    </>
  );
}
