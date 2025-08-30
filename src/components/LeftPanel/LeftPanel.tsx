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

// Enhanced shape library configuration with proper SVG definitions
const shapeLibrary = {
  terminal: {
    title: "Terminal",
    icon: <RiPlayFill />,
    shapes: [
      { 
        id: 'stadium', 
        name: 'Stadium', 
        icon: <RiCircleFill />, 
        usage: 'Start/End processes', 
        defaultLabel: 'Start/End',
        svgPath: 'M20,50 Q20,20 50,20 L150,20 Q180,20 180,50 L180,150 Q180,180 150,180 L50,180 Q20,180 20,150 Z',
        width: 120,
        height: 80
      },
      { 
        id: 'circle', 
        name: 'Circle', 
        icon: <RiCircleFill />, 
        usage: 'Terminal points', 
        defaultLabel: 'Terminal',
        svgPath: 'M50,50 m-40,0 a40,40 0 1,0 80,0 a40,40 0 1,0 -80,0',
        width: 100,
        height: 100
      }
    ],
    dragData: { type: 'terminal' }
  },
  process: {
    title: "Process",
    icon: <RiSquareFill />,
    shapes: [
      { 
        id: 'rectangle', 
        name: 'Rectangle', 
        icon: <RiSquareFill />, 
        usage: 'Processing steps', 
        defaultLabel: 'Process Step',
        svgPath: 'M10,10 L190,10 L190,90 L10,90 Z',
        width: 140,
        height: 80
      },
      { 
        id: 'rounded-rectangle', 
        name: 'Rounded Rectangle', 
        icon: <RiSquareFill />, 
        usage: 'Calculations, transformations', 
        defaultLabel: 'Calculation',
        svgPath: 'M10,20 Q10,10 20,10 L180,10 Q190,10 190,20 L190,80 Q190,90 180,90 L20,90 Q10,90 10,80 Z',
        width: 140,
        height: 80
      },
      { 
        id: 'hexagon', 
        name: 'Hexagon', 
        icon: <RiHexagonFill />, 
        usage: 'Special processes', 
        defaultLabel: 'Special Process',
        svgPath: 'M50,10 L150,10 L180,50 L150,90 L50,90 L20,50 Z',
        width: 140,
        height: 80
      }
    ],
    dragData: { type: 'process' }
  },
  decision: {
    title: "Decision",
    icon: <RiVipDiamondFill />,
    shapes: [
      { 
        id: 'diamond', 
        name: 'Diamond', 
        icon: <RiVipDiamondFill />, 
        usage: 'Conditional logic, branching', 
        defaultLabel: 'Decision?',
        svgPath: 'M100,10 L190,50 L100,90 L10,50 Z',
        width: 140,
        height: 80
      },
      { 
        id: 'rhombus', 
        name: 'Rhombus', 
        icon: <RiVipDiamondFill />, 
        usage: 'Alternative decisions', 
        defaultLabel: 'Alternative?',
        svgPath: 'M100,10 L190,50 L100,90 L10,50 Z',
        width: 140,
        height: 80
      }
    ],
    dragData: { type: 'decision' }
  },
  data: {
    title: "Data",
    icon: <RiDatabaseFill />,
    shapes: [
      { 
        id: 'parallelogram', 
        name: 'Parallelogram', 
        icon: <RiFileTextFill />, 
        usage: 'Data input/output', 
        defaultLabel: 'Data I/O',
        svgPath: 'M30,10 L170,10 L150,90 L10,90 Z',
        width: 140,
        height: 80
      },
      { 
        id: 'cylinder', 
        name: 'Cylinder', 
        icon: <RiDatabaseFill />, 
        usage: 'Database operations', 
        defaultLabel: 'Database',
        svgPath: 'M20,30 Q20,20 50,20 L150,20 Q180,20 180,30 L180,70 Q180,80 150,80 L50,80 Q20,80 20,70 Z M20,30 L20,70',
        width: 140,
        height: 80
      },
      { 
        id: 'document', 
        name: 'Document', 
        icon: <RiFileTextFill />, 
        usage: 'File operations', 
        defaultLabel: 'File',
        svgPath: 'M10,10 L10,90 L190,90 L190,30 L170,10 Z M170,10 L170,30 L190,30',
        width: 140,
        height: 80
      }
    ],
    dragData: { type: 'data' }
  },
  cloud: {
    title: "External",
    icon: <RiCloudFill />,
    shapes: [
      { 
        id: 'cloud', 
        name: 'Cloud', 
        icon: <RiCloudFill />, 
        usage: 'External services', 
        defaultLabel: 'External Service',
        svgPath: 'M30,50 Q30,30 50,30 Q60,20 80,20 Q100,20 110,30 Q130,30 130,50 Q130,70 110,70 L50,70 Q30,70 30,50 Z',
        width: 140,
        height: 80
      },
      { 
        id: 'service', 
        name: 'Service', 
        icon: <RiCloudFill />, 
        usage: 'API calls', 
        defaultLabel: 'API Call',
        svgPath: 'M20,40 Q20,20 40,20 Q50,10 70,10 Q90,10 100,20 Q120,20 120,40 Q120,60 100,60 L40,60 Q20,60 20,40 Z',
        width: 140,
        height: 80
      }
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

  // Enhanced handle shape drag start with proper data format
  const handleShapeDragStart = (shape: any, event: React.DragEvent) => {
    console.log("Shape drag started:", shape);

    // Reset the dataTransfer object first
    event.dataTransfer.clearData();

    // Set the drag data for the shape with complete information
    try {
      const shapeData = {
        id: shape.id,
        name: shape.name,
        type: 'shape',
        defaultLabel: shape.defaultLabel || shape.name,
        category: shape.category,
        svgPath: shape.svgPath,
        width: shape.width || 140,
        height: shape.height || 80,
        backgroundColor: '#ffffff',
        borderColor: '#000000',
        borderWidth: 2
      };
      
      event.dataTransfer.setData("application/json", JSON.stringify(shapeData));
      event.dataTransfer.setData("text/plain", JSON.stringify(shapeData));
      event.dataTransfer.setData("application/reactflow", `shape:${shape.id}`);

      // Create a better drag image
      const tempElement = document.createElement("div");
      tempElement.innerHTML = `
        <div style="
          width: 60px; 
          height: 40px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          background: white; 
          border: 2px solid #3b82f6; 
          border-radius: 6px;
          font-size: 10px;
          font-weight: 500;
          color: #374151;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        ">
          ${shape.name}
        </div>
      `;
      tempElement.style.position = "fixed";
      tempElement.style.top = "-1000px";
      tempElement.style.left = "-1000px";
      tempElement.style.zIndex = "9999";
      tempElement.style.pointerEvents = "none";
      document.body.appendChild(tempElement);

      event.dataTransfer.setDragImage(tempElement, 30, 20);

      setTimeout(() => {
        if (document.body.contains(tempElement)) {
          document.body.removeChild(tempElement);
        }
      }, 100);

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

  // Render shape category with improved styling
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
                <div className="shape-icon">
                  <svg width="32" height="24" viewBox="0 0 200 100" style={{ overflow: 'visible' }}>
                    <path 
                      d={shape.svgPath} 
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="2"
                    />
                  </svg>
                </div>
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
