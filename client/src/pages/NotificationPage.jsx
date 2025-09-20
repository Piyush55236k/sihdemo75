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
import { useAuth } from '../components/AuthProvider';

const NotificationPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

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
    loadNotifications();
    // Simulate real-time notifications
    const interval = setInterval(generateRandomNotification, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`demo_notifications_${user.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    } else {
      // Initialize with demo notifications
      const demoNotifications = generateDemoNotifications();
      setNotifications(demoNotifications);
      setUnreadCount(demoNotifications.filter(n => !n.read).length);
      saveNotifications(demoNotifications);
    }
  };

  const saveNotifications = (notifs) => {
    if (user) {
      localStorage.setItem(`demo_notifications_${user.id}`, JSON.stringify(notifs));
    }
  };

  const generateDemoNotifications = () => {
    const now = new Date();
    return [
      {
        id: '1',
        type: 'weather',
        title: 'Weather Alert',
        message: 'Heavy rainfall expected in your area tomorrow. Protect your crops.',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'high'
      },
      {
        id: '2',
        type: 'market',
        title: 'Price Update',
        message: 'Wheat prices increased by 12% in your local market.',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'medium'
      },
      {
        id: '3',
        type: 'quest',
        title: 'Quest Completed!',
        message: 'You earned 50 points for completing "Soil Testing" quest.',
        timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'low'
      },
      {
        id: '4',
        type: 'pest',
        title: 'Pest Warning',
        message: 'Aphid infestation reported in nearby farms. Check your crops.',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        priority: 'high'
      },
      {
        id: '5',
        type: 'reminder',
        title: 'Fertilizer Schedule',
        message: 'Time to apply fertilizer to your wheat crop.',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        priority: 'medium'
      }
    ];
  };

  const generateRandomNotification = () => {
    const types = ['weather', 'market', 'pest', 'quest', 'reminder'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const messages = {
      weather: [
        'Clear skies expected for the next 3 days - perfect for harvesting!',
        'Temperature dropping tonight - protect sensitive plants.',
        'High humidity levels detected - monitor for fungal diseases.'
      ],
      market: [
        'Rice prices up 8% in your region.',
        'New buyer looking for organic vegetables in your area.',
        'Fertilizer costs decreased by 5% this week.'
      ],
      pest: [
        'Locust swarm spotted 50km away - take precautions.',
        'Brown plant hopper detected in rice fields nearby.',
        'Recommended spraying schedule for current season.'
      ],
      quest: [
        'New quest available: "Water Conservation Challenge"',
        'Weekly farming tip quest is ready!',
        'Complete 3 more tasks to reach next level!'
      ],
      reminder: [
        'Irrigation scheduled for tomorrow morning.',
        'Check soil moisture levels today.',
        'Update your crop calendar for next season.'
      ]
    };

    const newNotification = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1) + ' Update',
      message: messages[type][Math.floor(Math.random() * messages[type].length)],
      timestamp: new Date().toISOString(),
      read: false,
      priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low'
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      setUnreadCount(0);
      return updated;
    });
  };

  const deleteNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      setUnreadCount(updated.filter(n => !n.read).length);
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    saveNotifications([]);
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    return notification.type === filter;
  });

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
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
              <Bell className="w-6 h-6 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Stay updated with your farm activities</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unread' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
          {Object.keys(notificationTypes).map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                filter === type ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {React.createElement(notificationTypes[type].icon, { className: "w-4 h-4 mr-1" })}
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'You\'re all caught up!' : `No ${filter} notifications found.`}
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => {
            const NotificationIcon = notificationTypes[notification.type].icon;
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                  !notification.read ? 'bg-blue-50' : ''
                } hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${notificationTypes[notification.type].bg}`}>
                      <NotificationIcon className={`w-5 h-5 ${notificationTypes[notification.type].color}`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                          notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {notification.priority} priority
                        </span>
                        
                        <div className="flex space-x-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={clearAll}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center mx-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;