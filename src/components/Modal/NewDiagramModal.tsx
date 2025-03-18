import React, { useState } from "react";
import { generateDiagramFromPrompt } from "../../services/geminiService";
import useFlowStore from "../../store/useFlowStore";
import "./Modal.css";

interface NewDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewDiagramModal: React.FC<NewDiagramModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { setNodes, setEdges } = useFlowStore();

  if (!isOpen) return null;

  const templates = [
    {
      id: "flowchart",
      name: "Flow Chart",
      description: "Visualize a process with decision points and flows",
    },
    {
      id: "mindmap",
      name: "Mind Map",
      description: "Create a hierarchical diagram of ideas and concepts",
    },
    {
      id: "uml",
      name: "UML Diagram",
      description: "Create a Class/Object relationship diagram",
    },
    {
      id: "er",
      name: "Entity Relationship",
      description: "Design a database schema with entities and relationships",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim() && !selectedTemplate) {
      setError("Please enter a description or select a template");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let fullPrompt = prompt;

      // Add template context if selected
      if (selectedTemplate) {
        const template = templates.find((t) => t.id === selectedTemplate);
        if (template) {
          fullPrompt = `Create a ${template.name.toLowerCase()} diagram${
            prompt ? ": " + prompt : ""
          }`;
        }
      }

      // Call Gemini API to generate a diagram
      const diagramData = await generateDiagramFromPrompt(fullPrompt);

      // Update the canvas with new nodes and edges
      if (diagramData && diagramData.nodes && diagramData.edges) {
        setNodes(diagramData.nodes);
        setEdges(diagramData.edges);
        onClose();
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

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Create New Diagram</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="template-grid">
            {templates.map((template) => (
              <div
                key={template.id}
                className={`template-card ${
                  selectedTemplate === template.id ? "selected" : ""
                }`}
                onClick={() =>
                  setSelectedTemplate(
                    selectedTemplate === template.id ? null : template.id
                  )
                }
              >
                <div className="template-icon">
                  {template.id.charAt(0).toUpperCase()}
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="prompt">Describe your diagram</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what diagram you want to create..."
                rows={5}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={isGenerating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="create-button"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Create Diagram"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewDiagramModal;
