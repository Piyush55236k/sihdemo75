import React, { useState } from "react";
import {
  Camera,
  Upload,
  X,
  Loader,
  MapPin,
  Leaf,
  TrendingUp,
  Droplets,
  Thermometer,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuth } from "./AuthProvider_Real";
import cropAdvisoryService from "../services/cropAdvisoryService";
import weatherService from "../services/weatherService";
import config from "../config/env";

const CropAdvisory = ({ isOpen, onClose }) => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAdvisory, setCurrentAdvisory] = useState(null);
  const [language, setLanguage] = useState(config.language.default);
  const [showResults, setShowResults] = useState(false);

  if (!isOpen) return null;

  // Removed image upload and camera logic

  const processCropAdvisory = async () => {
    setIsAnalyzing(true);
    try {
      // Get user location
      const location = await weatherService.getCurrentLocation();
      // Get comprehensive crop advisory (no image)
      const advisory = await cropAdvisoryService.getCropAdvisory(null, location, { language });
      setCurrentAdvisory(advisory);
      setShowResults(true);
    } catch (error) {
      console.error("Crop advisory error:", error);
      alert(
        language === "hi"
          ? "क्षमा करें, फसल सलाह प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Sorry, there was an error getting crop advisory. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClose = () => {
    setCurrentAdvisory(null);
    setShowResults(false);
    setIsAnalyzing(false);
    onClose();
  };

  const resetAnalysis = () => {
    setCurrentAdvisory(null);
    setShowResults(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="text-center">
            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {language === "hi" ? "लॉगिन आवश्यक" : "Login Required"}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === "hi"
                ? "फसल सलाह सुविधा का उपयोग करने के लिए कृपया लॉगिन करें"
                : "Please login to use the Crop Advisory feature"}
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {language === "hi" ? "ठीक है" : "OK"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto ${
          showResults ? "max-w-4xl" : "max-w-md"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <Leaf className="w-7 h-7 text-green-600 mr-3" />
              {language === "hi" ? "स्मार्ट फसल सलाह" : "Smart Crop Advisory"}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showResults ? (
            /* Advisory Interface (no image/camera) */
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">
                  {language === "hi"
                    ? "AI-powered फसल सुझाव प्राप्त करें"
                    : "Get AI-powered crop recommendations"}
                </p>
                <p className="text-sm text-gray-500">
                  {language === "hi"
                    ? "मौसम डेटा और स्थान आधारित विश्लेषण के साथ"
                    : "With weather data and location-based analysis"}
                </p>
              </div>

              {/* Features Info */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  {language === "hi"
                    ? "आप क्या प्राप्त करेंगे:"
                    : "What You'll Get:"}
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {language === "hi" ? "मिट्टी विश्लेषण" : "Soil Analysis"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {language === "hi" ? "फसल सुझाव" : "Crop Suggestions"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {language === "hi" ? "मौसम डेटा" : "Weather Data"}
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    {language === "hi" ? "कृषि सुझाव" : "Farming Tips"}
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center text-blue-800 text-sm">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {language === "hi"
                      ? "आपका स्थान और वर्तमान मौसम डेटा स्वचालित रूप से शामिल किया जाएगा"
                      : "Your location and current weather data will be included automatically"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={processCropAdvisory}
                disabled={isAnalyzing}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-lg font-semibold shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader className="w-5 h-5 mr-3 animate-spin" />
                    {language === "hi"
                      ? "AI विश्लेषण कर रहा है..."
                      : "AI Analyzing..."}
                  </>
                ) : (
                  <>
                    <Leaf className="w-5 h-5 mr-3" />
                    {language === "hi"
                      ? "स्मार्ट सलाह प्राप्त करें"
                      : "Get Smart Advisory"}
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Results Interface */
            <AdvisoryResults
              advisory={currentAdvisory}
              language={language}
              onReset={resetAnalysis}
            />
          )}
        </div>

        {/* Image upload removed: using location + weather only */}
      </div>
    </div>
  );
};

// Results Component
const AdvisoryResults = ({ advisory, language, onReset }) => {
  if (!advisory?.success) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {language === "hi" ? "विश्लेषण असफल" : "Analysis Failed"}
        </h3>
        <p className="text-gray-600 mb-6">
          {advisory?.error ||
            (language === "hi" ? "कुछ गलत हुआ" : "Something went wrong")}
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {language === "hi" ? "दोबारा कोशिश करें" : "Try Again"}
        </button>
      </div>
    );
  }

  const { soil, crop_recommendations, weather, farming_tips } = advisory;

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center bg-green-50 rounded-xl p-6">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {language === "hi"
            ? "🌾 आपकी फसल सलाह तैयार है!"
            : "🌾 Your Crop Advisory is Ready!"}
        </h3>
        <p className="text-gray-600">
          {language === "hi"
            ? "AI द्वारा विश्लेषित व्यापक कृषि सुझाव"
            : "Comprehensive farming recommendations powered by AI"}
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Soil Analysis */}
        {soil && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
              {language === "hi" ? "मिट्टी विश्लेषण" : "Soil Analysis"}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "प्रकार:" : "Type:"}
                </span>
                <span className="text-gray-700">{soil.soil_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "pH स्तर:" : "pH Level:"}
                </span>
                <span className="text-gray-700">{soil.ph_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "कार्बनिक पदार्थ:" : "Organic Matter:"}
                </span>
                <span className="text-gray-700">{soil.organic_matter}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Weather Data */}
        {weather?.current && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
            <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Thermometer className="w-5 h-5 mr-3 text-blue-600" />
              {language === "hi" ? "मौसम की स्थिति" : "Weather Conditions"}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "तापमान:" : "Temperature:"}
                </span>
                <span className="text-gray-700">
                  {weather.current.temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "नमी:" : "Humidity:"}
                </span>
                <span className="text-gray-700">
                  {weather.current.humidity}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">
                  {language === "hi" ? "बारिश:" : "Rainfall:"}
                </span>
                <span className="text-gray-700">
                  {weather.current.rainfall}mm
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Crop Recommendations */}
      {crop_recommendations?.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-3 text-green-600" />
            {language === "hi" ? "सुझाई गई फसलें" : "Recommended Crops"}
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            {crop_recommendations.slice(0, 4).map((crop, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-green-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-lg capitalize">
                    {crop.crop_name}
                  </h5>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    {Math.round(crop.suitability_score * 100)}%{" "}
                    {language === "hi" ? "उपयुक्त" : "Suitable"}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{crop.growing_period}</span>
                  </div>
                  <div className="flex items-center">
                    <Droplets className="w-4 h-4 mr-2" />
                    <span>
                      {language === "hi" ? "पानी:" : "Water:"}{" "}
                      {crop.water_requirement}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>
                      {language === "hi" ? "निवेश:" : "Investment:"}{" "}
                      {crop.investment_level}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Farming Tips */}
      {farming_tips?.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Leaf className="w-5 h-5 mr-3 text-purple-600" />
            {language === "hi" ? "कृषि सुझाव" : "Farming Tips"}
          </h4>
          <div className="space-y-4">
            {farming_tips.slice(0, 3).map((tip, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-purple-200"
              >
                <h5 className="font-semibold text-gray-800 mb-2">
                  {tip.title}
                </h5>
                <p className="text-gray-600 text-sm mb-2">{tip.description}</p>
                <p className="text-purple-700 text-sm font-medium">
                  {tip.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 pt-4">
        <button
          onClick={onReset}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          {language === "hi" ? "नई सलाह प्राप्त करें" : "Get New Advisory"}
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
        >
          {language === "hi" ? "प्रिंट करें" : "Print Report"}
        </button>
      </div>
    </div>
  );
};

export default CropAdvisory;
