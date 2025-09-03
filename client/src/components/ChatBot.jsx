import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Send,
  Bot,
  User,
  Globe,
  MessageCircle,
  X,
  Loader,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import config from "../config/env";
import { fetchGeminiChatResponse } from "../services/geminiService";

const ChatBot = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "assistant",
      content:
        "Hello! I'm your farming assistant. Ask me anything about crops, soil, weather, or farming techniques.",
      contentHi:
        "नमस्ते! मैं आपका कृषि सहायक हूं। फसलों, मिट्टी, मौसम या कृषि तकनीकों के बारे में कुछ भी पूछें।",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState(config.language.default);
  const [speechEnabled, setSpeechEnabled] = useState(config.features.voiceAssistant);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Main send message handler (Gemini)
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    try {
      const systemPrompt = language === 'hi'
        ? "आप एक कृषि विशेषज्ञ हैं। किसानों को फसल, मिट्टी, मौसम और कृषि तकनीकों के बारे में हिंदी में सहायता प्रदान करें। संक्षिप्त और उपयोगी सलाह दें।"
        : "You are a farming expert assistant. Help farmers with advice about crops, soil, weather, and farming techniques. Provide concise and helpful advice.";
      const geminiMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: inputMessage }
      ];
      const assistantResponse = await fetchGeminiChatResponse(geminiMessages);
      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: assistantResponse || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      // Uncomment if you have speakMessage implemented
      // if (speechEnabled && assistantResponse) {
      //   speakMessage(assistantResponse, language);
      // }
    } catch (error) {
      let errorContent = "Sorry, something went wrong. Please try again.";
      let errorContentHi = "क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।";
      if (error.message.includes('quota exceeded')) {
        errorContent = '🚫 Sorry, the AI service is currently at capacity. Here are some general farming tips:\n\n• Water your crops early morning or evening\n• Monitor soil moisture regularly\n• Use organic compost for better soil health\n• Practice crop rotation to prevent diseases\n\nPlease try the AI assistant again later!';
        errorContentHi = '🚫 क्षमा करें, AI सेवा अभी भरी हुई है। कुछ सामान्य खेती की सुझाव:\n\n• सुबह या शाम को फसलों को पानी दें\n• मिट्टी की नमी की नियमित जांच करें\n• बेहतर मिट्टी स्वास्थ्य के लिए जैविक खाद का उपयोग करें\n• बीमारियों से बचने के लिए फसल चक्र अपनाएं\n\nकृपया AI सहायक को बाद में फिर से आजमाएं!';
      } else if (error.message.includes('Invalid API key')) {
        errorContent = '⚠️ The AI service is temporarily unavailable. Please contact support if this continues.';
        errorContentHi = '⚠️ AI सेवा अस्थायी रूप से उपलब्ध नहीं है। यदि यह जारी रहे तो सहायता से संपर्क करें।';
      } else if (error.message.includes('temporarily unavailable')) {
        errorContent = '⏳ The AI service is temporarily busy. Please try again in a few minutes.';
        errorContentHi = '⏳ AI सेवा अस्थायी रूप से व्यस्त है। कुछ मिनटों में फिर से कोशिश करें।';
      }
      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: language === "hi" ? errorContentHi : errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-green-600" />
            <span className="font-bold text-lg">Farming Assistant</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-4 flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 max-w-[70%] ${msg.type === "user" ? "bg-green-100 text-right" : "bg-gray-100 text-left"}`}>
                {msg.type === "assistant" && language === "hi" && msg.contentHi ? msg.contentHi : msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="p-4 border-t flex items-center gap-2">
          <textarea
            className="flex-1 border rounded-lg p-2 resize-none"
            rows={1}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            disabled={isLoading || !inputMessage.trim()}
          >
            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
