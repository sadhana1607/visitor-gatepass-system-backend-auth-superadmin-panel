import React, { useEffect, useState } from "react";
import {
  getAllOrganizations,
  deleteOrganization,
  approveOrganization,
  rejectOrganization
} from "../api/superadminApi";

import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const navigate = useNavigate();

 const fetchData = async () => {
   try {
     const res = await getAllOrganizations();

     console.log("FULL RESPONSE:", res);
     console.log("DATA:", res.data);

     if (!res.data) {
       alert("No data received from backend");
       return;
     }

     if (Array.isArray(res.data)) {
       setOrganizations(res.data);
     } else if (res.data.data) {
       setOrganizations(res.data.data);
     } else {
       alert("Unexpected response format");
       console.log(res.data);
     }

   } catch (err) {
     console.log("ERROR:", err);
     alert("❌ API call failed");
   }
 };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ APPROVE
  const approveOrg = async (id) => {
    try {
      await approveOrganization(id);
      fetchData(); // 🔥 refresh UI
    } catch (err) {
      console.log(err);
      alert("Approve failed");
    }
  };

  // ❌ REJECT
  const rejectOrg = async (id) => {
    try {
      await rejectOrganization(id);
      fetchData(); // 🔥 refresh UI
    } catch (err) {
      console.log(err);
      alert("Reject failed");
    }
  };

  // 🗑 DELETE
  const deleteOrg = async (id) => {
    try {
      await deleteOrganization(id);
      fetchData(); // 🔥 refresh UI
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  // 🚪 LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.title}>👑 Super Admin Dashboard</h2>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {/* TABLE CARD */}
      <div style={styles.card}>
        <h3 style={{ marginBottom: "15px" }}>🏢 Organizations</h3>

        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {organizations.length > 0 ? (
              organizations.map((org) => (
                <tr key={org.id} style={styles.row}>
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{org.email}</td>

                  {/* STATUS */}
                  <td>
                    <span style={getStatusStyle(org.status)}>
                      {org.status || "PENDING"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td>
                    <button style={styles.approveBtn} onClick={() => approveOrg(org.id)}>
                      Approve
                    </button>

                    <button style={styles.rejectBtn} onClick={() => rejectOrg(org.id)}>
                      Reject
                    </button>

                    <button style={styles.deleteBtn} onClick={() => deleteOrg(org.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    padding: "25px",
    fontFamily: "Arial"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold"
  },

  logoutBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  thead: {
    background: "#111827",
    color: "white"
  },

  row: {
    borderBottom: "1px solid #e5e7eb"
  },

  approveBtn: {
    background: "green",
    color: "white",
    border: "none",
    padding: "5px 8px",
    marginRight: "5px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  rejectBtn: {
    background: "orange",
    color: "white",
    border: "none",
    padding: "5px 8px",
    marginRight: "5px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 8px",
    borderRadius: "5px",
    cursor: "pointer"
  },

  noData: {
    textAlign: "center",
    padding: "20px",
    color: "#6b7280"
  }
};

/* 🎯 STATUS COLOR */
const getStatusStyle = (status) => {
  let bg = "#f59e0b";
  let color = "white";

  if (status === "APPROVED") bg = "green";
  else if (status === "REJECTED") bg = "red";

  return {
    background: bg,
    color,
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px"
  };
};

export default SuperAdminDashboard;