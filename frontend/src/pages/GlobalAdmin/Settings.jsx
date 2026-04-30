import { useEffect, useState } from "react";
import { getCurrentUser } from "../../api/userApi";

export default function Settings({ addToast }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    status: "",
    organizationName: "",
  });

  // ✅ LOAD FROM DB
  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        console.log("Error loading profile", err);
      });
  }, []);

  return (
    <div className="page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, maxWidth: 700 }}>

        {/* ── CARD ── */}
        <div className="cv-card">

          {/* HEADER */}
          <div className="card-head">
            <div
              className="c-icon"
              style={{
                background: "rgba(139,92,246,.15)",
                color: "#a78bfa",
              }}
            >
              <i className="bi bi-person-circle" />
            </div>

            <span className="card-head-title">Admin Profile</span>
          </div>

          <div className="card-body">

            {/* AVATAR + NAME */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#8b5cf6,#0d6efd)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {profile.name ? profile.name.charAt(0).toUpperCase() : "GA"}
              </div>

              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "var(--text)" }}>
                  {profile.name || "Loading..."}
                </div>

                <span className="role-pill rp-global">
                  Global Admin
                </span>
              </div>
            </div>

            {/* DETAILS */}
            <div>
              {[
                ["Email", profile.email, "bi-envelope-fill", "#0d6efd"],
                ["Status", profile.status, "bi-check-circle-fill", "#22c55e"],
                ["Organization", profile.organizationName, "bi-building", "#8b5cf6"],
              ].map(([label, value, icon, color]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 0",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: ".45rem",
                      background: color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <i className={`bi ${icon}`} style={{ color, fontSize: 13 }} />
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      {label}
                    </div>

                    <div
                      style={{
                        fontSize: 12.5,
                        color: "var(--text)",
                        fontWeight: 600,
                        marginTop: 1,
                      }}
                    >
                      {value || "-"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}