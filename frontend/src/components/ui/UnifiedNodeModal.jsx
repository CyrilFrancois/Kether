import React, { useState, useEffect } from 'react';
import { X, Sparkles, Database, Layout, Activity, Code, CheckSquare } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import ModalChat from './ModalChat';

const UnifiedNodeModal = ({ type, level = 1, parentId = null, initialData = null, onClose }) => {
  const { addNode, updateNode } = useProjects();
  const [formData, setFormData] = useState(initialData || { name: '', description: '', metadata: {} });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Configuration for different layers
  const levelConfigs = {
    1: { label: 'Project DNA', icon: <Database size={18} />, color: '#58a6ff', fields: ['tech_stack', 'target_audience'] },
    2: { label: 'Functionality', icon: <Layout size={18} />, color: '#bc8cff', fields: ['user_story', 'priority'] },
    3: { label: 'Logic Flow', icon: <Activity size={18} />, color: '#3fb950', fields: ['input_data', 'output_data'] },
    4: { label: 'Technical Unit', icon: <Code size={18} />, color: '#d29922', fields: ['complexity', 'endpoint'] },
    5: { label: 'Actionable ToDo', icon: <CheckSquare size={18} />, color: '#f85149', fields: ['estimated_minutes'] },
  };

  const config = levelConfigs[level];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, level, parentId };
    
    if (initialData?.id) {
      await updateNode(initialData.id, payload);
    } else {
      await addNode(payload);
    }
    onClose();
  };

  const handleMetadataChange = (key, value) => {
    setFormData({
      ...formData,
      metadata: { ...formData.metadata, [key]: value }
    });
  };

  return (
    <div className="modal-backdrop">
      <div className={`modal-container ${isChatOpen ? 'with-chat' : ''}`}>
        
        {/* --- MAIN FORM SECTION --- */}
        <div className="modal-form-side">
          <header className="modal-header" style={{ borderBottomColor: config.color }}>
            <div className="header-title">
              <span className="level-badge" style={{ backgroundColor: config.color }}>
                {config.icon}
              </span>
              <div>
                <h2>{initialData ? 'Edit' : 'Initialize'} {config.label}</h2>
                <p>Level {level} Node Configuration</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </header>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-group">
              <label>Identification (Name)</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={`Enter ${config.label} name...`}
                required
              />
            </div>

            <div className="form-group">
              <label>Objective (Description)</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="What is the purpose of this node?"
              />
            </div>

            <div className="metadata-grid">
              {config.fields.map(field => (
                <div key={field} className="form-group">
                  <label>{field.replace('_', ' ')}</label>
                  <input 
                    type="text" 
                    value={formData.metadata[field] || ''} 
                    onChange={(e) => handleMetadataChange(field, e.target.value)}
                    placeholder={`Define ${field}...`}
                  />
                </div>
              ))}
            </div>

            <footer className="modal-footer">
              <button 
                type="button" 
                className="ai-assist-btn"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <Sparkles size={16} /> {isChatOpen ? 'Hide Architect' : 'Ask Architect'}
              </button>
              <div className="footer-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: config.color }}>
                  Confirm Mutation
                </button>
              </div>
            </footer>
          </form>
        </div>

        {/* --- AI SIDECAR SECTION --- */}
        {isChatOpen && (
          <div className="modal-chat-side">
            <ModalChat 
              contextNode={{ ...formData, level }} 
              onApplySuggestion={(suggestion) => setFormData({...formData, ...suggestion})}
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(1, 4, 9, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-container {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          width: 600px;
          max-height: 90vh;
          display: flex;
          overflow: hidden;
          transition: width 0.3s ease;
        }

        .modal-container.with-chat { width: 1000px; }

        .modal-form-side { flex: 1; display: flex; flex-direction: column; }

        .modal-header {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid transparent;
        }

        .header-title { display: flex; gap: 15px; align-items: center; }
        .header-title h2 { margin: 0; font-size: 1.25rem; color: #f0f6fc; }
        .header-title p { margin: 0; font-size: 0.8rem; color: #8b949e; }

        .level-badge {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center; color: white;
        }

        .modal-body { padding: 20px; overflow-y: auto; }

        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .form-group label { font-size: 0.75rem; font-weight: 600; color: #8b949e; text-transform: uppercase; }
        
        input, textarea {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 10px;
          color: #c9d1d9;
          font-size: 0.9rem;
        }

        .metadata-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }

        .modal-footer {
          padding: 20px;
          border-top: 1px solid #30363d;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .ai-assist-btn {
          background: #238636; color: white; border: none;
          padding: 8px 15px; border-radius: 20px; cursor: pointer;
          display: flex; align-items: center; gap: 8px; font-weight: 600;
          font-size: 0.85rem;
        }

        .btn-primary { border: none; color: white; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
        .btn-ghost { background: none; border: none; color: #8b949e; cursor: pointer; margin-right: 10px; }
        .close-btn { background: none; border: none; color: #8b949e; cursor: pointer; }

        .modal-chat-side { width: 400px; border-left: 1px solid #30363d; background: #0d1117; }
      `}</style>
    </div>
  );
};

export default UnifiedNodeModal;