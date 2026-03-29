import React from 'react';

/**
 * Kether UI: StatusDot
 * Role: A visual indicator for health, status, or activity.
 * @param {string} state - 'online' (green), 'error' (red), 'warning' (yellow), 'offline' (gray).
 * @param {boolean} animate - Whether the dot should pulse.
 * @param {string} size - Size in pixels (default 8px).
 */
const StatusDot = ({ 
  state = 'offline', 
  animate = true, 
  size = '8px',
  className = '' 
}) => {
  
  const getColor = (s) => {
    switch (s) {
      case 'online': return '#2ecc71';
      case 'error': return '#e74c3c';
      case 'warning': return '#f1c40f';
      case 'offline': return '#444444';
      default: return '#444444';
    }
  };

  const dotColor = getColor(state);

  return (
    <div className={`status-dot-container ${className}`}>
      <div className={`dot-core ${state} ${animate ? 'pulse' : ''}`} />
      
      <style jsx>{`
        .status-dot-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: ${size};
          height: ${size};
        }

        .dot-core {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: ${dotColor};
          position: relative;
          transition: background-color 0.3s ease;
        }

        /* The Pulse Animation */
        .pulse::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background-color: ${dotColor};
          opacity: 0.6;
          z-index: -1;
          animation: status-ripple 2s infinite ease-out;
        }

        /* Specific behavior for errors (faster pulse) */
        .dot-core.error.pulse::after {
          animation-duration: 1s;
        }

        /* Specific behavior for warning (slower blink) */
        .dot-core.warning.pulse::after {
          animation-duration: 3s;
        }

        @keyframes status-ripple {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(3.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default StatusDot;