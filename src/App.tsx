import React, { useState } from "react";
import "./App.css";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import Canvas from "./components/Canvas/EnhancedCanvas";
import RightPanel from "./components/RightPanel/RightPanel";
import BottomPanel from "./components/BottomPanel/BottomPanel";
import CustomDragLayer from "./components/Canvas/CustomDragLayer";
import NewDiagramModal from "./components/Modal/NewDiagramModal";
import useStore from "./store/useStore";

function App() {
  const { theme, toggleTheme } = useStore();
  const [isNewDiagramModalOpen, setIsNewDiagramModalOpen] = useState(false);

  const openNewDiagramModal = () => {
    setIsNewDiagramModalOpen(true);
  };

  const closeNewDiagramModal = () => {
    setIsNewDiagramModalOpen(false);
  };

  return (
    <div className={`app ${theme === "dark" ? "dark-theme" : ""}`}>
      <header className="app-header">
        <div className="logo">Mind Map AI</div>
        <div className="header-controls">
          <button className="new-diagram-button" onClick={openNewDiagramModal}>
            New Diagram
          </button>
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>
      <div className="app-container">
        <LeftPanel />
        <div className="main-content">
          <Canvas />
          <BottomPanel />
        </div>
        <RightPanel />
      </div>

      <CustomDragLayer />

      <NewDiagramModal
        isOpen={isNewDiagramModalOpen}
        onClose={closeNewDiagramModal}
      />
    </div>
  );
}

export default App;
