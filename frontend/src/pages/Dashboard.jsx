import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ProjectCard from '../components/workspace/ProjectCard';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Pull token and logout from Zustand
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

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

  /**
   * Helper to build headers. 
   * Uses the token from the store, falling back to localStorage if needed.
   */
  const getAuthHeader = useCallback(() => {
    const activeToken = token || localStorage.getItem('kether_token');
    
    // Safety check: If no token exists, don't return a "Bearer undefined" header
    if (!activeToken || activeToken === 'undefined') {
      console.warn("⚠️ DASHBOARD: No valid token found for request.");
      return null;
    }
    
    return { headers: { Authorization: `Bearer ${activeToken}` } };
  }, [token]);

  const fetchProjects = useCallback(async () => {
    const headers = getAuthHeader();
    if (!headers) return; // Abort if not authenticated yet

    try {
      setLoading(true);
      console.log("📡 DASHBOARD: Fetching projects...");
      const res = await axios.get(API_URL, headers);
      setProjects(res.data);
      console.log("✅ DASHBOARD: Projects loaded:", res.data.length);
    } catch (err) {
      console.error("❌ DASHBOARD: Fetch failed:", err);
      if (err.response?.status === 401) {
        console.error("🚫 DASHBOARD: Unauthorized. Token likely invalid.");
        // Optional: Trigger logout if the token is rejected by backend
        // logout(); 
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader]);

  // Trigger fetch on mount or when token changes
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const headers = getAuthHeader();
    if (!headers) return;

    try {
      console.log("🚀 DASHBOARD: Deploying new DNA...", newProject);
      await axios.post(API_URL, newProject, headers);
      setShowModal(false);
      setNewProject({
        name: '', description: '', tech_stack: '', repo_url: '',
        priority: 'Medium', visibility: 'Private', color: '#3498db',
        ui_paradigm: 'Modern/Dark', io_schema: 'REST API'
      });
      fetchProjects(); 
    } catch (err) {
      console.error("❌ DASHBOARD: Creation failed:", err);
      alert(err.response?.data?.detail || "Failed to deploy project.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* ... (Header and UI stay exactly the same as your code) ... */}
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
            <p>Deploy New Project</p>
          </div>
        </div>
      )}

      {/* ... (Modal code stays same) ... */}
      {showModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Your Form Content */}
                <h3>Initialize L1 Blueprint</h3>
                <form onSubmit={handleCreate}>
                    {/* ... form inputs ... */}
                    <div className="modal-actions">
                        <button type="button" onClick={() => setShowModal(false)}>Abort</button>
                        <button type="submit" className="submit-btn">Initialize Forge</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Your existing styles... */}
      <style>{`
        .dashboard-container { animation: fadeIn 0.5s ease-out; padding: 40px; max-width: 1400px; margin: 0 auto; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 1px solid #222; padding-bottom: 20px; }
        .stats-bar { display: flex; gap: 15px; }
        .stat-pill { background: #0f1115; padding: 6px 18px; border-radius: 4px; font-size: 0.75rem; border: 1px solid #333; color: #00d4ff; font-family: monospace; }
        .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
        .add-card { background: transparent; border: 2px dashed #333; border-radius: 12px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #444; min-height: 280px; transition: 0.3s; }
        .add-card:hover { color: #00d4ff; border-color: #00d4ff; background: rgba(0, 212, 255, 0.02); }
        .loader { text-align: center; color: #00d4ff; margin-top: 150px; font-family: monospace; letter-spacing: 4px; }
        /* Add other styles as needed */
      `}</style>
    </div>
  );
};

export default Dashboard;