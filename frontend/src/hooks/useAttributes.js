import { useState, useCallback } from 'react';
import axios from 'axios';
import useProjectStore from '../store/projectStore';

/**
 * Configure Axios instance for Attribute Management.
 * Uses the environment-defined base URL or defaults to localhost.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Attach JWT token from local storage for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pm_app_token'); // Updated key to stay professional
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Custom hook to manage project-specific attributes and domain-based suggestions.
 */
export const useAttributes = () => {
  const { 
    updateNodeLocally, 
    setSuggestions, 
    suggestions,
    setError 
  } = useProjectStore();

  const [loading, setLoading] = useState(false);

  /**
   * Fetches suggested fields (e.g., Budget, Tech Stack) based on project domain.
   */
  const fetchSuggestions = useCallback(async (domain) => {
    if (!domain) return;
    setLoading(true);
    try {
      // Matches the backend router: @router.get("/suggestions")
      const response = await api.get(`/api/attributes/suggestions`, {
        params: { domain }
      });
      setSuggestions(response.data);
    } catch (err) {
      console.error("Failed to fetch attribute suggestions:", err);
      setError("Unable to load recommended fields for this domain.");
    } finally {
      setLoading(false);
    }
  }, [setSuggestions, setError]);

  /**
   * Persists a new custom attribute to the backend and updates local tree state.
   */
  const addAttribute = async (nodeId, attributeData) => {
    try {
      // payload matches AttributeCreate schema
      const response = await api.post('/api/attributes', {
        ...attributeData,
        project_id: nodeId
      });

      const currentNode = useProjectStore.getState().selectedNode;
      const currentAttrs = currentNode?.attributes || [];
      
      // Update the local store immediately to reflect changes in the UI
      updateNodeLocally(nodeId, {
        attributes: [...currentAttrs, response.data]
      });

      return response.data;
    } catch (err) {
      setError("Failed to create new attribute.");
      throw err;
    }
  };

  /**
   * Updates an existing attribute (key or value) on the server and locally.
   */
  const updateAttribute = async (nodeId, attributeId, updates) => {
    try {
      const response = await api.patch(`/api/attributes/${attributeId}`, updates);
      
      const currentNode = useProjectStore.getState().selectedNode;
      if (currentNode && currentNode.id === nodeId) {
        const newAttrs = (currentNode.attributes || []).map(attr => 
          attr.id === attributeId ? response.data : attr
        );
        updateNodeLocally(nodeId, { attributes: newAttrs });
      }
    } catch (err) {
      setError("Failed to synchronize attribute update.");
    }
  };

  /**
   * Removes an attribute from a node permanently.
   */
  const removeAttribute = async (nodeId, attributeId) => {
    try {
      await api.delete(`/api/attributes/${attributeId}`);
      
      const currentNode = useProjectStore.getState().selectedNode;
      if (currentNode && currentNode.id === nodeId) {
        const newAttrs = (currentNode.attributes || []).filter(attr => attr.id !== attributeId);
        updateNodeLocally(nodeId, { attributes: newAttrs });
      }
    } catch (err) {
      setError("Failed to remove attribute.");
    }
  };

  return {
    suggestions,
    loading,
    fetchSuggestions,
    addAttribute,
    updateAttribute,
    removeAttribute
  };
};

export default useAttributes;