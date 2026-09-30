import React, { useState, useMemo, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AdCard } from "./components/AdCard";
import { AdDetailsModal } from "./components/AdDetailsModal";
import { CreateAdModal } from "./components/CreateAdModal";
import { AuthModal } from "./components/AuthModal";
import { AdminDashboard } from "./components/AdminDashboard";
import { MyAdsView } from "./components/MyAdsView";
import { FavoritesView } from "./components/FavoritesView";
import { TelegramIntegrationModal } from "./components/TelegramIntegrationModal";
import { ToastContainer } from "./components/ToastContainer";
import { Footer } from "./components/Footer";
import {
  Layers,
  Sparkles,
  Shield,
  Search,
  PlusCircle,
  RotateCcw,
  Crown,
} from "lucide-react";

// Inner Content Component to consume useApp()
const MainContent = () => {
  const {
    ads,
    currentUser,
    activeView,
    setActiveView,
    activeCategory,
    activeRegion,
    activeDuration,
    activeRooms,
    minPrice,
    maxPrice,
    searchQuery,
    priceSort,
    incrementViews,
    setSearchQuery,
    setActiveCategory,
    setActiveRegion,
    setActiveDuration,
    setActiveRooms,
    setMinPrice,
    setMaxPrice,
  } = useApp();

  // Modal open states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Deep linking: read query parameters from URL (Supports Telegram Bot buttons)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adId = params.get("ad");
    const action = params.get("action");
    const view = params.get("view");

    if (adId && ads.length > 0) {
      const found = ads.find((a) => a.id === adId);
      if (found) {
        setSelectedAd(found);
        incrementViews(found.id);
      }
    }

    if (action === "create") {
      setIsCreateAdOpen(true);
    }

    if (view === "admin") {
      setActiveView("admin");
    } else if (view === "favorites") {
      setActiveView("favorites");
    }
  }, [ads]);

  // Comprehensive Filter & Sort (Airbnb + OLX structure)
  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => {
        // 1. Category filter
        const matchCategory =
          activeCategory === "all" ||
          ad.category.toLowerCase() === activeCategory.toLowerCase();

        // 2. Region filter
        const matchRegion =
          !activeRegion ||
          activeRegion === "Barchasi" ||
          (ad.region && ad.region.toLowerCase().includes(activeRegion.toLowerCase())) ||
          ad.location.toLowerCase().includes(activeRegion.toLowerCase());

        // 3. Rental Duration filter
        const matchDuration =
          !activeDuration ||
          activeDuration === "all" ||
          ad.period === activeDuration ||
          ad.rentalType === activeDuration;

        // 4. Rooms filter
        const matchRooms =
          !activeRooms ||
          activeRooms === "all" ||
          (activeRooms === "4+" ? Number(ad.rooms) >= 4 : ad.rooms === activeRooms);

        // 5. Price Min/Max filter
        const priceNum = Number(ad.price) || 0;
        const matchMin = minPrice === "" || priceNum >= Number(minPrice);
        const matchMax = maxPrice === "" || priceNum <= Number(maxPrice);

        // 6. Search query
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          ad.title.toLowerCase().includes(q) ||
          ad.location.toLowerCase().includes(q) ||
          ad.description.toLowerCase().includes(q) ||
          (ad.features && ad.features.some((f) => f.toLowerCase().includes(q)));

        return (
          matchCategory &&
          matchRegion &&
          matchDuration &&
          matchRooms &&
          matchMin &&
          matchMax &&
          matchSearch
        );
      })
      .sort((a, b) => {
        // Price sort
        if (priceSort === "asc") return a.price - b.price;
        if (priceSort === "desc") return b.price - a.price;

        // Default: VIP ads first, then newest
        if (a.isVip && !b.isVip) return -1;
        if (!a.isVip && b.isVip) return 1;
        return 0;
      });
  }, [
    ads,
    activeCategory,
    activeRegion,
    activeDuration,
    activeRooms,
    minPrice,
    maxPrice,
    searchQuery,
    priceSort,
  ]);

  // Handle ad click
  const handleSelectAd = (ad) => {
    incrementViews(ad.id);
    setSelectedAd(ad);
  };

  const handleResetFilters = () => {
    setActiveCategory("all");
    setActiveRegion("Barchasi");
    setActiveDuration("all");
    setActiveRooms("all");
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top Navbar */}
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCreateAd={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
          } else {
            setIsCreateAdOpen(true);
          }
        }}
        onOpenTelegram={() => setIsTelegramOpen(true)}
      />

      {/* Main Body Switcher */}
      <main style={{ flexGrow: 1 }}>
        {/* VIEW 1: HOME */}
        {activeView === "home" && (
          <>
            <Hero />

            <div className="container" style={{ paddingBottom: "4rem" }}>
              {/* Results header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-main)" }}>
                    {activeCategory === "all"
                      ? "Barcha Ijara E'lonlari"
                      : `${activeCategory.toUpperCase()} bo'yicha e'lonlar`}
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    Topilgan natijalar: {filteredAds.length} ta
                    {activeRegion !== "Barchasi" ? ` • ${activeRegion}` : ""}
                  </p>
                </div>

                {(searchQuery ||
                  activeCategory !== "all" ||
                  activeRegion !== "Barchasi" ||
                  minPrice !== "" ||
                  maxPrice !== "") && (
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-secondary btn-sm"
                    style={{ gap: "0.4rem" }}
                  >
                    <RotateCcw size={14} />
                    <span>Filtrlarni tozalash</span>
                  </button>
                )}
              </div>

              {/* Ads Grid */}
              {filteredAds.length === 0 ? (
                <div
                  className="card"
                  style={{
                    padding: "3.5rem 1.5rem",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Search size={28} />
                  </div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                    Kiritilgan filtrlarga mos e'lonlar topilmadi
                  </h3>
                  <p style={{ color: "var(--text-muted)", maxWidth: "420px", fontSize: "0.9rem" }}>
                    Qidiruv so'zini yoki hududni o'zgartirib ko'ring yoki barcha e'lonlarni ko'rish tugmasini bosing.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="btn btn-primary btn-sm"
                  >
                    Filtrlarni tozalab ko'rish
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "1.5rem",
                  }}
                >
                  {filteredAds.map((ad) => (
                    <AdCard key={ad.id} ad={ad} onSelectAd={handleSelectAd} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* VIEW 2: ADMIN PANEL */}
        {activeView === "admin" && (
          <>
            {currentUser?.role === "admin" ? (
              <AdminDashboard onSelectAd={handleSelectAd} />
            ) : (
              <div className="container" style={{ padding: "5rem 1.25rem", textAlign: "center" }}>
                <div
                  className="card"
                  style={{
                    maxWidth: "460px",
                    margin: "0 auto",
                    padding: "2.5rem 1.5rem",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(139, 92, 246, 0.15)",
                      color: "var(--accent)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.25rem",
                    }}
                  >
                    <Shield size={30} />
                  </div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                    Administrator Huquqi Talab Qilinadi
                  </h2>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                    Barcha foydalanuvchilar va ularning e'lonlarini ko'rish uchun admin sifatida tizimga kiring.
                  </p>
                  <div
                    style={{
                      padding: "0.75rem",
                      background: "var(--bg-card-subtle)",
                      borderRadius: "var(--radius-md)",
                      border: "1px dashed var(--border)",
                      marginBottom: "1.5rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    Login: <strong>admin</strong> | Parol: <strong>1234</strong>
                  </div>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="btn btn-primary"
                    style={{ width: "100%" }}
                  >
                    Admin sifatida kirish
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* VIEW 3: MY ADS */}
        {activeView === "my-ads" && (
          <MyAdsView
            onOpenCreateAd={() => setIsCreateAdOpen(true)}
            onSelectAd={handleSelectAd}
          />
        )}

        {/* VIEW 4: FAVORITES (SAVED) */}
        {activeView === "favorites" && (
          <FavoritesView onSelectAd={handleSelectAd} />
        )}
      </main>

      {/* Footer */}
      <Footer onOpenTelegram={() => setIsTelegramOpen(true)} />

      {/* Modals & Overlays */}
      <AdDetailsModal ad={selectedAd} onClose={() => setSelectedAd(null)} />
      <CreateAdModal isOpen={isCreateAdOpen} onClose={() => setIsCreateAdOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <TelegramIntegrationModal isOpen={isTelegramOpen} onClose={() => setIsTelegramOpen(false)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
