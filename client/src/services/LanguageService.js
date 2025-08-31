// Language Service for managing translations
class LanguageService {
  constructor() {
    this.currentLanguage = localStorage.getItem('farmwise_language') || 'en'
    this.translations = {
      en: {
        // Navigation
        home: 'Home',
        profile: 'Profile',
        dashboard: 'Dashboard',
        community: 'Community',
        quests: 'Quests',
        
        // Header
        appName: 'FarmWise',
        loading: 'Loading FarmWise...',
        
        // Weather
        weather: 'Weather',
        temperature: 'Temperature',
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        condition: 'Condition',
        
        // Quick Actions
        quickActions: 'Quick Actions',
        pestCheck: 'Pest Check',
        soilAdvice: 'Soil Advice',
        marketPrices: 'Market Prices',
        cropCalendar: 'Crop Calendar',
        myFields: 'My Fields',
        alerts: 'Alerts',
        
        // Advice Section
        farmingAdvice: 'Farming Advice',
        askQuestion: 'Ask your farming question...',
        getAdvice: 'Get Advice',
        gettingAdvice: 'Getting advice...',
        helpful: 'Helpful',
        notHelpful: 'Not Helpful',
        
        // Pest Detection
        pestDetection: 'Pest Detection',
        uploadImage: 'Upload Image',
        analyzing: 'Analyzing...',
        selectImage: 'Select image to analyze',
        
        // Market Prices
        enterLocation: 'Enter location',
        searchProducts: 'Search products...',
        search: 'Search',
        searching: 'Searching...',
        noResults: 'No results found',
        perQuintal: 'per quintal',
        
        // Profile
        contactInfo: 'Contact Information',
        phoneNumber: 'Phone Number',
        email: 'Email',
        location: 'Location',
        farmInfo: 'Farm Information',
        farmSize: 'Farm Size',
        experience: 'Experience',
        mainCrops: 'Main Crops',
        edit: 'Edit',
        save: 'Save',
        cancel: 'Cancel',
        
        // Stats
        adviceTaken: 'Advice Taken',
        pestChecks: 'Pest Checks',
        marketSearches: 'Market Searches',
        accuracy: 'Accuracy',
        
        // Common
        back: 'Back',
        close: 'Close',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        success: 'Success',
        loading: 'Loading...',
        tryAgain: 'Try Again',
        
        // Crop Calendar
        selectCrop: 'Select Crop',
        selectRegion: 'Select Region',
        generateCalendar: 'Generate Calendar',
        calendar: 'Calendar',
        sowing: 'Sowing',
        growth: 'Growth Stage',
        harvesting: 'Harvesting',
        rainfall: 'Rainfall',
        
        // Categories
        all: 'All',
        cereals: 'Cereals',
        vegetables: 'Vegetables',
        fruits: 'Fruits',
        pulses: 'Pulses',
        
        // Regions
        northIndia: 'North India',
        southIndia: 'South India',
        westIndia: 'West India',
        eastIndia: 'East India',
        
        // Crops
        wheat: 'Wheat',
        rice: 'Rice',
        cotton: 'Cotton',
        sugarcane: 'Sugarcane',
        potato: 'Potato',
        onion: 'Onion',
        tomato: 'Tomato',
        
        // Pest Analysis
        identifiedPest: 'Identified Pest/Disease:',
        confidence: 'Confidence:',
        severity: 'Severity:',
        treatment: 'Treatment:',
        prevention: 'Prevention:',
        analysisResults: 'Analysis Results',
        uploadPhoto: 'Upload Photo',
        analyzingImage: 'Analyzing image...',
        
        // Severity levels
        low: 'Low',
        medium: 'Medium',
        moderate: 'Moderate',
        high: 'High',
        
        // Trends
        up: 'Up',
        down: 'Down',
        
        // Time
        today: 'Today',
        tomorrow: 'Tomorrow',
        
        // Weather conditions
        sunny: 'Sunny',
        cloudy: 'Cloudy',
        rainy: 'Rainy',
        partlyCloudy: 'Partly Cloudy',
        
        // Messages
        uploadError: 'Error occurred while uploading image.',
        noDataAvailable: 'Data not available for this crop',
        selectCropAndRegion: 'Select Crop and Region',
        viewAndUpdate: 'View and update your information',
        uploadImageAnalysis: 'Upload image of your crop for analysis',
        currentPrices: 'Current agricultural commodity prices',
        timingSchedule: 'Timing schedule for crop cultivation'
      },
      
      hi: {
        // Navigation
        home: 'होम',
        profile: 'प्रोफाइल',
        dashboard: 'डैशबोर्ड',
        community: 'समुदाय',
        quests: 'क्वेस्ट',
        
        // Header
        appName: 'फार्मवाइज',
        loading: 'फार्मवाइज लोड हो रहा है...',
        
        // Weather
        weather: 'मौसम',
        temperature: 'तापमान',
        humidity: 'नमी',
        windSpeed: 'हवा की गति',
        condition: 'स्थिति',
        
        // Quick Actions
        quickActions: 'त्वरित कार्य',
        pestCheck: 'कीट जांच',
        soilAdvice: 'मिट्टी सलाह',
        marketPrices: 'बाजार मूल्य',
        cropCalendar: 'फसल कैलेंडर',
        myFields: 'मेरे खेत',
        alerts: 'अलर्ट',
        
        // Advice Section
        farmingAdvice: 'कृषि सलाह',
        askQuestion: 'अपना कृषि प्रश्न पूछें...',
        getAdvice: 'सलाह पाएं',
        gettingAdvice: 'सलाह मिल रही है...',
        helpful: 'सहायक',
        notHelpful: 'सहायक नहीं',
        
        // Pest Detection
        pestDetection: 'कीट पहचान',
        uploadImage: 'इमेज अपलोड करें',
        analyzing: 'विश्लेषण हो रहा है...',
        selectImage: 'विश्लेषण के लिए इमेज चुनें',
        
        // Market Prices
        enterLocation: 'स्थान दर्ज करें',
        searchProducts: 'उत्पाद खोजें...',
        search: 'खोजें',
        searching: 'खोज रहे हैं...',
        noResults: 'कोई परिणाम नहीं मिला',
        perQuintal: 'प्रति क्विंटल',
        
        // Profile
        contactInfo: 'संपर्क जानकारी',
        phoneNumber: 'फोन नंबर',
        email: 'ईमेल',
        location: 'स्थान',
        farmInfo: 'खेत की जानकारी',
        farmSize: 'खेत का आकार',
        experience: 'अनुभव',
        mainCrops: 'मुख्य फसलें',
        edit: 'संपादित करें',
        save: 'सेव करें',
        cancel: 'रद्द करें',
        
        // Stats
        adviceTaken: 'सलाह ली गई',
        pestChecks: 'कीट जांच',
        marketSearches: 'बाजार खोज',
        accuracy: 'सटीकता',
        
        // Common
        back: 'वापस',
        close: 'बंद करें',
        yes: 'हाँ',
        no: 'नहीं',
        ok: 'ठीक',
        error: 'त्रुटि',
        success: 'सफलता',
        loading: 'लोड हो रहा है...',
        tryAgain: 'पुनः प्रयास करें',
        
        // Crop Calendar
        selectCrop: 'फसल चुनें',
        selectRegion: 'क्षेत्र चुनें',
        generateCalendar: 'कैलेंडर बनाएं',
        calendar: 'कैलेंडर',
        sowing: 'बुआई',
        growth: 'विकास चरण',
        harvesting: 'कटाई',
        rainfall: 'वर्षा',
        
        // Categories
        all: 'सभी',
        cereals: 'अनाज',
        vegetables: 'सब्जियां',
        fruits: 'फल',
        pulses: 'दालें',
        
        // Regions
        northIndia: 'उत्तर भारत',
        southIndia: 'दक्षिण भारत',
        westIndia: 'पश्चिम भारत',
        eastIndia: 'पूर्व भारत',
        
        // Crops
        wheat: 'गेहूं',
        rice: 'चावल',
        cotton: 'कपास',
        sugarcane: 'गन्ना',
        potato: 'आलू',
        onion: 'प्याज',
        tomato: 'टमाटर',
        
        // Pest Analysis
        identifiedPest: 'पहचाना गया कीट/रोग:',
        confidence: 'विश्वसनीयता:',
        severity: 'गंभीरता:',
        treatment: 'उपचार:',
        prevention: 'भविष्य में रोकथाम:',
        analysisResults: 'जांच परिणाम',
        uploadPhoto: 'फोटो अपलोड करें',
        analyzingImage: 'इमेज का विश्लेषण हो रहा है...',
        
        // Severity levels
        low: 'कम',
        medium: 'मध्यम',
        moderate: 'मध्यम',
        high: 'अधिक',
        
        // Trends
        up: 'ऊपर',
        down: 'नीचे',
        
        // Time
        today: 'आज',
        tomorrow: 'कल',
        
        // Weather conditions
        sunny: 'धूप',
        cloudy: 'बादल',
        rainy: 'बारिश',
        partlyCloudy: 'आंशिक बादल',
        
        // Messages
        uploadError: 'इमेज अपलोड करते समय कोई समस्या हुई।',
        noDataAvailable: 'इस फसल के लिए डेटा उपलब्ध नहीं है',
        selectCropAndRegion: 'फसल और क्षेत्र चुनें',
        viewAndUpdate: 'अपनी जानकारी देखें और अपडेट करें',
        uploadImageAnalysis: 'अपनी फसल की तस्वीर अपलोड करें',
        currentPrices: 'वर्तमान कृषि उत्पादों के मूल्य',
        timingSchedule: 'फसल की खेती के लिए समय सारणी'
      }
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage
  }

  // Set language
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language
      localStorage.setItem('farmwise_language', language)
      // Trigger language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }))
      return true
    }
    return false
  }

  // Get translation for a key
  translate(key) {
    const translations = this.translations[this.currentLanguage]
    return translations[key] || key
  }

  // Get translation with fallback
  t(key, fallback = null) {
    const translation = this.translate(key)
    if (translation === key && fallback) {
      return fallback
    }
    return translation
  }

  // Get all translations for current language
  getAllTranslations() {
    return this.translations[this.currentLanguage]
  }

  // Check if language is supported
  isLanguageSupported(language) {
    return !!this.translations[language]
  }

  // Get supported languages
  getSupportedLanguages() {
    return Object.keys(this.translations)
  }

  // Format number based on language
  formatNumber(number) {
    if (this.currentLanguage === 'hi') {
      return number.toLocaleString('hi-IN')
    }
    return number.toLocaleString('en-IN')
  }

  // Format currency based on language
  formatCurrency(amount) {
    const formatted = this.formatNumber(amount)
    return `₹${formatted}`
  }

  // Get language-specific date format
  formatDate(date) {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    
    if (this.currentLanguage === 'hi') {
      return new Intl.DateTimeFormat('hi-IN', options).format(new Date(date))
    }
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(date))
  }
}

// Create singleton instance
const languageService = new LanguageService()

export default languageService
