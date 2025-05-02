import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// — Firebase init (your config) —
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

const notifyDialog    = document.getElementById('notify-dialog');
const notifyMessage   = document.getElementById('notify-message');
const notifyOkButton  = document.getElementById('notify-ok');

notifyOkButton.addEventListener('click', () => {
  notifyDialog.close();
});

function showPopup(msg) {
  notifyMessage.textContent = msg;
  notifyDialog.showModal();
}

let currentUser;

// Wait for auth, then fetch+render
onAuthStateChanged(auth, async user => {
  if (!user) return window.location.href = "login.html";
  document.querySelector('.welcome-message').textContent =
    `Welcome, ${user.displayName || user.email}`;
  currentUser = user;

  const txSnap = await getDocs(
    query(
      collection(db, "Users Transactions", user.uid, "transactions"),
      orderBy("createdAt", "asc")
    )
  );
  const transactions = txSnap.docs.map(d => {
    const t = d.data();
    return {
      ...t,
      date: t.createdAt.toDate()
    };
  });

  renderIncomePage(transactions);
});

function renderIncomePage(transactions) {
  // Aggregate
  const incomeByMonth = {};
  const expenseByCategory = {};
  let totalIncome = 0, totalExpense = 0;

  transactions.forEach(t => {
    const m = t.date.toLocaleString("default", { month: "long" });
    if (t.type === "income") {
      incomeByMonth[m] = (incomeByMonth[m] || 0) + t.amount;
      totalIncome += t.amount;
    } else {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
      totalExpense += t.amount;
    }
  });

  // Tables
  const incMonthBody = document
    .getElementById("income-month-table")
    .querySelector("tbody");
  const incAmtBody = document
    .getElementById("income-amount-table")
    .querySelector("tbody");

  // Clear existing (but keep the .total-row placeholder)
  incMonthBody.querySelectorAll("tr:not(.total-row)").forEach(r => r.remove());
  incAmtBody.querySelectorAll("tr:not(.total-row)").forEach(r => r.remove());

  Object.entries(incomeByMonth).forEach(([month, amt]) => {
    const rowM = document.createElement("tr");
    rowM.innerHTML = `<td>${month}</td>`;
    incMonthBody.insertBefore(rowM, incMonthBody.querySelector(".total-row"));

    const rowA = document.createElement("tr");
    rowA.innerHTML = `<td>Rp ${amt.toLocaleString()}</td>`;
    incAmtBody.insertBefore(rowA, incAmtBody.querySelector(".total-row"));
  });

  // Update totals
  incAmtBody.querySelector(".total-row").innerHTML =
    `<td><strong>Rp ${totalIncome.toLocaleString()}</strong></td>`;

  // Expense tables
  const expCatBody = document
    .getElementById("expense-category-table")
    .querySelector("tbody");
  const expAmtBody = document
    .getElementById("expense-amount-table")
    .querySelector("tbody");

  expCatBody.querySelectorAll("tr:not(.total-row)").forEach(r => r.remove());
  expAmtBody.querySelectorAll("tr:not(.total-row)").forEach(r => r.remove());

  Object.entries(expenseByCategory).forEach(([cat, amt]) => {
    const rowC = document.createElement("tr");
    rowC.innerHTML = `<td>${cat}</td>`;
    expCatBody.insertBefore(rowC, expCatBody.querySelector(".total-row"));

    const rowE = document.createElement("tr");
    rowE.innerHTML = `<td>Rp ${amt.toLocaleString()}</td>`;
    expAmtBody.insertBefore(rowE, expAmtBody.querySelector(".total-row"));
  });

  expAmtBody.querySelector(".total-row").innerHTML =
    `<td><strong>Rp ${totalExpense.toLocaleString()}</strong></td>`;

  // Cash flow
  const cashFlowEl = document.querySelector(".cash-flow");
  if (cashFlowEl) {
    cashFlowEl.textContent = 
      `Cash Flow: Rp ${ (totalIncome - totalExpense).toLocaleString() }`;
  }
}

// Developer helper to clear transactions (Firestore)
window.clearTransactions = async () => {
  if (!confirm("Clear all transaction data?")) return;
  const snaps = await getDocs(collection(db, "Users Transactions", currentUser.uid, "transactions"));
  await Promise.all(snaps.docs.map(d => deleteDoc(d.ref)));
  showPopup("All data cleared.");
  location.reload();
};
