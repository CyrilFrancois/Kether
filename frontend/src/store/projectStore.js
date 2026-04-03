import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Utility: Recursively find a node by ID within the project tree.
 */
const findNodeInTree = (node, id) => {
  if (!node) return null;
  if (node.id === id) return node;
  if (node.children && node.children.length > 0) {
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
      projects: [],               // Root-level project list (Sidebar)
      activeProject: null,        // Currently active project container
      projectTree: null,          // Full hierarchical tree (Nodes/Tasks)
      
      // Dynamic Attribute Registry
      suggestions: [],            // Domain-specific attribute suggestions
      
      // UI / Interaction State
      viewMode: 'tree',           // 'tree', 'backlog', 'diagram'
      isInspectorOpen: false,    
      selectedNode: null,         // The node currently being edited in Inspector
      
      loading: false,
      error: null,

      // --- ACTIONS ---

      // Project Navigation
      setProjects: (projects) => set({ projects, error: null }),
      
      setActiveProject: (project) => set({ 
        activeProject: project, 
        projectTree: null,        // Reset tree to trigger fresh fetch on navigation
        suggestions: [], 
        selectedNode: null,
        isInspectorOpen: false,
        error: null 
      }),

      // View Controls
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setSelectedNode: (node) => {
        // Prevent "React child object" errors by ensuring attributes are handled as arrays
        const safeNode = node ? { ...node, attributes: node.attributes || [] } : null;
        set({ 
          selectedNode: safeNode, 
          isInspectorOpen: !!safeNode 
        });
      },
      
      setInspectorOpen: (isOpen) => set({ 
        isInspectorOpen: isOpen,
        selectedNode: isOpen ? get().selectedNode : null 
      }),

      // Attribute Suggestions
      setSuggestions: (suggestions) => set({ suggestions }),
      
      // Tree Sync Logic
      setProjectTree: (tree) => {
        const currentSelected = get().selectedNode;
        set({ 
          projectTree: tree, 
          loading: false,
          // Re-sync selected node with the new tree data to maintain UI consistency
          selectedNode: currentSelected ? findNodeInTree(tree, currentSelected.id) : null
        });
      },

      /**
       * updateNodeLocally: Recursively updates a specific node in the local state.
       * This provides an "Instant UI" feel before the backend confirmation.
       */
      updateNodeLocally: (nodeId, updates) => {
        const updateRecursive = (node) => {
          if (!node) return null;
          
          if (node.id === nodeId) {
            // Logic for merging attributes and metadata correctly
            const updatedAttributes = updates.attributes 
              ? [...updates.attributes] 
              : (node.attributes || []);

            const updatedMetadata = updates.node_metadata 
              ? { ...node.node_metadata, ...updates.node_metadata } 
              : node.node_metadata;
              
            return { 
              ...node, 
              ...updates, 
              attributes: updatedAttributes,
              node_metadata: updatedMetadata 
            };
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
            // Automatically refresh the inspector if the edited node is the selected one
            selectedNode: get().selectedNode?.id === nodeId 
              ? findNodeInTree(newTree, nodeId) 
              : get().selectedNode
          });
        }
      },

      // Global Helpers
      setLoading: (isLoading) => set({ loading: isLoading }),
      setError: (error) => set({ error, loading: false }),

      resetProjectStore: () => set({
        projects: [],
        activeProject: null,
        projectTree: null,
        suggestions: [],
        selectedNode: null,
        viewMode: 'tree',
        isInspectorOpen: false,
        error: null,
        loading: false
      })
    }),
    {
      name: 'pm-app-workspace-state',
      // Persist only what the user needs for session continuity
      partialize: (state) => ({ 
        activeProject: state.activeProject, 
        viewMode: state.viewMode 
      }),
    }
  )
);

export default useProjectStore;