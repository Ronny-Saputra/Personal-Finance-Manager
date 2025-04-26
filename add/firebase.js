// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Konfigurasi Firebase
// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "RAHASIA PERUSAHAN",
  authDomain: "RAHASIA PERUSAHAN",
  projectId: "RAHASIA PERUSAHAN",
  storageBucket: "RAHASIA PERUSAHAN",
  messagingSenderId: "RAHASIA PERUSAHAN",
  appId: "RAHASIA PERUSAHAN",
  measurementId:"RAHASIA PERUSAHAN",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export yang kamu perluin
export { auth, provider, signInWithPopup, sendPasswordResetEmail };
