import React, { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, ArrowLeft, MapPin } from 'lucide-react'

const MarketPricesPage = ({ onBack, currentLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [pricesData, setPricesData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: currentLanguage === 'hi' ? 'सभी' : 'All' },
    { id: 'cereals', name: currentLanguage === 'hi' ? 'अनाज' : 'Cereals' },
    { id: 'vegetables', name: currentLanguage === 'hi' ? 'सब्जियां' : 'Vegetables' },
    { id: 'fruits', name: currentLanguage === 'hi' ? 'फल' : 'Fruits' },
    { id: 'pulses', name: currentLanguage === 'hi' ? 'दालें' : 'Pulses' },
  ]

  // Mock data for market prices
  const mockPricesData = [
    {
      id: 1,
      name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat',
      category: 'cereals',
      currentPrice: 2100,
      previousPrice: 2050,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'दिल्ली मंडी' : 'Delhi Market',
      trend: 'up'
    },
    {
      id: 2,
      name: currentLanguage === 'hi' ? 'चावल' : 'Rice',
      category: 'cereals',
      currentPrice: 3200,
      previousPrice: 3250,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'पंजाब मंडी' : 'Punjab Market',
      trend: 'down'
    },
    {
      id: 3,
      name: currentLanguage === 'hi' ? 'आलू' : 'Potato',
      category: 'vegetables',
      currentPrice: 1200,
      previousPrice: 1150,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'उत्तर प्रदेश मंडी' : 'UP Market',
      trend: 'up'
    },
    {
      id: 4,
      name: currentLanguage === 'hi' ? 'प्याज' : 'Onion',
      category: 'vegetables',
      currentPrice: 2800,
      previousPrice: 2900,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'महाराष्ट्र मंडी' : 'Maharashtra Market',
      trend: 'down'
    },
    {
      id: 5,
      name: currentLanguage === 'hi' ? 'टमाटर' : 'Tomato',
      category: 'vegetables',
      currentPrice: 1800,
      previousPrice: 1700,
      unit: currentLanguage === 'hi' ? 'प्रति क्विंटल' : 'per quintal',
      market: currentLanguage === 'hi' ? 'कर्नाटक मंडी' : 'Karnataka Market',
      trend: 'up'
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
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      setPricesData(filtered)
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
    return trend === 'up' ? 'text-green-500' : 'text-red-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentLanguage === 'hi' ? 'बाजार मूल्य' : 'Market Prices'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'वर्तमान कृषि उत्पादों के मूल्य'
              : 'Current agricultural commodity prices'}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Location Input */}
        <div className="mb-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? 'स्थान दर्ज करें' : 'Enter location'}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={currentLanguage === 'hi' ? 'उत्पाद खोजें...' : 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Search Button */}
        <button
          onClick={searchPrices}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading
            ? (currentLanguage === 'hi' ? 'खोज रहे हैं...' : 'Searching...')
            : (currentLanguage === 'hi' ? 'खोजें' : 'Search')
          }
        </button>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
            <span className="text-gray-600">
              {currentLanguage === 'hi' ? 'मूल्य लोड हो रहे हैं...' : 'Loading prices...'}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {pricesData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                  <p className="text-gray-600 flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.market}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-2xl font-bold text-green-600">
                        ₹{item.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">{item.unit}</span>
                    </div>
                    <div className={`flex items-center ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)}
                      <span className="ml-1 text-sm font-medium">
                        ₹{Math.abs(item.currentPrice - item.previousPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {pricesData.length === 0 && !loading && (
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <p className="text-gray-600">
                {currentLanguage === 'hi' 
                  ? 'कोई परिणाम नहीं मिला'
                  : 'No results found'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketPricesPage
