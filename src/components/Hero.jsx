import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, REGIONS, RENTAL_DURATIONS, ROOM_OPTIONS } from "../data/initialData";
import {
  IconSearch,
  IconBuilding,
  IconHouse,
  IconCar,
  IconBriefcase,
  IconCpu,
  IconGrid,
  IconSliders,
  IconX,
  IconZap,
  IconShield,
  IconTelegram,
  IconExternalLink,
} from "./icons";

const getCategoryIcon = (id, size = 16) => {
  switch (id) {
    case "kvartira":
      return <IconBuilding size={size} />;
    case "hovli":
      return <IconHouse size={size} />;
    case "avto":
      return <IconCar size={size} />;
    case "ofis":
      return <IconBriefcase size={size} />;
    case "texnika":
      return <IconCpu size={size} />;
    default:
      return <IconGrid size={size} />;
  }
};

export const Hero = () => {
  const {
    activeCategory,
    setActiveCategory,
    activeRegion,
    setActiveRegion,
    activeDuration,
    setActiveDuration,
    activeRooms,
    setActiveRooms,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    searchQuery,
    setSearchQuery,
    priceSort,
    setPriceSort,
    ads,
    users,
    telegramInfo,
  } = useApp();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const resetAllFilters = () => {
    setActiveCategory("all");
    setActiveRegion("Barchasi");
    setActiveDuration("all");
    setActiveRooms("all");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setPriceSort("default");
  };

  const hasActiveFilters =
    activeCategory !== "all" ||
    activeRegion !== "Barchasi" ||
    activeDuration !== "all" ||
    activeRooms !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    searchQuery !== "";

  return (
    <div
      style={{
        padding: "1.75rem 0 1.25rem",
        background: "radial-gradient(circle at 50% 0%, var(--primary-light) 0%, transparent 60%)",
        borderBottom: "1px solid var(--border)",
        marginBottom: "1.75rem",
      }}
    >
      <div className="container">
        {/* Telegram WebApp Notice */}
        {telegramInfo.isInsideTelegram && (
          <div
            style={{
              maxWidth: "840px",
              margin: "0 auto 1.25rem",
              background: "rgba(0, 136, 204, 0.08)",
              border: "1px solid rgba(0, 136, 204, 0.25)",
              borderRadius: "var(--radius-md)",
              padding: "0.6rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <IconTelegram size={18} color="#0088cc" />
              <span style={{ fontWeight: 600 }}>Telegram Web App orqali ishlamoqda</span>
            </div>
            <a
              href="https://t.me/ijara_buyum_bot"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#0088cc", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none", fontWeight: 700, fontSize: "0.8rem" }}
            >
              <span>@ijara_buyum_bot</span>
              <IconExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Minimalist Heading */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 1.5rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)",
              fontWeight: "800",
              lineHeight: 1.25,
              letterSpacing: "-0.025em",
              marginBottom: "0.5rem",
            }}
          >
            Ijaraga Oling va Berish{" "}
            <span style={{ color: "var(--primary)" }}>Oson</span>
          </h1>

          <p style={{ fontSize: "0.95rem", color: "var(--text-muted)" }}>
            Uy-joy, transport va jihozlarni to'g'ridan-to'g'ri egasidan ijaraga oling.
          </p>
        </div>

        {/* Minimalist Filter Bar */}
        <div
          style={{
            maxWidth: "920px",
            margin: "0 auto 1.25rem",
            background: "var(--bg-card)",
            padding: "0.75rem",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-md)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Main search row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 240px" }}>
              <IconSearch
                size={16}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Qidiruv (nomi, tuman, dacha, cobalt)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: "2.5rem",
                  paddingTop: "0.6rem",
                  paddingBottom: "0.6rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            {/* Region select */}
            <div style={{ flex: "1 1 170px" }}>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="select-field"
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.85rem",
                }}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === "Barchasi" ? "Barcha viloyatlar" : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort select */}
            <div style={{ flex: "0 1 160px" }}>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="select-field"
                style={{
                  padding: "0.6rem 0.8rem",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.85rem",
                }}
              >
                <option value="default">Saralash: Yangilar</option>
                <option value="asc">Narx: Arzondan</option>
                <option value="desc">Narx: Qimmatdan</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`btn btn-sm ${showAdvanced ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.6rem 0.9rem", borderRadius: "var(--radius-md)", gap: "0.4rem" }}
            >
              <IconSliders size={14} />
              <span>Filtr</span>
              {hasActiveFilters && (
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#fff" }} />
              )}
            </button>
          </div>

          {/* Advanced toggle row */}
          {showAdvanced && (
            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <div>
                <select
                  value={activeDuration}
                  onChange={(e) => setActiveDuration(e.target.value)}
                  className="select-field"
                  style={{ fontSize: "0.82rem", padding: "0.5rem 0.7rem" }}
                >
                  {RENTAL_DURATIONS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={activeRooms}
                  onChange={(e) => setActiveRooms(e.target.value)}
                  className="select-field"
                  style={{ fontSize: "0.82rem", padding: "0.5rem 0.7rem" }}
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Min narx"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field"
                  style={{ fontSize: "0.82rem", padding: "0.5rem 0.7rem" }}
                />
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Max narx"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field"
                  style={{ fontSize: "0.82rem", padding: "0.5rem 0.7rem" }}
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", padding: "0.5rem", fontSize: "0.8rem", gap: "0.3rem" }}
                >
                  <IconX size={13} />
                  <span>Tozalash</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Category Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="btn btn-sm"
                style={{
                  background: isActive ? "var(--primary-gradient)" : "var(--bg-card)",
                  color: isActive ? "#ffffff" : "var(--text-main)",
                  border: isActive ? "1px solid transparent" : "1px solid var(--border)",
                  padding: "0.45rem 0.9rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem",
                  gap: "0.4rem",
                }}
              >
                {getCategoryIcon(cat.id, 14)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
