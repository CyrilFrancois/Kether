import React, { useState, useEffect } from 'react';
import Connection from './pages/Connection';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Foundry from './pages/Foundry';

/**
 * Kether Router & State Controller
 * This component manages which "Tab" is currently active and
 * whether the user has successfully connected to the engine.
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // Default after login

  // Logic to handle successful connection
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // If not authenticated, always show the Connection (Gateway) page
  if (!isAuthenticated) {
    return <Connection onLoginSuccess={handleLoginSuccess} />;
  }

  // Once authenticated, render the main layout with the active tab
  return (
    <div className="kether-container">
      {/* Sidebar / Navigation Component will go here later */}
      <nav className="kether-nav">
        <div className="logo">👑 KETHER</div>
        <div className="nav-links">
          <button onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>Overview</button>
          <button onClick={() => setCurrentPage('workspace')} className={currentPage === 'workspace' ? 'active' : ''}>Workspace</button>
          <button onClick={() => setCurrentPage('foundry')} className={currentPage === 'foundry' ? 'active' : ''}>Foundry</button>
        </div>
      </nav>

      <main className="content-area">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'workspace' && <Workspace />}
        {currentPage === 'foundry' && <Foundry />}
      </main>

      <style jsx>{`
        .kether-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .kether-nav {
          display: flex;
          justify-content: space-between;
          padding: 1rem 2rem;
          background: #1a1d23;
          border-bottom: 1px solid #333;
        }
        .logo {
          font-weight: bold;
          letter-spacing: 2px;
          color: #3498db;
        }
        .nav-links {
          display: flex;
          gap: 20px;
        }
        .nav-links button {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          font-size: 0.9rem;
          transition: 0.3s;
        }
        .nav-links button.active, .nav-links button:hover {
          color: #fff;
        }
        .content-area {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}

export default App;