import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Organization() {
  const navigate = useNavigate();

  const [org, setOrg] = useState({
    name: "",
    address: "",
    city: "",              // ✅ ADDED
    type: "Company",
    phone: "",
    email: "",
    adminName: "",         // ✅ ADDED
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
      !org.city ||             // ✅ CHECK
      !org.phone ||
      !org.email ||
      !org.adminName ||        // ✅ CHECK
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
      console.log("FULL ERROR:", error.response?.data);

      // ✅ CLEAN ERROR MESSAGE
      let msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "❌ Failed to create organization";

      // OPTIONAL: clean `{adminName=..., city=...}` format
      if (msg.startsWith("{") && msg.endsWith("}")) {
        msg = msg
          .replace(/[{}]/g, "")
          .replace(/,/g, "\n")
          .replace(/=/g, " : ");
      }

      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        <h2>Create Organization</h2>

        {errorMsg && (
          <div style={styles.error}>
            <pre style={{ margin: 0 }}>{errorMsg}</pre>
          </div>
        )}

        <input name="name" placeholder="Organization Name" value={org.name} onChange={handleChange} style={styles.input} />
        <input name="address" placeholder="Address" value={org.address} onChange={handleChange} style={styles.input} />

        {/* ✅ NEW FIELD */}
        <input name="city" placeholder="City" value={org.city} onChange={handleChange} style={styles.input} />

        <select name="type" value={org.type} onChange={handleChange} style={styles.input}>
          <option value="Company">Company</option>
          <option value="Apartment">Apartment</option>
        </select>

        <input name="phone" placeholder="Phone" value={org.phone} onChange={handleChange} style={styles.input} />
        <input type="email" name="email" placeholder="Organization Email" value={org.email} onChange={handleChange} style={styles.input} />

        {/* ✅ NEW FIELD */}
        <input name="adminName" placeholder="Admin Name" value={org.adminName} onChange={handleChange} style={styles.input} />

        <input type="email" name="adminEmail" placeholder="Admin Email" value={org.adminEmail} onChange={handleChange} style={styles.input} />

        <input type="password" name="adminPassword" placeholder="Admin Password" value={org.adminPassword} onChange={handleChange} style={styles.input} />

        <button onClick={handleSubmit} style={styles.button} disabled={loading}>
          {loading ? "Creating..." : "Create Organization"}
        </button>

        <button onClick={() => navigate("/")} style={styles.backButton}>
          Back to Login
        </button>

      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6fb"
  },
  card: {
    width: 400,
    padding: 25,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#185a9d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer"
  },
  backButton: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    border: "1px solid #185a9d",
    background: "transparent",
    color: "#185a9d",
    borderRadius: 6,
    cursor: "pointer"
  },
  error: {
    background: "#ffe5e5",
    color: "#d8000c",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    whiteSpace: "pre-line"
  }
};

export default Organization;