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

function selectType(type) {
  selectedType = type;

  // Toggle visual style
  document.querySelectorAll(".toggle-btn").forEach(btn => btn.classList.remove("selected"));
  document.querySelector(`.toggle-btn.${type}`).classList.add("selected");

  // Enable/disable category buttons based on type
  const categoryButtons = document.querySelectorAll(".category-grid button");
  categoryButtons.forEach(btn => {
    if (type === "income") {
      btn.setAttribute("disabled", true);
      btn.classList.add("disabled");
      btn.classList.remove("selected");
      selectedCategory = null;
    } else {
      btn.removeAttribute("disabled");
      btn.classList.remove("disabled");
    }
  });
}


// Optional: Logout
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logout-button");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to logout?")) {
        window.location.href = "login.html";
      }
    });
  }

  // Set default type
  selectType("income");
});
