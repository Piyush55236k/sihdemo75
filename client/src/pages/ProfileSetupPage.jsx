import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Home,
  Leaf,
  Calendar,
  Save,
  Upload,
  Camera,
  Check
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider_Real';

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    profileImage: '',
    
    // Farm Information
    farmName: '',
    farmAddress: '',
    farmSize: '',
    farmType: 'mixed', // mixed, organic, conventional
    soilType: '',
    irrigationType: '',
    
    // Crop Preferences
    primaryCrops: [],
    secondaryCrops: [],
    farmingExperience: '',
    
    // Preferences
    language: 'en',
    notifications: {
      weather: true,
      market: true,
      pest: true,
      quest: true
    }
  });

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Farm Details', icon: Home },
    { id: 3, title: 'Crop Preferences', icon: Leaf },
    { id: 4, title: 'Settings', icon: Calendar }
  ];

  const cropOptions = [
    'Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Potato', 'Tomato', 
    'Onion', 'Soybean', 'Mustard', 'Groundnut', 'Barley', 'Jowar', 'Bajra'
  ];

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        fullName: userProfile.full_name || '',
        email: userProfile.email || user?.email || '',
        phone: userProfile.phone || '',
        farmName: userProfile.farm_name || '',
        farmAddress: userProfile.farm_address || '',
        farmSize: userProfile.farm_size || '',
        primaryCrops: userProfile.primary_crops || [],
        language: userProfile.language || 'en'
      }));
    }
  }, [userProfile, user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCropToggle = (crop, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].includes(crop) 
        ? prev[type].filter(c => c !== crop)
        : [...prev[type], crop]
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
        setFormData(prev => ({ ...prev, profileImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600">
            <Camera className="w-4 h-4" />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Enter your full name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="+91 XXXXX XXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );

  const renderFarmDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Name</label>
          <input
            type="text"
            value={formData.farmName}
            onChange={(e) => handleInputChange('farmName', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Your farm name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size (in acres)</label>
          <input
            type="number"
            value={formData.farmSize}
            onChange={(e) => handleInputChange('farmSize', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            placeholder="Enter farm size"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Address</label>
          <textarea
            value={formData.farmAddress}
            onChange={(e) => handleInputChange('farmAddress', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
            rows="3"
            placeholder="Enter complete farm address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farm Type</label>
          <select
            value={formData.farmType}
            onChange={(e) => handleInputChange('farmType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="mixed">Mixed Farming</option>
            <option value="organic">Organic Farming</option>
            <option value="conventional">Conventional Farming</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Soil Type</label>
          <select
            value={formData.soilType}
            onChange={(e) => handleInputChange('soilType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Soil Type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="loamy">Loamy</option>
            <option value="silty">Silty</option>
            <option value="black">Black Cotton</option>
            <option value="red">Red Soil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Irrigation Type</label>
          <select
            value={formData.irrigationType}
            onChange={(e) => handleInputChange('irrigationType', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Irrigation Type</option>
            <option value="drip">Drip Irrigation</option>
            <option value="sprinkler">Sprinkler</option>
            <option value="flood">Flood Irrigation</option>
            <option value="rain">Rain Fed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Farming Experience</label>
          <select
            value={formData.farmingExperience}
            onChange={(e) => handleInputChange('farmingExperience', e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Experience</option>
            <option value="beginner">Beginner (0-2 years)</option>
            <option value="intermediate">Intermediate (3-10 years)</option>
            <option value="experienced">Experienced (10+ years)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCropPreferences = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Primary Crops (Select main crops)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cropOptions.map(crop => (
            <label key={crop} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.primaryCrops.includes(crop)}
                onChange={() => handleCropToggle(crop, 'primaryCrops')}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm">{crop}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Secondary Crops (Optional)</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cropOptions.filter(crop => !formData.primaryCrops.includes(crop)).map(crop => (
            <label key={crop} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.secondaryCrops.includes(crop)}
                onChange={() => handleCropToggle(crop, 'secondaryCrops')}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">{crop}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
        <select
          value={formData.language}
          onChange={(e) => handleInputChange('language', e.target.value)}
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
        <label className="block text-sm font-medium text-gray-700 mb-4">Notification Preferences</label>
        <div className="space-y-3">
          {Object.entries({
            weather: 'Weather Alerts',
            market: 'Market Price Updates',
            pest: 'Pest & Disease Warnings',
            quest: 'Quest & Achievement Updates'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>{label}</span>
              <input
                type="checkbox"
                checked={formData.notifications[key]}
                onChange={(e) => handleInputChange('notifications', {
                  ...formData.notifications,
                  [key]: e.target.checked
                })}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderFarmDetails();
      case 3: return renderCropPreferences();
      case 4: return renderSettings();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Profile Setup</h1>
          <p className="text-gray-600">Complete your farmer profile</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  isCompleted ? 'bg-green-500 border-green-500 text-white' :
                  isActive ? 'border-green-500 text-green-500' : 'border-gray-300 text-gray-400'
                }`}>
                  {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
                <div className="ml-3">
                  <div className={`font-medium ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-1 w-16 mx-4 rounded ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep === steps.length ? (
            <button
              onClick={handleSave}
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
                  Complete Setup
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;