let selectedCategory = "all";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("transaction-data");
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const grouped = {};

  transactions.forEach(t => {
    if (t.type === "expense") {
      const dateObj = new Date(t.date);
      const month = dateObj.toLocaleString("default", { month: "long" });
      const day = dateObj.getDate();
      if (!grouped[month]) grouped[month] = {};
      if (!grouped[month][day]) grouped[month][day] = [];
      grouped[month][day].push({ ...t, dateObj });
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
    const sortedDays = Object.keys(days).sort((a, b) => parseInt(a) - parseInt(b));
  
    sortedDays.forEach(day => {
      const items = days[day];
  
      // Apply filter
      const filteredItems = selectedCategory === "all"
        ? items
        : items.filter(t => t.category === selectedCategory);
  
      if (filteredItems.length === 0) return; // skip if no match
  
      const totalForDay = filteredItems.reduce((sum, item) => sum + item.amount, 0);
  
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
  
      filteredItems.forEach(t => {
        const fullDate = t.dateObj.toLocaleDateString("en-GB", {
          year: "numeric", month: "long", day: "numeric"
        });
        const time = t.dateObj.toLocaleTimeString("en-GB", {
          hour: "2-digit", minute: "2-digit"
        });
  
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
            <div style="text-align: right;">
              <div>Rp ${t.amount.toLocaleString()}</div>
              <div style="font-size: 13px; color: #777;">${fullDate} – ${time}</div>
            </div>
          </div>
        `;
      });
    });
  }
  

  const durationSelect = document.getElementById("duration-select");
  const categoryFilter = document.getElementById("category-filter");

  if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
      selectedCategory = categoryFilter.value;
      renderTransactions(durationSelect.value);
    });
  }

  const searchInput = document.querySelector(".search-box input");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      filterText = searchInput.value.trim();
      renderTransactions(durationSelect.value);
    });
  }

  const durationDisplay = document.getElementById("duration-display");

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

// 🔁 Reset Function
function clearTransactions() {
  if (confirm("Are you sure you want to clear all transaction data?")) {
    localStorage.removeItem("transactions");
    alert("All data cleared.");
    location.reload();
  }
}
