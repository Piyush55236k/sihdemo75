import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  Sun,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Leaf,
  Cloud,
  CloudRain,
  ShoppingCart,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import AuthModal from "../components/AuthModal";
import PestCheckPage from "./PestCheckPage";
import MarketPricesPage from "./MarketPricesPage";
import CropCalendarPage from "./CropCalendarPage";
import QuestPage from "./QuestPage";
import CommunityPage from "./CommunityPage";
import ShopPage from "./ShopPage";
import { useAuth } from "../components/AuthProvider_Real";
import WeatherService from "../services/weatherService";

const CleanHomepage = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [currentLanguage] = useState("en");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [weatherData, setWeatherData] = useState({
    temperature: "--",
    humidity: "--",
    location: "Loading...",
    condition: "Unknown",
    forecast: [],
  });
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const productsCarouselRef = useRef(null);
  const [currentProductsPage, setCurrentProductsPage] = useState(0);
  const [productsPagesCount, setProductsPagesCount] = useState(1);

  // Carousel pagination: compute pages based on container width and card width
  useEffect(() => {
    const el = productsCarouselRef.current;
    if (!el) return;

    const CARD_WIDTH = 240; // min/max width in UI
    const GAP = 16; // gap-4 ~ 1rem (16px)

    const computePages = () => {
      const visibleWidth = el.clientWidth;
      const perView = Math.max(1, Math.floor((visibleWidth + GAP) / (CARD_WIDTH + GAP)));
      const totalItems = getFilteredProducts().slice(0, 12).length;
      const pages = Math.max(1, Math.ceil(totalItems / perView));
      setProductsPagesCount(pages);

      const page = Math.round(el.scrollLeft / visibleWidth);
      setCurrentProductsPage(Math.min(pages - 1, Math.max(0, page)));
    };

    computePages();
    const ro = new ResizeObserver(computePages);
    ro.observe(el);

    let snapTimer = null;
    const onScroll = () => {
      const visibleWidth = el.clientWidth;
      const page = Math.round(el.scrollLeft / visibleWidth);
      setCurrentProductsPage(page);
      // Debounce snap after user stops scrolling
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        const nearest = Math.round(el.scrollLeft / visibleWidth);
        el.scrollTo({ left: nearest * visibleWidth, behavior: 'smooth' });
      }, 120);
    };
    el.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      try { ro.disconnect(); } catch {}
      el.removeEventListener('scroll', onScroll);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [selectedCategory]);

  const scrollToProductsPage = (pageIndex) => {
    const el = productsCarouselRef.current;
    if (!el) return;
    const left = pageIndex * el.clientWidth;
    el.scrollTo({ left, behavior: 'smooth' });
    setCurrentProductsPage(pageIndex);
  };

  // Keyboard navigation for accessibility
  const onProductsKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(0, currentProductsPage - 1);
      scrollToProductsPage(prev);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(productsPagesCount - 1, currentProductsPage + 1);
      scrollToProductsPage(next);
    }
  };

  // Initialize weather service
  const weatherService = new WeatherService();

  // Shop product data
  const products = [
    {
      id: 1,
      name: "Tomato Seeds",
      price: 199,
      category: "Seeds & Plants",
      image: "/shop-assests/tomato seeds.jpg",
    },
    {
      id: 2,
      name: "Wheat Seeds",
      price: 299,
      category: "Seeds & Plants",
      image: "/shop-assests/wheat seeds.jpg",
    },
    {
      id: 3,
      name: "Rice Seeds",
      price: 250,
      category: "Seeds & Plants",
      image: "/shop-assests/rice seeds.jpg",
    },
    {
      id: 4,
      name: "Cucumber Seeds",
      price: 180,
      category: "Seeds & Plants",
      image: "/shop-assests/cucumber seeds.jpg",
    },
    {
      id: 5,
      name: "Mango Seeds",
      price: 150,
      category: "Seeds & Plants",
      image: "/shop-assests/mango seeds.jpg",
    },
    {
      id: 6,
      name: "Potato Seeds",
      price: 220,
      category: "Seeds & Plants",
      image: "/shop-assests/potato seeds.jpg",
    },
    {
      id: 7,
      name: "Watermelon Seeds",
      price: 320,
      category: "Seeds & Plants",
      image: "/shop-assests/watermelon seeds.jpg",
    },
    {
      id: 8,
      name: "Spade",
      price: 450,
      category: "Farm Equipment",
      image: "/shop-assests/spade.jpg",
    },
    {
      id: 9,
      name: "Hoes",
      price: 350,
      category: "Farm Equipment",
      image: "/shop-assests/hoes.jpg",
    },
    {
      id: 10,
      name: "Sickle",
      price: 280,
      category: "Farm Equipment",
      image: "/shop-assests/sickle.jpg",
    },
    {
      id: 11,
      name: "Trowels",
      price: 180,
      category: "Farm Equipment",
      image: "/shop-assests/trowels.jpg",
    },
    {
      id: 12,
      name: "Irrigation Kit",
      price: 2500,
      category: "Farm Equipment",
      image: "/shop-assests/irrigation kit.jpg",
    },
    {
      id: 13,
      name: "Sprinklers",
      price: 1200,
      category: "Farm Equipment",
      image: "/shop-assests/sprinklers.jpg",
    },
    {
      id: 14,
      name: "Pressure Sprayer",
      price: 800,
      category: "Farm Equipment",
      image: "/shop-assests/pressure sprayer pump.jpg",
    },
    {
      id: 15,
      name: "Organic Fertilizer",
      price: 450,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/organic fertilizer.jpg",
    },
    {
      id: 16,
      name: "Chemical Fertilizer",
      price: 380,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/chemical fertilizer.jpg",
    },
    {
      id: 17,
      name: "Bio Fertilizer",
      price: 520,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/bio fertilizer.jpg",
    },
    {
      id: 18,
      name: "Vermicompost",
      price: 300,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/vermicompost.jpg",
    },
    {
      id: 19,
      name: "Pesticide",
      price: 680,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/pesticide.jpg",
    },
    {
      id: 20,
      name: "Fungicides",
      price: 590,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/fungicides.jpg",
    },
    {
      id: 21,
      name: "Herbicides",
      price: 480,
      category: "Fertilizers & Pesticides",
      image: "/shop-assests/herbicides.jpg",
    },
    {
      id: 22,
      name: "Safety Gloves",
      price: 120,
      category: "Protective Gear",
      image: "/shop-assests/Gloves.jpg",
    },
    {
      id: 23,
      name: "Safety Boots",
      price: 850,
      category: "Protective Gear",
      image: "/shop-assests/boots.jpg",
    },
    {
      id: 24,
      name: "Soil Testing Kit",
      price: 350,
      category: "Farm Inputs",
      image: "/shop-assests/soil testing kit.jpg",
    },
    {
      id: 25,
      name: "Grow Bags",
      price: 80,
      category: "Farm Inputs",
      image: "/shop-assests/Grow bags.jpg",
    },
    {
      id: 26,
      name: "Biochar",
      price: 400,
      category: "Farm Inputs",
      image: "/shop-assests/biochar.jpg",
    },
    {
      id: 27,
      name: "Jute",
      price: 250,
      category: "Farm Inputs",
      image: "/shop-assests/jute.jpg",
    },
  ];

  // Filter products by category
  const getFilteredProducts = () => {
    if (selectedCategory === "All") return products;
    return products.filter((product) => product.category === selectedCategory);
  };

  // Load weather data
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setIsLoadingWeather(true);

        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const weather = await weatherService.getCurrentWeather(
                  latitude,
                  longitude
                );
                const forecast = await weatherService.getWeatherForecast(
                  latitude,
                  longitude
                );
                const alerts = await weatherService.getWeatherAlerts(
                  latitude,
                  longitude
                );

                setWeatherData({
                  temperature: Math.round(weather.temperature),
                  humidity: weather.humidity,
                  location: weather.location,
                  condition: weather.weather || weather.condition || "",
                  forecast: forecast.forecast
                    ? forecast.forecast.slice(0, 4)
                    : [],
                });
                setWeatherAlerts(alerts || []);
              } catch (error) {
                console.error("Error fetching weather:", error);
                // Use default location as fallback
                await loadDefaultWeather();
              }
            },
            async (error) => {
              console.log("Geolocation error:", error);
              // Use default location as fallback
              await loadDefaultWeather();
            }
          );
        } else {
          await loadDefaultWeather();
        }
      } catch (error) {
        console.error("Weather loading error:", error);
        await loadDefaultWeather();
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const loadDefaultWeather = async () => {
      try {
        // Default to Ahmedabad coordinates
        const weather = await weatherService.getCurrentWeather(
          23.0225,
          72.5714
        );
        const forecast = await weatherService.getWeatherForecast(
          23.0225,
          72.5714
        );
        const alerts = await weatherService.getWeatherAlerts(23.0225, 72.5714);

        setWeatherData({
          temperature: Math.round(weather.temperature),
          humidity: weather.humidity,
          location: weather.location || "Ahmedabad, Gujarat",
          condition: weather.weather || weather.condition || "",
          forecast: forecast.forecast ? forecast.forecast.slice(0, 4) : [],
        });
        setWeatherAlerts(alerts || []);
      } catch (error) {
        console.error("Default weather error:", error);
        // Use mock data as final fallback
        setWeatherData({
          temperature: 28,
          humidity: 65,
          location: "Ahmedabad, Gujarat",
          condition: "Sunny",
          forecast: [
            { day: "Today", high: 32, low: 24, condition: "Sunny" },
            { day: "Tomorrow", high: 31, low: 23, condition: "Partly Cloudy" },
            { day: "Wed", high: 29, low: 22, condition: "Cloudy" },
            { day: "Thu", high: 30, low: 23, condition: "Sunny" },
          ],
        });
        setWeatherAlerts([]); // No alerts for fallback data
      }
    };

    loadWeatherData();
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("sunny") || cond.includes("clear")) {
      return <Sun className="w-12 h-12 text-yellow-500" />;
    } else if (cond.includes("cloud")) {
      return <Cloud className="w-12 h-12 text-gray-500" />;
    } else if (cond.includes("rain")) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    }
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  // Helpers for forecast rendering
  const getForecastDayLabel = (item, index) => {
    if (!item) return "--";
    if (index === 0) return "Today";
    if (item.day) return item.day; // fallback for legacy structure
    if (item.datetime) {
      const d = new Date(item.datetime);
      if (!isNaN(d)) {
        return d.toLocaleDateString(undefined, { weekday: "short" });
      }
    }
    return "Day";
  };
  const getForecastHighLow = (item) => {
    if (!item) return { high: undefined, low: undefined };
    const high = item.maxTemp ?? item.high ?? item.temperature;
    const low =
      item.minTemp ??
      item.low ??
      (item.temperature !== undefined ? item.temperature - 2 : undefined);
    return { high, low };
  };

  // Quick actions data
  const quickActions = [
    {
      id: "soil-fertilizer",
      title: currentLanguage === "hi" ? "मिट्टी उर्वरक" : "Soil Fertilizer",
      description:
        currentLanguage === "hi"
          ? "मिट्टी विश्लेषण के आधार पर उर्वरक सिफारिशें प्राप्त करें"
          : "Get fertilizer recommendations based on soil analysis",
      icon: "🌱",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
    },
    {
      id: "pest-check",
      title: currentLanguage === "hi" ? "कीट जांच" : "Pest Detection",
      description:
        currentLanguage === "hi"
          ? "पौधों की छवियों को अपलोड करके कीट पहचानें"
          : "Upload plant images to detect and identify pests",
      icon: "🐛",
      color: "bg-red-50 border-red-200",
      iconColor: "text-red-600",
    },
    {
      id: "market-prices",
      title: currentLanguage === "hi" ? "बाजार मूल्य" : "Market Prices",
      description:
        currentLanguage === "hi"
          ? "वर्तमान बाजार मूल्य जांचें"
          : "Check current market prices",
      icon: "📈",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      id: "crop-calendar",
      title: currentLanguage === "hi" ? "फसल कैलेंडर" : "Crop Calendar",
      description:
        currentLanguage === "hi"
          ? "मौसमी फसल कैलेंडर देखें"
          : "View seasonal crop calendar",
      icon: "📅",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
    },
    {
      id: "my-progress",
      title: currentLanguage === "hi" ? "मेरी प्रगति" : "My Progress",
      description:
        currentLanguage === "hi"
          ? "अपनी कृषि प्रगति को ट्रैक करें"
          : "Track your farming progress",
      icon: "📊",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
    },
    {
      id: "crop-advisory",
      title: currentLanguage === "hi" ? "फसल सलाह" : "Crop Advisory",
      description:
        currentLanguage === "hi"
          ? "मिट्टी विश्लेषण के आधार पर फसल सिफारिशें प्राप्त करें"
          : "Get AI-powered crop recommendations based on soil analysis",
      icon: "🌾",
      color: "bg-teal-50 border-teal-200",
      iconColor: "text-teal-600",
    },
  ];

  const handleQuickAction = (actionId) => {
    // Navigate to the appropriate route for each action
    switch (actionId) {
      case "pest-check":
        window.location.href = "/pest-check";
        break;
      case "soil-fertilizer":
        window.location.href = "/SoilFertilizerPage";
        break;
      case "market-prices":
        window.location.href = "/market-prices";
        break;
      case "crop-calendar":
        window.location.href = "/crop-calendar";
        break;
      case "my-progress":
        window.location.href = "/quests";
        break;
      case "crop-advisory":
        window.location.href = "/SoilFertilizerPage";
        break;
      default:
        setCurrentPage(actionId);
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Refresh weather and alerts on demand
  const handleRefreshWeather = async () => {
    try {
      setIsLoadingWeather(true);
      const loc = await weatherService.getCurrentLocation();
      const weather = await weatherService.getCurrentWeather(
        loc.latitude,
        loc.longitude
      );
      const forecast = await weatherService.getWeatherForecast(
        loc.latitude,
        loc.longitude
      );
      const alerts = await weatherService.getWeatherAlerts(
        loc.latitude,
        loc.longitude
      );
      setWeatherData({
        temperature: Math.round(weather.temperature),
        humidity: weather.humidity,
        location: weather.location,
        condition: weather.weather || weather.condition || "",
        forecast: forecast.forecast ? forecast.forecast.slice(0, 4) : [],
      });
      setWeatherAlerts(alerts || []);
    } catch (e) {
      console.error("Refresh weather failed", e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // Product modal actions
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };
  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };
  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
    // keep modal open to allow view more, or close if desired
  };
  const handleViewDetails = (product) => {
    setShowProductModal(false);
    setSelectedProduct(null);
    setCurrentPage("shop");
  };

  // Render different pages based on current page
  if (currentPage === "pest-check") {
    return (
      <PestCheckPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }
  if (currentPage === "market-prices") {
    return (
      <MarketPricesPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }
  if (currentPage === "crop-calendar") {
    return (
      <CropCalendarPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }
  if (currentPage === "quest") {
    return (
      <QuestPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }
  if (currentPage === "soil-fertilizer") {
    // Redirect to the actual route for soil fertilizer page
    window.location.href = "/SoilFertilizerPage";
    return null;
  }
  if (currentPage === "community") {
    return (
      <CommunityPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }
  if (currentPage === "shop") {
    return (
      <ShopPage
        onBack={() => setCurrentPage("home")}
        currentLanguage={currentLanguage}
      />
    );
  }

  // Main homepage rendering
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo - First */}
            <div className="flex items-center space-x-3 group mr-8 px-3 py-2 rounded-lg hover:bg-green-50 transition-all duration-300 cursor-pointer">
              <div className="transform transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/logo1.jpg"
                  alt="AgroMitra Logo"
                  className="w-10 h-10 rounded-lg"
                />
              </div>
              <span className="text-2xl font-bold text-green-600 font-serif tracking-tight group-hover:text-green-700 transition-colors duration-300">
                AgroMitra
              </span>
            </div>

            {/* Navigation Links - Second (Taking remaining space) */}
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-2">
              <button
                onClick={() => handleNavigation("home")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                HOME
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
              <button
                onClick={() => handleNavigation("features")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                FEATURES
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
              <button
                onClick={() => (window.location.href = "/quests")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                QUEST
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
              <button
                onClick={() => setCurrentPage("shop")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                SHOP
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
              <button
                onClick={() => (window.location.href = "/faq")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                FAQ
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
              <button
                onClick={() => (window.location.href = "/community")}
                className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 font-semibold text-sm tracking-wide transition-all duration-300 rounded-lg relative group"
              >
                COMMUNITY
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-3/4"></span>
              </button>
            </nav>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-2 rounded-full hover:bg-green-200 transition-colors duration-300 cursor-pointer">
                <span className="text-green-700 font-semibold text-sm">
                  50 🌟
                </span>
              </div>
              <button
                onClick={() => (window.location.href = "/notifications")}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 group"
              >
                <Bell className="w-6 h-6 text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
              {isAuthenticated ? (
                <div className="relative group">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                    <button
                      onClick={() => (window.location.href = "/dashboard")}
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition-colors duration-200"
                    >
                      📊 Dashboard
                    </button>
                    <button
                      onClick={() => (window.location.href = "/profile-setup")}
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition-colors duration-200"
                    >
                      👤 Profile Setup
                    </button>
                    <button
                      onClick={() => (window.location.href = "/settings")}
                      className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 w-full text-left transition-colors duration-200"
                    >
                      ⚙️ Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        /* handle logout */
                      }}
                      className="block px-4 py-2 text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/farm3.jpg')`,
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome
              <br />
              to AgroMitra
            </h1>
            <button
              onClick={() => setCurrentPage("community")}
              className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto"
            >
              <span>Connect With Community</span>
              <span className="text-xl">🤝</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Quick Actions */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`${action.color} border-2 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{action.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                      <span className="text-sm text-gray-500">
                        {currentLanguage === "hi" ? "अब उपलब्ध" : "Available now"} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Soil Fertilizer Recommendation Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img src="/soil.jpg" alt="Farm field" className="w-full h-48 md:h-full object-cover" />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Get a Soil Fertilizer Recommendation</h3>
                  <p className="text-gray-600 mb-4">Get personalized fertilizer recommendations based on your soil analysis and crop type. Our ML-powered system provides accurate NPK and micronutrient suggestions.</p>
                  <button
                    onClick={() => handleQuickAction("soil-fertilizer")}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🌱</span>
                    <span>Get Fertilizer Advice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Section - Sliding shop items */}
            <section className="mt-8 bg-yellow-100 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Check Our Products</h2>
                <button onClick={() => setCurrentPage("shop")} className="text-green-700 hover:text-green-800 font-medium">View all →</button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-50"
                  onClick={() => {
                    const el = productsCarouselRef.current;
                    if (!el) return;
                    const prevPage = Math.max(0, currentProductsPage - 1);
                    scrollToProductsPage(prevPage);
                  }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div
                  ref={productsCarouselRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 no-scrollbar"
                  tabIndex={0}
                  role="region"
                  aria-label="Products slider"
                  onKeyDown={onProductsKeyDown}
                >
                  {getFilteredProducts().slice(0, 12).map((product) => (
                    <div key={product.id} className="min-w-[240px] max-w-[240px] bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 snap-start overflow-hidden">
                      <div className="relative">
                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                        <button onClick={() => openProductModal(product)} className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-800 px-3 py-1 rounded-lg shadow flex items-center text-sm">
                          <Eye className="w-4 h-4 mr-1" /> View
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{product.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                          <button onClick={() => handleAddToCart(product)} className="inline-flex items-center bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 shadow">
                            <ShoppingCart className="w-4 h-4 mr-1" /> Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow hover:bg-gray-50"
                  onClick={() => {
                    const el = productsCarouselRef.current;
                    if (!el) return;
                    const nextPage = Math.min(productsPagesCount - 1, currentProductsPage + 1);
                    scrollToProductsPage(nextPage);
                  }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* Dots pagination */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  {Array.from({ length: productsPagesCount }).map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to page ${i + 1}`}
                      className={`h-2 w-2 rounded-full transition-all duration-200 ${
                        i === currentProductsPage
                          ? 'bg-green-600 scale-125 shadow-[0_0_0_3px_rgba(34,197,94,0.15)]'
                          : 'bg-green-200 hover:bg-green-300'
                      }`}
                      onClick={() => scrollToProductsPage(i)}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Right Side - Weather Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Weather</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                    {weatherData.condition || "--"}
                  </span>
                  <button
                    onClick={handleRefreshWeather}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                    title="Refresh weather"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isLoadingWeather ? "animate-spin" : ""
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="text-center mb-4">
                {isLoadingWeather ? (
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-800">
                      {weatherData.temperature}°C
                    </div>
                    <div className="text-sm text-gray-600">
                      Humidity: {weatherData.humidity}%
                    </div>
                    <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {weatherData.location}
                    </div>
                  </>
                )}
              </div>

              <div className="text-right mb-4">
                {!isLoadingWeather && getWeatherIcon(weatherData.condition)}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">
                  4-Day Forecast
                </h4>
                <div className="space-y-2">
                  {weatherData.forecast.map((item, index) => {
                    const label = getForecastDayLabel(item, index);
                    const { high, low } = getForecastHighLow(item);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">{label}</span>
                        <span className="text-gray-800">
                          {high ?? "--"}°-{low ?? "--"}°
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            {weatherAlerts.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-yellow-800">
                        Weather Alerts
                      </h4>
                      <button
                        onClick={handleRefreshWeather}
                        className="flex items-center text-xs text-yellow-800 hover:text-yellow-900 bg-yellow-100 hover:bg-yellow-200 px-2 py-1 rounded"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" /> Refresh
                      </button>
                    </div>
                    <div className="space-y-2">
                      {weatherAlerts.map((alert, index) => (
                        <div key={index} className="bg-yellow-100 rounded p-3">
                          <h5 className="font-medium text-yellow-800 text-sm">
                            {alert.title || alert.event || "Weather Alert"}
                          </h5>
                          <p className="text-xs text-yellow-700 mt-1">
                            {alert.description ||
                              alert.desc ||
                              "No description available"}
                          </p>
                          {alert.farmingAdvice && (
                            <p className="text-xs text-yellow-600 mt-2 font-medium">
                              Farming Advice: {alert.farmingAdvice}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Seasonal Farming Advisory */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">
                    Seasonal Farming Advisory
                  </h4>
                  <div className="bg-blue-100 rounded p-3">
                    <p className="text-xs text-blue-700">
                      Monsoon season is ideal for rice cultivation. Monitor soil
                      moisture and ensure proper pest control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section removed (moved above under left column) */}

        {/* Product Quick Modal */}
        {showProductModal && selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={closeProductModal}
          >
            <div
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  className="absolute top-2 right-2 bg-white/90 hover:bg-white px-2 py-1 rounded"
                  onClick={closeProductModal}
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedProduct.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedProduct.category}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-green-600">
                    ₹{selectedProduct.price}
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
                      onClick={() => handleAddToCart(selectedProduct)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </button>
                    <button
                      className="inline-flex items-center bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200"
                      onClick={() => handleViewDetails(selectedProduct)}
                    >
                      <Eye className="w-4 h-4 mr-2" /> View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img
                  src="/logo1.jpg"
                  alt="AgroMitra Logo"
                  className="w-8 h-8"
                />
                <span className="text-2xl font-bold text-green-600">
                  AgroMitra
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Making next machines work. Start with recruitment data, do more
                acquisition data, do more leads between workers.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Useful Link
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Company</li>
                    <li>About</li>
                    <li>Contact</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Working Time
                  </h4>
                  <p className="text-sm text-gray-600">
                    Mon - Fri 8:00am - 5:00pm
                    <br />
                    Saturday: 10:00am - 4:00pm
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <h4 className="font-semibold text-gray-800 mb-4">Our Address</h4>
              <p className="text-sm text-gray-600">
                99 Merrimac St, Boston MA
                <br />
                02114, United States
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              Copyright © 2025 grimo. All Rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanHomepage;
