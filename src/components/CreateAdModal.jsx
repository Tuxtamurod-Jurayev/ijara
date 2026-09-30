import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { REGIONS } from "../data/initialData";
import {
  X,
  Upload,
  Plus,
  DollarSign,
  MapPin,
  FileText,
  Tag,
  Sparkles,
  Send,
  Crown,
} from "lucide-react";

// Curated high quality presets for quick testing
const PRESET_IMAGES = [
  { label: "Kvartira (Interyer)", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
  { label: "Shinam Kvartira", url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" },
  { label: "Chorvoq Dacha", url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
  { label: "Chevrolet Avto", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80" },
  { label: "Biznes Ofis", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" },
  { label: "Kamera & Texnika", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80" },
];

const COMMON_FEATURES = [
  "Wi-Fi",
  "Konditsioner",
  "Mebel bilan",
  "Yevroremont",
  "Avtoturargoh",
  "Kamera / Qo'riqlash",
  "Basseyin",
  "Avtomat uzatma",
  "KASKO sug'urta",
];

export const CreateAdModal = ({ isOpen, onClose }) => {
  const { currentUser, createAd, telegramConfig } = useApp();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("kvartira");
  const [region, setRegion] = useState("Toshkent shahri");
  const [rentalType, setRentalType] = useState("oylik");
  const [rooms, setRooms] = useState("2");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [period, setPeriod] = useState("oyiga");
  const [location, setLocation] = useState("Toshkent sh., ");
  const [telegramUsername, setTelegramUsername] = useState(
    currentUser?.username && !currentUser.username.startsWith("user")
      ? currentUser.username
      : ""
  );
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState(["Wi-Fi", "Konditsioner"]);

  if (!isOpen) return null;

  const toggleFeature = (feat) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalImage = customImageUrl.trim() || image;

    const res = await createAd({
      title,
      category,
      region,
      rentalType,
      rooms: category === "kvartira" || category === "hovli" ? rooms : null,
      area: area ? Number(area) : null,
      price: Number(price),
      currency,
      period,
      location,
      telegramUsername: telegramUsername.replace("@", "").trim(),
      image: finalImage,
      images: [finalImage],
      isVip,
      description,
      features: selectedFeatures,
    });

    if (res.success) {
      onClose();
      // Reset form
      setTitle("");
      setPrice("");
      setArea("");
      setDescription("");
      setCustomImageUrl("");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "660px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              Yangi Ijara E'loni Joylash
            </h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.35rem", borderRadius: "50%" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Ad Title */}
          <div className="input-group">
            <label className="input-label">E'lon sarlavhasi / Nomi *</label>
            <input
              type="text"
              placeholder="Masalan: Chilonzorda 2 xonali toza kvartira"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Category & Region */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="input-group">
              <label className="input-label">Toifa (Kategoriya) *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="select-field"
              >
                <option value="kvartira">Kvartiralar</option>
                <option value="hovli">Hovli va Dacha</option>
                <option value="avto">Avtomobillar</option>
                <option value="ofis">Ofis va Tijorat</option>
                <option value="texnika">Jihoz va Texnika</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Viloyat / Shahar *</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="select-field"
              >
                {REGIONS.filter((r) => r !== "Barchasi").map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rooms and Area (if property) */}
          {(category === "kvartira" || category === "hovli" || category === "ofis") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="input-group">
                <label className="input-label">Xonalar soni</label>
                <select
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                  className="select-field"
                >
                  <option value="1">1 xona</option>
                  <option value="2">2 xona</option>
                  <option value="3">3 xona</option>
                  <option value="4+">4+ xona</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Maydoni (m²)</label>
                <input
                  type="number"
                  placeholder="Masalan: 75"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          )}

          {/* Price, Currency & Period */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "0.75rem" }}>
            <div className="input-group">
              <label className="input-label">Narxi *</label>
              <input
                type="number"
                placeholder="Masalan: 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input-field"
                required
                min="1"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Valyuta</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="select-field"
              >
                <option value="USD">USD ($)</option>
                <option value="UZS">UZS (so'm)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Muddat</label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="select-field"
              >
                <option value="oyiga">Oyiga</option>
                <option value="kuniga">Kuniga</option>
                <option value="soatiga">Soatiga</option>
              </select>
            </div>
          </div>

          {/* Location & Telegram Username */}
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "1rem" }}>
            <div className="input-group">
              <label className="input-label">Aniq Manzil *</label>
              <input
                type="text"
                placeholder="Masalan: Yunusobod 4-mavze, 12-uy"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Telegram (@username)</label>
              <input
                type="text"
                placeholder="Masalan: sardor_rent"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Image Chooser */}
          <div className="input-group">
            <label className="input-label">E'lon rasmi (Variantni tanlang yoki havola kiriting)</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", marginBottom: "0.5rem" }}>
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setImage(preset.url);
                    setCustomImageUrl("");
                  }}
                  style={{
                    border: image === preset.url && !customImageUrl ? "2px solid var(--primary)" : "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    overflow: "hidden",
                    cursor: "pointer",
                    padding: "0.25rem",
                    background: "var(--bg-card-subtle)",
                    textAlign: "center",
                  }}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    style={{ width: "100%", height: "45px", objectFit: "cover", borderRadius: "4px" }}
                  />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{preset.label}</span>
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Yoki o'zingizning rasm havolangizni (URL) kiriting..."
              value={customImageUrl}
              onChange={(e) => setCustomImageUrl(e.target.value)}
              className="input-field"
              style={{ fontSize: "0.85rem" }}
            />
          </div>

          {/* Features selection */}
          <div className="input-group">
            <label className="input-label">Qulayliklar (Tanlang):</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {COMMON_FEATURES.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    type="button"
                    key={feat}
                    onClick={() => toggleFeature(feat)}
                    className="btn btn-sm"
                    style={{
                      background: isSelected ? "var(--primary-light)" : "var(--bg-card-subtle)",
                      color: isSelected ? "var(--primary)" : "var(--text-muted)",
                      border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      fontSize: "0.78rem",
                      padding: "0.3rem 0.65rem",
                    }}
                  >
                    {feat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* VIP E'lon Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <input
              type="checkbox"
              id="isVipCheck"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="isVipCheck" style={{ fontSize: "0.875rem", cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <Crown size={15} color="#f59e0b" />
              <span>VIP E'lon sifatida belgilash (Yuqorida chiqishi uchun)</span>
            </label>
          </div>

          {/* Description */}
          <div className="input-group">
            <label className="input-label">Batafsil ma'lumot / Tavsif *</label>
            <textarea
              placeholder="Ijara shartlari, qulayliklar va qo'shimcha ma'lumotlarni yozing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
              rows={4}
              required
            />
          </div>

          {/* Telegram notification status badge */}
          {telegramConfig.autoSend && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 0.85rem",
                borderRadius: "var(--radius-md)",
                background: "rgba(0, 136, 204, 0.1)",
                color: "#0088cc",
                fontSize: "0.82rem",
                marginBottom: "1rem",
              }}
            >
              <Send size={15} />
              <span>E'lon saqlangach, avtomatik ravishda @ijara_buyum_bot ga ham yuboriladi</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}
          >
            <Sparkles size={18} />
            <span>E'lonni Joylashtirish</span>
          </button>
        </form>
      </div>
    </div>
  );
};
