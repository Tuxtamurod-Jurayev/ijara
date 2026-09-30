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
} from "lucide-react";

export const AdCard = ({ ad, onSelectAd }) => {
  const { currentUser, deleteAd } = useApp();

  const isOwnerOrAdmin =
    currentUser?.role === "admin" || (currentUser && currentUser.id === ad.userId);

  const formatPrice = (price, currency) => {
    return `${price.toLocaleString()} ${currency}`;
  };

  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
        cursor: "pointer",
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

        {/* Category Badge overlay */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          <span
            className="badge badge-primary"
            style={{
              backdropFilter: "blur(8px)",
              background: "rgba(15, 23, 42, 0.75)",
              color: "#ffffff",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              textTransform: "capitalize",
            }}
          >
            {ad.category}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div
          style={{
            position: "absolute",
            bottom: "0.75rem",
            right: "0.75rem",
            background: "rgba(15, 23, 42, 0.85)",
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
              marginBottom: "0.6rem",
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
              gap: "0.35rem",
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
            }}
          >
            <MapPin size={15} style={{ flexShrink: 0, color: "var(--primary)" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ad.location}
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
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ad.userName}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
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
