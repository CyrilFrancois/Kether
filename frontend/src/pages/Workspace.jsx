import React, { useEffect } from 'react';
import { 
  GitGraph, 
  Plus, 
  LayoutPanelLeft, 
  Loader2, 
  AlertCircle, 
  Network, 
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import useProjectStore from '../store/projectStore';
import { useProjects } from '../hooks/useProjects';

// Workspace Components
import ProjectMenu from '../components/workspace/ProjectMenu';
import ProjectMap from '../components/workspace/ProjectMap';
import SmartInspector from '../components/workspace/SmartInspector';

const Workspace = () => {
  const { 
    activeProject, 
    viewMode, 
    setViewMode, 
    loading, 
    error,
    isInspectorOpen,
    setInspectorOpen
  } = useProjectStore();
  
  const { fetchProjectTree } = useProjects();

  // Sync the recursive 5-layer tree whenever the project changes
  useEffect(() => {
    if (activeProject?.id) {
      fetchProjectTree(activeProject.id);
    }
  }, [activeProject?.id]);

  if (!activeProject) {
    return (
      <div className="empty-workspace">
        <LayoutPanelLeft size={64} className="icon-subtle" />
        <h2>Orchestration Chamber Offline</h2>
        <p>Select a project from the sidebar or dashboard to begin decomposition.</p>
        <div className="empty-actions">
           {/* This triggers the same logic as the sidebar Create button */}
           <button className="btn-primary"><Plus size={18} /> Initialize New DNA</button>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace-layout">
      {/* --- LEFT SIDEBAR: PROJECT NAVIGATOR --- */}
      <aside className="workspace-sidebar">
        <ProjectMenu />
      </aside>

      {/* --- CENTER: THE MAIN ORCHESTRATOR --- */}
      <section className="workspace-main">
        <header className="workspace-toolbar">
          <div className="toolbar-left">
            <div className="project-badge">
              <span className="status-indicator online"></span>
              <h1>{activeProject.name}</h1>
            </div>
            <div className="tech-pills">
              {activeProject.tech_stack?.split(',').map(tech => (
                <span key={tech} className="pill">{tech.trim()}</span>
              ))}
            </div>
          </div>

          <div className="view-switcher">
            <button 
              className={viewMode === 'tree' ? 'active' : ''} 
              onClick={() => setViewMode('tree')}
              title="Hierarchical Tree View"
            >
              <GitGraph size={16} /> Tree
            </button>
            <button 
              className={viewMode === 'flower' ? 'active' : ''} 
              onClick={() => setViewMode('flower')}
              title="Radial Discovery View"
            >
              <Network size={16} /> Flower
            </button>
          </div>

          <button 
            className={`inspector-toggle ${isInspectorOpen ? 'open' : ''}`}
            onClick={() => setInspectorOpen(!isInspectorOpen)}
          >
            {isInspectorOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </header>

        {error && (
          <div className="error-banner">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="workspace-canvas-area">
          {loading ? (
            <div className="loading-overlay">
              <Loader2 className="animate-spin" size={40} />
              <p>Reconstructing Project Geometry...</p>
            </div>
          ) : (
            <ProjectMap />
          )}
        </div>
      </section>

      {/* --- RIGHT SIDEBAR: SMART INSPECTOR --- */}
      <aside className={`workspace-inspector ${isInspectorOpen ? 'visible' : 'hidden'}`}>
        <SmartInspector />
      </aside>

      <style jsx>{`
        .workspace-layout {
          display: grid;
          grid-template-columns: 260px 1fr auto;
          height: calc(100vh - 64px); /* Adjust based on your Navbar height */
          background: #0d1117;
          overflow: hidden;
        }

        .workspace-sidebar {
          border-right: 1px solid #30363d;
          background: #161b22;
          overflow-y: auto;
        }

        .workspace-main {
          display: flex;
          flex-direction: column;
          position: relative;
          background: radial-gradient(circle at center, #161b22 0%, #0d1117 100%);
        }

        .workspace-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(22, 27, 34, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #30363d;
          z-index: 10;
        }

        .project-badge { display: flex; align-items: center; gap: 12px; }
        .project-badge h1 { font-size: 1.1rem; color: #f0f6fc; margin: 0; font-weight: 600; }
        
        .status-indicator { width: 10px; height: 10px; border-radius: 50%; }
        .online { background: #238636; box-shadow: 0 0 8px #238636; }

        .tech-pills { display: flex; gap: 6px; margin-left: 15px; }
        .pill { font-size: 0.65rem; color: #58a6ff; border: 1px solid rgba(88, 166, 255, 0.3); padding: 2px 8px; border-radius: 10px; text-transform: uppercase; }

        .view-switcher { 
          display: flex; 
          background: #010409; 
          padding: 3px; 
          border-radius: 8px; 
          border: 1px solid #30363d; 
        }
        .view-switcher button {
          display: flex; align-items: center; gap: 6px;
          background: none; border: none; color: #8b949e;
          padding: 6px 14px; font-size: 0.8rem; cursor: pointer;
          border-radius: 6px; transition: all 0.2s;
        }
        .view-switcher button.active { background: #21262d; color: #58a6ff; }

        .inspector-toggle {
          background: none; border: none; color: #8b949e; cursor: pointer;
          padding: 5px; border-radius: 5px; transition: 0.2s;
        }
        .inspector-toggle:hover { color: #fff; background: #30363d; }

        .workspace-canvas-area { flex: 1; position: relative; }

        .workspace-inspector {
          width: 380px;
          border-left: 1px solid #30363d;
          background: #161b22;
          transition: transform 0.3s ease;
        }
        .workspace-inspector.hidden { width: 0; border: none; overflow: hidden; }

        .loading-overlay {
          position: absolute; inset: 0; display: flex; flex-direction: column;
          align-items: center; justify-content: center; background: rgba(13, 17, 23, 0.8);
          color: #58a6ff; gap: 20px; z-index: 5;
        }

        .empty-workspace {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; text-align: center; background: #0d1117; color: #8b949e;
        }
        .icon-subtle { opacity: 0.1; margin-bottom: 24px; }
        .btn-primary { 
          background: #238636; color: #fff; border: none; padding: 12px 24px;
          border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default Workspace;