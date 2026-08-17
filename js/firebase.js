// Firebase Configuration & Initialization (Modular Compatibility)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update, 
  push, 
  child, 
  onValue,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAQOxmY1NL-2-NQmtUKgVWgFZ8SaNxlIN4",
  authDomain: "stxwin-82a48.firebaseapp.com",
  databaseURL: "https://stxwin-82a48-default-rtdb.firebaseio.com",
  projectId: "stxwin-82a48",
  storageBucket: "stxwin-82a48.firebasestorage.app",
  messagingSenderId: "704304693645",
  appId: "1:704304693645:android:7452da57d37bdbcd82bdc4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);

export { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  ref, 
  set, 
  get, 
  update, 
  push, 
  child, 
  onValue,
  serverTimestamp 
};
