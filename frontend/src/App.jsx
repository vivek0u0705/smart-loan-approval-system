import React, { useState } from 'react';
import './App.css';
import Home from './components/Home';
import LoanForm from './components/LoanForm';
import ResultPage from './components/ResultPage';
import { Landmark, FileText, BarChart3, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [predictionResult, setPredictionResult] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmitSuccess = (result, inputData) => {
    setPredictionResult(result);
    setSubmittedData(inputData);
    setCurrentView('result');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'form':
        return (
          <LoanForm
            onNavigate={setCurrentView}
            onSubmitSuccess={handleFormSubmitSuccess}
          />
        );
      case 'result':
        return (
          <ResultPage
            result={predictionResult}
            inputData={submittedData}
            onNavigate={setCurrentView}
          />
        );
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Banner */}
      <header className="header">
        <div className="brand-section">
          <div className="brand-logo">
            <Landmark size={28} />
          </div>
          <h1 className="brand-title">Loan Predictor</h1>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => setCurrentView('home')}
          >
            <BarChart3 size={16} /> Dashboard
          </button>
          <button
            className={`nav-btn ${currentView === 'form' ? 'active' : ''}`}
            onClick={() => setCurrentView('form')}
          >
            <FileText size={16} /> Loan Form
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {renderView()}
      </main>

      {/* Footer Banner */}
      <footer className="footer">
        <p>© 2026 Loan Predictor. All rights reserved. XGBoost Risk Assessment Model v1.0.0.</p>
        <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', opacity: 0.6 }}>
          Disclaimer: This system is a predictive tool designed for underwriting simulation. Final lending approvals are subject to compliance reviews.
        </p>
      </footer>
    </div>
  );
}
