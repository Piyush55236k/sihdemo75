import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Globe, 
  Shield, 
  Smartphone,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Save,
  LogOut,
  HelpCircle,
  Info,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, signOut, userProfile, updateUserProfile } = useAuth();
  
  const [settings, setSettings] = useState({
    // Notification Settings
    notifications: {
      weather: true,
      market: true,
      pest: true,
      quest: true,
      push: true,
      email: false,
      sms: false
    },
    
    // Display Settings
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    
    // Privacy Settings
    profileVisibility: 'public',
    shareLocation: true,
    analytics: true,
    
    // App Settings
    autoSync: true,
    offlineMode: false,
    soundEffects: true,
    animations: true,
    
    // Farm Settings
    units: 'metric',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'display', name: 'Display', icon: Smartphone },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'app', name: 'App Settings', icon: SettingsIcon },
    { id: 'about', name: 'About', icon: Info }
  ];

  useEffect(() => {
    loadSettings();
  }, [user]);

  const loadSettings = () => {
    if (!user) return;
    
    const saved = localStorage.getItem(`demo_settings_${user.id}`);
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  };

  const saveSettings = async (newSettings = settings) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      localStorage.setItem(`demo_settings_${user.id}`, JSON.stringify(newSettings));
      
      // Update profile if language changed
      if (newSettings.language !== settings.language) {
        await updateUserProfile({ language: newSettings.language });
      }
      
      setTimeout(() => {
        setIsLoading(false);
        alert('Settings saved successfully!');
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert('Error saving settings');
    }
  };

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    };
    setSettings(newSettings);
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
      navigate('/');
    }
  };

  const exportData = () => {
    const data = {
      profile: userProfile,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem(`demo_settings_${user.id}`);
      setSettings({
        notifications: {
          weather: true,
          market: true,
          pest: true,
          quest: true,
          push: true,
          email: false,
          sms: false
        },
        theme: 'light',
        language: 'en',
        fontSize: 'medium',
        profileVisibility: 'public',
        shareLocation: true,
        analytics: true,
        autoSync: true,
        offlineMode: false,
        soundEffects: true,
        animations: true,
        units: 'metric',
        currency: 'INR',
        timezone: 'Asia/Kolkata'
      });
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={userProfile?.full_name || ''}
            onChange={(e) => updateUserProfile({ full_name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={userProfile?.email || user?.email || ''}
            disabled
            className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
          <input
            type="tel"
            value={userProfile?.phone || ''}
            onChange={(e) => updateUserProfile({ phone: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
          <input
            type="text"
            value={userProfile?.farm_name || ''}
            onChange={(e) => updateUserProfile({ farm_name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => navigate('/profile-setup')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Edit Complete Profile
        </button>
        <button
          onClick={exportData}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Types</h3>
        <div className="space-y-4">
          {Object.entries({
            weather: 'Weather Alerts',
            market: 'Market Updates',
            pest: 'Pest Warnings',
            quest: 'Quest Updates'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[key]}
                  onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Methods</h3>
        <div className="space-y-4">
          {Object.entries({
            push: 'Push Notifications',
            email: 'Email Notifications',
            sms: 'SMS Notifications'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium">{label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications[key]}
                  onChange={(e) => updateSetting('notifications', key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDisplaySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', '', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => updateSetting('language', '', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
          <option value="gu">ગુજરાતી (Gujarati)</option>
          <option value="ta">தமிழ் (Tamil)</option>
          <option value="te">తెలుగు (Telugu)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
        <select
          value={settings.fontSize}
          onChange={(e) => updateSetting('fontSize', '', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Units</label>
        <select
          value={settings.units}
          onChange={(e) => updateSetting('units', '', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
        >
          <option value="metric">Metric (kg, km, °C)</option>
          <option value="imperial">Imperial (lb, miles, °F)</option>
        </select>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
        <select
          value={settings.profileVisibility}
          onChange={(e) => updateSetting('profileVisibility', '', e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>

      <div className="space-y-4">
        {Object.entries({
          shareLocation: 'Share Location for Weather',
          analytics: 'Help Improve App with Analytics'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => updateSetting(key, '', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        {Object.entries({
          autoSync: 'Auto Sync Data',
          offlineMode: 'Offline Mode',
          soundEffects: 'Sound Effects',
          animations: 'Animations'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => updateSetting(key, '', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <button
          onClick={resetSettings}
          className="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset to Default
        </button>
        
        <button
          onClick={handleSignOut}
          className="w-full px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <SettingsIcon className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Smart Farming Assistant</h3>
        <p className="text-gray-600 mb-4">Version 1.0.0</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
        <ul className="space-y-2 text-gray-600">
          <li>• Real-time weather updates</li>
          <li>• Market price tracking</li>
          <li>• Pest detection and management</li>
          <li>• Interactive quest system</li>
          <li>• Crop calendar and reminders</li>
          <li>• Multi-language support</li>
        </ul>
      </div>

      <div className="space-y-3">
        <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center">
          <HelpCircle className="w-4 h-4 mr-2" />
          Help & Support
        </button>
        
        <button className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
          Privacy Policy
        </button>
        
        <button className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
          Terms of Service
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'display': return renderDisplaySettings();
      case 'privacy': return renderPrivacySettings();
      case 'app': return renderAppSettings();
      case 'about': return renderAbout();
      default: return renderProfileSettings();
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
              <SettingsIcon className="w-6 h-6 mr-2" />
              Settings
            </h1>
            <p className="text-gray-600">Customize your farming experience</p>
          </div>
        </div>

        <button
          onClick={saveSettings}
          disabled={isLoading}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="space-y-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;