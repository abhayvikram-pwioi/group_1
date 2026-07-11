const loginForm = document.getElementById('login-form');
const googleLoginButton = document.getElementById('google-login');
const LOGIN_STORAGE_KEY = 'meetupLoginInfo';
const REGISTRATION_STORAGE_KEY = 'meetupRegistrations';
const HOME_PAGE_URL = '';

function getSavedRegistrations() {
  return JSON.parse(localStorage.getItem(REGISTRATION_STORAGE_KEY)) || [];
}

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const savedRegistrations = getSavedRegistrations();
  const matchedUser = savedRegistrations.find(function (registration) {
    return registration.email.toLowerCase() === email && registration.password === password;
  });

  if (!matchedUser) {
    alert('Invalid email or password.');
    return;
  }

  const loginInfo = {
    email: email,
    fullName: matchedUser.fullName,
    rememberMe: document.querySelector('.checkbox-label input').checked,
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginInfo));
  alert('Login successful.');
  window.location.href = HOME_PAGE_URL;
});

googleLoginButton.addEventListener('click', function () {
  alert('Google login is not connected yet.');
});
