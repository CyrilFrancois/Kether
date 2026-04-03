import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Helper: Find a node by ID anywhere in the nested tree
 */
const findNodeInTree = (node, id) => {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
  }
  return null;
};

const useProjectStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      projects: [],              // List of all Level 1 nodes (Sidebar)
      activeProject: null,       // The currently active L1 Project
      projectTree: null,         // The full recursive tree (L1 -> L5)
      
      // UI State
      viewMode: 'tree',          
      isInspectorOpen: false,    
      selectedNode: null,        // Focused node in the Inspector
      
      loading: false,
      error: null,

      // --- ACTIONS ---

      // Set the sidebar list
      setProjects: (projects) => set({ projects, error: null }),
      
      // Select a project and prepare workspace
      setActiveProject: (project) => set({ 
        activeProject: project, 
        projectTree: null,       // Clear old tree to force fresh load
        selectedNode: null,
        isInspectorOpen: false,
        error: null 
      }),

      // UI Controls
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedNode: (node) => set({ 
        selectedNode: node, 
        isInspectorOpen: !!node 
      }),
      
      setInspectorOpen: (isOpen) => set({ 
        isInspectorOpen: isOpen,
        // Keep selectedNode if opening, clear if closing
        selectedNode: isOpen ? get().selectedNode : null 
      }),

      // Tree Synchronization
      setProjectTree: (tree) => {
        const currentSelected = get().selectedNode;
        set({ 
          projectTree: tree, 
          loading: false,
          // Re-sync the selected node reference so the Inspector has the latest data
          selectedNode: currentSelected ? findNodeInTree(tree, currentSelected.id) : null
        });
      },

      // --- RECURSIVE ENGINE ---
      
      // Optimistic Update: Updates UI immediately while waiting for server
      updateNodeLocally: (nodeId, updates) => {
        const updateRecursive = (node) => {
          if (!node) return null;
          
          if (node.id === nodeId) {
            // Handle node_metadata merging specifically
            const updatedMetadata = updates.node_metadata 
              ? { ...node.node_metadata, ...updates.node_metadata } 
              : node.node_metadata;
              
            return { ...node, ...updates, node_metadata: updatedMetadata };
          }
          
          if (node.children && node.children.length > 0) {
            return { 
              ...node, 
              children: node.children.map(updateRecursive) 
            };
          }
          return node;
        };

        const currentTree = get().projectTree;
        if (currentTree) {
          const newTree = updateRecursive(currentTree);
          set({ 
            projectTree: newTree,
            // Sync Inspector if the edited node is the one open
            selectedNode: get().selectedNode?.id === nodeId 
              ? findNodeInTree(newTree, nodeId) 
              : get().selectedNode
          });
        }
      },

      // Utility Actions
      setLoading: (isLoading) => set({ loading: isLoading }),
      setError: (error) => set({ error, loading: false }),

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
      // Only persist essential UI state and current project selection
      partialize: (state) => ({ 
        activeProject: state.activeProject, 
        viewMode: state.viewMode 
      }),
    }
  )
);

export default useProjectStore;