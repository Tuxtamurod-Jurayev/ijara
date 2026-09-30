// Initial Mock Data and Default State for IjaraBozor

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

export const INITIAL_ADS = [
  {
    id: "ad-1",
    userId: "user-1",
    userName: "Javohir Toshpo'latov",
    userPhone: "+998 90 123 45 67",
    title: "Yunusobod 4-mavzeda 3 xonali shinam kvartira",
    category: "kvartira",
    price: 650,
    currency: "USD",
    period: "oyiga",
    location: "Toshkent sh., Yunusobod tumani",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    description: "Evroremont qilingan, barcha maishiy texnikalar va yangi mebellar bilan jihozlangan. Metroga 5 daqiqalik masofada. Uzoq muddatga oilaga yoki xorijiy mehmonlarga beriladi.",
    features: ["Wi-Fi Internet", "Konditsioner", "Mebel", "Kir yuvish mashinasi", "Lift bor"],
    viewsCount: 342,
    createdAt: "2026-09-26",
    status: "active"
  },
  {
    id: "ad-2",
    userId: "user-3",
    userName: "Sanjarbek Aliyev",
    userPhone: "+998 97 555 77 88",
    title: "Chevrolet Tracker Premier 2024 — Kunlik va Oylik ijara",
    category: "avto",
    price: 450000,
    currency: "UZS",
    period: "kuniga",
    location: "Toshkent sh., Mirobod tumani",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    description: "Yangi holatda, toza va xavfsiz. Sug'urtalangan (KASKO). Haydovchisiz beriladi, pasport va haydovchilik guvohnomasi talab qilinadi. Boshlang'ich depozit bor.",
    features: ["Avtomat uzatma", "Lyuk", "Kruiz-kontrol", "Toza salon", "KASKO sug'urta"],
    viewsCount: 512,
    createdAt: "2026-09-28",
    status: "active"
  },
  {
    id: "ad-3",
    userId: "user-2",
    userName: "Malika Karimova",
    userPhone: "+998 94 987 65 43",
    title: "Chorvoq tog' yonbag'rida hashamatli Dacha (Basseyin, Sauna)",
    category: "hovli",
    price: 1800000,
    currency: "UZS",
    period: "kuniga",
    location: "Toshkent vil., Bo'stonliq t., Chorvoq",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    description: "Oilaviy dam olish va do'stlar bilan hordiq chiqarish uchun mo'ljallangan dacha. Filtrlangan qishki/yozgi basseyin, sauna, bilyard, PlayStation 5, mangal va qozon-ochoq bor.",
    features: ["Basseyin (Filtr)", "Fin saunasi", "Bilyard xonasi", "Wi-Fi", "Maftunkor tog' manzarasi"],
    viewsCount: 820,
    createdAt: "2026-09-25",
    status: "active"
  },
  {
    id: "ad-4",
    userId: "user-1",
    userName: "Javohir Toshpo'latov",
    userPhone: "+998 90 123 45 67",
    title: "Tashkent City yaqinida zamonaviy A-klass Ofis xonasi (120 m²)",
    category: "ofis",
    price: 2200,
    currency: "USD",
    period: "oyiga",
    location: "Toshkent sh., Shayxontohur tumani",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    description: "IT kompaniyalar yoki konsalting agentliklari uchun to'liq tayyor ofis. Ochiq coworking maydoni, meeting room va alohida rahbar kabineti bor. 24/7 qo'riqlash xizmati.",
    features: ["24/7 kirish", "Keng avtoturargoh", "Tezyurar Internet", "Meeting room", "Konditsioner tizimi"],
    viewsCount: 195,
    createdAt: "2026-09-27",
    status: "active"
  },
  {
    id: "ad-5",
    userId: "user-2",
    userName: "Malika Karimova",
    userPhone: "+998 94 987 65 43",
    title: "Sony FX3 Cinema Camera + GM Linzalar to'plami",
    category: "texnika",
    price: 350000,
    currency: "UZS",
    period: "kuniga",
    location: "Toshkent sh., Chilonzor tumani",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    description: "Klip, to'y yoki tijorat videolari olish uchun professional kamera. To'plamda: Sony FX3, 24-70mm GM II linza, 3 ta batareya, CFexpress kartasi va DJI RS3 Pro stabilizator mavjud.",
    features: ["4K 120fps", "DJI RS3 Gimbal", "3x Batareya", "Professional mikrofon", "Tezkor karta"],
    viewsCount: 140,
    createdAt: "2026-09-29",
    status: "active"
  }
];
