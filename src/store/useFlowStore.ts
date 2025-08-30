import { create } from "zustand";
// Removed unused imports: Node, CustomNode, CustomEdge
import { FlowState } from "../types/flowTypes";
import { generateId } from "../utils/idGenerator";

// Create the store
const useFlowStore = create<FlowState>((set) => ({
  // State
  nodes: [],
  edges: [],
  selectedElements: { nodes: [], edges: [] },

  // Node actions
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  
  addNode: (node) => {
    const id = generateId();
    set((state) => ({
      nodes: [...state.nodes, { ...node, id }],
    }));
    return id;
  },

  updateNode: (nodeId, updates) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    }));
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    }));
  },

  // Edge actions
  addEdge: (edge) => {
    const id = generateId();
    set((state) => ({
      edges: [...state.edges, { ...edge, id }],
    }));
    return id;
  },

  updateEdge: (edgeId, updates) => {
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === edgeId ? { ...edge, ...updates } : edge
      ),
    }));
  },

  removeEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    }));
  },

  // Selection actions
  setSelectedElements: (elements) => {
    set({ selectedElements: elements });
  },

  clearSelectedElements: () => {
    set({ selectedElements: { nodes: [], edges: [] } });
  },

  // Flow actions
  onNodesChange: (changes) => {
    set((state) => {
      // Handle node changes
      return { nodes: state.nodes };
    });
  },

  onEdgesChange: (changes) => {
    set((state) => {
      // Handle edge changes
      return { edges: state.edges };
    });
  },

  onConnect: (connection) => {
    set((state) => {
      // Handle new connection
      return { edges: state.edges };
    });
  },
  
  clearCanvas: () => set({ nodes: [], edges: [], selectedElements: { nodes: [], edges: [] } }),
}));

export default useFlowStore;
