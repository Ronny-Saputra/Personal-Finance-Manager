// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
    authDomain: "nextgrowthgroup.firebaseapp.com",
    databaseURL: "https://nextgrowthgroup-default-rtdb.firebaseio.com",
    projectId: "nextgrowthgroup",
    storageBucket: "nextgrowthgroup.firebasestorage.app",
    messagingSenderId: "658734405364",
    appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
    measurementId: "G-Y5DB2XL0TH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

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
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db,"Users", user.uid), {
            uid : user.uid,
            name: name,
            email: user.email,
            password: password
        })

        // Update displayName (full name)
        await updateProfile(user, {
            displayName: name
        });

        console.log("User registered:", user);
        alert("Sign Up Successful! Welcome, " + name);

        // Redirect to dashboard.html
        window.location.href = 'dashboard.html';
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

        // Redirect to dashboard.html
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error("Error signing up with Google:", error);
        alert("Google Sign Up Failed: " + error.message);
    }
};

// Redirect to Login Page
window.goToLogin = () => {
    window.location.href = 'login.html';
};