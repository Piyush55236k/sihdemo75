import { useState, useEffect, useCallback } from 'react';
import translationService from '../services/translationService';

// Custom hook for automatic translation
export const useAutoTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState(
    translationService.getCurrentLanguage()
  );
  const [isTranslating, setIsTranslating] = useState(false);

  // Function to translate text
  const translateText = useCallback(async (text, targetLang = currentLanguage) => {
    if (!text || typeof text !== 'string') return text;
    
    try {
      const translated = await translationService.translateText(text, targetLang);
      return translated;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    }
  }, [currentLanguage]);

  // Function to translate multiple texts
  const translateBatch = useCallback(async (texts, targetLang = currentLanguage) => {
    if (!texts) return texts;
    
    try {
      const translated = await translationService.translateBatch(texts, targetLang);
      return translated;
    } catch (error) {
      console.warn('Batch translation failed:', error);
      return texts;
    }
  }, [currentLanguage]);

  // Function to change language
  const changeLanguage = useCallback(async (languageCode) => {
    setIsTranslating(true);
    setCurrentLanguage(languageCode);
    translationService.setLanguage(languageCode);
    
    // Trigger page translation after language change
    setTimeout(() => {
      setIsTranslating(false);
    }, 1000);
  }, []);

  // Get supported languages
  const getSupportedLanguages = useCallback(() => {
    return translationService.getSupportedLanguages();
  }, []);

  // Get current language info
  const getCurrentLanguageInfo = useCallback(() => {
    return translationService.getLanguageInfo(currentLanguage);
  }, [currentLanguage]);

  return {
    currentLanguage,
    isTranslating,
    translateText,
    translateBatch,
    changeLanguage,
    getSupportedLanguages,
    getCurrentLanguageInfo
  };
};

// Hook for translating specific text with automatic re-render
export const useTranslatedText = (originalText, dependencies = []) => {
  const { currentLanguage, translateText } = useAutoTranslation();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!originalText || currentLanguage === 'en') {
      setTranslatedText(originalText);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    const performTranslation = async () => {
      try {
        const result = await translateText(originalText, currentLanguage);
        if (isMounted) {
          setTranslatedText(result);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setTranslatedText(originalText);
          setIsLoading(false);
        }
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [originalText, currentLanguage, translateText, ...dependencies]);

  return { translatedText, isLoading };
};

// Component wrapper for automatic translation
export const TranslatedText = ({ children, fallback, className, ...props }) => {
  const { translatedText, isLoading } = useTranslatedText(children);

  if (isLoading && fallback) {
    return <span className={className} {...props}>{fallback}</span>;
  }

  return (
    <span className={className} {...props}>
      {isLoading ? children : translatedText}
    </span>
  );
};

export default useAutoTranslation;
