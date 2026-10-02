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
  // Health check via GET
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

  const host = req.headers.host || "ijara-gold.vercel.app";
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const webAppUrl = `${protocol}://${host}`;

  try {
    if (update.message) {
      const msg = update.message;
      const chatId = msg.chat.id;
      const text = msg.text || "";
      const user = msg.from;

      if (text.startsWith("/start")) {
        const startText = `Salom! Siz bu yerdan o'zingizga kerakli buyumlarni ijaraga topishingiz mumkin.`;
        const webAppLoginUrl = `${webAppUrl}?tgId=${user.id}`;

        await tgApi("sendMessage", {
          chat_id: chatId,
          text: startText,
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Buyumlarni ko'rish", web_app: { url: webAppLoginUrl } }],
              [{ text: "📢 Reklama joylashtirish", callback_data: "cmd_reklama" }],
            ],
          },
        });
      } else if (text === "/reklama") {
        await tgApi("sendMessage", {
          chat_id: chatId,
          text: `Ro'yxatdan o'ting va botimizga reklama joylashtirishingiz mumkin.\n\nWeb App orqali to'liq e'lon berish:`,
          reply_markup: {
            inline_keyboard: [
              [{ text: "➕ Reklama berish", web_app: { url: `${webAppUrl}?action=create&tgId=${user.id}` } }],
              [{ text: "🔍 Buyumlarni ko'rish", web_app: { url: `${webAppUrl}?tgId=${user.id}` } }],
            ],
          },
        });
      } else if (text === "/admin") {
        if (isAdmin(user)) {
          await tgApi("sendMessage", {
            chat_id: chatId,
            text: `👑 <b>BOSH ADMINISTRATOR (To'xtamurod Jo'rayev)</b>\n\nAdmin boshqaruv panelini ochish:`,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "📱 Admin WebApp Paneli", web_app: { url: `${webAppUrl}?view=admin` } }],
              ],
            },
          });
        }
      }
    }

    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const data = cb.data;
      const user = cb.from;

      await tgApi("answerCallbackQuery", { callback_query_id: cb.id });

      if (data === "cmd_reklama") {
        await tgApi("sendMessage", {
          chat_id: chatId,
          text: `Ro'yxatdan o'ting va botimizga reklama joylashtirishingiz mumkin.\n\nQuyidagi tugma orqali reklama formasini oching yoki bot orqali davom eting:`,
          reply_markup: {
            inline_keyboard: [
              [{ text: "➕ Reklama joylashtirish", web_app: { url: `${webAppUrl}?action=create&tgId=${user.id}` } }],
              [{ text: "🔍 Barcha e'lonlar", web_app: { url: `${webAppUrl}?tgId=${user.id}` } }],
            ],
          },
        });
      }
    }
  } catch (err) {
    console.error("Vercel webhook error:", err);
  }

  return res.status(200).json({ ok: true });
}
