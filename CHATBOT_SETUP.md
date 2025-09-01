# AI Chatbot System Setup Guide

## Overview

This guide walks you through setting up the complete AI-powered chatbot system for farmers, including frontend components, backend API, and all necessary configurations.

## System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server  │    │   External APIs │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │  ChatBot    │◄├────┤►│  Chat Routes │◄├────┤►│   OpenAI    │ │
│ │ Components  │ │    │ │              │ │    │ │   GPT-4     │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
│                 │    │                  │    │                 │
│ ┌─────────────┐ │    │ ┌──────────────┐ │    │ ┌─────────────┐ │
│ │  Supabase   │◄├────┤►│     Auth     │◄├────┤►│  Supabase   │ │
│ │    Auth     │ │    │ │ Middleware   │ │    │ │   Service   │ │
│ └─────────────┘ │    │ └──────────────┘ │    │ └─────────────┘ │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                ▲
                                │
                       ┌────────▼────────┐
                       │    MongoDB      │
                       │  Chat History   │
                       └─────────────────┘
```

## Prerequisites

### Software Requirements

- **Node.js**: Version 18 or higher
- **npm**: Version 9 or higher
- **MongoDB**: Version 5.0 or higher
- **Git**: For version control

### External Services

1. **Supabase Account**: For authentication
2. **OpenAI API Key**: For GPT-4 access
3. **OpenWeather API Key**: For weather data (optional)
4. **MongoDB Instance**: Local or cloud-based

## Installation Steps

### 1. Clone and Setup Repository

```bash
# Clone the repository
git clone https://github.com/Piyush55236k/sihdemo75.git
cd sihdemo75-main

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

Copy and configure environment files:

```bash
# Client environment
cd client
cp .env.example .env

# Server environment
cd ../server
cp .env.example .env
```

### 3. Required Environment Variables

#### Client `.env` (Minimum Required)

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEFAULT_LANGUAGE=hi
```

#### Server `.env` (Minimum Required)

```bash
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/farmwise
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. External Services Setup

#### Supabase Setup

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy Project URL and anon/service keys
5. Enable Row Level Security (RLS) on auth tables

#### OpenAI Setup

