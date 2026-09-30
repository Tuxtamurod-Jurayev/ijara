import React from "react";
import { useApp } from "../context/AppContext";
import { AdCard } from "./AdCard";
import {
  IconPlusCircle as PlusCircle,
  IconArrowLeft as ArrowLeft,
  IconLayers as Layers,
} from "./icons";



export const MyAdsView = ({ onOpenCreateAd, onSelectAd }) => {
  const { currentUser, ads, setActiveView } = useApp();

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: "4rem 1.25rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          E'lonlaringizni ko'rish uchun avval tizimga kiring.
        </p>
      </div>
    );
  }

  const myAds = ads.filter((ad) => ad.userId === currentUser.id);

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
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
              Mening E'lonlarim ({myAds.length} ta)
            </h1>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Siz tomondan platformaga joylashtirilgan barcha faol e'lonlar
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateAd}
          className="btn btn-primary btn-sm"
          style={{ gap: "0.45rem" }}
        >
          <PlusCircle size={16} />
          <span>Yangi e'lon berish</span>
        </button>
      </div>

      {/* Ads Grid */}
      {myAds.length === 0 ? (
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
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--primary-light)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Layers size={26} />
          </div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            Siz hali birorta ham e'lon qo'shmadingiz
          </h3>
          <p style={{ color: "var(--text-muted)", maxWidth: "420px", fontSize: "0.9rem" }}>
            Kvartira, mashina yoki boshqa narsalaringizni hoziroq ijaraga berish uchun birinchi e'loningizni joylang!
          </p>
          <button onClick={onOpenCreateAd} className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            <PlusCircle size={17} />
            <span>Birinchi e'lonni joylash</span>
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
          {myAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} onSelectAd={onSelectAd} />
          ))}
        </div>
      )}
    </div>
  );
};
