import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // Fixed path based on your architecture

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
    <div className="auth-container">
      {/* --- Section 1: Context --- */}
      <header className="auth-intro">
        <h2>{isSignUp ? "Create your account" : "Welcome back"}</h2>
        <p>
          {isSignUp 
            ? "Start orchestrating your projects with Kether's AI intelligence." 
            : "Enter your credentials to access your workspace."}
        </p>
      </header>

      {/* --- Section 2: Mode Toggle --- */}
      <div className="mode-switcher">
        <button 
          className={!isSignUp ? 'active' : ''} 
          onClick={() => setIsSignUp(false)}
        >
          Login
        </button>
        <button 
          className={isSignUp ? 'active' : ''} 
          onClick={() => setIsSignUp(true)}
        >
          New Account
        </button>
      </div>

      {/* --- Section 3: The Form --- */}
      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <div className="input-field">
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="icon" />
              <input
                type="text"
                placeholder="John Doe"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                disabled={isDisabled || isLoading}
              />
            </div>
          </div>
        )}

        <div className="input-field">
          <label>Email Address</label>
          <div className="input-wrapper">
            <Mail size={18} className="icon" />
            <input
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={isDisabled || isLoading}
            />
          </div>
        </div>

        <div className="input-field">
          <div className="label-row">
            <label>Password</label>
            {!isSignUp && <a href="#forgot" className="forgot-link">Forgot?</a>}
          </div>
          <div className="input-wrapper">
            <Lock size={18} className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isDisabled || isLoading}
            />
            <button 
              type="button" 
              className="eye-toggle" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isDisabled || isLoading || !formData.email}
          >
            {isLoading ? (
              <span className="spinner"></span>
            ) : (
              <>
                {isSignUp ? 'Create Workspace' : 'Sign In'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="auth-divider">
        <span>OR</span>
      </div>

      <button 
        className="social-btn" 
        onClick={() => console.log("Google OAuth")}
        disabled={isDisabled || isLoading}
      >
        <Chrome size={18} />
        Continue with Google
      </button>

      <style jsx>{`
        .auth-container {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
        }

        .auth-intro {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-intro h2 {
          color: #fff;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .auth-intro p {
          color: #8b949e;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .mode-switcher {
          display: flex;
          background: #0d1117;
          padding: 4px;
          border-radius: 8px;
          margin-bottom: 2rem;
          border: 1px solid #30363d;
        }

        .mode-switcher button {
          flex: 1;
          padding: 8px;
          border: none;
          background: transparent;
          color: #8b949e;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .mode-switcher button.active {
          background: #21262d;
          color: #fff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-field label {
          font-size: 0.8rem;
          font-weight: 500;
          color: #c9d1d9;
        }

        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #58a6ff;
          text-decoration: none;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper .icon {
          position: absolute;
          left: 12px;
          color: #484f58;
        }

        .input-wrapper input {
          width: 100%;
          background: #0d1117;
          border: 1px solid #30363d;
          padding: 10px 40px;
          border-radius: 6px;
          color: #fff;
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .input-wrapper input:focus {
          outline: none;
          border-color: #58a6ff;
          box-shadow: 0 0 0 3px rgba(88, 166, 255, 0.1);
        }

        .eye-toggle {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #484f58;
          cursor: pointer;
          padding: 4px;
        }

        .error-banner {
          background: rgba(248, 81, 73, 0.1);
          border: 1px solid rgba(248, 81, 73, 0.2);
          color: #ff7b72;
          padding: 10px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.85rem;
        }

        .form-actions {
          margin-top: 0.5rem;
          display: flex;
          justify-content: center;
        }

        .submit-btn {
          width: 100%; /* Change to auto and add padding for centered look */
          max-width: 200px;
          background: #238636;
          color: #fff;
          border: 1px solid rgba(240, 246, 252, 0.1);
          padding: 10px 24px;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .submit-btn:hover:not(:disabled) { background: #2ea043; }

        .auth-divider {
          margin: 1.5rem 0;
          position: relative;
          text-align: center;
        }

        .auth-divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #30363d;
        }

        .auth-divider span {
          position: relative;
          background: #161b22; /* Match your card bg */
          padding: 0 10px;
          color: #484f58;
          font-size: 0.75rem;
        }

        .social-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #fff;
          color: #1f2328;
          border: none;
          padding: 10px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginForm;