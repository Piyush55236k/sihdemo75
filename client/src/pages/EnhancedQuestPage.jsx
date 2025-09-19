import React, { useState, useEffect } from 'react';
import { Star, Medal, Gift, Flame, Droplets, Bug, Leaf, Camera, Upload, Award } from 'lucide-react';
import { useAutoTranslation } from '../hooks/useAutoTranslation.jsx';

const EnhancedQuestPage = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [userPoints, setUserPoints] = useState(0);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const { translateText, currentLanguage } = useAutoTranslation();
  
  // Simple translation function
  const t = (text) => text; // For now, just return the text as-is

  // Available Quests with the design from the image
  const availableQuests = [
    {
      id: 1,
      title: "Water Management Master",
      description: "Learn efficient irrigation techniques and water conservation",
      difficulty: 4,
      points: 250,
      category: "Water",
      icon: Droplets,
      color: "blue",
      steps: [
        "Check soil moisture levels",
        "Install drip irrigation system",
        "Monitor water usage daily",
        "Upload photo of irrigation setup"
      ],
      tips: [
        "Water early morning or evening",
        "Use mulch to retain moisture",
        "Check weather forecast before watering"
      ]
    },
    {
      id: 2,
      title: "Pest Control Expert",
      description: "Master integrated pest management techniques",
      difficulty: 5,
      points: 300,
      category: "Pest Management",
      icon: Bug,
      color: "red",
      steps: [
        "Identify common pests in your area",
        "Apply organic pest control methods",
        "Set up beneficial insect habitats",
        "Document pest management results"
      ],
      tips: [
        "Use companion planting",
        "Regular crop inspection",
        "Maintain beneficial insects"
      ]
    },
    {
      id: 3,
      title: "Soil Health Champion",
      description: "Improve soil quality and nutrient content",
      difficulty: 3,
      points: 200,
      category: "Soil Health",
      icon: Leaf,
      color: "green",
      steps: [
        "Test soil pH and nutrients",
        "Add organic compost",
        "Practice crop rotation",
        "Upload soil test results"
      ],
      tips: [
        "Test soil annually",
        "Add organic matter regularly",
        "Avoid overuse of chemicals"
      ]
    },
    {
      id: 4,
      title: "Energy Efficiency Pro",
      description: "Implement sustainable energy solutions",
      difficulty: 4,
      points: 275,
      category: "Energy",
      icon: Flame,
      color: "orange",
      steps: [
        "Install solar panels for irrigation",
        "Use energy-efficient equipment",
        "Monitor energy consumption",
        "Document energy savings"
      ],
      tips: [
        "Consider renewable energy options",
        "Regular equipment maintenance",
        "Track energy usage patterns"
      ]
    },
    {
      id: 5,
      title: "Organic Farming Specialist",
      description: "Master organic farming techniques",
      difficulty: 5,
      points: 350,
      category: "Organic",
      icon: Leaf,
      color: "emerald",
      steps: [
        "Obtain organic certification requirements",
        "Implement organic pest control",
        "Use organic fertilizers only",
        "Document organic practices"
      ],
      tips: [
        "Plan transition period carefully",
        "Keep detailed records",
        "Connect with organic farming community"
      ]
    },
    {
      id: 6,
      title: "Smart Farming Innovator",
      description: "Adopt modern farming technologies",
      difficulty: 5,
      points: 400,
      category: "Technology",
      icon: Camera,
      color: "purple",
      steps: [
        "Install IoT sensors for monitoring",
        "Use drone technology for crop analysis",
        "Implement precision agriculture",
        "Share technology adoption results"
      ],
      tips: [
        "Start with basic sensors",
        "Learn data interpretation",
        "Invest in training"
      ]
    }
  ];

  const StarRating = ({ rating, size = 20 }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const QuestCard = ({ quest }) => {
    const IconComponent = quest.icon;
    const isCompleted = completedQuests.includes(quest.id);
    
    return (
      <div 
        className={`bg-white rounded-xl shadow-lg border-2 p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
          isCompleted ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-blue-400'
        }`}
        onClick={() => setSelectedQuest(quest)}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-${quest.color}-100`}>
            <IconComponent className={`w-8 h-8 text-${quest.color}-600`} />
          </div>
          {isCompleted && (
            <div className="bg-green-500 rounded-full p-1">
              <Award className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2">{quest.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quest.description}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {quest.category}
          </span>
          <StarRating rating={quest.difficulty} size={16} />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-blue-600">
            <Medal className="w-4 h-4 mr-1" />
            <span className="font-semibold">{quest.points} pts</span>
          </div>
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isCompleted
                ? 'bg-green-500 text-white cursor-default'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
            disabled={isCompleted}
          >
            {isCompleted ? 'Completed' : 'Start Quest'}
          </button>
        </div>
      </div>
    );
  };

  const QuestModal = ({ quest, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [uploadedImage, setUploadedImage] = useState(null);
    const IconComponent = quest.icon;

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setUploadedImage(e.target.result);
        reader.readAsDataURL(file);
      }
    };

    const completeQuest = () => {
      setCompletedQuests([...completedQuests, quest.id]);
      setUserPoints(userPoints + quest.points);
      setUserLevel(Math.floor((userPoints + quest.points) / 1000) + 1);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${quest.color}-100 mr-4`}>
                  <IconComponent className={`w-8 h-8 text-${quest.color}-600`} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{quest.title}</h2>
                  <p className="text-gray-600">{quest.description}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Quest Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <StarRating rating={quest.difficulty} size={18} />
                <p className="text-sm text-gray-600 mt-1">Difficulty</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center text-blue-600 mb-1">
                  <Medal className="w-5 h-5 mr-1" />
                  <span className="font-bold">{quest.points}</span>
                </div>
                <p className="text-sm text-gray-600">Points</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 font-bold text-lg">
                  {currentStep}/{quest.steps.length}
                </div>
                <p className="text-sm text-gray-600">Progress</p>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Quest Steps</h3>
              <div className="space-y-3">
                {quest.steps.map((step, index) => (
                  <div 
                    key={index}
                    className={`flex items-center p-3 rounded-lg border-2 transition-colors ${
                      index <= currentStep 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      index <= currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`${index <= currentStep ? 'text-green-800' : 'text-gray-600'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Pro Tips</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <ul className="space-y-2">
                  {quest.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <Gift className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-800 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Upload Progress Photo</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {uploadedImage ? (
                  <div>
                    <img src={uploadedImage} alt="Uploaded" className="max-w-full h-40 mx-auto rounded-lg mb-3" />
                    <p className="text-green-600 font-medium">Photo uploaded successfully!</p>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-3">Upload a photo of your progress</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                    >
                      Choose Photo
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              {currentStep < quest.steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={completeQuest}
                  disabled={!uploadedImage}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    uploadedImage
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Complete Quest
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Farm Quests</h1>
              <p className="text-gray-600 mt-1">Complete challenges to improve your farming skills</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{userLevel}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{userPoints}</div>
                <div className="text-sm text-gray-600">Points</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'available'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Available Quests
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'completed'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Completed ({completedQuests.length})
          </button>
        </div>

        {/* Quest Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableQuests
            .filter(quest => 
              activeTab === 'available' 
                ? !completedQuests.includes(quest.id)
                : completedQuests.includes(quest.id)
            )
            .map(quest => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
        </div>

        {/* Empty State */}
        {activeTab === 'completed' && completedQuests.length === 0 && (
          <div className="text-center py-12">
            <Medal className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No completed quests yet</h3>
            <p className="text-gray-500">Start completing quests to see them here!</p>
          </div>
        )}
      </div>

      {/* Quest Modal */}
      {selectedQuest && (
        <QuestModal 
          quest={selectedQuest} 
          onClose={() => setSelectedQuest(null)} 
        />
      )}
    </div>
  );
};

export default EnhancedQuestPage;