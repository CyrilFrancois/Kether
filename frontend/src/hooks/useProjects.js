import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const useProjects = () => {
  const token = useAuthStore((state) => state.token);
  const { 
    setProjects,
    setProjectTree, 
    setLoading, 
    setError, 
    updateNodeLocally,
    activeProject
  } = useProjectStore();

  // Helper for authenticated headers
  const getAuthHeaders = () => ({
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // --- 1. FETCH ALL ROOT PROJECTS (LEVEL 1) ---
  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      // Endpoint updated to /projects (which filters for Level 1 in backend)
      const res = await axios.get(`${API_URL}/projects`, getAuthHeaders());
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch project list");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FETCH FULL RECURSIVE TREE ---
  const fetchProjectTree = async (projectId) => {
    const id = projectId || activeProject?.id;
    if (!id) return;

    setLoading(true);
    try {
      // Matches backend: /projects/tree/{project_id}
      const res = await axios.get(`${API_URL}/projects/tree/${id}`, getAuthHeaders());
      setProjectTree(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to sync Workspace tree.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CREATE NODE (Any Level 1-5) ---
  const addNode = async (nodeData) => {
    setLoading(true);
    try {
      // Matches backend: POST /projects
      const res = await axios.post(`${API_URL}/projects`, nodeData, getAuthHeaders());
      
      // If we are adding a child to the current view, refresh the tree
      await fetchProjectTree();
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create node.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. AI DECOMPOSITION (The Architect Trigger) ---
  const generateSubNodes = async (nodeId) => {
    setLoading(true);
    try {
      // Matches backend: POST /projects/{node_id}/ai-generate
      const res = await axios.post(`${API_URL}/projects/${nodeId}/ai-generate`, {}, getAuthHeaders());
      
      // The backend starts a background task or returns early. 
      // For immediate UI feedback, we re-fetch the tree to see new children.
      await fetchProjectTree();
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Architect failed to decompose node.");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE NODE (Smart Inspector Sync) ---
  const updateNode = async (nodeId, updates) => {
    // 1. Optimistic Update in Zustand (UI stays snappy)
    updateNodeLocally(nodeId, updates);

    try {
      // 2. Network Sync: PATCH /projects/{node_id}
      // Note: updates can contain 'metadata: { ... }' or 'status' or 'name'
      await axios.patch(`${API_URL}/projects/${nodeId}`, updates, getAuthHeaders());
    } catch (err) {
      console.error("Node sync failed:", err);
      setError("Sync failed. Changes may not be saved.");
      // Rollback logic would go here
    }
  };

  // --- 6. DELETE NODE (Recursive Cascade) ---
  const deleteNode = async (nodeId) => {
    if (!window.confirm("Are you sure? This will delete all sub-tasks and logic flows within this node.")) return;

    try {
      // Matches backend: DELETE /projects/{node_id}
      await axios.delete(`${API_URL}/projects/${nodeId}`, getAuthHeaders());
      
      // If we just deleted the root project, refresh the project list
      if (activeProject?.id === nodeId) {
        fetchAllProjects();
        setProjectTree(null);
      } else {
        await fetchProjectTree();
      }
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || "Deletion failed.");
      return false;
    }
  };

  return {
    fetchAllProjects,
    fetchProjectTree,
    addNode,
    generateSubNodes, // Renamed from decomposeNode for clarity
    updateNode,
    deleteNode
  };
};