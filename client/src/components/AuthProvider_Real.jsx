import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      
      if (session?.user && (session.user.email_confirmed_at || import.meta.env.VITE_APP_ENVIRONMENT === 'development')) {
        // Authenticate users with confirmed emails OR in development mode
        setUser(session.user);
        setIsAuthenticated(true);
        await loadUserProfile(session.user.id);
      } else if (session?.user && !session.user.email_confirmed_at) {
        // User exists but email not confirmed
        console.log('User email not confirmed yet');
        setUser(session.user);
        setIsAuthenticated(false);
        setUserProfile(null);
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const getSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user && (session.user.email_confirmed_at || import.meta.env.VITE_APP_ENVIRONMENT === 'development')) {
        // Authenticate users with confirmed emails OR in development mode
        setUser(session.user);
        setIsAuthenticated(true);
        await loadUserProfile(session.user.id);
      } else {
        // No session or unconfirmed email
        setUser(null);
        setUserProfile(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error getting session:', error);
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Only create profile for verified email addresses
        // Don't auto-create profiles for unverified sessions
        console.log('No profile found for user:', userId);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile(null);
    }
  };

  const signUp = async (email, password, userData = {}) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name || '',
          }
        }
      });

      if (error) throw error;

      // Create user profile after successful signup
      if (data.user && !error) {
        await createUserProfile(data.user.id, userData);
      }

      return { data, error: null };
    } catch (error) {
      console.error('SignUp error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const createUserProfile = async (userId, userData = {}) => {
    try {
      const newProfile = {
        user_id: userId,
        full_name: userData.name || '',
        phone: userData.phone || '',
        address: '',
        farm_name: '',
        farm_address: '',
        farm_size: '',
        farm_type: 'mixed',
        farming_experience: '',
        main_crops: [],
        points: 100, // Welcome bonus
        level: 1,
        profile_completed: false,
        created_at: new Date().toISOString()
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) throw createError;
      setUserProfile(createdProfile);
      return { data: createdProfile, error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('SignIn error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      
      // Clear state first
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any cached data
      localStorage.removeItem('supabase.auth.token');
      
      console.log('Successfully signed out');
      return { error: null };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) return { error: 'No user logged in' };

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUserProfile(data);
      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { data: null, error };
    }
  };

  const isProfileComplete = () => {
    return userProfile?.profile_completed || false;
  };

  const getUserStats = () => {
    if (!userProfile) return { points: 0, level: 1, badges: [] };
    
    return {
      points: userProfile.points || 0,
      level: userProfile.level || 1,
      badges: userProfile.badges || []
    };
  };

  const addPoints = async (points) => {
    if (!userProfile) return;

    const newPoints = (userProfile.points || 0) + points;
    const newLevel = Math.floor(newPoints / 100) + 1;

    await updateProfile({
      points: newPoints,
      level: newLevel
    });
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    createUserProfile,
    isProfileComplete,
    getUserStats,
    addPoints
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};