const welcomeName = document.getElementById("welcomeName");
const navStudentName = document.getElementById("navStudentName");
const navStudentEmail = document.getElementById("navStudentEmail");
const navAvatar = document.getElementById("navAvatar");
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentSemester = document.getElementById("studentSemester");
const studentAvatar = document.getElementById("studentAvatar");

export function renderDashboard(student) {
    renderProfile(student.profile);
    renderCircleProgress(student.dashboard);
    renderCharts(student.myCourses);
    renderDashboardStats(student.myCourses);
    renderUpcomingTasks(student.upcomingTasks);
    renderRecentActivity(student.recentActivity);
}

function renderProfile(profile) {
    welcomeName.textContent = profile.fullName;
    navStudentName.textContent = profile.fullName;
    navStudentEmail.textContent = profile.email;
    studentName.textContent = profile.fullName;
    studentEmail.textContent = profile.email;
    studentSemester.textContent = profile.semester;

    if (profile.profilePic) {
        navAvatar.src = profile.profilePic;
        studentAvatar.src = profile.profilePic;
    }

}

export function renderDashboardStats(courses) {

    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.progress === 100).length;

    const pendingModules = courses.reduce((total, course) => {
        return total + (course.totalModules - course.completedModules);
    }, 0);

    const averageProgress = courses.length === 0 ? 0 : Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length);

    document.querySelector("[data-stat='totalCourses']").textContent = totalCourses;
    document.querySelector("[data-stat='completedCourses']").textContent = completedCourses;
    document.querySelector("[data-stat='pendingModules']").textContent = pendingModules;
    document.querySelector("[data-stat='averageProgress']").textContent = averageProgress + "%";

}

const circleProgress = document.getElementById("circleProgress");
const circleProgressValue = document.getElementById("circleProgressValue");

function renderCircleProgress(dashboard) {
    const overallPercentage = document.getElementById("overallProgressText");
    overallPercentage.textContent = dashboard.averageProgress + "%";
    const progress = dashboard.averageProgress;
    circleProgressValue.textContent = progress + "%";
    circleProgress.style.background =
        `conic-gradient(
        var(--violet) ${progress * 3.6}deg,
        #2A2A3A 0deg
    )`;

}


import { renderCharts } from "./charts.js";


export function renderUpcomingTasks(tasks) {
    const taskList = document.getElementById("taskList");


    if (tasks.length === 0) {

        taskList.innerHTML = `
<li class="empty-list">
    <i class="fa-solid fa-calendar-xmark"></i>
    No upcoming tasks
</li>`;

        return;

    }


    taskList.innerHTML = "";

    tasks.forEach(task => {

        const dueDate = new Date(task.dueDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        taskList.innerHTML += `
            <li class="task-item">

                <div class="task-info">

                    <h4>${task.title}</h4>

                    <p>${task.course}</p>

                </div>

                <div class="task-right">

                    <span class="task-status">${task.status}</span>

                    <p class="task-date">
                        <i class="fa-regular fa-calendar"></i>
                        ${dueDate}
                    </p>

                </div>

            </li>
        `;

    });

}


export function renderRecentActivity(activities) {
    const activityList = document.getElementById("activityList");

    if (activities.length === 0) {

        activityList.innerHTML = `
<li class="empty-list">
    <i class="fa-solid fa-clock"></i>
    No recent activity
</li>`;

        return;

    }


    activityList.innerHTML = "";

    activities.forEach(activity => {

        const activityDate = new Date(activity.date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        activityList.innerHTML += `
            <li class="activity-item">

                <div class="activity-info">

                    <h4>
                        <i class="fa-solid fa-circle-check"></i>
                        ${activity.title}
                    </h4>

                    <p>Learning Activity</p>

                </div>

                <p class="activity-date">

                    ${activityDate}

                </p>

            </li>
        `;

    });

}



// <------- COURSES ---------->

export function renderCourses(courses) {

    const coursesGrid = document.getElementById("coursesGrid");

    coursesGrid.innerHTML = "";

    if (courses.length === 0) {

        coursesGrid.innerHTML = `
            <div class="empty-courses">
                <i class="fa-solid fa-book-open"></i>
                <h3>No Courses Enrolled</h3>
                <p>You haven't enrolled in any course yet.</p>
            </div>
        `;

        return;
    }

    courses.forEach(course => {

        coursesGrid.innerHTML += `
            <article class="course-card">

                <img
                    src="${course.image}"
                    alt="${course.title}"
                    class="course-image"
                >

                <div class="course-content">

                    <h3>${course.title}</h3>

                    <p class="instructor">
                        ${course.instructor}
                    </p>

                    <div class="progress-bar">

                        <div
                            class="progress-fill"
                            style="width:${course.progress}%">
                        </div>

                    </div>

                    <div class="course-footer">

                        <span>${course.progress}% Complete</span>

                        <span class="grade grade-${course.grade}">
                            ${course.grade}
                        </span>

                    </div>

                    <button class="continue-btn">
                        Continue Learning
                    </button>

                </div>

            </article>
        `;

    });

}


