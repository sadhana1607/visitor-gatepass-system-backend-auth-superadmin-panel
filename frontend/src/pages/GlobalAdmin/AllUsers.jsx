import { useState, useEffect } from "react";
import { getUsersByRole, updateUserStatus } from "../../api/userApi.js";

const ini = (n) =>
  n?.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();

const AV_COLORS = [
  "#0d6efd", "#00c878", "#8b5cf6",
  "#f59e0b", "#00c8e0", "#ff3d5a"
];

export default function AllUsers({ addToast }) {
  const [users, setUsers]   = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchOrgAdmins(); }, []);

  // ================= FETCH =================
  const fetchOrgAdmins = async () => {
    setLoading(true);
    try {
      const res = await getUsersByRole("ORG_ADMIN");
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.content || [];
      setUsers(data);
    } catch (err) {
      console.log("ERROR:", err.response || err.message);
      addToast("❌ Failed to load org admins", "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= HELPERS =================
  // ✅ FIX: normalize to lowercase for comparison everywhere
  const isActive = (u) =>
    u.status?.toLowerCase() === "active";

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (u) => {
    // ✅ FIX: send UPPERCASE to backend, store whatever backend returns
    const newStatus = isActive(u) ? "INACTIVE" : "ACTIVE";

    try {
      await updateUserStatus(u.id, newStatus);

      // ✅ FIX: update locally using same case backend sent
      setUsers(prev =>
        prev.map(x =>
          x.id === u.id ? { ...x, status: newStatus } : x
        )
      );

      addToast(
        `${u.name} set to ${newStatus.toLowerCase()}`,
        newStatus === "ACTIVE" ? "success" : "info"
      );
    } catch (err) {
      console.log(err);
      addToast("❌ Status update failed", "error");
    }
  };

  // ================= FILTER =================
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !search ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.orgName?.toLowerCase().includes(q)       // ✅ search org too
    );
  });

  // ================= STATS =================
  const totalActive   = users.filter(u => isActive(u)).length;
  const totalInactive = users.length - totalActive;

  return (
    <div className="page">
      <style>{`
        .toggle-btn {
          padding: 6px 14px;
          font-size: 12px;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          color: white;
          transition: 0.25s ease;
          min-width: 90px;
          font-weight: 600;
        }
        .toggle-btn.active   { background: #00c878; }
        .toggle-btn.inactive { background: #ff3d5a; }
        .toggle-btn:hover    { opacity: 0.85; }
      `}</style>

      {/* ── STATS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 14, marginBottom: 20
      }}>
        {[
          { label: "Total Org Admins",  value: users.length,   color: "#8b5cf6", icon: "bi-people-fill"     },
          { label: "Active Admins",     value: totalActive,    color: "#00c878", icon: "bi-person-check-fill"},
          { label: "Inactive Admins",   value: totalInactive,  color: "#ff3d5a", icon: "bi-person-x-fill"   },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-glow" style={{ background: s.color }} />
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color, fontSize: 26 }}>
              {s.value}
            </div>
            <i className={`bi ${s.icon} stat-icon`} />
          </div>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="cv-card">
        <div className="card-head" style={{ flexWrap: "wrap", gap: 10 }}>
          <span className="card-head-title">
            👤 Org Admins ({filtered.length})
          </span>
          <div className="search-box">
            <i className="bi bi-search" />
            <input
              placeholder="Search name, email, org..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Admin</th>
                <th>Organization</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30 }}>
                    ⏳ Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30 }}>
                    No org admins found
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  const color  = AV_COLORS[idx % AV_COLORS.length];
                  const active = isActive(u);   // ✅ normalized check

                  return (
                    <tr key={u.id}>
                      <td>{idx + 1}</td>

                      {/* ADMIN */}
                      <td>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 34, height: 34,
                            borderRadius: "50%",
                            background: color + "22",
                            border: `1px solid ${color}44`,
                            display: "flex", alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold", color,
                            fontSize: 13, flexShrink: 0
                          }}>
                            {ini(u.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700 }}>{u.name}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ORGANIZATION */}
                      {/* ✅ FIX: check both orgName and organizationName */}
                      <td>
                        {u.orgName || u.organizationName || (
                          <span style={{ color: "var(--muted)", fontSize: 12 }}>
                            No Organization
                          </span>
                        )}
                      </td>

                      {/* STATUS BADGE */}
                      {/* ✅ FIX: use isActive() for class, not direct comparison */}
                      <td>
                        <span className={`cv-badge ${active ? "b-active" : "b-inactive"}`}>
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* ACTION BUTTON */}
                      {/* ✅ FIX: button label shows NEXT state (what clicking will do) */}
                      <td>
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`toggle-btn ${active ? "active" : "inactive"}`}
                        >
                          {active ? "Deactivate" : "Activate"}
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}