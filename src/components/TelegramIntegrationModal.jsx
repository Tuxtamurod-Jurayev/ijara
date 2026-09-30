import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { sendAdToTelegram, getRecentChats } from "../utils/telegram";
import {
  X,
  Send,
  Bot,
  Check,
  ExternalLink,
  RefreshCw,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export const TelegramIntegrationModal = ({ isOpen, onClose }) => {
  const { telegramConfig, setTelegramConfig, showToast } = useApp();

  const [token, setToken] = useState(telegramConfig.botToken || "");
  const [chatId, setChatId] = useState(telegramConfig.chatId || "");
  const [autoSend, setAutoSend] = useState(telegramConfig.autoSend || false);
  const [isSending, setIsSending] = useState(false);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

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
      showToast("Iltimos, Bot Token va Chat ID kiriting!", "danger");
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
      userName: "Bosh Administrator",
      userPhone: "+998 90 000 00 00",
      description: "IjaraBozor platformasi Telegram botga muvaffaqiyatli bog'landi! 🚀",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    };

    const res = await sendAdToTelegram(mockAd, token.trim(), chatId.trim());
    setIsSending(false);

    if (res.success) {
      showToast("Telegramga sinov e'loni yuborildi!", "success");
    } else {
      showToast(`Xatolik: ${res.error}`, "danger");
    }
  };

  const handleFetchRecentChats = async () => {
    if (!token.trim()) {
      showToast("Bot token kiritilmagan", "warning");
      return;
    }

    setIsFetchingChats(true);
    const res = await getRecentChats(token.trim());
    setIsFetchingChats(false);

    if (res.success && res.chats.length > 0) {
      setRecentChats(res.chats);
      showToast(`${res.chats.length} ta suhbat/kanal topildi!`);
    } else {
      showToast("Hozircha yangi xabar yo'q. Avval botga /start bosing yoki kanalga qo'shing.", "warning");
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
                @ijara_buyum_bot bilan to'g'ridan-to'g'ri aloqa
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
          {/* Active Bot Info Banner */}
          <div
            style={{
              padding: "0.85rem 1rem",
              background: "rgba(0, 136, 204, 0.08)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(0, 136, 204, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Bot size={20} color="#0088cc" />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-main)" }}>
                  Ijara buyumlar (@ijara_buyum_bot)
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Telegram tokeni faol va sozlangan
                </div>
              </div>
            </div>
            <a
              href="https://t.me/ijara_buyum_bot"
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ fontSize: "0.75rem", padding: "0.3rem 0.65rem", gap: "0.35rem" }}
            >
              <span>Botni ochish</span>
              <ExternalLink size={12} />
            </a>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
              <label className="input-label" style={{ margin: 0 }}>
                Chat ID yoki Kanal (@kanal_nomi)
              </label>
              <button
                type="button"
                onClick={handleFetchRecentChats}
                disabled={isFetchingChats}
                style={{
                  background: "none",
                  border: "none",
                  color: "#0088cc",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontWeight: 600,
                }}
              >
                <RefreshCw size={12} className={isFetchingChats ? "spinning" : ""} />
                <span>Chat ID ni aniqlash</span>
              </button>
            </div>
            <input
              type="text"
              placeholder="Masalan: -1001234567890 yoki shaxsiy chat_id"
              value={chatId}
              onChange={(e) => setChatId(e.target.value)}
              className="input-field"
            />
          </div>

          {/* If recent chats detected */}
          {recentChats.length > 0 && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.65rem",
                background: "var(--bg-card-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                Topilgan suhbatlar (Tanlash uchun bosing):
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {recentChats.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setChatId(String(c.id))}
                    className="btn btn-sm btn-secondary"
                    style={{
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      padding: "0.35rem 0.65rem",
                    }}
                  >
                    <span>{c.title} {c.username}</span>
                    <strong style={{ color: "var(--primary)" }}>{c.id}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <span>{isSending ? "Yuborilmoqda..." : "Test E'lon"}</span>
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
