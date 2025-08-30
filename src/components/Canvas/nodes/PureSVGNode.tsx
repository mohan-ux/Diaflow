import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface PureSVGNodeData {
  svgContent: string;
  label?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const PureSVGNode = ({ data }: NodeProps<PureSVGNodeData>) => {
  return (
    <div className="pure-svg-node">
      <Handle type="target" position={Position.Top} />
      <div
        className="svg-container"
        dangerouslySetInnerHTML={{ __html: data.svgContent }}
      />
      {data.label && <div className="node-label">{data.label}</div>}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(PureSVGNode);