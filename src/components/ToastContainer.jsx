import React from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast"
          style={{
            borderLeft: `4px solid ${
              t.type === "danger"
                ? "var(--danger)"
                : t.type === "warning"
                ? "var(--warning)"
                : "var(--success)"
            }`,
          }}
        >
          {t.type === "danger" ? (
            <XCircle size={18} color="var(--danger)" />
          ) : t.type === "warning" ? (
            <AlertTriangle size={18} color="var(--warning)" />
          ) : (
            <CheckCircle2 size={18} color="var(--success)" />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
