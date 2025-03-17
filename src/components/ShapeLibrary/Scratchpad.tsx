import React from "react";
import { Shape } from "../../types/shapes";
import ShapeItem from "./ShapeItem";
import "./ShapeLibrary.css";

interface ScratchpadProps {
  shapes: Shape[];
  onShapeClick?: (shape: Shape) => void;
  onShapeDragStart?: (shape: Shape, event: React.DragEvent) => void;
  onClear?: () => void;
  onRemoveShape?: (shapeId: string) => void;
}

/**
 * Component for the scratchpad - a personal library of frequently used shapes
 */
const Scratchpad: React.FC<ScratchpadProps> = ({
  shapes,
  onShapeClick,
  onShapeDragStart,
  onClear,
  onRemoveShape,
}) => {
  return (
    <div className="scratchpad">
      <div className="scratchpad-header">
        <div className="scratchpad-title">Scratchpad</div>
        {shapes.length > 0 && (
          <button
            className="scratchpad-clear-button"
            onClick={onClear}
            title="Clear scratchpad"
          >
            Clear
          </button>
        )}
      </div>

      <div className="scratchpad-shapes">
        {shapes.map((shape) => (
          <div key={shape.id} className="scratchpad-shape-container">
            <ShapeItem
              shape={shape}
              onClick={onShapeClick}
              onDragStart={onShapeDragStart}
            />
            {onRemoveShape && (
              <button
                className="remove-shape-button"
                onClick={() => onRemoveShape(shape.id)}
                title="Remove from scratchpad"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {shapes.length === 0 && (
          <div className="empty-scratchpad">
            <p>Your scratchpad is empty</p>
            <p className="scratchpad-hint">
              Drag shapes here to add them to your scratchpad
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scratchpad;
