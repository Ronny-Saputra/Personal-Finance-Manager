import {
    auth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail
  } from '../src/firebaseAuth.js';
  
  /**
   * Opens the notification dialog with a given message.
   * Guards against missing dialog or missing showModal support.
   */
  export function showPopup(msg) {
    const notifyDialog  = document.getElementById('notify-dialog');
    const notifyMessage = document.getElementById('notify-message');
    if (!notifyDialog || !notifyMessage) return;
  
    notifyMessage.textContent = msg;
    if (typeof notifyDialog.showModal === 'function') {
      notifyDialog.showModal();
    }
  }
  
  /**
   * Handles email & password login with validation and feedback.
   */
  export async function login() {
    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const form          = document.getElementById('loginForm');
    const submitBtn     = document.getElementById('submitButton');
  
    const email    = emailInput.value;
    const password = passwordInput.value;
  
    if (!email || !password) {
      showPopup("Email dan password harus diisi!");
      return;
    }
  
    submitBtn.disabled    = true;
    submitBtn.textContent = "Loading...";
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showPopup("Login berhasil!");
  
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('dashboard.html');
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        showPopup("Password salah!");
        passwordInput.style.borderColor = "red";
  
        if (!document.getElementById('shakeStyle')) {
          const style = document.createElement('style');
          style.id = 'shakeStyle';
          style.innerHTML = `
            @keyframes shake {
              0%,100% { transform: translateX(0); }
              25%     { transform: translateX(-10px); }
              75%     { transform: translateX(10px); }
            }
            .shake { animation: shake 0.5s; }
          `;
          document.head.appendChild(style);
        }
  
        form.classList.add("shake");
        setTimeout(() => form.classList.remove("shake"), 500);
      } else if (error.code === "auth/user-not-found") {
        showPopup("User tidak ditemukan! Silakan daftar terlebih dahulu.");
      } else {
        showPopup("Login gagal! " + error.message);
      }
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Submit";
    }
  }
  
  /**
   * Handles Google login via popup.
   */
  export async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result   = await signInWithPopup(auth, provider);
      showPopup("Login Berhasil! Selamat datang, " + result.user.displayName);
      if (window.location && typeof window.location.replace === 'function') {
        window.location.replace('dashboard.html');
      }
    } catch (error) {
      showPopup("Login gagal! " + error.message);
    }
  }
  
  /**
   * Sends a password reset email.
   */
  export async function forgotPassword() {
    const email = prompt("Masukkan email kamu:");
    if (!email) return;
  
    try {
      await sendPasswordResetEmail(auth, email);
      showPopup("Link reset password sudah dikirim ke email kamu!");
    } catch (error) {
      showPopup("Gagal mengirim link reset password: " + error.message);
    }
  }
  
  /**
   * Redirects user to the sign-up page.
   */
  export function goToSignUp() {
    if (window.location) {
      window.location.href = 'signup.html';
    }
  }
  
  // Expose functions to global scope for inline HTML onclick compatibility
window.login = login;
window.forgotPassword = forgotPassword;
window.signInWithGoogle = signInWithGoogle;
window.goToSignUp = goToSignUp;
window.addEventListener("DOMContentLoaded", () => {
  const notifyOkButton = document.getElementById("notify-ok");
  const notifyDialog = document.getElementById("notify-dialog");

  if (notifyOkButton && notifyDialog) {
    notifyOkButton.addEventListener("click", () => {
      notifyDialog.close();
    });
  }
});
