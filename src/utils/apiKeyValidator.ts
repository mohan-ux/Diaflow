import { Configuration, OpenAIApi } from "openai";

/**
 * Validates an OpenAI API key by making a simple request
 * @param apiKey The OpenAI API key to validate
 * @returns A promise that resolves to true if the key is valid, false otherwise
 */
export const validateOpenAIKey = async (apiKey: string): Promise<boolean> => {
  if (!apiKey) {
    return false;
  }

  try {
    const configuration = new Configuration({
      apiKey,
    });
    const openai = new OpenAIApi(configuration);

    // Make a simple request to check if the API key is valid
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, this is a test message to validate the API key.",
        },
      ],
      max_tokens: 5,
    });

    return !!response.data.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error validating OpenAI API key:", error);
    return false;
  }
};

/**
 * Checks if an API key is present in the environment variables
 * @param keyName The name of the environment variable
 * @returns True if the key is present, false otherwise
 */
export const isApiKeyPresent = (keyName: string): boolean => {
  return !!process.env[keyName] && process.env[keyName] !== "";
};

/**
 * Gets the OpenAI API key from environment variables
 * @returns The OpenAI API key or an empty string if not found
 */
export const getOpenAIKey = (): string => {
  return process.env.REACT_APP_OPENAI_API_KEY || "";
};
