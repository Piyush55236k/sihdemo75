import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import AuthModal from "./AuthModal";
import { Lock, UserPlus, LogIn } from "lucide-react";
import { TranslatedText } from "../hooks/useAutoTranslation.jsx";

const AuthGuard = ({ children, feature = "feature", onClose }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
          {/* Icon */}
          {/* Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            <TranslatedText text="Login Required" />
          </h2>

          {/* Message */}
          <p className="text-gray-600 mb-8">
            <TranslatedText
              text={`Please login to access ${
                feature === "chat"
                  ? "AI Chat Assistant"
                  : feature === "feedback"
                  ? "Feedback Form"
                  : "this feature"
              }. Join thousands of farmers getting personalized farming advice!`}
            />
          </p>

          {/* Benefits List */}
          <div className="text-left mb-8 space-y-2">
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <TranslatedText text="Get personalized farming advice" />
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <TranslatedText text="Voice support in Hindi & English" />
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              <TranslatedText text="Track your farming progress" />
            </div>
            {feature === "feedback" && (
              <div className="flex items-center text-sm text-gray-700">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <TranslatedText text="Share feedback and suggestions" />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Login Button */}
            <button
              onClick={() => {
                setAuthMode("login");
                setShowAuthModal(true);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <LogIn className="w-5 h-5 mr-2" />
              <TranslatedText text="Login" />
            </button>

            {/* Signup Button */}
            <button
              onClick={() => {
                setAuthMode("signup");
                setShowAuthModal(true);
              }}
              className="w-full bg-white hover:bg-gray-50 text-emerald-600 font-semibold py-3 px-6 rounded-lg border-2 border-emerald-600 transition-colors duration-200 flex items-center justify-center"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              <TranslatedText text="Create Account" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                if (onClose) {
                  onClose();
                }
              }}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
            >
              <TranslatedText text="Maybe Later" />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              if (onClose) {
                onClose();
              }
            }}
            className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
          >
            <TranslatedText text="Maybe Later" />
          </button>
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
