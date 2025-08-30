import React, { useState } from "react";
import "./LeftPanel.css";
import ShapeLibrary from "../ShapeLibrary/ShapeLibrary";
import { Shape } from "../../types/shapes";
import MermaidDiagramModal from "../Modal/MermaidDiagramModal";
import Button from "../Button/Button";
import { 
  RiPlayFill, 
  RiCircleFill, 
  RiSquareFill, 
  RiFileTextFill, 
  RiHexagonFill, 
  RiVipDiamondFill, 
  RiDatabaseFill, 
  RiCloudFill,
  RiArrowRightFill,
  RiArrowUpDownFill,
  RiArrowLeftRightFill,
  RiMenuFill,
  RiAddFill
} from "react-icons/ri";

// Tab type
type TabType = "shapes" | "templates" | "favorites" | "connections";

// Shape library configuration
const shapeLibrary = {
  terminal: {
    title: "Terminal",
    icon: <RiPlayFill />,
    shapes: [
      { id: 'stadium', name: 'Stadium', icon: <RiCircleFill />, usage: 'Start/End processes', defaultLabel: 'Start/End' },
      { id: 'circle', name: 'Circle', icon: <RiCircleFill />, usage: 'Terminal points', defaultLabel: 'Terminal' }
    ],
    dragData: { type: 'terminal' }
  },
  process: {
    title: "Process",
    icon: <RiSquareFill />,
    shapes: [
      { id: 'rectangle', name: 'Rectangle', icon: <RiSquareFill />, usage: 'Processing steps', defaultLabel: 'Process Step' },
      { id: 'rounded-rectangle', name: 'Rounded Rectangle', icon: <RiSquareFill />, usage: 'Calculations, transformations', defaultLabel: 'Calculation' },
      { id: 'hexagon', name: 'Hexagon', icon: <RiHexagonFill />, usage: 'Special processes', defaultLabel: 'Special Process' }
    ],
    dragData: { type: 'process' }
  },
  decision: {
    title: "Decision",
    icon: <RiVipDiamondFill />,
    shapes: [
      { id: 'diamond', name: 'Diamond', icon: <RiVipDiamondFill />, usage: 'Conditional logic, branching', defaultLabel: 'Decision?' },
      { id: 'rhombus', name: 'Rhombus', icon: <RiVipDiamondFill />, usage: 'Alternative decisions', defaultLabel: 'Alternative?' }
    ],
    dragData: { type: 'decision' }
  },
  data: {
    title: "Data",
    icon: <RiDatabaseFill />,
    shapes: [
      { id: 'parallelogram', name: 'Parallelogram', icon: <RiFileTextFill />, usage: 'Data input/output', defaultLabel: 'Data I/O' },
      { id: 'cylinder', name: 'Cylinder', icon: <RiDatabaseFill />, usage: 'Database operations', defaultLabel: 'Database' },
      { id: 'document', name: 'Document', icon: <RiFileTextFill />, usage: 'File operations', defaultLabel: 'File' }
    ],
    dragData: { type: 'data' }
  },
  cloud: {
    title: "External",
    icon: <RiCloudFill />,
    shapes: [
      { id: 'cloud', name: 'Cloud', icon: <RiCloudFill />, usage: 'External services', defaultLabel: 'External Service' },
      { id: 'service', name: 'Service', icon: <RiCloudFill />, usage: 'API calls', defaultLabel: 'API Call' }
    ],
    dragData: { type: 'cloud' }
  }
};

// Connection types
const connectionTypes = [
  { id: 'solid', name: 'Solid Arrow', icon: <RiArrowRightFill />, style: 'solid' },
  { id: 'dotted', name: 'Dotted Arrow', icon: <RiMenuFill />, style: 'dotted' },
  { id: 'thick', name: 'Thick Arrow', icon: <RiArrowRightFill />, style: 'thick' },
  { id: 'bidirectional', name: 'Bidirectional', icon: <RiArrowLeftRightFill />, style: 'bidirectional' },
  { id: 'vertical', name: 'Vertical', icon: <RiArrowUpDownFill />, style: 'vertical' }
];

const LeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("shapes");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMermaidModalOpen, setIsMermaidModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    terminal: true,
    process: true,
    decision: false,
    data: false,
    cloud: false
  });
  const [selectedConnectionType, setSelectedConnectionType] = useState('solid');

  // Handle shape selection
  const handleShapeSelect = (shape: Shape) => {
    console.log("Shape selected:", shape);
  };

  // Handle shape drag start
  const handleShapeDragStart = (shape: any, event: React.DragEvent) => {
    console.log("Shape drag started:", shape);

    // Reset the dataTransfer object first
    event.dataTransfer.clearData();

    // Set the drag data for the shape
    try {
      const shapeData = JSON.stringify({
        id: shape.id,
        name: shape.name,
        type: shape.type || 'shape',
        defaultLabel: shape.defaultLabel || shape.name,
        category: shape.category
      });
      
      event.dataTransfer.setData("application/json", shapeData);
      event.dataTransfer.setData("text/plain", shapeData);
      event.dataTransfer.setData("application/reactflow", `shape:${shape.id}`);

      // Set drag image
      if (shape.icon) {
        const tempElement = document.createElement("div");
        tempElement.innerHTML = `<div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: white; border: 1px solid #ccc; border-radius: 4px;">${shape.name}</div>`;
        tempElement.style.position = "fixed";
        tempElement.style.top = "0";
        tempElement.style.left = "0";
        tempElement.style.zIndex = "9999";
        tempElement.style.pointerEvents = "none";
        document.body.appendChild(tempElement);

        event.dataTransfer.setDragImage(tempElement, 20, 20);

          setTimeout(() => {
            if (document.body.contains(tempElement)) {
              document.body.removeChild(tempElement);
            }
          }, 100);
      }

      event.dataTransfer.effectAllowed = "copy";
    } catch (error) {
      console.error("Error setting drag data:", error);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Toggle panel collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle connection type selection
  const handleConnectionTypeSelect = (type: string) => {
    setSelectedConnectionType(type);
    // You can emit this to the canvas to change the default connection style
  };

  // Render shape category
  const renderShapeCategory = (categoryKey: string, category: any) => {
    const isExpanded = expandedCategories[categoryKey];
    
    return (
      <div key={categoryKey} className="shape-category">
        <div 
          className="category-header"
          onClick={() => toggleCategory(categoryKey)}
        >
          <div className="category-title">
            <span className="category-icon">{category.icon}</span>
            <span>{category.title}</span>
          </div>
          <span className={`category-arrow ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>
        
        {isExpanded && (
          <div className="shapes-grid">
            {category.shapes.map((shape: any) => (
              <div
                key={shape.id}
                className="shape-item"
                draggable
                onDragStart={(e) => handleShapeDragStart({ ...shape, category: categoryKey }, e)}
                onClick={() => handleShapeSelect(shape)}
                title={shape.usage}
              >
                <div className="shape-icon">{shape.icon}</div>
                <div className="shape-name">{shape.name}</div>
                <div className="shape-usage">{shape.usage}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render connection types
  const renderConnectionTypes = () => {
    return (
      <div className="connection-types">
        <h3>Connection Types</h3>
        <div className="connection-grid">
          {connectionTypes.map((conn) => (
            <div
              key={conn.id}
              className={`connection-item ${selectedConnectionType === conn.id ? 'selected' : ''}`}
              onClick={() => handleConnectionTypeSelect(conn.id)}
              title={conn.name}
            >
              <div className="connection-icon">{conn.icon}</div>
              <div className="connection-name">{conn.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "shapes":
        return (
          <div className="shapes-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search shapes..."
                className="search-input"
              />
            </div>
            
            <div className="shape-categories">
              {Object.entries(shapeLibrary).map(([key, category]) => 
                renderShapeCategory(key, category)
              )}
            </div>
          </div>
        );
        
      case "connections":
        return renderConnectionTypes();
        
      case "templates":
        return (
          <div className="templates-container">
            <h3>Templates</h3>
            <div className="mermaid-generator-section">
              <h4>AI Workflow Generator</h4>
              <p>Generate complete workflows from natural language descriptions using AI.</p>
              <Button onClick={() => setIsMermaidModalOpen(true)} variant="primary">
                Generate Workflow
              </Button>
            </div>
            <div className="template-list">
              <div className="template-item">
                <div className="template-preview">🔄</div>
                <div className="template-name">Order Processing</div>
                <div className="template-desc">Customer order workflow</div>
              </div>
              <div className="template-item">
                <div className="template-preview">📊</div>
                <div className="template-name">Data Pipeline</div>
                <div className="template-desc">ETL workflow</div>
              </div>
              <div className="template-item">
                <div className="template-preview">✅</div>
                <div className="template-name">Approval Process</div>
                <div className="template-desc">Multi-step approval</div>
              </div>
              <div className="template-item">
                <div className="template-preview">🤖</div>
                <div className="template-name">Automation</div>
                <div className="template-desc">Task automation</div>
              </div>
            </div>
          </div>
        );
        
      case "favorites":
        return (
          <div className="favorites-container">
            <h3>Favorites</h3>
            <p>Your frequently used shapes and templates will appear here.</p>
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
    <>
      <div className={`left-panel ${isCollapsed ? "collapsed" : ""}`}>
        <div className="panel-header">
          {!isCollapsed && <h2>Workflow Library</h2>}
          <button
            className="collapse-button"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
            title={isCollapsed ? "Expand panel" : "Collapse panel"}
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
                title="Shapes"
              >
                <RiSquareFill />
                <span>Shapes</span>
              </button>
              <button
                className={`panel-tab ${activeTab === "connections" ? "active" : ""}`}
                onClick={() => setActiveTab("connections")}
                title="Connections"
              >
                <RiArrowRightFill />
                <span>Lines</span>
              </button>
              <button
                className={`panel-tab ${activeTab === "templates" ? "active" : ""}`}
                onClick={() => setActiveTab("templates")}
                title="Templates"
              >
                <RiFileTextFill />
                <span>Templates</span>
              </button>
              <button
                className={`panel-tab ${activeTab === "favorites" ? "active" : ""}`}
                onClick={() => setActiveTab("favorites")}
                title="Favorites"
              >
                <RiAddFill />
                <span>Favorites</span>
              </button>
            </div>

            <div className="panel-content">{renderTabContent()}</div>
          </>
        )}
      </div>
      
      <MermaidDiagramModal 
        isOpen={isMermaidModalOpen} 
        onClose={() => setIsMermaidModalOpen(false)} 
      />
    </>
  );
};

export default LeftPanel;
