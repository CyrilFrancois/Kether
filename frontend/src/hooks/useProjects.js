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
    updateNodeLocally 
  } = useProjectStore();

  // Helper for authenticated headers
  const getAuthHeaders = () => ({
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // --- 1. FETCH ALL PROJECTS (LEVEL 1) ---
  const fetchAllProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/projects/`, getAuthHeaders());
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch projects");
    } finally {
      setLoading(false);
    }
  };

  // --- 2. FETCH FULL RECURSIVE TREE ---
  const fetchProjectTree = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/projects/${projectId}/tree`, getAuthHeaders());
      setProjectTree(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to sync Workspace tree.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CREATE/ADD NODE (Any Level 1-5) ---
  const addNode = async (nodeData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/projects/nodes`, nodeData, getAuthHeaders());
      // Re-fetch tree to ensure all connections and IDs are correct
      if (nodeData.parentId || nodeData.projectId) {
        await fetchProjectTree(nodeData.projectId || nodeData.parentId);
      }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create node.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. AI DECOMPOSITION (The Magic Wand) ---
  // Tells the AI to generate the next level of children for a specific node
  const decomposeNode = async (nodeId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/projects/nodes/${nodeId}/decompose`, {}, getAuthHeaders());
      
      // Update tree with newly generated children
      // The backend returns the updated node with its new children
      updateNodeLocally(nodeId, { children: res.data.children });
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "AI decomposition failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE NODE ATTRIBUTES ---
  const updateNode = async (nodeId, updates) => {
    // Optimistic Update
    updateNodeLocally(nodeId, updates);

    try {
      await axios.patch(`${API_URL}/api/projects/nodes/${nodeId}`, updates, getAuthHeaders());
    } catch (err) {
      console.error("Node sync failed:", err);
      // In a production app, you'd rollback the optimistic update here
    }
  };

  // --- 6. DELETE NODE (CASCADE) ---
  const deleteNode = async (nodeId, projectId) => {
    try {
      await axios.delete(`${API_URL}/api/projects/nodes/${nodeId}`, getAuthHeaders());
      await fetchProjectTree(projectId);
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
    decomposeNode,
    updateNode,
    deleteNode
  };
};