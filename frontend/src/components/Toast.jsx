// ════════════════════════════════════════════════
// src/components/Toast.jsx
//
// Reusable toast notification component.
// Shows a small popup message at top-right.
// ════════════════════════════════════════════════

import { useState, useCallback } from "react";

// useToast() — custom hook to manage toasts
// Returns: { toasts, addToast, ToastContainer }
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((msg, type = "success") => {
    const icons = { success: "✅", danger: "❌", warning: "⚠️", info: "ℹ️" };
    const id = Date.now();

    setToasts((t) => [...t, { id, msg, icon: icons[type] || "✅", exiting: false }]);

    // start fade-out after 2.8s
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, exiting: true } : x))), 2800);
    // remove from DOM after 3.1s
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3100);
  }, []);

  return { toasts, addToast };
}

// ToastContainer — renders all toasts
export function ToastContainer({ toasts }) {
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.exiting ? "toast-exit" : ""}`}>
          <span style={{ fontSize: 16 }}>{t.icon}</span>
          <span style={{ fontSize: 12.5, fontWeight: 700, flex: 1 }}>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
