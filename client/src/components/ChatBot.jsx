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
            ? `संदेश बहुत लंबा है। कृपया ${config.chat.maxMessageLength} अक्षरों से कम में लिखें।`
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
      // Use OpenAI API directly
      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const openaiModel = import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo';
      
      if (!openaiApiKey) {
        throw new Error('OpenAI API key not configured');
      }

      // Create system prompt for farming assistant
      const systemPrompt = language === 'hi' 
        ? "आप एक कृषि विशेषज्ञ हैं। किसानों को फसल, मिट्टी, मौसम और कृषि तकनीकों के बारे में हिंदी में सहायता प्रदान करें। संक्षिप्त और उपयोगी सलाह दें।"
        : "You are a farming expert assistant. Help farmers with advice about crops, soil, weather, and farming techniques. Provide concise and helpful advice.";

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: openaiModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: inputMessage }
          ],
          max_tokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS) || 150,
          temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE) || 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      const assistantMessage = {
        id: Date.now() + 1,
        type: "assistant",
        content: assistantResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Text-to-speech for assistant response
      if (speechEnabled && assistantResponse) {
        speakMessage(assistantResponse, language);
      }
    } catch (error) {
      console.error("Chat error:", error);

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
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <Bot className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">
                {language === "hi" ? "कृषि सहायक" : "Farming Assistant"}
              </h3>
              <p className="text-emerald-100 text-sm">
                {language === "hi"
                  ? "आपका स्मार्ट कृषि सहायक"
                  : "Your Smart Agriculture Assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="en" className="text-gray-800">
                English
              </option>
              <option value="hi" className="text-gray-800">
                हिन्दी
              </option>
            </select>

            {/* Voice Toggle */}
            <button
              onClick={() => setSpeechEnabled(!speechEnabled)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
              title={speechEnabled ? "Disable voice" : "Enable voice"}
            >
              {speechEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          style={{ scrollBehavior: "smooth" }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.type === "assistant" && (
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-emerald-500 text-white ml-8"
                    : "bg-gray-100 text-gray-800 mr-8"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">
                  {language === "hi" && message.contentHi
                    ? message.contentHi
                    : message.content}
                </div>

                {message.sources && (
                  <div className="mt-2 text-sm opacity-75">
                    <div className="font-medium mb-1">Sources:</div>
                    {message.sources.map((source, index) => (
                      <div key={index}>• {source}</div>
                    ))}
                  </div>
                )}

                <div
                  className={`text-xs mt-2 opacity-60 ${
                    message.type === "user"
                      ? "text-emerald-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                  {message.confidence && (
                    <span className="ml-2">
                      ({Math.round(message.confidence * 100)}% confident)
                    </span>
                  )}
                </div>
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-2xl mr-8">
                <div className="flex items-center space-x-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>
                    {language === "hi" ? "सोच रहा हूं..." : "Thinking..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            {/* Voice Input Button */}
            <button
              onClick={handleVoiceToggle}
              disabled={isLoading}
              className={`p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                isListening
                  ? "bg-red-100 text-red-600 animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              title={
                language === "hi"
                  ? isListening
                    ? "बोलना बंद करें"
                    : "बोलना शुरू करें"
                  : isListening
                  ? "Stop listening"
                  : "Start voice input"
              }
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
                    ? "कुछ पूछें... (जैसे: मेरी फसल में पत्ते पीले हो रहे हैं)"
                    : "Ask anything... (e.g., My crop leaves are turning yellow)"
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={1}
                style={{ minHeight: "48px", maxHeight: "120px" }}
                disabled={isLoading}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="p-3 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Character Counter */}
          <div className="mt-2 text-xs text-gray-500 text-right">
            {inputMessage.length}/{config.chat.maxMessageLength}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
