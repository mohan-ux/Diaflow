import { Node, Edge } from "reactflow";
import { Shape } from "./shapes";

// Extended Node type for our application
export interface CustomNode extends Node {
  shapeData?: Shape;
  shapeType?: string;
  style?: {
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    fontSize?: number;
    fontFamily?: string;
    [key: string]: any;
  };
}

// Custom Edge type for our application
export interface CustomEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string;
  animated?: boolean;
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    dashed?: boolean;
    [key: string]: any;
  };
  data?: any;
  selected?: boolean;
  zIndex?: number;
  hidden?: boolean;
  interactionWidth?: number;
  updatable?: boolean;
  markerStart?: string;
  markerEnd?: string;
}

// Flow state for our Zustand store
export interface FlowState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  selectedElements: { nodes: CustomNode[]; edges: CustomEdge[] };

  // Actions
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: CustomEdge[]) => void;
  addNode: (node: CustomNode) => void;
  updateNode: (id: string, updates: Partial<CustomNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CustomEdge) => void;
  updateEdge: (id: string, updates: Partial<CustomEdge>) => void;
  removeEdge: (id: string) => void;
  setSelectedElements: (elements: {
    nodes: CustomNode[];
    edges: CustomEdge[];
  }) => void;
}
