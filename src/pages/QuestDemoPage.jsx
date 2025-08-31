import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  Trophy,
  Target,
  Clock,
  MapPin,
  Star,
  CheckCircle,
  Award,
  Sprout,
  Droplets,
  Leaf,
  Sun,
  Users,
  ChevronRight,
  Play,
  Camera,
  Upload
} from 'lucide-react'

const QuestPage = ({ onBack, currentLanguage }) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeQuest, setActiveQuest] = useState(null)

  const categories = [
    { id: 'all', label: 'All Quests', icon: Trophy, count: 12 },
    { id: 'water', label: 'Water Management', icon: Droplets, count: 3 },
    { id: 'soil', label: 'Soil Health', icon: Leaf, count: 4 },
    { id: 'crops', label: 'Crop Care', icon: Sprout, count: 3 },
    { id: 'sustainability', label: 'Eco-Friendly', icon: Sun, count: 2 }
  ]

  const quests = [
    {
      id: 1,
      title: 'Water Conservation Challenge',
      category: 'water',
      difficulty: 'Easy',
      duration: '2-3 hours',
      points: 50,
      description: 'Implement drip irrigation system in your field',
      steps: [
        'Measure your field area',
        'Calculate water requirements',
        'Install drip irrigation setup',
        'Monitor water usage for 1 week',
        'Upload photos of setup'
      ],
      tips: [
        'Start with a small section first',
        'Use quality pipes to avoid leakage',
        'Check local government subsidies'
      ],
      status: 'available',
      participants: 234,
      location: 'Your Farm',
      rewards: {
        points: 50,
        badge: 'Water Saver',
        certificate: true
      }
    },
    {
      id: 2,
      title: 'Organic Compost Master',
      category: 'soil',
      difficulty: 'Medium',
      duration: '1-2 weeks',
      points: 100,
      description: 'Create nutrient-rich organic compost using farm waste',
      steps: [
        'Collect organic waste materials',
        'Layer brown and green materials',
        'Turn compost pile regularly',
        'Monitor temperature and moisture',
        'Test final compost quality'
      ],
      tips: [
        'Maintain 3:1 ratio of brown to green materials',
        'Keep compost moist but not soggy',
        'Turn pile every 3-4 days for faster decomposition'
      ],
      status: 'in-progress',
      progress: 60,
      participants: 156,
      location: 'Your Farm',
      rewards: {
        points: 100,
        badge: 'Soil Guardian',
        certificate: true,
        bonus: 'Free soil test kit'
      }
    },
    {
      id: 3,
      title: 'Pest-Free Farming',
      category: 'crops',
      difficulty: 'Hard',
      duration: '3-4 weeks',
      points: 150,
      description: 'Control crop pests using integrated pest management',
      steps: [
        'Identify common pests in your area',
        'Set up pest monitoring traps',
        'Introduce beneficial insects',
        'Apply organic pest control methods',
        'Document pest reduction results'
      ],
      tips: [
        'Learn to identify beneficial vs harmful insects',
        'Use neem oil spray early morning or evening',
        'Plant companion crops to deter pests naturally'
      ],
      status: 'completed',
      completedDate: '2024-01-15',
      participants: 89,
      location: 'Your Farm',
      rewards: {
        points: 150,
        badge: 'Pest Master',
        certificate: true,
        bonus: 'Premium organic pesticide kit'
      }
    },
    {
      id: 4,
      title: 'Community Seed Exchange',
      category: 'sustainability',
      difficulty: 'Easy',
      duration: '1 day',
      points: 75,
      description: 'Organize seed sharing event with neighboring farmers',
      steps: [
        'Contact local farmer groups',
        'Collect heritage/heirloom seeds',
        'Organize community meeting',
        'Exchange seeds and knowledge',
        'Plan follow-up sessions'
      ],
      tips: [
        'Focus on drought-resistant varieties',
        'Document seed varieties and sources',
        'Create WhatsApp group for ongoing communication'
      ],
      status: 'available',
      participants: 45,
      location: 'Community Center',
      rewards: {
        points: 75,
        badge: 'Community Builder',
        certificate: false,
        bonus: 'Free heritage seed collection'
      }
    }
  ]

  const filteredQuests = activeCategory === 'all' 
    ? quests 
    : quests.filter(quest => quest.category === activeCategory)

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700'
      case 'Medium': return 'bg-yellow-100 text-yellow-700'
      case 'Hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-blue-100 text-blue-700'
      case 'in-progress': return 'bg-orange-100 text-orange-700'
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (activeQuest) {
    const quest = quests.find(q => q.id === activeQuest)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveQuest(null)}
                className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">
                  <TranslatedText>Back to Quests</TranslatedText>
                </span>
              </button>
              
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quest.difficulty)}`}>
                {quest.difficulty}
              </div>
            </div>
          </div>
        </div>

        {/* Quest Detail */}
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quest Header */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{quest.title}</h1>
                <p className="text-lg text-slate-600 mb-6">{quest.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-5 h-5" />
                    <span>{quest.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <MapPin className="w-5 h-5" />
                    <span>{quest.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Users className="w-5 h-5" />
                    <span>{quest.participants} participants</span>
                  </div>
                </div>

                {quest.status === 'in-progress' && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-700">Progress</span>
                      <span className="text-emerald-600 font-medium">{quest.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {quest.status === 'available' && (
                  <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span><TranslatedText>Start Quest</TranslatedText></span>
                  </button>
                )}

                {quest.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">
                        <TranslatedText>Quest Completed!</TranslatedText>
                      </p>
                      <p className="text-sm text-green-700">
                        Completed on {new Date(quest.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Steps */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  <TranslatedText>Quest Steps</TranslatedText>
                </h2>
                
                <div className="space-y-4">
                  {quest.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700">{step}</p>
                      </div>
                      {quest.status === 'in-progress' && index < Math.floor(quest.steps.length * (quest.progress / 100)) && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>

                {quest.status === 'in-progress' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">
                      <TranslatedText>Upload Progress Photo</TranslatedText>
                    </h3>
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Camera className="w-4 h-4" />
                        <span><TranslatedText>Take Photo</TranslatedText></span>
                      </button>
                      <button className="flex items-center space-x-2 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Upload className="w-4 h-4" />
                        <span><TranslatedText>Upload Photo</TranslatedText></span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/50">
                <h2 className="text-xl font-semibold text-slate-800 mb-6">
                  <TranslatedText>Pro Tips</TranslatedText>
                </h2>
                
                <div className="space-y-3">
                  {quest.tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Rewards */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  <TranslatedText>Rewards</TranslatedText>
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600"><TranslatedText>Points</TranslatedText></span>
                    <span className="text-xl font-bold text-emerald-600">{quest.rewards.points}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600"><TranslatedText>Badge</TranslatedText></span>
                    <span className="text-sm font-medium text-blue-600">{quest.rewards.badge}</span>
                  </div>
                  
                  {quest.rewards.certificate && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600"><TranslatedText>Certificate</TranslatedText></span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  
                  {quest.rewards.bonus && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">
                        <TranslatedText>Bonus Reward</TranslatedText>
                      </p>
                      <p className="text-sm text-yellow-700">{quest.rewards.bonus}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Community */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-500" />
                  <TranslatedText>Community</TranslatedText>
                </h3>
                
                <p className="text-slate-600 text-sm mb-4">
                  <TranslatedText>{quest.participants} farmers are participating in this quest</TranslatedText>
                </p>
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                  <TranslatedText>Join Discussion</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                <TranslatedText>Back to Home</TranslatedText>
              </span>
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              <TranslatedText>Farm Quests</TranslatedText>
            </h1>

            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            <TranslatedText>Level Up Your Farming Skills</TranslatedText>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <TranslatedText>Complete farming challenges, earn points, and learn sustainable practices while connecting with fellow farmers.</TranslatedText>
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span><TranslatedText>{category.label}</TranslatedText></span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quest Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuests.map(quest => (
            <div
              key={quest.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
              onClick={() => setActiveQuest(quest.id)}
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quest.status)}`}>
                  <TranslatedText>{quest.status}</TranslatedText>
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
              </div>

              {/* Quest Info */}
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{quest.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{quest.description}</p>

              {/* Progress Bar (for in-progress quests) */}
              {quest.status === 'in-progress' && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Progress</span>
                    <span className="text-xs text-emerald-600 font-medium">{quest.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${quest.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Quest Details */}
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{quest.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4" />
                  <span>{quest.points} pts</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-slate-500">
                  <Users className="w-3 h-3" />
                  <span>{quest.participants}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            <TranslatedText>Ready to Start Your Farming Journey?</TranslatedText>
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            <TranslatedText>Join thousands of farmers improving their practices through gamified learning and community support.</TranslatedText>
          </p>
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            <TranslatedText>View All Categories</TranslatedText>
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestPage
