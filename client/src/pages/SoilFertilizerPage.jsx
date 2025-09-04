import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SoilFertilizerPage = () => {
  const navigate = useNavigate();
  const [crop, setCrop] = useState('wheat');
  const [inputs, setInputs] = useState({
    N: '', P: '', K: '', S: '', Zn: '', Fe: '', Cu: '', Mn: '', B: '', OC: '', pH: '', EC: ''
  });
  const [customInputs, setCustomInputs] = useState({});
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mandatory fields
  const requiredFields = ['N', 'P', 'K', 'pH', 'EC'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value === 'custom') {
      // Show custom input field
      setCustomInputs((prev) => ({ ...prev, [name]: true }));
      setInputs((prev) => ({ ...prev, [name]: '' }));
    } else {
      // Hide custom input field and set the value
      setCustomInputs((prev) => ({ ...prev, [name]: false }));
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomInputChange = (e) => {
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
      if (!inputs[field] || inputs[field].trim() === '') {
        setError('Please fill in all mandatory fields: N, P, K, pH, OC.');
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
                  value={customInputs[key] ? 'custom' : inputs[key]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 border-red-400 mb-1"
                  required
                >
                  <option value="">Select {key} level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="custom">Custom Value</option>
                </select>
                {customInputs[key] && (
                  <input
                    type="number"
                    step="0.1"
                    name={key}
                    value={inputs[key]}
                    onChange={handleCustomInputChange}
                    className="w-full border rounded p-2 border-red-400"
                    placeholder={`Enter custom ${key} value`}
                    required
                  />
                )}
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
                  value={customInputs[key] ? 'custom' : inputs[key]}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 mb-1"
                >
                  <option value="">Select {key} level</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="custom">Custom Value</option>
                </select>
                {customInputs[key] && (
                  <input
                    type="number"
                    step="0.1"
                    name={key}
                    value={inputs[key]}
                    onChange={handleCustomInputChange}
                    className="w-full border rounded p-2"
                    placeholder={`Enter custom ${key} value`}
                  />
                )}
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
