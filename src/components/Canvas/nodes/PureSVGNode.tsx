import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface PureSVGNodeData {
  svgContent?: string;
  shape?: string;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const PureSVGNode = ({ data }: NodeProps<PureSVGNodeData>) => {
  return (
    <div className="pure-svg-node">
      <Handle type="target" position={Position.Top} />
      {data.svgContent && (
        <div
          className="svg-container"
          dangerouslySetInnerHTML={{ __html: data.svgContent }}
        />
      )}
      {data.shape && (
        <div 
          className="shape-container" 
          style={{
            backgroundColor: data.fill,
            borderColor: data.stroke,
            borderWidth: data.strokeWidth,
          }}
        >
          {/* Render shape based on shape type */}
          <div className={`shape ${data.shape}`}></div>
        </div>
      )}
      {data.label && <div className="node-label">{data.label}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(PureSVGNode);
