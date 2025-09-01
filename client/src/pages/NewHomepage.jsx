import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TranslatedText,
  useAutoTranslation,
} from "../hooks/useAutoTranslation.jsx";
import APIService from "../services/apiService.js";
import BackendService from "../services/BackendService.js";
import LanguageService from "../services/LanguageService.js";
import PestCheckPage from "./PestCheckPage.jsx";
import MarketPricesPage from "./MarketPricesPage.jsx";
import CropCalendarPage from "./CropCalendarPage.jsx";
import ProfilePage from "./ProfilePage.jsx";
import {
  Mic,
  MicOff,
  Send,
  Camera,
  Image as ImageIcon,
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
} from "lucide-react";

const NewHomepage = () => {
  const autoTranslation = useAutoTranslation();
  const currentLanguage = autoTranslation?.currentLanguage || "en";
  const [activeSection, setActiveSection] = useState("home"); // home, profile, dashboard, community, quests
  const [currentPage, setCurrentPage] = useState("home"); // home, pestCheck, marketPrices, cropCalendar, profile
  const [micEnabled, setMicEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [adviceInput, setAdviceInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [adviceCards, setAdviceCards] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [pestResult, setPestResult] = useState(null);
  const [pestLoading, setPestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imageError, setImageError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [weatherData, setWeatherData] = useState(null);
  const [marketPrices, setMarketPrices] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [userProfile, setUserProfile] = useState({
    name: "Farmer Kumar",
    level: 8,
    totalPoints: 2340,
    sustainabilityScore: 85,
    completedQuests: 12,
    rank: 15,
  });

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

  // AI-powered plant image detection
  const isPlantImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Simple heuristic checks for plant images
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // Get image data for basic analysis
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let greenPixels = 0;
        let totalPixels = data.length / 4;

        // Count green-ish pixels (simple plant detection)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Check for green dominance or leaf-like colors
          if (g > r && g > b && g > 50) {
            greenPixels++;
          }
          // Also check for brown/dry leaf colors
          if (r > 100 && g > 80 && b < 100 && Math.abs(r - g) < 50) {
            greenPixels++;
          }
        }

        const greenRatio = greenPixels / totalPixels;

        // If less than 10% green/leaf colors, likely not a plant
        if (greenRatio < 0.1) {
          resolve({
            isPlant: false,
            confidence: 1 - greenRatio,
            message:
              currentLanguage === "hi"
                ? "यह इमेज पौधे या पत्ती की नहीं लग रही। कृपया पत्ती या पौधे की स्पष्ट तस्वीर अपलोड करें।"
                : "This image does not appear to be a plant or leaf. Please upload a clear image of a leaf or plant.",
          });
        } else {
          resolve({
            isPlant: true,
            confidence: greenRatio,
            message: "Plant detected successfully",
          });
        }
      };

      img.onerror = () => {
        resolve({
          isPlant: false,
          confidence: 0,
          message:
            currentLanguage === "hi"
              ? "इमेज लोड नहीं हो सकी।"
              : "Could not load image.",
        });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  // Quick actions data - Enhanced with personalized suggestions
  const quickActions = [
    {
      id: 1,
      title: "Pest Check",
      icon: Bug,
      color: "bg-rose-50 text-rose-600 border-rose-200",
      priority: "high",
    },
    {
      id: 2,
      title: "Soil/Fertilizer",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
      priority: "medium",
    },
    {
      id: 3,
      title: "Market Prices",
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600 border-blue-200",
      priority: "high",
    },
    {
      id: 4,
      title: "Crop Calendar",
      icon: Calendar,
      color: "bg-violet-50 text-violet-600 border-violet-200",
    },
    {
      id: 5,
      title: "My Fields",
      icon: MapPin,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      id: 6,
      title: "Alerts",
      icon: Bell,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ];

  // Helper function to get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 5) return "summer";
    if (month >= 6 && month <= 9) return "monsoon";
    if (month >= 10 || month <= 1) return "winter";
    return "summer";
  };

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

        // Load market prices
        const prices = await APIService.getMarketPrices("wheat", "110001");
        setMarketPrices(prices.markets);
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

    initializeApp();
  }, []);

  // Calculate risk level from weather data
  const risk = weatherData
    ? APIService.calculateRiskLevel(weatherData)
    : { level: "Low", reason: "Loading...", color: "success" };

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
      recognition.lang = "hi-IN"; // Hindi support
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
      // Enhanced advice request with personalization
      const response = await APIService.getAdvice(
        adviceInput,
        userLocation,
        "wheat", // Default crop, could be dynamic
        currentLanguage,
        {
          farmSize: "small",
          soilType: "loamy",
          season: getCurrentSeason(),
        }
      );
      setAdviceCards([response.advice[0], ...adviceCards.slice(0, 1)]);
      setAdviceInput("");
    } catch (error) {
      console.error("Failed to get advice:", error);
      // Fallback advice
      setAdviceCards([
        {
          id: Date.now(),
          title: "Advice Request",
          body: "Sorry, unable to process your request at the moment. Please try again later.",
          reason: "Service temporarily unavailable",
          confidence: 0.5,
        },
        ...adviceCards.slice(0, 1),
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadedImage(null);
    setPestLoading(true);
    setPestResult(null);
    setErrorMessage("");

    try {
      // Step 1: Basic file validation
      const validation = validateImage(file);
      if (!validation.valid) {
        setErrorMessage(validation.error);
        setPestLoading(false);
        return;
      }

      // Step 2: AI plant detection
      setErrorMessage(
        currentLanguage === "hi"
          ? "इमेज का विश्लेषण हो रहा है..."
          : "Analyzing image..."
      );

      const plantCheck = await isPlantImage(file);
      if (!plantCheck.isPlant) {
        setErrorMessage(plantCheck.message);
        setPestLoading(false);
        return;
      }

      // Step 3: If it's a valid plant image, proceed with pest detection
      setErrorMessage(
        currentLanguage === "hi"
          ? "कीट और रोग का पता लगाया जा रहा है..."
          : "Detecting pests and diseases..."
      );

      // Create preview
      const reader = new FileReader();
      reader.onload = async (e) => {
        setUploadedImage(e.target.result);

        try {
          // Enhanced pest detection with language support
          const result = await APIService.detectPestDisease(
            file,
            currentLanguage
          );
          setPestResult(result);
          setErrorMessage("");
        } catch (error) {
          console.error("Pest detection failed:", error);
          setPestResult({
            label:
              currentLanguage === "hi" ? "विश्लेषण असफल" : "Analysis Failed",
            confidence: 0,
            actions: [
              {
                title:
                  currentLanguage === "hi" ? "पुनः प्रयास करें" : "Try Again",
                body:
                  currentLanguage === "hi"
                    ? "कृपया एक स्पष्ट इमेज अपलोड करें"
                    : "Please upload a clearer image",
              },
            ],
          });
          setErrorMessage("");
        } finally {
          setPestLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      setErrorMessage(
        currentLanguage === "hi"
          ? "इमेज अपलोड करते समय कोई समस्या हुई।"
          : "Error occurred while uploading image."
      );
      setPestLoading(false);
    }
  };

  // Handle quick action clicks
  const handleQuickAction = (actionId) => {
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
      case 5: // My Fields
        setActiveSection("dashboard");
        break;
      case 6: // Alerts
        setAdviceInput(
          currentLanguage === "hi"
            ? "कृषि अलर्ट की जानकारी चाहिए"
            : "Need farming alerts information"
        );
        handleAdviceSubmit();
        break;
      default:
        console.log("Quick action clicked:", actionId);
    }
  };

  const handleFeedback = async (adviceId, isPositive) => {
    try {
      await APIService.submitFeedback(adviceId, isPositive);
      setAdviceCards((prev) =>
        prev.map((advice) =>
          advice.id === adviceId
            ? { ...advice, feedback: isPositive ? "positive" : "negative" }
            : advice
        )
      );
    } catch (error) {
      console.error("Failed to submit feedback:", error);
    }
  };

  // Navigation handlers
  const handleBackToHome = () => {
    setCurrentPage("home");
    setActiveSection("home");
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "profile") {
      setCurrentPage("profile");
    } else {
      setCurrentPage("home");
    }
  };

  // Language change handler
  const handleLanguageChange = (newLanguage) => {
    LanguageService.setLanguage(newLanguage);
    // Force re-render by updating a state
    setActiveSection((prev) => prev);
  };

  if (!weatherData) {
    return (
      <div className="min-h-screen bg-surface-alt flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <div className="text-text-muted">
            <TranslatedText>Loading FarmWise...</TranslatedText>
          </div>
        </div>
      </div>
    );
  }

  // Render different pages based on currentPage state
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
      <ProfilePage
        onBack={handleBackToHome}
        currentLanguage={currentLanguage}
      />
    );
  }

  // Default home page rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 border border-emerald-100">
          <Globe className="w-4 h-4 text-emerald-600" />
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>

      {/* Basic offline indicator */}
      {!isOnline && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              <TranslatedText>Offline Mode</TranslatedText>
            </span>
          </div>
        </div>
      )}

      {/* Voice recording indicator */}
      {isListening && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-emerald-100 animate-pulse">
              <Mic className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              <TranslatedText>Listening...</TranslatedText>
            </h3>
            <p className="text-gray-600">
              <TranslatedText>Ask your question now</TranslatedText>
            </p>
          </div>
        </div>
      )}

      {/* Top App Bar */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-semibold text-slate-800">
              <TranslatedText>FarmWise</TranslatedText>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Switcher - simplified */}
            <select className="text-sm border border-emerald-200 rounded-lg px-2 py-1 bg-white text-slate-700">
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
            {/* Mic Toggle */}
            <button
              onClick={handleMicToggle}
              className={`p-2 rounded-lg transition-colors ${
                micEnabled
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {micEnabled ? (
                <Mic className="w-5 h-5" />
              ) : (
                <MicOff className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Multi-Section Navigation */}
      {activeSection !== "home" && (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-500 to-teal-500">
          <div className="h-full overflow-y-auto">
            <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-emerald-100 z-10">
              <div className="max-w-md mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveSection("home")}
                    className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Home</span>
                  </button>
                  <div className="text-lg font-bold text-emerald-800 capitalize">
                    {activeSection}
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto px-4 py-6">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      Profile Settings
                    </h2>
                  </div>
                </div>
              )}

              {/* Dashboard Section */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      Farm Dashboard
                    </h2>
                  </div>
                </div>
              )}

              {/* Community Section */}
              {activeSection === "community" && (
                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      Community
                    </h2>
                  </div>
                </div>
              )}

              {/* Quests Section */}
              {activeSection === "quests" && (
                <div className="space-y-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                      Farm Quests
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Homepage Content */}
      {activeSection === "home" && (
        <div className="max-w-md mx-auto px-4 pb-20">
          {/* Alerts Ticker */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-2">
              {weatherData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-medium ${
                    alert.severity === "high"
                      ? "bg-error-light text-error"
                      : alert.severity === "medium"
                      ? "bg-yellow-100 text-warning"
                      : "bg-blue-100 text-info"
                  }`}
                >
                  <TranslatedText>{alert.desc}</TranslatedText>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Ask Section */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-slate-800">
                <TranslatedText>Ask for Advice</TranslatedText>
              </h1>
              <button
                onClick={() => {
                  // Open the ChatBot widget
                  const chatButton = document.querySelector(
                    '[title="Chat with Farming Assistant"]'
                  );
                  if (chatButton) {
                    chatButton.click();
                  }
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  <TranslatedText>AI Chat</TranslatedText>
                </span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={adviceInput}
                onChange={(e) => setAdviceInput(e.target.value)}
                placeholder="Try: Should I irrigate tomorrow?"
                className="w-full px-4 py-3 pr-12 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white/90 backdrop-blur-sm text-slate-700 placeholder-slate-400"
                onKeyPress={(e) => e.key === "Enter" && handleAdviceSubmit()}
              />
              <button
                onClick={handleAdviceSubmit}
                disabled={isLoading || !adviceInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Weather + Risk Card */}
          <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800">
                <TranslatedText>Weather</TranslatedText>
              </h2>
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
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-slate-800">
                    {weatherData.current.temp}°C
                  </div>
                  <div className="text-slate-600 text-sm">
                    <TranslatedText>
                      Humidity: {weatherData.current.humidity}%
                    </TranslatedText>
                  </div>
                </div>
                <Sun className="w-8 h-8 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              <TranslatedText>Quick Actions</TranslatedText>
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all text-left hover:scale-105 border ${action.color}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${action.color
                        .replace("border-", "bg-")
                        .replace(
                          "text-",
                          "text-"
                        )} flex items-center justify-center mb-3`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-medium text-slate-700">
                      <TranslatedText>{action.title}</TranslatedText>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {activeSection === "home" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-emerald-100 shadow-lg">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-around">
              <button className="flex flex-col items-center space-y-1 text-emerald-600">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-xs font-medium">Home</span>
              </button>

              <button
                onClick={() => handleSectionChange("profile")}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <User className="w-6 h-6" />
                <span className="text-xs font-medium">Profile</span>
              </button>

              <button
                onClick={() => handleSectionChange("dashboard")}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => handleSectionChange("community")}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <Users className="w-6 h-6" />
                <span className="text-xs font-medium">Community</span>
              </button>

              <button
                onClick={() => handleSectionChange("quests")}
                className="flex flex-col items-center space-y-1 text-slate-500 hover:text-emerald-600 transition-colors"
              >
                <Award className="w-6 h-6" />
                <span className="text-xs font-medium">Quests</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewHomepage;
