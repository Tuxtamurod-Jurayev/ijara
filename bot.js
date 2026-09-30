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
const CONFIG_FILE = path.join(__dirname, "bot_config.json");
const SUBSCRIBERS_FILE = path.join(__dirname, "subscribers.json");

// Master Admin Configuration
const ADMIN_ID = 365446274;
const ADMIN_USERNAME = "perfektum_1997";

// Default or persisted Web App URL
let WEB_APP_URL = process.env.WEB_APP_URL || "https://ijara-nu.vercel.app";

try {
  if (fs.existsSync(CONFIG_FILE)) {
    const cfg = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
    if (cfg.webAppUrl) WEB_APP_URL = cfg.webAppUrl;
  }
} catch (e) {}

function saveConfig(cfg) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), "utf8");
  } catch (e) {}
}

// Subscribers tracking
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

// User Step-by-Step Ad Creation Sessions
// Map<chatId, { step: 'TITLE' | 'PHOTOS' | 'PRICE' | 'PHONE' | 'LOCATION', data: { ... } }>
const userSessions = new Map();

// Helper: Read and Write Ads
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

// Smart categorization
function detectCategory(title = "") {
  const t = title.toLowerCase();
  if (t.includes("kvartira") || t.includes("uy") || t.includes("dom") || t.includes("xona")) return "kvartira";
  if (t.includes("hovli") || t.includes("dacha") || t.includes("uchastka")) return "hovli";
  if (t.includes("avto") || t.includes("mashina") || t.includes("gentra") || t.includes("cobalt") || t.includes("tracker") || t.includes("onix") || t.includes("malibu") || t.includes("damas")) return "avto";
  if (t.includes("ofis") || t.includes("bino") || t.includes("dokon") || t.includes("do'kon")) return "ofis";
  return "texnika";
}

function detectRegion(loc = "") {
  const l = loc.toLowerCase();
  if (l.includes("samarqand")) return "Samarqand viloyati";
  if (l.includes("buxoro")) return "Buxoro viloyati";
  if (l.includes("andijon")) return "Andijon viloyati";
  if (l.includes("farg'ona") || l.includes("fargona")) return "Farg'ona viloyati";
  if (l.includes("namangan")) return "Namangan viloyati";
  return "Toshkent shahri";
}

// Setup Bot
async function setupBot() {
  console.log("🤖 @ijara_buyum_bot sozlanmoqda...");

  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Bosh menyu" },
      { command: "elon_berish", description: "Yangi ijara e'loni joylash (3 ta rasm + narx)" },
      { command: "elonlar", description: "Barcha faol e'lonlar" },
      { command: "webapp", description: "Ijara Bozor Web App" },
      { command: "kategoriyalar", description: "Toifalar bo'yicha ko'rish" },
      { command: "admin", description: "Admin paneli" },
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
    console.log(`🌐 Web App URL: ${WEB_APP_URL}`);
  }
}

// Format Ad Card for Telegram
function formatAdCard(ad) {
  const photosCount = (ad.images && ad.images.length) || 1;
  return `
🏠 <b>${ad.title}</b>

💰 <b>Narxi:</b> ${ad.price.toLocaleString()} ${ad.currency} / ${ad.period}
📍 <b>Manzil:</b> ${ad.location}
📂 <b>Toifa:</b> ${ad.category?.toUpperCase()}
📸 <b>Rasmlar:</b> ${photosCount} ta
👤 <b>Bog'lanish:</b> ${ad.userPhone || "Ko'rsatilmagan"}
${ad.telegramUsername ? `💬 <b>Telegram:</b> @${ad.telegramUsername}` : ""}

📝 <i>${ad.description?.slice(0, 160)}...</i>
  `.trim();
}

