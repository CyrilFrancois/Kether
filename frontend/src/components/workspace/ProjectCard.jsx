import React from 'react';
import axios from 'axios';

/**
 * ProjectCard Component
 * Role: Level 1 (Project) Visual Representation
 * Features: DNA summary, Progress aggregation, and Entry point to Workspace.
 */
const ProjectCard = ({ project, onRefresh }) => {
  
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Purge all DNA for ${project.name}? This cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/projects/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onRefresh(); // Refresh dashboard list
    } catch (err) {
      console.error("Purge failed:", err);
      alert("Failed to delete project.");
    }
  };

  // Helper to render tags from comma-separated string
  const renderTags = (tags, type) => {
    if (!tags) return null;
    return tags.split(',').map((tag, i) => (
      <span key={i} className={`dna-tag tag-${type}`}>{tag.trim()}</span>
    ));
  };

  return (
    <div className="project-card-container" style={{ '--accent': project.color || '#3498db' }}>
      <div className="card-header">
        <div className="header-main">
          <span className="status-indicator"></span>
          <h3>{project.name}</h3>
        </div>
        <span className="priority-badge">{project.priority}</span>
      </div>

      <div className="card-body">
        <p className="description">{project.description || 'No system intent defined.'}</p>
        
        <div className="dna-section">
          <div className="dna-group">
            <label>Stack</label>
            <div className="tag-cloud">{renderTags(project.tech_stack, 'tech')}</div>
          </div>
          
          <div className="dna-row">
            <div className="dna-group">
              <label>UI Paradigm</label>
              <span className="dna-value">{project.ui_paradigm || 'Standard'}</span>
            </div>
            <div className="dna-group">
              <label>I/O Schema</label>
              <span className="dna-value">{project.io_schema || 'Default'}</span>
            </div>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-meta">
            <span>System Completion</span>
            <span>{project.progress || 0}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="card-actions">
        <button className="workspace-btn" onClick={() => window.location.href = `/workspace/${project.id}`}>
          Open Workspace
        </button>
        <button className="purge-btn" onClick={handleDelete} title="Purge Project DNA">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
        </button>
      </div>

      <style>{`
        .project-card-container {
          background: #161a1e;
          border: 1px solid #2a2f35;
          border-top: 4px solid var(--accent);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .project-card-container:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
          border-color: #3f464d;
        }

        .card-header {
          padding: 20px 20px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-main { display: flex; align-items: center; gap: 10px; }
        .status-indicator { 
          width: 8px; height: 8px; border-radius: 50%; 
          background: var(--accent); 
          box-shadow: 0 0 8px var(--accent);
        }

        .card-header h3 {
          margin: 0; color: #fff; font-size: 1.1rem; letter-spacing: 0.5px;
        }

        .priority-badge {
          font-size: 0.65rem; background: #000; color: #888;
          padding: 3px 8px; border-radius: 4px; border: 1px solid #333;
          text-transform: uppercase; font-family: monospace;
        }

        .card-body { padding: 0 20px 20px; flex-grow: 1; }
        
        .description {
          color: #9da5b1; font-size: 0.85rem; line-height: 1.5;
          margin-bottom: 20px; height: 2.5em; overflow: hidden;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
        }

        .dna-section { margin-bottom: 20px; }
        .dna-group { margin-bottom: 12px; }
        .dna-group label { 
          display: block; font-size: 0.65rem; color: #555; 
          text-transform: uppercase; margin-bottom: 6px; font-weight: bold;
        }

        .tag-cloud { display: flex; gap: 6px; flex-wrap: wrap; }
        .dna-tag {
          font-size: 0.7rem; padding: 2px 8px; border-radius: 3px;
          background: #1c2229; border: 1px solid #2d353f; color: #00d4ff;
        }

        .dna-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .dna-value { color: #ccc; font-size: 0.8rem; font-family: monospace; }

        .progress-section { margin-top: 10px; }
        .progress-meta {
          display: flex; justify-content: space-between;
          font-size: 0.7rem; color: #666; margin-bottom: 6px; font-family: monospace;
        }
        .progress-track { background: #000; height: 4px; border-radius: 2px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--accent); transition: width 1s ease; }

        .card-actions {
          padding: 15px 20px; background: #0f1216; border-top: 1px solid #2a2f35;
          display: flex; gap: 10px;
        }

        .workspace-btn {
          flex-grow: 1; background: transparent; border: 1px solid #333;
          color: #fff; padding: 8px; border-radius: 4px; cursor: pointer;
          font-size: 0.8rem; font-weight: 600; transition: 0.2s;
        }
        .workspace-btn:hover { background: #fff; color: #000; border-color: #fff; }

        .purge-btn {
          background: transparent; border: 1px solid #333; color: #555;
          padding: 8px; border-radius: 4px; cursor: pointer; transition: 0.2s;
        }
        .purge-btn:hover { color: #ff4d4d; border-color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }
      `}</style>
    </div>
  );
};

export default ProjectCard;