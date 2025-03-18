import create from "zustand";
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { CustomNode, CustomEdge, FlowState } from "../types/flowTypes";
import { v4 as uuidv4 } from "uuid";

// Create the store
const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedElements: { nodes: [], edges: [] },

  // Set all nodes
  setNodes: (nodes) => set({ nodes }),

  // Set all edges
  setEdges: (edges) => set({ edges }),

  // Add a single node
  addNode: (node) => {
    // Ensure node has an ID
    const nodeWithId = node.id ? node : { ...node, id: uuidv4() };
    set((state) => ({ nodes: [...state.nodes, nodeWithId] }));
  },

  // Update a node
  updateNode: (id, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    })),

  // Remove a node
  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      // Also remove connected edges
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    })),

  // Add an edge
  addEdge: (edge) => {
    // Ensure edge has an ID
    const edgeWithId = edge.id ? edge : { ...edge, id: uuidv4() };
    set((state) => ({ edges: [...state.edges, edgeWithId] }));
  },

  // Update an edge
  updateEdge: (id, updates) =>
    set((state) => ({
      edges: state.edges.map((edge) =>
        edge.id === id ? { ...edge, ...updates } : edge
      ),
    })),

  // Remove an edge
  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
    })),

  // Set selected elements
  setSelectedElements: (elements) => set({ selectedElements: elements }),
}));

// Utility for handling node changes
export const onNodesChange: OnNodesChange = (changes) => {
  useFlowStore.setState((state) => ({
    nodes: applyNodeChanges(changes, state.nodes) as CustomNode[],
  }));
};

// Utility for handling edge changes
export const onEdgesChange: OnEdgesChange = (changes) => {
  useFlowStore.setState((state) => ({
    edges: applyEdgeChanges(changes, state.edges) as CustomEdge[],
  }));
};

// Utility for handling new connections
export const onConnect: OnConnect = (connection) => {
  useFlowStore.setState((state) => ({
    edges: addEdge(
      {
        ...connection,
        id: `edge-${connection.source}-${connection.target}`,
        type: "smoothstep",
      },
      state.edges
    ) as CustomEdge[],
  }));
};

export default useFlowStore;
