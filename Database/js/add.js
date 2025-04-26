// 1. Import Firebase SDK modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore, collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// 2. Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
  authDomain: "nextgrowthgroup.firebaseapp.com",
  projectId: "nextgrowthgroup",
  storageBucket: "nextgrowthgroup.firebasestorage.app",
  messagingSenderId: "658734405364",
  appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
  measurementId: "G-Y5DB2XL0TH"
};

// 3. Initialize Firebase
const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// 4. Track signed-in user
let currentUser = null;
onAuthStateChanged(auth, user => {
  if (!user) {
    // redirect if not signed in
    window.location.href = 'login.html';
  } else {
    currentUser = user;
    document.querySelector('.welcome-message').textContent =
      `Welcome, ${user.displayName || user.email}`;
  }
});

// 5. Page state
let entryType     = null;  // 'income' or 'expense'
let entryCategory = null;  // for expenses

// 6. selectType → highlight & enable/disable categories
window.selectType = (type) => {
  entryType = type;
  document.querySelectorAll('.toggle-btn')
          .forEach(b => b.classList.remove('selected'));
  document.querySelector(`.toggle-btn.${type}`)
          .classList.add('selected');

  document.querySelectorAll('.category-grid button')
    .forEach(btn => {
      if (type === 'income') {
        btn.disabled = true;
        btn.classList.remove('selected');
        btn.style.opacity = 0.5;
        btn.style.cursor = 'not-allowed';
      } else {
        btn.disabled = false;
        btn.style.opacity = 1;
        btn.style.cursor = 'pointer';
      }
    });

  if (type === 'income') {
    entryCategory = null;
  }
};

// 7. selectCategory → only works for expenses
window.selectCategory = (btn) => {
  if (entryType !== 'expense') return;
  document.querySelectorAll('.category-grid button')
          .forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  entryCategory = btn.textContent.trim();
};

// 8. submitForm → save to Firestore
window.submitForm = async () => {
  const amountEl = document.getElementById('amount');
  const dateEl   = document.getElementById('date');
  const timeEl   = document.getElementById('time');

  // --- Validation ---
  if (!currentUser)                      return alert('Please sign in first.');
  if (!entryType)                        return alert('Select Income or Expense.');
  if (entryType === 'expense' && !entryCategory)
                                         return alert('Select a category.');
  if (!amountEl.value)                   return alert('Enter an amount.');
  if (!dateEl.value || !timeEl.value)    return alert('Select date and time.');

  // --- Build timestamp ---
  const jsDate = new Date(`${dateEl.value}T${timeEl.value}:00`);
  const ts     = Timestamp.fromDate(jsDate);

  // --- Construct transaction object ---
  const newTransaction = {
    amount:      Number(amountEl.value),
    type:        entryType,
    category:    entryType === 'income' ? 'Income' : entryCategory,
    createdAt:   ts                  // for Firestore (Timestamp)
  };

  // 8. Save to Firestore
  try {
    const colRef = collection(db, 'Users Transactions', currentUser.uid, 'transactions');
    await addDoc(colRef, {
      amount:    newTransaction.amount,
      type:      newTransaction.type,
      category:  newTransaction.category,
      createdAt: newTransaction.createdAt
    });
    alert('Transaction saved to Firestore!');
  } catch (err) {
    console.error('Firestore write failed:', err);
    alert('Firestore error: ' + err.message);
  }

  // 9. Reset form & UI
  amountEl.value = '';
  dateEl.value   = '';
  timeEl.value   = '';
  entryType = entryCategory = null;
  document.querySelectorAll('.toggle-btn, .category-grid button')
          .forEach(el => el.classList.remove('selected'));
};

// 10. cancelForm → clear inputs
window.cancelForm = () => {
  document.getElementById('amount').value = '';
  document.getElementById('date').value   = '';
  document.getElementById('time').value   = '';
  entryType = entryCategory = null;
  document.querySelectorAll('.toggle-btn, .category-grid button')
          .forEach(el => el.classList.remove('selected'));
};
