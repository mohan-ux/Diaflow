// API Configuration

// Gemini API
export const GEMINI_API_KEY = "AIzaSyBtni228Es_sQ8CwzlpC5vDa8it5dZGkN4";
export const GEMINI_API_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// OpenAI (existing in the project)
export const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";

// Export default config object
export default {
  gemini: {
    apiKey: GEMINI_API_KEY,
    endpoint: GEMINI_API_ENDPOINT,
  },
  openai: {
    apiKey: OPENAI_API_KEY,
  },
};
