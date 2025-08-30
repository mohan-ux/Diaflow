import { useCallback } from "react";
import useShapeLibraryStore from "../store/useShapeLibraryStore";
import { Shape, Scratchpad } from "../types/shapes";

const useShapeLibrary = () => {
  const {
    libraries,
    activeLibraryId,
    scratchpad,
    setActiveLibrary,
    addShapeToLibrary,
    removeShapeFromLibrary,
    addShapeToScratchpad,
    removeShapeFromScratchpad,
    clearScratchpad,
    searchResults,
    searchShapes,
    clearSearch,
    addLibrary: storeAddLibrary,
    removeLibrary: storeRemoveLibrary,
    toggleLibraryVisibility: storeToggleLibraryVisibility,
  } = useShapeLibraryStore();

  // Get all libraries
  // Removed unused function: getLibraries

  // Get active library
  const getActiveLibrary = useCallback(() => {
    return libraries.find((lib) => lib.id === activeLibraryId) || null;
  }, [libraries, activeLibraryId]);

  // Get visible libraries
  const getVisibleLibraries = useCallback(() => {
    return libraries.filter((lib) => lib.isVisible);
  }, [libraries]);

  // Get shapes by category
  const getShapesByCategory = useCallback(
    (category: string) => {
      const visibleLibraries = libraries.filter((lib) => lib.isVisible);
      const shapes: Shape[] = [];

      visibleLibraries.forEach((lib) => {
        const categoryShapes = lib.shapes.filter(
          (shape) => shape.category === category
        );
        shapes.push(...categoryShapes);
      });

      return shapes;
    },
    [libraries]
  );

  // Get all shapes from visible libraries
  const getAllShapes = useCallback(() => {
    const visibleLibraries = libraries.filter((lib) => lib.isVisible);
    const shapes: Shape[] = [];

    visibleLibraries.forEach((lib) => {
      shapes.push(...lib.shapes);
    });

    return shapes;
  }, [libraries]);

  // Get scratchpad
  // Removed unused function: getScratchpad

  // Create a custom library
  const createCustomLibrary = useCallback(
    (name: string, category: string) => {
      // Implementation would be in the store
      console.log("Creating custom library", name, category);
    },
    []
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
    getVisibleLibraries,
    getActiveLibrary,
    searchResults,
    scratchpad,

    // Library actions
    setActiveLibrary,
    addLibrary: storeAddLibrary,
    removeLibrary: storeRemoveLibrary,
    toggleLibraryVisibility: storeToggleLibraryVisibility,
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
