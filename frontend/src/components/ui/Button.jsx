import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Kether UI: Button
 * Role: Standardized action trigger with loading and variant support.
 * @param {boolean} isLoading - Shows a spinner and disables the button.
 * @param {string} variant - 'primary' (blue), 'danger' (red), 'ghost' (outline).
 * @param {React.ReactNode} icon - Optional Lucide icon to display.
 */
const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  isLoading = false, 
  disabled = false, 
  variant = 'primary', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`kether-btn ${variant} ${isLoading ? 'loading' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="spinner" size={18} />
      ) : (
        <>
          {Icon && <Icon size={18} className="btn-icon" />}
          <span className="btn-text">{children}</span>
        </>
      )}

      <style jsx>{`
        .kether-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          min-height: 44px;
          white-space: nowrap;
          outline: none;
        }

        /* VARIANTS */
        .primary {
          background: #3498db;
          color: white;
        }
        .primary:hover:not(:disabled) {
          background: #2980b9;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        }

        .danger {
          background: rgba(231, 76, 60, 0.1);
          color: #e74c3c;
          border-color: rgba(231, 76, 60, 0.3);
        }
        .danger:hover:not(:disabled) {
          background: #e74c3c;
          color: white;
        }

        .ghost {
          background: transparent;
          color: #888;
          border-color: #333;
        }
        .ghost:hover:not(:disabled) {
          color: #fff;
          border-color: #555;
          background: rgba(255, 255, 255, 0.05);
        }

        /* STATES */
        .kether-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .loading {
          cursor: wait;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .btn-icon {
          flex-shrink: 0;
        }

        .btn-text {
          letter-spacing: 0.5px;
        }
      `}</style>
    </button>
  );
};

export default Button;