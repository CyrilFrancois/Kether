import React from 'react';
import useProjectStore from '../../store/projectStore';
import { 
  Box, 
  User, 
  Activity, 
  Terminal, 
  ChevronRight, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';

const ProjectMap = () => {
  const { projectTree } = useProjectStore();

  if (!projectTree) return null;

  // Helper to calculate progress percentage for a functionality
  const calculateProgress = (functionality) => {
    const allTechTasks = functionality.functional_tasks.flatMap(ft => ft.technical_tasks);
    if (allTechTasks.length === 0) return 0;
    const doneTasks = allTechTasks.filter(t => t.status === 'done').length;
    return Math.round((doneTasks / allTechTasks.length) * 100);
  };

  return (
    <div className="map-scroll-container">
      <div className="tree-columns">
        
        {/* --- LAYER 1: PROJECT ROOT --- */}
        <div className="column">
          <label className="column-label">Project Root</label>
          <div className="node-card project-root">
            <div className="node-header">
              <Box size={16} className="text-primary" />
              <h3>{projectTree.name}</h3>
            </div>
            <p>{projectTree.description}</p>
            <div className="dna-tags">
              <span className="tag">{projectTree.tech_stack}</span>
              <span className="tag">{projectTree.architecture_pattern}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="connector" />

        {/* --- LAYER 2: FUNCTIONALITIES --- */}
        <div className="column">
          <label className="column-label">Functionalities (User Story)</label>
          {projectTree.functionalities?.map(func => (
            <div key={func.id} className="node-card functionality">
              <div className="node-header">
                <User size={14} />
                <h4>{func.title}</h4>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${calculateProgress(func)}%` }}
                ></div>
              </div>
              <span className="meta">{calculateProgress(func)}% Complete</span>
            </div>
          ))}
          <button className="add-node-btn">+ Add Intent</button>
        </div>

        <ChevronRight className="connector" />

        {/* --- LAYER 3: FUNCTIONAL TASKS --- */}
        <div className="column">
          <label className="column-label">Logic Flows (UX)</label>
          {projectTree.functionalities?.flatMap(f => f.functional_tasks).map(ft => (
            <div key={ft.id} className="node-card functional-task">
              <div className="node-header">
                <Activity size={14} />
                <h4>{ft.task_name}</h4>
              </div>
              <code className="flow-code">{ft.logic_flow || "No logic defined"}</code>
            </div>
          ))}
        </div>

        <ChevronRight className="connector" />

        {/* --- LAYER 4: TECHNICAL TASKS --- */}
        <div className="column">
          <label className="column-label">Technical Units (Execution)</label>
          {projectTree.functionalities?.flatMap(f => 
            f.functional_tasks.flatMap(ft => ft.technical_tasks)
          ).map(tt => (
            <div key={tt.id} className={`node-card tech-task ${tt.status}`}>
              <div className="node-header">
                {tt.status === 'done' ? <CheckCircle2 size={14} color="#238636" /> : <Circle size={14} />}
                <h4>{tt.title}</h4>
              </div>
              <div className="tech-meta">
                <span>Complexity: {tt.complexity}</span>
                <span className={`status-badge ${tt.status}`}>{tt.status}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .map-scroll-container {
          width: 100%;
          height: 100%;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 20px 0;
          scrollbar-width: thin;
        }

        .tree-columns {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          min-width: max-content;
          height: 100%;
        }

        .column {
          width: 280px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .column-label {
          font-size: 0.7rem;
          color: #8b949e;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          padding-left: 5px;
        }

        .connector { color: #30363d; align-self: center; margin-top: 20px; }

        .node-card {
          background: #161b22;
          border: 1px solid #30363d;
          border-radius: 8px;
          padding: 12px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .node-card:hover { border-color: #58a6ff; transform: translateY(-2px); }

        .node-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .node-header h3, .node-header h4 { margin: 0; font-size: 0.9rem; color: #f0f6fc; }
        
        .node-card p { font-size: 0.8rem; color: #8b949e; margin: 0 0 10px 0; }

        /* Progress Bar */
        .progress-bar { height: 4px; background: #30363d; border-radius: 2px; margin: 8px 0; overflow: hidden; }
        .progress-fill { height: 100%; background: #238636; transition: width 0.5s ease-out; }

        .meta, .tech-meta { font-size: 0.7rem; color: #8b949e; display: flex; justify-content: space-between; }

        .dna-tags { display: flex; gap: 5px; margin-top: 10px; }
        .tag { font-size: 0.65rem; background: #0d1117; padding: 2px 6px; border-radius: 4px; border: 1px solid #30363d; }

        .flow-code { font-family: 'Fira Code', monospace; font-size: 0.7rem; color: #d2a8ff; background: #0d1117; padding: 4px; border-radius: 4px; display: block; }

        /* Status colors */
        .tech-task.done { border-left: 4px solid #238636; }
        .status-badge { text-transform: uppercase; font-weight: bold; }
        .status-badge.done { color: #238636; }
        .status-badge.todo { color: #8b949e; }

        .add-node-btn {
          background: none; border: 1px dashed #30363d; color: #484f58;
          padding: 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;
          transition: 0.2s;
        }
        .add-node-btn:hover { border-color: #8b949e; color: #8b949e; }
      `}</style>
    </div>
  );
};

export default ProjectMap;