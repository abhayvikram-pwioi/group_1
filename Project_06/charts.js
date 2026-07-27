let progressChart;
let gradesChart;
let subjectChart;
let attendanceChart;

const progressCanvas = document.getElementById("progressChart");
const gradesCanvas = document.getElementById("gradesChart");
const subjectCanvas = document.getElementById("subjectChart");
const attendanceCanvas = document.getElementById("attendanceChart");

export function renderCharts(courses) {

    if (courses.length === 0) {
        showEmptyCharts();
        return;
    }

    const courseNames = courses.map(course => {
        if (course.title === "Database Management System") return "DBMS";
        if (course.title === "Data Structures & Algorithms") return "DSA";
        if (course.title === "Java Programming") return "Java";
        if (course.title === "Operating System") return "OS";
        return course.title;
    });
    const progressData = courses.map(course => course.progress);
    const attendanceData = courses.map(course => course.attendance);
    const grades = courses.map(course => course.grade);

    if (!courses || courses.length === 0) {
        return;
    }

    const gradeCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0
    };

    grades.forEach((grade) => {

        if (gradeCount[grade] !== undefined) {
            gradeCount[grade]++;
        }
    });

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(progressCanvas, {

        type: "line",

        data: {

            labels: courseNames,

            datasets: [{

                label: "Progress",

                data: progressData,

                borderColor: "#7C5CFF",

                backgroundColor: "rgba(124,92,255,0.15)",

                fill: true,

                tension: 0.4,

                borderWidth: 3,

                pointRadius: 5,

                pointHoverRadius: 7

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100,

                    ticks: {

                        callback: (value) => value + "%"

                    }

                }

            }

        }

    });




    if (gradesChart) {
        gradesChart.destroy();
    }

    gradesChart = new Chart(gradesCanvas, {

        type: "doughnut",

        data: {

            labels: ["Grade A", "Grade B", "Grade C", "Grade D"],

            datasets: [{

                data: [
                    gradeCount.A,
                    gradeCount.B,
                    gradeCount.C,
                    gradeCount.D
                ],

                backgroundColor: [
                    "#7C5CFF",
                    "#4DA6FF",
                    "#FFD43B",
                    "#FF4ECD"
                ],

                borderWidth: 0,

                hoverOffset: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            cutout: "70%",

            plugins: {

                legend: {

                    position: "bottom",

                    labels: {

                        color: "#FFFFFF",

                        padding: 20,

                        usePointStyle: true,

                        pointStyle: "circle"

                    }

                }

            }

        }

    });



    if (subjectChart) {
        subjectChart.destroy();
    }

    subjectChart = new Chart(subjectCanvas, {

        type: "bar",

        data: {

            labels: courseNames,

            datasets: [{

                label: "Progress",

                data: progressData,

                backgroundColor: "#7C5CFF",

                borderRadius: 8

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    });




    if (attendanceChart) {
        attendanceChart.destroy();
    }

    attendanceChart = new Chart(attendanceCanvas, {

        type: "line",

        data: {

            labels: courseNames,

            datasets: [{

                label: "Attendance",

                data: attendanceData,

                borderColor: "#4DA6FF",

                backgroundColor: "rgba(77,166,255,0.15)",

                fill: true,

                tension: 0.4,

                borderWidth: 3

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    max: 100

                }

            }

        }

    });

}


function showEmptyCharts(){

    progressCanvas.parentElement.innerHTML =
        `<div class="empty-chart">
            <i class="fa-solid fa-chart-line"></i>
            <p>No learning data available</p>
        </div>`;

    gradesCanvas.parentElement.innerHTML =
        `<div class="empty-chart">
            <i class="fa-solid fa-chart-pie"></i>
            <p>No grades yet</p>
        </div>`;

    subjectCanvas.parentElement.innerHTML =
        `<div class="empty-chart">
            <i class="fa-solid fa-book"></i>
            <p>No subjects available</p>
        </div>`;

    attendanceCanvas.parentElement.innerHTML =
        `<div class="empty-chart">
            <i class="fa-solid fa-calendar-check"></i>
            <p>No attendance records</p>
        </div>`;
}