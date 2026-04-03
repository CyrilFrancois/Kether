import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProjectStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      projects: [],              // List of all Level 1 projects for the sidebar
      activeProject: null,       // Currently selected Project (Level 1)
      projectTree: null,         // Recursive 5-layer nested data for the Canvas
      
      // Workspace UI State
      viewMode: 'tree',          // 'tree' (Horizontal DAG) or 'flower' (Radial)
      isInspectorOpen: false,    // Toggle for the right-side slide-out panel
      selectedNode: null,        // The specific node (Level 1-5) currently in focus
      
      loading: false,
      error: null,

      // --- ACTIONS ---

      // Project Management
      setProjects: (projects) => set({ projects }),
      
      setActiveProject: (project) => set({ 
        activeProject: project, 
        projectTree: null, // Clear tree to trigger a fresh fetch for the new project
        selectedNode: null,
        isInspectorOpen: false,
        error: null 
      }),

      // Workspace UI Controls
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedNode: (node) => set({ 
        selectedNode: node, 
        isInspectorOpen: !!node // Auto-open inspector if a node is selected
      }),
      
      setInspectorOpen: (isOpen) => set({ 
        isInspectorOpen: isOpen,
        selectedNode: isOpen ? get().selectedNode : null // Clear node if closing
      }),

      // Tree Synchronization
      // Receives the full recursive 5-layer object from /api/projects/{id}/tree
      setProjectTree: (tree) => set({ projectTree: tree, loading: false }),

      // Optimistic Node Update
      // Allows updating a single node deep in the tree without a full refresh
      updateNodeLocally: (nodeId, updates) => {
        const updateRecursive = (node) => {
          if (node.id === nodeId) return { ...node, ...updates };
          if (node.children) {
            return { ...node, children: node.children.map(updateRecursive) };
          }
          return node;
        };

        const currentTree = get().projectTree;
        if (currentTree) {
          set({ projectTree: updateRecursive(currentTree) });
        }
      },

      // Utility Actions
      setLoading: (isLoading) => set({ loading: isLoading }),
      setError: (error) => set({ error, loading: false }),

      // Reset on Logout
      resetProjectStore: () => set({
        projects: [],
        activeProject: null,
        projectTree: null,
        selectedNode: null,
        viewMode: 'tree',
        isInspectorOpen: false,
        error: null,
        loading: false
      })
    }),
    {
      name: 'kether-workspace-storage',
      // We persist activeProject and viewMode so the user returns exactly where they left off
      partialize: (state) => ({ 
        activeProject: state.activeProject, 
        viewMode: state.viewMode 
      }),
    }
  )
);

export default useProjectStore;