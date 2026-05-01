import { useState, useCallback } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = "success") => {
    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    const colors = { success: "#16a34a", error: "#dc2626", warning: "#d97706", info: "#2563eb" };
    const id = Date.now();
    setToasts(t => [...t, { id, msg, icon: icons[type] || "✅", color: colors[type] || "#16a34a", exiting: false }]);
    setTimeout(() => setToasts(t => t.map(x => x.id === id ? { ...x, exiting: true } : x)), 2700);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return { toasts, addToast };
}

export function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast-item${t.exiting ? " toast-exit" : ""}`} style={{ borderLeft: `3px solid ${t.color}` }}>
          <span className="toast-icon">{t.icon}</span>
          <span className="toast-msg">{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
