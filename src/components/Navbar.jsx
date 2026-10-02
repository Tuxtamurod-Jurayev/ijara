import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  IconHome,
  IconPlusCircle,
  IconLogIn,
  IconLogOut,
  IconShield,
  IconMoon,
  IconSun,
  IconSend,
  IconList,
  IconHeart,
  IconBot,
} from "./icons";

export const Navbar = ({ onOpenAuth, onOpenCreateAd, onOpenTelegram }) => {
  const {
    theme,
    toggleTheme,
    currentUser,
    logoutUser,
    activeView,
    setActiveView,
    ads,
    favorites,
    telegramInfo,
  } = useApp();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const userAdsCount = currentUser
    ? ads.filter((a) => a.userId === currentUser.id).length
    : 0;

  return (
    <header className="glass-nav">
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
        
        {/* Minimalist Logo */}
        <div
          onClick={() => setActiveView("home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)",
            }}
          >
            <IconHome size={19} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "800", letterSpacing: "-0.02em" }}>
                Ijara<span style={{ color: "var(--primary)" }}>Bozor</span>
              </span>
              <span
                className="badge badge-primary"
                style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", fontWeight: 700 }}
              >
                UZ
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          
          {/* Create Ad */}
          <button
            onClick={onOpenCreateAd}
            className="btn btn-primary btn-sm"
            style={{ gap: "0.35rem", fontWeight: 700 }}
          >
            <IconPlusCircle size={15} />
            <span>E'lon berish</span>
          </button>

          {/* Theme Switch */}
          <button
            onClick={toggleTheme}
            className="btn btn-secondary btn-sm"
            style={{ width: "36px", height: "36px", padding: 0, borderRadius: "50%", flexShrink: 0 }}
            title="Rejimni almashtirish"
            aria-label="Rejimni almashtirish"
          >
            {theme === "light" ? <IconMoon size={16} /> : <IconSun size={16} color="#fbbf24" />}
          </button>

          {/* User Dropdown / Login */}
          {currentUser ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="btn btn-secondary btn-sm"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                }}
              >
                <div
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "50%",
                    background: currentUser.role === "admin" ? "var(--accent)" : "var(--primary)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                  }}
                >
                  {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="hide-on-mobile" style={{ fontSize: "0.85rem", maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {currentUser.fullName.split(" ")[0]}
                </span>
                {currentUser.role === "admin" && (
                  <span className="badge badge-warning" style={{ fontSize: "0.62rem", padding: "0.1rem 0.35rem" }}>
                    Admin
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 8px)",
                    width: "210px",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    boxShadow: "var(--shadow-lg)",
                    zIndex: 60,
                    padding: "0.5rem",
                  }}
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div style={{ padding: "0.5rem 0.65rem", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{currentUser.fullName}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{currentUser.username}</div>
                  </div>

                  <div style={{ padding: "0.35rem 0" }}>

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
                        padding: "0.5rem 0.65rem",
                        background: "none",
                        border: "none",
                        color: "var(--text-main)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <IconList size={14} />
                        E'lonlarim
                      </span>
                      <span className="badge badge-primary">{userAdsCount}</span>
                    </button>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "0.35rem" }}>
                    <button
                      onClick={() => {
                        logoutUser();
                        setDropdownOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 0.65rem",
                        background: "none",
                        border: "none",
                        color: "var(--danger)",
                        borderRadius: "var(--radius-sm)",
                        cursor: "pointer",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      <IconLogOut size={14} />
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
              style={{ gap: "0.4rem", fontWeight: 700 }}
            >
              <IconLogIn size={15} />
              <span>Kirish</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
