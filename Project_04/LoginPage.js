const loginForm = document.getElementById('login-form');
const googleLoginButton = document.getElementById('google-login');
const CURRENT_USER_KEY = "currentUser";
const USERS_STORAGE_KEY = "users";
const HOME_PAGE_URL = "index.html";

async function getAllUsers() {

    const jsonUsers = await fetch("users.json").then(res => res.json());

    const localUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];

    return [...jsonUsers, ...localUsers];

}



loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;
  const savedRegistrations = await getAllUsers();

  const matchedUser = savedRegistrations.find(user => {
    return (
      user.email.toLowerCase() === email &&
      user.password === password
    );
  });

  if (!matchedUser) {
    alert('Invalid email or password.');
    return;
  }

  const currentUser = {
    id: matchedUser.id,
    fullName: matchedUser.fullName,
    email: matchedUser.email,
    role: matchedUser.role,
    profilePic: matchedUser.profilePic,
    loggedInAt: new Date().toISOString()
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  alert('Login successful.');

  if (matchedUser.role === "admin") {

    window.location.href = "admin.html";

  } else {

    window.location.href = HOME_PAGE_URL;

  }

});

googleLoginButton.addEventListener('click', function () {
  alert('Google login is not connected yet.');
});
