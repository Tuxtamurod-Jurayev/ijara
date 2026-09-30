import React from "react";
import { useApp } from "../context/AppContext";
import {
  MapPin,
  Eye,
  Calendar,
  Phone,
  Trash2,
  ExternalLink,
  Tag,
  Heart,
  Camera,
  Crown,
  Send,
} from "lucide-react";

export const AdCard = ({ ad, onSelectAd }) => {
  const { currentUser, deleteAd, favorites, toggleFavorite } = useApp();

  const isOwnerOrAdmin =
    currentUser?.role === "admin" || (currentUser && currentUser.id === ad.userId);

  const isFavorite = favorites.includes(ad.id);

  const formatPrice = (price, currency) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  const photoCount = ad.images?.length || 1;

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        cursor: "pointer",
        border: ad.isVip ? "1.5px solid rgba(245, 158, 11, 0.4)" : "1px solid var(--border)",
      }}
      onClick={() => onSelectAd(ad)}
    >
      {/* Ad Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "62%",
          overflow: "hidden",
          backgroundColor: "var(--bg-card-subtle)",
        }}
      >
        <img
          src={ad.image}
          alt={ad.title}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 400ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          loading="lazy"
        />

        {/* Badges on Top Left (Category & VIP) */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.4rem",
            zIndex: 2,
          }}
        >
          <span
            className="badge"
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(15, 23, 42, 0.8)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textTransform: "capitalize",
            }}
          >
            {ad.category}
          </span>

          {ad.isVip && (
            <span
              className="badge"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "0.72rem",
                boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
              }}
            >
              <Crown size={12} /> VIP
            </span>
          )}
        </div>

        {/* Top Right: Favorite Button & Photo Count */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            zIndex: 2,
          }}
        >
          {photoCount > 1 && (
            <span
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                color: "#ffffff",
                backdropFilter: "blur(6px)",
                padding: "0.2rem 0.5rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.72rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontWeight: 600,
              }}
            >
              <Camera size={11} /> {photoCount}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(ad.id);
            }}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "transform 150ms ease",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.88)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          >
            <Heart
              size={16}
              color={isFavorite ? "#ef4444" : "#ffffff"}
              fill={isFavorite ? "#ef4444" : "none"}
            />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(10px)",
            padding: "0.35rem 0.75rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#ffffff",
            fontWeight: "800",
            fontSize: "1rem",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {formatPrice(ad.price, ad.currency)}
          <span style={{ fontSize: "0.75rem", fontWeight: "500", opacity: 0.85, marginLeft: "4px" }}>
            / {ad.period}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Title */}
          <h3
            style={{
              fontSize: "1.05rem",
              fontWeight: "700",
              lineHeight: 1.4,
              marginBottom: "0.5rem",
              color: "var(--text-main)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={ad.title}
          >
            {ad.title}
          </h3>

          {/* Location & Region */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
            }}
          >
            <MapPin size={15} style={{ flexShrink: 0, color: "var(--primary)" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ad.region && ad.region !== "Toshkent shahri" ? `${ad.region}, ` : ""}{ad.location}
            </span>
          </div>

          {/* Features pills */}
          {ad.features && ad.features.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                marginBottom: "1rem",
              }}
            >
              {ad.rooms && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    fontWeight: 700,
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {ad.rooms} xona
                </span>
              )}
              {ad.features.slice(0, 3).map((f, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.75rem",
                    padding: "0.2rem 0.5rem",
                    background: "var(--bg-card-subtle)",
                    color: "var(--text-muted)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {f}
                </span>
              ))}
              {ad.features.length > 3 && (
                <span style={{ fontSize: "0.75rem", color: "var(--text-light)", padding: "0.2rem" }}>
                  +{ad.features.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Poster name & Actions */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "0.85rem",
            marginTop: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <div
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
                fontWeight: 700,
              }}
            >
              {ad.userName ? ad.userName.charAt(0) : "U"}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ad.userName}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            {ad.telegramUsername && (
              <a
                href={`https://t.me/${ad.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: "rgba(0, 136, 204, 0.12)",
                  color: "#0088cc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                title={`Telegramda yozish (@${ad.telegramUsername})`}
              >
                <Send size={13} />
              </a>
            )}

            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.75rem",
                color: "var(--text-light)",
              }}
              title="Ko'rishlar soni"
            >
              <Eye size={13} />
              {ad.viewsCount || 0}
            </span>

            {isOwnerOrAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Haqiqatan ham bu e'lonni o'chirmoqchimisiz?")) {
                    deleteAd(ad.id);
                  }
                }}
                className="btn btn-sm btn-danger"
                style={{ padding: "0.3rem 0.5rem", fontSize: "0.75rem" }}
                title="E'lonni o'chirish"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
