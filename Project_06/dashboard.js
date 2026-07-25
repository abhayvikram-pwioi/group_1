import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { auth } from "./firebase.js";
import { getStudentData } from "./firestore.js";
import { renderDashboard } from "./ui.js";

let currentUser = null;
let currentStudent = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {

    currentStudent = await getStudentData(user.uid);

    const studentId = document.getElementById("studentId");

    studentId.textContent = currentUser.uid.slice(0, 8);
    renderDashboard(currentStudent);

  }

  catch (error) {

    console.error(error);

    console.error("Dashboard Error:", error);

  }

});