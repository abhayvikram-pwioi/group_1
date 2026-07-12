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
