import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, HelpCircle, Search, Phone, Mail, Clock } from 'lucide-react';
import { useAutoTranslation } from '../hooks/useAutoTranslation.jsx';

const FAQPage = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { translateText, currentLanguage } = useAutoTranslation();
  
  // Simple translation function
  const t = (text) => text; // For now, just return the text as-is

  const faqData = [
    {
      category: 'general',
      questions: [
        {
          id: 1,
          question: "What is SIH Farm Assistant and how can it help me?",
          answer: "SIH Farm Assistant is a comprehensive digital platform designed to help farmers with crop management, pest detection, soil analysis, market prices, and farming guidance. It uses AI technology to provide personalized recommendations based on your location, crop type, and farming conditions."
        },
        {
          id: 2,
          question: "How do I get started with the platform?",
          answer: "Getting started is simple! Create a free account, complete your farmer profile with information about your farm location, crop types, and farming experience. Once set up, you can access all features including crop advisory, market prices, pest detection, and farming quests."
        },
        {
          id: 3,
          question: "Is this service free to use?",
          answer: "Yes, the basic features of SIH Farm Assistant are completely free. This includes crop recommendations, weather updates, basic market prices, and farming tips. Premium features like advanced AI analysis and detailed crop planning may require a subscription."
        },
        {
          id: 4,
          question: "What languages are supported?",
          answer: "Our platform supports multiple Indian languages including Hindi, English, Gujarati, Tamil, Telugu, and more. You can switch languages anytime from the language selector in the navigation menu."
        },
        {
          id: 5,
          question: "How accurate is the pest detection feature?",
          answer: "Our AI-powered pest detection has an accuracy rate of over 90% for common pests and diseases. However, we always recommend consulting with local agricultural experts for confirmation and treatment planning."
        }
      ]
    },
    {
      category: 'technical',
      questions: [
        {
          id: 6,
          question: "How do I upload photos for pest detection?",
          answer: "Navigate to the Pest Detection page, click on 'Upload Image' or 'Take Photo', select a clear image of the affected plant/crop, and our AI will analyze it within seconds. Make sure the image is well-lit and shows the problem area clearly."
        },
        {
          id: 7,
          question: "Can I use this app offline?",
          answer: "Some basic features work offline, including saved crop information and previously downloaded content. However, features like pest detection, real-time weather, market prices, and AI recommendations require an internet connection."
        },
        {
          id: 8,
          question: "How do I access market prices for my crops?",
          answer: "Go to the Market Prices section, select your state and district, choose your crop type, and view current market rates. Prices are updated daily from government sources and local markets."
        },
        {
          id: 9,
          question: "What should I do if the app is not working properly?",
          answer: "First, try refreshing the page or restarting the app. Check your internet connection. If problems persist, contact our support team through the help section or email us at support@sihfarm.com with details about the issue."
        }
      ]
    },
    {
      category: 'farming',
      questions: [
        {
          id: 10,
          question: "How do I get soil testing recommendations?",
          answer: "Visit the Soil Analysis section, enter your location and crop details. Our system will recommend nearby soil testing labs, optimal testing times, and what parameters to test based on your crop and season."
        },
        {
          id: 11,
          question: "Can I get fertilizer recommendations for my specific crop?",
          answer: "Yes! Our AI analyzes your crop type, growth stage, soil conditions, and local factors to provide personalized fertilizer recommendations including organic and chemical options with proper dosage instructions."
        },
        {
          id: 12,
          question: "How do farming quests work?",
          answer: "Farming quests are gamified challenges that help you learn new techniques and improve your farming practices. Complete quests by following step-by-step instructions, uploading photos of your progress, and earn points and badges for your achievements."
        },
        {
          id: 13,
          question: "What weather information is provided?",
          answer: "We provide 7-day weather forecasts, rainfall predictions, temperature trends, humidity levels, and agricultural advisories based on weather conditions. This helps you plan irrigation, harvesting, and other farming activities."
        }
      ]
    },
    {
      category: 'account',
      questions: [
        {
          id: 14,
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and we'll send you a password reset link. Follow the instructions in the email to create a new password."
        },
        {
          id: 15,
          question: "Can I change my farm location details?",
          answer: "Yes, you can update your farm location, crop details, and other profile information anytime from the Profile Settings page. Updated information helps provide more accurate recommendations."
        },
        {
          id: 16,
          question: "How do I contact customer support?",
          answer: "You can reach our support team through the Contact Us page, email us at support@sihfarm.com, or call our helpline at 1800-XXX-XXXX. Our support hours are Monday to Friday, 9 AM to 6 PM IST."
        }
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'general', name: 'General Questions', icon: MessageCircle },
    { id: 'technical', name: 'Technical Support', icon: Search },
    { id: 'farming', name: 'Farming Help', icon: HelpCircle },
    { id: 'account', name: 'Account & Profile', icon: MessageCircle }
  ];

  const filteredFAQs = faqData.filter(category => 
    selectedCategory === 'all' || category.category === selectedCategory
  ).flatMap(category => 
    category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleQuestion = (questionId) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our farm assistance platform
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-6">
          {selectedCategory !== 'all' ? (
            // Show questions for selected category
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-500 to-green-500">
                <h2 className="text-2xl font-bold text-white">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {filteredFAQs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <button
                      onClick={() => toggleQuestion(faq.id)}
                      className="w-full text-left flex items-center justify-between focus:outline-none group"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors pr-4">
                        {faq.question}
                      </h3>
                      {expandedQuestion === faq.id ? (
                        <ChevronUp className="w-6 h-6 text-blue-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedQuestion === faq.id && (
                      <div className="mt-4 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show all categories with their questions
            faqData.map((categoryData) => (
              <div key={categoryData.category} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-green-500">
                  <h2 className="text-2xl font-bold text-white">
                    {categoryData.category === 'general' && 'General Questions'}
                    {categoryData.category === 'technical' && 'Technical Support'}
                    {categoryData.category === 'farming' && 'Farming Help'}
                    {categoryData.category === 'account' && 'Account & Profile'}
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {categoryData.questions
                    .filter(q => 
                      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((faq) => (
                    <div key={faq.id} className="p-6">
                      <button
                        onClick={() => toggleQuestion(faq.id)}
                        className="w-full text-left flex items-center justify-between focus:outline-none group"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors pr-4">
                          {faq.question}
                        </h3>
                        {expandedQuestion === faq.id ? (
                          <ChevronUp className="w-6 h-6 text-blue-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-blue-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedQuestion === faq.id && (
                        <div className="mt-4 text-gray-600 leading-relaxed animate-in slide-in-from-top-2 duration-200">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No questions found</h3>
            <p className="text-gray-500">Try adjusting your search or browse different categories</p>
          </div>
        )}

        {/* Contact Support Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Still need help?</h3>
            <p className="text-gray-600">Can't find the answer you're looking for? Our support team is here to help.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Email Support</h4>
              <p className="text-gray-600 text-sm mb-3">Get detailed help via email</p>
              <a href="mailto:support@sihfarm.com" className="text-blue-600 hover:text-blue-700 font-medium">
                support@sihfarm.com
              </a>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <Phone className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Phone Support</h4>
              <p className="text-gray-600 text-sm mb-3">Speak directly with our team</p>
              <a href="tel:1800-XXX-XXXX" className="text-green-600 hover:text-green-700 font-medium">
                1800-XXX-XXXX
              </a>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-xl">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-800 mb-2">Support Hours</h4>
              <p className="text-gray-600 text-sm mb-3">We're here when you need us</p>
              <p className="text-orange-600 font-medium">Mon-Fri: 9 AM - 6 PM IST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;