

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





async function loadEvent(){

    const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;

    const response = await fetch("events.json");

    const events = await response.json();

    const event = events.find(e => e.id === id);

    if(!event) return;

    document.getElementById("title").innerText = event.title;

    document.getElementById("category").innerText = event.category;

    document.getElementById("description").innerText = event.description;

    document.getElementById("about").innerText = event.description;

    document.getElementById("date").innerText = event.date;

    document.getElementById("time").innerText = event.time;

    document.getElementById("location").innerText = event.location;

    document.getElementById("speaker").innerText = event.speaker;

    document.getElementById("organizer").innerText = event.organizer;

    document.getElementById("duration").innerText = event.duration;

    document.getElementById("eventImage").src = event.image;

    attendees = event.attendees;

    maxAttendees = event.maxAttendees;

    document.getElementById("maxAttendees").innerText = maxAttendees;

    const agenda=document.getElementById("agenda");

    agenda.innerHTML="";

    event.agenda.forEach(item=>{

        agenda.innerHTML+=`<li>${item}</li>`;

    });

    updateUI();

}

loadEvent();
