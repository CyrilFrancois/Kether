import React, { useEffect } from 'react';
import { 
  GitGraph, 
  Plus, 
  LayoutDashboard, 
  Loader2, 
  AlertCircle, 
  Share2, 
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
    setInspectorOpen,
    projects
  } = useProjectStore();
  
  const { fetchProjectTree, fetchAllProjects } = useProjects();

  // 1. Initial Load: Fetch all top-level projects
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // 2. Sync Tree: Fetch child nodes when active project changes
  useEffect(() => {
    if (activeProject?.id) {
      fetchProjectTree(activeProject.id);
    }
  }, [activeProject?.id, fetchProjectTree]);

  // --- VIEW: NO PROJECT SELECTED ---
  if (!activeProject) {
    return (
      <div className="workspace-layout no-sidebar">
        <aside className="workspace-sidebar">
          <ProjectMenu />
        </aside>
        <section className="empty-workspace">
          <LayoutDashboard size={64} className="icon-subtle" />
          <h2>Project Workspace</h2>
          <p>Select a project from the sidebar or create a new one to begin.</p>
          <div className="empty-actions">
             {/* This button should trigger your Create Project Modal */}
             <button className="btn-primary">
               <Plus size={18} /> Create New Project
             </button>
          </div>
        </section>
        
        <style jsx>{`
          .no-sidebar { grid-template-columns: 260px 1fr !important; }
          .empty-workspace {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            height: 100%; text-align: center; background: #0d1117; color: #8b949e; flex: 1;
          }
          .icon-subtle { opacity: 0.1; margin-bottom: 24px; color: #58a6ff; }
          .btn-primary { 
            background: #238636; color: #fff; border: none; padding: 12px 24px; margin-top: 20px;
            border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px;
          }
          .workspace-layout { display: grid; grid-template-columns: 260px 1fr auto; height: 100vh; background: #0d1117; }
          .workspace-sidebar { border-right: 1px solid #30363d; background: #161b22; }
        `}</style>
      </div>
    );
  }

  // --- VIEW: ACTIVE PROJECT WORKSPACE ---
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
            </div>
            <div className="tech-pills">
              {/* Safely parse tech stack from metadata */}
              {activeProject.node_metadata?.tech_stack?.split(',').map(tech => (
                <span key={tech} className="pill">{tech.trim()}</span>
              ))}
            </div>
          </div>

          <div className="view-switcher">
            <button 
              className={viewMode === 'tree' ? 'active' : ''} 
              onClick={() => setViewMode('tree')}
            >
              <GitGraph size={16} /> Hierarchy
            </button>
            <button 
              className={viewMode === 'map' ? 'active' : ''} 
              onClick={() => setViewMode('map')}
            >
              <Share2 size={16} /> Map
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
              <p>Loading project structure...</p>
            </div>
          ) : (
            <ProjectMap />
          )}
        </div>
      </section>

      <aside className={`workspace-inspector ${isInspectorOpen ? 'visible' : 'hidden'}`}>
        <SmartInspector />
      </aside>

      <style jsx>{`
        .workspace-layout { display: grid; grid-template-columns: 260px 1fr auto; height: 100vh; background: #0d1117; overflow: hidden; }
        .workspace-sidebar { border-right: 1px solid #30363d; background: #161b22; overflow-y: auto; }
        .workspace-main { display: flex; flex-direction: column; position: relative; background: #0d1117; }
        .workspace-toolbar { 
            display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; 
            background: #161b22; border-bottom: 1px solid #30363d; z-index: 10; 
        }
        .project-badge { display: flex; align-items: center; gap: 12px; }
        .project-badge h1 { font-size: 1rem; color: #f0f6fc; margin: 0; }
        .status-indicator { width: 8px; height: 8px; border-radius: 50%; background: #238636; }
        .tech-pills { display: flex; gap: 6px; margin-left: 15px; }
        .pill { font-size: 0.65rem; color: #58a6ff; background: rgba(56, 139, 253, 0.1); border: 1px solid rgba(56, 139, 253, 0.3); padding: 2px 8px; border-radius: 4px; }
        .view-switcher { display: flex; background: #010409; padding: 2px; border-radius: 6px; border: 1px solid #30363d; }
        .view-switcher button { 
            display: flex; align-items: center; gap: 6px; background: none; border: none; color: #8b949e; 
            padding: 6px 12px; font-size: 0.75rem; cursor: pointer; border-radius: 4px; 
        }
        .view-switcher button.active { background: #21262d; color: #58a6ff; }
        .workspace-canvas-area { flex: 1; position: relative; }
        .workspace-inspector { width: 380px; border-left: 1px solid #30363d; background: #161b22; transition: 0.3s; }
        .workspace-inspector.hidden { width: 0; overflow: hidden; border: none; }
        .error-banner { background: rgba(248, 81, 73, 0.1); color: #f85149; padding: 8px 20px; font-size: 0.8rem; display: flex; align-items: center; gap: 10px; }
        .loading-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0d1117; z-index: 5; }
      `}</style>
    </div>
  );
};

export default Workspace;