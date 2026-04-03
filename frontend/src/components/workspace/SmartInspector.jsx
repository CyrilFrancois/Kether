import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Trash2, 
  ExternalLink, 
  Clock, 
  Tag, 
  BarChart3,
  CheckCircle2,
  Circle
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';

const SmartInspector = () => {
  const { selectedNode, setSelectedNode, setInspectorOpen } = useProjectStore();
  const { updateNode, deleteNode, generateSubNodes } = useProjects();
  const [localData, setLocalData] = useState(null);

  // Sync local state when a new node is selected
  useEffect(() => {
    if (selectedNode) {
      setLocalData({ ...selectedNode });
    }
  }, [selectedNode]);

  if (!selectedNode || !localData) return null;

  const handleUpdate = (updates) => {
    const newData = { ...localData, ...updates };
    setLocalData(newData);
    updateNode(selectedNode.id, updates);
  };

  const handleGenerate = async () => {
    // Triggers the AI "Architect" to decompose this node into the next level
    await generateSubNodes(selectedNode.id, selectedNode.level);
  };

  const closeInspector = () => {
    setInspectorOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="smart-inspector">
      {/* --- INSPECTOR HEADER --- */}
      <header className="inspector-header">
        <div className="header-meta">
          <span className={`level-pill l${selectedNode.level}`}>
            Level {selectedNode.level}
          </span>
          <button onClick={closeInspector} className="btn-close">
            <X size={18} />
          </button>
        </div>
        <input 
          className="title-input"
          value={localData.name || ''}
          onChange={(e) => handleUpdate({ name: e.target.value })}
        />
      </header>

      <div className="inspector-content">
        {/* --- AI GENERATION ACTION --- */}
        {selectedNode.level < 5 && (
          <button className="btn-generate" onClick={handleGenerate}>
            <Zap size={16} fill="currentColor" />
            Decompose with AI
          </button>
        )}

        {/* --- CORE PROPERTIES --- */}
        <section className="property-section">
          <label><BarChart3 size={14} /> Status</label>
          <div className="status-toggle">
            <button 
              className={localData.status === 'todo' ? 'active' : ''}
              onClick={() => handleUpdate({ status: 'todo' })}
            >
              <Circle size={14} /> Todo
            </button>
            <button 
              className={localData.status === 'done' ? 'active' : ''}
              onClick={() => handleUpdate({ status: 'done' })}
            >
              <CheckCircle2 size={14} /> Done
            </button>
          </div>
        </section>

        <section className="property-section">
          <label>Description</label>
          <textarea 
            value={localData.description || ''}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Define the scope of this node..."
          />
        </section>

        {/* --- METADATA RENDERER --- */}
        <section className="property-section">
          <label><Tag size={14} /> Metadata</label>
          <div className="metadata-list">
            {Object.entries(localData.metadata || {}).map(([key, val]) => (
              <div key={key} className="meta-row">
                <span className="meta-key">{key.replace('_', ' ')}</span>
                <input 
                  value={val || ''} 
                  onChange={(e) => handleUpdate({ 
                    metadata: { ...localData.metadata, [key]: e.target.value } 
                  })}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="spacer" />

        {/* --- DANGER ZONE --- */}
        <footer className="inspector-footer">
          <button className="btn-danger" onClick={() => deleteNode(selectedNode.id)}>
            <Trash2 size={14} /> Delete Node
          </button>
          <button className="btn-ghost">
            <ExternalLink size={14} /> Open Full View
          </button>
        </footer>
      </div>

      <style jsx>{`
        .smart-inspector {
          height: 100%;
          display: flex;
          flex-direction: column;
          color: #c9d1d9;
          padding: 20px;
        }

        .inspector-header {
          margin-bottom: 25px;
          border-bottom: 1px solid #30363d;
          padding-bottom: 15px;
        }

        .header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        
        .level-pill {
          font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
          padding: 2px 8px; border-radius: 10px; color: #fff;
        }
        .l1 { background: #58a6ff; } .l2 { background: #bc8cff; } 
        .l3 { background: #3fb950; } .l4 { background: #d29922; } .l5 { background: #f85149; }

        .title-input {
          background: none; border: none; font-size: 1.2rem; font-weight: 600;
          color: #fff; width: 100%; outline: none;
        }

        .btn-generate {
          width: 100%; padding: 12px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #238636 0%, #2ea043 100%);
          color: white; font-weight: 600; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          margin-bottom: 25px; box-shadow: 0 4px 15px rgba(35, 134, 54, 0.3);
        }

        .property-section { margin-bottom: 20px; }
        .property-section label { 
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; color: #8b949e; margin-bottom: 8px; font-weight: 600;
        }

        .status-toggle { display: flex; gap: 1px; background: #30363d; border-radius: 6px; overflow: hidden; border: 1px solid #30363d; }
        .status-toggle button {
          flex: 1; padding: 8px; border: none; background: #0d1117; color: #8b949e;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 0.8rem;
        }
        .status-toggle button.active { background: #21262d; color: #fff; }

        textarea {
          width: 100%; height: 80px; background: #0d1117; border: 1px solid #30363d;
          border-radius: 6px; color: #c9d1d9; padding: 10px; resize: none; font-size: 0.85rem;
        }

        .meta-row { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
        .meta-key { font-size: 0.65rem; color: #484f58; text-transform: uppercase; }
        .meta-row input { background: #0d1117; border: 1px solid #30363d; border-radius: 4px; padding: 6px 10px; color: #c9d1d9; font-size: 0.85rem; }

        .spacer { flex: 1; }

        .inspector-footer {
          border-top: 1px solid #30363d; padding-top: 20px;
          display: flex; flex-direction: column; gap: 10px;
        }

        .btn-danger { background: none; border: 1px solid #f85149; color: #f85149; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-danger:hover { background: #f85149; color: #fff; }

        .btn-ghost { background: none; border: none; color: #8b949e; cursor: pointer; font-size: 0.8rem; }
      `}</style>
    </div>
  );
};

export default SmartInspector;