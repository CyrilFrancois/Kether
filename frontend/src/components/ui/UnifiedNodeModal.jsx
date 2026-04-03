import React, { useState, useEffect } from 'react';
import { X, Sparkles, Database, Layout, Activity, Code, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useAttributes } from '../../hooks/useAttributes';
import ModalChat from './ModalChat';
import AttributeField from './AttributeField';

const UnifiedNodeModal = ({ level = 1, parentId = null, initialData = null, onClose }) => {
  const { addNode, updateNode } = useProjects();
  const { suggestions, fetchSuggestions } = useAttributes();
  
  // Initialize state with safe defaults for the EAV pattern
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    domain: initialData?.domain || 'General',
    // Ensure attributes is always an array to avoid map errors
    attributes: initialData?.attributes || []
  });
  
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Configuration for Layer Visuals and Naming Conventions
  const levelConfigs = {
    1: { label: 'Project', icon: <Database size={18} />, color: '#58a6ff' },
    2: { label: 'Functionality', icon: <Layout size={18} />, color: '#bc8cff' },
    3: { label: 'Logic Flow', icon: <Activity size={18} />, color: '#3fb950' },
    4: { label: 'Technical Unit', icon: <Code size={18} />, color: '#d29922' },
    5: { label: 'Actionable Task', icon: <CheckSquare size={18} />, color: '#f85149' },
  };

  const config = levelConfigs[level];

  // Fetch smart suggestions when the domain is selected (only for root projects)
  useEffect(() => {
    if (level === 1 && formData.domain) {
      fetchSuggestions(formData.domain);
    }
  }, [formData.domain, level, fetchSuggestions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Structure the payload for the backend (EAV-compliant)
    const payload = { 
      ...formData, 
      level, 
      parent_id: parentId // Matching SQLModel snake_case
    };
    
    try {
      if (initialData?.id) {
        await updateNode(initialData.id, payload);
      } else {
        await addNode(payload);
      }
      onClose();
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

  const handleAddAttribute = (suggestion = null) => {
    const newAttr = suggestion 
      ? { key: suggestion.name, value: '', type: suggestion.data_type }
      : { key: '', value: '', type: 'text' };
    
    setFormData(prev => ({
      ...prev,
      attributes: [...prev.attributes, newAttr]
    }));
  };

  const handleUpdateAttribute = (index, updates) => {
    setFormData(prev => {
      const newAttrs = [...prev.attributes];
      newAttrs[index] = { ...newAttrs[index], ...updates };
      return { ...prev, attributes: newAttrs };
    });
  };

  const handleRemoveAttribute = (index) => {
    setFormData(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="modal-backdrop">
      <div className={`modal-container ${isChatOpen ? 'with-chat' : ''}`}>
        
        <div className="modal-form-side">
          <header className="modal-header" style={{ borderBottomColor: config.color }}>
            <div className="header-title">
              <span className="level-badge" style={{ backgroundColor: config.color }}>
                {config.icon}
              </span>
              <div>
                <h2>{initialData ? 'Edit' : 'Configure'} {config.label}</h2>
                <p>Strategic Layer {level}</p>
              </div>
            </div>
            <button className="close-btn" onClick={onClose}><X size={20} /></button>
          </header>

          <form onSubmit={handleSubmit} className="modal-body">
            <div className="form-row">
              <div className="form-group flex-2">
                <label>Node Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder={`e.g. ${level === 1 ? 'Q4 Infrastructure Overhaul' : 'Database Optimization'}`}
                  required
                />
              </div>
              
              {level === 1 && (
                <div className="form-group flex-1">
                  <label>Domain</label>
                  <select 
                    value={formData.domain} 
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  >
                    <option value="IT">IT / Engineering</option>
                    <option value="Construction">Construction</option>
                    <option value="Marketing">Marketing</option>
                    <option value="General">General Business</option>
                  </select>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Objective & Context</label>
              <textarea 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Briefly define the outcome for this node..."
                rows="2"
              />
            </div>

            {/* --- DYNAMIC ATTRIBUTES SECTION --- */}
            <div className="attributes-section">
              <div className="section-header">
                <label>Key Parameters</label>
                <div className="suggestion-chips">
                  {suggestions.slice(0, 3).map(s => (
                    <button 
                      key={s.name} 
                      type="button" 
                      onClick={() => handleAddAttribute(s)} 
                      className="chip"
                    >
                      + {s.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="attributes-list">
                {formData.attributes.map((attr, index) => (
                  <div key={index} className="attribute-row">
                    <input 
                      className="attr-key"
                      placeholder="Property"
                      value={attr.key}
                      onChange={(e) => handleUpdateAttribute(index, { key: e.target.value })}
                    />
                    <AttributeField 
                      type={attr.type}
                      value={attr.value}
                      onChange={(val) => handleUpdateAttribute(index, { value: val })}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveAttribute(index)} 
                      className="delete-attr"
                      title="Remove field"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                
                <button type="button" className="add-attr-btn" onClick={() => handleAddAttribute()}>
                  <Plus size={14} /> Add Specification Field
                </button>
              </div>
            </div>

            <footer className="modal-footer">
              <button 
                type="button" 
                className="ai-assist-btn"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <Sparkles size={16} /> {isChatOpen ? 'Close Assistant' : 'AI Architect'}
              </button>
              <div className="footer-actions">
                <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ backgroundColor: config.color }}>
                  {initialData ? 'Update Node' : 'Initialize Node'}
                </button>
              </div>
            </footer>
          </form>
        </div>

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
        .modal-backdrop { position: fixed; inset: 0; background: rgba(1, 4, 9, 0.85); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-container { background: #161b22; border: 1px solid #30363d; border-radius: 12px; width: 650px; max-height: 90vh; display: flex; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        .modal-container.with-chat { width: 1050px; }
        .modal-form-side { flex: 1; display: flex; flex-direction: column; }
        .modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid transparent; }
        .header-title { display: flex; gap: 15px; align-items: center; }
        .header-title h2 { margin: 0; font-size: 1.25rem; color: #f0f6fc; letter-spacing: -0.02em; }
        .header-title p { margin: 0; font-size: 0.8rem; color: #8b949e; }
        .level-badge { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; }
        .modal-body { padding: 20px; overflow-y: auto; }
        .form-row { display: flex; gap: 15px; margin-bottom: 15px; }
        .flex-2 { flex: 2; } .flex-1 { flex: 1; }
        .form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
        .form-group label { font-size: 0.75rem; font-weight: 600; color: #8b949e; }
        input, textarea, select { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 10px; color: #c9d1d9; font-size: 0.9rem; transition: border-color 0.2s; }
        input:focus { border-color: #58a6ff; outline: none; }
        
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .suggestion-chips { display: flex; gap: 6px; }
        .chip { background: #1f242c; border: 1px solid #30363d; color: #58a6ff; font-size: 0.7rem; padding: 4px 10px; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
        .chip:hover { border-color: #58a6ff; background: #262c36; }
        
        .attributes-list { background: #0d1117; border: 1px solid #30363d; border-radius: 8px; padding: 12px; }
        .attribute-row { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .attr-key { width: 35%; font-weight: 500; }
        .delete-attr { background: none; border: none; color: #f85149; cursor: pointer; padding: 8px; border-radius: 6px; }
        .delete-attr:hover { background: rgba(248, 81, 73, 0.1); }
        .add-attr-btn { background: #161b22; border: 1px dashed #30363d; color: #8b949e; width: 100%; padding: 10px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .add-attr-btn:hover { border-color: #58a6ff; color: #58a6ff; }

        .modal-footer { padding: 20px; border-top: 1px solid #30363d; display: flex; justify-content: space-between; align-items: center; }
        .ai-assist-btn { background: #238636; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.85rem; }
        .ai-assist-btn:hover { background: #2ea043; }
        .btn-primary { border: none; color: white; padding: 10px 24px; border-radius: 6px; cursor: pointer; font-weight: 600; transition: filter 0.2s; }
        .btn-primary:hover { filter: brightness(1.1); }
        .btn-ghost { background: none; border: none; color: #8b949e; cursor: pointer; font-size: 0.9rem; padding: 8px 16px; }
        .modal-chat-side { width: 400px; border-left: 1px solid #30363d; background: #0d1117; }
        .close-btn { background: none; border: none; color: #8b949e; cursor: pointer; padding: 4px; }
      `}</style>
    </div>
  );
};

export default UnifiedNodeModal;