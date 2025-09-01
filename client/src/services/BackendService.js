// Mock API Service for data fetching
import config from '../config/env.js';

class BackendService {
  constructor() {
    this.baseUrl = config.api.baseUrl // Use config instead of hardcoded URL
    this.mockData = {
      marketPrices: this.generateMockMarketData(),
      weatherData: this.generateMockWeatherData(),
      cropCalendar: this.generateMockCropCalendar(),
      pestDatabase: this.generateMockPestData(),
      soilAnalysis: this.generateMockSoilData()
    }
  }

  // Market Prices API
  async getMarketPrices(filters = {}) {
    // Simulate API delay
    await this.delay(1000)
    
    let data = this.mockData.marketPrices
    
    // Apply filters
    if (filters.location) {
      data = data.filter(item => 
        item.market.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.crop) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(filters.crop.toLowerCase())
      )
    }
    
    if (filters.category && filters.category !== 'all') {
      data = data.filter(item => item.category === filters.category)
    }
    
    return {
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    }
  }

  // Weather API
  async getWeatherData(location = 'Delhi') {
    await this.delay(800)
    
    const weatherData = this.mockData.weatherData
    return {
      success: true,
      data: weatherData,
      location: location
    }
  }

  // Crop Calendar API
  async getCropCalendar(crop, region) {
    await this.delay(600)
    
    const calendar = this.mockData.cropCalendar[crop]
    if (!calendar) {
      return {
        success: false,
        message: 'Crop data not found'
      }
    }
    
    return {
      success: true,
      data: calendar,
      region: region
    }
  }

  // Pest Analysis API
  async analyzePestImage(imageData) {
    await this.delay(2000) // Simulate AI processing time
    
    const pestData = this.mockData.pestDatabase
    const randomPest = pestData[Math.floor(Math.random() * pestData.length)]
    
    return {
      success: true,
      data: {
        ...randomPest,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        imageAnalyzed: true,
        timestamp: new Date().toISOString()
      }
    }
  }

  // Soil Analysis API
  async getSoilRecommendations(location, cropType) {
    await this.delay(1200)
    
    const soilData = this.mockData.soilAnalysis
    return {
      success: true,
      data: soilData,
      location: location,
      cropType: cropType
    }
  }

  // News and Updates API
  async getAgricultureNews(language = 'en') {
    await this.delay(500)
    
    const news = language === 'hi' ? [
      {
        id: 1,
        title: 'नई कृषि तकनीक से बढ़ी फसल की पैदावार',
        summary: 'आधुनिक तकनीक के उपयोग से किसानों की आय में 30% तक की वृद्धि',
        date: '2025-08-30',
        source: 'कृषि समाचार'
      },
      {
        id: 2,
        title: 'मौसम की जानकारी: आने वाले सप्ताह बारिश की संभावना',
        summary: 'उत्तर भारत में मानसून की वापसी, किसान रखें फसल का ध्यान',
        date: '2025-08-29',
        source: 'मौसम विभाग'
      }
    ] : [
      {
        id: 1,
        title: 'New Agricultural Technology Boosts Crop Yield',
        summary: 'Modern techniques help farmers increase income by up to 30%',
        date: '2025-08-30',
        source: 'Agriculture News'
      },
      {
        id: 2,
        title: 'Weather Update: Rain Expected Next Week',
        summary: 'Monsoon return to North India, farmers advised to protect crops',
        date: '2025-08-29',
        source: 'Weather Department'
      }
    ]
    
    return {
      success: true,
      data: news
    }
  }

  // Helper method to simulate API delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Mock data generators
  generateMockMarketData() {
    return [
      {
        id: 1,
        name: 'Wheat / गेहूं',
        category: 'cereals',
        currentPrice: 2100,
        previousPrice: 2050,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'Delhi Mandi / दिल्ली मंडी',
        trend: 'up',
        location: 'Delhi'
      },
      {
        id: 2,
        name: 'Rice / चावल',
        category: 'cereals',
        currentPrice: 3200,
        previousPrice: 3250,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'Punjab Mandi / पंजाब मंडी',
        trend: 'down',
        location: 'Punjab'
      },
      {
        id: 3,
        name: 'Potato / आलू',
        category: 'vegetables',
        currentPrice: 1200,
        previousPrice: 1150,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'UP Mandi / उत्तर प्रदेश मंडी',
        trend: 'up',
        location: 'UP'
      },
      {
        id: 4,
        name: 'Onion / प्याज',
        category: 'vegetables',
        currentPrice: 2800,
        previousPrice: 2900,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'Maharashtra Mandi / महाराष्ट्र मंडी',
        trend: 'down',
        location: 'Maharashtra'
      },
      {
        id: 5,
        name: 'Tomato / टमाटर',
        category: 'vegetables',
        currentPrice: 1800,
        previousPrice: 1700,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'Karnataka Mandi / कर्नाटक मंडी',
        trend: 'up',
        location: 'Karnataka'
      },
      {
        id: 6,
        name: 'Cotton / कपास',
        category: 'cash_crops',
        currentPrice: 5600,
        previousPrice: 5500,
        unit: 'per quintal / प्रति क्विंटल',
        market: 'Gujarat Mandi / गुजरात मंडी',
        trend: 'up',
        location: 'Gujarat'
      }
    ]
  }

  generateMockWeatherData() {
    return {
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: 'Partly Cloudy / आंशिक बादल',
        rainfall: 0
      },
      forecast: [
        { day: 'Today / आज', temp: 28, condition: 'sunny', rain: 0 },
        { day: 'Tomorrow / कल', temp: 30, condition: 'cloudy', rain: 10 },
        { day: 'Day 3', temp: 25, condition: 'rainy', rain: 70 },
        { day: 'Day 4', temp: 24, condition: 'rainy', rain: 60 },
        { day: 'Day 5', temp: 27, condition: 'sunny', rain: 0 }
      ]
    }
  }

  generateMockCropCalendar() {
    return {
      wheat: {
        name: 'Wheat / गेहूं',
        seasons: [
          {
            month: 'October-November / अक्टूबर-नवंबर',
            activity: 'Sowing / बुआई',
            description: 'Prepare field and sow seeds. Temperature should be 15-20°C. / खेत की तैयारी करें और बीज बोएं। तापमान 15-20°C होना चाहिए।',
            temperature: '15-20°C',
            rainfall: 'Low / कम'
          },
          {
            month: 'December-January / दिसंबर-जनवरी',
            activity: 'Growth Stage / विकास चरण',
            description: 'Regular irrigation and fertilizer application. Control weeds. / नियमित सिंचाई और उर्वरक डालें। खरपतवार नियंत्रण करें।',
            temperature: '10-15°C',
            rainfall: 'Low / कम'
          },
          {
            month: 'March-April / मार्च-अप्रैल',
            activity: 'Harvesting / कटाई',
            description: 'Harvest when crop is ready. Grains should be golden yellow. / फसल तैयार होने पर कटाई करें। दाने सुनहरे रंग के हों।',
            temperature: '20-25°C',
            rainfall: 'Low / कम'
          }
        ]
      },
      rice: {
        name: 'Rice / चावल',
        seasons: [
          {
            month: 'June-July / जून-जुलाई',
            activity: 'Transplanting / रोपाई',
            description: 'Transplant rice seedlings in flooded fields. / भरे हुए खेतों में चावल के पौधे रोपें।',
            temperature: '25-30°C',
            rainfall: 'High / अधिक'
          },
          {
            month: 'August-September / अगस्त-सितंबर',
            activity: 'Growth / विकास',
            description: 'Maintain water level and apply fertilizers. / पानी का स्तर बनाए रखें और उर्वरक डालें।',
            temperature: '25-30°C',
            rainfall: 'High / अधिक'
          },
          {
            month: 'October-November / अक्टूबर-नवंबर',
            activity: 'Harvesting / कटाई',
            description: 'Harvest when grains are mature and golden. / जब दाने पक जाएं और सुनहरे हों तो कटाई करें।',
            temperature: '20-25°C',
            rainfall: 'Medium / मध्यम'
          }
        ]
      }
    }
  }

  generateMockPestData() {
    return [
      {
        pest: 'Leaf Spot / पत्ती का धब्बा',
        severity: 'Moderate / मध्यम',
        treatment: 'Apply copper-based fungicide spray. Remove infected leaves. / कॉपर-आधारित फंजीसाइड का छिड़काव करें। संक्रमित पत्तियों को हटाएं।',
        prevention: 'Ensure good drainage and keep leaves dry. / अच्छी जल निकासी सुनिश्चित करें और पत्तियों को सूखा रखें।',
        type: 'fungal'
      },
      {
        pest: 'Aphids / माहू',
        severity: 'High / अधिक',
        treatment: 'Use neem oil spray or insecticidal soap. / नीम का तेल या कीटनाशक साबुन का छिड़काव करें।',
        prevention: 'Regular monitoring and beneficial insects. / नियमित निगरानी और लाभकारी कीटों का उपयोग।',
        type: 'insect'
      },
      {
        pest: 'Blight / अंगमारी',
        severity: 'High / अधिक',
        treatment: 'Apply systemic fungicide immediately. / तुरंत प्रणालीगत फंजीसाइड का प्रयोग करें।',
        prevention: 'Crop rotation and resistant varieties. / फसल चक्रण और प्रतिरोधी किस्में।',
        type: 'fungal'
      }
    ]
  }

  generateMockSoilData() {
    return {
      ph: 6.5,
      nitrogen: 'Medium / मध्यम',
      phosphorus: 'Low / कम',
      potassium: 'High / अधिक',
      organicMatter: 'Medium / मध्यम',
      recommendations: [
        'Add phosphorus-rich fertilizer / फॉस्फोरस युक्त उर्वरक डालें',
        'Maintain soil pH between 6.0-7.0 / मिट्टी का pH 6.0-7.0 के बीच रखें',
        'Add organic compost regularly / नियमित रूप से जैविक खाद डालें'
      ]
    }
  }
}

// Create singleton instance
const backendService = new BackendService()

export default backendService
