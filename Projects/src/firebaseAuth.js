// src/firebaseAuth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword as _signInEmail,
  createUserWithEmailAndPassword as _createUser,
  GoogleAuthProvider as _GoogleProvider,
  signInWithPopup as _signInPopup,
  sendPasswordResetEmail as _sendResetEmail,
  confirmPasswordReset as _confirmReset,
  updateProfile as _updateProfile,
  onAuthStateChanged as _onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {
  getFirestore,
  doc as _doc,
  setDoc as _setDoc,
  collection as _collection,
  getDocs as _getDocs,
  query as _query,
  orderBy as _orderBy
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAU6CkWKfo2JuK6HW9dWNp_wafse0t4YUs",
  authDomain: "nextgrowthgroup.firebaseapp.com",
  projectId: "nextgrowthgroup",
  storageBucket: "nextgrowthgroup.firebasestorage.app",
  messagingSenderId: "658734405364",
  appId: "1:658734405364:web:2e11417e4465a53a90b0a1",
  measurementId: "G-Y5DB2XL0TH"
};

const app = initializeApp(firebaseConfig);

// Auth exports
export const auth = getAuth(app);
export const signInWithEmailAndPassword    = _signInEmail;
export const createUserWithEmailAndPassword = _createUser;
export const GoogleAuthProvider            = _GoogleProvider;
export const signInWithPopup               = _signInPopup;
export const sendPasswordResetEmail        = _sendResetEmail;
export const confirmPasswordReset          = _confirmReset;
export const updateProfile                 = _updateProfile;
export const onAuthStateChanged            = _onAuthStateChanged;

// Firestore exports
export const db          = getFirestore(app);
export const doc         = _doc;
export const setDoc      = _setDoc;
export const collection  = _collection;
export const getDocs     = _getDocs;
export const query       = _query;
export const orderBy     = _orderBy;
