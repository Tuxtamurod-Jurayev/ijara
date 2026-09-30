import React from "react";
import { useApp } from "../context/AppContext";
import { Home, Send, Shield, Heart } from "lucide-react";

export const Footer = ({ onOpenTelegram }) => {
  const { setActiveView } = useApp();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
        padding: "3rem 0 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Col 1 */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.85rem" }}>
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
                <Home size={18} />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: "800" }}>
                Ijara<span style={{ color: "var(--primary)" }}>Bozor</span>
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              O'zbekistonda uy-joy, transport va jihozlarni to'g'ridan-to'g'ri egasidan ijaraga olish va berish bo'yicha qulay portal.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>
              Bo'limlar
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
              <li>
                <button
                  onClick={() => setActiveView("home")}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  Barcha e'lonlar
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTelegram}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  Telegram Bot integratsiyasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView("admin")}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
                >
                  Admin Boshqaruv
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Telegram bot & deployment */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1rem" }}>
              Telegram & Vercel
            </h4>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
              Ilova GitHub va Vercel uchun to'liq optimallashtirilgan. Keyingi bosqichda Telegram Botga bevosita bog'lanadi.
            </p>
            <button
              onClick={onOpenTelegram}
              className="btn btn-secondary btn-sm"
              style={{ gap: "0.4rem" }}
            >
              <Send size={14} color="#0088cc" />
              <span>Bot sozlamalari</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          <div>© {new Date().getFullYear()} IjaraBozor Platformasi. Barcha huquqlar himoyalangan.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <span>Ishonchli va qulay ijara tizimi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
