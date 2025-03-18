import React, { useState, useRef } from "react";
import "./RightPanel.css";
import useFlowStore from "../../store/useFlowStore";
import { generateDiagramFromPrompt } from "../../services/geminiService";

const RightPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-assistant");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string }>
  >([
    {
      type: "ai",
      content:
        "Hello! I'm your AI diagram assistant. How can I help you create a diagram today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { setNodes, setEdges } = useFlowStore();

  // Toggle panel collapse
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle tab selection
  const handleTabSelect = (tab: string) => {
    setActiveTab(tab);
  };

  // Handle prompt submission
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() || isGenerating) return;

    // Add user message
    const userPrompt = prompt.trim();
    setMessages((prev) => [...prev, { type: "user", content: userPrompt }]);
    setPrompt("");
    setIsGenerating(true);

    try {
      // Add "thinking" message
      setMessages((prev) => [
        ...prev,
        { type: "ai", content: "Generating diagram..." },
      ]);

      // Call Gemini API to generate a diagram
      const diagramData = await generateDiagramFromPrompt(userPrompt);

      // Remove "thinking" message and add response
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          type: "ai",
          content:
            "I've created a diagram based on your request. You can see it on the canvas now.",
        },
      ]);

      // Update the canvas with new nodes and edges
      if (diagramData && diagramData.nodes && diagramData.edges) {
        setNodes(diagramData.nodes);
        setEdges(diagramData.edges);
      }
    } catch (error) {
      console.error("Error generating diagram:", error);

      // Remove "thinking" message and add error message
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          type: "ai",
          content:
            "Sorry, I encountered an error while generating your diagram. Please try again with a different prompt.",
        },
      ]);
    } finally {
      setIsGenerating(false);
      // Scroll to the bottom of the chat
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "ai-assistant":
        return (
          <div className="ai-assistant">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.type === "user" ? "user-message" : "ai-message"
                  }`}
                >
                  <div className="message-content">{message.content}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form className="prompt-form" onSubmit={handlePromptSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the diagram you want to create..."
                disabled={isGenerating}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handlePromptSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                disabled={isGenerating || !prompt.trim()}
                className="submit-button"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </form>
          </div>
        );

      case "code-generator":
        return (
          <div className="code-generator">
            <h3>Code Generator</h3>
            <p>Generate code from your diagram</p>
            <div className="code-options">
              <button className="code-option">Generate JavaScript</button>
              <button className="code-option">Generate Python</button>
              <button className="code-option">Generate Java</button>
            </div>
            <div className="code-output">
              <div className="code-placeholder">
                Select a diagram element and generate code to see the output
                here.
              </div>
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="notes-panel">
            <h3>Notes</h3>
            <textarea
              placeholder="Add notes about your diagram here..."
              className="notes-textarea"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`right-panel ${isCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <h2>Assistant</h2>
        <button
          className="collapse-button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand panel" : "Collapse panel"}
        >
          {isCollapsed ? "←" : "→"}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="panel-tabs">
            <button
              className={`panel-tab ${
                activeTab === "ai-assistant" ? "active" : ""
              }`}
              onClick={() => handleTabSelect("ai-assistant")}
            >
              AI Assistant
            </button>
            <button
              className={`panel-tab ${
                activeTab === "code-generator" ? "active" : ""
              }`}
              onClick={() => handleTabSelect("code-generator")}
            >
              Code Gen
            </button>
            <button
              className={`panel-tab ${activeTab === "notes" ? "active" : ""}`}
              onClick={() => handleTabSelect("notes")}
            >
              Notes
            </button>
          </div>

          <div className="panel-content">{renderTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default RightPanel;
