import React, { useState } from 'react'
import { Camera, Upload, ArrowLeft, Bug, Leaf, AlertTriangle } from 'lucide-react'

const PestCheckPage = ({ onBack, currentLanguage }) => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [loading, setLoading] = useState(false)

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
          pest: currentLanguage === 'hi' ? 'पत्ती का धब्बा' : 'Leaf Spot',
          confidence: 85,
          severity: currentLanguage === 'hi' ? 'मध्यम' : 'Moderate',
          treatment: currentLanguage === 'hi' 
            ? 'कॉपर-आधारित फंजीसाइड का छिड़काव करें। संक्रमित पत्तियों को हटाएं।'
            : 'Apply copper-based fungicide spray. Remove infected leaves.',
          prevention: currentLanguage === 'hi'
            ? 'अच्छी जल निकासी सुनिश्चित करें और पत्तियों को सूखा रखें।'
            : 'Ensure good drainage and keep leaves dry.'
        }
      ]
      setAnalysisResult(mockResults[0])
      setLoading(false)
    }, 2000)
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
            {currentLanguage === 'hi' ? 'कीट जांच' : 'Pest Check'}
          </h1>
          <p className="text-gray-600">
            {currentLanguage === 'hi' 
              ? 'अपनी फसल की तस्वीर अपलोड करें'
              : 'Upload image of your crop for analysis'}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Camera className="w-5 h-5 mr-2" />
            {currentLanguage === 'hi' ? 'फोटो अपलोड करें' : 'Upload Photo'}
          </label>
        </div>

        {selectedImage && (
          <div className="mt-6">
            <img
              src={selectedImage}
              alt="Uploaded crop"
              className="w-full max-w-md mx-auto rounded-lg shadow-md"
            />
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
            <span className="text-gray-600">
              {currentLanguage === 'hi' ? 'विश्लेषण हो रहा है...' : 'Analyzing image...'}
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

          <div className="space-y-4">
            {/* Pest Identification */}
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold text-gray-800">
                {currentLanguage === 'hi' ? 'पहचाना गया कीट/रोग:' : 'Identified Pest/Disease:'}
              </h3>
              <p className="text-lg text-red-600 font-medium">{analysisResult.pest}</p>
              <p className="text-sm text-gray-600">
                {currentLanguage === 'hi' ? 'विश्वसनीयता:' : 'Confidence:'} {analysisResult.confidence}%
              </p>
            </div>

            {/* Severity */}
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold text-gray-800">
                {currentLanguage === 'hi' ? 'गंभीरता:' : 'Severity:'}
              </h3>
              <p className="text-yellow-600 font-medium">{analysisResult.severity}</p>
            </div>

            {/* Treatment */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <Leaf className="w-4 h-4 mr-1" />
                {currentLanguage === 'hi' ? 'उपचार:' : 'Treatment:'}
              </h3>
              <p className="text-gray-700">{analysisResult.treatment}</p>
            </div>

            {/* Prevention */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                {currentLanguage === 'hi' ? 'भविष्य में रोकथाम:' : 'Prevention:'}
              </h3>
              <p className="text-gray-700">{analysisResult.prevention}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PestCheckPage
