import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Home,
  PlusCircle,
  LogIn,
  LogOut,
  Shield,
  Moon,
  Sun,
  User,
  Send,
  ListFilter,
  Sparkles,
} from "lucide-react";

export const Navbar = ({ onOpenAuth, onOpenCreateAd, onOpenTelegram }) => {
  const {
    theme,
    toggleTheme,
    currentUser,
    logoutUser,
    activeView,
    setActiveView,
    ads,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Count ads posted by current user
  const userAdsCount = currentUser
    ? ads.filter((a) => a.userId === currentUser.id).length
    : 0;

  return (
    <header className="glass-nav">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        
        {/* Brand Logo */}
        <div
          onClick={() => setActiveView("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            }}
          >
            <Home size={22} strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Ijara<span style={{ color: "var(--primary)" }}>Bozor</span>
              </span>
              <span
                className="badge badge-primary"
                style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem", fontWeight: 700 }}
              >
                UZ
              </span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "-2px" }}>
              Ishonchli ijara platformasi
            </p>
          </div>
        </div>

        {/* Navigation links & Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          
          {/* Home View Button */}
          <button
            onClick={() => setActiveView("home")}
            className={`btn btn-sm ${activeView === "home" ? "btn-secondary" : ""}`}
            style={{
              background: activeView === "home" ? "var(--primary-light)" : "transparent",
              color: activeView === "home" ? "var(--primary)" : "var(--text-main)",
              border: "none",
            }}
          >
            E'lonlar
          </button>

          {/* Telegram Bot Button */}
          <button
            onClick={onOpenTelegram}
            className="btn btn-sm hide-on-mobile"
            style={{
              background: "rgba(0, 136, 204, 0.1)",
              color: "#0088cc",
              border: "1px solid rgba(0, 136, 204, 0.25)",
            }}
            title="Telegram Bot integratsiyasi"
          >
            <Send size={15} />
            <span>Telegram Bot</span>
          </button>

          {/* Admin Panel Direct Button if logged in as admin */}
          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveView("admin")}
              className="btn btn-sm"
              style={{
                background: activeView === "admin" ? "var(--accent)" : "rgba(139, 92, 246, 0.12)",
                color: activeView === "admin" ? "#ffffff" : "var(--accent)",
                border: "1px solid rgba(139, 92, 246, 0.3)",
              }}
            >
              <Shield size={16} />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Create Ad Button */}
          <button
            onClick={() => {
              if (!currentUser) {
                onOpenAuth();
              } else {
                onOpenCreateAd();
              }
            }}
            className="btn btn-primary btn-sm"
            style={{ gap: "0.45rem" }}
          >
            <PlusCircle size={17} />
            <span>E'lon berish</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ width: "38px", height: "38px", padding: 0, borderRadius: "50%" }}
            title={theme === "light" ? "Tungi rejimga o'tish" : "Kunduzgi rejimga o'tish"}
            aria-label="Rejimni almashtirish"
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} color="#fbbf24" />}
          </button>

          {/* User Auth Section */}
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: currentUser.role === "admin" ? "var(--accent)" : "var(--primary)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                  }}
                >
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hide-on-mobile" style={{ fontSize: "0.85rem", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {currentUser.fullName.split(" ")[0]}
                </span>
                {currentUser.role === "admin" && (
                  <span className="badge badge-warning" style={{ fontSize: "0.65rem", padding: "0.1rem 0.35rem" }}>
                    Admin
                  </span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: "220px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 60,
                    padding: "0.5rem",
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{currentUser.fullName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{currentUser.username}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{currentUser.phone}</div>
                  </div>

                  <div style={{ padding: "0.4rem 0" }}>
                    {currentUser.role === "admin" && (
                      <button
                        onClick={() => {
                          setActiveView("admin");
                          setDropdownOpen(false);
                        }}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.5rem 0.75rem",
                          background: "none",
                          border: "none",
                          color: "var(--accent)",
                          borderRadius: "var(--radius-sm)",
                          cursor: "pointer",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                        className="btn-secondary"
                      >
                        <Shield size={16} />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveView("my-ads");
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.5rem 0.75rem",
                        background: "none",
                        border: "none",
                        color: "var(--text-main)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                      className="btn-secondary"
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <ListFilter size={16} />
                        Mening e'lonlarim
                      </span>
                      <span className="badge badge-primary">{userAdsCount}</span>
                    </button>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.4rem" }}>
                    <button
                      onClick={() => {
                        logoutUser();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.5rem 0.75rem",
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <LogOut size={16} />
                      Chiqish
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="btn btn-secondary btn-sm"
              style={{ gap: "0.45rem", fontWeight: 700 }}
            >
              <LogIn size={16} />
              <span>Kirish</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
