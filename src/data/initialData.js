// Initial Mock Data and Default State for IjaraBozor
import ADS_DATA from "./ads.json";

export const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "1234",
  role: "admin",
  fullName: "Bosh Administrator",
  phone: "+998 71 200 00 00",
};

export const DEFAULT_TELEGRAM_CONFIG = {
  botToken: "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo",
  botUsername: "ijara_buyum_bot",
  botName: "Ijara buyumlar",
  chatId: "",
  autoSend: true,
  webAppUrl: "https://ijara-nu.vercel.app", // Fallback or current deployed Vercel URL
};

export const INITIAL_USERS = [
  {
    id: "user-1",
    fullName: "Javohir Toshpo'latov",
    username: "javohir_t",
    phone: "+998 90 123 45 67",
    password: "user123",
    createdAt: "2026-09-18",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    role: "user"
  },
  {
    id: "user-2",
    fullName: "Malika Karimova",
    username: "malika_k",
    phone: "+998 94 987 65 43",
    password: "user123",
    createdAt: "2026-09-22",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    role: "user"
  },
  {
    id: "user-3",
    fullName: "Sanjarbek Aliyev",
    username: "sanjar_auto",
    phone: "+998 97 555 77 88",
    password: "user123",
    createdAt: "2026-09-27",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    role: "user"
  }
];

export const CATEGORIES = [
  { id: "all", name: "Barchasi", icon: "LayoutGrid" },
  { id: "kvartira", name: "Kvartiralar", icon: "Building" },
  { id: "hovli", name: "Hovli va Dacha", icon: "Home" },
  { id: "avto", name: "Avtomobillar", icon: "Car" },
  { id: "ofis", name: "Ofis va Tijorat", icon: "Briefcase" },
  { id: "texnika", name: "Jihoz va Texnika", icon: "Cpu" },
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
  { id: "kunlik", label: "Kunbay (Kunlik)" },
  { id: "oylik", label: "Oylik / Uzoq muddat" },
  { id: "soatlik", label: "Soatlik ijara" },
];

export const ROOM_OPTIONS = [
  { id: "all", label: "Xonalar: Barchasi" },
  { id: "1", label: "1 xonali" },
  { id: "2", label: "2 xonali" },
  { id: "3", label: "3 xonali" },
  { id: "4+", label: "4+ xonali" },
];

export const INITIAL_ADS = ADS_DATA;
