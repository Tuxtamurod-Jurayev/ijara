/**
 * IjaraBozor Telegram Bot Engine
 * Bot: @ijara_buyum_bot
 * Master Admin: To'xtamurod Jo'rayev (ID: 365446274, @Perfektum_1997)
 * Powered by Node.js native fetch & Telegram Bot API
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADS_FILE = path.join(__dirname, "src", "data", "ads.json");

// Master Admin Configuration
const ADMIN_ID = 365446274;
const ADMIN_USERNAME = "perfektum_1997";

let WEB_APP_URL = process.env.WEB_APP_URL || "https://ijara-nu.vercel.app";

// In-memory or file-based subscribers tracking for broadcast
const SUBSCRIBERS_FILE = path.join(__dirname, "subscribers.json");
let subscribers = new Set([ADMIN_ID]);

try {
  if (fs.existsSync(SUBSCRIBERS_FILE)) {
    const list = JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf8"));
    subscribers = new Set(list);
  }
} catch (e) {}

function saveSubscribers() {
  try {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(Array.from(subscribers)));
  } catch (e) {}
}

// Helpers for Ads
function getAds() {
  try {
    if (fs.existsSync(ADS_FILE)) {
      return JSON.parse(fs.readFileSync(ADS_FILE, "utf8"));
    }
  } catch (err) {
    console.error("Ads o'qishda xatolik:", err.message);
  }
  return [];
}

function saveAds(ads) {
  try {
    fs.writeFileSync(ADS_FILE, JSON.stringify(ads, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Ads saqlashda xatolik:", err.message);
    return false;
  }
}

// Telegram API request wrapper
async function api(method, params = {}) {
  try {
    const res = await fetch(`${API_URL}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {
    console.error(`API Error on ${method}:`, err.message);
    return { ok: false, description: err.message };
  }
}

// Check if user is Admin
function isAdmin(user) {
  if (!user) return false;
  return (
    Number(user.id) === ADMIN_ID ||
    user.username?.toLowerCase() === ADMIN_USERNAME
  );
}

// Setup Bot
async function setupBot() {
  console.log("🤖 @ijara_buyum_bot sozlanmoqda...");

  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Bosh menyu va Web App" },
      { command: "webapp", description: "Ijara Bozor ilovasi" },
      { command: "elonlar", description: "Barcha ijara e'lonlari" },
      { command: "elon_berish", description: "Yangi ijara e'loni joylash" },
      { command: "kategoriyalar", description: "Toifalar bo'yicha ko'rish" },
      { command: "admin", description: "Admin maxsus boshqaruv paneli" },
    ],
  });

  await api("setChatMenuButton", {
    menu_button: {
      type: "web_app",
      text: "📱 Ijara Bozor",
      web_app: { url: WEB_APP_URL },
    },
  });

  const me = await api("getMe");
  if (me.ok) {
    console.log(`✅ Bot faol: @${me.result.username} (${me.result.first_name})`);
    console.log(`👑 Bosh Admin: ID ${ADMIN_ID} (@${ADMIN_USERNAME})`);
  }
}

// Format Ad Card for Telegram
function formatAdCard(ad) {
  return `
🏠 <b>${ad.title}</b>

💰 <b>Narxi:</b> ${ad.price.toLocaleString()} ${ad.currency} / ${ad.period}
📍 <b>Manzil:</b> ${ad.location}
📂 <b>Toifa:</b> ${ad.category.toUpperCase()} ${ad.rooms ? `• ${ad.rooms} xonali` : ""}
👤 <b>E'lon egasi:</b> ${ad.userName}
📞 <b>Telefon:</b> <code>${ad.userPhone}</code>
${ad.telegramUsername ? `💬 <b>Telegram:</b> @${ad.telegramUsername}` : ""}

📝 <i>${ad.description?.slice(0, 150)}...</i>
  `.trim();
}

// Notify Admin about new ad or event
export async function notifyAdmin(ad) {
  const text = `
🚨 <b>YANGI IJARA E'LONI TUSHDI!</b>

🏷 <b>Nomi:</b> ${ad.title}
💰 <b>Narxi:</b> ${ad.price.toLocaleString()} ${ad.currency} / ${ad.period}
📍 <b>Manzil:</b> ${ad.location}
👤 <b>Egasi:</b> ${ad.userName} (Tel: ${ad.userPhone})
${ad.telegramUsername ? `Telegram: @${ad.telegramUsername}` : ""}
  `.trim();

  await api("sendMessage", {
    chat_id: ADMIN_ID,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📱 WebAppda ko'rish", web_app: { url: `${WEB_APP_URL}?ad=${ad.id}` } },
          { text: "🗑 O'chirish", callback_data: `admin_del_${ad.id}` },
        ],
      ],
    },
  });
}

// Admin Panel Handler
async function handleAdminPanel(chatId) {
  const ads = getAds();
  const totalAds = ads.length;
  const vipCount = ads.filter((a) => a.isVip).length;

  const text = `
👑 <b>HURMATLI ADMIN (To'xtamurod Jo'rayev)!</b>

IjaraBozor boshqaruv markaziga xush kelibsiz.
Hozirgi tizim holati:
• 📊 <b>Jami e'lonlar:</b> ${totalAds} ta
• 👑 <b>VIP e'lonlar:</b> ${vipCount} ta
• 👥 <b>Bot foydalanuvchilari:</b> ${subscribers.size} nafar

Boshqaruv amallarini tanlang:
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📱 Admin WebApp Paneli",
            web_app: { url: `${WEB_APP_URL}?view=admin` },
          },
        ],
        [
          { text: "📋 E'lonlar moderatsiyasi", callback_data: "admin_manage_ads" },
          { text: "📊 To'liq statistika", callback_data: "admin_stats" },
        ],
        [
          { text: "📢 Xabar tarqatish (Broadcast)", callback_data: "admin_broadcast_info" },
          { text: "🔄 Yangilash", callback_data: "admin_refresh" },
        ],
      ],
    },
  });
}

// User Start Handler
async function handleStart(chatId, user) {
  subscribers.add(chatId);
  saveSubscribers();

  const isUserAdmin = isAdmin(user);

  if (isUserAdmin) {
    await handleAdminPanel(chatId);
    return;
  }

  const firstName = user?.first_name || "Foydalanuvchi";
  const text = `
Assalomu alaykum, <b>${firstName}</b>! 👋

<b>IjaraBozor</b> platformasiga xush kelibsiz! 🏠🚗
Bu yerda kvartira, uy, avtomobil va jihozlarni to'g'ridan-to'g'ri egasidan ijaraga oling yoki o'z e'loningizni joylang.

Quyidagi tugma orqali ilovani oching:
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📱 Ijara Bozor Web App",
            web_app: { url: WEB_APP_URL },
          },
        ],
        [
          { text: "📋 E'lonlar", callback_data: "cmd_ads" },
          { text: "➕ E'lon Berish", callback_data: "cmd_add" },
        ],
        [
          { text: "🏢 Kvartiralar", callback_data: "cat_kvartira" },
          { text: "🚗 Avtomobillar", callback_data: "cat_avto" },
        ],
        [
          { text: "🏡 Hovli & Dacha", callback_data: "cat_hovli" },
          { text: "💼 Ofislar", callback_data: "cat_ofis" },
        ],
        [
          { text: "🔍 Qidiruv", callback_data: "cmd_search" },
          { text: "📞 Yordam", callback_data: "cmd_help" },
        ],
      ],
    },
  });
}

// Send ads list
async function sendAdsList(chatId, categoryFilter = null, isAdminMode = false) {
  const allAds = getAds();
  const ads = categoryFilter
    ? allAds.filter((a) => a.category.toLowerCase() === categoryFilter.toLowerCase())
    : allAds;

  if (ads.length === 0) {
    await api("sendMessage", {
      chat_id: chatId,
      text: "Hozircha faol e'lonlar topilmadi.",
    });
    return;
  }

  for (const ad of ads.slice(0, 4)) {
    const caption = formatAdCard(ad);
    const inlineButtons = [
      [
        {
          text: "📱 Web Appda ko'rish",
          web_app: { url: `${WEB_APP_URL}?ad=${ad.id}` },
        },
      ],
    ];

    if (isAdminMode) {
      inlineButtons.push([
        { text: "🗑 E'lonni o'chirish", callback_data: `admin_del_${ad.id}` },
      ]);
    } else if (ad.telegramUsername) {
      inlineButtons[0].push({
        text: "💬 Telegram",
        url: `https://t.me/${ad.telegramUsername}`,
      });
    }

    if (ad.image && ad.image.startsWith("http")) {
      await api("sendPhoto", {
        chat_id: chatId,
        photo: ad.image,
        caption: caption,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: inlineButtons },
      });
    } else {
      await api("sendMessage", {
        chat_id: chatId,
        text: caption,
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: inlineButtons },
      });
    }
  }

  await api("sendMessage", {
    chat_id: chatId,
    text: `Barcha <b>${ads.length} ta</b> e'lonni filtrlari bilan to'liq Web Appda ko'rishingiz mumkin:`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📱 To'liq Web Appni ochish",
            web_app: { url: WEB_APP_URL },
          },
        ],
      ],
    },
  });
}

// Handle updates
async function handleUpdate(update) {
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text || "";
    const user = msg.from;

    subscribers.add(chatId);
    saveSubscribers();

    if (text.startsWith("/start")) {
      await handleStart(chatId, user);
    } else if (text === "/admin") {
      if (isAdmin(user)) {
        await handleAdminPanel(chatId);
      } else {
        await api("sendMessage", {
          chat_id: chatId,
          text: "Sizda admin huquqlari yo'q. Ushbu buyruq faqat @Perfektum_1997 uchun.",
        });
      }
    } else if (text === "/webapp") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "IjaraBozor Web App ilovasini ochish:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 Ilovani ochish", web_app: { url: WEB_APP_URL } }],
          ],
        },
      });
    } else if (text === "/elonlar") {
      await sendAdsList(chatId, null, isAdmin(user));
    } else if (text === "/elon_berish") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "E'lon berish uchun formani oching:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ E'lon Berish (Web App)", web_app: { url: `${WEB_APP_URL}?action=create` } }],
          ],
        },
      });
    } else if (text === "/kategoriyalar") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Kerakli toifani tanlang:",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🏢 Kvartiralar", callback_data: "cat_kvartira" },
              { text: "🏡 Hovli va Dacha", callback_data: "cat_hovli" },
            ],
            [
              { text: "🚗 Avtomobillar", callback_data: "cat_avto" },
              { text: "💼 Ofislar", callback_data: "cat_ofis" },
            ],
          ],
        },
      });
    } else {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Pastdagi menyu tugmasi orqali ilovani ochishingiz mumkin.",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 Ijara Bozor Web App", web_app: { url: WEB_APP_URL } }],
          ],
        },
      });
    }
  }

  // Handle Callback queries
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;
    const user = cb.from;

    await api("answerCallbackQuery", { callback_query_id: cb.id });

    if (data === "cmd_ads") {
      await sendAdsList(chatId, null, isAdmin(user));
    } else if (data === "cmd_add") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "E'lon berish formasi:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "➕ E'lon Berish Formasi", web_app: { url: `${WEB_APP_URL}?action=create` } }],
          ],
        },
      });
    } else if (data.startsWith("cat_")) {
      const cat = data.replace("cat_", "");
      await sendAdsList(chatId, cat, isAdmin(user));
    } else if (data === "admin_manage_ads") {
      await sendAdsList(chatId, null, true);
    } else if (data.startsWith("admin_del_")) {
      const adId = data.replace("admin_del_", "");
      const ads = getAds();
      const newAds = ads.filter((a) => a.id !== adId);
      saveAds(newAds);
      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ E'lon (${adId}) muvaffaqiyatli o'chirildi!`,
      });
    } else if (data === "admin_stats" || data === "admin_refresh") {
      await handleAdminPanel(chatId);
    } else if (data === "admin_broadcast_info") {
      await api("sendMessage", {
        chat_id: chatId,
        text: `📢 <b>Foydalanuvchilarga xabar yuborish:</b>\nHozirda botda ${subscribers.size} nafar faol foydalanuvchi bor.`,
        parse_mode: "HTML",
      });
    } else if (data === "cmd_search") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Qidiruv Web Appda:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔍 Qidiruvni ochish", web_app: { url: WEB_APP_URL } }],
          ],
        },
      });
    } else if (data === "cmd_help") {
      await api("sendMessage", {
        chat_id: chatId,
        text: `Aloqa uchun: @${ADMIN_USERNAME} yoki +998 71 200 00 00`,
      });
    }
  }
}

// Long Polling Engine
async function startPolling() {
  await setupBot();
  let offset = 0;
  console.log("⚡ Bot xabarlarni tinglamoqda...");

  while (true) {
    try {
      const res = await api("getUpdates", {
        offset: offset,
        timeout: 25,
      });

      if (res.ok && res.result && res.result.length > 0) {
        for (const update of res.result) {
          offset = update.update_id + 1;
          await handleUpdate(update);
        }
      }
    } catch (err) {
      console.error("Polling loop xatosi:", err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();
