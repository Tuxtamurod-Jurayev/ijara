/**
 * One-click Webhook Setup Endpoint for Vercel
 * Visiting this URL sets the Telegram Bot Webhook to the current Vercel URL
 */

const BOT_TOKEN = "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo";

export default async function handler(req, res) {
  const host = req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const webhookUrl = `${protocol}://${host}/api/bot`;

  try {
    const tgRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
    );
    const data = await tgRes.json();

    return res.status(200).json({
      success: data.ok,
      message: data.ok
        ? "✅ Telegram Bot Webhook muvaffaqiyatli o'rnatildi! Endi bot 24/7 avtomatik ishlaydi."
        : "❌ Webhook o'rnatishda xatolik yuz berdi.",
      webhookUrl: webhookUrl,
      telegramResponse: data,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
