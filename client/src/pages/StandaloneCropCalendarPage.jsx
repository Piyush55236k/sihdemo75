import React, { useState } from 'react'
import { ArrowLeft, Calendar, Clock, Thermometer, Droplets, Sun, CloudRain, Leaf, Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StandaloneCropCalendarPage = () => {
  const navigate = useNavigate()
  const [selectedCrop, setSelectedCrop] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [calendarData, setCalendarData] = useState(null)
  const currentLanguage = 'en' // You can integrate with your language system

  const crops = [
    { id: 'wheat', name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat', icon: '🌾' },
    { id: 'rice', name: currentLanguage === 'hi' ? 'चावल' : 'Rice', icon: '🌾' },
    { id: 'cotton', name: currentLanguage === 'hi' ? 'कपास' : 'Cotton', icon: '🌿' },
    { id: 'sugarcane', name: currentLanguage === 'hi' ? 'गन्ना' : 'Sugarcane', icon: '🎋' },
    { id: 'potato', name: currentLanguage === 'hi' ? 'आलू' : 'Potato', icon: '🥔' },
    { id: 'tomato', name: 'Tomato', icon: '🍅' },
    { id: 'onion', name: 'Onion', icon: '🧅' },
    { id: 'maize', name: 'Maize', icon: '🌽' },
  ]

  const regions = [
    { id: 'north', name: currentLanguage === 'hi' ? 'उत्तर भारत' : 'North India' },
    { id: 'south', name: currentLanguage === 'hi' ? 'दक्षिण भारत' : 'South India' },
    { id: 'west', name: currentLanguage === 'hi' ? 'पश्चिम भारत' : 'West India' },
    { id: 'east', name: currentLanguage === 'hi' ? 'पूर्व भारत' : 'East India' },
    { id: 'central', name: 'Central India' },
  ]

  const mockCalendarData = {
    wheat: {
      name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat',
      duration: '120-150 days',
      seasons: [
        {
          month: currentLanguage === 'hi' ? 'अक्टूबर-नवंबर' : 'October-November',
          activity: currentLanguage === 'hi' ? 'भूमि तैयारी और बुआई' : 'Land Preparation & Sowing',
          description: currentLanguage === 'hi' 
            ? 'खेत की जुताई, समतलीकरण और बीज बोएं। तापमान 15-20°C होना चाहिए।'
            : 'Plough field, level the land and sow seeds. Temperature should be 15-20°C.',
          temperature: '15-20°C',
          rainfall: currentLanguage === 'hi' ? 'कम (50-100mm)' : 'Low (50-100mm)',
          tasks: ['Field preparation', 'Seed treatment', 'Sowing', 'Fertilizer application'],
          tips: ['Use certified seeds', 'Apply FYM before sowing', 'Ensure proper drainage']
        },
        {
          month: currentLanguage === 'hi' ? 'दिसंबर-जनवरी' : 'December-January',
          activity: currentLanguage === 'hi' ? 'विकास और देखभाल' : 'Growth & Care',
          description: currentLanguage === 'hi'
            ? 'नियमित सिंचाई, उर्वरक डालें और खरपतवार नियंत्रण करें।'
            : 'Regular irrigation, fertilizer application and weed control.',
          temperature: '10-15°C',
          rainfall: currentLanguage === 'hi' ? 'कम (20-50mm)' : 'Low (20-50mm)',
          tasks: ['Irrigation management', 'Weed control', 'Top dressing', 'Pest monitoring'],
          tips: ['Water early morning', 'Remove weeds manually', 'Monitor for pests']
        },
        {
          month: currentLanguage === 'hi' ? 'फरवरी-मार्च' : 'February-March',
          activity: currentLanguage === 'hi' ? 'फूल आना और दाना भरना' : 'Flowering & Grain Filling',
          description: currentLanguage === 'hi'
            ? 'फसल में फूल आना और दाना भरने का समय। पानी की आवश्यकता अधिक।'
            : 'Flowering stage and grain filling period. Higher water requirement.',
          temperature: '15-25°C',
          rainfall: currentLanguage === 'hi' ? 'कम (30-60mm)' : 'Low (30-60mm)',
          tasks: ['Critical irrigation', 'Disease monitoring', 'Nutrient management'],
          tips: ['Ensure adequate water', 'Check for diseases', 'Avoid waterlogging']
        },
        {
          month: currentLanguage === 'hi' ? 'अप्रैल-मई' : 'April-May',
          activity: currentLanguage === 'hi' ? 'पकना और कटाई' : 'Maturity & Harvesting',
          description: currentLanguage === 'hi'
            ? 'फसल पकने पर कटाई करें। दाने सुनहरे रंग के हों।'
            : 'Harvest when crop is mature. Grains should be golden yellow.',
          temperature: '20-30°C',
          rainfall: currentLanguage === 'hi' ? 'कम (20-40mm)' : 'Low (20-40mm)',
          tasks: ['Harvesting', 'Threshing', 'Storage preparation'],
          tips: ['Harvest at right time', 'Proper drying', 'Safe storage']
        }
      ]
    },
    rice: {
      name: 'Rice',
      duration: '90-120 days',
      seasons: [
        {
          month: 'June-July',
          activity: 'Nursery Preparation & Transplanting',
          description: 'Prepare nursery beds and transplant seedlings after 25-30 days.',
          temperature: '25-35°C',
          rainfall: 'High (150-200mm)',
          tasks: ['Nursery preparation', 'Seed treatment', 'Transplanting', 'Field flooding'],
          tips: ['Use certified seeds', 'Maintain water level', 'Proper spacing']
        },
        {
          month: 'August-September',
          activity: 'Vegetative Growth',
          description: 'Active growth phase requiring proper water and nutrient management.',
          temperature: '25-30°C',
          rainfall: 'High (200-300mm)',
          tasks: ['Water management', 'Fertilizer application', 'Weed control'],
          tips: ['Maintain 2-3 cm water', 'Apply urea in splits', 'Control weeds early']
        },
        {
          month: 'October-November',
          activity: 'Reproductive Stage',
          description: 'Flowering and grain formation stage. Critical water management.',
          temperature: '20-28°C',
          rainfall: 'Medium (100-150mm)',
          tasks: ['Panicle initiation care', 'Disease monitoring', 'Water management'],
          tips: ['Monitor for blast disease', 'Ensure continuous water', 'Balanced nutrition']
        },
        {
          month: 'November-December',
          activity: 'Harvesting',
          description: 'Harvest when 80% grains are golden yellow.',
          temperature: '15-25°C',
          rainfall: 'Low (50-100mm)',
          tasks: ['Harvesting', 'Drying', 'Storage'],
          tips: ['Harvest at right moisture', 'Proper drying', 'Pest-free storage']
        }
      ]
    },
    tomato: {
      name: 'Tomato',
      duration: '90-120 days',
      seasons: [
        {
          month: 'June-July (Kharif) / November-December (Rabi)',
          activity: 'Nursery & Transplanting',
          description: 'Prepare nursery and transplant 4-5 week old seedlings.',
          temperature: '20-25°C',
          rainfall: 'Medium (60-100mm)',
          tasks: ['Nursery preparation', 'Seed sowing', 'Transplanting', 'Field preparation'],
          tips: ['Use disease-free seeds', 'Hardening of seedlings', 'Proper spacing']
        },
        {
          month: 'August-September / January-February',
          activity: 'Vegetative Growth',
          description: 'Active vegetative growth with regular care and nutrition.',
          temperature: '22-28°C',
          rainfall: 'Medium (40-80mm)',
          tasks: ['Irrigation', 'Fertilizer application', 'Staking', 'Pruning'],
          tips: ['Regular watering', 'Support plants', 'Remove suckers']
        },
        {
          month: 'September-October / February-March',
          activity: 'Flowering & Fruiting',
          description: 'Flowering starts and fruit development begins.',
          temperature: '20-26°C',
          rainfall: 'Low (20-50mm)',
          tasks: ['Flower care', 'Fruit development', 'Disease control'],
          tips: ['Avoid water stress', 'Monitor for diseases', 'Balanced fertilization']
        },
        {
          month: 'October-December / March-May',
          activity: 'Harvesting',
          description: 'Multiple harvests as fruits ripen gradually.',
          temperature: '18-25°C',
          rainfall: 'Low (10-30mm)',
          tasks: ['Regular harvesting', 'Grading', 'Marketing'],
          tips: ['Harvest at right stage', 'Handle carefully', 'Quick marketing']
        }
      ]
    }
  }

  const generateCalendar = () => {
    if (selectedCrop && selectedRegion) {
      setCalendarData(mockCalendarData[selectedCrop] || null)
    }
  }

  const getActivityIcon = (activity) => {
    if (activity.includes('Sowing') || activity.includes('बुआई')) return <Sprout className="w-5 h-5" />
    if (activity.includes('Growth') || activity.includes('विकास')) return <Leaf className="w-5 h-5" />
    if (activity.includes('Flowering') || activity.includes('फूल')) return <Sun className="w-5 h-5" />
    if (activity.includes('Harvest') || activity.includes('कटाई')) return <Calendar className="w-5 h-5" />
    return <Clock className="w-5 h-5" />
  }

  const getSeasonColor = (index) => {
    const colors = ['bg-green-100 border-green-300', 'bg-blue-100 border-blue-300', 'bg-orange-100 border-orange-300', 'bg-purple-100 border-purple-300']
    return colors[index % colors.length]
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {currentLanguage === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'अपनी फसल के लिए मौसमी खेती कैलेंडर देखें'
              : 'View seasonal farming calendar for your crops'
            }
          </p>
        </div>
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentLanguage === 'hi' ? 'फसल और क्षेत्र चुनें' : 'Select Crop and Region'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Crop Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'फसल चुनें' : 'Select Crop'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">
                {currentLanguage === 'hi' ? 'फसल चुनें' : 'Choose a crop'}
              </option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.icon} {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'क्षेत्र चुनें' : 'Select Region'}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">
                {currentLanguage === 'hi' ? 'क्षेत्र चुनें' : 'Choose a region'}
              </option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateCalendar}
          disabled={!selectedCrop || !selectedRegion}
          className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentLanguage === 'hi' ? 'कैलेंडर बनाएं' : 'Generate Calendar'}
        </button>
      </div>

      {/* Calendar Display */}
      {calendarData && (
        <div className="space-y-6">
          {/* Crop Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{calendarData.name}</h2>
              <div className="text-right">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="text-lg font-semibold text-green-600">{calendarData.duration}</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {calendarData.seasons.map((season, index) => (
              <div key={index} className={`bg-white rounded-xl shadow-lg border-l-4 ${getSeasonColor(index)} p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    {getActivityIcon(season.activity)}
                    <div className="ml-3">
                      <h3 className="text-lg font-bold text-gray-800">{season.activity}</h3>
                      <p className="text-gray-600">{season.month}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Stage {index + 1} of {calendarData.seasons.length}</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{season.description}</p>

                {/* Environmental Conditions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <Thermometer className="w-5 h-5 text-orange-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className="font-semibold text-orange-700">{season.temperature}</div>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <CloudRain className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Rainfall</div>
                      <div className="font-semibold text-blue-700">{season.rainfall}</div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Tasks:</h4>
                  <div className="flex flex-wrap gap-2">
                    {season.tasks.map((task, taskIndex) => (
                      <span key={taskIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Pro Tips:</h4>
                  <ul className="space-y-1">
                    {season.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start text-sm text-gray-600">
                        <span className="text-green-500 mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Important Notes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Weather Dependency</h4>
                <p className="text-yellow-700">Timings may vary based on local weather conditions and climate change patterns.</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">💧 Water Management</h4>
                <p className="text-blue-700">Adjust irrigation schedules based on rainfall and soil moisture levels.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🌱 Soil Health</h4>
                <p className="text-green-700">Regular soil testing helps optimize fertilizer application and crop yields.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">🔍 Monitoring</h4>
                <p className="text-purple-700">Regular field monitoring helps early detection of pests and diseases.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No Selection State */}
      {!calendarData && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {currentLanguage === 'hi' ? 'कैलेंडर बनाने के लिए फसल और क्षेत्र चुनें' : 'Select crop and region to generate calendar'}
          </h3>
          <p className="text-gray-500">
            {currentLanguage === 'hi' 
              ? 'ऊपर दिए गए विकल्पों से अपनी फसल और क्षेत्र चुनें'
              : 'Choose your crop and region from the options above'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default StandaloneCropCalendarPage