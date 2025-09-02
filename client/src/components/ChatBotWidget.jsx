import React, { useState } from "react";
import { MessageCircle, X, FileText } from "lucide-react";
import { useAuth } from "./AuthProvider";
import ChatBot from "./ChatBot";
import FeedbackForm from "./FeedbackForm";
import AuthGuard from "./AuthGuard";

const ChatBotWidget = () => {
  const { isAuthenticated } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showChatAuth, setShowChatAuth] = useState(false);
  const [showFeedbackAuth, setShowFeedbackAuth] = useState(false);

  const toggleChat = () => {
    if (!isAuthenticated) {
      setShowChatAuth(true);
      return;
    }
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasNewMessage(false);
    }
  };

  const toggleFeedback = () => {
    if (!isAuthenticated) {
      setShowFeedbackAuth(true);
      return;
    }
    setIsFeedbackOpen(!isFeedbackOpen);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* Feedback Form Button */}
        <div className="relative">
          <button
            onClick={toggleFeedback}
            className="group bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-105"
            title="Feedback Form"
          >
            <FileText className="w-5 h-5" />

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Give Feedback
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </button>
        </div>

        {/* Chat Button */}
        <div className="relative">
          <button
            onClick={toggleChat}
            className={`group bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105 ${
              isChatOpen ? "rotate-45" : ""
            }`}
            title="Chat with Farming Assistant"
          >
            {isChatOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <MessageCircle className="w-6 h-6" />
            )}

            {/* New message indicator */}
            {hasNewMessage && !isChatOpen && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping"></div>
              </div>
            )}

            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {isChatOpen ? "Close Chat" : "Ask Farming Questions"}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Authentication Guards */}
      {showChatAuth && (
        <AuthGuard feature="chat" onClose={() => setShowChatAuth(false)}>
          <div />
        </AuthGuard>
      )}

      {showFeedbackAuth && (
        <AuthGuard
          feature="feedback"
          onClose={() => setShowFeedbackAuth(false)}
        >
          <div />
        </AuthGuard>
      )}

      {/* Feedback Form - Only render if authenticated and open */}
      {isAuthenticated && (
        <FeedbackForm
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
        />
      )}

      {/* Chat Interface - Only render if authenticated and open */}
      {isAuthenticated && (
        <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      )}
    </>
  );
};

export default ChatBotWidget;
