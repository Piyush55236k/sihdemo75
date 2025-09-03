const express = require('express');
const axios = require('axios');
const { config } = require('../config/env');

const router = express.Router();

// POST /api/gemini/chat
router.post('/chat', async (req, res) => {
  try {
    const { messages, language = 'en' } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'No messages provided' });
    }
    const apiKey = config.gemini.apiKey;
    const apiUrl = config.gemini.apiUrl + '?key=' + apiKey;
    const body = {
      contents: [
        {
          parts: messages.map((msg) => ({ text: msg.content }))
        }
      ]
    };
    const response = await axios.post(apiUrl, body, {
      headers: { 'Content-Type': 'application/json' }
    });
    const geminiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    res.json({ response: geminiText });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Gemini API error', details: error?.response?.data || error.message });
  }
});

module.exports = router;
