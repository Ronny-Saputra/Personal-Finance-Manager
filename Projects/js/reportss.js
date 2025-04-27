document.addEventListener("DOMContentLoaded", () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const monthSelect = document.getElementById("month-select");
  const ctx = document.getElementById("monthlyExpenseChart").getContext("2d");
  const reportTable = document.getElementById("report-table").querySelector("tbody");
  const totalIncomeDisplay = document.getElementById("total-income-value");
  const cashflowDisplay = document.getElementById("cashflow-value");

  // Predefined categories
  const predefinedCategories = [
    "Food & Drinks",
    "Groceries",
    "Entertainment",
    "Living Expenses",
    "Payments",
    "Transportations"
  ];

  // Color mapping for categories
  const categoryColors = {
    "Food & Drinks": "#e74c3c", // Red
    "Groceries": "#f1c40f",     // Yellow
    "Entertainment": "#3498db", // Blue
    "Living Expenses": "#9b59b6", // Purple
    "Payments": "#2ecc71",      // Green
    "Transportations": "#e67e22" // Orange
  };

  let chart = null;

  function render(month) {
    const monthData = {
      income: 0,
      expenses: {}
    };

    // Filter transactions by selected month
    transactions.forEach(t => {
      const date = new Date(t.date);
      const m = date.toLocaleString("default", { month: "long" });
      if (m === month) {
        if (t.type === "income") {
          monthData.income += t.amount; // Add to total income
        } else if (t.type === "expense") {
          if (!monthData.expenses[t.category]) monthData.expenses[t.category] = 0;
          monthData.expenses[t.category] += t.amount; // Add to category expenses
        }
      }
    });

    // Chart Data
    const labels = Object.keys(monthData.expenses);
    const values = labels.map(cat => monthData.expenses[cat]);

    // Assign colors based on category
    const backgroundColors = labels.map(cat => categoryColors[cat] || "#ccc"); // Default to gray if no color is defined

    // Draw Chart
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: `${month}`,
          data: values,
          backgroundColor: backgroundColors // Use custom colors here
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
    let totalExpenses = 0;

    // Add predefined categories to the table
    predefinedCategories.forEach(cat => {
      const spent = monthData.expenses[cat] || 0; // Default to 0 if no expense for this category
      totalExpenses += spent;
      reportTable.innerHTML += `
        <tr>
          <td>${cat}</td>
          <td>Rp ${spent.toLocaleString()}</td> <!-- Total Expenses -->
        </tr>
      `;
    });

    // Update Total Income and Cashflow
    totalIncomeDisplay.textContent = monthData.income.toLocaleString();
    const cashflow = monthData.income - totalExpenses;
    cashflowDisplay.textContent = cashflow.toLocaleString();
  }

  // Initial load
  render(monthSelect.value);
  monthSelect.addEventListener("change", () => render(monthSelect.value));
});
