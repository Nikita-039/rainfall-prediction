'use client';

import { useState } from 'react';

export default function RainfallPrediction() {
  const [formData, setFormData] = useState({
    location: '',
    dateRange: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/rainfall/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location,
          date_range: formData.dateRange,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setPrediction(data.prediction);
      } else {
        setError(data.error || 'Failed to get prediction');
      }
    } catch (err) {
      setError('An error occurred while fetching the prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <h1 className="mb-4">Rainfall Prediction</h1>
      
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Enter Details</h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="dateRange" className="form-label">Date Range</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dateRange"
                    name="dateRange"
                    value={formData.dateRange}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD to YYYY-MM-DD"
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Predicting...' : 'Predict Rainfall'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Prediction Results</h5>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {prediction && (
                <div className="mt-3">
                  <h6>Predicted Rainfall:</h6>
                  <p className="lead">{prediction} mm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 