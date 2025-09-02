import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Upload, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  MapPin
} from 'lucide-react';
import { TranslatedText } from '../hooks/useAutoTranslation.jsx';
import { useAuth } from './AuthProvider';
import config from '../config/env.js';

const FeedbackForm = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  // Language detection
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  // Form state
  const [formData, setFormData] = useState({
    // User identification (pre-populated from auth)
    farmerName: user?.name || '',
    mobileNumber: user?.phone || '',
    farmId: '',
    location: user?.location || '',
    
    // Advisory usefulness
    wasAdviceHelpful: '',
    
    // Rating system
    adviceRating: 0,
    
    // Comment-based feedback
    suggestions: '',
    questions: '',
    
    // Adoption feedback
    followedAdvice: '',
    adoptionResult: '',
    
    // Issue reporting
    cropIssuePhoto: null,
    issueDescription: ''
  });

  // Voice input state
  const [isListening, setIsListening] = useState(false);
  const [voiceField, setVoiceField] = useState('');
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitType, setSubmitType] = useState(''); // success, error

  // Language detection from localStorage or browser
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 
                         localStorage.getItem('i18nextLng') ||
                         (navigator.language.startsWith('hi') ? 'hi' : 'en');
    setCurrentLanguage(savedLanguage);
  }, []);

  // Voice input functionality
  const startVoiceInput = (fieldName) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(currentLanguage === 'hi' ? 
        'आपका ब्राउज़र वॉइस रिकॉर्डिंग को सपोर्ट नहीं करता' : 
        'Your browser does not support voice recording');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    setVoiceField(fieldName);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        [fieldName]: prev[fieldName] + ' ' + transcript
      }));
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceField('');
    };

    recognition.onend = () => {
      setIsListening(false);
      setVoiceField('');
    };

    recognition.start();
  };

  // File upload handler
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!validTypes.includes(file.type)) {
        alert(currentLanguage === 'hi' ? 
          'कृपया केवल JPEG, PNG, या WebP फॉर्मेट की इमेज अपलोड करें।' : 
          'Please upload only JPEG, PNG, or WebP format images.');
        return;
      }

      if (file.size > maxSize) {
        alert(currentLanguage === 'hi' ? 
          'फ़ाइल का साइज़ 5MB से कम होना चाहिए।' : 
          'File size should be less than 5MB.');
        return;
      }

      setFormData(prev => ({ ...prev, cropIssuePhoto: file }));
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Prepare submission data
      const submitData = {
        userId: user?.id || user?.phone || 'anonymous',
        userName: user?.name || formData.farmerName,
        userPhone: user?.phone || formData.mobileNumber,
        userLocation: formData.location,
        advisoryRating: formData.wasAdviceHelpful,
        overallRating: formData.adviceRating,
        suggestions: formData.suggestions,
        questions: formData.questions,
        adoptedAdvice: formData.followedAdvice ? [formData.followedAdvice] : [],
        language: currentLanguage,
        timestamp: new Date().toISOString()
      };

      // Handle file upload separately if there's a photo
      if (formData.cropIssuePhoto) {
        // For demo, we'll just indicate that a photo was uploaded
        submitData.cropIssuePhoto = 'photo_uploaded_' + Date.now();
      }

      // Submit to backend
      const response = await fetch(`${config.api.baseUrl}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitType('success');
        setSubmitMessage(result.message);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            farmerName: '',
            mobileNumber: '',
            farmId: '',
            location: '',
            wasAdviceHelpful: '',
            adviceRating: 0,
            suggestions: '',
            questions: '',
            followedAdvice: '',
            adoptionResult: '',
            cropIssuePhoto: null,
            issueDescription: ''
          });
          setSubmitMessage('');
          onClose();
        }, 2000);
        
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (error) {
      setSubmitType('error');
      setSubmitMessage(
        currentLanguage === 'hi' ? 
        'फीडबैक भेजने में समस्या हुई। कृपया पुनः प्रयास करें।' : 
        'There was an error submitting your feedback. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = ({ rating, onRatingChange }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 rounded ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            } hover:text-yellow-400 transition-colors`}
          >
            <Star className="w-6 h-6" fill={star <= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-slate-800">
            <TranslatedText>
              {currentLanguage === 'hi' ? 'फीडबैक फॉर्म' : 'Feedback Form'}
            </TranslatedText>
          </h2>
          <div className="flex items-center space-x-3">
            {/* Language selector */}
            <select
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
                localStorage.setItem('preferredLanguage', e.target.value);
              }}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Submission message */}
        {submitMessage && (
          <div className={`m-4 p-4 rounded-lg flex items-center space-x-2 ${
            submitType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {submitType === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{submitMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Identification Section */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              <TranslatedText>
                {currentLanguage === 'hi' ? 'किसान की जानकारी' : 'Farmer Information'}
              </TranslatedText>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'नाम' : 'Name'}
                  </TranslatedText>
                </label>
                <input
                  type="text"
                  value={formData.farmerName}
                  onChange={(e) => setFormData(prev => ({...prev, farmerName: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={currentLanguage === 'hi' ? 'आपका नाम' : 'Your name'}
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-1" />
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'}
                  </TranslatedText>
                </label>
                <input
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData(prev => ({...prev, mobileNumber: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={currentLanguage === 'hi' ? '9876543210' : '9876543210'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'फार्म ID' : 'Farm ID'}
                  </TranslatedText>
                </label>
                <input
                  type="text"
                  value={formData.farmId}
                  onChange={(e) => setFormData(prev => ({...prev, farmId: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={currentLanguage === 'hi' ? 'वैकल्पिक' : 'Optional'}
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'स्थान' : 'Location'}
                  </TranslatedText>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={currentLanguage === 'hi' ? 'शहर, राज्य' : 'City, State'}
                />
              </div>
            </div>
          </div>

          {/* Advisory Usefulness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TranslatedText>
                {currentLanguage === 'hi' ? 'क्या यह सलाह सहायक थी?' : 'Was this advice helpful?'}
              </TranslatedText>
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wasAdviceHelpful"
                  value="yes"
                  checked={formData.wasAdviceHelpful === 'yes'}
                  onChange={(e) => setFormData(prev => ({...prev, wasAdviceHelpful: e.target.value}))}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <TranslatedText>{currentLanguage === 'hi' ? 'हाँ' : 'Yes'}</TranslatedText>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="wasAdviceHelpful"
                  value="no"
                  checked={formData.wasAdviceHelpful === 'no'}
                  onChange={(e) => setFormData(prev => ({...prev, wasAdviceHelpful: e.target.value}))}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <TranslatedText>{currentLanguage === 'hi' ? 'नहीं' : 'No'}</TranslatedText>
              </label>
            </div>
          </div>

          {/* Rating System */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TranslatedText>
                {currentLanguage === 'hi' ? 'सलाह को 1 से 5 तक रेट करें' : 'Rate the advice on a scale of 1 to 5'}
              </TranslatedText>
            </label>
            <StarRating 
              rating={formData.adviceRating} 
              onRatingChange={(rating) => setFormData(prev => ({...prev, adviceRating: rating}))} 
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.adviceRating > 0 && (
                <TranslatedText>
                  {currentLanguage === 'hi' ? 
                    `आपकी रेटिंग: ${formData.adviceRating}/5` : 
                    `Your rating: ${formData.adviceRating}/5`}
                </TranslatedText>
              )}
            </p>
          </div>

          {/* Issue Reporting with Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TranslatedText>
                {currentLanguage === 'hi' ? 'फसल की समस्या की फोटो अपलोड करें' : 'Upload a photo of the crop issue you\'re facing'}
              </TranslatedText>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors">
              <input
                type="file"
                id="cropPhoto"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="cropPhoto"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'फोटो चुनने के लिए क्लिक करें' : 'Click to select photo'}
                  </TranslatedText>
                </span>
                {formData.cropIssuePhoto && (
                  <span className="text-sm text-emerald-600 font-medium">
                    {formData.cropIssuePhoto.name}
                  </span>
                )}
              </label>
            </div>
            
            {/* Issue description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>
                  {currentLanguage === 'hi' ? 'समस्या का विवरण' : 'Issue Description'}
                </TranslatedText>
              </label>
              <div className="relative">
                <textarea
                  value={formData.issueDescription}
                  onChange={(e) => setFormData(prev => ({...prev, issueDescription: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder={currentLanguage === 'hi' ? 'समस्या के बारे में बताएं...' : 'Describe the issue...'}
                />
                <button
                  type="button"
                  onClick={() => startVoiceInput('issueDescription')}
                  className={`absolute right-2 top-2 p-1 rounded ${
                    isListening && voiceField === 'issueDescription' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                  title={currentLanguage === 'hi' ? 'वॉइस इनपुट' : 'Voice input'}
                >
                  {isListening && voiceField === 'issueDescription' ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Comment-based Feedback */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>
                  {currentLanguage === 'hi' ? 'आपके सुझाव' : 'Your suggestions'}
                </TranslatedText>
              </label>
              <div className="relative">
                <textarea
                  value={formData.suggestions}
                  onChange={(e) => setFormData(prev => ({...prev, suggestions: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder={currentLanguage === 'hi' ? 'अपने सुझाव दें...' : 'Leave your suggestions...'}
                />
                <button
                  type="button"
                  onClick={() => startVoiceInput('suggestions')}
                  className={`absolute right-2 top-2 p-1 rounded ${
                    isListening && voiceField === 'suggestions' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {isListening && voiceField === 'suggestions' ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TranslatedText>
                  {currentLanguage === 'hi' ? 'आपके प्रश्न' : 'Your questions'}
                </TranslatedText>
              </label>
              <div className="relative">
                <textarea
                  value={formData.questions}
                  onChange={(e) => setFormData(prev => ({...prev, questions: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder={currentLanguage === 'hi' ? 'अपने प्रश्न पूछें...' : 'Ask your questions...'}
                />
                <button
                  type="button"
                  onClick={() => startVoiceInput('questions')}
                  className={`absolute right-2 top-2 p-1 rounded ${
                    isListening && voiceField === 'questions' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {isListening && voiceField === 'questions' ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Adoption Feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <TranslatedText>
                {currentLanguage === 'hi' ? 'क्या आपने सलाह का पालन किया?' : 'Did you follow the advice?'}
              </TranslatedText>
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="followedAdvice"
                  value="yes"
                  checked={formData.followedAdvice === 'yes'}
                  onChange={(e) => setFormData(prev => ({...prev, followedAdvice: e.target.value}))}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <TranslatedText>{currentLanguage === 'hi' ? 'हाँ' : 'Yes'}</TranslatedText>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="followedAdvice"
                  value="no"
                  checked={formData.followedAdvice === 'no'}
                  onChange={(e) => setFormData(prev => ({...prev, followedAdvice: e.target.value}))}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <TranslatedText>{currentLanguage === 'hi' ? 'नहीं' : 'No'}</TranslatedText>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="followedAdvice"
                  value="partial"
                  checked={formData.followedAdvice === 'partial'}
                  onChange={(e) => setFormData(prev => ({...prev, followedAdvice: e.target.value}))}
                  className="mr-2 text-emerald-600 focus:ring-emerald-500"
                />
                <TranslatedText>{currentLanguage === 'hi' ? 'आंशिक रूप से' : 'Partially'}</TranslatedText>
              </label>
            </div>
            
            {formData.followedAdvice === 'yes' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TranslatedText>
                    {currentLanguage === 'hi' ? 'परिणाम क्या रहा?' : 'What was the result?'}
                  </TranslatedText>
                </label>
                <div className="relative">
                  <textarea
                    value={formData.adoptionResult}
                    onChange={(e) => setFormData(prev => ({...prev, adoptionResult: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder={currentLanguage === 'hi' ? 'परिणाम बताएं...' : 'Describe the result...'}
                  />
                  <button
                    type="button"
                    onClick={() => startVoiceInput('adoptionResult')}
                    className={`absolute right-2 top-2 p-1 rounded ${
                      isListening && voiceField === 'adoptionResult' 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } transition-colors`}
                  >
                    {isListening && voiceField === 'adoptionResult' ? (
                      <MicOff className="w-4 h-4" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <TranslatedText>{currentLanguage === 'hi' ? 'रद्द करें' : 'Cancel'}</TranslatedText>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>
                <TranslatedText>
                  {isSubmitting ? 
                    (currentLanguage === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...') :
                    (currentLanguage === 'hi' ? 'फीडबैक भेजें' : 'Submit Feedback')
                  }
                </TranslatedText>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
