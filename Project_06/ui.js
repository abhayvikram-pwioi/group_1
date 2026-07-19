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
    renderStats(student.dashboard);
    renderCircleProgress(student.dashboard);
    renderCharts(student.dashboard);
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

const coursesEnrolled = document.querySelector('[data-stat="totalCourses"]');
const completedCourses = document.querySelector('[data-stat="completedCourses"]');
const pendingModules = document.querySelector('[data-stat="pendingModules"]');
const averageProgress = document.querySelector('[data-stat="averageProgress"]');

function renderStats(dashboard){

coursesEnrolled.textContent = dashboard.coursesEnrolled;
completedCourses.textContent = dashboard.completedCourses;
pendingModules.textContent = dashboard.pendingModules;
averageProgress.textContent = dashboard.averageProgress + "%";

}

const circleProgress = document.getElementById("circleProgress");
const circleProgressValue = document.getElementById("circleProgressValue");

function renderCircleProgress(dashboard){

    const progress = dashboard.averageProgress;
    circleProgressValue.textContent = progress + "%";
    circleProgress.style.background =
    `conic-gradient(
        var(--violet) ${progress * 3.6}deg,
        #2A2A3A 0deg
    )`;

}


import { renderCharts } from "./charts.js";