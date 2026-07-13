const CURRENT_USER = "currentUser";
const REGISTRATION_KEY = "registrations";
const EVENT_KEY = "selectedEvent";

document.addEventListener("DOMContentLoaded", init);

async function init() {

  checkLogin();

  await loadSelectedEvent();

  document.getElementById("registration-form").addEventListener("submit", registerEvent);

}

function checkLogin() {

  const user = JSON.parse(localStorage.getItem(CURRENT_USER));

  if (!user) {

    alert("Please login first.");

    window.location.href = "LoginPage.html";

    return;

  }

  document.getElementById("full-name").value = user.fullName;
  document.getElementById("reg-email").value = user.email;

}


async function loadSelectedEvent() {

  let event = JSON.parse(localStorage.getItem(EVENT_KEY));
  console.log(event);

  if (!event) {

    const events = await fetch("events.json").then(res => res.json());
    event = events[0];
  }

    const attendeeCounts = JSON.parse(localStorage.getItem("attendeeCounts")) || {};
        const attendees = attendeeCounts[event.id] ?? event.attendees;

  document.getElementById("event-registration-area").classList.remove("is-hidden");

  document.getElementById("event-title").innerText = event.title;
  document.getElementById("event-category").innerText = event.category;
  document.getElementById("event-date").innerText = event.date;
  document.getElementById("event-time").innerText = event.time;
  document.getElementById("event-venue").innerText = event.location;
  document.getElementById("event-seats").innerText = (event.maxAttendees - attendees) + " Seats";

  document.getElementById("event-duration").innerText = event.duration;

  document.getElementById("event-speaker").innerText = event.speaker;

  document.getElementById("event-banner").innerHTML = `
        <img src="${event.image}"
        style="width:100%;height:100%;object-fit:cover;border-radius:15px;">
    `;


  document.getElementById("info-name").innerText = event.title;
  document.getElementById("info-date").innerText = event.date;
  document.getElementById("info-time").innerText = event.time;
  document.getElementById("info-venue").innerText = event.location;
  document.getElementById("info-organizer").innerText = event.organizer;
  document.getElementById("info-fee").innerText = event.price;
  document.getElementById("info-seats").innerText = event.availableSeats + " Seats";

  document.getElementById("info-duration").innerText = event.duration;

  document.getElementById("info-speaker").innerText = event.speaker;

  document.getElementById("info-description").innerText = event.description;

}

async function registerEvent(e) {

  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));

  const selectedEvent = JSON.parse(localStorage.getItem(EVENT_KEY));

  const registrations = JSON.parse(localStorage.getItem(REGISTRATION_KEY)) || [];

  if (currentUser.role === "admin") {

    alert("Admins cannot register for events. Please log in with a user account.");

    return;

  }

  async function getAllEvents() {

    const jsonEvents = await fetch("events.json").then(res => res.json());

    const localEvents = JSON.parse(localStorage.getItem("events")) || [];

    return [...jsonEvents, ...localEvents];

  }

  const events = await getAllEvents();

  const eventIndex = events.findIndex(e => e.id == selectedEvent.id);

  if (eventIndex !== -1) {

    const attendeeCounts = JSON.parse(localStorage.getItem("attendeeCounts")) || {};

    const tickets = Number(document.getElementById("tickets").value);

    attendeeCounts[selectedEvent.id] = (attendeeCounts[selectedEvent.id] || selectedEvent.attendees) + tickets;

    localStorage.setItem("attendeeCounts", JSON.stringify(attendeeCounts));

  }


  const totalTickets = Number(document.getElementById("tickets").value);

  if (selectedEvent.attendees + totalTickets > selectedEvent.maxAttendees) {

    alert("Sorry! No seats available.");

    return;

  }

  const phone = document.getElementById("phone").value.trim();

  if (!/^[6-9]\d{9}$/.test(phone)) {

    alert("Enter a valid phone number.");

    return;

  }

  const age = Number(document.getElementById("age").value);

  if (age < 15 || age > 100) {

    alert("Age must be between 15 and 100.");

    return;

  }

  const emergency = document.getElementById("emergency").value.trim();

  if (emergency && !/^[6-9]\d{9}$/.test(emergency)) {

    alert("Invalid emergency contact.");

    return;

  }

  const name = document.getElementById("full-name").value.trim();

  if (name.length < 3) {

    alert("Full name must contain at least 3 characters.");

    return;

  }

  const org = document.getElementById("organization").value.trim();

  if (org.length < 3) {

    alert("Enter your college or organization.");

    return;

  }

  const tickets = Number(document.getElementById("tickets").value);

  if (tickets < 1) {

    alert("Minimum one ticket is required.");

    return;

  }


  const alreadyRegistered = registrations.find(reg =>

    reg.userEmail === currentUser.email &&
    reg.eventId === selectedEvent.id

  );

  if (alreadyRegistered) {

    alert("You have already registered for this event.");

    return;

  }

  const registration = {

    id: Date.now(),

    eventId: selectedEvent.id,

    userName:
      document.getElementById("full-name").value,

    userEmail:
      document.getElementById("reg-email").value,

    phone:
      document.getElementById("phone").value,

    organization:
      document.getElementById("organization").value,

    age:
      document.getElementById("age").value,

    gender:
      document.getElementById("gender").value,

    tickets:
      document.getElementById("tickets").value,

    emergency:
      document.getElementById("emergency").value,

    requirements:
      document.getElementById("requirements").value,

    registeredAt:
      new Date().toISOString()

  };

  registrations.push(registration);

  localStorage.setItem(REGISTRATION_KEY, JSON.stringify(registrations));

  const popup = document.getElementById("successPopup");

  document.getElementById("popupMessage").innerHTML = `
You have successfully registered for
<b>${selectedEvent.title}</b>.<br><br>
Tickets : ${registration.tickets}
`;

  popup.classList.add("active");

  document.getElementById("popupBtn").onclick = () => {
    window.location.href = "index.html";
  };

  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);

}


const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser) {
  document.querySelector(".profile-side").style.display = "flex";
  document.querySelector("#profile-pic").src = currentUser.profilePic;
}


const profileImg = document.querySelector(".profile-img");
const dropdown = document.getElementById("profile-dropdown");

profileImg.addEventListener("click",(e)=>{

    e.stopPropagation();
    dropdown.classList.toggle("active");

});

document.addEventListener("click",()=>{

    dropdown.classList.remove("active");

});

const user = JSON.parse(localStorage.getItem("currentUser"));

document.getElementById("dropdown-name").innerText = user.fullName;
document.getElementById("dropdown-email").innerText = user.email;

document.getElementById("dropdown-pic").src = user.profilePic;
document.getElementById("profile-pic").src = user.profilePic;

if(user.role === "admin"){

    document.getElementById("registration-link").style.display = "none";

}else{

    document.getElementById("dashboard-link").style.display = "none";

}

document.getElementById("logout-btn").addEventListener("click",()=>{

    localStorage.removeItem("currentUser");

    window.location.href = "LoginPage.html";

});
