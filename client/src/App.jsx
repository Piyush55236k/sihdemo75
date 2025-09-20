import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './components/AuthProvider_Real';
import LandingPage from "./pages/LandingPage";
import NewHomepage from "./pages/NewHomepage";
import CleanHomepage from "./pages/CleanHomepage";
import Dashboard from "./pages/Dashboard";
import SoilFertilizerPage from "./pages/SoilFertilizerPage";
import QuestPage from './pages/QuestPage_Real';
import EnhancedQuestPage from "./pages/EnhancedQuestPage";
import FAQPage from "./pages/FAQPage";
import StandalonePestCheckPage from "./pages/StandalonePestCheckPage";
import StandaloneMarketPricesPage from "./pages/StandaloneMarketPricesPage";
import StandaloneCropCalendarPage from "./pages/StandaloneCropCalendarPage";
import CommunityPage from './pages/CommunityPage_Real';
import AuthCallback from "./pages/auth/AuthCallback";
import ChatBotWidget from "./components/ChatBotWidget";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import NotificationPage from './pages/NotificationPage_Real';
import SettingsPage from './pages/SettingsPage_Real';

function App() {
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    // Show language modal only on first visit (or if not set)
    const langSet = localStorage.getItem("langSet");
    if (!langSet) setShowLangModal(true);
  }, []);

  const handleLangSelect = (lang) => {
    localStorage.setItem("langSet", "1");
    setShowLangModal(false);
  };

  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div>
          {/* <LanguageSelector open={showLangModal} onSelect={handleLangSelect} /> */}
          <Routes>
            <Route path="/" element={<CleanHomepage />} />
            <Route path="/mobile" element={<NewHomepage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quests" element={<EnhancedQuestPage />} />
            <Route path="/quests-old" element={<QuestPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/pest-check" element={<StandalonePestCheckPage />} />
            <Route path="/market-prices" element={<StandaloneMarketPricesPage />} />
            <Route path="/crop-calendar" element={<StandaloneCropCalendarPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/SoilFertilizerPage" element={<SoilFertilizerPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          {/* AI Chatbot Widget - Available on all pages */}
          <ChatBotWidget />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
