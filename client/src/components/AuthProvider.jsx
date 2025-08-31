import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('farmwise_user')
        const storedToken = localStorage.getItem('farmwise_token')
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        localStorage.removeItem('farmwise_user')
        localStorage.removeItem('farmwise_token')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const sendOTP = async (phoneNumber) => {
    try {
      // **DEMO MODE**: This is a mock API call - replace with actual SMS service
      // In production, this would integrate with services like:
      // - Twilio SMS API
      // - AWS SNS
      // - Fast2SMS (India)
      // - MSG91 (India)
      console.log(`🚨 DEMO MODE: In production, SMS would be sent to ${phoneNumber}`)
      console.log('📱 For demo: Use OTP 123456 or 1234')
      
      const response = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            message: 'Demo OTP sent! Use 123456 or 1234 to continue.',
            isDemoMode: true 
          })
        }, 1000)
      })
      
      return response
    } catch (error) {
      throw new Error('Failed to send OTP')
    }
  }

  const verifyOTP = async (phoneNumber, otp) => {
    try {
      // **DEMO MODE**: This is a mock verification - replace with actual backend
      console.log(`🚨 DEMO MODE: Verifying OTP ${otp} for ${phoneNumber}`)
      
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (otp === '123456' || otp === '1234') { // Demo OTP codes
            resolve({
              success: true,
              user: {
                id: Date.now(),
                phone: phoneNumber,
                name: '',
                profileComplete: false,
                isDemoUser: true
              },
              token: 'mock_jwt_token_' + Date.now()
            })
          } else {
            reject(new Error('Invalid OTP. For demo, use: 123456 or 1234'))
          }
        }, 1500)
      })

      if (response.success) {
        setUser(response.user)
        setIsAuthenticated(true)
        localStorage.setItem('farmwise_user', JSON.stringify(response.user))
        localStorage.setItem('farmwise_token', response.token)
      }

      return response
    } catch (error) {
      throw error
    }
  }

  const completeProfile = async (profileData) => {
    try {
      const updatedUser = {
        ...user,
        ...profileData,
        profileComplete: true,
        joinedDate: new Date().toISOString(),
        level: 1,
        totalPoints: 0,
        sustainabilityScore: 0,
        completedQuests: 0,
        achievements: []
      }

      setUser(updatedUser)
      localStorage.setItem('farmwise_user', JSON.stringify(updatedUser))
      
      return { success: true, user: updatedUser }
    } catch (error) {
      throw new Error('Failed to complete profile')
    }
  }

  const updateProfile = async (updates) => {
    try {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('farmwise_user', JSON.stringify(updatedUser))
      return { success: true, user: updatedUser }
    } catch (error) {
      throw new Error('Failed to update profile')
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('farmwise_user')
    localStorage.removeItem('farmwise_token')
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sendOTP,
    verifyOTP,
    completeProfile,
    updateProfile,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
