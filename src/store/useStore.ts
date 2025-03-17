import create from "zustand";

// Define types for our store
export interface Element {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label?: string;
    [key: string]: any;
  };
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

export interface Connection {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  style?: {
    strokeColor?: string;
    strokeWidth?: number;
    dashed?: boolean;
    [key: string]: any;
  };
}

interface DiagramState {
  elements: Element[];
  connections: Connection[];
  selectedElementIds: string[];
  theme: "light" | "dark";

  // Actions
  addElement: (element: Element) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  removeElement: (id: string) => void;
  addConnection: (connection: Connection) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  removeConnection: (id: string) => void;
  setSelectedElementIds: (ids: string[]) => void;
  toggleTheme: () => void;
}

// Create the store
const useStore = create<DiagramState>((set) => ({
  elements: [],
  connections: [],
  selectedElementIds: [],
  theme: "light",

  // Element actions
  addElement: (element) =>
    set((state) => ({ elements: [...state.elements, element] })),

  updateElement: (id, updates) =>
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? { ...element, ...updates } : element
      ),
    })),

  removeElement: (id) =>
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== id),
      connections: state.connections.filter(
        (connection) => connection.source !== id && connection.target !== id
      ),
    })),

  // Connection actions
  addConnection: (connection) =>
    set((state) => ({ connections: [...state.connections, connection] })),

  updateConnection: (id, updates) =>
    set((state) => ({
      connections: state.connections.map((connection) =>
        connection.id === id ? { ...connection, ...updates } : connection
      ),
    })),

  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter(
        (connection) => connection.id !== id
      ),
    })),

  // Selection actions
  setSelectedElementIds: (ids) => set({ selectedElementIds: ids }),

  // Theme actions
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
}));

export default useStore;
