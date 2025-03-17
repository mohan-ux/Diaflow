import React from "react";
import "./LeftPanel.css";
import ShapeLibrary from "../ShapeLibrary/ShapeLibrary";
import { Shape } from "../../types/shapes";

const LeftPanel: React.FC = () => {
  // Handle shape selection
  const handleShapeSelect = (shape: Shape) => {
    console.log("Shape selected:", shape);
    // In a real implementation, this would update the canvas or application state
  };

  // Handle shape drag start
  const handleShapeDragStart = (shape: Shape, event: React.DragEvent) => {
    console.log("Shape drag started:", shape);

    // Set the drag data for the shape
    event.dataTransfer.setData("application/json", JSON.stringify(shape));

    // Set the drag image (optional)
    if (shape.svg) {
      try {
        // Create a temporary element to render the SVG for the drag image
        const tempElement = document.createElement("div");
        tempElement.innerHTML = shape.svg;
        tempElement.style.position = "absolute";
        tempElement.style.top = "-1000px";
        tempElement.style.left = "-1000px";
        document.body.appendChild(tempElement);

        const svgElement = tempElement.querySelector("svg");
        if (svgElement) {
          // Set the size of the SVG for the drag image
          svgElement.setAttribute("width", "50");
          svgElement.setAttribute("height", "50");

          // Set the drag image
          event.dataTransfer.setDragImage(tempElement, 25, 25);

          // Clean up after a short delay
          setTimeout(() => {
            document.body.removeChild(tempElement);
          }, 100);
        }
      } catch (error) {
        console.error("Error setting drag image:", error);
      }
    }

    // Set the effect
    event.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="left-panel">
      <ShapeLibrary
        onShapeSelect={handleShapeSelect}
        onShapeDragStart={handleShapeDragStart}
      />
    </div>
  );
};

export default LeftPanel;
