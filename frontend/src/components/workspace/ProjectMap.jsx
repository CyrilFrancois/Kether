import React from 'react';
import useProjectStore from '../../store/projectStore';
import FlowerView from './FlowerView';
import TreeView from './TreeView';
import { Search, ZoomIn, ZoomOut, Maximize, Filter } from 'lucide-react';

const ProjectMap = () => {
  const { viewMode, projectTree } = useProjectStore();

  if (!projectTree) return null;

  return (
    <div className="project-map-wrapper">
      {/* --- CANVAS CONTROLS --- */}
      <div className="canvas-overlay-ui top-right">
        <div className="ui-group">
          <button className="ui-btn" title="Filter Layers"><Filter size={16} /></button>
          <button className="ui-btn" title="Focus Center"><Maximize size={16} /></button>
        </div>
        <div className="ui-group">
          <button className="ui-btn"><ZoomIn size={16} /></button>
          <button className="ui-btn"><ZoomOut size={16} /></button>
        </div>
      </div>

      <div className="canvas-overlay-ui bottom-left">
        <div className="search-pill">
          <Search size={14} />
          <input type="text" placeholder="Locate node in DNA..." />
        </div>
      </div>

      {/* --- DYNAMIC VIEWPORT --- */}
      <div className="view-container">
        {viewMode === 'flower' ? (
          <FlowerView />
        ) : (
          <TreeView />
        )}
      </div>

      <style jsx>{`
        .project-map-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          background: transparent; /* Parent Workspace handles the gradient */
          overflow: hidden;
        }

        .view-container {
          width: 100%;
          height: 100%;
        }

        /* Overlay UI Elements */
        .canvas-overlay-ui {
          position: absolute;
          z-index: 5;
          display: flex;
          gap: 10px;
          pointer-events: none;
        }

        .top-right { top: 20px; right: 20px; flex-direction: column; }
        .bottom-left { bottom: 20px; left: 20px; }

        .ui-group {
          display: flex;
          flex-direction: column;
          background: rgba(22, 27, 34, 0.7);
          backdrop-filter: blur(8px);
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 4px;
          pointer-events: auto;
        }

        .bottom-left .ui-group { flex-direction: row; }

        .ui-btn {
          background: none;
          border: none;
          color: #8b949e;
          padding: 8px;
          cursor: pointer;
          border-radius: 6px;
          transition: 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ui-btn:hover {
          color: #fff;
          background: #30363d;
        }

        .search-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(22, 27, 34, 0.8);
          backdrop-filter: blur(8px);
          border: 1px solid #30363d;
          border-radius: 20px;
          padding: 6px 15px;
          pointer-events: auto;
          width: 240px;
          transition: border-color 0.2s;
        }

        .search-pill:focus-within {
          border-color: #58a6ff;
        }

        .search-pill input {
          background: none;
          border: none;
          color: #c9d1d9;
          font-size: 0.8rem;
          width: 100%;
          outline: none;
        }

        .search-pill input::placeholder { color: #484f58; }

        /* Animation for view switching */
        .view-container {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ProjectMap;