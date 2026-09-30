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
