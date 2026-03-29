import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Dashboard Overview
 * Role: High-level summary of all L1 Projects.
 */
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // In the next step, we'll create this endpoint in the FastAPI backend
        const res = await axios.get('http://localhost:8000/projects');
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Project Overview</h2>
        <div className="stats-bar">
          <div className="stat-pill">Active Projects: {projects.length}</div>
          <div className="stat-pill">Agents Online: 3</div>
        </div>
      </header>

      {loading ? (
        <div className="loader">Scanning Database...</div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card" style={{ borderLeftColor: project.color }}>
              <div className="card-content">
                <h3>{project.name}</h3>
                <p>{project.description || 'No description provided.'}</p>
                
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Advancement</span>
                    <span>{project.progress || 0}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${project.progress || 0}%`, background: project.color }}></div>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <button className="enter-btn">Open Workspace</button>
              </div>
            </div>
          ))}

          {/* New Project Placeholder */}
          <div className="project-card add-card">
            <span>+</span>
            <p>Deploy New Project</p>
          </div>
        </div>
      )}

      <style jsx>{`
        .dashboard-container { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .stats-bar { display: flex; gap: 15px; }
        .stat-pill { background: #1a1d23; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; border: 1px solid #333; color: #888; }

        .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        
        .project-card { 
          background: #1a1d23; 
          border-radius: 12px; 
          border: 1px solid #333; 
          border-left: 6px solid #3498db;
          display: flex;
          flex-direction: column;
          transition: 0.3s;
        }
        .project-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.3); border-color: #444; }
        
        .card-content { padding: 20px; flex-grow: 1; }
        .card-content h3 { margin: 0 0 10px 0; color: #fff; }
        .card-content p { color: #888; font-size: 0.85rem; line-height: 1.4; }

        .progress-container { margin-top: 20px; }
        .progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; color: #666; margin-bottom: 5px; }
        .progress-bar { background: #0f1115; height: 6px; border-radius: 3px; overflow: hidden; }
        .progress-fill { height: 100%; transition: width 1s ease-in-out; }

        .card-footer { padding: 15px 20px; border-top: 1px solid #333; background: #1c2027; border-radius: 0 0 12px 12px; }
        .enter-btn { background: none; border: 1px solid #444; color: #fff; padding: 5px 15px; border-radius: 4px; cursor: pointer; font-size: 0.8rem; }
        .enter-btn:hover { background: #fff; color: #000; }

        .add-card { border-style: dashed; justify-content: center; align-items: center; cursor: pointer; color: #444; min-height: 200px; }
        .add-card span { font-size: 3rem; }
        .add-card:hover { color: #3498db; border-color: #3498db; }
        
        .loader { text-align: center; color: #666; margin-top: 100px; }
      `}</style>
    </div>
  );
};

export default Dashboard;