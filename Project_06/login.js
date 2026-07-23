import { auth } from "./firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const remember = document.getElementById("remember");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, userEmail, userPassword);
        alert("Login Successful");
        console.log(userCredential.user);

        window.location.href = "dashboard.html";
    } catch (error) {

        if (error.code === "auth/invalid-credential") {
            alert("Invalid email or password.");

        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email.");
        } else {

            alert(error.message);

        }

    }

});
