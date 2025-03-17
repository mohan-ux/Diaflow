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
