import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const signupForm = document.getElementById("signupForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userName = fullName.value;
    const userEmail = email.value;
    const userPhone = phone.value;
    const userPassword = password.value;
    const userConfirmPassword = confirmPassword.value;

    if (userName.trim() === "") {
        alert("Please enter your name.");
        return;
    }

    if (userPassword !== userConfirmPassword) {
        alert("Passwords do not match");
        return;
    }

    if (userPhone.length !== 10) {
        alert("Phone number must be 10 digits.");
        return;
    }

    if (!terms.checked) {
        alert("Please accept the Terms & Conditions.");
        return;
    }
 try {
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
        alert("Account Created Successfully!");
        window.location.href = "login.html";
    } catch (error) {

        if (error.code === "auth/email-already-in-use") {
            alert("This email is already registered.");

        } else if (error.code === "auth/weak-password") {
            alert("Password should be at least 6 characters.");

        } else if (error.code === "auth/invalid-email") {
            alert("Please enter a valid email.");

        } else {
            alert(error.message);
        }

    }

});

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if(password.type === "password"){

        password.type = "text";
        togglePassword.classList.replace("fa-eye","fa-eye-slash");

    }else{

        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash","fa-eye");

    }

});