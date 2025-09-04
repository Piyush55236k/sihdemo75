import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SoilFertilizerPage = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState('wheat');
  const [inputs, setInputs] = useState({
    N: '', P: '', K: '', S: '', Zn: '', Fe: '', Cu: '', Mn: '', B: '', OC: '', pH: '', EC: ''
  });
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mandatory fields
  const requiredFields = ['N', 'P', 'K', 'pH', 'OC'];

  // Define option ranges for soil parameters
  const parameterOptions = {
    N: [
      { value: '', label: 'Select Nitrogen Level' },
      { value: '25', label: 'Very Low (0-25 kg/ha)' },
      { value: '75', label: 'Low (25-100 kg/ha)' },
      { value: '150', label: 'Medium (100-200 kg/ha)' },
      { value: '250', label: 'High (200-300 kg/ha)' },
      { value: '350', label: 'Very High (300+ kg/ha)' }
    ],
    P: [
      { value: '', label: 'Select Phosphorus Level' },
      { value: '10', label: 'Very Low (0-10 kg/ha)' },
      { value: '20', label: 'Low (10-25 kg/ha)' },
      { value: '35', label: 'Medium (25-50 kg/ha)' },
      { value: '65', label: 'High (50-80 kg/ha)' },
      { value: '90', label: 'Very High (80+ kg/ha)' }
    ],
    K: [
      { value: '', label: 'Select Potassium Level' },
      { value: '50', label: 'Very Low (0-50 kg/ha)' },
      { value: '100', label: 'Low (50-150 kg/ha)' },
      { value: '200', label: 'Medium (150-250 kg/ha)' },
      { value: '300', label: 'High (250-350 kg/ha)' },
      { value: '400', label: 'Very High (350+ kg/ha)' }
    ],
    pH: [
      { value: '', label: 'Select pH Level' },
      { value: '5.0', label: 'Very Acidic (4.0-5.0)' },
      { value: '5.5', label: 'Acidic (5.0-6.0)' },
      { value: '6.5', label: 'Slightly Acidic (6.0-7.0)' },
      { value: '7.0', label: 'Neutral (7.0)' },
      { value: '7.5', label: 'Slightly Alkaline (7.0-8.0)' },
      { value: '8.5', label: 'Alkaline (8.0-9.0)' }
    ],
    OC: [
      { value: '', label: 'Select Organic Carbon Level' },
      { value: '0.25', label: 'Very Low (0-0.5%)' },
      { value: '0.5', label: 'Low (0.5-0.75%)' },
      { value: '1.0', label: 'Medium (0.75-1.5%)' },
      { value: '2.0', label: 'High (1.5-2.5%)' },
      { value: '3.0', label: 'Very High (2.5%+)' }
    ],
    S: [
      { value: '', label: 'Select Sulfur Level' },
      { value: '5', label: 'Very Low (0-5 ppm)' },
      { value: '10', label: 'Low (5-15 ppm)' },
      { value: '20', label: 'Medium (15-25 ppm)' },
      { value: '30', label: 'High (25-35 ppm)' },
      { value: '40', label: 'Very High (35+ ppm)' }
    ],
    Zn: [
      { value: '', label: 'Select Zinc Level' },
      { value: '0.3', label: 'Very Low (0-0.5 ppm)' },
      { value: '0.7', label: 'Low (0.5-1.0 ppm)' },
      { value: '1.5', label: 'Medium (1.0-2.0 ppm)' },
      { value: '2.5', label: 'High (2.0-3.0 ppm)' },
      { value: '3.5', label: 'Very High (3.0+ ppm)' }
    ],
    Fe: [
      { value: '', label: 'Select Iron Level' },
      { value: '2', label: 'Very Low (0-4 ppm)' },
      { value: '6', label: 'Low (4-8 ppm)' },
      { value: '12', label: 'Medium (8-16 ppm)' },
      { value: '20', label: 'High (16-24 ppm)' },
      { value: '28', label: 'Very High (24+ ppm)' }
    ],
    Cu: [
      { value: '', label: 'Select Copper Level' },
      { value: '0.1', label: 'Very Low (0-0.2 ppm)' },
      { value: '0.3', label: 'Low (0.2-0.5 ppm)' },
      { value: '0.7', label: 'Medium (0.5-1.0 ppm)' },
      { value: '1.2', label: 'High (1.0-1.5 ppm)' },
      { value: '1.7', label: 'Very High (1.5+ ppm)' }
    ],
    Mn: [
      { value: '', label: 'Select Manganese Level' },
      { value: '1', label: 'Very Low (0-2 ppm)' },
      { value: '3', label: 'Low (2-5 ppm)' },
      { value: '7', label: 'Medium (5-10 ppm)' },
      { value: '12', label: 'High (10-15 ppm)' },
      { value: '17', label: 'Very High (15+ ppm)' }
    ],
    B: [
      { value: '', label: 'Select Boron Level' },
      { value: '0.25', label: 'Very Low (0-0.5 ppm)' },
      { value: '0.5', label: 'Low (0.5-0.7 ppm)' },
      { value: '0.8', label: 'Medium (0.7-1.0 ppm)' },
      { value: '1.2', label: 'High (1.0-1.5 ppm)' },
      { value: '1.7', label: 'Very High (1.5+ ppm)' }
    ],
    EC: [
      { value: '', label: 'Select Electrical Conductivity' },
      { value: '0.5', label: 'Very Low (0-1.0 dS/m)' },
      { value: '1.5', label: 'Low (1.0-2.0 dS/m)' },
      { value: '2.5', label: 'Medium (2.0-3.0 dS/m)' },
      { value: '3.5', label: 'High (3.0-4.0 dS/m)' },
      { value: '4.5', label: 'Very High (4.0+ dS/m)' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);
    // Validate required fields
    for (const field of requiredFields) {
      if (!inputs[field] || inputs[field] === '') {
        setError('Please select values for all mandatory fields: N, P, K, pH, OC.');
        setLoading(false);
        return;
      }
    }
    try {
      const res = await fetch('https://sihdemo75.onrender.com/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, inputs }),
      });
      const data = await res.json();
      setRecommendation(data);
    } catch {
      setError('Failed to fetch recommendation');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-semibold"
        >
          ← Back to Home
        </button>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Soil Fertilizer Recommendation</h1>
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div>
            <label className="block font-semibold mb-1">Crop</label>
            <select name="crop" value={crop} onChange={e => setCrop(e.target.value)} className="w-full border rounded p-2">
              <option value="wheat">Wheat</option>
              <option value="paddy">Paddy</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="mustard">Mustard</option>
            </select>
          </div>
          {/* Required fields in a row */}
          <div className="flex flex-wrap gap-4 mb-4">
            {requiredFields.map((key) => (
              <div key={key} className="flex-1 min-w-[120px]">
                <label className="block font-semibold mb-1" htmlFor={key}>
                  {key}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  name={key}
                  id={key}
                  value={inputs[key]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-red-400 bg-white"
                  required
                >
                  {parameterOptions[key].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          {/* Optional fields in a row */}
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.keys(inputs).filter(key => !requiredFields.includes(key)).map((key) => (
              <div key={key} className="flex-1 min-w-[120px]">
                <label className="block font-semibold mb-1" htmlFor={key}>{key}</label>
                <select
                  name={key}
                  id={key}
                  value={inputs[key]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-white"
                >
                  {parameterOptions[key].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold" disabled={loading}>
            {loading ? 'Loading...' : 'Get Recommendation'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {recommendation && (
          <div className="bg-green-100 p-4 rounded mt-4">
            <h2 className="font-semibold mb-2">Recommended Fertilizer Plan:</h2>
            {recommendation.error ? (
              <p className="text-red-600">{recommendation.error}</p>
            ) : (
              <>
                <ul className="mb-2 list-disc pl-5">
                  {recommendation.messages && recommendation.messages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
                <h3 className="font-semibold">Fertilizer Plan:</h3>
                <pre>{JSON.stringify(recommendation.fertilizer_plan, null, 2)}</pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilFertilizerPage;
