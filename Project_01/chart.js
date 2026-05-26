document.addEventListener("DOMContentLoaded", () => {
    

    const lineChart = document.getElementById("lineChart").getContext("2d");

    const gradient = lineChart.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(198,255,0,.35)');
    gradient.addColorStop(1, 'rgba(198,255,0,0)');


    window.myLineChart = new Chart(lineChart, {
        type: "line",
        data: {
            labels: chartDataMock.calories.weekly.labels,
            datasets: [{
                data: [...chartDataMock.calories.weekly.data],
                label: 'Calories Burned',
                borderColor: "#C6FF00",
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: "#E6FF57",
                pointBorderColor: "#E6FF57",
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#E6FF57',
                pointRadius: 3,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },

                tooltip: {
                    backgroundColor: "#151515",
                    titleColor: "#C6FF00",
                    bodyColor: "#ffffff",
                    borderColor: "rgba(198,255,0,.3)",
                    borderWidth: 1,
                    padding: 14,
                    cornerRadius: 14,
                    displayColors: false

                }
            },
            scales: {
                y: {
                    beginAtZero: true,

                    grid: {
                        display: true,
                        color: 'rgba(255,255,255,.03)',
                        drawBorder: false
                    }
                },

                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    })

    const doughnut = document.getElementById('doughnutChart').getContext('2d');
    window.doughnutChart = new Chart(doughnut, {
        type: 'doughnut',
        data: {
            labels: ['Strength', 'Cardio', 'Yoga', 'HIIT'],
            datasets: [{
                data: doughnutDataMock.weekly,
                backgroundColor: ['#C6FF00', '#32FF7E', '#00D4FF', '#FF9F1C'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true, pointStyle: 'circle' }
                }
            }
        }
    });


    const timeChangeBtns = document.querySelectorAll(".time-btn");
    const activityTopics = document.getElementById("activity-topic");
    const activityTopic = document.getElementById("activity-topic-text");
    const activitySubTopic = document.getElementById("activity-topic-subtext");

    let currentTime = "weekly";
    let currentTopic = "calories";

    function updateChart() {
        activityTopic.innerText = chartDescriptions[currentTopic].title;
        activitySubTopic.innerText = chartDescriptions[currentTopic].subtitle;

        const selectedData = chartDataMock[currentTopic][currentTime];

        window.myLineChart.data.labels = selectedData.labels;
        window.myLineChart.data.datasets[0].data = [...selectedData.data];
        window.myLineChart.data.datasets[0].label = chartLabels[currentTopic];
        window.myLineChart.update();

        const selectedDataDoughnut = doughnutDataMock[currentTime];
        window.doughnutChart.data.datasets[0].data = [...selectedDataDoughnut];
        window.doughnutChart.update();
    }

    timeChangeBtns.forEach(element => {
        element.addEventListener('click', () => {
            timeChangeBtns.forEach(ele => {
                ele.classList.remove("active-time-btn");
            });
            element.classList.add("active-time-btn");

            currentTime = element.getAttribute("date-time");

            updateChart();
        });

    });

    activityTopics.addEventListener('change', () => {
        currentTopic = activityTopics.value;
        updateChart();
    });


    let liveChange;
    function liveDataChange() {
        liveChange = setInterval(() => {
            const dataArray = chartDataMock.calories[currentTime].data;
            const lastIndex = dataArray.length - 1;
            const currentVal = dataArray[lastIndex];

            const change = Math.floor(Math.random() * 12) - 10;
            const newVal = Math.max(0, currentVal + change);

            dataArray[lastIndex] = newVal;

            updateChart();
        }, 1800)
    }

    setTimeout(() => {
        liveDataChange();
    }, 1800)



















});