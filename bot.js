/**
 * IjaraBozor Telegram Bot Engine
 * Bot: @ijara_buyum_bot
 * Master Admin: To'xtamurod Jo'rayev (ID: 365446274, @Perfektum_1997)
 * Soddalashtirilgan va optimallashtirilgan tizim
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BOT_TOKEN = "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADS_FILE = path.join(__dirname, "src", "data", "ads.json");
const USERS_FILE = path.join(__dirname, "src", "data", "users.json");
const CONFIG_FILE = path.join(__dirname, "bot_config.json");
const SUBSCRIBERS_FILE = path.join(__dirname, "subscribers.json");

// Master Admin Configuration
const ADMIN_ID = 365446274;
const ADMIN_USERNAME = "perfektum_1997";

// Default or persisted Web App URL
let WEB_APP_URL = process.env.WEB_APP_URL || "https://ijara-gold.vercel.app";

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

// User Sessions: Map<chatId, { flow: 'REG' | 'AD', step: string, data: object }>
const userSessions = new Map();

// Helpers: Read & Write Data
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

function getUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    }
  } catch (err) {
    console.error("Users o'qishda xatolik:", err.message);
  }
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Users saqlashda xatolik:", err.message);
    return false;
  }
}

function getUserByTgId(tgId) {
  const users = getUsers();
  return users.find((u) => Number(u.telegramId) === Number(tgId));
}

function saveOrUpdateUser(userData) {
  const users = getUsers();
  const index = users.findIndex((u) => Number(u.telegramId) === Number(userData.telegramId));
  if (index >= 0) {
    users[index] = { ...users[index], ...userData };
  } else {
    users.push(userData);
  }
  return saveUsers(users);
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

// Safe Photo or Message Sender (fallback to text if Telegram rejects file URL)
async function safeSendPhotoOrMessage(chatId, photo, text, reply_markup = null) {
  let photoSent = false;
  const isTgFileUrl = typeof photo === "string" && photo.includes("api.telegram.org/file/");

  if (photo && !isTgFileUrl) {
    try {
      const res = await api("sendPhoto", {
        chat_id: chatId,
        photo: photo,
        caption: text,
        parse_mode: "HTML",
        reply_markup: reply_markup || undefined,
      });
      if (res.ok) {
        photoSent = true;
      }
    } catch (e) {}
  }

  if (!photoSent) {
    await api("sendMessage", {
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      reply_markup: reply_markup || undefined,
    });
  }
}

// Check if user is Master Admin
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

// Setup Bot Commands
async function setupBot() {
  await api("setMyCommands", {
    commands: [
      { command: "start", description: "Bosh menyu" },
      { command: "reklama", description: "Reklama joylashtirish" },
      { command: "webapp", description: "Ijara Bozor Web App" },
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

// User Start Handler (Faqat 2 ta tugma bilan sodda va qulay)
async function handleStart(chatId, user) {
  subscribers.add(chatId);
  saveSubscribers();

  const startText = `Salom! Siz bu yerdan o'zingizga kerakli buyumlarni ijaraga topishingiz mumkin.`;

  const existingUser = getUserByTgId(user.id);
  const webAppUrlWithUser = existingUser
    ? `${WEB_APP_URL}?userId=${existingUser.id}&name=${encodeURIComponent(existingUser.name)}&phone=${encodeURIComponent(existingUser.phone)}&tgId=${existingUser.telegramId}`
    : `${WEB_APP_URL}?tgId=${user.id}`;

  await api("sendMessage", {
    chat_id: chatId,
    text: startText,
    reply_markup: {
      inline_keyboard: [
        [{ text: "🔍 Buyumlarni ko'rish", web_app: { url: webAppUrlWithUser } }],
        [{ text: "📢 Reklama joylashtirish", callback_data: "cmd_reklama" }],
      ],
    },
  });
}

// Reklama joylashtirish handler (Ro'yxatdan o'tish yoki to'g'ridan-to'g'ri e'lon berish)
async function handleReklamaRequest(chatId, user) {
  const existingUser = getUserByTgId(user.id);

  if (!existingUser) {
    // 1-marta kelgan: Ro'yxatdan o'tishni so'rash
    userSessions.set(chatId, {
      flow: "REG",
      step: "REG_NAME",
      data: {
        telegramId: user.id,
        username: user.username || "",
        name: "",
        phone: "",
      },
    });

    const regPrompt = `Ro'yxatdan o'ting va botimizga reklama joylashtirishingiz mumkin.\n\n👤 <b>Iltimos, ismingizni kiriting:</b>`;

    await api("sendMessage", {
      chat_id: chatId,
      text: regPrompt,
      parse_mode: "HTML",
      reply_markup: {
        keyboard: [[{ text: "❌ Bekor qilish" }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      },
    });
  } else {
    // Allaqachon ro'yxatdan o'tgan
    const userWebUrl = `${WEB_APP_URL}?userId=${existingUser.id}&name=${encodeURIComponent(existingUser.name)}&phone=${encodeURIComponent(existingUser.phone)}&tgId=${existingUser.telegramId}`;

    await api("sendMessage", {
      chat_id: chatId,
      text: `Salom, <b>${existingUser.name}</b>! Siz ro'yxatdan o'tgansiz ✅\n\n🆔 <b>Telegram ID:</b> <code>${existingUser.telegramId}</code>\n📞 <b>Telefon:</b> <code>${existingUser.phone}</code>\n\nReklama (e'lon) joylashtirishni boshlaymizmi?`,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "➕ Reklama (e'lon) joylashtirish", callback_data: "cmd_start_ad" }],
          [{ text: "📱 Web Appga kirish", web_app: { url: userWebUrl } }],
        ],
      },
    });
  }
}

// Ad Creation Wizard start
async function startAdCreationWizard(chatId, user) {
  const existingUser = getUserByTgId(user.id);
  const userName = existingUser?.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || "Foydalanuvchi";
  const userPhone = existingUser?.phone || "";

  userSessions.set(chatId, {
    flow: "AD",
    step: "TITLE",
    data: {
      userId: existingUser?.id || `tg-${user.id}`,
      telegramId: user.id,
      userName: userName,
      userPhone: userPhone,
      telegramUsername: user.username || "",
      title: "",
      images: [],
      fileIds: [],
      price: 0,
      currency: "UZS",
      period: "kuniga",
      rentalType: "kunlik",
      location: "",
    },
  });

  const text = `
➕ <b>YANGI REKLAMA (E'LON) JOYLASH</b>

📝 <b>1-Qadam: E'lon nomini (sarlavhasini) kiriting:</b>

Masalan: <i>Chilonzorda shinam 2 xonali kvartira</i> yoki <i>Chevrolet Gentra 2024</i>
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

// Notify Master Admin To'xtamurod Jo'rayev
async function notifyAdminNewUser(newUser) {
  const text = `
👤 <b>YANGI FOYDALANUVCHI RO'YXATDAN O'TDI!</b>

🆔 <b>Telegram ID:</b> <code>${newUser.telegramId}</code>
👤 <b>Ism:</b> ${newUser.name}
📞 <b>Telefon:</b> ${newUser.phone}
${newUser.username ? `💬 <b>Username:</b> @${newUser.username}\n` : ""}📅 <b>Sana:</b> ${new Date().toLocaleString("uz-UZ")}
  `.trim();

  await api("sendMessage", {
    chat_id: ADMIN_ID,
    text: text,
    parse_mode: "HTML",
  });
}

async function notifyAdminNewAd(newAd) {
  const text = `
🚨 <b>YANGI REKLAMA (E'LON) TIZIMGA YUKLANDI!</b>

🏷 <b>Nomi:</b> ${newAd.title}
💰 <b>Kunlik narxi:</b> ${newAd.price.toLocaleString()} ${newAd.currency} / kuniga
📍 <b>Manzil:</b> ${newAd.location}
📸 <b>Rasmlar soni:</b> ${newAd.images.length} ta
👤 <b>Egasi:</b> ${newAd.userName} (Tel: ${newAd.userPhone})
${newAd.telegramUsername ? `💬 <b>Telegram:</b> @${newAd.telegramUsername}\n` : ""}
✅ <i>E'lon muvaffaqiyatli qabul qilindi va bazaga yuklandi.</i>
  `.trim();

  const buttons = [
    [
      { text: "📱 WebAppda ko'rish", web_app: { url: `${WEB_APP_URL}?ad=${newAd.id}` } },
      { text: "🗑 O'chirish", callback_data: `admin_del_${newAd.id}` },
    ],
  ];

  const photoToSend = newAd.fileId || (newAd.image && !newAd.image.includes("api.telegram.org/file/") ? newAd.image : null);
  await safeSendPhotoOrMessage(ADMIN_ID, photoToSend, text, { inline_keyboard: buttons });
}

// Handle Interactive Steps
async function handleUserStep(chatId, user, msg) {
  const session = userSessions.get(chatId);
  if (!session) return;

  const text = msg.text || "";

  if (text === "/cancel" || text === "❌ Bekor qilish") {
    userSessions.delete(chatId);
    await api("sendMessage", {
      chat_id: chatId,
      text: "❌ <b>Amal bekor qilindi (Yuklanmadi).</b>\nBosh menyuga qaytish uchun /start ni bosing.",
      parse_mode: "HTML",
      reply_markup: { remove_keyboard: true },
    });
    return;
  }

  // ===================== FLOW 1: REGISTRATION =====================
  if (session.flow === "REG") {
    // Step 1: Name
    if (session.step === "REG_NAME") {
      if (!text.trim() || text.length < 2) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "❌ <b>Ism qabul qilinmadi!</b>\n\nIltimos, ismingizni to'liqroq kiriting (kamida 2 ta harf):",
          parse_mode: "HTML",
        });
        return;
      }

      session.data.name = text.trim();
      session.step = "REG_PHONE";

      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ <b>Ismingiz qabul qilindi: ${session.data.name}</b>\n\n📞 <b>Endi telefon raqamingizni yuboring:</b>\n\nPastdagi <b>📱 Raqamimni yuborish</b> tugmasini bosing yoki raqamingizni yozing (masalan: <i>+998901234567</i>):`,
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

    // Step 2: Phone
    if (session.step === "REG_PHONE") {
      let phone = "";
      if (msg.contact && msg.contact.phone_number) {
        phone = msg.contact.phone_number;
      } else if (text) {
        phone = text.trim();
      }

      const cleanDigits = (phone || "").replace(/[^0-9]/g, "");
      if (!phone || cleanDigits.length < 9) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "❌ <b>Telefon raqam qabul qilinmadi!</b>\n\nIltimos, telefon raqamingizni to'g'ri formatda kiriting (masalan: +998901234567):",
          parse_mode: "HTML",
        });
        return;
      }

      if (!phone.startsWith("+") && cleanDigits.length === 9) {
        phone = "+998" + cleanDigits;
      } else if (!phone.startsWith("+")) {
        phone = "+" + cleanDigits;
      }

      // Save user to database
      const newUser = {
        id: `tg-${user.id}`,
        telegramId: user.id,
        name: session.data.name,
        phone: phone,
        username: user.username || "",
        role: isAdmin(user) ? "admin" : "user",
        registeredAt: new Date().toISOString(),
      };

      const saved = saveOrUpdateUser(newUser);
      userSessions.delete(chatId);

      if (!saved) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "❌ <b>Ro'yxatdan o'tishda xatolik yuz berdi (Yuklanmadi).</b> Qaytadan urinib ko'ring: /reklama",
          parse_mode: "HTML",
          reply_markup: { remove_keyboard: true },
        });
        return;
      }

      const webAppLoginUrl = `${WEB_APP_URL}?userId=${newUser.id}&name=${encodeURIComponent(newUser.name)}&phone=${encodeURIComponent(newUser.phone)}&tgId=${newUser.telegramId}`;

      await api("sendMessage", {
        chat_id: chatId,
        text: `
✅ <b>Tabriklaymiz, ${newUser.name}! Siz muvaffaqiyatli ro'yxatdan o'tdingiz!</b> 🎉

🆔 <b>Telegram ID:</b> <code>${newUser.telegramId}</code> (bazasiga saqlandi)
📞 <b>Telefon raqam:</b> <code>${newUser.phone}</code>

Endi bot orqali reklama joylashtirishingiz yoki shaxsiy hisobingiz bilan to'g'ridan-to'g'ri Web Appga kirishingiz mumkin:
        `.trim(),
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 Web Appga kirish", web_app: { url: webAppLoginUrl } }],
            [{ text: "📢 Reklama (e'lon) joylashtirish", callback_data: "cmd_start_ad" }],
          ],
        },
      });

      // Notify master admin
      await notifyAdminNewUser(newUser);
      return;
    }
  }

  // ===================== FLOW 2: AD CREATION =====================
  if (session.flow === "AD") {
    // Step 1: Title
    if (session.step === "TITLE") {
      if (!text.trim() || text.length < 3) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "❌ <b>E'lon nomi qabul qilinmadi!</b>\n\nIltimos, e'lon nomini to'liqroq kiriting (kamida 3 ta harf bo'lishi shart):",
          parse_mode: "HTML",
        });
        return;
      }

      session.data.title = text.trim();
      session.step = "PHOTOS";

      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ <b>1-Qadam bajarildi: E'lon nomi qabul qilindi!</b>\n📌 Nomi: "<b>${session.data.title}</b>"\n\n📸 <b>2-Qadam: E'lon uchun kamida 3 ta rasm yuboring:</b>\n\nRasmlarni Telegram orqali bittalab yoki birdaniga yuboring (kamida 3 ta rasm bo'lishi shart).\nHozircha yuklandi: <b>0 / 3</b> ta rasm.`,
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    // Step 2: Photos
    if (session.step === "PHOTOS") {
      if (msg.photo && msg.photo.length > 0) {
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;

        if (!session.data.fileIds) session.data.fileIds = [];
        session.data.fileIds.push(fileId);

        const fileRes = await api("getFile", { file_id: fileId });
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
            text: `✅ <b>${count}-rasm muvaffaqiyatli yuklandi!</b>\n\n⚠️ Kamida 3 ta rasm talab qilinadi. Yana <b>${3 - count} ta</b> rasm yuboring.`,
            parse_mode: "HTML",
          });
        } else {
          await api("sendMessage", {
            chat_id: chatId,
            text: `✅ <b>${count}-rasm muvaffaqiyatli yuklandi!</b> (Talab bajarildi: kamida 3 ta rasm yuklandi ✅)\n\nYana rasm yuborishingiz mumkin yoki narx kiritishga o'ting:`,
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
        if (!session.data.fileIds) session.data.fileIds = [];
        session.data.fileIds.push(text.trim());
        const count = session.data.images.length;
        if (count < 3) {
          await api("sendMessage", {
            chat_id: chatId,
            text: `✅ <b>${count}-rasm havolasi yuklandi!</b>\nYana <b>${3 - count} ta</b> rasm yuboring.`,
            parse_mode: "HTML",
          });
        } else {
          await api("sendMessage", {
            chat_id: chatId,
            text: `✅ <b>${count}-rasm muvaffaqiyatli yuklandi!</b>\n\nKeyingi bosqichga o'tishingiz mumkin:`,
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
            text: `❌ <b>Rasm yetarli emas (Yuklanmadi)!</b>\nKamida 3 ta rasm yuklanishi shart! Hozirda: <b>${session.data.images.length} / 3</b> ta rasm.`,
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
          text: `❌ <b>Rasm qabul qilinmadi!</b>\nIltimos, fotosurat yuboring. Hozircha yuklangan: <b>${session.data.images.length} / 3</b> ta rasm.`,
          parse_mode: "HTML",
        });
        return;
      }
    }

    // Step 3: Price
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
          text: "❌ <b>Narx qabul qilinmadi!</b>\n\nIltimos, kunlik narxni to'g'ri son shaklida kiriting (masalan: <i>250000</i> yoki <i>30 USD</i>):",
          parse_mode: "HTML",
        });
        return;
      }

      session.data.price = num;
      session.data.currency = currency;
      session.step = "LOCATION";

      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ <b>3-Qadam bajarildi: Kunlik narx saqlandi!</b>\n💰 Narx: <b>${num.toLocaleString()} ${currency} / kuniga</b>\n\n📍 <b>4-Qadam: Joylashuv / Manzilni kiriting:</b>\n\nMasalan: <i>Toshkent sh., Yunusobod 4-mavze</i> yoki <i>Namangan sh., Uchqo'rg'on</i>`,
        parse_mode: "HTML",
        reply_markup: { remove_keyboard: true },
      });
      return;
    }

    // Step 4: Location (Finish & Publish)
    if (session.step === "LOCATION") {
      if (!text.trim() || text.length < 3) {
        await api("sendMessage", {
          chat_id: chatId,
          text: "❌ <b>Manzil qabul qilinmadi!</b>\n\nIltimos, joylashuv manzilini aniqroq kiriting (kamida 3 ta harf):",
          parse_mode: "HTML",
        });
        return;
      }

      session.data.location = text.trim();

      try {
        const newAd = {
          id: "ad-" + Date.now(),
          userId: session.data.userId || `tg-${user.id}`,
          userName: session.data.userName || [user.first_name, user.last_name].filter(Boolean).join(" ") || "Telegram Foydalanuvchisi",
          userPhone: session.data.userPhone || "+998900000000",
          telegramUsername: session.data.telegramUsername || user.username || "",
          title: session.data.title,
          category: detectCategory(session.data.title),
          region: detectRegion(session.data.location),
          price: session.data.price,
          currency: session.data.currency,
          period: "kuniga",
          rentalType: "kunlik",
          location: session.data.location,
          fileId: session.data.fileIds?.[0] || null,
          fileIds: session.data.fileIds || [],
          image: session.data.images[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
          images: session.data.images && session.data.images.length > 0 ? session.data.images : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
          description: `${session.data.title}.\nKunlik ijara: ${session.data.price.toLocaleString()} ${session.data.currency}.\nManzil: ${session.data.location}.\nBog'lanish: ${session.data.userPhone}.`,
          features: ["Kunlik ijara", "Ishonchli", "Tezkor aloqa"],
          viewsCount: 1,
          isVip: false,
          createdAt: new Date().toISOString().split("T")[0],
          status: "active",
        };

        const ads = getAds();
        ads.unshift(newAd);
        const isSaved = saveAds(ads);

        if (!isSaved) {
          throw new Error("Ma'lumotlar bazasiga yozishda xatolik yuz berdi");
        }

        userSessions.delete(chatId);

        const successCaption = `
🎉 <b>TABRIKLAYMIZ! E'LONINGIZ MUVAFFAQIYATLI YUKLANDI!</b> ✅

🏷 <b>Nomi:</b> ${newAd.title}
💰 <b>Kunlik narxi:</b> ${newAd.price.toLocaleString()} ${newAd.currency} / kuniga
📂 <b>Toifa:</b> ${newAd.category.toUpperCase()}
📍 <b>Manzil:</b> ${newAd.location}
📞 <b>Telefon:</b> ${newAd.userPhone}
${newAd.telegramUsername ? `💬 <b>Telegram:</b> @${newAd.telegramUsername}\n` : ""}📸 <b>Rasmlar soni:</b> ${newAd.images.length} ta

🚀 <b>Holati: YUKLANDI VA FAOLLASHTIRILDI!</b>
<i>E'loningiz hozirning o'zida ham Telegram botda, ham IjaraBozor Web App tizimida barcha uchun faol bo'ldi!</i>
        `.trim();

        const photoToSend = newAd.fileId || (newAd.image && !newAd.image.includes("api.telegram.org/file/") ? newAd.image : null);

        await safeSendPhotoOrMessage(chatId, photoToSend, successCaption, {
          inline_keyboard: [
            [
              { text: "📱 Web Appda ochish", web_app: { url: `${WEB_APP_URL}?ad=${newAd.id}` } },
            ],
            [
              { text: "➕ Yangi e'lon berish", callback_data: "cmd_start_ad" },
            ],
          ],
        });

        // Notify master admin
        await notifyAdminNewAd(newAd);
      } catch (err) {
        console.error("E'lonni yuklashda xatolik:", err);
        await api("sendMessage", {
          chat_id: chatId,
          text: `❌ <b>E'LON YUKLANMADI!</b>\n\nKechirasiz, e'lonni tizimga yuklashda texnik xatolik yuz berdi: <i>${err.message}</i>\n\nIltimos, qaytadan urinib ko'rish uchun /reklama buyrug'ini bosing.`,
          parse_mode: "HTML",
        });
      }
      return;
    }
  }
}

async function promptPrice(chatId) {
  await api("sendMessage", {
    chat_id: chatId,
    text: `💰 <b>3-Qadam: Kunlik ijara narxini kiriting:</b>\n\nMasalan: <i>250000</i> (so'mda) yoki <i>30 USD</i>`,
    parse_mode: "HTML",
  });
}

// Handle Update
async function handleUpdate(update) {
  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const text = msg.text || "";
    const user = msg.from;

    subscribers.add(chatId);
    saveSubscribers();

    // Check if in interactive session
    if (userSessions.has(chatId)) {
      await handleUserStep(chatId, user, msg);
      return;
    }

    if (text.startsWith("/start")) {
      await handleStart(chatId, user);
    } else if (text === "/reklama" || text === "/elon_berish") {
      await handleReklamaRequest(chatId, user);
    } else if (text === "/webapp") {
      const existingUser = getUserByTgId(user.id);
      const url = existingUser
        ? `${WEB_APP_URL}?userId=${existingUser.id}&name=${encodeURIComponent(existingUser.name)}&phone=${encodeURIComponent(existingUser.phone)}&tgId=${existingUser.telegramId}`
        : WEB_APP_URL;

      await api("sendMessage", {
        chat_id: chatId,
        text: "IjaraBozor Web App ilovasini ochish:",
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 Ilovani ochish", web_app: { url } }],
          ],
        },
      });
    } else if (text === "/admin") {
      if (isAdmin(user)) {
        const ads = getAds();
        const users = getUsers();
        await api("sendMessage", {
          chat_id: chatId,
          text: `👑 <b>BOSH ADMINISTRATOR (To'xtamurod Jo'rayev)</b>\n\n• Jami e'lonlar: ${ads.length} ta\n• Ro'yxatdan o'tgan foydalanuvchilar: ${users.length} nafar\n• Bot obunachilari: ${subscribers.size} nafar\n• Web App: <code>${WEB_APP_URL}</code>`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📱 Admin WebApp Paneli", web_app: { url: `${WEB_APP_URL}?view=admin` } }],
            ],
          },
        });
      } else {
        await api("sendMessage", {
          chat_id: chatId,
          text: "Ushbu buyruq faqat Bosh Administrator (@Perfektum_1997) uchun.",
        });
      }
    } else {
      await handleStart(chatId, user);
    }
  }

  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;
    const user = cb.from;

    await api("answerCallbackQuery", { callback_query_id: cb.id });

    if (data === "cmd_reklama") {
      await handleReklamaRequest(chatId, user);
    } else if (data === "cmd_start_ad") {
      await startAdCreationWizard(chatId, user);
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
    } else if (data.startsWith("admin_del_")) {
      const adId = data.replace("admin_del_", "");
      const ads = getAds();
      const newAds = ads.filter((a) => a.id !== adId);
      saveAds(newAds);
      await api("sendMessage", {
        chat_id: chatId,
        text: `✅ E'lon (${adId}) muvaffaqiyatli o'chirildi!`,
      });
    }
  }
}

// Long Polling Engine
async function startPolling() {
  try {
    await api("deleteWebhook", { drop_pending_updates: false });
  } catch (e) {}

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
      console.error("Polling xatosi:", err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

startPolling();
