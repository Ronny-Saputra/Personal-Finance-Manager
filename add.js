// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: rahasiaperusahan,
  authDomain: rahasiaperusahan,
  databaseURL: rahasiaperusahan,
  projectId: rahasiaperusahan,
  storageBucket: rahasiaperusahan,
  messagingSenderId: rahasiaperusahan,
  appId: rahasiaperusahan,
  measurementId: rahasiaperusahan,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Display User Name Dynamically
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in
    const userNameElement = document.getElementById("username-display");
    const displayName = user.displayName || "User"; // Fallback to "User" if displayName is null
    userNameElement.textContent = displayName;
  } else {
    // User is not logged in
    alert("You are not logged in. Redirecting to login page...");
    window.location.href = "login.html";
  }
});

// Logout Button
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

  // Set default type
  selectType("income");
});

// Form Logic
let selectedType = "income";
let selectedCategory = null;

function selectType(type) {
  selectedType = type;
  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("selected"));
  document.querySelector(`.toggle-btn.${type}`).classList.add("selected");
}

function selectCategory(button) {
  document.querySelectorAll(".category-grid button").forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  selectedCategory = button.textContent.trim();
}

function submitForm() {
  const amount = document.getElementById("amount").value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!amount || !selectedCategory || !date || !time) {
    alert("Please fill in all fields.");
    return;
  }

  console.log("Form Submitted:", {
    type: selectedType,
    amount,
    category: selectedCategory,
    date,
    time,
  });

  alert("Transaction successfully added!");
}

function cancelForm() {
  if (confirm("Clear the form?")) {
    document.getElementById("amount").value = "";
    document.getElementById("date").value = "";
    document.getElementById("time").value = "";
    selectedCategory = null;
    document.querySelectorAll(".category-grid button").forEach(btn => btn.classList.remove("selected"));
  }
}
