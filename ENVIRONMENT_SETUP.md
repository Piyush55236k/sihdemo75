# Environment Configuration Guide

This document provides a comprehensive guide for setting up the environment variables and configuration for the SIH Demo 75 farming chatbot application.

## Overview

The application consists of two main parts:
- **Client**: React.js frontend with Vite
- **Server**: Express.js backend with Node.js

Both parts use environment variables for configuration management through centralized config files.

## Quick Setup

1. Copy environment templates:
```bash
# Client setup
cd client
cp .env.example .env

# Server setup
cd ../server
cp .env.example .env
```

2. Fill in the required environment variables in both `.env` files
3. Install dependencies and start the applications

## Environment Variables

### Client (.env)

#### Core API Configuration
```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000
VITE_API_RETRY_ATTEMPTS=3
```

#### Authentication (Supabase)
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Speech Recognition
```bash
VITE_SPEECH_ENABLED=true
VITE_SPEECH_LANG=hi-IN
VITE_SPEECH_TIMEOUT=30000
```

#### Internationalization
```bash
VITE_DEFAULT_LANGUAGE=hi
VITE_SUPPORTED_LANGUAGES=en,hi,gu,ta,te
VITE_TRANSLATION_ENABLED=true
```

#### Application Settings
```bash
VITE_APP_NAME=FarmWise Assistant
VITE_APP_VERSION=1.0.0
VITE_DEBUG_MODE=false
```

### Server (.env)

#### Core Configuration
```bash
NODE_ENV=development
PORT=5000
API_VERSION=v1
```

#### Database
```bash
MONGODB_URI=mongodb://localhost:27017/farmwise
MONGODB_DB_NAME=farmwise
```

#### Authentication
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
SESSION_TIMEOUT=24
```

#### OpenAI Configuration
```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=500
OPENAI_TEMPERATURE=0.7
```

#### Weather API
```bash
OPENWEATHER_API_KEY=your_openweather_api_key
WEATHER_API_TIMEOUT=5000
WEATHER_CACHE_DURATION=1800
```

#### Rate Limiting
```bash
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESS=false
```

## Configuration Files

### Client Config (`client/src/config/env.js`)

This file provides a centralized configuration object that:
- Validates environment variables
- Provides fallback defaults
- Offers helper functions for config validation
- Supports development debugging

### Server Config (`server/config/env.js`)

The server configuration:
- Validates required environment variables
- Provides type conversion utilities
- Includes comprehensive validation functions
- Supports multiple environments (development, production, testing)

## Security Best Practices

### Environment File Security
- Never commit `.env` files to version control
- Use `.env.example` for documentation
- Store sensitive keys in secure vaults in production
- Use different keys for development and production

### API Keys
- Rotate API keys regularly
- Use least-privilege access principles
- Monitor API key usage and quotas
- Implement proper error handling for expired keys

### Database Security
- Use connection strings with authentication
- Enable MongoDB authentication in production
- Use SSL/TLS for database connections
- Implement proper database user roles

## Development Setup

1. **Install Dependencies**
```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

2. **Set Up Environment Variables**
```bash
# Client
cd client
cp .env.example .env
# Edit .env with your values

# Server  
cd ../server
cp .env.example .env
# Edit .env with your values
```

3. **Start Development Servers**
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## Production Deployment

### Environment Variables for Production

1. **Database**: Use managed MongoDB service (MongoDB Atlas)
2. **Authentication**: Configure production Supabase project
3. **API Keys**: Use production OpenAI and weather API keys
4. **Security**: Enable CORS restrictions, HTTPS, proper CSP headers
5. **Monitoring**: Add application monitoring and logging services

### Required Production Environment Variables

```bash
# Client
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key

# Server
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/farmwise
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_production_service_key
OPENAI_API_KEY=your_production_openai_key
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Check if `.env` files exist
   - Verify variable names match exactly
   - Ensure no trailing spaces in values

2. **API Connection Errors**
   - Verify API endpoints are reachable
   - Check API key validity
   - Confirm CORS settings for client

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure database user has proper permissions

4. **Authentication Problems**
   - Verify Supabase project configuration
   - Check API keys are correctly set
   - Ensure JWT secrets match between client and server

### Debug Mode

Enable debug mode by setting:
```bash
# Client
VITE_DEBUG_MODE=true

# Server
DEBUG=app:*
```

## API Documentation

### Chat Endpoint
- **POST** `/api/chat/chat`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ message: string, language?: 'en'|'hi', location?: string }`

### Authentication
- Uses Supabase for user authentication
- JWT tokens required for API access
- Automatic token validation middleware

### Rate Limiting
- 100 requests per 15-minute window per IP
- Configurable via environment variables
- Bypassed for successful requests (configurable)

## Support

For issues with environment setup:
1. Check this documentation first
2. Verify all environment variables are set correctly
3. Check application logs for specific error messages
4. Ensure all external services (Supabase, OpenAI, MongoDB) are accessible

## Version History

- **1.0.0**: Initial environment configuration setup
- Added centralized config management
- Implemented comprehensive validation
- Created development and production templates
