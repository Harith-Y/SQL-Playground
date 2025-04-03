import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBgJBK_ixbBUhLwuPKRMoXkCuUCscX-_Jg",
  authDomain: "sql-playground-e2486.firebaseapp.com",
  projectId: "sql-playground-e2486",
  storageBucket: "sql-playground-e2486.firebasestorage.app",
  messagingSenderId: "709069034921",
  appId: "1:709069034921:web:190d4caca19621a91120b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Login failed');
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Logout failed');
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export { auth }; 