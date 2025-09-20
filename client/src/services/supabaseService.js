import { supabase } from '../supabaseClient';

// Notification Service
export const notificationService = {
  // Get all notifications for current user
  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: null, error };
    }
  },

  // Create a new notification
  async createNotification(userId, notificationData) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{
          user_id: userId,
          ...notificationData
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { data: null, error };
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { data: null, error };
    }
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { error };
    }
  },

  // Subscribe to real-time notifications
  subscribeToNotifications(userId, callback) {
    return supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
};

// Community Service
export const communityService = {
  // Get all posts with user profiles
  async getPosts(limit = 20, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          user_profiles!inner(full_name, farm_name, farming_experience),
          post_likes(user_id),
          post_comments(id)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { data: null, error };
    }
  },

  // Create a new post
  async createPost(userId, postData) {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .insert([{
          user_id: userId,
          ...postData
        }])
        .select(`
          *,
          user_profiles!inner(full_name, farm_name, farming_experience)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating post:', error);
      return { data: null, error };
    }
  },

  // Like/unlike a post
  async toggleLike(postId, userId) {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
        return { liked: false, error: null };
      } else {
        // Like
        const { error } = await supabase
          .from('post_likes')
          .insert([{ post_id: postId, user_id: userId }]);

        if (error) throw error;
        return { liked: true, error: null };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { liked: false, error };
    }
  },

  // Add comment to post
  async addComment(postId, userId, content) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          content
        }])
        .select(`
          *,
          user_profiles!inner(full_name)
        `)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { data: null, error };
    }
  },

  // Get comments for a post
  async getComments(postId) {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user_profiles!inner(full_name)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { data: null, error };
    }
  }
};

// Quest Service
export const questService = {
  // Get all available quests
  async getQuests() {
    try {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching quests:', error);
      return { data: null, error };
    }
  },

  // Get user's completed quests
  async getUserCompletedQuests(userId) {
    try {
      const { data, error } = await supabase
        .from('user_quest_completions')
        .select(`
          *,
          quests(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching completed quests:', error);
      return { data: null, error };
    }
  },

  // Complete a quest
  async completeQuest(userId, questId) {
    try {
      const { data, error } = await supabase
        .from('user_quest_completions')
        .insert([{
          user_id: userId,
          quest_id: questId
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error completing quest:', error);
      return { data: null, error };
    }
  }
};

// Settings Service
export const settingsService = {
  // Get user settings
  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return { data: null, error };
    }
  },

  // Update user settings
  async updateUserSettings(userId, settings) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .upsert([{
          user_id: userId,
          ...settings
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user settings:', error);
      return { data: null, error };
    }
  }
};