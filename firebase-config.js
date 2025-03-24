// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
const provider = new GoogleAuthProvider();

// Export auth untuk digunakan di file lain
export { auth, provider, createUserWithEmailAndPassword, signInWithPopup };
