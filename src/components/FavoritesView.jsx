import React from "react";
import { useApp } from "../context/AppContext";
import { AdCard } from "./AdCard";
import { Heart, ArrowLeft, Search } from "lucide-react";

export const FavoritesView = ({ onSelectAd }) => {
  const { ads, favorites, setActiveView } = useApp();

  const favoriteAds = ads.filter((ad) => favorites.includes(ad.id));

  return (
    <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <button
            onClick={() => setActiveView("home")}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: "50%", width: "38px", height: "38px", padding: 0 }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Heart size={22} color="var(--danger)" fill="var(--danger)" />
              <span>Saqlangan Sevimli E'lonlar ({favoriteAds.length} ta)</span>
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Sizga ma'qul kelgan va yurakcha bosilgan barcha ijara variantlari
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView("home")}
          className="btn btn-secondary btn-sm"
        >
          Barcha e'lonlarga qaytish
        </button>
      </div>

      {/* Ads Grid */}
      {favoriteAds.length === 0 ? (
        <div
          className="card"
          style={{
            padding: "3.5rem 1.5rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.12)",
              color: "var(--danger)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart size={28} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            Hozircha saqlangan e'lonlar yo'q
          </h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "420px", fontSize: "0.9rem" }}>
            Yoqqan e'lonlarni burchagidagi yurakcha (❤️) tugmasini bosib shu yerda saqlab qo'yishingiz mumkin.
          </p>
          <button
            onClick={() => setActiveView("home")}
            className="btn btn-primary"
            style={{ marginTop: "0.5rem" }}
          >
            <Search size={16} />
            <span>E'lonlarni ko'rish</span>
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {favoriteAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} onSelectAd={onSelectAd} />
          ))}
        </div>
      )}
    </div>
  );
};
