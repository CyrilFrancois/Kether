import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Layout, 
  Loader2, 
  Filter, 
  Trash2, 
  Edit3
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';
import UnifiedNodeModal from '../ui/UnifiedNodeModal';

const ProjectMenu = () => {
  const { projects, activeProject, setActiveProject, loading } = useProjectStore();
  const { fetchAllProjects, deleteNode } = useProjects();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); 
  const [sortMode, setSortMode] = useState('alphabetical'); 
  const [activeMenuId, setActiveMenuId] = useState(null); 
  
  const menuRef = useRef(null);

  // Close kebab menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  // Logic: Filter then Sort
  const processedProjects = [...projects]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortMode === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortMode === 'status') {
        const statusA = a.node_metadata?.status || '';
        const statusB = b.node_metadata?.status || '';
        return statusA.localeCompare(statusB);
      }
      return 0;
    });

  // FIX 1: Guard clause to prevent reloading the active project
  const handleProjectClick = (project) => {
    if (activeProject?.id === project.id) return;
    setActiveProject(project);
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingProject(project); // This triggers the modal in edit mode
    setActiveMenuId(null);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project?")) {
      setActiveMenuId(null);
      await deleteNode(projectId);
    }
  };

  return (
    <div className="project-menu">
      <div className="menu-header">
        <div className="header-top">
          <span className="section-title">Projects</span>
          <div className="header-actions">
            <button 
              className={`btn-icon-subtle ${sortMode !== 'alphabetical' ? 'active' : ''}`}
              onClick={() => setSortMode(sortMode === 'alphabetical' ? 'status' : 'alphabetical')}
              title="Toggle Sort Mode"
            >
              <Filter size={16} />
            </button>
            <button 
              className="btn-create-icon" 
              onClick={() => setIsCreateModalOpen(true)}
              title="Create New Project"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Filter projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="project-list-container">
        {loading && projects.length === 0 ? (
          <div className="menu-loading">
            <Loader2 className="animate-spin" size={20} />
            <span>Syncing...</span>
          </div>
        ) : (
          <ul className="project-list">
            {processedProjects.map((project) => (
              <li 
                key={project.id}
                className={`project-item ${activeProject?.id === project.id ? 'active' : ''}`}
                onClick={() => handleProjectClick(project)}
              >
                <div className="item-icon">
                  <Layout size={16} />
                </div>
                <div className="item-details">
                  <span className="item-name">{project.name}</span>
                  <span className="item-meta">
                    {project.node_metadata?.status || 'Active'}
                  </span>
                </div>

                <div className="options-container" ref={activeMenuId === project.id ? menuRef : null}>
                  <button 
                    className={`item-options ${activeMenuId === project.id ? 'visible' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(activeMenuId === project.id ? null : project.id);
                    }}
                  >
                    <MoreVertical size={14} />
                  </button>

                  {activeMenuId === project.id && (
                    <div className="kebab-menu">
                      <button onClick={(e) => handleEdit(e, project)}>
                        <Edit3 size={14} /> Edit Project
                      </button>
                      <button onClick={(e) => handleDelete(e, project.id)} className="delete-opt">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- MODALS --- */}
      {/* FIX 2: Ensure modal only opens if creation is true OR an editing object exists */}
      {(isCreateModalOpen || editingProject) && (
        <UnifiedNodeModal 
          type="project" 
          initialData={editingProject} 
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingProject(null);
          }} 
        />
      )}

      {/* FIX 3: Standard style tag to avoid JSX attribute warning */}
      <style>{`
        .project-menu { display: flex; flex-direction: column; height: 100%; color: #8b949e; }
        .menu-header { padding: 20px 15px 15px; border-bottom: 1px solid #30363d; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .header-actions { display: flex; gap: 8px; align-items: center; }
        .section-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #c9d1d9; }
        
        .btn-icon-subtle { 
          background: none; border: none; color: #484f58; cursor: pointer; padding: 4px; border-radius: 4px; transition: 0.2s;
        }
        .btn-icon-subtle:hover, .btn-icon-subtle.active { color: #58a6ff; background: rgba(56, 139, 253, 0.1); }

        .btn-create-icon { 
          background: #238636; color: white; border: none; width: 28px; height: 28px; border-radius: 6px; 
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }

        .search-bar { 
          display: flex; align-items: center; background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 0 10px; 
        }
        .search-bar input { background: transparent; border: none; color: #c9d1d9; padding: 8px 0; font-size: 0.85rem; width: 100%; outline: none; }

        .project-list-container { flex: 1; overflow-y: auto; padding: 10px 0; }
        .project-list { list-style: none; padding: 0; margin: 0; }
        .project-item { 
          display: flex; align-items: center; padding: 10px 15px; cursor: pointer; position: relative;
          border-left: 3px solid transparent; transition: background 0.15s; 
        }
        .project-item:hover { background: #1c2128; }
        .project-item.active { background: rgba(56, 139, 253, 0.1); border-left-color: #58a6ff; }

        .item-icon { 
          width: 32px; height: 32px; background: #21262d; border: 1px solid #30363d; border-radius: 6px; 
          display: flex; align-items: center; justify-content: center; margin-right: 12px; color: #58a6ff; 
        }
        .item-details { flex: 1; overflow: hidden; }
        .item-name { display: block; font-size: 0.9rem; color: #f0f6fc; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-meta { font-size: 0.7rem; color: #8b949e; }

        .options-container { position: relative; }
        .item-options { 
          background: none; border: none; color: #484f58; cursor: pointer; padding: 5px; opacity: 0; 
        }
        .project-item:hover .item-options, .item-options.visible { opacity: 1; }
        
        .kebab-menu {
          position: absolute; right: 0; top: 30px; background: #161b22; border: 1px solid #30363d;
          border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); z-index: 100; min-width: 140px; padding: 4px;
        }
        .kebab-menu button {
          display: flex; align-items: center; gap: 8px; width: 100%; padding: 8px 12px;
          background: none; border: none; color: #c9d1d9; font-size: 0.75rem; cursor: pointer; border-radius: 4px;
        }
        .kebab-menu button:hover { background: #1f242c; color: #58a6ff; }
        .kebab-menu button.delete-opt:hover { color: #f85149; background: rgba(248, 81, 73, 0.1); }

        .menu-loading { display: flex; flex-direction: column; align-items: center; padding: 40px; gap: 12px; color: #8b949e; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProjectMenu;