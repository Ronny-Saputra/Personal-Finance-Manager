import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Firebase config & init
const firebaseConfig = {
  apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
  authDomain: "nextgrowthgroup.firebaseapp.com",
  projectId: "nextgrowthgroup",
  storageBucket: "nextgrowthgroup.firebasestorage.app",
  messagingSenderId: "658734405364",
  appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
  measurementId: "G-Y5DB2XL0TH"
};
initializeApp(firebaseConfig);
const auth = getAuth();
const db   = getFirestore();

// DOM refs
const incomeCtx  = document.getElementById("incomeChart").getContext("2d");
const expenseCtx = document.getElementById("expenseChart").getContext("2d");
const incomeTable = document.getElementById("income-summary");
const expenseTable= document.getElementById("expense-percentage");
const savingsList = document.getElementById("savings-list");

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

  renderSavingsPlans(savings);
  renderSummary(transactions);
  renderCharts(transactions);
});

function renderSavingsPlans(savings) {
  // Table header
  savingsList.innerHTML = `
    <tr><th>Month</th><th>Target</th><th>Income</th><th>Saved</th><th>%</th><th>Date</th></tr>
  `;
  savings.forEach(e => {
    // Data row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.month}</td>
      <td>Rp ${e.target.toLocaleString()}</td>
      <td>Rp ${e.income.toLocaleString()}</td>
      <td>Rp ${e.saved.toLocaleString()}</td>
      <td>${e.percent}%</td>
      <td>${e.date.toLocaleDateString("id-ID")}</td>
    `;
    savingsList.append(tr);

    // Progress row
    const progress = e.target
      ? ((e.saved / e.target) * 100).toFixed(1)
      : 0;
    const pr = document.createElement("tr");
    pr.innerHTML = `
      <td colspan="6">
        <div class="progress-bar-container">
          <strong>Progress:</strong>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progress}%;"></div>
          </div>
          <p>Rp ${e.saved.toLocaleString()} / Rp ${e.target.toLocaleString()}</p>
        </div>
      </td>
    `;
    savingsList.append(pr);
  });
}

function renderSummary(transactions) {
  const incByMonth = {}, expByCat = {};
  transactions.forEach(t => {
    const m = t.date.toLocaleString("default",{month:"long"});
    if (t.type === "income") incByMonth[m] = (incByMonth[m]||0) + t.amount;
    else expByCat[t.category] = (expByCat[t.category]||0) + t.amount;
  });

  // Income summary table
  let totInc = 0;
  incomeTable.innerHTML = "<tr><th>Month</th><th>Amount</th></tr>";
  for (let [m,a] of Object.entries(incByMonth)) {
    totInc += a;
    incomeTable.innerHTML += `<tr><td>${m}</td><td>Rp ${a.toLocaleString()}</td></tr>`;
  }
  incomeTable.innerHTML += `
    <tr class="total-row">
      <td><strong>Total</strong></td>
      <td><strong>Rp ${totInc.toLocaleString()}</strong></td>
    </tr>`;

  // Expense percentage table
  const totExp = Object.values(expByCat).reduce((a,b)=>a+b,0);
  expenseTable.innerHTML = "<tr><th>Category</th><th>Percentage</th></tr>";
  for (let [c,a] of Object.entries(expByCat)) {
    const p = totExp ? ((a/totExp)*100).toFixed(1) : 0;
    expenseTable.innerHTML += `<tr><td>${c}</td><td>${p}%</td></tr>`;
  }
  expenseTable.innerHTML += `
    <tr class="total-row">
      <td><strong>Total</strong></td>
      <td><strong>100%</strong></td>
    </tr>`;
}

function renderCharts(transactions) {
  const incByMonth = {}, expByCat = {};
  transactions.forEach(t => {
    const m = t.date.toLocaleString("default",{month:"long"});
    if (t.type==="income") incByMonth[m] = (incByMonth[m]||0) + t.amount;
    else expByCat[t.category] = (expByCat[t.category]||0) + t.amount;
  });

  // Income pie
  if (incomeChart) incomeChart.destroy();
  incomeChart = new Chart(incomeCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(incByMonth),
      datasets: [{ data: Object.values(incByMonth) }]
    }
  });

  // Expense pie
  if (expenseChart) expenseChart.destroy();
  expenseChart = new Chart(expenseCtx, {
    type: 'pie',
    data: {
      labels: Object.keys(expByCat),
      datasets: [{ data: Object.values(expByCat) }]
    }
  });
}
