let maxAttendees = 200;
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

    // Keep the button state correct even if the event loaded already full
    if (attendees >= maxAttendees && !registered) {
        registerBtn.disabled = true;
        registerBtn.innerText = "Event Full";
    }
}

function showToast(message, color = "#28a745") {

    toast.innerText = message;
    toast.style.background = color;
    toast.classList.add("show");

    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
        toast.classList.remove("show");
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
    eventImage.src = "https://via.placeholder.com/700x450?text=No+Image";
};

updateUI();

async function loadEvent() {

    const id = Number(new URLSearchParams(window.location.search).get("id")) || 1;

    try {
        const response = await fetch("events.json");

        if (!response.ok) {
            throw new Error(`Failed to load events.json (status ${response.status})`);
        }

        const events = await response.json();
        const event = events.find(e => e.id === id);

        if (!event) {
            console.warn(`No event found with id ${id}`);
            return;
        }

        document.getElementById("title").innerText = event.title;
        document.getElementById("category").innerText = event.category;
        document.getElementById("tagline").innerText = event.tagline;
        document.getElementById("about").innerText = event.description;
        document.getElementById("date").innerText = event.date;
        document.getElementById("time").innerText = event.time;
        document.getElementById("duration").innerText = event.duration;
        document.getElementById("location").innerText = event.location;
        document.getElementById("speaker").innerText = event.speaker;
        document.getElementById("organizer").innerText = event.organizer;
        document.getElementById("eventImage").src = event.image;

        attendees = event.attendees;
        maxAttendees = event.maxAttendees;
        document.getElementById("maxAttendees").innerText = maxAttendees;

        const agenda = document.getElementById("agenda");
        agenda.innerHTML = "";
        event.agenda.forEach(item => {
            const li = document.createElement("li");
            li.innerText = item;
            agenda.appendChild(li);
        });

        // Reset button state in case a previous event left it disabled
        registered = false;
        registerBtn.disabled = false;
        registerBtn.innerText = "Register Now";

        updateUI();

    } catch (err) {
        console.error("Could not load event data:", err);
        // Falls back silently to the static placeholder content already in the HTML
    }
}

loadEvent();

/* ---------------- Profile dropdown menu ---------------- */

const profileImg = document.querySelector(".profile-img");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutBtn = document.getElementById("logout-btn");

if (profileImg && profileDropdown) {

    profileImg.addEventListener("click", function (e) {
        e.stopPropagation();
        profileDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
        if (!profileDropdown.contains(e.target)) {
            profileDropdown.classList.remove("active");
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
        profileDropdown.classList.remove("active");
        // Hook this up to your real logout/session logic
        window.location.href = "LoginPage.html";
    });
}
