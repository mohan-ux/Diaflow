import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration
// This will be replaced with actual config in a secure way
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;

/**
 * Initialize Firebase with the provided configuration
 * @param config Firebase configuration object
 */
export const initializeFirebase = (config = firebaseConfig) => {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
};

/**
 * Check if Firebase is initialized
 * @returns True if initialized, false otherwise
 */
export const isInitialized = (): boolean => {
  return !!app && !!auth && !!db;
};

// Authentication functions

/**
 * Sign in with email and password
 * @param email User email
 * @param password User password
 * @returns User object
 */
export const signIn = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

/**
 * Create a new user with email and password
 * @param email User email
 * @param password User password
 * @returns User object
 */
export const signUp = async (email: string, password: string) => {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logOut = async () => {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Get the current authenticated user
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = (): any | null => {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  return auth.currentUser;
};

/**
 * Subscribe to auth state changes
 * @param callback Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthChange = (callback: (user: any | null) => void) => {
  if (!auth) {
    throw new Error("Firebase not initialized");
  }

  return onAuthStateChanged(auth, callback);
};

// Firestore functions

/**
 * Save a diagram to Firestore
 * @param diagramId Diagram ID
 * @param diagramData Diagram data
 * @param userId User ID
 */
export const saveDiagram = async (
  diagramId: string,
  diagramData: any,
  userId: string
) => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  try {
    const diagramRef = doc(db, "diagrams", diagramId);
    await setDoc(diagramRef, {
      ...diagramData,
      userId,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error saving diagram:", error);
    throw error;
  }
};

/**
 * Get a diagram from Firestore
 * @param diagramId Diagram ID
 * @returns Diagram data
 */
export const getDiagram = async (diagramId: string) => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  try {
    const diagramRef = doc(db, "diagrams", diagramId);
    const diagramSnap = await getDoc(diagramRef);

    if (diagramSnap.exists()) {
      return diagramSnap.data();
    } else {
      throw new Error("Diagram not found");
    }
  } catch (error) {
    console.error("Error getting diagram:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a diagram
 * @param diagramId Diagram ID
 * @param callback Function to call when diagram changes
 * @returns Unsubscribe function
 */
export const subscribeToDiagram = (
  diagramId: string,
  callback: (data: any | null) => void
) => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  const diagramRef = doc(db, "diagrams", diagramId);
  return onSnapshot(diagramRef, (docSnapshot: any) => {
    if (docSnapshot.exists()) {
      callback(docSnapshot.data());
    } else {
      callback(null);
    }
  });
};

/**
 * Get all diagrams for a user
 * @param userId User ID
 * @returns Array of diagram data
 */
export const getUserDiagrams = async (userId: string) => {
  if (!db) {
    throw new Error("Firebase not initialized");
  }

  try {
    const diagramsQuery = query(
      collection(db, "diagrams"),
      where("userId", "==", userId)
    );
    const unsubscribe = onSnapshot(diagramsQuery, (querySnapshot: any) => {
      const diagrams: any[] = [];
      querySnapshot.forEach((docSnapshot: any) => {
        diagrams.push({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        });
      });
      return diagrams;
    });

    return unsubscribe;
  } catch (error) {
    console.error("Error getting user diagrams:", error);
    throw error;
  }
};
