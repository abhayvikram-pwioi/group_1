async function getAllEvents() {

    const jsonEvents = await fetch("../data/events.json").then(res => res.json());

    const localEvents = JSON.parse(localStorage.getItem("events")) || [];

    return [...jsonEvents, ...localEvents];
    
}

async function renderEventCard() {
    const events = await getAllEvents();

    const container = document.querySelector(".event-list");
    events.forEach(element => {
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
                            <p id="attendees-num">${element.attendees}</p>
                            <p id="total-attendee">/ ${element.maxAttendees}</p>
                        </div>

                        <div class="card-btns">
                            <button id="event-detail">Detail</button>
                            <button id="register-event">Register</button>
                        </div>
                    </div>
                </div>

            </div>
        `
    });

}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short"}).toUpperCase();
    return `${day} ${month}`;
}

renderEventCard();



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


function addTypingMessage(){

    const container = document.getElementById("chatBody");

    container.insertAdjacentHTML("beforeend",`

        <div class="bot-message typing" id="typing">

            <p>Typing...</p>

        </div>

    `);

}

function removeTypingMessage(){

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

async function showTotalEvents(){
    const totalEvents = await getAllEvents();
    document.querySelector(".live-msg p").innerText = `Live · ${totalEvents.length} events this season`;
    document.querySelector(".event-headline p").innerText = `${totalEvents.length} EVENTS`
}
showTotalEvents();