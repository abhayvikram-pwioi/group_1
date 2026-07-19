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

    const averageProgress = Math.round(
        courses.reduce((total, course) => total + course.progress, 0) / totalCourses
    );

    document.querySelector("[data-stat='totalCourses']").textContent = totalCourses;
    document.querySelector("[data-stat='completedCourses']").textContent = completedCourses;
    document.querySelector("[data-stat='pendingModules']").textContent = pendingModules;
    document.querySelector("[data-stat='averageProgress']").textContent = averageProgress + "%";

}

const circleProgress = document.getElementById("circleProgress");
const circleProgressValue = document.getElementById("circleProgressValue");

function renderCircleProgress(dashboard) {

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
    taskList.innerHTML = "";
    tasks.forEach(task => {
        taskList.innerHTML += `
            <li class="task-item">

                <div>
                    <h4>${task.title}</h4>
                    <p>${task.course}</p>
                </div>

                <span>${task.dueDate}</span>

            </li>
        `;
    });

}


export function renderRecentActivity(activities) {

    const activityList = document.getElementById("activityList");
    activityList.innerHTML = "";
    activities.forEach(activity => {
        activityList.innerHTML += `
            <li class="activity-item">

                <div>
                    <h4>${activity.title}</h4>
                </div>

                <span>${activity.date}</span>

            </li>
        `;
    });

}

