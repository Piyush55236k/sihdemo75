# Weather API Setup Guide

## How to Enable Real Weather Data

The weather section can work with real location data from your browser and weather data from OpenWeatherMap API.

### Step 1: Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to "API keys" in your account dashboard
4. Copy your API key

### Step 2: Configure Environment Variables

1. Open `client/.env` file
2. Replace the weather configuration:

```bash
# Weather API Configuration
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
VITE_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5
VITE_WEATHER_TIMEOUT=10000
VITE_ENABLE_REAL_WEATHER_API=true
```

### Step 3: Restart the Development Server

```bash
cd client
npm run dev
```

## Current Implementation

The weather system:
- ✅ Requests browser location permission
- ✅ Falls back to demo location if permission denied
- ✅ Uses WeatherService for API calls
- ✅ Shows real location name in the UI
- ✅ Provides enhanced mock data when API key is not configured
- ✅ Handles API errors gracefully

## Features

- **Real Location**: Uses browser geolocation API
- **4-Day Forecast**: Shows upcoming weather conditions
- **Farming Insights**: Weather-specific farming advice
- **Fallback System**: Works even without API key using enhanced mock data
- **Error Handling**: Graceful degradation if location or API fails

## Demo Mode vs Real API

**Demo Mode (current)**: Enhanced mock weather data with real location
**Real API Mode**: Live weather data from OpenWeatherMap

Both modes provide a complete user experience!
