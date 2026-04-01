import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectCard from '../components/workspace/ProjectCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Fully Expanded L1 Project DNA State
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    tech_stack: '',
    repo_url: '',
    priority: 'Medium',
    visibility: 'Private',
    color: '#3498db',
    ui_paradigm: 'Modern/Dark',
    io_schema: 'REST API'
  });

  const API_URL = 'http://localhost:8000/projects';

  const getAuthHeader = () => {
    const token = localStorage.getItem('token'); 
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL, getAuthHeader());
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      if (err.response?.status === 401) alert("Session expired. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, newProject, getAuthHeader());
      setShowModal(false);
      // Reset to original DNA template
      setNewProject({
        name: '', description: '', tech_stack: '', repo_url: '',
        priority: 'Medium', visibility: 'Private', color: '#3498db',
        ui_paradigm: 'Modern/Dark', io_schema: 'REST API'
      });
      fetchProjects(); 
    } catch (err) {
      console.error("Creation failed:", err);
      alert(err.response?.data?.detail || "Failed to deploy project DNA.");
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h2 style={{ margin: 0, color: '#fff' }}>System Architect Dashboard</h2>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Orchestrating Level 1 Project Blueprints</p>
        </div>
        <div className="stats-bar">
          <div className="stat-pill">Total Nodes: {projects.length}</div>
          <div className="stat-pill">System Status: Optimal</div>
        </div>
      </header>

      {loading ? (
        <div className="loader">INITIALIZING DATABASE SCAN...</div>
      ) : (
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onRefresh={fetchProjects} 
            />
          ))}

          <div className="project-card add-card" onClick={() => setShowModal(true)}>
            <span>+</span>
            <p>Deploy New Project DNA</p>
          </div>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Initialize L1 Blueprint</h3>
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <input type="text" placeholder="Project Name" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              
              <div className="form-group">
                <textarea placeholder="Global Intent & Prompting Directions" value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} />
              </div>

              <div className="form-row">
                <input type="text" placeholder="Tech Stack (Python, React...)" value={newProject.tech_stack} onChange={(e) => setNewProject({...newProject, tech_stack: e.target.value})} />
                <input type="text" placeholder="Repository URL" value={newProject.repo_url} onChange={(e) => setNewProject({...newProject, repo_url: e.target.value})} />
              </div>

              <div className="form-row">
                <input type="text" placeholder="UI Paradigm (Glassmorphism...)" value={newProject.ui_paradigm} onChange={(e) => setNewProject({...newProject, ui_paradigm: e.target.value})} />
                <input type="text" placeholder="I/O Schema (JSON API...)" value={newProject.io_schema} onChange={(e) => setNewProject({...newProject, io_schema: e.target.value})} />
              </div>

              <div className="form-row">
                <select value={newProject.priority} onChange={(e) => setNewProject({...newProject, priority: e.target.value})}>
                    <option value="Low">Priority: Low</option>
                    <option value="Medium">Priority: Medium</option>
                    <option value="High">Priority: High</option>
                </select>
                <select value={newProject.visibility} onChange={(e) => setNewProject({...newProject, visibility: e.target.value})}>
                    <option value="Private">Visibility: Private</option>
                    <option value="Team">Visibility: Team</option>
                </select>
              </div>

              <div className="color-picker">
                <label>System Accent Color</label>
                <input type="color" value={newProject.color} onChange={(e) => setNewProject({...newProject, color: e.target.value})} />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Abort</button>
                <button type="submit" className="submit-btn">Initialize Forge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .dashboard-container { animation: fadeIn 0.5s ease-out; padding: 40px; max-width: 1400px; margin: 0 auto; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid #222; padding-bottom: 20px; }
        .stats-bar { display: flex; gap: 15px; }
        .stat-pill { background: #0f1115; padding: 6px 18px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #333; color: #00d4ff; font-family: monospace; }

        .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
        
        /* The add-card remains here as it is a trigger, not a project representation */
        .add-card { 
          background: transparent; 
          border: 2px dashed #333; 
          border-radius: 12px;
          display: flex; 
          flex-direction: column;
          justify-content: center; 
          align-items: center; 
          cursor: pointer; 
          color: #444; 
          min-height: 280px; 
          transition: 0.3s;
        }
        .add-card span { font-size: 3rem; margin-bottom: 10px; }
        .add-card:hover { color: #00d4ff; border-color: #00d4ff; background: rgba(0, 212, 255, 0.02); }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.95); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(10px); }
        .modal-content { background: #111; padding: 40px; border-radius: 8px; border: 1px solid #333; width: 600px; box-shadow: 0 0 50px rgba(0,0,0,1); }
        .modal-content h3 { color: #fff; margin: 0 0 25px 0; font-family: 'Inter', sans-serif; letter-spacing: 1px; text-transform: uppercase; border-left: 4px solid #00d4ff; padding-left: 15px; }
        
        .form-group { margin-bottom: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
        
        input, textarea, select { width: 100%; background: #000; border: 1px solid #333; padding: 14px; border-radius: 4px; color: #fff; font-size: 0.9rem; outline: none; transition: 0.2s; font-family: inherit; }
        input:focus, textarea:focus, select:focus { border-color: #00d4ff; }
        
        .color-picker { display: flex; align-items: center; gap: 15px; margin: 20px 0; color: #888; font-size: 0.8rem; }
        .color-picker input { width: 60px; height: 30px; padding: 0; border: none; cursor: pointer; background: none; }

        .modal-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; }
        .modal-actions button { background: transparent; border: none; color: #666; cursor: pointer; padding: 10px 20px; font-weight: 600; text-transform: uppercase; font-size: 0.8rem; }
        .submit-btn { background: #00d4ff !important; color: #000 !important; border-radius: 4px !important; font-weight: 900 !important; }
        
        .loader { text-align: center; color: #00d4ff; margin-top: 150px; font-family: monospace; letter-spacing: 4px; }
      `}</style>
    </div>
  );
};

export default Dashboard;