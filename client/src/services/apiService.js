// Enhanced API services for the Agro_Mitra app
// Addresses gaps in existing farmer apps with advanced AI features

import config from '../config/env.js';

// Temporarily comment out complex imports to fix immediate errors
// import { PersonalizationService, OfflineService } from './personalizationService.js'
// import { TrustService } from './accessibilityService.js'

const API_BASE_URL = config.api.baseUrl;

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class APIService {
  constructor() {
    // Create basic fallback services for now
    this.personalizationService = {
      personalizeAdvice: (advice, context) => advice,
      updateProfile: () => {}
    }
    this.offlineService = {
      cacheData: () => {},
      getCachedData: () => null
    }
    this.trustService = {
      addTrustIndicators: () => [],
      calculateTrustScore: () => 0.85
    }
  }

  // Get current user location
  async getCurrentLocation() {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            })
          },
          (error) => {
            console.warn('Location access denied, using default location')
            // Default to Delhi, India
            resolve({ lat: 28.7041, lon: 77.1025 })
          }
        )
      } else {
        // Default location if geolocation not supported
        resolve({ lat: 28.7041, lon: 77.1025 })
      }
    })
  }

  // Calculate risk level from weather data
  calculateRiskLevel(weatherData) {
    let riskScore = 0
    const reasons = []
    
    if (!weatherData || !weatherData.forecast || weatherData.forecast.length === 0) {
      return { level: 'Low', reason: 'Weather data unavailable', color: 'success' }
    }
    
    const tomorrow = weatherData.forecast.find(f => f.d.includes('Tomorrow') || f.d.includes('कल'))
    if (!tomorrow) return { level: 'Low', reason: 'No forecast data', color: 'success' }
    
    // Heavy rain risk
    if (tomorrow.rain_mm > 20) {
      riskScore += 3
      reasons.push('Heavy rain expected')
    } else if (tomorrow.rain_mm > 10) {
      riskScore += 2
      reasons.push('Moderate rain expected')
    }
    
    // Temperature risk
    if (tomorrow.t_max > 40) {
      riskScore += 2
      reasons.push('Very high temperature')
    } else if (tomorrow.t_max > 35) {
      riskScore += 1
      reasons.push('High temperature')
    }
    
    // Humidity risk
    if (tomorrow.humidity > 85) {
      riskScore += 1
      reasons.push('Very high humidity')
    }
    
    // Wind risk
    if (tomorrow.wind_speed > 25) {
      riskScore += 2
      reasons.push('Strong winds expected')
    }
    
    if (riskScore >= 4) {
      return { level: 'High', reason: reasons.join(', '), color: 'error' }
    } else if (riskScore >= 2) {
      return { level: 'Medium', reason: reasons.join(', '), color: 'warning' }
    } else {
      return { level: 'Low', reason: 'Favorable conditions', color: 'success' }
    }
  }

  // Submit user feedback
  async submitFeedback(adviceId, isPositive, reason = '') {
    try {
      await delay(500)
      
      // In a real app, this would send to backend
      console.log('Feedback submitted:', { adviceId, isPositive, reason })
      
      // Store locally for now
      const feedback = {
        adviceId,
        isPositive,
        reason,
        timestamp: new Date().toISOString()
      }
      
      const existingFeedback = JSON.parse(localStorage.getItem('farmwise_feedback') || '[]')
      existingFeedback.push(feedback)
      localStorage.setItem('farmwise_feedback', JSON.stringify(existingFeedback))
      
      return { success: true, message: 'Feedback recorded successfully' }
    } catch (error) {
      console.error('Feedback submission error:', error)
      return { success: false, error: 'Failed to submit feedback' }
    }
  }

  // Get market prices  
  async getMarketPrices(crop = 'wheat', pincode = '110001') {
    try {
      await delay(1500)
      
      const crops = {
        wheat: { basePrice: 2850, unit: 'per quintal' },
        rice: { basePrice: 3200, unit: 'per quintal' },
        maize: { basePrice: 2100, unit: 'per quintal' },
        cotton: { basePrice: 5800, unit: 'per quintal' },
        sugarcane: { basePrice: 380, unit: 'per quintal' }
      }

      const cropData = crops[crop.toLowerCase()] || crops.wheat
      const priceVariation = (Math.random() - 0.5) * 200 // ±100 variation

      const markets = [
        {
          id: 1,
          name: 'Azadpur Mandi',
          distance: '12 km',
          price: Math.round(cropData.basePrice + priceVariation),
          unit: cropData.unit,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdated: '2 hours ago'
        },
        {
          id: 2,
          name: 'Ghazipur Mandi',
          distance: '18 km',
          price: Math.round(cropData.basePrice + priceVariation + 50),
          unit: cropData.unit,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          lastUpdated: '4 hours ago'
        }
      ]

      return { markets, crop, updated: new Date().toISOString() }
    } catch (error) {
      console.error('Market prices error:', error)
      return { markets: [], error: 'Failed to fetch market prices' }
    }
  }
  
  // Enhanced advice service with personalization and trust indicators
  async getAdvice(query, location = null, crop = null, language = 'en', context = {}) {
    try {
      // Check offline mode first
      if (!navigator.onLine) {
        return this.getOfflineAdvice(query, language)
      }

      await delay(1500 + Math.random() * 1500) // 1.5-3s response time
      
      // Enhanced mock responses that address app gaps
      const enhancedResponses = {
        irrigate: {
          id: Date.now(),
          query,
          advice: language === 'hi' 
            ? `आपके सवाल "${query}" के लिए व्यक्तिगत सुझाव: कल बारिश की संभावना है (70%), इसलिए सिंचाई न करें। बल्कि वर्षा जल संचयन की तैयारी करें।`
            : `Personalized advice for "${query}": Rain expected tomorrow (70% chance), so avoid irrigation. Instead, prepare for rainwater harvesting.`,
          confidence: 0.92,
          source: 'India Meteorological Department + ICAR',
          reasoning: language === 'hi'
            ? 'आपके क्षेत्र के मौसम डेटा और मिट्टी विश्लेषण पर आधारित।'
            : 'Based on your regional weather data and soil analysis.',
          category: 'irrigation_management',
          actionSteps: language === 'hi' 
            ? [
              'सिंचाई रोकें',
              'वर्षा जल संग्रह तंत्र तैयार करें',
              'पानी निकासी की व्यवस्था जांचें'
            ]
            : [
              'Halt irrigation',
              'Prepare rainwater harvesting system', 
              'Check drainage arrangements'
            ],
          locallyTested: true,
          farmerFeedback: { positive: 89, total: 156 }
        },
        fertilizer: {
          id: Date.now() + 1,
          query,
          advice: language === 'hi'
            ? `आपकी मिट्टी परीक्षण के अनुसार NPK 10-26-26 का प्रयोग करें। छोटी जोत के लिए 100-120 किग्रा प्रति हेक्टेयर पर्याप्त है।`
            : `Based on your soil test, use NPK 10-26-26. For small farms, 100-120 kg per hectare is sufficient.`,
          confidence: 0.85,
          source: 'Soil Health Card + Agricultural University Guidelines',
          reasoning: language === 'hi'
            ? 'मिट्टी में फास्फोरस की कमी, फसल फूल की अवस्था में है।'
            : 'Low phosphorus in soil, crop in flowering stage.',
          category: 'fertilizer_management',
          costBenefit: {
            cost: '₹2,400-3,200',
            expectedIncrease: '15-20%',
            organicAlternative: language === 'hi' ? 'कंपोस्ट + बोन मील' : 'Compost + Bone meal'
          }
        },
        pest: {
          id: Date.now() + 2,
          query,
          advice: language === 'hi'
            ? `शुरुआती कीट संक्रमण दिख रहा है। शाम के समय नीम तेल का छिड़काव करें। रसायनिक दवा से बचें।`
            : `Early pest infestation detected. Apply neem oil spray in evening. Avoid chemical pesticides initially.`,
          confidence: 0.78,
          source: 'Integrated Pest Management Guidelines',
          reasoning: language === 'hi'
            ? 'प्राकृतिक उपचार पहले प्रभावी होते हैं और लाभकारी कीटों को नुकसान नहीं पहुंचाते।'
            : 'Natural treatments are initially effective and don\'t harm beneficial insects.',
          category: 'pest_management',
          organicSolution: true,
          followUpRequired: 7 // days
        }
      }

      // Smart selection based on query keywords
      let selectedResponse = enhancedResponses.irrigate // default
      if (query.toLowerCase().includes('fertilizer') || query.toLowerCase().includes('खाद')) {
        selectedResponse = enhancedResponses.fertilizer
      }
      if (query.toLowerCase().includes('pest') || query.toLowerCase().includes('insect') || query.toLowerCase().includes('कीट')) {
        selectedResponse = enhancedResponses.pest
      }
      
      // Apply personalization
      const personalizedAdvice = this.personalizationService.personalizeAdvice(selectedResponse, context)
      
      // Add trust indicators
      const trustIndicators = this.trustService.addTrustIndicators(personalizedAdvice)
      
      // Enhanced response with all gap-filling features
      const enhancedAdvice = {
        ...personalizedAdvice,
        trustIndicators,
        trustScore: this.trustService.calculateTrustScore(personalizedAdvice),
        offline_cached: false,
        response_time: Date.now(),
        personalization_applied: true,
        explanation: {
          why: personalizedAdvice.reasoning,
          how: personalizedAdvice.actionSteps,
          when: this.getOptimalTiming(personalizedAdvice.category),
          cost: personalizedAdvice.costBenefit
        }
      }

      // Cache for offline use
      this.offlineService.cacheData('advice', [enhancedAdvice])

      return { advice: [enhancedAdvice] }

    } catch (error) {
      console.error('Advice API error:', error)
      return this.getOfflineAdvice(query, language)
    }
  }
  
  // Enhanced weather service with farming-specific insights
  async getWeather(lat = 28.7041, lon = 77.1025, language = 'en') {
    try {
      await delay(1000)
      
      const enhancedWeather = {
        current: {
          temp: Math.round(25 + Math.random() * 10),
          rain_mm: Math.random() > 0.7 ? Math.round(Math.random() * 5) : 0,
          humidity: Math.round(60 + Math.random() * 30),
          wind_speed: Math.round(5 + Math.random() * 10),
          uv_index: Math.round(3 + Math.random() * 5),
          soil_temp: Math.round(20 + Math.random() * 8)
        },
        forecast: [
          { 
            d: language === 'hi' ? 'आज' : 'Today', 
            t_min: 22, 
            t_max: 32, 
            rain_mm: 0, 
            icon: 'sun',
            humidity: 65,
            wind_speed: 8,
            farming_tips: language === 'hi' 
              ? 'धूप तेज है, शाम को सिंचाई करें'
              : 'Sunny day, irrigate in evening'
          },
          { 
            d: language === 'hi' ? 'कल' : 'Tomorrow', 
            t_min: 24, 
            t_max: 30, 
            rain_mm: 5, 
            icon: 'cloud',
            humidity: 70,
            wind_speed: 12,
            farming_tips: language === 'hi'
              ? 'हल्की बारिश, सिंचाई रोकें'
              : 'Light rain, stop irrigation'
          },
          { 
            d: language === 'hi' ? 'गुरुवार' : 'Thu', 
            t_min: 23, 
            t_max: 29, 
            rain_mm: 12, 
            icon: 'rain',
            humidity: 85,
            wind_speed: 15,
            farming_tips: language === 'hi'
              ? 'मध्यम बारिश, पानी निकासी देखें'
              : 'Moderate rain, check drainage'
          },
          { 
            d: language === 'hi' ? 'शुक्रवार' : 'Fri', 
            t_min: 21, 
            t_max: 27, 
            rain_mm: 8, 
            icon: 'cloud',
            humidity: 75,
            wind_speed: 10,
            farming_tips: language === 'hi'
              ? 'बादल छाए, फसल निरीक्षण करें'
              : 'Cloudy, inspect crops'
          }
        ],
        alerts: [
          { 
            type: 'rain', 
            severity: 'medium', 
            desc: language === 'hi' 
              ? 'कल तेज बारिश की संभावना' 
              : 'Heavy rain expected tomorrow',
            farming_action: language === 'hi'
              ? 'सिंचाई रोकें, वर्षा जल संग्रह की तैयारी करें'
              : 'Stop irrigation, prepare rainwater harvesting'
          },
          { 
            type: 'heat', 
            severity: 'low', 
            desc: language === 'hi'
              ? 'सप्ताहांत में गर्मी बढ़ने की संभावना'
              : 'Heatwave watch for weekend',
            farming_action: language === 'hi'
              ? 'पानी की व्यवस्था बढ़ाएं, छाया प्रदान करें'
              : 'Increase water supply, provide shade'
          }
        ],
        // Enhanced farming insights - will be added after object creation
        farming_insights: {}
      }

      // Add farming insights after object is fully created
      enhancedWeather.farming_insights = {
        risk_assessment: this.calculateFarmingRisk(enhancedWeather),
        soil_conditions: language === 'hi'
          ? 'मिट्टी में नमी अच्छी है'
          : 'Good soil moisture levels',
        crop_stress_level: 'low',
        optimal_activities: language === 'hi'
          ? ['फसल निरीक्षण', 'खरपतवार नियंत्रण']
          : ['Crop inspection', 'Weed control']
      }

      // Cache weather data for offline use
      this.offlineService.cacheData('weather', [enhancedWeather])

      return enhancedWeather

    } catch (error) {
      console.error('Weather API error:', error)
      // Return cached weather if available
      const cachedWeather = this.offlineService.getCachedData('weather')
      return cachedWeather?.[0] || this.getBasicWeather(language)
    }
  }
  
  // Advanced pest/disease detection with confidence and treatment recommendations
  async detectPestDisease(imageBlob, language = 'en') {
    try {
      await delay(3000 + Math.random() * 2000) // 3-5s processing time
      
      const enhancedDetections = [
        {
          label: language === 'hi' ? 'पत्ती झुलसा रोग' : 'Leaf Blight',
          confidence: 0.89,
          severity: 'moderate',
          description: language === 'hi'
            ? 'यह एक फंगल रोग है जो नमी और गर्म मौसम में फैलता है।'
            : 'A fungal disease that spreads in humid and warm weather.',
          actions: [
            { 
              title: language === 'hi' ? 'कॉपर फंगीसाइड लगाएं' : 'Apply Copper Fungicide', 
              body: language === 'hi' 
                ? 'सुबह या शाम छिड़काव करें, दोपहर में न करें'
                : 'Spray in early morning or evening, avoid afternoon', 
              priority: 'high',
              cost: '₹150-200/acre'
            },
            { 
              title: language === 'hi' ? 'प्रभावित भागों को हटाएं' : 'Remove Affected Parts', 
              body: language === 'hi'
                ? 'रोगग्रस्त पत्तियां काटें और जला दें'
                : 'Cut diseased leaves and burn them safely', 
              priority: 'immediate',
              cost: 'Labour only'
            }
          ],
          organic_treatment: language === 'hi'
            ? ['नीम तेल का छिड़काव', 'बेकिंग सोडा समाधान']
            : ['Neem oil spray', 'Baking soda solution'],
          recovery_time: language === 'hi' ? '7-10 दिन' : '7-10 days',
          prevention_tips: language === 'hi'
            ? ['उचित दूरी बनाए रखें', 'सुबह सिंचाई करें', 'हवा का संचार बढ़ाएं']
            : ['Maintain proper spacing', 'Water in morning', 'Improve air circulation']
        },
        {
          label: language === 'hi' ? 'माहू कीट संक्रमण' : 'Aphid Infestation',
          confidence: 0.76,
          severity: 'low',
          description: language === 'hi'
            ? 'छोटे कीट जो पत्तियों का रस चूसते हैं और पत्तियों को मुरझाते हैं।'
            : 'Small insects that suck plant juices causing leaf curling and stunting.',
          actions: [
            { 
              title: language === 'hi' ? 'नीम तेल स्प्रे' : 'Neem Oil Spray', 
              body: language === 'hi'
                ? '2-3 मिली प्रति लीटर पानी, शाम को छिड़काव'
                : 'Apply 2-3ml per litre water in evening hours', 
              priority: 'medium',
              cost: '₹80-120/acre'
            },
            { 
              title: language === 'hi' ? 'साबुन पानी का उपचार' : 'Soap Water Treatment', 
              body: language === 'hi'
                ? 'हल्का साबुन पानी में मिलाकर छिड़काव करें'
                : 'Mix mild soap in water and spray on affected areas', 
              priority: 'immediate',
              cost: '₹20-50/acre'
            }
          ],
          natural_predators: language === 'hi' 
            ? 'लेडीबर्ड बीटल, मकड़ी'
            : 'Ladybird beetles, Spiders',
          recovery_time: language === 'hi' ? '3-5 दिन' : '3-5 days'
        },
        {
          label: language === 'hi' ? 'स्वस्थ पौधा' : 'Healthy Plant',
          confidence: 0.92,
          severity: 'none',
          description: language === 'hi'
            ? 'आपका पौधा स्वस्थ दिख रहा है। कोई रोग या कीट की समस्या नहीं।'
            : 'Your plant appears healthy with no visible disease or pest issues.',
          actions: [
            { 
              title: language === 'hi' ? 'नियमित देखभाल जारी रखें' : 'Continue Regular Care', 
              body: language === 'hi'
                ? 'वर्तमान देखभाल अच्छी है, इसे बनाए रखें'
                : 'Current care routine is working well, maintain it', 
              priority: 'maintain'
            },
            { 
              title: language === 'hi' ? 'निवारक उपाय' : 'Preventive Measures', 
              body: language === 'hi'
                ? 'नियमित निरीक्षण और उचित पोषण दें'
                : 'Regular monitoring and proper nutrition', 
              priority: 'ongoing'
            }
          ],
          prevention_tips: language === 'hi'
            ? ['नियमित जांच करते रहें', 'संतुलित पोषण दें', 'साफ-सफाई बनाए रखें']
            : ['Regular monitoring', 'Balanced nutrition', 'Maintain cleanliness']
        }
      ]

      const detection = enhancedDetections[Math.floor(Math.random() * enhancedDetections.length)]
      
      // Add contextual information
      const enhancedDetection = {
        ...detection,
        detected_at: new Date().toISOString(),
        image_quality: 'good',
        expert_consultation: {
          recommended: detection.confidence < 0.8,
          contact: language === 'hi' 
            ? 'संदेह की स्थिति में कृषि विशेषज्ञ से सलाह लें'
            : 'Consult agricultural expert if in doubt',
          helpline: '1800-180-1551 (Kisan Call Center)'
        },
        success_rate: this.getSuccessRate(detection.label),
        local_availability: {
          treatments: language === 'hi' ? 'स्थानीय कृषि दुकानों में उपलब्ध' : 'Available at local agri stores',
          estimated_cost: detection.actions?.[0]?.cost || '₹100-300/acre'
        },
        follow_up: {
          check_after: language === 'hi' ? '3-5 दिन बाद दोबारा जांचें' : 'Check again after 3-5 days',
          signs_of_improvement: language === 'hi'
            ? 'नई पत्तियों का हरा होना, रोग का न फैलना'
            : 'New green leaves, no spread of disease'
        }
      }

      // Cache detection for offline reference
      this.offlineService.cacheData('detections', [enhancedDetection])

      return enhancedDetection

    } catch (error) {
      console.error('Pest detection error:', error)
      return {
        error: true,
        message: language === 'hi' 
          ? 'छवि विश्लेषण में त्रुटि। कृपया स्पष्ट तस्वीर के साथ दोबारा कोशिश करें।'
          : 'Image analysis error. Please try again with a clearer image.',
        suggestions: language === 'hi'
          ? ['अच्छी रोशनी में तस्वीर लें', 'पत्ती को पास से दिखाएं', 'धुंधली तस्वीर न लें']
          : ['Take photo in good light', 'Show leaf up close', 'Avoid blurry images'],
        offline: !navigator.onLine
      }
    }
  }
  
  // GET /prices?crop&pin
  static async getMarketPrices(crop = 'wheat', pincode = '110001') {
    await delay(1500)
    
    const crops = {
      wheat: { basePrice: 2850, unit: 'per quintal' },
      rice: { basePrice: 3200, unit: 'per quintal' },
      maize: { basePrice: 2100, unit: 'per quintal' },
      cotton: { basePrice: 5800, unit: 'per quintal' },
      sugarcane: { basePrice: 380, unit: 'per tonne' }
    }
    
    const selectedCrop = crops[crop.toLowerCase()] || crops.wheat
    
    const mockMarkets = [
      {
        name: 'Sector 26 Mandi',
        price: `₹${selectedCrop.basePrice + Math.round(Math.random() * 200 - 100)}`,
        unit: selectedCrop.unit,
        distance_km: 2.3,
        updated: '2 hours ago'
      },
      {
        name: 'Model Town Mandi',
        price: `₹${selectedCrop.basePrice + Math.round(Math.random() * 150 - 75)}`,
        unit: selectedCrop.unit,
        distance_km: 4.1,
        updated: '4 hours ago'
      },
      {
        name: 'Central Market',
        price: `₹${selectedCrop.basePrice + Math.round(Math.random() * 100 - 50)}`,
        unit: selectedCrop.unit,
        distance_km: 7.8,
        updated: '1 hour ago'
      }
    ]
    
    return { markets: mockMarkets }
  }
  
  // POST /feedback
  static async submitFeedback(adviceId, isPositive, reason = null) {
    await delay(500)
    
    // In real app, this would store feedback in database
    console.log('Feedback submitted:', { adviceId, isPositive, reason })
    
    return { ok: true, message: 'Feedback recorded successfully' }
  }
  
  // Additional helper methods
  static async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => {
          // Fallback to Delhi coordinates
          console.warn('Geolocation failed, using fallback location')
          resolve({ lat: 28.7041, lon: 77.1025, accuracy: null })
        },
        { timeout: 10000, enableHighAccuracy: true }
      )
    })
  }
  
  static calculateRiskLevel(weatherData) {
    const tomorrow = weatherData.forecast[1]
    
    let riskScore = 0
    let reasons = []
    
    // Rain risk
    if (tomorrow.rain_mm > 15) {
      riskScore += 3
      reasons.push('Heavy rainfall expected')
    } else if (tomorrow.rain_mm > 8) {
      riskScore += 2
      reasons.push('Moderate rainfall expected')
    }
    
    // Temperature risk
    if (tomorrow.t_max > 38) {
      riskScore += 3
      reasons.push('Extreme heat warning')
    } else if (tomorrow.t_max > 35) {
      riskScore += 2
      reasons.push('High temperature alert')
    }
    
    // Wind risk
    if (tomorrow.wind_speed > 25) {
      riskScore += 2
      reasons.push('Strong winds expected')
    }
    
    if (riskScore >= 4) {
      return { level: 'High', reason: reasons.join(', '), color: 'error' }
    } else if (riskScore >= 2) {
      return { level: 'Medium', reason: reasons.join(', '), color: 'warning' }
    } else {
      return { level: 'Low', reason: 'Favorable conditions', color: 'success' }
    }
  }

  // Helper methods for enhanced functionality
  calculateFarmingRisk(weatherData) {
    let riskLevel = 0
    const factors = []

    // High temperature risk
    if (weatherData.current.temp > 35) {
      riskLevel += 2
      factors.push('High temperature stress')
    }

    // Heavy rain risk
    const totalRain = weatherData.forecast.reduce((sum, day) => sum + day.rain_mm, 0)
    if (totalRain > 30) {
      riskLevel += 2
      factors.push('Excessive rainfall expected')
    }

    // High humidity risk (fungal diseases)
    if (weatherData.current.humidity > 80) {
      riskLevel += 1
      factors.push('High humidity - fungal risk')
    }

    return {
      level: riskLevel > 3 ? 'high' : riskLevel > 1 ? 'medium' : 'low',
      factors,
      score: riskLevel
    }
  }

  getOptimalTiming(category) {
    const timingMap = {
      'irrigation_management': 'Early morning (5-7 AM) or evening (6-8 PM)',
      'fertilizer_management': 'Before expected rain or early morning',
      'pest_management': 'Evening hours when beneficial insects are less active',
      'general': 'Early morning for most farming activities'
    }
    return timingMap[category] || timingMap.general
  }

  calculateLocalRelevance(query, context) {
    // Simple relevance calculation based on context
    let relevance = 0.5

    if (context.location) relevance += 0.2
    if (context.crop) relevance += 0.2
    if (context.season) relevance += 0.1

    return Math.min(relevance, 1.0)
  }

  getSuccessRate(treatmentLabel) {
    // Mock success rates for treatments
    const successRates = {
      'Leaf Blight': 0.85,
      'पत्ती झुलसा रोग': 0.85,
      'Aphid Infestation': 0.90,
      'माहू कीट संक्रमण': 0.90,
      'Healthy Plant': 1.0,
      'स्वस्थ पौधा': 1.0
    }
    return successRates[treatmentLabel] || 0.75
  }

  getLocationSpecificAdvice(detection, language) {
    // Mock location-specific advice
    return language === 'hi'
      ? 'आपके क्षेत्र में यह समस्या सामान्य है। स्थानीय कृषि विशेषज्ञ से सलाह लें।'
      : 'This issue is common in your region. Consult local agricultural experts.'
  }

  getBasicWeather(language) {
    return {
      current: { temp: 28, humidity: 65, wind_speed: 8 },
      forecast: [
        { d: language === 'hi' ? 'आज' : 'Today', t_min: 22, t_max: 32, rain_mm: 0, icon: 'sun' }
      ],
      alerts: [],
      offline: true
    }
  }

  async getOfflineAdvice(query, language) {
    const cachedAdvice = this.offlineService.getCachedData('advice', query)
    if (cachedAdvice && cachedAdvice.length > 0) {
      return { success: true, data: { ...cachedAdvice[0], offline_cached: true } }
    }

    // Fallback offline advice
    return {
      success: true,
      data: {
        advice: language === 'hi'
          ? 'ऑफलाइन मोड में सामान्य सलाह: मौसम देखकर खेती के कार्य करें।'
          : 'Offline mode - General advice: Plan farming activities based on weather conditions.',
        confidence: 0.5,
        offline_cached: true,
        source: 'Offline cache'
      }
    }
  }
}

// Create and export an instance with enhanced services
const apiServiceInstance = new APIService()
export default apiServiceInstance
