

const maxAttendees = 200;

let attendees = 120;

let registered = false;


const registerBtn = document.getElementById("registerBtn");

const attendeeText = document.getElementById("attendees");

const seatsText = document.getElementById("seats");

const progressBar = document.getElementById("progressBar");

const toast = document.getElementById("toast");

const eventImage = document.getElementById("eventImage");



function updateUI() {

    attendeeText.innerText = attendees;

    seatsText.innerText = maxAttendees - attendees;

    let percentage = (attendees / maxAttendees) * 100;

    progressBar.style.width = percentage + "%";

}

function showToast(message, color = "#28a745") {

    toast.innerText = message;

    toast.style.background = color;

    toast.style.display = "block";

    setTimeout(() => {

        toast.style.display = "none";

    }, 2500);

}



registerBtn.addEventListener("click", function () {

    if (registered) {

        showToast("You are already registered!", "#dc3545");

        return;

    }

    if (attendees >= maxAttendees) {

        showToast("Sorry! Event is Full.", "#dc3545");

        registerBtn.disabled = true;

        registerBtn.innerText = "Event Full";

        return;

    }

    attendees++;

    registered = true;

    updateUI();

    registerBtn.innerText = "Registered";

    registerBtn.disabled = true;

    showToast("Registration Successful!");

});



eventImage.onerror = function () {

    eventImage.src =
        "https://via.placeholder.com/700x450?text=No+Image";

};

updateUI();