// Environment configuration utility
// All environment variables for the client (Vite requires VITE_ prefix)

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  },

  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'FarmWise',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },

  // Feature Flags
  features: {
    voiceAssistant: import.meta.env.VITE_ENABLE_VOICE_ASSISTANT === 'true',
    chatbot: import.meta.env.VITE_ENABLE_CHATBOT === 'true',
    weather: import.meta.env.VITE_ENABLE_WEATHER === 'true',
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
  },

  // Language Configuration
  language: {
    default: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
    supported: import.meta.env.VITE_SUPPORTED_LANGUAGES?.split(',') || ['en', 'hi'],
  },

  // Speech Configuration
  speech: {
    recognition: {
      en: import.meta.env.VITE_SPEECH_RECOGNITION_LANG_EN || 'en-US',
      hi: import.meta.env.VITE_SPEECH_RECOGNITION_LANG_HI || 'hi-IN',
    },
    synthesis: {
      rate: parseFloat(import.meta.env.VITE_SPEECH_SYNTHESIS_RATE) || 0.9,
      volume: parseFloat(import.meta.env.VITE_SPEECH_SYNTHESIS_VOLUME) || 0.8,
    },
  },

  // Weather API Configuration
  weather: {
    apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key',
    baseUrl: import.meta.env.VITE_OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
    timeout: parseInt(import.meta.env.VITE_WEATHER_TIMEOUT) || 10000,
    enableRealAPI: import.meta.env.VITE_ENABLE_REAL_WEATHER_API === 'true',
  },

  // Chat Configuration
  chat: {
    maxMessageLength: parseInt(import.meta.env.VITE_MAX_MESSAGE_LENGTH) || 1000,
    historyLimit: parseInt(import.meta.env.VITE_CHAT_HISTORY_LIMIT) || 100,
    typingDelay: parseInt(import.meta.env.VITE_TYPING_DELAY) || 50,
  },

  // UI Configuration
  ui: {
    theme: {
      primaryColor: import.meta.env.VITE_THEME_PRIMARY_COLOR || 'emerald',
    },
    animation: {
      duration: parseInt(import.meta.env.VITE_ANIMATION_DURATION) || 300,
    },
    mobile: {
      breakpoint: parseInt(import.meta.env.VITE_MOBILE_BREAKPOINT) || 768,
    },
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
    allowedTypes: import.meta.env.VITE_ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ],
  },

  // Location Configuration
  location: {
    default: import.meta.env.VITE_DEFAULT_LOCATION || 'Delhi',
  },

  // Contact Information
  contact: {
    email: import.meta.env.VITE_SUPPORT_EMAIL || 'support@farmwise.com',
    phone: import.meta.env.VITE_SUPPORT_PHONE || '+91-1234567890',
  },

  // Social Media Links
  social: {
    facebook: import.meta.env.VITE_FACEBOOK_URL || '',
    twitter: import.meta.env.VITE_TWITTER_URL || '',
    instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  },

  // Development Configuration
  development: {
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  },

  // Analytics Configuration
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_ANALYTICS_ID || '',
    gtmId: import.meta.env.VITE_GTM_ID || '',
  },
};

// Validation function to check required environment variables
export const validateConfig = () => {
  const requiredVars = [
    { key: 'VITE_SUPABASE_URL', value: config.supabase.url },
    { key: 'VITE_SUPABASE_ANON_KEY', value: config.supabase.anonKey },
  ];

  const missing = requiredVars.filter(({ value }) => !value);

  if (missing.length > 0) {
    const missingKeys = missing.map(({ key }) => key).join(', ');
    console.warn(`Missing required environment variables: ${missingKeys}`);
    
    if (config.development.debugMode) {
      console.warn('Please check your .env file and ensure all required variables are set.');
    }
  }

  return missing.length === 0;
};

// Helper functions
export const isDevelopment = () => config.app.environment === 'development';
export const isProduction = () => config.app.environment === 'production';

// Export the configuration object (both default and named export for flexibility)
export { config };
export default config;
