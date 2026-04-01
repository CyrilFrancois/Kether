import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this
import { Lock, Mail, User, ArrowRight, AlertCircle, Chrome, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  
  const navigate = useNavigate();
  const { login, register, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let success = false;
    
    // 1. Execute Auth Action
    if (isSignUp) {
      success = await register(formData.email, formData.password, formData.fullName);
    } else {
      success = await login(formData.email, formData.password);
    }

    // 2. The Critical "Handshake": 
    // Only navigate if the hook confirms success. 
    // The useAuth hook should be calling authStore.login() internally.
    if (success) {
      // We add a tiny micro-delay to ensure Zustand middleware has flushed to LocalStorage
      setTimeout(() => {
        navigate('/dashboard');
      }, 50);
    }
  };

  return (
    <div className="login-box">
      <div className="tab-header">
        <button className={!isSignUp ? 'active' : ''} onClick={() => setIsSignUp(false)}>Sign In</button>
        <button className={isSignUp ? 'active' : ''} onClick={() => setIsSignUp(true)}>Register</button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {isSignUp && (
          <div className="field">
            <User size={18} className="icon" />
            <input 
              type="text" placeholder="Full Name" required 
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
        )}

        <div className="field">
          <Mail size={18} className="icon" />
          <input 
            type="email" placeholder="Email" required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="field">
          <Lock size={18} className="icon" />
          <input 
            type={showPassword ? "text" : "password"} placeholder="Password" required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="center-actions">
          <button type="submit" className="primary-btn" disabled={isLoading}>
            {isLoading ? <div className="loader" /> : <>{isSignUp ? 'Initialize Account' : 'Access Core'} <ArrowRight size={18} /></>}
          </button>
        </div>

        {error && <div className="err-msg"><AlertCircle size={14} /><span>{error}</span></div>}
      </form>

      <div className="divider"><span>OR</span></div>

      <div className="center-actions">
        <button className="google-btn" type="button">
          <Chrome size={18} /> Google Identity
        </button>
      </div>

      {/* Styles remain unchanged as they were already excellent */}
      <style>{`
        .login-box { width: 100%; display: flex; flex-direction: column; }
        .tab-header { display: flex; margin-bottom: 24px; border-bottom: 1px solid #30363d; }
        .tab-header button { flex: 1; background: none; border: none; color: #8b949e; padding: 12px; cursor: pointer; border-bottom: 2px solid transparent; font-weight: 600; }
        .tab-header button.active { color: #238636; border-bottom-color: #238636; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .field { display: flex; align-items: center; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 0 12px; }
        .field input { flex: 1; background: transparent; border: none; color: #fff; padding: 12px 0; outline: none; }
        .icon { color: #8b949e; margin-right: 10px; }
        .eye-btn { background: none; border: none; color: #8b949e; cursor: pointer; }
        .center-actions { display: flex; justify-content: center; width: 100%; margin-top: 8px; }
        .primary-btn { width: 220px !important; background: #238636; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
        .google-btn { width: 220px !important; background: #fff; color: #1f2328; border: none; padding: 10px; border-radius: 6px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
        .divider { text-align: center; margin: 24px 0; position: relative; }
        .divider::before { content: ""; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #30363d; }
        .divider span { background: #1a1d23; padding: 0 12px; color: #8b949e; font-size: 0.75rem; position: relative; }
        .err-msg { color: #ff7b72; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; justify-content: center; }
        .loader { width: 18px; height: 18px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const Connection = () => {
  return (
    <div className="page">
      <div className="glass-card">
        <header>
          <div className="logo">K</div>
          <h1>Kether Foundation</h1>
          <p>Accessing Secure Intelligence Layer</p>
        </header>
        <LoginForm />
      </div>

      <style>{`
        .page { min-height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center; background: #0f1115; padding: 20px; box-sizing: border-box; }
        .glass-card { width: 100%; max-width: 400px; background: #1a1d23; border: 1px solid #30363d; padding: 40px; border-radius: 12px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        header { text-align: center; margin-bottom: 32px; }
        .logo { width: 50px; height: 50px; background: #238636; color: #fff; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 8px; font-size: 24px; }
        h1 { color: #fff; margin: 0; font-size: 1.8rem; }
        p { color: #8b949e; font-size: 0.9rem; margin-top: 8px; }
      `}</style>
    </div>
  );
};

export default Connection;