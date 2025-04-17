document.addEventListener("DOMContentLoaded", () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  const monthSelect = document.getElementById("month-select");
  const ctx = document.getElementById("monthlyExpenseChart").getContext("2d");
  const reportTable = document.getElementById("report-table").querySelector("tbody");

  const fixedBudget = 1000000; // Rp 1.000.000 for every category

  let chart = null;

  function render(month) {
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

    // Chart Data
    const labels = Object.keys(monthData);
    const values = labels.map(cat => monthData[cat]);

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
      const spent = monthData[cat];
      const diff = fixedBudget - spent;
      total += spent;

      reportTable.innerHTML += `
        <tr>
          <td>${cat}</td>
          <td>Rp ${fixedBudget.toLocaleString()}</td>
          <td>Rp ${spent.toLocaleString()}</td>
          <td>Rp ${diff.toLocaleString()}</td>
        </tr>
      `;
    });

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
