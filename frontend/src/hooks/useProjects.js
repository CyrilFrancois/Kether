import useProjectStore from '../store/projectStore';
import useAuthStore from '../store/authStore';

export const useProjects = () => {
  const token = useAuthStore((state) => state.token);
  const { 
    setProjectTree, 
    setBacklogTasks, 
    setLoading, 
    setError, 
    updateTaskLocally 
  } = useProjectStore();

  // --- 1. FETCH FULL PROJECT DATA ---
  // We fetch both views to keep the Workspace toggle seamless
  const fetchProjectDetails = async (projectId) => {
    if (!projectId) return;
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Parallel fetching for performance
      const [treeRes, backlogRes] = await Promise.all([
        fetch(`/api/projects/tree/${projectId}`, { headers }),
        fetch(`/api/projects/backlog/${projectId}`, { headers })
      ]);

      if (!treeRes.ok || !backlogRes.ok) throw new Error("Failed to sync Kether data.");

      const treeData = await treeRes.json();
      const backlogData = await backlogRes.json();

      setProjectTree(treeData);
      setBacklogTasks(backlogData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CREATE NEW PROJECT ---
  const createProject = async (projectData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) throw new Error("Could not initialize Project in core.");
      return await response.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // --- 3. UPDATE TASK STATUS ---
  // Useful for the Backlog view "Status" dropdown
  const updateTaskStatus = async (taskId, newStatus) => {
    // Optimistic Update: Change UI immediately
    updateTaskLocally(taskId, { status: newStatus });

    try {
      const response = await fetch(`/api/projects/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Status sync failed.");
    } catch (err) {
      console.error("Task update error:", err);
      // Optional: Rollback logic if server fails
    }
  };

  // --- 4. DELETE PROJECT (CASCADE) ---
  const deleteProject = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.ok;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    fetchProjectDetails,
    createProject,
    updateTaskStatus,
    deleteProject
  };
};