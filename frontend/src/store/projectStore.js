import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProjectStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      projects: [],              // List of all projects for the sidebar/dashboard
      activeProject: null,       // The currently selected Project object
      projectTree: null,         // Nested 4-layer data for the Map View
      backlogTasks: [],          // Flattened TechnicalTasks for the Jira View
      viewMode: 'map',           // Toggle state: 'map' or 'backlog'
      loading: false,
      error: null,

      // --- ACTIONS ---

      // Set the active project and reset view-specific data
      setActiveProject: (project) => set({ activeProject: project, error: null }),

      // Toggle between Map and Backlog views
      setViewMode: (mode) => set({ viewMode: mode }),

      // Sync the full recursive tree (from /projects/tree/{id})
      setProjectTree: (tree) => set({ projectTree: tree }),

      // Sync the flattened backlog (from /projects/backlog/{id})
      setBacklogTasks: (tasks) => set({ backlogTasks: tasks }),

      // Update a single task locally (optimistic UI update)
      updateTaskLocally: (taskId, updates) => {
        const currentBacklog = get().backlogTasks;
        const updatedBacklog = currentBacklog.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        set({ backlogTasks: updatedBacklog });
      },

      // Error handling
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ loading: isLoading }),

      // Clear everything (useful on logout)
      resetProjectStore: () => set({
        projects: [],
        activeProject: null,
        projectTree: null,
        backlogTasks: [],
        viewMode: 'map',
        error: null
      })
    }),
    {
      name: 'kether-project-storage', // Persist active project ID in localStorage
      partialize: (state) => ({ activeProject: state.activeProject, viewMode: state.viewMode }),
    }
  )
);

export default useProjectStore;