import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authApi";
import "../styles/theme.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false); // ✅ FIXED
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const res = await loginUser({ email, password });
      const data = res.data;
const role = data.role?.toUpperCase();

if (role) {
  login(data);

  if (role === "SUPER_ADMIN") navigate("/global-admin/dashboard");
  else if (role === "ORG_ADMIN") navigate("/org-admin/dashboard");
  else if (role === "EMPLOYEE") navigate("/employee/dashboard");
  else if (role === "GUARD") navigate("/guard/verify");
  else navigate("/");
} else {
  setError("Invalid login response");
}
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
 <div style={styles.page}>
      {/* ── Background glow effects ── */}
      <div style={styles.glowBlue}  />
      <div style={styles.glowPurple}/>

      {/* ── Login Card ── */}
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoIcon}>
            <i className="bi bi-shield-lock-fill" style={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <div style={styles.logoTitle}>Visitor Management System</div>
            <div style={styles.logoSub}>Manage visitor digitaly</div>
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={styles.heading}>Welcome back</h2>
          <p  style={styles.subheading}>Sign in to continue to your dashboard</p>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.errorBox}>
            <i className="bi bi-exclamation-circle-fill" style={{ marginRight: 7 }} />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label className="f-label">Email Address</label>
            <div style={styles.inputWrap}>
              <i className="bi bi-envelope-fill" style={styles.inputIcon} />
              <input
                className="f-control"
                style={{ paddingLeft: 38 }}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label className="f-label">Password</label>
            <div style={styles.inputWrap}>
              <i className="bi bi-lock-fill" style={styles.inputIcon} />
              <input
                className="f-control"
                style={{ paddingLeft: 38, paddingRight: 42 }}
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                style={styles.eyeBtn}
              >
                <i className={`bi bi-eye${showPass ? "-slash" : ""}-fill`} />
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="cv-btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "11px" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Signing in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right" />
                Sign In
              </>
            )}
          </button>

         <br />

         {/* Create Organization link */}
         <div style={{ marginTop: 12, textAlign: "center" }}>
           <a
             href="/organization"
             style={{
               fontSize: "13px",
               color: "#1e293b",
               textDecoration: "none",
               fontWeight: 500,
             }}
           >
             Create Organization
           </a>
         </div>
        </form>


      </div>
    </div>
  );
}



// ── Styles object ───────────────────────────────
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    position: "relative",
    overflow: "hidden",
  },
  glowBlue: {
    position: "absolute", top: "10%", left: "20%",
    width: 400, height: 400, borderRadius: "50%",
    background: "rgba(30,41,59,.04)", filter: "blur(80px)", zIndex: 0,
  },
  glowPurple: {
    position: "absolute", bottom: "10%", right: "15%",
    width: 300, height: 300, borderRadius: "50%",
    background: "rgba(30,41,59,.04)", filter: "blur(80px)", zIndex: 0,
  },
  card: {
    position: "relative", zIndex: 1,
    width: "100%", maxWidth: 440,
    background: "#ffffff",
    border: "1px solid rgba(15,23,42,.1)",
    borderRadius: "1.2rem",
    padding: "36px 36px 28px",
    boxShadow: "0 4px 24px rgba(15,23,42,.08), 0 1px 4px rgba(15,23,42,.04)",
  },
  logoWrap: { display: "flex", alignItems: "center", gap: 12, marginBottom: 28 },
  logoIcon: {
    width: 48, height: 48, borderRadius: ".85rem",
    background: "#1e293b",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 4px 14px rgba(30,41,59,.2)", flexShrink: 0,
  },
  logoTitle:  { fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-.4px" },
  logoSub:    { fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".8px" },
  heading:    { fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-.4px" },
  subheading: { fontSize: 13, color: "#94a3b8", margin: "5px 0 0" },
  errorBox: {
    background: "rgba(220,38,38,.06)",
    border: "1px solid rgba(220,38,38,.2)",
    borderRadius: ".6rem", padding: "10px 14px",
    fontSize: 12.5, color: "#dc2626", marginBottom: 16,
    display: "flex", alignItems: "center",
  },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute", left: 13, top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8", fontSize: 14, zIndex: 1, pointerEvents: "none",
  },
  eyeBtn: {
    position: "absolute", right: 12, top: "50%",
    transform: "translateY(-50%)",
    background: "none", border: "none",
    color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: 0,
  },
};
