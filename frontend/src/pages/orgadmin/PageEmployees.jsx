import { useState, useEffect } from "react";
import {
  createEmployee,
  getAllEmployees,
  updateEmployee,

} from "../../api/employeeApi";
import { getUsersByRole, updateUserStatus } from "../../api/userApi.js";

const DEPTS = [
  "Executive Office",
  "HR & Administration",
  "Information Technology",
  "Finance & Accounts",
  "Operations",
  "Legal & Compliance",
  "Security"
];

const AV_CLRS = ["#6366f1","#10b981","#8b5cf6","#f59e0b","#0ea5e9","#ef4444"];
const ini = n => n?.split(" ").map(x => x[0]).join("").slice(0, 2).toUpperCase() || "??";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  department: "HR & Administration",
  role: "EMPLOYEE",
  designation: "Staff",
  shiftStart: "09:00",
  shiftEnd: "18:00",
  password: ""
};

export default function PageEmployees({ addToast }) {
  const [emps, setEmps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptF, setDeptF] = useState("all");
  const [roleF, setRoleF] = useState("all");
  const [modal, setModal] = useState(null);
  const [target, setTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [confirmData, setConfirmData] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await getAllEmployees();
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setEmps(data);
    } catch {
      addToast("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const sf = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrs(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";

    if (!form.email?.trim()) {
      e.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      e.email = "Enter valid email";
    }

    if (!form.phone?.trim()) e.phone = "Phone required";
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "10 digits required";

    if (modal === "add" && !form.password) e.password = "Password required";

    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => {
    setForm(EMPTY);
    setModal("add");
  };

  const openEdit = (emp) => {
    setTarget(emp);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "HR & Administration",
      role: emp.role || "EMPLOYEE",
      designation: emp.designation || "Staff",
      shiftStart: emp.shiftStart || "09:00",
      shiftEnd: emp.shiftEnd || "18:00",
      password: ""
    });
    setModal("edit");
  };

  const close = () => {
    setModal(null);
    setTarget(null);
    setConfirmData(null);
  };

  const handleAdd = async () => {
    if (!validate()) return;
    try {
      await createEmployee({
        ...form,
        shift_starttime: form.shiftStart,
        shift_endtime: form.shiftEnd,
        status: "ACTIVE"
      });
      addToast("Employee added", "success");
      fetchEmployees();
      close();
    } catch {
      addToast("Error adding employee", "error");
    }
  };

  const handleEdit = async () => {
    if (!validate()) return;
    try {
      const { password, ...rest } = form;
      await updateEmployee(target.id, rest);
      addToast("Employee updated", "success");
      fetchEmployees();
      close();
    } catch {
      addToast("Error updating employee", "error");
    }
  };

  const requestToggle = (emp) => {
    const newStatus = emp.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setConfirmData({ emp, newStatus });
    setModal("confirm");
  };

  const confirmToggle = async () => {
    await updateEmployeeStatus(confirmData.emp.id, confirmData.newStatus);
    fetchEmployees();
    close();
  };

  const filtered = emps.filter(e => {
    const q = search.toLowerCase();
    return (
      (!search || e.name?.toLowerCase().includes(q) || e.email?.toLowerCase().includes(q)) &&
      (deptF === "all" || e.department === deptF) &&
      (roleF === "all" || e.role === roleF)
    );
  });

  return (
    <div className="page">

      {/* STATS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:20 }}>
        {[
          { label:"Total Employees", value:emps.length, color:"#6366f1" },
          { label:"Active", value:emps.filter(e=>e.status==="ACTIVE").length, color:"#10b981" },
          { label:"Inactive", value:emps.filter(e=>e.status!=="ACTIVE").length, color:"#ef4444" },
          { label:"Security Guards", value:emps.filter(e=>e.role==="GUARD").length, color:"#8b5cf6" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* TABLE HEADER */}
      <div className="card-head">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />

        <select value={deptF} onChange={e => setDeptF(e.target.value)}>
          <option value="all">All Departments</option>
          {DEPTS.map(d => <option key={d}>{d}</option>)}
        </select>

        <select value={roleF} onChange={e => setRoleF(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="GUARD">Guard</option>
          <option value="ORG_ADMIN">Org Admin</option> {/* ✅ ADDED */}
        </select>

        <button onClick={openAdd}>+ Add Employee</button>
      </div>

      {/* TABLE */}
      <table className="cv-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(e => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.role}</td>
              <td>{e.status}</td>
              <td>
                <button onClick={() => openEdit(e)}>Edit</button>
                <button onClick={() => requestToggle(e)}>
                  {e.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {(modal === "add" || modal === "edit") && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div className="modal-header">
              <h3>{modal === "add" ? "Add Employee" : "Edit Employee"}</h3>
            </div>

            <div className="modal-body">

              <input className="modal-input" placeholder="Name"
                value={form.name}
                onChange={e => sf("name", e.target.value)} />

              <input className="modal-input" placeholder="Email"
                value={form.email}
                onChange={e => sf("email", e.target.value)} />

              <input className="modal-input" placeholder="Phone"
                value={form.phone}
                onChange={e => sf("phone", e.target.value)} />

              {/* SHIFT */}
              <div className="row-2">
                <input className="modal-input" type="time"
                  value={form.shiftStart}
                  onChange={e => sf("shiftStart", e.target.value)} />

                <input className="modal-input" type="time"
                  value={form.shiftEnd}
                  onChange={e => sf("shiftEnd", e.target.value)} />
              </div>

              <select className="modal-input"
                value={form.role}
                onChange={e => sf("role", e.target.value)}>

                <option value="EMPLOYEE">Employee</option>
                <option value="GUARD">Guard</option>
                <option value="ORG_ADMIN">Org Admin</option>
              </select>

              <select className="modal-input"
                value={form.department}
                onChange={e => sf("department", e.target.value)}>

                {DEPTS.map(d => <option key={d}>{d}</option>)}
              </select>

              {modal === "add" && (
                <input className="modal-input"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={e => sf("password", e.target.value)} />
              )}

            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={close}>Cancel</button>
              <button className="btn-save" onClick={modal === "add" ? handleAdd : handleEdit}>
                Save
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

