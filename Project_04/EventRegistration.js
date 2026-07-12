const registrationForm = document.getElementById('registration-form');
const eventSelect = document.getElementById('event');
const eventRegistrationArea = document.getElementById('event-registration-area');
const REGISTRATION_STORAGE_KEY = 'meetupRegistrations';

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function getRemainingSeats(selectedEvent) {
  return selectedEvent.maxAttendees - selectedEvent.attendees;
}

function populateEventOptions() {
  eventDetails.forEach(function (eventItem) {
    const option = document.createElement('option');
    option.value = eventItem.id;
    option.textContent = eventItem.title;
    eventSelect.appendChild(option);
  });
}

function getSavedRegistrations() {
  return JSON.parse(localStorage.getItem(REGISTRATION_STORAGE_KEY)) || [];
}

function saveRegistration(selectedEvent) {
  const savedRegistrations = getSavedRegistrations();
  const registrationData = {
    eventId: selectedEvent.id,
    eventTitle: selectedEvent.title,
    fullName: document.getElementById('full-name').value.trim(),
    email: document.getElementById('reg-email').value.trim().toLowerCase(),
    password: document.getElementById('reg-password').value,
    phone: document.getElementById('phone').value.trim(),
    organization: document.getElementById('organization').value.trim(),
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    tickets: document.getElementById('tickets').value || '1',
    emergencyContact: document.getElementById('emergency').value.trim(),
    specialRequirements: document.getElementById('requirements').value.trim(),
    registeredAt: new Date().toISOString()
  };

  savedRegistrations.push(registrationData);
  localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(savedRegistrations));
}

function resetRegistrationPage() {
  eventRegistrationArea.classList.add('is-hidden');
  setText('page-title', 'Choose an event to register');
  setText('page-description', 'Select the event first, then fill the form below to book your seat.');
}

function updateEventDetails(selectedEvent) {
  const remainingSeats = getRemainingSeats(selectedEvent) + ' seats';
  const eventBanner = document.getElementById('event-banner');

  eventBanner.textContent = selectedEvent.title;
  eventBanner.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, .35), rgba(0, 0, 0, .35)), url("' + selectedEvent.image + '")';
  eventBanner.style.backgroundSize = 'cover';
  eventBanner.style.backgroundPosition = 'center';

  setText('page-title', 'Register for ' + selectedEvent.title);
  setText('page-description', 'Fill the form below to book your seat for ' + selectedEvent.title + '.');
  setText('event-category', selectedEvent.category);
  setText('event-title', selectedEvent.title);
  setText('event-date', selectedEvent.date);
  setText('event-time', selectedEvent.time);
  setText('event-venue', selectedEvent.location);
  setText('event-seats', remainingSeats);
  setText('event-duration', selectedEvent.duration);
  setText('event-speaker', selectedEvent.speaker);
  setText('info-name', selectedEvent.title);
  setText('info-date', selectedEvent.date);
  setText('info-time', selectedEvent.time);
  setText('info-venue', selectedEvent.location);
  setText('info-organizer', selectedEvent.organizer);
  setText('info-fee', selectedEvent.price);
  setText('info-seats', remainingSeats);
  setText('info-duration', selectedEvent.duration);
  setText('info-speaker', selectedEvent.speaker);
  setText('info-description', selectedEvent.description);
}

eventSelect.addEventListener('change', function () {
  const selectedEvent = eventDetails.find(function (eventItem) {
    return String(eventItem.id) === eventSelect.value;
  });

  if (!selectedEvent) {
    resetRegistrationPage();
    return;
  }

  updateEventDetails(selectedEvent);
  eventRegistrationArea.classList.remove('is-hidden');
});

registrationForm.addEventListener('reset', function () {
  window.setTimeout(function () {
    eventSelect.value = '';
    resetRegistrationPage();
  }, 0);
});

registrationForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const selectedEvent = eventDetails.find(function (eventItem) {
    return String(eventItem.id) === eventSelect.value;
  });

  if (!selectedEvent) {
    eventSelect.focus();
    alert('Please select an event first.');
    return;
  }

  saveRegistration(selectedEvent);
  alert('You have been registered for the event ' + selectedEvent.title + '.');
  window.location.href = 'login.html';
});

populateEventOptions();
