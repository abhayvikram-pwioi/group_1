


// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEI374lX7Sh_JzF7pA0b6Iuwjj4SFRPPY",
  authDomain: "student-progress-tracker-230e7.firebaseapp.com",
  projectId: "student-progress-tracker-230e7",
  storageBucket: "student-progress-tracker-230e7.firebasestorage.app",
  messagingSenderId: "747472656620",
  appId: "1:747472656620:web:a52232c07e6d1efb726dc9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Connect Firestore
const db = getFirestore(app);

// Export database
export { db };