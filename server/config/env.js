require('dotenv').config();

// Server configuration utility
const config = {
  // Server Configuration
  server: {
    port: parseInt(process.env.PORT) || 5000,
    host: process.env.SERVER_HOST || 'localhost',
    env: process.env.NODE_ENV || 'development',
  },

  // Client Configuration
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },

  // Gemini AI Configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'models/gemini-1.0-pro',
    apiUrl: process.env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/models/gemini-1.0-pro:generateContent',
  },

  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },

  // Database Configuration
  database: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/farming-assistant',
      options: {
        maxPoolSize: parseInt(process.env.MONGODB_OPTIONS_MAX_POOL_SIZE) || 10,
        serverSelectionTimeoutMS: parseInt(process.env.MONGODB_OPTIONS_SERVER_SELECTION_TIMEOUT_MS) || 5000,
      },
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      password: process.env.REDIS_PASSWORD || '',
      db: parseInt(process.env.REDIS_DB) || 0,
      ttl: parseInt(process.env.REDIS_TTL) || 3600,
    },
  },

  // Authentication Configuration
  auth: {
    supabase: {
      url: process.env.SUPABASE_URL || '',
      anonKey: process.env.SUPABASE_ANON_KEY || '',
      serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
      jwtSecret: process.env.SUPABASE_JWT_SECRET || '',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'your-fallback-secret',
    },
    session: {
      secret: process.env.SESSION_SECRET || 'your-session-secret',
      maxAge: parseInt(process.env.COOKIE_MAX_AGE) || 86400000,
    },
    bcrypt: {
      rounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    },
  },

  // AI Configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4',
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
    timeout: parseInt(process.env.OPENAI_TIMEOUT) || 30000,
  },

  // Weather API Configuration
  weather: {
    openweather: {
      apiKey: process.env.OPENWEATHER_API_KEY || '',
      baseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
      timeout: parseInt(process.env.OPENWEATHER_TIMEOUT) || 5000,
    },
  },

  // Rate Limiting Configuration
  rateLimiting: {
    general: {
      windowMs: parseInt(process.env.GENERAL_RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
      max: parseInt(process.env.GENERAL_RATE_LIMIT_MAX) || 100,
    },
    chat: {
      windowMs: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
      max: parseInt(process.env.CHAT_RATE_LIMIT_MAX) || 10,
    },
    api: {
      windowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) || 300000, // 5 minutes
      max: parseInt(process.env.API_RATE_LIMIT_MAX) || 50,
    },
  },

  // Application Configuration
  app: {
    name: process.env.APP_NAME || 'Farming Assistant API',
    version: process.env.APP_VERSION || '1.0.0',
    apiVersion: process.env.API_VERSION || 'v1',
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000,
    maxResponseLength: parseInt(process.env.MAX_RESPONSE_LENGTH) || 2000,
    chatHistoryLimit: parseInt(process.env.CHAT_HISTORY_LIMIT) || 100,
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
    maxSize: process.env.LOG_MAX_SIZE || '10M',
    maxFiles: parseInt(process.env.LOG_MAX_FILES) || 5,
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING === 'true',
  },

  // Email Configuration
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
    from: process.env.EMAIL_FROM || 'noreply@farmwise.com',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.UPLOAD_MAX_FILE_SIZE) || 5242880, // 5MB
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ],
    destination: process.env.UPLOAD_DESTINATION || 'uploads/',
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    },
  },

  // Analytics Configuration
  analytics: {
    googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || '',
    mixpanelToken: process.env.MIXPANEL_TOKEN || '',
    enabled: process.env.ENABLE_ANALYTICS === 'true',
  },

  // Monitoring Configuration
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN || '',
    newRelicLicenseKey: process.env.NEW_RELIC_LICENSE_KEY || '',
    healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
  },

  // Background Jobs Configuration
  queue: {
    redisUrl: process.env.QUEUE_REDIS_URL || 'redis://localhost:6379',
    concurrency: parseInt(process.env.QUEUE_CONCURRENCY) || 5,
    maxRetries: parseInt(process.env.QUEUE_MAX_RETRIES) || 3,
  },

  // Third-party APIs
  thirdParty: {
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    soilApiKey: process.env.SOIL_API_KEY || '',
    cropDiseaseApiKey: process.env.CROP_DISEASE_API_KEY || '',
    perspectiveApiKey: process.env.PERSPECTIVE_API_KEY || '',
    translationApiKey: process.env.TRANSLATION_API_KEY || '',
  },

  // Notifications Configuration
  notifications: {
    email: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    sms: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    },
  },

  // Content Moderation
  moderation: {
    enabled: process.env.ENABLE_CONTENT_MODERATION === 'true',
    profanityFilterLevel: process.env.PROFANITY_FILTER_LEVEL || 'medium',
  },

  // Language Configuration
  language: {
    default: process.env.DEFAULT_LANGUAGE || 'en',
    supported: process.env.SUPPORTED_LANGUAGES?.split(',') || ['en', 'hi'],
  },

  // Development Configuration
  development: {
    debugMode: process.env.DEBUG_MODE === 'true',
    corsDebug: process.env.ENABLE_CORS_DEBUG === 'true',
    detailedErrors: process.env.ENABLE_DETAILED_ERRORS === 'true',
    mockExternalApis: process.env.MOCK_EXTERNAL_APIS === 'true',
  },

  // Production Configuration
  production: {
    clusterMode: process.env.CLUSTER_MODE === 'true',
    workerProcesses: parseInt(process.env.WORKER_PROCESSES) || 0,
    keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 5000,
    headersTimeout: parseInt(process.env.HEADERS_TIMEOUT) || 6000,
    forceHttps: process.env.FORCE_HTTPS === 'true',
  },

  // SSL Configuration
  ssl: {
    certPath: process.env.SSL_CERT_PATH || '',
    keyPath: process.env.SSL_KEY_PATH || '',
  },

  // Backup Configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 7,
    s3Bucket: process.env.BACKUP_S3_BUCKET || '',
  },
};

// Validation function to check required environment variables
const validateConfig = () => {
  const requiredVars = [
    { key: 'SUPABASE_URL', value: config.auth.supabase.url },
    { key: 'SUPABASE_ANON_KEY', value: config.auth.supabase.anonKey },
    { key: 'OPENAI_API_KEY', value: config.openai.apiKey },
    { key: 'MONGODB_URI', value: config.database.mongodb.uri },
  ];

  const missing = requiredVars.filter(({ value }) => !value);

  if (missing.length > 0) {
    const missingKeys = missing.map(({ key }) => key).join(', ');
    console.error(`Missing required environment variables: ${missingKeys}`);
    
    if (config.development.debugMode) {
      console.error('Please check your .env file and ensure all required variables are set.');
    }
    
    return false;
  }

  return true;
};

// Helper functions
const isDevelopment = () => config.server.env === 'development';
const isProduction = () => config.server.env === 'production';
const isTest = () => config.server.env === 'test';

module.exports = {
  config,
  validateConfig,
  isDevelopment,
  isProduction,
  isTest,
};