// Notify Admin about new ad or event
export async function notifyAdmin(ad) {
  const photosCount = (ad.images && ad.images.length) || 1;
  const text = `
🚨 <b>YANGI IJARA E'LONI JOYLASHDI!</b>

🏷 <b>Nomi:</b> ${ad.title}
💰 <b>Kunlik narxi:</b> ${ad.price.toLocaleString()} ${ad.currency} / ${ad.period}
📍 <b>Manzil:</b> ${ad.location}
📸 <b>Rasmlar soni:</b> ${photosCount} ta
👤 <b>Egasi:</b> ${ad.userName} (Tel: ${ad.userPhone})
${ad.telegramUsername ? `Telegram: @${ad.telegramUsername}` : ""}
  `.trim();

  const buttons = [
    [
      { text: "📱 WebAppda ko'rish", web_app: { url: `${WEB_APP_URL}?ad=${ad.id}` } },
      { text: "🗑 O'chirish (Moderatsiya)", callback_data: `admin_del_${ad.id}` },
    ],
  ];

  if (ad.image && ad.image.startsWith("http")) {
    await api("sendPhoto", {
      chat_id: ADMIN_ID,
      photo: ad.image,
      caption: text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });
  } else {
    await api("sendMessage", {
      chat_id: ADMIN_ID,
      text: text,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: buttons },
    });
  }
}

