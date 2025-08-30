import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  // Removed unused import: useMemo
} from "react";
import "./Canvas.css";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  NodeTypes,
  useReactFlow,
  BackgroundVariant,
  OnSelectionChangeParams,
  NodeDragHandler,
  ConnectionLineType,
  Connection,
  MarkerType,
  // Removed unused import: NodeMouseHandler
  type Node,
  type Edge,
  ConnectionMode,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import { Shape } from "../../types/shapes";
import { v4 as uuidv4 } from "uuid";
import { CustomNode, CustomEdge } from "../../types/flowTypes";
import ShapeNode from "./nodes/ShapeNode";
import useFlowStore from "../../store/useFlowStore";
import PureSVGNode, { PureSVGNodeData } from "./nodes/PureSVGNode";
import { ShapeNodeData } from "../../interfaces/types";

// Define custom node types as a constant object instead of using useMemo at the top level
const NODE_TYPES = {
  shapeNode: ShapeNode,
  pureSvg: PureSVGNode,
};

const EnhancedCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<string>("select");

  // Canvas settings
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [darkBackground, setDarkBackground] = useState<boolean>(false);
  const [miniMapOpen, setMiniMapOpen] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20);
  const [isGrouping, setIsGrouping] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Get state from store
  const {
    nodes,
    edges,
    selectedElements,
    addNode,
    updateNode,
    removeNode,
    addEdge,
    removeEdge,
    setSelectedElements,
  } = useFlowStore();

  // Track Ctrl key press for multi-selection
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  // Implement a proper onConnect handler that works correctly
  const onConnect = useCallback(
    (params: Connection) => {
      console.log("Connection created:", params);

      // Create a unique ID for the edge
      const edgeId = `edge-${uuidv4()}`;

      // Add the edge with proper styling for visibility
      const newEdge = {
        id: edgeId,
        ...params,
        type: "step",
        animated: false,
        style: {
          stroke: "#666666",
          strokeWidth: 2,
        },
        markerEnd: MarkerType.Arrow,
        data: {
          edgeType: "normal",
        },
      };

      // Add the edge to the flow
      addEdge(newEdge as unknown as CustomEdge);
    },
    [addEdge]
  );

  // Add context menu support
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    nodeId?: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
  });

  // Context menu handler
  const handleContextMenu = useCallback(
    (event: React.MouseEvent, node: Node | null) => {
      event.preventDefault();

      if (node) {
        // Show context menu for node
        setContextMenu({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          nodeId: node.id,
        });
        console.log("Context menu opened for node:", node.id);
      } else {
        // Show context menu for canvas
        setContextMenu({
          visible: true,
          x: event.clientX,
          y: event.clientY,
        });
        console.log("Context menu opened for canvas");
      }
    },
    []
  );

  // Close context menu
  const closeContextMenu = useCallback(() => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
    });
  }, []);

  // Bring selected nodes to front
  const bringToFront = useCallback(
    (nodeIds: string[]) => {
      const highestZ = Math.max(
        ...nodes.map((n) => (n.style?.zIndex as number) || 0)
      );
      nodeIds.forEach((id) => {
        const node = nodes.find((n) => n.id === id);
        if (node) {
          updateNode(id, {
            style: {
              ...node.style,
              zIndex: highestZ + 1,
            },
          });
        }
      });
    },
    [nodes, updateNode]
  );

  // Send selected nodes to back
  const sendToBack = useCallback(
    (nodeIds: string[]) => {
      const lowestZ = Math.min(
        ...nodes.map((n) => (n.style?.zIndex as number) || 0)
      );
      nodeIds.forEach((id) => {
        const node = nodes.find((n) => n.id === id);
        if (node) {
          updateNode(id, {
            style: {
              ...node.style,
              zIndex: lowestZ - 1,
            },
          });
        }
      });
    },
    [nodes, updateNode]
  );

  // Handle bring to front button click
  const handleBringToFront = useCallback(() => {
    if (selectedElements.nodes.length > 0) {
      bringToFront(selectedElements.nodes.map((n) => n.id));
    }
  }, [selectedElements.nodes, bringToFront]);

  // Handle send to back button click
  const handleSendToBack = useCallback(() => {
    if (selectedElements.nodes.length > 0) {
      sendToBack(selectedElements.nodes.map((n) => n.id));
    }
  }, [selectedElements.nodes, sendToBack]);

  // Context menu options for nodes
  const handleContextMenuAction = useCallback(
    (action: string) => {
      console.log("Context menu action:", action);

      if (contextMenu.nodeId) {
        // Handle node actions
        switch (action) {
          case "cut":
            // Implementation for cutting node
            console.log("Cut node:", contextMenu.nodeId);
            break;
          case "copy":
            // Implementation for copying node
            console.log("Copy node:", contextMenu.nodeId);
            break;
          case "delete":
            // Delete the node
            removeNode(contextMenu.nodeId);
            console.log("Delete node:", contextMenu.nodeId);
            break;
          case "bringToFront":
            // Bring node to front
            bringToFront([contextMenu.nodeId]);
            console.log("Bring to front:", contextMenu.nodeId);
            break;
          case "sendToBack":
            // Send node to back
            sendToBack([contextMenu.nodeId]);
            console.log("Send to back:", contextMenu.nodeId);
            break;
          default:
            break;
        }
      }

      closeContextMenu();
    },
    [contextMenu.nodeId, removeNode, bringToFront, sendToBack]
  );

  // Close context menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        closeContextMenu();
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [contextMenu.visible, closeContextMenu]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control" || event.key === "Meta") {
        setIsCtrlPressed(true);
      }

      // Delete selected elements
      if (event.key === "Delete" && selectedElements) {
        selectedElements.nodes.forEach((node) => removeNode(node.id));
        selectedElements.edges.forEach((edge) => removeEdge(edge.id));
      }

      // Copy selected elements (Ctrl+C)
      if ((event.ctrlKey || event.metaKey) && event.key === "c") {
        // Implement copy functionality
        if (selectedElements && selectedElements.nodes.length > 0) {
          localStorage.setItem(
            "clipboard",
            JSON.stringify(selectedElements.nodes)
          );
        }
      }

      // Paste elements (Ctrl+V)
      if ((event.ctrlKey || event.metaKey) && event.key === "v") {
        const clipboardData = localStorage.getItem("clipboard");
        if (clipboardData) {
          try {
            const copiedNodes = JSON.parse(clipboardData) as CustomNode[];

            // Create new nodes with new IDs at slightly offset positions
            copiedNodes.forEach((node) => {
              const newId = `node-${uuidv4()}`;
              const newNode: CustomNode = {
                ...node,
                id: newId,
                position: {
                  x: node.position.x + 50,
                  y: node.position.y + 50,
                },
              };
              addNode(newNode);
            });
          } catch (error) {
            console.error("Error pasting nodes:", error);
          }
        }
      }

      // Group selected elements (Ctrl+G)
      if ((event.ctrlKey || event.metaKey) && event.key === "g") {
        if (selectedElements && selectedElements.nodes.length > 1) {
          setIsGrouping(true);
          groupSelectedNodes();
        }
      }

      // Ungroup (Ctrl+Shift+G)
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "G"
      ) {
        ungroupSelectedNodes();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control" || event.key === "Meta") {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectedElements, addNode, removeNode, removeEdge]);

  // Group and Ungroup functionality
  const groupSelectedNodes = () => {
    if (!selectedElements || selectedElements.nodes.length < 2) return;

    // Calculate the bounding box of selected nodes
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    selectedElements.nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + (node.style?.width || 100));
      maxY = Math.max(maxY, node.position.y + (node.style?.height || 80));
    });

    // Create a group node
    const groupId = `group-${uuidv4()}`;
    const groupNode: CustomNode = {
      id: groupId,
      type: "shapeNode",
      position: { x: minX - 10, y: minY - 10 },
      data: { label: "Group", isGroup: true },
      style: {
        width: maxX - minX + 20,
        height: maxY - minY + 20,
        backgroundColor: "rgba(240, 240, 240, 0.7)",
        borderColor: "#aaa",
        borderWidth: 1,
        borderStyle: "dashed",
        borderRadius: 5,
        zIndex: -1,
      },
    };

    // Add group to store
    addNode(groupNode);

    // Update all selected nodes to be part of this group
    selectedElements.nodes.forEach((node) => {
      updateNode(node.id, {
        parentNode: groupId,
        extent: "parent",
        position: {
          x: node.position.x - minX + 10,
          y: node.position.y - minY + 10,
        },
      });
    });
  };

  const ungroupSelectedNodes = () => {
    const selectedGroupIds = selectedElements.nodes
      .filter((node) => node.data?.isGroup)
      .map((node) => node.id);

    if (selectedGroupIds.length === 0) return;

    // Find all child nodes for each group
    selectedGroupIds.forEach((groupId) => {
      const childNodes = nodes.filter((node) => node.parentNode === groupId);

      // Update children to remove parent reference
      childNodes.forEach((child) => {
        const groupNode = nodes.find((n) => n.id === groupId);
        if (groupNode) {
          updateNode(child.id, {
            parentNode: undefined,
            extent: undefined,
            position: {
              x: child.position.x + groupNode.position.x,
              y: child.position.y + groupNode.position.y,
            },
          });
        }
      });

      // Remove the group node
      removeNode(groupId);
    });
  };

  // Handle drop event for shapes from the library
  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (reactFlowWrapper.current) {
        const reactFlowBounds =
          reactFlowWrapper.current.getBoundingClientRect();
        const type = event.dataTransfer.getData("application/reactflow");
        const jsonData = event.dataTransfer.getData("application/json");

        // Check if the dropped element is a node
        if (typeof type === "string" && type) {
          const position = reactFlowInstance!.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          // Parse the shape data
          let shapeData: any = {};
          try {
            if (jsonData) {
              shapeData = JSON.parse(jsonData);
            }
          } catch (error) {
            console.error("Error parsing shape data:", error);
          }

          // Create shape data based on dropped type
          let nodeData: ShapeNodeData | PureSVGNodeData;
          let nodeType: string;
          let backgroundColor = shapeData.backgroundColor || "#ffffff";
          let borderColor = shapeData.borderColor || "#000000";
          let borderWidth = shapeData.borderWidth || 2;
          let nodeWidth = shapeData.width || 140;
          let nodeHeight = shapeData.height || 80;

          // Use PureSVGNode for shapes to get clean rendering
          if (type.includes("shape:")) {
            const shapeType = type.split(":")[1]; // Extract shape type
            nodeType = "pureSvg";
            
            // Create SVG content based on shape type
            let svgContent = '';
            if (shapeData.svgPath) {
              svgContent = `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <path d="${shapeData.svgPath}" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}" />
                <text x="100" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${shapeData.defaultLabel || shapeData.name}</text>
              </svg>`;
            } else {
              // Fallback SVG
              svgContent = `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="180" height="80" fill="${backgroundColor}" stroke="${borderColor}" stroke-width="${borderWidth}" rx="5" />
                <text x="100" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#333">${shapeData.defaultLabel || shapeData.name}</text>
              </svg>`;
            }

            const pureSvgNodeData: PureSVGNodeData = {
              svgContent,
              label: shapeData.defaultLabel || shapeData.name || `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`,
              fill: backgroundColor,
              stroke: borderColor,
              strokeWidth: borderWidth,
            };
            nodeData = pureSvgNodeData;
          } else {
            // Fallback to regular shape node for other types
            nodeType = "shapeNode";
            nodeData = {
              label: shapeData.defaultLabel || shapeData.name || "Node",
              shape: type,
            } as ShapeNodeData;
          }

          // Create a new node with grid-snapped position
          const newNode = {
            id: `node-${uuidv4()}`,
            type: nodeType,
            position: snapToGrid
              ? {
                  x: Math.round(position.x / gridSize) * gridSize,
                  y: Math.round(position.y / gridSize) * gridSize,
                }
              : position,
            data: nodeData,
            style: {
              width: nodeWidth,
              height: nodeHeight,
              backgroundColor,
              borderColor,
              borderWidth,
              borderRadius: 5,
            },
          } as CustomNode;

          // Add the new node to the flow
          addNode(newNode);
        }
      }
    },
    [reactFlowInstance, addNode, snapToGrid, gridSize]
  );

  // Handle node drag
  const onNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      if (snapToGrid) {
        const snappedPosition = {
          x: Math.round(node.position.x / gridSize) * gridSize,
          y: Math.round(node.position.y / gridSize) * gridSize,
        };

        updateNode(node.id, { position: snappedPosition });
      }
    },
    [updateNode, snapToGrid, gridSize]
  );

  // Handle drag over to enable drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Set the correct drop effect
    event.dataTransfer.dropEffect = "copy";

    console.log("Drag over event", event.type, {
      clientX: event.clientX,
      clientY: event.clientY,
      types: Array.from(event.dataTransfer.types),
    });

    // Add visual indication of drop target to the container element
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.classList.add("drag-over");
    }
  }, []);

  // Handle drag leave
  const onDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Drag leave event", event.type);

    // Remove visual indication when leaving drop target
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.classList.remove("drag-over");
    }
  }, []);

  // Handle drag enter
  const onDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    console.log("Drag enter event", event.type);

    // Visual indication for entering the drop zone
    if (reactFlowWrapper.current) {
      reactFlowWrapper.current.classList.add("drag-enter");

      // Remove the class after a short delay
      setTimeout(() => {
        if (reactFlowWrapper.current) {
          reactFlowWrapper.current.classList.remove("drag-enter");
        }
      }, 300);
    }
  }, []);

  // Handle tool selection
  const handleToolSelect = useCallback(
    (tool: string) => {
      setSelectedTool(tool);

      if (reactFlowInstance) {
        // Enable or disable dragging based on the selected tool
        if (tool === "pan") {
          reactFlowInstance.setInteractive(false);
        } else {
          reactFlowInstance.setInteractive(true);
        }
      }
    },
    [reactFlowInstance]
  );

  // Handle zoom controls
  const handleZoomIn = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
      setZoomLevel(reactFlowInstance.getZoom());
    }
  }, [reactFlowInstance]);

  const handleZoomOut = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
      setZoomLevel(reactFlowInstance.getZoom());
    }
  }, [reactFlowInstance]);

  const handleFitView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
      setZoomLevel(reactFlowInstance.getZoom());
    }
  }, [reactFlowInstance]);

  // Handle grid toggle
  const toggleGrid = useCallback(() => {
    setShowGrid(!showGrid);
  }, [showGrid]);

  // Handle snap to grid toggle
  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(!snapToGrid);
  }, [snapToGrid]);

  // Handle mini map toggle
  const toggleMiniMap = useCallback(() => {
    setMiniMapOpen(!miniMapOpen);
  }, [miniMapOpen]);

  // Handle background color toggle
  const toggleBackgroundColor = useCallback(() => {
    setDarkBackground(!darkBackground);
  }, [darkBackground]);

  // Update grid size
  const handleGridSizeChange = useCallback((size: number) => {
    setGridSize(size);
  }, []);

  // Handle node selection
  const onSelectionChange = useCallback(
    (params: OnSelectionChangeParams) => {
      const selectedNodes = params.nodes as CustomNode[];
      const selectedEdges = params.edges as CustomEdge[];
      setSelectedElements({
        nodes: selectedNodes,
        edges: selectedEdges,
      });
    },
    [setSelectedElements]
  );

  return (
    <div className="canvas-container" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges as unknown as Edge[]}
        onNodesChange={(changes: NodeChange[]) => {
          // Handle node changes like position updates, deletions etc
          nodes.forEach(node => {
            const change = changes.find(c => 'id' in c && c.id === node.id);
            if (change && change.type === 'position' && 'position' in change) {
              updateNode(node.id, { position: change.position });
            }
          });
        }}
        onEdgesChange={(changes: EdgeChange[]) => {
          // Handle edge changes
          console.log('Edge changes:', changes);
        }}
        onConnect={onConnect}
        onInit={(instance) => {
          setReactFlowInstance(instance);
        }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDragEnter={onDragEnter}
        onSelectionChange={onSelectionChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={NODE_TYPES}
        fitView
        attributionPosition="bottom-left"
        panOnScroll={selectedTool === "pan"}
        selectionOnDrag={selectedTool === "select"}
        panOnDrag={selectedTool === "pan"}
        zoomOnScroll={true}
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Control"
        connectionMode={ConnectionMode.Loose}
        connectionLineType={ConnectionLineType.Step}
        connectionLineStyle={{
          stroke: "#1a73e8",
          strokeWidth: 2,
          strokeDasharray: "5,5",
        }}
        defaultEdgeOptions={{
          type: "step",
          style: {
            stroke: "#666666",
            strokeWidth: 2,
          },
          markerEnd: MarkerType.Arrow,
        }}
        onNodeContextMenu={(event, node) => handleContextMenu(event, node)}
        onPaneContextMenu={(event) => handleContextMenu(event, null)}
      >
        {/* Background */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color={darkBackground ? "#444" : "#eee"}
          style={{ display: showGrid ? "block" : "none" }}
        />

        {/* MiniMap */}
        {miniMapOpen && (
          <MiniMap
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              return node.selected ? "#1a73e8" : "#ddd";
            }}
            nodeBorderRadius={2}
            maskColor="rgba(0, 0, 0, 0.1)"
            className="react-flow__minimap"
            style={{
              height: 120,
              width: 160,
              right: 12,
              bottom: 12,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "6px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              opacity: 0.9,
              transition: "all 0.2s ease",
            }}
          />
        )}

        {/* Controls */}
        <Panel position="top-left" className="canvas-tools">
          <div className="tool-group">
            <button
              className={`canvas-tool ${
                selectedTool === "select" ? "active" : ""
              }`}
              onClick={() => handleToolSelect("select")}
              title="Select (V)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2"
                />
              </svg>
            </button>
            <button
              className={`canvas-tool ${
                selectedTool === "pan" ? "active" : ""
              }`}
              onClick={() => handleToolSelect("pan")}
              title="Pan (H)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z"
                />
              </svg>
            </button>
          </div>

          <div className="tool-group">
            <button
              className="canvas-tool"
              onClick={handleZoomIn}
              title="Zoom In (+)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                />
              </svg>
            </button>
            <button
              className="canvas-tool"
              onClick={handleZoomOut}
              title="Zoom Out (-)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H5V11H19V13Z" />
              </svg>
            </button>
            <button
              className="canvas-tool"
              onClick={handleFitView}
              title="Fit View (F)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M15,3L13.5,4.5L15,6V3M3,9H6L4.5,10.5L3,9M21,9V10.5L19.5,9H21M8,21V18L9.5,19.5L8,21M3,3H8V8H3V3M16,3H21V8H16V3M3,16H8V21H3V16M16,16H21V21H16V16M3,16V20H8V16H4M10,16V20H14V16H10M16,16V20H20V16H16M4,16V20H8V16H4M10,16V20H14V16H10M16,16V20H20V16H16Z"
                />
              </svg>
            </button>
          </div>

          <div className="tool-group">
            <button
              className={`canvas-tool ${showGrid ? "active" : ""}`}
              onClick={toggleGrid}
              title="Toggle Grid (G)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,4V8H8V4H4M10,4V8H14V4H10M16,4V8H20V4H16M4,10V14H8V10H4M10,10V14H14V10H10M16,10V14H20V10H16M4,16V20H8V16H4M10,16V20H14V16H10M16,16V20H20V16H16M4,16V20H8V16H4M10,16V20H14V16H10M16,16V20H20V16H16Z"
                />
              </svg>
            </button>
            <button
              className={`canvas-tool ${snapToGrid ? "active" : ""}`}
              onClick={toggleSnapToGrid}
              title="Toggle Snap (S)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M2,2V4H4V2H2M6,2V4H8V2H6M10,2V4H12V2H10M14,2V4H16V2H14M18,2V4H20V2H18M22,2V4H24V2H22M2,6V8H4V6H2M18,6V8H20V6H18M22,6V8H24V6H22M2,10V12H4V10H2M6,10V12H8V10H6M10,10V12H12V10H10M14,10V12H16V10H14M18,10V12H20V10H18M22,10V12H24V10H22M2,14V16H4V14H2M6,14V16H8V14H6M10,14V16H12V14H10M14,14V16H16V14H14M18,14V16H20V14H18M22,14V16H24V14H22M2,18V20H4V18H2M6,18V20H8V18H6M10,18V20H12V18H10M14,18V20H16V18H14M18,18V20H20V18H18M22,18V20H24V18H22M2,22V24H4V22H2M6,22V24H8V22H6M10,22V24H12V22H10M14,22V24H16V22H14M18,22V24H20V22H18M22,22V24H24V22H22Z"
                />
              </svg>
            </button>
            <button
              className={`canvas-tool ${miniMapOpen ? "active" : ""}`}
              onClick={toggleMiniMap}
              title="Toggle Mini Map (M)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3Z"
                />
              </svg>
            </button>
            <button
              className={`canvas-tool ${darkBackground ? "active" : ""}`}
              onClick={toggleBackgroundColor}
              title="Toggle Background (B)"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M19,16V13H15.5C14.23,13 13.13,13.77 12.73,14.91L12,16.82L11.23,14.89C10.81,13.77 9.74,13 8.5,13H5V16H8.5C8.55,16 8.61,16.03 8.65,16.07L12,22L15.35,16.07C15.39,16.03 15.45,16 15.5,16H19Z"
                />
              </svg>
            </button>
          </div>

          <div className="tool-group">
            <button
              className="canvas-tool"
              onClick={handleBringToFront}
              title="Bring to Front"
              disabled={selectedElements.nodes.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M2,2H16V16H2V2M22,8V22H8V18H18V8H22Z"
                />
              </svg>
            </button>
            <button
              className="canvas-tool"
              onClick={handleSendToBack}
              title="Send to Back"
              disabled={selectedElements.nodes.length === 0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M2,2H16V16H2V2M22,8V22H8V18H18V8H22Z"
                />
              </svg>
            </button>
          </div>

          <div className="tool-group">
            <button
              className="canvas-tool"
              onClick={groupSelectedNodes}
              title="Group (Ctrl+G)"
              disabled={selectedElements.nodes.length < 2}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z"
                />
              </svg>
            </button>
            <button
              className="canvas-tool"
              onClick={ungroupSelectedNodes}
              title="Ungroup (Ctrl+Shift+G)"
              disabled={!selectedElements.nodes.some((n) => n.data?.isGroup)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M11,13H21V11H11M11,9H21V7H11M3,5V9H7V5H3M5,7V7.9H5M11,17H21V15H11M3,11V15H7V11H3M5,13V13.9H5M3,17V21H7V17H3M5,19V19.9H5Z"
                />
              </svg>
            </button>
          </div>
        </Panel>

        <Panel position="top-right" className="canvas-status">
          <div className="zoom-level">Zoom: {Math.round(zoomLevel * 100)}%</div>
          <div className="grid-size">
            Grid:
            <select
              value={gridSize}
              onChange={(e) => handleGridSizeChange(Number(e.target.value))}
              className="grid-size-select"
            >
              <option value="10">10px</option>
              <option value="20">20px</option>
              <option value="40">40px</option>
              <option value="50">50px</option>
              <option value="100">100px</option>
            </select>
          </div>
        </Panel>

        <Controls showInteractive={false} />
      </ReactFlow>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
          }}
        >
          <ul>
            {contextMenu.nodeId ? (
              // Node context menu
              <>
                <li onClick={() => handleContextMenuAction("cut")}>Cut</li>
                <li onClick={() => handleContextMenuAction("copy")}>Copy</li>
                <li onClick={() => handleContextMenuAction("delete")}>
                  Delete
                </li>
                <li className="divider"></li>
                <li onClick={() => handleContextMenuAction("bringToFront")}>
                  Bring to Front
                </li>
                <li onClick={() => handleContextMenuAction("sendToBack")}>
                  Send to Back
                </li>
              </>
            ) : (
              // Canvas context menu
              <>
                <li onClick={() => handleContextMenuAction("paste")}>Paste</li>
                <li onClick={() => handleContextMenuAction("selectAll")}>
                  Select All
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnhancedCanvas;
