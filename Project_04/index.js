async function getAllEvents() {

    const jsonEvents = await fetch("events.json").then(res => res.json());

    const localEvents = JSON.parse(localStorage.getItem("events")) || [];

    return [...jsonEvents, ...localEvents];

}

async function renderEventCard(events) {

    const container = document.querySelector(".event-list");
    container.innerHTML = "";
    const attendeeCounts = JSON.parse(localStorage.getItem("attendeeCounts")) || {};
    events.forEach(element => {
        const attendees = attendeeCounts[element.id] ?? element.attendees;

        container.innerHTML += `
         <div class="event-card-sec">
                <div class="card-img">
                    <img src="${element.image}" alt="" id="event-card-img">
                </div>

                <div class="date-cate">
                    <div class="date-text">
                        ${formatDate(element.date)}
                    </div>
                    <div class="cate-text">
               ${element.category.toUpperCase()}
                    </div>
                </div>

                <div class="event-details-text">
                    <h1>${element.title}</h1>
                    <div class="time-location-text">
                        <p id="event-card-time"><i class="fa-solid fa-clock"></i>${element.time}</p>
                        <p id="event-card-location"><i class="fa-solid fa-location-dot"></i>${element.location}</p>
                    </div>
                    <div class="description">
                        ${element.description}
                    </div>
                    <hr id = "event-card-hr">
                    <div class="event-card-bottom">
                        <div class="attendees">
                            <p id="attendees-num">${attendees || 0}</p>
                            <p id="total-attendee">/ ${element.maxAttendees}</p>
                        </div>

                        <div class="card-btns">
                            <button class="event-detail" data-id="${element.id}">Detail</button>
                            <button class="register-event" data-id="${element.id}">Register</button>
                        </div>
                    </div>
                </div>

            </div>
        `
    });

    document.querySelectorAll(".register-event").forEach(btn => {

        btn.addEventListener("click", () => {

            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if(!currentUser) alert("Please Login First");

            if (currentUser.role === "admin") {

                alert("Admins cannot register for events. Please log in with a user account.");

                return;

            }

            const id = btn.dataset.id;

            const selectedEvent = events.find(
                event => String(event.id) === String(id)
            );

            localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

            window.location.href = "EventRegistration.html";

        });

    });

    document.querySelectorAll(".event-detail").forEach(btn => {

        btn.addEventListener("click", () => {

             const id = btn.dataset.id;

            const selectedEvent = events.find(
                event => String(event.id) === String(id)
            );

            localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

            localStorage.setItem("selectedEvent", JSON.stringify(selectedEvent));

            window.location.href = "EventDetails.html";

        });

    });


}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    return `${day} ${month}`;
}


const chatToggle = document.querySelector("#chatToggle");
const chatBox = document.querySelector("#chatBox");
const closeChat = document.querySelector("#closeChat");

chatToggle.onclick = () => {

    chatBox.classList.add("active");

}

closeChat.onclick = () => {

    chatBox.classList.remove("active");

}

function getCurrentTime() {

    return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

}

const sendMsgBtn = document.getElementById("sendBtn");

sendMsgBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    const container = document.getElementById("chatBody");
    if (message === "") return;

    container.innerHTML += `
            <div class="user-message">
                <p>${message}</p>
                <span>${getCurrentTime()}</span>
            </div>

   `
    addTypingMessage();

    const reply = await generateReply(message);

    setTimeout(() => {
        removeTypingMessage();
        addBotMessage(reply);

    }, 1200);

    input.value = "";

    container.scrollTop = container.scrollHeight;
});


function addTypingMessage() {

    const container = document.getElementById("chatBody");

    container.insertAdjacentHTML("beforeend", `

        <div class="bot-message typing" id="typing">

            <p>Typing...</p>

        </div>

    `);

}

function removeTypingMessage() {

    document.getElementById("typing")?.remove();

}

function searchCategory(events, message) {

    const categories = [
        "technology",
        "music",
        "business",
        "art",
        "health",
        "photography",
        "workshop"
    ];

    const category = categories.find(cat =>
        message.includes(cat) ||
        (cat === "technology" && message.includes("tech"))
    );

    if (!category) return [];

    return events.filter(event =>
        event.category.toLowerCase().includes(category)
    );

}

function searchLocation(events, message) {

    return events.filter(event =>
        message.includes(event.location.toLowerCase())
    );

}

function searchDate(events, message) {

    return events.filter(event => {

        const date = new Date(event.date);

        const formatted = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long"
        }).toLowerCase();

        return message.includes(formatted);

    });

}

