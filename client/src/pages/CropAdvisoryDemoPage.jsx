import React from "react";
import { Leaf, Info, CheckCircle } from "lucide-react";

const CropAdvisoryDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <Leaf className="w-10 h-10 text-green-600 mr-3" />
          <h1 className="text-3xl font-extrabold text-gray-900">Crop Advisory Demo</h1>
        </div>
        <p className="text-lg text-gray-700 mb-4">
          This is a demo page for crop advisory. The actual AI model is not available yet. No image upload or camera options are present—just a preview of the advisory results.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center text-blue-800 text-sm">
            <span className="font-semibold">Location:</span>
            <span className="ml-2">Demo Village, Demo District</span>
          </div>
        </div>
        <div className="bg-green-100 p-4 rounded-xl">
          <h2 className="font-bold text-lg mb-2 text-green-700 flex items-center">
            <Leaf className="w-5 h-5 mr-2 text-green-600" />
            Demo Crop Advisory
          </h2>
          <ul className="mb-2 list-disc pl-5 text-green-900">
            <li>Soil is suitable for wheat and mustard.</li>
            <li>Recommended fertilizer: NPK 20-20-0.</li>
            <li>Weather is favorable for sowing in the next week.</li>
            <li>Tip: Use organic compost for better yield.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CropAdvisoryDemoPage;
