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

const ChatBot = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  // Chat state
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

  // Voice and language state
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState(config.language.default);
  const [speechEnabled, setSpeechEnabled] = useState(
    config.features.voiceAssistant
  );

  // Refs
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang =
        language === "hi"
          ? config.speech.recognition.hi
          : config.speech.recognition.en;

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };
    }
  }, [language]);

  // Handle voice input toggle
  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert(
        language === "hi"
          ? "वॉइस रिकॉग्निशन समर्थित नहीं है"
          : "Voice recognition not supported"
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  // Handle language change
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (recognitionRef.current) {
      recognitionRef.current.lang =
        newLang === "hi"
          ? config.speech.recognition.hi
          : config.speech.recognition.en;
    }
  };

  // Text-to-speech for AI responses
  const speakMessage = (text, lang) => {
    if ("speechSynthesis" in window && speechEnabled) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        lang === "hi"
          ? config.speech.recognition.hi
          : config.speech.recognition.en;
      utterance.rate = config.speech.synthesis.rate;
      utterance.volume = config.speech.synthesis.volume;
      speechSynthesis.speak(utterance);
    }
  };

  // Send message to backend
  const sendMessage = async () => {
    if (!inputMessage.trim() || !isAuthenticated) return;

    // Validate message length
    if (inputMessage.length > config.chat.maxMessageLength) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          language === "hi"
            ? `संदेश बहुत लंबा है। कृपया ${config.chat.maxMessageLength} अक्षरों के अंदर संदेश भेजें।`
            : `Message too long. Please keep it under ${config.chat.maxMessageLength} characters.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

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
      const response = await fetch(`${config.api.baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            user?.access_token || localStorage.getItem("supabase.auth.token")
          }`,
        },
        body: JSON.stringify({
          message: inputMessage,
          language: language,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if speech is enabled
      if (speechEnabled) {
        speakMessage(data.response, language);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      const errorMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content:
          language === "hi"
            ? "क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।"
            : "Sorry, something went wrong. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`fixed inset-0 bg-black/50 z-50 flex items-center justify-center transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl">
          <Bot className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            {language === "hi" ? "लॉगिन की आवश्यकता" : "Login Required"}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === "hi"
              ? "चैटबॉट का उपयोग करने के लिए कृपया लॉगिन करें।"
              : "Please login to use the chatbot feature."}
          </p>
          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            {language === "hi" ? "बंद करें" : "Close"}
          </button>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {language === "hi" ? "कृषि सहायक" : "Farming Assistant"}
              </h3>
              <p className="text-sm text-gray-500">
                {language === "hi"
                  ? "आपका स्मार्ट कृषि सलाहकार"
                  : "Your smart farming advisor"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {config.language.supported.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang === "en"
                      ? "English"
                      : lang === "hi"
                      ? "हिन्दी"
                      : lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            {/* Speech Toggle */}
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                speechEnabled
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-gray-100 text-gray-400"
              }`}
              title={
                language === "hi" ? "आवाज़ चालू/बंद करें" : "Toggle speech"
              }
            >
              {speechEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4" ref={chatContainerRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.type === "assistant" && (
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <p className="text-sm leading-relaxed">
                    {message.type === "assistant" &&
                    language === "hi" &&
                    message.contentHi
                      ? message.contentHi
                      : message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === "user"
                        ? "text-emerald-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {message.type === "user" && (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Loader className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {language === "hi"
                        ? "जवाब तैयार कर रहे हैं..."
                        : "Thinking..."}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={language === "hi" ? "वॉइस इनपुट" : "Voice input"}
            >
              {isListening ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            {/* Text Input */}
            <div className="flex-1">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === "hi"
                    ? "अपना सवाल टाइप करें या वॉइस का इस्तेमाल करें..."
                    : "Type your question or use voice input..."
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={1}
                disabled={isLoading}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors"
              title={language === "hi" ? "भेजें" : "Send"}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Voice listening indicator */}
          {isListening && (
            <div className="mt-2 text-center">
              <div className="inline-flex items-center space-x-2 text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="text-sm">
                  {language === "hi" ? "सुन रहे हैं..." : "Listening..."}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
