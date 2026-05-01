import { STATUS_CONFIG } from "../../constants/data";

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Pending"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 9px", borderRadius: 20,
      fontSize: 10.5, fontWeight: 600, whiteSpace: "nowrap",
      background: cfg.bg, color: cfg.color,
      border: `1px solid ${cfg.border}`,
    }}>
      <span style={{ width:5,height:5,borderRadius:"50%",background:cfg.dot,flexShrink:0 }}/>
      {status}
    </span>
  );
}
