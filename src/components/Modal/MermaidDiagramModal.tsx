import React, { useState } from "react";
import { generateMermaidFromPrompt } from "../../services/mermaidService";
import useFlowStore from "../../store/useFlowStore";
import MermaidDiagram from "../MermaidDiagram/MermaidDiagram";
import "./Modal.css";

interface MermaidDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MermaidDiagramModal: React.FC<MermaidDiagramModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);

  const { setNodes, setEdges } = useFlowStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a description for your diagram");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setMermaidCode(null);

    try {
      // Call Gemini API to generate a Mermaid diagram
      const diagramData = await generateMermaidFromPrompt(prompt);

      if (diagramData) {
        // Set the Mermaid code for preview
        setMermaidCode(diagramData.mermaidCode);
        
        // Update the canvas with new nodes and edges
        setNodes(diagramData.nodes);
        setEdges(diagramData.edges);
      } else {
        setError(
          "Failed to generate a valid diagram. Please try a different prompt."
        );
      }
    } catch (error: any) {
      console.error("Error generating diagram:", error);
      setError(
        error.message || "An error occurred while generating the diagram"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    // Close the modal after applying the diagram to the canvas
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container mermaid-modal">
        <div className="modal-header">
          <h2>Create Mermaid Diagram</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="prompt">Describe your diagram</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the workflow or process you want to visualize..."
                rows={5}
                className="prompt-textarea"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button
                type="submit"
                className="primary-button"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Diagram"}
              </button>
            </div>
          </form>

          {mermaidCode && (
            <div className="mermaid-preview">
              <h3>Preview</h3>
              <MermaidDiagram chart={mermaidCode} />
              
              <div className="mermaid-code">
                <h4>Mermaid Code</h4>
                <pre>{mermaidCode}</pre>
              </div>
              
              <button
                className="primary-button apply-button"
                onClick={handleApply}
              >
                Apply to Canvas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MermaidDiagramModal;