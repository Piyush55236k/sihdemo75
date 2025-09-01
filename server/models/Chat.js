const mongoose = require('mongoose');

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  // User identification from Supabase
  userId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  
  // Message content
  userMessage: {
    type: String,
    required: true,
    maxLength: 1000,
    trim: true
  },
  
  assistantResponse: {
    type: String,
    required: true,
    maxLength: 2000,
    trim: true
  },
  
  // Language setting
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en',
    index: true
  },
  
  // Timestamp for the conversation
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Additional metadata
  metadata: {
    // Weather data at the time of query (if available)
    weatherData: {
      type: Object,
      default: null
    },
    
    // User location (PIN code, city, or coordinates)
    location: {
      type: String,
      default: null,
      trim: true
    },
    
    // API response time in milliseconds
    responseTime: {
      type: Number,
      min: 0
    },
    
    // OpenAI model used
    model: {
      type: String,
      default: 'gpt-4'
    },
    
    // Tokens used (for cost tracking)
    tokensUsed: {
      type: Number,
      min: 0
    },
    
    // User satisfaction rating (optional)
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    
    // Flag for inappropriate content
    flagged: {
      type: Boolean,
      default: false
    }
  }
}, {
  // Automatically add createdAt and updatedAt fields
  timestamps: true,
  
  // Optimize for queries
  collection: 'chat_messages'
});

// Indexes for better query performance
chatMessageSchema.index({ userId: 1, timestamp: -1 });
chatMessageSchema.index({ language: 1, timestamp: -1 });
chatMessageSchema.index({ 'metadata.flagged': 1 });

// Instance methods
chatMessageSchema.methods.toClientJSON = function() {
  return {
    id: this._id,
    userMessage: this.userMessage,
    assistantResponse: this.assistantResponse,
    language: this.language,
    timestamp: this.timestamp,
    rating: this.metadata?.rating,
    location: this.metadata?.location
  };
};

// Static methods
chatMessageSchema.statics.findByUserId = function(userId, options = {}) {
  const {
    page = 1,
    limit = 50,
    language,
    startDate,
    endDate
  } = options;
  
  let query = { userId };
  
  if (language) {
    query.language = language;
  }
  
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }
  
  return this.find(query)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));
};

chatMessageSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        averageResponseTime: { $avg: '$metadata.responseTime' },
        languageBreakdown: {
          $push: '$language'
        },
        firstMessage: { $min: '$timestamp' },
        lastMessage: { $max: '$timestamp' }
      }
    },
    {
      $project: {
        _id: 0,
        totalMessages: 1,
        averageResponseTime: { $round: ['$averageResponseTime', 2] },
        languages: {
          $reduce: {
            input: '$languageBreakdown',
            initialValue: { en: 0, hi: 0 },
            in: {
              en: {
                $cond: [
                  { $eq: ['$$this', 'en'] },
                  { $add: ['$$value.en', 1] },
                  '$$value.en'
                ]
              },
              hi: {
                $cond: [
                  { $eq: ['$$this', 'hi'] },
                  { $add: ['$$value.hi', 1] },
                  '$$value.hi'
                ]
              }
            }
          }
        },
        firstMessage: 1,
        lastMessage: 1
      }
    }
  ]);
};

// User Session Schema (for tracking active conversations)
const userSessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  currentLanguage: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  preferences: {
    speechEnabled: {
      type: Boolean,
      default: true
    },
    
    location: {
      type: String,
      default: null
    },
    
    crops: [{
      type: String,
      trim: true
    }],
    
    farmSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: null
    }
  },
  
  statistics: {
    totalChats: {
      type: Number,
      default: 0
    },
    
    averageRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    },
    
    favoriteTopics: [{
      topic: String,
      count: Number
    }]
  }
}, {
  timestamps: true,
  collection: 'user_sessions'
});

// Update last activity on save
userSessionSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Models
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const UserSession = mongoose.model('UserSession', userSessionSchema);

module.exports = {
  ChatMessage,
  UserSession
};
