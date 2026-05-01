import { useState, useEffect } from "react";

const PAGE_META = {
  dashboard: { title: "Dashboard",         sub: "Welcome back — here's what's happening today" },
  prereg:    { title: "Pre-Registration",   sub: "Register expected visitors before their arrival" },
  reglist:   { title: "Registration List",  sub: "View and manage all registered visitor records" },
  profile:   { title: "My Profile & Org",   sub: "Your information and organization details" },
};

export default function Topbar({ page, employee }) {
  const [clock, setClock] = useState("");
  const meta = PAGE_META[page] || { title: page, sub: "" };

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="topbar">
      {/* Page title */}
      <div style={{ flex: 1 }}>
        <div className="page-title">{meta.title}</div>
        <div className="page-sub">{meta.sub}</div>
      </div>

      {/* Clock */}
      <div className="clock-badge">{clock}</div>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"var(--fg-3)" }}>
        <i className="bi bi-house-fill" style={{ fontSize:13, color:"var(--fg-4)" }} />
        <span>/</span>
        <span style={{ color:"var(--accent)", fontWeight:600 }}>{meta.title}</span>
      </div>

      {/* User avatar */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:12.5, fontWeight:600, color:"var(--fg)", lineHeight:1 }}>{employee.name}</div>
          <div style={{ fontSize:10.5, color:"var(--fg-3)", marginTop:2 }}>{employee.department}</div>
        </div>
        <div className="topbar-avatar">{employee.initials}</div>
      </div>
    </div>
  );
}
