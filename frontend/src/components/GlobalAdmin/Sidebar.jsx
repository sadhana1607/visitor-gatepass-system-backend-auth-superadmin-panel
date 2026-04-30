// ════════════════════════════════════════════════
// src/components/GlobalAdmin/Sidebar.jsx
//
// Sidebar navigation for the Global Admin panel.
// Receives: activePage (string), onNavigate (fn)
// ════════════════════════════════════════════════

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Nav items for Global Admin
const NAV_ITEMS = [
  {
    section: "Overview",
    links: [
      { key: "dashboard",   icon: "bi-speedometer2",        label: "Dashboard"         },
    ],
  },
  {
    section: "Management",
    links: [
      { key: "organizations", icon: "bi-building",           label: "Organizations",  badge: null },
      { key: "users",         icon: "bi-people-fill",        label: "All Users"       },
      { key: "reports",       icon: "bi-bar-chart-line-fill",label: "Reports"         },
    ],
  },
  {
    section: "Communication",
    links: [
      { key: "email",       icon: "bi-envelope-fill",        label: "Email Center"    },
      { key: "alerts",      icon: "bi-shield-exclamation",   label: "Live Alerts"     },
    ],
  },
  {
    section: "System",
    links: [
      { key: "settings",    icon: "bi-gear-fill",            label: "Information"     },
    ],
  },
];

export default function GlobalAdminSidebar({ activePage, onNavigate, orgCount, userCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Build badge values
  const badges = {
    organizations: orgCount,
    users: userCount,
  };

  return (
    <div className="sidebar">
      {/* ── Brand ── */}
      <div className="sb-brand">
        <div className="brand-logo">
          <i className="bi bi-shield-lock-fill" />
        </div>
        <div>
          <div className="brand-title">CorpVMS</div>
          <div className="brand-sub">Global Admin</div>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <div className="sb-scroll">
        {NAV_ITEMS.map((section) => (
          <div key={section.section}>
            <div className="sb-section">{section.section}</div>
            <div className="sb-nav">
              {section.links.map((link) => (
                <button
                  key={link.key}
                  className={`sb-link ${activePage === link.key ? "active" : ""}`}
                  onClick={() => onNavigate(link.key)}
                >
                  <i className={`bi ${link.icon}`} />
                  {link.label}
                  {/* Show badge if there's a count */}
                  {badges[link.key] > 0 && (
                    <span
                      className="sb-badge"
                      style={{
                        background: "rgba(13,110,253,.2)",
                        color: "#93c5fd",
                      }}
                    >
                      {badges[link.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── User Footer ── */}
      <div className="sb-foot">
        {/* Admin info pill */}
        <div className="user-pill">
          <div className="user-av" style={{ background: "linear-gradient(135deg,#8b5cf6,#0d6efd)" }}>
            {user?.initials || "GA"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "#dde6f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.name || "Global Admin"}
            </div>
            <span className="role-pill rp-global">Global Admin</span>
          </div>
          <div className="online-dot" />
        </div>

        {/* Logout button */}
        <button
          className="cv-btn btn-ghost sm"
          style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-left" />
          Logout
        </button>
      </div>
    </div>
  );
}
