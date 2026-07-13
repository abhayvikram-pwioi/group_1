const EVENT_KEY = "selectedEvent";

document.addEventListener("DOMContentLoaded", init);

function init() {

    loadEvent();

    document.querySelector(".back-btn").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "index.html";
    });

    document.getElementById("registerBtn").addEventListener("click", () => {

        const user = JSON.parse(localStorage.getItem("currentUser"));

        if (!user) {
            alert("Please login first.");
            window.location.href = "LoginPage.html";
            return;
        }

        if (user.role === "admin") {
            alert("Admin cannot register for events.");
            return;
        }

        window.location.href = "EventRegistration.html";
    });

}

function loadEvent() {

    const event = JSON.parse(localStorage.getItem(EVENT_KEY));

    if (!event) {
        alert("No event selected.");
        window.location.href = "index.html";
        return;
    }

    const attendeeCounts = JSON.parse(localStorage.getItem("attendeeCounts")) || {};
    const attendees = attendeeCounts[event.id] ?? event.attendees;


    document.getElementById("eventImage").src = event.image;

    document.getElementById("category").innerText = event.category;

    document.getElementById("title").innerText = event.title;

    document.getElementById("tagline").innerText = event.description;

    document.getElementById("date").innerText = event.date;

    document.getElementById("time").innerText = event.time;

    document.getElementById("duration").innerText = event.duration || "Available Soon";

    document.getElementById("location").innerText = event.location;

    document.getElementById("speaker").innerText = event.speaker || "To Be Announced";

    document.getElementById("about").innerText = event.fullDescription || "Description not available.";

    document.getElementById("organizer").innerText = event.organizer || "UniEvents";

    document.getElementById("attendees").innerText = attendees || 0;

    document.getElementById("maxAttendees").innerText = event.maxAttendees;

    document.getElementById("seats").innerText = event.maxAttendees - (attendees || 0);


    const progress = (attendees / event.maxAttendees) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";


    const highlightBox = document.querySelector(".highlight-box");

    highlightBox.innerHTML = "";

    const highlights = event.highlights || [];

    if (highlights.length === 0) {
        document.querySelector(".highlights").style.display = "none";
    } else {
        event.highlights.forEach(item => {
    
            highlightBox.innerHTML += `
                <div class="item">
                    ✅ ${item}
                </div>
            `;
    
        });
    }


    //---------------- Learning ----------------//

    const learn = document.querySelector(".learn ul");

    learn.innerHTML = "";

    const learnD = event.learn || [];

    if (learnD.length === 0) {
        document.querySelector(".learn").style.display = "none";
    } else {
        event.learning.forEach(item => {
    
            learn.innerHTML += `
                <li>${item}</li>
            `;
    
        });
    }


    //---------------- Agenda ----------------//

    const agenda = document.getElementById("agenda");

    agenda.innerHTML = "";

    const agendaD = event.agenda || [];
    if (agendaD.length === 0) {
        document.querySelector(".agenda").style.display = "none";
    } else {

        event.agenda.forEach(item => {
    
            agenda.innerHTML += `
                <li>${item}</li>
            `;
    
        });
    }


    //---------------- Organizer ----------------//

    const organizerCard =
        document.querySelector(".organizer-card");

    organizerCard.innerHTML = `
        <img src="${event.organizerImage || "https://i.pravatar.cc/150?img=12"}">

        <div>

            <h3>${event.organizer || "UniEvents Team"}</h3>

            <p>${event.organizerDesignation || "Event Organizer"}</p>

            <p>${event.organizer || "UniEvents"}</p>

        </div>
    `;

    //---------------- Contact ----------------//

    document.querySelector(".contact").innerHTML = `
        <h2>Contact Information</h2>

        <p>📧 ${event.contact?.email || "unievents@gmail.com"}</p>

        <p>📞 ${event.contact?.phone || "+91 9876543210" }</p>
    `;
}

/* ---------------- Profile dropdown menu ---------------- */

const profileImg = document.querySelector(".profile-img");
const dropdown = document.getElementById("profile-dropdown");

profileImg.addEventListener("click", (e) => {

    e.stopPropagation();
    dropdown.classList.toggle("active");

});

document.addEventListener("click", () => {

    dropdown.classList.remove("active");

});

const user = JSON.parse(localStorage.getItem("currentUser"));

if (user) {
    document.querySelector(".login-side").style.display = "none";
    document.querySelector(".profile-side").style.display = "flex";
    document.querySelector("#profile-pic").src = user.profilePic;
}

if (user) {
    document.getElementById("dropdown-name").innerText = user.fullName;
    document.getElementById("dropdown-email").innerText = user.email;

    document.getElementById("dropdown-pic").src = user.profilePic;
    document.getElementById("profile-pic").src = user.profilePic;

    if (user.role === "admin") {

        document.getElementById("registration-link").style.display = "none";

    } else {

        document.getElementById("dashboard-link").style.display = "none";

    }

    document.getElementById("logout-btn").addEventListener("click", () => {

        localStorage.removeItem("currentUser");

        window.location.href = "LoginPage.html";

    });

}
