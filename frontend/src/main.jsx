import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 

/**
 * Kether Main Entry Point
 * Role: Boots the React engine and mounts the 'App' component.
 * Note: The <Router> is handled inside App.jsx to support conditional 
 * rendering between Connection and Dashboard.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);