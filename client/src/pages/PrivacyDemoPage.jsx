import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  Globe,
  UserX,
  Download,
  Trash2,
  AlertTriangle,
  Info,
  CheckCircle,
  Settings,
  Key,
  Database,
  Share2,
  FileText,
  Clock,
  MapPin
} from 'lucide-react'

const PrivacyDemoPage = ({ onBack, currentLanguage }) => {
  const [settings, setSettings] = useState({
    // Profile Visibility
    profileVisibility: 'public', // public, farmers-only, private
    showLocation: true,
    showFarmDetails: true,
    showContactInfo: false,
    showQuestProgress: true,
    
    // Activity Privacy
    showOnlineStatus: true,
    showRecentActivity: false,
    allowMessageFromStrangers: false,
    showInSearchResults: true,
    
    // Data Collection
    allowDataCollection: true,
    allowAnalytics: true,
    allowLocationTracking: false,
    allowPersonalizedContent: true,
    
    // Communication
    allowNewsletters: false,
    allowSurveyInvitations: true,
    allowThirdPartyEmails: false,
    
    // Content Sharing
    allowContentSharing: true,
    watermarkSharedContent: true,
    requireAttribution: true
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [showDataDownload, setShowDataDownload] = useState(false)
  const [showAccountDeletion, setShowAccountDeletion] = useState(false)

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    console.log('Saving privacy settings:', settings)
    setHasChanges(false)
  }

  const downloadData = () => {
    console.log('Downloading user data...')
    setShowDataDownload(false)
  }

  const deleteAccount = () => {
    console.log('Account deletion requested...')
    setShowAccountDeletion(false)
  }

  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
        enabled ? 'bg-emerald-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  const RadioGroup = ({ value, onChange, options, name }) => (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="text-emerald-600 focus:ring-emerald-500"
          />
          <div>
            <div className="font-medium text-slate-800">{option.label}</div>
            {option.description && (
              <div className="text-sm text-slate-600">{option.description}</div>
            )}
          </div>
        </label>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                <TranslatedText>Back to Profile</TranslatedText>
              </span>
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              <TranslatedText>Privacy Settings</TranslatedText>
            </h1>

            {hasChanges && (
              <button
                onClick={saveSettings}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <TranslatedText>Save Changes</TranslatedText>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
        <div className="space-y-8">
          {/* Privacy Overview */}
          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  <TranslatedText>Your Privacy Matters</TranslatedText>
                </h2>
                <p className="text-blue-700">
                  <TranslatedText>Control how your information is shared and used on our platform</TranslatedText>
                </p>
              </div>
            </div>
            <p className="text-sm text-blue-700">
              <TranslatedText>We are committed to protecting your privacy and giving you control over your personal information. Adjust these settings to match your comfort level.</TranslatedText>
            </p>
          </div>

          {/* Profile Visibility */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Profile Visibility</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Control who can see your profile information</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-slate-800 mb-3">
                  <TranslatedText>Who can see your profile?</TranslatedText>
                </h3>
                <RadioGroup
                  value={settings.profileVisibility}
                  onChange={(value) => updateSetting('profileVisibility', value)}
                  name="profileVisibility"
                  options={[
                    {
                      value: 'public',
                      label: 'Public',
                      description: 'Anyone can view your profile'
                    },
                    {
                      value: 'farmers-only',
                      label: 'Verified Farmers Only',
                      description: 'Only registered farmers can see your profile'
                    },
                    {
                      value: 'private',
                      label: 'Private',
                      description: 'Only you can see your profile information'
                    }
                  ]}
                />
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Show Location</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Display your farming region to help connect with nearby farmers</TranslatedText>
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.showLocation}
                    onChange={(value) => updateSetting('showLocation', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Info className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Show Farm Details</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Display crop types, farm size, and farming methods</TranslatedText>
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.showFarmDetails}
                    onChange={(value) => updateSetting('showFarmDetails', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-slate-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Show Quest Progress</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Display completed quests and earned badges</TranslatedText>
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.showQuestProgress}
                    onChange={(value) => updateSetting('showQuestProgress', value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Privacy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Activity & Communication</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Control how you appear to other users</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Show Online Status</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Let others know when you're active on the platform</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.showOnlineStatus}
                  onChange={(value) => updateSetting('showOnlineStatus', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Show Recent Activity</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Display your recent quests and community interactions</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.showRecentActivity}
                  onChange={(value) => updateSetting('showRecentActivity', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Allow Messages from Anyone</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Receive messages from farmers you haven't connected with</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.allowMessageFromStrangers}
                  onChange={(value) => updateSetting('allowMessageFromStrangers', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Appear in Search Results</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Allow others to find you when searching for farmers</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.showInSearchResults}
                  onChange={(value) => updateSetting('showInSearchResults', value)}
                />
              </div>
            </div>
          </div>

          {/* Data Collection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Database className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Data Collection & Analytics</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Choose how your data is used to improve our services</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Anonymous Usage Analytics</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Help us improve the platform by sharing anonymous usage data</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.allowAnalytics}
                  onChange={(value) => updateSetting('allowAnalytics', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Location-Based Services</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Use your location for weather updates and local farming insights</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.allowLocationTracking}
                  onChange={(value) => updateSetting('allowLocationTracking', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Personalized Content</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Customize quests and content based on your farming interests</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.allowPersonalizedContent}
                  onChange={(value) => updateSetting('allowPersonalizedContent', value)}
                />
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-slate-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Account Management</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Manage your account data and privacy rights</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      <TranslatedText>Download Your Data</TranslatedText>
                    </p>
                    <p className="text-sm text-slate-600">
                      <TranslatedText>Get a copy of all your personal data we have stored</TranslatedText>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDataDownload(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Request Data</TranslatedText>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      <TranslatedText>Delete Account</TranslatedText>
                    </p>
                    <p className="text-sm text-slate-600">
                      <TranslatedText>Permanently remove your account and all associated data</TranslatedText>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAccountDeletion(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Delete Account</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Download Modal */}
        {showDataDownload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <Download className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  <TranslatedText>Request Your Data</TranslatedText>
                </h3>
              </div>
              <p className="text-slate-600 mb-6">
                <TranslatedText>We'll prepare a complete export of your personal data including profile information, quest progress, and community activity. You'll receive a download link via email within 48 hours.</TranslatedText>
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDataDownload(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Cancel</TranslatedText>
                </button>
                <button
                  onClick={downloadData}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Request Export</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Account Deletion Modal */}
        {showAccountDeletion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-slate-800">
                  <TranslatedText>Delete Account</TranslatedText>
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                <TranslatedText>Are you sure you want to permanently delete your account? This action cannot be undone and will result in:</TranslatedText>
              </p>
              <ul className="text-sm text-slate-600 mb-6 space-y-1">
                <li>• <TranslatedText>Loss of all profile data and farm information</TranslatedText></li>
                <li>• <TranslatedText>Deletion of quest progress and earned badges</TranslatedText></li>
                <li>• <TranslatedText>Removal of all community posts and discussions</TranslatedText></li>
                <li>• <TranslatedText>Permanent loss of account access</TranslatedText></li>
              </ul>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAccountDeletion(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Keep Account</TranslatedText>
                </button>
                <button
                  onClick={deleteAccount}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  <TranslatedText>Delete Forever</TranslatedText>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            <TranslatedText>Demo Privacy Controls</TranslatedText>
          </h3>
          <p className="text-blue-700 mb-4">
            <TranslatedText>This is a demonstration of privacy settings. In a real implementation, this would integrate with:</TranslatedText>
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong><TranslatedText>Privacy Framework:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>GDPR compliance for European users</li>
                <li>CCPA compliance for California residents</li>
                <li>Data encryption and secure storage</li>
                <li>Regular privacy audits</li>
              </ul>
            </div>
            <div>
              <strong><TranslatedText>Advanced Features:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Consent management platform</li>
                <li>Data retention policies</li>
                <li>Third-party data sharing controls</li>
                <li>Privacy impact assessments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyDemoPage
