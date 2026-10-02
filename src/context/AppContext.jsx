import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_USERS, INITIAL_ADS, ADMIN_CREDENTIALS, DEFAULT_TELEGRAM_CONFIG } from "../data/initialData";
import { initTelegramWebApp, sendAdToTelegram } from "../utils/telegram";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("ijara_theme") || "light";
  });

  // Users state (persisted)
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("ijara_users");
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  // Ads state (persisted)
  const [ads, setAds] = useState(() => {
    const saved = localStorage.getItem("ijara_ads");
    return saved ? JSON.parse(saved) : INITIAL_ADS;
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("ijara_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Telegram WebApp environment
  const [telegramInfo, setTelegramInfo] = useState({
    isInsideTelegram: false,
    user: null,
  });

  // Favorites state (persisted)
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("ijara_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Navigation & views: 'home' | 'admin' | 'my-ads' | 'favorites'
  const [activeView, setActiveView] = useState("home");

  // Advanced Filter states (Like OLX & Airbnb)
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRegion, setActiveRegion] = useState("Barchasi");
  const [activeDuration, setActiveDuration] = useState("all");
  const [activeRooms, setActiveRooms] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState("default"); // 'default', 'asc', 'desc'

  // Telegram Bot integration config
  const [telegramConfig, setTelegramConfig] = useState(() => {
    const saved = localStorage.getItem("ijara_telegram_config");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.botToken) {
        parsed.botToken = DEFAULT_TELEGRAM_CONFIG.botToken;
      }
      return parsed;
    }
    return DEFAULT_TELEGRAM_CONFIG;
  });

  // Toasts
  const [toasts, setToasts] = useState([]);

  // Sync theme attribute on <html>
  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("ijara_theme", theme);
    } catch (e) {}
  }, [theme]);

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ijara_users", JSON.stringify(users));
    } catch (e) {}
  }, [users]);

  // Sync ads to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ijara_ads", JSON.stringify(ads));
    } catch (e) {}
  }, [ads]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem("ijara_favorites", JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  // Sync currentUser to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("ijara_current_user", JSON.stringify(currentUser));
      } else {
        localStorage.removeItem("ijara_current_user");
      }
    } catch (e) {}
  }, [currentUser]);

  // Sync telegramConfig
  useEffect(() => {
    try {
      localStorage.setItem("ijara_telegram_config", JSON.stringify(telegramConfig));
    } catch (e) {}
  }, [telegramConfig]);

  // Check Telegram WebApp and URL query parameters for Instant Auto-Login
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const paramUserId = params.get("userId");
      const paramName = params.get("name");
      const paramPhone = params.get("phone");
      const paramTgId = params.get("tgId") || params.get("telegramId");

      const tg = initTelegramWebApp();
      const tgUser = tg.user;
      const effectiveTgId = paramTgId || (tgUser ? String(tgUser.id) : null);

      if (effectiveTgId) {
        const isMasterAdmin =
          effectiveTgId === "365446274" ||
          (paramName && paramName.toLowerCase().includes("to'xtamurod")) ||
          tgUser?.username?.toLowerCase() === "perfektum_1997";

        const authenticatedUser = {
          id: paramUserId || `tg-${effectiveTgId}`,
          fullName:
            paramName ||
            (tgUser ? `${tgUser.first_name || ""} ${tgUser.last_name || ""}`.trim() : "") ||
            (isMasterAdmin ? ADMIN_CREDENTIALS.fullName : "Telegram Foydalanuvchisi"),
          username: tgUser?.username || (paramName ? paramName.toLowerCase().replace(/\s+/g, "_") : `tg_${effectiveTgId}`),
          phone: paramPhone || "+998 90 000 00 00",
          telegramId: effectiveTgId,
          role: isMasterAdmin ? "admin" : "user",
          isTelegramUser: true,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        };

        setCurrentUser(authenticatedUser);

        // Also save to users list if not exists
        setUsers((prev) => {
          const exists = prev.some(
            (u) => u.id === authenticatedUser.id || String(u.telegramId) === String(effectiveTgId)
          );
          if (!exists) {
            return [authenticatedUser, ...prev];
          }
          return prev;
        });

        if (isMasterAdmin) {
          showToast("Salom, Bosh Administrator (To'xtamurod Jo'rayev)! Tizimga xush kelibsiz 👑", "success");
        } else {
          showToast(`Xush kelibsiz, ${authenticatedUser.fullName}! ✅`, "success");
        }
      } else if (tg.isInsideTelegram) {
        setTelegramInfo({
          isInsideTelegram: true,
          user: tg.user,
        });
      }
    } catch (err) {
      console.warn("Auto-login error:", err);
    }
  }, []);

  // Toggle Favorite
  const toggleFavorite = (adId) => {
    setFavorites((prev) => {
      const exists = prev.includes(adId);
      if (exists) {
        showToast("Sevimlilardan olib tashlandi", "warning");
        return prev.filter((id) => id !== adId);
      } else {
        showToast("Sevimlilarga qo'shildi! ❤️", "success");
        return [...prev, adId];
      }
    });
  };

  // Toast notifier helper
  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // User Registration: ism fam, login, telefon nomer, parol
  const registerUser = ({ fullName, username, phone, password }) => {
    const cleanUsername = username.trim().toLowerCase();

    // Check if reserved admin username
    if (
      cleanUsername === ADMIN_CREDENTIALS.username.toLowerCase() ||
      cleanUsername === "perfektum_1997"
    ) {
      showToast("Bu login band (Tizim ma'muri)!", "danger");
      return { success: false, error: "Ushbu logindan foydalanish mumkin emas" };
    }

    // Check if username already exists
    const exists = users.some(
      (u) => u.username.toLowerCase() === cleanUsername
    );
    if (exists) {
      showToast("Bunday loginli foydalanuvchi allaqachon mavjud!", "warning");
      return { success: false, error: "Login allaqachon mavjud" };
    }

    const newUser = {
      id: "user-" + Date.now(),
      fullName: fullName.trim(),
      username: cleanUsername,
      phone: phone.trim(),
      password: password,
      role: "user",
      createdAt: new Date().toISOString().split("T")[0],
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80`
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Xush kelibsiz, ${newUser.fullName}! Ro'yxatdan muvaffaqiyatli o'tdingiz.`);
    return { success: true, user: newUser };
  };

  // User Login: login, parol (Supports admin & normal users)
  const loginUser = ({ username, password }) => {
    const cleanUsername = username.trim().toLowerCase();

    // 1. Admin login: "admin" or "perfektum_1997", password "1234"
    if (
      (cleanUsername === ADMIN_CREDENTIALS.username.toLowerCase() ||
        cleanUsername === "perfektum_1997") &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser = {
        id: "admin-master",
        username: "Perfektum_1997",
        fullName: ADMIN_CREDENTIALS.fullName,
        phone: ADMIN_CREDENTIALS.phone,
        telegramId: "365446274",
        role: "admin",
      };
      setCurrentUser(adminUser);
      setActiveView("admin");
      showToast("Xush kelibsiz, Bosh Administrator (To'xtamurod Jo'rayev)!", "success");
      return { success: true, user: adminUser };
    }


    // 2. Normal user login
    const foundUser = users.find(
      (u) => u.username.toLowerCase() === cleanUsername && u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      showToast(`Xush kelibsiz, ${foundUser.fullName}!`, "success");
      return { success: true, user: foundUser };
    }

    showToast("Login yoki parol noto'g'ri!", "danger");
    return { success: false, error: "Login yoki parol noto'g'ri!" };
  };

  // Logout
  const logoutUser = () => {
    setCurrentUser(null);
    setActiveView("home");
    showToast("Tizimdan chiqdingiz");
  };

  // Create Advertisement
  const createAd = async (adData) => {
    let adUser = currentUser;
    if (!adUser) {
      const guestName = adData.userName?.trim() || "Foydalanuvchi";
      const guestPhone = adData.userPhone?.trim() || "+998 90 000 00 00";
      const guestUser = {
        id: "user-" + Date.now(),
        fullName: guestName,
        username: adData.telegramUsername?.trim() || "user_" + Date.now().toString().slice(-4),
        phone: guestPhone,
        role: "user",
        createdAt: new Date().toISOString().split("T")[0],
      };
      setUsers((prev) => [guestUser, ...prev]);
      setCurrentUser(guestUser);
      adUser = guestUser;
    }

    const imagesList =
      adData.images && adData.images.length > 0
        ? adData.images
        : [adData.image || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"];

    const newAd = {
      id: "ad-" + Date.now(),
      userId: adUser.id,
      userName: adData.userName || adUser.fullName,
      userPhone: adData.userPhone || adUser.phone,
      telegramUsername: adData.telegramUsername || adUser.username || "",
      title: adData.title,
      category: adData.category || "kvartira",
      region: adData.region || "Toshkent shahri",
      price: Number(adData.price),
      currency: adData.currency || "UZS",
      period: adData.period || "kuniga",
      rentalType: adData.rentalType || "kunlik",
      location: adData.location,
      image: imagesList[0],
      images: imagesList,
      description:
        adData.description ||
        `${adData.title}. Kunlik ijara narxi: ${Number(adData.price).toLocaleString()} ${adData.currency || "UZS"}. Joylashuv: ${adData.location}. Bog'lanish: ${adData.userPhone || adUser.phone}`,
      features: adData.features || ["Kunlik ijara", "Ishonchli", "Tezkor aloqa"],
      viewsCount: 1,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      isVip: Boolean(adData.isVip),
    };

    setAds((prev) => [newAd, ...prev]);
    showToast("E'lon muvaffaqiyatli joylashtirildi!", "success");

    // Dispatch to Telegram Bot & Master Admin
    const token = telegramConfig.botToken || "8999944025:AAHHGHhom9ZjWbIJAaYjsmJJGJNGLqsBbSo";
    const targetChat = telegramConfig.chatId || "365446274";
    sendAdToTelegram(newAd, token, targetChat)
      .then((res) => {
        if (res.success) {
          showToast("E'lon Telegram bot/kanalga ham muvaffaqiyatli yuborildi!", "success");
        } else {
          console.warn("Telegram botga yuborishda xato:", res.error);
        }
      })
      .catch((err) => console.error("Telegram API xatosi:", err));

    return { success: true, ad: newAd };
  };

  // Delete Ad (Admin or Ad Owner)
  const deleteAd = (adId) => {
    const targetAd = ads.find((a) => a.id === adId);
    if (!targetAd) return;

    if (
      currentUser?.role !== "admin" &&
      currentUser?.id !== targetAd.userId
    ) {
      showToast("Sizda ushbu e'lonni o'chirish huquqi yo'q!", "danger");
      return;
    }

    setAds((prev) => prev.filter((a) => a.id !== adId));
    showToast("E'lon o'chirildi", "warning");
  };

  // Admin delete user
  const deleteUser = (userId) => {
    if (currentUser?.role !== "admin") return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    // Also remove ads of deleted user
    setAds((prev) => prev.filter((a) => a.userId !== userId));
    showToast("Foydalanuvchi va uning e'lonlari o'chirildi", "warning");
  };

  // Increment view counter
  const incrementViews = (adId) => {
    setAds((prev) =>
      prev.map((ad) =>
        ad.id === adId ? { ...ad, viewsCount: (ad.viewsCount || 0) + 1 } : ad
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        users,
        ads,
        favorites,
        toggleFavorite,
        telegramInfo,
        activeView,
        setActiveView,
        activeCategory,
        setActiveCategory,
        activeRegion,
        setActiveRegion,
        activeDuration,
        setActiveDuration,
        activeRooms,
        setActiveRooms,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        searchQuery,
        setSearchQuery,
        priceSort,
        setPriceSort,
        telegramConfig,
        setTelegramConfig,
        toasts,
        showToast,
        registerUser,
        loginUser,
        logoutUser,
        createAd,
        deleteAd,
        deleteUser,
        incrementViews,
      }}
    >
      {children}

    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
