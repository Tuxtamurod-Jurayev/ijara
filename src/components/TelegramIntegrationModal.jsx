import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { sendAdToTelegram } from "../utils/telegram";
import { X, Send, Bot, Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const TelegramIntegrationModal = ({ isOpen, onClose }) => {
  const { telegramConfig, setTelegramConfig, showToast } = useApp();

  const [token, setToken] = useState(telegramConfig.botToken || "");
  const [chatId, setChatId] = useState(telegramConfig.chatId || "");
  const [autoSend, setAutoSend] = useState(telegramConfig.autoSend || false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setTelegramConfig({
      botToken: token.trim(),
      chatId: chatId.trim(),
      autoSend,
    });
    showToast("Telegram sozlamalari saqlandi!");
    onClose();
  };

  const handleTest = async () => {
    if (!token.trim() || !chatId.trim()) {
      showToast("Token va Chat ID kiritilishi shart!", "danger");
      return;
    }

    setIsSending(true);
    const mockAd = {
      title: "IjaraBozor — Sinov E'loni (Test)",
      category: "Kvartira",
      price: 600,
      currency: "USD",
      period: "oyiga",
      location: "Toshkent shahri",
      userName: "Foydalanuvchi",
      userPhone: "+998 90 000 00 00",
      description: "Telegram Bot integratsiyasi muvaffaqiyatli ishlayapti! 🚀",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    };

    const res = await sendAdToTelegram(mockAd, token.trim(), chatId.trim());
    setIsSending(false);

    if (res.success) {
      showToast("Telegramga test xabar yuborildi!", "success");
    } else {
      showToast(`Xatolik: ${res.error}`, "danger");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: "560px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "rgba(0, 136, 204, 0.15)",
                color: "#0088cc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                Telegram Bot Integratsiyasi
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                Keyingi bosqich: Bot va WebApp bilan bevosita bog'lash
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ padding: "0.35rem", borderRadius: "50%" }}
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSave} className="modal-body">
          <div
            style={{
              padding: "0.85rem",
              background: "var(--bg-card-subtle)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "1.25rem",
              lineHeight: 1.5,
            }}
          >
            Bu yerda kiritilgan Bot Token va Chat ID orqali yangi e'lonlar to'g'ridan-to'g'ri Telegram kanal yoki guruhga chiroyli rasm va tavsifi bilan avtomatik boradi.
          </div>

          <div className="input-group">
            <label className="input-label">Telegram Bot Token</label>
            <input
              type="text"
              placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Chat ID yoki Kanal (@kanal_nomi)</label>
            <input
              type="text"
              placeholder="-1001234567890 yoki @ijara_kanal"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="input-field"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1.5rem" }}>
            <input
              type="checkbox"
              id="modalAutoSend"
              checked={autoSend}
              onChange={(e) => setAutoSend(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="modalAutoSend" style={{ fontSize: "0.875rem", cursor: "pointer", fontWeight: 500 }}>
              Yangi e'lon berilganda avtomatik Telegramga uzatish
            </label>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={handleTest}
              disabled={isSending}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              <Send size={15} />
              <span>{isSending ? "Yuborilmoqda..." : "Test Xabar"}</span>
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Check size={16} />
              <span>Saqlash</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
