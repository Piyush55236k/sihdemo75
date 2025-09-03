// Enhanced personalization service for Agro_Mitra
// Addresses the gap of generic advice in existing farmer apps

class PersonalizationService {
  constructor() {
    this.userProfile = this.getUserProfile()
    this.farmingHistory = this.getFarmingHistory()
    this.preferences = this.getPreferences()
  }

  // Get or create user profile with farming context
  getUserProfile() {
    const stored = localStorage.getItem('farmwise_user_profile')
    if (stored) return JSON.parse(stored)
    
    // Default profile - will be enhanced based on user interactions
    return {
      farmSize: 'small', // small, medium, large
      primaryCrops: ['wheat', 'rice'],
      soilType: 'loamy',
      irrigationType: 'canal',
      experienceLevel: 'intermediate',
      location: { state: '', district: '', pincode: '' },
      language: 'en',
      farmingGoals: ['yield_increase', 'cost_reduction'],
      challenges: ['water_scarcity', 'pest_management'],
      technologyAdoption: 'medium'
    }
  }

  // Track farming history for better recommendations
  getFarmingHistory() {
    const stored = localStorage.getItem('farmwise_farming_history')
    if (stored) return JSON.parse(stored)
    
    return {
      successfulPractices: [],
      failedAttempts: [],
      seasonalData: {},
      yieldHistory: [],
      inputUsage: {},
      weatherImpacts: []
    }
  }

  // User preferences for advice delivery
  getPreferences() {
    const stored = localStorage.getItem('farmwise_preferences')
    if (stored) return JSON.parse(stored)
    
    return {
      communicationStyle: 'conversational', // conversational, technical, simple
      detailLevel: 'moderate', // brief, moderate, detailed
      voiceEnabled: true,
      offlineMode: false,
      notificationTiming: 'morning',
      trustedSources: ['government', 'research_institutes', 'experienced_farmers']
    }
  }

  // Personalize advice based on user context
  personalizeAdvice(genericAdvice, context = {}) {
    const profile = this.userProfile
    const history = this.farmingHistory
    
    // Add personal context to advice
    let personalizedAdvice = {
      ...genericAdvice,
      personalizedMessage: this.addPersonalContext(genericAdvice.message, context),
      relevanceScore: this.calculateRelevance(genericAdvice, context),
      confidenceLevel: this.assessConfidence(genericAdvice, context),
      actionability: this.enhanceActionability(genericAdvice, context),
      localizedContent: this.localizeContent(genericAdvice),
      trustFactors: this.addTrustFactors(genericAdvice)
    }

    // Add success probability based on user history
    personalizedAdvice.successProbability = this.calculateSuccessProbability(genericAdvice, history)
    
    return personalizedAdvice
  }

  // Add personal context to make advice more relevant
  addPersonalContext(message, context) {
    const profile = this.userProfile
    let contextualMessage = message

    // Add farm size context
    if (profile.farmSize === 'small') {
      contextualMessage += ` For your ${profile.farmSize} farm, consider starting with a smaller test area first.`
    }

    // Add crop-specific context
    if (context.crop && profile.primaryCrops.includes(context.crop)) {
      contextualMessage += ` Based on your experience with ${context.crop}, this aligns with your current practices.`
    }

    // Add seasonal context
    const season = this.getCurrentSeason()
    if (season) {
      contextualMessage += ` This ${season} season timing is optimal for this practice.`
    }

    return contextualMessage
  }

  // Calculate how relevant the advice is to the user
  calculateRelevance(advice, context) {
    let score = 0.5 // Base relevance

    // Crop match
    if (context.crop && this.userProfile.primaryCrops.includes(context.crop)) {
      score += 0.3
    }

    // Season appropriateness
    if (this.isSeasonAppropriate(advice, context)) {
      score += 0.2
    }

    // Farm size compatibility
    if (this.isFarmSizeCompatible(advice)) {
      score += 0.1
    }

    return Math.min(score, 1.0)
  }

  // Assess confidence in advice based on user's context
  assessConfidence(advice, context) {
    let confidence = advice.confidence || 0.7

    // Reduce confidence if user has different soil type
    if (context.soilRequirement && context.soilRequirement !== this.userProfile.soilType) {
      confidence -= 0.1
    }

    // Increase confidence if user has succeeded with similar practices
    if (this.hasSimilarSuccessHistory(advice)) {
      confidence += 0.15
    }

    return Math.max(0.1, Math.min(confidence, 0.95))
  }

