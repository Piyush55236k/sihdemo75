import React, { useState } from 'react'
import { TranslatedText } from '../hooks/useAutoTranslation.jsx'
import { 
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Video,
  MessageSquare,
  Phone,
  Mail,
  Search,
  ChevronRight,
  ExternalLink,
  FileText,
  Headphones,
  Globe,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Settings,
  Shield,
  CreditCard,
  Bell
} from 'lucide-react'

const HelpDemoPage = ({ onBack, currentLanguage }) => {
  const [activeCategory, setActiveCategory] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    { 
      id: 'getting-started', 
      label: 'Getting Started', 
      icon: Lightbulb,
      count: 12 
    },
    { 
      id: 'account-settings', 
      label: 'Account & Settings', 
      icon: Settings,
      count: 8 
    },
    { 
      id: 'farming-tools', 
      label: 'Farming Tools', 
      icon: BookOpen,
      count: 15 
    },
    { 
      id: 'community', 
      label: 'Community Features', 
      icon: Users,
      count: 7 
    },
    { 
      id: 'billing', 
      label: 'Billing & Subscription', 
      icon: CreditCard,
      count: 5 
    },
    { 
      id: 'troubleshooting', 
      label: 'Troubleshooting', 
      icon: AlertCircle,
      count: 10 
    }
  ]

  const faqs = {
    'getting-started': [
      {
        question: 'How do I set up my farm profile for the first time?',
        answer: 'To set up your farm profile: 1) Navigate to the Profile section from the main menu 2) Click on "Edit Profile" 3) Fill in your farm details including location, crop types, and farm size 4) Upload a profile photo if desired 5) Save your changes. You can always update this information later.'
      },
      {
        question: 'What is the quest system and how do I participate?',
        answer: 'The quest system gamifies farming education and best practices. Browse available quests in the Quest section, choose ones relevant to your farming needs, and follow the step-by-step instructions. Complete quests to earn points, badges, and learn new techniques while connecting with other farmers.'
      },
      {
        question: 'How do I connect with other farmers in my area?',
        answer: 'Use the Community section to find farmers near you. You can filter by location, crop types, or farming methods. Join discussions, attend local events, or start your own topic. The platform helps you build valuable connections with fellow farmers.'
      },
      {
        question: 'Can I use this platform offline?',
        answer: 'Some features work offline including previously loaded quest instructions and saved farming guides. However, community features, real-time updates, and quest submissions require an internet connection. We recommend syncing your data when connected to WiFi.'
      }
    ],
    'account-settings': [
      {
        question: 'How do I change my phone number?',
        answer: 'Go to Profile → Settings → Account Information. Click on the phone number field, enter your new number, and verify it with the OTP code sent to the new number. Your account will be updated once verification is complete.'
      },
      {
        question: 'How do I enable/disable notifications?',
        answer: 'Navigate to Settings → Notifications. You can customize notifications for quest updates, community messages, weather alerts, and farming tips. Toggle each category on/off according to your preferences.'
      },
      {
        question: 'Can I delete my account permanently?',
        answer: 'Yes, you can delete your account by going to Settings → Account → Delete Account. This action is irreversible and will remove all your data, quest progress, and community posts. Consider downloading your data first if needed.'
      }
    ],
    'farming-tools': [
      {
        question: 'How accurate is the weather forecast feature?',
        answer: 'Our weather data comes from multiple meteorological sources and is updated every 6 hours. While we strive for accuracy, weather can be unpredictable. We recommend using our forecasts as guidance alongside local weather observations for critical farming decisions.'
      },
      {
        question: 'Can I add my own farming techniques to share with others?',
        answer: 'Yes! Use the Community section to create posts sharing your farming techniques. You can include photos, step-by-step instructions, and tag relevant topics. Popular contributions may be featured in our Knowledge Base.'
      },
      {
        question: 'How do I track my farming progress over time?',
        answer: 'The Dashboard provides analytics on your farming activities, quest completions, and community engagement. You can also maintain a farming journal by documenting activities in quest progress updates and community posts.'
      }
    ],
    'community': [
      {
        question: 'How do I report inappropriate content in the community?',
        answer: 'Click the three-dot menu on any post or comment and select "Report". Choose the reason for reporting and provide additional details if necessary. Our moderation team reviews all reports within 24 hours.'
      },
      {
        question: 'Can I create private groups for my local farming community?',
        answer: 'Currently, all community interactions are public to encourage knowledge sharing. Private messaging between verified farmers is available. We\'re considering private groups for future updates based on user feedback.'
      }
    ],
    'billing': [
      {
        question: 'Is this platform free to use?',
        answer: 'Basic features including quest participation, community access, and weather updates are completely free. Premium features like expert consultations and advanced analytics require a subscription. Check our pricing page for current plans.'
      },
      {
        question: 'How do I upgrade to premium features?',
        answer: 'Go to Settings → Subscription to view available plans. Choose the plan that fits your needs and follow the payment process. Premium features are activated immediately after successful payment.'
      }
    ],
    'troubleshooting': [
      {
        question: 'The app is running slowly or crashing. What should I do?',
        answer: 'Try these steps: 1) Close and reopen the app 2) Check your internet connection 3) Clear the app cache in your device settings 4) Update to the latest version 5) Restart your device. If issues persist, contact our support team.'
      },
      {
        question: 'I\'m not receiving OTP codes for login. How can I fix this?',
        answer: 'Check that your phone number is entered correctly, ensure you have good network signal, and check if SMS is not blocked on your device. If you still don\'t receive the code after 5 minutes, use the "Resend Code" option or contact support.'
      },
      {
        question: 'My quest progress isn\'t saving properly.',
        answer: 'Ensure you have a stable internet connection when updating quest progress. Try refreshing the page or restarting the app. If progress is still not saving, take screenshots of your work and contact support for manual verification.'
      }
    ]
  }

  const quickActions = [
    {
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: MessageSquare,
      action: 'chat',
      available: '9 AM - 6 PM IST',
      status: 'online'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for all features',
      icon: Video,
      action: 'tutorials',
      count: '25+ videos'
    },
    {
      title: 'Contact Support',
      description: 'Email us for detailed assistance',
      icon: Mail,
      action: 'email',
      response: '24-48 hours'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with our farming experts',
      icon: Phone,
      action: 'phone',
      available: 'Mon-Fri 10 AM - 5 PM'
    }
  ]

  const resources = [
    {
      title: 'Complete User Guide',
      description: 'Comprehensive guide covering all platform features',
      type: 'PDF Guide',
      size: '15 MB',
      pages: 45,
      icon: FileText
    },
    {
      title: 'Farming Best Practices Handbook',
      description: 'Expert-compiled guide for sustainable farming',
      type: 'PDF Guide',
      size: '8 MB',
      pages: 62,
      icon: BookOpen
    },
    {
      title: 'Quest Completion Video Series',
      description: 'Visual guides for popular farming quests',
      type: 'Video Series',
      duration: '2.5 hours',
      count: 12,
      icon: Video
    },
    {
      title: 'Community Guidelines',
      description: 'Rules and best practices for community interaction',
      type: 'Web Page',
      readTime: '5 min',
      icon: Users
    }
  ]

  const filteredFaqs = faqs[activeCategory] || []

  const handleSearch = (query) => {
    setSearchQuery(query)
    // In a real app, this would filter FAQs across all categories
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">
                <TranslatedText>Back to Home</TranslatedText>
              </span>
            </button>
            
            <h1 className="text-xl lg:text-2xl font-bold text-slate-800">
              <TranslatedText>Help & Support</TranslatedText>
            </h1>

            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 lg:px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <HelpCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
            <TranslatedText>How can we help you?</TranslatedText>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            <TranslatedText>Find answers to common questions, access resources, or get in touch with our support team.</TranslatedText>
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none shadow-lg text-lg"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map(action => (
            <div
              key={action.action}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <action.icon className="w-8 h-8 text-emerald-600" />
                {action.status && (
                  <div className={`w-3 h-3 rounded-full ${
                    action.status === 'online' ? 'bg-green-500' : 'bg-slate-400'
                  }`} />
                )}
              </div>
              
              <h3 className="font-semibold text-slate-800 mb-2">{action.title}</h3>
              <p className="text-slate-600 text-sm mb-4">{action.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {action.available || action.count || action.response}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              <TranslatedText>Help Categories</TranslatedText>
            </h3>
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      activeCategory === category.id
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : 'bg-white/80 text-slate-700 hover:bg-emerald-50 border border-white/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">
                        <TranslatedText>{category.label}</TranslatedText>
                      </div>
                      <div className={`text-xs ${
                        activeCategory === category.id ? 'text-white/80' : 'text-slate-500'
                      }`}>
                        {category.count} articles
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 lg:p-8 border border-white/50">
              <h3 className="text-xl font-semibold text-slate-800 mb-6">
                <TranslatedText>Frequently Asked Questions</TranslatedText>
              </h3>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-800">{faq.question}</span>
                      <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`} />
                    </button>
                    
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-slate-600 border-t border-slate-200 bg-slate-50">
                        <p className="pt-4">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            <TranslatedText>Help Resources</TranslatedText>
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 hover:shadow-lg transition-all cursor-pointer group"
              >
                <resource.icon className="w-10 h-10 text-blue-600 mb-4" />
                
                <h4 className="font-semibold text-slate-800 mb-2">{resource.title}</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    <div>{resource.type}</div>
                    <div>
                      {resource.size && `${resource.size} • `}
                      {resource.pages && `${resource.pages} pages`}
                      {resource.duration && resource.duration}
                      {resource.readTime && resource.readTime}
                      {resource.count && `${resource.count} videos`}
                    </div>
                  </div>
                  
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 rounded-xl p-8 text-center">
          <Headphones className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-800 mb-4">
            <TranslatedText>Still need help?</TranslatedText>
          </h3>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            <TranslatedText>Our support team is here to assist you with any questions or issues you might have.</TranslatedText>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span><TranslatedText>Start Live Chat</TranslatedText></span>
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span><TranslatedText>Send Email</TranslatedText></span>
            </button>
          </div>
          
          <div className="mt-6 text-sm text-slate-600">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span><TranslatedText>Response time: 2-4 hours</TranslatedText></span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span><TranslatedText>Available in Hindi & English</TranslatedText></span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-blue-50/80 backdrop-blur-sm border border-blue-200 rounded-xl p-6 text-center">
          <Info className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            <TranslatedText>Demo Help & Support System</TranslatedText>
          </h3>
          <p className="text-blue-700 mb-4">
            <TranslatedText>This is a demonstration of help and support features. In a real implementation, this would include:</TranslatedText>
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <strong><TranslatedText>Support Features:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Live chat integration (Intercom/Zendesk)</li>
                <li>Ticket management system</li>
                <li>Knowledge base search with AI</li>
                <li>Video call support scheduling</li>
              </ul>
            </div>
            <div>
              <strong><TranslatedText>Integration Points:</TranslatedText></strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>User account context in support</li>
                <li>Automated FAQ suggestions</li>
                <li>Support article analytics</li>
                <li>Multi-language content delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpDemoPage
