import { auth, provider, createUserWithEmailAndPassword, signInWithPopup } from "./firebase-config.js";

// Function: Sign Up with Email & Password
window.signUp = async () => {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    if (name === "" || email === "" || password === "") {
        alert("Please fill in all fields!");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential.user);
        alert("Sign Up Successful! Welcome, " + name);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Error during sign up:", error);
        alert("Sign Up Failed: " + error.message);
    }
};

// Function: Sign Up with Google
window.signUpWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User signed up with Google:", result.user);
        alert("Sign Up Successful! Welcome, " + result.user.displayName);
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Error signing up with Google:", error);
        alert("Google Sign Up Failed: " + error.message);
    }
};

// Redirect to Login Page
window.goToLogin = () => {
    window.location.href = 'login.html';
};
