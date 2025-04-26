// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

let selectedType = "income";
let selectedCategory = null;

function selectType(type) {
  selectedType = type;
  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("selected"));
  document.querySelector(`.toggle-btn.${type}`).classList.add("selected");

  const categoryButtons = document.querySelectorAll(".category-grid button");

  if (type === "income") {
    selectedCategory = null;
    categoryButtons.forEach(btn => {
      btn.classList.remove("selected");
      btn.disabled = true;
      btn.style.opacity = 0.5;
      btn.style.cursor = "not-allowed";
    });
  } else {
    categoryButtons.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = 1;
      btn.style.cursor = "pointer";
    });
  }
}

function selectCategory(button) {
  document.querySelectorAll(".category-grid button").forEach(btn => btn.classList.remove("selected"));
  button.classList.add("selected");
  selectedCategory = button.textContent.trim();
}

function submitForm() {
  const amount = parseFloat(document.getElementById("amount").value);
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!amount || !date || !time || (selectedType === "expense" && !selectedCategory)) {
    alert("Please fill in all required fields.");
    return;
  }

  const fullDateTime = `${date}T${time}`;

  const newTransaction = {
    amount,
    type: selectedType,
    category: selectedType === "income" ? "Income" : selectedCategory,
    date: fullDateTime
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(newTransaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  alert("Transaction successfully added!");
  window.location.href = "dashboard.html";
}
