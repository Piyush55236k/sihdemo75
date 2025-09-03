// Enhanced accessibility and UI service for Agro_Mitra
// Addresses digital literacy barriers and complex UI issues

class AccessibilityService {
  constructor() {
    this.setupAccessibilityFeatures()
    this.voiceInstructions = this.initializeVoiceInstructions()
  }

  setupAccessibilityFeatures() {
    // High contrast mode detection
    this.highContrastMode = window.matchMedia('(prefers-contrast: high)').matches
    
    // Large text mode detection
    this.largeTextMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Voice guidance preference
    this.voiceGuidanceEnabled = localStorage.getItem('farmwise_voice_guidance') === 'true'
  }

  // Voice instructions for each UI element
  initializeVoiceInstructions() {
    return {
      welcome: {
        hi: "नमस्कार! फार्मवाइज़ में आपका स्वागत है। मैं आपकी खेती में मदद करने के लिए यहाँ हूँ।",
        en: "Welcome to Agro_Mitra! I'm here to help you with your farming needs."
      },
      microphoneInstruction: {
        hi: "माइक्रोफ़ोन बटन दबाएं और अपना प्रश्न पूछें। उदाहरण: कल मुझे पानी देना चाहिए?",
        en: "Press the microphone button and ask your question. For example: Should I water tomorrow?"
      },
      pestDetectionHelp: {
        hi: "अपनी फसल की तस्वीर लें या गैलरी से चुनें। मैं तुरंत बीमारी की पहचान करूंगा।",
        en: "Take a photo of your crop or choose from gallery. I'll identify the disease instantly."
      },
      weatherExplanation: {
        hi: "मौसम की जानकारी आपकी खेती की योजना बनाने में मदद करती है। यहाँ आज और अगले 3 दिनों का मौसम है।",
        en: "Weather information helps you plan your farming activities. Here's today's and the next 3 days' weather."
      }
    }
  }

  // Provide voice guidance for UI elements
  async provideVoiceGuidance(element, language = 'hi') {
    if (!this.voiceGuidanceEnabled) return
    
    const instruction = this.voiceInstructions[element]?.[language]
    if (!instruction) return

    try {
      // Use Web Speech API for voice guidance
      const utterance = new SpeechSynthesisUtterance(instruction)
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US'
      utterance.rate = 0.8 // Slower for better comprehension
      utterance.volume = 0.8
      
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Voice guidance error:', error)
    }
  }

  // Simplify complex UI elements for better usability
  simplifyUIForLiteracy(element) {
    const simplifications = {
      // Use icons with text labels
      addIconLabels: true,
      // Larger touch targets (minimum 44px)
      enlargeTouchTargets: true,
      // High contrast colors
      enhanceContrast: true,
      // Reduce cognitive load
      limitChoices: true,
      // Use familiar patterns
      familiarPatterns: true
    }

    return this.applySimplifications(element, simplifications)
  }

  applySimplifications(element, options) {
    const simplified = { ...element }

    if (options.addIconLabels) {
      simplified.showLabels = true
      simplified.iconSize = 'large'
    }

    if (options.enlargeTouchTargets) {
      simplified.minHeight = '44px'
      simplified.minWidth = '44px'
      simplified.padding = '12px'
    }

    if (options.enhanceContrast) {
      simplified.highContrast = true
    }

    return simplified
  }

  // Create voice-first interaction patterns
  createVoiceFirstUI(component) {
    return {
      primaryInteraction: 'voice',
      fallbackInteraction: 'touch',
      visualFeedback: 'minimal',
      audioFeedback: 'comprehensive',
      confirmationRequired: true,
      errorRecovery: 'guided'
    }
  }

  // Generate contextual help based on user behavior
  generateContextualHelp(userAction, context) {
    const helpContent = {
      firstTime: {
        hi: "पहली बार उपयोग कर रहे हैं? चिंता न करें, मैं आपकी मदद करूंगा।",
        en: "First time using this? Don't worry, I'll help you through it."
      },
      struggling: {
        hi: "क्या आपको कोई परेशानी हो रही है? मैं आपकी सहायता कर सकता हूँ।",
        en: "Are you having trouble? I can help you with this."
      },
      success: {
        hi: "बहुत बढ़िया! आपने यह सही तरीके से किया है।",
        en: "Great job! You did this correctly."
      }
    }

    return helpContent[userAction] || helpContent.firstTime
  }
}

// Trust and credibility service to address corporate bias concerns
class TrustService {
  constructor() {
    this.trustIndicators = this.initializeTrustIndicators()
    this.sourceValidation = this.initializeSourceValidation()
  }

  initializeTrustIndicators() {
    return {
      independence: {
        label: 'Independent Advisory',
        description: 'Not affiliated with any product company',
        icon: '🔒'
      },
      scientific: {
        label: 'Science-Based',
        description: 'Based on agricultural research and data',
        icon: '🔬'
      },
      community: {
        label: 'Farmer Verified',
        description: 'Tested by local farming community',
        icon: '👥'
      },
      government: {
        label: 'Government Approved',
        description: 'Endorsed by agricultural departments',
        icon: '🏛️'
      },
      transparent: {
        label: 'Transparent Process',
        description: 'Clear explanation of recommendations',
        icon: '🔍'
      }
    }
  }

