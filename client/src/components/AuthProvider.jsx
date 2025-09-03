import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
    setIsAuthenticated(false);
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
      isAuthenticated, 
      isLoading,
      signUp,
      signIn,
      signInWithPhone,
      verifyOtp,
      updateProfile,
      signOut,
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