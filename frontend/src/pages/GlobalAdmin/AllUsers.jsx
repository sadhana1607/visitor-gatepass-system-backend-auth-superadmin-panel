import { useState, useEffect } from "react";
import {
  getUsersByRole,
  updateUserStatus
} from "../../api/userApi.js";

const ini = (n) =>
  n?.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase();

const AV_COLORS = [
  "#0d6efd",
  "#00c878",
  "#8b5cf6",
  "#f59e0b",
  "#00c8e0",
  "#ff3d5a"
];

export default function AllUsers({ addToast }) {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOrgAdmins();
  }, []);

  // 🔥 USERS
  const fetchOrgAdmins = async () => {
    try {
      const res = await getUsersByRole("ORG_ADMIN");

      // ✅ Direct use (DTO response)
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.content || [];

      setUsers(data);

    } catch (err) {
      console.log("ERROR:", err.response || err.message);
      addToast("❌ Failed to load org admins", "error");
    }
  };

  // 🔥 TOGGLE STATUS
  const toggleStatus = async (u) => {
    const newStatus = u.status === "active" ? "inactive" : "active";

    try {
      await updateUserStatus(u.id, newStatus);

      setUsers(prev =>
        prev.map(x =>
          x.id === u.id ? { ...x, status: newStatus } : x
        )
      );

      addToast(
        `${u.name} set to ${newStatus}`,
        newStatus === "active" ? "success" : "info"
      );

    } catch (err) {
      console.log(err);
      addToast("❌ Status update failed", "error");
    }
  };

  // 🔥 FILTER
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();

    return (
      !search ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">

      {/* INTERNAL CSS (UNCHANGED) */}
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
        }

        .toggle-btn.active {
          background: #00c878;
        }

        .toggle-btn.inactive {
          background: #ff3d5a;
        }

        .toggle-btn:hover {
          opacity: 0.85;
        }
      `}</style>

      {/* STATS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: 14,
        marginBottom: 20
      }}>
        {[
          {
            label: "Total Org Admins",
            value: users.length,
            color: "#8b5cf6",
            icon: "bi-people-fill"
          },
          {
            label: "Active Admins",
            value: users.filter(u => u.status === "active").length,
            color: "#00c878",
            icon: "bi-person-check-fill"
          },
          {
            label: "Inactive Admins",
            value: users.filter(u => u.status === "inactive").length,
            color: "#ff3d5a",
            icon: "bi-person-x-fill"
          },
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

      {/* TABLE */}
      <div className="cv-card">

        <div className="card-head" style={{ flexWrap: "wrap", gap: 10 }}>
          <span className="card-head-title">
            👤 Org Admins ({filtered.length})
          </span>

          <div className="search-box">
            <i className="bi bi-search" />
            <input
              placeholder="Search name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: 30 }}>
                    No org admins found
                  </td>
                </tr>
              ) : (
                filtered.map((u, idx) => {
                  const color = AV_COLORS[idx % AV_COLORS.length];

                  return (
                    <tr key={u.id}>
                      <td>{idx + 1}</td>

                      {/* ADMIN */}
                      <td>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: color + "22",
                            border: `1px solid ${color}44`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                            color
                          }}>
                            {ini(u.name)}
                          </div>

                          <div>
                            <div><b>{u.name}</b></div>
                            <div style={{ fontSize: 12, color: "gray" }}>
                              {u.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* ✅ ORGANIZATION (DTO FIELD) */}
                      <td>
                        {u.organizationName || "No Organization"}
                      </td>

                      {/* STATUS */}
                      <td>
                        <span className={`cv-badge ${
                          u.status === "active" ? "b-active" : "b-inactive"
                        }`}>
                          {u.status}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td>
                        <button
                          onClick={() => toggleStatus(u)}
                          className={`toggle-btn ${
                            u.status === "active" ? "active" : "inactive"
                          }`}
                        >
                          {u.status === "active" ? "Active" : "Inactive"}
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