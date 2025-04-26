// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "RAHASIA PERUSAHAN",
  authDomain: "RAHASIA PERUSAHAN",
  projectId: "RAHASIA PERUSAHAN",
  storageBucket: "RAHASIA PERUSAHAN",
  messagingSenderId: "RAHASIA PERUSAHAN",
  appId: "RAHASIA PERUSAHAN",
  measurementId:"RAHASIA PERUSAHAN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Check Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    const usernameDisplay = document.getElementById("username-display");
    const displayName = user.displayName || "User"; // fallback jika displayName null
    if (usernameDisplay) {
      usernameDisplay.textContent = displayName;
    }
  } else {
    // User is not logged in
    alert("You are not logged in. Redirecting to login page...");
    window.location.href = "login.html";
  }
});

// Logout Functionality
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-button");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        signOut(auth)
          .then(() => {
            alert("Logged out successfully!");
            window.location.href = "login.html";
          })
          .catch((error) => {
            console.error("Error signing out:", error);
            alert("Logout failed: " + error.message);
          });
      }
    });
  }
});
