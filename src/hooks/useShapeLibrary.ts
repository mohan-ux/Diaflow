import { useCallback } from "react";
import useShapeLibraryStore from "../store/useShapeLibraryStore";
import {
  Shape,
  ShapeLibrary,
  ShapeCategory,
  ShapeSearchOptions,
} from "../types/shapes";

/**
 * Custom hook for working with shape libraries
 */
const useShapeLibrary = () => {
  // Get state and actions from the store
  const {
    libraries,
    activeLibraryId,
    searchResults,
    searchOptions,
    scratchpad,
    setActiveLibrary,
    addLibrary,
    removeLibrary,
    toggleLibraryVisibility,
    addShapeToLibrary,
    removeShapeFromLibrary,
    addShapeToScratchpad,
    removeShapeFromScratchpad,
    clearScratchpad,
    searchShapes,
    clearSearch,
  } = useShapeLibraryStore();

  // Get the active library
  const activeLibrary = activeLibraryId
    ? libraries.find((lib) => lib.id === activeLibraryId) || null
    : null;

  // Get visible libraries
  const visibleLibraries = libraries.filter((lib) => lib.isVisible);

  // Get shapes by category
  const getShapesByCategory = useCallback(
    (category: ShapeCategory): Shape[] => {
      return visibleLibraries
        .filter((lib) => lib.category === category)
        .flatMap((lib) => lib.shapes);
    },
    [visibleLibraries]
  );

  // Get all shapes
  const getAllShapes = useCallback((): Shape[] => {
    return visibleLibraries.flatMap((lib) => lib.shapes);
  }, [visibleLibraries]);

  // Create a new custom library
  const createCustomLibrary = useCallback(
    (
      name: string,
      category: ShapeCategory = "custom",
      description?: string
    ): string => {
      return addLibrary({
        name,
        category,
        description,
        shapes: [],
        isBuiltIn: false,
        isVisible: true,
      });
    },
    [addLibrary]
  );

  // Add a shape to the scratchpad
  const addToScratchpad = useCallback(
    (shape: Shape) => {
      // Check if shape already exists in scratchpad
      const exists = scratchpad.shapes.some((s) => s.id === shape.id);
      if (!exists) {
        addShapeToScratchpad(shape);
      }
    },
    [scratchpad.shapes, addShapeToScratchpad]
  );

  return {
    // State
    libraries,
    visibleLibraries,
    activeLibrary,
    searchResults,
    searchOptions,
    scratchpad,

    // Library actions
    setActiveLibrary,
    addLibrary,
    removeLibrary,
    toggleLibraryVisibility,
    createCustomLibrary,

    // Shape actions
    addShapeToLibrary,
    removeShapeFromLibrary,
    getShapesByCategory,
    getAllShapes,

    // Scratchpad actions
    addToScratchpad,
    removeShapeFromScratchpad,
    clearScratchpad,

    // Search actions
    searchShapes,
    clearSearch,
  };
};

export default useShapeLibrary;
