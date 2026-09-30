/**
 * Vercel Serverless Webhook Handler for Telegram Bot
 * Bot: @ijara_buyum_bot
 * Master Admin: To'xtamurod Jo'rayev (ID: 365446274, @Perfektum_1997)
 */

const BOT_TOKEN = "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo";
const API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;
const ADMIN_ID = 365446274;
const ADMIN_USERNAME = "perfektum_1997";

async function tgApi(method, params = {}) {
  try {
    const res = await fetch(`${API_URL}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    return await res.json();
  } catch (err) {
    console.error(`Telegram API error on ${method}:`, err);
    return { ok: false, error: err.message };
  }
}

function isAdmin(user) {
  if (!user) return false;
  return (
    Number(user.id) === ADMIN_ID ||
    user.username?.toLowerCase() === ADMIN_USERNAME
  );
}

export default async function handler(req, res) {
  // Allow health check via GET
  if (req.method !== "POST") {
    return res.status(200).json({
      status: "online",
      bot: "@ijara_buyum_bot",
      masterAdmin: "To'xtamurod Jo'rayev (365446274, @Perfektum_1997)",
      timestamp: new Date().toISOString(),
    });
  }

  const update = req.body;
  if (!update) {
    return res.status(200).json({ ok: true, note: "empty body" });
  }

  const host = req.headers.host || "ijara.vercel.app";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const webAppUrl = `${protocol}://${host}`;

  try {
    // 1. Handle incoming text / commands
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";
      const user = msg.from;

      if (text.startsWith("/start")) {
        const isUserAdmin = isAdmin(user);
        if (isUserAdmin) {
          await tgApi("sendMessage", {
            chat_id: chatId,
            text: `👑 <b>Assalomu alaykum, Bosh Administrator (To'xtamurod Jo'rayev)!</b>\n\nIjaraBozor boshqaruv markaziga xush kelibsiz. Bot avtomatik 24/7 rejimda ishlamoqda.`,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "📱 Admin WebApp Paneli", web_app: { url: `${webAppUrl}?view=admin` } }],
                [{ text: "➕ Yangi E'lon Berish", web_app: { url: `${webAppUrl}?action=create` } }],
                [{ text: "📋 Barcha E'lonlar", callback_data: "cmd_ads" }],
              ],
            },
          });
        } else {
          await tgApi("sendMessage", {
            chat_id: chatId,
            text: `Assalomu alaykum, <b>${user?.first_name || "Foydalanuvchi"}</b>! 👋\n\n<b>IjaraBozor</b> platformasiga xush kelibsiz! 🏠🚗\nBu yerda kvartira, uy, avtomobil va jihozlarni qulay ijaraga oling yoki o'z e'loningizni joylang!`,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "📱 Ijara Bozor Web App", web_app: { url: webAppUrl } },
                  { text: "➕ E'lon Berish", web_app: { url: `${webAppUrl}?action=create` } },
                ],
                [
                  { text: "📋 E'lonlar", callback_data: "cmd_ads" },
                  { text: "🏢 Kvartiralar", callback_data: "cat_kvartira" },
                  { text: "🚗 Avtomobillar", callback_data: "cat_avto" },
                ],
              ],
            },
          });
        }
      } else if (text === "/admin") {
        if (isAdmin(user)) {
          await tgApi("sendMessage", {
            chat_id: chatId,
            text: `👑 <b>IjaraBozor Admin Paneli:</b>\n\nTo'xtamurod Jo'rayev (@Perfektum_1997 | ID: 365446274)\nTizim holati: Faol 🟢`,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "📱 Admin Web Appni ochish", web_app: { url: `${webAppUrl}?view=admin` } }],
              ],
            },
          });
        } else {
          await tgApi("sendMessage", {
            chat_id: chatId,
            text: "Ushbu buyruq faqat Bosh Administrator (@Perfektum_1997) uchun!",
          });
        }
      } else if (text === "/elon_berish") {
        await tgApi("sendMessage", {
          chat_id: chatId,
          text: `➕ <b>Yangi Ijara E'loni Joylash</b>\n\nE'lon nomi, 3 ta rasm, kunlik narx va manzil bilan e'lon berish:`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "➕ E'lon Berish Formasini ochish", web_app: { url: `${webAppUrl}?action=create` } }],
            ],
          },
        });
      } else {
        await tgApi("sendMessage", {
          chat_id: chatId,
          text: `Quyidagi tugma orqali ilovani ochishingiz mumkin:`,
          reply_markup: {
            inline_keyboard: [
              [{ text: "📱 Ijara Bozor Web App", web_app: { url: webAppUrl } }],
              [{ text: "➕ E'lon Berish", web_app: { url: `${webAppUrl}?action=create` } }],
            ],
          },
        });
      }
    }

    // 2. Handle callback queries
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const data = cb.data;

      await tgApi("answerCallbackQuery", { callback_query_id: cb.id });

      if (data === "cmd_ads") {
        await tgApi("sendMessage", {
          chat_id: chatId,
          text: "Barcha e'lonlarni rasmlar va to'liq filtrlari bilan Web Appda ko'rishingiz mumkin:",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📱 E'lonlar ro'yxatini ochish", web_app: { url: webAppUrl } }],
            ],
          },
        });
      }
    }
  } catch (e) {
    console.error("Webhook processing error:", e);
  }

  return res.status(200).json({ ok: true });
}
