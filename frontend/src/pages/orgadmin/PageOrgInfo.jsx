// pages/PageOrgInfo.jsx — View & Edit Organization Information
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PageOrgInfo({ addToast }) {
  const { user } = useAuth();
  const org = user?.org;

  return (
    <div className="page">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>

        {/* ── Left: Org Details ── */}
        <div>
          {/* Org Card */}
          <div className="cv-card" style={{marginBottom:16}}>
            <div className="card-head">
              <div className="c-icon" style={{background:org?.color+"15",color:org?.color,fontSize:17}}>{org?.icon}</div>
              <span className="card-head-title">Organization Details</span>
              <span style={{marginLeft:"auto",fontSize:11,color:"var(--text-tertiary)",padding:"3px 10px",borderRadius:"var(--radius-full)",background:"var(--surface-2)",border:"1px solid var(--border-default)",fontWeight:600}}>
                Read Only
              </span>
            </div>
            <div className="card-body">
              {/* Org Banner */}
              <div style={{background:`linear-gradient(135deg,${org?.color}18,${org?.color}08)`,border:`1px solid ${org?.color}22`,borderRadius:"var(--radius-md)",padding:"18px 20px",marginBottom:20,display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:56,height:56,borderRadius:"var(--radius-md)",background:org?.color+"18",border:`1px solid ${org?.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                  {org?.icon}
                </div>
                <div>
                  <div style={{fontSize:18,fontWeight:800,color:"var(--text-primary)",letterSpacing:"-.3px"}}>{org?.name}</div>
                  <div style={{fontSize:12.5,color:"var(--text-secondary)",marginTop:2}}>{org?.type==="apartment"?"Residential Apartment":"Corporate Company"} · {org?.city}</div>
                  <span className="cv-badge b-active" style={{marginTop:6,display:"inline-flex"}}>● Active</span>
                </div>
              </div>

              {/* Always read-only */}
              <div>
                  {[
                    {l:"Organization Name", v:org?.name,    ico:"bi-building",           c:"#6366f1"},
                    {l:"Type",              v:org?.type==="apartment"?"Residential Apartment":"Corporate Company",ico:"bi-building-check",c:"#0ea5e9"},
                    {l:"City",              v:org?.city,    ico:"bi-geo-alt-fill",        c:"#10b981"},
                    {l:"Security Email",    v:org?.email,   ico:"bi-envelope-fill",       c:"#6366f1"},
                    {l:"Website",           v:org?.website, ico:"bi-globe2",              c:"#0ea5e9"},
                    {l:"Full Address",      v:org?.address, ico:"bi-pin-map-fill",        c:"#f59e0b"},
                  ].map(({l,v,ico,c})=>(
                    <div key={l} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 0",borderBottom:"1px solid var(--border-subtle)"}}>
                      <div style={{width:32,height:32,borderRadius:"var(--radius-sm)",background:c+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                        <i className={`bi ${ico}`} style={{color:c,fontSize:13}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10.5,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:.5,marginBottom:2}}>{l}</div>
                        <div style={{fontSize:13.5,color:"var(--text-primary)",fontWeight:600}}>{v||"—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>

        {/* ── Right: Stats + Admin Info ── */}
        <div>
          {/* Quick stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[
              {label:"Total Employees", value:org?.employees||0,        color:"#6366f1",icon:"bi-people-fill"      },
              {label:"Registered On",   value:org?.registeredOn||"—",   color:"#10b981",icon:"bi-calendar-check-fill"},
            ].map(s=>(
              <div key={s.label} className="stat-card" style={{padding:"16px 18px"}}>
                <div className="stat-glow" style={{background:s.color}}/>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{color:s.color,fontSize:typeof s.value==="number"?28:18}}>{s.value}</div>
                <i className={`bi ${s.icon} stat-icon`}/>
              </div>
            ))}
          </div>

          {/* Admin Profile */}
          <div className="cv-card" style={{marginBottom:16}}>
            <div className="card-head">
              <div className="c-icon" style={{background:"rgba(99,102,241,.1)",color:"#6366f1"}}><i className="bi bi-person-circle"/></div>
              <span className="card-head-title">Admin Profile</span>
            </div>
            <div className="card-body">
              <div style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",background:"var(--surface-2)",borderRadius:"var(--radius-md)",border:"1px solid var(--border-default)",marginBottom:16}}>
                <div style={{width:52,height:52,borderRadius:"50%",background:"var(--brand)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,fontWeight:800,color:"#fff",flexShrink:0}}>
                  {user?.initials}
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"var(--text-primary)"}}>{user?.name}</div>
                  <span className="role-pill rp-orgadmin" style={{marginTop:4,display:"inline-block"}}>Org Admin</span>
                </div>
              </div>
              {[
                {l:"Email", v:user?.email, ico:"bi-envelope-fill", c:"#6366f1"},
                {l:"Phone", v:user?.phone, ico:"bi-telephone-fill", c:"#10b981"},
              ].map(({l,v,ico,c})=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid var(--border-subtle)"}}>
                  <div style={{width:30,height:30,borderRadius:"var(--radius-sm)",background:c+"12",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <i className={`bi ${ico}`} style={{color:c,fontSize:13}}/>
                  </div>
                  <div><div style={{fontSize:10.5,fontWeight:600,color:"var(--text-tertiary)",textTransform:"uppercase",letterSpacing:.5}}>{l}</div>
                    <div style={{fontSize:13,color:"var(--text-primary)",fontWeight:600,marginTop:1}}>{v||"—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access note */}
          <div style={{padding:"14px 18px",background:"rgba(2,132,199,.06)",border:"1px solid rgba(2,132,199,.15)",borderRadius:"var(--radius-lg)",display:"flex",gap:12,alignItems:"flex-start"}}>
            <i className="bi bi-shield-lock-fill" style={{color:"#0284c7",fontSize:18,flexShrink:0,marginTop:1}}/>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"var(--text-primary)",marginBottom:3}}>Access Scope</div>
              <div style={{fontSize:12.5,color:"var(--text-secondary)",lineHeight:1.6}}>
                You are authorized to manage <strong>{org?.name}</strong> only. Organization creation, deletion, and cross-org access is managed exclusively by the Global Admin.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
