import React from 'react';
import { 
  Dna, 
  Palette, 
  Cpu, 
  ArrowRightLeft, 
  MoreVertical,
  ExternalLink 
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';

const ProjectCard = ({ project, isDetailed = false }) => {
  const setActiveProject = useProjectStore((state) => state.setActiveProject);

  // This component handles both a small summary (Dashboard) 
  // and a detailed settings view (Project Map Root)
  return (
    <div className={`kether-card ${isDetailed ? 'detailed' : 'summary'}`}>
      <div className="card-header">
        <div className="header-main">
          <div className="icon-box">
            <Cpu size={20} />
          </div>
          <div>
            <h3>{project.name}</h3>
            <span className="version-label">v1.0.0</span>
          </div>
        </div>
        <button className="icon-btn"><MoreVertical size={18} /></button>
      </div>

      <div className="card-body">
        <p className="description">{project.description}</p>

        {/* --- TECHNICAL DNA SECTION --- */}
        <div className="dna-section">
          <label><Dna size={14} /> Technical DNA</label>
          <div className="dna-grid">
            <div className="dna-item">
              <span>Stack</span>
              <strong>{project.tech_stack || "Not Defined"}</strong>
            </div>
            <div className="dna-item">
              <span>Pattern</span>
              <strong>{project.architecture_pattern || "Standard"}</strong>
            </div>
          </div>
        </div>

        {/* --- STYLE & UI SECTION --- */}
        <div className="style-section">
          <label><Palette size={14} /> UI Template</label>
          <div className="template-badge">
            <div className="color-preview" style={{ background: '#3498db' }}></div>
            <span>{project.ui_template || "Kether Default"}</span>
          </div>
        </div>

        {/* --- INPUT/OUTPUT MAPPING (Detailed Only) --- */}
        {isDetailed && (
          <div className="io-section">
            <label><ArrowRightLeft size={14} /> Global Flow</label>
            <div className="io-flow">
              <div className="io-box">Input Data</div>
              <div className="io-arrow">→</div>
              <div className="io-box">Value Output</div>
            </div>
          </div>
        )}
      </div>

      <div className="card-footer">
        <button 
          className="btn-launch" 
          onClick={() => setActiveProject(project)}
        >
          Open Workspace <ExternalLink size={14} />
        </button>
      </div>

      <style jsx>{`
        .kether-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
        }
        .kether-card:hover { border-color: #58a6ff; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .kether-card.detailed { width: 100%; border-color: #58a6ff33; background: #0d1117; }

        .card-header { padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
        .header-main { display: flex; gap: 15px; align-items: center; }
        .icon-box { background: #1f6feb; padding: 10px; border-radius: 10px; color: white; }
        .card-header h3 { margin: 0; font-size: 1.1rem; color: #f0f6fc; }
        .version-label { font-size: 0.7rem; color: #8b949e; font-family: monospace; }

        .card-body { padding: 0 20px 20px 20px; flex: 1; }
        .description { font-size: 0.85rem; color: #8b949e; line-height: 1.5; margin-bottom: 20px; }

        label { 
          font-size: 0.7rem; color: #58a6ff; font-weight: 600; 
          text-transform: uppercase; letter-spacing: 0.5px; 
          display: flex; align-items: center; gap: 6px; margin-bottom: 10px; 
        }

        .dna-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
        .dna-item { background: #0d1117; border: 1px solid #30363d; padding: 8px; border-radius: 6px; }
        .dna-item span { display: block; font-size: 0.6rem; color: #8b949e; }
        .dna-item strong { font-size: 0.75rem; color: #c9d1d9; }

        .template-badge { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #c9d1d9; }
        .color-preview { width: 12px; height: 12px; border-radius: 3px; }

        .io-section { margin-top: 20px; border-top: 1px solid #30363d; padding-top: 15px; }
        .io-flow { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
        .io-box { font-size: 0.7rem; background: #21262d; border: 1px dashed #484f58; padding: 5px 10px; border-radius: 4px; color: #8b949e; }
        .io-arrow { color: #30363d; font-weight: bold; }

        .card-footer { padding: 15px 20px; border-top: 1px solid #30363d; }
        .btn-launch { 
          width: 100%; background: #21262d; border: 1px solid #30363d; color: #f0f6fc; 
          padding: 8px; border-radius: 6px; font-size: 0.85rem; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px; transition: 0.2s;
        }
        .btn-launch:hover { background: #30363d; border-color: #8b949e; }

        .icon-btn { background: none; border: none; color: #8b949e; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default ProjectCard;