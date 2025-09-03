import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { createUserProfile, getUserProfile } from "../services/userService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          // Get or create user profile
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.log('Session loading timeout, setting loading to false');
        setIsLoading(false);
      }
    }, 10000); // 10 second timeout
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      
      try {
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          // Get or create user profile
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setUserProfile(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, []);

  // Load or create user profile
  const loadUserProfile = async (user) => {
    try {
      // Try to get existing profile
      let profile = null;
      try {
        profile = await getUserProfile(user.id);
      } catch (error) {
        console.log('Profile not found or table not set up, creating basic profile...');
        // If table doesn't exist or has issues, create basic profile from auth user
        profile = {
          id: user.id,
          email: user.email,
          username: `farmer_${user.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}`,
          full_name: user.user_metadata?.name || user.email.split('@')[0],
          created_at: new Date().toISOString()
        };
        
        // Try to create in database, but don't fail if it doesn't work
        try {
          const dbProfile = await createUserProfile(user);
          profile = dbProfile;
        } catch (dbError) {
          console.log('Database profile creation failed, using local profile:', dbError);
        }
      }
      
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set basic profile from auth user if everything fails
      setUserProfile({
        id: user.id,
        email: user.email,
        username: `farmer_${user.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}`,
        full_name: user.user_metadata?.name || user.email.split('@')[0]
      });
    }
  };

  // Email/Password sign up
  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        // Provide more specific error messages
        if (error.message.includes('already registered')) {
          throw new Error('This email is already registered. Try signing in instead.');
        } else if (error.message.includes('password')) {
          throw new Error('Password must be at least 6 characters long.');
        } else {
          throw error;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  // Email/Password sign in
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        // Provide more specific error messages
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else if (error.message.includes('User not found')) {
          throw new Error('No account found with this email. Please sign up first.');
        } else {
          throw error;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Signin error:', error);
      throw error;
    }
  };

  // Phone number OTP sign in (real implementation)
  const signInWithPhone = async (phone) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          shouldCreateUser: true
        }
      });
      
      if (error) {
        if (error.message.includes('phone')) {
          throw new Error('Please enter a valid phone number.');
        } else if (error.message.includes('rate limit')) {
          throw new Error('Too many attempts. Please wait a moment before trying again.');
        } else {
          throw error;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Phone signin error:', error);
      throw error;
    }
  };

  // Verify phone OTP (real implementation)
  const verifyOtp = async (phone, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      
      if (error) {
        if (error.message.includes('expired')) {
          throw new Error('OTP has expired. Please request a new code.');
        } else if (error.message.includes('invalid')) {
          throw new Error('Invalid OTP. Please check the code and try again.');
        } else {
          throw error;
        }
      }
      
      return data;
    } catch (error) {
      console.error('OTP verification error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    const { data, error } = await supabase.auth.updateUser({
      data: profileData
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
    setIsAuthenticated(false);
  };

  // Update profile with fresh data from database
  const refreshProfile = async () => {
    if (user) {
      await loadUserProfile(user);
    }
  };

  // Legacy method names for backward compatibility
  const login = signIn;
  const logout = signOut;
  const sendOTP = signInWithPhone;
  const verifyOTP = verifyOtp;
  const completeProfile = updateProfile;

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile,
      isAuthenticated, 
      isLoading,
      signUp,
      signIn,
      signInWithPhone,
      verifyOtp,
      updateProfile,
      signOut,
      refreshProfile,
      // Legacy method names
      login,
      logout,
      sendOTP,
      verifyOTP,
      completeProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);