// Admin Panel Handler
async function handleAdminPanel(chatId) {
  const ads = getAds();
  const totalAds = ads.length;
  const vipCount = ads.filter((a) => a.isVip).length;

  const text = `
👑 <b>HURMATLI ADMIN (To'xtamurod Jo'rayev)!</b>

IjaraBozor boshqaruv markaziga xush kelibsiz.
• 📊 <b>Jami e'lonlar:</b> ${totalAds} ta
• 👑 <b>VIP e'lonlar:</b> ${vipCount} ta
• 👥 <b>Bot obunachilari:</b> ${subscribers.size} nafar
• 🌐 <b>Hozirgi Web App:</b> <code>${WEB_APP_URL}</code>

<i>Web App manzilini yangilash uchun: <code>/seturl https://manzil.vercel.app</code></i>
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "📱 Admin WebApp Paneli", web_app: { url: `${WEB_APP_URL}?view=admin` } },
        ],
        [
          { text: "📋 E'lonlarni boshqarish (O'chirish)", callback_data: "admin_manage_ads" },
          { text: "➕ Yangi E'lon Joylash", callback_data: "cmd_add" },
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
Bu yerda kvartira, hovli, dacha, avtomobil va jihozlarni to'g'ridan-to'g'ri egasidan ijaraga oling yoki bir necha soniyada o'z e'loningizni joylang!

Kerakli amalni tanlang:
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "➕ E'lon Berish (Bot orqali)", callback_data: "cmd_add_bot" },
          { text: "📱 Web App", web_app: { url: WEB_APP_URL } },
        ],
        [
          { text: "📋 E'lonlarni ko'rish", callback_data: "cmd_ads" },
          { text: "🔍 Toifalar", callback_data: "cmd_categories" },
        ],
        [
          { text: "🏢 Kvartiralar", callback_data: "cat_kvartira" },
          { text: "🚗 Avtomobillar", callback_data: "cat_avto" },
        ],
      ],
    },
  });
}

// Start Ad Creation Wizard in Bot
async function startAdCreationWizard(chatId) {
  userSessions.set(chatId, {
    step: "TITLE",
    data: {
      title: "",
      images: [],
      price: 0,
      currency: "UZS",
      period: "kuniga",
      rentalType: "kunlik",
      userPhone: "",
      location: "",
    },
  });

  const text = `
➕ <b>YANGI IJARA E'LONI QO'SHISH (1/5)</b>

📝 <b>1-Qadam: E'lon nomini (sarlavhasini) kiriting:</b>

Masalan: <i>Chilonzorda shinam 2 xonali kvartira</i> yoki <i>Chevrolet Gentra 2024</i>

<i>(Bekor qilish uchun /cancel deb yozing)</i>
  `.trim();

  await api("sendMessage", {
    chat_id: chatId,
    text: text,
    parse_mode: "HTML",
    reply_markup: {
      keyboard: [[{ text: "❌ Bekor qilish" }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    },
  });
}

// Handle Step-by-Step Ad Creation
async function handleAdCreationStep(chatId, user, msg) {
  const session = userSessions.get(chatId);
  if (!session) return;

  const text = msg.text || "";

  if (text === "/cancel" || text === "❌ Bekor qilish") {
    userSessions.delete(chatId);
    await api("sendMessage", {
      chat_id: chatId,
      text: "❌ E'lon berish jarayoni bekor qilindi.",
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  // STEP 1: TITLE
  if (session.step === "TITLE") {
    if (!text.trim() || text.length < 3) {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Iltimos, e'lon nomini to'liqroq kiriting (kamida 3 ta harf):",
      });
      return;
    }

    session.data.title = text.trim();
    session.step = "PHOTOS";

    await api("sendMessage", {
      chat_id: chatId,
      text: `✅ <b>Nomi saqlandi:</b> "${session.data.title}"\n\n📸 <b>2-Qadam: E'lon uchun kamida 3 ta rasm yuboring:</b>\n\nRasmlarni Telegram orqali bittalab yoki birdaniga yuboring (kamida 3 ta bo'lishi shart).\nHozircha yuklandi: <b>0 / 3</b> ta rasm.`,
      parse_mode: "HTML",
    });
    return;
  }

  // STEP 2: PHOTOS
  if (session.step === "PHOTOS") {
    if (msg.photo && msg.photo.length > 0) {
      const photo = msg.photo[msg.photo.length - 1];
      const fileRes = await api("getFile", { file_id: photo.file_id });
      let photoUrl = "";
      if (fileRes.ok && fileRes.result?.file_path) {
        photoUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${fileRes.result.file_path}`;
      } else {
        photoUrl = `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80`;
      }

      session.data.images.push(photoUrl);
      const count = session.data.images.length;

      if (count < 3) {
        await api("sendMessage", {
          chat_id: chatId,
          text: `✅ <b>${count}-rasm qabul qilindi!</b>\n\nKamida 3 ta rasm talab qilinadi. Yana <b>${3 - count} ta</b> rasm yuboring.`,
          parse_mode: "HTML",
        });
      } else {
        await api("sendMessage", {
          chat_id: chatId,
          text: `✅ <b>${count}-rasm qabul qilindi!</b> (Talab bajarildi: kamida 3 ta rasm mavjud ✅)\n\nYana rasm yuborishingiz mumkin yoki narx kiritishga o'ting:`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "➡️ 3-Qadam: Kunlik narxni kiritish", callback_data: "step_next_price" }],
            ],
          },
        });
      }
      return;
    } else if (text.startsWith("http://") || text.startsWith("https://")) {
      session.data.images.push(text.trim());
      const count = session.data.images.length;
      if (count < 3) {
        await api("sendMessage", {
          chat_id: chatId,
          text: `✅ <b>${count}-rasm havolasi saqlandi!</b>\nYana <b>${3 - count} ta</b> rasm yuboring.`,
          parse_mode: "HTML",
        });
      } else {
        await api("sendMessage", {
          chat_id: chatId,
          text: `✅ <b>${count}-rasm saqlandi!</b>\n\nKeyingi bosqichga o'tishingiz mumkin:`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "➡️ 3-Qadam: Kunlik narxni kiritish", callback_data: "step_next_price" }],
            ],
          },
        });
      }
      return;
    } else if (text.toLowerCase() === "davom" || text.toLowerCase() === "keyingi" || text.toLowerCase() === "ok") {
      if (session.data.images.length < 3) {
        await api("sendMessage", {
          chat_id: chatId,
          text: `⚠️ Kamida 3 ta rasm yuklanishi shart! Hozirda: <b>${session.data.images.length} / 3</b> ta rasm.`,
          parse_mode: "HTML",
        });
        return;
      }
      session.step = "PRICE";
      await promptPrice(chatId);
      return;
    } else {
      await api("sendMessage", {
        chat_id: chatId,
        text: `Iltimos, fotosurat yuboring. Hozirda yuklangan: <b>${session.data.images.length} / 3</b> ta rasm.`,
        parse_mode: "HTML",
      });
      return;
    }
  }

  // STEP 3: PRICE
  if (session.step === "PRICE") {
    const raw = text.toLowerCase().replace(/\s+/g, "");
    let currency = "UZS";
    if (raw.includes("usd") || raw.includes("$")) {
      currency = "USD";
    }
    const num = parseInt(raw.replace(/[^0-9]/g, ""), 10);
    if (!num || isNaN(num) || num <= 0) {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Iltimos, kunlik narxni to'g'ri son shaklida kiriting (masalan: <i>250000</i> yoki <i>30 USD</i>):",
        parse_mode: "HTML",
      });
      return;
    }

    session.data.price = num;
    session.data.currency = currency;
    session.data.period = "kuniga";
    session.step = "PHONE";

    await api("sendMessage", {
      chat_id: chatId,
      text: `✅ <b>Kunlik narx:</b> ${num.toLocaleString()} ${currency} / kuniga\n\n📞 <b>4-Qadam: Bog'lanish uchun telefon raqamingizni yuboring:</b>\n\nPastdagi <b>📱 Raqamimni yuborish</b> tugmasini bosing yoki raqamingizni yozing (masalan: <i>+998901234567</i>):`,
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [
          [{ text: "📱 Raqamimni yuborish", request_contact: true }],
          [{ text: "❌ Bekor qilish" }],
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
    return;
  }

  // STEP 4: PHONE
  if (session.step === "PHONE") {
    let phone = "";
    if (msg.contact && msg.contact.phone_number) {
      phone = msg.contact.phone_number;
    } else if (text) {
      phone = text.trim();
    }

    if (!phone || phone.replace(/[^0-9]/g, "").length < 7) {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Iltimos, telefon raqamingizni to'g'ri formatda kiriting (masalan: +998901234567):",
      });
      return;
    }

    if (!phone.startsWith("+") && phone.length === 9) {
      phone = "+998" + phone;
    }

    session.data.userPhone = phone;
    session.step = "LOCATION";

    await api("sendMessage", {
      chat_id: chatId,
      text: `✅ <b>Telefon raqam:</b> ${phone}\n\n📍 <b>5-Qadam: Joylashuv / Manzilni kiriting:</b>\n\nMasalan: <i>Toshkent sh., Yunusobod 4-mavze</i> yoki <i>Samarqand sh., Registon yaqinida</i>`,
      parse_mode: "HTML",
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  // STEP 5: LOCATION (Finish)
  if (session.step === "LOCATION") {
    if (!text.trim() || text.length < 3) {
      await api("sendMessage", {
        chat_id: chatId,
        text: "Iltimos, manzilni aniqroq kiriting:",
      });
      return;
    }

    session.data.location = text.trim();

    // Assemble new ad
    const newAd = {
      id: "ad-" + Date.now(),
      userId: `tg-${user.id}`,
      userName: [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram Foydalanuvchisi",
      userPhone: session.data.userPhone,
      telegramUsername: user.username || "",
      title: session.data.title,
      category: detectCategory(session.data.title),
      region: detectRegion(session.data.location),
      price: session.data.price,
      currency: session.data.currency,
      period: "kuniga",
      rentalType: "kunlik",
      location: session.data.location,
      image: session.data.images[0],
      images: session.data.images,
      description: `${session.data.title}.\nKunlik ijara: ${session.data.price.toLocaleString()} ${session.data.currency}.\nManzil: ${session.data.location}.\nBog'lanish: ${session.data.userPhone}.`,
      features: ["Kunlik ijara", "Ishonchli", "Tezkor aloqa"],
      viewsCount: 1,
      isVip: false,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
    };

    // Save to ads.json
    const ads = getAds();
    ads.unshift(newAd);
    saveAds(ads);

    // Clear session
    userSessions.delete(chatId);

    // Send confirmation to user
    const successCaption = `
🎉 <b>TABRIKLAYMIZ! E'LONINGIZ MUVAFFAQIYATLI JOYLASHDI!</b>

🏷 <b>Nomi:</b> ${newAd.title}
💰 <b>Kunlik narxi:</b> ${newAd.price.toLocaleString()} ${newAd.currency} / kuniga
📸 <b>Rasmlar soni:</b> ${newAd.images.length} ta
📍 <b>Manzil:</b> ${newAd.location}
📞 <b>Telefon:</b> ${newAd.userPhone}
${newAd.telegramUsername ? `💬 <b>Telegram:</b> @${newAd.telegramUsername}` : ""}

✅ <i>E'loningiz hozirning o'zida ham Telegram botda, ham IjaraBozor Web App tizimida faollashdi!</i>
    `.trim();

    await api("sendPhoto", {
      chat_id: chatId,
      photo: newAd.image,
      caption: successCaption,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "📱 Web Appda ochish", web_app: { url: `${WEB_APP_URL}?ad=${newAd.id}` } },
            { text: "📋 Barcha e'lonlar", callback_data: "cmd_ads" },
          ],
        ],
      },
    });

    // Notify Master Admin To'xtamurod Jo'rayev
    await notifyAdmin(newAd);
  }
}

