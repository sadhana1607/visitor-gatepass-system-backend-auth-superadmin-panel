import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
  import SuperAdminDashboard from "./pages/GlobalAdmin/Dashboard";
import Login from "./pages/Login";
import Organization from "./pages/Organization";
import PendingPage from "./pages/PendingPage";
import OrgAdminDashboard from "./pages/orgadmin/Dashboard";
import EmployeeDashboard from "./pages/employee/Dashboard";


function App() {
  return (

      <Routes>

        {/* 🔐 Login Page (Default Page) */}
        <Route path="/" element={<Login />} />

        {/* 🏢 Create Organization Page */}
        <Route path="/organization" element={<Organization />} />

        <Route path="/pending" element={<PendingPage/>} />
        <Route path="/global-admin/dashboard"   element={<SuperAdminDashboard /> } />
        <Route path="/org-admin/dashboard"   element={<OrgAdminDashboard /> } />
        <Route path="/employee/dashboard"   element={<EmployeeDashboard /> } />

      </Routes>

  );
}

export default App;