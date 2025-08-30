import React, { useState, useRef } from "react";
import "./RightPanel.css";
import useFlowStore from "../../store/useFlowStore";
import { 
  generateDiagramFromPrompt, 
  generateCodeForWorkflow, 
  analyzeWorkflow 
} from "../../services/geminiService";

const RightPanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("ai-assistant");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ type: "user" | "ai"; content: string; data?: any }>
  >([
    {
      type: "ai",
      content:
        "Hello! I'm your AI workflow assistant. I can help you create diagrams, generate code, and analyze workflows. How can I help you today?",
    },
  ]);

  // Code generation state
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'javascript' | 'json' | 'yaml'>('python');
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  // Workflow analysis state
  const [workflowAnalysis, setWorkflowAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { nodes, edges, setNodes, setEdges } = useFlowStore();

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
        { type: "ai", content: "Analyzing your workflow and generating diagram..." },
      ]);

      // Call Gemini API to generate a comprehensive workflow
      const diagramData = await generateDiagramFromPrompt(userPrompt);

      // Remove "thinking" message and add response
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          type: "ai",
          content: "I've created a comprehensive workflow diagram with executable code. Here's what I generated:",
          data: diagramData
        },
      ]);

      // Update the canvas with new nodes and edges
      if (diagramData && diagramData.nodes && diagramData.edges) {
        setNodes(diagramData.nodes);
        setEdges(diagramData.edges);
      }

      // Store generated code and analysis
      if (diagramData?.generatedCode) {
        setGeneratedCode(diagramData.generatedCode);
      }
      if (diagramData?.analysis) {
        setWorkflowAnalysis(diagramData.analysis);
      }

    } catch (error) {
      console.error("Error generating diagram:", error);

      // Remove "thinking" message and add error message
      setMessages((prev) => [
        ...prev.slice(0, prev.length - 1),
        {
          type: "ai",
          content:
            "Sorry, I encountered an error while generating your workflow. Please try again with a different prompt.",
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

  // Generate code for current workflow
  const handleGenerateCode = async (language: 'python' | 'javascript' | 'json' | 'yaml') => {
    if (nodes.length === 0) {
      alert("Please create a workflow diagram first.");
      return;
    }

    setIsGeneratingCode(true);
    setSelectedLanguage(language);

    try {
      const code = await generateCodeForWorkflow(nodes, edges, language);
      setGeneratedCode(prev => ({ ...prev, [language]: code }));
    } catch (error) {
      console.error("Error generating code:", error);
      alert("Failed to generate code. Please try again.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Analyze current workflow
  const handleAnalyzeWorkflow = async () => {
    if (nodes.length === 0) {
      alert("Please create a workflow diagram first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const analysis = await analyzeWorkflow(nodes, edges);
      setWorkflowAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing workflow:", error);
      alert("Failed to analyze workflow. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Render message with data
  const renderMessage = (message: { type: "user" | "ai"; content: string; data?: any }, index: number) => {
    return (
      <div
        key={index}
        className={`message ${
          message.type === "user" ? "user-message" : "ai-message"
        }`}
      >
        <div className="message-content">{message.content}</div>
        
        {message.data && (
          <div className="message-data">
            {message.data.mermaidCode && (
              <div className="mermaid-preview">
                <h4>Generated Mermaid Code:</h4>
                <pre className="code-block">{message.data.mermaidCode}</pre>
              </div>
            )}
            
            {message.data.generatedCode && (
              <div className="generated-code-preview">
                <h4>Generated Code:</h4>
                {Object.entries(message.data.generatedCode).map(([lang, code]) => (
                  <div key={lang} className="code-section">
                    <h5>{lang.toUpperCase()}</h5>
                    <pre className="code-block">{String(code || '')}</pre>
                  </div>
                ))}
              </div>
            )}
            
            {message.data.analysis && (
              <div className="workflow-analysis">
                <h4>Workflow Analysis:</h4>
                <div className="analysis-content">
                  <p><strong>Type:</strong> {message.data.analysis.workflowType}</p>
                  <p><strong>Processes:</strong> {message.data.analysis.processes?.length || 0}</p>
                  <p><strong>Recommendations:</strong></p>
                  <ul>
                    {message.data.analysis.recommendations?.map((rec: string, i: number) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "ai-assistant":
        return (
          <div className="ai-assistant">
            <div className="chat-messages">
              {messages.map((message, index) => renderMessage(message, index))}
              <div ref={messagesEndRef} />
            </div>
            <form className="prompt-form" onSubmit={handlePromptSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the workflow you want to create (e.g., 'Create a customer order processing workflow with validation, payment, and shipping steps')..."
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
                {isGenerating ? "Generating..." : "Generate Workflow"}
              </button>
            </form>
          </div>
        );

      case "code-generator":
        return (
          <div className="code-generator">
            <div className="code-generator-header">
              <h3>Code Generator</h3>
              <button 
                className="analyze-button"
                onClick={handleAnalyzeWorkflow}
                disabled={isAnalyzing || nodes.length === 0}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Workflow"}
              </button>
            </div>
            
            {workflowAnalysis && (
              <div className="workflow-analysis-panel">
                <h4>Workflow Analysis</h4>
                <div className="analysis-summary">
                  <p><strong>Type:</strong> {workflowAnalysis.workflowType}</p>
                  <p><strong>Processes:</strong> {workflowAnalysis.processes?.length || 0}</p>
                  <p><strong>Connections:</strong> {workflowAnalysis.connections?.length || 0}</p>
                </div>
                {workflowAnalysis.recommendations && (
                  <div className="recommendations">
                    <h5>Recommendations:</h5>
                    <ul>
                      {workflowAnalysis.recommendations.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="code-options">
              <h4>Generate Code</h4>
              <div className="language-buttons">
                <button 
                  className={`code-option ${selectedLanguage === 'python' ? 'active' : ''}`}
                  onClick={() => handleGenerateCode('python')}
                  disabled={isGeneratingCode || nodes.length === 0}
                >
                  {isGeneratingCode && selectedLanguage === 'python' ? 'Generating...' : 'Python'}
                </button>
                <button 
                  className={`code-option ${selectedLanguage === 'javascript' ? 'active' : ''}`}
                  onClick={() => handleGenerateCode('javascript')}
                  disabled={isGeneratingCode || nodes.length === 0}
                >
                  {isGeneratingCode && selectedLanguage === 'javascript' ? 'Generating...' : 'JavaScript'}
                </button>
                <button 
                  className={`code-option ${selectedLanguage === 'json' ? 'active' : ''}`}
                  onClick={() => handleGenerateCode('json')}
                  disabled={isGeneratingCode || nodes.length === 0}
                >
                  {isGeneratingCode && selectedLanguage === 'json' ? 'Generating...' : 'JSON Config'}
                </button>
                <button 
                  className={`code-option ${selectedLanguage === 'yaml' ? 'active' : ''}`}
                  onClick={() => handleGenerateCode('yaml')}
                  disabled={isGeneratingCode || nodes.length === 0}
                >
                  {isGeneratingCode && selectedLanguage === 'yaml' ? 'Generating...' : 'YAML Config'}
                </button>
              </div>
            </div>

            <div className="code-output">
              {Object.keys(generatedCode).length > 0 ? (
                <div className="code-tabs">
                  {Object.entries(generatedCode).map(([language, code]) => (
                    <div key={language} className="code-tab">
                      <h5>{language.toUpperCase()}</h5>
                      <pre className="code-block">{code}</pre>
                      <button 
                        className="copy-button"
                        onClick={() => navigator.clipboard.writeText(code)}
                      >
                        Copy Code
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="code-placeholder">
                  {nodes.length === 0 
                    ? "Create a workflow diagram first, then generate code here."
                    : "Select a language above to generate executable code for your workflow."
                  }
                </div>
              )}
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="notes-panel">
            <h3>Notes & Documentation</h3>
            <textarea
              placeholder="Add notes about your workflow, requirements, or implementation details..."
              className="notes-textarea"
            />
            <div className="notes-actions">
              <button className="save-notes">Save Notes</button>
              <button className="export-notes">Export Documentation</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`right-panel ${isCollapsed ? "collapsed" : ""}`}>
      <div className="panel-header">
        <h2>AI Assistant</h2>
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
