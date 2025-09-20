import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  User, 
  Bell, 
  Eye, 
  Shield, 
  Smartphone, 
  Download,
  Save,
  Check,
  AlertCircle,
  Moon,
  Sun,
  Globe,
  Trash2
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider_Real';
import { settingsService } from '../services/supabaseService';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications_enabled: true,
    weather_alerts: true,
    market_updates: true,
    quest_reminders: true,
    language: 'en',
    theme: 'light'
  });
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone: '',
    address: '',
    farm_name: '',
    farm_address: '',
    farm_size: '',
    farm_type: 'mixed',
    farming_experience: '',
    main_crops: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'display', label: 'Display', icon: Eye },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'app', label: 'App Settings', icon: Smartphone },
    { id: 'data', label: 'Data & Export', icon: Download }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' }
  ];

  const cropOptions = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 
    'Onion', 'Soybean', 'Mustard', 'Groundnut', 'Barley', 'Jowar', 'Bajra'
  ];

  useEffect(() => {
    loadUserSettings();
    loadUserProfile();
  }, [user]);

  const loadUserSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await settingsService.getUserSettings(user.id);
      
      if (error) {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const loadUserProfile = async () => {
    if (!userProfile) return;
    
    try {
      setProfileData({
        full_name: userProfile.full_name || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        farm_name: userProfile.farm_name || '',
        farm_address: userProfile.farm_address || '',
        farm_size: userProfile.farm_size || '',
        farm_type: userProfile.farm_type || 'mixed',
        farming_experience: userProfile.farming_experience || '',
        main_crops: userProfile.main_crops || []
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading profile:', err);
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const { error } = await settingsService.updateUserSettings(user.id, settings);
      
      if (error) {
        setError('Failed to save settings');
        console.error('Error saving settings:', error);
        return;
      }

      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const { error } = await updateProfile({
        ...profileData,
        profile_completed: true
      });
      
      if (error) {
        setError('Failed to save profile');
        console.error('Error saving profile:', error);
        return;
      }

      setSuccess('Profile saved successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const exportUserData = async () => {
    try {
      const userData = {
        profile: userProfile,
        settings: settings,
        export_date: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farming-platform-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setSuccess('Data exported successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const handleCropToggle = (crop) => {
    setProfileData(prev => ({
      ...prev,
      main_crops: prev.main_crops.includes(crop)
        ? prev.main_crops.filter(c => c !== crop)
        : [...prev.main_crops, crop]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            value={profileData.full_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={profileData.phone}
            onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
        <textarea
          value={profileData.address}
          onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
          <input
            type="text"
            value={profileData.farm_name}
            onChange={(e) => setProfileData(prev => ({ ...prev, farm_name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (acres)</label>
          <input
            type="number"
            value={profileData.farm_size}
            onChange={(e) => setProfileData(prev => ({ ...prev, farm_size: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Farm Address</label>
        <textarea
          value={profileData.farm_address}
          onChange={(e) => setProfileData(prev => ({ ...prev, farm_address: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Farm Type</label>
        <select
          value={profileData.farm_type}
          onChange={(e) => setProfileData(prev => ({ ...prev, farm_type: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="mixed">Mixed Farming</option>
          <option value="organic">Organic Farming</option>
          <option value="conventional">Conventional Farming</option>
          <option value="sustainable">Sustainable Farming</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience</label>
        <select
          value={profileData.farming_experience}
          onChange={(e) => setProfileData(prev => ({ ...prev, farming_experience: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner (0-2 years)</option>
          <option value="intermediate">Intermediate (3-10 years)</option>
          <option value="experienced">Experienced (11-20 years)</option>
          <option value="expert">Expert (20+ years)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Main Crops</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cropOptions.map(crop => (
            <label key={crop} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.main_crops.includes(crop)}
                onChange={() => handleCropToggle(crop)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">{crop}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Profile
        </button>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications on your device</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, notifications_enabled: !prev.notifications_enabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.notifications_enabled ? 'bg-emerald-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.notifications_enabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Weather Alerts</h3>
            <p className="text-sm text-gray-500">Get notified about weather changes</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, weather_alerts: !prev.weather_alerts }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.weather_alerts ? 'bg-emerald-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.weather_alerts ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Market Updates</h3>
            <p className="text-sm text-gray-500">Receive crop price and market information</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, market_updates: !prev.market_updates }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.market_updates ? 'bg-emerald-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.market_updates ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Quest Reminders</h3>
            <p className="text-sm text-gray-500">Get reminded about farming quests and challenges</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, quest_reminders: !prev.quest_reminders }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.quest_reminders ? 'bg-emerald-600' : 'bg-gray-200'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.quest_reminders ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
        <select
          value={settings.language}
          onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="light"
              name="theme"
              value="light"
              checked={settings.theme === 'light'}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="light" className="flex items-center space-x-2 cursor-pointer">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>Light Mode</span>
            </label>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              id="dark"
              name="theme"
              value="dark"
              checked={settings.theme === 'dark'}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="dark" className="flex items-center space-x-2 cursor-pointer">
              <Moon className="w-4 h-4 text-gray-600" />
              <span>Dark Mode</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          disabled={saving}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {saving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Export Your Data</h3>
        <p className="text-sm text-blue-700 mb-4">
          Download a copy of your profile data, settings, and activity. This includes your personal information, farm details, and preferences.
        </p>
        <button
          onClick={exportUserData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'display': return renderDisplayTab();
      case 'privacy': return (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy Settings</h3>
          <p className="text-gray-600">Privacy controls coming soon...</p>
        </div>
      );
      case 'app': return (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">App Settings</h3>
          <p className="text-gray-600">App preferences coming soon...</p>
        </div>
      );
      case 'data': return renderDataTab();
      default: return null;
    }
  };

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
                <Settings className="w-8 h-8 mr-3 text-emerald-600" />
                Settings
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-8">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;