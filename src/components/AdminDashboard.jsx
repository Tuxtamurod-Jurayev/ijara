import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { UserAdsModal } from "./UserAdsModal";
import { sendAdToTelegram, getRecentChats } from "../utils/telegram";
import {
  Users,
  Layers,
  Building,
  Car,
  Trash2,
  Eye,
  Send,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  Settings,
  Bot,
  RefreshCw,
} from "lucide-react";


export const AdminDashboard = ({ onSelectAd }) => {
  const {
    users,
    ads,
    deleteUser,
    deleteAd,
    telegramConfig,
    setTelegramConfig,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState("users"); // 'users' | 'ads' | 'telegram'
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserForAds, setSelectedUserForAds] = useState(null);

  // Telegram test states
  const [testToken, setTestToken] = useState(telegramConfig.botToken || "");
  const [testChatId, setTestChatId] = useState(telegramConfig.chatId || "");
  const [autoSend, setAutoSend] = useState(telegramConfig.autoSend || false);
  const [isTesting, setIsTesting] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);


  // Filtered users
  const filteredUsers = users.filter((u) => {
    const q = userSearch.toLowerCase();
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.phone.includes(q)
    );
  });

  // Calculate ads count for each user
  const getUserAdsCount = (userId) => {
    return ads.filter((ad) => ad.userId === userId).length;
  };

  // Save telegram configuration
  const handleSaveTelegram = (e) => {
    e.preventDefault();
    setTelegramConfig({
      botToken: testToken.trim(),
      chatId: testChatId.trim(),
      autoSend: autoSend,
    });
    showToast("Telegram sozlamalari saqlandi!");
  };

  // Test sending notification to Telegram
  const handleSendTestMessage = async () => {
    if (!testToken || !testChatId) {
      showToast("Token va Chat ID kiritilishi shart!", "danger");
      return;
    }

    setIsTesting(true);
    const mockAd = {
      title: "Test E'lon: Chilonzorda 2 xonali kvartira",
      category: "Kvartira",
      price: 500,
      currency: "USD",
      period: "oyiga",
      location: "Toshkent sh., Chilonzor tumani",
      userName: "Bosh Administrator",
      userPhone: "+998 71 200 00 00",
      description: "Bu IjaraBozor tizimidan yuborilgan sinov xabari.",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    };

    const res = await sendAdToTelegram(mockAd, testToken.trim(), testChatId.trim());
    setIsTesting(false);

    if (res.success) {
      showToast("Sinov xabari Telegramga muvaffaqiyatli bordi!", "success");
    } else {
      showToast(`Xatolik: ${res.error}`, "danger");
    }
  };

  const handleFetchRecentChats = async () => {
    if (!testToken.trim()) {
      showToast("Bot token kiritilmagan", "warning");
      return;
    }
    setIsFetchingChats(true);
    const res = await getRecentChats(testToken.trim());
    setIsFetchingChats(false);
    if (res.success && res.chats.length > 0) {
      setRecentChats(res.chats);
      showToast(`${res.chats.length} ta suhbat/kanal topildi!`);
    } else {
      showToast("Hozircha botda xabarlar topilmadi. Avval botga @ijara_buyum_bot da /start bosing.", "warning");
    }
  };


  return (
    <div className="container" style={{ padding: "2rem 1.25rem 4rem" }}>
      {/* Dashboard Top Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(139, 92, 246, 0.12) 100%)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          padding: "1.75rem",
          marginBottom: "2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "var(--accent-gradient)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(139, 92, 246, 0.35)",
            }}
          >
            <Shield size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "0.25rem" }}>
              Administrator Boshqaruv Paneli
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Foydalanuvchilar, e'lonlar statistikasi va Telegram bot nazorati
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className="badge badge-success" style={{ padding: "0.45rem 0.85rem", fontSize: "0.85rem" }}>
            <CheckCircle2 size={15} /> Tizim holati: Faol
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Card 1: Users */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Foydalanuvchilar
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800 }}>{users.length} nafar</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Barcha ro'yxatdan o'tganlar
          </div>
        </div>

        {/* Card 2: Total Ads */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Jami E'lonlar
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800 }}>{ads.length} ta</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Platformadagi barcha e'lonlar
          </div>
        </div>

        {/* Card 3: Apartments */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Kvartiralar / Uylar
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Building size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.85rem", fontWeight: 800 }}>
            {ads.filter((a) => a.category === "kvartira" || a.category === "hovli").length} ta
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Ko'chmas mulk ijarasi
          </div>
        </div>

        {/* Card 4: Telegram Status */}
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Telegram Bot
            </span>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(0, 136, 204, 0.15)", color: "#0088cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Send size={18} />
            </div>
          </div>
          <div style={{ fontSize: "1.1rem", fontWeight: 800, color: telegramConfig.botToken ? "var(--success)" : "var(--text-muted)" }}>
            {telegramConfig.botToken ? "Ulanish Tayyor" : "Ulanmagan"}
          </div>
          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {telegramConfig.autoSend ? "Avto-yuborish yoqilgan" : "Kanal yoki guruhga integratsiya"}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "users" ? "2.5px solid var(--primary)" : "2.5px solid transparent",
            color: activeTab === "users" ? "var(--primary)" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Users size={17} />
          <span>Foydalanuvchilar ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("ads")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "ads" ? "2.5px solid var(--primary)" : "2.5px solid transparent",
            color: activeTab === "ads" ? "var(--primary)" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Layers size={17} />
          <span>Barcha E'lonlar ({ads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("telegram")}
          style={{
            padding: "0.75rem 1.25rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "telegram" ? "2.5px solid var(--primary)" : "2.5px solid transparent",
            color: activeTab === "telegram" ? "var(--primary)" : "var(--text-muted)",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Send size={17} />
          <span>Telegram Bot Integratsiyasi</span>
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === "users" && (
        <div className="card" style={{ padding: "1.25rem" }}>
          {/* Search users */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
            <div style={{ position: "relative", minWidth: "260px" }}>
              <Search size={17} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Foydalanuvchini qidirish..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="input-field"
                style={{ paddingLeft: "2.4rem", paddingBottom: "0.5rem", paddingTop: "0.5rem", fontSize: "0.85rem" }}
              />
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              Topildi: {filteredUsers.length} nafar
            </div>
          </div>

          {/* Users Table */}
          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Login</th>
                  <th>Telefon raqami</th>
                  <th>Sana</th>
                  <th>Joylagan reklamalari</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const adsCount = getUserAdsCount(user.id);
                  return (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover" }}
                          />
                          <span style={{ fontWeight: 700 }}>{user.fullName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-primary">@{user.username}</span>
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                        {user.phone}
                      </td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                        {user.createdAt}
                      </td>
                      <td>
                        <button
                          onClick={() => setSelectedUserForAds(user)}
                          className="btn btn-sm"
                          style={{
                            background: adsCount > 0 ? "var(--primary-light)" : "var(--bg-card-subtle)",
                            color: adsCount > 0 ? "var(--primary)" : "var(--text-muted)",
                            border: "1px solid var(--border)",
                            fontWeight: 600,
                            padding: "0.3rem 0.75rem",
                          }}
                        >
                          <Layers size={14} />
                          <span>{adsCount} ta e'lon</span>
                          <span style={{ fontSize: "0.75rem", textDecoration: "underline", marginLeft: "4px" }}>
                            (Ko'rish)
                          </span>
                        </button>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "0.45rem" }}>
                          <button
                            onClick={() => setSelectedUserForAds(user)}
                            className="btn btn-sm btn-secondary"
                            title="E'lonlarini ko'rish"
                          >
                            <Eye size={14} />
                            <span className="hide-on-mobile">E'lonlari</span>
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Haqiqatan ham "${user.fullName}"ni va uning barcha e'lonlarini o'chirmoqchimisiz?`)) {
                                deleteUser(user.id);
                              }
                            }}
                            className="btn btn-sm btn-danger"
                            title="Foydalanuvchini o'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ALL ADS (MODERATION) */}
      {activeTab === "ads" && (
        <div className="card" style={{ padding: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Barcha Joylashtirilgan Reklamalar ({ads.length} ta)
            </h3>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>E'lon nomi va rasmi</th>
                  <th>Toifa</th>
                  <th>Narxi</th>
                  <th>E'lon egasi</th>
                  <th>Manzil</th>
                  <th style={{ textAlign: "right" }}>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => (
                  <tr key={ad.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", maxWidth: "280px" }}>
                        <img
                          src={ad.image}
                          alt={ad.title}
                          style={{ width: "45px", height: "45px", borderRadius: "8px", objectFit: "cover" }}
                        />
                        <span
                          style={{
                            fontWeight: 600,
                            fontSize: "0.875rem",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={ad.title}
                        >
                          {ad.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-primary" style={{ textTransform: "capitalize" }}>
                        {ad.category}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                      {ad.price.toLocaleString()} {ad.currency} / {ad.period}
                    </td>
                    <td>
                      <div style={{ fontSize: "0.85rem" }}>{ad.userName}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{ad.userPhone}</div>
                    </td>
                    <td style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {ad.location}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "0.45rem" }}>
                        <button
                          onClick={() => onSelectAd(ad)}
                          className="btn btn-sm btn-secondary"
                          title="Batafsil ko'rish"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Bu e'lonni o'chirmoqchimisiz?")) {
                              deleteAd(ad.id);
                            }
                          }}
                          className="btn btn-sm btn-danger"
                          title="O'chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TELEGRAM BOT INTEGRATION */}
      {activeTab === "telegram" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {/* Config card */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(0, 136, 204, 0.15)", color: "#0088cc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Send size={18} />
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  Telegram Bot Sozlamalari
                </h3>
              </div>
              <a
                href="https://t.me/ijara_buyum_bot"
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-secondary"
                style={{ fontSize: "0.75rem", gap: "0.3rem", padding: "0.3rem 0.65rem" }}
              >
                <span>@ijara_buyum_bot</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Active Bot status pill */}
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "rgba(0, 136, 204, 0.08)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(0, 136, 204, 0.2)",
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1.25rem",
              }}
            >
              <Bot size={20} color="#0088cc" />
              <div style={{ fontSize: "0.825rem" }}>
                <span style={{ fontWeight: 700 }}>Ijara buyumlar</span> boti ulandi. Yangi e'lonlar shu bot orqali avtomat yuboriladi.
              </div>
            </div>

            <form onSubmit={handleSaveTelegram}>
              <div className="input-group">
                <label className="input-label">Bot Token (@BotFather'dan)</label>
                <input
                  type="text"
                  placeholder="Masalan: 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                  value={testToken}
                  onChange={(e) => setTestToken(e.target.value)}
                  className="input-field"
                />
              </div>

              <div className="input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                  <label className="input-label" style={{ margin: 0 }}>
                    Telegram Chat ID yoki Kanal (@username)
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
                    <span>Chat ID larni aniqlash</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Masalan: -1001234567890 yoki @ijarakanal"
                  value={testChatId}
                  onChange={(e) => setTestChatId(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Recent chats quick picker if detected */}
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
                    Topilgan suhbatlar:
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                    {recentChats.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => setTestChatId(String(c.id))}
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

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
                <input
                  type="checkbox"
                  id="autoSendCheck"
                  checked={autoSend}
                  onChange={(e) => setAutoSend(e.target.checked)}
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="autoSendCheck" style={{ fontSize: "0.875rem", cursor: "pointer", fontWeight: 500 }}>
                  Yangi e'lon qo'shilganda avtomatik botga yuborish
                </label>
              </div>


              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Saqlash
                </button>
                <button
                  type="button"
                  onClick={handleSendTestMessage}
                  disabled={isTesting}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  <Send size={15} />
                  <span>{isTesting ? "Yuborilmoqda..." : "Test xabar"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Telegram instructions guide */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.85rem" }}>
              Telegram Bot ulash yo'riqnomasi (3 qadam):
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <strong>Bot ochish:</strong> Telegramda <code>@BotFather</code> ga kiring, <code>/newbot</code> buyrug'ini yuboring va bot tokenini oling.
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <strong>Kanal / Guruh:</strong> Botingizni o'z kanalingizga admin qilib qo'shing yoki <code>@userinfobot</code> orqali o'z <code>chat_id</code> raqamingizni aniqlang.
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <strong>Telegram WebApp:</strong> Ushbu veb-ilovaning Vercel manzilini Telegram botingizning <code>Menu Button</code> qismiga bog'lab, to'liq Telegram ichida ishga tushirishingiz mumkin!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User's Ads Modal Popup */}
      {selectedUserForAds && (
        <UserAdsModal
          user={selectedUserForAds}
          onClose={() => setSelectedUserForAds(null)}
          onSelectAd={onSelectAd}
        />
      )}
    </div>
  );
};
