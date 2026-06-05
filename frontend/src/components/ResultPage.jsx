import React from 'react';
import { CheckCircle2, XCircle, ShieldAlert, ArrowLeft, RefreshCcw, Home as HomeIcon } from 'lucide-react';

export default function ResultPage({ result, inputData, onNavigate }) {
  const { prediction, probability, risk_level } = result;
  const isApproved = prediction === 'Approved';

  // SVG circular progress parameters
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  const getRiskDescription = () => {
    switch (risk_level) {
      case 'Low Risk':
        return 'Applicant exhibits solid repayment capacity and excellent credit history. Low risk of default. Automated system grants direct approval.';
      case 'Medium Risk':
        return 'Borderline risk assessment due to moderate income levels or debt size. Requires manual review by a credit officer before final disbursal.';
      case 'High Risk':
        return 'Severe default indicators, typically associated with missing credit guidelines or inadequate income-to-loan ratios. Recommending rejection.';
      default:
        return 'Assessment completed.';
    }
  };

  const getRiskClass = () => {
    switch (risk_level) {
      case 'Low Risk': return 'low';
      case 'Medium Risk': return 'medium';
      case 'High Risk': return 'high';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="nav-btn" onClick={() => onNavigate('form')}>
          <ArrowLeft size={16} /> Edit Application
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nav-btn" onClick={() => onNavigate('home')}>
            <HomeIcon size={16} /> Home
          </button>
        </div>
      </div>

      <div className="results-panel">
        
        {/* Header Decision Banner */}
        <div className="results-header-box">
          {isApproved ? (
            <CheckCircle2 size={64} style={{ color: 'var(--success)' }} />
          ) : (
            <XCircle size={64} style={{ color: 'var(--danger)' }} />
          )}
          <h1 className={`decision-banner ${isApproved ? 'approved' : 'rejected'}`}>
            Application {isApproved ? 'Approved' : 'Rejected'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Decision processed by XGBoost Automated Underwriting Engine
          </p>
        </div>

        {/* Results Info Grid */}
        <div className="results-grid">
          
          {/* Circular Gauge */}
          <div className="gauge-wrapper">
            <svg className="gauge-svg">
              <circle
                className="gauge-bg"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                className={`gauge-fill ${isApproved ? 'approved' : 'rejected'}`}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
              />
            </svg>
            <div className="gauge-text-overlay">
              <span className="gauge-percentage">{probability}%</span>
              <span className="gauge-label">Approval Prob.</span>
            </div>
          </div>

          {/* Risk assessment and description */}
          <div className="risk-details">
            <div className={`risk-pill ${getRiskClass()}`}>
              <ShieldAlert size={18} />
              <span>Risk Tier: {risk_level}</span>
            </div>
            
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Risk Assessment Report</h3>
            <p className="risk-desc">{getRiskDescription()}</p>
          </div>

        </div>

        {/* Applicant Details Summary */}
        <div className="details-summary-box">
          <h2 className="details-summary-title">Submitted Application Parameters</h2>
          
          <div className="details-grid">
            <div className="details-item">
              <span className="details-key">Gender:</span>
              <span className="details-val">{inputData.Gender}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Married:</span>
              <span className="details-val">{inputData.Married}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Education:</span>
              <span className="details-val">{inputData.Education}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Employment Type:</span>
              <span className="details-val">{inputData.Self_Employed === 'Yes' ? 'Self-Employed' : 'Salaried'}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Applicant Monthly Income:</span>
              <span className="details-val">₹{inputData.ApplicantIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Requested Loan Amount:</span>
              <span className="details-val">₹{inputData.LoanAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Loan Term Length:</span>
              <span className="details-val">{inputData.Loan_Amount_Term} Months</span>
            </div>
            <div className="details-item">
              <span className="details-key">Credit History:</span>
              <span className="details-val">{inputData.Credit_History === 1.0 ? 'Meets Guidelines' : 'Does Not Meet Guidelines'}</span>
            </div>
            <div className="details-item">
              <span className="details-key">Property Location:</span>
              <span className="details-val">{inputData.Property_Area}</span>
            </div>
          </div>
        </div>

        {/* Call to Actions */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={() => onNavigate('form')}>
            <RefreshCcw size={16} /> Evaluate New Applicant
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('home')}>
            <HomeIcon size={16} /> Return to Dashboard
          </button>
        </div>

      </div>

    </div>
  );
}
