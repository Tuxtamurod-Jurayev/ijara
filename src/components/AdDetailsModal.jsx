import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  X,
  MapPin,
  Calendar,
  Phone,
  Eye,
  CheckCircle,
  Copy,
  Check,
  Send,
  User,
  Share2,
  Heart,
  Crown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";

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
      showToast("E'lon havolasi nusxalandi!");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "720px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
                }}
              >
                <Crown size={13} /> VIP E'lon
              </span>
            )}
            <span className="badge badge-success">Faol e'lon</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <button
              onClick={() => toggleFavorite(ad.id)}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.4rem", borderRadius: "50%" }}
              title={isFavorite ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
            >
              <Heart
                size={16}
                color={isFavorite ? "#ef4444" : "var(--text-muted)"}
                fill={isFavorite ? "#ef4444" : "none"}
              />
            </button>
            <button
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.4rem", borderRadius: "50%" }}
              title="Ulashish"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm"
              style={{ padding: "0.4rem", borderRadius: "50%" }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: "0 0 1.5rem 0" }}>
          {/* Main Image Gallery Preview */}
          <div
            style={{
              width: "100%",
              height: "360px",
              backgroundColor: "var(--bg-card-subtle)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <img
              src={currentImg}
              alt={ad.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            {/* Left/Right controls if multiple photos */}
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
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronLeft size={20} />
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
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "rgba(15, 23, 42, 0.75)",
                    border: "none",
                    borderRadius: "50%",
                    width: "36px",
                    height: "36px",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Price Badge Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                background: "rgba(15, 23, 42, 0.88)",
                backdropFilter: "blur(10px)",
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-lg)",
                color: "#ffffff",
                boxShadow: "var(--shadow-lg)",
              }}
            >
              <div style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                {ad.price.toLocaleString()} {ad.currency}
                <span style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.85, marginLeft: "4px" }}>
                  / {ad.period}
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnails row if multiple images */}
          {imagesList.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                padding: "0.75rem 1.5rem",
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
                    width: "70px",
                    height: "50px",
                    flexShrink: 0,
                  }}
                >
                  <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}

          {/* Details Content */}
          <div style={{ padding: "1.5rem" }}>
            {/* Title */}
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: "800",
                lineHeight: 1.35,
                color: "var(--text-main)",
                marginBottom: "0.85rem",
              }}
            >
              {ad.title}
            </h2>

            {/* Meta row: Location, Date, Views */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1.25rem",
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                paddingBottom: "1.25rem",
                borderBottom: "1px solid var(--border)",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <MapPin size={16} color="var(--primary)" />
                <span>{ad.location}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Calendar size={16} />
                <span>Joylashtirildi: {ad.createdAt}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                <Eye size={16} />
                <span>Ko'rishlar: {ad.viewsCount}</span>
              </div>
            </div>

            {/* Specification Grid (Like Airbnb/OLX) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              {ad.region && (
                <div style={{ padding: "0.6rem 0.85rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Hudud:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{ad.region}</div>
                </div>
              )}
              {ad.rooms && (
                <div style={{ padding: "0.6rem 0.85rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Xonalar soni:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{ad.rooms} xonali</div>
                </div>
              )}
              {ad.area && (
                <div style={{ padding: "0.6rem 0.85rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Maydoni:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>{ad.area} m²</div>
                </div>
              )}
              {ad.rentalType && (
                <div style={{ padding: "0.6rem 0.85rem", background: "var(--bg-card-subtle)", borderRadius: "var(--radius-md)" }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ijara turi:</div>
                  <div style={{ fontWeight: 700, fontSize: "0.875rem", textTransform: "capitalize" }}>
                    {ad.rentalType}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div style={{ marginBottom: "1.5rem" }}>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-main)" }}>
                Batafsil ma'lumot:
              </h4>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem", whiteSpace: "pre-line" }}>
                {ad.description}
              </p>
            </div>

            {/* Features / Qulayliklar */}
            {ad.features && ad.features.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.6rem", color: "var(--text-main)" }}>
                  Qulayliklar va Imkoniyatlar:
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.5rem" }}>
                  {ad.features.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.45rem",
                        padding: "0.45rem 0.75rem",
                        background: "var(--bg-card-subtle)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.85rem",
                        color: "var(--text-main)",
                      }}
                    >
                      <CheckCircle size={15} color="var(--success)" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seller Contact Card with Phone & Telegram */}
            <div
              style={{
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-lg)",
                padding: "1.25rem",
                border: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--primary-gradient)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                  }}
                >
                  <User size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text-main)" }}>
                    {ad.userName}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    E'lon egasi {ad.telegramUsername ? `(@${ad.telegramUsername})` : ""}
                  </div>
                </div>
              </div>

              {/* Action Buttons for calling / Telegram / copying phone */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}>
                {ad.telegramUsername && (
                  <a
                    href={`https://t.me/${ad.telegramUsername}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm"
                    style={{
                      background: "rgba(0, 136, 204, 0.15)",
                      color: "#0088cc",
                      border: "1px solid rgba(0, 136, 204, 0.3)",
                      gap: "0.45rem",
                      textDecoration: "none",
                    }}
                  >
                    <Send size={15} />
                    <span>Telegramda yozish</span>
                  </a>
                )}

                <a
                  href={`tel:${ad.userPhone?.replace(/\s+/g, "")}`}
                  className="btn btn-primary btn-sm"
                  style={{ gap: "0.45rem", textDecoration: "none" }}
                >
                  <Phone size={15} />
                  <span>Qo'ng'iroq qilish</span>
                </a>

                <button
                  onClick={handleCopyPhone}
                  className="btn btn-secondary btn-sm"
                  style={{ gap: "0.45rem" }}
                  title="Raqamdan nusxa olish"
                >
                  {copied ? <Check size={15} color="var(--success)" /> : <Copy size={15} />}
                  <span>{copied ? "Nusxalandi" : ad.userPhone}</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
