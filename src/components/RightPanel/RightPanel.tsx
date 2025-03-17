import React, { useState, useEffect } from "react";
import "./RightPanel.css";
import useAIAssistant, { AICapability } from "../../hooks/useAIAssistant";
import {
  validateOpenAIKey,
  isApiKeyPresent,
} from "../../utils/apiKeyValidator";
import { openAIConfig } from "../../config/apiConfig";

const RightPanel: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [selectedCapability, setSelectedCapability] =
    useState<AICapability | null>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const { messages, isLoading, error, sendMessage } = useAIAssistant();

  // Validate the API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      if (!isApiKeyPresent("REACT_APP_OPENAI_API_KEY")) {
        setIsKeyValid(false);
        return;
      }

      setIsValidating(true);
      try {
        const isValid = await validateOpenAIKey(openAIConfig.apiKey);
        setIsKeyValid(isValid);
      } catch (error) {
        console.error("Error validating API key:", error);
        setIsKeyValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    checkApiKey();
  }, []);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = () => {
    if (!prompt.trim() || !isKeyValid) return;

    sendMessage(prompt, selectedCapability || undefined);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCapabilityClick = (capability: AICapability) => {
    setSelectedCapability(
      capability === selectedCapability ? null : capability
    );
  };

  return (
    <div className="right-panel">
      <div className="panel-header">
        <h3>AI Assistant</h3>
        {isKeyValid === false && (
          <div className="api-key-warning">
            ⚠️ Invalid or missing OpenAI API key
          </div>
        )}
      </div>

      <div className="ai-capabilities">
        <button
          className={`capability-button ${
            selectedCapability === "text-to-diagram" ? "active" : ""
          }`}
          onClick={() => handleCapabilityClick("text-to-diagram")}
          disabled={!isKeyValid}
        >
          Text → Diagram
        </button>
        <button
          className={`capability-button ${
            selectedCapability === "diagram-to-code" ? "active" : ""
          }`}
          onClick={() => handleCapabilityClick("diagram-to-code")}
          disabled={!isKeyValid}
        >
          Diagram → Code
        </button>
        <button
          className={`capability-button ${
            selectedCapability === "code-to-diagram" ? "active" : ""
          }`}
          onClick={() => handleCapabilityClick("code-to-diagram")}
          disabled={!isKeyValid}
        >
          Code → Diagram
        </button>
        <button
          className={`capability-button ${
            selectedCapability === "improve-diagram" ? "active" : ""
          }`}
          onClick={() => handleCapabilityClick("improve-diagram")}
          disabled={!isKeyValid}
        >
          Improve Diagram
        </button>
      </div>

      <div className="ai-conversation">
        {isValidating && (
          <div className="ai-message loading-message">
            Validating OpenAI API key...
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        {isKeyValid === false && !isValidating && (
          <div className="ai-message error-message">
            <p>
              OpenAI API key is invalid or missing. Please add a valid API key
              to the .env file:
            </p>
            <pre>REACT_APP_OPENAI_API_KEY=your_api_key_here</pre>
            <p>Then restart the application.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`ai-message ${
              message.role === "user" ? "user-message" : ""
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading && (
          <div className="ai-message loading-message">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        {error && (
          <div className="ai-message error-message">Error: {error}</div>
        )}
      </div>

      <div className="ai-input">
        <textarea
          placeholder={
            selectedCapability
              ? `Enter ${
                  selectedCapability === "text-to-diagram"
                    ? "description for diagram"
                    : selectedCapability === "code-to-diagram"
                    ? "code to visualize"
                    : "your request"
                }...`
              : "Ask AI to create a diagram or analyze your current diagram..."
          }
          value={prompt}
          onChange={handlePromptChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading || !isKeyValid}
        />
        <button
          className="send-button"
          onClick={handleSubmit}
          disabled={!prompt.trim() || isLoading || !isKeyValid}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
