export default function Modal({ title, body, onConfirm, onClose, confirmLabel = "Confirm", confirmClass = "btn btn-danger" }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button onClick={onClose} style={{ background:"none",border:"none",cursor:"pointer",fontSize:18,color:"var(--fg-3)",lineHeight:1 }}>
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="modal-body">{body}</div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className={confirmClass} onClick={() => { onConfirm?.(); onClose(); }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
