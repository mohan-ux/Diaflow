import React, { useState } from "react";
import { Shape, ShapeCategory as ShapeCategoryType } from "../../types/shapes";
import ShapeItem from "./ShapeItem";
import "./ShapeLibrary.css";

interface ShapeCategoryProps {
  title: string;
  category: ShapeCategoryType;
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
  onShapeDragStart?: (shape: Shape, event: React.DragEvent) => void;
  isExpanded?: boolean;
}

/**
 * Component to display a category of shapes in the shape library
 */
const ShapeCategory: React.FC<ShapeCategoryProps> = ({
  title,
  category,
  shapes,
  onShapeClick,
  onShapeDragStart,
  isExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(isExpanded);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="shape-category" data-category={category}>
      <div className="category-header" onClick={toggleExpanded}>
        <div className="category-title">{title}</div>
        <div className="category-toggle">{expanded ? "▼" : "►"}</div>
      </div>

      {expanded && (
        <div className="category-shapes">
          {shapes.map((shape) => (
            <ShapeItem
              key={shape.id}
              shape={shape}
              onClick={onShapeClick}
              onDragStart={onShapeDragStart}
            />
          ))}

          {shapes.length === 0 && (
            <div className="empty-category">No shapes in this category</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShapeCategory;
