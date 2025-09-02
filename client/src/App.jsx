import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import LandingPage from "./pages/LandingPage";
import NewHomepage from "./pages/NewHomepage";
import ResponsiveHomepage from "./pages/ResponsiveHomepage";
import TestComponent from "./components/TestComponent";
import Dashboard from "./pages/Dashboard";
import SoilFertilizerPage from "./pages/SoilFertilizerPage";
import QuestPage from "./pages/QuestPage";
import CommunityPage from "./pages/CommunityPage";
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
            <Route path="/" element={<ResponsiveHomepage />} />
            <Route path="/mobile" element={<NewHomepage />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/quests" element={<QuestPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/soil-fertilizer" element={<SoilFertilizerPage />} />
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
