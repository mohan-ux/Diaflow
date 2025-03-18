import React, { useState, useEffect } from "react";
import "./CustomDragLayer.css";

interface DragPosition {
  x: number;
  y: number;
}

const CustomDragLayer: React.FC = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragData, setDragData] = useState<any>(null);
  const [position, setPosition] = useState<DragPosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleDragStart = (e: DragEvent) => {
      console.log("Global drag start detected");
      setIsDragging(true);
      try {
        // Try to get the shape data
        const jsonData = e.dataTransfer?.getData("application/json");
        const textData = e.dataTransfer?.getData("text/plain");
        console.log("Drag start data:", { jsonData, textData });

        if (jsonData) {
          setDragData(JSON.parse(jsonData));
        } else if (textData) {
          try {
            setDragData(JSON.parse(textData));
          } catch (err) {
            setDragData({ text: textData });
          }
        }
      } catch (error) {
        console.error("Error reading drag data:", error);
      }
    };

    const handleDrag = (e: DragEvent) => {
      if (e.clientX > 0 && e.clientY > 0) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleDragEnd = () => {
      console.log("Global drag end detected");
      setIsDragging(false);
      setDragData(null);
    };

    // This won't work as expected due to how drag events work, but we'll keep for debugging
    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("drag", handleDrag);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("drag", handleDrag);
      document.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  if (!isDragging) return null;

  return (
    <div className="custom-drag-layer">
      <div className="drag-info">
        <div>
          Dragging: {dragData ? dragData.name || "Unknown item" : "Item"}
        </div>
        <div>
          Position: {position.x}, {position.y}
        </div>
      </div>
    </div>
  );
};

export default CustomDragLayer;