function searchTitle(events, message) {

    return events.filter(event =>
        message.includes(event.title.toLowerCase())
    );

}

function buildReply(title, events) {
    if (events.length == 0) {

        return `${title} No events are currently available.`;
    }



    let reply = `${title}<br>`;

    events.slice(0, 3).forEach((event) => {
        reply += `
        <div class="chat-event">

    <h4>${event.title}</h4>

    <p>${event.category}</p>

    <span>${event.date} • ${event.time}</span>

    <small>${event.location}</small>

</div>
        `
    });

    reply += "<p>Need more details? Type the event name.</p>";

    return reply;
}

async function generateReply(message) {

    message = message.toLowerCase().trim();
    const events = await getAllEvents();


    if (
        message.includes("hi") ||
        message.includes("hello") ||
        message.includes("hey")
    ) {

        return `
Hello!

I'm your Event Assistant Scout.

You can search events by:<br>

• Category<br>
• Location<br>
• Date<br>
• Event name<br>
`;

    }

    if (message.includes("help")) {

        return `
Try asking:

Technology Events

Music Events

Events in Delhi

20 July

Frontend Bootcamp
`;

    }

    let result = searchCategory(events, message);

    if (result.length) {
        return buildReply(`I found events matching your search.<br>Here are the most relevant results:<br>`, result);
    }

    result = searchLocation(events, message);

    if (result.length)
        return buildReply(
            `Events in this location.`,
            result
        );


    result = searchDate(events, message);

    if (result.length)
        return buildReply(
            `Events on this date.`,
            result
        );

    result = searchTitle(events, message);

    if (result.length)
        return buildReply(`Here's the event you searched for.`, result);

    return `
        <strong>Sorry, I couldn't understand your question..</strong><br><br>

        Try searching by category, location, or keyword.<br><br>

        <strong>Popular searches:</strong><br>

        • Technology<br>
        • Music<br>
        • Workshops<br>
        • Delhi<br><br>

        Need help finding something specific? Just let me know.
    `;

}


function addBotMessage(message) {
    const container = document.getElementById("chatBody");

    container.innerHTML += `
     <div class="bot-message">
                <p>
                   ${message}
                </p>
                <span>${getCurrentTime()}</span>
            </div>
    `
}

const quickReplies = document.querySelectorAll(".quick-replies button");

quickReplies.forEach(button => {

    button.addEventListener("click", () => {

        const message = button.innerText;

        sendMessage(message);

    });

});

async function sendMessage(message) {
    const container = document.getElementById("chatBody");
    container.insertAdjacentHTML("beforeend", `
        <div class="user-message">
            <p>${message}</p>
            <span>${getCurrentTime()}</span>
        </div>

    `);
    const reply = await generateReply(message);
    addBotMessage(reply);
}

async function showTotalEvents() {
    const totalEvents = await getAllEvents();
    document.querySelector(".live-msg p").innerText = `Live · ${totalEvents.length} events this season`;
    document.querySelector(".event-headline p").innerText = `${totalEvents.length} EVENTS`
}
showTotalEvents();


const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
    document.querySelector(".login-side").style.display = "none";
    document.querySelector(".profile-side").style.display = "flex";
    document.querySelector("#profile-pic").src = currentUser.profilePic;
}


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





let allEvents = [];

async function loadEvents() {

    allEvents = await getAllEvents();

    renderEventCard(allEvents);

}

document.getElementById("search").addEventListener("input", filterEvents);

document.getElementById("category").addEventListener("change", filterEvents);

document.getElementById("date").addEventListener("change", filterEvents);

function filterEvents() {

    const keyword = document.getElementById("search").value.toLowerCase().trim();

    const category = document.getElementById("category").value;

    const date = document.getElementById("date").value;

    const filtered = allEvents.filter(event => {

        const searchMatch =

            event.title.toLowerCase().includes(keyword) ||

            event.location.toLowerCase().includes(keyword) ||

            event.description.toLowerCase().includes(keyword) ||

            event.organizer.toLowerCase().includes(keyword);

        const categoryMatch =

            category === "" ||

            event.category.toLowerCase() === category.toLowerCase();

        const dateMatch =

            date === "" ||

            event.date === date;

        return searchMatch && categoryMatch && dateMatch;

    });

    if (filtered.length === 0) {

        document.querySelector(".event-list").innerHTML = `
        <div class="no-events">
            <h2>No Events Found</h2>
            <p>Try changing your search, category or date.</p>
        </div>
    `;

        return;
    }

    renderEventCard(filtered);

}

loadEvents();