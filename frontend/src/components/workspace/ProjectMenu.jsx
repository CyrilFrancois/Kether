import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Layout, 
  Loader2, 
  Filter, 
  Trash2, 
  Edit3,
  Star,
  Folder
} from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';
import UnifiedNodeModal from '../ui/UnifiedNodeModal';

const ProjectMenu = () => {
  const { projects, activeProject, setActiveProject, loading } = useProjectStore();
  const { fetchAllProjects, deleteNode, updateNode } = useProjects();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); 
  const [filterMode, setFilterMode] = useState('all'); // 'all' or 'favorites'
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

  // Processing: Search -> Filter Favorites -> Sort
  const processedProjects = [...projects]
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => filterMode === 'favorites' ? p.is_favorite : true)
    .sort((a, b) => {
      // Favorites always float to the top regardless of name
      if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

  const handleProjectClick = (project) => {
    if (activeProject?.id === project.id) return;
    setActiveProject(project);
  };

  const handleToggleFavorite = async (e, project) => {
    e.stopPropagation();
    await updateNode(project.id, { is_favorite: !project.is_favorite });
  };

  const handleEdit = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setActiveMenuId(null);
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("Permanently delete this project and all associated data?")) {
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
              className={`btn-icon-subtle ${filterMode === 'favorites' ? 'active' : ''}`}
              onClick={() => setFilterMode(filterMode === 'all' ? 'favorites' : 'all')}
              title="Show Favorites"
            >
              <Star size={16} fill={filterMode === 'favorites' ? "currentColor" : "none"} />
            </button>
            <button 
              className="btn-create-icon" 
              onClick={() => setIsCreateModalOpen(true)}
              title="New Project"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
        
        <div className="search-bar">
          <Search size={14} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="project-list-container">
        {loading && projects.length === 0 ? (
          <div className="menu-loading">
            <Loader2 className="animate-spin" size={20} />
            <span>Updating Workspace...</span>
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
                  {project.thumbnail_path ? (
                    <img src={project.thumbnail_path} alt="" className="project-thumb" />
                  ) : (
                    <Folder size={16} />
                  )}
                </div>
                
                <div className="item-details">
                  <div className="name-row">
                    <span className="item-name">{project.name}</span>
                    {project.is_favorite && <Star size={10} fill="#d29922" color="#d29922" />}
                  </div>
                  <span className="item-meta">{project.domain || 'General Project'}</span>
                </div>

                <div className="options-wrapper" ref={activeMenuId === project.id ? menuRef : null}>
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
                      <button onClick={(e) => handleToggleFavorite(e, project)}>
                        <Star size={14} /> {project.is_favorite ? 'Unfavorite' : 'Favorite'}
                      </button>
                      <button onClick={(e) => handleEdit(e, project)}>
                        <Edit3 size={14} /> Settings
                      </button>
                      <div className="menu-divider" />
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

      <style jsx>{`
        .project-menu { display: flex; flex-direction: column; height: 100%; background: #0d1117; color: #8b949e; border-right: 1px solid #30363d; }
        .menu-header { padding: 16px; border-bottom: 1px solid #30363d; }
        .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .section-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #c9d1d9; letter-spacing: 0.5px; }
        .header-actions { display: flex; gap: 4px; }

        .btn-icon-subtle { background: none; border: none; color: #484f58; cursor: pointer; padding: 6px; border-radius: 4px; display: flex; align-items: center; }
        .btn-icon-subtle:hover { color: #c9d1d9; background: #21262d; }
        .btn-icon-subtle.active { color: #d29922; }

        .btn-create-icon { background: #238636; color: white; border: none; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .btn-create-icon:hover { background: #2ea043; }

        .search-bar { display: flex; align-items: center; background: #161b22; border: 1px solid #30363d; border-radius: 6px; padding: 0 10px; gap: 8px; }
        .search-bar input { background: transparent; border: none; color: #c9d1d9; padding: 6px 0; font-size: 0.8rem; width: 100%; outline: none; }
        .search-icon { color: #484f58; }

        .project-list-container { flex: 1; overflow-y: auto; }
        .project-list { list-style: none; padding: 0; margin: 0; }
        .project-item { display: flex; align-items: center; padding: 12px 16px; cursor: pointer; border-bottom: 1px solid #21262d; transition: background 0.2s; }
        .project-item:hover { background: #161b22; }
        .project-item.active { background: rgba(56, 139, 253, 0.1); }

        .item-icon { width: 32px; height: 32px; background: #21262d; border: 1px solid #30363d; border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px; overflow: hidden; color: #58a6ff; }
        .project-thumb { width: 100%; height: 100%; object-fit: cover; }

        .item-details { flex: 1; min-width: 0; }
        .name-row { display: flex; align-items: center; gap: 6px; }
        .item-name { font-size: 0.85rem; color: #f0f6fc; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .item-meta { font-size: 0.7rem; color: #484f58; text-transform: capitalize; }

        .options-wrapper { position: relative; }
        .item-options { background: none; border: none; color: #484f58; cursor: pointer; padding: 4px; opacity: 0; }
        .project-item:hover .item-options, .item-options.visible { opacity: 1; }

        .kebab-menu { position: absolute; right: 0; top: 24px; background: #1c2128; border: 1px solid #30363d; border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 50; min-width: 160px; padding: 4px; }
        .kebab-menu button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; background: none; border: none; color: #c9d1d9; font-size: 0.75rem; cursor: pointer; border-radius: 4px; text-align: left; }
        .kebab-menu button:hover { background: #30363d; }
        .menu-divider { height: 1px; background: #30363d; margin: 4px 0; }
        .delete-opt { color: #f85149 !important; }

        .menu-loading { display: flex; flex-direction: column; align-items: center; padding: 40px; gap: 12px; color: #484f58; font-size: 0.8rem; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default ProjectMenu;