  // Make advice more actionable based on user's resources
  enhanceActionability(advice, context) {
    const profile = this.userProfile
    let actionSteps = advice.actions || []

    // Add resource-specific steps
    if (profile.farmSize === 'small') {
      actionSteps = actionSteps.map(step => 
        step.includes('large scale') ? 
        step.replace('large scale', 'small scale') : step
      )
    }

    // Add local resource suggestions
    if (advice.type === 'input_recommendation') {
      actionSteps.push(`Visit your nearest agricultural extension center or FPO for quality inputs.`)
    }

    // Add timing recommendations
    const optimalTiming = this.getOptimalTiming(advice, context)
    if (optimalTiming) {
      actionSteps.unshift(`Optimal timing: ${optimalTiming}`)
    }

    return {
      immediateActions: actionSteps.slice(0, 2),
      weeklyActions: actionSteps.slice(2, 4),
      monthlyActions: actionSteps.slice(4),
      resourcesNeeded: this.identifyRequiredResources(advice),
      estimatedCost: this.estimateCost(advice, profile)
    }
  }

  // Localize content based on user's location and language
  localizeContent(advice) {
    const profile = this.userProfile
    
    return {
      localCropVarieties: this.getLocalVarieties(advice.crop, profile.location),
      localSuppliers: this.getNearbySuppliers(profile.location),
      regionalBestPractices: this.getRegionalPractices(advice.type, profile.location),
      localWeatherConsiderations: this.getLocalWeatherFactors(profile.location),
      governmentSchemes: this.getRelevantSchemes(advice, profile.location)
    }
  }

  // Add trust factors to build credibility
  addTrustFactors(advice) {
    return {
      sourceCredibility: this.assessSourceCredibility(advice.source),
      scientificBasis: this.getScientificEvidence(advice),
      peerValidation: this.getPeerExperiences(advice),
      officialEndorsement: this.getGovernmentSupport(advice),
      successStories: this.getLocalSuccessStories(advice)
    }
  }

  // Calculate success probability based on user's history
  calculateSuccessProbability(advice, history) {
    let probability = 0.6 // Base probability

    // Check similar past practices
    const similarPractices = history.successfulPractices.filter(practice => 
      practice.category === advice.category
    )
    
    if (similarPractices.length > 0) {
      const successRate = similarPractices.length / (similarPractices.length + history.failedAttempts.length)
      probability = (probability + successRate) / 2
    }

    return probability
  }

  // Update user profile based on interactions
  updateProfile(interactions) {
    const profile = this.userProfile
    
    // Learn from successful advice implementations
    interactions.successfulImplementations?.forEach(impl => {
      if (!profile.primaryCrops.includes(impl.crop)) {
        profile.primaryCrops.push(impl.crop)
      }
    })

    // Adjust preferences based on feedback
    if (interactions.feedbackPatterns) {
      if (interactions.feedbackPatterns.preferDetailed) {
        this.preferences.detailLevel = 'detailed'
      }
      if (interactions.feedbackPatterns.preferSimple) {
        this.preferences.communicationStyle = 'simple'
      }
    }

    // Update farming history
    this.updateFarmingHistory(interactions)
    
    // Save updated profile
    localStorage.setItem('farmwise_user_profile', JSON.stringify(profile))
    localStorage.setItem('farmwise_preferences', JSON.stringify(this.preferences))
  }

  // Helper methods
  getCurrentSeason() {
    const month = new Date().getMonth()
    if (month >= 2 && month <= 5) return 'summer'
    if (month >= 6 && month <= 9) return 'monsoon'
    if (month >= 10 || month <= 1) return 'winter'
    return null
  }

  isSeasonAppropriate(advice, context) {
    const season = this.getCurrentSeason()
    return advice.preferredSeasons?.includes(season) || true
  }

  isFarmSizeCompatible(advice) {
    const requiredSize = advice.farmSizeRequirement
    if (!requiredSize) return true
    
    const sizeOrder = ['small', 'medium', 'large']
    const userSizeIndex = sizeOrder.indexOf(this.userProfile.farmSize)
    const requiredSizeIndex = sizeOrder.indexOf(requiredSize)
    
    return userSizeIndex >= requiredSizeIndex
  }

  hasSimilarSuccessHistory(advice) {
    return this.farmingHistory.successfulPractices.some(practice => 
      practice.category === advice.category || practice.type === advice.type
    )
  }

