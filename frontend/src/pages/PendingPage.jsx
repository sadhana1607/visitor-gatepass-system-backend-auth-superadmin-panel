import React from "react";

function PendingPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>⏳ Waiting for Approval</h2>
        <p>
          Your organization has been created successfully.
          Please wait until the Super Admin approves your account.
        </p>

        <button
                  onClick={() => navigate("/")}
                  style={styles.loginBtn}
                >
                  Go to Login
                </button>
      </div>
    </div>
  );
}


const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6fb"
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#185a9d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
loginBtn: {
        padding: "10px",
        background: "transparent",
        color: "#185a9d",
        border: "1px solid #185a9d",
        borderRadius: "8px",
        cursor: "pointer",
        marginTop: "5px"
      },
  card: {
    padding: "30px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center"
  }
};

export default PendingPage;