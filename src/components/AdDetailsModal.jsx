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
} from "lucide-react";

export const AdDetailsModal = ({ ad, onClose }) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!ad) return null;

  const handleCopyPhone = () => {
    if (ad.userPhone) {
      navigator.clipboard.writeText(ad.userPhone);
      setCopied(true);
      showToast("Telefon raqami nusxalandi!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: `${ad.title} — ${ad.price} ${ad.currency} / ${ad.period}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
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
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>
              {ad.category}
            </span>
            <span className="badge badge-success">Faol e'lon</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
          {/* Main Image */}
          <div style={{ width: "100%", maxHeight: "360px", overflow: "hidden", position: "relative" }}>
            <img
              src={ad.image}
              alt={ad.title}
              style={{ width: "100%", height: "340px", objectFit: "cover" }}
            />
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
                <span style={{ fontSize: "0.85rem", fontWeight: "500", opacity: 0.8, marginLeft: "4px" }}>
                  / {ad.period}
                </span>
              </div>
            </div>
          </div>

          {/* Details Content */}
          <div style={{ padding: "1.5rem" }}>
            {/* Title */}
            <h2
              style={{
                fontSize: "1.45rem",
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

            {/* Seller Contact Card */}
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
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    E'lon egasi (Aloqa uchun)
                  </div>
                </div>
              </div>

              {/* Action Buttons for calling / copying phone */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
