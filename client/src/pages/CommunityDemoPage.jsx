import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Share2,
  Heart,
  MessageCircle,
  Eye,
  Search,
  Filter,
  Plus,
  Award,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Video,
  FileText,
  ExternalLink,
  ThumbsUp,
  Clock
} from 'lucide-react'

const CommunityDemoPage = ({ onBack, currentLanguage }) => {
  const [activeTab, setActiveTab] = useState('discussions')
  const [selectedPost, setSelectedPost] = useState(null)

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: MessageSquare },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'experts', label: 'Ask Experts', icon: Lightbulb }
  ]

  const discussions = [
    {
      id: 1,
      title: 'Best organic fertilizers for monsoon season',
      author: 'Rajesh Kumar',
      avatar: '👨‍🌾',
      location: 'Punjab, India',
      time: '2 hours ago',
      category: 'Crop Management',
      content: 'Fellow farmers, I\'m looking for recommendations on organic fertilizers that work best during monsoon season. My wheat crop needs nutrition but I want to avoid chemical fertilizers...',
      likes: 24,
      replies: 8,
      views: 156,
      tags: ['organic', 'fertilizer', 'monsoon', 'wheat'],
      featured: true
    },
    {
      id: 2,
      title: 'Successful drip irrigation setup - sharing my experience',
      author: 'Priya Sharma',
      avatar: '👩‍🌾',
      location: 'Maharashtra, India',
      time: '5 hours ago',
      category: 'Water Management',
      content: 'Hi everyone! I recently completed the Water Conservation Quest and wanted to share my drip irrigation setup experience. Here are some practical tips and cost breakdown...',
      likes: 42,
      replies: 15,
      views: 289,
      tags: ['drip-irrigation', 'water-conservation', 'setup-guide'],
      hasImages: true
    },
    {
      id: 3,
      title: 'Pest control without chemicals - need urgent help',
      author: 'Amit Patel',
      avatar: '👨‍🌾',
      location: 'Gujarat, India',
      time: '8 hours ago',
      category: 'Pest Management',
      content: 'My cotton crop is facing severe aphid attack. Looking for immediate organic solutions. Has anyone tried neem oil spray effectively? What concentration should I use?',
      likes: 18,
      replies: 22,
      views: 234,
      tags: ['pest-control', 'organic', 'aphids', 'cotton', 'urgent'],
      urgent: true
    },
    {
      id: 4,
      title: 'Market prices for tomatoes - let\'s share updates',
      author: 'Sunita Devi',
      avatar: '👩‍🌾',
      location: 'Uttar Pradesh, India',
      time: '1 day ago',
      category: 'Market Updates',
      content: 'Starting a thread for sharing current tomato market prices across different regions. This will help all of us make better selling decisions...',
      likes: 67,
      replies: 31,
      views: 456,
      tags: ['market-prices', 'tomatoes', 'selling'],
      pinned: true
    }
  ]

  const events = [
    {
      id: 1,
      title: 'Sustainable Farming Workshop',
      date: '2024-02-15',
      time: '10:00 AM - 4:00 PM',
      location: 'Community Center, Ludhiana',
      type: 'Workshop',
      attendees: 45,
      maxAttendees: 60,
      organizer: 'FarmTech Solutions',
      description: 'Learn about sustainable farming practices, organic certification process, and connect with like-minded farmers.',
      tags: ['sustainable', 'organic', 'workshop'],
      fee: 'Free',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Drone Technology in Agriculture Demo',
      date: '2024-02-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Agricultural University, Chandigarh',
      type: 'Demo',
      attendees: 28,
      maxAttendees: 40,
      organizer: 'AgriTech India',
      description: 'Live demonstration of drone technology for crop monitoring, pest detection, and precision farming applications.',
      tags: ['technology', 'drones', 'demo'],
      fee: '₹500',
      status: 'upcoming'
    },
    {
      id: 3,
      title: 'Organic Certification Guidance Session',
      date: '2024-02-10',
      time: '11:00 AM - 2:00 PM',
      location: 'Online (Zoom)',
      type: 'Webinar',
      attendees: 120,
      maxAttendees: 200,
      organizer: 'Organic India Association',
      description: 'Complete guide to organic certification process, documentation requirements, and market opportunities.',
      tags: ['organic', 'certification', 'webinar'],
      fee: 'Free',
      status: 'completed'
    }
  ]

  const knowledgeBase = [
    {
      id: 1,
      title: 'Complete Guide to Organic Farming',
      type: 'Article',
      category: 'Sustainable Farming',
      readTime: '15 min read',
      author: 'Dr. Agricultural Expert',
      rating: 4.8,
      views: 1234,
      description: 'Comprehensive guide covering soil preparation, organic fertilizers, pest management, and certification process.',
      tags: ['organic', 'sustainable', 'complete-guide']
    },
    {
      id: 2,
      title: 'Water Conservation Techniques Video Series',
      type: 'Video',
      category: 'Water Management',
      duration: '45 minutes',
      author: 'FarmWater Solutions',
      rating: 4.9,
      views: 856,
      description: '6-part video series covering drip irrigation, rainwater harvesting, and efficient water usage methods.',
      tags: ['water-conservation', 'video-series', 'irrigation']
    },
    {
      id: 3,
      title: 'Crop Disease Identification Chart',
      type: 'Resource',
      category: 'Plant Health',
      fileSize: '2.5 MB PDF',
      author: 'Plant Pathology Institute',
      downloads: 2341,
      views: 3456,
      description: 'Visual guide for identifying common crop diseases with symptoms, causes, and treatment recommendations.',
      tags: ['disease-identification', 'chart', 'plant-health']
    }
  ]

  const experts = [
    {
      id: 1,
      name: 'Dr. Ravi Krishnan',
      specialization: 'Soil Science & Organic Farming',
      experience: '15+ years',
      rating: 4.9,
      responses: 234,
      avatar: '👨‍🔬',
      status: 'online',
      lastActive: 'Active now',
      expertise: ['Soil Health', 'Organic Certification', 'Crop Rotation'],
      languages: ['English', 'Hindi', 'Tamil']
    },
    {
      id: 2,
      name: 'Prof. Meera Singh',
      specialization: 'Plant Pathology & Pest Management',
      experience: '20+ years',
      rating: 4.8,
      responses: 189,
      avatar: '👩‍🔬',
      status: 'busy',
      lastActive: '2 hours ago',
      expertise: ['Disease Management', 'Integrated Pest Management', 'Biological Control'],
      languages: ['English', 'Hindi', 'Punjabi']
    },
    {
      id: 3,
      name: 'Eng. Suresh Patel',
      specialization: 'Agricultural Engineering & Technology',
      experience: '12+ years',
      rating: 4.7,
      responses: 156,
      avatar: '👨‍💼',
      status: 'away',
      lastActive: '1 day ago',
      expertise: ['Farm Mechanization', 'Irrigation Systems', 'Post-Harvest Technology'],
      languages: ['English', 'Hindi', 'Gujarati']
    }
  ]

  const renderDiscussions = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Filter className="w-5 h-5 text-slate-600" />
          <span><TranslatedText>Filter</TranslatedText></span>
        </button>
        <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-5 h-5" />
          <span><TranslatedText>New Post</TranslatedText></span>
        </button>
      </div>

      {/* Discussions List */}
      <div className="space-y-4">
        {discussions.map(discussion => (
          <div
            key={discussion.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 border transition-all hover:shadow-lg cursor-pointer ${
              discussion.featured ? 'border-emerald-200 bg-emerald-50/50' :
              discussion.urgent ? 'border-red-200 bg-red-50/50' :
              discussion.pinned ? 'border-blue-200 bg-blue-50/50' :
              'border-white/50'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{discussion.avatar}</div>
                <div>
                  <h3 className="font-semibold text-slate-800 hover:text-emerald-600 transition-colors">
                    {discussion.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mt-1">
                    <span>{discussion.author}</span>
                    <span>•</span>
                    <MapPin className="w-3 h-3" />
                    <span>{discussion.location}</span>
                    <span>•</span>
                    <Clock className="w-3 h-3" />
                    <span>{discussion.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {discussion.featured && (
                  <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                    <TranslatedText>Featured</TranslatedText>
                  </span>
                )}
                {discussion.urgent && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                    <TranslatedText>Urgent</TranslatedText>
                  </span>
                )}
                {discussion.pinned && (
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    <TranslatedText>Pinned</TranslatedText>
                  </span>
                )}
                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                  {discussion.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <p className="text-slate-600 mb-4 line-clamp-2">{discussion.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {discussion.tags.map(tag => (
                <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{discussion.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{discussion.replies}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{discussion.views}</span>
                </div>
              </div>
              
              <button className="flex items-center space-x-1 text-slate-400 hover:text-emerald-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="text-sm"><TranslatedText>Share</TranslatedText></span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <div key={event.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-700' :
                event.status === 'completed' ? 'bg-slate-100 text-slate-600' :
                'bg-blue-100 text-blue-700'
              }`}>
                <TranslatedText>{event.status}</TranslatedText>
              </span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">
                {event.type}
              </span>
            </div>

            <h3 className="font-semibold text-slate-800 mb-2">{event.title}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>

            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()} | {event.time}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>{event.attendees}/{event.maxAttendees} attendees</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-emerald-600">{event.fee}</span>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <TranslatedText>View Details</TranslatedText>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderKnowledgeBase = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {knowledgeBase.map(item => (
          <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {item.type}
              </span>
              <div className="flex items-center space-x-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(item.rating || 0) ? 'text-yellow-500' : 'text-slate-300'}>
                    ★
                  </span>
                ))}
                <span className="text-slate-600 text-xs ml-1">
                  {item.rating || '—'}
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{item.description}</p>

            <div className="space-y-2 text-sm text-slate-600 mb-4">
              <div className="flex items-center justify-between">
                <span>Category</span>
                <span className="font-medium">{item.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Duration/Size</span>
                <span className="font-medium">{item.readTime || item.duration || item.fileSize}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Views</span>
                <span className="font-medium">{item.views}</span>
              </div>
            </div>

            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
              {item.type === 'Video' && <Video className="w-4 h-4" />}
              {item.type === 'Article' && <FileText className="w-4 h-4" />}
              {item.type === 'Resource' && <ExternalLink className="w-4 h-4" />}
              <span><TranslatedText>Access {item.type}</TranslatedText></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderExperts = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map(expert => (
          <div key={expert.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="text-3xl">{expert.avatar}</div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  expert.status === 'online' ? 'bg-green-500' :
                  expert.status === 'busy' ? 'bg-red-500' :
                  'bg-slate-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">{expert.name}</h3>
                <p className="text-sm text-slate-600">{expert.specialization}</p>
                <p className="text-xs text-slate-500">{expert.lastActive}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Experience</span>
                <span className="font-medium text-slate-800">{expert.experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Rating</span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium text-slate-800">{expert.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Responses</span>
                <span className="font-medium text-slate-800">{expert.responses}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">Expertise</p>
              <div className="flex flex-wrap gap-2">
                {expert.expertise.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium transition-colors">
              <TranslatedText>Ask Question</TranslatedText>
            </button>
          </div>
        ))}
      </div>
    </div>
  )

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
              <TranslatedText>Farmer Community</TranslatedText>
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
            <TranslatedText>Connect, Learn, and Grow Together</TranslatedText>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <TranslatedText>Join thousands of farmers sharing knowledge, solving problems, and building a stronger agricultural community.</TranslatedText>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50">
            <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">15,234</div>
            <div className="text-sm text-slate-600">
              <TranslatedText>Active Farmers</TranslatedText>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50">
            <MessageSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">3,456</div>
            <div className="text-sm text-slate-600">
              <TranslatedText>Discussions</TranslatedText>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50">
            <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">89</div>
            <div className="text-sm text-slate-600">
              <TranslatedText>Expert Advisors</TranslatedText>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/50">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-800">24/7</div>
            <div className="text-sm text-slate-600">
              <TranslatedText>Community Support</TranslatedText>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/80 text-slate-700 hover:bg-emerald-50 border border-white/50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span><TranslatedText>{tab.label}</TranslatedText></span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50">
          {activeTab === 'discussions' && renderDiscussions()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'knowledge' && renderKnowledgeBase()}
          {activeTab === 'experts' && renderExperts()}
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6 text-center">
          <HelpCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            <TranslatedText>Demo Community Features</TranslatedText>
          </h3>
          <p className="text-blue-700 mb-4">
            <TranslatedText>This is a demonstration of community features. In a real implementation, this would connect to your backend API to provide:</TranslatedText>
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong><TranslatedText>API Integration Points:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Real-time discussions and messaging</li>
                <li>User authentication and profiles</li>
                <li>Event management and RSVP system</li>
                <li>Knowledge base content management</li>
              </ul>
            </div>
            <div>
              <strong><TranslatedText>Additional Features:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Expert consultation booking</li>
                <li>File uploads and media sharing</li>
                <li>Push notifications for responses</li>
                <li>Multi-language content support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityDemoPage
