import React, { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider_Real'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  Phone, 
  ChevronRight, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  X
} from 'lucide-react'

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { signUp, signIn, signInWithPhone, verifyOtp, updateProfile } = useAuth()
  const [mode, setMode] = useState(initialMode) // 'login' or 'signup'
  const [authMethod, setAuthMethod] = useState('email') // 'email' or 'phone'
  const [step, setStep] = useState('auth') // auth, otp, profile, emailSent
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Email/Password state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  
  // Phone/OTP state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  
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
      setStep('auth')
      setMode(initialMode)
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setPhoneNumber('')
      setOtp('')
      setError('')
      setShowPassword(false)
      setProfileData({
        name: '',
        location: '',
        farmSize: '',
        primaryCrops: [],
        experience: '',
        preferredLanguage: 'hi'
      })
    } else {
      // Set mode when modal opens
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (mode === 'signup') {
        // Validation for signup
        if (!email || !password) {
          throw new Error('Email and password are required')
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long')
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error('Please enter a valid email address')
        }
        
        await signUp(email, password, {
          name: profileData.name || email.split('@')[0]
        })
        
        setStep('emailSent')
      } else {
        // Validation for signin
        if (!email || !password) {
          throw new Error('Email and password are required')
        }
        
        await signIn(email, password)
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneAuth = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (phoneNumber.length !== 10) {
        throw new Error('Please enter a valid 10-digit phone number')
      }
      
      const formattedPhone = `+91${phoneNumber.replace(/\s/g, '')}`
      await signInWithPhone(formattedPhone)
      setStep('otp')
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      if (!otp || otp.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP')
      }
      
      const formattedPhone = `+91${phoneNumber.replace(/\s/g, '')}`
      await verifyOtp(formattedPhone, otp)
      
      if (mode === 'signup') {
        setStep('profile')
      } else {
        onClose()
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteProfile = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      await updateProfile(profileData)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header with Farming Theme */}
        <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-t-3xl border-b border-emerald-100">
          {step === 'otp' ? (
            <button
              onClick={() => setStep('auth')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
            </button>
          ) : step === 'profile' ? (
            <button
              onClick={() => authMethod === 'email' ? setStep('auth') : setStep('otp')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
          
          <div className="text-center">
            {/* Farming Icon */}
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🌾
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {step === 'otp' ? (
                <TranslatedText>Verify Your Phone</TranslatedText>
              ) : step === 'profile' ? (
                <TranslatedText>Complete Your Profile</TranslatedText>
              ) : step === 'emailSent' ? (
                <TranslatedText>Check Your Email</TranslatedText>
              ) : mode === 'login' ? (
                <TranslatedText>Welcome Back!</TranslatedText>
              ) : (
                <TranslatedText>Join Agro_Mitra</TranslatedText>
              )}
            </h1>
            
            <p className="text-sm text-gray-600">
              {step === 'otp' ? (
                <TranslatedText>Enter the 6-digit code sent to your phone</TranslatedText>
              ) : step === 'profile' ? (
                <TranslatedText>Help us personalize your farming experience</TranslatedText>
              ) : step === 'emailSent' ? (
                <TranslatedText>We've sent a verification link to your email</TranslatedText>
              ) : mode === 'login' ? (
                <TranslatedText>Sign in to access your farming dashboard</TranslatedText>
              ) : (
                <TranslatedText>Start your smart farming journey today</TranslatedText>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Email Verification Sent */}
          {step === 'emailSent' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  <TranslatedText>Check Your Email</TranslatedText>
                </h3>
                <p className="text-gray-600 text-sm">
                  <TranslatedText>We've sent a verification link to</TranslatedText> <strong>{email}</strong>
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  <TranslatedText>Click the link to verify your account, then return here to sign in.</TranslatedText>
                </p>
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-xs">
                    <TranslatedText>⚠️ Important: You must verify your email before you can sign in to your account.</TranslatedText>
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setStep('auth');
                    setMode('login');
                    setError('');
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <TranslatedText>Back to Sign In</TranslatedText>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                >
                  <TranslatedText>Got it</TranslatedText>
                </button>
              </div>
            </div>
          )}

          {/* Authentication Step */}
          {step === 'auth' && (
            <div className="space-y-6">
              {/* Benefits Section */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-emerald-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    🌱
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">
                    <TranslatedText>Smart Crop Advice</TranslatedText>
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    🌦️
                  </div>
                  <p className="text-xs text-blue-700 font-medium">
                    <TranslatedText>Weather Alerts</TranslatedText>
                  </p>
                </div>
              </div>

              {/* Auth Method Toggle - Modern Design */}
              <div className="bg-gray-50 rounded-2xl p-1.5 border border-gray-200">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    onClick={() => setAuthMethod('email')}
                    className={`relative py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      authMethod === 'email'
                        ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Mail className="w-4 h-4 inline mr-2" />
                    <TranslatedText>Email</TranslatedText>
                  </button>
                  <button
                    onClick={() => setAuthMethod('phone')}
                    className={`relative py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      authMethod === 'phone'
                        ? 'bg-white text-emerald-600 shadow-sm border border-emerald-100'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Phone className="w-4 h-4 inline mr-2" />
                    <TranslatedText>Phone</TranslatedText>
                  </button>
                </div>
              </div>

              {/* Email Authentication Form */}
              {authMethod === 'email' && (
                <form onSubmit={handleEmailAuth} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TranslatedText>Email Address</TranslatedText>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="farmer@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TranslatedText>Password</TranslatedText>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors duration-200"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <TranslatedText>Confirm Password</TranslatedText>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm your password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        <TranslatedText>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</TranslatedText>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>
                          {mode === 'login' ? 
                            <TranslatedText>🚀 Access Your Farm</TranslatedText> : 
                            <TranslatedText>🌱 Start Growing Smart</TranslatedText>
                          }
                        </span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Phone Authentication Form */}
              {authMethod === 'phone' && (
                <form onSubmit={handlePhoneAuth} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <TranslatedText>Phone Number</TranslatedText>
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600 font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                        placeholder="98765 43210"
                        className="w-full pl-20 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                        maxLength="10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <span className="mr-1">📱</span>
                      <TranslatedText>We'll send you a verification code via SMS</TranslatedText>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phoneNumber.length !== 10}
                    className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                        <TranslatedText>Sending Code...</TranslatedText>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span><TranslatedText>📱 Send Verification Code</TranslatedText></span>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </form>
              )}

              {/* Toggle between login/signup */}
              <div className="text-center pt-2">
                <p className="text-sm text-gray-600">
                  {mode === 'login' ? (
                    <TranslatedText>Don't have an account?</TranslatedText>
                  ) : (
                    <TranslatedText>Already have an account?</TranslatedText>
                  )}
                  {' '}
                  <button
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login')
                      setError('')
                      setEmail('')
                      setPassword('')
                      setConfirmPassword('')
                      setPhoneNumber('')
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition-all duration-200"
                  >
                    {mode === 'login' ? 
                      <TranslatedText>Sign Up Here</TranslatedText> : 
                      <TranslatedText>Sign In Here</TranslatedText>
                    }
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  <TranslatedText>Code sent to</TranslatedText> +91 {phoneNumber}
                </p>
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center text-2xl font-mono py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent tracking-widest"
                    maxLength="6"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
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
                  type="button"
                  onClick={handlePhoneAuth}
                  disabled={isLoading}
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                >
                  <TranslatedText>Resend Code</TranslatedText>
                </button>
              </div>
            </form>
          )}

          {/* Profile Completion Step */}
          {step === 'profile' && (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Full Name</TranslatedText>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Location</TranslatedText>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Farm Size</TranslatedText>
                </label>
                <select
                  value={profileData.farmSize}
                  onChange={(e) => setProfileData({ ...profileData, farmSize: e.target.value })}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select farm size</option>
                  <option value="small">Small (&lt; 2 acres)</option>
                  <option value="medium">Medium (2-10 acres)</option>
                  <option value="large">Large (&gt; 10 acres)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>Primary Crops</TranslatedText>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {cropOptions.map((crop) => (
                    <label key={crop} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profileData.primaryCrops.includes(crop)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setProfileData({
                              ...profileData,
                              primaryCrops: [...profileData.primaryCrops, crop]
                            })
                          } else {
                            setProfileData({
                              ...profileData,
                              primaryCrops: profileData.primaryCrops.filter(c => c !== crop)
                            })
                          }
                        }}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        <TranslatedText>{crop}</TranslatedText>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Farming Experience</TranslatedText>
                </label>
                <select
                  value={profileData.experience}
                  onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  required
                >
                  <option value="">Select experience</option>
                  <option value="beginner">Beginner (0-2 years)</option>
                  <option value="intermediate">Intermediate (3-10 years)</option>
                  <option value="experienced">Experienced (10+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <TranslatedText>Preferred Language</TranslatedText>
                </label>
                <select
                  value={profileData.preferredLanguage}
                  onChange={(e) => setProfileData({ ...profileData, preferredLanguage: e.target.value })}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="gu">ગુજરાતી (Gujarati)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span><TranslatedText>Complete Setup</TranslatedText></span>
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
