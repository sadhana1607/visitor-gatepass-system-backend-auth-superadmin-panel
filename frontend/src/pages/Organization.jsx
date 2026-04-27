import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Organization() {
  const navigate = useNavigate();

  const [org, setOrg] = useState({
    name: "",
    address: "",
    type: "Company",
    phone: "",
    email: "",
    adminEmail: "",
    adminPassword: ""
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (
      !org.name ||
      !org.address ||
      !org.phone ||
      !org.email ||
      !org.adminEmail ||
      !org.adminPassword
    ) {
      setErrorMsg("⚠️ Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:8080/api/org-req/create",
        org,
        { withCredentials: true }
      );

      alert("✅ Organization Created Successfully");
      navigate("/pending");
    } catch (error) {
      setErrorMsg(
        error.response?.data || "❌ Failed to create organization"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Glow Background */}
      <div style={styles.glowBlue} />
      <div style={styles.glowPurple} />

      {/* Card */}
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.icon}>
            <i className="bi bi-building" style={{ color: "#fff", fontSize: 20 }} />
          </div>
          <div>
            <div style={styles.title}>Create Organization</div>
            <div style={styles.sub}>Register your company or apartment</div>
          </div>
        </div>

        {/* Error */}
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        {/* Inputs */}
        <input name="name" placeholder="Organization Name" onChange={handleChange} style={styles.input} />
        <input name="address" placeholder="Address" onChange={handleChange} style={styles.input} />

        <select name="type" onChange={handleChange} style={styles.input}>
          <option value="Company">Company</option>
          <option value="Apartment">Apartment</option>
        </select>

        <input name="phone" placeholder="Phone" onChange={handleChange} style={styles.input} />
        <input name="email" placeholder="Organization Email" onChange={handleChange} style={styles.input} />
        <input name="adminEmail" placeholder="Admin Email" onChange={handleChange} style={styles.input} />
        <input
          type="password"
          name="adminPassword"
          placeholder="Admin Password"
          onChange={handleChange}
          style={styles.input}
        />

        {/* Submit Button */}
        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Creating...
            </>
          ) : (
            <>
              <i className="bi bi-plus-circle me-1" />
              Create Organization
            </>
          )}
        </button>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          style={styles.backButton}
        >
          <i className="bi bi-arrow-left" /> Back to Login
        </button>

      </div>
    </div>
  );
}

/* 🎨 THEME STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    padding: 20
  },

  glowBlue: {
    position: "absolute",
    top: "10%",
    left: "20%",
    width: 400,
    height: 400,
    borderRadius: "50%",
    background: "rgba(30,41,59,.04)",
    filter: "blur(80px)"
  },

  glowPurple: {
    position: "absolute",
    bottom: "10%",
    right: "15%",
    width: 300,
    height: 300,
    borderRadius: "50%",
    background: "rgba(30,41,59,.04)",
    filter: "blur(80px)"
  },

  card: {
    width: "100%",
    maxWidth: 460,
    background: "#fff",
    border: "1px solid rgba(15,23,42,.1)",
    borderRadius: "1.2rem",
    padding: 30,
    boxShadow: "0 4px 24px rgba(15,23,42,.08)"
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20
  },

  icon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    background: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  title: {
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a"
  },

  sub: {
    fontSize: 12,
    color: "#94a3b8"
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: 14
  },

  button: {
    width: "100%",
    marginTop: 8,
    padding: 11,
    borderRadius: 10,
    border: "none",
    background: "#1e293b",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer"
  },

  backButton: {
    width: "100%",
    marginTop: 12,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(15,23,42,.15)",
    background: "transparent",
    color: "#1e293b",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "0.2s ease"
  },

  error: {
    background: "rgba(220,38,38,.08)",
    color: "#dc2626",
    padding: 10,
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 10
  }
};

export default Organization;