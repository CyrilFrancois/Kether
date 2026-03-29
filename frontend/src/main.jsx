import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // We will create this next for the Dark Mode styling

/**
 * Kether Main Entry Point
 * This file boots the React engine and mounts the 'App' component
 * into the 'root' div defined in index.html.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);