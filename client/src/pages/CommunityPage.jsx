import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  Trophy, 
  Award, 
  Users, 
  MessageCircle, 
  ThumbsUp, 
  Share2,
  Search,
  Filter,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
  MessageSquare,
  Heart,
  Bookmark,
  ArrowLeft,
  Eye
} from 'lucide-react'

const CommunityPage = ({ onBack, currentLanguage }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [selectedProfile, setSelectedProfile] = useState(null)

  // Handle back button click - use onBack prop if available, otherwise navigate
  const handleBack = () => {
    if (onBack && typeof onBack === 'function') {
      onBack()
    } else {
      navigate('/')
    }
  }

  // Mock data - in real app this would come from API
  const leaderboardData = [
    {
      id: 1,
      name: "Sita Devi",
      location: "Uttar Pradesh",
      sustainabilityScore: 95,
      totalPoints: 2840,
      level: <TranslatedText>Harvest Master</TranslatedText>,
      avatar: "S",
      rank: 1,
      badges: [<TranslatedText>Soil Health Champion</TranslatedText>, <TranslatedText>Water Warrior</TranslatedText>, <TranslatedText>Solar Champion</TranslatedText>],
      completedQuests: 28
    },
    {
      id: 2,
      name: "Amit Kumar",
      location: "Punjab",
      sustainabilityScore: 89,
      totalPoints: 2650,
      level: <TranslatedText>Harvest Master</TranslatedText>,
      avatar: "A",
      rank: 2,
      badges: [<TranslatedText>Compost King</TranslatedText>, <TranslatedText>Bio Defender</TranslatedText>, <TranslatedText>Rotation Master</TranslatedText>],
      completedQuests: 25
    },
    {
      id: 3,
      name: "Priya Sharma",
      location: "Karnataka",
      sustainabilityScore: 82,
      totalPoints: 2340,
      level: <TranslatedText>Sprout</TranslatedText>,
      avatar: "P",
      rank: 3,
      badges: [<TranslatedText>Mulch Master</TranslatedText>, <TranslatedText>Water Warrior</TranslatedText>],
      completedQuests: 22
    },
    {
      id: 4,
      name: "Rajesh Singh",
      location: "Gujarat",
      sustainabilityScore: 78,
      totalPoints: 2180,
      level: <TranslatedText>Sprout</TranslatedText>,
      avatar: "R",
      rank: 4,
      badges: [<TranslatedText>Mulch Master</TranslatedText>, <TranslatedText>Compost King</TranslatedText>],
      completedQuests: 20
    },
    {
      id: 5,
      name: "Ramesh Patel",
      location: "Gujarat",
      sustainabilityScore: 75,
      totalPoints: 1980,
      level: <TranslatedText>Sprout</TranslatedText>,
      avatar: "R",
      rank: 5,
      badges: [<TranslatedText>Mulch Master</TranslatedText>],
      completedQuests: 18
    }
  ]

  const forumTopics = [
    {
      id: 1,
      title: <TranslatedText>Best practices for organic pest control?</TranslatedText>,
      author: "Sita Devi",
      replies: 12,
      views: 156,
      lastActivity: <TranslatedText>2 hours ago</TranslatedText>,
      category: <TranslatedText>Pest Management</TranslatedText>,
      tags: ["organic", "pest-control", "tips"]
    },
    {
      id: 2,
      title: <TranslatedText>Drip irrigation system recommendations</TranslatedText>,
      author: "Amit Kumar",
      replies: 8,
      views: 89,
      lastActivity: <TranslatedText>5 hours ago</TranslatedText>,
      category: <TranslatedText>Water Management</TranslatedText>,
      tags: ["irrigation", "water-saving", "equipment"]
    },
    {
      id: 3,
      title: <TranslatedText>Crop rotation planning for wheat and pulses</TranslatedText>,
      author: "Priya Sharma",
      replies: 15,
      views: 234,
      lastActivity: <TranslatedText>1 day ago</TranslatedText>,
      category: <TranslatedText>Crop Management</TranslatedText>,
      tags: ["crop-rotation", "wheat", "pulses", "planning"]
    },
    {
      id: 4,
      title: "Solar panel installation experience",
      author: "Rajesh Singh",
      replies: 6,
      views: 67,
      lastActivity: "2 days ago",
      category: "Energy",
      tags: ["solar", "installation", "experience"]
    },
    {
      id: 5,
      title: <TranslatedText>Composting in hot climate</TranslatedText>,
      author: "Ramesh Patel",
      replies: 10,
      views: 123,
      lastActivity: <TranslatedText>3 days ago</TranslatedText>,
      category: <TranslatedText>Soil Health</TranslatedText>,
      tags: ["composting", "hot-climate", "soil-health"]
    }
  ]

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-1'
    if (rank === 2) return 'rank-2'
    if (rank === 3) return 'rank-3'
    return 'rank-other'
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Pest Management': 'bg-purple-100 text-purple-800',
      'Water Management': 'bg-blue-100 text-blue-800',
      'Crop Management': 'bg-orange-100 text-orange-800',
      'Energy': 'bg-yellow-100 text-yellow-800',
      'Soil Health': 'bg-green-100 text-green-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (selectedProfile) {
    const profile = selectedProfile
    return (
      <div className="page-transition">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedProfile(null)}
            className="flex items-center text-green-600 hover:text-green-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <TranslatedText>Back to Community</TranslatedText>
          </button>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all mb-8">
            <div className="flex items-center space-x-6 mb-6">
                             <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">{profile.avatar}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                <div className="flex items-center space-x-4 text-text-light">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </div>
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2" />
                    {profile.level}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-green">{profile.sustainabilityScore}%</div>
                <div className="text-text-light"><TranslatedText>Sustainability Score</TranslatedText></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-yellow">{profile.totalPoints}</div>
                <div className="text-text-light"><TranslatedText>Total Points</TranslatedText></div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-orange">{profile.completedQuests}</div>
                <div className="text-text-light"><TranslatedText>Quests Completed</TranslatedText></div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-xl font-semibold mb-4"><TranslatedText>Badges Earned</TranslatedText></h3>
              <div className="flex flex-wrap gap-2">
                {profile.badges.map((badge, index) => (
                  <span key={index} className="badge badge-success">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
  <div className="animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-emerald-600 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <TranslatedText>Back to Home</TranslatedText>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-dark mb-4"><TranslatedText>Community Hub</TranslatedText></h1>
          <p className="text-xl text-text-light max-w-2xl mx-auto">
            <TranslatedText>Connect with fellow farmers, share knowledge, and celebrate achievements together.</TranslatedText>
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-border-light">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-primary-green text-white'
                  : 'text-text-light hover:text-primary-green'
              }`}
            >
              <Trophy className="w-5 h-5 inline mr-2" />
              <TranslatedText>Leaderboard</TranslatedText>
            </button>
            <button
              onClick={() => setActiveTab('forums')}
              className={`px-6 py-3 rounded-md font-medium transition-colors ${
                activeTab === 'forums'
                  ? 'bg-primary-green text-white'
                  : 'text-text-light hover:text-primary-green'
              }`}
            >
              <MessageCircle className="w-5 h-5 inline mr-2" />
              <TranslatedText>Forums</TranslatedText>
            </button>
          </div>
        </div>

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold"><TranslatedText>Top Farmers</TranslatedText></h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-light" />
                  <input
                    type="text"
                    placeholder="Search farmers..."
                    className="pl-10 pr-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
                                 <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                   <Filter className="w-4 h-2 mr-2" />
                   Filter
                 </button>
              </div>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((farmer) => (
                <div
                  key={farmer.id}
                  className="leaderboard-item cursor-pointer"
                  onClick={() => setSelectedProfile(farmer)}
                >
                  <div className={`leaderboard-rank ${getRankClass(farmer.rank)}`}>
                    {farmer.rank}
                  </div>
                                     <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-semibold">{farmer.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{farmer.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-text-light">
                      <span>{farmer.location}</span>
                      <span>•</span>
                      <span>{farmer.level}</span>
                      <span>•</span>
                      <span>{farmer.completedQuests} quests</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{farmer.sustainabilityScore}%</div>
                    <div className="text-sm text-text-light">{farmer.totalPoints} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Forums Tab */}
        {activeTab === 'forums' && (
          <div className="space-y-6">
            {/* Create New Topic */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Start a new discussion..."
                    className="w-full px-4 py-3 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                  />
                </div>
                                 <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                   <MessageSquare className="w-5 h-5 mr-2" />
                   Post
                 </button>
              </div>
            </div>

            {/* Forum Topics */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Discussions</h2>
                <div className="flex items-center space-x-2">
                                     <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                     <TrendingUp className="w-4 h-4 mr-2" />
                     Trending
                   </button>
                   <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition-colors inline-flex items-center">
                     <Calendar className="w-4 h-4 mr-2" />
                     Latest
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                {forumTopics.map((topic) => (
                  <div key={topic.id} className="border border-border-light rounded-lg p-4 hover:bg-bg-light transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(topic.category)}`}>
                            {topic.category}
                          </span>
                          <span className="text-sm text-text-light">by {topic.author}</span>
                        </div>
                                                 <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-green-600">
                          {topic.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-text-light">
                          <span className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {topic.replies} replies
                          </span>
                          <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {topic.views} views
                          </span>
                          <span>{topic.lastActivity}</span>
                        </div>
                      </div>
                                             <div className="flex items-center space-x-2">
                         <button className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50">
                           <Heart className="w-5 h-5" />
                         </button>
                         <button className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50">
                           <Bookmark className="w-5 h-5" />
                         </button>
                         <button className="p-2 text-gray-600 hover:text-green-600 rounded-lg hover:bg-green-50">
                           <Share2 className="w-5 h-5" />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityPage
