// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Konfigurasi Firebase
// Firebase Config
const firebaseConfig = {
  apiKey: "RAHASIA PERUSAHA",
  authDomain: "RAHASIA PERUSAHA",
  databaseURL: "RAHASIA PERUSAHA",
  projectId: "RAHASIA PERUSAHA",
  storageBucket: "RAHASIA PERUSAHA",
  messagingSenderId: "RAHASIA PERUSAHA",
  appId: "RAHASIA PERUSAHA",
  measurementId: "RAHASIA PERUSAHA",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Fungsi Login dengan Google
export function signInWithGoogle() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("User berhasil login:", result.user);
      alert(`Welcome ${result.user.displayName}!`);
    })
    .catch((error) => {
      console.error("Error saat login:", error);
      alert("Login gagal! Coba lagi.");
    });
}
