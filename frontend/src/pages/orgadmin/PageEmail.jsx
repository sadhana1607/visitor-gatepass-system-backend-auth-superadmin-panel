import { useState, useEffect } from "react";
import { sendEmailApi, getInboxEmailsApi, getSentEmailsApi } from "../../api/emailService";
import { getUsersByRole } from "../../api/userApi";

const TEMPLATES = [
  { key: "welcome",     label: "Welcome New Org Admin",    preview: "Dear [Name], Welcome to CorpVMS..." },
  { key: "maintenance", label: "Maintenance Notification", preview: "Dear Admin, CorpVMS will undergo..." },
  { key: "alert",       label: "Security Alert Notice",    preview: "URGENT: Security incident in [Org]..." },
  { key: "report",      label: "Monthly Report Request",   preview: "Please submit report..." },
];

export default function EmailCenter({ addToast }) {
  const [tab, setTab]         = useState("inbox");
  const [selected, setSelected] = useState(null);
  const [inbox, setInbox]     = useState([]);
  const [sent, setSent]       = useState([]);
  const [loading, setLoading] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [orgAdmins, setOrgAdmins] = useState([]);

  const unread = inbox.filter(m => !m.read).length;

  // ================= LOAD INBOX =================
  const loadInbox = async () => {
    setLoading(true);
    try {
      const res = await getInboxEmailsApi();
      setInbox(res.data || []);         // ✅ only received emails from backend
    } catch (err) {
      addToast("Failed to load inbox", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD SENT =================
  const loadSent = async () => {
    setLoading(true);
    try {
      const res = await getSentEmailsApi();
      setSent(res.data || []);          // ✅ only sent emails from backend
    } catch (err) {
      addToast("Failed to load sent emails", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD USERS =================
  const loadUsers = async () => {
    try {
      const res = await getUsersByRole("EMPLOYEE");
      const admins = (res.data || []).map(u =>
        `${u.email} — ${u.name} (${u.orgName || "No Org"})`
      );
      setOrgAdmins(["All Employees", ...admins]);
    } catch (err) {
      addToast("Failed to load org admins", "danger");
    }
  };

  useEffect(() => {
    loadInbox();
    loadSent();
    loadUsers();
  }, []);

  // ================= TAB SWITCH — lazy reload =================
  const switchTab = (key) => {
    setTab(key);
    setSelected(null);
    if (key === "inbox") loadInbox();
    if (key === "sent")  loadSent();
  };

  // ================= OPEN MAIL =================
  const openMail = (m) => {
    setSelected(m);
    // mark as read locally
    setInbox(prev => prev.map(x => x.id === m.id ? { ...x, read: true } : x));
  };

  // ================= SEND EMAIL =================
  const sendEmail = async () => {
    if (!compose.to || !compose.subject || !compose.body) {
      addToast("Please fill all fields", "danger");
      return;
    }
    try {
      const payload = {
        toEmail: compose.to === "All Org Admins"
          ? "all"
          : compose.to.split("—")[0].trim(),
        subject: compose.subject,
        message: compose.body,
      };

      await sendEmailApi(payload);
      addToast("📧 Email sent successfully!", "success");

      // ✅ Optimistically add to sent list
      setSent(prev => [{
        id: Date.now(),
        fromEmail: "me",
        toEmail: payload.toEmail,
        subject: payload.subject,
        message: payload.message,
        folder: "sent",
        read: true,
        sentAt: new Date().toISOString(),
      }, ...prev]);

      setCompose({ to: "", subject: "", body: "" });
      setTab("sent");
      loadSent();   // ✅ refresh sent from server

    } catch (error) {
      addToast("❌ Failed to send email", "danger");
    }
  };

  // ================= TEMPLATE =================
  const useTemplate = (tpl) => {
    setCompose(c => ({ ...c, subject: tpl.label, body: tpl.preview }));
    setTab("compose");
    addToast("Template loaded", "info");
  };

  // ================= EMAIL LIST =================
  const EmailList = ({ emails, emptyMessage, showTo = false }) => (
    <div>
      {loading && (
        <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>
          Loading...
        </div>
      )}
      {!loading && emails.length === 0 && (
        <div style={{ padding: 24, textAlign: "center", color: "var(--muted)" }}>
          {emptyMessage}
        </div>
      )}
      {!loading && emails.map(m => (
        <div
          key={m.id}
          onClick={() => openMail(m)}
          style={{
            display: "flex", gap: 12,
            padding: "13px 18px",
            borderBottom: "1px solid var(--border)",
            cursor: "pointer",
            background: selected?.id === m.id
              ? "rgba(13,110,253,.07)"
              : m.read ? "transparent" : "rgba(13,110,253,.03)"
          }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(13,110,253,.15)",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 800, flexShrink: 0
          }}>
            {showTo
              ? (m.toEmail?.split("@")[0]?.[0]?.toUpperCase() ?? "?")
              : (m.fromEmail?.split("@")[0]?.[0]?.toUpperCase() ?? "?")}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>
              {showTo ? `To: ${m.toEmail}` : `From: ${m.fromEmail}`}
            </div>
            <div style={{
              fontSize: 12, color: "var(--muted)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
            }}>
              {m.subject}
            </div>
          </div>
          {!m.read && !showTo && (
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "var(--primary)",
              alignSelf: "center", flexShrink: 0
            }} />
          )}
        </div>
      ))}
    </div>
  );

  // ================= MAIL DETAIL =================
  const MailDetail = () => (
    <div className="cv-card">
      <div className="card-head">
        <span style={{ fontWeight: 700 }}>{selected.subject}</span>
        <button className="cv-btn btn-ghost" onClick={() => setSelected(null)}>✕</button>
      </div>
      <div style={{
        padding: "12px 18px", fontSize: 12,
        color: "var(--muted)", borderBottom: "1px solid var(--border)"
      }}>
        {tab === "sent"
          ? `To: ${selected.toEmail}`
          : `From: ${selected.fromEmail}`}
        {selected.sentAt && (
          <span style={{ marginLeft: 12 }}>
            {new Date(selected.sentAt).toLocaleString()}
          </span>
        )}
      </div>
      <div className="card-body">
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: 0 }}>
          {selected.message || selected.body || "(No content)"}
        </pre>
      </div>
    </div>
  );

  // ================= RENDER =================
  return (
    <div className="page">

      {/* TAB HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,.04)", borderRadius: ".55rem", padding: 3 }}>
          {[
            { key: "inbox",     label: "📥 Inbox",     badge: unread },
            { key: "compose",   label: "✉️ Compose",   badge: 0 },
            { key: "sent",      label: "📤 Sent",      badge: 0 },
            { key: "templates", label: "📋 Templates", badge: 0 },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => switchTab(t.key)}
              style={{
                padding: "6px 14px", borderRadius: ".4rem",
                border: "none", cursor: "pointer",
                fontFamily: "Nunito,sans-serif", fontSize: 12.5, fontWeight: 700,
                display: "flex", alignItems: "center", gap: 6,
                background: tab === t.key ? "var(--surface2)" : "none",
                color: tab === t.key ? "var(--text)" : "var(--muted)"
              }}
            >
              {t.label}
              {t.badge > 0 && (
                <span style={{
                  background: "var(--primary)", color: "#fff",
                  fontSize: 9, fontWeight: 800,
                  padding: "1px 6px", borderRadius: 8
                }}>
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted)" }}>
          📧 {unread} unread · 📤 {sent.length} sent
        </div>
      </div>

      {/* INBOX */}
      {tab === "inbox" && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.3fr" : "1fr", gap: 16 }}>
          <div className="cv-card">
            <div className="card-head">
              <span className="card-head-title">📥 Inbox</span>
              <button className="cv-btn btn-ghost" onClick={loadInbox}>↻ Refresh</button>
            </div>
            <EmailList emails={inbox} emptyMessage="No messages in inbox" showTo={false} />
          </div>
          {selected && <MailDetail />}
        </div>
      )}

      {/* COMPOSE */}
      {tab === "compose" && (
        <div className="cv-card" style={{ maxWidth: 700 }}>
          <div className="card-head">
            <span className="card-head-title">✉️ Compose Email</span>
          </div>
          <div className="card-body">
            <select
              className="f-control"
              value={compose.to}
              onChange={e => setCompose({ ...compose, to: e.target.value })}
            >
              <option value="">Select Recipient</option>
              {orgAdmins.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <input
              className="f-control"
              placeholder="Subject"
              value={compose.subject}
              onChange={e => setCompose({ ...compose, subject: e.target.value })}
            />
            <textarea
              className="f-control"
              rows={6}
              placeholder="Message"
              value={compose.body}
              onChange={e => setCompose({ ...compose, body: e.target.value })}
            />
            <button className="cv-btn btn-primary" onClick={sendEmail}>
              Send Email
            </button>
          </div>
        </div>
      )}

      {/* SENT */}
      {tab === "sent" && (
        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1.3fr" : "1fr", gap: 16 }}>
          <div className="cv-card">
            <div className="card-head">
              <span className="card-head-title">📤 Sent Emails</span>
              <button className="cv-btn btn-ghost" onClick={loadSent}>↻ Refresh</button>
            </div>
            <EmailList emails={sent} emptyMessage="No sent emails yet" showTo={true} />
          </div>
          {selected && <MailDetail />}
        </div>
      )}

      {/* TEMPLATES */}
      {tab === "templates" && (
        <div className="cv-card" style={{ maxWidth: 700 }}>
          <div className="card-head">
            <span className="card-head-title">📋 Email Templates</span>
          </div>
          <div>
            {TEMPLATES.map(tpl => (
              <div key={tpl.key} style={{
                padding: "14px 18px",
                borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{tpl.label}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{tpl.preview}</div>
                </div>
                <button className="cv-btn btn-ghost" onClick={() => useTemplate(tpl)}>Use</button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}