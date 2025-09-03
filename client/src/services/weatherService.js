// Weather API service for crop advisory - WeatherAPI.com integration
import config from '../config/env.js';

class WeatherService {
  constructor() {
    // Use config file for API key and settings
    this.API_KEY = config.weather?.apiKey || 'demo_key';
    this.BASE_URL = config.weather?.baseUrl || 'https://api.weatherapi.com/v1';
    this.TIMEOUT = config.weather?.timeout || 10000;
    this.isDemoMode = this.API_KEY === 'demo_key' || !config.weather?.enableRealAPI;
    
    if (this.isDemoMode) {
      console.log('🌤️ WeatherService initialized in DEMO MODE');
    } else {
      console.log('🌤️ WeatherService initialized with WeatherAPI.com');
    }
  }

  /**
   * Get current weather data using coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object>} Weather data
   */
  async getCurrentWeather(latitude, longitude) {
    try {
      if (this.API_KEY === 'demo_key') {
        // Demo mode - return mock data
        console.log('🌤️ DEMO MODE: Using mock weather data for', { latitude, longitude });
        return this.getMockWeatherData(latitude, longitude);
      }

      const url = `${this.BASE_URL}/current.json?key=${this.API_KEY}&q=${latitude},${longitude}&aqi=yes`;
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        rainfall: data.current.precip_mm,
        weather: data.current.condition.text,
        description: data.current.condition.text.toLowerCase(),
        location: data.location.name,
        country: data.location.country,
        pressure: data.current.pressure_mb,
        windSpeed: data.current.wind_kph,
        coordinates: {
          lat: data.location.lat,
          lon: data.location.lon
        },
        timestamp: new Date().toISOString(),
        uv: data.current.uv,
        visibility: data.current.vis_km
      };
      
    } catch (error) {
      console.error('❌ Weather API error:', error);
      // Fallback to demo data on error
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  /**
   * Get weather forecast for crop advisory
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Object>} 7-day weather forecast
   */
  async getWeatherForecast(latitude, longitude) {
    try {
      if (this.API_KEY === 'demo_key') {
        return this.getMockForecastData(latitude, longitude);
      }

      const url = `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${latitude},${longitude}&days=5&aqi=no&alerts=yes`;
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('🌤️ Weather API Response:', {
        location: data.location.name,
        alerts: data.alerts?.alert?.length || 0,
        forecast: data.forecast?.forecastday?.length || 0
      });
      
      // Process forecast data
      const forecast = data.forecast.forecastday.map(day => ({
        datetime: day.date,
        temperature: day.day.avgtemp_c,
        humidity: day.day.avghumidity,
        rainfall: day.day.totalprecip_mm,
        weather: day.day.condition.text,
        description: day.day.condition.text.toLowerCase(),
        maxTemp: day.day.maxtemp_c,
        minTemp: day.day.mintemp_c
      }));

      return {
        location: data.location.name,
        country: data.location.country,
        forecast,
        alerts: this.enhanceAlertsWithFarmingAdvice(data.alerts?.alert || [], data.location.lat, data.location.lon),
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Weather Forecast API error:', error);
      return this.getMockForecastData(latitude, longitude);
    }
  }

  /**
   * Get weather alerts for a location
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Promise<Array>} Weather alerts
   */
  async getWeatherAlerts(latitude, longitude) {
    try {
      if (this.API_KEY === 'demo_key') {
        return this.getMockAlertsData(latitude, longitude);
      }

      const url = `${this.BASE_URL}/forecast.json?key=${this.API_KEY}&q=${latitude},${longitude}&days=1&aqi=no&alerts=yes`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather Alerts API error: ${response.status}`);
      }

      const data = await response.json();
      
      return this.formatAlerts(data.alerts?.alert || []);
      
    } catch (error) {
      console.error('❌ Weather Alerts API error:', error);
      return this.getMockAlertsData(latitude, longitude);
    }
  }

  /**
   * Enhance alerts with farming advice and add demo alerts if none exist
   * @param {Array} apiAlerts 
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Array} Enhanced alerts
   */
  enhanceAlertsWithFarmingAdvice(apiAlerts, latitude, longitude) {
    const enhancedAlerts = this.formatAlerts(apiAlerts);
    
    // If no API alerts, or less than 1 alert, add some contextual farming alerts
    if (enhancedAlerts.length < 2) { // Changed from < 1 to < 2 to ensure we always have alerts
      const demoAlerts = this.getMockAlertsData(latitude, longitude);
      enhancedAlerts.push(...demoAlerts.slice(0, 3)); // Add up to 3 demo alerts
    }
    
    console.log('🚨 Final alerts count:', enhancedAlerts.length, enhancedAlerts);
    
    return enhancedAlerts;
  }

  /**
   * Format alerts from WeatherAPI.com
   * @param {Array} alerts 
   * @returns {Array} Formatted alerts
   */
  formatAlerts(alerts) {
    return alerts.map(alert => ({
      id: alert.msgtype || Math.random().toString(36),
      title: alert.event || 'Weather Alert',
      description: alert.desc || alert.instruction || 'Weather conditions may affect farming activities',
      severity: this.mapSeverity(alert.severity),
      urgency: alert.urgency || 'Moderate',
      areas: alert.areas ? alert.areas.split(';') : [],
      effective: alert.effective,
      expires: alert.expires,
      category: alert.category || 'Weather',
      certainty: alert.certainty || 'Likely'
    }));
  }

  /**
   * Map API severity to our severity levels
   * @param {string} apiSeverity 
   * @returns {string} Mapped severity
   */
  mapSeverity(apiSeverity) {
    const severityMap = {
      'Minor': 'low',
      'Moderate': 'medium', 
      'Severe': 'high',
      'Extreme': 'critical'
    };
    return severityMap[apiSeverity] || 'medium';
  }

  /**
   * Get user's current location
   * @returns {Promise<Object>} Location coordinates
   */
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error('❌ Geolocation error:', error);
          // Provide fallback location (New Delhi, India for demo)
          resolve({
            latitude: 28.6139,
            longitude: 77.2090,
            accuracy: null,
            timestamp: new Date().toISOString(),
            isDemo: true
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Mock weather data for demo mode
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Object} Mock weather data
   */
  getMockWeatherData(latitude, longitude) {
    // Get approximate location name based on coordinates
    const locationInfo = this.getLocationFromCoordinates(latitude, longitude);
    
    // Simulate different weather based on location and season
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // Seasonal temperature adjustments
    let baseTemp = 25;
    if (month >= 12 || month <= 2) baseTemp = 20; // Winter
    else if (month >= 3 && month <= 5) baseTemp = 30; // Spring/Summer
    else if (month >= 6 && month <= 9) baseTemp = 28; // Monsoon
    else baseTemp = 26; // Post-monsoon
    
    const mockData = {
      temperature: Math.round(baseTemp + Math.random() * 8 - 4), // ±4°C variation
      humidity: Math.round(50 + Math.random() * 40), // 50-90%
      rainfall: month >= 6 && month <= 9 ? Math.round(Math.random() * 15) : 
                Math.random() > 0.8 ? Math.round(Math.random() * 5) : 0,
      weather: this.getSeasonalWeather(month),
      description: '',
      location: locationInfo.city,
      country: locationInfo.country,
      pressure: Math.round(1008 + Math.random() * 20),
      windSpeed: Math.round(3 + Math.random() * 12),
      coordinates: { lat: latitude, lon: longitude },
      timestamp: new Date().toISOString(),
      isDemoMode: true
    };

    mockData.description = this.getWeatherDescription(mockData.weather);
    
    return mockData;
  }

  /**
   * Get approximate location name from coordinates
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Object} Location info
   */
  getLocationFromCoordinates(latitude, longitude) {
    // Simple approximation based on coordinate ranges for major cities
    // In a real app, you'd use a reverse geocoding service
    
    // India coordinates roughly: 8°N to 37°N, 68°E to 97°E
    if (latitude >= 8 && latitude <= 37 && longitude >= 68 && longitude <= 97) {
      if (latitude >= 28.5 && latitude <= 28.8 && longitude >= 77.0 && longitude <= 77.3) {
        return { city: 'New Delhi', country: 'IN' };
      } else if (latitude >= 19.0 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.0) {
        return { city: 'Mumbai', country: 'IN' };
      } else if (latitude >= 12.9 && latitude <= 13.1 && longitude >= 77.5 && longitude <= 77.7) {
        return { city: 'Bangalore', country: 'IN' };
      } else if (latitude >= 17.3 && latitude <= 17.5 && longitude >= 78.3 && longitude <= 78.6) {
        return { city: 'Hyderabad', country: 'IN' };
      } else if (latitude >= 22.4 && latitude <= 22.7 && longitude >= 88.2 && longitude <= 88.5) {
        return { city: 'Kolkata', country: 'IN' };
      } else if (latitude >= 13.0 && latitude <= 13.2 && longitude >= 80.1 && longitude <= 80.4) {
        return { city: 'Chennai', country: 'IN' };
      } else if (latitude >= 23.0 && latitude <= 23.3 && longitude >= 72.4 && longitude <= 72.7) {
        return { city: 'Ahmedabad', country: 'IN' };
      } else if (latitude >= 18.4 && latitude <= 18.7 && longitude >= 73.7 && longitude <= 74.0) {
        return { city: 'Pune', country: 'IN' };
      }
      
      // Generic Indian location
      const regions = [
        'Punjab', 'Haryana', 'Uttar Pradesh', 'Bihar', 'West Bengal',
        'Odisha', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Kerala',
        'Goa', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh'
      ];
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      return { city: `${randomRegion} Region`, country: 'IN' };
    }
    
    // US coordinates roughly: 25°N to 49°N, -125°W to -66°W
    if (latitude >= 25 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
      return { city: 'United States', country: 'US' };
    }
    
    // Default fallback
    return { city: 'Your Location', country: 'Demo' };
  }

  /**
   * Get seasonal weather pattern
   * @param {number} month 
   * @returns {string} Weather condition
   */
  getSeasonalWeather(month) {
    if (month >= 12 || month <= 2) {
      // Winter - more clear days
      return ['Clear', 'Clear', 'Clouds'][Math.floor(Math.random() * 3)];
    } else if (month >= 6 && month <= 9) {
      // Monsoon - more rain and clouds
      return ['Rain', 'Clouds', 'Rain', 'Clouds', 'Clear'][Math.floor(Math.random() * 5)];
    } else {
      // Other seasons - mixed
      return ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)];
    }
  }

  /**
   * Mock forecast data for demo mode
   */
  getMockForecastData(latitude, longitude) {
    const locationInfo = this.getLocationFromCoordinates(latitude, longitude);
    const forecast = [];
    const now = new Date();
    const month = now.getMonth() + 1;
    
    // Base temperature similar to current weather
    let baseTemp = 25;
    if (month >= 12 || month <= 2) baseTemp = 20;
    else if (month >= 3 && month <= 5) baseTemp = 30;
    else if (month >= 6 && month <= 9) baseTemp = 28;
    else baseTemp = 26;
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const dayTemp = baseTemp + Math.random() * 6 - 3; // ±3°C daily variation
      
      forecast.push({
        datetime: date.toISOString(),
        temperature: Math.round(dayTemp),
        humidity: Math.round(45 + Math.random() * 35),
        rainfall: this.getSeasonalRainfall(month),
        weather: this.getSeasonalWeather(month),
        description: 'forecast conditions'
      });
    }

    return {
      location: locationInfo.city,
      country: locationInfo.country,
      forecast,
      alerts: this.getMockAlertsData(latitude, longitude),
      timestamp: new Date().toISOString(),
      isDemoMode: true
    };
  }

  /**
   * Generate mock weather alerts for demo mode
   * @param {number} latitude 
   * @param {number} longitude 
   * @returns {Array} Mock alerts
   */
  getMockAlertsData(latitude, longitude) {
    const now = new Date();
    const month = now.getMonth() + 1;
    const alerts = [];

    // Seasonal alerts based on current month
    if (month >= 6 && month <= 9) {
      // Monsoon season alerts
      if (Math.random() > 0.3) { // Increased probability
        alerts.push({
          id: 'monsoon_heavy_rain',
          title: 'Heavy Rainfall Warning',
          description: 'Heavy rainfall expected in the next 24-48 hours. Ensure proper drainage and avoid waterlogging in fields.',
          severity: 'medium',
          urgency: 'Expected',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          category: 'Meteorological',
          farmingAdvice: 'Postpone irrigation, check drainage systems, harvest ready crops'
        });
      }
      
      if (Math.random() > 0.7) {
        alerts.push({
          id: 'flood_watch',
          title: 'Flood Watch',
          description: 'Flooding possible in low-lying areas. Monitor water levels and move livestock to higher ground.',
          severity: 'high',
          urgency: 'Immediate',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
          category: 'Hydrological',
          farmingAdvice: 'Move equipment to safe areas, evacuate livestock from low areas'
        });
      }
    } else if (month >= 3 && month <= 5) {
      // Summer alerts
      if (Math.random() > 0.4) { // Increased probability
        alerts.push({
          id: 'heat_wave',
          title: 'Heat Wave Advisory',
          description: 'Temperatures may exceed 40°C. Increase watering frequency and provide shade for livestock.',
          severity: 'medium',
          urgency: 'Expected',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 96 * 60 * 60 * 1000).toISOString(),
          category: 'Temperature',
          farmingAdvice: 'Increase irrigation, provide shade, harvest early morning'
        });
      }
    } else if (month >= 12 || month <= 2) {
      // Winter alerts
      if (Math.random() > 0.5) { // Increased probability
        alerts.push({
          id: 'frost_warning',
          title: 'Frost Warning',
          description: 'Frost conditions expected overnight. Protect sensitive crops and provide warm shelter for animals.',
          severity: 'medium',
          urgency: 'Immediate',
          effective: new Date().toISOString(),
          expires: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          category: 'Temperature',
          farmingAdvice: 'Cover sensitive plants, warm livestock areas, delay planting'
        });
      }
    }

    // Always add at least one general farming alert for demo purposes
    alerts.push({
      id: 'seasonal_farming_tip',
      title: 'Seasonal Farming Advisory',
      description: month >= 6 && month <= 9 
        ? 'Monsoon season is ideal for rice cultivation. Monitor soil moisture and ensure proper pest management.'
        : month >= 3 && month <= 5
        ? 'Summer farming requires efficient water management. Consider drip irrigation for better water conservation.'
        : 'Winter is perfect for growing wheat and vegetables. Ensure soil preparation and timely sowing.',
      severity: 'low',
      urgency: 'Expected',
      effective: new Date().toISOString(),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: 'Agricultural',
      farmingAdvice: month >= 6 && month <= 9
        ? 'Focus on rice, maintain drainage, pest control'
        : month >= 3 && month <= 5
        ? 'Water conservation, heat-resistant crops, early harvesting'
        : 'Wheat sowing, vegetable planting, soil preparation'
    });

    // General farming alerts (random)
    if (Math.random() > 0.6) { // Increased probability
      alerts.push({
        id: 'wind_advisory',
        title: 'High Wind Advisory',
        description: 'Strong winds expected. Secure loose items and check structural integrity of greenhouses.',
        severity: 'low',
        urgency: 'Expected',
        effective: new Date().toISOString(),
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        category: 'Wind',
        farmingAdvice: 'Secure equipment, check greenhouse structures, delay spraying'
      });
    }

    return alerts;
  }

  /**
   * Get seasonal rainfall pattern
   * @param {number} month 
   * @returns {number} Rainfall amount
   */
  getSeasonalRainfall(month) {
    if (month >= 6 && month <= 9) {
      // Monsoon season - higher chance of rain
      return Math.random() > 0.4 ? Math.round(Math.random() * 20) : 0;
    } else if (month >= 12 || month <= 2) {
      // Winter - very low chance of rain
      return Math.random() > 0.9 ? Math.round(Math.random() * 5) : 0;
    } else {
      // Other seasons - moderate chance
      return Math.random() > 0.7 ? Math.round(Math.random() * 10) : 0;
    }
  }

  /**
   * Get weather description based on weather type
   */
  getWeatherDescription(weather) {
    const descriptions = {
      'Clear': 'clear sky',
      'Clouds': 'partly cloudy',
      'Rain': 'light rain',
      'Drizzle': 'light drizzle',
      'Thunderstorm': 'thunderstorm',
      'Snow': 'snow',
      'Mist': 'misty conditions'
    };
    
    return descriptions[weather] || 'variable conditions';
  }

  /**
   * Analyze weather conditions for crop advisory
   * @param {Object} weatherData 
   * @returns {Object} Weather analysis
   */
  analyzeWeatherForCrops(weatherData) {
    const analysis = {
      temperature: {
        value: weatherData.temperature,
        category: this.categorizeTemperature(weatherData.temperature),
        suitable_crops: this.getCropsForTemperature(weatherData.temperature)
      },
      rainfall: {
        value: weatherData.rainfall,
        category: this.categorizeRainfall(weatherData.rainfall),
        irrigation_needed: weatherData.rainfall < 2
      },
      humidity: {
        value: weatherData.humidity,
        category: this.categorizeHumidity(weatherData.humidity),
        disease_risk: weatherData.humidity > 80 ? 'high' : weatherData.humidity > 60 ? 'medium' : 'low'
      },
      overall_conditions: this.getOverallConditions(weatherData),
      recommendations: this.getWeatherBasedRecommendations(weatherData)
    };

    return analysis;
  }

  categorizeTemperature(temp) {
    if (temp < 10) return 'cold';
    if (temp < 20) return 'cool';
    if (temp < 30) return 'moderate';
    if (temp < 40) return 'hot';
    return 'very_hot';
  }

  categorizeRainfall(rainfall) {
    if (rainfall === 0) return 'no_rain';
    if (rainfall < 2) return 'light';
    if (rainfall < 10) return 'moderate';
    return 'heavy';
  }

  categorizeHumidity(humidity) {
    if (humidity < 40) return 'low';
    if (humidity < 70) return 'moderate';
    return 'high';
  }

  getCropsForTemperature(temp) {
    if (temp >= 20 && temp <= 30) {
      return ['rice', 'wheat', 'maize', 'cotton'];
    } else if (temp >= 15 && temp <= 25) {
      return ['potato', 'peas', 'cauliflower', 'cabbage'];
    } else if (temp >= 25 && temp <= 35) {
      return ['sugarcane', 'cotton', 'groundnut', 'sorghum'];
    }
    return ['consult_expert'];
  }

  getOverallConditions(weatherData) {
    const temp = weatherData.temperature;
    const rainfall = weatherData.rainfall;
    const humidity = weatherData.humidity;

    if (temp >= 20 && temp <= 30 && rainfall >= 2 && humidity >= 50) {
      return 'excellent';
    } else if (temp >= 15 && temp <= 35 && (rainfall >= 1 || humidity >= 40)) {
      return 'good';
    } else if (temp >= 10 && temp <= 40) {
      return 'moderate';
    }
    return 'challenging';
  }

  getWeatherBasedRecommendations(weatherData) {
    const recommendations = [];
    
    if (weatherData.temperature > 35) {
      recommendations.push('Consider heat-resistant crop varieties');
      recommendations.push('Increase irrigation frequency');
    }
    
    if (weatherData.rainfall === 0) {
      recommendations.push('Ensure adequate irrigation');
      recommendations.push('Consider drought-resistant crops');
    }
    
    if (weatherData.humidity > 80) {
      recommendations.push('Monitor for fungal diseases');
      recommendations.push('Ensure proper ventilation');
    }
    
    if (weatherData.temperature < 15) {
      recommendations.push('Protect crops from frost');
      recommendations.push('Consider cold-hardy varieties');
    }

    return recommendations;
  }
}

export default WeatherService;
