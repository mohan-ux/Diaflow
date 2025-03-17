import React from "react";
import "./App.css";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import Canvas from "./components/Canvas/Canvas";
import BottomPanel from "./components/BottomPanel/BottomPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import useStore from "./store/useStore";

function App() {
  const { theme, toggleTheme } = useStore();

  return (
    <div className={`app ${theme === "dark" ? "dark-theme" : ""}`}>
      <header className="app-header">
        <div className="logo">Mind Map AI</div>
        <div className="header-controls">
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
    </div>
  );
}

export default App;