async function promptPrice(chatId) {
  await api("sendMessage", {
    chat_id: chatId,
    text: `💰 <b>3-Qadam: Kunlik ijara narxini kiriting:</b>\n\nMasalan: <i>250000</i> (so'mda) yoki <i>30 USD</i>\n\n<i>(Standart ijara: Kunlik)</i>`,
    parse_mode: "HTML",
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
    text: `Barcha <b>${ads.length} ta</b> e'lonni rasmlar galereyasi va filtrlari bilan to'liq Web Appda ko'rishingiz mumkin:`,
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

    // Check if in interactive ad creation session
    if (userSessions.has(chatId)) {
      await handleAdCreationStep(chatId, user, msg);
      return;
    }

    if (text.startsWith("/start")) {
      await handleStart(chatId, user);
    } else if (text.startsWith("/seturl")) {
      if (!isAdmin(user)) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "Ushbu buyruq faqat Bosh Administrator (@Perfektum_1997) uchun!",
        });
        return;
      }
      const parts = text.split(" ");
      if (parts.length < 2 || !parts[1].startsWith("http")) {
        await api("sendMessage", {
          chat_id: chatId,
          text: `ℹ️ Hozirgi Web App manzili: <code>${WEB_APP_URL}</code>\n\nO'zgartirish uchun:\n<code>/seturl https://ijara-*.vercel.app</code> deb yuboring.`,
          parse_mode: "HTML",
        });
        return;
      }
      WEB_APP_URL = parts[1].trim();
      saveConfig({ webAppUrl: WEB_APP_URL });
      await setupBot();
      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ <b>Web App manzili yangilandi!</b>\n\nYangi manzil: <code>${WEB_APP_URL}</code>\nBarcha tugmalar endi to'g'ri ishlaydi.`,
        parse_mode: "HTML",
      });
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
      await startAdCreationWizard(chatId);
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
        text: "Quyidagi tugmalardan birini tanlang:",
        reply_markup: {
          inline_keyboard: [
            [
              { text: "➕ E'lon Berish (Bot orqali)", callback_data: "cmd_add_bot" },
              { text: "📱 Web App", web_app: { url: WEB_APP_URL } },
            ],
            [
              { text: "📋 Barcha E'lonlar", callback_data: "cmd_ads" },
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
    const user = cb.from;

    await api("answerCallbackQuery", { callback_query_id: cb.id });

    if (data === "cmd_ads") {
      await sendAdsList(chatId, null, isAdmin(user));
    } else if (data === "cmd_add" || data === "cmd_add_bot") {
      await startAdCreationWizard(chatId);
    } else if (data === "step_next_price") {
      const session = userSessions.get(chatId);
      if (session) {
        if (session.data.images.length < 3) {
          await api("sendMessage", {
            chat_id: chatId,
            text: `⚠️ Kamida 3 ta rasm yuborishingiz shart! Hozircha: <b>${session.data.images.length} / 3</b> ta.`,
            parse_mode: "HTML",
          });
        } else {
          session.step = "PRICE";
          await promptPrice(chatId);
        }
      }
    } else if (data.startsWith("cat_")) {
      const cat = data.replace("cat_", "");
      await sendAdsList(chatId, cat, isAdmin(user));
    } else if (data === "cmd_categories") {
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
        text: `📢 <b>Foydalanuvchilarga xabar yuborish:</b>\nHozirda botda ${subscribers.size} nafar obunachi mavjud.`,
        parse_mode: "HTML",
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
