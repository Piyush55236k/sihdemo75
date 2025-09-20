import React, { createContext, useContext, useEffect, useState } from "react";

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
        // Check for demo user in localStorage
        const demoUser = localStorage.getItem('demo_user');
        if (!isMounted) return;
        
        if (demoUser) {
          const userData = JSON.parse(demoUser);
          setUser(userData);
          setIsAuthenticated(true);
          // Load user profile
          await loadUserProfile(userData);
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
    
    getSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load user profile
  const loadUserProfile = async (user) => {
    try {
      const profile = localStorage.getItem(`demo_profile_${user.id}`);
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        // Create basic profile
        const basicProfile = {
          id: user.id,
          email: user.email,
          username: `farmer_${user.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}`,
          full_name: user.name || user.email.split('@')[0],
          created_at: new Date().toISOString()
        };
        setUserProfile(basicProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const signUp = async (email, password, options = {}) => {
    try {
      const demoUser = {
        id: `demo-user-${Date.now()}`,
        email: email,
        name: options.name || email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Create basic profile
      const basicProfile = {
        id: demoUser.id,
        email: demoUser.email,
        username: `farmer_${demoUser.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}`,
        full_name: demoUser.name,
        created_at: new Date().toISOString()
      };
      setUserProfile(basicProfile);
      
      return { data: { user: demoUser }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signIn = async (email, password) => {
    try {
      const demoUser = {
        id: 'demo-user-123',
        email: email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      setIsAuthenticated(true);
      
      // Load profile if exists
      const profile = localStorage.getItem(`demo_profile_${demoUser.id}`);
      if (profile) {
        setUserProfile(JSON.parse(profile));
      } else {
        const basicProfile = {
          id: demoUser.id,
          email: demoUser.email,
          username: `farmer_${demoUser.email.split('@')[0]}_${Math.random().toString(36).substring(2, 6)}`,
          full_name: demoUser.name,
          created_at: new Date().toISOString()
        };
        setUserProfile(basicProfile);
      }
      
      return { data: { user: demoUser }, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('demo_user');
      if (user?.id) {
        localStorage.removeItem(`demo_profile_${user.id}`);
        localStorage.removeItem(`demo_notifications_${user.id}`);
        localStorage.removeItem(`demo_settings_${user.id}`);
      }
      setUser(null);
      setUserProfile(null);
      setIsAuthenticated(false);
      return { error: null };
    } catch (error) {
      return { error: { message: error.message } };
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      const updatedProfile = {
        ...userProfile,
        ...profileData,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };
      
      localStorage.setItem(`demo_profile_${user.id}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
      
      return { data: updatedProfile, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const isProfileComplete = () => {
    if (!userProfile) return false;
    
    const requiredFields = ['full_name', 'farm_name', 'primary_crops'];
    return requiredFields.every(field => 
      userProfile[field] && 
      (Array.isArray(userProfile[field]) ? userProfile[field].length > 0 : true)
    );
  };

  const getUserStats = () => {
    const questsCompleted = localStorage.getItem(`demo_quests_${user?.id}`) || '0';
    const points = localStorage.getItem(`demo_points_${user?.id}`) || '0';
    
    return {
      questsCompleted: parseInt(questsCompleted),
      totalPoints: parseInt(points),
      level: Math.floor(parseInt(points) / 100) + 1,
      joinDate: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'
    };
  };

  const value = {
    user,
    userProfile,
    isAuthenticated,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateUserProfile,
    isProfileComplete,
    getUserStats
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