import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Organization() {
  const navigate = useNavigate();

  const [org, setOrg] = useState({
    name: "",
    address: "",
    city: "",
    type: "Company",
    phone: "",
    website: "", // ✅ FIXED
    email: "",
    adminName: "",
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
      !org.city ||
      !org.phone ||
      !org.website ||
      !org.email ||
      !org.adminName ||
      !org.adminEmail ||
      !org.adminPassword
    ) {
      setErrorMsg("⚠️ Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://localhost:9092/api/org-req/create",
        org,
        { withCredentials: true }
      );

      alert("✅ Organization Created Successfully");
      navigate("/pending");

    } catch (error) {
      let msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "❌ Failed to create organization";

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="cv-card">

        <div className="card-head">
          <span className="card-head-title">🏢 Create Organization</span>
        </div>

        <div className="card-body">

          {errorMsg && <div style={styles.error}>{errorMsg}</div>}

          {/* NAME */}
          <label >Organization Name</label>
          <input name="name" value={org.name} onChange={handleChange} style={styles.input} />

          {/* ADDRESS */}
          <label >Address</label>
          <input name="address" value={org.address} onChange={handleChange} style={styles.input} />

          {/* CITY */}
          <label >City</label>
          <input name="city" value={org.city} onChange={handleChange} style={styles.input} />

          {/* TYPE */}
          <label >Organization Type</label>
          <select name="type" value={org.type} onChange={handleChange} style={styles.input}>
            <option value="Company">Company</option>
            <option value="Apartment">Apartment</option>
          </select>

          {/* WEBSITE */}
          <label >Website</label>
          <input
            name="website"
            placeholder="https://example.com"
            value={org.website}
            onChange={handleChange}
            style={styles.input}
          />

          {/* PHONE */}
          <label >Phone</label>
          <input
            name="phone"
            placeholder="10 digit phone number"
            value={org.phone}
            onChange={handleChange}
            style={styles.input}
          />

          {/* EMAIL */}
          <label >Organization Email</label>
          <input type="email" name="email" value={org.email} onChange={handleChange} style={styles.input} />

          {/* ADMIN NAME */}
          <label >Admin Name</label>
          <input name="adminName" value={org.adminName} onChange={handleChange} style={styles.input} />

          {/* ADMIN EMAIL */}
          <label>Admin Email</label>
          <input type="email" name="adminEmail" value={org.adminEmail} onChange={handleChange} style={styles.input} />

          {/* PASSWORD */}
          <label >Admin Password</label>
          <input type="password" name="adminPassword" value={org.adminPassword} onChange={handleChange} style={styles.input} />

          <button onClick={handleSubmit} style={styles.button} disabled={loading}>
            {loading ? "Creating..." : "Create Organization"}
          </button>

          <button onClick={() => navigate("/")} style={styles.backButton}>
            Back to Login
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "var(--bg, #0f172a)"
  },

  card: {
    width: 450,
    borderRadius: 12,
    overflow: "hidden"
  },

  label: {
    display: "block",
    marginBottom: 5,
    fontSize: 13,
    color: "#cbd5e1",
    fontWeight: 500
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid var(--border, #2b3440)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text, #fff)",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: 10,
    background: "var(--primary, #0d6efd)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700
  },

  backButton: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    border: "1px solid var(--primary, #0d6efd)",
    background: "transparent",
    color: "var(--primary, #0d6efd)",
    borderRadius: 8,
    cursor: "pointer"
  },

  error: {
    background: "rgba(255,0,0,0.08)",
    color: "#ff6b6b",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 12
  }
};

export default Organization;