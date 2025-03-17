import React, { useState } from "react";
import "./Canvas.css";
import { Shape } from "../../types/shapes";

const Canvas: React.FC = () => {
  const [droppedShapes, setDroppedShapes] = useState<
    Array<{ shape: Shape; position: { x: number; y: number } }>
  >([]);

  // Handle drop event
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();

    try {
      // Get the shape data from the drag event
      const shapeData = event.dataTransfer.getData("application/json");
      if (shapeData) {
        const shape = JSON.parse(shapeData) as Shape;

        // Calculate the position where the shape was dropped
        const canvasRect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - canvasRect.left;
        const y = event.clientY - canvasRect.top;

        // Add the shape to the canvas
        setDroppedShapes((prev) => [...prev, { shape, position: { x, y } }]);

        console.log(`Dropped shape "${shape.name}" at position (${x}, ${y})`);
      }
    } catch (error) {
      console.error("Error handling dropped shape:", error);
    }
  };

  // Handle drag over event
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div
      className="canvas-container"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="canvas-tools">
        <button className="canvas-tool">Pan</button>
        <button className="canvas-tool">Select</button>
        <button className="canvas-tool">Zoom In</button>
        <button className="canvas-tool">Zoom Out</button>
        <button className="canvas-tool">Fit View</button>
      </div>
      <div className="canvas-area">
        {/* This will be replaced with React Flow or Konva implementation */}
        <div className="placeholder-message">
          <h3>Canvas Area</h3>
          <p>This is where the diagram editor will be implemented.</p>
          <p>We'll integrate React Flow or Konva here in the next phase.</p>
          {droppedShapes.length > 0 && (
            <div className="dropped-shapes-info">
              <p>Dropped Shapes:</p>
              <ul>
                {droppedShapes.map((item, index) => (
                  <li key={index}>
                    {item.shape.name} at ({Math.round(item.position.x)},{" "}
                    {Math.round(item.position.y)})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Render dropped shapes */}
        {droppedShapes.map((item, index) => (
          <div
            key={`${item.shape.id}-${index}`}
            className="dropped-shape"
            style={{
              position: "absolute",
              left: `${item.position.x}px`,
              top: `${item.position.y}px`,
              transform: "translate(-50%, -50%)",
            }}
            dangerouslySetInnerHTML={{ __html: item.shape.svg }}
          />
        ))}
      </div>
    </div>
  );
};

export default Canvas;
