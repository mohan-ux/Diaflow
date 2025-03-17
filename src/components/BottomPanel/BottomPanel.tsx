import React, { useState } from "react";
import "./BottomPanel.css";

const BottomPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState("style");

  // Mock selected element data (will be replaced with actual state management)
  const selectedElement = {
    type: "Rectangle",
    id: "rect-1",
    properties: {
      width: 120,
      height: 80,
      fill: "#4a6ee0",
      stroke: "#333333",
      strokeWidth: 1,
      text: "Sample Text",
      fontSize: 14,
      fontFamily: "Arial",
      borderRadius: 4,
    },
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`bottom-panel ${isExpanded ? "expanded" : "collapsed"}`}>
      <div className="panel-header">
        <h3>Properties: {selectedElement.type}</h3>
        <button className="toggle-button" onClick={toggleExpand}>
          {isExpanded ? "▼" : "▲"}
        </button>
      </div>

      {isExpanded && (
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
          </div>

          <div className="properties-container">
            {activeTab === "style" && (
              <div className="property-group">
                <div className="property-row">
                  <label>Fill Color</label>
                  <input type="color" value={selectedElement.properties.fill} />
                </div>
                <div className="property-row">
                  <label>Border Color</label>
                  <input
                    type="color"
                    value={selectedElement.properties.stroke}
                  />
                </div>
                <div className="property-row">
                  <label>Border Width</label>
                  <input
                    type="number"
                    value={selectedElement.properties.strokeWidth}
                    min="0"
                    max="10"
                  />
                </div>
                <div className="property-row">
                  <label>Border Radius</label>
                  <input
                    type="number"
                    value={selectedElement.properties.borderRadius}
                    min="0"
                    max="50"
                  />
                </div>
                <div className="property-row">
                  <label>Width</label>
                  <input
                    type="number"
                    value={selectedElement.properties.width}
                    min="10"
                    max="500"
                  />
                </div>
                <div className="property-row">
                  <label>Height</label>
                  <input
                    type="number"
                    value={selectedElement.properties.height}
                    min="10"
                    max="500"
                  />
                </div>
              </div>
            )}

            {activeTab === "text" && (
              <div className="property-group">
                <div className="property-row">
                  <label>Text</label>
                  <input type="text" value={selectedElement.properties.text} />
                </div>
                <div className="property-row">
                  <label>Font Size</label>
                  <input
                    type="number"
                    value={selectedElement.properties.fontSize}
                    min="8"
                    max="72"
                  />
                </div>
                <div className="property-row">
                  <label>Font Family</label>
                  <select value={selectedElement.properties.fontFamily}>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
              </div>
            )}

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
                  <label>Animation</label>
                  <select>
                    <option value="none">None</option>
                    <option value="pulse">Pulse</option>
                    <option value="bounce">Bounce</option>
                    <option value="fade">Fade</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BottomPanel;
