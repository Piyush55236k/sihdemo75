import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  Trophy, 
  Target, 
  Award, 
  Star, 
  Clock, 
  MapPin,
  Camera,
  Upload,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Leaf,
  Droplets,
  Sun,
  Zap,
  TreePine,
  Sprout,
  Compass
} from 'lucide-react'

const QuestPage = () => {
  const [selectedQuest, setSelectedQuest] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)

  const allQuests = [
    {
      id: 1,
      title: <TranslatedText>Mulching Marathon</TranslatedText>,
      description: <TranslatedText>Apply organic mulch to your crops to improve soil health and water retention</TranslatedText>,
      difficulty: "Easy",
      estimatedTime: <TranslatedText>2-3 hours</TranslatedText>,
      location: <TranslatedText>Your farm</TranslatedText>,
      rewards: { points: 50, badge: <TranslatedText>Mulch Master</TranslatedText> },
      icon: Leaf,
      category: <TranslatedText>Soil Health</TranslatedText>,
      steps: [
        <TranslatedText>Gather crop residue, leaves, or straw</TranslatedText>,
        <TranslatedText>Clean the area around your plants</TranslatedText>,
        <TranslatedText>Spread the mulch 2-3 inches thick around the base</TranslatedText>,
        <TranslatedText>Keep mulch away from plant stems</TranslatedText>,
        <TranslatedText>Water lightly to help mulch settle</TranslatedText>
      ],
      tips: [
        <TranslatedText>Use organic materials like straw, leaves, or grass clippings</TranslatedText>,
        <TranslatedText>Avoid using diseased plant material</TranslatedText>,
        <TranslatedText>Replenish mulch as it decomposes</TranslatedText>
      ]
    },
    {
      id: 2,
      title: <TranslatedText>Water Conservation Quest</TranslatedText>,
      description: <TranslatedText>Implement drip irrigation system to reduce water wastage</TranslatedText>,
      difficulty: "Medium",
      estimatedTime: <TranslatedText>4-6 hours</TranslatedText>,
      location: <TranslatedText>Irrigation area</TranslatedText>,
      rewards: { points: 100, badge: <TranslatedText>Water Warrior</TranslatedText> },
      icon: Droplets,
      category: <TranslatedText>Water Management</TranslatedText>,
      steps: [
        <TranslatedText>Plan your irrigation layout</TranslatedText>,
        <TranslatedText>Install main water line</TranslatedText>,
        <TranslatedText>Connect drip emitters to plants</TranslatedText>,
        <TranslatedText>Test the system for leaks</TranslatedText>,
        <TranslatedText>Set up timer for optimal watering</TranslatedText>
      ],
      tips: [
        <TranslatedText>Start with a small area to test</TranslatedText>,
        <TranslatedText>Use pressure regulators for consistent flow</TranslatedText>,
        <TranslatedText>Monitor soil moisture regularly</TranslatedText>
      ]
    },
    {
      id: 3,
      title: <TranslatedText>Solar Power Setup</TranslatedText>,
      description: <TranslatedText>Install solar panels for farm operations to reduce energy costs</TranslatedText>,
      difficulty: "Hard",
      estimatedTime: <TranslatedText>1-2 days</TranslatedText>,
      location: <TranslatedText>Farm building or open area</TranslatedText>,
      rewards: { points: 200, badge: <TranslatedText>Solar Champion</TranslatedText> },
      icon: Sun,
      category: <TranslatedText>Energy</TranslatedText>,
      steps: [
        <TranslatedText>Assess energy needs and site conditions</TranslatedText>,
        <TranslatedText>Choose appropriate solar panel system</TranslatedText>,
        <TranslatedText>Install mounting structure</TranslatedText>,
        <TranslatedText>Connect panels and inverter</TranslatedText>,
        <TranslatedText>Test system performance</TranslatedText>
      ],
      tips: [
        <TranslatedText>Consult with solar experts for system design</TranslatedText>,
        <TranslatedText>Ensure proper orientation for maximum sun exposure</TranslatedText>,
        <TranslatedText>Regular cleaning improves efficiency</TranslatedText>
      ]
    },
    {
      id: 4,
      title: <TranslatedText>Composting Challenge</TranslatedText>,
      description: <TranslatedText>Create nutrient-rich compost from farm waste and kitchen scraps</TranslatedText>,
      difficulty: "Easy",
      estimatedTime: <TranslatedText>30 minutes setup, 2-3 months maturation</TranslatedText>,
      location: <TranslatedText>Compost area</TranslatedText>,
      rewards: { points: 75, badge: <TranslatedText>Compost King</TranslatedText> },
      icon: TreePine,
      category: <TranslatedText>Soil Health</TranslatedText>,
      steps: [
        <TranslatedText>Choose a suitable location for compost pile</TranslatedText>,
        <TranslatedText>Layer green and brown materials</TranslatedText>,
        <TranslatedText>Maintain proper moisture and aeration</TranslatedText>,
        <TranslatedText>Turn the pile regularly</TranslatedText>,
        <TranslatedText>Use mature compost in your garden</TranslatedText>
      ],
      tips: [
        <TranslatedText>Balance green (nitrogen) and brown (carbon) materials</TranslatedText>,
        <TranslatedText>Keep pile moist but not soggy</TranslatedText>,
        <TranslatedText>Smaller pieces decompose faster</TranslatedText>
      ]
    },
    {
      id: 5,
      title: <TranslatedText>Bio-Pesticide Creation</TranslatedText>,
      description: <TranslatedText>Make natural pest control solutions from local plants</TranslatedText>,
      difficulty: "Medium",
      estimatedTime: <TranslatedText>3-4 hours</TranslatedText>,
      location: <TranslatedText>Processing area</TranslatedText>,
      rewards: { points: 125, badge: <TranslatedText>Bio Defender</TranslatedText> },
  icon: Sprout,
      category: <TranslatedText>Pest Management</TranslatedText>,
      steps: [
        <TranslatedText>Identify local pest-repelling plants</TranslatedText>,
        <TranslatedText>Harvest and prepare plant materials</TranslatedText>,
        <TranslatedText>Extract active compounds</TranslatedText>,
        <TranslatedText>Dilute and test solution</TranslatedText>,
        <TranslatedText>Apply to affected crops</TranslatedText>
      ],
      tips: [
        <TranslatedText>Test on small area first</TranslatedText>,
        <TranslatedText>Use fresh materials for best results</TranslatedText>,
        <TranslatedText>Store in cool, dark place</TranslatedText>
      ]
    },
    {
      id: 6,
      title: <TranslatedText>Crop Rotation Planning</TranslatedText>,
      description: <TranslatedText>Design a sustainable crop rotation system for your farm</TranslatedText>,
      difficulty: "Medium",
      estimatedTime: <TranslatedText>2-3 hours</TranslatedText>,
      location: <TranslatedText>Planning area</TranslatedText>,
      rewards: { points: 150, badge: <TranslatedText>Rotation Master</TranslatedText> },
      icon: Compass,
      category: <TranslatedText>Crop Management</TranslatedText>,
      steps: [
        <TranslatedText>Map your current farm layout</TranslatedText>,
        <TranslatedText>Identify crop families and requirements</TranslatedText>,
        <TranslatedText>Plan rotation sequence for 3-4 years</TranslatedText>,
        <TranslatedText>Consider soil health and pest cycles</TranslatedText>,
        <TranslatedText>Document your rotation plan</TranslatedText>
      ],
      tips: [
        <TranslatedText>Group crops by family for rotation</TranslatedText>,
        <TranslatedText>Include cover crops for soil health</TranslatedText>,
        <TranslatedText>Adapt plan based on weather and market conditions</TranslatedText>
      ]
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'badge-success'
      case 'Medium': return 'badge-warning'
      case 'Hard': return 'badge-info'
      default: return 'badge-success'
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Soil Health': 'bg-green-100 text-green-800',
      'Water Management': 'bg-blue-100 text-blue-800',
      'Energy': 'bg-yellow-100 text-yellow-800',
      'Pest Management': 'bg-purple-100 text-purple-800',
      'Crop Management': 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setUploadedImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const completeQuest = () => {
    // In real app, this would send data to backend
    alert('Quest completed! You earned points and a badge!')
    setShowUpload(false)
    setUploadedImage(null)
    setSelectedQuest(null)
  }

  if (selectedQuest) {
    return (
  <div className="animate-fade-in">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedQuest(null)}
            className="flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <TranslatedText>Back to Quests</TranslatedText>
          </button>

          {/* Quest Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-300 rounded-xl flex items-center justify-center">
                  <selectedQuest.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{selectedQuest.title}</h1>
                  <p className="text-text-light text-lg">{selectedQuest.description}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-2 ${getDifficultyColor(selectedQuest.difficulty)}`}>
                  {selectedQuest.difficulty}
                </span>
                <div className="text-sm text-text-light">
                  <div className="flex items-center mb-1">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedQuest.estimatedTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {selectedQuest.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="bg-gradient-to-r from-accent-yellow to-accent-orange p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">Rewards</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-white mr-2" />
                  <span className="text-white font-semibold">{selectedQuest.rewards.points} Points</span>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-white mr-2" />
                  <span className="text-white font-semibold">{selectedQuest.rewards.badge} Badge</span>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4"><TranslatedText>Step-by-Step Guide</TranslatedText></h3>
              <div className="space-y-4">
                {selectedQuest.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4">
                                         <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-text-light">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4"><TranslatedText>Pro Tips</TranslatedText></h3>
              <div className="grid grid-2 gap-4">
                {selectedQuest.tips.map((tip, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg border-l-4 border-primary-green">
                    <p className="text-text-light">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Completion */}
            <div className="text-center">
                             <button
                 onClick={() => setShowUpload(true)}
                 className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-lg font-semibold transition-colors inline-flex items-center"
               >
                 <TranslatedText>Complete Quest</TranslatedText>
                 <CheckCircle className="w-6 h-6 ml-2" />
               </button>
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Complete Your Quest</h3>
              <p className="text-text-light mb-4">
                Upload a photo to prove you've completed the task and earn your rewards!
              </p>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-border-light rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-text-light mx-auto mb-4" />
                  <p className="text-text-light mb-4">Take a photo or upload an image</p>
                  <div className="flex space-x-2">
                                         <label className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center">
                       <Camera className="w-5 h-5 mr-2" />
                       <TranslatedText>Take Photo</TranslatedText>
                       <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
                     </label>
                     <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors cursor-pointer inline-flex items-center">
                       <Upload className="w-5 h-5 mr-2" />
                       <TranslatedText>Upload</TranslatedText>
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                     </label>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <img src={uploadedImage} alt="Quest completion" className="w-full h-48 object-cover rounded-lg mb-4" />
                  <div className="flex space-x-2">
                                         <button onClick={() => setUploadedImage(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                       <XCircle className="w-5 h-5 mr-2" />
                       <TranslatedText>Retake</TranslatedText>
                     </button>
                     <button onClick={completeQuest} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                       <CheckCircle className="w-5 h-5 mr-2" />
                       <TranslatedText>Submit</TranslatedText>
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="page-transition">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4"><TranslatedText>Available Quests</TranslatedText></h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            <TranslatedText>Choose from a variety of sustainable farming challenges. Complete quests to earn points, badges, and improve your farming practices.</TranslatedText>
          </p>
        </div>

        {/* Quest Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {allQuests.map((quest) => {
            const Icon = quest.icon
            return (
              <div key={quest.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedQuest(quest)}>
                <div className="flex items-start justify-between mb-4">
                                     <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-300 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide ${getDifficultyColor(quest.difficulty)}`}>
                    {quest.difficulty}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{quest.title}</h3>
                <p className="text-text-light text-sm mb-4 line-clamp-2">{quest.description}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-text-light">
                    <Clock className="w-4 h-4 mr-2" />
                    {quest.estimatedTime}
                  </div>
                  <div className="flex items-center text-sm text-text-light">
                    <MapPin className="w-4 h-4 mr-2" />
                    {quest.location}
                  </div>
                  <div className="flex items-center text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(quest.category)}`}>
                      {quest.category}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-accent-yellow mr-1" />
                      <span className="text-sm font-medium">{quest.rewards.points} pts</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium">{quest.rewards.badge}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default QuestPage
