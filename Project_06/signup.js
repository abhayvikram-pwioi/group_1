import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { showToast } from "./toast.js";

const signupForm = document.getElementById("signupForm");
const fullName = document.getElementById("fullName");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const terms = document.getElementById("terms");

const signupBtn = document.getElementById("signupBtn");

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
        showToast("Passwords do not match", "warning");
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

        signupBtn.innerText = "Creating Account...";
        signupBtn.disabled = true;

        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, userPassword);
        showToast("Account Created Successfully", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        
    } catch (error) {

        signupBtn.innerText = "Create Account";
        signupBtn.disabled = false;

        if (error.code === "auth/email-already-in-use") {
            showToast("Email already exists", "error");

        } else if (error.code === "auth/weak-password") {
            showToast("Password must be at least 6 characters", "warning");

        } else if (error.code === "auth/invalid-email") {
            showToast("Please enter a valid email", "error");

        } else {
            alert(error.message);
        }

    }

});

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", () => {

    if (password.type === "password") {

        password.type = "text";
        togglePassword.classList.replace("fa-eye", "fa-eye-slash");

    } else {

        password.type = "password";
        togglePassword.classList.replace("fa-eye-slash", "fa-eye");

    }

});
