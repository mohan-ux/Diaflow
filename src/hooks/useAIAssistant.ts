import { useState, useCallback, useEffect } from "react";
import * as openaiService from "../services/openaiService";
import { openAIConfig } from "../config/apiConfig";
import useDiagram from "./useDiagram";

// Define types for messages
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: number;
}

// Define types for AI capabilities
export type AICapability =
  | "text-to-diagram"
  | "diagram-to-code"
  | "code-to-diagram"
  | "improve-diagram";

/**
 * Custom hook for AI assistant functionality
 */
const useAIAssistant = () => {
  // Get diagram data from the diagram hook
  const { elements, connections } = useDiagram();

  // State for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Welcome to Mind Map AI! I can help you create diagrams from text, convert code to diagrams, and more.",
      role: "assistant",
      timestamp: Date.now(),
    },
  ]);

  // State for loading status
  const [isLoading, setIsLoading] = useState(false);

  // State for error
  const [error, setError] = useState<string | null>(null);

  // Initialize OpenAI service
  useEffect(() => {
    if (openAIConfig.apiKey) {
      try {
        openaiService.initializeOpenAI(openAIConfig.apiKey);
      } catch (err) {
        setError("Failed to initialize OpenAI service");
        console.error("Failed to initialize OpenAI service:", err);
      }
    }
  }, []);

  /**
   * Add a new message to the conversation
   * @param content Message content
   * @param role Message role
   */
  const addMessage = useCallback(
    (content: string, role: "user" | "assistant" | "system") => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        content,
        role,
        timestamp: Date.now(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      return newMessage;
    },
    []
  );

  /**
   * Send a message to the AI assistant
   * @param content Message content
   * @param capability Optional AI capability to use
   */
  const sendMessage = useCallback(
    async (content: string, capability?: AICapability) => {
      if (!openaiService.isInitialized()) {
        setError("OpenAI service is not initialized");
        return;
      }

      // Add user message
      addMessage(content, "user");

      setIsLoading(true);
      setError(null);

      try {
        let response: any;

        // Handle different capabilities
        if (capability === "text-to-diagram") {
          response = await openaiService.generateDiagramFromText(content);
          addMessage(
            "I've generated a diagram based on your description. You can see it in the canvas.",
            "assistant"
          );
          // TODO: Implement diagram rendering from the response
        } else if (capability === "diagram-to-code") {
          const diagramData = { elements, connections };
          response = await openaiService.generateCodeFromDiagram(
            diagramData,
            "javascript"
          ); // Default to JavaScript
          addMessage(
            `Here's the code representation of your diagram:\n\n\`\`\`javascript\n${response}\n\`\`\``,
            "assistant"
          );
        } else if (capability === "code-to-diagram") {
          response = await openaiService.generateDiagramFromCode(
            content,
            "javascript"
          ); // Assume JavaScript by default
          addMessage(
            "I've generated a diagram based on your code. You can see it in the canvas.",
            "assistant"
          );
          // TODO: Implement diagram rendering from the response
        } else if (capability === "improve-diagram") {
          const diagramData = { elements, connections };
          response = await openaiService.getDiagramSuggestions(diagramData);
          addMessage(
            `Here are some suggestions to improve your diagram:\n\n${response}`,
            "assistant"
          );
        } else {
          // Default conversation
          // For now, just echo back a simple response
          // In a real implementation, this would call the OpenAI chat API
          setTimeout(() => {
            addMessage(
              `I received your message: "${content}". How can I help you with your diagram?`,
              "assistant"
            );
          }, 1000);
        }
      } catch (err: any) {
        setError(
          err.message || "An error occurred while processing your request"
        );
        console.error("AI assistant error:", err);
        addMessage(
          "Sorry, I encountered an error while processing your request. Please try again.",
          "assistant"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, elements, connections]
  );

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: "welcome",
        content:
          "Welcome to Mind Map AI! I can help you create diagrams from text, convert code to diagrams, and more.",
        role: "assistant",
        timestamp: Date.now(),
      },
    ]);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    addMessage,
    clearMessages,
  };
};

export default useAIAssistant;