  initializeSourceValidation() {
    return {
      trustedSources: [
        'Indian Council of Agricultural Research (ICAR)',
        'State Agricultural Universities',
        'Krishi Vigyan Kendras (KVK)',
        'National Sample Survey Office (NSSO)',
        'Directorate of Economics & Statistics',
        'Local Agricultural Extension Centers'
      ],
      avoidSources: [
        'Single-company recommendations',
        'Unverified social media claims',
        'Generic international advice'
      ]
    }
  }

  // Add trust indicators to advice
  addTrustIndicators(advice) {
    const indicators = []

    // Check source credibility
    if (this.isGovernmentSource(advice.source)) {
      indicators.push(this.trustIndicators.government)
    }

    if (this.isScientificSource(advice.source)) {
      indicators.push(this.trustIndicators.scientific)
    }

    if (this.isCommunityValidated(advice)) {
      indicators.push(this.trustIndicators.community)
    }

    // Always show independence for non-commercial advice
    if (!this.hasCommercialBias(advice)) {
      indicators.push(this.trustIndicators.independence)
    }

    if (advice.explanation) {
      indicators.push(this.trustIndicators.transparent)
    }

    return indicators
  }

  // Validate advice source
  isGovernmentSource(source) {
    const govKeywords = ['icar', 'government', 'krishi', 'agriculture department', 'extension']
    return govKeywords.some(keyword => 
      source.toLowerCase().includes(keyword)
    )
  }

  isScientificSource(source) {
    const sciKeywords = ['research', 'university', 'institute', 'study', 'journal']
    return sciKeywords.some(keyword => 
      source.toLowerCase().includes(keyword)
    )
  }

  isCommunityValidated(advice) {
    return advice.farmerFeedback && advice.farmerFeedback.positive > 70
  }

  hasCommercialBias(advice) {
    const commercialKeywords = ['buy', 'purchase', 'brand', 'company', 'product']
    return commercialKeywords.some(keyword => 
      advice.content.toLowerCase().includes(keyword)
    )
  }

  // Generate trust score for advice
  calculateTrustScore(advice) {
    let score = 0.5 // Base trust score

    // Source credibility
    if (this.isGovernmentSource(advice.source)) score += 0.3
    if (this.isScientificSource(advice.source)) score += 0.2
    
    // Community validation
    if (this.isCommunityValidated(advice)) score += 0.2
    
    // Transparency
    if (advice.explanation && advice.reasoning) score += 0.1
    
    // No commercial bias
    if (!this.hasCommercialBias(advice)) score += 0.1
    
    // Local relevance
    if (advice.locallyTested) score += 0.1

    return Math.min(score, 1.0)
  }
}

// Simplified UI components for low digital literacy users
class SimplifiedUIComponents {
  
  // Big button design for easy interaction
  static BigActionButton({ title, icon, onClick, color = 'primary', disabled = false }) {
    return {
      component: 'button',
      props: {
        className: `
          w-full min-h-[80px] p-4 rounded-2xl text-lg font-semibold
          ${color === 'primary' ? 'bg-primary text-white' : ''}
          ${color === 'secondary' ? 'bg-gray-100 text-gray-800' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-105'}
          transition-all duration-200 flex items-center justify-center gap-3
        `,
        onClick: disabled ? null : onClick,
        disabled
      },
      children: [icon, title]
    }
  }

  // Voice interaction indicator
  static VoiceIndicator({ isListening, micEnabled }) {
    return {
      component: 'div',
      props: {
        className: `
          fixed bottom-6 right-6 w-16 h-16 rounded-full
          ${isListening ? 'bg-red-500 animate-pulse' : micEnabled ? 'bg-green-500' : 'bg-gray-400'}
          flex items-center justify-center text-white shadow-lg z-50
        `
      },
      children: isListening ? '🎙️' : micEnabled ? '🔊' : '🔇'
    }
  }

  // Simple progress indicator
  static SimpleProgress({ steps, currentStep, labels }) {
    return {
      component: 'div',
      props: { className: 'space-y-4' },
      children: steps.map((step, index) => ({
        component: 'div',
        props: {
          className: `
            flex items-center gap-3 p-3 rounded-lg
            ${index <= currentStep ? 'bg-green-50 text-green-800' : 'bg-gray-50 text-gray-500'}
          `
        },
        children: [
          {
            component: 'div',
            props: {
              className: `
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300'}
              `
            },
            children: index < currentStep ? '✓' : index + 1
          },
          labels[index]
        ]
      }))
    }
  }

  // Error recovery component
  static ErrorRecovery({ error, onRetry, onGetHelp }) {
    return {
      component: 'div',
      props: { className: 'bg-red-50 border border-red-200 rounded-lg p-4 space-y-3' },
      children: [
        {
          component: 'div',
          props: { className: 'flex items-center gap-2 text-red-800' },
          children: ['⚠️', 'कुछ गलत हुआ है / Something went wrong']
        },
        {
          component: 'p',
          props: { className: 'text-red-700 text-sm' },
          children: error.message || 'कृपया दोबारा कोशिश करें / Please try again'
        },
        {
          component: 'div',
          props: { className: 'flex gap-2' },
          children: [
            this.BigActionButton({
              title: 'दोबारा कोशिश करें / Try Again',
              icon: '🔄',
              onClick: onRetry,
              color: 'secondary'
            }),
            this.BigActionButton({
              title: 'सहायता चाहिए / Need Help',
              icon: '🆘',
              onClick: onGetHelp,
              color: 'primary'
            })
          ]
        }
      ]
    }
  }
}

export { AccessibilityService, TrustService, SimplifiedUIComponents }
