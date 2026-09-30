import React from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES } from "../data/initialData";
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
    searchQuery,
    setSearchQuery,
    priceSort,
    setPriceSort,
    ads,
    users,
  } = useApp();

  return (
    <div
      style={{
        padding: "2.5rem 0 1.5rem",
        background: "radial-gradient(circle at 50% 0%, var(--primary-light) 0%, transparent 60%)",
        borderBottom: "1px solid var(--border)",
        marginBottom: "2rem",
      }}
    >
      <div className="container">
        {/* Hero Title */}
        <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 2rem" }}>
          <div
            className="badge badge-primary"
            style={{
              padding: "0.35rem 0.85rem",
              marginBottom: "1rem",
              fontSize: "0.85rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            <Sparkles size={15} />
            <span>O'zbekistonda №1 Zamonaviy Ijara Portali</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
              fontWeight: "800",
              lineHeight: 1.2,
              letterSpacing: "-0.03em",
              marginBottom: "0.85rem",
            }}
          >
            Kvartira, Uy, Avtomobil yoki Jihozlarni{" "}
            <span style={{ color: "var(--primary)", background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Oson Ijaraga Oling
            </span>
          </h1>

          <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Ishonchli e'lonlar, to'g'ridan-to'g'ri egalaridan bog'lanish va qulay qidiruv tizimi.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            maxWidth: "880px",
            margin: "0 auto 2rem",
            background: "var(--bg-card)",
            padding: "0.85rem",
            borderRadius: "var(--radius-xl)",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {/* Search input */}
          <div style={{ position: "relative", flex: "1 1 300px" }}>
            <Search
              size={20}
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
              placeholder="Qidiruv: Masalan 'Chilonzor kvartira' yoki 'Tracker'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{
                paddingLeft: "2.85rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
              }}
            />
          </div>

          {/* Sort dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value)}
              className="select-field"
              style={{
                width: "auto",
                borderRadius: "var(--radius-lg)",
                fontSize: "0.875rem",
                padding: "0.7rem 0.9rem",
              }}
            >
              <option value="default">Saralash: Yangilari</option>
              <option value="asc">Narx: Arzondan qimmatga</option>
              <option value="desc">Narx: Qimmatdan arzonga</option>
            </select>
          </div>
        </div>

        {/* Categories Tabs */}
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
                  padding: "0.6rem 1.1rem",
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
            marginTop: "1.75rem",
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
            <span>Ro'yxatdan o'tganlar: <strong style={{ color: "var(--text-main)" }}>{users.length} nafar</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <Sparkles size={16} color="var(--accent)" />
            <span>0% Komissiya — To'g'ridan-to'g'ri ijara</span>
          </div>
        </div>

      </div>
    </div>
  );
};
