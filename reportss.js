document.addEventListener("DOMContentLoaded", function () {
    // Dummy data for different months
    const expensesData = {
      January: {
        categories: ["Transportation", "Entertainment", "Utilities", "Rent"],
        values: [200000, 180000, 300000, 600000],
        breakdown: [
          { category: "Phone bill", budget: 777000, expense: 500000 },
          { category: "Internet", budget: 520000, expense: 520000 },
          { category: "Electricity", budget: 800000, expense: 800000 },
          { category: "Food", budget: 1200000, expense: 1200000 },
          { category: "Fuel", budget: 55670000, expense: 54560000 },
          { category: "Insurance", budget: 34560000, expense: 34560000 },
        ],
        summary: {
          budgetedAmount: 45150000,
          amountSpent: 24320000,
          exceeded: 170000,
        },
      },
      February: {
        categories: ["Transportation", "Entertainment", "Utilities", "Rent"],
        values: [150000, 160000, 250000, 400000],
        breakdown: [
          { category: "Phone bill", budget: 777000, expense: 450000 },
          { category: "Internet", budget: 520000, expense: 480000 },
          { category: "Electricity", budget: 800000, expense: 750000 },
          { category: "Food", budget: 1200000, expense: 1100000 },
          { category: "Fuel", budget: 55670000, expense: 54000000 },
          { category: "Insurance", budget: 34560000, expense: 34000000 },
        ],
        summary: {
          budgetedAmount: 45150000,
          amountSpent: 22000000,
          exceeded: 100000,
        },
      },
      March: {
        categories: ["Transportation", "Entertainment", "Utilities", "Rent"],
        values: [170000, 160000, 250000, 200000],
        breakdown: [
          { category: "Phone bill", budget: 777000, expense: 550000 },
          { category: "Internet", budget: 520000, expense: 550000 },
          { category: "Electricity", budget: 800000, expense: 850000 },
          { category: "Food", budget: 1200000, expense: 1300000 },
          { category: "Fuel", budget: 55670000, expense: 55000000 },
          { category: "Insurance", budget: 34560000, expense: 35000000 },
        ],
        summary: {
          budgetedAmount: 45150000,
          amountSpent: 26000000,
          exceeded: 300000,
        },
      },
    };
  
    // Initialize Chart.js
    const ctx = document.getElementById("expensesChart").getContext("2d");
    let expensesChart;
  
 // Function to update the chart
function updateChart(month) {
  const data = expensesData[month];
  if (!data) return;

  // Define colors for each month
  const monthColors = {
    January: "#2ecc71", // Green
    February: "#3498db", // Blue
    March: "#e74c3c", // Red
  };

  expensesChart.data.labels = data.categories;
  expensesChart.data.datasets.forEach((dataset, index) => {
    dataset.backgroundColor = monthColors[month]; // Set color based on month
    dataset.data = data.values;
    dataset.label = month;
  });
  expensesChart.update();
}
  
   // Function to update the expense breakdown table
function updateBreakdownTable(month) {
    const data = expensesData[month].breakdown;
    const tableBody = document.querySelector("#expense-breakdown-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows
  
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.category}</td>
        <td>Rp ${item.budget.toLocaleString()}</td>
        <td>Rp ${item.expense.toLocaleString()}</td>
        <td>Rp ${item.budget - item.expense}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Add total spent row
    const totalRow = document.createElement("tr");
    totalRow.classList.add("total-row");
    totalRow.innerHTML = `
      <td>Total Spent</td>
      <td></td>
      <td></td>
      <td>Rp ${expensesData[month].summary.amountSpent.toLocaleString()}</td>
    `;
    tableBody.appendChild(totalRow);
  }
    // Function to update the summary table
    function updateSummaryTable(month) {
      const data = expensesData[month].summary;
      document.getElementById("budgeted-amount").textContent = `Rp ${data.budgetedAmount.toLocaleString()}`;
      document.getElementById("amount-spent").textContent = `Rp ${data.amountSpent.toLocaleString()}`;
      document.getElementById("exceeded-amount").textContent = `Rp ${data.exceeded.toLocaleString()}`;
    }
  
    // Initialize the chart
    expensesChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            label: "",
            backgroundColor: "#f4a261",
            data: [],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  
    // Event listener for month selection
    const monthSelect = document.getElementById("month-select");
    monthSelect.addEventListener("change", function () {
      const selectedMonth = this.value;
      updateChart(selectedMonth);
      updateBreakdownTable(selectedMonth);
      updateSummaryTable(selectedMonth);
    });
  
    // Default selection (January)
    const defaultMonth = "January";
    monthSelect.value = defaultMonth;
    updateChart(defaultMonth);
    updateBreakdownTable(defaultMonth);
    updateSummaryTable(defaultMonth);
  });