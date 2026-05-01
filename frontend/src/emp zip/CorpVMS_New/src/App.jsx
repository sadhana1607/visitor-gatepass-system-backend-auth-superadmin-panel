import { useState } from "react";
import "./styles/theme.css";
import { SEED_VISITORS } from "./constants/data";
import { useToast, ToastContainer } from "./components/shared/Toast";
import Sidebar  from "./components/layout/Sidebar";
import Topbar   from "./components/layout/Topbar";
import Login    from "./pages/Login";
import Dashboard        from "./pages/Dashboard";
import PreRegistration  from "./pages/PreRegistration";
import RegistrationList from "./pages/RegistrationList";
import Profile          from "./pages/Profile";

export default function App() {
  const [employee, setEmployee] = useState(null);   // null = logged out
  const [page,     setPage]     = useState("dashboard");
  const [visitors, setVisitors] = useState(SEED_VISITORS);
  const { toasts, addToast }    = useToast();

  // ── Auth ──
  const handleLogin  = (emp) => { setEmployee(emp); setPage("dashboard"); };
  const handleLogout = ()    => { setEmployee(null); setPage("dashboard"); };

  // ── Not logged in → show Login ──
  if (!employee) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  // ── Logged in → main layout ──
  return (
    <div className="app-wrap">
      <Sidebar
        page={page}
        navigate={setPage}
        employee={employee}
        onLogout={handleLogout}
      />

      <div className="main-wrap">
        <Topbar page={page} employee={employee} />

        <div className="page-content">
          {page === "dashboard" && (
            <Dashboard
              visitors={visitors}
              employee={employee}
              navigate={setPage}
            />
          )}
          {page === "prereg" && (
            <PreRegistration
              visitors={visitors}
              setVisitors={setVisitors}
              employee={employee}
              addToast={addToast}
            />
          )}
          {page === "reglist" && (
            <RegistrationList
              visitors={visitors}
              employee={employee}
            />
          )}
          {page === "profile" && (
            <Profile employee={employee} />
          )}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
