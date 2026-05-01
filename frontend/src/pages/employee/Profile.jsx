import { useState } from "react";
import { ORGANIZATION, formatDate } from "../constants/data";

function DetailRow({ label, value, mono = false, highlight = false }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value" style={{
        fontFamily: mono ? "var(--mono-font)" : undefined,
        color: highlight ? "var(--accent)" : undefined,
        fontWeight: highlight ? 700 : undefined,
      }}>
        {value || "—"}
      </span>
    </div>
  );
}

function SectionCard({ title, icon, iconBg, iconColor, children }) {
  return (
    <div className="card mb-16">
      <div className="card-header">
        <div className="card-icon" style={{ background: iconBg, color: iconColor }}>
          <i className={`bi ${icon}`} />
        </div>
        <span className="card-title">{title}</span>
        <span style={{
          marginLeft:"auto", fontSize:9.5, fontWeight:700, padding:"2px 8px", borderRadius:20,
          background:"var(--accent-lt)", color:"var(--accent)", border:"1px solid var(--accent-md)",
          textTransform:"uppercase", letterSpacing:.5,
        }}>
          Read Only
        </span>
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function Profile({ employee }) {
  const [activeTab, setActiveTab] = useState("employee");

  return (
    <div className="page-enter">

      {/* Header card */}
      <div style={{
        background:"linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)",
        borderRadius:"var(--r-lg)", padding:"24px 28px", marginBottom:22,
        display:"flex", alignItems:"center", gap:20,
        boxShadow:"0 4px 16px rgba(26,86,219,.25)",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,.06)" }} />
        <div style={{ position:"absolute", right:120, bottom:-40, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,.04)" }} />
        {/* Avatar */}
        <div style={{
          width:80, height:80, borderRadius:"50%", flexShrink:0,
          background:"rgba(255,255,255,.2)", backdropFilter:"blur(4px)",
          border:"2px solid rgba(255,255,255,.4)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:28, fontWeight:800, color:"#fff",
          boxShadow:"0 4px 16px rgba(0,0,0,.2)",
        }}>
          {employee.initials}
        </div>
        <div style={{ flex:1, position:"relative" }}>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:4, letterSpacing:"-.4px" }}>{employee.name}</div>
          <div style={{ fontSize:14, color:"rgba(255,255,255,.8)", marginBottom:8 }}>{employee.designation} · {employee.department}</div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {[
              { icon:"bi-building", val: ORGANIZATION.shortName },
              { icon:"bi-geo-alt-fill", val: employee.location },
              { icon:"bi-calendar-check-fill", val: `Joined ${employee.joinDate}` },
            ].map((item,i) => (
              <span key={i} style={{ fontSize:12, color:"rgba(255,255,255,.75)", display:"flex", alignItems:"center", gap:5 }}>
                <i className={`bi ${item.icon}`} style={{ fontSize:12 }} />{item.val}
              </span>
            ))}
          </div>
        </div>
        <div style={{ position:"relative", textAlign:"center", padding:"14px 22px", background:"rgba(255,255,255,.12)", borderRadius:"var(--r-lg)", border:"1px solid rgba(255,255,255,.2)" }}>
          <div style={{ fontFamily:"var(--mono-font)", fontSize:18, fontWeight:800, color:"#fff", letterSpacing:1 }}>{employee.id}</div>
          <div style={{ fontSize:10.5, color:"rgba(255,255,255,.65)", marginTop:3, textTransform:"uppercase", letterSpacing:.5 }}>Employee ID</div>
          <div style={{ marginTop:8, display:"flex", alignItems:"center", justifyContent:"center", gap:5 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ade80" }} />
            <span style={{ fontSize:11, color:"rgba(255,255,255,.8)", fontWeight:600 }}>{employee.status}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom:18, width:"fit-content" }}>
        <button className={`tab-item${activeTab==="employee"?" active":""}`} onClick={()=>setActiveTab("employee")}>
          <i className="bi bi-person-fill" style={{marginRight:5}}/>My Profile
        </button>
        <button className={`tab-item${activeTab==="org"?" active":""}`} onClick={()=>setActiveTab("org")}>
          <i className="bi bi-building-fill" style={{marginRight:5}}/>Organization
        </button>

      </div>

      {/* ══ EMPLOYEE TAB ══ */}
      {activeTab === "employee" && (
        <div className="grid-2">
          <div>
            <SectionCard title="Personal Information" icon="bi-person-vcard-fill" iconBg="var(--accent-lt)" iconColor="var(--accent)">
              <DetailRow label="Full Name"       value={employee.name} />
              <DetailRow label="Employee ID"     value={employee.id}          mono highlight />
              <DetailRow label="Designation"     value={employee.designation} />
              <DetailRow label="Department"      value={employee.department}  />
              <DetailRow label="Employee Type"   value={employee.employeeType}/>
              <DetailRow label="Status"          value={employee.status}      />
            </SectionCard>
          </div>
          <div>
            <SectionCard title="Contact & Assignment" icon="bi-envelope-fill" iconBg="var(--green-lt)" iconColor="var(--green)">
              <DetailRow label="Work Email"    value={employee.email}       />
              <DetailRow label="Mobile"        value={employee.mobile}      mono />
              <DetailRow label="Work Location" value={employee.location}    />
              <DetailRow label="Reporting To"  value={employee.reportingTo} />
              <DetailRow label="Join Date"     value={employee.joinDate}    />
            </SectionCard>

            <div className="info-banner info-blue">
              <i className="bi bi-info-circle-fill info-icon" />
              <div style={{ fontSize:12 }}>
                <strong>Read-only record.</strong> To update your profile information, submit a request through the HR portal or contact your HR Manager.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ORGANIZATION TAB ══ */}
      {activeTab === "org" && (
        <div className="grid-2">
          <div>
            <SectionCard title="Company Details" icon="bi-building-fill" iconBg="var(--teal-lt)" iconColor="var(--teal)">
              <DetailRow label="Company Name"    value={ORGANIZATION.name}        />
              <DetailRow label="Industry"        value={ORGANIZATION.type}        />
              <DetailRow label="Headquarters"    value={ORGANIZATION.hq}          />
              <DetailRow label="Website"         value={ORGANIZATION.website}     />
            </SectionCard>
          </div>
          <div>
            <SectionCard title="Security & Contact" icon="bi-shield-fill" iconBg="var(--red-lt)" iconColor="var(--red)">
              <DetailRow label="Phone"          value={ORGANIZATION.phone}        />
              <DetailRow label="Security Email" value={ORGANIZATION.email}        />
              <DetailRow label="Security Head"  value={ORGANIZATION.securityHead} />
              <DetailRow label="Working Hours"  value={ORGANIZATION.workingHours} />
            </SectionCard>

          </div>
        </div>
      )}





    </div>
  );
}
