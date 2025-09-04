
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const { config } = require('../config/env');

// Initialize Supabase client
const supabase = createClient(
  config.auth.supabase.url,
  config.auth.supabase.anonKey
);

// POST /api/feedback/submit - Submit user feedback
router.post('/submit', async (req, res) => {
  try {
    const {
      userId,
      userName,
      userPhone,
      userLocation,
      advisoryRating,
      overallRating,
      cropIssuePhoto,
      voiceNotes,
      adoptedAdvice,
      suggestions,
      questions,
      language = 'en'
    } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: language === 'hi' ? 'उपयोगकर्ता ID आवश्यक है' : 'User ID is required'
      });
    }


    // Insert feedback into Supabase
    const { data, error } = await supabase
      .from('feedback')
      .insert([{
        user_id: userId,
        user_name: userName,
        user_phone: userPhone,
        user_location: userLocation,
        advisory_rating: advisoryRating,
        overall_rating: overallRating,
        crop_issue_photo: cropIssuePhoto,
        voice_notes: voiceNotes,
        adopted_advice: adoptedAdvice,
        suggestions,
        questions,
        language,
        submitted_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
      return res.status(500).json({
        success: false,
        message: language === 'hi'
          ? 'फीडबैक जमा करने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : 'There was a problem submitting your feedback. Please try again.',
        error: error.message
      });
    }

    const feedbackId = data && data[0] && data[0].id ? data[0].id : null;
    res.json({
      success: true,
      message: language === 'hi'
        ? 'आपकी फीडबैक सफलतापूर्वक जमा की गई है। धन्यवाद!'
        : 'Your feedback has been submitted successfully. Thank you!',
      feedbackId,
      submittedAt: new Date().toISOString(),
      pointsEarned: 10
    });

  } catch (error) {
    console.error('❌ Feedback submission error:', error);
    
    res.status(500).json({
      success: false,
      message: req.body.language === 'hi' 
        ? 'फीडबैक जमा करने में समस्या हुई। कृपया पुनः प्रयास करें।'
        : 'There was a problem submitting your feedback. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/feedback/user/:userId - Get user's feedback history
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { language = 'en' } = req.query;


    // Fetch feedbacks from Supabase
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('❌ Supabase fetch error:', error);
      return res.status(500).json({
        success: false,
        message: req.query.language === 'hi'
          ? 'फीडबैक इतिहास लोड करने में समस्या हुई।'
          : 'There was a problem loading feedback history.',
        error: error.message
      });
    }

    res.json({
      success: true,
      feedbacks: data,
      totalCount: data.length
    });

  } catch (error) {
    console.error('❌ Feedback fetch error:', error);
    
    res.status(500).json({
      success: false,
      message: req.query.language === 'hi' 
        ? 'फीडबैक इतिहास लोड करने में समस्या हुई।'
        : 'There was a problem loading feedback history.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/feedback/stats - Get feedback statistics (admin)
router.get('/stats', async (req, res) => {
  try {

    // Fetch feedback stats from Supabase
    const { data, error } = await supabase
      .from('feedback')
      .select('overall_rating, advisory_rating, adopted_advice, suggestions');

    if (error) {
      console.error('❌ Supabase stats fetch error:', error);
      return res.status(500).json({
        success: false,
        message: 'There was a problem loading feedback statistics.',
        error: error.message
      });
    }

    // Calculate stats
    const totalFeedbacks = data.length;
    const averageRating = totalFeedbacks > 0 ? (data.reduce((sum, f) => sum + (f.overall_rating || 0), 0) / totalFeedbacks).toFixed(2) : 0;
    // Example: satisfaction rate = % of feedbacks with rating >= 4
    const satisfactionRate = totalFeedbacks > 0 ? Math.round((data.filter(f => (f.overall_rating || 0) >= 4).length / totalFeedbacks) * 100) : 0;
    // Most common suggestion/advice (simple count)
    const suggestionsArr = data.map(f => f.suggestions).filter(Boolean);
    const suggestionCounts = {};
    suggestionsArr.forEach(s => { suggestionCounts[s] = (suggestionCounts[s] || 0) + 1; });
    const commonSuggestions = Object.entries(suggestionCounts).sort((a, b) => b[1] - a[1]).map(([s]) => s).slice(0, 3);

    res.json({
      success: true,
      stats: {
        totalFeedbacks,
        averageRating: Number(averageRating),
        satisfactionRate,
        commonSuggestions
      },
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Feedback stats error:', error);
    
    res.status(500).json({
      success: false,
      message: 'There was a problem loading feedback statistics.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
