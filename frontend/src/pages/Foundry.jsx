import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Hammer, Terminal, Play, ShieldCheck, Cpu } from 'lucide-react';

/**
 * The Foundry: The AI Tool Laboratory
 * Role: Managing AI-generated Python tools and monitoring the Toolsmith Agent.
 */
const Foundry = () => {
  const [tools, setTools] = useState([]);
  const [activeTool, setActiveTool] = useState(null);
  const [isBuilding, setIsBuilding] = useState(false);

  // In a real scenario, this would fetch from /foundry/library
  useEffect(() => {
    setTools([
      { id: 1, name: 'WebScraper.py', version: '1.2.0', status: 'verified', coverage: '94%' },
      { id: 2, name: 'GitManager.py', version: '0.9.5', status: 'pending', coverage: '88%' },
      { id: 3, name: 'FileOptimizer.py', version: '2.1.0', status: 'verified', coverage: '100%' },
    ]);
  }, []);

  return (
    <div className="foundry-container">
      <header className="foundry-header">
        <div className="title-group">
          <Hammer size={24} color="#f1c40f" />
          <h2>The Foundry</h2>
        </div>
        <button className="build-btn" onClick={() => setIsBuilding(true)}>
          <Cpu size={16} /> Summon Toolsmith
        </button>
      </header>

      <div className="foundry-layout">
        {/* Tool Library Sidebar */}
        <aside className="tool-sidebar">
          <h3>Tool Library</h3>
          <div className="tool-list">
            {tools.map(tool => (
              <div 
                key={tool.id} 
                className={`tool-item ${activeTool?.id === tool.id ? 'active' : ''}`}
                onClick={() => setActiveTool(tool)}
              >
                <div className="tool-info">
                  <span className="tool-name">{tool.name}</span>
                  <span className="tool-version">v{tool.version}</span>
                </div>
                <span className={`status-tag ${tool.status}`}>{tool.status}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Lab Area */}
        <section className="lab-main">
          {activeTool ? (
            <div className="tool-details">
              <div className="tool-meta">
                <h3>{activeTool.name}</h3>
                <div className="badge-row">
                  <span className="badge"><ShieldCheck size={14} /> Security Scanned</span>
                  <span className="badge"><Terminal size={14} /> Python 3.11</span>
                </div>
              </div>

              <div className="code-sandbox">
                <div className="sandbox-header">
                  <span>Execution Sandbox</span>
                  <button className="run-btn"><Play size={14} /> Run Test</button>
                </div>
                <pre className="code-block">
                  {`# AI Generated Code Logic\ndef execute_task(input_data):\n    # Tool logic for ${activeTool.name} here...\n    return "Success"`}
                </pre>
              </div>

              <div className="validation-panel">
                <h4>Validation Required</h4>
                <p>Verify this tool's output before promoting to Global Library.</p>
                <div className="action-row">
                  <button className="approve">Approve & Sign</button>
                  <button className="reject">Discard</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-lab">
              <Terminal size={48} color="#333" />
              <p>Select a tool from the library or summon the Toolsmith to generate a new capability.</p>
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .foundry-container { animation: slideUp 0.4s ease-out; height: 100%; display: flex; flex-direction: column; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

        .foundry-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .title-group { display: flex; align-items: center; gap: 12px; }
        .build-btn { background: #f1c40f; color: #000; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; }

        .foundry-layout { display: grid; grid-template-columns: 250px 1fr; gap: 20px; flex: 1; min-height: 0; }
        
        .tool-sidebar { background: #1a1d23; border: 1px solid #333; border-radius: 8px; padding: 15px; overflow-y: auto; }
        .tool-sidebar h3 { font-size: 0.9rem; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; }
        .tool-item { padding: 10px; border-radius: 6px; cursor: pointer; border: 1px solid transparent; margin-bottom: 8px; transition: 0.2s; }
        .tool-item:hover { background: #252a33; }
        .tool-item.active { background: #252a33; border-color: #f1c40f; }
        .tool-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
        .tool-name { font-size: 0.85rem; color: #fff; }
        .tool-version { font-size: 0.7rem; color: #555; }
        .status-tag { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
        .status-tag.verified { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
        .status-tag.pending { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }

        .lab-main { background: #1a1d23; border: 1px solid #333; border-radius: 8px; overflow-y: auto; position: relative; }
        .empty-lab { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #444; text-align: center; padding: 40px; }
        
        .tool-details { padding: 30px; }
        .tool-meta h3 { font-size: 1.5rem; margin-bottom: 10px; }
        .badge-row { display: flex; gap: 10px; margin-bottom: 20px; }
        .badge { font-size: 0.7rem; background: #0f1115; padding: 4px 10px; border-radius: 4px; color: #888; display: flex; align-items: center; gap: 6px; }

        .code-sandbox { background: #0f1115; border-radius: 8px; border: 1px solid #333; margin-bottom: 25px; }
        .sandbox-header { padding: 10px 15px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #666; }
        .code-block { padding: 20px; color: #2ecc71; font-family: 'Fira Code', monospace; font-size: 0.85rem; margin: 0; }
        .run-btn { background: #333; color: #fff; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.7rem; display: flex; align-items: center; gap: 4px; }

        .validation-panel { background: rgba(52, 152, 219, 0.1); border: 1px solid #3498db; padding: 20px; border-radius: 8px; }
        .validation-panel h4 { margin: 0 0 5px 0; color: #3498db; }
        .validation-panel p { margin: 0 0 15px 0; font-size: 0.8rem; color: #888; }
        .action-row { display: flex; gap: 10px; }
        .approve { background: #3498db; border: none; color: #fff; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .reject { background: transparent; border: 1px solid #e74c3c; color: #e74c3c; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
      `}</style>
    </div>
  );
};

export default Foundry;