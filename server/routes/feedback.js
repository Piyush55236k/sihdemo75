const express = require('express');
const router = express.Router();

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

    // In a real application, you would save this to your database
    // For demo purposes, we'll just log it and return success
    console.log('📝 DEMO MODE: Feedback received:', {
      userId,
      userName,
      userPhone,
      userLocation,
      advisoryRating,
      overallRating,
      adoptedAdvice: adoptedAdvice?.length || 0,
      hasPhoto: !!cropIssuePhoto,
      hasSuggestions: !!suggestions,
      hasQuestions: !!questions,
      language,
      timestamp: new Date().toISOString()
    });

    // Simulate database save
    const feedbackId = 'feedback_' + Date.now();
    
    // Mock response
    const response = {
      success: true,
      message: language === 'hi' 
        ? 'आपकी फीडबैक सफलतापूर्वक जमा की गई है। धन्यवाद!' 
        : 'Your feedback has been submitted successfully. Thank you!',
      feedbackId,
      submittedAt: new Date().toISOString(),
      pointsEarned: 10, // Demo: user earns 10 points for feedback
      isDemoMode: true
    };

    res.json(response);

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

    // In a real application, you would fetch from database
    // For demo, return mock data
    const mockFeedbacks = [
      {
        id: 'feedback_1',
        submittedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        advisoryRating: 'very_helpful',
        overallRating: 5,
        status: 'reviewed'
      },
      {
        id: 'feedback_2',
        submittedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        advisoryRating: 'helpful',
        overallRating: 4,
        status: 'pending'
      }
    ];

    res.json({
      success: true,
      feedbacks: mockFeedbacks,
      totalCount: mockFeedbacks.length,
      isDemoMode: true
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
    // Mock statistics for demo
    const mockStats = {
      totalFeedbacks: 150,
      averageRating: 4.2,
      satisfactionRate: 85,
      mostHelpfulAdvice: 'crop_disease_treatment',
      commonSuggestions: [
        'More regional language support',
        'Offline mode capability',
        'Video tutorials'
      ],
      adoptionRate: {
        high: 60,
        medium: 30,
        low: 10
      }
    };

    res.json({
      success: true,
      stats: mockStats,
      generatedAt: new Date().toISOString(),
      isDemoMode: true
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
