// Crop Advisory service for ML-based crop recommendations
import config from '../config/env.js';
import weatherService from './weatherService.js';

class CropAdvisoryService {
  constructor() {
    // Use Python Flask backend for ML processing
    this.API_BASE_URL = 'http://localhost:5001/api';
    this.MAIN_API_URL = config.api.baseUrl || 'http://localhost:5000/api';
    this.supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    this.maxImageSize = 5 * 1024 * 1024; // 5MB
  }

  /**
   * Validate uploaded soil image
   * @param {File} imageFile 
   * @returns {Object} Validation result
   */
  validateSoilImage(imageFile) {
    if (!imageFile) {
      return { valid: false, error: 'No image file provided' };
    }

    if (!this.supportedImageTypes.includes(imageFile.type)) {
      return { 
        valid: false, 
        error: 'Please upload a JPEG, PNG, or WebP image' 
      };
    }

    if (imageFile.size > this.maxImageSize) {
      return { 
        valid: false, 
        error: 'Image size should be less than 5MB' 
      };
    }

    return { valid: true };
  }

  /**
   * Get comprehensive crop advisory based on soil image and location
   * @param {File} soilImage 
   * @param {Object} location - {latitude, longitude}
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Crop advisory data
   */
  async getCropAdvisory(soilImage, location, options = {}) {
    try {
      // Validate image
      const imageValidation = this.validateSoilImage(soilImage);
      if (!imageValidation.valid) {
        throw new Error(imageValidation.error);
      }

      // Get current weather data
      console.log('🌤️ Fetching weather data...');
      const weatherData = await weatherService.getCurrentWeather(location.latitude, location.longitude);
      
      // Get weather forecast
      const forecastData = await weatherService.getWeatherForecast(location.latitude, location.longitude);

      // Analyze weather conditions
      const weatherAnalysis = weatherService.analyzeWeatherForCrops(weatherData);

      // Prepare additional info for Python ML API
      const additionalInfo = {
        temperature: weatherData.temperature,
        rainfall: weatherData.rainfall,
        humidity: weatherData.humidity,
        weather_conditions: weatherData.weather,
        language: options.language || 'en',
        farmSize: options.farmSize,
        soilType: options.soilType,
        previousCrop: options.previousCrop,
        experience: options.experience
      };

      // Send to Python ML backend for processing
      console.log('🤖 Sending data to Python ML backend...');
      const response = await this.callCropAdvisoryAPI(soilImage, location, additionalInfo);

      // Combine all data
      const advisory = {
        success: true,
        timestamp: new Date().toISOString(),
        location: {
          coordinates: location,
          name: weatherData.location,
          country: weatherData.country
        },
        weather: {
          current: weatherData,
          forecast: forecastData.forecast?.slice(0, 5), // Next 5 days
          analysis: weatherAnalysis
        },
        soil: response.soil_analysis || this.getMockSoilAnalysis(),
        crop_recommendations: response.crop_recommendations || this.getMockCropRecommendations(weatherData),
        farming_tips: response.farming_tips || this.getMockFarmingTips(weatherData),
        advisory_id: response.advisory_id || `advisory_${Date.now()}`,
        confidence_score: response.confidence_score || 0.85,
        isDemoMode: response.isDemoMode || true
      };

      // Add follow-up questions capability
      advisory.follow_up_enabled = true;
      advisory.suggested_questions = this.generateFollowUpQuestions(advisory);

      return advisory;

    } catch (error) {
      console.error('❌ Crop Advisory error:', error);
      
      // Return fallback advisory in case of error
      return this.getFallbackAdvisory(location, error.message);
    }
  }

