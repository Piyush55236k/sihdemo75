// Weather API service for crop advisory
import config from '../config/env.js';

class WeatherService {
  constructor() {
    // Use config file for API key and settings
    this.API_KEY = config.weather?.apiKey || 'demo_key';
    this.BASE_URL = config.weather?.baseUrl || 'https://api.openweathermap.org/data/2.5';
    this.TIMEOUT = config.weather?.timeout || 10000;
    this.isDemoMode = this.API_KEY === 'demo_key' || !config.weather?.enableRealAPI;
    
    if (this.isDemoMode) {
      console.log('🌤️ WeatherService initialized in DEMO MODE');
    } else {
      console.log('🌤️ WeatherService initialized with OpenWeatherMap API');
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

      const url = `${this.BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`;
      
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
        temperature: data.main.temp,
        humidity: data.main.humidity,
        rainfall: data.rain ? (data.rain['1h'] || data.rain['3h'] || 0) : 0,
        weather: data.weather[0].main,
        description: data.weather[0].description,
        location: data.name,
        country: data.sys.country,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        },
        timestamp: new Date().toISOString()
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

      const url = `${this.BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric&cnt=40`; // 5 days, 3-hour intervals
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Weather Forecast API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process forecast data
      const forecast = data.list.map(item => ({
        datetime: item.dt_txt,
        temperature: item.main.temp,
        humidity: item.main.humidity,
        rainfall: item.rain ? (item.rain['3h'] || 0) : 0,
        weather: item.weather[0].main,
        description: item.weather[0].description
      }));

      return {
        location: data.city.name,
        country: data.city.country,
        forecast,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Weather Forecast API error:', error);
      return this.getMockForecastData(latitude, longitude);
    }
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
    // Simulate different weather based on location
    const mockData = {
      temperature: Math.round(20 + Math.random() * 15), // 20-35°C
      humidity: Math.round(40 + Math.random() * 40), // 40-80%
      rainfall: Math.random() > 0.7 ? Math.round(Math.random() * 10) : 0, // 0-10mm
      weather: ['Clear', 'Clouds', 'Rain'][Math.floor(Math.random() * 3)],
      description: 'partly cloudy',
      location: 'Demo Location',
      country: 'IN',
      pressure: Math.round(1000 + Math.random() * 50),
      windSpeed: Math.round(Math.random() * 10),
      coordinates: { lat: latitude, lon: longitude },
      timestamp: new Date().toISOString(),
      isDemoMode: true
    };

    mockData.description = this.getWeatherDescription(mockData.weather);
    
    return mockData;
  }

  /**
   * Mock forecast data for demo mode
   */
  getMockForecastData(latitude, longitude) {
    const forecast = [];
    
    for (let i = 0; i < 5; i++) {
      forecast.push({
        datetime: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
        temperature: Math.round(18 + Math.random() * 20),
        humidity: Math.round(35 + Math.random() * 45),
        rainfall: Math.random() > 0.6 ? Math.round(Math.random() * 15) : 0,
        weather: ['Clear', 'Clouds', 'Rain', 'Drizzle'][Math.floor(Math.random() * 4)],
        description: 'variable conditions'
      });
    }

    return {
      location: 'Demo Location',
      country: 'IN',
      forecast,
      timestamp: new Date().toISOString(),
      isDemoMode: true
    };
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

export default new WeatherService();
