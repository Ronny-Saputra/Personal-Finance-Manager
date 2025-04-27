 // Import Firebase SDK
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
 import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

 // Firebase Config
 const firebaseConfig = {
     apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
     authDomain: "nextgrowthgroup.firebaseapp.com",
     databaseURL: "https://nextgrowthgroup-default-rtdb.firebaseio.com",
     projectId: "nextgrowthgroup",
     storageBucket: "nextgrowthgroup.firebasestorage.app",
     messagingSenderId: "658734405364",
     appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
     measurementId: "G-Y5DB2XL0TH"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const provider = new GoogleAuthProvider();

 // Google Login Function
 window.signInWithGoogle = async () => {
     try {
         const result = await signInWithPopup(auth, provider);
         console.log("User berhasil login:", result.user);
         alert("Login Berhasil! Selamat datang, " + result.user.displayName);

         // Redirect ke dashboard.html
         window.location.replace('dashboard.html');
     } catch (error) {
         console.error("Error saat login:", error);
         alert("Login gagal! " + error.message);
     }
 };

 // Email & Password Login with Validation
 window.login = async () => {
     const email = document.getElementById('email').value;
     const password = document.getElementById('password').value;
     const loginForm = document.getElementById('loginForm');
     const submitButton = document.getElementById('submitButton');

     // Validasi input
     if (!email || !password) {
         alert("Email dan password harus diisi!");
         return;
     }

     // Loading indicator
     submitButton.disabled = true;
     submitButton.textContent = "Loading...";

     try {
         await signInWithEmailAndPassword(auth, email, password);
         alert("Login berhasil!");

         // Redirect ke dashboard.html
         window.location.replace('dashboard.html');
     } catch (error) {
         if (error.code === "auth/wrong-password") {
             alert("Password salah!");

             // Feedback visual: Ubah warna input jadi merah
             const passwordInput = document.getElementById('password');
             passwordInput.style.borderColor = "red";

             // Feedback visual: Tambah efek getaran (inline CSS)
             if (!document.getElementById('shakeStyle')) {
                 const style = document.createElement('style');
                 style.id = 'shakeStyle';
                 style.innerHTML = `
                     @keyframes shake {
                         0%, 100% { transform: translateX(0); }
                         25% { transform: translateX(-10px); }
                         75% { transform: translateX(10px); }
                     }
                     .shake {
                         animation: shake 0.5s;
                     }
                 `;
                 document.head.appendChild(style);
             }
             loginForm.classList.add("shake");
             setTimeout(() => loginForm.classList.remove("shake"), 500);
         } else if (error.code === "auth/user-not-found") {
             alert("User tidak ditemukan! Silakan daftar terlebih dahulu.");
         } else {
             alert("Login gagal! " + error.message);
         }
     } finally {
         // Kembalikan tombol ke state awal
         submitButton.disabled = false;
         submitButton.textContent = "Submit";
     }
 };

 // Forgot Password Function
 window.forgotPassword = async () => {
     const email = prompt("Masukkan email kamu:");
     if (email) {
         try {
             await sendPasswordResetEmail(auth, email);
             alert("Link reset password sudah dikirim ke email kamu!");
         } catch (error) {
             console.error("Gagal mengirim link reset password:", error.message);
             alert("Gagal mengirim link reset password: " + error.message);
         }
     }
 };

 // Redirect to Sign-Up Page
 window.goToSignUp = () => {
     window.location.href = 'signup.html';
 };