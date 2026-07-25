import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {getFirestore} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdHuhYp9tZ-iGMTyPCvqzNZmqmy-5A5iQ",
  authDomain: "student-progress-tracker-fe22f.firebaseapp.com",
  projectId: "student-progress-tracker-fe22f",
  storageBucket: "student-progress-tracker-fe22f.firebasestorage.app",
  messagingSenderId: "384667192167",
  appId: "1:384667192167:web:1ce587623e800ec2c73dc2",
  measurementId: "G-V9B2ELWW6Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
export { auth, db };
