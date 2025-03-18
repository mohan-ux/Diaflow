import React, { useState } from "react";
import "./LeftPanel.css";
import ShapeLibrary from "../ShapeLibrary/ShapeLibrary";
import { Shape } from "../../types/shapes";

// Tab type
type TabType = "shapes" | "templates" | "favorites";

const LeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("shapes");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle shape selection
  const handleShapeSelect = (shape: Shape) => {
    console.log("Shape selected:", shape);
    // In a real implementation, this would update the canvas or application state
  };

  // Handle shape drag start
  const handleShapeDragStart = (shape: Shape, event: React.DragEvent) => {
    console.log("Shape drag started:", shape);

    // IMPORTANT: Reset the dataTransfer object first
    event.dataTransfer.clearData();

    // Set the drag data for the shape using multiple formats for compatibility
    try {
      const shapeData = JSON.stringify(shape);
      console.log("Setting drag data:", shapeData);

      // Set multiple formats for better compatibility
      event.dataTransfer.setData("application/json", shapeData);
      event.dataTransfer.setData("text/plain", shapeData);

      // Create a simple version for basic compatibility
      const simpleData = JSON.stringify({
        id: shape.id,
        name: shape.name,
        category: shape.category,
      });
      event.dataTransfer.setData("application/diaflow", simpleData);

      // Set a debug format to confirm data is set
      event.dataTransfer.setData("text/debug", "drag-data-set");

      // Verify the data was actually set
      setTimeout(() => {
        try {
          const types = event.dataTransfer.types;
          console.log("DataTransfer types:", types);
          if (types.includes("application/json")) {
            console.log("JSON data successfully set");
          } else {
            console.warn("JSON data NOT set correctly!");
          }
        } catch (err) {
          console.error("Error verifying drag data:", err);
        }
      }, 0);
    } catch (error) {
      console.error("Error setting drag data:", error);
    }

    // Set the drag image with more robust error handling
    if (shape.svg) {
      try {
        // Create a temporary element to render the SVG for the drag image
        const tempElement = document.createElement("div");
        tempElement.innerHTML = shape.svg;
        tempElement.style.position = "fixed";
        tempElement.style.top = "0";
        tempElement.style.left = "0";
        tempElement.style.width = "50px";
        tempElement.style.height = "50px";
        tempElement.style.backgroundColor = "#fff";
        tempElement.style.border = "1px solid #ccc";
        tempElement.style.padding = "5px";
        tempElement.style.zIndex = "9999";
        tempElement.style.pointerEvents = "none";
        tempElement.style.display = "block";
        document.body.appendChild(tempElement);

        const svgElement = tempElement.querySelector("svg");
        if (svgElement) {
          // Set the size of the SVG for the drag image
          svgElement.setAttribute("width", "40");
          svgElement.setAttribute("height", "40");
          svgElement.style.display = "block";

          // Set the drag image
          event.dataTransfer.setDragImage(tempElement, 25, 25);
          console.log("Drag image set successfully");

          // Clean up after a short delay
          setTimeout(() => {
            if (document.body.contains(tempElement)) {
              document.body.removeChild(tempElement);
            }
          }, 100);
        } else {
          console.warn("SVG element not found in shape.svg");
        }
      } catch (error) {
        console.error("Error setting drag image:", error);
      }
    }

    // Set the effect to copy
    event.dataTransfer.effectAllowed = "copy";
    console.log("Drag effect set to:", event.dataTransfer.effectAllowed);
  };

  // Toggle panel collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "shapes":
        return (
          <ShapeLibrary
            onShapeSelect={handleShapeSelect}
            onShapeDragStart={handleShapeDragStart}
          />
        );
      case "templates":
        return (
          <div className="templates-container">
            <h3>Templates</h3>
            <p>Diagram templates will appear here.</p>
            <div className="template-list">
              <div className="template-item">
                <div className="template-preview">Flow Chart</div>
                <div className="template-name">Basic Flow Chart</div>
              </div>
              <div className="template-item">
                <div className="template-preview">Mind Map</div>
                <div className="template-name">Brain Storming</div>
              </div>
              <div className="template-item">
                <div className="template-preview">UML</div>
                <div className="template-name">Class Diagram</div>
              </div>
            </div>
          </div>
        );
      case "favorites":
        return (
          <div className="favorites-container">
            <h3>Favorites</h3>
            <p>Your favorite shapes and templates will appear here.</p>
            <div className="empty-favorites">
              <p>You haven't saved any favorites yet.</p>
              <button className="add-favorite-btn">
                Add Shapes to Favorites
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`left-panel ${isCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <h2>Library</h2>
        <button
          className="collapse-button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="panel-tabs">
            <button
              className={`panel-tab ${activeTab === "shapes" ? "active" : ""}`}
              onClick={() => setActiveTab("shapes")}
            >
              Shapes
            </button>
            <button
              className={`panel-tab ${
                activeTab === "templates" ? "active" : ""
              }`}
              onClick={() => setActiveTab("templates")}
            >
              Templates
            </button>
            <button
              className={`panel-tab ${
                activeTab === "favorites" ? "active" : ""
              }`}
              onClick={() => setActiveTab("favorites")}
            >
              Favorites
            </button>
          </div>

          <div className="panel-content">{renderTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default LeftPanel;
