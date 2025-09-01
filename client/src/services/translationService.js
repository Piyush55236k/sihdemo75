// Translation Service for dynamic language translation
class TranslationService {
  constructor() {
    this.cache = new Map();
    this.currentLanguage = 'en';
    this.supportedLanguages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
      { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
      { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
      { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
      { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
      { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
      { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
      { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'zh', name: '中文', flag: '🇨🇳' },
      { code: 'ja', name: '日本語', flag: '🇯🇵' },
      { code: 'ko', name: '한국어', flag: '🇰🇷' },
      { code: 'ar', name: 'العربية', flag: '🇸🇦' },
      { code: 'pt', name: 'Português', flag: '🇵🇹' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
      { code: 'it', name: 'Italiano', flag: '🇮🇹' },
      { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
      { code: 'th', name: 'ไทย', flag: '🇹🇭' },
      { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
      { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
      { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
      { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
    ];
  }

  // Get cache key for translation
  getCacheKey(text, targetLang) {
    return `${text}:${targetLang}`;
  }

  // Check if translation is in cache
  getFromCache(text, targetLang) {
    const key = this.getCacheKey(text, targetLang);
    return this.cache.get(key);
  }

  // Store translation in cache
  setCache(text, targetLang, translation) {
    const key = this.getCacheKey(text, targetLang);
    this.cache.set(key, translation);
  }

  // Free translation API using MyMemory API
  async translateText(text, targetLang) {
    // If target language is English or same as current, return original text
    if (targetLang === 'en' || targetLang === this.currentLanguage) {
      return text;
    }

    // Check cache first
    const cached = this.getFromCache(text, targetLang);
    if (cached) {
      return cached;
    }

    try {
      // Using MyMemory Translation API (free, no API key required)
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responseData && data.responseData.translatedText) {
        const translation = data.responseData.translatedText;
        
        // Cache the translation
        this.setCache(text, targetLang, translation);
        
        return translation;
      } else {
        console.warn('No translation data received for:', text);
        return text; // Return original text if no translation
      }
    } catch (error) {
      console.warn('Translation failed:', error);
      return text; // Return original text on error
    }
  }

  // Translate multiple texts at once
  async translateBatch(texts, targetLang) {
    if (!Array.isArray(texts)) {
      return this.translateText(texts, targetLang);
    }

    const translations = await Promise.all(
      texts.map(text => this.translateText(text, targetLang))
    );
    
    return translations;
  }

  // Set current language
  setLanguage(languageCode) {
    this.currentLanguage = languageCode;
    // Store in localStorage for persistence
    localStorage.setItem('selectedLanguage', languageCode);
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage || localStorage.getItem('selectedLanguage') || 'en';
  }

  // Get supported languages
  getSupportedLanguages() {
    return this.supportedLanguages;
  }

  // Get language info by code
  getLanguageInfo(code) {
    return this.supportedLanguages.find(lang => lang.code === code) || this.supportedLanguages[0];
  }

  // Translate DOM elements automatically
  async translateElement(element, targetLang) {
    if (!element || targetLang === 'en') return;

    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip empty nodes and script/style content
          const parent = node.parentElement;
          if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }
          
          const text = node.textContent.trim();
          if (!text || text.length < 2) {
            return NodeFilter.FILTER_REJECT;
          }
          
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }

    // Translate all text nodes
    for (const textNode of textNodes) {
      const originalText = textNode.textContent.trim();
      if (originalText) {
        const translatedText = await this.translateText(originalText, targetLang);
        if (translatedText !== originalText) {
          textNode.textContent = translatedText;
        }
      }
    }
  }

  // Clear translation cache
  clearCache() {
    this.cache.clear();
  }

  // Get cache size for debugging
  getCacheSize() {
    return this.cache.size;
  }
}

// Create singleton instance
const translationService = new TranslationService();

export default translationService;
