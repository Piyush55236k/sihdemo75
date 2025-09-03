// Enhanced UI Components for Agro_Mitra - Addresses Digital Literacy Gaps
// Designed for low-digital-literacy farmers with voice-first interaction

import React from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

// Big, touch-friendly button with voice guidance
export const VoiceEnabledButton = ({ 
  title, 
  icon: Icon, 
  onClick, 
  color = 'primary', 
  disabled = false,
  voiceHelp = null,
  size = 'large'
}) => {
  const baseClasses = "rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg transform hover:scale-105 focus:ring-4 focus:outline-none"
  
  const sizeClasses = {
    small: "min-h-[48px] p-3 text-base",
    medium: "min-h-[56px] p-4 text-lg", 
    large: "min-h-[72px] p-6 text-xl"
  }
  
  const colorClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary/30",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray/30",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green/30",
    warning: "bg-accent text-white hover:bg-accent-dark focus:ring-accent/30",
    error: "bg-error text-white hover:bg-error-dark focus:ring-error/30"
  }

  const handleClick = () => {
    if (disabled) return
    
    // Provide haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    
    onClick()
  }

  return (
    <button
      className={`
        ${baseClasses} 
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        w-full
      `}
      onClick={handleClick}
      disabled={disabled}
      aria-label={title}
    >
      {Icon && <Icon className="w-6 h-6" />}
      <span>{title}</span>
      {voiceHelp && <Volume2 className="w-4 h-4 opacity-70" />}
    </button>
  )
}

// Voice recording indicator with visual feedback
export const VoiceRecordingIndicator = ({ isListening, isProcessing, language = 'en' }) => {
  if (!isListening && !isProcessing) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
          isListening ? 'bg-red-100 animate-pulse' : 'bg-blue-100'
        }`}>
          {isListening ? (
            <Mic className="w-12 h-12 text-red-600" />
          ) : (
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {isListening ? (
            <TranslatedText>
              {language === 'hi' ? 'बोलिए...' : 'Speak now...'}
            </TranslatedText>
          ) : (
            <TranslatedText>
              {language === 'hi' ? 'सुन रहे हैं...' : 'Processing...'}
            </TranslatedText>
          )}
        </h3>
        
        <p className="text-gray-600">
          {isListening ? (
            <TranslatedText>
              {language === 'hi' 
                ? 'अपना सवाल पूछें, जैसे "कल मुझे पानी देना चाहिए?"'
                : 'Ask your question, like "Should I water tomorrow?"'
              }
            </TranslatedText>
          ) : (
            <TranslatedText>
              {language === 'hi' ? 'कृपया प्रतीक्षा करें...' : 'Please wait...'}
            </TranslatedText>
          )}
        </p>
        
        {/* Voice level indicator */}
        {isListening && (
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i}
                className={`w-2 h-8 bg-red-${300 + (i * 100)} rounded animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Simplified step-by-step progress indicator
export const SimpleStepProgress = ({ steps, currentStep, language = 'en' }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        <TranslatedText>
          {language === 'hi' ? 'प्रगति' : 'Progress'}
        </TranslatedText>
      </h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep
          
          return (
            <div key={index} className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
              isActive ? 'bg-primary text-white' : 
              isCompleted ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-600'
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                isActive ? 'bg-white text-primary' :
                isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </div>
              
              <div className="flex-1">
                <div className="font-medium">{step.title}</div>
                {step.description && (
                  <div className="text-sm opacity-80">{step.description}</div>
                )}
              </div>
              
              {isActive && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Trust indicators for advice credibility
export const TrustIndicators = ({ indicators, trustScore, language = 'en' }) => {
  if (!indicators || indicators.length === 0) return null

  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-blue-600" />
        <span className="font-semibold text-blue-800">
          <TranslatedText>
            {language === 'hi' ? 'विश्वसनीयता सूचक' : 'Trust Indicators'}
          </TranslatedText>
        </span>
        <div className="ml-auto">
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold">
            {Math.round(trustScore * 100)}% 
            <TranslatedText>
              {language === 'hi' ? ' विश्वसनीय' : ' Trusted'}
            </TranslatedText>
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {indicators.map((indicator, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
            <span className="text-lg">{indicator.icon}</span>
            <span className="font-medium">{indicator.label}</span>
            <span className="opacity-75">- {indicator.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Error recovery with guided help
export const ErrorRecoveryHelper = ({ error, onRetry, onGetHelp, language = 'en' }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
      <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      
      <h3 className="text-xl font-semibold text-red-800 mb-2">
        <TranslatedText>
          {language === 'hi' ? 'कुछ गलत हुआ' : 'Something went wrong'}
        </TranslatedText>
      </h3>
      
      <p className="text-red-700 mb-6">
        {error?.message || (
          <TranslatedText>
            {language === 'hi' 
              ? 'कृपया दोबारा कोशिश करें या सहायता लें'
              : 'Please try again or get help'
            }
          </TranslatedText>
        )}
      </p>
      
      <div className="flex flex-col gap-3">
        <VoiceEnabledButton
          title={<TranslatedText>
            {language === 'hi' ? '🔄 दोबारा कोशिश करें' : '🔄 Try Again'}
          </TranslatedText>}
          onClick={onRetry}
          color="warning"
          size="medium"
        />
        
        <VoiceEnabledButton
          title={<TranslatedText>
            {language === 'hi' ? '🆘 सहायता चाहिए' : '🆘 Get Help'}
          </TranslatedText>}
          onClick={onGetHelp}
          color="primary"
          size="medium"
        />
      </div>
      
      <div className="mt-4 p-3 bg-white rounded-lg">
        <div className="text-sm text-gray-600">
          <TranslatedText>
            {language === 'hi' ? 'सहायता हेतु: 1800-180-1551' : 'Help: 1800-180-1551'}
          </TranslatedText>
        </div>
      </div>
    </div>
  )
}

// Offline mode indicator
export const OfflineIndicator = ({ isOnline, language = 'en' }) => {
  if (isOnline) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">
          <TranslatedText>
            {language === 'hi' ? 'ऑफलाइन मोड' : 'Offline Mode'}
          </TranslatedText>
        </span>
      </div>
    </div>
  )
}

// Contextual help tooltip
export const ContextualHelp = ({ content, trigger, language = 'en' }) => {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        {trigger || <HelpCircle className="w-5 h-5" />}
      </button>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 text-white text-sm rounded-lg px-3 py-2 max-w-xs">
            <div className="relative">
              {content}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
