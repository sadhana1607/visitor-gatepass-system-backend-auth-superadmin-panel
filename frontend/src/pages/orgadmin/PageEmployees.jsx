// pages/PageEmployees.jsx
import { useState } from "react";

const DEPTS   = ["Executive Office","HR & Administration","Information Technology","Finance & Accounts","Operations","Legal & Compliance","Security"];
const DESIGS  = ["CEO","CTO","CFO","HR Director","IT Manager","Admin Head","Operations Manager","Security Guard","Receptionist","Software Engineer","Accountant"];
const AV_CLRS = ["#6366f1","#10b981","#8b5cf6","#f59e0b","#0ea5e9","#ef4444"];
const ini     = n => n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
const EMPTY   = { name:"", email:"", phone:"", dept:"HR & Administration", role:"employee" };

const INIT_EMP = [
  { id:"EMP-001",name:"Rajesh Singhania",email:"rajesh@company.com", role:"employee",dept:"Executive Office",      phone:"9876543210",status:"active",  joined:"01-Jan-2025",designation:"CEO"           },
  { id:"EMP-002",name:"Meera Krishnan",  email:"meera@company.com",  role:"employee",dept:"HR & Administration",   phone:"9823456789",status:"active",  joined:"05-Jan-2025",designation:"HR Director"    },
  { id:"EMP-003",name:"Vikram Joshi",    email:"vikram@company.com", role:"employee",dept:"Information Technology",phone:"9712345678",status:"active",  joined:"10-Jan-2025",designation:"CTO"           },
  { id:"EMP-004",name:"Anil Kapoor",     email:"anil@company.com",   role:"employee",dept:"Finance & Accounts",    phone:"9654321098",status:"active",  joined:"12-Jan-2025",designation:"CFO"           },
  { id:"EMP-005",name:"Priya Shah",      email:"priya@company.com",  role:"employee",dept:"HR & Administration",   phone:"9543210987",status:"active",  joined:"15-Jan-2025",designation:"Admin Head"     },
  { id:"EMP-006",name:"Deepak Nair",     email:"deepak@company.com", role:"employee",dept:"Information Technology",phone:"9432109876",status:"active",  joined:"20-Jan-2025",designation:"IT Manager"    },
  { id:"EMP-007",name:"Ram Gupta",       email:"ram@company.com",    role:"guard",   dept:"Security",              phone:"9321098765",status:"active",  joined:"22-Jan-2025",designation:"Security Guard" },
  { id:"EMP-008",name:"Sunita Rao",      email:"sunita@company.com", role:"employee",dept:"Operations",            phone:"9210987654",status:"inactive",joined:"25-Jan-2025",designation:"Ops Manager"   },
];