1. Create account at [openai.com](https://openai.com)
2. Go to API Keys section
3. Generate new API key
4. Add billing method (required for GPT-4)

#### MongoDB Setup

```bash
# Option 1: Local MongoDB
# Install MongoDB Community Edition
# Start MongoDB service

# Option 2: MongoDB Atlas (Cloud)
# Create free cluster at mongodb.com/atlas
# Get connection string
```

### 5. Database Schema

The application automatically creates the following collections:

- `chatmessages`: Stores chat history
- User authentication handled by Supabase

## Component Architecture

### Frontend Components

#### `ChatBot.jsx`

Main chatbot interface with features:

- Real-time messaging
- Voice input/output
- Language switching (Hindi/English)
- Weather integration
- User authentication

#### `ChatBotWidget.jsx`

Floating chat button that opens the main chatbot:

- Customizable positioning
- Notification indicators
- Responsive design

### Backend Structure

#### `server/routes/chat.js`

Main API endpoints:

- `POST /api/chat/chat`: Send message and get AI response
- `GET /api/chat/history`: Retrieve chat history
- `DELETE /api/chat/history`: Clear chat history

#### `server/config/env.js`

Centralized configuration management:

- Environment variable validation
- Default value handling
- Type conversion utilities

## Features

### Core Features

✅ **AI-Powered Responses**: GPT-4 integration for farming advice  
✅ **Multilingual Support**: Hindi and English languages  
✅ **Voice Input/Output**: Speech recognition and text-to-speech  
✅ **User Authentication**: Secure login with Supabase  
✅ **Chat History**: Persistent conversation storage  
✅ **Weather Integration**: Location-based weather data  
✅ **Responsive Design**: Works on mobile and desktop

### Advanced Features

✅ **Context Awareness**: Remembers previous conversation  
✅ **Rate Limiting**: Prevents API abuse  
✅ **Error Handling**: Graceful error management  
✅ **Offline Support**: Basic offline functionality  
✅ **Accessibility**: Screen reader and keyboard navigation support

## Usage Guide

### Starting the Application

1. **Start MongoDB** (if using local instance)

```bash
# MongoDB service should be running
mongod
```

2. **Start Server** (Terminal 1)

```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

3. **Start Client** (Terminal 2)

```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Using the Chatbot

1. **Access the Application**: Open browser to `http://localhost:5173`
2. **Authentication**: Sign up/login using the auth modal
3. **Start Chatting**: Click the floating chat button
4. **Voice Input**: Click microphone button to use voice
5. **Language Toggle**: Switch between Hindi and English
6. **View History**: Previous conversations are automatically saved

### Example Interactions

**Hindi Queries:**

```
"मेरी गेहूं की फसल में पत्तियां पीली हो रही हैं, क्या करूं?"
"आज बारिश का मौसम है, क्या मैं अपनी फसल को पानी दूं?"
"टमाटर की बुआई का सही समय कब है?"
```

**English Queries:**

```
"My wheat crop leaves are turning yellow, what should I do?"
"It's raining today, should I water my crops?"
"When is the right time to plant tomatoes?"
```

## API Reference

### Authentication

All chat endpoints require Bearer token authentication:

```javascript
Authorization: Bearer <supabase_jwt_token>
```

### Chat API

```javascript
// Send message
POST /api/chat/chat
{
  "message": "My crop question",
  "language": "hi", // 'en' or 'hi'
  "location": "Delhi" // optional
}

// Response
{
  "response": "AI response",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "language": "hi",
  "weatherInfo": { ... } // if location provided
}
```

### Chat History

```javascript
// Get history
GET /api/chat/history?page=1&limit=50

// Clear history
DELETE /api/chat/history
```

## Customization

### Adding New Languages

1. Add language to supported list in config
2. Update system prompts in `getSystemPrompt()` function
3. Add language detection logic
4. Update frontend language selector

### Modifying AI Behavior

Edit the system prompt in `server/routes/chat.js`:

```javascript
const getSystemPrompt = (language, weatherData) => {
  // Customize prompt here
  return `Your custom system prompt...`;
};
```

### Styling Customization

The chatbot uses Tailwind CSS. Modify classes in:

- `ChatBot.jsx`: Main interface styling
- `ChatBotWidget.jsx`: Floating button styling

## Troubleshooting

### Common Issues

1. **"OpenAI API key not found"**

   - Verify `OPENAI_API_KEY` in server `.env`
   - Check OpenAI account has billing enabled

2. **"Supabase connection failed"**

   - Verify Supabase URL and keys
   - Check network connectivity
   - Ensure RLS policies are configured

3. **"MongoDB connection error"**

   - Verify MongoDB is running
   - Check connection string format
   - Ensure database user has permissions

4. **Voice input not working**
   - Check browser permissions for microphone
   - Verify HTTPS for production (required for speech API)
   - Ensure browser supports Web Speech API

### Debug Mode

Enable detailed logging:

```bash
# Server
DEBUG=app:* npm run dev

# Client
VITE_DEBUG_MODE=true npm run dev
```

## Production Deployment

### Build for Production

```bash
# Build client
cd client
npm run build

# Server is ready for production
cd ../server
npm start
```

### Environment Variables for Production

- Use HTTPS URLs for all services
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Enable MongoDB authentication
- Configure proper CORS settings

### Recommended Hosting

- **Frontend**: Vercel, Netlify, or Cloudflare Pages
- **Backend**: Railway, Render, or DigitalOcean
- **Database**: MongoDB Atlas

## Performance Optimization

### Frontend

- Lazy load chat component
- Implement virtual scrolling for long conversations
- Cache user preferences locally
- Optimize image and asset loading

### Backend

- Implement response caching
- Add connection pooling for MongoDB
- Use clustering for multiple CPU cores
- Implement request queuing for high load

## Security Considerations

### API Security

- Rate limiting implemented (100 requests per 15 minutes)
- JWT token validation
- Input sanitization
- CORS configuration

### Data Privacy

- User conversations encrypted in transit
- Minimal data collection
- Clear data retention policies
- GDPR compliance considerations

## Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review process

### Code Style

- ESLint configuration provided
- Prettier for formatting
- Consistent naming conventions
- Comprehensive error handling

## License and Support

This project is part of the Smart India Hackathon (SIH) Demo 75 submission for improving agricultural assistance through AI technology.

For technical support or questions:

1. Check this documentation
2. Review environment setup guide
3. Check GitHub issues
4. Contact development team

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Compatibility**: Node.js 18+, React 18+, MongoDB 5.0+
