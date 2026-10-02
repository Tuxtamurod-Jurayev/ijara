import React from "react";
import { useApp } from "../context/AppContext";
import {
  IconHome,
  IconSearch,
  IconPlusCircle,
  IconHeart,
  IconUser,
  IconShield,
  IconLogIn,
} from "./icons";

export const MobileBottomNav = ({ onOpenAuth, onOpenCreateAd }) => {
  const {
    activeView,
    setActiveView,
    currentUser,
    favorites,
  } = useApp();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Asosiy / Home */}
      <button
        onClick={() => {
          setActiveView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`mobile-nav-item ${activeView === "home" ? "active" : ""}`}
      >
        <IconHome size={20} />
        <span>Asosiy</span>
      </button>

      {/* 2. Sevimlilar / Favorites */}
      <button
        onClick={() => setActiveView("favorites")}
        className={`mobile-nav-item ${activeView === "favorites" ? "active" : ""}`}
      >
        <div style={{ position: "relative" }}>
          <IconHeart
            size={20}
            color={favorites.length > 0 ? "var(--danger)" : "currentColor"}
            fill={activeView === "favorites" && favorites.length > 0 ? "var(--danger)" : "none"}
          />
          {favorites.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-4px",
                right: "-8px",
                background: "var(--danger)",
                color: "#ffffff",
                fontSize: "0.6rem",
                fontWeight: 800,
                borderRadius: "999px",
                minWidth: "15px",
                height: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 2px",
              }}
            >
              {favorites.length}
            </span>
          )}
        </div>
        <span>Sevimlilar</span>
      </button>

      {/* 3. Center Highlight: E'lon berish (+) */}
      <button
        onClick={onOpenCreateAd}
        className="mobile-nav-item mobile-nav-add-btn"
        title="Yangi e'lon berish"
        aria-label="Yangi e'lon berish"
      >
        <IconPlusCircle size={24} />
      </button>

      {/* 4. Mening E'lonlarim (yoki Qidiruv) */}
      <button
        onClick={() => {
          if (currentUser) {
            setActiveView("my-ads");
          } else {
            onOpenAuth();
          }
        }}
        className={`mobile-nav-item ${activeView === "my-ads" ? "active" : ""}`}
      >
        <IconSearch size={20} />
        <span>E'lonlarim</span>
      </button>

      {/* 5. Profil / Kirish */}
      {currentUser ? (
        <button
          onClick={() => setActiveView("my-ads")}
          className={`mobile-nav-item ${activeView === "my-ads" ? "active" : ""}`}
        >
          <IconUser size={20} />
          <span>Profil</span>
        </button>
      ) : (
        <button
          onClick={onOpenAuth}
          className="mobile-nav-item"
        >
          <IconLogIn size={20} />
          <span>Kirish</span>
        </button>
      )}
    </nav>
  );
};
