
export function calculateMonthlyReport(transactions, monthIndex, year) {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (!t || !t.created || typeof t.created.toDate !== 'function') continue;
    const date = t.created.toDate();
    if (date.getMonth() === monthIndex && date.getFullYear() === year) {
      const amt = parseFloat(t.amount);
      if (isNaN(amt)) continue;

      if (t.type === 'Income') {
        totalIncome += amt;
      } else if (t.type === 'Expense') {
        totalExpense += amt;
      }
    }
  }

  return { totalIncome, totalExpense };
}

export async function submitTransaction(user) {
  const amount = document.getElementById('amount')?.value || '';
  const category = document.getElementById('category')?.value || '';
  const type = document.getElementById('type')?.value || '';
  const dialog = document.getElementById('notify-dialog');
  const msg = document.getElementById('notify-message');

  if (!amount || isNaN(parseFloat(amount))) {
    msg.textContent = 'Invalid amount';
    dialog?.showModal?.();
    return;
  }

  await addExpenseIncome(user, { amount, category, type });
  msg.textContent = 'Transaksi berhasil ditambahkan!';
  dialog?.showModal?.();
} 
