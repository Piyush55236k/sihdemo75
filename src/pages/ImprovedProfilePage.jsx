import React, { useState, useRef } from 'react'
import { useAuth } from '../components/AuthProvider'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Sprout,
  Camera,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  Bell,
  Globe,
  Shield,
  Award,
  BarChart3,
  Target,
  Calendar,
  Leaf
} from 'lucide-react'

const ProfilePage = ({ onBack, currentLanguage, onNavigate }) => {
  const { user, updateProfile, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)
  
  // Form data state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    farmSize: user?.farmSize || '',
    primaryCrops: user?.primaryCrops || [],
    experience: user?.experience || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || null
  })

  const cropOptions = [
    'wheat', 'rice', 'cotton', 'sugarcane', 'maize', 'soybean', 
    'mustard', 'gram', 'potato', 'onion', 'tomato', 'other'
  ]

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('फाइल का साइज 5MB से कम होना चाहिए (File size should be less than 5MB)')
      return
    }

    if (!file.type.startsWith('image/')) {
      setError('केवल इमेज फाइल अपलोड करें (Please upload only image files)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        profileImage: e.target.result
      }))
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleCropToggle = (crop) => {
    setFormData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop].slice(0, 5) // Max 5 crops
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('कृपया अपना नाम डालें (Please enter your name)')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      await updateProfile(formData)
      setSuccess('प्रोफाइल सफलतापूर्वक अपडेट हो गई (Profile updated successfully)')
      setIsEditing(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      location: user?.location || '',
      farmSize: user?.farmSize || '',
      primaryCrops: user?.primaryCrops || [],
      experience: user?.experience || '',
      bio: user?.bio || '',
      profileImage: user?.profileImage || null
    })
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const stats = [
    { 
      label: <TranslatedText>Level</TranslatedText>, 
      value: user?.level || 1, 
      icon: Award, 
      color: 'text-amber-600' 
    },
    { 
      label: <TranslatedText>Points</TranslatedText>, 
      value: user?.totalPoints || 0, 
      icon: Target, 
      color: 'text-emerald-600' 
    },
    { 
      label: <TranslatedText>Quests</TranslatedText>, 
      value: user?.completedQuests || 0, 
      icon: CheckCircle, 
      color: 'text-blue-600' 
    },
    { 
      label: <TranslatedText>Score</TranslatedText>, 
      value: `${user?.sustainabilityScore || 0}%`, 
      icon: BarChart3, 
      color: 'text-violet-600' 
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header - Responsive */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">
                <TranslatedText>Back to Home</TranslatedText>
              </span>
            </button>
            
            <h1 className="text-lg lg:text-xl font-bold text-slate-800">
              <TranslatedText>My Profile</TranslatedText>
            </h1>

            <div className="flex items-center space-x-2">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 lg:space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    <TranslatedText>Edit</TranslatedText>
                  </span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 lg:space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      <TranslatedText>Cancel</TranslatedText>
                    </span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium transition-colors flex items-center space-x-1 lg:space-x-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      <TranslatedText>Save</TranslatedText>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="max-w-4xl mx-auto px-4 lg:px-6 py-6 lg:py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <p className="text-green-700 text-sm">{success}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
                {/* Profile Image */}
                <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                  <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 lg:w-16 lg:h-16 text-white" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-full shadow-lg transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Basic Details */}
                <div className="flex-1 text-center sm:text-left">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your Name"
                        className="w-full text-xl lg:text-2xl font-bold bg-transparent border-b-2 border-emerald-300 focus:border-emerald-500 focus:outline-none pb-1"
                      />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Village, District, State"
                        className="w-full text-slate-600 bg-transparent border-b border-slate-300 focus:border-emerald-500 focus:outline-none pb-1"
                      />
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
                        {user?.name || <TranslatedText>Farmer Name</TranslatedText>}
                      </h2>
                      <p className="text-slate-600 flex items-center justify-center sm:justify-start mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {user?.location || <TranslatedText>Location not set</TranslatedText>}
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        <TranslatedText>Member since</TranslatedText> {
                          user?.joinedDate 
                            ? new Date(user.joinedDate).toLocaleDateString()
                            : <TranslatedText>Today</TranslatedText>
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Farm Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-emerald-600" />
                <TranslatedText>Farm Details</TranslatedText>
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Farm Size</TranslatedText>
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.farmSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, farmSize: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value=""><TranslatedText>Select size</TranslatedText></option>
                      <option value="small"><TranslatedText>Small (Under 2 acres)</TranslatedText></option>
                      <option value="medium"><TranslatedText>Medium (2-10 acres)</TranslatedText></option>
                      <option value="large"><TranslatedText>Large (10+ acres)</TranslatedText></option>
                    </select>
                  ) : (
                    <p className="text-slate-600 py-2">
                      {user?.farmSize ? (
                        <TranslatedText>
                          {user.farmSize === 'small' && 'Small (Under 2 acres)'}
                          {user.farmSize === 'medium' && 'Medium (2-10 acres)'}
                          {user.farmSize === 'large' && 'Large (10+ acres)'}
                        </TranslatedText>
                      ) : (
                        <TranslatedText>Not specified</TranslatedText>
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Experience</TranslatedText>
                  </label>
                  {isEditing ? (
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value=""><TranslatedText>Select experience</TranslatedText></option>
                      <option value="beginner"><TranslatedText>Beginner (0-2 years)</TranslatedText></option>
                      <option value="intermediate"><TranslatedText>Intermediate (3-10 years)</TranslatedText></option>
                      <option value="experienced"><TranslatedText>Experienced (10+ years)</TranslatedText></option>
                    </select>
                  ) : (
                    <p className="text-slate-600 py-2">
                      {user?.experience ? (
                        <TranslatedText>
                          {user.experience === 'beginner' && 'Beginner (0-2 years)'}
                          {user.experience === 'intermediate' && 'Intermediate (3-10 years)'}
                          {user.experience === 'experienced' && 'Experienced (10+ years)'}
                        </TranslatedText>
                      ) : (
                        <TranslatedText>Not specified</TranslatedText>
                      )}
                    </p>
                  )}
                </div>
              </div>

              {/* Primary Crops */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Primary Crops</TranslatedText>
                </label>
                {isEditing ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cropOptions.map(crop => (
                      <button
                        key={crop}
                        onClick={() => handleCropToggle(crop)}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          formData.primaryCrops.includes(crop)
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                        }`}
                      >
                        <TranslatedText>{crop}</TranslatedText>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(user?.primaryCrops || []).length > 0 ? (
                      user.primaryCrops.map((crop, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                        >
                          <TranslatedText>{crop}</TranslatedText>
                        </span>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm">
                        <TranslatedText>No crops selected</TranslatedText>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bio */}
              {(isEditing || user?.bio) && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TranslatedText>Bio</TranslatedText>
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about your farming journey..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-slate-600">
                      {user?.bio || <TranslatedText>No bio added yet</TranslatedText>}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                <TranslatedText>Your Progress</TranslatedText>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className={`w-12 h-12 ${stat.color.replace('text-', 'bg-')}/10 rounded-full flex items-center justify-center mx-auto mb-2`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className="text-xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-xs text-slate-600">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">
                <TranslatedText>Account</TranslatedText>
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => onNavigate?.('settings')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700">
                    <TranslatedText>Settings</TranslatedText>
                  </span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('notifications')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700">
                    <TranslatedText>Notifications</TranslatedText>
                  </span>
                </button>
                
                <button 
                  onClick={() => onNavigate?.('privacy')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span className="text-slate-700">
                    <TranslatedText>Privacy</TranslatedText>
                  </span>
                </button>
                
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span><TranslatedText>Sign Out</TranslatedText></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
