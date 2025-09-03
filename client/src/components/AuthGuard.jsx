import React, { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";
import { Lock, UserPlus, LogIn, MessageCircle, Star, X } from "lucide-react";
import { TranslatedText } from "../hooks/useAutoTranslation.jsx";

const AuthGuard = ({ children, feature = "feature", onClose, onAuthSuccess }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Watch for authentication changes
  useEffect(() => {
    if (isAuthenticated && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [isAuthenticated, onAuthSuccess]);

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

  // If authenticated, render the protected component
  if (isAuthenticated) {
    return children;
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
          description: "Help us improve Agro_Mitra by sharing your experience",
          benefits: [
            "Share your farming experiences",
            "Suggest new features",
            "Report issues or problems",
            "Help other farmers learn"
          ]
        };
      default:
        return {
          title: "🔒 Premium Feature",
          description: "Access exclusive farming tools and resources",
          benefits: [
            "Advanced farming analytics",
            "Personalized recommendations",
            "Community access",
            "Priority support"
          ]
        };
    }
  };

  const featureInfo = getFeatureDetails();

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

  // If authenticated, render the protected component
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated, show login prompt
  return (
    <>
      {/* Authentication Prompt Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 text-center max-h-[90vh] overflow-y-auto relative">
          {/* Close Button */}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              {feature === "chat" ? (
                <MessageCircle className="w-10 h-10 text-emerald-600" />
              ) : (
                <Lock className="w-10 h-10 text-emerald-600" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {featureInfo.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6 text-lg">
            {featureInfo.description}
          </p>

          {/* Benefits List */}
          <div className="text-left mb-8 space-y-3">
            <h3 className="text-center font-semibold text-gray-800 mb-4">
              ✨ What you'll get:
            </h3>
            {featureInfo.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start text-sm text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-emerald-50 rounded-xl p-4 mb-6">
            <p className="text-emerald-800 font-medium text-sm">
              🚀 Join thousands of farmers getting smarter with Agro_Mitra!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Login Button */}
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <LogIn className="w-5 h-5 mr-3" />
              <span className="text-lg">
                Sign In to Continue
              </span>
            </button>

            {/* Signup Button */}
            <button
              onClick={() => {
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
              className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-4 px-6 rounded-xl border-2 border-emerald-600 transition-all duration-200 flex items-center justify-center hover:shadow-lg transform hover:scale-[1.02]"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              <span className="text-lg">
                Create Free Account
              </span>
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 transition-colors duration-200 underline"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
      />
    </>
  );
};

export default AuthGuard;
