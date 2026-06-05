import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoanForm({ onNavigate, onSubmitSuccess }) {
  const [formData, setFormData] = useState({
    Gender: 'Male',
    Married: 'No',
    Education: 'Graduate',
    Self_Employed: 'No',
    ApplicantIncome: 45000,
    CoapplicantIncome: 0,
    LoanAmount: 1200000,
    Loan_Amount_Term: 240,
    Credit_History: 1.0,
    Property_Area: 'Semiurban'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Parse numeric fields to float/int
    const numericFields = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History'];
    const updatedValue = numericFields.includes(name) ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://127.0.0.1:5000'
      : 'https://smart-loan-approval-system.onrender.com';

    // Query Flask API
    axios.post(`${API_URL}/predict`, formData)
      .then((response) => {
        setIsLoading(false);
        // Call callback passing API response and original input form data
        onSubmitSuccess(response.data, formData);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.response && error.response.data && error.response.data.error) {
          setErrorMsg(`Error: ${error.response.data.error}`);
        } else {
          setErrorMsg(`Error connecting to ML backend. Please verify that the Flask server is running on ${API_URL}`);
        }
      });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="nav-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="form-panel">
        <div className="form-header">
          <h2 className="form-title">Loan Application Details</h2>
          <p className="form-subtitle">Enter the applicant's parameters to assess credit approval and risk level.</p>
        </div>

        {errorMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger)',
            borderRadius: '8px',
            color: '#fca5a5',
            fontSize: '0.9rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">

          {/* Gender */}
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="Gender" value={formData.Gender} onChange={handleChange} className="form-input form-select">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Married */}
          <div className="form-group">
            <label className="form-label">Married Status</label>
            <select name="Married" value={formData.Married} onChange={handleChange} className="form-input form-select">
              <option value="No">Single / Unmarried (No)</option>
              <option value="Yes">Married (Yes)</option>
            </select>
          </div>

          {/* Education */}
          <div className="form-group">
            <label className="form-label">Education</label>
            <select name="Education" value={formData.Education} onChange={handleChange} className="form-input form-select">
              <option value="Graduate">Graduate</option>
              <option value="Not Graduate">Undergraduate / Not Graduate</option>
            </select>
          </div>

          {/* Self Employed */}
          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select name="Self_Employed" value={formData.Self_Employed} onChange={handleChange} className="form-input form-select">
              <option value="No">Salaried Employee (No)</option>
              <option value="Yes">Self-Employed (Yes)</option>
            </select>
          </div>

          {/* Applicant Income */}
          <div className="form-group">
            <label className="form-label">Applicant Monthly Income (₹)</label>
            <input
              type="number"
              name="ApplicantIncome"
              value={formData.ApplicantIncome}
              onChange={handleChange}
              min="0"
              required
              className="form-input"
              placeholder="e.g. 45000 for ₹45,000"
            />
          </div>


          {/* Loan Amount */}
          <div className="form-group">
            <label className="form-label">Requested Loan Amount (₹)</label>
            <input
              type="number"
              name="LoanAmount"
              value={formData.LoanAmount}
              onChange={handleChange}
              min="1"
              required
              className="form-input"
              placeholder="e.g. 1200000 for ₹12 Lakhs"
            />
          </div>

          {/* Loan Amount Term */}
          <div className="form-group">
            <label className="form-label">Loan Term Length</label>
            <select name="Loan_Amount_Term" value={formData.Loan_Amount_Term} onChange={handleChange} className="form-input form-select">
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
              <option value="72">72 Months (6 Years)</option>
              <option value="84">84 Months (7 Years)</option>
              <option value="96">96 Months (8 Years)</option>
              <option value="108">108 Months (9 Years)</option>
              <option value="120">120 Months (10 Years)</option>
              <option value="132">132 Months (11 Years)</option>
              <option value="144">144 Months (12 Years)</option>
              <option value="156">156 Months (13 Years)</option>
              <option value="168">168 Months (14 Years)</option>
              <option value="180">180 Months (15 Years)</option>
              <option value="192">192 Months (16 Years)</option>
              <option value="204">204 Months (17 Years)</option>
              <option value="216">216 Months (18 Years)</option>
              <option value="228">228 Months (19 Years)</option>
              <option value="240">240 Months (20 Years)</option>
            </select>
          </div>

          {/* Credit History */}
          <div className="form-group">
            <label className="form-label">Credit History Status</label>
            <select name="Credit_History" value={formData.Credit_History} onChange={handleChange} className="form-input form-select">
              <option value="1.0">Meets Standard Guidelines (1.0)</option>
              <option value="0.0">Does Not Meet Standard Guidelines (0.0)</option>
            </select>
          </div>

          {/* Property Area */}
          <div className="form-group">
            <label className="form-label">Property Location Area</label>
            <select name="Property_Area" value={formData.Property_Area} onChange={handleChange} className="form-input form-select">
              <option value="Urban">Urban</option>
              <option value="Semiurban">Semiurban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          {/* Submit/Reset buttons */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setFormData({
              Gender: 'Male',
              Married: 'No',
              Education: 'Graduate',
              Self_Employed: 'No',
              ApplicantIncome: 45000,
              CoapplicantIncome: 0,
              LoanAmount: 1200000,
              Loan_Amount_Term: 240,
              Credit_History: 1.0,
              Property_Area: 'Semiurban'
            })}>
              Reset Values
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner"></span> Running Assessment...
                </>
              ) : (
                'Run Underwriting Check'
              )}
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
