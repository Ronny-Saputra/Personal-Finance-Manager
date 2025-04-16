document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("transaction-data");
  const durationSelect = document.getElementById("duration-select");
  const durationDisplay = document.getElementById("duration-display");
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const grouped = {};

  // Properly group transactions by month and day number (from their true date)
  transactions.forEach(t => {
    if (t.type === "expense") {
      const dateObj = new Date(t.date);

      // 💡 Defensive check: skip if invalid date
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid date found in transaction:", t);
        return;
      }

      const month = dateObj.toLocaleString("default", { month: "long" });
      const day = dateObj.getDate(); // Day as number like 9, 15, 26

      if (!grouped[month]) grouped[month] = {};
      if (!grouped[month][day]) grouped[month][day] = [];
      grouped[month][day].push(t);
    }
  });

  function renderTransactions(monthFilter) {
    container.innerHTML = "";

    if (!grouped[monthFilter]) {
      container.innerHTML = `<div style="text-align: center; margin-top: 20px;">No transactions for ${monthFilter}</div>`;
      return;
    }

    container.innerHTML += `<h3 style="font-size: 20px; font-weight: bold; margin: 20px 0 10px;">${monthFilter}</h3>`;

    const days = grouped[monthFilter];
    const sortedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b)); // Day 1 → 31

    sortedDays.forEach(day => {
      const items = days[day];
      const totalForDay = items.reduce((sum, item) => sum + item.amount, 0);

      container.innerHTML += `
        <div class="day-header" style="
          background-color: #cfe8ff;
          padding: 10px;
          font-weight: bold;
          font-size: 16px;
          border-radius: 4px;
          margin-top: 20px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        ">
          <span>Day ${day}</span>
          <span>Total: Rp ${totalForDay.toLocaleString()}</span>
        </div>`;

      items.forEach(t => {
        container.innerHTML += `
          <div style="
            display: flex;
            justify-content: space-between;
            padding: 10px 16px;
            margin-bottom: 8px;
            font-size: 16px;
            line-height: 1.6;
            background-color: #f9f9f9;
            border-radius: 4px;
          ">
            <div>${t.category}</div>
            <div>Rp ${t.amount.toLocaleString()}</div>
          </div>
        `;
      });
    });
  }

  // 🔄 Sync month dropdown + middle label
  if (durationSelect && durationDisplay) {
    durationDisplay.textContent = durationSelect.value;
    renderTransactions(durationSelect.value);

    durationSelect.addEventListener("change", () => {
      const selectedMonth = durationSelect.value;
      durationDisplay.textContent = selectedMonth;
      renderTransactions(selectedMonth);
    });
  }
});

// 🔁 Reset Button Functionality
function clearTransactions() {
  if (confirm("Are you sure you want to clear all transaction data?")) {
    localStorage.removeItem("transactions");
    alert("All data cleared.");
    location.reload();
  }
}
