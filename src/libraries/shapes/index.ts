import { generateId } from "../../utils/idGenerator";
import { ShapeLibrary } from "../../types/shapes";
import { generalShapes } from "./generalShapes";
import { flowchartShapes } from "./flowchartShapes";
import { mindmapShapes } from "./mindmapShapes";
import { modernShapes } from "./modernShapes";

/**
 * Initialize the built-in shape libraries
 * @returns Array of built-in shape libraries
 */
export const initializeBuiltInLibraries = (): ShapeLibrary[] => {
  return [
    {
      id: generateId(),
      name: "General",
      description: "Basic geometric shapes and common elements",
      category: "general",
      shapes: generalShapes.map((shape) => ({ ...shape, id: generateId() })),
      isBuiltIn: true,
      isVisible: true,
    },
    {
      id: generateId(),
      name: "Flowchart",
      description: "Shapes for creating flowcharts and process diagrams",
      category: "flowchart",
      shapes: flowchartShapes.map((shape) => ({ ...shape, id: generateId() })),
      isBuiltIn: true,
      isVisible: true,
    },
    {
      id: generateId(),
      name: "Mind Map",
      description: "Shapes specifically designed for mind mapping",
      category: "mindmap",
      shapes: mindmapShapes.map((shape) => ({ ...shape, id: generateId() })),
      isBuiltIn: true,
      isVisible: true,
    },
    {
      id: generateId(),
      name: "Modern",
      description: "Contemporary design elements and artistic shapes",
      category: "modern",
      shapes: modernShapes.map((shape) => ({ ...shape, id: generateId() })),
      isBuiltIn: true,
      isVisible: true,
    },
  ];
};

// Export all shape libraries
export { generalShapes, flowchartShapes, mindmapShapes, modernShapes };
