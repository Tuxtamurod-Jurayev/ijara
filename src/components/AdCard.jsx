import React from "react";
import { useApp } from "../context/AppContext";
import {
  IconMapPin,
  IconEye,
  IconTrash,
  IconHeart,
  IconCamera,
  IconCrown,
  IconTelegram,
  IconPhone,
} from "./icons";

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
        borderRadius: "var(--radius-lg)",
      }}
      onClick={() => onSelectAd(ad)}
    >
      {/* Image Container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "60%",
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
            transition: "transform 350ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: "absolute",
            top: "0.65rem",
            left: "0.65rem",
            display: "flex",
            gap: "0.35rem",
            zIndex: 2,
          }}
        >
          <span
            className="badge"
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(6px)",
              color: "#ffffff",
              fontSize: "0.72rem",
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
                fontSize: "0.7rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <IconCrown size={11} /> VIP
            </span>
          )}
        </div>

        {/* Favorite & Photo Count */}
        <div
          style={{
            position: "absolute",
            top: "0.65rem",
            right: "0.65rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            zIndex: 2,
          }}
        >
          {photoCount > 1 && (
            <span
              style={{
                background: "rgba(15, 23, 42, 0.75)",
                color: "#fff",
                padding: "0.15rem 0.45rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.7rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <IconCamera size={11} /> {photoCount}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(ad.id);
            }}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(6px)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            title="Sevimlilar"
          >
            <IconHeart
              size={15}
              color={isFavorite ? "#ef4444" : "#ffffff"}
              fill={isFavorite ? "#ef4444" : "none"}
            />
          </button>
        </div>

        {/* Price Tag Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "0.65rem",
            right: "0.65rem",
            background: "rgba(15, 23, 42, 0.88)",
            backdropFilter: "blur(8px)",
            padding: "0.3rem 0.65rem",
            borderRadius: "var(--radius-md)",
            color: "#ffffff",
            fontWeight: 800,
            fontSize: "0.95rem",
          }}
        >
          {formatPrice(ad.price, ad.currency)}
          <span style={{ fontSize: "0.72rem", fontWeight: "500", opacity: 0.85, marginLeft: "3px" }}>
            / {ad.period}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div
        style={{
          padding: "1rem",
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
              fontSize: "1rem",
              fontWeight: "700",
              lineHeight: 1.35,
              marginBottom: "0.45rem",
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

          {/* Location */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              marginBottom: "0.65rem",
            }}
          >
            <IconMapPin size={13} style={{ flexShrink: 0, color: "var(--primary)" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ad.location}
            </span>
          </div>

          {/* Features pills */}
          {ad.features && ad.features.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.75rem" }}>
              {ad.rooms && (
                <span
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.45rem",
                    background: "var(--primary-light)",
                    color: "var(--primary)",
                    fontWeight: 700,
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {ad.rooms} xona
                </span>
              )}
              {ad.features.slice(0, 2).map((f, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "0.72rem",
                    padding: "0.15rem 0.45rem",
                    background: "var(--bg-card-subtle)",
                    color: "var(--text-muted)",
                    borderRadius: "var(--radius-sm)",
                  }}
                >
                  {f}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "0.75rem",
            marginTop: "0.35rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {ad.userName}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            {ad.telegramUsername && (
              <a
                href={`https://t.me/${ad.telegramUsername}`}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  background: "rgba(0, 136, 204, 0.12)",
                  color: "#0088cc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                }}
                title={`Telegram (@${ad.telegramUsername})`}
              >
                <IconTelegram size={13} />
              </a>
            )}

            <span style={{ display: "flex", alignItems: "center", gap: "0.2rem", fontSize: "0.75rem", color: "var(--text-light)" }}>
              <IconEye size={12} />
              {ad.viewsCount || 0}
            </span>

            {isOwnerOrAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm("Bu e'lonni o'chirmoqchimisiz?")) {
                    deleteAd(ad.id);
                  }
                }}
                className="btn btn-sm btn-danger"
                style={{ padding: "0.25rem 0.45rem", fontSize: "0.7rem" }}
              >
                <IconTrash size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
