import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getStudentData, addCourse } from "./firestore.js";
import { renderCourses } from "./ui.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.replace("login.html");

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

const modal = document.getElementById("courseModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const courseForm = document.getElementById("courseForm");


function updateCourses() {

    console.log("All Courses:", allCourses);
    console.log("Search:", currentSearch);
    console.log("Filter:", currentFilter);


    let filtered = [...allCourses];

    if (currentSearch) {

       filtered = filtered.filter(course =>

    course.title.toLowerCase().includes(currentSearch) ||

    course.instructor.toLowerCase().includes(currentSearch) ||

    (course.category || "").toLowerCase().includes(currentSearch)

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

    const confirmLogout = confirm("Are you sure you want to logout?");

    if (!confirmLogout) return;

    try {

        await signOut(auth);

        localStorage.clear();
        sessionStorage.clear();

        window.location.replace("login.html");

    } catch (error) {

        console.error(error);

    }

});
courseForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const completedModules = Number(document.getElementById("completedModules").value);

    const totalModules = Number(document.getElementById("totalModules").value);

    if (completedModules > totalModules) {

        alert("Completed Modules cannot exceed Total Modules.");

        return;

    }

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value.trim();
    const instructor = document.getElementById("instructor").value.trim();
    const thumbnail = document.getElementById("image").value.trim();

    if (!title || !category || !instructor || !thumbnail) {

    alert("Please fill all fields.");

    return;

}

    const progress = totalModules === 0
        ? 0
        : Math.round((completedModules / totalModules) * 100);

    const newCourse = {

    id: crypto.randomUUID(),

    title: document.getElementById("title").value.trim(),

    category: document.getElementById("category").value.trim(),

    instructor: document.getElementById("instructor").value.trim(),

    thumbnail: document.getElementById("image").value.trim(),

    completedModules,

    totalModules,

    progress,

    grade: "NA"

};

    try {

        await addCourse(auth.currentUser.uid, newCourse);

        const student = await getStudentData(auth.currentUser.uid);

        allCourses = student.myCourses || [];

        updateCourses();

        courseForm.reset();

        modal.style.display = "none";

        alert("Course Added Successfully!");

    }

    catch (error) {

        console.error(error);

        alert("Failed to Add Course");

    }

});

openModal.addEventListener("click", () => {

    modal.style.display = "flex";

});

closeModal.addEventListener("click", () => {

    modal.style.display = "none";

});

window.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

});