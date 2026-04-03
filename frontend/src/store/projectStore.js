import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useProjectStore = create(
  persist(
    (set, get) => ({
      // --- STATE ---
      projects: [],              // List of all Level 1 nodes (Projects)
      activeProject: null,       // Currently selected L1 Node (Simplified object)
      projectTree: null,         // The full recursive NodeTreeRead object (L1 -> L5)
      
      // Workspace UI State
      viewMode: 'tree',          
      isInspectorOpen: false,    
      selectedNode: null,        // Currently focused node (any level)
      
      loading: false,
      error: null,

      // --- ACTIONS ---

      // Project Management
      setProjects: (projects) => set({ projects }),
      
      setActiveProject: (project) => set({ 
        activeProject: project, 
        projectTree: null,       // Clear tree to trigger a fresh fetch for the new project
        selectedNode: null,
        isInspectorOpen: false,
        error: null 
      }),

      // Workspace UI Controls
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedNode: (node) => set({ 
        selectedNode: node, 
        isInspectorOpen: !!node 
      }),
      
      setInspectorOpen: (isOpen) => set({ 
        isInspectorOpen: isOpen,
        // Only clear selectedNode if closing the inspector
        selectedNode: isOpen ? get().selectedNode : null 
      }),

      // Tree Synchronization
      // Receives the recursive object: { id, name, children: [...], metadata: {} }
      setProjectTree: (tree) => set({ 
        projectTree: tree, 
        loading: false,
        // If the tree was refreshed, update the selectedNode reference if it exists
        selectedNode: get().selectedNode ? findNodeInTree(tree, get().selectedNode.id) : null
      }),

      // --- RECURSIVE ENGINE ---
      
      // Optimistic Node Update: High-performance local state mutation
      updateNodeLocally: (nodeId, updates) => {
        const updateRecursive = (node) => {
          if (!node) return null;
          
          if (node.id === nodeId) {
            // Merge metadata carefully to avoid overwriting the whole object
            const updatedMetadata = updates.metadata 
              ? { ...node.metadata, ...updates.metadata } 
              : node.metadata;
              
            return { ...node, ...updates, metadata: updatedMetadata };
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
            // Sync the inspector data if the edited node is the one currently open
            selectedNode: get().selectedNode?.id === nodeId 
              ? findNodeInTree(newTree, nodeId) 
              : get().selectedNode
          });
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
      partialize: (state) => ({ 
        activeProject: state.activeProject, 
        viewMode: state.viewMode 
      }),
    }
  )
);

/**
 * Helper: Find a node by ID anywhere in the 5-layer tree
 */
function findNodeInTree(node, id) {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findNodeInTree(child, id);
      if (found) return found;
    }
  }
  return null;
}

export default useProjectStore;