import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// ——— Firebase init (your config) ———
const firebaseConfig = {
  apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
  authDomain: "nextgrowthgroup.firebaseapp.com",
  projectId: "nextgrowthgroup",
  storageBucket: "nextgrowthgroup.firebasestorage.app",
  messagingSenderId: "658734405364",
  appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
  measurementId: "G-Y5DB2XL0TH"
};
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Predefined categories and colors
const predefinedCategories = [
  "Food & Drinks",
  "Groceries",
  "Entertainment",
  "Living Expenses",
  "Payments",
  "Transportations"
];
const categoryColors = {
  "Food & Drinks": "#e74c3c",
  "Groceries": "#f1c40f",
  "Entertainment": "#3498db",
  "Living Expenses": "#9b59b6",
  "Payments": "#2ecc71",
  "Transportations": "#e67e22"
};

let transactions = [];
let chart = null;

onAuthStateChanged(auth, async user => {
  if (!user) return window.location.href = "login.html";
  document.querySelector('.welcome-message').textContent =
  `Welcome, ${user.displayName || user.email}`;

  // Fetch transactions from Firestore
  const snaps = await getDocs(
    query(
      collection(db, "Users Transactions", user.uid, "transactions"),
      orderBy("createdAt", "asc")
    )
  );
  transactions = snaps.docs.map(d => {
    const t = d.data();
    return {
      ...t,
      date: t.createdAt.toDate()
    };
  });

  // Now initialize your UI
  initReports();
});

function initReports() {
  const monthSelect = document.getElementById("month-select");
  const ctx = document.getElementById("monthlyExpenseChart").getContext("2d");
  const reportTable = document.getElementById("report-table").querySelector("tbody");
  const totalIncomeDisplay = document.getElementById("total-income-value");
  const cashflowDisplay = document.getElementById("cashflow-value");

  function render(month) {
    const monthData = { income: 0, expenses: {} };

    // Filter transactions by selected month
    transactions.forEach(t => {
      const m = t.date.toLocaleString("default", { month: "long" });
      if (m === month) {
        if (t.type === "income") monthData.income += t.amount;
        else {
          monthData.expenses[t.category] = (monthData.expenses[t.category] || 0) + t.amount;
        }
      }
    });

    // Chart Data
    const labels = Object.keys(monthData.expenses);
    const values = labels.map(cat => monthData.expenses[cat]);
    const backgroundColors = labels.map(cat => categoryColors[cat] || "#ccc");

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
      type: "bar",
      data: { labels, datasets: [{ label: month, data: values, backgroundColor: backgroundColors }]},
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          tooltip: {
            callbacks: { label: ctx => `Rp ${ctx.parsed.y.toLocaleString()}` }
          }
        },
        scales: {
          y: { ticks: { callback: v => `Rp ${v.toLocaleString()}` } }
        }
      }
    });

    // Table Data
    reportTable.innerHTML = "";
    let totalExpenses = 0;
    predefinedCategories.forEach(cat => {
      const spent = monthData.expenses[cat] || 0;
      totalExpenses += spent;
      reportTable.innerHTML += `
        <tr>
          <td>${cat}</td>
          <td>Rp ${spent.toLocaleString()}</td>
        </tr>`;
    });

    // Update totals
    totalIncomeDisplay.textContent = monthData.income.toLocaleString();
    cashflowDisplay.textContent    = (monthData.income - totalExpenses).toLocaleString();
  }

  // Initial load and listener
  render(monthSelect.value);
  monthSelect.addEventListener("change", () => render(monthSelect.value));
}
