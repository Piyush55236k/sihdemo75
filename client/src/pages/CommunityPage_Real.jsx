import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  Award,
  Send,
  Image,
  X,
  MoreHorizontal,
  Verified,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider_Real';
import { communityService } from '../services/supabaseService';

const CommunityPage = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', category: '', images: [] });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');

  const categories = [
    'All',
    'Success Stories',
    'Questions',
    'Pest Control',
    'Weather Updates',
    'Market Prices',
    'Equipment',
    'Seeds & Crops',
    'Organic Farming',
    'Technology'
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await communityService.getPosts();
      
      if (error) {
        setError('Failed to load community posts');
        console.error('Error loading posts:', error);
        return;
      }

      // Transform the data to match the expected format
      const transformedPosts = data?.map(post => ({
        ...post,
        user: {
          name: post.user_profiles?.full_name || 'Anonymous Farmer',
          location: post.user_profiles?.farm_name || 'Unknown Location',
          expertise: post.user_profiles?.farming_experience || 'Farmer',
          verified: post.user_profiles?.level >= 5 || false, // Verified if level 5+
          expert: post.user_profiles?.level >= 10 || false   // Expert if level 10+
        },
        liked: post.post_likes?.some(like => like.user_id === user?.id) || false,
        likes: post.likes_count || 0,
        comments: post.comments_count || 0,
        shares: post.shares_count || 0,
        timestamp: post.created_at,
        bookmarked: false // We'll implement bookmarks later
      })) || [];

      setPosts(transformedPosts);
      setError(null);
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load community posts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.content.trim() || !user) return;

    try {
      const { data, error } = await communityService.createPost(user.id, {
        content: newPost.content,
        category: newPost.category || 'General',
        images: newPost.images
      });

      if (error) {
        console.error('Error creating post:', error);
        return;
      }

      // Transform and add to posts
      const transformedPost = {
        ...data,
        user: {
          name: userProfile?.full_name || 'Anonymous Farmer',
          location: userProfile?.farm_name || 'Unknown Location',
          expertise: userProfile?.farming_experience || 'Farmer',
          verified: userProfile?.level >= 5 || false,
          expert: userProfile?.level >= 10 || false
        },
        liked: false,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: data.created_at,
        bookmarked: false
      };

      setPosts(prev => [transformedPost, ...prev]);
      setNewPost({ content: '', category: '', images: [] });
      setShowCreatePost(false);
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLike = async (postId) => {
    if (!user) return;

    try {
      const { liked, error } = await communityService.toggleLike(postId, user.id);
      
      if (error) {
        console.error('Error toggling like:', error);
        return;
      }

      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              liked, 
              likes: liked ? post.likes + 1 : post.likes - 1 
            }
          : post
      ));
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const loadComments = async (postId) => {
    try {
      const { data, error } = await communityService.getComments(postId);
      
      if (error) {
        console.error('Error loading comments:', error);
        return;
      }

      setComments(prev => ({
        ...prev,
        [postId]: data || []
      }));
    } catch (err) {
      console.error('Error loading comments:', err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !user) return;

    try {
      const { data, error } = await communityService.addComment(postId, user.id, newComment);
      
      if (error) {
        console.error('Error adding comment:', error);
        return;
      }

      // Update comments
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), data]
      }));

      // Update comment count
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments: post.comments + 1 }
          : post
      ));

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const getFilteredPosts = () => {
    let filtered = posts;

    if (filter !== 'all') {
      filtered = filtered.filter(post => 
        post.category?.toLowerCase() === filter.toLowerCase()
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community posts...</p>
        </div>
      </div>
    );
  }

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
                <Users className="w-8 h-8 mr-3 text-emerald-600" />
                Farmer Community
              </h1>
              <p className="text-gray-600 mt-1">
                Connect, share, and learn with fellow farmers
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Post
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <div>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={loadPosts}
                className="mt-1 text-red-600 hover:text-red-800 underline text-sm"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value.toLowerCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category.toLowerCase()}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filter !== 'all' 
                  ? 'No posts found' 
                  : 'No posts yet'
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Be the first to share your farming experience!'
                }
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.user.name?.charAt(0)?.toUpperCase() || 'F'}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
                          {post.user.verified && (
                            <Verified className="w-4 h-4 text-blue-500" />
                          )}
                          {post.user.expert && (
                            <Award className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>{formatTimestamp(post.timestamp)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{post.user.expertise}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mt-4">
                    <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                    
                    {post.category && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {post.category}
                        </span>
                      </div>
                    )}

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="rounded-lg object-cover h-48 w-full"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.liked 
                            ? 'text-red-500 hover:text-red-600' 
                            : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedPost(selectedPost === post.id ? null : post.id);
                          if (selectedPost !== post.id) {
                            loadComments(post.id);
                          }
                        }}
                        className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </button>
                      
                      <button className="flex items-center space-x-2 text-gray-500 hover:text-emerald-600 transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="text-sm font-medium">{post.shares}</span>
                      </button>
                    </div>
                    
                    <button className="text-gray-500 hover:text-emerald-600 transition-colors">
                      <Bookmark className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comments Section */}
                  {selectedPost === post.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="space-y-3 mb-4">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {comment.user_profiles?.full_name?.charAt(0)?.toUpperCase() || 'F'}
                            </div>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg px-3 py-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {comment.user_profiles?.full_name || 'Anonymous Farmer'}
                                </p>
                                <p className="text-sm text-gray-700">{comment.content}</p>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatTimestamp(comment.created_at)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {user && (
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {userProfile?.full_name?.charAt(0)?.toUpperCase() || 'F'}
                          </div>
                          <div className="flex-1 flex items-center space-x-2">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddComment(post.id);
                                }
                              }}
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              disabled={!newComment.trim()}
                              className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Create New Post</h2>
                  <button
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.slice(1).map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPost.content}
                      onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your farming experience, ask questions, or provide advice..."
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <button className="flex items-center text-gray-500 hover:text-gray-700">
                      <Image className="w-5 h-5 mr-2" />
                      Add Photos
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowCreatePost(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.content.trim()}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;