const eventDetails = [
  {
    id: 1,
    title: 'Frontend Bootcamp: Modern CSS',
    category: 'Technology',
    date: '2026-07-20',
    time: '10:00 AM',
    location: 'Online - Zoom & Discord',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    attendees: 97,
    maxAttendees: 100,
    price: 'Free',
    organizer: 'CodeMasters Community',
    duration: '4 Hours',
    speaker: 'Sarah Johnson',
    description: 'Master modern CSS by building responsive layouts using Flexbox, CSS Grid, Container Queries, View Transitions, and Scroll-driven Animations. This hands-on workshop includes live coding sessions, mini challenges, and real-world UI projects that will help you write clean, maintainable, and production-ready CSS. Perfect for beginners and frontend developers looking to level up their skills.',
    agenda: [
      'Introduction to Modern CSS',
      'Flexbox & CSS Grid',
      'Container Queries',
      'Scroll Animations',
      'Mini Project & Q&A'
    ],
    requirements: [
      'Basic HTML & CSS knowledge',
      'Laptop with VS Code',
      'Stable internet connection'
    ]
  },
  {
    id: 2,
    title: 'AI Product Summit',
    category: 'Technology',
    date: '2026-07-22',
    time: '02:30 PM',
    location: 'Delhi - Pragati Maidan',
    image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
    attendees: 245,
    maxAttendees: 300,
    price: 'Rs. 999',
    organizer: 'AI India',
    duration: '6 Hours',
    speaker: 'Multiple Industry Experts',
    description: 'Explore the latest breakthroughs in Artificial Intelligence with founders, engineers, researchers, and product leaders from top companies. Learn how AI products are designed, deployed, and scaled while networking with professionals from across the industry.',
    agenda: [
      'Keynote Sessions',
      'AI Product Demos',
      'Networking',
      'Panel Discussion'
    ],
    requirements: [
      'Student ID or Event Ticket',
      'Laptop (Optional)'
    ]
  },
  {
    id: 3,
    title: 'Live Music Festival',
    category: 'Music',
    date: '2026-07-25',
    time: '07:00 PM',
    location: 'Noida Stadium',
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
    attendees: 420,
    maxAttendees: 500,
    price: 'Rs. 499',
    organizer: 'Live Nation',
    duration: '5 Hours',
    speaker: 'Various Artists',
    description: 'Enjoy an unforgettable night filled with live performances by top singers, DJs, and bands. Experience immersive lighting, delicious food stalls, exciting games, and an energetic crowd while celebrating music under the stars.',
    agenda: [
      'Opening DJ',
      'Band Performances',
      'Celebrity Performance',
      'After Party'
    ],
    requirements: [
      'Valid Ticket',
      'Government ID'
    ]
  },
  {
    id: 4,
    title: 'Startup Networking Meetup',
    category: 'Business',
    date: '2026-07-28',
    time: '05:00 PM',
    location: 'Gurugram - Cyber Hub',
    image: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg',
    attendees: 154,
    maxAttendees: 200,
    price: 'Free',
    organizer: 'Startup India',
    duration: '3 Hours',
    speaker: 'Founders & Investors',
    description: "Meet startup founders, angel investors, and aspiring entrepreneurs to exchange ideas, build valuable connections, and discover new opportunities in India's thriving startup ecosystem.",
    agenda: [
      'Networking Session',
      'Founder Stories',
      'Pitch Deck Review',
      'Open Networking'
    ],
    requirements: [
      'Business Card (Optional)'
    ]
  },
  {
    id: 5,
    title: 'Photography Walk',
    category: 'Photography',
    date: '2026-08-02',
    time: '06:30 AM',
    location: 'Lodhi Garden, Delhi',
    image: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg',
    attendees: 38,
    maxAttendees: 50,
    price: 'Rs. 299',
    organizer: 'Photo Club Delhi',
    duration: '2.5 Hours',
    speaker: 'Rohit Sharma',
    description: 'Capture breathtaking sunrise landscapes while learning composition, lighting, portrait photography, and camera settings from professional photographers in a fun outdoor environment.',
    agenda: [
      'Camera Basics',
      'Golden Hour Photography',
      'Portrait Session',
      'Photo Review'
    ],
    requirements: [
      'Camera or Smartphone',
      'Comfortable Shoes'
    ]
  },
  {
    id: 6,
    title: 'Yoga & Wellness Camp',
    category: 'Health',
    date: '2026-08-05',
    time: '07:00 AM',
    location: 'Central Park, Noida',
    image: 'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg',
    attendees: 76,
    maxAttendees: 100,
    price: 'Free',
    organizer: 'Healthy Living Foundation',
    duration: '2 Hours',
    speaker: 'Anjali Mehta',
    description: 'Refresh your body and mind with guided yoga, meditation, breathing exercises, and mindfulness practices designed for beginners and experienced participants alike.',
    agenda: [
      'Warm-up',
      'Yoga Session',
      'Meditation',
      'Healthy Breakfast'
    ],
    requirements: [
      'Yoga Mat',
      'Water Bottle'
    ]
  },
  {
    id: 7,
    title: 'Cricket Championship',
    category: 'Sports',
    date: '2026-08-08',
    time: '09:00 AM',
    location: 'Arun Jaitley Stadium',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    attendees: 310,
    maxAttendees: 500,
    price: 'Rs. 199',
    organizer: 'Delhi Sports Club',
    duration: 'Full Day',
    speaker: 'Professional Commentators',
    description: 'Watch thrilling cricket matches between top local teams competing for the championship trophy. Enjoy food courts, live commentary, entertainment, and exciting fan activities.',
    agenda: [
      'League Matches',
      'Semi Finals',
      'Grand Finale',
      'Prize Ceremony'
    ],
    requirements: [
      'Entry Ticket'
    ]
  },
  {
    id: 8,
    title: 'Global Food Carnival',
    category: 'Food',
    date: '2026-08-12',
    time: '04:00 PM',
    location: 'Connaught Place, Delhi',
    image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg',
    attendees: 212,
    maxAttendees: 350,
    price: 'Rs. 149',
    organizer: 'Delhi Foodies',
    duration: '6 Hours',
    speaker: 'Celebrity Chefs',
    description: 'Taste cuisines from around the world, attend live cooking demonstrations, participate in food challenges, and discover unique flavors from over 50 food stalls.',
    agenda: [
      'Street Food Zone',
      'Live Cooking',
      'Food Competition',
      'Dessert Festival'
    ],
    requirements: [
      'Event Pass'
    ]
  },
  {
    id: 9,
    title: 'Hackathon 2026',
    category: 'Technology',
    date: '2026-08-16',
    time: '09:00 AM',
    location: 'PW IOI Campus',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    attendees: 132,
    maxAttendees: 150,
    price: 'Free',
    organizer: 'PW IOI',
    duration: '24 Hours',
    speaker: 'Industry Mentors',
    description: 'Build innovative software solutions with your team during an exciting 24-hour coding challenge. Receive mentorship from experienced developers and compete for prizes worth Rs. 1,00,000.',
    agenda: [
      'Opening Ceremony',
      'Coding Begins',
      'Mentor Sessions',
      'Final Presentations'
    ],
    requirements: [
      'Laptop',
      'Student ID',
      'Team of 2-4 Members'
    ]
  },
  {
    id: 10,
    title: 'Art & Craft Exhibition',
    category: 'Art',
    date: '2026-08-20',
    time: '11:00 AM',
    location: 'India Habitat Centre',
    image: 'https://images.pexels.com/photos/1109354/pexels-photo-1109354.jpeg',
    attendees: 88,
    maxAttendees: 120,
    price: 'Rs. 99',
    organizer: 'Creative Arts Society',
    duration: '5 Hours',
    speaker: 'Local Artists',
    description: 'Discover stunning paintings, sculptures, handmade crafts, and interactive workshops by talented artists. Learn new creative techniques while supporting independent creators.',
    agenda: [
      'Art Gallery Tour',
      'Live Painting',
      'Craft Workshop',
      'Meet the Artists'
    ],
    requirements: [
      'Registration Required'
    ]
  }
];

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
