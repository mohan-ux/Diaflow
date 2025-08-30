import React, { useState, useEffect } from "react";
import useFlowStore from "../../store/useFlowStore";
import "./BottomPanel.css";

const BottomPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("style");

  // Get store data
  const { selectedElements, updateNode, updateEdge } =
    useFlowStore();

  const hasSelection =
    selectedElements.nodes.length > 0 || selectedElements.edges.length > 0;
  const isMultipleSelection =
    selectedElements.nodes.length + selectedElements.edges.length > 1;

  // Get the first selected element (node or edge)
  const selectedNode = selectedElements.nodes[0];
  const selectedEdge = selectedElements.edges[0];
  // Removed unused variable selectedElement

  // Local state for property values
  const [properties, setProperties] = useState<any>({});

  // Update local state when selection changes
  useEffect(() => {
    if (selectedNode) {
      setProperties({
        type: selectedNode.type || "node",
        id: selectedNode.id,
        label: selectedNode.data?.label || "",
        position: selectedNode.position,
        width: selectedNode.style?.width || 150,
        height: selectedNode.style?.height || 80,
        backgroundColor: selectedNode.style?.backgroundColor || "#ffffff",
        borderColor: selectedNode.style?.borderColor || "#000000",
        borderWidth: selectedNode.style?.borderWidth || 1,
        borderRadius: selectedNode.style?.borderRadius || 4,
        fontSize: selectedNode.style?.fontSize || 12,
        fontFamily: selectedNode.style?.fontFamily || "Arial",
        textAlign: selectedNode.style?.textAlign || "center",
        zIndex: selectedNode.zIndex || 0,
      });
    } else if (selectedEdge) {
      setProperties({
        type: selectedEdge.type || "default",
        id: selectedEdge.id,
        label: selectedEdge.label || "",
        source: selectedEdge.source,
        target: selectedEdge.target,
        animated: selectedEdge.animated || false,
        strokeColor: selectedEdge.style?.strokeColor || "#000000",
        strokeWidth: selectedEdge.style?.strokeWidth || 1,
        dashed: selectedEdge.style?.dashed || false,
      });
    } else {
      setProperties({});
    }
  }, [selectedNode, selectedEdge]);

  // Handle property changes
  const handlePropertyChange = (property: string, value: any) => {
    setProperties({
      ...properties,
      [property]: value,
    });

    // Update node in the store
    if (selectedNode) {
      if (property === "label") {
        updateNode(selectedNode.id, {
          data: { ...selectedNode.data, label: value },
        });
      } else if (
        [
          "backgroundColor",
          "borderColor",
          "borderWidth",
          "borderRadius",
          "fontSize",
          "fontFamily",
        ].includes(property)
      ) {
        updateNode(selectedNode.id, {
          style: { ...selectedNode.style, [property]: value },
        });
      }
    }
    // Update edge in the store
    else if (selectedEdge) {
      if (property === "label") {
        updateEdge(selectedEdge.id, { label: value });
      } else if (["strokeColor", "strokeWidth", "dashed"].includes(property)) {
        updateEdge(selectedEdge.id, {
          style: { ...selectedEdge.style, [property]: value },
        });
      } else if (property === "animated") {
        updateEdge(selectedEdge.id, { animated: value });
      }
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get selection title
  const getSelectionTitle = () => {
    if (!hasSelection) return "No Selection";
    if (isMultipleSelection)
      return `Multiple Elements (${
        selectedElements.nodes.length + selectedElements.edges.length
      })`;
    if (selectedNode)
      return `Node: ${selectedNode.data?.label || selectedNode.id}`;
    if (selectedEdge)
      return `Connection: ${selectedEdge.source} → ${selectedEdge.target}`;
    return "Selection";
  };

  return (
    <div className={`bottom-panel ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="panel-header">
        <h3>{getSelectionTitle()}</h3>
        <div className="panel-controls">
          {hasSelection && (
            <button className="lock-button" title="Lock selection">
              🔒
            </button>
          )}
          <button className="toggle-button" onClick={toggleExpand}>
            {isExpanded ? "▼" : "▲"}
          </button>
        </div>
      </div>

      {isExpanded && hasSelection && (
        <>
          <div className="property-tabs">
            <button
              className={`property-tab ${
                activeTab === "style" ? "active" : ""
              }`}
              onClick={() => setActiveTab("style")}
            >
              Style
            </button>
            <button
              className={`property-tab ${activeTab === "text" ? "active" : ""}`}
              onClick={() => setActiveTab("text")}
            >
              Text
            </button>
            <button
              className={`property-tab ${
                activeTab === "behavior" ? "active" : ""
              }`}
              onClick={() => setActiveTab("behavior")}
            >
              Behavior
            </button>
            <button
              className={`property-tab ${
                activeTab === "advanced" ? "active" : ""
              }`}
              onClick={() => setActiveTab("advanced")}
            >
              Advanced
            </button>
          </div>

          <div className="properties-container">
            {/* Style Tab */}
            {activeTab === "style" && selectedNode && (
              <div className="property-group">
                <div className="property-row">
                  <label>Fill Color</label>
                  <input
                    type="color"
                    value={properties.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      handlePropertyChange("backgroundColor", e.target.value)
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Border Color</label>
                  <input
                    type="color"
                    value={properties.borderColor || "#000000"}
                    onChange={(e) =>
                      handlePropertyChange("borderColor", e.target.value)
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Border Width</label>
                  <input
                    type="number"
                    value={properties.borderWidth || 1}
                    min="0"
                    max="10"
                    onChange={(e) =>
                      handlePropertyChange(
                        "borderWidth",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Border Radius</label>
                  <input
                    type="number"
                    value={properties.borderRadius || 0}
                    min="0"
                    max="50"
                    onChange={(e) =>
                      handlePropertyChange(
                        "borderRadius",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Width</label>
                  <input
                    type="number"
                    value={properties.width || 150}
                    min="10"
                    max="500"
                    onChange={(e) =>
                      handlePropertyChange("width", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Height</label>
                  <input
                    type="number"
                    value={properties.height || 80}
                    min="10"
                    max="500"
                    onChange={(e) =>
                      handlePropertyChange("height", parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            )}

            {/* Style Tab for Edges */}
            {activeTab === "style" && selectedEdge && (
              <div className="property-group">
                <div className="property-row">
                  <label>Line Color</label>
                  <input
                    type="color"
                    value={properties.strokeColor || "#000000"}
                    onChange={(e) =>
                      handlePropertyChange("strokeColor", e.target.value)
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Line Width</label>
                  <input
                    type="number"
                    value={properties.strokeWidth || 1}
                    min="1"
                    max="10"
                    onChange={(e) =>
                      handlePropertyChange(
                        "strokeWidth",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="property-row checkbox-row">
                  <label>Dashed Line</label>
                  <input
                    type="checkbox"
                    checked={properties.dashed || false}
                    onChange={(e) =>
                      handlePropertyChange("dashed", e.target.checked)
                    }
                  />
                </div>
                <div className="property-row checkbox-row">
                  <label>Animated</label>
                  <input
                    type="checkbox"
                    checked={properties.animated || false}
                    onChange={(e) =>
                      handlePropertyChange("animated", e.target.checked)
                    }
                  />
                </div>
              </div>
            )}

            {/* Text Tab */}
            {activeTab === "text" && selectedNode && (
              <div className="property-group">
                <div className="property-row">
                  <label>Label</label>
                  <input
                    type="text"
                    value={properties.label || ""}
                    onChange={(e) =>
                      handlePropertyChange("label", e.target.value)
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Font Size</label>
                  <input
                    type="number"
                    value={properties.fontSize || 12}
                    min="8"
                    max="72"
                    onChange={(e) =>
                      handlePropertyChange("fontSize", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="property-row">
                  <label>Font Family</label>
                  <select
                    value={properties.fontFamily || "Arial"}
                    onChange={(e) =>
                      handlePropertyChange("fontFamily", e.target.value)
                    }
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Trebuchet MS">Trebuchet MS</option>
                  </select>
                </div>
                <div className="property-row">
                  <label>Text Align</label>
                  <select
                    value={properties.textAlign || "center"}
                    onChange={(e) =>
                      handlePropertyChange("textAlign", e.target.value)
                    }
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
            )}

            {/* Text Tab for Edges */}
            {activeTab === "text" && selectedEdge && (
              <div className="property-group">
                <div className="property-row">
                  <label>Label</label>
                  <input
                    type="text"
                    value={properties.label || ""}
                    onChange={(e) =>
                      handlePropertyChange("label", e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* Behavior Tab */}
            {activeTab === "behavior" && (
              <div className="property-group">
                <div className="property-row">
                  <label>Link URL</label>
                  <input type="text" placeholder="https://example.com" />
                </div>
                <div className="property-row">
                  <label>Tooltip</label>
                  <input type="text" placeholder="Enter tooltip text" />
                </div>
                <div className="property-row">
                  <label>On Click Action</label>
                  <select>
                    <option value="none">None</option>
                    <option value="open-url">Open URL</option>
                    <option value="run-script">Run Script</option>
                    <option value="toggle-visibility">Toggle Visibility</option>
                  </select>
                </div>
                <div className="property-row checkbox-row">
                  <label>Draggable</label>
                  <input type="checkbox" checked />
                </div>
                <div className="property-row checkbox-row">
                  <label>Selectable</label>
                  <input type="checkbox" checked />
                </div>
              </div>
            )}

            {/* Advanced Tab */}
            {activeTab === "advanced" && (
              <div className="property-group">
                <div className="property-row">
                  <label>ID</label>
                  <input type="text" value={properties.id || ""} disabled />
                </div>
                {selectedNode && (
                  <>
                    <div className="property-row">
                      <label>Position X</label>
                      <input
                        type="number"
                        value={Math.round(properties.position?.x || 0)}
                        onChange={(e) => {
                          const newPos = {
                            ...properties.position,
                            x: parseInt(e.target.value),
                          };
                          handlePropertyChange("position", newPos);
                        }}
                      />
                    </div>
                    <div className="property-row">
                      <label>Position Y</label>
                      <input
                        type="number"
                        value={Math.round(properties.position?.y || 0)}
                        onChange={(e) => {
                          const newPos = {
                            ...properties.position,
                            y: parseInt(e.target.value),
                          };
                          handlePropertyChange("position", newPos);
                        }}
                      />
                    </div>
                    <div className="property-row">
                      <label>Z-Index</label>
                      <input
                        type="number"
                        value={properties.zIndex || 0}
                        min="0"
                        max="1000"
                        onChange={(e) =>
                          handlePropertyChange(
                            "zIndex",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </>
                )}
                {selectedEdge && (
                  <>
                    <div className="property-row">
                      <label>Source</label>
                      <input
                        type="text"
                        value={properties.source || ""}
                        disabled
                      />
                    </div>
                    <div className="property-row">
                      <label>Target</label>
                      <input
                        type="text"
                        value={properties.target || ""}
                        disabled
                      />
                    </div>
                  </>
                )}
                <div className="property-row">
                  <label>Type</label>
                  <input type="text" value={properties.type || ""} disabled />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {isExpanded && !hasSelection && (
        <div className="no-selection-message">
          <p>Select a node or edge to edit its properties</p>
        </div>
      )}
    </div>
  );
};

export default BottomPanel;
