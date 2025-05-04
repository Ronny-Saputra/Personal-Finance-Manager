// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6I6Luc08ytl_JSOEchPPwdx5sNCs5z14",
  authDomain: "kelompok-ppl.firebaseapp.com",
  projectId: "kelompok-ppl",
  storageBucket: "kelompok-ppl.appspot.com",
  messagingSenderId: "289760692867",
  appId: "1:289760692867:web:4dac42e878f0c76e91a9b6",
  measurementId: "G-07E40KCDYH"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

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
