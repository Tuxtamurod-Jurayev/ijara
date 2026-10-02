import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  IconX as X,
  IconPlusCircle as Plus,
  IconCamera,
  IconTrash,
  IconSend,
  IconAlertTriangle,
  IconCircleCheck,
  IconMapPin,
  IconPhone,
} from "./icons";

// Curated high quality presets for quick testing (3 per category)
const PRESET_COLLECTIONS = {
  kvartira: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
  ],
  avto: [
    "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
  ],
  hovli: [
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
  ],
  ofis: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
  ],
};

export const CreateAdModal = ({ isOpen, onClose }) => {
  const { currentUser, createAd, showToast } = useApp();

  // 1. Nomi (Title)
  const [title, setTitle] = useState("");

  // 2. Rasmlar (eng kamida 3 ta)
  const [images, setImages] = useState(PRESET_COLLECTIONS.kvartira);
  const [newImageUrl, setNewImageUrl] = useState("");

  // 3. Kunlik narxi
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("UZS");

  // 4. Telegram / Telefon nomer
  const [userPhone, setUserPhone] = useState(currentUser?.phone || "+998 ");
  const [userName, setUserName] = useState(currentUser?.fullName || "");
  const [telegramUsername, setTelegramUsername] = useState(
    currentUser?.username && !currentUser.username.startsWith("user")
      ? currentUser.username
      : ""
  );

  // 5. Manzil va Toifa
  const [location, setLocation] = useState("Toshkent sh., ");
  const [category, setCategory] = useState("kvartira");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle uploading photos from device
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target.result;
        setImages((prev) => [...prev, resultUrl]);
      };
      reader.readAsDataURL(file);
    });
    showToast(`${files.length} ta rasm yuklandi!`);
  };

  // Add image via URL
  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
    showToast("Rasm qo'shildi!");
  };

  // Remove single image
  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  // Load preset 3 images for selected category
  const handleLoadPresets = (cat) => {
    const list = PRESET_COLLECTIONS[cat] || PRESET_COLLECTIONS.kvartira;
    setImages(list);
    showToast(`${cat.toUpperCase()} uchun 3 ta rasm tanlandi!`);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast("E'lon nomini kiritishingiz shart!", "warning");
      return;
    }

    // Validation: At least 3 photos required
    if (images.length < 3) {
      showToast(
        `E'lon uchun kamida 3 ta rasm yuklash shart! Hozirda: ${images.length} ta.`,
        "danger"
      );
      return;
    }

    if (!price || Number(price) <= 0) {
      showToast("Kunlik narxni to'g'ri kiriting!", "warning");
      return;
    }

    if (!userPhone.trim() || userPhone.trim().length < 9) {
      showToast("Bog'lanish uchun telefon raqamini to'liq kiriting!", "warning");
      return;
    }

    if (!location.trim()) {
      showToast("Joylashuv manzilini kiriting!", "warning");
      return;
    }

    setIsSubmitting(true);

    const res = await createAd({
      title: title.trim(),
      category,
      price: Number(price),
      currency,
      period: "kuniga",
      rentalType: "kunlik",
      location: location.trim(),
      userName: userName.trim() || (currentUser ? currentUser.fullName : "E'lon Egasi"),
      userPhone: userPhone.trim(),
      telegramUsername: telegramUsername.replace("@", "").trim(),
      image: images[0],
      images: images,
      description:
        description.trim() ||
        `${title}. Kunlik ijara narxi: ${Number(price).toLocaleString()} ${currency}. Manzil: ${location}. Bog'lanish: ${userPhone}.`,
      features: ["Kunlik ijara", "Ishonchli", "Tezkor aloqa"],
      isVip: false,
    });

    setIsSubmitting(false);

    if (res.success) {
      onClose();
      // Reset form
      setTitle("");
      setPrice("");
      setImages(PRESET_COLLECTIONS.kvartira);
      setDescription("");
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
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "var(--primary-light)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                Yangi Ijara E'loni Joylash
              </h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Web App va Telegram bot (@ijara_buyum_bot) ga avtomatik yuboriladi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.35rem", borderRadius: "50%" }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Form */}
        <div className="modal-body" style={{ padding: "1.25rem 1.5rem 1.75rem" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            
            {/* 1. Nomi */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                1. E'lon nomi <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Masalan: Chilonzorda shinam 2 xonali kvartira yoki Chevrolet Gentra 2024"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* 2. Rasmlar (Kamida 3 ta) */}
            <div
              style={{
                background: "var(--bg-card-subtle)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                border: images.length < 3 ? "1px dashed var(--danger)" : "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                <div>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                    <IconCamera size={16} color="var(--primary)" />
                    2. Fotosuratlar (Kamida 3 ta rasm shart) <span style={{ color: "var(--danger)" }}>*</span>
                  </label>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Telefoningiz yoki kompyuteringizdan rasm yuklang
                  </p>
                </div>

                {images.length < 3 ? (
                  <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>
                    <IconAlertTriangle size={12} /> {images.length} / 3 ta yuklandi
                  </span>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
                    <IconCircleCheck size={12} /> {images.length} ta rasm (Yetarli)
                  </span>
                )}
              </div>

              {/* Upload Controls */}
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <label
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                >
                  <IconCamera size={14} />
                  <span>Qurilmadan yuklash</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </label>

                <button
                  type="button"
                  onClick={() => handleLoadPresets(category)}
                  className="btn btn-sm"
                  style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--primary)", border: "none", fontSize: "0.78rem" }}
                >
                  📸 3 ta tayyor rasm yuklash
                </button>
              </div>

              {/* URL qo'shish */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <input
                  type="url"
                  className="input-field"
                  placeholder="Yoki rasm havolasini (URL) kiriting..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  style={{ fontSize: "0.82rem", padding: "0.4rem 0.75rem" }}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn btn-secondary btn-sm"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Qo'shish
                </button>
              </div>

              {/* Images Preview Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                  gap: "0.5rem",
                  maxHeight: "180px",
                  overflowY: "auto",
                  padding: "0.25rem",
                }}
              >
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      borderRadius: "6px",
                      overflow: "hidden",
                      height: "70px",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <img
                      src={img}
                      alt={`Rasm ${idx + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(239, 68, 68, 0.85)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      title="O'chirish"
                    >
                      <IconTrash size={11} />
                    </button>
                    {idx === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.65)",
                          color: "#fff",
                          fontSize: "0.6rem",
                          textAlign: "center",
                          padding: "1px 0",
                        }}
                      >
                        Asosiy
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Kunlik Narxi */}
            <div className="form-grid-3">
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  3. Kunlik ijara narxi <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="number"
                  className="input-field"
                  placeholder="Masalan: 250000 yoki 30"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Valyuta
                </label>
                <select
                  className="input-field"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="UZS">UZS (so'm)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Muddati
                </label>
                <input
                  type="text"
                  className="input-field"
                  value="Kuniga"
                  disabled
                  style={{ opacity: 0.85, background: "var(--bg-card-subtle)" }}
                />
              </div>
            </div>

            {/* 4. Telegram / Telefon Nomer */}
            <div className="form-grid-2">
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  4. Telefon / Telegram nomer <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="tel"
                  className="input-field"
                  placeholder="+998 90 123 45 67"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                />
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                  Bot orqali avtomatik jo'natiladi
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Ismingiz (E'lon egasi)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ismingizni kiriting"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>

            {/* 5. Manzil va Toifa */}
            <div className="form-grid-split">
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  5. Manzil (Joylashuv) <span style={{ color: "var(--danger)" }}>*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Masalan: Toshkent sh., Chilonzor 9-mavze"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Toifa
                </label>
                <select
                  className="input-field"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (PRESET_COLLECTIONS[e.target.value]) {
                      setImages(PRESET_COLLECTIONS[e.target.value]);
                    }
                  }}
                >
                  <option value="kvartira">🏢 Kvartira</option>
                  <option value="hovli">🏡 Hovli / Dacha</option>
                  <option value="avto">🚗 Avtomobil</option>
                  <option value="ofis">💼 Ofis / Bino</option>
                  <option value="texnika">📷 Texnika / Jihoz</option>
                </select>
              </div>
            </div>

            {/* Ixtiyoriy: Tavsif */}
            <div>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Qo'shimcha tavsif (Ixtiyoriy)
              </label>
              <textarea
                className="input-field"
                rows="2"
                placeholder="Qo'shimcha qulayliklar, shartlar haqida ma'lumot..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || images.length < 3}
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "0.85rem",
                fontWeight: 800,
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <IconSend size={18} />
              <span>
                {isSubmitting ? "Joylanmoqda..." : "E'lonni joylash (Web App & Telegram Bot)"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
