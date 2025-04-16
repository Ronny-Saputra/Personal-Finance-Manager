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
  

  const transaction = {
    type: selectedType,
    category: selectedCategory,
    amount,
    date,
    time
  };

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  alert("Transaction successfully added!");
  location.reload();
}
