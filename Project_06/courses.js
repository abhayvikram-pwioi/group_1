import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStudentData } from "./firestore.js";
import { renderCourses } from "./ui.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const student = await getStudentData(user.uid);
    renderCourses(student.myCourses);
});

