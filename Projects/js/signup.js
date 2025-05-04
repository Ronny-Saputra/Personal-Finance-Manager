// js/signup.js
import {
    auth,
    db,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    doc,
    setDoc
  } from '../src/firebaseAuth.js';
  
  /** showPopup with guard against missing dialog & showModal */
  export function showPopup(msg) {
    const dlg = document.getElementById('notify-dialog');
    const msgEl = document.getElementById('notify-message');
    if (!dlg || !msgEl) return;
    msgEl.textContent = msg;
    if (typeof dlg.showModal === 'function') dlg.showModal();
  }
  
  /** Sign Up with Email & Password */
  export async function signUp() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const pwInput    = document.getElementById('password');
  
    const name  = nameInput.value.trim();
    const email = emailInput.value.trim();
    const pw    = pwInput.value;
  
    // Empty‐field check
    if (!name || !email || !pw) {
      showPopup("Please fill in all fields!");
      return;
    }
  
    // Simple email‐format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showPopup("Invalid email format!");
      return;
    }
  
    try {
      // Create user
      const { user } = await createUserWithEmailAndPassword(auth, email, pw);
  
      // Store profile in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        uid: user.uid,
        name,
        email
      });
  
      // Update displayName
      await updateProfile(user, { displayName: name });
  
      showPopup("Sign Up Successful! Welcome, " + name);
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('dashboard.html');
      }
    } catch (error) {
      // Firebase “email-already-in-use” code
      if (error.code === "auth/email-already-in-use") {
        showPopup("Email sudah terdaftar!");
      } else {
        showPopup("Sign Up Failed: " + error.message);
      }
    }
  }
  
  /** Google Sign‑Up */
  export async function signUpWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result   = await signInWithPopup(auth, provider);
      showPopup("Sign Up Successful! Welcome, " + result.user.displayName);
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('dashboard.html');
      }
    } catch (error) {
      showPopup("Google Sign Up Failed: " + error.message);
    }
  }
  
  /** Redirect to Login */
  export function goToLogin() {
    if (window.location) window.location.href = 'login.html';
  }
  
window.signUp = signUp;
window.signUpWithGoogle = signUpWithGoogle;
window.goToLogin = goToLogin;

window.addEventListener("DOMContentLoaded", () => {
  const notifyOkButton = document.getElementById("notify-ok");
  const notifyDialog = document.getElementById("notify-dialog");

  if (notifyOkButton && notifyDialog) {
    notifyOkButton.addEventListener("click", () => {
      notifyDialog.close();
    });
  }
});
