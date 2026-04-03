import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Layout, Loader2 } from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import { useProjects } from '../../hooks/useProjects';
import UnifiedNodeModal from '../ui/UnifiedNodeModal';

const ProjectMenu = () => {
  const { projects, activeProject, setActiveProject, loading } = useProjectStore();
  const { fetchAllProjects } = useProjects();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Initial load of the project list
  useEffect(() => {
    fetchAllProjects();
  }, [fetchAllProjects]);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="project-menu">
      {/* --- HEADER & CREATE ACTION --- */}
      <div className="menu-header">
        <div className="header-top">
          <span className="section-title">Projects</span>
          <button 
            className="btn-create-icon" 
            onClick={() => setIsCreateModalOpen(true)}
            title="Create New Project"
          >
            <Plus size={18} />
          </button>
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

      {/* --- PROJECT LIST --- */}
      <div className="project-list-container">
        {loading && projects.length === 0 ? (
          <div className="menu-loading">
            <Loader2 className="animate-spin" size={20} />
            <span>Syncing database...</span>
          </div>
        ) : (
          <ul className="project-list">
            {filteredProjects.map((project) => (
              <li 
                key={project.id}
                className={`project-item ${activeProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setActiveProject(project)}
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
                <button className="item-options" onClick={(e) => e.stopPropagation()}>
                  <MoreVertical size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="menu-empty">
            <p>{searchTerm ? "No projects found." : "No projects created yet."}</p>
          </div>
        )}
      </div>

      {/* --- CREATE PROJECT MODAL --- */}
      {isCreateModalOpen && (
        <UnifiedNodeModal 
          type="project" 
          onClose={() => setIsCreateModalOpen(false)} 
        />
      )}

      <style jsx>{`
        .project-menu {
          display: flex;
          flex-direction: column;
          height: 100%;
          color: #8b949e;
        }

        .menu-header {
          padding: 20px 15px 15px;
          border-bottom: 1px solid #30363d;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .section-title {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #c9d1d9;
        }

        .btn-create-icon {
          background: #238636;
          color: white;
          border: none;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-create-icon:hover { background: #2ea043; }

        .search-bar {
          display: flex;
          align-items: center;
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 0 10px;
        }

        .search-icon { margin-right: 8px; color: #484f58; }

        .search-bar input {
          background: transparent;
          border: none;
          color: #c9d1d9;
          padding: 8px 0;
          font-size: 0.85rem;
          width: 100%;
          outline: none;
        }

        .project-list-container {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
        }

        .project-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .project-item {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          cursor: pointer;
          transition: background 0.15s;
          border-left: 3px solid transparent;
        }

        .project-item:hover { background: #1c2128; }
        
        .project-item.active {
          background: rgba(56, 139, 253, 0.1);
          border-left-color: #58a6ff;
        }

        .item-icon {
          width: 32px;
          height: 32px;
          background: #21262d;
          border: 1px solid #30363d;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
          color: #58a6ff;
        }

        .project-item.active .item-icon {
          background: #58a6ff;
          color: #fff;
          border-color: #58a6ff;
        }

        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .item-name {
          font-size: 0.9rem;
          color: #f0f6fc;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-meta {
          font-size: 0.7rem;
          color: #8b949e;
          text-transform: capitalize;
        }

        .item-options {
          background: none;
          border: none;
          color: #484f58;
          cursor: pointer;
          padding: 5px;
          opacity: 0;
          transition: 0.2s;
        }

        .project-item:hover .item-options { opacity: 1; }
        .item-options:hover { color: #c9d1d9; }

        .menu-loading, .menu-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 12px;
          font-size: 0.85rem;
          color: #8b949e;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProjectMenu;