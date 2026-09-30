/**
 * IjaraBozor Telegram Bot Engine
 * Bot: @ijara_buyum_bot
 * Token: 8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo
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

// Default WebApp URL (supports local tunnel, ngrok, or production Vercel)
let WEB_APP_URL = process.env.WEB_APP_URL || "https://ijara-nu.vercel.app";

// Helper to read ads
function getAds() {
  try {
    if (fs.existsSync(ADS_FILE)) {
      const data = fs.readFileSync(ADS_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Ads o'qishda xatolik:", err.message);
  }
  return [];
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

// Configure Bot Menu Button & Commands
async function setupBot() {
  console.log("🤖 @ijara_buyum_bot sozlanmoqda...");

  // Set Commands
  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Bosh menyu va Web App" },
      { command: "webapp", description: "Ijara Bozor ilovasini ochish" },
      { command: "elonlar", description: "Barcha ijara e'lonlarini ko'rish" },
      { command: "elon_berish", description: "Yangi ijara e'lonini joylash" },
      { command: "kategoriyalar", description: "Toifalar (Kvartira, Uy, Avto...)" },
      { command: "qidiruv", description: "E'lonlarni qidirish" },
      { command: "admin", description: "Admin paneli haqida" },
    ],
  });

  // Set Menu Button to open Web App
  await api("setChatMenuButton", {
    menu_button: {
      type: "web_app",
      text: "📱 Ijara Bozor",
      web_app: { url: WEB_APP_URL },
    },
  });

  const me = await api("getMe");
  if (me.ok) {
    console.log(`✅ Bot muvaffaqiyatli ishga tushdi: @${me.result.username} (${me.result.first_name})`);
    console.log(`🌐 Web App manzili: ${WEB_APP_URL}`);
  } else {
    console.error("❌ Botni ishga tushirishda xatolik:", me.description);
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

📝 <b>Qisqacha tavsif:</b>
<i>${ad.description?.slice(0, 160)}...</i>
  `.trim();
}

// Send start greeting
async function handleStart(chatId, firstName = "Foydalanuvchi") {
  const text = `
Assalomu alaykum, <b>${firstName}</b>! 👋

<b>IjaraBozor</b> rasmiy Telegram botiga xush kelibsiz! 🏠🚗

Bu yerda siz:
• Kvartira, uy, dacha va ofislarni
• Avtomobillarni (kunlik/oylik)
• Maxsus texnika va asboblarni
oson ijaraga olishingiz yoki o'zingizning e'loningizni joylashtirishingiz mumkin!

Quyidagi tugmalar orqali to'liq <b>Web App</b>ni oching yoki menyudan foydalaning:
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🚀 Web Appni Ochish (To'liq interfeys)",
            web_app: { url: WEB_APP_URL },
          },
        ],
        [
          { text: "📋 Barcha E'lonlar", callback_data: "cmd_ads" },
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
          { text: "ℹ️ Yordam / Aloqa", callback_data: "cmd_help" },
        ],
      ],
    },
  });
}

// Send ads list
async function sendAdsList(chatId, categoryFilter = null) {
  const allAds = getAds();
  const ads = categoryFilter
    ? allAds.filter((a) => a.category.toLowerCase() === categoryFilter.toLowerCase())
    : allAds;

  if (ads.length === 0) {
    await api("sendMessage", {
      chat_id: chatId,
      text: "Hozircha bu toifada faol e'lonlar topilmadi.",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "➕ Birinchi bo'lib e'lon berish",
              web_app: { url: WEB_APP_URL },
            },
          ],
        ],
      },
    });
    return;
  }

  // Send top 4 ads
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

    if (ad.telegramUsername) {
      inlineButtons[0].push({
        text: "💬 Telegramda yozish",
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

  // Final summary button
  await api("sendMessage", {
    chat_id: chatId,
    text: `👆 Jami <b>${ads.length} ta</b> e'lon mavjud. Barchasini qidiruv va filtrlari bilan to'liq Web Appda ko'rishingiz mumkin!`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📱 Barcha e'lonlarni Web Appda ko'rish",
            web_app: { url: WEB_APP_URL },
          },
        ],
      ],
    },
  });
}

// Bot update handler
async function handleUpdate(update) {
  // Handle messages
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text || "";
    const firstName = msg.from?.first_name || "Foydalanuvchi";

    if (text.startsWith("/start")) {
      await handleStart(chatId, firstName);
    } else if (text === "/webapp" || text.includes("Web App")) {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Quyidagi tugma orqali <b>IjaraBozor Web App</b>ni oching:",
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🚀 Web Appni Ochish",
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
    } else if (text === "/elonlar") {
      await sendAdsList(chatId);
    } else if (text === "/elon_berish") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "E'lon berish uchun <b>Web App</b> orqali ma'lumotlarni kiriting (rasm, narx, telefon va manzil):",
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "➕ E'lon joylashtirish formasi",
                web_app: { url: `${WEB_APP_URL}?action=create` },
              },
            ],
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
              { text: "💼 Ofis va Tijorat", callback_data: "cat_ofis" },
            ],
            [
              { text: "⚙️ Jihoz va Texnika", callback_data: "cat_texnika" },
            ],
          ],
        },
      });
    } else if (text === "/admin") {
      await api("sendMessage", {
        chat_id: chatId,
        text: `
👨‍💼 <b>Admin Boshqaruv:</b>
Admin panelga kirish:
Login: <code>admin</code>
Parol: <code>1234</code>

Web App orqali barcha foydalanuvchilar va ularning e'lonlarini to'liq boshqara olasiz.
        `.trim(),
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🛡 Admin Panelni ochish",
                web_app: { url: `${WEB_APP_URL}?view=admin` },
              },
            ],
          ],
        },
      });
    } else {
      // Echo or default fallback
      await api("sendMessage", {
        chat_id: chatId,
        text: `Siz yozdingiz: "${text}"\n\nIltimos, pastdagi menyu tugmasi orqali Web Appni oching yoki /start bosing.`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 Ijara Bozor Web App",
                web_app: { url: WEB_APP_URL },
              },
            ],
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

    await api("answerCallbackQuery", { callback_query_id: cb.id });

    if (data === "cmd_ads") {
      await sendAdsList(chatId);
    } else if (data === "cmd_add") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "E'lon berish formasi ochildi:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "➕ E'lon Berish (Web App)",
                web_app: { url: `${WEB_APP_URL}?action=create` },
              },
            ],
          ],
        },
      });
    } else if (data.startsWith("cat_")) {
      const cat = data.replace("cat_", "");
      await sendAdsList(chatId, cat);
    } else if (data === "cmd_search") {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Qidiruv tizimi Web Appda qulay filtrlar bilan mavjud:",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "🔍 Qidiruv va Filtrlarni ochish",
                web_app: { url: WEB_APP_URL },
              },
            ],
          ],
        },
      });
    } else if (data === "cmd_help") {
      await api("sendMessage", {
        chat_id: chatId,
        text: `
📞 <b>Qo'llab-quvvatlash xizmati:</b>
Savol va takliflar bo'yicha:
Telefon: +998 71 200 00 00
Sayt: ${WEB_APP_URL}
        `.trim(),
        parse_mode: "HTML",
      });
    }
  }
}

// Long Polling Engine
async function startPolling() {
  await setupBot();
  let offset = 0;
  console.log("⚡ Bot xabarlarni tinglamoqda (Long Polling faollashtirildi)...");

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
