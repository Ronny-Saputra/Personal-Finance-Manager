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

let transactions = [];
const container = document.getElementById("transaction-data");

// Load and render after auth
onAuthStateChanged(auth, async user => {
  if (!user) return window.location.href = "login.html";
  document.querySelector('.welcome-message').textContent =
    `Welcome, ${user.displayName || user.email}`;

  // Fetch all transactions, ordered by date ascending
  const snaps = await getDocs(
    query(collection(db, "Users Transactions", user.uid, "transactions"), orderBy("createdAt", "asc"))
  );
  transactions = snaps.docs.map(d => {
    const t = d.data();
    return {
      ...t,
      dateObj: t.createdAt.toDate()
    };
  });

  initTransactions();
});

function initTransactions() {
  const grouped = {};

  transactions.forEach(t => {
    if (t.type !== "expense") return;
    const month = t.dateObj.toLocaleString("default", { month: "long" });
    const day   = t.dateObj.getDate();
    grouped[month] ??= {};
    grouped[month][day] ??= [];
    grouped[month][day].push(t);
  });

  const durationSelect  = document.getElementById("duration-select");
  const durationDisplay = document.getElementById("duration-display");

  function renderTransactions(monthFilter) {
    container.innerHTML = "";
    if (!grouped[monthFilter]) {
      container.innerHTML = `<div style="text-align:center;margin-top:20px;">
        No transactions for ${monthFilter}
      </div>`;
      return;
    }

    container.innerHTML += `<h3 style="font-size:20px;font-weight:bold;margin:20px 0 10px;">
      ${monthFilter}
    </h3>`;

    const days = grouped[monthFilter];
    const sortedDays = Object.keys(days).sort((a,b)=>a-b);

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
          margin: 20px 0 8px;
          display: flex;
          justify-content: space-between;
        ">
          <span>Day ${day}</span>
          <span>Total: Rp ${totalForDay.toLocaleString()}</span>
        </div>`;

      items.forEach(t => {
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
              <div style="font-size:13px;color:#777;">
                ${fullDate} – ${time}
              </div>
            </div>
          </div>`;
      });
    });
  }

  // Initial render
  renderTransactions(durationSelect.value);
  durationDisplay.textContent = durationSelect.value;

  durationSelect.addEventListener("change", () => {
    const m = durationSelect.value;
    durationDisplay.textContent = m;
    renderTransactions(m);
  });
}

// Clear helper (deletes all docs instead of localStorage)
window.clearTransactions = async () => {
  if (!confirm("Clear all transaction data?")) return;
  const user = auth.currentUser;
  if (!user) return;
  const col = collection(db, "Users Transactions", user.uid, "transactions");
  const snaps = await getDocs(col);
  await Promise.all(snaps.docs.map(d => deleteDoc(d.ref)));
  alert("All data cleared.");
  location.reload();
};
