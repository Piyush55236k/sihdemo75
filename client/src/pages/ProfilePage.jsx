import React, { useState } from 'react'
import { User, MapPin, Phone, Mail, Edit2, Save, X, Camera } from 'lucide-react'

const ProfilePage = ({ onBack, currentLanguage }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: currentLanguage === 'hi' ? 'राहुल शर्मा' : 'Rahul Sharma',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@email.com',
    location: currentLanguage === 'hi' ? 'पंजाब, भारत' : 'Punjab, India',
    farmSize: currentLanguage === 'hi' ? '5 एकड़' : '5 Acres',
    experience: currentLanguage === 'hi' ? '8 साल' : '8 Years',
    crops: currentLanguage === 'hi' ? 'गेहूं, चावल, कपास' : 'Wheat, Rice, Cotton',
    profileImage: '/api/placeholder/150/150'
  })

  const [editData, setEditData] = useState(profileData)

  const handleSave = () => {
    setProfileData(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
  }

  const ProfileField = ({ icon: Icon, label, value, field }) => (
    <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-green-500 mt-0.5" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          {label}
        </label>
        {isEditing ? (
          <input
            type="text"
            value={editData[field]}
            onChange={(e) => setEditData({...editData, [field]: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        ) : (
          <p className="text-gray-800 font-medium">{value}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          {onBack && (
            <button
              onClick={onBack}
              className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {currentLanguage === 'hi' ? 'प्रोफाइल' : 'Profile'}
            </h1>
            <p className="text-gray-600">
              {currentLanguage === 'hi' 
                ? 'अपनी जानकारी देखें और अपडेट करें'
                : 'View and update your information'}
            </p>
          </div>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {currentLanguage === 'hi' ? 'संपादित करें' : 'Edit'}
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {currentLanguage === 'hi' ? 'सेव करें' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              {currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Profile Image and Basic Info */}
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <div className="text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-green-500 focus:outline-none text-center md:text-left"
              />
            ) : (
              <h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
            )}
            <p className="text-gray-600 mt-1">
              {currentLanguage === 'hi' ? 'किसान' : 'Farmer'}
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {currentLanguage === 'hi' ? 'संपर्क जानकारी' : 'Contact Information'}
          </h3>
          
          <ProfileField
            icon={Phone}
            label={currentLanguage === 'hi' ? 'फोन नंबर' : 'Phone Number'}
            value={profileData.phone}
            field="phone"
          />
          
          <ProfileField
            icon={Mail}
            label={currentLanguage === 'hi' ? 'ईमेल' : 'Email'}
            value={profileData.email}
            field="email"
          />
          
          <ProfileField
            icon={MapPin}
            label={currentLanguage === 'hi' ? 'स्थान' : 'Location'}
            value={profileData.location}
            field="location"
          />
        </div>

        {/* Farm Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
            {currentLanguage === 'hi' ? 'खेत की जानकारी' : 'Farm Information'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {currentLanguage === 'hi' ? 'खेत का आकार' : 'Farm Size'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.farmSize}
                  onChange={(e) => setEditData({...editData, farmSize: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profileData.farmSize}</p>
              )}
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {currentLanguage === 'hi' ? 'अनुभव' : 'Experience'}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.experience}
                  onChange={(e) => setEditData({...editData, experience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-800 font-medium">{profileData.experience}</p>
              )}
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              {currentLanguage === 'hi' ? 'मुख्य फसलें' : 'Main Crops'}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.crops}
                onChange={(e) => setEditData({...editData, crops: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-800 font-medium">{profileData.crops}</p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-green-500">15</div>
          <div className="text-sm text-gray-600">
            {currentLanguage === 'hi' ? 'सलाह ली गई' : 'Advice Taken'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-blue-500">8</div>
          <div className="text-sm text-gray-600">
            {currentLanguage === 'hi' ? 'कीट जांच' : 'Pest Checks'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">12</div>
          <div className="text-sm text-gray-600">
            {currentLanguage === 'hi' ? 'बाजार खोज' : 'Market Searches'}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 text-center">
          <div className="text-2xl font-bold text-purple-500">92%</div>
          <div className="text-sm text-gray-600">
            {currentLanguage === 'hi' ? 'सटीकता' : 'Accuracy'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
