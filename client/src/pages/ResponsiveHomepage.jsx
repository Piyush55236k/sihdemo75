import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider";
import AuthModal from "../components/AuthModal";
import CropAdvisory from "../components/CropAdvisory";
import ImprovedProfilePage from "./ImprovedProfilePage";
import PestCheckPage from "./PestCheckPage.jsx";
import MarketPricesPage from "./MarketPricesPage.jsx";
import CropCalendarPage from "./CropCalendarPage.jsx";
import QuestDemoPage from "./QuestDemoPage.jsx";
import CommunityDemoPage from "./CommunityDemoPage.jsx";
import HelpDemoPage from "./HelpDemoPage.jsx";
import NotificationsDemoPage from "./NotificationsDemoPage.jsx";
import PrivacyDemoPage from "./PrivacyDemoPage.jsx";
import {
  TranslatedText,
  useAutoTranslation,
} from "../hooks/useAutoTranslation.jsx";
import APIService from "../services/apiService.js";
import {
  Mic,
  MicOff,
  Send,
  Camera,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Wifi,
  WifiOff,
  MapPin,
  Thermometer,
  Droplets,
  Sun,
  Cloud,
  AlertTriangle,
  Info,
  Bug,
  Leaf,
  TrendingUp,
  Calendar,
  Bell,
  Settings,
  ChevronLeft,
  ChevronDown,
  User,
  Award,
  Target,
  Users,
  Search,
  ArrowRight,
  Sprout,
  TreePine,
  Star,
  Upload,
  X,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Heart,
  MessageCircle,
  BarChart3,
  Globe,
  Menu,
  Shield,
  LogIn,
  UserPlus,
  Lock,
} from "lucide-react";

