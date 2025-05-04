// __mocks__/firebase-auth.js
export function getAuth() { return {}; }
export function signInWithEmailAndPassword() { return Promise.resolve(); }
export function createUserWithEmailAndPassword() { return Promise.resolve({user:{}}); }
export function GoogleAuthProvider() { return class {}; }
export function signInWithPopup() { return Promise.resolve({user:{displayName:'Test'}}); }
export function sendPasswordResetEmail() { return Promise.resolve(); }
export function confirmPasswordReset() { return Promise.resolve(); }
export function updateProfile() { return Promise.resolve(); }
export function onAuthStateChanged(auth, cb) { /* no-op */ }
