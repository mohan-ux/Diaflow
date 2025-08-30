import { create } from "zustand";
import {
  Shape,
  ShapeLibrary,
  ShapeSearchOptions,
  Scratchpad,
} from "../types/shapes";
import { generateId } from "../utils/idGenerator";

interface ShapeLibraryState {
  // Libraries
  libraries: ShapeLibrary[];
  activeLibraryId: string | null;
  searchResults: Shape[];
  searchOptions: ShapeSearchOptions;

  // Scratchpad
  scratchpad: Scratchpad;

  // Actions
  setActiveLibrary: (libraryId: string) => void;
  addLibrary: (library: Omit<ShapeLibrary, "id">) => string;
  removeLibrary: (libraryId: string) => void;
  toggleLibraryVisibility: (libraryId: string) => void;

  // Shape actions
  addShapeToLibrary: (libraryId: string, shape: Omit<Shape, "id">) => string;
  removeShapeFromLibrary: (libraryId: string, shapeId: string) => void;

  // Scratchpad actions
  addShapeToScratchpad: (shape: Shape) => void;
  removeShapeFromScratchpad: (shapeId: string) => void;
  clearScratchpad: () => void;

  // Search actions
  searchShapes: (options: ShapeSearchOptions) => void;
  clearSearch: () => void;
}

const useShapeLibraryStore = create<ShapeLibraryState>((set, get) => ({
  // Initial state
  libraries: [],
  activeLibraryId: null,
  searchResults: [],
  searchOptions: { query: "" },
  scratchpad: { shapes: [] },

  // Library actions
  setActiveLibrary: (libraryId) => set({ activeLibraryId: libraryId }),

  addLibrary: (library) => {
    const id = generateId();
    set((state) => ({
      libraries: [...state.libraries, { ...library, id }],
    }));
    return id;
  },

  removeLibrary: (libraryId) => {
    set((state) => ({
      libraries: state.libraries.filter((lib) => lib.id !== libraryId),
      activeLibraryId:
        state.activeLibraryId === libraryId ? null : state.activeLibraryId,
    }));
  },

  toggleLibraryVisibility: (libraryId) => {
    set((state) => ({
      libraries: state.libraries.map((lib) =>
        lib.id === libraryId ? { ...lib, isVisible: !lib.isVisible } : lib
      ),
    }));
  },

  // Shape actions
  addShapeToLibrary: (libraryId, shape) => {
    const id = generateId();
    set((state) => ({
      libraries: state.libraries.map((lib) =>
        lib.id === libraryId
          ? { ...lib, shapes: [...lib.shapes, { ...shape, id }] }
          : lib
      ),
    }));
    return id;
  },

  removeShapeFromLibrary: (libraryId, shapeId) => {
    set((state) => ({
      libraries: state.libraries.map((lib) =>
        lib.id === libraryId
          ? {
              ...lib,
              shapes: lib.shapes.filter((shape) => shape.id !== shapeId),
            }
          : lib
      ),
    }));
  },

  // Scratchpad actions
  addShapeToScratchpad: (shape) => {
    set((state) => ({
      scratchpad: {
        shapes: [...state.scratchpad.shapes, shape],
      },
    }));
  },

  removeShapeFromScratchpad: (shapeId) => {
    set((state) => ({
      scratchpad: {
        shapes: state.scratchpad.shapes.filter((shape) => shape.id !== shapeId),
      },
    }));
  },

  clearScratchpad: () => {
    set({ scratchpad: { shapes: [] } });
  },

  // Search actions
  searchShapes: (options) => {
    set({ searchOptions: options });

    const { libraries } = get();
    const visibleLibraries = libraries.filter((lib) => lib.isVisible);

    // Perform search across all visible libraries
    const results = visibleLibraries.flatMap((lib) => {
      return lib.shapes.filter((shape) => {
        // Filter by category if specified
        if (options.categories && options.categories.length > 0) {
          if (!options.categories.includes(shape.category)) {
            return false;
          }
        }

        // Filter by tags if specified
        if (options.tags && options.tags.length > 0) {
          if (!options.tags.some((tag) => shape.tags.includes(tag))) {
            return false;
          }
        }

        // Filter by query text
        if (options.query) {
          const query = options.query.toLowerCase();
          return (
            shape.name.toLowerCase().includes(query) ||
            shape.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        return true;
      });
    });

    set({ searchResults: results });
  },

  clearSearch: () => {
    set({
      searchResults: [],
      searchOptions: { query: "" },
    });
  },
}));

export default useShapeLibraryStore;
