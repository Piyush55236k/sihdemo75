import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  MessageCircle, 
  Heart, 
  Share2, 
  Plus, 
  Search, 
  Filter,
  Send,
  Image,
  Video,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Clock,
  MoreHorizontal,
  Flag,
  Bookmark,
  ThumbsUp,
  Eye
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [filter, setFilter] = useState('all');
  
  const tabs = [
    { id: 'feed', name: 'Feed', icon: MessageCircle },
    { id: 'questions', name: 'Q&A', icon: HelpCircle },
    { id: 'experts', name: 'Experts', icon: Award },
    { id: 'groups', name: 'Groups', icon: Users },
    { id: 'marketplace', name: 'Marketplace', icon: TrendingUp }
  ];

  const categories = [
    'All', 'Crop Care', 'Pest Control', 'Weather', 'Equipment', 'Market', 'Success Stories', 'Questions'
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    // Demo posts data
    const demoPosts = [
      {
        id: '1',
        user: {
          name: 'Raj Kumar',
          avatar: null,
          location: 'Punjab, India',
          expertise: 'Wheat Farming',
          verified: true
        },
        content: 'Just harvested my wheat crop! Thanks to the weather alerts, I was able to protect it from the recent rains. Yield increased by 15% this season! 🌾',
        images: ['/api/placeholder/400/300'],
        category: 'Success Stories',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 24,
        comments: 8,
        shares: 3,
        liked: false,
        bookmarked: false
      },
      {
        id: '2',
        user: {
          name: 'Priya Patel',
          avatar: null,
          location: 'Gujarat, India',
          expertise: 'Organic Farming',
          verified: false
        },
        content: 'Has anyone tried the new organic pest control method using neem oil? Looking for advice on dosage and application frequency. #OrganicFarming',
        category: 'Questions',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: 12,
        comments: 15,
        shares: 2,
        liked: true,
        bookmarked: true
      },
      {
        id: '3',
        user: {
          name: 'Dr. Sunita Sharma',
          avatar: null,
          location: 'Agricultural Expert',
          expertise: 'Plant Pathology',
          verified: true,
          expert: true
        },
        content: 'Important Alert: Brown plant hopper outbreak reported in several districts. Early symptoms include yellowing leaves and stunted growth. Apply recommended insecticides immediately. Link to treatment guide in comments.',
        category: 'Pest Control',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        likes: 45,
        comments: 22,
        shares: 18,
        liked: false,
        bookmarked: false,
        pinned: true
      },
      {
        id: '4',
        user: {
          name: 'Farmers Collective',
          avatar: null,
          location: 'Maharashtra, India',
          expertise: 'Group Admin',
          verified: true
        },
        content: 'Weather Update: Heavy rainfall expected in Maharashtra next week. Farmers are advised to:\n\n• Ensure proper drainage in fields\n• Postpone fertilizer application\n• Cover harvested crops\n• Check for water-logging\n\nStay safe! 🌧️',
        category: 'Weather',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        likes: 67,
        comments: 31,
        shares: 25,
        liked: true,
        bookmarked: false
      },
      {
        id: '5',
        user: {
          name: 'Amit Singh',
          avatar: null,
          location: 'Uttar Pradesh, India',
          expertise: 'Equipment Specialist',
          verified: false
        },
        content: 'Selling my John Deere tractor (2019 model) - excellent condition, only 1200 hours used. Perfect for medium-sized farms. Serious buyers only. DM for details and price.',
        category: 'Equipment',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        likes: 8,
        comments: 12,
        shares: 4,
        liked: false,
        bookmarked: false
      }
    ];
    
    setPosts(demoPosts);
  };

  const createPost = () => {
    if (!newPost.trim()) return;
    
    const post = {
      id: Date.now().toString(),
      user: {
        name: userProfile?.full_name || user?.name || 'Anonymous',
        avatar: null,
        location: userProfile?.farm_address || 'Unknown',
        expertise: 'Farmer',
        verified: false
      },
      content: newPost,
      category: 'General',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      bookmarked: false
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    setShowNewPost(false);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const toggleBookmark = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, bookmarked: !post.bookmarked }
        : post
    ));
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.category.toLowerCase().includes(filter.toLowerCase());
  });

  const renderPost = (post) => (
    <div key={post.id} className={`bg-white rounded-xl shadow-lg p-6 ${post.pinned ? 'border-l-4 border-green-500' : ''}`}>
      {post.pinned && (
        <div className="flex items-center text-green-600 text-sm font-medium mb-3">
          <Award className="w-4 h-4 mr-1" />
          Pinned Post
        </div>
      )}
      
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {post.user.name.charAt(0)}
            </span>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
              {post.user.verified && (
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  post.user.expert ? 'bg-purple-500' : 'bg-blue-500'
                }`}>
                  <Award className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3" />
              <span>{post.user.location}</span>
              <span>•</span>
              <span>{post.user.expertise}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{formatTime(post.timestamp)}</span>
            </div>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Category Tag */}
      <div className="mb-3">
        <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
        
        {post.images && (
          <div className="mt-3 grid grid-cols-1 gap-2">
            {post.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt="Post content" 
                  className="w-full h-48 object-cover bg-gray-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-6">
          <button
            onClick={() => toggleLike(post.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              post.liked ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
            <span className="font-medium">{post.likes}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{post.comments}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">{post.shares}</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleBookmark(post.id)}
            className={`p-2 rounded-lg transition-colors ${
              post.bookmarked ? 'bg-yellow-50 text-yellow-600' : 'hover:bg-gray-50 text-gray-400'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${post.bookmarked ? 'fill-current' : ''}`} />
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-400">
            <Flag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderNewPostForm = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold">
            {userProfile?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="flex-1">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your farming experience, ask questions, or help fellow farmers..."
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-green-500"
            rows="3"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
            <Image className="w-5 h-5" />
            <span>Photo</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
            <Video className="w-5 h-5" />
            <span>Video</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600">
            <MapPin className="w-5 h-5" />
            <span>Location</span>
          </button>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNewPost(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={createPost}
            disabled={!newPost.trim()}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-4 h-4 mr-2" />
            Post
          </button>
        </div>
      </div>
    </div>
  );

  const renderFeed = () => (
    <div>
      {/* Create Post Button */}
      {!showNewPost && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowNewPost(true)}
            className="w-full flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">
                {userProfile?.full_name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-gray-600">Share your farming experience...</span>
          </button>
        </div>
      )}

      {/* New Post Form */}
      {showNewPost && renderNewPostForm()}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Filter Posts</h3>
          <button className="text-green-600 hover:text-green-700 text-sm font-medium">
            Clear Filters
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilter(category.toLowerCase())}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === category.toLowerCase() || (filter === 'all' && category === 'All')
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {filteredPosts.map(renderPost)}
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="text-center py-12">
      <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Q&A Section</h3>
      <p className="text-gray-500 mb-6">Ask questions and get expert answers</p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Ask a Question
      </button>
    </div>
  );

  const renderExperts = () => (
    <div className="text-center py-12">
      <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Expert Network</h3>
      <p className="text-gray-500 mb-6">Connect with agricultural experts</p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Browse Experts
      </button>
    </div>
  );

  const renderGroups = () => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Farmer Groups</h3>
      <p className="text-gray-500 mb-6">Join local farming communities</p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Join Groups
      </button>
    </div>
  );

  const renderMarketplace = () => (
    <div className="text-center py-12">
      <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">Marketplace</h3>
      <p className="text-gray-500 mb-6">Buy and sell farming equipment</p>
      <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
        Browse Marketplace
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed': return renderFeed();
      case 'questions': return renderQuestions();
      case 'experts': return renderExperts();
      case 'groups': return renderGroups();
      case 'marketplace': return renderMarketplace();
      default: return renderFeed();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Farmer Community
            </h1>
            <p className="text-gray-600">Connect, share, and learn together</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search posts, farmers..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default CommunityPage;