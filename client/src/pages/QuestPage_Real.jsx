import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trophy, 
  Star, 
  Clock, 
  Target, 
  Award, 
  ChevronRight,
  CheckCircle,
  Lock,
  Gift,
  Calendar,
  MapPin,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider_Real';
import { questService } from '../services/supabaseService';

const QuestPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updatePoints } = useAuth();
  const [quests, setQuests] = useState([]);
  const [userQuests, setUserQuests] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const tabs = [
    { id: 'available', label: 'Available', count: 0 },
    { id: 'active', label: 'In Progress', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 }
  ];

  useEffect(() => {
    loadQuests();
    loadUserQuests();
  }, [user]);

  const loadQuests = async () => {
    try {
      const { data, error } = await questService.getAllQuests();
      
      if (error) {
        console.error('Error loading quests:', error);
        return;
      }

      setQuests(data || []);
    } catch (err) {
      console.error('Error loading quests:', err);
    }
  };

  const loadUserQuests = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await questService.getUserQuests(user.id);
      
      if (error) {
        console.error('Error loading user quests:', error);
        return;
      }

      setUserQuests(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading user quests:', err);
      setLoading(false);
    }
  };

  const startQuest = async (questId) => {
    if (!user) return;
    
    try {
      const { error } = await questService.startQuest(user.id, questId);
      
      if (error) {
        console.error('Error starting quest:', error);
        return;
      }

      // Reload user quests to reflect the change
      loadUserQuests();
    } catch (err) {
      console.error('Error starting quest:', err);
    }
  };

  const completeQuest = async (questId, rewardPoints) => {
    if (!user) return;
    
    setCompleting(questId);
    
    try {
      const { error } = await questService.completeQuest(user.id, questId);
      
      if (error) {
        console.error('Error completing quest:', error);
        return;
      }

      // Update user points
      await updatePoints(rewardPoints);
      
      // Reload user quests to reflect the change
      loadUserQuests();
    } catch (err) {
      console.error('Error completing quest:', err);
    } finally {
      setCompleting(null);
    }
  };

  const getQuestStatus = (questId) => {
    const userQuest = userQuests.find(uq => uq.quest_id === questId);
    if (!userQuest) return 'available';
    return userQuest.status;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'planting': return <Target className="w-5 h-5" />;
      case 'harvesting': return <Gift className="w-5 h-5" />;
      case 'learning': return <Star className="w-5 h-5" />;
      case 'community': return <Users className="w-5 h-5" />;
      case 'seasonal': return <Calendar className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const filterQuests = (status) => {
    if (status === 'available') {
      return quests.filter(quest => !userQuests.find(uq => uq.quest_id === quest.id));
    }
    
    const statusQuests = userQuests.filter(uq => uq.status === status);
    return statusQuests.map(uq => {
      const quest = quests.find(q => q.id === uq.quest_id);
      return quest ? { ...quest, userQuest: uq } : null;
    }).filter(Boolean);
  };

  const QuestCard = ({ quest, status }) => {
    const isAvailable = status === 'available';
    const isInProgress = status === 'in_progress';
    const isCompleted = status === 'completed';
    const canComplete = isInProgress && quest.userQuest?.progress >= quest.target_value;

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-emerald-100'}`}>
              {isCompleted ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                getCategoryIcon(quest.category)
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{quest.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quest.difficulty)}`}>
                  {quest.difficulty}
                </span>
                <span className="text-sm text-gray-500">{quest.category}</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center text-emerald-600 font-semibold">
              <Zap className="w-4 h-4 mr-1" />
              {quest.reward_points} XP
            </div>
            {quest.estimated_duration && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <Clock className="w-3 h-3 mr-1" />
                {quest.estimated_duration}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4">{quest.description}</p>

        {quest.requirements && quest.requirements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Requirements:</h4>
            <ul className="space-y-1">
              {quest.requirements.map((req, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {isInProgress && quest.userQuest && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{quest.userQuest.progress} / {quest.target_value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((quest.userQuest.progress / quest.target_value) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {quest.location && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {quest.location}
              </div>
            )}
            {quest.season && (
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {quest.season}
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            {isAvailable && (
              <button
                onClick={() => startQuest(quest.id)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm"
              >
                Start Quest
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            )}

            {isInProgress && !canComplete && (
              <button
                disabled
                className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed flex items-center text-sm"
              >
                <Clock className="w-4 h-4 mr-1" />
                In Progress
              </button>
            )}

            {canComplete && (
              <button
                onClick={() => completeQuest(quest.id, quest.reward_points)}
                disabled={completing === quest.id}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm disabled:opacity-50"
              >
                {completing === quest.id ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Award className="w-4 h-4 mr-1" />
                )}
                Complete
              </button>
            )}

            {isCompleted && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Completed
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Update tab counts
  const availableCount = filterQuests('available').length;
  const activeCount = filterQuests('in_progress').length;
  const completedCount = filterQuests('completed').length;

  tabs[0].count = availableCount;
  tabs[1].count = activeCount;
  tabs[2].count = completedCount;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quests...</p>
        </div>
      </div>
    );
  }

  const currentQuests = filterQuests(activeTab === 'active' ? 'in_progress' : activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Trophy className="w-8 h-8 mr-3 text-emerald-600" />
                Farming Quests
              </h1>
              <p className="text-gray-600 mt-1">
                Complete challenges and earn XP to level up your farming skills
              </p>
            </div>
          </div>
          
          {userProfile && (
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">
                {userProfile.points} XP
              </div>
              <div className="text-sm text-gray-500">Level {userProfile.level}</div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{availableCount}</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{activeCount}</div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{completedCount}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{userProfile?.level || 1}</div>
                <div className="text-sm text-gray-500">Current Level</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {currentQuests.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'available' && 'No quests available'}
                  {activeTab === 'active' && 'No quests in progress'}
                  {activeTab === 'completed' && 'No completed quests'}
                </h3>
                <p className="text-gray-600">
                  {activeTab === 'available' && 'Check back later for new challenges!'}
                  {activeTab === 'active' && 'Start a quest to begin your farming journey.'}
                  {activeTab === 'completed' && 'Complete quests to build your achievement collection.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {currentQuests.map((quest) => (
                  <QuestCard 
                    key={quest.id} 
                    quest={quest} 
                    status={getQuestStatus(quest.id)} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;