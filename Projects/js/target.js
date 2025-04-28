import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// ——— Firebase init ———
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

// ——— Auth guard ———
let currentUser = null;
onAuthStateChanged(auth, user => {
  if (!user) return window.location.href = "login.html";
  currentUser = user;
  document.querySelector('.welcome-message').textContent =
    `Welcome, ${user.displayName || user.email}`;
});

// ——— DOM refs ———
const monthEl        = document.getElementById("month");
const incomeEl       = document.getElementById("income");
const percentageEl   = document.getElementById("percentage");
const resultEl       = document.getElementById("result");
const breakdownEl    = document.getElementById("breakdown");
const allocationEl   = document.getElementById("allocation");
const contributionEl = document.getElementById("contribution");
const historyEl      = document.getElementById("history");

// ——— Input formatting ———
[incomeEl, contributionEl].forEach(el =>
  el.addEventListener("input", e => {
    let raw = e.target.value.replace(/\D/g, "");
    e.target.value = raw ?
      raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".") :
      "";
  })
);

// ——— 1) Calculate ———
window.calculateSavings = () => {
  const inc = parseFloat(incomeEl.value.replace(/\./g,""));
  const pct = parseFloat(percentageEl.value);
  if (isNaN(inc)||inc<=0) { alert("Income invalid"); return null; }
  if (isNaN(pct)||pct<0||pct>100) { alert("Percentage invalid"); return null; }
  const goal = inc * (pct/100);
  resultEl.textContent    = `Savings Goal: Rp ${goal.toLocaleString("id-ID")}`;
  breakdownEl.textContent = `(${pct}% of Rp ${inc.toLocaleString("id-ID")})`;
  allocationEl.innerHTML  = `
    <div>Needs (50%): Rp ${(inc*0.5).toLocaleString("id-ID")}</div>
    <div>Wants (30%): Rp ${(inc*0.3).toLocaleString("id-ID")}</div>
    <div>Savings (${pct}%): Rp ${goal.toLocaleString("id-ID")}</div>
  `;
  return goal;
};

// helper: base path to collection
function targetsCol() {
  return collection(db, "Users Saving Target", currentUser.uid, "savingsTargets");
}

// ——— 2) Save: carry over previous contributions ———
window.saveSavings = async () => {
  if (!currentUser) return alert("Please sign in first.");
  const goal = calculateSavings();
  if (goal === null) return;

  const month = monthEl.value;
  const base  = targetsCol();

  try {
    // Fetch most recent entry for this month
    const qPrev = query(
      base,
      where("month", "==", month),
      orderBy("createdAt", "desc"),
      limit(1)
    );
    const snapsPrev = await getDocs(qPrev);
    let carryContrib = [];
    if (!snapsPrev.empty) {
      carryContrib = snapsPrev.docs[0].data().contributions || [];
    }

    // Add a new document, carrying over contributions
    await addDoc(base, {
      month,
      income:       parseFloat(incomeEl.value.replace(/\./g,"")),
      percentage:   parseFloat(percentageEl.value),
      targetAmount: goal,
      contributions: carryContrib.slice(), // copy array
      createdAt:    Timestamp.now()
    });
    const displayMonth = month.charAt(0).toUpperCase() + month.slice(1);
    alert(`Successfully Added Saving Target For ${displayMonth}`);
    incomeEl.value = "";
    showHistory();
  } catch (e) {
    console.error("Save failed:", e);
    alert("Save failed: " + e.message);
  }
};

// ——— 3) Add contribution only to latest doc for that month ———
window.addContribution = async () => {
  if (!currentUser) return alert("Please sign in first.");
  const val = parseFloat(contributionEl.value.replace(/\./g,""));
  if (isNaN(val)||val<=0) return alert("Contribution invalid.");

  const q = query(
    targetsCol(),
    where("month","==",monthEl.value),
    orderBy("createdAt","desc"),
    limit(1)
  );

  try {
    const snaps = await getDocs(q);
    if (snaps.empty) {
      return alert("No target found for this month. Save first.");
    }
    const docSnap = snaps.docs[0];
    const data    = docSnap.data();
    const contributions = data.contributions || [];
    contributions.push({ amount: val, at: Timestamp.now() });

    await updateDoc(doc(
      db,
      "Users Saving Target",
      currentUser.uid,
      "savingsTargets",
      docSnap.id
    ), { contributions });

    const monthName = monthEl.value;
    const displayMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    alert(`Successfully Added Contribution For ${displayMonth}`);
    contributionEl.value = "";
    showHistory();
  } catch (e) {
    console.error("Add contribution failed:", e);
    alert("Add failed: " + e.message);
  }
};

// ——— 4) Show history, correctly numbered ———
window.showHistory = async () => {
  if (!currentUser) return;
  historyEl.innerHTML = "";

  const q = query(targetsCol(), orderBy("createdAt","desc"));

  try {
    const snaps = await getDocs(q);
    if (snaps.empty) {
      historyEl.innerText = "No savings history found.";
      return;
    }

    const docs = snaps.docs;
    docs.forEach((docSnap, i) => {
      const d         = docSnap.data();
      const total     = (d.contributions||[])
                        .reduce((sum,c)=>sum+(c.amount||0),0);
      const dateStr   = d.createdAt.toDate().toLocaleDateString("id-ID");

      const div = document.createElement("div");
      div.style.marginBottom = "10px";
      div.innerHTML = `
        <strong>Log #${i+1}:</strong><br>
        Month: ${d.month} |
        Date: ${dateStr} |
        Income: Rp ${d.income.toLocaleString("id-ID")} |
        Percentage: ${d.percentage}% |
        Savings Goal: Rp ${d.targetAmount.toLocaleString("id-ID")} |
        Contributions: Rp ${total.toLocaleString("id-ID")}
      `;
      historyEl.appendChild(div);
    });
  } catch (e) {
    console.error("Load history failed:", e);
    historyEl.innerText = "Failed to load history.";
  }
};

// ——— 5) Clear history ———
window.clearHistory = async () => {
  if (!confirm("Clear all history?")) return;
  try {
    const snaps = await getDocs(targetsCol());
    await Promise.all(snaps.docs.map(d => deleteDoc(d.ref)));
    historyEl.innerHTML = "";
  } catch (e) {
    console.error("Clear failed:", e);
    alert("Clear failed: " + e.message);
  }
};

// Auto-load on startup if History tab is active
if (document.getElementById("history-tab").classList.contains("active")) {
  showHistory();
}
