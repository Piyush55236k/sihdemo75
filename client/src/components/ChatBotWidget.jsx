import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import ChatBot from './ChatBot';

const ChatBotWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setHasNewMessage(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleChat}
          className={`relative group bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 transform hover:scale-105 ${
            isChatOpen ? 'rotate-45' : ''
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
            {isChatOpen ? 'Close Chat' : 'Ask Farming Questions'}
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900"></div>
          </div>
        </button>
      </div>

      {/* Chat Interface */}
      <ChatBot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};

export default ChatBotWidget;
