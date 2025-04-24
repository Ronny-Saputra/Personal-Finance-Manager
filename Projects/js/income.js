document.addEventListener("DOMContentLoaded", () => {
  const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  const incomeByMonth = {};
  const expenseByCategory = {};
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach(t => {
    if (t.type === "income") {
      const month = new Date(t.date).toLocaleString("default", { month: "long" });
      incomeByMonth[month] = (incomeByMonth[month] || 0) + t.amount;
      totalIncome += t.amount;
    } else if (t.type === "expense") {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      totalExpense += t.amount;
    }
  });

  const incomeMonthTable = document.getElementById("income-month-table").querySelector("tbody");
  const incomeAmountTable = document.getElementById("income-amount-table").querySelector("tbody");

  Object.entries(incomeByMonth).forEach(([month, amt]) => {
    const rowMonth = document.createElement("tr");
    rowMonth.innerHTML = `<td>${month}</td>`;
    const ref = incomeMonthTable.querySelector(".total-row");
    ref ? incomeMonthTable.insertBefore(rowMonth, ref) : incomeMonthTable.appendChild(rowMonth);

    const rowAmount = document.createElement("tr");
    rowAmount.innerHTML = `<td>Rp. ${amt.toLocaleString()}</td>`;
    const refAmt = incomeAmountTable.querySelector(".total-row");
    refAmt ? incomeAmountTable.insertBefore(rowAmount, refAmt) : incomeAmountTable.appendChild(rowAmount);
  });

  incomeAmountTable.querySelector(".total-row").innerHTML = `<td><strong>Rp. ${totalIncome.toLocaleString()}</strong></td>`;

  const expenseCategoryTable = document.getElementById("expense-category-table").querySelector("tbody");
  const expenseAmountTable = document.getElementById("expense-amount-table").querySelector("tbody");

  Object.entries(expenseByCategory).forEach(([category, amt]) => {
    const rowCat = document.createElement("tr");
    rowCat.innerHTML = `<td>${category}</td>`;
    const ref = expenseCategoryTable.querySelector(".total-row");
    ref ? expenseCategoryTable.insertBefore(rowCat, ref) : expenseCategoryTable.appendChild(rowCat);

    const rowAmt = document.createElement("tr");
    rowAmt.innerHTML = `<td>Rp. ${amt.toLocaleString()}</td>`;
    const refAmt = expenseAmountTable.querySelector(".total-row");
    refAmt ? expenseAmountTable.insertBefore(rowAmt, refAmt) : expenseAmountTable.appendChild(rowAmt);
  });

  expenseAmountTable.querySelector(".total-row").innerHTML = `<td><strong>Rp. ${totalExpense.toLocaleString()}</strong></td>`;

  const cashFlow = totalIncome - totalExpense;
  document.querySelector(".cash-flow").innerHTML = `Cash Flow: Rp. ${cashFlow.toLocaleString()}`;
});

// Developer helper to clear all data
function clearTransactions() {
  if (confirm("Are you sure you want to clear all transaction data?")) {
    localStorage.removeItem("transactions");
    alert("All data cleared.");
    location.reload();
  }
}
