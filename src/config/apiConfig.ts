/**
 * Configuration for API keys and services
 *
 * In a production environment, API keys should be handled by a backend service
 * and not exposed in the client-side code.
 */

// OpenAI API configuration
export const openAIConfig = {
  // In production, this should be handled by environment variables
  // or a secure backend service
  apiKey: process.env.REACT_APP_OPENAI_API_KEY || "",

  // Default model to use
  model: "gpt-3.5-turbo",
};

// Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "",
};

// API Configuration for Gemini
export const API_CONFIG = {
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.REACT_APP_GEMINI_MODEL || "gemini-2.0-flash",
  GEMINI_TEMPERATURE: parseFloat(process.env.REACT_APP_GEMINI_TEMPERATURE || "0.3"),
  GEMINI_MAX_TOKENS: parseInt(process.env.REACT_APP_GEMINI_MAX_TOKENS || "4096", 10),
  API_URL: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
};

// Check if API key is configured
export const isApiConfigured = () => {
  return !!API_CONFIG.GEMINI_API_KEY && API_CONFIG.GEMINI_API_KEY !== "your_gemini_api_key_here";
};

// Get API configuration with validation
export const getApiConfig = () => {
  if (!isApiConfigured()) {
    throw new Error(
      "Gemini API key is not configured. Please set REACT_APP_GEMINI_API_KEY in your environment variables."
    );
  }
  return API_CONFIG;
};
