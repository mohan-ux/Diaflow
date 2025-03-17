import { Configuration, OpenAIApi } from "openai";

// This will be replaced with actual API key in a secure way
// For production, this should be handled by a backend service
let apiKey = "";

// Initialize OpenAI configuration
let configuration: Configuration | null = null;
let openai: OpenAIApi | null = null;

/**
 * Initialize the OpenAI API with the provided API key
 * @param key OpenAI API key
 */
export const initializeOpenAI = (key: string): void => {
  apiKey = key;
  configuration = new Configuration({
    apiKey: key,
  });
  openai = new OpenAIApi(configuration);
};

/**
 * Check if the OpenAI API is initialized
 * @returns True if initialized, false otherwise
 */
export const isInitialized = (): boolean => {
  return !!openai;
};

/**
 * Generate a diagram from natural language
 * @param prompt The natural language prompt
 * @returns The generated diagram data
 */
export const generateDiagramFromText = async (prompt: string) => {
  if (!openai) {
    throw new Error("OpenAI API not initialized");
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a diagram generation assistant. Create a diagram based on the user's description and return it as a JSON object with nodes and edges.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    const result = response.data.choices[0]?.message?.content?.trim();

    if (!result) {
      throw new Error("No result returned from OpenAI");
    }

    try {
      // Parse the JSON result
      return JSON.parse(result);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON", error);
      throw new Error("Invalid response format from OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API", error);
    throw error;
  }
};

/**
 * Generate code from a diagram
 * @param diagramData The diagram data
 * @param language The target programming language
 * @returns The generated code
 */
export const generateCodeFromDiagram = async (
  diagramData: any,
  language: string
) => {
  if (!openai) {
    throw new Error("OpenAI API not initialized");
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a code generation assistant. Convert the diagram to ${language} code and return only the code without any explanations.`,
        },
        {
          role: "user",
          content: `Convert this diagram to ${language} code: ${JSON.stringify(
            diagramData
          )}`,
        },
      ],
      temperature: 0.3,
    });

    return response.data.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error calling OpenAI API", error);
    throw error;
  }
};

/**
 * Generate a diagram from code
 * @param code The source code
 * @param language The programming language
 * @returns The generated diagram data
 */
export const generateDiagramFromCode = async (
  code: string,
  language: string
) => {
  if (!openai) {
    throw new Error("OpenAI API not initialized");
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a diagram generation assistant. Analyze the code and create a diagram representation as a JSON object with nodes and edges.",
        },
        {
          role: "user",
          content: `Analyze this ${language} code and create a diagram: ${code}`,
        },
      ],
      temperature: 0.3,
    });

    const result = response.data.choices[0]?.message?.content?.trim();

    if (!result) {
      throw new Error("No result returned from OpenAI");
    }

    try {
      // Parse the JSON result
      return JSON.parse(result);
    } catch (error) {
      console.error("Failed to parse OpenAI response as JSON", error);
      throw new Error("Invalid response format from OpenAI");
    }
  } catch (error) {
    console.error("Error calling OpenAI API", error);
    throw error;
  }
};

/**
 * Get AI suggestions for improving a diagram
 * @param diagramData The current diagram data
 * @returns Suggestions for improvement
 */
export const getDiagramSuggestions = async (diagramData: any) => {
  if (!openai) {
    throw new Error("OpenAI API not initialized");
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a diagram improvement assistant. Analyze the diagram and suggest improvements considering layout, structure, clarity, and completeness.",
        },
        {
          role: "user",
          content: `Analyze this diagram and suggest improvements: ${JSON.stringify(
            diagramData
          )}`,
        },
      ],
      temperature: 0.7,
    });

    return response.data.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("Error calling OpenAI API", error);
    throw error;
  }
};
