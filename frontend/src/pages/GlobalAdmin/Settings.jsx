// ════════════════════════════════════════════════
// src/pages/GlobalAdmin/Settings.jsx
// ════════════════════════════════════════════════

import { useState } from "react";

export default function Settings({ addToast }) {
  const [profile, setProfile] = useState({ name:"Global Administrator", email:"globaladmin@corpvms.com" });
  const [editProfile, setEditProfile] = useState(false);
  const [tmpProfile, setTmpProfile]   = useState({...profile});

  const saveProfile = () => {
    setProfile({...tmpProfile});
    setEditProfile(false);
    addToast("✅ Profile updated successfully!","success");
  };

  return (
    <div className="page">
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16,maxWidth:700}}>

        {/* ── LEFT — Admin Profile ── */}
        <div>
          <div className="cv-card">
            <div className="card-head">
              <div className="c-icon" style={{background:"rgba(139,92,246,.15)",color:"#a78bfa"}}>
                <i className="bi bi-person-circle"/>
              </div>
              <span className="card-head-title">Admin Profile</span>
              {!editProfile && (
                <button className="cv-btn btn-ghost sm" style={{marginLeft:"auto"}} onClick={()=>{setTmpProfile({...profile});setEditProfile(true);}}>
                  <i className="bi bi-pencil-fill"/> Edit
                </button>
              )}
            </div>
            <div className="card-body">
              {/* Avatar */}
              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#8b5cf6,#0d6efd)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#fff",flexShrink:0}}>
                  GA
                </div>
                <div>
                  <div style={{fontSize:16,fontWeight:900,color:"var(--text)"}}>{profile.name}</div>
                  <span className="role-pill rp-global">Global Admin</span>
                </div>
              </div>

              {editProfile ? (
                <div style={{display:"flex",flexDirection:"column",gap:12}}>
                  <div>
                    <label className="f-label">Full Name</label>
                    <input className="f-control" value={tmpProfile.name} onChange={e=>setTmpProfile(p=>({...p,name:e.target.value}))}/>
                  </div>
                  <div>
                    <label className="f-label">Email Address</label>
                    <input className="f-control" type="email" value={tmpProfile.email} onChange={e=>setTmpProfile(p=>({...p,email:e.target.value}))}/>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:4}}>
                    <button className="cv-btn btn-primary sm" onClick={saveProfile}><i className="bi bi-check-circle-fill"/>Save</button>
                    <button className="cv-btn btn-ghost sm" onClick={()=>setEditProfile(false)}><i className="bi bi-x"/>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  {[["Email",profile.email,"bi-envelope-fill","#0d6efd"],["Role","Global Administrator","bi-shield-fill","#8b5cf6"]].map(([l,v,ico,c])=>(
                    <div key={l} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:"1px solid var(--border)"}}>
                      <div style={{width:30,height:30,borderRadius:".45rem",background:c+"15",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <i className={`bi ${ico}`} style={{color:c,fontSize:13}}/>
                      </div>
                      <div>
                        <div style={{fontSize:10,fontWeight:800,color:"var(--muted)",textTransform:"uppercase",letterSpacing:.6}}>{l}</div>
                        <div style={{fontSize:12.5,color:"var(--text)",fontWeight:600,marginTop:1}}>{v}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
