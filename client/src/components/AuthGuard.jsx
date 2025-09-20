import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider_Real";
import AuthModal from "./AuthModal";
import { Lock, UserPlus, LogIn, MessageCircle, Star, X } from "lucide-react";

const AuthGuard = ({ children, feature = "feature", onClose, onAuthSuccess, requireComplete = false }) => {
  const { isAuthenticated, isLoading, isProfileComplete, user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();

  // Watch for authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // Check if profile completion is required
      if (requireComplete && !isProfileComplete()) {
        navigate('/profile-setup');
        return;
      }
      
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    }
  }, [isAuthenticated, isProfileComplete, onAuthSuccess, navigate, requireComplete]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  // If authenticated and profile is complete (if required), render the protected component
  if (isAuthenticated && (!requireComplete || isProfileComplete())) {
    return children;
  }

  // If authenticated but profile incomplete and completion is required
  if (isAuthenticated && requireComplete && !isProfileComplete()) {
    // Navigation will be handled by useEffect
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-center">Redirecting to profile setup...</p>
        </div>
      </div>
    );
  }

  const getFeatureDetails = () => {
    switch (feature) {
      case "chat":
        return {
          title: "🤖 AI Farming Assistant",
          description: "Get instant answers to your farming questions using AI technology",
          benefits: [
            "Ask about crops, diseases, weather, and farming techniques",
            "Get personalized advice based on your location",
            "Available 24/7 in Hindi and English",
            "Voice support for easy interaction"
          ]
        };
      case "feedback":
        return {
          title: "📝 Feedback & Suggestions",
          description: "Help us improve the platform with your valuable feedback",
          benefits: [
            "Share your farming experiences",
            "Suggest new features and improvements",
            "Rate your experience with different tools",
            "Connect with our development team"
          ]
        };
      case "quests":
        return {
          title: "🏆 Farming Quests & Achievements",
          description: "Complete challenges and earn rewards while learning sustainable farming",
          benefits: [
            "Learn new farming techniques through gamification",
            "Earn points and badges for your achievements",
            "Track your progress and farming milestones",
            "Compete with other farmers in your region"
          ]
        };
      case "community":
        return {
          title: "👨‍🌾 Farmer Community",
          description: "Connect with fellow farmers and agricultural experts",
          benefits: [
            "Share experiences and learn from others",
            "Get advice from agricultural experts",
            "Join local farming groups and discussions",
            "Access marketplace for equipment and crops"
          ]
        };
      case "profile":
        return {
          title: "👤 Personal Farm Profile",
          description: "Create your personalized farming profile and dashboard",
          benefits: [
            "Track your farm details and crop information",
            "Get personalized recommendations",
            "Monitor your farming progress and achievements",
            "Access customized weather and market data"
          ]
        };
      default:
        return {
          title: "🌱 Smart Farming Features",
          description: "Access advanced farming tools and personalized recommendations",
          benefits: [
            "Get weather alerts and forecasts",
            "Track market prices for your crops",
            "Receive personalized farming advice",
            "Connect with the farming community"
          ]
        };
    }
  };

  const featureDetails = getFeatureDetails();

  return (
    <>
      {/* Feature Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Lock className="w-6 h-6" />
                <h2 className="text-xl font-bold">Sign In Required</h2>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {featureDetails.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {featureDetails.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-500" />
                What you'll get:
              </h4>
              <ul className="space-y-2">
                {featureDetails.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Continue</span>
              </button>
              
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setShowAuthModal(true);
                }}
                className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create New Account</span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <MessageCircle className="w-3 h-3" />
                <span>Join thousands of farmers already using our platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
          onModeChange={setAuthMode}
        />
      )}
    </>
  );
};

export default AuthGuard;