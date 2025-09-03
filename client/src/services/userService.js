import { supabase } from '../supabaseClient';

/**
 * User Service for managing user profiles in Supabase
 */

// Generate a unique username
const generateUsername = (email) => {
  const emailPrefix = email.split('@')[0].toLowerCase();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `farmer_${emailPrefix}_${randomSuffix}`;
};

// Create or update user profile
export const createUserProfile = async (user) => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (existingProfile) {
      console.log('User profile already exists:', existingProfile);
      return existingProfile;
    }

    // Generate unique username
    const username = generateUsername(user.email);

    // Create new profile
    const profileData = {
      id: user.id,
      email: user.email,
      username: username,
      full_name: user.user_metadata?.name || user.email.split('@')[0],
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Farming-specific fields
      farm_size: null,
      farm_location: null,
      primary_crops: [],
      experience_level: 'beginner',
      // Gamification fields
      level: 1,
      total_points: 0,
      completed_quests: 0,
      sustainability_score: 0,
      // Preferences
      preferred_language: 'en',
      notifications_enabled: true
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }

    console.log('User profile created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    console.log('User profile updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// Update username
export const updateUsername = async (userId, newUsername) => {
  try {
    // Check if username is already taken
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', newUsername)
      .neq('id', userId)
      .single();

    if (existingUser) {
      throw new Error('Username is already taken');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: newUsername,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating username:', error);
      throw error;
    }

    console.log('Username updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateUsername:', error);
    throw error;
  }
};

// Check if username is available
export const isUsernameAvailable = async (username) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found, username is available
      return true;
    }

    if (error) {
      throw error;
    }

    // Username found, not available
    return false;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

// Update farming details
export const updateFarmingDetails = async (userId, farmingData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        farm_size: farmingData.farmSize,
        farm_location: farmingData.farmLocation,
        primary_crops: farmingData.primaryCrops,
        experience_level: farmingData.experienceLevel,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating farming details:', error);
      throw error;
    }

    console.log('Farming details updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateFarmingDetails:', error);
    throw error;
  }
};

// Update gamification data
export const updateGameData = async (userId, gameData) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        level: gameData.level,
        total_points: gameData.totalPoints,
        completed_quests: gameData.completedQuests,
        sustainability_score: gameData.sustainabilityScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating game data:', error);
      throw error;
    }

    console.log('Game data updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateGameData:', error);
    throw error;
  }
};

// Delete user profile (GDPR compliance)
export const deleteUserProfile = async (userId) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }

    console.log('User profile deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteUserProfile:', error);
    throw error;
  }
};

export default {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateUsername,
  isUsernameAvailable,
  updateFarmingDetails,
  updateGameData,
  deleteUserProfile
};
