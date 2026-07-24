import { auth } from "./firebase.js";

import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { showToast } from "./toast.js";

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
        showToast("Login Successful", "success");
        console.log(userCredential.user);
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 2000);

    } catch (error) {

        if (error.code === "auth/invalid-credential") {
            showToast("Invalid Email or Password", "error");

        } else if (error.code === "auth/invalid-email") {
            showToast("Please enter a valid email.", "error");
        } else {

            alert(error.message);

        }

    }

});

