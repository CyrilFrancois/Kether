import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// 1. The Sub-Component (LoginForm)
const LoginForm = ({ isDisabled }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    isSignUp ? await register(formData.email, formData.password, formData.fullName) 
             : await login(formData.email, formData.password);
  };

  return (
    <div className="login-card">
      <div className="auth-toggle">
        <button className={!isSignUp ? 'active' : ''} onClick={() => setIsSignUp(false)}>Login</button>
        <button className={isSignUp ? 'active' : ''} onClick={() => setIsSignUp(true)}>New Account</button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <div className="input-field">
            <User size={18} className="field-icon" />
            <input 
              type="text" placeholder="Full Name" required 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
        )}

        <div className="input-field">
          <Mail size={18} className="field-icon" />
          <input 
            type="email" placeholder="Email Address" required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="input-field">
          <Lock size={18} className="field-icon" />
          <input 
            type={showPassword ? "text" : "password"} placeholder="Password" required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="button" className="visibility-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button type="submit" className="main-submit-btn" disabled={isLoading}>
          {isLoading ? <div className="spinner" /> : <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={18} /></>}
        </button>

        {error && <div className="error-banner"><AlertCircle size={14} /><span>{error}</span></div>}
      </form>

      <div className="auth-divider"><span>OR</span></div>

      <button className="social-provider-btn" onClick={() => console.log("Google Auth")}>
        <Chrome size={18} /> Continue with Google
      </button>

      <style jsx>{`
        .login-card { width: 100%; }
        .auth-toggle { display: flex; margin-bottom: 24px; border-bottom: 1px solid #30363d; }
        .auth-toggle button { flex: 1; background: none; border: none; color: #8b949e; padding: 12px; cursor: pointer; border-bottom: 2px solid transparent; transition: 0.2s; }
        .auth-toggle button.active { color: #58a6ff; border-bottom-color: #58a6ff; }
        .auth-form { display: flex; flex-direction: column; gap: 12px; align-items: center; }
        .input-field { width: 100%; display: flex; align-items: center; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 0 12px; }
        input { flex: 1; background: transparent; border: none; color: #fff; padding: 12px 0; outline: none; }
        .field-icon { color: #8b949e; margin-right: 10px; }
        .visibility-toggle { background: none; border: none; color: #8b949e; cursor: pointer; }
        
        /* Fixed Button Widths */
        .main-submit-btn { width: 200px; background: #238636; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 600; display: flex; justify-content: center; align-items: center; gap: 10px; cursor: pointer; margin-top: 10px; }
        .social-provider-btn { width: 240px; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 10px; background: #f0f6fc; color: #1f2328; border: none; padding: 10px; border-radius: 6px; font-weight: 500; cursor: pointer; }
        
        .auth-divider { text-align: center; margin: 24px 0; position: relative; }
        .auth-divider::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #30363d; }
        .auth-divider span { background: #1a1d23; padding: 0 12px; color: #8b949e; font-size: 0.75rem; position: relative; }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

// 2. The Main Page Component (Connection)
const Connection = () => {
  return (
    <div className="connection-page">
      <header className="page-header">
        <div className="logo-glow">K</div>
        <h1>Kether Foundation</h1>
        <p>Intelligence Orchestration & Logic Management</p>
      </header>

      <main className="connection-container">
        <LoginForm />
      </main>

      <footer className="page-footer">
        <div className="system-status">
          <div className="pulse-dot"></div>
          <span>Kether Core Online</span>
        </div>
      </footer>

      <style jsx>{`
        .connection-page {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at center, #1a1d23 0%, #0f1115 100%);
          padding: 20px;
        }

        .page-header { text-align: center; margin-bottom: 40px; }
        .logo-glow { width: 60px; height: 60px; background: #238636; color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: bold; margin: 0 auto 20px; box-shadow: 0 0 20px rgba(35, 134, 54, 0.4); }
        .page-header h1 { font-size: 2.2rem; color: white; margin: 0; letter-spacing: -1px; }
        .page-header p { color: #8b949e; margin-top: 8px; font-size: 1rem; }

        .connection-container {
          width: 100%;
          max-width: 400px;
          background: #1a1d23;
          border: 1px solid #30363d;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        .page-footer { margin-top: 40px; }
        .system-status { display: flex; align-items: center; gap: 8px; color: #8b949e; font-size: 0.8rem; font-weight: 500; }
        .pulse-dot { width: 8px; height: 8px; background: #238636; border-radius: 50%; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default Connection;