  /**
   * Call the Python Flask ML API for crop advisory
   * @param {File} imageFile 
   * @param {Object} location 
   * @param {Object} additionalInfo 
   * @returns {Promise<Object>}
   */
  async callCropAdvisoryAPI(imageFile, location, additionalInfo = {}) {
    try {
      // Convert image to base64 for JSON API
      const imageBase64 = await this.fileToBase64(imageFile);
      
      const requestData = {
        imageData: imageBase64,
        location: location,
        additionalInfo: additionalInfo
      };

      console.log('📡 Calling Python ML API:', this.API_BASE_URL + '/crop-advisory');

      const response = await fetch(`${this.API_BASE_URL}/crop-advisory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Python ML API response received');
      return data;

    } catch (error) {
      console.log('⚠️ Python ML API not available, using demo mode:', error.message);
      
      // Demo mode - return mock ML results
      return {
        soil_analysis: this.getMockSoilAnalysis(),
        crop_recommendations: this.getMockCropRecommendations(),
        farming_tips: this.getMockFarmingTips(),
        advisory_id: `demo_advisory_${Date.now()}`,
        confidence_score: 0.75,
        isDemoMode: true
      };
    }
  }

  /**
   * Convert file to base64 string
   * @param {File} file 
   * @returns {Promise<string>}
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate mock soil analysis for demo mode
   */
  getMockSoilAnalysis() {
    const soilTypes = ['loamy', 'clay', 'sandy', 'black_cotton', 'red_laterite'];
    const selectedSoil = soilTypes[Math.floor(Math.random() * soilTypes.length)];
    
    return {
      soil_type: selectedSoil,
      ph_level: (6.0 + Math.random() * 2.5).toFixed(1), // 6.0 - 8.5
      organic_matter: (1.5 + Math.random() * 3.5).toFixed(1), // 1.5% - 5.0%
      nitrogen_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      phosphorus_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      potassium_level: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      moisture_content: (10 + Math.random() * 20).toFixed(1), // 10% - 30%
      drainage: ['good', 'moderate', 'poor'][Math.floor(Math.random() * 3)],
      confidence: 0.82,
      analysis_method: 'ml_image_classification'
    };
  }

  /**
   * Generate mock crop recommendations
   */
  getMockCropRecommendations(weatherData) {
    const cropDatabase = {
      warm_weather: {
        crops: ['rice', 'cotton', 'sugarcane', 'maize', 'sorghum'],
        season: 'kharif'
      },
      moderate_weather: {
        crops: ['wheat', 'barley', 'mustard', 'gram', 'peas'],
        season: 'rabi'
      },
      cool_weather: {
        crops: ['potato', 'cauliflower', 'cabbage', 'carrot', 'spinach'],
        season: 'winter'
      }
    };

    let selectedCategory = 'moderate_weather';
    if (weatherData?.temperature > 30) selectedCategory = 'warm_weather';
    if (weatherData?.temperature < 20) selectedCategory = 'cool_weather';

    const categoryData = cropDatabase[selectedCategory];
    const recommendedCrops = categoryData.crops.slice(0, 3);

    return recommendedCrops.map((crop, index) => ({
      crop_name: crop,
      suitability_score: (0.85 - index * 0.1).toFixed(2),
      expected_yield: `${20 + Math.random() * 30}% above average`,
      growing_period: `${90 + Math.random() * 60} days`,
      water_requirement: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      market_price_trend: ['rising', 'stable', 'declining'][Math.floor(Math.random() * 3)],
      season: categoryData.season,
      benefits: this.getCropBenefits(crop),
      challenges: this.getCropChallenges(crop),
      investment_required: this.getInvestmentLevel(crop)
    }));
  }

  /**
   * Generate farming tips based on conditions
   */
  getMockFarmingTips(weatherData) {
    const tips = [
      {
        category: 'irrigation',
        title: 'Smart Irrigation',
        description: 'Based on current weather conditions and soil moisture',
        recommendation: weatherData?.rainfall < 2 ? 
          'Increase irrigation frequency due to low rainfall' : 
          'Monitor soil moisture, reduce irrigation if needed'
      },
      {
        category: 'fertilizer',
        title: 'Nutrient Management',
        description: 'Optimal fertilizer application timing',
        recommendation: 'Apply nitrogen fertilizer in split doses for better absorption'
      },
      {
        category: 'pest_control',
        title: 'Pest Management',
        description: 'Weather-based pest risk assessment',
        recommendation: weatherData?.humidity > 70 ? 
          'Monitor for fungal diseases due to high humidity' : 
          'Regular pest scouting recommended'
      },
      {
        category: 'timing',
        title: 'Planting Schedule',
        description: 'Optimal timing based on weather forecast',
        recommendation: 'Current conditions are favorable for planting'
      }
    ];

    return tips;
  }

  /**
   * Get crop-specific benefits
   */
  getCropBenefits(crop) {
    const benefits = {
      rice: ['High market demand', 'Water efficient varieties available', 'Good storage life'],
      wheat: ['Stable market price', 'Multiple varieties', 'Good processing value'],
      cotton: ['Export potential', 'High profit margins', 'Industrial demand'],
      maize: ['Versatile use', 'Good fodder value', 'Drought tolerant varieties'],
      sugarcane: ['Continuous harvesting', 'High biomass', 'Multiple products']
    };
    
    return benefits[crop] || ['Suitable for local conditions', 'Good nutritional value', 'Market availability'];
  }

  /**
   * Get crop-specific challenges
   */
  getCropChallenges(crop) {
    const challenges = {
      rice: ['Water intensive', 'Pest susceptibility', 'Labor intensive'],
      wheat: ['Storage issues', 'Price volatility', 'Disease management'],
      cotton: ['Pest management', 'Input costs', 'Quality requirements'],
      maize: ['Storage pests', 'Market fluctuations', 'Weather dependency'],
      sugarcane: ['Processing dependency', 'Transport costs', 'Long crop cycle']
    };
    
    return challenges[crop] || ['Market risks', 'Weather dependency', 'Input costs'];
  }

  /**
   * Get investment level for crops
   */
  getInvestmentLevel(crop) {
    const investments = {
      rice: 'medium',
      wheat: 'low',
      cotton: 'high',
      maize: 'medium',
      sugarcane: 'high'
    };
    
    return investments[crop] || 'medium';
  }

  /**
   * Generate contextual follow-up questions
   */
  generateFollowUpQuestions(advisory) {
    const questions = [
      `What fertilizer is best for ${advisory.soil.soil_type} soil?`,
      `How often should I water ${advisory.crop_recommendations[0]?.crop_name}?`,
      `What are the common diseases in ${advisory.crop_recommendations[0]?.crop_name}?`,
      `When is the best time to harvest?`,
      `What crop should I grow after ${advisory.crop_recommendations[0]?.crop_name}?`,
      `How to improve soil health for better yield?`,
      `What are the market trends for ${advisory.crop_recommendations[0]?.crop_name}?`
    ];

    // Return 3-4 random questions
    return questions.sort(() => 0.5 - Math.random()).slice(0, 4);
  }

  /**
   * Get fallback advisory when API fails
   */
  getFallbackAdvisory(location, errorMessage) {
    return {
      success: false,
      error: errorMessage,
      fallback_advisory: {
        message: 'Unable to analyze soil image, but here are general recommendations based on your location',
        general_recommendations: [
          'Test your soil pH and nutrient levels',
          'Choose crops suitable for your local climate',
          'Consult with local agricultural experts',
          'Consider weather patterns for planting decisions'
        ],
        suggested_action: 'Please try again or contact agricultural support'
      },
      timestamp: new Date().toISOString(),
      isDemoMode: true
    };
  }

  /**
   * Process follow-up questions about farming
   * @param {string} question 
   * @param {Object} context - Previous advisory context
   * @returns {Promise<Object>}
   */
  async askFollowUpQuestion(question, context = {}) {
    try {
      console.log('🤔 Processing follow-up question...');
      
      // Try Python ML backend first
      try {
        const response = await fetch(`${this.API_BASE_URL}/crop-follow-up`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question: question,
            context: context
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Python backend follow-up response received');
          return {
            success: true,
            question,
            answer: data.answer,
            confidence: data.confidence || 0.85,
            timestamp: new Date().toISOString(),
            isDemoMode: data.isDemoMode || false
          };
        }
      } catch (apiError) {
        console.log('⚠️ Python backend not available for follow-up, using fallback');
      }

      // Fallback to rule-based responses
      const response = this.generateFollowUpResponse(question, context);
      
      return {
        success: true,
        question,
        answer: response,
        confidence: 0.8,
        timestamp: new Date().toISOString(),
        isDemoMode: true
      };

    } catch (error) {
      console.error('❌ Follow-up question error:', error);
      
      return {
        success: false,
        error: error.message,
        fallback_response: 'I\'m sorry, I couldn\'t process your question. Please try rephrasing or contact an agricultural expert.',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate rule-based responses for follow-up questions
   */
  generateFollowUpResponse(question, context) {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('fertilizer')) {
      return {
        type: 'fertilizer_advice',
        content: `For ${context.soil?.soil_type || 'your'} soil, I recommend:\n\n• NPK ratio based on soil test results\n• Organic compost to improve soil structure\n• Micronutrients if deficient\n• Apply in split doses for better absorption\n\nAlways conduct a soil test for precise recommendations.`
      };
    }
    
    if (questionLower.includes('water') || questionLower.includes('irrigat')) {
      return {
        type: 'irrigation_advice',
        content: `Watering schedule for ${context.crop_recommendations?.[0]?.crop_name || 'your crop'}:\n\n• Check soil moisture at 6-inch depth\n• Water when top 2-3 inches are dry\n• Deep, less frequent watering is better\n• Adjust based on weather conditions\n• Consider drip irrigation for efficiency`
      };
    }
    
    if (questionLower.includes('disease') || questionLower.includes('pest')) {
      return {
        type: 'pest_disease_advice',
        content: `Common issues and prevention:\n\n• Regular field monitoring\n• Use resistant varieties when available\n• Proper spacing for air circulation\n• Integrated Pest Management (IPM)\n• Avoid overhead watering to reduce fungal issues\n• Consult local extension services for specific treatments`
      };
    }
    
    if (questionLower.includes('harvest')) {
      return {
        type: 'harvest_advice',
        content: `Harvest timing indicators:\n\n• Monitor crop maturity signs\n• Check grain moisture content\n• Weather conditions for harvest\n• Market prices and demand\n• Storage preparation\n• Post-harvest handling best practices`
      };
    }
    
    if (questionLower.includes('market') || questionLower.includes('price')) {
      return {
        type: 'market_advice',
        content: `Market considerations:\n\n• Check local mandi prices regularly\n• Consider contract farming options\n• Storage vs immediate sale decisions\n• Quality parameters affecting price\n• Transportation and marketing costs\n• Seasonal price variations`
      };
    }
    
    // Default response
    return {
      type: 'general_advice',
      content: `Based on your query about "${question}", here are some general recommendations:\n\n• Consult with local agricultural experts\n• Consider your specific soil and climate conditions\n• Follow recommended agricultural practices\n• Keep records of your farming activities\n• Stay updated with latest farming techniques`
    };
  }
}

export default new CropAdvisoryService();
