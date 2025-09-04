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

  // Helper to map API commodity/category to our UI categories
  const getCategory = (commodity) => {
    const cereals = ['Wheat', 'Rice', 'Barley', 'Maize', 'Jowar', 'Bajra'];
    const vegetables = ['Potato', 'Onion', 'Tomato', 'Cabbage', 'Cauliflower', 'Brinjal'];
    const fruits = ['Apple', 'Banana', 'Mango', 'Orange', 'Grapes'];
    const pulses = ['Gram', 'Moong', 'Urad', 'Masur', 'Arhar'];
    if (cereals.includes(commodity)) return 'cereals';
    if (vegetables.includes(commodity)) return 'vegetables';
    if (fruits.includes(commodity)) return 'fruits';
    if (pulses.includes(commodity)) return 'pulses';
    return 'other';
  };

  const API_KEY = '579b464db66ec23bdd000001dda46aaf9c6b461e48b39f92f735f8b0';
  const BASE_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';

  const searchPrices = async () => {
    setLoading(true);
    let url = `${BASE_URL}?api-key=${API_KEY}&format=json&limit=100`;
    if (searchTerm) url += `&filters[commodity]=${encodeURIComponent(searchTerm)}`;
    if (location) url += `&filters[market]=${encodeURIComponent(location)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      let records = data.records || [];
      // Filter by category if not 'all'
      if (selectedCategory !== 'all') {
        records = records.filter(item => getCategory(item.commodity) === selectedCategory);
      }
      // Map API data to UI format
      const mapped = records.map((item, idx) => ({
        id: idx + 1,
        name: item.commodity,
        category: getCategory(item.commodity),
        currentPrice: Number(item.modal_price),
        previousPrice: Number(item.min_price),
        unit: item.unit_of_price,
        market: item.market,
        trend: Number(item.modal_price) >= Number(item.min_price) ? 'up' : 'down',
      }));
      setPricesData(mapped);
    } catch (e) {
      setPricesData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    searchPrices();
    // eslint-disable-next-line
  }, [selectedCategory]);

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