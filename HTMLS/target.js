let currentSavings = {}; // Track current savings contributions per month

// Format numbers with thousand separators for input fields
document.getElementById("income").addEventListener("input", function (e) {
  let raw = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
  if (raw.length === 0) {
    e.target.value = "";
    return;
  }
  // Add thousand separators
  e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

document.getElementById("contribution").addEventListener("input", function (e) {
  let raw = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
  if (raw.length === 0) {
    e.target.value = "";
    return;
  }
  // Add thousand separators
  e.target.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
});

// Calculate savings target
function calculateSavings() {
  const selectedMonth = document.getElementById("month").value;
  const incomeInput = document.getElementById("income").value.replace(/\./g, '');
  const income = parseFloat(incomeInput);
  const percentage = parseFloat(document.getElementById("percentage").value);

  if (isNaN(income) || isNaN(percentage)) {
    alert("Please enter valid income and percentage.");
    return;
  }

  const savingsGoal = (income * percentage) / 100; // Total savings goal
  const formattedSavingsGoal = savingsGoal.toLocaleString("id-ID");

  document.getElementById("result").textContent = `Savings Goal: Rp ${formattedSavingsGoal}`;

  const needs = income * 0.5;
  const wants = income * 0.3;
  const formattedNeeds = needs.toLocaleString("id-ID");
  const formattedWants = wants.toLocaleString("id-ID");

  document.getElementById("allocation").innerHTML = `
    <h4>Suggested Allocation:</h4>
    <div><strong>Needs (50%)</strong>: Rp ${formattedNeeds}</div>
    <div><strong>Wants (30%)</strong>: Rp ${formattedWants}</div>
    <div><strong>Savings (${percentage}%)</strong>: Rp ${formattedSavingsGoal}</div>
  `;
}

// Save savings data to localStorage
function saveSavings() {
  const selectedMonth = document.getElementById("month").value;
  const rawIncome = document.getElementById("income").value;
  const income = parseFloat(rawIncome.replace(/\./g, ''));
  const percentage = parseFloat(document.getElementById("percentage").value);

  if (isNaN(income) || isNaN(percentage)) {
    alert("Please enter valid income and percentage.");
    return;
  }

  const savingsGoal = (income * percentage) / 100; // Total savings goal

  // Create the savings data object
  const savingsData = {
    month: selectedMonth,
    monthlyIncome: income, // Monthly income
    savingsPercentage: percentage, // Savings percentage
    targetAmount: savingsGoal, // Total savings goal
    recommendedSavings: currentSavings[selectedMonth] || 0, // Contributions so far
    createdAt: new Date().toISOString() // Timestamp
  };

  // Retrieve existing savings data from localStorage
  let savingsHistory = JSON.parse(localStorage.getItem("savingsData")) || [];

  // Check if an entry for the selected month already exists
  const existingEntryIndex = savingsHistory.findIndex(item => item.month === selectedMonth);
  if (existingEntryIndex !== -1) {
    // Update the existing entry
    savingsHistory[existingEntryIndex] = savingsData;
  } else {
    // Add a new entry
    savingsHistory.push(savingsData);
  }

  // Save updated data back to localStorage
  localStorage.setItem("savingsData", JSON.stringify(savingsHistory));
  alert("Savings plan saved!");
  showHistory(); // Refresh history display after saving
}

// Display savings history from localStorage
function showHistory() {
  const history = JSON.parse(localStorage.getItem("savingsData")) || [];
  console.log("Data loaded from localStorage:", history); // Debugging log

  const historyDiv = document.getElementById("history");
  historyDiv.innerHTML = "";

  if (history.length === 0) {
    historyDiv.innerText = "No savings history found.";
    return;
  }

  history.forEach(entry => {
    const div = document.createElement("div");
    div.innerText =
      `Month: ${entry.month} | Date: ${new Date(entry.createdAt).toLocaleDateString("id-ID")} | Amount: Rp ${entry.monthlyIncome.toLocaleString("id-ID")} | Percentage: ${entry.savingsPercentage}% | Savings Goal: Rp ${entry.targetAmount.toLocaleString("id-ID")} | Contributions: Rp ${entry.recommendedSavings.toLocaleString("id-ID")}`;
    historyDiv.appendChild(div);
  });
}

// Add contribution to current savings
function addContribution() {
  const selectedMonth = document.getElementById("month").value;
  const rawContribution = document.getElementById("contribution").value.replace(/\./g, ''); // Remove dots before converting to number
  const contribution = parseFloat(rawContribution);

  if (isNaN(contribution) || contribution <= 0) {
    alert("Please enter a valid contribution amount.");
    return;
  }

  // Retrieve existing savings data from localStorage
  let savingsHistory = JSON.parse(localStorage.getItem("savingsData")) || [];
  const entry = savingsHistory.find(item => item.month === selectedMonth);

  if (entry) {
    // Add the contribution to the existing recommendedSavings
    entry.recommendedSavings += contribution;

    // Save updated data back to localStorage
    localStorage.setItem("savingsData", JSON.stringify(savingsHistory));
    alert("Contribution added!");
    showHistory(); // Refresh history display after adding contribution
  } else {
    alert("No savings plan found for the selected month.");
  }

  // Clear input field
  document.getElementById("contribution").value = "";
}

// Load history on page load
document.addEventListener("DOMContentLoaded", () => {
  showHistory(); // Display history when page loads
});
