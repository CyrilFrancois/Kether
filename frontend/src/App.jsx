import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LogOut, Settings as SettingsIcon, ChevronDown, Loader2 } from 'lucide-react';
import Connection from './pages/Connection';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Foundry from './pages/Foundry';
import Settings from './pages/Settings'; 
import useAuthStore from './store/authStore';
import { useAuth } from './hooks/useAuth';

function App() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  
  // Authentication logic
  const { logout, checkAuth } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  
  // UI State
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  /**
   * ✅ NEW: Guard against stale tokens/wiped databases
   * Runs once on mount to verify the session with the server.
   */
  useEffect(() => {
    const verifySession = async () => {
      // If we have a token in localStorage, verify it with the backend
      const hasToken = !!localStorage.getItem('kether_token');
      if (hasToken) {
        await checkAuth();
      }
      setIsInitializing(false);
    };
    verifySession();
  }, [checkAuth]);

  // Robust check: We are authenticated only if we have both a user and a token
  const isAuthenticated = !!(user && token);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setShowAccountMenu(false);
  };

  // While checking the backend, show a clean loading state 
  // instead of flashing the Dashboard or Login
  if (isInitializing) {
    return (
      <div className="init-screen">
        <Loader2 className="animate-spin" size={32} color="#238636" />
        <p>Synchronizing Kether...</p>
        <style>{`
          .init-screen { 
            height: 100vh; background: #0d1117; display: flex; 
            flex-direction: column; align-items: center; justify-content: center; 
            color: #8b949e; gap: 1rem; font-family: sans-serif;
          }
          .animate-spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Connection />
      ) : (
        <div className="kether-container">
          <nav className="kether-nav">
            <div className="nav-left">
              <div className="logo" onClick={() => navigateTo('dashboard')} style={{cursor: 'pointer'}}>
                👑 KETHER
              </div>
              <div className="nav-links">
                <button onClick={() => navigateTo('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>Overview</button>
                <button onClick={() => navigateTo('workspace')} className={currentPage === 'workspace' ? 'active' : ''}>Workspace</button>
                <button onClick={() => navigateTo('foundry')} className={currentPage === 'foundry' ? 'active' : ''}>Foundry</button>
              </div>
            </div>

            <div className="nav-right">
              <div className="account-wrapper">
                <button 
                  className={`account-trigger ${showAccountMenu ? 'active' : ''}`}
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  <div className="avatar-circle">
                    {user?.full_name?.charAt(0) || user?.email?.charAt(0)}
                  </div>
                  <span className="user-name">{user?.full_name || 'Account'}</span>
                  <ChevronDown size={14} className={showAccountMenu ? 'rotate' : ''} />
                </button>

                {showAccountMenu && (
                  <>
                    <div className="menu-overlay" onClick={() => setShowAccountMenu(false)} />
                    <div className="account-dropdown">
                      <div className="dropdown-user-info">
                        <p className="info-name">{user?.full_name}</p>
                        <p className="info-email">{user?.email}</p>
                      </div>
                      <div className="divider" />
                      <button onClick={() => navigateTo('settings')} className="dropdown-item">
                        <SettingsIcon size={16} /> Account Settings
                      </button>
                      <button onClick={logout} className="dropdown-item logout">
                        <LogOut size={16} /> Disconnect
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </nav>

          <main className="content-area">
            {currentPage === 'dashboard' && <Dashboard user={user} />}
            {currentPage === 'workspace' && <Workspace user={user} />}
            {currentPage === 'foundry' && <Foundry user={user} />}
            {currentPage === 'settings' && <Settings user={user} />}
          </main>
        </div>
      )}

      <style>{`
        .kether-container { display: flex; flex-direction: column; height: 100vh; background: #0d1117; color: #c9d1d9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; }
        .kether-nav { display: flex; justify-content: space-between; align-items: center; padding: 0 2rem; height: 64px; background: #161b22; border-bottom: 1px solid #30363d; z-index: 100; }
        .nav-left { display: flex; align-items: center; gap: 40px; }
        .logo { font-weight: bold; letter-spacing: 2px; color: #238636; font-size: 1.1rem; }
        .nav-links { display: flex; gap: 10px; }
        .nav-links button { background: none; border: none; color: #8b949e; cursor: pointer; font-size: 0.9rem; transition: 0.2s; padding: 8px 12px; border-radius: 6px; }
        .nav-links button.active { color: #fff; background: #21262d; }
        .nav-links button:hover { color: #fff; }
        .account-wrapper { position: relative; }
        .account-trigger { display: flex; align-items: center; gap: 10px; background: none; border: 1px solid transparent; color: #c9d1d9; cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: 0.2s; }
        .account-trigger:hover, .account-trigger.active { background: #21262d; border-color: #30363d; }
        .avatar-circle { width: 28px; height: 28px; background: #238636; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; text-transform: uppercase; }
        .user-name { font-size: 0.9rem; font-weight: 500; }
        .rotate { transform: rotate(180deg); }
        .menu-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 90; }
        .account-dropdown { position: absolute; top: calc(100% + 10px); right: 0; width: 220px; background: #161b22; border: 1px solid #30363d; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); padding: 8px 0; z-index: 100; }
        .dropdown-user-info { padding: 12px 16px; }
        .info-name { margin: 0; font-size: 0.9rem; font-weight: 600; color: #fff; }
        .info-email { margin: 0; font-size: 0.75rem; color: #8b949e; }
        .divider { height: 1px; background: #30363d; margin: 8px 0; }
        .dropdown-item { width: 100%; padding: 10px 16px; background: none; border: none; color: #c9d1d9; display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 0.85rem; transition: 0.2s; }
        .dropdown-item:hover { background: #21262d; color: #fff; }
        .dropdown-item.logout { color: #ff7b72; }
        .dropdown-item.logout:hover { background: #f851491a; }
        .content-area { flex: 1; overflow-y: auto; background: #0d1117; }
      `}</style>
    </Router>
  );
}

export default App;