import React, { useEffect } from 'react';
import { GitGraph, List, Plus, LayoutPanelLeft, Loader2, AlertCircle } from 'lucide-react';
import useProjectStore from '../store/projectStore';
import { useProjects } from '../hooks/useProjects';

// Components we will create in the next steps
import ProjectMap from '../components/workspace/ProjectMap';
import BacklogView from '../components/workspace/BacklogView';

const Workspace = () => {
  const { activeProject, viewMode, setViewMode, loading, error } = useProjectStore();
  const { fetchProjectDetails } = useProjects();

  // Sync data whenever the active project or view changes
  useEffect(() => {
    if (activeProject?.id) {
      fetchProjectDetails(activeProject.id);
    }
  }, [activeProject?.id]);

  if (!activeProject) {
    return (
      <div className="empty-workspace">
        <LayoutPanelLeft size={48} className="icon-subtle" />
        <h2>No Active Mission</h2>
        <p>Select a project from the Dashboard to begin orchestration.</p>
        <button className="btn-primary"><Plus size={18} /> New Project</button>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* --- WORKSPACE TOOLBAR --- */}
      <header className="workspace-toolbar">
        <div className="toolbar-left">
          <div className="project-badge">
            <span className="dot pulse"></span>
            <h1>{activeProject.name}</h1>
          </div>
          <span className="stack-label">{activeProject.tech_stack}</span>
        </div>

        <div className="view-switcher">
          <button 
            className={viewMode === 'map' ? 'active' : ''} 
            onClick={() => setViewMode('map')}
          >
            <GitGraph size={16} /> Architecture Map
          </button>
          <button 
            className={viewMode === 'backlog' ? 'active' : ''} 
            onClick={() => setViewMode('backlog')}
          >
            <List size={16} /> Backlog Factory
          </button>
        </div>
      </header>

      {/* --- ERROR & LOADING STATES --- */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* --- DYNAMIC VIEWPORT --- */}
      <main className="workspace-viewport">
        {loading ? (
          <div className="loading-overlay">
            <Loader2 className="animate-spin" size={32} />
            <p>Syncing Kether Core...</p>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? <ProjectMap /> : <BacklogView />}
          </>
        )}
      </main>

      <style jsx>{`
        .workspace-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 20px;
        }

        .workspace-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #30363d;
        }

        .toolbar-left { display: flex; align-items: center; gap: 15px; }
        
        .project-badge { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          background: #161b22; 
          padding: 5px 15px; 
          border-radius: 20px;
          border: 1px solid #30363d;
        }

        .project-badge h1 { font-size: 1rem; margin: 0; color: #fff; }
        .stack-label { font-size: 0.7rem; color: #8b949e; background: #0d1117; padding: 2px 8px; border-radius: 4px; border: 1px solid #30363d; }

        .dot { width: 8px; height: 8px; border-radius: 50%; background: #238636; }
        .pulse { animation: pulse-green 2s infinite; }

        @keyframes pulse-green {
          0% { box-shadow: 0 0 0 0 rgba(35, 134, 54, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(35, 134, 54, 0); }
          100% { box-shadow: 0 0 0 0 rgba(35, 134, 54, 0); }
        }

        /* View Switcher */
        .view-switcher { display: flex; background: #0d1117; padding: 4px; border-radius: 8px; border: 1px solid #30363d; }
        .view-switcher button {
          display: flex; align-items: center; gap: 8px;
          background: none; border: none; color: #8b949e;
          padding: 6px 16px; font-size: 0.85rem; cursor: pointer;
          border-radius: 6px; transition: 0.2s;
        }
        .view-switcher button.active { background: #21262d; color: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }

        .workspace-viewport { flex: 1; position: relative; overflow: hidden; }

        .loading-overlay { 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          height: 100%; color: #8b949e; gap: 15px;
        }

        .empty-workspace {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 80vh; text-align: center; color: #8b949e;
        }
        .icon-subtle { opacity: 0.2; margin-bottom: 20px; }
        .btn-primary { 
          margin-top: 20px; background: #238636; color: white; border: none; 
          padding: 10px 24px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default Workspace;