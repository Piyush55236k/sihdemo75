import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import LandingPage from "./pages/LandingPage";
import NewHomepage from "./pages/NewHomepage";
import CleanHomepage from "./pages/CleanHomepage";
import TestComponent from "./components/TestComponent";
import Dashboard from "./pages/Dashboard";
import SoilFertilizerPage from "./pages/SoilFertilizerPage";
import QuestPage from "./pages/QuestPage";
import EnhancedQuestPage from "./pages/EnhancedQuestPage";
import FAQPage from "./pages/FAQPage";
import StandalonePestCheckPage from "./pages/StandalonePestCheckPage";
import StandaloneMarketPricesPage from "./pages/StandaloneMarketPricesPage";
import StandaloneCropCalendarPage from "./pages/StandaloneCropCalendarPage";
import CommunityPage from "./pages/CommunityPage";
import AuthCallback from "./pages/auth/AuthCallback";
import ChatBotWidget from "./components/ChatBotWidget";
import AuthStatus from "./components/AuthStatus";

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
          </Routes>
          {/* AI Chatbot Widget - Available on all pages */}
          <ChatBotWidget />
          {/* Authentication Status Indicator */}
          <AuthStatus />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
