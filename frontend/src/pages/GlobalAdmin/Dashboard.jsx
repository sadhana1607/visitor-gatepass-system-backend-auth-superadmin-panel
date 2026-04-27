import { useState, useEffect } from "react";
import GlobalAdminSidebar from "../../components/GlobalAdmin/Sidebar";
import ManageOrganizations from "./ManageOrganizations";
import AllUsers from "./AllUsers";
import Reports from "./Reports";
import Settings from "./Settings";
import EmailCenter from "./EmailCenter";
import LiveAlerts from "./LiveAlerts";
import { ToastContainer, useToast } from "../../components/Toast";

import { getAllOrganizations } from "../../api/organizationApi";

export default function GlobalAdminDashboard() {
  const [page, setPage] = useState("dashboard");
  const [orgs, setOrgs] = useState([]);
  const [clock, setClock] = useState("");

  const { toasts, addToast } = useToast();

  // ✅ Fetch organizations
  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await getAllOrganizations();
      setOrgs(res.data);
    } catch (err) {
      console.error("Error fetching orgs:", err);
    }
  };

  // ✅ Live clock
  useEffect(() => {
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Stats
  const totalOrgs = orgs.length;
  const totalUsers = orgs.reduce((sum, o) => sum + (o.users || 0), 0);
  const totalVisitors = orgs.reduce((sum, o) => sum + (o.visitors || 0), 0);
  const companies = orgs.filter((o) => o.type === "company").length;
  const apartments = orgs.filter((o) => o.type === "apartment").length;
  const activeOrgs = orgs.filter(
    (o) => o.status === "approved" || o.status === "active"
  ).length;

  const PAGE_META = {
    dashboard: { title: "Command Center", sub: "Global overview" },
    organizations: { title: "Manage Organizations", sub: "" },
    users: { title: "All Users", sub: "" },
    reports: { title: "Reports", sub: "" },
    email: { title: "Email Center", sub: "" },
    alerts: { title: "Live Alerts", sub: "" },
    settings: { title: "Settings", sub: "" },
  };

  const meta = PAGE_META[page] || { title: page, sub: "" };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />

      <div className="app-wrap">
        <GlobalAdminSidebar
          activePage={page}
          onNavigate={setPage}
          orgCount={totalOrgs}
          userCount={totalUsers}
        />

        <div className="main-wrap">
          <div className="topbar">
            <div style={{ flex: 1 }}>
              <div className="pg-title">{meta.title}</div>
              <div className="pg-sub">{meta.sub}</div>
            </div>
            <div className="clock-chip">{clock}</div>
          </div>

          <div className="content">

            {/* DASHBOARD */}
            {page === "dashboard" && (
              <div className="page">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  <StatCard label="Total Organizations" value={totalOrgs} color="#8b5cf6" />
                  <StatCard label="Active Orgs" value={activeOrgs} color="#00c878" />
                  <StatCard label="Total Users" value={totalUsers} color="#0d6efd" />
                  <StatCard label="Total Visitors" value={totalVisitors} color="#f59e0b" />
                </div>
              </div>
            )}

            {page === "organizations" && (
              <ManageOrganizations orgs={orgs} setOrgs={setOrgs} addToast={addToast} />
            )}

            {page === "users" && <AllUsers addToast={addToast} />}
            {page === "reports" && <Reports addToast={addToast} />}
            {page === "email" && <EmailCenter addToast={addToast} />}
            {page === "alerts" && <LiveAlerts addToast={addToast} />}
            {page === "settings" && <Settings addToast={addToast} />}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </>
  );
}

// ✅ StatCard
function StatCard({ label, value, color }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>
        {value}
      </div>
    </div>
  );
}