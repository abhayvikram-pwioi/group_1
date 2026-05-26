const chartLabels = {

    calories: "Calories Burned",

    attendence: "Attendance",

    workoutSessions: "Workout Sessions",

    weightProgress: "Weight Progress"

}


const chartDataMock = {

    calories: {

        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [500, 600, 400, 750, 500, 900, 650]
        },

        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [6.7, 4100, 3800, 5200]
        },

        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [12000, 15000, 14000, 18000, 16000, 20000, 19000, 23000, 21000, 25000, 24000, 28000]
        }

    },


    attendence: {

        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1, 1, 0, 1, 1, 1, 0]
        },

        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [5, 6, 4, 7]
        },

        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [18, 20, 16, 22, 19, 24, 21, 26, 23, 28, 25, 30]
        }

    },



    workoutSessions: {

        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1, 2, 1, 3, 2, 4, 2]
        },

        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [8, 10, 9, 12]
        },

        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [35, 42, 40, 48, 44, 52, 49, 58, 55, 61, 60, 68]
        }

    },



    weightProgress: {

        weekly: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [82, 81.8, 81.6, 81.5, 81.2, 81, 80.8]
        },

        monthly: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            data: [83, 82.5, 81.8, 80.8]
        },

        yearly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [90, 89, 88, 87, 86, 85, 84, 83, 82, 81, 80, 78]
        }

    }

};


const doughnutDataMock = {
    weekly: [360, 20, 20, 10],
    monthly: [25, 35, 15, 25],
    yearly: [5, 25, 45, 15]

};

const chartDescriptions = {

    calories: {
        title: "Calories Burned",
        subtitle: "Calories burned over time"
    },

    attendence: {
        title: "Attendance Tracking",
        subtitle: "Gym attendance over time"
    },

    workoutSessions: {
        title: "Workout Sessions",
        subtitle: "Workout sessions completed over time"
    },

    weightProgress: {
        title: "Weight Progress",
        subtitle: "Weight changes over time"
    }

}