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
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-surface-alt">
          <Routes>
            {/* Test route to check basic functionality */}
            <Route path="/test" element={<TestComponent />} />
            {/* New responsive homepage with auth */}
            <Route path="/" element={<ResponsiveHomepage />} />
            {/* Legacy mobile-first homepage */}
            <Route path="/mobile" element={<NewHomepage />} />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}export default App
