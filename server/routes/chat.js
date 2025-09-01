const express = require('express');
const OpenAI = require('openai');
const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');
const axios = require('axios');
const { config } = require('../config/env');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

// Initialize Supabase
const supabase = createClient(
  config.auth.supabase.url,
  config.auth.supabase.anonKey
);

// MongoDB Chat History Schema
const ChatMessage = mongoose.model('ChatMessage', new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  userMessage: {
    type: String,
    required: true
  },
  assistantResponse: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['en', 'hi'],
    default: 'en'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    weatherData: Object,
    location: String,
    responseTime: Number
  }
}, {
  timestamps: true
}));

// Supabase authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Missing or invalid authorization header' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token' 
      });
    }

    // Attach user to request object
    req.user = user;
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Authentication failed' 
    });
  }
};

// Helper function to get weather data
const getWeatherData = async (location) => {
  try {
    // You can use OpenWeatherMap API or any other weather service
    const API_KEY = config.weather.openweather.apiKey;
    
    if (!API_KEY) {
      return null;
    }

    // Try to parse location as coordinates first
    let weatherUrl;
    
    if (location.includes(',')) {
      const [lat, lon] = location.split(',').map(coord => coord.trim());
      weatherUrl = `${config.weather.openweather.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      // Treat as city name or PIN code
      weatherUrl = `${config.weather.openweather.baseUrl}/weather?q=${location}&appid=${API_KEY}&units=metric`;
    }

    const response = await axios.get(weatherUrl, { timeout: config.weather.openweather.timeout });
    return response.data;
    
  } catch (error) {
    console.error('Weather API error:', error.message);
    return null;
  }
};

// System prompts for different languages
const getSystemPrompt = (language, weatherData = null) => {
  const weatherContext = weatherData 
    ? `Current weather: Temperature ${weatherData.main.temp}°C, ${weatherData.weather[0].description}, humidity ${weatherData.main.humidity}%, wind speed ${weatherData.wind.speed} m/s. Location: ${weatherData.name}.`
    : '';

  if (language === 'hi') {
    return `आप एक सहायक कृषि विशेषज्ञ हैं जो भारतीय किसानों की मदद करते हैं। आप हिंदी में सरल और समझने योग्य भाषा में जवाब देते हैं।

आपकी विशेषताएं:
- फसलों, बीजों, खेती की तकनीकों के बारे में जानकारी देना
- मिट्टी की गुणवत्ता और उर्वरक के बारे में सलाह देना
- मौसम के अनुसार खेती की सलाह देना
- कीट-पतंगों और बीमारियों से बचाव के तरीके बताना
- फसल की कटाई और भंडारण की जानकारी देना
- सरकारी योजनाओं के बारे में बताना
- जैविक खेती के तरीके सुझाना

${weatherContext}

कृपया संक्षिप्त, व्यावहारिक और किसान-अनुकूल उत्तर दें। तकनीकी शब्दों का उपयोग कम करें और सरल हिंदी में समझाएं।`;
  }

  return `You are a helpful agricultural expert assistant for farmers. You provide practical, actionable advice in simple English.

Your expertise includes:
- Crop selection, planting, and cultivation techniques
- Soil health and fertilizer recommendations  
- Weather-based farming advice
- Pest and disease management
- Harvest and storage guidance
- Government schemes and subsidies for farmers
- Organic and sustainable farming practices
- Farm equipment and technology recommendations

${weatherContext}

Provide concise, practical, and farmer-friendly responses. Focus on actionable steps and avoid overly technical language.`;
};

// Chat API endpoint
router.post('/chat', authenticateUser, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { message, language = 'en', location } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: language === 'hi' 
          ? 'कृपया एक वैध संदेश भेजें'
          : 'Please provide a valid message'
      });
    }

    // Trim and limit message length
    const userMessage = message.trim();
    if (userMessage.length > 1000) {
      return res.status(400).json({
        error: language === 'hi'
          ? 'संदेश बहुत लंबा है। कृपया छोटा संदेश भेजें।'
          : 'Message too long. Please send a shorter message.'
      });
    }

    // Get weather data if location is provided
    let weatherData = null;
    if (location) {
      weatherData = await getWeatherData(location);
    }

    // Get chat history for context (last 5 messages)
    const recentMessages = await ChatMessage
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(5)
      .select('userMessage assistantResponse')
      .lean();

    // Build conversation context
    const conversationHistory = recentMessages.reverse().map(msg => [
      { role: 'user', content: msg.userMessage },
      { role: 'assistant', content: msg.assistantResponse }
    ]).flat();

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: getSystemPrompt(language, weatherData)
      },
      ...conversationHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    });

    const assistantResponse = completion.choices[0]?.message?.content;

    if (!assistantResponse) {
      throw new Error('No response from OpenAI');
    }

    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Save to MongoDB
    try {
      const chatMessage = new ChatMessage({
        userId,
        userMessage,
        assistantResponse,
        language,
        metadata: {
          weatherData,
          location,
          responseTime
        }
      });

      await chatMessage.save();
    } catch (dbError) {
      console.error('Database save error:', dbError);
      // Continue even if DB save fails
    }

    // Return response
    res.json({
      response: assistantResponse,
      timestamp: new Date().toISOString(),
      language,
      ...(weatherData && { weatherInfo: {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
        location: weatherData.name
      }})
    });

  } catch (error) {
    console.error('Chat API error:', error);

    // Handle specific OpenAI errors
    if (error.code === 'rate_limit_exceeded') {
      return res.status(429).json({
        error: language === 'hi'
          ? 'बहुत सारे अनुरोध। कृपया कुछ समय बाद पुनः प्रयास करें।'
          : 'Too many requests. Please try again later.'
      });
    }

    if (error.code === 'insufficient_quota') {
      return res.status(503).json({
        error: language === 'hi'
          ? 'सेवा अस्थायी रूप से उपलब्ध नहीं है।'
          : 'Service temporarily unavailable.'
      });
    }

    // Generic error response
    res.status(500).json({
      error: language === 'hi'
        ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
        : 'Sorry, something went wrong. Please try again.'
    });
  }
});

// Get chat history endpoint
router.get('/chat/history', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const messages = await ChatMessage
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('userMessage assistantResponse language timestamp')
      .lean();

    const total = await ChatMessage.countDocuments({ userId });

    res.json({
      messages: messages.reverse(), // Show oldest first
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      error: 'Failed to fetch chat history'
    });
  }
});

// Clear chat history endpoint
router.delete('/chat/history', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await ChatMessage.deleteMany({ userId });
    
    res.json({
      message: 'Chat history cleared successfully'
    });

  } catch (error) {
    console.error('Clear chat history error:', error);
    res.status(500).json({
      error: 'Failed to clear chat history'
    });
  }
});

module.exports = router;
