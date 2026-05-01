import { NAV_ITEMS, ORGANIZATION } from "../../constants/data";

export default function Sidebar({ page, navigate, employee, onLogout }) {
  return (
    <div className="sidebar">

      {/* Brand */}
      <div className="brand-wrap">
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
          <div className="brand-logo">
            <i className="bi bi-shield-lock-fill" style={{ color:"#fff", fontSize:16 }} />
          </div>
          <div>
            <div className="brand-name">CorpVMS</div>
            <div className="brand-tag">Employee Panel</div>
          </div>
        </div>

        {/* Entity chip */}
        <div className="entity-chip">
          <span className="entity-chip-icon">🏢</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div className="entity-chip-name">{ORGANIZATION.shortName}</div>
            <div className="entity-chip-type">Corporate HQ</div>
          </div>
          <div className="entity-live" />
        </div>
      </div>

      {/* Nav */}
      <div className="sb-scroll">
        <div className="sb-section">Menu</div>
        <div className="sb-nav">
          {NAV_ITEMS.map((item, idx) => (
            <button
              key={item.key}
              className={`sb-link${page === item.key ? " active" : ""}`}
              onClick={() => navigate(item.key)}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Employee profile footer */}
      <div className="sb-footer">
        <div className="emp-card">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
            <div className="emp-avatar">{employee.initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div className="emp-name">{employee.name}</div>
              <div className="emp-role">{employee.designation}</div>
            </div>
            <div className="online-dot" />
          </div>
          <div style={{ borderTop:"1px solid var(--bd)", paddingTop:9, display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:"var(--fg-4)", textTransform:"uppercase", letterSpacing:.5, fontWeight:600 }}>Dept</span>
              <span style={{ fontSize:11, color:"var(--fg)", fontWeight:600 }}>{employee.department}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:10, color:"var(--fg-4)", textTransform:"uppercase", letterSpacing:.5, fontWeight:600 }}>ID</span>
              <span style={{ fontFamily:"var(--mono-font)", fontSize:10.5, color:"var(--accent)", fontWeight:600 }}>{employee.id}</span>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              marginTop:10, width:"100%", padding:"6px",
              background:"var(--red-lt)", color:"var(--red-tx)",
              border:"1px solid var(--red-bd)", borderRadius:"var(--r-sm)",
              cursor:"pointer", fontSize:12, fontWeight:600,
              display:"flex", alignItems:"center", justifyContent:"center", gap:5,
              transition:"all var(--t1)",
            }}
            onMouseEnter={e=>{ e.currentTarget.style.background="var(--red-md)"; }}
            onMouseLeave={e=>{ e.currentTarget.style.background="var(--red-lt)"; }}
          >
            <i className="bi bi-box-arrow-right" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
