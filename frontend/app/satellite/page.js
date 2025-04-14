'use client';

import { useState } from 'react';

export default function SatelliteAnalysis() {
  const [formData, setFormData] = useState({
    location: '',
    date: '',
  });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/satellite/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: formData.location,
          date: formData.date,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAnalysis(data.analysis);
      } else {
        setError(data.error || 'Failed to analyze satellite imagery');
      }
    } catch (err) {
      setError('An error occurred while analyzing the satellite imagery');
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
      <h1 className="mb-4">Satellite Analysis</h1>
      
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
                  <label htmlFor="date" className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Analyzing...' : 'Analyze Imagery'}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Analysis Results</h5>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {analysis && (
                <div className="mt-3">
                  <h6>Analysis Results:</h6>
                  <pre className="bg-light p-3 rounded">
                    {JSON.stringify(analysis, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 