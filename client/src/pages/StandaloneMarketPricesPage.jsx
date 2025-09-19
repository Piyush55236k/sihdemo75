import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, ArrowLeft, MapPin, RefreshCw, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StandaloneMarketPricesPage = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [pricesData, setPricesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const currentLanguage = 'en' // You can integrate with your language system

  const categories = [
    { id: 'all', name: currentLanguage === 'hi' ? 'सभी' : 'All' },
    { id: 'cereals', name: currentLanguage === 'hi' ? 'अनाज' : 'Cereals' },
    { id: 'vegetables', name: currentLanguage === 'hi' ? 'सब्जियां' : 'Vegetables' },
    { id: 'fruits', name: currentLanguage === 'hi' ? 'फल' : 'Fruits' },
    { id: 'pulses', name: currentLanguage === 'hi' ? 'दालें' : 'Pulses' },
  ]

  // Enhanced mock data for market prices
  const mockPricesData = [
    {
      id: 1,
      name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat',
      category: 'cereals',
      currentPrice: 2100,
      previousPrice: 2050,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'दिल्ली मंडी' : 'Delhi Market',
      trend: 'up',
      change: 2.4,
      quality: 'A Grade'
    },
    {
      id: 2,
      name: currentLanguage === 'hi' ? 'चावल (बासमती)' : 'Rice (Basmati)',
      category: 'cereals',
      currentPrice: 4500,
      previousPrice: 4550,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'पंजाब मंडी' : 'Punjab Market',
      trend: 'down',
      change: -1.1,
      quality: 'Premium'
    },
    {
      id: 3,
      name: currentLanguage === 'hi' ? 'आलू' : 'Potato',
      category: 'vegetables',
      currentPrice: 1200,
      previousPrice: 1150,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'उत्तर प्रदेश मंडी' : 'UP Market',
      trend: 'up',
      change: 4.3,
      quality: 'A Grade'
    },
    {
      id: 4,
      name: currentLanguage === 'hi' ? 'प्याज' : 'Onion',
      category: 'vegetables',
      currentPrice: 2800,
      previousPrice: 2900,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'महाराष्ट्र मंडी' : 'Maharashtra Market',
      trend: 'down',
      change: -3.4,
      quality: 'A Grade'
    },
    {
      id: 5,
      name: currentLanguage === 'hi' ? 'टमाटर' : 'Tomato',
      category: 'vegetables',
      currentPrice: 1800,
      previousPrice: 1700,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'कर्नाटक मंडी' : 'Karnataka Market',
      trend: 'up',
      change: 5.9,
      quality: 'A Grade'
    },
    {
      id: 6,
      name: 'Apple',
      category: 'fruits',
      currentPrice: 8500,
      previousPrice: 8200,
      unit: 'per quintal',
      market: 'Himachal Market',
      trend: 'up',
      change: 3.7,
      quality: 'Premium'
    },
    {
      id: 7,
      name: 'Moong Dal',
      category: 'pulses',
      currentPrice: 7200,
      previousPrice: 7150,
      unit: 'per quintal',
      market: 'Rajasthan Market',
      trend: 'up',
      change: 0.7,
      quality: 'A Grade'
    },
    {
      id: 8,
      name: 'Turmeric',
      category: 'spices',
      currentPrice: 9500,
      previousPrice: 9300,
      unit: 'per quintal',
      market: 'Tamil Nadu Market',
      trend: 'up',
      change: 2.2,
      quality: 'Premium'
    }
  ]

  const searchPrices = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      let filtered = mockPricesData
      
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(item => item.category === selectedCategory)
      }
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.market.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setPricesData(filtered)
      setLastUpdated(new Date())
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    searchPrices()
  }, [selectedCategory])

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <TrendingUp className="w-4 h-4 text-green-500" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500" />
    }
  }

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {currentLanguage === 'hi' ? 'बाजार मूल्य' : 'Market Prices'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'वर्तमान फसल की कीमतें देखें'
              : 'Check current crop prices across markets'
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last Updated</p>
          <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? 'फसल या बाजार खोजें...' : 'Search crops or markets...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? 'स्थान...' : 'Location...'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-w-[200px]"
            />
          </div>

          {/* Refresh Button */}
          <button
            onClick={searchPrices}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {currentLanguage === 'hi' ? 'रीफ्रेश' : 'Refresh'}
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
            <span className="text-gray-600">
              {currentLanguage === 'hi' ? 'मूल्य अपडेट हो रहे हैं...' : 'Updating prices...'}
            </span>
          </div>
        </div>
      )}

      {/* Prices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricesData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.quality}</p>
              </div>
              <div className="flex items-center">
                {getTrendIcon(item.trend)}
                <span className={`ml-1 text-sm font-medium ${getTrendColor(item.trend)}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {formatPrice(item.currentPrice)}
              </div>
              <div className="text-sm text-gray-500">{item.unit}</div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{item.market}</span>
              </div>
              <div className={`font-medium ${getTrendColor(item.trend)}`}>
                {formatPrice(Math.abs(item.currentPrice - item.previousPrice))} 
                {item.trend === 'up' ? ' ↑' : ' ↓'}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Previous: {formatPrice(item.previousPrice)}</span>
                <span>Category: {item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {!loading && pricesData.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {currentLanguage === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No Results Found'}
          </h3>
          <p className="text-gray-500">
            {currentLanguage === 'hi' 
              ? 'अपनी खोज को बदलने का प्रयास करें या अलग श्रेणी चुनें'
              : 'Try adjusting your search or select a different category'
            }
          </p>
        </div>
      )}

      {/* Market Info */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentLanguage === 'hi' ? 'बाजार की जानकारी' : 'Market Information'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Price Sources</h4>
            <p className="text-blue-600">Government mandis, APMC markets, and verified traders</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">Update Frequency</h4>
            <p className="text-green-600">Prices updated every 2 hours during market hours</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Quality Standards</h4>
            <p className="text-orange-600">Prices based on A-grade quality standards</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StandaloneMarketPricesPage