
module.exports = {
  updateTargetSaving: jest.fn(),
  addExpenseIncome: jest.fn(),
  calculateMonthlyReport: (transactions, monthIndex, year) => {
    let totalIncome = 0, totalExpense = 0;
    for (const t of transactions) {
      if (!t || !t.created || typeof t.created.toDate !== 'function') continue;
      const date = t.created.toDate();
      if (date.getMonth() === monthIndex && date.getFullYear() === year) {
        const amt = parseFloat(t.amount);
        if (isNaN(amt)) continue;
        if (t.type === "Income") totalIncome += amt;
        else if (t.type === "Expense") totalExpense += amt;
      }
    }
    return { totalIncome, totalExpense };
  }
};
