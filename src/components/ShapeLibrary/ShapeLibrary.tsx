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

// Shape definitions with string-based icons
const BASIC_SHAPES = [
  { id: "rectangle", icon: "■", name: "Rectangle" },
  { id: "circle", icon: "●", name: "Circle" },
  { id: "diamond", icon: "◆", name: "Diamond" },
  { id: "triangle", icon: "▲", name: "Triangle" },
  { id: "hexagon", icon: "⬡", name: "Hexagon" },
  { id: "octagon", icon: "⯃", name: "Octagon" },
  { id: "star", icon: "★", name: "Star" },
  { id: "ellipse", icon: "⬭", name: "Ellipse" },
];

/**
 * Main component for the shape library
 */
const ShapeLibrary: React.FC<ShapeLibraryProps> = ({
  onShapeSelect,
  onShapeDragStart,
}) => {
  const {
    libraries,
    getVisibleLibraries,
    searchResults,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: string]: boolean;
  }>({
    "Basic Shapes": true,
    Flowchart: false,
    UML: false,
  });

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
    // In a real implementation, this would open a dialog to select more shape libraries
    console.log("More Shapes button clicked");
  };

  // Get all available categories
  const availableCategories = Array.from(
    new Set(getVisibleLibraries().map((lib) => lib.category))
  ) as ShapeCategoryType[];

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Filter shapes based on search
  const filteredShapes = BASIC_SHAPES.filter((shape) =>
    shape.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle drag start for shapes
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    shapeId: string
  ) => {
    // Set data for dragging
    event.dataTransfer.setData("application/reactflow", `shape:${shapeId}`);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="shape-library">
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search shapes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="categories">
        <div className="category">
          <div
            className="category-header"
            onClick={() => toggleCategory("Basic Shapes")}
          >
            <h3>Basic Shapes</h3>
            <span className={`category-arrow ${
              expandedCategories["Basic Shapes"] ? "expanded" : ""
            }`}>
              ▼
            </span>
          </div>

          {expandedCategories["Basic Shapes"] && (
            <div className="shapes-grid">
              {filteredShapes.map((shape) => (
                <div
                  key={shape.id}
                  className="shape-item"
                  draggable
                  onDragStart={(e) => onDragStart(e, shape.id)}
                >
                  <div className="shape-icon">{shape.icon}</div>
                  <div className="shape-name">{shape.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional categories can be added here */}
      </div>

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
            {getVisibleLibraries().map((library) => (
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
