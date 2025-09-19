import React, { useState } from 'react'
import { Camera, Upload, ArrowLeft, Bug, Leaf, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const StandalonePestCheckPage = () => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const currentLanguage = 'en' // You can integrate with your language system

  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
        // Auto-analyze when image is uploaded
        analyzeImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData) => {
    setLoading(true)
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = [
        {
          pest: currentLanguage === 'hi' ? 'पत्ती का धब्बा' : 'Leaf Spot Disease',
          confidence: 85,
          severity: currentLanguage === 'hi' ? 'मध्यम' : 'Moderate',
          treatment: currentLanguage === 'hi' 
            ? 'कॉपर-आधारित फंजीसाइड का छिड़काव करें। संक्रमित पत्तियों को हटाएं।'
            : 'Apply copper-based fungicide spray. Remove infected leaves. Improve air circulation around plants.',
          prevention: currentLanguage === 'hi'
            ? 'अच्छी जल निकासी सुनिश्चित करें और पत्तियों को सूखा रखें।'
            : 'Ensure good drainage and keep leaves dry. Avoid overhead watering.'
        },
        {
          pest: 'Aphid Infestation',
          confidence: 92,
          severity: 'High',
          treatment: 'Apply neem oil spray or insecticidal soap. Introduce beneficial insects like ladybugs.',
          prevention: 'Regular monitoring and maintaining beneficial insect populations.'
        },
        {
          pest: 'Bacterial Blight',
          confidence: 78,
          severity: 'Moderate',
          treatment: 'Remove affected parts and apply bactericide. Improve field sanitation.',
          prevention: 'Use certified disease-free seeds and practice crop rotation.'
        }
      ]
      
      // Random selection for demo
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      setAnalysisResult(randomResult)
      setLoading(false)
    }, 2000)
  }

  const takePhoto = () => {
    // In a real app, this would access the camera
    document.getElementById('camera-input').click()
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
            {currentLanguage === 'hi' ? 'कीट जांच' : 'Pest Detection'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'अपनी फसल की तस्वीर अपलोड करें और तुरंत कीट पहचान पाएं'
              : 'Upload your crop image for instant pest identification'
            }
          </p>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {currentLanguage === 'hi' ? 'फसल की तस्वीर अपलोड करें' : 'Upload Crop Image'}
        </h2>
        
        {!selectedImage ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <button
                  onClick={takePhoto}
                  className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {currentLanguage === 'hi' ? 'फोटो लें' : 'Take Photo'}
                </button>
                
                <label className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  {currentLanguage === 'hi' ? 'फाइल चुनें' : 'Choose File'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="camera-input"
                  />
                </label>
              </div>
              
              <p className="text-gray-500 text-sm">
                {currentLanguage === 'hi' 
                  ? 'JPG, PNG या WEBP फाइल अपलोड करें (अधिकतम 10MB)'
                  : 'Upload JPG, PNG or WEBP files (Max 10MB)'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Uploaded crop"
                className="w-full max-w-md mx-auto rounded-lg shadow-lg"
              />
              <button
                onClick={() => {
                  setSelectedImage(null)
                  setAnalysisResult(null)
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            {!loading && !analysisResult && (
              <div className="text-center">
                <button
                  onClick={() => analyzeImage(selectedImage)}
                  className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {currentLanguage === 'hi' ? 'विश्लेषण शुरू करें' : 'Analyze Image'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
            <span className="text-gray-600">
              {currentLanguage === 'hi' ? 'AI द्वारा विश्लेषण हो रहा है...' : 'AI is analyzing your image...'}
            </span>
          </div>
        </div>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Bug className="w-6 h-6 mr-2 text-red-500" />
            {currentLanguage === 'hi' ? 'जांच परिणाम' : 'Analysis Results'}
          </h2>

          <div className="space-y-6">
            {/* Pest Identification */}
            <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-800 text-lg">
                {currentLanguage === 'hi' ? 'पहचाना गया कीट/रोग:' : 'Identified Pest/Disease:'}
              </h3>
              <p className="text-xl text-red-600 font-bold">{analysisResult.pest}</p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">
                  {currentLanguage === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'} 
                </span>
                <div className="ml-2 bg-gray-200 rounded-full h-2 w-20">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{width: `${analysisResult.confidence}%`}}
                  ></div>
                </div>
                <span className="ml-2 text-sm font-medium">{analysisResult.confidence}%</span>
              </div>
            </div>

            {/* Severity */}
            <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-800 text-lg">
                {currentLanguage === 'hi' ? 'गंभीरता स्तर:' : 'Severity Level:'}
              </h3>
              <p className="text-lg text-yellow-600 font-semibold">{analysisResult.severity}</p>
            </div>

            {/* Treatment */}
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                {currentLanguage === 'hi' ? 'अनुशंसित उपचार:' : 'Recommended Treatment:'}
              </h3>
              <p className="text-gray-700 leading-relaxed">{analysisResult.treatment}</p>
            </div>

            {/* Prevention */}
            <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r-lg">
              <h3 className="font-semibold text-gray-800 text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                {currentLanguage === 'hi' ? 'भविष्य में रोकथाम:' : 'Prevention Tips:'}
              </h3>
              <p className="text-gray-700 leading-relaxed">{analysisResult.prevention}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <button 
                onClick={() => {
                  setSelectedImage(null)
                  setAnalysisResult(null)
                }}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {currentLanguage === 'hi' ? 'नई जांच करें' : 'Check Another Image'}
              </button>
              <button 
                onClick={() => window.print()}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                {currentLanguage === 'hi' ? 'रिपोर्ट प्रिंट करें' : 'Print Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {currentLanguage === 'hi' ? 'बेहतर परिणामों के लिए टिप्स:' : 'Tips for Better Results:'}
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            {currentLanguage === 'hi' 
              ? 'स्पष्ट और उच्च गुणवत्ता की तस्वीर लें'
              : 'Take clear, high-quality photos'
            }
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            {currentLanguage === 'hi' 
              ? 'प्रभावित क्षेत्र को फोकस में रखें'
              : 'Focus on the affected area'
            }
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            {currentLanguage === 'hi' 
              ? 'प्राकृतिक प्रकाश में फोटो लें'
              : 'Take photos in natural lighting'
            }
          </li>
          <li className="flex items-start">
            <span className="text-green-500 mr-2">•</span>
            {currentLanguage === 'hi' 
              ? 'कई कोणों से तस्वीरें लें'
              : 'Capture images from multiple angles'
            }
          </li>
        </ul>
      </div>
    </div>
  )
}

export default StandalonePestCheckPage