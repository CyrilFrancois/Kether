import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Connection Page: The Gateway to Kether
 * Roles: 
 * 1. Identity (Password check)
 * 2. Environment Check (Backend/AI status)
 */
const Connection = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ backend: 'checking', ai: 'checking' });
  const [error, setError] = useState('');

  // Environment Check Logic
  useEffect(() => {
    const checkSystem = async () => {
      try {
        const res = await axios.get('http://localhost:8000/ai-status');
        setStatus({ 
          backend: 'online', 
          ai: res.data.ai_ready ? 'online' : 'error' 
        });
      } catch (err) {
        setStatus({ backend: 'error', ai: 'error' });
      }
    };
    checkSystem();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, we use a simple check or connect to an auth endpoint
    if (password === 'kether_dev_pass' || password === 'admin') {
      onLoginSuccess();
    } else {
      setError('Invalid Access Key');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <span className="crown-icon">👑</span>
          <h1>KETHER</h1>
          <p>Autonomous Project Orchestrator</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={error ? 'input-error' : ''}
            />
            {error && <span className="error-text">{error}</span>}
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={status.backend !== 'online'}
          >
            Initialize Session
          </button>
        </form>

        <div className="system-pulse-container">
          <div className="pulse-item">
            <span className={`dot ${status.backend}`}></span>
            API / Engine
          </div>
          <div className="pulse-item">
            <span className={`dot ${status.ai}`}></span>
            AI (GPT-4o)
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #0f1115;
        }
        .auth-card {
          background: #1a1d23;
          padding: 40px;
          border-radius: 12px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #333;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .auth-header { text-align: center; margin-bottom: 30px; }
        .crown-icon { font-size: 3rem; display: block; margin-bottom: 10px; }
        .auth-header h1 { margin: 0; letter-spacing: 4px; color: #fff; }
        .auth-header p { color: #666; font-size: 0.8rem; margin-top: 5px; }
        
        .input-group { margin-bottom: 20px; }
        label { display: block; color: #888; margin-bottom: 8px; font-size: 0.8rem; }
        input {
          width: 100%;
          background: #0f1115;
          border: 1px solid #444;
          padding: 12px;
          border-radius: 6px;
          color: white;
          outline: none;
        }
        input:focus { border-color: #3498db; }
        .input-error { border-color: #e74c3c; }
        .error-text { color: #e74c3c; font-size: 0.75rem; margin-top: 5px; display: block; }

        .login-btn {
          width: 100%;
          padding: 12px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }
        .login-btn:disabled { background: #333; cursor: not-allowed; }
        .login-btn:hover:not(:disabled) { background: #2980b9; }

        .system-pulse-container {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #333;
          display: flex;
          justify-content: space-around;
        }
        .pulse-item { font-size: 0.7rem; color: #666; display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
        .online { background: #2ecc71; box-shadow: 0 0 8px #2ecc71; }
        .checking { background: #f1c40f; }
        .error { background: #e74c3c; box-shadow: 0 0 8px #e74c3c; }
      `}</style>
    </div>
  );
};

export default Connection;