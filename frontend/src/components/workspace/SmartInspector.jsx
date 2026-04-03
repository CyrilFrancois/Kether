import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  Trash2, 
  ExternalLink, 
  Tag, 
  BarChart3,
  CheckCircle2,
  Circle,
  Plus
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';
import { useAttributes } from '../../hooks/useAttributes';
import AttributeField from '../ui/AttributeField';

const SmartInspector = () => {
  const { selectedNode, setSelectedNode, setInspectorOpen } = useProjectStore();
  const { updateNode, deleteNode, generateSubNodes } = useProjects();
  const { addAttribute, removeAttribute, updateAttribute } = useAttributes();
  const [localData, setLocalData] = useState(null);

  // Sync local state when selection changes
  useEffect(() => {
    if (selectedNode) {
      setLocalData({ ...selectedNode });
    }
  }, [selectedNode]);

  if (!selectedNode || !localData) return null;

  const handleUpdate = (updates) => {
    setLocalData(prev => ({ ...prev, ...updates }));
    updateNode(selectedNode.id, updates);
  };

  const handleGenerate = async () => {
    await generateSubNodes(selectedNode.id, selectedNode.level);
  };

  const closeInspector = () => {
    setInspectorOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="smart-inspector">
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
          placeholder="Node Name"
        />
      </header>

      <div className="inspector-content">
        {selectedNode.level < 5 && (
          <button className="btn-generate" onClick={handleGenerate}>
            <Zap size={16} fill="currentColor" />
            Decompose with AI
          </button>
        )}

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
            placeholder="Define the scope..."
          />
        </section>

        {/* --- DYNAMIC ATTRIBUTES RENDERER --- */}
        <section className="property-section">
          <div className="section-header">
            <label><Tag size={14} /> Project Attributes</label>
            <button 
              className="btn-add-attr" 
              onClick={() => addAttribute(selectedNode.id, { key: 'New Field', value: '', type: 'text' })}
            >
              <Plus size={12} />
            </button>
          </div>
          
          <div className="attributes-list">
            {localData.attributes?.map((attr) => (
              <div key={attr.id} className="attr-item">
                <div className="attr-header">
                  <span className="attr-key">{attr.key}</span>
                  <button 
                    className="btn-delete-attr" 
                    onClick={() => removeAttribute(selectedNode.id, attr.id)}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                <AttributeField 
                  type={attr.type}
                  value={attr.value}
                  onChange={(val) => updateAttribute(selectedNode.id, attr.id, { value: val })}
                />
              </div>
            ))}
            {(!localData.attributes || localData.attributes.length === 0) && (
              <p className="empty-msg">No custom attributes defined.</p>
            )}
          </div>
        </section>

        <div className="spacer" />

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
        .smart-inspector { height: 100%; display: flex; flex-direction: column; color: #c9d1d9; padding: 20px; border-left: 1px solid #30363d; background: #0d1117; }
        .inspector-header { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #30363d; }
        .header-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .btn-close { background: none; border: none; color: #8b949e; cursor: pointer; padding: 4px; }
        .level-pill { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; color: #fff; }
        .l1 { background: #58a6ff; } .l2 { background: #bc8cff; } .l3 { background: #3fb950; } .l4 { background: #d29922; } .l5 { background: #f85149; }
        .title-input { background: none; border: none; font-size: 1.1rem; font-weight: 600; color: #fff; width: 100%; outline: none; }

        .btn-generate { width: 100%; padding: 10px; border-radius: 6px; border: none; background: #238636; color: white; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 20px; }

        .property-section { margin-bottom: 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .property-section label { display: flex; align-items: center; gap: 8px; font-size: 0.75rem; color: #8b949e; font-weight: 600; }
        
        .status-toggle { display: flex; background: #21262d; border-radius: 6px; border: 1px solid #30363d; overflow: hidden; }
        .status-toggle button { flex: 1; padding: 6px; border: none; background: transparent; color: #8b949e; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .status-toggle button.active { background: #30363d; color: #fff; }

        textarea { width: 100%; height: 60px; background: #161b22; border: 1px solid #30363d; border-radius: 6px; color: #c9d1d9; padding: 10px; resize: none; font-size: 0.85rem; }

        .btn-add-attr { background: transparent; border: 1px solid #30363d; color: #8b949e; border-radius: 4px; padding: 2px 6px; cursor: pointer; }
        .btn-add-attr:hover { color: #58a6ff; border-color: #58a6ff; }
        
        .attributes-list { display: flex; flex-direction: column; gap: 12px; }
        .attr-item { display: flex; flex-direction: column; gap: 4px; }
        .attr-header { display: flex; justify-content: space-between; align-items: center; }
        .attr-key { font-size: 0.65rem; color: #8b949e; text-transform: uppercase; font-weight: 700; }
        .btn-delete-attr { background: none; border: none; color: #484f58; cursor: pointer; opacity: 0; transition: opacity 0.2s; }
        .attr-item:hover .btn-delete-attr { opacity: 1; }
        .btn-delete-attr:hover { color: #f85149; }
        .empty-msg { font-size: 0.75rem; color: #484f58; font-style: italic; }

        .spacer { flex: 1; }
        .inspector-footer { border-top: 1px solid #30363d; padding-top: 15px; display: flex; flex-direction: column; gap: 8px; }
        .btn-danger { background: none; border: 1px solid #30363d; color: #f85149; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 0.75rem; }
        .btn-danger:hover { background: #f85149; color: #fff; border-color: #f85149; }
        .btn-ghost { background: none; border: none; color: #8b949e; cursor: pointer; font-size: 0.75rem; }
      `}</style>
    </div>
  );
};

export default SmartInspector;