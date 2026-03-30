import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom'; // <--- 1. Add this import

const LoginForm = ({ isDisabled }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  
  const { login, register, isLoading, error } = useAuth();
  const navigate = useNavigate(); // <--- 2. Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let success = false;
    
    if (isSignUp) {
      success = await register(formData.email, formData.password, formData.fullName);
    } else {
      success = await login(formData.email, formData.password);
    }

    // 3. Trigger the redirect if the hook returns true
    if (success) {
      console.log("Access Granted. Redirecting to Dashboard...");
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-header">
        <div className="logo-accent">K</div>
        <h1>{isSignUp ? "Create Account" : "Welcome Back"}</h1>
        <p>{isSignUp ? "Join the Kether Foundation workspace." : "Please enter your details to sign in."}</p>
      </div>

      <div className="auth-card">
        <div className="mode-switcher">
          <button 
            type="button"
            className={!isSignUp ? 'active' : ''} 
            onClick={() => setIsSignUp(false)}
          >
            Login
          </button>
          <button 
            type="button"
            className={isSignUp ? 'active' : ''} 
            onClick={() => setIsSignUp(true)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <div className="input-group">
              <User size={18} className="icon" />
              <input 
                type="text" placeholder="Full Name" required 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          )}

          <div className="input-group">
            <Mail size={18} className="icon" />
            <input 
              type="email" placeholder="Email" required 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="input-group">
            <Lock size={18} className="icon" />
            <input 
              type={showPassword ? "text" : "password"} placeholder="Password" required 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button type="button" className="eye" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <div className="error-msg"><AlertCircle size={14}/> {error}</div>}

          <div className="action-area">
            <button type="submit" className="btn-primary" disabled={isLoading || isDisabled}>
              {isLoading ? <span className="loader"></span> : <>{isSignUp ? 'Sign Up' : 'Sign In'} <ArrowRight size={18}/></>}
            </button>
          </div>
        </form>

        <div className="divider"><span>OR</span></div>

        <div className="action-area">
          <button className="btn-google" type="button">
            <Chrome size={18} /> Continue with Google
          </button>
        </div>
      </div>

      <style jsx>{`
        /* ... (Keep your existing styles here) ... */
        .auth-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .logo-accent {
          width: 48px;
          height: 48px;
          background: #238636;
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 24px;
          margin: 0 auto 16px;
        }

        .auth-header h1 { font-size: 2rem; margin: 0; color: #fff; }
        .auth-header p { color: #8b949e; margin: 8px 0 0; }

        .auth-card {
          width: 100%;
          max-width: 400px;
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        .mode-switcher {
          display: flex;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 4px;
          margin-bottom: 24px;
        }

        .mode-switcher button {
          flex: 1;
          padding: 8px;
          background: none;
          border: none;
          color: #8b949e;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .mode-switcher button.active {
          background: #21262d;
          color: #fff;
          border-radius: 6px;
        }

        .auth-form { display: flex; flex-direction: column; gap: 16px; }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-group .icon { position: absolute; left: 12px; color: #484f58; }
        
        .input-group input {
          width: 100%;
          background: #0d1117;
          border: 1px solid #30363d;
          padding: 12px 12px 12px 40px;
          border-radius: 6px;
          color: #fff;
          font-size: 16px;
        }

        .eye { position: absolute; right: 10px; background: none; border: none; color: #484f58; cursor: pointer; }

        .action-area {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .btn-primary {
          width: max-content !important;
          min-width: 180px;
          padding: 12px 32px;
          background: #238636;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
        }

        .btn-google {
          width: max-content !important;
          min-width: 240px;
          padding: 10px 24px;
          background: #fff;
          color: #1f2328;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
        }

        .divider { width: 100%; text-align: center; margin: 24px 0; border-bottom: 1px solid #30363d; line-height: 0.1em; }
        .divider span { background: #161b22; padding: 0 10px; color: #484f58; font-size: 0.8rem; }

        .error-msg { color: #ff7b72; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }

        .loader { width: 18px; height: 18px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default LoginForm;