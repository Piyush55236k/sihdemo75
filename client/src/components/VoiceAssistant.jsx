import React, { useState, useRef } from "react";

const VoiceAssistant = () => {
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi! I am your voice assistant. How can I help you today?",
    },
  ]);
  const [open, setOpen] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize SpeechRecognition
  const getRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
  };

  // Handle voice input
  const startListening = () => {
    if (listening) return;
    const recognition = getRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setMessages((msgs) => [...msgs, { from: "user", text: transcript }]);
      handleCommand(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
  };

  // Handle commands and responses
  const handleCommand = (text) => {
    let response = "I'm sorry, I didn't understand that.";
    // Simple command examples
    if (/fertilizer|soil/i.test(text)) {
      response =
        "To check soil fertilizer, please enter your soil data on the Soil Fertilizer page.";
    } else if (/hello|hi/i.test(text)) {
      response = "Hello! How can I assist you today?";
    } else if (/weather/i.test(text)) {
      response = "Weather information is coming soon!";
    } else if (/dashboard/i.test(text)) {
      response = "Navigating to dashboard.";
      window.location.href = "/dashboard";
    }
    setMessages((msgs) => [...msgs, { from: "assistant", text: response }]);
    speak(response);
  };

  // Text-to-speech
  const speak = (text) => {
    if ("speechSynthesis" in window) {
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Voice Assistant Popup (above the button) */}
      {open && (
        <div className="mb-4 bg-white shadow-xl rounded-2xl p-4 w-80 max-h-96 overflow-y-auto border border-green-200 animate-fade-in">
          <div className="font-bold text-green-700 mb-2 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-green-500 animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
            </svg>
            Voice Assistant
          </div>
          <div className="space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm rounded-lg px-3 py-2 ${
                  msg.from === "assistant"
                    ? "bg-green-50 text-green-800 self-start"
                    : "bg-blue-50 text-blue-800 self-end"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-3">
            <button
              className={`rounded-full bg-green-600 hover:bg-green-700 text-white w-12 h-12 flex items-center justify-center focus:outline-none transition-all duration-200 border-4 border-white ${
                listening ? "animate-pulse" : ""
              }`}
              onClick={startListening}
              aria-label="Start listening"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18v3m0 0h3m-3 0H9m6-3a6 6 0 10-12 0 6 6 0 0012 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Floating Voice Assistant Button */}
      <button
        className={`rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white w-16 h-16 flex items-center justify-center focus:outline-none transition-all duration-200 border-4 border-white ${
          listening ? "animate-pulse" : ""
        }`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open voice assistant"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18v3m0 0h3m-3 0H9m6-3a6 6 0 10-12 0 6 6 0 0012 0z"
          />
        </svg>
      </button>
    </div>
  );
};

export default VoiceAssistant;
