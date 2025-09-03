import React, { useState } from 'react'
import logo1 from '../../../logo1.jpg';
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import {
  Trophy,
  TrendingUp,
  Target,
  Award,
  Users,
  Leaf,
  Droplets,
  Sun,
  Zap,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod] = useState('week')

  // Mock data - in real app this would come from API
  const userData = {
    name: 'Alex Chen',
    level: 8,
    totalPoints: 2340,
    rank: 15,
    completedQuests: 12,
    sustainabilityScore: 85
  }

  const currentQuests = [
    {
      id: 1,
      title: <TranslatedText>Water Conservation Challenge</TranslatedText>,
      description: <TranslatedText>Reduce water usage by 20% this week</TranslatedText>,
      progress: 65,
      deadline: <TranslatedText>2 days left</TranslatedText>,
      rewards: { points: 150, badge: <TranslatedText>Water Guardian</TranslatedText> },
      difficulty: 'Medium'
    },
    {
      id: 2,
      title: <TranslatedText>Organic Fertilizer Trial</TranslatedText>,
      description: <TranslatedText>Switch to organic fertilizer for one crop section</TranslatedText>,
      progress: 30,
      deadline: <TranslatedText>5 days left</TranslatedText>,
      rewards: { points: 200, badge: <TranslatedText>Eco Pioneer</TranslatedText> },
      difficulty: 'Hard'
    }
  ]

  const recentAchievements = [
    {
      id: 1,
      title: <TranslatedText>First Harvest</TranslatedText>,
      description: <TranslatedText>Successfully completed your first sustainable harvest</TranslatedText>,
      icon: '🌾',
      points: 100,
      date: <TranslatedText>2 days ago</TranslatedText>
    },
    {
      id: 2,
      title: <TranslatedText>Water Saver</TranslatedText>,
      description: <TranslatedText>Reduced water consumption by 15% last month</TranslatedText>,
      icon: '💧',
      points: 75,
      date: <TranslatedText>1 week ago</TranslatedText>
    }
  ]

  const activityFeed = [
    {
      id: 1,
      user: <TranslatedText>Sarah M.</TranslatedText>,
      action: <TranslatedText>completed the Soil Health Quest</TranslatedText>,
      time: <TranslatedText>2 hours ago</TranslatedText>,
      avatar: 'SM'
    },
    {
      id: 2,
      user: <TranslatedText>Mike R.</TranslatedText>,
      action: <TranslatedText>earned the Composting Champion badge</TranslatedText>,
      time: <TranslatedText>4 hours ago</TranslatedText>,
      avatar: 'MR'
    },
    {
      id: 3,
      user: <TranslatedText>Elena P.</TranslatedText>,
      action: <TranslatedText>shared a tip about crop rotation</TranslatedText>,
      time: <TranslatedText>6 hours ago</TranslatedText>,
      avatar: 'EP'
    }
  ]

  const stats = [
    { label: <TranslatedText>CO2 Reduced</TranslatedText>, value: '1.2t', icon: <Leaf className="w-5 h-5" />, color: 'text-green-600' },
    { label: <TranslatedText>Water Saved</TranslatedText>, value: '850L', icon: <Droplets className="w-5 h-5" />, color: 'text-blue-600' },
    { label: <TranslatedText>Energy Used</TranslatedText>, value: '42kWh', icon: <Sun className="w-5 h-5" />, color: 'text-yellow-600' },
    { label: <TranslatedText>Efficiency</TranslatedText>, value: '+15%', icon: <Zap className="w-5 h-5" />, color: 'text-purple-600' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center space-x-4">
          <img src={logo1} alt="Agro_Mitra Logo" className="w-12 h-12 rounded-xl shadow-sm object-cover" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2"><TranslatedText>Welcome back to Agro_Mitra, {userData.name}!</TranslatedText> 👋</h1>
            <p className="text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <TranslatedText>Your Farm</TranslatedText> • {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress & Quests */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold"><TranslatedText>Your Progress</TranslatedText></h2>
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium"><TranslatedText>Sustainability Score</TranslatedText></span>
                  <span className="text-2xl font-bold text-green-600">{userData.sustainabilityScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-300 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${userData.sustainabilityScore}%` }}
                  ></div>
                </div>
                <p className="text-gray-600"><TranslatedText>Keep up the great work!</TranslatedText></p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-gradient-to-r from-green-500 to-green-300 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2"><TranslatedText>Level {userData.level}</TranslatedText></h3>
                  <p className="opacity-90"><TranslatedText>Sustainable Farmer</TranslatedText></p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-green-400/30">
                <p className="text-gray-600 mt-2"><TranslatedText>Total Points: {userData.totalPoints}</TranslatedText></p>
                <p className="text-gray-600"><TranslatedText>Rank: #{userData.rank}</TranslatedText></p>
              </div>
            </div>

            {/* Active Quests */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Target className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-2xl font-bold"><TranslatedText>Active Quests</TranslatedText></h2>
                </div>
                <span className="text-gray-600">{currentQuests.length} <TranslatedText>Active</TranslatedText></span>
              </div>
              
              <div className="space-y-4">
                {currentQuests.map((quest) => (
                  <div key={quest.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{quest.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{quest.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span><TranslatedText>Progress</TranslatedText></span>
                            <span className="font-medium">{quest.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${quest.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{quest.deadline}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span>{quest.rewards.points} pts</span>
                        </div>
                        <div className="flex items-center ml-4">
                          <Award className="w-4 h-4 text-purple-600 mr-1" />
                          <span className="text-sm">{quest.rewards.badge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Recent Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-6">
                <Award className="w-6 h-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold"><TranslatedText>Recent Achievements</TranslatedText></h2>
              </div>
              
              <div className="space-y-4">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{achievement.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{achievement.date}</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-medium">{achievement.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold"><TranslatedText>Community Activity</TranslatedText></h2>
              </div>
              
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">{activity.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
