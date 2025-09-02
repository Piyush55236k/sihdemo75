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


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendation(null);
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
          {Object.keys(inputs).map((key) => (
            <div key={key}>
              <label className="block font-semibold mb-1" htmlFor={key}>{key}</label>
              <input
                type="text"
                name={key}
                id={key}
                value={inputs[key]}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                placeholder={`Enter ${key}`}
              />
            </div>
          ))}
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
