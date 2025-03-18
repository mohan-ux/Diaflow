import React, { useState, useCallback, useEffect } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import "./ShapeNode.css";

// Draw.io style node with connection points
export interface ShapeNodeData {
  label?: string;
  html?: string;
  shape?: string;
  group?: boolean;
}

const ShapeNode = ({
  id,
  data,
  selected,
  isConnectable = true,
}: NodeProps<ShapeNodeData>) => {
  const [rotation, setRotation] = useState(0);
  const [isDraggingRotation, setIsDraggingRotation] = useState(false);
  const isGroup = data?.group || false;

  const onRotationMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingRotation(true);
  }, []);

  useEffect(() => {
    const handleRotationMouseMove = (e: MouseEvent) => {
      if (!isDraggingRotation) return;

      const rect = document
        .getElementById(`node-${id}`)
        ?.getBoundingClientRect();
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const degrees = angle * (180 / Math.PI) + 90;

      setRotation(degrees);
    };

    const handleRotationMouseUp = () => {
      setIsDraggingRotation(false);
    };

    if (isDraggingRotation) {
      window.addEventListener("mousemove", handleRotationMouseMove);
      window.addEventListener("mouseup", handleRotationMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleRotationMouseMove);
      window.removeEventListener("mouseup", handleRotationMouseUp);
    };
  }, [isDraggingRotation, id]);

  // In draw.io, handles are always visible on hover regardless of selection
  return (
    <div
      id={`node-${id}`}
      className={`shape-node ${selected ? "selected" : ""} ${
        isGroup ? "group-node" : ""
      }`}
      style={{
        transform: isGroup ? "none" : `rotate(${rotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      {/* Only show handles for non-group nodes */}
      {!isGroup && (
        <>
          {/* Position.Top */}
          <Handle
            type="source"
            position={Position.Top}
            id="t"
            className="shape-node-handle top"
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Top}
            id="t-target"
            className="shape-node-handle top"
            isConnectable={isConnectable}
          />

          {/* Position.Right */}
          <Handle
            type="source"
            position={Position.Right}
            id="r"
            className="shape-node-handle right"
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Right}
            id="r-target"
            className="shape-node-handle right"
            isConnectable={isConnectable}
          />

          {/* Position.Bottom */}
          <Handle
            type="source"
            position={Position.Bottom}
            id="b"
            className="shape-node-handle bottom"
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="b-target"
            className="shape-node-handle bottom"
            isConnectable={isConnectable}
          />

          {/* Position.Left */}
          <Handle
            type="source"
            position={Position.Left}
            id="l"
            className="shape-node-handle left"
            isConnectable={isConnectable}
          />
          <Handle
            type="target"
            position={Position.Left}
            id="l-target"
            className="shape-node-handle left"
            isConnectable={isConnectable}
          />
        </>
      )}

      <div className="shape-node-content">
        {data?.html ? (
          <div dangerouslySetInnerHTML={{ __html: data.html }} />
        ) : (
          <div>{data?.label || "Node"}</div>
        )}
      </div>

      {/* Rotation control */}
      {selected && !isGroup && (
        <>
          <div className="rotation-line"></div>
          <div
            className="rotation-control"
            onMouseDown={onRotationMouseDown}
          ></div>
        </>
      )}
    </div>
  );
};

export default ShapeNode;
