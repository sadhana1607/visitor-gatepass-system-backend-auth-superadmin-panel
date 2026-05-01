import { useState } from "react";
import { VISITOR_TYPES, HOST_LIST, todayStr, genVisitorId, genPasscode, formatDate, initials } from "../constants/data";
import StatusBadge from "../components/shared/StatusBadge";

// ── Validation ──
const MOBILE_RE = /^[6-9]\d{9}$/;
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form) {
  const e = {};
  if (!form.name.trim())                              e.name    = "Visitor name is required";
  if (!form.phone.trim())                             e.phone   = "Phone number is required";
  else if (!MOBILE_RE.test(form.phone))               e.phone   = "Enter a valid 10-digit Indian mobile (starts 6–9)";
  if (form.email.trim() && !EMAIL_RE.test(form.email.trim())) e.email = "Enter a valid email address";
  if (!form.purpose)                                  e.purpose = "Purpose of visit is required";
  if (!form.visitDate)                                e.visitDate = "Visit date is required";
  if (form.visitDate && form.visitDate < todayStr())  e.visitDate = "Visit date cannot be in the past";
  return e;
}

function validateField(k, v, form) {
  if (k === "name"      && !v.trim())               return "Visitor name is required";
  if (k === "phone")    {
    if (!v.trim()) return "Phone number is required";
    if (!MOBILE_RE.test(v)) return "Valid 10-digit mobile starting 6–9";
  }
  if (k === "email" && v.trim() && !EMAIL_RE.test(v.trim())) return "Enter a valid email address";
  if (k === "purpose"   && !v)                       return "Purpose is required";
  if (k === "visitDate") {
    if (!v) return "Visit date is required";
    if (v < todayStr()) return "Cannot be in the past";
  }
  return "";
}

// ── FieldInput (stable — outside component) ──
function FieldInput({ name, label, required, placeholder, type = "text", maxLength, value, error, touched, onChange, onBlur, prefix }) {
  const isErr   = !!error;
  const isValid = touched && !error && value;
  return (
    <div className="form-group" style={{ marginBottom:0 }}>
      <label className="form-label">
        {label}{required && <span className="required"> *</span>}
      </label>
      <div style={{ position:"relative", display:"flex", alignItems:"center" }}>
        {prefix && (
          <div style={{
            position:"absolute", left:0, top:0, bottom:0, width:64,
            display:"flex", alignItems:"center", justifyContent:"center",
            borderRight:"1px solid rgba(0,0,0,.1)", color:"var(--fg-3)",
            fontSize:12, fontWeight:600, pointerEvents:"none", zIndex:1,
            background:"#f9fafb", borderRadius:"var(--r-sm) 0 0 var(--r-sm)",
          }}>
            {prefix}
          </div>
        )}
        <input
          className={`form-control${isErr?" error":isValid?" success":""}`}
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          autoComplete="off"
          style={{ paddingLeft: prefix ? 72 : undefined, paddingRight: isErr||isValid ? 36 : undefined }}
          onChange={e => onChange(name, type==="tel" ? e.target.value.replace(/\D/g,"").slice(0,10) : e.target.value)}
          onBlur={() => onBlur(name)}
        />
        {isValid && <i className="bi bi-check-circle-fill" style={{ position:"absolute",right:11,color:"var(--green)",fontSize:14,pointerEvents:"none" }} />}
        {isErr   && <i className="bi bi-exclamation-circle-fill" style={{ position:"absolute",right:11,color:"var(--red)",fontSize:14,pointerEvents:"none" }} />}
      </div>
      {isErr  && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{error}</div>}
      {isValid && <div className="form-valid"><i className="bi bi-check-circle" style={{fontSize:10}}/>Looks good</div>}
    </div>
  );
}

// ── EMPTY form ──
const EMPTY = { name:"", phone:"", email:"", purpose:"", visitDate:"", passcode:"" };

