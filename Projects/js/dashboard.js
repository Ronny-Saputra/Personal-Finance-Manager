// js/dashboard.js
import { auth, db, onAuthStateChanged, collection, getDocs, query, orderBy } from '../src/firebaseAuth.js';

let incomeChart, expenseChart;

onAuthStateChanged(auth, async user => {
  if (!user) return window.location.href = "login.html";
  document.querySelector('.welcome-message').textContent =
    `Welcome, ${user.displayName || user.email}`;

  // Fetch transactions
  const txSnap = await getDocs(query(
    collection(db, "Users Transactions", user.uid, "transactions"),
    orderBy("createdAt","asc")
  ));
  const transactions = txSnap.docs.map(d => {
    const t = d.data();
    return { ...t, date: t.createdAt.toDate() };
  });

  // Fetch savings
  const svSnap = await getDocs(query(
    collection(db, "Users Saving Target", user.uid, "savingsTargets"),
    orderBy("createdAt","asc")
  ));
  const savings = svSnap.docs.map(d => {
    const s = d.data();
    return {
      month: s.month,
      target: s.targetAmount,
      income: s.income,
      saved: (s.contributions||[]).reduce((a,c)=>a+c.amount, 0),
      percent: s.percentage,
      date: s.createdAt.toDate()
    };
  });

  // Get canvas contexts
  const incCanvas = document.getElementById("incomeChart");
  const expCanvas = document.getElementById("expenseChart");
  const incomeCtx  = incCanvas && incCanvas.getContext("2d");
  const expenseCtx = expCanvas && expCanvas.getContext("2d");

  renderSavingsPlans(savings);
  renderSummary(transactions);
  renderCharts(transactions, incomeCtx, expenseCtx);
});

export function renderSavingsPlans(savings) {
  const savingsList = document.getElementById("savings-list");
  savingsList.innerHTML = `
    <tr><th>Month</th><th>Target</th><th>Income</th><th>Saved</th><th>%</th><th>Date</th></tr>
  `;
  savings.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.month}</td>
      <td>Rp ${e.target.toLocaleString('id-ID')}</td>
      <td>Rp ${e.income.toLocaleString('id-ID')}</td>
      <td>Rp ${e.saved.toLocaleString('id-ID')}</td>
      <td>${e.percent}%</td>
      <td>${e.date.toLocaleDateString("id-ID")}</td>
    `;
    savingsList.append(tr);

    const progress = e.target ? ((e.saved / e.target) * 100).toFixed(1) : 0;
    const pr = document.createElement("tr");
    pr.innerHTML = `
      <td colspan="6">
        <div class="progress-bar-container">
          <strong>Progress:</strong>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%;"></div>
          </div>
          <p>Rp ${e.saved.toLocaleString('id-ID')} / Rp ${e.target.toLocaleString('id-ID')}</p>
        </div>
      </td>
    `;
    savingsList.append(pr);
  });
}

export function renderSummary(transactions) {
  const incomeTable  = document.getElementById("income-summary");
  const expenseTable = document.getElementById("expense-percentage");

  const incByMonth = {}, expByCat = {};
  transactions.forEach(t => {
    const m = t.date.toLocaleString("default",{month:"long"});
    if (t.type==="income") incByMonth[m] = (incByMonth[m]||0) + t.amount;
    else expByCat[t.category] = (expByCat[t.category]||0) + t.amount;
  });

  let totInc = 0;
  incomeTable.innerHTML = "<tr><th>Month</th><th>Amount</th></tr>";
  Object.entries(incByMonth).forEach(([m,a]) => {
    totInc += a;
    incomeTable.innerHTML += `<tr><td>${m}</td><td>Rp ${a.toLocaleString('id-ID')}</td></tr>`;
  });
  incomeTable.innerHTML += `<tr class="total-row"><td><strong>Total</strong></td><td><strong>Rp ${totInc.toLocaleString('id-ID')}</strong></td></tr>`;

  const totExp = Object.values(expByCat).reduce((a,b)=>a+b,0);
  expenseTable.innerHTML = "<tr><th>Category</th><th>Percentage</th></tr>";
  Object.entries(expByCat).forEach(([c,a]) => {
    const p = totExp ? ((a/totExp)*100).toFixed(1) : 0;
    expenseTable.innerHTML += `<tr><td>${c}</td><td>${p}%</td></tr>`;
  });
  expenseTable.innerHTML += `<tr class="total-row"><td><strong>Total</strong></td><td><strong>100%</strong></td></tr>`;
}

export function renderCharts(transactions, incomeCtx, expenseCtx) {
  if (!incomeCtx || !expenseCtx) return;

  const incByMonth = {}, expByCat = {};
  transactions.forEach(t => {
    const m = t.date.toLocaleString("default",{month:"long"});
    if (t.type==="income") incByMonth[m] = (incByMonth[m]||0) + t.amount;
    else expByCat[t.category] = (expByCat[t.category]||0) + t.amount;
  });

  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(incomeCtx, {
    type: 'pie',
    data: { labels: Object.keys(incByMonth), datasets: [{ data: Object.values(incByMonth) }] }
  });

  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(expenseCtx, {
    type: 'pie',
    data: { labels: Object.keys(expByCat), datasets: [{ data: Object.values(expByCat) }] }
  });
}