  getOptimalTiming(advice, context) {
    const season = this.getCurrentSeason()
    const timingMap = {
      'pest_management': `Early ${season} season, preferably morning hours`,
      'irrigation': 'Early morning or evening to reduce evaporation',
      'fertilization': 'Before monsoon season for best soil absorption',
      'sowing': 'After soil temperature reaches optimal range'
    }
    return timingMap[advice.category] || 'Consult local agricultural calendar'
  }

  identifyRequiredResources(advice) {
    const baseResources = advice.resourcesNeeded || []
    const profile = this.userProfile
    
    return {
      materials: baseResources.materials || [],
      tools: baseResources.tools || [],
      labor: baseResources.labor || 'minimal',
      expertise: profile.experienceLevel === 'beginner' ? 'expert_guidance_recommended' : 'self_manageable',
      timeRequired: baseResources.timeRequired || '2-4 hours'
    }
  }

  estimateCost(advice, profile) {
    // Simple cost estimation based on farm size and practice type
    const baseCosts = {
      'small': { multiplier: 1, typical: 500 },
      'medium': { multiplier: 2.5, typical: 1200 },
      'large': { multiplier: 5, typical: 2500 }
    }
    
    const sizeCost = baseCosts[profile.farmSize]
    const practiceMultiplier = advice.costIntensive ? 2 : 1
    
    return {
      estimated: sizeCost.typical * practiceMultiplier,
      range: `₹${sizeCost.typical * practiceMultiplier * 0.7}-${sizeCost.typical * practiceMultiplier * 1.3}`,
      breakdown: this.getCostBreakdown(advice, profile)
    }
  }

  getCostBreakdown(advice, profile) {
    return {
      materials: '60%',
      labor: '25%',
      tools: '10%',
      expert_consultation: '5%'
    }
  }

  // Placeholder methods for future enhancement
  getLocalVarieties(crop, location) { return [] }
  getNearbySuppliers(location) { return [] }
  getRegionalPractices(type, location) { return [] }
  getLocalWeatherFactors(location) { return {} }
  getRelevantSchemes(advice, location) { return [] }
  assessSourceCredibility(source) { return 'high' }
  getScientificEvidence(advice) { return {} }
  getPeerExperiences(advice) { return [] }
  getGovernmentSupport(advice) { return {} }
  getLocalSuccessStories(advice) { return [] }
  updateFarmingHistory(interactions) { /* Update history */ }
}

// Offline capability service
class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine
    this.cachedData = this.loadCachedData()
    this.setupEventListeners()
  }

  loadCachedData() {
    const cached = localStorage.getItem('farmwise_offline_cache')
    return cached ? JSON.parse(cached) : {
      advice: [],
      weatherData: null,
      marketPrices: [],
      knowledgeBase: [],
      userQueries: []
    }
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.syncPendingData()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Cache important data for offline access
  cacheData(type, data) {
    this.cachedData[type] = Array.isArray(this.cachedData[type]) 
      ? [...this.cachedData[type], ...data]
      : data
    
    localStorage.setItem('farmwise_offline_cache', JSON.stringify(this.cachedData))
  }

  // Get cached data when offline
  getCachedData(type, query = null) {
    if (this.isOnline) return null
    
    const data = this.cachedData[type]
    if (!data || !Array.isArray(data)) return null
    
    // Simple search in cached data
    if (query) {
      return data.filter(item => 
        JSON.stringify(item).toLowerCase().includes(query.toLowerCase())
      )
    }
    
    return data.slice(0, 10) // Return recent 10 items
  }

  // Queue user actions for later sync
  queueForSync(action, data) {
    const pending = JSON.parse(localStorage.getItem('farmwise_pending_sync') || '[]')
    pending.push({ action, data, timestamp: Date.now() })
    localStorage.setItem('farmwise_pending_sync', JSON.stringify(pending))
  }

  // Sync pending data when online
  async syncPendingData() {
    const pending = JSON.parse(localStorage.getItem('farmwise_pending_sync') || '[]')
    
    for (const item of pending) {
      try {
        // Attempt to sync each pending item
        await this.executePendingAction(item)
      } catch (error) {
        console.error('Failed to sync:', error)
      }
    }
    
    // Clear synced items
    localStorage.setItem('farmwise_pending_sync', '[]')
  }

  async executePendingAction(item) {
    // Implementation would depend on the action type
    console.log('Syncing:', item)
  }
}

export { PersonalizationService, OfflineService }
