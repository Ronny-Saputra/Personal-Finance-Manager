document.addEventListener("DOMContentLoaded", () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const incomeSummary = {};
  const expenseCategories = {};

  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString("default", { month: "long" });

    if (t.type === "income") {
      incomeSummary[month] = (incomeSummary[month] || 0) + t.amount;
    } else if (t.type === "expense") {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
    }
  });

  // ✅ Income Summary Table
  const incomeTable = document.getElementById("income-summary");
  if (incomeTable) {
    let total = 0;
    incomeTable.innerHTML = "<tr><th>Month</th><th>Amount</th></tr>";

    Object.keys(incomeSummary).forEach(month => {
      const amt = incomeSummary[month];
      total += amt;
      incomeTable.innerHTML += `<tr><td>${month}</td><td>Rp. ${amt.toLocaleString()}</td></tr>`;
    });

    incomeTable.innerHTML += `
      <tr class="total-row">
        <td><strong>Total</strong></td>
        <td><strong>Rp. ${total.toLocaleString()}</strong></td>
      </tr>
    `;
  }

  // ✅ Expense Percentage Table
  const expenseTable = document.getElementById("expense-percentage");
  if (expenseTable) {
    let totalExpense = Object.values(expenseCategories).reduce((a, b) => a + b, 0);
    expenseTable.innerHTML = "<tr><th>Category</th><th>Percentage</th></tr>";

    Object.entries(expenseCategories).forEach(([cat, amt]) => {
      let perc = ((amt / totalExpense) * 100).toFixed(1);
      expenseTable.innerHTML += `<tr><td>${cat}</td><td>${perc}%</td></tr>`;
    });

    expenseTable.innerHTML += `
      <tr class="total-row">
        <td><strong>Total</strong></td>
        <td><strong>100%</strong></td>
      </tr>
    `;
  }

  const savingsList = document.getElementById("savings-list");
  const savingsData = JSON.parse(localStorage.getItem("savingsData")) || [];
  
  if (savingsList) {
    savingsData.forEach(entry => {
      savingsList.innerHTML += `
        <tr>
          <td>Rp. ${entry.targetAmount ? entry.targetAmount.toLocaleString() : "-"}</td>
          <td>Rp. ${entry.monthlyIncome.toLocaleString()}</td>
          <td>Rp. ${entry.recommendedSavings.toLocaleString()}</td>
          <td>${entry.savingsPercentage}%</td>
          <td>${new Date(entry.createdAt).toLocaleDateString()}</td>
        </tr>
      `;
    });
  }
  


  // ✅ Income Pie Chart
  const incomeCtx = document.getElementById("incomeChart");
  if (incomeCtx && Object.keys(incomeSummary).length > 0) {
    new Chart(incomeCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(incomeSummary),
        datasets: [{
          label: 'Monthly Income',
          data: Object.values(incomeSummary),
          backgroundColor: [
            '#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#00bcd4'
          ],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Income by Month'
          }
        }
      }
    });
  }

  // ✅ Expense Pie Chart
  const expCtx = document.getElementById("expenseChart");
  if (expCtx && Object.keys(expenseCategories).length > 0) {
    const totalExpenseAmount = Object.values(expenseCategories).reduce((a, b) => a + b, 0);
    const expenseLabels = Object.keys(expenseCategories);
    const expenseValues = Object.values(expenseCategories);

    new Chart(expCtx, {
      type: 'pie',
      data: {
        labels: expenseLabels,
        datasets: [{
          label: 'Expense Distribution',
          data: expenseValues,
          backgroundColor: [
            '#ff5722', '#ffc107', '#8bc34a', '#00bcd4', '#9c27b0', '#ff9800'
          ],
          borderColor: '#fff',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Expense by Category'
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const amount = context.raw;
                const percentage = ((amount / totalExpenseAmount) * 100).toFixed(1);
                return `${context.label}: Rp. ${amount.toLocaleString()} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  }
});
