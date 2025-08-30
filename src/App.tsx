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
        <div className="logo-container">
          <span className="logo-icon">⟿</span>
          <span className="logo">DIAFLOW</span>
        </div>
        <div className="header-controls">
          <button className="new-diagram-button" onClick={openNewDiagramModal}>
            <span>New Diagram</span>
          </button>
          <label className="theme-toggle-switch">
            <input
              type="checkbox"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
            <span className="theme-toggle-slider">
              <span className="theme-toggle-icon theme-toggle-sun">☀️</span>
              <span className="theme-toggle-icon theme-toggle-moon">🌙</span>
            </span>
          </label>
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
