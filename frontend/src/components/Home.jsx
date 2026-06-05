import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, TrendingUp, AlertTriangle, Play, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Home({ onNavigate }) {
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    // Check if Flask backend API is running
    axios.get('http://127.0.0.1:5000/')
      .then((response) => {
        if (response.data && response.data.status === 'Ready') {
          setBackendStatus('Online');
          setIsOnline(true);
        } else {
          setBackendStatus('Degraded (Pickles Missing)');
          setIsOnline(false);
        }
      })
      .catch((error) => {
        setBackendStatus('Offline (Start Flask app)');
        setIsOnline(false);
      });
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Banner */}
      <div className="welcome-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="welcome-title">Smart Loan Approval & Risk Analysis</h1>
            <p className="welcome-subtitle">
              Automated credit evaluation and default risk analysis engine powered by XGBoost.
            </p>
          </div>
          <div className="status-indicator">
            <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
            <span>ML Backend Status: {backendStatus}</span>
          </div>
        </div>
        
        <button className="btn btn-primary" onClick={() => onNavigate('form')}>
          <Play size={16} fill="currentColor" /> Start Loan Application
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper info">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-label">Total Loans Evaluated</div>
            <div className="stat-value">1,482</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-wrapper success">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="stat-label">Average Approval Rate</div>
            <div className="stat-value">68.4%</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper warning">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="stat-label">Flagged High Risk</div>
            <div className="stat-value">18.7%</div>
          </div>
        </div>
      </div>

      {/* System Features Card */}
      <div className="form-panel" style={{ margin: '0', maxWidth: 'none' }}>
        <h2 className="details-summary-title" style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
          How the Automated Underwriting Engine Evaluates Risk
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>Dynamic Preprocessing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Converts categories using fitted binary label encoders and one-hot encoders, engineering Total Income and Income-to-Loan ratios.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>XGBoost Decision Tree Analysis</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Evaluates applications against 50 parallel decision trees. Credit history, income-to-loan ratios, and property location are assessed to predict default probabilities.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ color: 'var(--primary)' }}><CheckCircle2 size={24} /></div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.25rem' }}>Risk Score Categorization</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Sorts applicants into Low, Medium, or High Risk tiers to guide underwriting rates, credit terms, and validation holds.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
