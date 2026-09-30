// Telegram WebApp & Bot Integration Utilities

/**
 * Initializes Telegram WebApp environment if running inside Telegram
 */
export function initTelegramWebApp() {
  if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();
    return {
      isInsideTelegram: true,
      user: tg.initDataUnsafe?.user || null,
      theme: tg.colorScheme || "light",
      webApp: tg,
    };
  }
  return {
    isInsideTelegram: false,
    user: null,
    theme: "light",
    webApp: null,
  };
}

/**
 * Sends a notification of a new ad to a Telegram Bot / Channel
 * @param {Object} ad - The newly created rental advertisement
 * @param {string} botToken - Telegram Bot Token
 * @param {string} chatId - Target Chat ID or Channel (@channel_username)
 */
export async function sendAdToTelegram(ad, botToken, chatId) {
  if (!botToken || !chatId) {
    console.warn("Telegram bot token yoki chat_id belgilanmagan.");
    return { success: false, error: "Token yoki Chat ID kiritilmagan" };
  }

  const captionText = `
📢 <b>YANGI IJARA E'LONI JOYLASHDI!</b>

🏷 <b>Nomi:</b> ${ad.title}
💰 <b>Narxi:</b> ${ad.price.toLocaleString()} ${ad.currency} / ${ad.period}
📂 <b>Toifa:</b> ${ad.category.toUpperCase()}
📍 <b>Manzil:</b> ${ad.location}
👤 <b>E'lon egasi:</b> ${ad.userName}
📞 <b>Bog'lanish:</b> ${ad.userPhone}

📝 <b>Tavsif:</b>
<i>${ad.description}</i>

🌐 <i>IjaraBozor platformasi orqali yuborildi</i>
  `.trim();

  try {
    let endpoint = "";
    let body = {};

    if (ad.image && ad.image.startsWith("http")) {
      endpoint = `https://api.telegram.org/bot${botToken}/sendPhoto`;
      body = {
        chat_id: chatId,
        photo: ad.image,
        caption: captionText,
        parse_mode: "HTML",
      };
    } else {
      endpoint = `https://api.telegram.org/bot${botToken}/sendMessage`;
      body = {
        chat_id: chatId,
        text: captionText,
        parse_mode: "HTML",
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      success: data.ok,
      data: data,
      error: data.description || null,
    };
  } catch (err) {
    console.error("Telegram API xatosi:", err);
    return {
      success: false,
      error: err.message,
    };
  }
}

/**
 * Validates bot token and gets bot information
 */
export async function getBotInfo(botToken) {
  if (!botToken) return { success: false, error: "Bot token kiritilmagan" };
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
    const data = await res.json();
    if (data.ok) {
      return { success: true, bot: data.result };
    }
    return { success: false, error: data.description || "Token noto'g'ri" };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Retrieves recent users/chats from /getUpdates
 */
export async function getRecentChats(botToken) {
  if (!botToken) return { success: false, error: "Bot token kiritilmagan", chats: [] };
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates`);
    const data = await res.json();
    if (data.ok && Array.isArray(data.result)) {
      const chatsMap = new Map();
      data.result.forEach((update) => {
        const msg = update.message || update.channel_post || update.my_chat_member?.chat;
        if (msg && msg.chat) {
          chatsMap.set(msg.chat.id, {
            id: msg.chat.id,
            title: msg.chat.title || msg.chat.first_name || "Noma'lum",
            username: msg.chat.username ? `@${msg.chat.username}` : "",
            type: msg.chat.type,
          });
        }
      });
      return { success: true, chats: Array.from(chatsMap.values()) };
    }
    return { success: false, error: data.description, chats: [] };
  } catch (err) {
    return { success: false, error: err.message, chats: [] };
  }
}

