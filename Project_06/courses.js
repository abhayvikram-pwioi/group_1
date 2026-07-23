

const courses = [
    {
        title: "React Fundamentals",
        category: "Web Development",
        instructor: "John Doe",
        progress: 75,
        completedModules: 15,
        totalModules: 20,
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
    },
    {
        title: "JavaScript Essentials",
        category: "Programming",
        instructor: "Jane Smith",
        progress: 100,
        completedModules: 18,
        totalModules: 18,
        status: "Completed",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600"
    },
    {
        title: "Node.js Basics",
        category: "Backend",
        instructor: "Alex Brown",
        progress: 40,
        completedModules: 6,
        totalModules: 15,
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"
    },
    {
        title: "HTML & CSS Mastery",
        category: "Frontend",
        instructor: "Sarah Wilson",
        progress: 100,
        completedModules: 22,
        totalModules: 22,
        status: "Completed",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600"
    },
    {
        title: "Python for Beginners",
        category: "Programming",
        instructor: "David Miller",
        progress: 10,
        completedModules: 2,
        totalModules: 20,
        status: "Not Started",
        image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600"
    },
    {
        title: "UI/UX Design",
        category: "Design",
        instructor: "Emily Clark",
        progress: 55,
        completedModules: 11,
        totalModules: 20,
        status: "In Progress",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600"
    }
];



const courseGrid = document.querySelector(".courses-grid");



function displayCourses(courseList) {

    courseGrid.innerHTML = "";

    courseList.forEach(course => {

        let statusClass = "";

        if(course.status === "Completed")
            statusClass = "completed";

        else if(course.status === "In Progress")
            statusClass = "in-progress";

        else
            statusClass = "not-started";


        const card = document.createElement("article");

        card.className = "course-card";

        card.innerHTML = `

        <div class="course-image">
            <img src="${course.image}" alt="${course.title}">
        </div>

        <div class="course-content">

            <span class="course-category">
                ${course.category}
            </span>

            <h2>${course.title}</h2>

            <p class="instructor">
                Instructor : ${course.instructor}
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
                ${course.completedModules} / ${course.totalModules} Modules
            </p>

            <div class="course-footer">

                <span class="status ${statusClass}">
                    ${course.status}
                </span>

                <button>
                    Continue
                </button>

            </div>

        </div>

        `;

        courseGrid.appendChild(card);

    });

}




displayCourses(courses);