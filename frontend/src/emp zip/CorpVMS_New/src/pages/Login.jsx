import { useState } from "react";
import { EMPLOYEES, ORGANIZATION } from "../constants/data";

export default function Login({ onLogin }) {
  const [empId,    setEmpId]    = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [touched,  setTouched]  = useState({ id: false, pwd: false });

  const idErr  = touched.id  && !empId.trim()    ? "Employee ID is required" : "";
  const pwdErr = touched.pwd && !password.trim() ? "Password is required"    : "";

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ id: true, pwd: true });
    if (!empId.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    setTimeout(() => {
      const emp = EMPLOYEES.find(
        x => x.id.toLowerCase() === empId.trim().toLowerCase() && x.password === password
      );
      if (emp) {
        onLogin(emp);
      } else {
        setError("Invalid Employee ID or Password. Please try again.");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div style={{
      minHeight:      "100vh",
      background:     "#f4f5f8",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      padding:        20,
    }}>

      {/* Single centered login card */}
      <div style={{
        width:        "100%",
        maxWidth:     420,
        background:   "#ffffff",
        borderRadius: 16,
        border:       "1px solid rgba(0,0,0,.09)",
        boxShadow:    "0 4px 24px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.05)",
        overflow:     "hidden",
        animation:    "loginIn .4s cubic-bezier(.34,1.4,.64,1) both",
      }}>

        {/* Top accent stripe */}
        <div style={{ height:3, background:"linear-gradient(90deg,#1a56db,#6366f1,#0891b2)" }} />

        <div style={{ padding:"36px 36px 32px" }}>

          {/* Logo + title */}
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{
              width:52, height:52, borderRadius:13,
              background:"#1a56db",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 14px",
              boxShadow:"0 4px 14px rgba(26,86,219,.3)",
            }}>
              <i className="bi bi-shield-lock-fill" style={{ color:"#fff", fontSize:24 }} />
            </div>
            <div style={{ fontSize:20, fontWeight:800, color:"#111827", letterSpacing:"-.4px", marginBottom:5 }}>
              Employee Sign In
            </div>
            <div style={{ fontSize:13, color:"#6b7280" }}>
              {ORGANIZATION.name}
            </div>
          </div>

          {/* Error alert */}
          {error && (
            <div style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"10px 13px",
              background:"#fef2f2", border:"1px solid #fca5a5",
              borderRadius:8, marginBottom:18,
              fontSize:12.5, color:"#991b1b", fontWeight:500,
            }}>
              <i className="bi bi-exclamation-circle-fill" style={{ fontSize:14, flexShrink:0 }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* Employee ID */}
            <div style={{ marginBottom:16 }}>
              <label className="form-label">
                Employee ID <span className="required">*</span>
              </label>
              <div style={{ position:"relative" }}>
                <i className="bi bi-person-badge-fill" style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  fontSize:15, color: empId ? "#1a56db" : "#9ca3af",
                  transition:"color .15s", pointerEvents:"none",
                }} />
                <input
                  className={`form-control${idErr?" error": empId&&!idErr?" success":""}`}
                  type="text"
                  placeholder="e.g. EMP001"
                  value={empId}
                  onChange={e => { setEmpId(e.target.value.toUpperCase()); setError(""); }}
                  onBlur={() => setTouched(t => ({...t, id:true}))}
                  style={{ paddingLeft:40, paddingRight: empId&&!idErr?36:12, fontFamily:"var(--mono-font)", fontWeight:600, letterSpacing:.5 }}
                />
                {empId && !idErr && (
                  <i className="bi bi-check-circle-fill" style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"#16a34a",fontSize:14,pointerEvents:"none" }} />
                )}
              </div>
              {idErr && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{idErr}</div>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:10 }}>
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div style={{ position:"relative" }}>
                <i className="bi bi-lock-fill" style={{
                  position:"absolute", left:12, top:"50%", transform:"translateY(-50%)",
                  fontSize:15, color: password ? "#1a56db" : "#9ca3af",
                  transition:"color .15s", pointerEvents:"none",
                }} />
                <input
                  className={`form-control${pwdErr?" error": password&&!pwdErr?" success":""}`}
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(""); }}
                  onBlur={() => setTouched(t => ({...t, pwd:true}))}
                  style={{ paddingLeft:40, paddingRight:44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(s => !s)}
                  tabIndex={-1}
                  style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9ca3af",fontSize:16,padding:2,lineHeight:1 }}
                >
                  <i className={`bi bi-eye${showPwd?"-slash":""}-fill`} />
                </button>
              </div>
              {pwdErr && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{pwdErr}</div>}
            </div>



            {/* Sign In button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width:"100%", padding:"11px 20px",
                marginTop: 20,
                background: loading ? "#93c5fd" : "#1a56db",
                color:"#fff", border:"none", borderRadius:8,
                fontSize:14, fontWeight:700,
                cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                letterSpacing:"-.2px",
                boxShadow: loading ? "none" : "0 2px 8px rgba(26,86,219,.3)",
                transition:"background .15s, box-shadow .15s",
              }}
              onMouseEnter={e => { if(!loading) e.currentTarget.style.background="#1447bc"; }}
              onMouseLeave={e => { if(!loading) e.currentTarget.style.background="#1a56db"; }}
            >
              {loading ? (
                <><i className="bi bi-hourglass-split" style={{animation:"spin .8s linear infinite"}} />Signing in...</>
              ) : (
                <><i className="bi bi-box-arrow-in-right" />Sign In</>
              )}
            </button>

          </form>
        </div>

        {/* Card footer */}
        <div style={{
          padding:"13px 36px 16px",
          borderTop:"1px solid rgba(0,0,0,.07)",
          background:"#fafafa",
          textAlign:"center",
        }}>
          <div style={{ fontSize:11.5, color:"#6b7280" }}>
            Need help? &nbsp;
            <span style={{ color:"#1a56db", fontWeight:600 }}>IT Helpdesk — Ext. 200</span>
          </div>
          <div style={{ fontSize:10.5, color:"#d1d5db", marginTop:5 }}>
            CorpVMS v2.0 · {ORGANIZATION.shortName} · All rights reserved
          </div>
        </div>

      </div>
      {/* end card */}

    </div>
  );
}
