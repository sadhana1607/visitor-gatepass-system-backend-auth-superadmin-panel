// src/pages/GlobalAdmin/LiveAlerts.jsx

import { useState, useEffect } from "react";
import {
  getAllAlerts,
  acknowledgeAlert,
  resolveAlert,
  escalateAlert,
} from "../../api/alertApi";

/* ─── Live ticker data ───────────────────────────────────────────── */
const LIVE_TICKER = [
  "🟢 Infosys: Sunita Verma checked in — 10:02 AM",
  "🔴 Wipro: Blacklist check triggered — 14:12 PM",
  "🟡 TCS: Visitor overstay warning raised — 13:15 PM",
  "🟢 HCL: Deepak Nair pre-registration confirmed",
  "🔴 Infosys: L3 escalation raised — ESC-001",
  "🟢 Raheja: 5 new visitor check-ins this hour",
];

/* ─── Design tokens ──────────────────────────────────────────────── */
const C = {
  bg:        "#0b0e1a",
  surface:   "#111827",
  card:      "#151d2e",
  border:    "rgba(255,255,255,0.07)",
  borderHov: "rgba(255,255,255,0.13)",
  text:      "#e8eaf0",
  muted:     "#8891a8",
  danger:    "#ff3d5a",
  warning:   "#ffaa00",
  info:      "#3b82f6",
  success:   "#00c878",
  accent:    "#0d6efd",
};

const TYPE_META = {
  danger:  { color: C.danger,  bg: "rgba(255,61,90,.08)",  border: "rgba(255,61,90,.22)",  label: "Critical" },
  warning: { color: C.warning, bg: "rgba(255,170,0,.07)",  border: "rgba(255,170,0,.2)",   label: "Warning"  },
  info:    { color: C.info,    bg: "rgba(59,130,246,.07)", border: "rgba(59,130,246,.2)",  label: "Info"     },
};

const STATUS_META = {
  OPEN:         { color: C.danger,  bg: "rgba(255,61,90,.15)"  },
  ACKNOWLEDGED: { color: C.warning, bg: "rgba(255,170,0,.15)"  },
  RESOLVED:     { color: C.success, bg: "rgba(0,200,120,.15)"  },
  ESCALATED:    { color: "#c084fc", bg: "rgba(192,132,252,.15)"},
};

