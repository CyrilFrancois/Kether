import React, { useState } from 'react';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

/**
 * LoginForm Component
 * Role: Handles the "Identity" layer of the connection.
 * @param {Function} onSuccess - Callback when the access key is validated.
 * @param {boolean} isDisabled - Disables input if the System Pulse (Backend) is offline.
 */
const LoginForm = ({ onSuccess, isDisabled }) => {
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setIsLoading(true);

    // Simulation of the Secure Handshake
    // In the future, this calls: POST /v1/auth/login
    setTimeout(() => {
      if (accessKey === 'kether_dev_pass' || accessKey === 'admin') {
        onSuccess();
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit}>
        <div className={`input-wrapper ${error ? 'error' : ''}`}>
          <Lock size={18} className="input-icon" />
          <input
            type="password"
            placeholder="Enter Access Key..."
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            disabled={isDisabled || isLoading}
            autoFocus
          />
          <button 
            type="submit" 
            className="submit-arrow" 
            disabled={isDisabled || !accessKey || isLoading}
          >
            {isLoading ? <div className="spinner" /> : <ArrowRight size={20} />}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={14} />
            <span>Invalid Access Key. Check your .env config.</span>
          </div>
        )}
      </form>

      <style jsx>{`
        .login-form-container {
          width: 100%;
          margin-top: 20px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: #0f1115;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 0 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-wrapper:focus-within {
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .input-wrapper.error {
          border-color: #e74c3c;
          animation: shake 0.4s;
        }

        .input-icon {
          color: #555;
        }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          padding: 15px 10px;
          font-size: 1rem;
          outline: none;
        }

        input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .submit-arrow {
          background: transparent;
          border: none;
          color: #3498db;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 5px;
          transition: transform 0.2s;
        }

        .submit-arrow:hover:not(:disabled) {
          transform: translateX(3px);
          color: #fff;
        }

        .submit-arrow:disabled {
          color: #333;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #e74c3c;
          font-size: 0.8rem;
          margin-top: 12px;
          padding: 0 5px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(52, 152, 219, 0.3);
          border-top-color: #3498db;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;