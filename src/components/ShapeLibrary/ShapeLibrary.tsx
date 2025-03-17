import React, { useEffect, useState, useCallback } from "react";
import {
  Shape,
  ShapeCategory as ShapeCategoryType,
  ShapeSearchOptions,
} from "../../types/shapes";
import useShapeLibrary from "../../hooks/useShapeLibrary";
import { initializeBuiltInLibraries } from "../../libraries/shapes";
import ShapeCategory from "./ShapeCategory";
import ShapeSearch from "./ShapeSearch";
import Scratchpad from "./Scratchpad";
import ShapeItem from "./ShapeItem";
import "./ShapeLibrary.css";

interface ShapeLibraryProps {
  onShapeSelect?: (shape: Shape) => void;
  onShapeDragStart?: (shape: Shape, event: React.DragEvent) => void;
}

/**
 * Main component for the shape library
 */
const ShapeLibrary: React.FC<ShapeLibraryProps> = ({
  onShapeSelect,
  onShapeDragStart,
}) => {
  const {
    libraries,
    visibleLibraries,
    searchResults,
    searchOptions,
    scratchpad,
    addLibrary,
    searchShapes,
    clearSearch,
    addToScratchpad,
    removeShapeFromScratchpad,
    clearScratchpad,
  } = useShapeLibrary();

  const [isSearching, setIsSearching] = useState(false);
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [showMoreShapesDialog, setShowMoreShapesDialog] = useState(false);

  // Initialize built-in libraries if none exist
  useEffect(() => {
    if (libraries.length === 0) {
      const builtInLibraries = initializeBuiltInLibraries();
      builtInLibraries.forEach((library) => {
        addLibrary(library);
      });
    }
  }, [libraries.length, addLibrary]);

  // Handle shape selection
  const handleShapeClick = useCallback(
    (shape: Shape) => {
      if (onShapeSelect) {
        onShapeSelect(shape);
      }
    },
    [onShapeSelect]
  );

  // Handle shape drag start
  const handleShapeDragStart = useCallback(
    (shape: Shape, event: React.DragEvent) => {
      if (onShapeDragStart) {
        onShapeDragStart(shape, event);
      }
    },
    [onShapeDragStart]
  );

  // Handle search
  const handleSearch = useCallback(
    (options: ShapeSearchOptions) => {
      searchShapes(options);
      setIsSearching(
        !!(
          options.query ||
          (options.categories && options.categories.length > 0)
        )
      );
    },
    [searchShapes]
  );

  // Handle drop on scratchpad
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDropTarget(false);

      try {
        const shapeData = event.dataTransfer.getData("application/json");
        if (shapeData) {
          const shape = JSON.parse(shapeData) as Shape;
          addToScratchpad(shape);
        }
      } catch (error) {
        console.error("Error adding shape to scratchpad:", error);
      }
    },
    [addToScratchpad]
  );

  // Handle More Shapes button click
  const handleMoreShapesClick = () => {
    setShowMoreShapesDialog(true);
    // In a real implementation, this would open a dialog to select more shape libraries
    console.log("More Shapes button clicked");
  };

  // Get all available categories
  const availableCategories = Array.from(
    new Set(visibleLibraries.map((lib) => lib.category))
  ) as ShapeCategoryType[];

  return (
    <div className="shape-library">
      <ShapeSearch
        onSearch={handleSearch}
        availableCategories={availableCategories}
      />

      <div className="library-content">
        {/* Search Results */}
        {isSearching && (
          <div className="search-results">
            <div className="search-results-header">
              <div className="search-results-title">
                Search Results ({searchResults.length})
              </div>
              <button className="clear-search-button" onClick={clearSearch}>
                Clear Search
              </button>
            </div>

            <div className="search-results-shapes">
              {searchResults.map((shape) => (
                <ShapeItem
                  key={shape.id}
                  shape={shape}
                  onClick={handleShapeClick}
                  onDragStart={handleShapeDragStart}
                />
              ))}

              {searchResults.length === 0 && (
                <div className="empty-search-results">
                  No shapes found matching your search
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shape Categories */}
        {!isSearching && (
          <div className="shape-categories">
            {visibleLibraries.map((library) => (
              <ShapeCategory
                key={library.id}
                title={library.name}
                category={library.category}
                shapes={library.shapes}
                onShapeClick={handleShapeClick}
                onShapeDragStart={handleShapeDragStart}
              />
            ))}
          </div>
        )}
      </div>

      {/* Scratchpad */}
      <div
        className={`scratchpad-container ${isDropTarget ? "drop-target" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDropTarget(true);
        }}
        onDragLeave={() => setIsDropTarget(false)}
        onDrop={handleDrop}
      >
        <Scratchpad
          shapes={scratchpad.shapes}
          onShapeClick={handleShapeClick}
          onShapeDragStart={handleShapeDragStart}
          onClear={clearScratchpad}
          onRemoveShape={removeShapeFromScratchpad}
        />
      </div>

      {/* More Shapes Button */}
      <button className="more-shapes-button" onClick={handleMoreShapesClick}>
        + More Shapes
      </button>
    </div>
  );
};

export default ShapeLibrary;
