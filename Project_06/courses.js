import { db } from "./firebase-courses.js";
import { collection, getDocs } from "firebase/firestore";

// Select the container where cards will be displayed
const courseGrid = document.querySelector(".courses-grid");

// Store all courses
const courses = [];

// Fetch data from Firestore
async function getCourses() {
    try {
        const querySnapshot = await getDocs(collection(db, "courses"));

        querySnapshot.forEach((doc) => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log(courses);

        displayCourses(courses);

    } catch (error) {
        console.error("Error fetching courses:", error);
    }
}

// Display all course cards
function displayCourses(courseList) {

    courseGrid.innerHTML = "";

    courseList.forEach(course => {

        let statusClass = "";

        if (course.status === "Completed") {
            statusClass = "completed";
        } else if (course.status === "In Progress") {
            statusClass = "in-progress";
        } else {
            statusClass = "not-started";
        }

        const card = document.createElement("article");

        card.classList.add("course-card");

        card.innerHTML = `
            <div class="course-image">
                <img src="${course.image}" alt="${course.title}">
            </div>

            <div class="course-content">

                <span class="course-category">
                    ${course.category}
                </span>

                <h3>${course.title}</h3>

                <p class="instructor">
                    👨‍🏫 ${course.instructor}
                </p>

                <div class="progress-section">

                    <div class="progress-info">
                        <span>Progress</span>
                        <span>${course.progress}%</span>
                    </div>

                    <div class="progress-bar">
                        <div class="progress-fill"
                             style="width:${course.progress}%">
                        </div>
                    </div>

                </div>

                <p class="modules">
                    📚 ${course.completedModules} / ${course.totalModules} Modules Completed
                </p>

                <div class="course-footer">

                    <span class="status ${statusClass}">
                        ${course.status}
                    </span>

                    <span class="progress-percent">
                        ${course.progress}% Complete
                    </span>

                </div>

            </div>
        `;

        courseGrid.appendChild(card);

    });

}

// Fetch courses when page loads
getCourses();


const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter-btn");

let selectedFilter = "All";

function filterCourses() {

    const searchText = searchInput.value.toLowerCase();

    const filteredCourses = courses.filter(course => {

        const matchesSearch =
            course.title.toLowerCase().includes(searchText) ||
            course.category.toLowerCase().includes(searchText) ||
            course.instructor.toLowerCase().includes(searchText);

        const matchesFilter =
            selectedFilter === "All" ||
            course.status === selectedFilter;

        return matchesSearch && matchesFilter;

    });

    displayCourses(filteredCourses);

}

searchInput.addEventListener("input", filterCourses);

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        selectedFilter = button.dataset.filter;

        filterCourses();

    });

});