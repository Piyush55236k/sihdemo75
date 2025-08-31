import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  Bell,
  BellOff,
  Smartphone,
  Mail,
  MessageSquare,
  Cloud,
  Droplets,
  Sun,
  Users,
  Trophy,
  Calendar,
  AlertTriangle,
  Clock,
  Volume2,
  VolumeX,
  Vibrate,
  Settings,
  Save,
  RotateCcw
} from 'lucide-react'

const NotificationsDemoPage = ({ onBack, currentLanguage }) => {
  const [settings, setSettings] = useState({
    // Push Notifications
    pushEnabled: true,
    pushQuests: true,
    pushCommunity: true,
    pushWeather: true,
    pushEvents: false,
    pushReminders: true,
    
    // SMS Notifications
    smsEnabled: false,
    smsWeatherAlerts: false,
    smsUrgentOnly: true,
    
    // Email Notifications
    emailEnabled: true,
    emailWeeklyDigest: true,
    emailQuestUpdates: false,
    emailCommunityMentions: true,
    emailMarketingUpdates: false,
    
    // Sound & Vibration
    soundEnabled: true,
    vibrationEnabled: true,
    quietHoursEnabled: true,
    quietStart: '22:00',
    quietEnd: '07:00',
    
    // Frequency Settings
    weatherFrequency: 'twice-daily',
    communityFrequency: 'immediate',
    questReminderFrequency: 'daily'
  })

  const [hasChanges, setHasChanges] = useState(false)

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    // In a real app, this would send settings to the backend
    console.log('Saving notification settings:', settings)
    setHasChanges(false)
    // Show success message
  }

  const resetSettings = () => {
    // Reset to default settings
    setSettings({
      pushEnabled: true,
      pushQuests: true,
      pushCommunity: true,
      pushWeather: true,
      pushEvents: false,
      pushReminders: true,
      smsEnabled: false,
      smsWeatherAlerts: false,
      smsUrgentOnly: true,
      emailEnabled: true,
      emailWeeklyDigest: true,
      emailQuestUpdates: false,
      emailCommunityMentions: true,
      emailMarketingUpdates: false,
      soundEnabled: true,
      vibrationEnabled: true,
      quietHoursEnabled: true,
      quietStart: '22:00',
      quietEnd: '07:00',
      weatherFrequency: 'twice-daily',
      communityFrequency: 'immediate',
      questReminderFrequency: 'daily'
    })
    setHasChanges(true)
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

  const SelectBox = ({ value, onChange, options }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
              <TranslatedText>Notification Settings</TranslatedText>
            </h1>

            <div className="flex items-center space-x-2">
              {hasChanges && (
                <>
                  <button
                    onClick={resetSettings}
                    className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
                    title="Reset to defaults"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={saveSettings}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span><TranslatedText>Save</TranslatedText></span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
        <div className="space-y-8">
          {/* Push Notifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Smartphone className="w-6 h-6 text-emerald-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Push Notifications</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Receive instant notifications on your device</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">
                    <TranslatedText>Enable Push Notifications</TranslatedText>
                  </h3>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Turn on/off all push notifications</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.pushEnabled}
                  onChange={(value) => updateSetting('pushEnabled', value)}
                />
              </div>

              {settings.pushEnabled && (
                <div className="ml-4 space-y-4 border-l-2 border-emerald-100 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-slate-800">
                          <TranslatedText>Quest Updates</TranslatedText>
                        </p>
                        <p className="text-sm text-slate-600">
                          <TranslatedText>New quests, progress updates, and completions</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={settings.pushQuests}
                      onChange={(value) => updateSetting('pushQuests', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-800">
                          <TranslatedText>Community Activity</TranslatedText>
                        </p>
                        <p className="text-sm text-slate-600">
                          <TranslatedText>Replies, mentions, and new discussions</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={settings.pushCommunity}
                      onChange={(value) => updateSetting('pushCommunity', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Cloud className="w-5 h-5 text-slate-600" />
                      <div>
                        <p className="font-medium text-slate-800">
                          <TranslatedText>Weather Alerts</TranslatedText>
                        </p>
                        <p className="text-sm text-slate-600">
                          <TranslatedText>Important weather updates and warnings</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={settings.pushWeather}
                      onChange={(value) => updateSetting('pushWeather', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-800">
                          <TranslatedText>Events & Workshops</TranslatedText>
                        </p>
                        <p className="text-sm text-slate-600">
                          <TranslatedText>Upcoming events and registration reminders</TranslatedText>
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={settings.pushEvents}
                      onChange={(value) => updateSetting('pushEvents', value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SMS Notifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>SMS Notifications</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Receive important updates via text message</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">
                    <TranslatedText>Enable SMS Notifications</TranslatedText>
                  </h3>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Standard message rates apply</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.smsEnabled}
                  onChange={(value) => updateSetting('smsEnabled', value)}
                />
              </div>

              {settings.smsEnabled && (
                <div className="ml-4 space-y-4 border-l-2 border-blue-100 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Weather Emergencies Only</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Critical weather alerts and warnings</TranslatedText>
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.smsWeatherAlerts}
                      onChange={(value) => updateSetting('smsWeatherAlerts', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Urgent Messages Only</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Limit SMS to critical updates</TranslatedText>
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.smsUrgentOnly}
                      onChange={(value) => updateSetting('smsUrgentOnly', value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Email Notifications */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Mail className="w-6 h-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Email Notifications</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Receive updates and summaries via email</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-800">
                    <TranslatedText>Enable Email Notifications</TranslatedText>
                  </h3>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Turn on/off all email notifications</TranslatedText>
                  </p>
                </div>
                <ToggleSwitch
                  enabled={settings.emailEnabled}
                  onChange={(value) => updateSetting('emailEnabled', value)}
                />
              </div>

              {settings.emailEnabled && (
                <div className="ml-4 space-y-4 border-l-2 border-purple-100 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Weekly Digest</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Summary of your farming activities and community highlights</TranslatedText>
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.emailWeeklyDigest}
                      onChange={(value) => updateSetting('emailWeeklyDigest', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Quest Updates</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>New quest releases and completion reminders</TranslatedText>
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.emailQuestUpdates}
                      onChange={(value) => updateSetting('emailQuestUpdates', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Community Mentions</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>When someone mentions you in discussions</TranslatedText>
                      </p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.emailCommunityMentions}
                      onChange={(value) => updateSetting('emailCommunityMentions', value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sound & Vibration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Volume2 className="w-6 h-6 text-orange-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Sound & Vibration</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Control how notifications alert you</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      <TranslatedText>Sound Alerts</TranslatedText>
                    </p>
                    <p className="text-sm text-slate-600">
                      <TranslatedText>Play sound for notifications</TranslatedText>
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.soundEnabled}
                  onChange={(value) => updateSetting('soundEnabled', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Vibrate className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-slate-800">
                      <TranslatedText>Vibration</TranslatedText>
                    </p>
                    <p className="text-sm text-slate-600">
                      <TranslatedText>Vibrate device for notifications</TranslatedText>
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  enabled={settings.vibrationEnabled}
                  onChange={(value) => updateSetting('vibrationEnabled', value)}
                />
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="font-medium text-slate-800">
                        <TranslatedText>Quiet Hours</TranslatedText>
                      </p>
                      <p className="text-sm text-slate-600">
                        <TranslatedText>Mute non-urgent notifications during specified hours</TranslatedText>
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch
                    enabled={settings.quietHoursEnabled}
                    onChange={(value) => updateSetting('quietHoursEnabled', value)}
                  />
                </div>

                {settings.quietHoursEnabled && (
                  <div className="ml-8 flex items-center space-x-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        <TranslatedText>From</TranslatedText>
                      </label>
                      <input
                        type="time"
                        value={settings.quietStart}
                        onChange={(e) => updateSetting('quietStart', e.target.value)}
                        className="block mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        <TranslatedText>To</TranslatedText>
                      </label>
                      <input
                        type="time"
                        value={settings.quietEnd}
                        onChange={(e) => updateSetting('quietEnd', e.target.value)}
                        className="block mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Frequency Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="w-6 h-6 text-slate-600" />
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  <TranslatedText>Notification Frequency</TranslatedText>
                </h2>
                <p className="text-slate-600 text-sm">
                  <TranslatedText>Control how often you receive different types of notifications</TranslatedText>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Weather Updates</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>How often to receive weather forecasts</TranslatedText>
                  </p>
                </div>
                <SelectBox
                  value={settings.weatherFrequency}
                  onChange={(value) => updateSetting('weatherFrequency', value)}
                  options={[
                    { value: 'twice-daily', label: 'Twice Daily' },
                    { value: 'daily', label: 'Once Daily' },
                    { value: 'urgent-only', label: 'Urgent Only' }
                  ]}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Community Activity</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>Frequency for community notifications</TranslatedText>
                  </p>
                </div>
                <SelectBox
                  value={settings.communityFrequency}
                  onChange={(value) => updateSetting('communityFrequency', value)}
                  options={[
                    { value: 'immediate', label: 'Immediate' },
                    { value: 'hourly', label: 'Hourly Summary' },
                    { value: 'daily', label: 'Daily Summary' }
                  ]}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">
                    <TranslatedText>Quest Reminders</TranslatedText>
                  </p>
                  <p className="text-sm text-slate-600">
                    <TranslatedText>How often to remind about pending quests</TranslatedText>
                  </p>
                </div>
                <SelectBox
                  value={settings.questReminderFrequency}
                  onChange={(value) => updateSetting('questReminderFrequency', value)}
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'never', label: 'Never' }
                  ]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6 text-center">
          <Bell className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            <TranslatedText>Demo Notification Settings</TranslatedText>
          </h3>
          <p className="text-blue-700 mb-4">
            <TranslatedText>This is a demonstration of notification preferences. In a real implementation, this would integrate with:</TranslatedText>
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong><TranslatedText>Push Notification Services:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Firebase Cloud Messaging (FCM)</li>
                <li>Apple Push Notification Service</li>
                <li>SMS gateway for text notifications</li>
                <li>Email service providers</li>
              </ul>
            </div>
            <div>
              <strong><TranslatedText>Advanced Features:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Geolocation-based weather alerts</li>
                <li>AI-powered notification scheduling</li>
                <li>Battery optimization settings</li>
                <li>Notification analytics and optimization</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsDemoPage
