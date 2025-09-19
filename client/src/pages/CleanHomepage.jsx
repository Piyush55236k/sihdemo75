import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User, 
  Sun, 
  MapPin, 
  ArrowRight,
  AlertTriangle,
  Calendar,
  Leaf,
  Cloud,
  CloudRain
} from 'lucide-react';
import logo1 from '../../../logo1.jpg';
import AuthModal from '../components/AuthModal';
import PestCheckPage from './PestCheckPage';
import MarketPricesPage from './MarketPricesPage';
import CropCalendarPage from './CropCalendarPage';
import QuestPage from './QuestPage';
import { useAuth } from '../components/AuthProvider';
import WeatherService from '../services/weatherService';

const CleanHomepage = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentLanguage] = useState('en');
  const [weatherData, setWeatherData] = useState({
    temperature: '--',
    humidity: '--',
    location: 'Loading...',
    condition: 'Unknown',
    forecast: []
  });
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Initialize weather service
  const weatherService = new WeatherService();

  // Load weather data
  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setIsLoadingWeather(true);
        
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                const weather = await weatherService.getCurrentWeather(latitude, longitude);
                const forecast = await weatherService.getForecast(latitude, longitude, 4);
                
                setWeatherData({
                  temperature: Math.round(weather.temperature),
                  humidity: weather.humidity,
                  location: weather.location,
                  condition: weather.condition,
                  forecast: forecast.slice(0, 4)
                });
              } catch (error) {
                console.error('Error fetching weather:', error);
                // Use default location as fallback
                await loadDefaultWeather();
              }
            },
            async (error) => {
              console.log('Geolocation error:', error);
              // Use default location as fallback
              await loadDefaultWeather();
            }
          );
        } else {
          await loadDefaultWeather();
        }
      } catch (error) {
        console.error('Weather loading error:', error);
        await loadDefaultWeather();
      } finally {
        setIsLoadingWeather(false);
      }
    };

    const loadDefaultWeather = async () => {
      try {
        // Default to Ahmedabad coordinates
        const weather = await weatherService.getCurrentWeather(23.0225, 72.5714);
        const forecast = await weatherService.getForecast(23.0225, 72.5714, 4);
        
        setWeatherData({
          temperature: Math.round(weather.temperature),
          humidity: weather.humidity,
          location: weather.location || 'Ahmedabad, Gujarat',
          condition: weather.condition,
          forecast: forecast.slice(0, 4)
        });
      } catch (error) {
        console.error('Default weather error:', error);
        // Use mock data as final fallback
        setWeatherData({
          temperature: 28,
          humidity: 65,
          location: 'Ahmedabad, Gujarat',
          condition: 'Sunny',
          forecast: [
            { day: 'Today', high: 32, low: 24, condition: 'Sunny' },
            { day: 'Tomorrow', high: 31, low: 23, condition: 'Partly Cloudy' },
            { day: 'Wed', high: 29, low: 22, condition: 'Cloudy' },
            { day: 'Thu', high: 30, low: 23, condition: 'Sunny' }
          ]
        });
      }
    };

    loadWeatherData();
  }, []);

  // Get weather icon based on condition
  const getWeatherIcon = (condition) => {
    const cond = condition?.toLowerCase() || '';
    if (cond.includes('sunny') || cond.includes('clear')) {
      return <Sun className="w-12 h-12 text-yellow-500" />;
    } else if (cond.includes('cloud')) {
      return <Cloud className="w-12 h-12 text-gray-500" />;
    } else if (cond.includes('rain')) {
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    }
    return <Sun className="w-12 h-12 text-yellow-500" />;
  };

  // Quick actions data
  const quickActions = [
    {
      id: 'soil-fertilizer',
      title: currentLanguage === 'hi' ? 'मिट्टी उर्वरक' : 'Soil Fertilizer',
      description: currentLanguage === 'hi' ? 'मिट्टी विश्लेषण के आधार पर उर्वरक सिफारिशें प्राप्त करें' : 'Get fertilizer recommendations based on soil analysis',
      icon: '🌱',
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600'
    },
    {
      id: 'pest-check',
      title: currentLanguage === 'hi' ? 'कीट जांच' : 'Pest Detection',
      description: currentLanguage === 'hi' ? 'पौधों की छवियों को अपलोड करके कीट पहचानें' : 'Upload plant images to detect and identify pests',
      icon: '🐛',
      color: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600'
    },
    {
      id: 'market-prices',
      title: currentLanguage === 'hi' ? 'बाजार मूल्य' : 'Market Prices',
      description: currentLanguage === 'hi' ? 'वर्तमान बाजार मूल्य जांचें' : 'Check current market prices',
      icon: '📈',
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'crop-calendar',
      title: currentLanguage === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar',
      description: currentLanguage === 'hi' ? 'मौसमी फसल कैलेंडर देखें' : 'View seasonal crop calendar',
      icon: '📅',
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'my-progress',
      title: currentLanguage === 'hi' ? 'मेरी प्रगति' : 'My Progress',
      description: currentLanguage === 'hi' ? 'अपनी कृषि प्रगति को ट्रैक करें' : 'Track your farming progress',
      icon: '📊',
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600'
    },
    {
      id: 'crop-advisory',
      title: currentLanguage === 'hi' ? 'फसल सलाह' : 'Crop Advisory',
      description: currentLanguage === 'hi' ? 'मिट्टी विश्लेषण के आधार पर फसल सिफारिशें प्राप्त करें' : 'Get AI-powered crop recommendations based on soil analysis',
      icon: '🌾',
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600'
    }
  ];

  const handleQuickAction = (actionId) => {
    // Navigate to the appropriate route for each action
    switch(actionId) {
      case 'pest-check':
        window.location.href = '/pest-check';
        break;
      case 'soil-fertilizer':
        window.location.href = '/SoilFertilizerPage';
        break;
      case 'market-prices':
        window.location.href = '/market-prices';
        break;
      case 'crop-calendar':
        window.location.href = '/crop-calendar';
        break;
      case 'my-progress':
        window.location.href = '/quests';
        break;
      case 'crop-advisory':
        window.location.href = '/SoilFertilizerPage';
        break;
      default:
        setCurrentPage(actionId);
    }
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // Render different pages based on current page
  if (currentPage === 'pest-check') {
    return <PestCheckPage onBack={() => setCurrentPage('home')} currentLanguage={currentLanguage} />;
  }
  if (currentPage === 'market-prices') {
    return <MarketPricesPage onBack={() => setCurrentPage('home')} currentLanguage={currentLanguage} />;
  }
  if (currentPage === 'crop-calendar') {
    return <CropCalendarPage onBack={() => setCurrentPage('home')} currentLanguage={currentLanguage} />;
  }
  if (currentPage === 'quest') {
    return <QuestPage onBack={() => setCurrentPage('home')} currentLanguage={currentLanguage} />;
  }
  if (currentPage === 'soil-fertilizer') {
    // Redirect to the actual route for soil fertilizer page
    window.location.href = '/SoilFertilizerPage';
    return null;
  }

  // Main homepage rendering
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button 
                onClick={() => handleNavigation('home')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                HOME
              </button>
              <button 
                onClick={() => handleNavigation('features')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                FEATURES
              </button>
              <button 
                onClick={() => window.location.href = '/quests'}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                QUEST
              </button>
              <button 
                onClick={() => window.location.href = '/faq'}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                FAQ
              </button>
              <button 
                onClick={() => handleNavigation('community')}
                className="text-gray-700 hover:text-green-600 font-medium"
              >
                COMMUNITY
              </button>
            </nav>

            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img src={logo1} alt="AgroMitra Logo" className="w-8 h-8" />
              <span className="text-2xl font-bold text-green-600">grimo</span>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <span className="text-green-600 font-medium">50</span>
              </div>
              <Bell className="w-6 h-6 text-gray-600" />
              {isAuthenticated ? (
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              ) : (
                <button 
                  onClick={() => setShowAuthModal(true)}
                  className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center"
                >
                  <User className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`
          }}
        ></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center">
          <div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Welcome<br />to AgroMitra
            </h1>
            <button className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 mx-auto">
              <span>Connect With Community</span>
              <span className="text-xl">🤝</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - Quick Actions */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => handleQuickAction(action.id)}
                  className={`${action.color} border-2 rounded-lg p-6 cursor-pointer hover:shadow-md transition-all duration-200 group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{action.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-gray-900">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {action.description}
                      </p>
                      <span className="text-sm text-gray-500">
                        {currentLanguage === 'hi' ? 'अब उपलब्ध' : 'Available now'} →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Soil Fertilizer Recommendation Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                    alt="Farm field"
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Get a Soil Fertilizer Recommendation
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get personalized fertilizer recommendations based on your soil analysis and crop type. Our ML-powered system provides accurate NPK and micronutrient suggestions.
                  </p>
                  <button 
                    onClick={() => handleQuickAction('soil-fertilizer')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <span>🌱</span>
                    <span>Get Fertilizer Advice</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Weather Widget */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Weather</h3>
                <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                  {weatherData.condition}
                </span>
              </div>
              
              <div className="text-center mb-4">
                {isLoadingWeather ? (
                  <div className="animate-pulse">
                    <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded mx-auto mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-4xl font-bold text-gray-800">{weatherData.temperature}°C</div>
                    <div className="text-sm text-gray-600">Humidity: {weatherData.humidity}%</div>
                    <div className="flex items-center justify-center text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {weatherData.location}
                    </div>
                  </>
                )}
              </div>

              <div className="text-right mb-4">
                {!isLoadingWeather && getWeatherIcon(weatherData.condition)}
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-800 mb-3">4-Day Forecast</h4>
                <div className="space-y-2">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{day.day}</span>
                      <span className="text-gray-800">{day.high}°-{day.low}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weather Alerts */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">Weather Alerts</h4>
                  <div className="space-y-2">
                    <div className="bg-yellow-100 rounded p-3">
                      <h5 className="font-medium text-yellow-800 text-sm">Heavy Rainfall Warning</h5>
                      <p className="text-xs text-yellow-700 mt-1">
                        Heavy rainfall expected in the next 24-48 hours. Ensure proper drainage and avoid waterlogging in fields.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasonal Farming Advisory */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Seasonal Farming Advisory</h4>
                  <div className="bg-blue-100 rounded p-3">
                    <p className="text-xs text-blue-700">
                      Monsoon season is ideal for rice cultivation. Monitor soil moisture and ensure proper pest control.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <section className="mt-16 bg-yellow-100 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Check Our Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Leaf className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Farming Products</h3>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full ${dot === 0 ? 'bg-gray-800' : 'bg-gray-400'}`}></div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <img src={logo1} alt="AgroMitra Logo" className="w-8 h-8" />
                <span className="text-2xl font-bold text-green-600">grimo</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Making next machines work. Start with recruitment data, do more acquisition data, do more leads between workers.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Useful Link</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>Company</li>
                    <li>About</li>
                    <li>Contact</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Working Time</h4>
                  <p className="text-sm text-gray-600">Mon - Fri 8:00am - 5:00pm<br />Saturday: 10:00am - 4:00pm<br />Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-1">
              <h4 className="font-semibold text-gray-800 mb-4">Our Address</h4>
              <p className="text-sm text-gray-600">
                99 Merrimac St, Boston MA<br />
                02114, United States
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600">
              Copyright © 2025 grimo. All Rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CleanHomepage;