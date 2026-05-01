import { useState, useMemo } from "react";
import { formatDate, STATUS_CONFIG } from "../constants/data";
import StatusBadge from "../components/shared/StatusBadge";

const STATUSES = ["All", "Pending", "Approved", "Checked In", "Completed", "Cancelled"];

export default function RegistrationList({ visitors, employee }) {
  const [search,    setSearch]    = useState("");
  const [statusFil, setStatusFil] = useState("All");
  const [tab,       setTab]       = useState("all");
  const [selected,  setSelected]  = useState(null);
  const [sortBy,    setSortBy]    = useState("date_desc");

  const filtered = useMemo(() => {
    let list = tab === "mine"
      ? visitors.filter(v => v.registeredBy === employee.id)
      : visitors;

    if (statusFil !== "All") list = list.filter(v => v.status === statusFil);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.phone.includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.purpose.toLowerCase().includes(q) ||
        (v.email || "").toLowerCase().includes(q)
      );
    }

    return [...list].sort((a, b) => {
      if (sortBy === "date_desc") return b.visitDate.localeCompare(a.visitDate);
      if (sortBy === "date_asc")  return a.visitDate.localeCompare(b.visitDate);
      if (sortBy === "name")      return a.name.localeCompare(b.name);
      if (sortBy === "status")    return a.status.localeCompare(b.status);
      return 0;
    });
  }, [visitors, tab, statusFil, search, sortBy, employee.id]);

  const counts = {
    all:        visitors.length,
    mine:       visitors.filter(v => v.registeredBy === employee.id).length,
    pending:    visitors.filter(v => v.status === "Pending").length,
    checkedIn:  visitors.filter(v => v.status === "Checked In").length,
    completed:  visitors.filter(v => v.status === "Completed").length,
  };

  const summaryCards = [
    { label:"Total Registered",  val:counts.all,       color:"#2563eb",  icon:"bi-people-fill" },
    { label:"My Registrations",  val:counts.mine,      color:"#7c3aed",  icon:"bi-person-badge-fill" },
    { label:"Pending Approval",  val:counts.pending,   color:"#d97706",  icon:"bi-hourglass-split" },
    { label:"Currently Inside",  val:counts.checkedIn, color:"#16a34a",  icon:"bi-person-check-fill" },
    { label:"Completed Visits",  val:counts.completed, color:"#6b7280",  icon:"bi-check2-all" },
  ];

  return (
    <div className="page-enter">

      {/* Summary row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        {summaryCards.map((s, i) => (
          <div key={i} className="stat-card" style={{ padding:"14px 16px" }}>
            <div className="stat-glow" style={{ background:s.color }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color, fontSize:22 }}>{s.val}</div>
            <i className={`bi ${s.icon} stat-icon`} />
          </div>
        ))}
      </div>

      <div style={{ display:"flex", gap:16 }}>

        {/* ══ LEFT: Table ══ */}
        <div className="card" style={{ flex:1, minWidth:0, display:"flex", flexDirection:"column" }}>

          {/* Toolbar */}
          <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--bd)", display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", background:"#fafbff" }}>

            {/* Tabs */}
            <div className="tabs">
              <button className={`tab-item${tab==="all"?" active":""}`} onClick={()=>setTab("all")}>All ({counts.all})</button>
              <button className={`tab-item${tab==="mine"?" active":""}`} onClick={()=>setTab("mine")}>Mine ({counts.mine})</button>
            </div>

            {/* Search */}
            <div className="search-wrap" style={{ minWidth:200 }}>
              <i className="bi bi-search" />
              <input
                placeholder="Search name, phone, ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={()=>setSearch("")} style={{ background:"none",border:"none",cursor:"pointer",color:"var(--fg-4)",fontSize:14,lineHeight:1 }}>×</button>
              )}
            </div>

            {/* Status filter */}
            <select
              value={statusFil}
              onChange={e => setStatusFil(e.target.value)}
              style={{ padding:"6px 10px", border:"1.5px solid rgba(0,0,0,.1)", borderRadius:"var(--r-sm)", fontSize:12.5, color:"var(--fg-2)", background:"#fff", outline:"none", cursor:"pointer" }}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding:"6px 10px", border:"1.5px solid rgba(0,0,0,.1)", borderRadius:"var(--r-sm)", fontSize:12.5, color:"var(--fg-2)", background:"#fff", outline:"none", cursor:"pointer" }}
            >
              <option value="date_desc">Date ↓ Newest</option>
              <option value="date_asc">Date ↑ Oldest</option>
              <option value="name">Name A–Z</option>
              <option value="status">Status</option>
            </select>

            <span style={{ marginLeft:"auto", fontSize:11.5, color:"var(--fg-3)", fontWeight:500 }}>
              {filtered.length} result{filtered.length!==1?"s":""}
            </span>
          </div>

          {/* Table */}
          <div className="table-wrap" style={{ flex:1, overflowY:"auto" }}>
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <div className="empty-title">No visitors found</div>
                <div className="empty-sub">Try adjusting your search or filters.</div>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Pass ID</th>
                    <th>Visitor</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Purpose</th>
                    <th>Visit Date</th>
                    <th>Status</th>
                    <th>Registered By</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(v => (
                    <tr
                      key={v.id}
                      onClick={() => setSelected(v)}
                      style={{ cursor:"pointer", background: selected?.id===v.id ? "var(--accent-lt)" : "transparent" }}
                    >
                      <td>
                        <span style={{ fontFamily:"var(--mono-font)", fontSize:11, color:"var(--accent)", fontWeight:600 }}>{v.id}</span>
                      </td>
                      <td>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{
                            width:28, height:28, borderRadius:"50%",
                            background:"var(--accent-lt)", color:"var(--accent)",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:10, fontWeight:700, flexShrink:0,
                          }}>
                            {v.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
                          </div>
                          <strong>{v.name}</strong>
                        </div>
                      </td>
                      <td style={{ fontFamily:"var(--mono-font)", fontSize:11.5 }}>+91 {v.phone}</td>
                      <td style={{ fontSize:11.5, color:"var(--fg-2)", maxWidth:160, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {v.email ? (
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <i className="bi bi-envelope-fill" style={{ fontSize:10, color:"var(--accent)", flexShrink:0 }} />
                            {v.email}
                          </span>
                        ) : (
                          <span style={{ color:"var(--fg-4)" }}>—</span>
                        )}
                      </td>
                      <td style={{ color:"var(--fg-2)" }}>{v.purpose}</td>
                      <td style={{ fontFamily:"var(--mono-font)", fontSize:11.5 }}>{formatDate(v.visitDate)}</td>
                      <td><StatusBadge status={v.status} /></td>
                      <td>
                        <span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background: v.registeredBy===employee.id?"var(--green-lt)":"#f3f4f6", color:v.registeredBy===employee.id?"var(--green-tx)":"var(--fg-3)", border:`1px solid ${v.registeredBy===employee.id?"var(--green-bd)":"var(--bd)"}` }}>
                          {v.registeredBy === employee.id ? "You" : v.registeredBy}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-icon btn-xs" onClick={e=>{e.stopPropagation();setSelected(v);}}>
                          <i className="bi bi-eye-fill" style={{fontSize:12}}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ══ RIGHT: Detail panel ══ */}
        <div style={{ width:300, flexShrink:0 }}>
          {selected ? (
            <div className="card" style={{ position:"sticky", top:0 }}>
              <div style={{ padding:"13px 16px", borderBottom:"1px solid var(--bd)", display:"flex", alignItems:"center", justifyContent:"space-between", background:"#fafbff" }}>
                <span style={{ fontSize:13, fontWeight:700, color:"var(--fg)" }}>Visitor Details</span>
                <button className="btn btn-icon btn-xs" onClick={()=>setSelected(null)}><i className="bi bi-x-lg" style={{fontSize:12}}/></button>
              </div>
              <div className="card-body">
                {/* Avatar + name */}
                <div style={{ textAlign:"center", marginBottom:18 }}>
                  <div style={{
                    width:64, height:64, borderRadius:"50%", margin:"0 auto 10px",
                    background:"var(--accent-lt)", border:"2px solid var(--accent-md)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:22, fontWeight:800, color:"var(--accent)",
                  }}>
                    {selected.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ fontWeight:800, fontSize:16, color:"var(--fg)", marginBottom:6 }}>{selected.name}</div>
                  <StatusBadge status={selected.status} />
                </div>

                {/* Details */}
                <div style={{ border:"1px solid var(--bd)", borderRadius:"var(--r-md)", overflow:"hidden" }}>
                  {[
                    ["Pass ID",       selected.id,        true  ],
                    ["Phone",         `+91 ${selected.phone}`, true],
                    ["Email",         selected.email || "—", false],
                    ["Purpose",       selected.purpose,   false ],
                    ["Visit Date",    formatDate(selected.visitDate), false],
                    ["Passcode",      selected.passcode,  true  ],
                    ["Checked In",    selected.checkedIn  || "—", false],
                    ["Checked Out",   selected.checkedOut || "—", false],
                    ["Registered By", selected.registeredBy === employee.id ? "You" : selected.registeredBy, false],
                    ["Registered At", selected.registeredAt, false],
                  ].map(([l,v,mono], i, arr) => (
                    <div key={l} style={{ display:"flex", padding:"9px 12px", borderBottom:i<arr.length-1?"1px solid var(--bd)":undefined, gap:10 }}>
                      <span style={{ fontSize:10.5, color:"var(--fg-4)", fontWeight:600, textTransform:"uppercase", letterSpacing:.4, width:100, flexShrink:0, paddingTop:1 }}>{l}</span>
                      <span style={{ fontSize:12.5, color:"var(--fg)", fontWeight:600, fontFamily:mono?"var(--mono-font)":undefined, flex:1, wordBreak:"break-all" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {selected.note && (
                  <div className="info-banner info-blue" style={{ marginTop:12 }}>
                    <i className="bi bi-sticky-fill info-icon" />
                    <span style={{ fontSize:12 }}>{selected.note}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="empty-state" style={{ padding:"36px 20px" }}>
                <div className="empty-icon" style={{ fontSize:20 }}>👆</div>
                <div className="empty-title" style={{ fontSize:13 }}>Click any row</div>
                <div className="empty-sub" style={{ fontSize:11.5 }}>Select a visitor from the table to view their full details here.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
