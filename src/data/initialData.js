// Initial Mock Data and Default State for IjaraBozor
import ADS_DATA from "./ads.json";

export const ADMIN_CONFIG = {
  telegramId: "365446274",
  telegramUsername: "Perfektum_1997",
  username: "admin",
  password: "1234",
  role: "admin",
  fullName: "To'xtamurod Jo'rayev (Admin)",
  phone: "+998 90 000 00 00",
};

export const ADMIN_CREDENTIALS = {
  username: ADMIN_CONFIG.username,
  password: ADMIN_CONFIG.password,
  role: "admin",
  fullName: ADMIN_CONFIG.fullName,
  phone: ADMIN_CONFIG.phone,
  telegramId: ADMIN_CONFIG.telegramId,
  telegramUsername: ADMIN_CONFIG.telegramUsername,
};

export const DEFAULT_TELEGRAM_CONFIG = {
  botToken: "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo",
  botUsername: "ijara_buyum_bot",
  botName: "Ijara buyumlar",
  adminTelegramId: "365446274",
  adminTelegramUsername: "Perfektum_1997",
  chatId: "365446274", // Target admin directly by default
  autoSend: true,
  webAppUrl: "https://ijara-gold.vercel.app",
};

export const INITIAL_USERS = [
  {
    id: "admin-perfektum",
    fullName: "To'xtamurod Jo'rayev",
    username: "Perfektum_1997",
    telegramId: "365446274",
    phone: "+998 90 000 00 00",
    password: "1234",
    createdAt: "2026-09-01",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "admin",
  },
  {
    id: "user-1",
    fullName: "Javohir Toshpo'latov",
    username: "javohir_t",
    phone: "+998 90 123 45 67",
    password: "user123",
    createdAt: "2026-09-18",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "user",
  },
  {
    id: "user-2",
    fullName: "Malika Karimova",
    username: "malika_k",
    phone: "+998 94 987 65 43",
    password: "user123",
    createdAt: "2026-09-22",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "user",
  },
  {
    id: "user-3",
    fullName: "Sanjarbek Aliyev",
    username: "sanjar_auto",
    phone: "+998 97 555 77 88",
    password: "user123",
    createdAt: "2026-09-27",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    role: "user",
  }
];

export const CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "all" },
  { id: "kvartira", name: "Kvartiralar", icon: "building" },
  { id: "hovli", name: "Hovli va Dacha", icon: "home" },
  { id: "avto", name: "Avtomobillar", icon: "car" },
  { id: "ofis", name: "Ofis va Tijorat", icon: "briefcase" },
  { id: "texnika", name: "Jihoz va Texnika", icon: "cpu" },
];

export const REGIONS = [
  "Barchasi",
  "Toshkent shahri",
  "Toshkent viloyati",
  "Samarqand",
  "Buxoro",
  "Andijon",
  "Farg'ona",
  "Namangan",
  "Qashqadaryo",
  "Xorazm",
  "Surxondaryo",
  "Navoiy",
  "Jizzax",
  "Sirdaryo",
];

export const RENTAL_DURATIONS = [
  { id: "all", label: "Barcha muddatlar" },
  { id: "kunlik", label: "Kunbay" },
  { id: "oylik", label: "Oylik" },
  { id: "soatlik", label: "Soatlik" },
];

export const ROOM_OPTIONS = [
  { id: "all", label: "Barchasi" },
  { id: "1", label: "1 xona" },
  { id: "2", label: "2 xona" },
  { id: "3", label: "3 xona" },
  { id: "4+", label: "4+ xona" },
];

export const INITIAL_ADS = ADS_DATA;
