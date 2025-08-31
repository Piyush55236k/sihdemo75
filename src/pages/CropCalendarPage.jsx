import React, { useState } from 'react'
import { ArrowLeft, Calendar, Clock, Thermometer, Droplets } from 'lucide-react'

const CropCalendarPage = ({ onBack, currentLanguage }) => {
  const [selectedCrop, setSelectedCrop] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [calendarData, setCalendarData] = useState(null)

  const crops = [
    { id: 'wheat', name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat' },
    { id: 'rice', name: currentLanguage === 'hi' ? 'चावल' : 'Rice' },
    { id: 'cotton', name: currentLanguage === 'hi' ? 'कपास' : 'Cotton' },
    { id: 'sugarcane', name: currentLanguage === 'hi' ? 'गन्ना' : 'Sugarcane' },
    { id: 'potato', name: currentLanguage === 'hi' ? 'आलू' : 'Potato' },
  ]

  const regions = [
    { id: 'north', name: currentLanguage === 'hi' ? 'उत्तर भारत' : 'North India' },
    { id: 'south', name: currentLanguage === 'hi' ? 'दक्षिण भारत' : 'South India' },
    { id: 'west', name: currentLanguage === 'hi' ? 'पश्चिम भारत' : 'West India' },
    { id: 'east', name: currentLanguage === 'hi' ? 'पूर्व भारत' : 'East India' },
  ]

  const mockCalendarData = {
    wheat: {
      name: currentLanguage === 'hi' ? 'गेहूं' : 'Wheat',
      seasons: [
        {
          month: currentLanguage === 'hi' ? 'अक्टूबर-नवंबर' : 'October-November',
          activity: currentLanguage === 'hi' ? 'बुआई' : 'Sowing',
          description: currentLanguage === 'hi' 
            ? 'खेत की तैयारी करें और बीज बोएं। तापमान 15-20°C होना चाहिए।'
            : 'Prepare field and sow seeds. Temperature should be 15-20°C.',
          temperature: '15-20°C',
          rainfall: currentLanguage === 'hi' ? 'कम' : 'Low'
        },
        {
          month: currentLanguage === 'hi' ? 'दिसंबर-जनवरी' : 'December-January',
          activity: currentLanguage === 'hi' ? 'विकास चरण' : 'Growth Stage',
          description: currentLanguage === 'hi'
            ? 'नियमित सिंचाई और उर्वरक डालें। खरपतवार नियंत्रण करें।'
            : 'Regular irrigation and fertilizer application. Control weeds.',
          temperature: '10-15°C',
          rainfall: currentLanguage === 'hi' ? 'कम' : 'Low'
        },
        {
          month: currentLanguage === 'hi' ? 'मार्च-अप्रैल' : 'March-April',
          activity: currentLanguage === 'hi' ? 'कटाई' : 'Harvesting',
          description: currentLanguage === 'hi'
            ? 'फसल तैयार होने पर कटाई करें। दाने सुनहरे रंग के हों।'
            : 'Harvest when crop is ready. Grains should be golden yellow.',
          temperature: '20-25°C',
          rainfall: currentLanguage === 'hi' ? 'कम' : 'Low'
        }
      ]
    }
  }

  const generateCalendar = () => {
    if (selectedCrop && selectedRegion) {
      setCalendarData(mockCalendarData[selectedCrop] || null)
    }
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
            {currentLanguage === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'फसल की खेती के लिए समय सारणी'
              : 'Timing schedule for crop cultivation'}
          </p>
        </div>
      </div>

      {/* Selection Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {currentLanguage === 'hi' ? 'फसल और क्षेत्र चुनें' : 'Select Crop and Region'}
        </h2>

        <div className="space-y-4">
          {/* Crop Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'फसल' : 'Crop'}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">
                {currentLanguage === 'hi' ? 'फसल चुनें' : 'Select Crop'}
              </option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {currentLanguage === 'hi' ? 'क्षेत्र' : 'Region'}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">
                {currentLanguage === 'hi' ? 'क्षेत्र चुनें' : 'Select Region'}
              </option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCalendar}
            disabled={!selectedCrop || !selectedRegion}
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentLanguage === 'hi' ? 'कैलेंडर बनाएं' : 'Generate Calendar'}
          </button>
        </div>
      </div>

      {/* Calendar Display */}
      {calendarData && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-500" />
            {calendarData.name} {currentLanguage === 'hi' ? 'कैलेंडर' : 'Calendar'}
          </h2>

          <div className="space-y-6">
            {calendarData.seasons.map((season, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    {season.month}
                  </h3>
                  <span className="text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full text-sm">
                    {season.activity}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{season.description}</p>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Thermometer className="w-4 h-4 mr-1 text-red-500" />
                    <span className="font-medium mr-1">
                      {currentLanguage === 'hi' ? 'तापमान:' : 'Temperature:'}
                    </span>
                    {season.temperature}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Droplets className="w-4 h-4 mr-1 text-blue-500" />
                    <span className="font-medium mr-1">
                      {currentLanguage === 'hi' ? 'वर्षा:' : 'Rainfall:'}
                    </span>
                    {season.rainfall}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!calendarData && selectedCrop && selectedRegion && (
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'इस फसल के लिए डेटा उपलब्ध नहीं है'
              : 'Data not available for this crop'}
          </p>
        </div>
      )}
    </div>
  )
}

export default CropCalendarPage
