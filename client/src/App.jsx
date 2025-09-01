<<<<<<< HEAD
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
import QuestPage from "./pages/QuestPage";
import CommunityPage from "./pages/CommunityPage";

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

=======
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import NewHomepage from './pages/NewHomepage'
import ResponsiveHomepage from './pages/ResponsiveHomepage'
import TestComponent from './components/TestComponent'
import Dashboard from './pages/Dashboard'
import QuestPage from './pages/QuestPage'
import CommunityPage from './pages/CommunityPage'
import './tailwind.css'

function App() {
>>>>>>> ce17b631e47435b0fbcc27a198d9eafa8e5cd39b
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface-alt">
<<<<<<< HEAD
          {/* <LanguageSelector open={showLangModal} onSelect={handleLangSelect} /> */}
=======
>>>>>>> ce17b631e47435b0fbcc27a198d9eafa8e5cd39b
          <Routes>
            {/* Test route to check basic functionality */}
            <Route path="/test" element={<TestComponent />} />
            {/* New responsive homepage with auth */}
            <Route path="/" element={<ResponsiveHomepage />} />
            {/* Legacy mobile-first homepage */}
            <Route path="/mobile" element={<NewHomepage />} />
<<<<<<< HEAD
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
=======
          {/* Legacy routes */}
          <Route path="/landing" element={
            <>
              <Navbar />
              <LandingPage />
            </>
          } />
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <Dashboard />
            </>
          } />
          <Route path="/quests" element={
            <>
              <Navbar />
              <QuestPage />
            </>
          } />
          <Route path="/community" element={
            <>
              <Navbar />
              <CommunityPage />
            </>
          } />
>>>>>>> ce17b631e47435b0fbcc27a198d9eafa8e5cd39b
          </Routes>
        </div>
      </Router>
    </AuthProvider>
<<<<<<< HEAD
  );
}

export default App;
=======
  )
}export default App
>>>>>>> ce17b631e47435b0fbcc27a198d9eafa8e5cd39b
