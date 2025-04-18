document.addEventListener("DOMContentLoaded", () => {
  // Load budgets and expenses from localStorage or initialize as empty
  let budgets = JSON.parse(localStorage.getItem("budgets")) || {};
  let expenses = JSON.parse(localStorage.getItem("expenses")) || {};


  // Populate budget and expense inputs with current values for the selected month
  function populateInputs(month) {
    const monthBudgets = budgets[month] || {};
    const monthExpenses = expenses[month] || {};


    document.querySelectorAll(".budget-input").forEach(input => {
      const category = input.dataset.category;
      input.value = monthBudgets[category] || "";
    });


    document.querySelectorAll(".expense-input").forEach(input => {
      const category = input.dataset.category;
      input.value = monthExpenses[category] || "";
    });
  }


  // Save budgets when the button is clicked
  document.getElementById("save-budgets").addEventListener("click", () => {
    const month = document.getElementById("month-select").value;


    // Initialize the budget object for the selected month if it doesn't exist
    if (!budgets[month]) budgets[month] = {};


    document.querySelectorAll(".budget-input").forEach(input => {
      const category = input.dataset.category;
      budgets[month][category] = parseInt(input.value) || 0; // Save the budget value
    });


    localStorage.setItem("budgets", JSON.stringify(budgets)); // Save to localStorage
    alert("Budgets saved successfully!");
    render(month); // Re-render the report
  });


  // Save expenses when the button is clicked
  document.getElementById("save-expenses").addEventListener("click", () => {
    const month = document.getElementById("month-select").value;


    // Initialize the expense object for the selected month if it doesn't exist
    if (!expenses[month]) expenses[month] = {};


    document.querySelectorAll(".expense-input").forEach(input => {
      const category = input.dataset.category;
      expenses[month][category] = parseInt(input.value) || 0; // Save the expense value
    });


    localStorage.setItem("expenses", JSON.stringify(expenses)); // Save to localStorage
    alert("Expenses saved successfully!");
    render(document.getElementById("month-select").value); // Re-render the report
  });


  const transactions = []; // no default data

  const monthSelect = document.getElementById("month-select");
  const ctx = document.getElementById("monthlyExpenseChart").getContext("2d");
  const reportTable = document.getElementById("report-table").querySelector("tbody");
  let chart = null;


  function render(month) {
    // Populate inputs for the selected month
    populateInputs(month);


    const monthData = {};
    // Filter transactions by selected month
    transactions.forEach(t => {
      if (t.type === "expense") {
        const date = new Date(t.date);
        const m = date.toLocaleString("default", { month: "long" });
        if (m === month) {
          if (!monthData[t.category]) monthData[t.category] = 0;
          monthData[t.category] += t.amount;
        }
      }
    });


    const monthExpenses = expenses[month] || {};
    Object.keys(monthExpenses).forEach(category => {
      monthData[category] = monthExpenses[category];
    });
    
    // Get budgets for the selected month
    const monthBudgets = budgets[month] || {};
    const labels = Object.keys(monthBudgets); // Use all categories for consistency
    const values = labels.map(cat => monthData[cat] || 0); // Use 0 if no transaction


    // Draw Chart
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: month,
          data: values,
          backgroundColor: "#2ecc71"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: {
              label: context => `Rp ${context.parsed.y.toLocaleString()}`
            }
          }
        },
        scales: {
          y: {
            ticks: {
              callback: value => `Rp ${value.toLocaleString()}`
            }
          }
        }
      }
    });


    // Table Data
    reportTable.innerHTML = "";
    let total = 0;
    labels.forEach(cat => {
      const budget = monthBudgets[cat] || 0;
      const spent = monthData[cat] || 0; // Use 0 if no transaction
      const diff = budget - spent;
      total += spent;
      reportTable.innerHTML += `
        <tr>
          <td>${cat}</td>
          <td>Rp ${budget.toLocaleString()}</td>
          <td>Rp ${spent.toLocaleString()}</td>
          <td>Rp ${diff.toLocaleString()}</td>
        </tr>
      `;
    });


    // Add Total Spent Row
    reportTable.innerHTML += `
      <tr class="total-row">
        <td colspan="2"><strong>Total Spent</strong></td>
        <td colspan="2"><strong>Rp ${total.toLocaleString()}</strong></td>
      </tr>
    `;
  }


  // Initial load
  render(monthSelect.value);
  monthSelect.addEventListener("change", () => render(monthSelect.value));
});