/* ─── Tiny style-tag injected once ──────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Sora:wght@400;500;600;700&display=swap');

  .la-root *, .la-root *::before, .la-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .la-root {
    font-family: 'Sora', sans-serif;
    background: ${C.bg};
    color: ${C.text};
    min-height: 100vh;
    padding: 24px;
  }

  /* ── Ticker ── */
  .la-ticker {
    display: flex; align-items: center; gap: 14px;
    background: rgba(255,61,90,.06);
    border: 1px solid rgba(255,61,90,.18);
    border-radius: 10px;
    padding: 11px 18px;
    margin-bottom: 22px;
    overflow: hidden;
  }
  .la-ticker-dot {
    font-size: 10px; font-weight: 700; letter-spacing: 1.2px;
    color: ${C.danger}; background: rgba(255,61,90,.18);
    padding: 3px 9px; border-radius: 6px; flex-shrink: 0;
    animation: la-pulse 1.4s ease-in-out infinite;
  }
  .la-ticker-msg {
    font-size: 13px; color: ${C.text}; font-weight: 500;
    animation: la-fadein .4s ease;
  }
  @keyframes la-pulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes la-fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }

  /* ── Stat cards ── */
  .la-stats {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px;
  }
  .la-stat {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 12px;
    padding: 18px 20px;
    position: relative; overflow: hidden;
    transition: border-color .2s, transform .2s;
  }
  .la-stat:hover { border-color: ${C.borderHov}; transform: translateY(-2px); }
  .la-stat-glow {
    position: absolute; top: -30px; right: -20px;
    width: 90px; height: 90px; border-radius: 50%;
    opacity: .12; pointer-events: none;
  }
  .la-stat-label { font-size: 11px; color: ${C.muted}; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 8px; }
  .la-stat-value { font-size: 30px; font-weight: 700; line-height: 1; margin-bottom: 4px; font-family: 'IBM Plex Mono', monospace; }
  .la-stat-sub { font-size: 11px; color: ${C.muted}; }

  /* ── Grid layout ── */
  .la-grid { display: grid; grid-template-columns: 1.65fr 1fr; gap: 18px; align-items: start; }

  /* ── Filters ── */
  .la-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .la-select {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 8px;
    color: ${C.text};
    font-family: 'Sora', sans-serif;
    font-size: 12.5px;
    padding: 7px 12px;
    cursor: pointer;
    outline: none;
    transition: border-color .2s;
    appearance: none;
    -webkit-appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238891a8'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }
  .la-select:hover, .la-select:focus { border-color: ${C.borderHov}; }
  .la-select option { background: ${C.surface}; }

  /* ── Alert cards ── */
  .la-feed { display: flex; flex-direction: column; gap: 10px; }
  .la-alert {
    border-radius: 12px;
    border: 1px solid;
    padding: 14px 16px;
    display: flex; gap: 14px; align-items: flex-start;
    transition: transform .18s, box-shadow .18s;
    animation: la-slidein .25s ease;
  }
  .la-alert:hover { transform: translateX(3px); box-shadow: 0 4px 24px rgba(0,0,0,.35); }
  @keyframes la-slidein { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:none} }

  .la-alert-icon { font-size: 20px; flex-shrink: 0; margin-top: 2px; }

  .la-alert-body { flex: 1; min-width: 0; }
  .la-alert-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 5px; flex-wrap: wrap; }
  .la-alert-org  { font-size: 11.5px; font-weight: 600; }
  .la-alert-sep  { font-size: 10px; color: ${C.muted}; }
  .la-alert-type-badge {
    font-size: 10px; font-weight: 700; letter-spacing: .06em;
    padding: 2px 8px; border-radius: 20px;
    text-transform: uppercase;
  }
  .la-alert-title { font-size: 13.5px; font-weight: 600; color: ${C.text}; margin-bottom: 4px; }
  .la-alert-msg   { font-size: 12.5px; color: ${C.muted}; line-height: 1.55; margin-bottom: 6px; }
  .la-alert-foot  { display: flex; align-items: center; gap: 10px; }
  .la-alert-time  { font-size: 11px; color: ${C.muted}; font-family: 'IBM Plex Mono', monospace; }
  .la-alert-action-tag {
    font-size: 11px; color: ${C.muted};
    border: 1px solid ${C.border};
    border-radius: 5px; padding: 1px 8px;
  }

  /* ── Action buttons ── */
  .la-actions { display: flex; flex-direction: column; gap: 6px; align-items: flex-end; flex-shrink: 0; }
  .la-status-badge {
    font-size: 10.5px; font-weight: 600; letter-spacing: .05em;
    padding: 3px 10px; border-radius: 20px; text-transform: uppercase; white-space: nowrap;
  }
  .la-btn {
    font-family: 'Sora', sans-serif;
    font-size: 11.5px; font-weight: 600;
    padding: 5px 13px; border-radius: 7px;
    border: 1px solid; cursor: pointer;
    transition: opacity .15s, transform .15s;
    white-space: nowrap;
  }
  .la-btn:hover  { opacity: .82; }
  .la-btn:active { transform: scale(.96); }
  .la-btn-ack  { color: ${C.warning}; border-color: rgba(255,170,0,.35);  background: rgba(255,170,0,.08); }
  .la-btn-esc  { color: #c084fc;      border-color: rgba(192,132,252,.3); background: rgba(192,132,252,.08); }
  .la-btn-res  { color: ${C.success}; border-color: rgba(0,200,120,.35);  background: rgba(0,200,120,.08); }

  /* ── Empty state ── */
  .la-empty { text-align: center; padding: 48px 24px; color: ${C.muted}; font-size: 13px; }
  .la-empty-icon { font-size: 36px; margin-bottom: 10px; opacity: .4; }

  /* ── Right panel ── */
  .la-panel {
    background: ${C.card};
    border: 1px solid ${C.border};
    border-radius: 14px;
    overflow: hidden;
  }
  .la-panel-head {
    padding: 14px 18px;
    border-bottom: 1px solid ${C.border};
    font-size: 13px; font-weight: 600; color: ${C.text};
    display: flex; align-items: center; gap: 8px;
  }
  .la-panel-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 12px; }

  .la-org-row { display: flex; flex-direction: column; gap: 6px; }
  .la-org-label { display: flex; align-items: center; justify-content: space-between; }
  .la-org-name  { font-size: 12.5px; font-weight: 500; color: ${C.text}; }
  .la-org-count { font-size: 11px; color: ${C.muted}; font-family: 'IBM Plex Mono', monospace; }
  .la-org-bar-track {
    height: 4px; background: rgba(255,255,255,.06);
    border-radius: 4px; overflow: hidden;
  }
  .la-org-bar-fill {
    height: 100%; border-radius: 4px;
    transition: width .4s ease;
  }

  .la-divider { height: 1px; background: ${C.border}; margin: 4px 0; }

  .la-type-row { display: flex; align-items: center; justify-content: space-between; }
  .la-type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .la-type-label { font-size: 12px; color: ${C.muted}; flex: 1; margin-left: 8px; }
  .la-type-count { font-size: 13px; font-weight: 600; font-family: 'IBM Plex Mono', monospace; }

  /* ── Section label ── */
  .la-section-label {
    font-size: 10.5px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: ${C.muted};
    margin-bottom: 10px;
  }

  @media (max-width: 900px) {
    .la-grid  { grid-template-columns: 1fr; }
    .la-stats { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 540px) {
    .la-stats { grid-template-columns: 1fr 1fr; }
    .la-root  { padding: 14px; }
  }
`;

/* ─── Inject CSS once ────────────────────────────────────────────── */
function useGlobalStyle(css) {
  useEffect(() => {
    const id = "la-global-style";
    if (document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);
}

/* ─── Component ──────────────────────────────────────────────────── */
export default function LiveAlerts({ addToast }) {
  useGlobalStyle(GLOBAL_CSS);

  const [alerts, setAlerts]           = useState([]);
  const [orgFilter, setOrgFilter]     = useState("all");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticker, setTicker]           = useState(0);
  const [loading, setLoading]         = useState(false);

  /* ── Fetch ── */
  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (orgFilter   !== "all") params.org    = orgFilter;
      if (typeFilter  !== "all") params.type   = typeFilter;
      if (statusFilter !== "all") params.status = statusFilter;

      const res  = await getAllAlerts(params);
      const data = res.data?.data || res.data?.content || res.data?.alerts || res.data;
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAlerts([]);
      addToast?.("Failed to load alerts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [orgFilter, typeFilter, statusFilter]);

  /* ── Ticker ── */
  useEffect(() => {
    const t = setInterval(() => setTicker(n => (n + 1) % LIVE_TICKER.length), 3200);
    return () => clearInterval(t);
  }, []);

  /* ── Derived data ── */
  const orgs         = [...new Set(alerts.map(a => a.org))];
  const maxOrgCount  = Math.max(...orgs.map(o => alerts.filter(a => a.org === o).length), 1);
  const openCount    = alerts.filter(a => a.status === "OPEN").length;
  const ackCount     = alerts.filter(a => a.status === "ACKNOWLEDGED").length;
  const resolvedCount= alerts.filter(a => a.status === "RESOLVED").length;
  const critCount    = alerts.filter(a => a.type?.toLowerCase() === "danger").length;

  /* ── Actions ── */
  const doAck = async (id) => {
    try { await acknowledgeAlert(id); addToast?.("Alert acknowledged", "info"); fetchAlerts(); }
    catch { addToast?.("Action failed", "error"); }
  };
  const doResolve = async (id) => {
    try { await resolveAlert(id); addToast?.("Alert resolved & logged", "success"); fetchAlerts(); }
    catch { addToast?.("Action failed", "error"); }
  };
  const doEsc = async (id) => {
    try { await escalateAlert(id); addToast?.("Escalated to org admin", "warning"); fetchAlerts(); }
    catch { addToast?.("Action failed", "error"); }
  };

  /* ── Render ── */
  return (
    <div className="la-root">

      {/* Ticker */}
      <div className="la-ticker">
        <span className="la-ticker-dot">● LIVE</span>
        <span key={ticker} className="la-ticker-msg">{LIVE_TICKER[ticker]}</span>
      </div>

      {/* Stat strip */}
      <div className="la-stats">
        {[
          { label: "Total alerts today", value: alerts.length,  color: C.accent,  sub: "all statuses" },
          { label: "Open / critical",    value: openCount,       color: C.danger,  sub: `${critCount} critical` },
          { label: "Acknowledged",       value: ackCount,        color: C.warning, sub: "awaiting action" },
          { label: "Resolved today",     value: resolvedCount,   color: C.success, sub: "closed out" },
        ].map(s => (
          <div key={s.label} className="la-stat">
            <div className="la-stat-glow" style={{ background: s.color }} />
            <div className="la-stat-label">{s.label}</div>
            <div className="la-stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="la-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="la-grid">

        {/* ── Left: Alert feed ── */}
        <div>
          {/* Filters */}
          <div className="la-filters">
            <select className="la-select" value={orgFilter} onChange={e => setOrgFilter(e.target.value)}>
              <option value="all">All organizations</option>
              {orgs.map(o => <option key={o} value={o}>{o}</option>)}
            </select>

            <select className="la-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All types</option>
              <option value="DANGER">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>

            <select className="la-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All statuses</option>
              <option value="OPEN">Open</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          {/* Feed */}
          <div className="la-feed">
            {loading ? (
              <div className="la-empty">
                <div className="la-empty-icon">⏳</div>
                Loading alerts…
              </div>
            ) : alerts.length === 0 ? (
              <div className="la-empty">
                <div className="la-empty-icon">🔕</div>
                No alerts match your filters
              </div>
            ) : alerts.map(a => {
              const type   = a.type?.toLowerCase() || "info";
              const tm     = TYPE_META[type]   || TYPE_META.info;
              const sm     = STATUS_META[a.status] || STATUS_META.OPEN;

              return (
                <div
                  key={a.id}
                  className="la-alert"
                  style={{ background: tm.bg, borderColor: tm.border }}
                >
                  <div className="la-alert-icon">{a.icon}</div>

                  <div className="la-alert-body">
                    <div className="la-alert-meta">
                      <span className="la-alert-org" style={{ color: a.orgColor || tm.color }}>
                        {a.org}
                      </span>
                      <span className="la-alert-sep">·</span>
                      <span
                        className="la-alert-type-badge"
                        style={{ color: tm.color, background: `${tm.color}1a`, border: `1px solid ${tm.color}33` }}
                      >
                        {tm.label}
                      </span>
                    </div>
                    <div className="la-alert-title">{a.title}</div>
                    <div className="la-alert-msg">{a.msg}</div>
                    <div className="la-alert-foot">
                      <span className="la-alert-time">{a.time}</span>
                      {a.action && <span className="la-alert-action-tag">{a.action}</span>}
                      <span style={{ fontSize: 10.5, color: C.muted, fontFamily: "'IBM Plex Mono',monospace" }}>
                        {a.id}
                      </span>
                    </div>
                  </div>

                  <div className="la-actions">
                    <span
                      className="la-status-badge"
                      style={{ color: sm.color, background: sm.bg }}
                    >
                      {a.status}
                    </span>

                    {a.status === "OPEN" && (
                      <>
                        <button className="la-btn la-btn-ack" onClick={() => doAck(a.id)}>Acknowledge</button>
                        <button className="la-btn la-btn-esc" onClick={() => doEsc(a.id)}>Escalate</button>
                      </>
                    )}
                    {a.status === "ACKNOWLEDGED" && (
                      <button className="la-btn la-btn-res" onClick={() => doResolve(a.id)}>Resolve</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: Analytics panel ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* By org */}
          <div className="la-panel">
            <div className="la-panel-head">
              <span>📊</span> Alerts by organization
            </div>
            <div className="la-panel-body">
              {orgs.length === 0 ? (
                <span style={{ fontSize: 12, color: C.muted }}>No data</span>
              ) : orgs.map(org => {
                const orgAlerts = alerts.filter(a => a.org === org);
                const orgColor  = orgAlerts[0]?.orgColor || C.accent;
                const pct       = Math.round((orgAlerts.length / maxOrgCount) * 100);
                return (
                  <div key={org} className="la-org-row">
                    <div className="la-org-label">
                      <span className="la-org-name" style={{ color: orgColor }}>{org}</span>
                      <span className="la-org-count">{orgAlerts.length}</span>
                    </div>
                    <div className="la-org-bar-track">
                      <div
                        className="la-org-bar-fill"
                        style={{ width: `${pct}%`, background: orgColor }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By type */}
          <div className="la-panel">
            <div className="la-panel-head">
              <span>🔍</span> Breakdown by type
            </div>
            <div className="la-panel-body">
              {[
                { key: "danger",  label: "Critical" },
                { key: "warning", label: "Warning"  },
                { key: "info",    label: "Info"      },
              ].map(({ key, label }) => {
                const count = alerts.filter(a => a.type?.toLowerCase() === key).length;
                const tm    = TYPE_META[key];
                return (
                  <div key={key} className="la-type-row">
                    <div className="la-type-dot" style={{ background: tm.color }} />
                    <span className="la-type-label">{label}</span>
                    <span className="la-type-count" style={{ color: tm.color }}>{count}</span>
                  </div>
                );
              })}

              <div className="la-divider" />

              {/* By status */}
              {[
                { key: "OPEN",         label: "Open"         },
                { key: "ACKNOWLEDGED", label: "Acknowledged" },
                { key: "ESCALATED",    label: "Escalated"    },
                { key: "RESOLVED",     label: "Resolved"     },
              ].map(({ key, label }) => {
                const count = alerts.filter(a => a.status === key).length;
                const sm    = STATUS_META[key];
                return (
                  <div key={key} className="la-type-row">
                    <div className="la-type-dot" style={{ background: sm.color }} />
                    <span className="la-type-label">{label}</span>
                    <span className="la-type-count" style={{ color: sm.color }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}