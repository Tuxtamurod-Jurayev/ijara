import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  IconX,
  IconMapPin,
  IconCalendar,
  IconEye,
  IconCircleCheck,
  IconCopy,
  IconCheck,
  IconUser,
  IconShare,
  IconHeart,
  IconCrown,
  IconChevronLeft,
  IconChevronRight,
  IconPhone,
  IconTelegram,
} from "./icons";

export const AdDetailsModal = ({ ad, onClose }) => {
  const { showToast, favorites, toggleFavorite } = useApp();
  const [copied, setCopied] = useState(false);
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  if (!ad) return null;

  const imagesList = ad.images && ad.images.length > 0 ? ad.images : [ad.image];
  const currentImg = imagesList[activeImgIndex] || ad.image;
  const isFavorite = favorites.includes(ad.id);

  const handleCopyPhone = () => {
    if (ad.userPhone) {
      navigator.clipboard.writeText(ad.userPhone);
      setCopied(true);
      showToast("Telefon raqami nusxalandi!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}?ad=${ad.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: ad.title,
          text: `${ad.title} — ${ad.price} ${ad.currency} / ${ad.period}`,
          url: url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      showToast("Havola nusxalandi!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "680px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>
              {ad.category}
            </span>
            {ad.isVip && (
              <span
                className="badge"
                style={{
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "#ffffff",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}
              >
                <IconCrown size={12} /> VIP
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <button
              onClick={() => toggleFavorite(ad.id)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.35rem", borderRadius: "50%" }}
              title="Sevimlilarga saqlash"
            >
              <IconHeart
                size={15}
                color={isFavorite ? "#ef4444" : "var(--text-muted)"}
                fill={isFavorite ? "#ef4444" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.35rem", borderRadius: "50%" }}
              title="Ulashish"
            >
              <IconShare size={15} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.35rem", borderRadius: "50%" }}
            >
              <IconX size={16} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: "0 0 1.25rem 0" }}>
          {/* Gallery View */}
          <div
            style={{
              width: "100%",
              height: "clamp(220px, 45vw, 340px)",
              backgroundColor: "var(--bg-card-subtle)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={currentImg}
              alt={ad.title}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";
              }}
            />

            {imagesList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImgIndex((prev) =>
                      prev === 0 ? imagesList.length - 1 : prev - 1
                    )
                  }
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <IconChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImgIndex((prev) =>
                      prev === imagesList.length - 1 ? 0 : prev + 1
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "none",
                    borderRadius: "50%",
                    width: "34px",
                    height: "34px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <IconChevronRight size={18} />
                </button>
              </>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "0.75rem",
                left: "0.75rem",
                background: "rgba(15, 23, 42, 0.88)",
                backdropFilter: "blur(8px)",
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-md)",
                color: "#ffffff",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <div style={{ fontSize: "1.15rem", fontWeight: "800" }}>
                {ad.price.toLocaleString()} {ad.currency}
                <span style={{ fontSize: "0.8rem", fontWeight: "500", opacity: 0.8, marginLeft: "4px" }}>
                  / {ad.period}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.45rem",
                padding: "0.6rem 1.25rem",
                overflowX: "auto",
                background: "var(--bg-card-subtle)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {imagesList.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImgIndex(i)}
                  style={{
                    border: activeImgIndex === i ? "2px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: 0,
                    width: "60px",
                    height: "44px",
                    flexShrink: 0,
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Details */}
          <div style={{ padding: "1.25rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", lineHeight: 1.35, color: "var(--text-main)", marginBottom: "0.65rem" }}>
              {ad.title}
            </h2>

            {/* Meta row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                color: "var(--text-muted)",
                fontSize: "0.825rem",
                paddingBottom: "1rem",
                borderBottom: "1px solid var(--border)",
                marginBottom: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <IconMapPin size={14} color="var(--primary)" />
                <span>{ad.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <IconCalendar size={14} />
                <span>{ad.createdAt}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <IconEye size={14} />
                <span>{ad.viewsCount} ko'rish</span>
              </div>
            </div>

            {/* Specs row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "0.5rem",
                marginBottom: "1.25rem",
              }}
            >
              {ad.region && (
                <div style={{ padding: "0.5rem 0.75rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Hudud:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.825rem" }}>{ad.region}</div>
                </div>
              )}
              {ad.rooms && (
                <div style={{ padding: "0.5rem 0.75rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Xonalar:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.825rem" }}>{ad.rooms} xona</div>
                </div>
              )}
              {ad.area && (
                <div style={{ padding: "0.5rem 0.75rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Maydoni:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.825rem" }}>{ad.area} m²</div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.6, fontSize: "0.9rem", whiteSpace: "pre-line" }}>
                {ad.description}
              </p>
            </div>

            {/* Features */}
            {ad.features && ad.features.length > 0 && (
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {ad.features.map((feat, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        padding: "0.3rem 0.6rem",
                        background: "var(--bg-card-subtle)",
                        borderRadius: "var(--radius-sm)",
                        fontSize: "0.8rem",
                      }}
                    >
                      <IconCircleCheck size={13} color="var(--success)" />
                      <span>{feat}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Box */}
            <div
              style={{
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "1rem",
                border: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.75rem",
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{ad.userName}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {ad.userPhone}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap" }}>
                {ad.telegramUsername && (
                  <a
                    href={`https://t.me/${ad.telegramUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: "rgba(0, 136, 204, 0.12)",
                      color: "#0088cc",
                      border: "1px solid rgba(0, 136, 204, 0.25)",
                      gap: "0.35rem",
                      textDecoration: "none",
                    }}
                  >
                    <IconTelegram size={14} />
                    <span>Telegram</span>
                  </a>
                )}

                <a
                  href={`tel:${ad.userPhone?.replace(/\s+/g, "")}`}
                  className="btn btn-primary btn-sm"
                  style={{ gap: "0.35rem", textDecoration: "none" }}
                >
                  <IconPhone size={14} />
                  <span>Qo'ng'iroq</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: "0.35rem" }}
                >
                  {copied ? <IconCheck size={14} color="var(--success)" /> : <IconCopy size={14} />}
                  <span>{copied ? "Nusxalandi" : "Nusxa"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