export default function PreRegistration({ visitors, setVisitors, employee, addToast }) {
  const [form,       setForm]       = useState(EMPTY);
  const [errs,       setErrs]       = useState({});
  const [touched,    setTouched]    = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState(null);

  // My registrations
  const myList = visitors.filter(v => v.registeredBy === employee.id)
                          .sort((a,b) => b.id.localeCompare(a.id));

  const handleChange = (k, v) => {
    setForm(f => {
      const updated = {...f, [k]: v};
      // Auto-generate passcode when name+date are set
      if ((k==="name"||k==="visitDate") && updated.name && updated.visitDate && !touched.passcode) {
        updated.passcode = genPasscode(updated.name, updated.visitDate);
      }
      return updated;
    });
    if (errs[k]) setErrs(e => ({...e, [k]: ""}));
  };

  const handleBlur = (k) => {
    setTouched(t => ({...t, [k]: true}));
    setErrs(e => ({...e, [k]: validateField(k, form[k], form)}));
  };

  const handleSubmit = () => {
    const allTouched = { name:true, phone:true, email:true, purpose:true, visitDate:true };
    setTouched(allTouched);
    const e = validate(form);
    setErrs(e);
    if (Object.keys(e).length > 0) { addToast("Please fix the errors before submitting","error"); return; }

    setSubmitting(true);
    setTimeout(() => {
      const newVisitor = {
        id:           genVisitorId(visitors),
        name:         form.name.trim(),
        phone:        form.phone.trim(),
        email:        form.email.trim(),
        purpose:      form.purpose,
        visitDate:    form.visitDate,
        passcode:     form.passcode.trim() || genPasscode(form.name, form.visitDate),
        host:         "—",
        status:       "Pending",
        registeredAt: new Date().toLocaleString("en-IN"),
        checkedIn:    "",
        checkedOut:   "",
        note:         "",
        registeredBy: employee.id,
      };
      setVisitors(prev => [...prev, newVisitor]);
      setSuccess(newVisitor);
      setForm(EMPTY);
      setErrs({});
      setTouched({});
      setSubmitting(false);
      addToast(`${newVisitor.name} pre-registered successfully!`, "success");
    }, 700);
  };

  const handleReset = () => { setForm(EMPTY); setErrs({}); setTouched({}); setSuccess(null); };

  const phoneDig = form.phone.length;

  return (
    <div className="page-enter">
      <div className="grid-left-lg">

        {/* ══ FORM ══ */}
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background:"var(--accent-lt)", color:"var(--accent)" }}>
              <i className="bi bi-person-plus-fill" />
            </div>
            <div>
              <div className="card-title">Register Expected Visitor</div>
              <div style={{ fontSize:11, color:"var(--fg-3)", marginTop:1 }}>Fill in visitor details — all starred fields are required</div>
            </div>
          </div>

          <div className="card-body">

            {/* Success flash */}
            {success && (
              <div className="info-banner info-green" style={{ marginBottom:18, position:"relative" }}>
                <i className="bi bi-check-circle-fill info-icon" />
                <div>
                  <div style={{ fontWeight:700, marginBottom:2 }}>Visitor Registered! 🎉</div>
                  <div style={{ fontSize:11.5 }}>
                    <strong>{success.name}</strong> · Pass <span style={{ fontFamily:"var(--mono-font)", fontWeight:700 }}>{success.id}</span> · Passcode: <span style={{ fontFamily:"var(--mono-font)", fontWeight:700 }}>{success.passcode}</span>
                  </div>
                </div>
                <button onClick={()=>setSuccess(null)} style={{ position:"absolute", right:12, top:12, background:"none", border:"none", cursor:"pointer", color:"var(--green)", fontSize:16 }}>×</button>
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

              {/* 1. Visitor Name */}
              <FieldInput name="name" label="Visitor Name" required
                placeholder="Full name of the visitor"
                value={form.name} error={errs.name} touched={touched.name}
                onChange={handleChange} onBlur={handleBlur}
              />

              {/* 2. Phone Number */}
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">
                  Phone Number <span className="required">*</span>
                </label>
                <div style={{ position:"relative" }}>
                  <div style={{
                    position:"absolute", left:0, top:0, bottom:0, width:68,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    borderRight:"1px solid rgba(0,0,0,.1)", fontSize:12, fontWeight:600,
                    color:"var(--fg-2)", pointerEvents:"none", zIndex:1,
                    background:"#f9fafb", borderRadius:"var(--r-sm) 0 0 var(--r-sm)",
                    gap:3,
                  }}>
                    🇮🇳 +91
                  </div>
                  <input
                    className={`form-control${errs.phone?" error":touched.phone&&!errs.phone&&form.phone?" success":""}`}
                    type="tel"
                    placeholder="98765 43210"
                    value={form.phone}
                    maxLength={10}
                    style={{ paddingLeft:78 }}
                    onChange={e => handleChange("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
                    onBlur={() => handleBlur("phone")}
                  />
                  {touched.phone && !errs.phone && form.phone && (
                    <i className="bi bi-check-circle-fill" style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"var(--green)",fontSize:14 }} />
                  )}
                  {errs.phone && (
                    <i className="bi bi-exclamation-circle-fill" style={{ position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:"var(--red)",fontSize:14 }} />
                  )}
                </div>
                {errs.phone && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{errs.phone}</div>}
                {!errs.phone && form.phone && phoneDig < 10 && (
                  <div className="form-hint"><i className="bi bi-info-circle" style={{fontSize:10}}/>{10-phoneDig} more digit{10-phoneDig!==1?"s":""} needed</div>
                )}
                {!errs.phone && form.phone && phoneDig === 10 && (
                  <div className="form-valid"><i className="bi bi-check-circle" style={{fontSize:10}}/>Looks good</div>
                )}
              </div>

              {/* 3. Email Address */}
              <FieldInput name="email" label="Visitor Email" required={false}
                placeholder="visitor@example.com"
                type="email"
                value={form.email} error={errs.email} touched={touched.email}
                onChange={handleChange} onBlur={handleBlur}
              />

              {/* 4. Purpose of Visit */}
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Purpose of Visit <span className="required">*</span></label>
                <select
                  className={`form-control${errs.purpose?" error":touched.purpose&&!errs.purpose&&form.purpose?" success":""}`}
                  value={form.purpose}
                  onChange={e => handleChange("purpose", e.target.value)}
                  onBlur={() => handleBlur("purpose")}
                >
                  <option value="">— Select purpose —</option>
                  {VISITOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errs.purpose && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{errs.purpose}</div>}
              </div>

              {/* 5. Visit Date */}
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Visit Date <span className="required">*</span></label>
                <input
                  className={`form-control${errs.visitDate?" error":touched.visitDate&&!errs.visitDate&&form.visitDate?" success":""}`}
                  type="date"
                  value={form.visitDate}
                  min={todayStr()}
                  onChange={e => handleChange("visitDate", e.target.value)}
                  onBlur={() => handleBlur("visitDate")}
                />
                {errs.visitDate && <div className="form-error"><i className="bi bi-exclamation-circle" style={{fontSize:10}}/>{errs.visitDate}</div>}
                {touched.visitDate && !errs.visitDate && form.visitDate && (
                  <div className="form-valid"><i className="bi bi-check-circle" style={{fontSize:10}}/>Date confirmed</div>
                )}
              </div>

              {/* 6. Passcode */}
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">
                  Visit Passcode
                  <span style={{ marginLeft:6, fontSize:10, fontWeight:500, color:"var(--fg-4)", background:"#f3f4f6", padding:"1px 6px", borderRadius:10 }}>
                    Auto-generated · Optional
                  </span>
                </label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="4–8 character passcode"
                  value={form.passcode}
                  maxLength={8}
                  onChange={e => { handleChange("passcode", e.target.value.toUpperCase()); setTouched(t=>({...t,passcode:true})); }}
                  style={{ fontFamily:"var(--mono-font)", fontWeight:700, letterSpacing:2 }}
                />
                <div className="form-hint">
                  <i className="bi bi-shield-lock" style={{fontSize:10, color:"var(--accent)"}} />
                  Share this with your visitor — security verifies it at the gate.
                </div>
              </div>

            </div>

            {/* Live Preview */}
            {(form.name || form.phone || form.email || form.visitDate) && (
              <div style={{ marginTop:20, padding:"14px 16px", background:"var(--accent-lt)", border:"1px solid var(--accent-md)", borderRadius:"var(--r-md)" }}>
                <div style={{ fontSize:10, fontWeight:700, color:"var(--accent)", textTransform:"uppercase", letterSpacing:.6, marginBottom:10 }}>
                  Registration Preview
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    ["Visitor",  form.name     || "—"],
                    ["Phone",    form.phone     ? `+91 ${form.phone}` : "—"],
                    ["Email",    form.email     || "—"],
                    ["Purpose",  form.purpose  || "—"],
                    ["Date",     form.visitDate ? formatDate(form.visitDate) : "—"],
                    ["Passcode", form.passcode  || "Auto"],
                    ["Status",   "Pending"],
                  ].map(([l,v]) => (
                    <div key={l}>
                      <div style={{ fontSize:9.5, color:"var(--fg-3)", textTransform:"uppercase", letterSpacing:.4, fontWeight:600 }}>{l}</div>
                      <div style={{ fontSize:12.5, color:"var(--fg)", fontWeight:600, marginTop:1 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="form-footer">
              <button className="btn btn-secondary" onClick={handleReset} disabled={submitting}>
                <i className="bi bi-arrow-counterclockwise" />Reset
              </button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <><i className="bi bi-hourglass-split" style={{animation:"spin .7s linear infinite"}} />Registering...</>
                ) : (
                  <><i className="bi bi-check-circle-fill" />Register Visitor</>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ══ LIST ══ */}
        <div className="card" style={{ display:"flex", flexDirection:"column" }}>
          <div className="card-header">
            <span className="card-title">My Registrations</span>
            <span style={{ marginLeft:"auto", fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"var(--accent-lt)", color:"var(--accent)", border:"1px solid var(--accent-md)" }}>
              {myList.length} Total
            </span>
          </div>
          <div style={{ flex:1, overflowY:"auto", maxHeight:620 }}>
            {myList.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <div className="empty-title">No registrations yet</div>
                <div className="empty-sub">Fill the form to pre-register your first visitor.</div>
              </div>
            ) : myList.map(v => {
              const ini = v.name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase();
              const bgColors = { Pending:"var(--amber-lt)", Approved:"var(--green-lt)", "Checked In":"var(--blue-lt)", Completed:"#f9fafb", Cancelled:"var(--red-lt)", Rejected:"var(--red-lt)" };
              const fgColors = { Pending:"var(--amber-tx)", Approved:"var(--green-tx)", "Checked In":"var(--blue-tx)", Completed:"var(--fg-3)", Cancelled:"var(--red-tx)", Rejected:"var(--red-tx)" };
              return (
                <div key={v.id} style={{
                  padding:"13px 16px", borderBottom:"1px solid var(--bd)",
                  borderLeft:`3px solid ${({"Pending":"#d97706","Approved":"#16a34a","Checked In":"#2563eb","Completed":"#9ca3af","Cancelled":"#dc2626","Rejected":"#dc2626"})[v.status]||"#d1d5db"}`,
                  transition:"background var(--t1)",
                }}
                  onMouseEnter={e=>e.currentTarget.style.background="var(--accent-lt)"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{
                      width:38, height:38, borderRadius:"50%", flexShrink:0,
                      background: bgColors[v.status] || "#f3f4f6",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:13, fontWeight:700,
                      color: fgColors[v.status] || "var(--fg-3)",
                    }}>{ini}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13, color:"var(--fg)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v.name}</div>
                      <div style={{ fontSize:11, color:"var(--fg-3)", marginTop:3, display:"flex", gap:10, flexWrap:"wrap" }}>
                        <span><i className="bi bi-phone-fill" style={{marginRight:3,color:"var(--green)"}}/>+91 {v.phone}</span>
                        <span><i className="bi bi-calendar3" style={{marginRight:3,color:"var(--accent)"}}/>
                          {formatDate(v.visitDate)}</span>
                      </div>
                      <div style={{ marginTop:6, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                        <span style={{ fontSize:10.5, fontWeight:600, padding:"2px 7px", borderRadius:20, background:"var(--accent-lt)", color:"var(--accent)", border:"1px solid var(--accent-md)" }}>
                          {v.purpose}
                        </span>
                        {v.passcode && (
                          <span style={{ fontFamily:"var(--mono-font)", fontSize:10.5, color:"var(--accent)", fontWeight:700, display:"flex", alignItems:"center", gap:4 }}>
                            <i className="bi bi-shield-lock-fill" style={{fontSize:10}}/>
                            {v.passcode}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5, flexShrink:0 }}>
                      <StatusBadge status={v.status} />
                      <span style={{ fontFamily:"var(--mono-font)", fontSize:9, color:"var(--fg-4)" }}>{v.id}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
