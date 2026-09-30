import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES, REGIONS, RENTAL_DURATIONS, ROOM_OPTIONS } from "../data/initialData";
import {
  Search,
  Building,
  Home,
  Car,
  Briefcase,
  Cpu,
  LayoutGrid,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  Zap,
  MapPin,
  Clock,
  SlidersHorizontal,
  DollarSign,
  X,
  Bot,
  ExternalLink,
} from "lucide-react";

// Icon mapping helper
const getCategoryIcon = (iconName, size = 18) => {
  switch (iconName) {
    case "Building":
      return <Building size={size} />;
    case "Home":
      return <Home size={size} />;
    case "Car":
      return <Car size={size} />;
    case "Briefcase":
      return <Briefcase size={size} />;
    case "Cpu":
      return <Cpu size={size} />;
    default:
      return <LayoutGrid size={size} />;
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
        padding: "2rem 0 1.5rem",
        background: "radial-gradient(circle at 50% 0%, var(--primary-light) 0%, transparent 65%)",
        borderBottom: "1px solid var(--border)",
        marginBottom: "2rem",
      }}
    >
      <div className="container">
        {/* Telegram WebApp Greeting if inside Telegram */}
        {telegramInfo.isInsideTelegram && (
          <div
            style={{
              maxWidth: "880px",
              margin: "0 auto 1.25rem",
              background: "rgba(0, 136, 204, 0.1)",
              border: "1px solid rgba(0, 136, 204, 0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "0.75rem 1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Bot size={20} color="#0088cc" />
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-main)" }}>
                Telegram Web App orqali ulandingiz!
              </span>
            </div>
            <a
              href="https://t.me/ijara_buyum_bot"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "0.8rem", color: "#0088cc", display: "flex", alignItems: "center", gap: "0.3rem", textDecoration: "none", fontWeight: 600 }}
            >
              <span>@ijara_buyum_bot</span>
              <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* Hero Title */}
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 1.75rem" }}>
          <div
            className="badge badge-primary"
            style={{
              padding: "0.35rem 0.85rem",
              marginBottom: "0.75rem",
              fontSize: "0.85rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            <Sparkles size={15} />
            <span>O'zbekistonda №1 Zamonaviy Ijara Portali & Telegram Bot</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.85rem, 3.8vw, 2.75rem)",
              fontWeight: "800",
              lineHeight: 1.25,
              letterSpacing: "-0.03em",
              marginBottom: "0.75rem",
            }}
          >
            Kvartira, Uy, Avtomobil yoki Jihozlarni{" "}
            <span
              style={{
                color: "var(--primary)",
                background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              To'g'ridan-to'g'ri Egasidan
            </span>{" "}
            Ijaraga Oling
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
            Airbnb va OLX kabi to'liq qulay filtrlar, xavfsiz aloqa va Telegram bot orqali tezkor boshqaruv.
          </p>
        </div>

        {/* Main Search & Comprehensive Filter Bar */}
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto 1.5rem",
            background: "var(--bg-card)",
            padding: "1rem",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
          }}
        >
          {/* Top Row: Search + Region + Sort + Filter Toggle */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", alignItems: "center" }}>
            {/* Search query input */}
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                }}
              />
              <input
                type="text"
                placeholder="Qidiruv: Masalan 'Chilonzor', 'Tracker', 'Chorvoq'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{
                  paddingLeft: "2.75rem",
                  borderRadius: "var(--radius-lg)",
                }}
              />
            </div>

            {/* Region Selector */}
            <div style={{ position: "relative", flex: "1 1 180px" }}>
              <select
                value={activeRegion}
                onChange={(e) => setActiveRegion(e.target.value)}
                className="select-field"
                style={{
                  borderRadius: "var(--radius-lg)",
                  fontSize: "0.875rem",
                }}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r === "Barchasi" ? "Barcha viloyatlar" : r}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div style={{ flex: "0 1 170px" }}>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="select-field"
                style={{
                  borderRadius: "var(--radius-lg)",
                  fontSize: "0.875rem",
                }}
              >
                <option value="default">Saralash: Yangilari</option>
                <option value="asc">Narx: Arzondan qimmatga</option>
                <option value="desc">Narx: Qimmatdan arzonga</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`btn btn-sm ${showAdvanced ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.65rem 1rem", borderRadius: "var(--radius-lg)", gap: "0.45rem" }}
            >
              <SlidersHorizontal size={16} />
              <span>Filtrlar</span>
              {hasActiveFilters && (
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: showAdvanced ? "#ffffff" : "var(--primary)",
                  }}
                />
              )}
            </button>
          </div>

          {/* Expandable Advanced Filters Row (Duration, Rooms, Price Range) */}
          {showAdvanced && (
            <div
              style={{
                marginTop: "1rem",
                paddingTop: "1rem",
                borderTop: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              {/* Rental Duration */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  Ijara muddati:
                </label>
                <select
                  value={activeDuration}
                  onChange={(e) => setActiveDuration(e.target.value)}
                  className="select-field"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
                >
                  {RENTAL_DURATIONS.map((d) => (
                    <option key={d.id} value={d.id}>{d.label}</option>
                  ))}
                </select>
              </div>

              {/* Rooms filter */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  Xonalar soni:
                </label>
                <select
                  value={activeRooms}
                  onChange={(e) => setActiveRooms(e.target.value)}
                  className="select-field"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
                >
                  {ROOM_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  Min narx:
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
                />
              </div>

              {/* Max Price */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
                  Max narx:
                </label>
                <input
                  type="number"
                  placeholder="Cheksiz"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field"
                  style={{ fontSize: "0.85rem", padding: "0.55rem 0.75rem" }}
                />
              </div>

              {/* Reset button */}
              <div style={{ display: "flex", alignItems: "flex-end", height: "100%" }}>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="btn btn-secondary btn-sm"
                  style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem", gap: "0.35rem" }}
                >
                  <X size={15} />
                  <span>Filtrlarni tozalash</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Categories Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.65rem",
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
                  boxShadow: isActive ? "0 4px 14px rgba(59, 130, 246, 0.3)" : "var(--shadow-sm)",
                  padding: "0.55rem 1.1rem",
                  borderRadius: "var(--radius-full)",
                  transition: "all var(--transition-smooth)",
                }}
              >
                {getCategoryIcon(cat.icon, 16)}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Micro Stats Banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "2.5rem",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Zap size={16} color="var(--primary)" />
            <span>Faol e'lonlar: <strong style={{ color: "var(--text-main)" }}>{ads.length} ta</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <ShieldCheck size={16} color="var(--success)" />
            <span>Foydalanuvchilar: <strong style={{ color: "var(--text-main)" }}>{users.length} nafar</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Bot size={16} color="#0088cc" />
            <span>Telegram Bot: <strong style={{ color: "var(--text-main)" }}>@ijara_buyum_bot</strong></span>
          </div>
        </div>

      </div>
    </div>
  );
};
