import React from "react";
import { useApp } from "../context/AppContext";
import { X, Trash2, ExternalLink, Calendar, MapPin, Tag } from "lucide-react";

export const UserAdsModal = ({ user, onClose, onSelectAd }) => {
  const { ads, deleteAd, currentUser } = useApp();

  if (!user) return null;

  // Filter ads by this user
  const userAds = ads.filter((ad) => ad.userId === user.id);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "720px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                {user.fullName}ning E'lonlari
              </h3>
              <span className="badge badge-primary">{userAds.length} ta e'lon</span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "2px" }}>
              Login: @{user.username} | Tel: {user.phone}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.35rem", borderRadius: "50%" }}
          >
            <X size={17} />
          </button>
        </div>

        {/* Ads List Body */}
        <div className="modal-body" style={{ maxHeight: "65vh", overflowY: "auto" }}>
          {userAds.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "1rem" }}>Bu foydalanuvchi hali birorta ham e'lon joylamagan.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {userAds.map((ad) => (
                <div
                  key={ad.id}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    padding: "0.85rem",
                    borderRadius: "var(--radius-md)",
                    background: "var(--bg-card-subtle)",
                    border: "1px solid var(--border)",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={ad.image}
                    alt={ad.title}
                    style={{
                      width: "90px",
                      height: "75px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-sm)",
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.25rem" }}>
                      <span className="badge badge-primary" style={{ fontSize: "0.7rem", padding: "0.15rem 0.4rem" }}>
                        {ad.category}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>
                        {ad.createdAt}
                      </span>
                    </div>

                    <h4
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "var(--text-main)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "0.25rem",
                      }}
                      title={ad.title}
                    >
                      {ad.title}
                    </h4>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <strong style={{ color: "var(--primary)" }}>
                        {ad.price.toLocaleString()} {ad.currency} / {ad.period}
                      </strong>
                      <span>•</span>
                      <span>{ad.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectAd(ad);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "0.4rem 0.65rem", fontSize: "0.8rem" }}
                      title="Batafsil ko'rish"
                    >
                      <ExternalLink size={14} />
                      <span className="hide-on-mobile">Ko'rish</span>
                    </button>

                    {(currentUser?.role === "admin" || currentUser?.id === ad.userId) && (
                      <button
                        onClick={() => {
                          if (window.confirm("Bu e'lonni o'chirishga ishonchingiz komilmi?")) {
                            deleteAd(ad.id);
                          }
                        }}
                        className="btn btn-danger btn-sm"
                        style={{ padding: "0.4rem 0.65rem" }}
                        title="O'chirish"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
