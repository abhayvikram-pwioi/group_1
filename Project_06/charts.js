let progressChart;
let gradesChart;
let subjectChart;
let attendanceChart;

const progressCanvas = document.getElementById("progressChart");
const gradesCanvas = document.getElementById("gradesChart");
const subjectCanvas = document.getElementById("subjectChart");
const attendanceCanvas = document.getElementById("attendanceChart");

export function renderCharts(dashboard) {

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(progressCanvas, {
        type: "line",

        data: {
            labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],

            datasets: [{
                label: "Progress",

                data: dashboard.progressChart,

                borderColor: "#7C5CFF",

                backgroundColor: "rgba(124,92,255,0.2)",

                fill: true,

                tension: 0.4
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: false
                }
            }
        }

    });

}