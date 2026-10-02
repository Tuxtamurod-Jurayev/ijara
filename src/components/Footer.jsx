import React from "react";
import { useApp } from "../context/AppContext";
import { IconHome } from "./icons";

export const Footer = () => {
  const { setActiveView } = useApp();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
        padding: "2rem 0 1.5rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Brand info */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "var(--primary-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <IconHome size={17} />
            </div>
            <div>
              <span style={{ fontSize: "1.1rem", fontWeight: "800" }}>
                Ijara<span style={{ color: "var(--primary)" }}>Bozor</span>
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>
                O'zbekistonda tezkor va qulay ijara platformasi
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line with discreet admin trigger */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <span>© {new Date().getFullYear()} IjaraBozor. Barcha huquqlar himoyalangan.</span>
            
            {/* Bilinmaydigan Admin kirish nuqtasi */}
            <button
              onClick={() => {
                setActiveView("admin");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                opacity: 0.12,
                cursor: "pointer",
                padding: "0 4px",
                fontSize: "0.75rem",
                transition: "opacity 0.2s ease",
                userSelect: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.75")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.12")}
              title="Tizim"
              aria-label="Admin boshqaruv"
            >
              •
            </button>
          </div>

          <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
            Toshkent, O'zbekiston
          </div>
        </div>
      </div>
    </footer>
  );
};
