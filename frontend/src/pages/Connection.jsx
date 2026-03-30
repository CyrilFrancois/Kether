import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = ({ isDisabled }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      await register(formData.email, formData.password, formData.fullName);
    } else {
      await login(formData.email, formData.password);
    }
  };

  return (
    <div className="login-form-container">
      {/* 1. Toggle Header */}
      <div className="auth-toggle">
        <button 
          className={!isSignUp ? 'active' : ''} 
          onClick={() => { setIsSignUp(false); setShowPassword(false); }}
        >
          Login
        </button>
        <button 
          className={isSignUp ? 'active' : ''} 
          onClick={() => { setIsSignUp(true); setShowPassword(false); }}
        >
          New Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {/* 2. Identity Inputs */}
        {isSignUp && (
          <div className="input-field">
            <User size={18} className="field-icon" />
            <input
              type="text"
              placeholder="Full Name"
              required={isSignUp}
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              disabled={isDisabled || isLoading}
            />
          </div>
        )}

        <div className="input-field">
          <Mail size={18} className="field-icon" />
          <input
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={isDisabled || isLoading}
          />
        </div>

        <div className="input-field">
          <Lock size={18} className="field-icon" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={isDisabled || isLoading}
          />
          <button 
            type="button" 
            className="visibility-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* 3. Primary Action Button */}
        <button 
          type="submit" 
          className="main-submit-btn" 
          disabled={isDisabled || isLoading || !formData.email || !formData.password}
        >
          {isLoading ? (
            <div className="spinner" />
          ) : (
            <>
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {error && (
          <div className="error-banner">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}
      </form>

      {/* 4. Social Integration */}
      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button 
        className="social-provider-btn" 
        onClick={() => console.log("Google Auth")}
        disabled={isDisabled || isLoading}
      >
        <Chrome size={18} />
        Continue with Google
      </button>

      <style jsx>{`
        .login-form-container { width: 100%; max-width: 100%; }
        
        .auth-toggle {
          display: flex;
          margin-bottom: 24px;
          border-bottom: 1px solid #30363d;
        }

        .auth-toggle button {
          flex: 1;
          background: none;
          border: none;
          color: #8b949e;
          padding: 12px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.2s;
          border-bottom: 2px solid transparent;
        }

        .auth-toggle button.active {
          color: #58a6ff;
          border-bottom-color: #58a6ff;
        }

        .auth-form { display: flex; flex-direction: column; gap: 12px; }

        .input-field {
          display: flex;
          align-items: center;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 0 12px;
          transition: border-color 0.2s;
        }

        .input-field:focus-within { border-color: #58a6ff; }

        .field-icon { color: #8b949e; margin-right: 10px; }

        input {
          flex: 1;
          background: transparent;
          border: none;
          color: #c9d1d9;
          padding: 12px 0;
          outline: none;
          font-size: 0.95rem;
        }

        .visibility-toggle {
          background: none;
          border: none;
          color: #8b949e;
          cursor: pointer;
          padding: 5px;
        }

        .main-submit-btn {
          margin-top: 10px;
          background: #238636;
          color: white;
          border: 1px solid rgba(240, 246, 252, 0.1);
          padding: 12px;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          transition: 0.2s;
        }

        .main-submit-btn:hover:not(:disabled) { background: #2ea043; }
        .main-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .auth-divider {
          text-align: center;
          margin: 24px 0;
          position: relative;
        }
        
        .auth-divider::before {
          content: "";
          position: absolute;
          top: 50%; left: 0; right: 0;
          height: 1px; background: #30363d;
        }

        .auth-divider span {
          background: #1a1d23; /* Matches your Card background */
          padding: 0 12px;
          color: #8b949e;
          font-size: 0.75rem;
          position: relative;
          z-index: 2;
        }

        .social-provider-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #f0f6fc;
          color: #1f2328;
          border: 1px solid rgba(27, 31, 36, 0.15);
          padding: 10px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s;
        }

        .error-banner {
          background: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.4);
          color: #ff7b72;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
        }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginForm;