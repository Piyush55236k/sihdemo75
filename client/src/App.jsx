import React, { useState, useEffect } from "react";
import VoiceAssistant from "./components/VoiceAssistant";
// import LanguageSelector from "./i18n/LanguageSelector";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Navbar from "./components/Navbar";
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
        <div className="min-h-screen bg-surface-alt">
          {/* <LanguageSelector open={showLangModal} onSelect={handleLangSelect} /> */}
          <Routes>
            {/* Test route to check basic functionality */}
            <Route path="/test" element={<TestComponent />} />
            {/* New responsive homepage with auth */}
            <Route path="/" element={<ResponsiveHomepage />} />
            {/* Legacy mobile-first homepage */}
            <Route path="/mobile" element={<NewHomepage />} />
            {/* Legacy routes */}
            <Route
              path="/landing"
              element={
                <>
                  <Navbar />
                  <LandingPage />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <>
                  <Navbar />
                  <Dashboard />
                </>
              }
            />
            <Route
              path="/quests"
              element={
                <>
                  <Navbar />
                  <QuestPage />
                </>
              }
            />
            <Route
              path="/community"
              element={
                <>
                  <Navbar />
                  <CommunityPage />
                </>
              }
            />
            <Route
              path="/soil-fertilizer"
              element={
                <>
                  <Navbar />
                  <SoilFertilizerPage />
                </>
              }
            />
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