export default function PageEmployees({ addToast }) {
  const [emps,   setEmps]   = useState(INIT_EMP);
  const [search, setSearch] = useState("");
  const [deptF,  setDeptF]  = useState("all");
  const [roleF,  setRoleF]  = useState("all");
  const [modal,  setModal]  = useState(null);   // "add" | "edit" | "confirm"
  const [target, setTarget] = useState(null);
  const [form,   setForm]   = useState(EMPTY);
  const [errs,   setErrs]   = useState({});
  const [confirmData, setConfirmData] = useState(null); // { emp, newStatus }

  const sf = (k,v) => { setForm(f=>({...f,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  // ── Validation ──────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.name.trim()) {
      e.name = "Name is required";
    }
    // Email — must be valid format
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(form.email.trim())) {
      e.email = "Enter a valid email address (e.g. user@company.com)";
    }
    // Phone — exactly 10 digits
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      e.phone = "Phone must be exactly 10 digits (numbers only)";
    }
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const openAdd  = ()  => { setForm(EMPTY); setErrs({}); setModal("add"); };
  const openEdit = (e) => {
    setTarget(e);
    setForm({ name:e.name, email:e.email, phone:e.phone, dept:e.dept, role:e.role });
    setErrs({});
    setModal("edit");
  };
  const close = () => { setModal(null); setTarget(null); setConfirmData(null); };

  const handleAdd = () => {
    if (!validate()) return;
    const newE = {
      id: `EMP-${String(emps.length+1).padStart(3,"0")}`,
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      status: "active",
      joined: new Date().toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),
    };
    setEmps(p => [...p, newE]);
    addToast(`✅ ${form.name} added successfully!`, "success");
    close();
  };

  const handleEdit = () => {
    if (!validate()) return;
    setEmps(p => p.map(e => e.id===target.id ? {...e,...form,email:form.email.trim().toLowerCase(),phone:form.phone.trim()} : e));
    addToast(`✏️ ${form.name} updated!`, "success");
    close();
  };

  // ── Toggle Active / Inactive with confirm modal ──
  const requestToggle = (emp) => {
    const newStatus = emp.status === "active" ? "inactive" : "active";
    setConfirmData({ emp, newStatus });
    setModal("confirm");
  };

  const confirmToggle = () => {
    const { emp, newStatus } = confirmData;
    setEmps(p => p.map(e => e.id===emp.id ? {...e, status:newStatus} : e));
    addToast(
      newStatus === "active"
        ? `✅ ${emp.name} is now Active`
        : `⛔ ${emp.name} has been Deactivated`,
      newStatus === "active" ? "success" : "warning"
    );
    close();
  };

  // ── Filters ──
  const filtered = emps.filter(e => {
    const q = search.toLowerCase();
    return (!search || (e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q)))
      && (deptF === "all" || e.dept === deptF)
      && (roleF === "all" || e.role === roleF);
  });

  const active = emps.filter(e=>e.status==="active").length;
  const guards = emps.filter(e=>e.role==="guard").length;

  return (
    <div className="page">
      {/* Stat strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:20}}>
        {[
          {label:"Total Employees", value:emps.length,        color:"#6366f1", icon:"bi-people-fill"       },
          {label:"Active",          value:active,              color:"#10b981", icon:"bi-person-check-fill"  },
          {label:"Inactive",        value:emps.length-active,  color:"#ef4444", icon:"bi-person-x-fill"      },
          {label:"Security Guards", value:guards,              color:"#8b5cf6", icon:"bi-shield-fill"        },
        ].map(s=>(
          <div key={s.label} className="stat-card">
            <div className="stat-glow" style={{background:s.color}}/>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{color:s.color,fontSize:28}}>{s.value}</div>
            <i className={`bi ${s.icon} stat-icon`}/>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="cv-card">
        <div className="card-head" style={{flexWrap:"wrap",gap:10}}>
          <span className="card-head-title">👨‍💼 Employees ({filtered.length})</span>
          <div className="search-box">
            <i className="bi bi-search"/>
            <input placeholder="Search by name, email..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="f-control" style={{width:"auto",padding:"6px 12px",fontSize:12}} value={deptF} onChange={e=>setDeptF(e.target.value)}>
            <option value="all">All Departments</option>
            {DEPTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <select className="f-control" style={{width:"auto",padding:"6px 12px",fontSize:12}} value={roleF} onChange={e=>setRoleF(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="employee">Employee</option>
            <option value="guard">Security Guard</option>
          </select>
          <button className="cv-btn btn-primary sm" style={{marginLeft:"auto"}} onClick={openAdd}>
            <i className="bi bi-plus-lg"/>Add Employee
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="cv-table">
            <thead>
              <tr>
                <th>#</th><th>Employee</th>
                <th>Department</th><th>Phone</th><th>Role</th>
                <th>Joined</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan="8" style={{textAlign:"center",padding:32,color:"var(--text-tertiary)"}}>No employees found</td></tr>
              ) : filtered.map((e,i) => {
                const clr = AV_CLRS[i % AV_CLRS.length];
                const isActive = e.status === "active";
                return (
                  <tr key={e.id}>
                    <td><span className="mono">{String(i+1).padStart(2,"0")}</span></td>
                    <td>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:34,height:34,borderRadius:"50%",background:clr+"15",border:`1px solid ${clr}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11.5,fontWeight:700,color:clr,flexShrink:0}}>
                          {ini(e.name)}
                        </div>
                        <div>
                          <strong>{e.name}</strong>
                          <div style={{fontSize:11,color:"var(--text-tertiary)",fontFamily:"var(--font-mono)"}}>{e.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:12,color:"var(--text-secondary)"}}>{e.dept}</td>
                    <td><span className="mono" style={{fontSize:11.5}}>{e.phone}</span></td>
                    <td><span className={`role-pill ${e.role==="guard"?"rp-guard":"rp-employee"}`}>{e.role==="guard"?"Security Guard":"Employee"}</span></td>
                    <td style={{fontSize:12,color:"var(--text-tertiary)"}}>{e.joined}</td>
                    <td>
                      <span className={`cv-badge ${isActive?"b-active":"b-inactive"}`}>
                        {isActive?"Active":"Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {/* Edit button */}
                        <button className="act-btn edit" title="Edit" onClick={()=>openEdit(e)}>
                          <i className="bi bi-pencil-fill"/>
                        </button>

                        {/* Active / Deactivate toggle button */}
                        {isActive ? (
                          <button
                            title="Deactivate employee"
                            onClick={()=>requestToggle(e)}
                            style={{
                              display:"inline-flex",alignItems:"center",gap:5,
                              padding:"4px 10px",borderRadius:"var(--radius-full)",
                              border:"1px solid rgba(220,38,38,.25)",
                              background:"rgba(220,38,38,.07)",
                              color:"#dc2626",fontSize:11.5,fontWeight:700,
                              cursor:"pointer",whiteSpace:"nowrap",transition:"all .13s",
                            }}
                            onMouseEnter={e2=>{e2.currentTarget.style.background="rgba(220,38,38,.14)";}}
                            onMouseLeave={e2=>{e2.currentTarget.style.background="rgba(220,38,38,.07)";}}
                          >
                            <i className="bi bi-slash-circle" style={{fontSize:12}}/>
                            Deactivate
                          </button>
                        ) : (
                          <button
                            title="Activate employee"
                            onClick={()=>requestToggle(e)}
                            style={{
                              display:"inline-flex",alignItems:"center",gap:5,
                              padding:"4px 10px",borderRadius:"var(--radius-full)",
                              border:"1px solid rgba(5,150,105,.25)",
                              background:"rgba(5,150,105,.08)",
                              color:"#059669",fontSize:11.5,fontWeight:700,
                              cursor:"pointer",whiteSpace:"nowrap",transition:"all .13s",
                            }}
                            onMouseEnter={e2=>{e2.currentTarget.style.background="rgba(5,150,105,.16)";}}
                            onMouseLeave={e2=>{e2.currentTarget.style.background="rgba(5,150,105,.08)";}}
                          >
                            <i className="bi bi-check-circle" style={{fontSize:12}}/>
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ ADD / EDIT MODAL ══ */}
      {(modal==="add"||modal==="edit") && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="c-icon" style={{background:"rgba(99,102,241,.1)",color:"#6366f1"}}>
                  <i className={`bi ${modal==="add"?"bi-person-plus-fill":"bi-pencil-fill"}`}/>
                </div>
                <span style={{fontWeight:700,fontSize:15,color:"var(--text-primary)"}}>
                  {modal==="add"?"Add New Employee":`Edit — ${target?.name}`}
                </span>
              </div>
              <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",fontSize:19,color:"var(--text-tertiary)"}}>
                <i className="bi bi-x-lg"/>
              </button>
            </div>

            <div className="modal-body">
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>

                {/* Full Name */}
                <div style={{gridColumn:"1/-1"}}>
                  <label className="f-label">Full Name *</label>
                  <input
                    className={`f-control${errs.name?" error":""}`}
                    placeholder="e.g. Rajesh Kumar"
                    value={form.name}
                    onChange={e=>sf("name",e.target.value)}
                  />
                  {errs.name && <div className="f-error"><i className="bi bi-exclamation-circle" style={{marginRight:4}}/>{errs.name}</div>}
                </div>

                {/* Email */}
                <div>
                  <label className="f-label">Email Address *</label>
                  <div style={{position:"relative"}}>
                    <i className="bi bi-envelope" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13,pointerEvents:"none"}}/>
                    <input
                      className={`f-control${errs.email?" error":""}`}
                      style={{paddingLeft:36}}
                      type="email"
                      placeholder="user@company.com"
                      value={form.email}
                      onChange={e=>sf("email",e.target.value)}
                    />
                  </div>
                  {errs.email && <div className="f-error"><i className="bi bi-exclamation-circle" style={{marginRight:4}}/>{errs.email}</div>}
                </div>

                {/* Phone */}
                <div>
                  <label className="f-label">Phone Number * <span style={{fontSize:10,color:"var(--text-tertiary)",fontWeight:400}}>(10 digits)</span></label>
                  <div style={{position:"relative"}}>
                    <i className="bi bi-telephone" style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#94a3b8",fontSize:13,pointerEvents:"none"}}/>
                    <input
                      className={`f-control${errs.phone?" error":""}`}
                      style={{paddingLeft:36}}
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={e=>sf("phone",e.target.value.replace(/\D/g,"").slice(0,10))}
                      maxLength={10}
                      inputMode="numeric"
                    />
                  </div>
                  {errs.phone && <div className="f-error"><i className="bi bi-exclamation-circle" style={{marginRight:4}}/>{errs.phone}</div>}
                  {/* Live digit counter */}
                  <div style={{fontSize:10.5,color:form.phone.length===10?"var(--success)":"var(--text-tertiary)",marginTop:4,textAlign:"right"}}>
                    {form.phone.length}/10 digits {form.phone.length===10&&"✓"}
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="f-label">Department</label>
                  <select className="f-control" value={form.dept} onChange={e=>sf("dept",e.target.value)}>
                    {DEPTS.map(d=><option key={d}>{d}</option>)}
                  </select>
                </div>

                {/* Role */}
                <div>
                  <label className="f-label">Role</label>
                  <select className="f-control" value={form.role} onChange={e=>sf("role",e.target.value)}>
                    <option value="employee">Employee</option>
                    <option value="guard">Security Guard</option>
                  </select>
                </div>

              </div>
            </div>

            <div className="modal-foot">
              <button className="cv-btn btn-ghost" onClick={close}><i className="bi bi-x"/>Cancel</button>
              <button className="cv-btn btn-primary" onClick={modal==="add"?handleAdd:handleEdit}>
                <i className={`bi ${modal==="add"?"bi-person-plus-fill":"bi-check-circle-fill"}`}/>
                {modal==="add"?"Add Employee":"Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONFIRM TOGGLE MODAL ══ */}
      {modal==="confirm" && confirmData && (
        <div className="modal-overlay" onClick={close}>
          <div className="modal-box" style={{maxWidth:420}} onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div className="c-icon" style={{
                  background: confirmData.newStatus==="active"?"rgba(5,150,105,.1)":"rgba(220,38,38,.1)",
                  color:      confirmData.newStatus==="active"?"#059669":"#dc2626",
                }}>
                  <i className={`bi ${confirmData.newStatus==="active"?"bi-check-circle-fill":"bi-slash-circle-fill"}`}/>
                </div>
                <span style={{fontWeight:700,fontSize:15,color:"var(--text-primary)"}}>
                  {confirmData.newStatus==="active"?"Activate Employee":"Deactivate Employee"}
                </span>
              </div>
              <button onClick={close} style={{background:"none",border:"none",cursor:"pointer",fontSize:19,color:"var(--text-tertiary)"}}>
                <i className="bi bi-x-lg"/>
              </button>
            </div>

            <div className="modal-body">
              {/* Employee preview */}
              <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:"var(--surface-2)",border:"1px solid var(--border-default)",borderRadius:"var(--radius-md)",marginBottom:16}}>
                <div style={{width:38,height:38,borderRadius:"50%",background:"#6366f115",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#6366f1",flexShrink:0}}>
                  {ini(confirmData.emp.name)}
                </div>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:"var(--text-primary)"}}>{confirmData.emp.name}</div>
                  <div style={{fontSize:12,color:"var(--text-tertiary)"}}>{confirmData.emp.dept}</div>
                </div>
              </div>

              <p style={{color:"var(--text-secondary)",fontSize:13.5,lineHeight:1.7}}>
                {confirmData.newStatus==="active"
                  ? <>Are you sure you want to <strong style={{color:"#059669"}}>activate</strong> this employee? They will regain access to the system.</>
                  : <>Are you sure you want to <strong style={{color:"#dc2626"}}>deactivate</strong> this employee? They will lose system access immediately.</>
                }
              </p>
            </div>

            <div className="modal-foot">
              <button className="cv-btn btn-ghost" onClick={close}>Cancel</button>
              <button
                className="cv-btn"
                style={{
                  background: confirmData.newStatus==="active"?"var(--success)":"var(--danger)",
                  color:"#fff",
                }}
                onClick={confirmToggle}
              >
                <i className={`bi ${confirmData.newStatus==="active"?"bi-check-circle-fill":"bi-slash-circle-fill"}`}/>
                {confirmData.newStatus==="active"?"Yes, Activate":"Yes, Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
