import React, { useEffect, useState } from 'react';
import { 
  GitGraph, 
  Plus, 
  LayoutDashboard, 
  Loader2, 
  AlertCircle, 
  Share2, 
  ChevronRight,
  ChevronLeft,
  RefreshCcw
} from 'lucide-react';
import useProjectStore from '../store/projectStore';
import { useProjects } from '../hooks/useProjects';

// Workspace Components
import ProjectMenu from '../components/workspace/ProjectMenu';
import ProjectMap from '../components/workspace/ProjectMap';
import SmartInspector from '../components/workspace/SmartInspector';
import UnifiedNodeModal from '../components/ui/UnifiedNodeModal';

const Workspace = () => {
  const { 
    activeProject, 
    viewMode, 
    setViewMode, 
    loading, 
    error,
    isInspectorOpen,
    setInspectorOpen,
    setError
  } = useProjectStore();
  
  const { fetchProjectTree, fetchAllProjects } = useProjects();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // 1. Initial Load: Fetch top-level projects
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // 2. Tree Synchronization: Fetch tree when active project changes
  useEffect(() => {
    if (activeProject?.id) {
      fetchProjectTree(activeProject.id).catch(() => {
        setError("Failed to synchronize project structure.");
      });
    }
  }, [activeProject?.id, fetchProjectTree, setError]);

  // --- SUB-VIEW: EMPTY STATE ---
  if (!activeProject) {
    return (
      <div className="workspace-layout no-sidebar">
        <aside className="workspace-sidebar">
          <ProjectMenu />
        </aside>
        <section className="empty-workspace">
          <div className="empty-content">
            <LayoutDashboard size={64} className="icon-subtle" />
            <h2>Project Workspace</h2>
            <p>Select a workspace from the sidebar or initialize a new project to begin orchestration.</p>
            <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>
              <Plus size={18} /> New Project
            </button>
          </div>
        </section>
        
        {isCreateModalOpen && (
          <UnifiedNodeModal level={1} onClose={() => setCreateModalOpen(false)} />
        )}

        <style jsx>{`
          .workspace-layout { display: grid; grid-template-columns: 260px 1fr; height: 100vh; background: #0d1117; }
          .workspace-sidebar { border-right: 1px solid #30363d; background: #161b22; }
          .empty-workspace { flex: 1; display: flex; align-items: center; justify-content: center; background: #0d1117; }
          .empty-content { text-align: center; max-width: 400px; padding: 40px; }
          .icon-subtle { color: #58a6ff; opacity: 0.15; margin-bottom: 24px; }
          h2 { color: #f0f6fc; margin-bottom: 8px; font-weight: 600; }
          p { color: #8b949e; margin-bottom: 24px; font-size: 0.95rem; }
          .btn-primary { 
            background: #238636; color: white; border: none; padding: 10px 20px; 
            border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; 
            align-items: center; gap: 8px; margin: 0 auto;
          }
          .btn-primary:hover { background: #2ea043; }
        `}</style>
      </div>
    );
  }

  // --- SUB-VIEW: ACTIVE WORKSPACE ---
  return (
    <div className="workspace-layout">
      <aside className="workspace-sidebar">
        <ProjectMenu />
      </aside>

      <section className="workspace-main">
        <header className="workspace-toolbar">
          <div className="toolbar-left">
            <div className="project-badge">
              <span className="status-indicator active"></span>
              <h1>{activeProject.name}</h1>
              <span className="domain-tag">{activeProject.domain || 'General'}</span>
            </div>
          </div>

          <div className="toolbar-center">
            <div className="view-switcher">
              <button 
                className={viewMode === 'tree' ? 'active' : ''} 
                onClick={() => setViewMode('tree')}
              >
                <GitGraph size={14} /> Hierarchy
              </button>
              <button 
                className={viewMode === 'map' ? 'active' : ''} 
                onClick={() => setViewMode('map')}
              >
                <Share2 size={14} /> Map
              </button>
            </div>
          </div>

          <div className="toolbar-right">
            <button 
              className={`inspector-toggle ${isInspectorOpen ? 'open' : ''}`}
              onClick={() => setInspectorOpen(!isInspectorOpen)}
              title={isInspectorOpen ? "Close Inspector" : "Open Inspector"}
            >
              {isInspectorOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner">
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <button className="retry-btn" onClick={() => fetchProjectTree(activeProject.id)}>
              <RefreshCcw size={14} /> Retry Sync
            </button>
          </div>
        )}

        <main className="workspace-canvas">
          {loading ? (
            <div className="loading-state">
              <Loader2 className="animate-spin" size={32} color="#58a6ff" />
              <p>Reconstructing project hierarchy...</p>
            </div>
          ) : (
            <ProjectMap />
          )}
        </main>
      </section>

      <aside className={`workspace-inspector ${isInspectorOpen ? 'visible' : 'hidden'}`}>
        <SmartInspector />
      </aside>

      <style jsx>{`
        .workspace-layout { display: grid; grid-template-columns: 260px 1fr auto; height: 100vh; background: #0d1117; overflow: hidden; }
        .workspace-sidebar { border-right: 1px solid #30363d; background: #161b22; }
        .workspace-main { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        
        .workspace-toolbar { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 0 20px; height: 56px; background: #161b22; border-bottom: 1px solid #30363d; 
        }

        .project-badge { display: flex; align-items: center; gap: 12px; }
        .project-badge h1 { font-size: 0.95rem; color: #f0f6fc; margin: 0; font-weight: 600; }
        .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: #238636; box-shadow: 0 0 8px rgba(35, 134, 54, 0.4); }
        .domain-tag { font-size: 0.7rem; color: #8b949e; background: #21262d; padding: 2px 8px; border-radius: 12px; border: 1px solid #30363d; }

        .view-switcher { display: flex; background: #0d1117; padding: 3px; border-radius: 8px; border: 1px solid #30363d; }
        .view-switcher button { 
          display: flex; align-items: center; gap: 6px; background: none; border: none; color: #8b949e; 
          padding: 6px 12px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border-radius: 6px; transition: all 0.2s;
        }
        .view-switcher button.active { background: #21262d; color: #58a6ff; }

        .inspector-toggle { background: none; border: none; color: #8b949e; cursor: pointer; padding: 8px; display: flex; align-items: center; }
        .inspector-toggle:hover { color: #f0f6fc; }

        .error-banner { 
          background: rgba(248, 81, 73, 0.1); border-bottom: 1px solid rgba(248, 81, 73, 0.2); 
          padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; 
        }
        .error-message { display: flex; align-items: center; gap: 10px; color: #ff7b72; font-size: 0.85rem; }
        .retry-btn { 
          background: #21262d; border: 1px solid #30363d; color: #c9d1d9; font-size: 0.75rem; 
          padding: 4px 12px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px;
        }

        .workspace-canvas { flex: 1; position: relative; overflow: hidden; background-image: radial-gradient(#30363d 1px, transparent 1px); background-size: 30px 30px; }
        .loading-state { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0d1117; z-index: 20; gap: 16px; }
        .loading-state p { color: #8b949e; font-size: 0.9rem; }

        .workspace-inspector { width: 380px; border-left: 1px solid #30363d; background: #161b22; transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s; }
        .workspace-inspector.hidden { width: 0; transform: translateX(100%); }
      `}</style>
    </div>
  );
};

export default Workspace;