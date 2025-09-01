<<<<<<< HEAD
// File removed
=======
>>>>>>> ce17b631e47435b0fbcc27a198d9eafa8e5cd39b
import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useAutoTranslation } from '../hooks/useAutoTranslation.jsx'

const LanguageSwitcher = () => {
  const { 
    currentLanguage, 
    isTranslating, 
    changeLanguage, 
    getSupportedLanguages, 
    getCurrentLanguageInfo 
  } = useAutoTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = getSupportedLanguages();
  const currentLanguageInfo = getCurrentLanguageInfo();

  const handleLanguageChange = async (languageCode) => {
    await changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors w-full sm:w-auto justify-between ${
          isTranslating ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isTranslating}
      >
        <div className="flex items-center space-x-2">
          <Globe className={`w-4 h-4 text-gray-600 ${isTranslating ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {currentLanguageInfo.flag} <span className="hidden sm:inline">{currentLanguageInfo.name}</span>
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 z-40 md:hidden" 
            onClick={() => setIsOpen(false)}
          ></div>
          
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-y-auto">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center space-x-2 ${
                    currentLanguage === language.code ? 'bg-green-50 text-green-600' : 'text-gray-700'
                  }`}
                  disabled={isTranslating}
                >
                  <span>{language.flag}</span>
                  <span className="flex-1">{language.name}</span>
                  {currentLanguage === language.code && (
                    <span className="text-green-600">✓</span>
                  )}
                </button>
              ))}
            </div>
            {isTranslating && (
              <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-100">
                Translating...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
