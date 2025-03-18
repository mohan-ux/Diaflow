import React, { useState } from "react";
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
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(shape);
    }
  };

  const handleDragStart = (event: React.DragEvent) => {
    setIsDragging(true);
    console.log("ShapeItem drag started for:", shape.name);

    // In case the parent doesn't handle it, we'll set up drag data here too
    if (!onDragStart) {
      try {
        const shapeData = JSON.stringify(shape);
        console.log("ShapeItem setting drag data directly");

        // Set multiple formats for better compatibility
        event.dataTransfer.setData("application/json", shapeData);
        event.dataTransfer.setData("text/plain", shapeData);

        // Set a simple version as well
        event.dataTransfer.setData("text/x-shape", shape.name);

        // Set a custom debug flag
        event.dataTransfer.setData("text/x-diaflow", "ShapeItem-drag");

        // Set the effect
        event.dataTransfer.effectAllowed = "copy";
      } catch (error) {
        console.error("Error in ShapeItem direct drag handling:", error);
      }
    } else {
      // Let the parent handle it
      onDragStart(shape, event);
    }
  };

  const handleDragEnd = () => {
    console.log("ShapeItem drag ended for:", shape.name);
    setIsDragging(false);
  };

  return (
    <div
      className={`shape-item ${isSelected ? "selected" : ""} ${
        isDragging ? "dragging" : ""
      }`}
      onClick={handleClick}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
