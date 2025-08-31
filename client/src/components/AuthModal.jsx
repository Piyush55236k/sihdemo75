import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  Phone, 
  Shield, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Smartphone,
  Lock,
  User,
  MapPin,
  Sprout
} from 'lucide-react'

const AuthModal = ({ isOpen, onClose, mode = 'login' }) => {
  const { sendOTP, verifyOTP, completeProfile } = useAuth()
  const [step, setStep] = useState('phone') // phone, otp, profile
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showOtpHint, setShowOtpHint] = useState(false)
  
  // Profile completion state
  const [profileData, setProfileData] = useState({
    name: '',
    location: '',
    farmSize: '',
    primaryCrops: [],
    experience: '',
    preferredLanguage: 'hi'
  })

  const cropOptions = [
    'wheat', 'rice', 'cotton', 'sugarcane', 'maize', 'soybean', 
    'mustard', 'gram', 'potato', 'onion', 'tomato', 'other'
  ]

  useEffect(() => {
    if (!isOpen) {
      setStep('phone')
      setPhoneNumber('')
      setOtp('')
      setError('')
      setProfileData({
        name: '',
        location: '',
        farmSize: '',
        primaryCrops: [],
        experience: '',
        preferredLanguage: 'hi'
      })
    }
  }, [isOpen])

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2')
    }
    return cleaned.substring(0, 10).replace(/(\d{5})(\d{5})/, '$1 $2')
  }

  const handleSendOTP = async () => {
    const cleanPhone = phoneNumber.replace(/\s/g, '')
    if (cleanPhone.length !== 10) {
      setError('कृपया सही मोबाइल नंबर डालें (Please enter valid mobile number)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await sendOTP(`+91${cleanPhone}`)
      setStep('otp')
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      setError('कृपया OTP डालें (Please enter OTP)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const cleanPhone = phoneNumber.replace(/\s/g, '')
      const response = await verifyOTP(`+91${cleanPhone}`, otp)
      
      if (response.user.profileComplete) {
        onClose()
      } else {
        setStep('profile')
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteProfile = async () => {
    if (!profileData.name.trim()) {
      setError('कृपया अपना नाम डालें (Please enter your name)')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      await completeProfile(profileData)
      onClose()
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCropToggle = (crop) => {
    setProfileData(prev => ({
      ...prev,
      primaryCrops: prev.primaryCrops.includes(crop)
        ? prev.primaryCrops.filter(c => c !== crop)
        : [...prev.primaryCrops, crop].slice(0, 5) // Max 5 crops
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative">
          <button
            onClick={step === 'phone' ? onClose : () => setStep('phone')}
            className="absolute left-4 top-6 p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              {step === 'phone' && <Smartphone className="w-8 h-8" />}
              {step === 'otp' && <Lock className="w-8 h-8" />}
              {step === 'profile' && <User className="w-8 h-8" />}
            </div>
            <h2 className="text-xl font-bold">
              {step === 'phone' && <TranslatedText>Welcome to FarmWise</TranslatedText>}
              {step === 'otp' && <TranslatedText>Verify Your Number</TranslatedText>}
              {step === 'profile' && <TranslatedText>Complete Your Profile</TranslatedText>}
            </h2>
            <p className="text-emerald-100 mt-1">
              {step === 'phone' && <TranslatedText>Enter your mobile number to get started</TranslatedText>}
              {step === 'otp' && <TranslatedText>Enter the 6-digit code sent to your phone</TranslatedText>}
              {step === 'profile' && <TranslatedText>Tell us about your farm</TranslatedText>}
            </p>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-96">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Phone Number Step */}
          {step === 'phone' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Mobile Number</TranslatedText>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-gray-500">
                    <span className="text-sm font-medium">+91</span>
                    <div className="w-px h-4 bg-gray-300" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    placeholder="98765 43210"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    maxLength="11"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <TranslatedText>We'll send you a verification code via SMS</TranslatedText>
                </p>
                
                {/* Demo Notice */}
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-700">
                      <p className="font-medium mb-1">
                        <TranslatedText>Demo Mode</TranslatedText>
                      </p>
                      <p>
                        <TranslatedText>No real SMS will be sent. You can use any 10-digit number and use OTP: 123456 or 1234</TranslatedText>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSendOTP}
                disabled={isLoading || phoneNumber.replace(/\s/g, '').length !== 10}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span><TranslatedText>Send OTP</TranslatedText></span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  <TranslatedText>Code sent to</TranslatedText> +91 {phoneNumber}
                </p>
                <div className="relative">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-widest"
                    maxLength="6"
                  />
                  <button
                    onClick={() => setShowOtpHint(!showOtpHint)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOtpHint ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {showOtpHint && (
                  <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700">
                      <TranslatedText>For demo: use 123456 or 1234</TranslatedText>
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.length < 4}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span><TranslatedText>Verify & Continue</TranslatedText></span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  <TranslatedText>Resend Code</TranslatedText>
                </button>
              </div>
            </div>
          )}

          {/* Profile Completion Step */}
          {step === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Your Name</TranslatedText>
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="राम कुमार / Ram Kumar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Location (Village/City)</TranslatedText>
                </label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="गाँव, जिला, राज्य"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Farm Size (Optional)</TranslatedText>
                </label>
                <select
                  value={profileData.farmSize}
                  onChange={(e) => setProfileData(prev => ({ ...prev, farmSize: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value=""><TranslatedText>Select size</TranslatedText></option>
                  <option value="small"><TranslatedText>Small (Under 2 acres)</TranslatedText></option>
                  <option value="medium"><TranslatedText>Medium (2-10 acres)</TranslatedText></option>
                  <option value="large"><TranslatedText>Large (10+ acres)</TranslatedText></option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Primary Crops (Optional)</TranslatedText>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map(crop => (
                    <button
                      key={crop}
                      onClick={() => handleCropToggle(crop)}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        profileData.primaryCrops.includes(crop)
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <TranslatedText>{crop}</TranslatedText>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCompleteProfile}
                disabled={isLoading || !profileData.name.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span><TranslatedText>Complete Profile</TranslatedText></span>
                    <Sprout className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Guest Access Link */}
        {step === 'phone' && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full text-center text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              <TranslatedText>Continue as Guest (Limited Access)</TranslatedText>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuthModal
