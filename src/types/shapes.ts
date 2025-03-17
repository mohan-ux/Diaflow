/**
 * Types for the shape library system
 */

// Shape category types
export type ShapeCategory =
  | "general"
  | "basic"
  | "arrows"
  | "flowchart"
  | "mindmap"
  | "uml"
  | "entity-relation"
  | "modern"
  | "custom";

// Shape type
export interface Shape {
  id: string;
  name: string;
  category: ShapeCategory;
  svg: string;
  tags: string[];
  metadata?: Record<string, any>;
}

// Library type
export interface ShapeLibrary {
  id: string;
  name: string;
  description?: string;
  category: ShapeCategory;
  shapes: Shape[];
  isBuiltIn: boolean;
  isVisible: boolean;
}

// Shape search options
export interface ShapeSearchOptions {
  query: string;
  categories?: ShapeCategory[];
  tags?: string[];
}

// Shape selection event
export interface ShapeSelectionEvent {
  shape: Shape;
  position?: { x: number; y: number };
}

// Scratchpad type
export interface Scratchpad {
  shapes: Shape[];
}
