const CURRENT_USER = "currentUser";
const REGISTRATION_KEY = "registrations";
const EVENT_KEY = "selectedEvent";

document.addEventListener("DOMContentLoaded", init);

async function init() {

  checkLogin();

  await loadSelectedEvent();

  document
    .getElementById("registration-form")
    .addEventListener("submit", registerEvent);

}

function checkLogin() {

  const user =
    JSON.parse(localStorage.getItem(CURRENT_USER));

  if (!user) {

    alert("Please login first.");

    window.location.href = "Login.html";

    return;

  }

  document.getElementById("full-name").value = user.fullName;
  document.getElementById("reg-email").value = user.email;

}

localStorage.setItem("selectedEvent", JSON.stringify(event));


async function loadSelectedEvent() {

  let event =
    JSON.parse(localStorage.getItem(EVENT_KEY));

  if (!event) {

    const events = await fetch("../data/events.json")
      .then(res => res.json());

    event = events[0];

  }

  document.getElementById("event-registration-area")
    .classList.remove("is-hidden");

  document.getElementById("event-title").innerText = event.title;
  document.getElementById("event-category").innerText = event.category;
  document.getElementById("event-date").innerText = event.date;
  document.getElementById("event-time").innerText = event.time;
  document.getElementById("event-venue").innerText = event.location;
  document.getElementById("event-seats").innerText =
    event.availableSeats + " Seats";

  document.getElementById("event-duration").innerText =
    event.duration;

  document.getElementById("event-speaker").innerText =
    event.speaker;

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
  document.getElementById("info-seats").innerText =
    event.availableSeats + " Seats";

  document.getElementById("info-duration").innerText =
    event.duration;

  document.getElementById("info-speaker").innerText =
    event.speaker;

  document.getElementById("info-description").innerText =
    event.description;

}

function registerEvent(e) {

  e.preventDefault();

  const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));

  const selectedEvent = JSON.parse(localStorage.getItem(EVENT_KEY));

  const registrations = JSON.parse(localStorage.getItem(REGISTRATION_KEY)) || [];

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

  alert("Registration Successful!");

  window.location.href = "index.html";

}