const ResponsiveHomepage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const autoTranslation = useAutoTranslation();
  const currentLanguage = autoTranslation?.currentLanguage || "en";

  // UI State
  const [currentPage, setCurrentPage] = useState("home");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCropAdvisory, setShowCropAdvisory] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // App State
  const [adviceInput, setAdviceInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adviceCards, setAdviceCards] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weatherData, setWeatherData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  // Enhanced image validation function
  const validateImage = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return {
        valid: false,
        error:
          currentLanguage === "hi"
            ? "कृपया केवल JPEG, PNG, या WebP फॉर्मेट की इमेज अपलोड करें।"
            : "Please upload only JPEG, PNG, or WebP format images.",
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error:
          currentLanguage === "hi"
            ? "फाइल का साइज 5MB से कम होना चाहिए।"
            : "File size should be less than 5MB.",
      };
    }

    return { valid: true };
  };

  // Quick actions data - Enhanced with auth requirements
  const quickActions = [
    {
      id: 1,
      title: "Pest Check",
      icon: Bug,
      color: "bg-rose-50 text-rose-600 border-rose-200",
      requiresAuth: false,
      guestDescription: "Upload plant images to check for pests",
    },
    {
      id: 2,
      title: "Soil/Fertilizer",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      requiresAuth: false,
      guestDescription: "Get soil and fertilizer advice",
    },
    {
      id: 3,
      title: "Market Prices",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      requiresAuth: false,
      guestDescription: "Check current market prices",
    },
    {
      id: 4,
      title: "Crop Calendar",
      icon: Calendar,
      color: "bg-violet-50 text-violet-600 border-violet-200",
      requiresAuth: false,
      guestDescription: "View seasonal crop calendar",
    },
    {
      id: 5,
      title: "My Progress",
      icon: BarChart3,
      color: "bg-amber-50 text-amber-600 border-amber-200",
      requiresAuth: true,
      guestDescription: "Sign in to track your farming progress",
    },
    {
      id: 6,
      title: "Community",
      icon: Users,
      color: "bg-purple-50 text-purple-600 border-purple-200",
      requiresAuth: true,
      guestDescription: "Join the farmer community",
    },
  ];

  // Initialize app with enhanced features
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get user location
        const location = await APIService.getCurrentLocation();
        setUserLocation(location);

        // Load weather data with language support
        const weather = await APIService.getWeather(
          location.lat,
          location.lon,
          currentLanguage
        );
        setWeatherData(weather);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Use fallback data if API fails
        setWeatherData({
          current: { temp: 28, rain_mm: 0, humidity: 65 },
          forecast: [
            { d: "Today", t_min: 22, t_max: 32, rain_mm: 0, icon: "sun" },
            { d: "Tomorrow", t_min: 24, t_max: 30, rain_mm: 5, icon: "cloud" },
            { d: "Thu", t_min: 23, t_max: 29, rain_mm: 12, icon: "rain" },
            { d: "Fri", t_min: 21, t_max: 27, rain_mm: 8, icon: "cloud" },
          ],
          alerts: [
            {
              type: "rain",
              severity: "medium",
              desc: "Heavy rain expected tomorrow",
            },
          ],
        });
      }
    };

    if (!authLoading) {
      initializeApp();
    }
  }, [authLoading]);

  // Online status monitoring
  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleMicToggle = () => {
    setMicEnabled(!micEnabled);
    if (!micEnabled && "webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = currentLanguage === "hi" ? "hi-IN" : "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setAdviceInput(transcript);
      };
      recognition.onerror = () => {
        setIsListening(false);
        console.warn("Speech recognition failed");
      };

      recognition.start();
    }
  };

  const handleAdviceSubmit = async () => {
    if (!adviceInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await APIService.getAdvice(
        adviceInput,
        userLocation,
        "wheat",
        currentLanguage,
        {
          farmSize: user?.farmSize || "small",
          soilType: "loamy",
          season: getCurrentSeason(),
        }
      );
      setAdviceCards([response.advice[0], ...adviceCards.slice(0, 2)]);
      setAdviceInput("");
    } catch (error) {
      console.error("Failed to get advice:", error);
      setAdviceCards([
        {
          id: Date.now(),
          title: "Advice Request",
          body: "Sorry, unable to process your request at the moment. Please try again later.",
          reason: "Service temporarily unavailable",
          confidence: 0.5,
        },
        ...adviceCards.slice(0, 2),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return "summer";
    if (month >= 6 && month <= 9) return "monsoon";
    if (month >= 10 || month <= 1) return "winter";
    return "summer";
  };

  const handleQuickAction = (actionId, action) => {
    // Check if action requires authentication
    if (action.requiresAuth && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    switch (actionId) {
      case 1: // Pest Check
        setCurrentPage("pestCheck");
        break;
      case 2: // Soil/Fertilizer
        setAdviceInput(
          currentLanguage === "hi"
            ? "मिट्टी और उर्वरक के बारे में सलाह चाहिए"
            : "Need advice about soil and fertilizer"
        );
        handleAdviceSubmit();
        break;
      case 3: // Market Prices
        setCurrentPage("marketPrices");
        break;
      case 4: // Crop Calendar
        setCurrentPage("cropCalendar");
        break;
      case 5: // My Progress
        setCurrentPage("profile");
        break;
      case 6: // Community
        // Navigate to community page (would be implemented)
        console.log("Navigate to community");
        break;
      default:
        console.log("Quick action clicked:", actionId);
    }
  };

  const calculateRiskLevel = () => {
    if (!weatherData)
      return { level: "Low", reason: "Loading...", color: "success" };
    return APIService.calculateRiskLevel(weatherData);
  };

  // Language change handler
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    if (autoTranslation?.changeLanguage) {
      autoTranslation.changeLanguage(newLanguage);
    }
  };

  // Navigation handlers
  const handleBackToHome = () => {
    setCurrentPage("home");
    setSidebarOpen(false);
  };

  // Loading state
  if (authLoading || !weatherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-slate-600">
            <TranslatedText>Loading FarmWise...</TranslatedText>
          </div>
        </div>
      </div>
    );
  }

  // Render different pages
  if (currentPage === "pestCheck") {
    return (
      <PestCheckPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "marketPrices") {
    return (
      <MarketPricesPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "cropCalendar") {
    return (
      <CropCalendarPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "profile") {
    return (
      <ImprovedProfilePage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
        onNavigate={(page) => setCurrentPage(page)}
      />
    );
  }

  if (currentPage === "quest") {
    return (
      <QuestDemoPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "community") {
    return (
      <CommunityDemoPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "help") {
    return (
      <HelpDemoPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "notifications") {
    return (
      <NotificationsDemoPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  if (currentPage === "privacy") {
    return (
      <PrivacyDemoPage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  const risk = calculateRiskLevel();

  // Main homepage rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Desktop Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-sm">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800">FarmWise</h1>
                <p className="text-xs text-slate-500">
                  Smart Farming Assistant
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => setCurrentPage("home")}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <TranslatedText>Home</TranslatedText>
              </button>
              <button
                onClick={() => {
                  // Scroll to quick actions section or show features
                  document
                    .getElementById("quick-actions")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <TranslatedText>Features</TranslatedText>
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    setCurrentPage("quest");
                  }
                }}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <TranslatedText>Quests</TranslatedText>
              </button>
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    setShowAuthModal(true);
                  } else {
                    setCurrentPage("community");
                  }
                }}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <TranslatedText>Community</TranslatedText>
              </button>
              <button
                onClick={() => setCurrentPage("help")}
                className="text-slate-600 hover:text-emerald-600 font-medium transition-colors"
              >
                <TranslatedText>Help</TranslatedText>
              </button>
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Online Status */}
              <div className="hidden sm:flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center space-x-1 text-emerald-600">
                    <Wifi className="w-4 h-4" />
                    <span className="text-xs">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-red-500">
                    <WifiOff className="w-4 h-4" />
                    <span className="text-xs">Offline</span>
                  </div>
                )}
              </div>

              {/* Auth Buttons / User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage("profile")}
                    className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {user?.name || "Profile"}
                    </span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-lg transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      <TranslatedText>Sign In</TranslatedText>
                    </span>
                  </button>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      <TranslatedText>Sign Up</TranslatedText>
                    </span>
                  </button>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Welcome Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
                  {isAuthenticated ? (
                    <TranslatedText>
                      Welcome back, {user?.name || "Farmer"}!
                    </TranslatedText>
                  ) : (
                    <TranslatedText>Welcome to FarmWise</TranslatedText>
                  )}
                </h1>
                <p className="text-lg text-slate-600 mb-6">
                  {isAuthenticated ? (
                    <TranslatedText>
                      Ready to continue your farming journey?
                    </TranslatedText>
                  ) : (
                    <TranslatedText>
                      Your smart farming assistant - Get started with free
                      features or sign up for personalized tracking
                    </TranslatedText>
                  )}
                </p>

                {/* Crop Advisory Section */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4">
                    <TranslatedText>Crop Advisory</TranslatedText>
                  </h2>
                  <p className="text-slate-600 mb-4">
                    <TranslatedText>
                      Get AI-powered crop recommendations based on soil analysis
                      and weather data
                    </TranslatedText>
                  </p>
                  <button
                    onClick={() => setShowCropAdvisory(true)}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Camera className="w-6 h-6" />
                    <span>
                      <TranslatedText>Start Soil Analysis</TranslatedText>
                    </span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Guest Features Notice */}
                {!isAuthenticated && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-amber-800">
                          <TranslatedText>
                            Guest Mode - Limited Features
                          </TranslatedText>
                        </h3>
                        <p className="text-sm text-amber-700 mt-1">
                          <TranslatedText>
                            You can browse and use basic features. Sign up to
                            track progress, earn points, and access the full
                            community.
                          </TranslatedText>
                        </p>
                        <button
                          onClick={() => setShowAuthModal(true)}
                          className="mt-2 text-amber-800 hover:text-amber-900 font-medium text-sm underline"
                        >
                          <TranslatedText>
                            Sign up for full access →
                          </TranslatedText>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div
              id="quick-actions"
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50"
            >
              <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                <TranslatedText>Quick Actions</TranslatedText>
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const isDisabled = action.requiresAuth && !isAuthenticated;

                  return (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id, action)}
                      className={`group relative bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-left border ${
                        isDisabled
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:scale-105 cursor-pointer " + action.color
                      }`}
                    >
                      {/* Lock Icon for Auth Required */}
                      {isDisabled && (
                        <div className="absolute top-3 right-3">
                          <Lock className="w-4 h-4 text-slate-400" />
                        </div>
                      )}

                      <div
                        className={`w-12 h-12 rounded-xl ${action.color
                          .replace("border-", "bg-")
                          .replace(
                            "text-",
                            "text-"
                          )} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        <TranslatedText>{action.title}</TranslatedText>
                      </h3>

                      <p className="text-sm text-slate-600">
                        <TranslatedText>
                          {isDisabled
                            ? action.guestDescription
                            : action.guestDescription}
                        </TranslatedText>
                      </p>

                      {!isDisabled && (
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-xs text-slate-500">
                            <TranslatedText>Available now</TranslatedText>
                          </span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advice Cards */}
            {adviceCards.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">
                  <TranslatedText>Recent Advice</TranslatedText>
                </h2>

                <div className="space-y-4">
                  {adviceCards.map((advice) => (
                    <div
                      key={advice.id}
                      className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100"
                    >
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">
                        {advice.title}
                      </h3>
                      <p className="text-slate-700 mb-4">{advice.body}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Confidence: {Math.round(advice.confidence * 100)}%
                        </span>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                            <ThumbsUp className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button className="p-2 rounded-lg bg-white/50 hover:bg-white/80 transition-colors">
                            <ThumbsDown className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Weather & Info */}
          <div className="space-y-6">
            {/* Weather Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">
                  <TranslatedText>Weather</TranslatedText>
                </h3>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    risk.color === "error"
                      ? "bg-red-100 text-red-700"
                      : risk.color === "warning"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  <TranslatedText>{risk.level} Risk</TranslatedText>
                </div>
              </div>

              {/* Current weather */}
              <div className="mb-4 p-4 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-200/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-3xl font-bold text-slate-800">
                      {weatherData.current.temp}°C
                    </div>
                    <div className="text-slate-600 text-sm">
                      <TranslatedText>
                        Humidity: {weatherData.current.humidity}%
                      </TranslatedText>
                    </div>
                  </div>
                  <Sun className="w-10 h-10 text-amber-500" />
                </div>

                {userLocation && (
                  <div className="flex items-center text-sm text-slate-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>Your Location</span>
                  </div>
                )}
              </div>

              {/* Forecast */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-700 mb-2">
                  <TranslatedText>4-Day Forecast</TranslatedText>
                </h4>
                {weatherData.forecast.slice(0, 4).map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600">{day.d}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-800">
                        {day.t_min}°-{day.t_max}°
                      </span>
                      {day.icon === "sun" && (
                        <Sun className="w-4 h-4 text-amber-500" />
                      )}
                      {day.icon === "cloud" && (
                        <Cloud className="w-4 h-4 text-slate-500" />
                      )}
                      {day.icon === "rain" && (
                        <Droplets className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {weatherData.alerts.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                  <TranslatedText>Weather Alerts</TranslatedText>
                </h3>

                <div className="space-y-3">
                  {weatherData.alerts.map((alert, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        alert.severity === "high"
                          ? "bg-red-50 text-red-800"
                          : alert.severity === "medium"
                          ? "bg-amber-50 text-amber-800"
                          : "bg-blue-50 text-blue-800"
                      }`}
                    >
                      <p className="text-sm">
                        <TranslatedText>{alert.desc}</TranslatedText>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Progress (Authenticated Users Only) */}
            {isAuthenticated && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  <TranslatedText>Your Progress</TranslatedText>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      <TranslatedText>Level</TranslatedText>
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      {user?.level || 1}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      <TranslatedText>Points</TranslatedText>
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {user?.totalPoints || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">
                      <TranslatedText>Quests</TranslatedText>
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {user?.completedQuests || 0}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-600">
                        <TranslatedText>Sustainability Score</TranslatedText>
                      </span>
                      <span className="text-lg font-bold text-emerald-600">
                        {user?.sustainabilityScore || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${user?.sustainabilityScore || 0}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => setCurrentPage("profile")}
                    className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    <TranslatedText>View Full Profile</TranslatedText>
                  </button>
                </div>
              </div>
            )}

            {/* Call to Action for Guests */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 shadow-lg text-white">
                <h3 className="text-xl font-bold mb-3">
                  <TranslatedText>Join FarmWise Today</TranslatedText>
                </h3>
                <p className="text-emerald-100 mb-4">
                  <TranslatedText>
                    Track your progress, earn rewards, and connect with fellow
                    farmers.
                  </TranslatedText>
                </p>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-emerald-100">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      <TranslatedText>
                        Personal progress tracking
                      </TranslatedText>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-emerald-100">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      <TranslatedText>Earn points & badges</TranslatedText>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-emerald-100">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      <TranslatedText>Community features</TranslatedText>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full mt-4 bg-white text-emerald-600 hover:bg-emerald-50 py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <TranslatedText>Get Started Free</TranslatedText>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => {
                    setCurrentPage("home");
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50"
                >
                  <TranslatedText>Home</TranslatedText>
                </button>
                <button
                  onClick={() => {
                    document
                      .getElementById("quick-actions")
                      ?.scrollIntoView({ behavior: "smooth" });
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50"
                >
                  <TranslatedText>Features</TranslatedText>
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      setShowAuthModal(true);
                    } else {
                      console.log("Navigate to community");
                    }
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50"
                >
                  <TranslatedText>Community</TranslatedText>
                </button>
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: document.body.scrollHeight,
                      behavior: "smooth",
                    });
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left p-3 rounded-lg hover:bg-slate-50"
                >
                  <TranslatedText>Help</TranslatedText>
                </button>
              </nav>

              {!isAuthenticated && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setSidebarOpen(false);
                    }}
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    <TranslatedText>Sign Up / Sign In</TranslatedText>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Crop Advisory Modal */}
      <CropAdvisory
        isOpen={showCropAdvisory}
        onClose={() => setShowCropAdvisory(false)}
      />
    </div>
  );
};

export default ResponsiveHomepage;
