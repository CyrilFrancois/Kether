import React from 'react';
import { Activity, Cpu, Database } from 'lucide-react';

/**
 * SystemPulse Component
 * Role: Environment Check - Visual feedback of system readiness.
 * @param {Object} status - { backend: 'online'|'checking'|'error', ai: 'online'|'checking'|'error' }
 */
const SystemPulse = ({ status }) => {
  
  const getStatusClass = (state) => {
    switch (state) {
      case 'online': return 'pulse-online';
      case 'error': return 'pulse-error';
      default: return 'pulse-checking';
    }
  };

  const getStatusLabel = (state) => {
    if (state === 'online') return 'CONNECTED';
    if (state === 'error') return 'OFFLINE';
    return 'INITIALIZING...';
  };

  return (
    <div className="system-pulse-wrapper">
      <div className="pulse-grid">
        {/* Backend / API Check */}
        <div className={`pulse-card ${getStatusClass(status.backend)}`}>
          <div className="pulse-icon">
            <Database size={16} />
          </div>
          <div className="pulse-details">
            <span className="label">ENGINE / API</span>
            <span className="value">{getStatusLabel(status.backend)}</span>
          </div>
          <div className="indicator">
            <div className="dot" />
          </div>
        </div>

        {/* AI / LLM Check */}
        <div className={`pulse-card ${getStatusClass(status.ai)}`}>
          <div className="pulse-icon">
            <Cpu size={16} />
          </div>
          <div className="pulse-details">
            <span className="label">AI (GPT-4O)</span>
            <span className="value">{getStatusLabel(status.ai)}</span>
          </div>
          <div className="indicator">
            <div className="dot" />
          </div>
        </div>
      </div>

      <style jsx>{`
        .system-pulse-wrapper {
          margin-top: 25px;
          padding-top: 20px;
          border-top: 1px solid #222;
        }

        .pulse-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .pulse-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #0b0d11;
          border: 1px solid #222;
          border-radius: 6px;
          position: relative;
          transition: border-color 0.3s;
        }

        .pulse-icon {
          color: #555;
          display: flex;
          align-items: center;
        }

        .pulse-details {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 0.6rem;
          color: #666;
          letter-spacing: 1px;
          font-weight: 700;
        }

        .value {
          font-size: 0.65rem;
          font-weight: 600;
          margin-top: 2px;
        }

        .indicator {
          position: absolute;
          top: 8px;
          right: 8px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #444;
        }

        /* Status: ONLINE */
        .pulse-online { border-color: rgba(46, 204, 113, 0.3); }
        .pulse-online .pulse-icon { color: #2ecc71; }
        .pulse-online .value { color: #2ecc71; }
        .pulse-online .dot { 
          background: #2ecc71; 
          box-shadow: 0 0 8px #2ecc71;
          animation: glow 2s infinite;
        }

        /* Status: CHECKING */
        .pulse-checking .value { color: #f1c40f; }
        .pulse-checking .dot { 
          background: #f1c40f; 
          animation: blink 1s infinite;
        }

        /* Status: ERROR */
        .pulse-error { border-color: rgba(231, 76, 60, 0.3); }
        .pulse-error .pulse-icon { color: #e74c3c; }
        .pulse-error .value { color: #e74c3c; }
        .pulse-error .dot { background: #e74c3c; box-shadow: 0 0 8px #e74c3c; }

        @keyframes glow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SystemPulse;