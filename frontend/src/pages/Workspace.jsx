import React, { useState, useEffect } from 'react';
import { Layers, CheckSquare, Code, ChevronRight, Play, Settings } from 'lucide-react';

/**
 * Workspace Page: The 4-Layer Orchestration View
 * Role: Transitioning from high-level Functionalities to Technical execution.
 */
const Workspace = () => {
  const [activeLayer, setActiveLayer] = useState(1); // 1: Project, 2: Functionality, 3: Task, 4: Tech
  const [data, setData] = useState({
    name: "Kether Core v1",
    functionalities: [
      { 
        id: 101, 
        name: "Autonomous Task Decomposition", 
        tasks: [
          { id: 201, name: "LLM Prompt Engineering", status: "Done", tech_tasks: 3 },
          { id: 202, name: "Recursive Loop Protection", status: "In Progress", tech_tasks: 5 }
        ] 
      },
      { id: 102, name: "Toolsmith Engine", tasks: [] }
    ]
  });

  return (
    <div className="workspace-container">
      <header className="workspace-header">
        <div className="project-info">
          <h1>{data.name}</h1>
          <span className="breadcrumb">Production / System / {data.name}</span>
        </div>
        <div className="layer-navigator">
          {[1, 2, 3, 4].map(l => (
            <button 
              key={l} 
              className={activeLayer === l ? 'active' : ''} 
              onClick={() => setActiveLayer(l)}
            >
              Layer {l}
            </button>
          ))}
        </div>
      </header>

      <div className="workspace-grid">
        {/* Left Column: The Functionality Tree (L2) */}
        <aside className="functionality-tree">
          <div className="section-title"><Layers size={16} /> Functionalities</div>
          {data.functionalities.map(func => (
            <div key={func.id} className="tree-node">
              <ChevronRight size={14} /> {func.name}
            </div>
          ))}
          <button className="ghost-btn">+ New Functionality</button>
        </aside>

        {/* Center: The Task Kanban (L3) */}
        <main className="task-board">
          <div className="section-title"><CheckSquare size={16} /> Functional Tasks</div>
          <div className="kanban-columns">
            {['To Do', 'In Progress', 'Validation'].map(col => (
              <div key={col} className="kanban-col">
                <label>{col}</label>
                {data.functionalities[0].tasks.filter(t => t.status === col || (col === 'To Do' && !t.status)).map(task => (
                  <div key={task.id} className="task-card">
                    <h4>{task.name}</h4>
                    <div className="task-meta">
                      <span><Code size={12} /> {task.tech_tasks} Tech Tasks</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>

        {/* Right: The Live Agent Stream (L4) */}
        <section className="agent-stream">
          <div className="section-title"><Play size={16} /> Live Agent Pulse</div>
          <div className="log-container">
            <div className="log-entry">
              <span className="timestamp">14:02</span>
              <span className="agent">Toolsmith:</span> Generating `test_recursion.py`...
            </div>
            <div className="log-entry active">
              <span className="timestamp">14:03</span>
              <span className="agent">Orchestrator:</span> Validating Technical Task #402...
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .workspace-container { display: flex; flex-direction: column; height: 100%; animation: fadeIn 0.3s ease-in; }
        .workspace-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid #333; margin-bottom: 20px; }
        .project-info h1 { margin: 0; font-size: 1.4rem; color: #fff; }
        .breadcrumb { font-size: 0.7rem; color: #666; text-transform: uppercase; }

        .layer-navigator { display: flex; background: #1a1d23; border-radius: 6px; padding: 4px; }
        .layer-navigator button { background: none; border: none; color: #666; padding: 5px 15px; cursor: pointer; border-radius: 4px; font-size: 0.8rem; }
        .layer-navigator button.active { background: #3498db; color: #fff; }

        .workspace-grid { display: grid; grid-template-columns: 250px 1fr 300px; gap: 20px; flex: 1; min-height: 0; }
        .section-title { font-size: 0.75rem; color: #888; text-transform: uppercase; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }

        /* Tree */
        .functionality-tree { background: #1a1d23; padding: 15px; border-radius: 8px; border: 1px solid #333; }
        .tree-node { font-size: 0.85rem; padding: 8px; color: #ddd; cursor: pointer; display: flex; align-items: center; gap: 5px; border-radius: 4px; }
        .tree-node:hover { background: #252a33; color: #3498db; }
        .ghost-btn { width: 100%; background: none; border: 1px dashed #333; color: #444; margin-top: 10px; padding: 8px; cursor: pointer; border-radius: 4px; font-size: 0.8rem; }

        /* Kanban */
        .kanban-columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; height: 100%; }
        .kanban-col label { font-size: 0.7rem; color: #555; font-weight: bold; margin-bottom: 10px; display: block; }
        .task-card { background: #1a1d23; border: 1px solid #333; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-top: 3px solid #3498db; }
        .task-card h4 { margin: 0 0 10px 0; font-size: 0.9rem; color: #eee; }
        .task-meta { font-size: 0.7rem; color: #666; }

        /* Logs */
        .agent-stream { background: #0b0d11; padding: 15px; border-radius: 8px; border: 1px solid #333; display: flex; flex-direction: column; }
        .log-container { font-family: 'Fira Code', monospace; font-size: 0.75rem; color: #888; flex: 1; overflow-y: auto; }
        .log-entry { margin-bottom: 8px; line-height: 1.4; }
        .log-entry.active { color: #3498db; }
        .timestamp { color: #444; margin-right: 8px; }
        .agent { font-weight: bold; color: #555; }
      `}</style>
    </div>
  );
};

export default Workspace;