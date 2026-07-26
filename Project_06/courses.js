import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStudentData } from "./firestore.js";
import { renderCourses } from "./ui.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const student = await getStudentData(user.uid);

    renderCourses(student.myCourses);

    document.getElementById("navStudentName").textContent = student.profile.fullName;

    document.getElementById("navStudentEmail").textContent = student.profile.email;

    document.getElementById("navAvatar").src = student.profile.profilePic;

    allCourses = student.myCourses || [];

    updateCourses();

});

let allCourses = [];
let currentSearch = "";
let currentFilter = "All";


function updateCourses() {

    console.log("All Courses:", allCourses);
console.log("Search:", currentSearch);
console.log("Filter:", currentFilter);


    let filtered = [...allCourses];

    if (currentSearch) {

        filtered = filtered.filter(course =>
            course.title.toLowerCase().includes(currentSearch)
        );

    }

    if (currentFilter === "Completed") {

        filtered = filtered.filter(course => course.progress === 100);

    }

    else if (currentFilter === "In Progress") {

        filtered = filtered.filter(course =>
            course.progress > 0 &&
            course.progress < 100
        );

    }

    else if (currentFilter === "Not Started") {

        filtered = filtered.filter(course => course.progress === 0);

    }

console.log("Filtered:", filtered);
    renderCourses(filtered);

}

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    currentSearch = searchInput.value.toLowerCase();

    updateCourses();

});

const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        currentFilter = button.dataset.filter;

        updateCourses();

    });

});

const logoutBtn = document.getElementById("sidebarLogout");

logoutBtn.addEventListener("click", async (e) => {

    e.preventDefault();

    try {

        await signOut(auth);

        window.location.href = "login.html";

    } catch (error) {

        console.error(error);

        alert("Unable to logout.");

    }

});