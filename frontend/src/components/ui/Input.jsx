import React from 'react';

/**
 * Kether UI: Input
 * Role: Standardized text entry with support for icons, labels, and error states.
 * @param {string} label - Optional text label above the input.
 * @param {string} error - Error message to display (triggers red border).
 * @param {React.ReactNode} icon - Optional Lucide icon to display inside the field.
 */
const Input = ({ 
  label, 
  error, 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`kether-input-group ${className}`}>
      {label && <label className="input-label">{label}</label>}
      
      <div className={`input-container ${error ? 'has-error' : ''} ${Icon ? 'has-icon' : ''}`}>
        {Icon && <Icon className="field-icon" size={18} />}
        
        <input 
          className="base-input"
          {...props}
        />
      </div>

      {error && <span className="error-text">{error}</span>}

      <style jsx>{`
        .kether-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: 100%;
          margin-bottom: 15px;
        }

        .input-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-left: 2px;
        }

        .input-container {
          position: relative;
          display: flex;
          align-items: center;
          background: #0b0d11;
          border: 1px solid #222;
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .input-container:focus-within {
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
        }

        .input-container.has-error {
          border-color: #e74c3c;
          background: rgba(231, 76, 60, 0.05);
        }

        .field-icon {
          position: absolute;
          left: 12px;
          color: #444;
          transition: color 0.2s;
        }

        .input-container:focus-within .field-icon {
          color: #3498db;
        }

        .base-input {
          width: 100%;
          background: transparent;
          border: none;
          color: #fff;
          padding: 12px;
          font-size: 0.95rem;
          outline: none;
          font-family: inherit;
        }

        .has-icon .base-input {
          padding-left: 40px;
        }

        .base-input::placeholder {
          color: #444;
        }

        .error-text {
          font-size: 0.7rem;
          color: #e74c3c;
          margin-top: 2px;
          font-weight: 500;
        }

        /* Disabled state */
        .base-input:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default Input;