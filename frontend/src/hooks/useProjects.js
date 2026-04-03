import { useCallback } from 'react';
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
    activeProject,
    setActiveProject
  } = useProjectStore();

  // Helper for authenticated headers
  const getAuthHeaders = useCallback(() => ({
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }), [token]);

  // --- 1. FETCH ALL ROOT PROJECTS (LEVEL 1) ---
  const fetchAllProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/projects`, getAuthHeaders());
      setProjects(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch project list");
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, setLoading, setProjects, setError]);

  // --- 2. FETCH FULL RECURSIVE TREE ---
  const fetchProjectTree = useCallback(async (projectId) => {
    const id = projectId || activeProject?.id;
    if (!id) return;

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/projects/tree/${id}`, getAuthHeaders());
      setProjectTree(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to sync project structure.");
    } finally {
      setLoading(false);
    }
  }, [activeProject?.id, getAuthHeaders, setLoading, setProjectTree, setError]);

  // --- 3. CREATE PROJECT OR SUB-NODE ---
  const addNode = async (nodeData) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/projects`, nodeData, getAuthHeaders());
      
      const newNode = res.data;

      // SYNC LOGIC:
      if (newNode.level === 1) {
        // If it's a root project, refresh the sidebar list and select it
        await fetchAllProjects();
        setActiveProject(newNode);
      } else {
        // If it's a sub-node (Task, Logic, etc), refresh the current tree view
        await fetchProjectTree();
      }
      
      return newNode;
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create project node.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 4. AI-ASSISTED PROJECT DECOMPOSITION ---
  const generateSubNodes = async (nodeId) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/projects/${nodeId}/ai-generate`, {}, getAuthHeaders());
      
      // Re-fetch the tree to show the AI-generated tasks
      await fetchProjectTree();
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.detail || "AI Assistant failed to decompose project.");
    } finally {
      setLoading(false);
    }
  };

  // --- 5. UPDATE PROJECT/NODE (Sync with Smart Inspector) ---
  const updateNode = async (nodeId, updates) => {
    // Optimistic UI update
    updateNodeLocally(nodeId, updates);

    try {
      await axios.patch(`${API_URL}/projects/${nodeId}`, updates, getAuthHeaders());
      
      // If we updated the name of a Level 1 project, refresh the sidebar list
      if (updates.name && activeProject?.id === nodeId && activeProject.level === 1) {
        fetchAllProjects();
      }
    } catch (err) {
      console.error("Project sync failed:", err);
      setError("Sync failed. Changes may not be saved.");
    }
  };

  // --- 6. DELETE PROJECT/NODE ---
  const deleteNode = async (nodeId) => {
    if (!window.confirm("Delete this item and all its nested sub-tasks?")) return;

    try {
      await axios.delete(`${API_URL}/projects/${nodeId}`, getAuthHeaders());
      
      if (activeProject?.id === nodeId) {
        // If we deleted the project we are currently looking at
        setActiveProject(null);
        setProjectTree(null);
        await fetchAllProjects();
      } else {
        // If we deleted a sub-task, just refresh the tree
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
    generateSubNodes,
    updateNode,
    deleteNode
  };
};