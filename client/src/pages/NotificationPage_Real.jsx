import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  TrendingUp,
  Cloud,
  Bug,
  Trophy,
  Calendar,
  X,
  Settings,
  Filter,
  Check,
  Trash2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider_Real';
import { notificationService } from '../services/supabaseService';

const NotificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const notificationTypes = {
    weather: { icon: Cloud, color: 'text-blue-500', bg: 'bg-blue-50' },
    market: { icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50' },
    pest: { icon: Bug, color: 'text-red-500', bg: 'bg-red-50' },
    quest: { icon: Trophy, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    alert: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    reminder: { icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      
      // Subscribe to real-time notifications
      const subscription = notificationService.subscribeToNotifications(
        user.id,
        (payload) => {
          console.log('Real-time notification update:', payload);
          loadNotifications(); // Refresh notifications on change
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await notificationService.getNotifications(user.id);
      
      if (error) {
        setError('Failed to load notifications');
        console.error('Error loading notifications:', error);
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.read).length || 0);
      setError(null);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await notificationService.markAsRead(notificationId);
      
      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Update local state
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await notificationService.deleteNotification(notificationId);
      
      if (error) {
        console.error('Error deleting notification:', error);
        return;
      }

      // Update local state
      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    try {
      // Mark all unread notifications as read
      await Promise.all(
        unreadNotifications.map(notification => 
          notificationService.markAsRead(notification.id)
        )
      );

      // Update local state
      setNotifications(prev => prev.map(notification => ({ 
        ...notification, 
        read: true 
      })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await Promise.all(
        notifications.map(notification => 
          notificationService.deleteNotification(notification.id)
        )
      );

      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing all notifications:', err);
    }
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-white';
    }
  };

  const filteredNotifications = getFilteredNotifications();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

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
                <Bell className="w-8 h-8 mr-3 text-emerald-600" />
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
              </p>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={loadNotifications}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Unread ({unreadCount})
              </button>
              {Object.keys(notificationTypes).map(type => {
                const count = notifications.filter(n => n.type === type).length;
                if (count === 0) return null;
                
                return (
                  <button
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                      filter === type
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearAllNotifications}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' 
                  ? 'No notifications yet' 
                  : filter === 'unread'
                  ? 'No unread notifications'
                  : `No ${filter} notifications`
                }
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? "We'll notify you about important farm updates, weather alerts, and community activity."
                  : "Check back later for new updates."
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const typeConfig = notificationTypes[notification.type] || notificationTypes.info;
              const Icon = typeConfig.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all hover:shadow-md ${
                    !notification.read ? 'bg-blue-50 border-l-blue-500' : 'border-l-gray-300'
                  } ${getPriorityColor(notification.priority)}`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${typeConfig.bg}`}>
                      <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h3>
                          <p className="text-gray-700 mb-3">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatTimestamp(notification.created_at)}</span>
                            <span className="capitalize">{notification.type}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {notification.priority} priority
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;