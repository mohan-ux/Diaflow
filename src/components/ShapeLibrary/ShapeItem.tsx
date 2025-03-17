import React from "react";
import { Shape } from "../../types/shapes";
import "./ShapeLibrary.css";

interface ShapeItemProps {
  shape: Shape;
  onClick?: (shape: Shape) => void;
  onDragStart?: (shape: Shape, event: React.DragEvent) => void;
  isSelected?: boolean;
}

/**
 * Component to display a single shape in the shape library
 */
const ShapeItem: React.FC<ShapeItemProps> = ({
  shape,
  onClick,
  onDragStart,
  isSelected = false,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(shape);
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    if (onDragStart) {
      onDragStart(shape, event);
    } else {
      // Default drag behavior
      event.dataTransfer.setData("application/json", JSON.stringify(shape));
    }
  };

  return (
    <div
      className={`shape-item ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      draggable
      onDragStart={handleDragStart}
      title={shape.name}
      data-shape-id={shape.id}
      data-shape-category={shape.category}
    >
      <div
        className="shape-preview"
        dangerouslySetInnerHTML={{ __html: shape.svg }}
      />
      <div className="shape-name">{shape.name}</div>
    </div>
  );
};

export default ShapeItem;
